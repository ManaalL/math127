/* MATH 127 Interactive: unit page. One page per unit, with tabs:
   Lectures (chapters grouped by quiz) · Explore (every figure) · Practice (endless) · Mini exam · Glossary.
   URL hash: #L07 opens Lecture 7, #L07.3 opens its 4th step, #explore #practice #exam #glossary open tabs. */
(function(){
"use strict";
const M=window.M127, C=M.COURSE, el=M.el, rich=M.rich, esc=M.esc, $=M.$;
const UID=document.documentElement.getAttribute("data-unit");
const U=M.unit(UID);
document.documentElement.style.setProperty("--c",`var(--${UID})`);
const LECS=U.lectures.map(id=>M.lec(id)).filter(Boolean);
const UPCOMING=U.lectures.filter(id=>!M.lec(id)).map(id=>C.schedule.find(r=>r[0]===id)).filter(Boolean);
const RELATED=(U.related||[]).map(id=>M.lec(id)).filter(Boolean);
const quizOf=id=>C.quizzes.find(q=>q.lectures.includes(id));
const schedDate=id=>{ const r=C.schedule.find(r=>r[0]===id); return r?r[1]:null; };

M.nav("units");
const app=$("#app");
/* hero */
const done=LECS.filter(L=>M.chState(L.id).done).length;
const nums=U.lectures.map(id=>+id.slice(1));
const hero=el("section",{class:"hero slim"});
hero.innerHTML=`<div class="wrap"><div><p class="mono" style="margin:0 0 10px;color:var(--c)">Unit ${U.n} · Lectures ${nums[0]} to ${nums[nums.length-1]} · ${[...new Set(U.lectures.map(id=>{ const q=quizOf(id); return q?(q.midterm?"Midterm":"Quiz "+q.n):""; }).filter(Boolean))].join(", ")}</p>
  <h1>${esc(U.title)}</h1><p class="lede">${U.topics.map(esc).join(". ")}.</p>
  <div class="counts"><span><b>${LECS.length}</b>lectures</span><span><b>${LECS.reduce((n,L)=>n+(L.formulas||[]).length,0)}</b>formulas</span><span><b>${LECS.reduce((n,L)=>n+(L.gens||[]).length,0)}</b>problem types</span><span><b>${LECS.reduce((n,L)=>n+(L.exam||[]).length,0)}</b>exam questions</span></div></div>
  <div class="card" style="min-width:230px;display:flex;gap:14px;align-items:center"><span class="ring" style="--p:${LECS.length?Math.round(done/LECS.length*100):0}"><span>${done}/${LECS.length}</span></span><div><b>Chapters done</b><div class="muted small">${M.db().exam["unit-"+UID]?`Mini exam best: <b>${M.db().exam["unit-"+UID].best}%</b>`:"Mini exam not taken yet"}</div></div></div></div>`;
app.append(hero);
const sub=el("div",{class:"subnav"}); const subw=el("div",{class:"wrap"}); sub.append(subw); app.append(sub);
const TABS=[["lectures","Lectures"],["explore","Explore"],["practice","Practice"],["exam","Mini exam"],["glossary","Glossary"]];
TABS.forEach(([k,t])=>subw.append(el("button",{class:"tab",type:"button","data-t":k,onclick:()=>go(k)},t)));
const view=el("div",{class:"wrap view"}); app.append(view);
M.footer();

let RUN=null; // {id, first:{}}
function setTab(k){ M.$$(".tab",subw).forEach(b=>b.setAttribute("aria-selected",String(b.dataset.t===k))); }
function go(k){ RUN=null; hero.hidden=false; setTab(k); view.innerHTML=""; ({lectures,explore,practice,exam,glossary}[k]||lectures)(); history.replaceState(null,"",k==="lectures"?location.pathname:"#"+k); window.scrollTo({top:0}); }

/* ---------- lectures list, grouped by quiz ---------- */
function lectures(){
  view.append(el("p",{class:"muted",style:"max-width:46em"},"Each lecture is a short chapter: the key ideas in plain words, a worked example you step through, an interactive graph, and problems with new numbers every time. Your first-try score is saved, so you can come back and beat it."));
  const groups=[];
  C.quizzes.forEach(q=>{ const ids=U.lectures.filter(id=>q.lectures.includes(id)); if(ids.length) groups.push({q,ids}); });
  groups.forEach(({q,ids})=>{
    const g=el("section",{class:"qgroup"});
    const label=q.midterm?"Midterm only":`Quiz ${q.n}`;
    g.append(el("h3",{html:`<span class="pill" style="--c:var(--head)">${label}</span> ${q.midterm?"New material for the midterm":`First tested on Quiz ${q.n}`} <span class="ref">${M.fmtDate(q.date,{weekday:"short",month:"short",day:"numeric"})} · covers ${esc(q.covers)}</span>`}));
    const ul=el("ul",{class:"chlist"});
    ids.forEach(id=>{ const L=M.lec(id);
      if(!L){ const r=C.schedule.find(x=>x[0]===id); ul.append(el("li",{},el("div",{class:"chitem",style:"cursor:default;opacity:.7"},el("span",{class:"chnum"},String(+id.slice(1))),el("h4",{},r?r[2]:id),el("span",{class:"pill",style:"--c:var(--ink2)"},"Coming"),el("span",{class:"meta m"},`${r?M.fmtDate(r[1],{weekday:"short",month:"short",day:"numeric"}):""} · sections ${r?r[3]:""}`),el("span",{class:"meta"},"Added after the lecture. Send the notes and it shows up here.")))); return; }
      const st=M.chState(id);
      const b=el("button",{class:"chitem",type:"button",onclick:()=>openChapter(id,0)},
        el("span",{class:"chnum"},String(L.n)), el("h4",{rich:L.title}),
        M.isNew(L.added,L.date)?el("span",{class:"pill new"},"New"):(st.done?el("span",{class:"best"},`Best ${Math.round((st.best||0)*100)}%`):el("span")),
        el("span",{class:"meta m"},`${M.fmtDate(L.date,{weekday:"short",month:"short",day:"numeric"})} · §${L.sections.join(", ")} · ${(L.steps||[]).length} steps`),
        el("span",{class:"meta",rich:L.summary}));
      ul.append(el("li",{},b)); });
    g.append(ul); view.append(g);
  });
  if(RELATED.length){ const r=el("div",{class:"card"}); r.innerHTML=`<h3>Also part of this unit</h3><p class="muted" style="margin:0">${RELATED.map(L=>`Lecture ${L.n} (${esc(L.title)}) lives in Unit ${M.unit(L.unit).n}, but its second half starts this unit's material. <a href="${M.lecURL(L.id)}">Open Lecture ${L.n}</a>.`).join(" ")}</p>`; view.append(r); }
  const reset=el("button",{class:"sbtn",type:"button",onclick:()=>{ if(confirm(`Clear your saved chapter scores for Unit ${U.n}?`)){ LECS.forEach(L=>{ delete M.db().ch[L.id]; }); M.save(); go("lectures"); } }},"Reset this unit's chapter scores");
  view.append(el("p",{style:"margin-top:20px"},reset));
}

/* ---------- a lecture chapter ---------- */
function stepper(L,si){ const bar=el("div",{class:"steps","aria-hidden":"true"}); L.steps.forEach((_,i)=>bar.append(el("i",{class:i<si?"on":i===si?"cur":""}))); return bar; }
function record(key,ok){ if(!RUN) return; if(!(key in RUN.first)) RUN.first[key]=!!ok; }
function openChapter(id,si){
  const L=M.lec(id); if(!L) return go("lectures");
  if(!RUN||RUN.id!==id) RUN={id,first:{}};
  setTab("lectures"); hero.hidden=true; view.innerHTML=""; window.scrollTo({top:0});
  history.replaceState(null,"","#"+id+(si?"."+si:""));
  const s=L.steps[si];
  const crumb=el("div",{class:"crumb"},
    el("button",{class:"back",type:"button",onclick:()=>go("lectures")},"All lectures"),
    el("h1",{rich:`Lecture ${L.n}: ${L.title}`}),
    el("span",{class:"ref"},`${M.fmtDate(L.date,{weekday:"short",month:"short",day:"numeric"})} · §${L.sections.join(", ")} · step ${si+1} of ${L.steps.length}`),
    stepper(L,si));
  view.append(crumb);
  const hasFig=!!s.fig;
  const stage=el("div",{class:"stage"+(hasFig?"":" wide")});
  const left=el("div"), panel=el("div",{class:"panel"});
  if(hasFig){ stage.append(left,panel); } else stage.append(panel);
  view.append(stage);
  panel.append(el("div",{class:"kicker"},{read:"Key idea",example:"Worked example",explore:"Explore",mcq:"Check yourself",try:"Your turn",formulas:"Formulas to memorize"}[s.type]||""));
  panel.append(el("h2",{rich:s.title||""}));
  if(si===0 && (L.flags||[]).length){ panel.append(flagsBox(L)); }
  const next=el("button",{class:"btn",type:"button",onclick:()=>{ if(si+1<L.steps.length) openChapter(id,si+1); else finish(L); }}, si+1<L.steps.length?"Continue":"Finish lecture");
  const back=el("button",{class:"btn ghost",type:"button",onclick:()=>{ if(si>0) openChapter(id,si-1); else go("lectures"); }}, si>0?"Back":"All lectures");
  if(hasFig) ENGINE.figure(left,L.figures[s.fig],{unit:UID});
  if(s.body) panel.append(el("div",{rich:s.body}));
  if(s.type==="example"){ ENGINE.example(panel,s.ex); }
  if(s.type==="mcq"){ ENGINE.mcq(panel,s,ok=>record(si,ok)); }
  if(s.type==="try"){ ENGINE.problem(panel,{gid:s.gen,diff:s.diff||2,onResult:(ok)=>record(si,ok),onNew:()=>{}}); }
  if(s.type==="formulas"){ panel.append(formulaList(L)); }
  if(s.type==="example" && s.fig==null && s.ex && s.ex.fig) {}
  if(s.ref) panel.append(el("p",{class:"ref",style:"margin-top:10px"},`Lecture ${L.n} notes, ${s.ref}`));
  panel.append(el("div",{class:"navrow"},back,next));
}
function flagsBox(L){ const d=el("div",{class:"flag"}); d.innerHTML=`<b>Heads up about the notes.</b> ${L.flags.map(f=>`${rich(f.text)} <span class="ref">(${esc(f.ref)})</span>`).join(" ")}`; return d; }
function formulaList(L){
  const g=el("div",{class:"fs-grid",style:"grid-template-columns:minmax(0,1fr)"});
  (L.formulas||[]).forEach(f=>{ const c=el("div",{class:"fcard"}); c.innerHTML=`<div class="nm">${rich(f.name)}</div><div class="tx">${M.tex(f.tex,true)}</div>${f.note?`<div class="nt">${rich(f.note)}</div>`:""}<span class="ref">Lecture ${L.n}, ${esc(f.ref||"")}</span>`; g.append(c); });
  const box=el("div"); box.append(g, el("p",{class:"muted small",style:"margin-top:8px",html:`Drill these on the <a href="formulas.html#u=${UID}">formula sheet</a> with flashcards and fill-in-the-blank.`})); return box;
}
function finish(L){
  const v=Object.values(RUN.first); const right=v.filter(Boolean).length, total=v.length;
  const frac=total?right/total:1; const st=M.chState(L.id); const prev=st.best;
  st.done=true; st.last=frac; if(st.best==null||frac>st.best) st.best=frac; st.when=Date.now(); M.save();
  view.innerHTML=""; window.scrollTo({top:0});
  const i=LECS.indexOf(L); const nx=LECS[i+1];
  const box=el("div",{class:"card",style:"max-width:760px"});
  box.innerHTML=`<p class="kicker">Lecture ${L.n} complete</p><h1 style="font-size:2rem;margin-bottom:14px">${rich(L.title)}</h1>
   <div class="row" style="gap:28px;margin:10px 0 18px"><div><div class="big">${right}/${total}</div><div class="muted small">right on the first try</div></div><div><div class="big" style="color:var(--head)">${Math.round((st.best||0)*100)}%</div><div class="muted small">${prev==null?"your best so far":frac>prev?"new personal best":"your best"}</div></div></div>
   <p>${rich(L.summary)}</p>`;
  if((L.flags||[]).length) box.append(flagsBox(L));
  const row=el("div",{class:"row",style:"margin-top:14px"});
  if(nx) row.append(el("button",{class:"btn",type:"button",onclick:()=>{ RUN=null; openChapter(nx.id,0); }},`Start Lecture ${nx.n}`));
  else row.append(el("button",{class:"btn",type:"button",onclick:()=>go("exam")},"Take the mini exam"));
  row.append(el("button",{class:"btn ghost",type:"button",onclick:()=>{ RUN=null; openChapter(L.id,0); }},"Replay"),el("button",{class:"btn ghost",type:"button",onclick:()=>{ go("practice"); }},"Practise this unit"));
  box.append(row); view.append(box);
  RUN=null;
}

/* ---------- explore: every figure in the unit ---------- */
function explore(){
  view.append(el("p",{class:"muted",style:"max-width:46em"},"Every interactive graph from this unit in one place. Drag the points, move the sliders, and predict what happens before you look."));
  const grid=el("div",{class:"grid2"}); view.append(grid);
  LECS.forEach(L=>Object.entries(L.figures||{}).forEach(([k,f])=>{
    const c=el("div"); c.append(el("div",{class:"row",style:"margin:0 0 6px"},el("span",{class:"pill"},`Lecture ${L.n}`),el("b",{rich:f.title||k})));
    ENGINE.figure(c,f,{unit:UID}); c.append(el("p",{class:"small",style:"margin-top:6px"},el("a",{href:"#"+L.id,onclick:e=>{ e.preventDefault(); RUN=null; openChapter(L.id,Math.max(0,L.steps.findIndex(s=>s.fig===k))); }},"Open in the lecture")));
    grid.append(c); }));
}

/* ---------- practice: endless problems from this unit ---------- */
function practice(){
  if(!LECS.length){ view.append(el("p",{class:"muted"},"This unit's lectures haven't been added yet.")); return; }
  const db=M.db(); const prefs=db.prefs["practice-"+UID]||(db.prefs["practice-"+UID]={lecs:LECS.map(L=>L.id),diff:2});
  prefs.lecs=prefs.lecs.filter(id=>M.lec(id)); if(!prefs.lecs.length) prefs.lecs=LECS.map(L=>L.id);
  const top=el("div",{class:"card"});
  top.append(el("h2",{},"Endless practice"),el("p",{class:"muted"},"New numbers every time. Pick lectures and a difficulty. Wrong first tries go to your mistake log on the Midterm prep page, so you can redo them later."));
  const chips=el("div",{class:"chips",style:"margin:6px 0 10px"});
  LECS.forEach(L=>{ const b=el("button",{class:"chip lec",type:"button","aria-pressed":String(prefs.lecs.includes(L.id))},`L${L.n}`); b.onclick=()=>{ const i=prefs.lecs.indexOf(L.id); if(i>=0){ if(prefs.lecs.length>1) prefs.lecs.splice(i,1); } else prefs.lecs.push(L.id); b.setAttribute("aria-pressed",String(prefs.lecs.includes(L.id))); M.save(); }; chips.append(b); });
  top.append(chips);
  const segHost=el("div",{style:"max-width:360px"}); top.append(segHost);
  PLOT.seg(segHost,{items:[[1,"Easy"],[2,"Medium"],[3,"Hard"]],value:prefs.diff,onchange:v=>{ prefs.diff=v; M.save(); }});
  const tally=el("div",{class:"stat3",style:"margin-top:10px"}); top.append(tally);
  view.append(top);
  const host=el("div"); view.append(host);
  let right=0,total=0;
  const upd=()=>{ tally.innerHTML=`<span>This session: <b>${right}</b> of <b>${total}</b> right first try</span>`; };
  function nextProb(){
    host.innerHTML="";
    const gids=[]; prefs.lecs.forEach(id=>(M.lec(id).gens||[]).forEach(g=>gids.push(g.id)));
    if(!gids.length){ host.append(el("p",{class:"muted"},"No problems here yet.")); return; }
    const gid=gids[Math.floor(Math.random()*gids.length)];
    ENGINE.problem(host,{gid,diff:prefs.diff,diffLabel:true,showNew:false,onResult:ok=>{ total++; if(ok) right++; upd(); }});
    host.append(el("div",{class:"row"},el("button",{class:"btn",type:"button",onclick:nextProb},"Next problem")));
  }
  upd(); nextProb();
}

/* ---------- mini exam ---------- */
function exam(){
  const items=[]; LECS.forEach(L=>(L.exam||[]).forEach(q=>items.push({...q,kind:"mc",lec:L.id})));
  LECS.forEach(L=>(L.gens||[]).slice(0,3).forEach(g=>items.push({kind:"gen",gid:g.id,lec:L.id,diff:2,id:g.id})));
  const host=el("div"); view.append(host);
  EXAM.mount(host,{key:"unit-"+UID,title:`Unit ${U.n} mini exam`,intro:`${items.length} questions in the bank: multiple choice like the first half of a quiz, plus short-answer problems with new numbers.`,items,sizes:[10,20]});
}

/* ---------- glossary ---------- */
function glossary(){
  const search=el("input",{type:"search",placeholder:"Find a term","aria-label":"Find a term",style:"min-width:240px"});
  view.append(el("div",{class:"row",style:"margin-bottom:14px"},el("h2",{},"Glossary"),el("span",{class:"spacer"}),search));
  const box=el("div",{class:"gl"}); view.append(box);
  function draw(q=""){
    box.innerHTML="";
    LECS.forEach(L=>{ const items=(L.glossary||[]).filter(g=>!q||(g.term+" "+g.def).toLowerCase().includes(q)); if(!items.length) return;
      const s=el("section"); s.append(el("h3",{rich:`Lecture ${L.n}: ${L.title}`}));
      items.forEach(g=>s.append(el("div",{class:"gi",html:`<b>${rich(g.term)}</b> <span class="ref">${esc(g.ref||"")}</span><p>${rich(g.def)}</p>`})));
      box.append(s); });
    if(!box.children.length) box.append(el("p",{class:"muted"},"No match. Try a shorter word."));
  }
  search.addEventListener("input",()=>draw(search.value.trim().toLowerCase())); draw();
}

/* ---------- routing ---------- */
window.UNIT_OPEN=(id,si)=>{ RUN=null; openChapter(id,si||0); };
function fromHash(){
  const h=location.hash.slice(1);
  const m=h.match(/^(L\d\d)(?:\.(\d+))?$/);
  if(m && LECS.some(L=>L.id===m[1])){ RUN=null; openChapter(m[1],Math.min(+(m[2]||0),M.lec(m[1]).steps.length-1)); return; }
  if(TABS.some(t=>t[0]===h)) return go(h);
  go("lectures");
}
window.addEventListener("hashchange",()=>{ const h=location.hash.slice(1); const m=h.match(/^(L\d\d)(?:\.(\d+))?$/); if(m && RUN && RUN.id===m[1]) return; fromHash(); });
fromHash();
})();
