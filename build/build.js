#!/usr/bin/env node
/* Build script for MATH 127 Interactive.
   1. Loads data/course.js, data/L*.js, data/review/*.js, data/longanswer/*.js, data/changelog.js
   2. Validates them: unique stable IDs, required fields, unit and quiz references, dates, steps that point at real figures and generators
   3. Writes assets/js/studydata.js: one file that every page loads (the data files concatenated, so generator functions survive)
   4. Writes unit-N.html and quiz-N.html from the templates in build/templates
   Usage: node build/build.js            (build)
          node build/build.js --check    (validate only) */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(__dirname,"..");
const D=p=>path.join(ROOT,p);
const checkOnly=process.argv.includes("--check");

function listJS(dir){ const p=D(dir); if(!fs.existsSync(p)) return []; return fs.readdirSync(p).filter(f=>f.endsWith(".js")&&!f.startsWith("_")).sort().map(f=>path.join(dir,f)); }
const oi=process.argv.indexOf("--only"); const ONLY=oi>0?process.argv[oi+1].split(","):null;
let files=[ "data/course.js", ...listJS("data").filter(f=>/\/L\d\d\.js$/.test(f)), ...listJS("data/review"), ...listJS("data/longanswer"), "data/changelog.js" ].filter(f=>fs.existsSync(D(f)));
if(ONLY) files=files.filter(f=>f==="data/course.js"||ONLY.some(id=>f.endsWith(`/${id}.js`)));

/* load everything into a sandbox that looks like a browser window */
const ctx={console}; ctx.window=ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(D("assets/js/core.js"),"utf8").replace(/M\.theme\(\);/,""),ctx,{filename:"core.js"});
const sources=[];
for(const f of files){ const src=fs.readFileSync(D(f),"utf8"); try{ vm.runInContext(src,ctx,{filename:f}); }catch(e){ console.error(`\n✗ ${f} failed to load:\n  ${e.message}`); process.exit(1); } sources.push([f,src]); }
const M=ctx.M127, C=M.COURSE;

/* ---------- validation ---------- */
const errors=[], warns=[];
const E=(m)=>errors.push(m), W=(m)=>warns.push(m);
const ids=new Map();
const claim=(id,where)=>{ if(!id||typeof id!=="string") return E(`${where}: missing id`); if(ids.has(id)) E(`Duplicate id "${id}" in ${where} (also in ${ids.get(id)})`); ids.set(id,where); };
const isDate=s=>/^\d{4}-\d\d-\d\d$/.test(s||"");
const unitIds=new Set(C.units.map(u=>u.id)), quizIds=new Set(C.quizzes.map(q=>q.id));
const sched=new Map(C.schedule.map(r=>[r[0],r]));
const lecIds=new Set();
M.lectures.sort((a,b)=>a.n-b.n);
for(const L of M.lectures){
  const w=`${L.id||"?"}`;
  claim(L.id,w); lecIds.add(L.id);
  if(!/^L\d\d$/.test(L.id)) E(`${w}: id must look like L07`);
  if(+L.id.slice(1)!==L.n) E(`${w}: n (${L.n}) does not match id`);
  ["title","date","added","unit","quiz","summary"].forEach(k=>{ if(!L[k]) E(`${w}: missing ${k}`); });
  if(!isDate(L.date)) E(`${w}: date must be YYYY-MM-DD`); if(!isDate(L.added)) E(`${w}: added must be YYYY-MM-DD`);
  if(!unitIds.has(L.unit)) E(`${w}: unknown unit ${L.unit}`);
  if(!quizIds.has(L.quiz)) E(`${w}: unknown quiz ${L.quiz}`);
  const u=C.units.find(x=>x.id===L.unit); if(u && !u.lectures.includes(L.id)) E(`${w}: unit ${L.unit} does not list ${L.id} in data/course.js`);
  const q=C.quizzes.find(x=>x.id===L.quiz); if(q && !q.lectures.includes(L.id)) E(`${w}: quiz ${L.quiz} does not list ${L.id} in data/course.js`);
  if(sched.get(L.id) && sched.get(L.id)[1]!==L.date) W(`${w}: date ${L.date} differs from the schedule (${sched.get(L.id)[1]})`);
  const pre=L.id+".";
  (L.formulas||[]).forEach(f=>{ claim(f.id,`${w} formula`); if(!f.id.startsWith(pre+"f.")) E(`${w}: formula id ${f.id} should start with ${pre}f.`); if(!f.tex||!f.name) E(`${w}: formula ${f.id} needs name and tex`); if(!f.ref) W(`${w}: formula ${f.id} has no page ref`); if(f.added&&!isDate(f.added)) E(`${w}: formula ${f.id} added date`); });
  (L.glossary||[]).forEach(g=>{ claim(g.id,`${w} glossary`); if(!g.term||!g.def) E(`${w}: glossary ${g.id} needs term and def`); });
  (L.gens||[]).forEach(g=>{ claim(g.id,`${w} generator`); if(!g.id.startsWith(pre+"g.")) E(`${w}: generator id ${g.id} should start with ${pre}g.`); if(typeof g.gen!=="function") E(`${w}: generator ${g.id} has no gen()`); if(!g.title) E(`${w}: generator ${g.id} needs a title`); });
  (L.exam||[]).forEach(x=>{ claim(x.id,`${w} exam`); if(!x.q||!Array.isArray(x.opts)||x.opts.length<2) E(`${w}: exam ${x.id} needs q and opts`); else if(!x.opts.some(o=>o[1])) E(`${w}: exam ${x.id} has no correct option`); else if(!x.multi && x.opts.filter(o=>o[1]).length>1) E(`${w}: exam ${x.id} has several correct options but is not multi`); });
  const figs=L.figures||{};
  Object.keys(figs).forEach(k=>{ if(typeof figs[k].build!=="function") E(`${w}: figure ${k} has no build()`); if(!figs[k].cap) W(`${w}: figure ${k} has no caption`); });
  if(!Object.keys(figs).length) E(`${w}: needs at least one interactive figure`);
  if(!(L.gens||[]).length) E(`${w}: needs at least one problem generator`);
  (L.steps||[]).forEach((s,i)=>{ const sw=`${w} step ${i+1}`;
    if(!["read","example","explore","mcq","try","formulas"].includes(s.type)) E(`${sw}: unknown type ${s.type}`);
    if(s.fig && !figs[s.fig]) E(`${sw}: figure "${s.fig}" not defined`);
    if(s.type==="explore" && !s.fig) E(`${sw}: explore steps need a fig`);
    if(s.type==="try" && !(L.gens||[]).some(g=>g.id===s.gen)) E(`${sw}: generator "${s.gen}" not in this lecture`);
    if(s.type==="mcq" && (!s.opts||!s.opts.some(o=>o[1]))) E(`${sw}: mcq needs a correct option`);
    if(s.type==="example" && (!s.ex||!s.ex.steps||!s.ex.steps.length)) E(`${sw}: example needs ex.steps`); });
  if(!(L.steps||[]).some(s=>s.type==="example")) W(`${w}: no worked example step`);
}
for(const u of C.units) for(const l of u.lectures) if(!lecIds.has(l) && !sched.has(l)) E(`unit ${u.id}: lecture ${l} is not in the schedule`);
(M.extras.review||[]).forEach(r=>{ claim(r.id,`review ${r.src||""}`); if(r.lec && !lecIds.has(r.lec)) W(`review ${r.id}: lecture ${r.lec} has no data file yet`); if(!r.q||!(r.a||r.opts)) E(`review ${r.id}: needs q and a`); });
(M.extras.longAnswer||[]).forEach(r=>{ claim(r.id,`long answer`); if(r.lec && !lecIds.has(r.lec)) W(`long answer ${r.id}: lecture ${r.lec} has no data file yet`); if(!r.q||!r.sol) E(`long answer ${r.id}: needs q and sol`); });

