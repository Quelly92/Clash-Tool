import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculate,format,whole} from '../calculator.js';
const cases = [
  [[2,12,30,1,24],135000,'1d 13h 30m'],
  [[2,12,30,1,10],185400,'2d 3h 30m'],
  [[0,12,0,1,24],1800,'30m'],
  [[0,4,0,1,10],1440,'24m'],
  [[0,25,0,1,24],7200,'2h'],
  [[0,25,0,2,24],3750,'1h 2m 30s']
];
for (const [input,expected,label] of cases) test(`required: ${input} → ${label}`,() => {
  const result=calculate(...input); assert.equal(result.completion,expected); assert.equal(format(expected),label);
  assert.equal(result.saved,result.total-expected);
});
test('zero and blank durations / zero potions',() => {
  assert.deepEqual(calculate('','','',1,24),{total:0,completion:0,saved:0});
  assert.equal(format(0),'0s'); assert.equal(calculate(0,25,0,0,24).completion,90000);
});
test('expiration boundary and partial boost',() => {
  for (const rate of [10,24]) {
    assert.equal(calculate(0,rate,0,1,rate).completion,3600);
    assert.equal(calculate(0,rate,1,1,rate).completion,3660);
    assert.equal(calculate(0,0,1,1,rate).completion,60/rate);
  }
  assert.equal(format(calculate(0,0,1,1,24).completion),'2.5s');
  assert.equal(format(calculate(0,0,1,1,24).saved),'57.5s');
});
test('reject invalid / unsafe / above-limit inputs',() => {
  for(const bad of ['-1','1.5','abc','1e3','Infinity','NaN','1000001','999999999999999999999',NaN,Infinity]) assert.throws(()=>whole(bad));
  assert.throws(()=>calculate(0,1,0,1,48));
});
test('very large durations remain exact and finite',() => {
  const result=calculate(1000000,1000000,1000000,1000000,10);
  assert.equal(result.total,90060000000); assert.equal(result.completion,57660000000);
  assert.equal(result.saved,32400000000); assert.ok(!/NaN|Infinity/.test(format(result.completion)));
});
test('more potions extend duration, never multiply speed',() => {
  assert.equal(calculate(0,12,0,100,24).completion,1800);
  assert.equal(calculate(0,4,0,100,10).completion,1440);
  for (const rate of [10,24]) for (let minutes=0;minutes<5000;minutes+=17) for(let n=0;n<4;n++) {
    const r=calculate(0,0,minutes,n,rate);
    assert.ok(r.completion>=0 && r.completion<=r.total);
    assert.equal(r.completion+r.saved,r.total);
    assert.ok(r.saved<=(rate-1)*n*3600);
  }
});
