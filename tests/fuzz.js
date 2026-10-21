#!/usr/bin/env node
/* Fuzz test for every problem generator and every piece of TeX on the site.
   - runs each generator at each difficulty with many seeds
   - fails on NaN, undefined, [object, empty prompts or answers
   - checks that the stored answer passes its own checker (and that a wrong answer fails)
   - if a problem has `verify`, checks the answer independently:
       verify:{deriv:"f(x) in ascii", v:"x"}      answer must equal the numeric derivative of f
       verify:{antideriv:"integrand", v:"x"}      derivative of answer must equal the integrand
       verify:{value:number}                      numeric answer must equal value
   - renders every $...$ with KaTeX (throwOnError) to catch broken TeX
   Usage: node tests/fuzz.js [seedsPerDifficulty=150] [Lxx]   (needs: npm i katex@0.16.9 in /home/claude/work or NODE_PATH) */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(__dirname,"..");
let katex; try{ katex=require("katex"); }catch(e){ try{ katex=require("/home/claude/work/node_modules/katex"); }catch(e2){ console.log("katex not installed; skipping TeX checks"); } }
const N=+process.argv[2]||150, ONLY=(process.argv[3]&&!process.argv[3].startsWith("--"))?process.argv[3]:null;
const ctx={console,Math,Date,JSON}; ctx.window=ctx; ctx.globalThis=ctx; vm.createContext(ctx);
const load=f=>vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8").replace(/M\.theme\(\);/,""),ctx,{filename:f});
load("assets/js/core.js"); load("assets/js/mathcheck.js");
/* --lec L07 tests one lecture file straight from data/ without a full build (handy when other files are mid-edit) */
const li=process.argv.indexOf("--lec");
if(li>0){ load("data/course.js"); process.argv[li+1].split(",").forEach(id=>load(`data/${id}.js`)); } else { load("assets/js/studydata.js"); load("assets/js/longanswer.js"); }
const M=ctx.M127, MC=ctx.MC;
const fails=[]; let nProb=0, nTex=0;
const F2=(w,m)=>F(w,m);
const F=(w,m)=>{ if(fails.length<400) fails.push(`${w}: ${m}`); };
function texCheck(s,w){
  if(!katex||s==null) return; s=String(s);
  let i=0;
  while(i<s.length){
    if(s[i]==="\\"&&s[i+1]==="$"){ i+=2; continue; }
    if(s[i]==="$"){ const d=s[i+1]==="$", o=d?2:1; const c=s.indexOf(d?"$$":"$",i+o); if(c<0){ F(w,`unclosed $ in: ${s.slice(i,i+60)}`); return; }
      const t=s.slice(i+o,c); nTex++; try{ katex.renderToString(t,{displayMode:d,throwOnError:true,strict:"ignore"}); }catch(e){ F(w,`TeX error "${e.message.slice(0,90)}" in $${t.slice(0,80)}$`); } i=c+o; continue; }
    i++;
  }
}
function bad(s){ return /undefined|NaN|\[object|Infinity|function\s*\(/.test(String(s)); }
function numDeriv(ast,v,x,env={}){ const h=1e-5*Math.max(1,Math.abs(x)); const e1={...env,[v]:x+h}, e2={...env,[v]:x-h}; return (MC.evaluate(ast,e1)-MC.evaluate(ast,e2))/(2*h); }
let nVer=0;
function verify(p,w){ nVer++;
  if(p.implicitF && !p.verify){ // y' must equal -F_x/F_y at random (x, y)
    const part=p.parts.find(x=>(x.answer.type||"expr")==="expr"); if(!part) return;
    const F=MC.parse(String(p.implicitF).replace(/=\s*0\s*$/,"")), A=MC.parse(String(part.answer.answer).replace(/^\s*(y'|dy\/dx)\s*=\s*/,""));
    let ok=0;
    for(let k=0;k<40&&ok<6;k++){ const x=0.3+1.7*Math.random(), y=0.3+1.7*Math.random(); let fx,fy,a; try{ fx=numDeriv(F,"x",x,{y}); fy=numDeriv(F,"y",y,{x}); a=MC.evaluate(A,{x,y}); }catch(e){ continue; }
      if(!isFinite(fx)||!isFinite(fy)||!isFinite(a)||Math.abs(fy)<1e-6) continue; ok++; const b=-fx/fy;
      if(Math.abs(a-b)>1e-4*Math.max(1,Math.abs(b))){ F2(w,`implicit verify failed at (${x.toFixed(2)},${y.toFixed(2)}): answer ${a}, -Fx/Fy ${b}`); return; } }
    return; }
  const V=p.verify; if(!V) return;
  const part=p.parts[0].answer; const v=V.v||"x";
  const dom=Array.isArray(part.domain)?part.domain:[-2,2];
  const ans=MC.parse(String(part.answer).replace(/^\s*[a-zA-Z]\s*(\(\s*[a-z]\s*\))?\s*=\s*/,""));
  if(V.value!=null){ const got=MC.evaluate(MC.parse(String(part.answer)),{}); if(Math.abs(got-V.value)>1e-6*Math.max(1,Math.abs(V.value))) F(w,`answer ${got} != verify.value ${V.value}`); return; }
  const tgt=MC.parse(V.deriv||V.antideriv||V.expr); let checked=0;
  for(let k=0;k<12;k++){
    const x=dom[0]+(dom[1]-dom[0])*(0.1+0.8*k/11);
    const env={C:0.7}; let a,b;
    try{
      if(V.deriv){ a=MC.evaluate(ans,{...env,[v]:x}); b=numDeriv(tgt,v,x,env); }
      else if(V.antideriv){ a=numDeriv(ans,v,x,env); b=MC.evaluate(tgt,{...env,[v]:x}); }
      else { a=MC.evaluate(ans,{...env,[v]:x}); b=MC.evaluate(tgt,{...env,[v]:x}); }
    }catch(e){ F(w,"verify eval error "+e.message); return; }
    if(!isFinite(a)||!isFinite(b)) continue; checked++;
    if(Math.abs(a-b)>1e-4*Math.max(1,Math.abs(b))){ F(w,`verify failed at ${v}=${x.toFixed(3)}: answer gives ${a}, expected ${b}. answer="${part.answer}" verify=${JSON.stringify(V)}`); return; }
  }
  if(checked<4) F(w,"verify: too few finite points");
}
for(const L of M.lectures){
  if(ONLY && L.id!==ONLY) continue;
  const w0=L.id;
  // static TeX
  (L.formulas||[]).forEach(f=>{ texCheck("$"+f.tex+"$",`${f.id} tex`); texCheck(f.name,`${f.id} name`); texCheck(f.note,`${f.id} note`); if(f.blank){ texCheck("$"+f.blank.tex+"$",`${f.id} blank`); if(!f.blank.text){ const r=MC.check(f.blank.answer,f.blank); if(!r.ok) F(f.id,`blank answer fails its own check: ${JSON.stringify(r)}`); } } });
  (L.glossary||[]).forEach(g=>{ texCheck(g.term,g.id); texCheck(g.def,g.id); });
  (L.exam||[]).forEach(q=>{ texCheck(q.q,q.id); q.opts.forEach(o=>{ texCheck(o[0],q.id); texCheck(o[2],q.id); }); });
  (L.steps||[]).forEach((s,i)=>{ const w=`${w0} step ${i+1}`; texCheck(s.title,w); texCheck(s.body,w); texCheck(s.q,w); texCheck(s.after,w); (s.opts||[]).forEach(o=>{ texCheck(o[0],w); texCheck(o[2],w); }); if(s.ex){ texCheck(s.ex.q,w); texCheck(s.ex.ans,w); s.ex.steps.forEach(t=>{ texCheck(typeof t==="string"?t:t.t,w); texCheck(t.why,w); }); } });
  Object.values(L.figures||{}).forEach(f=>texCheck(f.cap,`${w0} fig`));
  (L.flags||[]).forEach(f=>texCheck(f.text,`${w0} flag`));
  texCheck(L.title,w0); texCheck(L.summary,w0);
  // generators
  for(const g of (L.gens||[])){
    for(const d of [1,2,3]){
      const seen=new Set();
      for(let s=1;s<=N;s++){
        const seed=s*7919+d*104729; const w=`${g.id} d${d} seed ${seed}`;
        let p; try{ p=g.gen(M.rng(seed),d); }catch(e){ F(w,"threw "+e.message); continue; }
        nProb++;
        if(p.answer && !p.parts) p.parts=[{answer:p.answer}];
        if(!p.prompt) F(w,"empty prompt");
        if(!p.parts||!p.parts.length) { F(w,"no answer"); continue; }
        const all=[p.prompt,p.hint,p.answerTeX,...(p.steps||[]),...p.parts.map(x=>x.label||"")].join(" ");
        if(bad(all)) F(w,`bad text: ${all.match(/.{0,40}(undefined|NaN|\[object|Infinity|function\s*\().{0,40}/)[0]}`);
        if(!p.steps||!p.steps.length) F(w,"no solution steps");
        if(!p.hint) F(w,"no hint");
        texCheck(p.prompt,w); texCheck(p.hint,w); texCheck(p.answerTeX,w); (p.steps||[]).forEach(t=>texCheck(t,w)); p.parts.forEach(x=>texCheck(x.label,w));
        seen.add(p.prompt);
        p.parts.forEach((part,pi)=>{ const a=part.answer; const t=a.type||"expr";
          if(t==="mc"){ if(!Array.isArray(a.options)||a.options.length<2) F(w,"mc needs options"); else { if(!(a.correct>=0&&a.correct<a.options.length)) F(w,"mc correct index out of range"); if(new Set(a.options).size!==a.options.length) F(w,`duplicate mc options: ${a.options.join(" | ")}`); a.options.forEach(o=>{ texCheck(o,w); if(bad(o)) F(w,"bad option text "+o); }); } return; }
          if(a.answer==null||bad(a.answer)) { F(w,`part ${pi} bad answer "${a.answer}"`); return; }
          const r=MC.check(String(a.answer),a);
          if(!r.ok) F(w,`part ${pi} stored answer fails its own check: "${a.answer}" -> ${JSON.stringify(r)}`);
          if(t==="expr"||t==="num"){ const wrong=t==="num"?`(${a.answer})+1`:`(${a.answer})+x^2+1`; const r2=MC.check(wrong,{...a,vars:a.vars}); if(r2.ok) F(w,`part ${pi}: a wrong answer was accepted ("${wrong}")`); }
          if(t==="num"){ try{ const v=MC.evaluate(MC.parse(String(a.answer)),{}); if(!isFinite(v)) F(w,"num answer not finite"); }catch(e){ F(w,"num answer unparseable "+a.answer); } }
        });
        if(p.verify||p.implicitF) verify(p,w);
      }
      if(seen.size<Math.min(5,N/10)) F(`${g.id} d${d}`,`only ${seen.size} distinct problems in ${N} seeds`);
    }
  }
}
(M.extras.review||[]).forEach(r=>{ texCheck(r.q,r.id); texCheck(r.a,r.id); (r.opts||[]).forEach(o=>texCheck(o[0],r.id)); (r.steps||[]).forEach(t=>texCheck(t,r.id)); });
(M.extras.longAnswer||[]).forEach(r=>{ texCheck(r.q,r.id); (r.sol||[]).forEach(t=>texCheck(t,r.id)); texCheck(r.ans,r.id); });
if(fails.length){ console.log(`✗ ${fails.length} problem${fails.length>1?"s":""} (${nProb} problems generated, ${nTex} TeX snippets rendered):`); fails.slice(0,80).forEach(f=>console.log("  ✗ "+f)); process.exit(1); }
console.log(`✓ fuzz passed: ${nProb} problems generated, ${nVer} independently verified, ${nTex} TeX snippets rendered, no errors.`);
