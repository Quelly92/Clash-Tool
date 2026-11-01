import {calculate, format, whole, LIMIT} from './calculator.js';
const $ = id => document.getElementById(id);
const fields = ['days','hours','minutes','potions'].map($);
let mode = 'research';
try { if (localStorage.getItem('potion-mode') === 'builder') mode = 'builder'; } catch {}
let result;
function update() {
  $('feedback').textContent = '';
  let invalid = false;
  for (const field of fields) {
    try { whole(field.value); field.removeAttribute('aria-invalid'); }
    catch { field.setAttribute('aria-invalid','true'); invalid = true; }
  }
  $('error').textContent = invalid ? 'Use whole numbers from 0 to 1,000,000.' : '';
  $('copy').disabled = invalid;
  $('minus').disabled = invalid || whole($('potions').value) === 0;
  $('plus').disabled = invalid || whole($('potions').value) === LIMIT;
  if (invalid) { result = null; $('completion').textContent = '—'; $('saved').textContent = '—'; return; }
  result = calculate(...fields.map(f => f.value), mode === 'research' ? 24 : 10);
  $('completion').textContent = format(result.completion);
  $('saved').textContent = format(result.saved);
}
function select(next) {
  mode = next;
  for (const id of ['research','builder']) {
    $(id).setAttribute('aria-selected',String(id === mode));
    $(id).tabIndex = id === mode ? 0 : -1;
  }
  $('calculator').setAttribute('aria-labelledby',mode);
  $('mechanics').textContent = `${mode === 'research' ? 24 : 10}× speed · 1 hour per potion`;
  $('note').textContent = mode === 'builder' ? 'One continuously active builder. Boosts start now.' : 'One upgrade, with boosts starting now.';
  try { localStorage.setItem('potion-mode',mode); } catch {}
  update();
}
for (const id of ['research','builder']) {
  $(id).addEventListener('click',() => select(id));
  $(id).addEventListener('keydown',event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    select(event.key === 'Home' ? 'research' : event.key === 'End' ? 'builder' : mode === 'builder' ? 'research' : 'builder');
    $(mode).focus();
  });
}
fields.forEach(field => field.addEventListener('input',update));
for (const [id,delta] of [['minus',-1],['plus',1]]) $(id).addEventListener('click',() => {
  try { $('potions').value = Math.max(0,Math.min(LIMIT,whole($('potions').value)+delta)); update(); } catch {}
});
document.querySelector('form').addEventListener('submit',event => event.preventDefault());
document.querySelector('form').addEventListener('reset',event => {
  event.preventDefault();
  fields.forEach(field => { field.value = field.id === 'potions' ? '1' : ''; });
  update();
});
$('copy').addEventListener('click',async () => {
  if (!result) return;
  const text = `${mode === 'research' ? 'Research / Pet' : 'Builder'} · ${whole($('potions').value)} potion(s)\nFinished in ${format(result.completion)} from now\nTime saved: ${format(result.saved)}`;
  try { await navigator.clipboard.writeText(text); $('feedback').textContent = 'Copied'; }
  catch { $('feedback').textContent = 'Copy unavailable. Select the result to copy it.'; }
});
select(mode);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(() => {
    $('offline').textContent = 'Ready offline';
  }).catch(() => { $('offline').textContent = 'Offline setup unavailable. Reopen online to retry.'; });
} else $('offline').textContent = 'Offline use requires HTTPS and a supported browser.';
