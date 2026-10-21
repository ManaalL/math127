/* MATH 127 Interactive: problem, question and example widgets used by every page.
   A generator returns {prompt, answer|parts, hint, steps, answerTeX}. Answers are checked by MC.check(). */
(function(){
"use strict";
const M=window.M127, el=M.el, rich=M.rich, esc=M.esc;
const E=window.ENGINE={};

const FORMAT_HELP={
  expr:"Type math like 3x^2 - 2x + 1, sin(2x), e^(3t), ln(x), sqrt(x), |x - 2|, arctan(x). Use * or a space for multiplying, ^ for powers.",
  num:"Type a number or an exact value like 3/4, pi/6, e^2 or sqrt(3).",
  interval:"Use intervals like (0, 4], (-inf, 2) U (3, inf), or inequalities like 0 < x <= 4.",
  list:"List every value, separated by commas, like 1, -3.",
};

/* ---------- a figure plate ---------- */
E.figure = function(host, fig, ctx={}){
  const f=el("figure",{class:"plate"});
  const body=el("div"); f.append(body);
  const cap=el("figcaption",{rich:fig.cap||""}); f.append(cap);
  host.append(f);
  try{ fig.build(body, {PLOT:window.PLOT, M, cap, ...ctx}); }catch(e){ console.error(e); body.append(el("p",{class:"muted"},"This figure failed to load.")); }
  return f;
};

/* ---------- step-through worked example ---------- */
E.example = function(host, ex){
  const box=el("div",{class:"wx"});
  box.append(el("div",{class:"kicker"},"Worked example"+(ex.ref?` · ${ex.ref}`:"")));
  box.append(el("div",{class:"q",rich:ex.q}));
  const ol=el("ol"); box.append(ol);
  const lis=ex.steps.map((s,i)=>{ const li=el("li",{class:i?"hidden":""}); li.innerHTML=rich(typeof s==="string"?s:s.t)+(s.why?`<span class="why">${rich(s.why)}</span>`:""); ol.append(li); return li; });
  let shown=1;
  const row=el("div",{class:"row",style:"margin-top:6px"});
  const nextB=el("button",{class:"btn sm",type:"button"},"Next step");
  const allB=el("button",{class:"btn ghost sm",type:"button"},"Show all steps");
  const upd=()=>{ lis.forEach((li,i)=>li.classList.toggle("hidden",i>=shown)); nextB.disabled=shown>=lis.length; nextB.textContent=shown>=lis.length?"Done":`Next step (${shown+1} of ${lis.length})`; if(shown>=lis.length && ex.ans) ansEl.hidden=false; };
  nextB.onclick=()=>{ shown=Math.min(lis.length,shown+1); upd(); };
  allB.onclick=()=>{ shown=lis.length; upd(); };
  row.append(nextB,allB); box.append(row);
  const ansEl=el("div",{class:"box",hidden:true,rich:ex.ans?`<b class="t">Answer</b>${ex.ans}`:""}); box.append(ansEl);
  host.append(box); upd();
  return box;
};

/* ---------- multiple choice (single or select-all) ----------
   q: {q, opts:[[text, correct, why]], multi, after, ref} */
E.mcq = function(host, q, onAnswer){
  const box=el("div");
  box.append(el("div",{class:"ex-q",rich:q.q}));
  const opts=el("div",{class:"opts"}); box.append(opts);
  const fb=el("div");
  const order=q.keep?q.opts.map((o,i)=>i):M.shuffle(q.opts.map((o,i)=>i));
  let done=false; const sel=new Set();
  order.forEach(i=>{ const o=q.opts[i]; const b=el("button",{class:"opt",type:"button",rich:o[0]});
    b.onclick=()=>{ if(done) return;
      if(q.multi){ if(sel.has(i)){ sel.delete(i); b.classList.remove("sel"); } else { sel.add(i); b.classList.add("sel"); } return; }
      finish(new Set([i])); };
    b.dataset.i=i; opts.append(b); });
  let sub=null;
  if(q.multi){ box.append(el("p",{class:"muted small"},"Select all that apply, then check.")); sub=el("button",{class:"btn sm",type:"button",onclick:()=>{ if(!done) finish(sel); }},"Check"); box.append(sub); }
  box.append(fb);
  function finish(chosen){
    done=true; if(sub) sub.disabled=true;
    const right=new Set(q.opts.map((o,i)=>o[1]?i:-1).filter(i=>i>=0));
    const ok = chosen.size===right.size && [...chosen].every(i=>right.has(i));
    M.$$(".opt",opts).forEach(b=>{ const i=+b.dataset.i; b.disabled=true; if(right.has(i)) b.classList.add("right"); else if(chosen.has(i)) b.classList.add("wrong"); });
    const why=[...chosen].map(i=>q.opts[i][2]).filter(Boolean);
    const rightWhy=q.opts.filter(o=>o[1]&&o[2]).map(o=>o[2]);
    fb.className="fb "+(ok?"ok":"bad");
    fb.innerHTML=`<b>${ok?"Right.":"Not quite."}</b>`+rich((ok?why:why.concat(rightWhy)).filter((v,i,a)=>a.indexOf(v)===i).join(" "))+(q.after?`<p style="margin:6px 0 0">${rich(q.after)}</p>`:"");
    onAnswer&&onAnswer(ok);
  }
  host.append(box);
  return box;
};

/* ---------- a generated problem ----------
   opts: {gid, seed, diff, compact, onResult(ok, first), showNew, context:"chapter"|"practice"|"gym"} */
E.make = function(gid, seed, diff){
  const g=M.gen(gid); if(!g) throw new Error("No generator "+gid);
  const R=M.rng(seed);
  const p=g.gen(R, diff||2);
  if(p.answer && !p.parts) p.parts=[{answer:p.answer}];
  return {g, p};
};
E.problem = function(host, opts){
  const gid=opts.gid; let seed=opts.seed!=null?opts.seed:M.newSeed(); const diff=opts.diff||2;
  const card=el("div",{class:"prob"});
  const L=M.lec(M.gen(gid).lecture), U=M.unit(L.unit);
  card.style.setProperty("--c",`var(--${U.id})`);
  host.append(card);
  function render(){
    card.innerHTML="";
    let made; try{ made=E.make(gid,seed,diff); }catch(e){ console.error(e); card.append(el("p",{class:"muted"},"This problem failed to generate.")); return; }
    const {g,p}=made;
    const head=el("div",{class:"ph"},
      el("span",{class:"pill"},`Lecture ${L.n}`),
      el("span",{class:"ref",rich:`${g.title}${g.ref?" · notes "+g.ref:""}`}),
      opts.diffLabel?el("span",{class:"ref"},["","Easy","Medium","Hard"][diff]):null);
    card.append(head);
    card.append(el("div",{class:"stmt",rich:p.prompt}));
    const parts=p.parts||[];
    let firstDone=false; const state=parts.map(()=>({ok:false,tries:0}));
    const ins=[];
    parts.forEach((part,pi)=>{
      const a=part.answer; const t=a.type||"expr";
      const box=el("div",{class:"ans"});
      if(part.label||parts.length>1) box.append(el("label",{rich:part.label||`Part ${pi+1}`}));
      if(t==="mc"){
        const host2=el("div"); box.append(host2);
        const q={q:"",opts:a.options.map((o,i)=>[o,i===a.correct,""]),keep:a.keep};
        E.mcq(host2,q,ok=>{ state[pi].ok=ok; state[pi].tries++; settle(); });
        ins.push(null);
      } else {
        const row=el("div",{class:"inrow"});
        const inp=el("input",{type:"text",autocomplete:"off",autocapitalize:"off",spellcheck:"false","aria-label":(part.label?part.label.replace(/\$[^$]*\$/g,"")+" ":"")+"your answer",placeholder:a.placeholder||({expr:"e.g. 2x^3 - 5",num:"e.g. 3/4 or 1.25",interval:"e.g. (0, 4]",list:"e.g. 1, -3"}[t])});
        const chk=el("button",{class:"btn",type:"button"},"Check");
        row.append(inp,chk); box.append(row);
        const pre=el("div",{class:"pre","aria-live":"polite"}); box.append(pre);
        const fb=el("div"); box.append(fb);
        const upd=()=>{ const r=MC.preview(inp.value,t); if(r.error){ pre.className="pre err"; pre.textContent=r.error; } else { pre.className="pre"; pre.innerHTML=r.tex?`<span class="lab">You typed</span>`+M.tex(r.tex):`<span class="lab">Preview</span>`; } };
        inp.addEventListener("input",upd); upd();
        const doCheck=()=>{
          const r=MC.check(inp.value,a);
          if(r.parseError){ fb.className="fb warn"; fb.innerHTML=`<b>I can't read that yet.</b>${esc(r.why||"")}`; return; }
          state[pi].tries++; state[pi].ok=r.ok;
          if(r.ok){ fb.className="fb ok"; fb.innerHTML=`<b>Correct.</b>${part.okNote?rich(part.okNote):""}`; inp.disabled=true; chk.disabled=true; }
          else { fb.className="fb "+(r.missingC||r.close?"warn":"bad"); fb.innerHTML=`<b>${r.missingC?"Almost.":r.close?"Close.":"Not yet."}</b>${esc(r.why||"Try again, use the hint, or open the solution.")}`; }
          settle();
        };
        chk.onclick=doCheck; inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); doCheck(); } });
        box.append(el("div",{class:"fmt"},a.help||FORMAT_HELP[t]||""));
        ins.push(inp);
      }
      card.append(box);
    });
    const tools=el("div",{class:"row",style:"margin-top:8px"});
    const hintB=el("button",{class:"sbtn",type:"button"},"Hint");
    const solB=el("button",{class:"sbtn",type:"button"},"Show solution");
    tools.append(hintB,solB);
    if(opts.showNew!==false){ tools.append(el("span",{class:"spacer"}), el("button",{class:"sbtn",type:"button",onclick:()=>{ seed=M.newSeed(); render(); opts.onNew&&opts.onNew(); }},"New numbers")); }
    card.append(tools);
    const hintBox=el("div",{class:"box note",hidden:true,rich:`<b class="t">Hint</b>${p.hint||"Look back at the formula for this lecture."}`});
    const sol=el("div",{class:"sol",hidden:true});
    sol.innerHTML=`<b>Worked solution</b><ol>${(p.steps||[]).map(s=>`<li>${rich(s)}</li>`).join("")}</ol>`+(p.answerTeX?`<div class="box"><b class="t">Answer</b>${rich(p.answerTeX)}</div>`:"")+(g.ref?`<p class="ref">${esc(M.refText(L.id,g.ref))}</p>`:"");
    card.append(hintBox,sol);
    let usedHelp=false;
    hintB.onclick=()=>{ hintBox.hidden=!hintBox.hidden; usedHelp=true; };
    solB.onclick=()=>{ sol.hidden=!sol.hidden; if(!firstDone){ firstDone=true; record(false,true); } usedHelp=true; };
    function record(ok, gaveUp){
      M.recordAttempt(gid, ok, true);
      if(!ok) M.logMistake({gid, seed, diff, lec:L.id, gaveUp:!!gaveUp});
      opts.onResult&&opts.onResult(ok, true);
    }
    function settle(){
      // first try: the first time every part has had at least one check
      if(!firstDone && state.every(s=>s.tries>0)){ firstDone=true; const ok=state.every(s=>s.ok)&&!usedHelp; record(ok); if(!ok && state.every(s=>s.ok)) {} }
      if(state.every(s=>s.ok)){ if(opts.fromMistakes) M.fixMistake(gid,seed); opts.onSolved&&opts.onSolved(); }
    }
  }
  render();
  return card;
};