warns.forEach(w=>console.log("  ! "+w));
if(errors.length){ console.error(`\n✗ ${errors.length} problem${errors.length>1?"s":""} found:`); errors.forEach(e=>console.error("  ✗ "+e)); process.exit(1); }
const count=k=>M.lectures.reduce((n,L)=>n+(L[k]||[]).length,0);
console.log(`✓ ${M.lectures.length} lectures · ${count("formulas")} formulas · ${count("gens")} generators · ${count("exam")} exam questions · ${M.extras.review.length} review questions · ${M.extras.longAnswer.length} long-answer problems`);
if(checkOnly||ONLY) process.exit(0);

/* ---------- write studydata.js ---------- */
const stamp=new Date().toISOString();
let out=`/* GENERATED by build/build.js on ${stamp}. Do not edit: change the files in data/ and rebuild. */\n`;
out+=`window.M127=window.M127||{};M127.BUILT=${JSON.stringify(stamp)};\n`;
for(const [f,src] of sources) out+=`\n/* ===== ${f} ===== */\n${src}\n`;
fs.writeFileSync(D("assets/js/studydata.js"),out);
console.log(`✓ wrote assets/js/studydata.js (${(out.length/1024).toFixed(0)} KB)`);

/* ---------- pages from templates ---------- */
const tpl=n=>fs.readFileSync(D(`build/templates/${n}`),"utf8");
const unitT=tpl("unit.html");
C.units.forEach(u=>{ fs.writeFileSync(D(`unit-${u.n}.html`), unitT.replace(/\{\{UNIT\}\}/g,u.id).replace(/\{\{N\}\}/g,u.n).replace(/\{\{TITLE\}\}/g,u.title)); });
console.log(`✓ wrote ${C.units.length} unit pages`);
const quizT=tpl("quiz.html");
C.quizzes.filter(q=>!q.midterm && q.n>=2 && q.lectures.some(id=>lecIds.has(id))).forEach(q=>fs.writeFileSync(D(`quiz-${q.n}.html`), quizT.replace(/\{\{QUIZ\}\}/g,q.id).replace(/\{\{N\}\}/g,q.n)));
console.log(`✓ wrote quiz pages`);