/* ---------- glossary term card (small modal at the bottom right) ---------- */
E.terms = function(){
  const out=[]; M.lectures.forEach(L=>(L.glossary||[]).forEach(g=>out.push({...g,lec:L.id,unit:L.unit}))); return out;
};
})();

/* ---------- a practice question you rate yourself on (prof's practice questions and course-notes problems) ----------
   r: {id, src, lec, kind:"mc"|"long"|"example"|..., q, opts?, a?|ans?, steps?|sol?, note?, marks?} */
(function(){
const M=window.M127, el=M.el, rich=M.rich, esc=M.esc;
ENGINE.reviewCard=function(r,opts={}){
  const L=r.lec?M.lec(r.lec):null; const u=L?M.unit(L.unit):null;
  const d=el("div",{class:"rq",style:`--c:var(--${u?u.id:"ink2"})`});
  const rating=()=>M.db().review[r.id];
  const meta=[r.src?`<span class="pill" style="--c:var(--head)">${esc(r.src)}</span>`:"", L?`<span class="pill">Lecture ${L.n}</span>`:r.lec?`<span class="pill" style="--c:var(--ink2)">Lecture ${+String(r.lec).slice(1)} (coming)</span>`:"", r.marks?`<span class="ref">${esc(r.marks)} mark${r.marks==1?"":"s"}</span>`:"", r.page?`<span class="ref">${esc(r.page)}</span>`:"", r.notLectured?`<span class="pill" style="--c:var(--warn)">Section 2.4.5, not lectured</span>`:""].join(" ");
  d.innerHTML=`<div class="row" style="gap:6px;margin-bottom:6px">${meta}</div><div class="q">${rich(r.q)}</div>`;
  if(r.opts){ const ol=el("ol",{type:"a",style:"margin:6px 0 0;padding-left:24px"}); r.opts.forEach(o=>{ const li=el("li",{rich:o[0]}); li.dataset.ok=o[1]?"1":""; ol.append(li); }); d.append(ol); if(r.multi) d.append(el("p",{class:"small muted",style:"margin:4px 0 0"},"Select all that apply.")); }
  const ans=el("div",{class:"a",hidden:!opts.showAll});
  const sol=r.steps||r.sol;
  let body="";
  if(r.opts){ const right=r.opts.map((o,i)=>o[1]?String.fromCharCode(97+i):null).filter(Boolean); body+=`<p style="margin:0 0 4px"><b>Answer: (${right.join("), (")})</b></p>${r.opts.filter(o=>o[2]).map((o,i)=>`<div class="small"><b>${rich(o[0])}</b>: ${rich(o[2])}</div>`).join("")}`; }
  if(r.a||r.ans) body+=`<p style="margin:4px 0"><b>Answer:</b> ${rich(r.a||r.ans)}</p>`;
  if(sol&&sol.length) body+=`<ol style="margin:6px 0 0;padding-left:22px">${sol.map(s=>`<li>${rich(s)}</li>`).join("")}</ol>`;
  if(r.note) body+=`<p class="small" style="margin:6px 0 0;color:var(--warn)">${rich(r.note)}</p>`;
  ans.innerHTML=body; d.append(ans);
  const meta2=el("div",{class:"meta"});
  const sb=el("button",{class:"sbtn",type:"button"},opts.showAll?"Hide answer":"Show answer");
  sb.onclick=()=>{ ans.hidden=!ans.hidden; sb.textContent=ans.hidden?"Show answer":"Hide answer"; if(!ans.hidden&&r.opts) d.querySelectorAll("li[data-ok='1']").forEach(li=>li.style.color="var(--ok)"); };
  meta2.append(sb);
  if(L) meta2.append(el("a",{class:"sbtn",href:M.lecURL(L.id)},"Open the lecture"));
  if(window.GUIDE) meta2.append(el("button",{class:"sbtn",type:"button",onclick:()=>GUIDE.open(String(r.q).replace(/<[^>]+>/g," ").slice(0,160))},"Ask Tan"));
  const rate=el("span",{class:"rate",role:"group","aria-label":"How well did you know this?"});
  [["got","Got it"],["shaky","Shaky"],["no","No idea"]].forEach(([v,t])=>{ const b=el("button",{type:"button","data-v":v,"aria-pressed":String(rating()===v)},t); b.onclick=()=>{ const db=M.db(); if(db.review[r.id]===v) delete db.review[r.id]; else db.review[r.id]=v; M.save(); rate.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(db.review[r.id]===x.dataset.v))); opts.onRate&&opts.onRate(); }; rate.append(b); });
  meta2.append(rate); d.append(meta2);
  return d;
};
window.REVIEW_CARD=ENGINE.reviewCard;
})();
