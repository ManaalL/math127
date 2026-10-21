/* MATH 127 Interactive: core utilities shared by every page.
   - M127.lecture({...}) registers a lecture data file (data/Lxx.js)
   - storage with a versioned key and migrations (progress survives updates)
   - seeded random numbers so any generated problem can be recreated from its seed
   - math rendering: "$...$" and "$$...$$" inside strings become KaTeX */
(function(){
"use strict";
const M = window.M127 = window.M127 || {};
M.lectures = M.lectures || [];
M.lecture = function(L){ M.lectures.push(L); };
M.extras = M.extras || {review:[],longAnswer:[],quizPractice:[],changelog:[]};
M.addReview = list => { M.extras.review.push(...list); };
M.addLongAnswer = list => { M.extras.longAnswer.push(...list); };

/* ---------- storage ---------- */
const STORE_KEY = "m127.v1";            // bump to m127.v2 and add a migration below when the shape changes
const OLD_KEYS = [];                    // e.g. ["m127.v0"]
const MIGRATIONS = {                    // from-version -> function(old) returning the next version
  // 1: d => ({...d, schema:2})
};
const SCHEMA = 1;
function blank(){ return {schema:SCHEMA, ch:{}, stats:{}, leitner:{}, exam:{}, review:{}, mistakes:[], seen:{}, prefs:{}, created:Date.now()}; }
let DB = null;
function rawGet(k){ try{ const v=localStorage.getItem(k); return v==null?null:JSON.parse(v); }catch(e){ return null; } }
function rawSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); return true; }catch(e){ return false; } }
function load(){
  if(DB) return DB;
  let d = rawGet(STORE_KEY);
  if(!d){ for(const k of OLD_KEYS){ const o=rawGet(k); if(o){ d=o; break; } } }
  if(!d || typeof d!=="object") d = blank();
  while((d.schema||1) < SCHEMA && MIGRATIONS[d.schema||1]){ d = MIGRATIONS[d.schema||1](d); }
  DB = Object.assign(blank(), d, {schema:SCHEMA});
  return DB;
}
M.db = () => load();
M.save = () => { rawSet(STORE_KEY, load()); };
M.resetAll = () => { DB = blank(); M.save(); };
M.exportData = () => JSON.stringify(load());
M.importData = s => { const d=JSON.parse(s); if(d && typeof d==="object"){ DB=null; rawSet(STORE_KEY,d); load(); M.save(); return true; } return false; };

/* stats per problem generator (gid) */
M.recordAttempt = function(gid, ok, first){
  const db=load(); const s = db.stats[gid] || (db.stats[gid]={right:0,total:0,fr:0,ft:0,last:0});
  s.total++; if(ok) s.right++; if(first){ s.ft++; if(ok) s.fr++; } s.last=Date.now(); M.save();
};
M.logMistake = function(entry){
  const db=load(); db.mistakes = db.mistakes.filter(m=>!(m.gid===entry.gid && m.seed===entry.seed));
  db.mistakes.unshift({...entry, when:Date.now(), fixed:false}); db.mistakes = db.mistakes.slice(0,300); M.save();
};
M.fixMistake = function(gid, seed){ const db=load(); const m=db.mistakes.find(x=>x.gid===gid && x.seed===seed); if(m){ m.fixed=true; m.fixedAt=Date.now(); M.save(); } };
M.chState = id => { const db=load(); return db.ch[id] || (db.ch[id]={done:false,best:null,last:null}); };

/* ---------- random ---------- */
M.rng = function(seed){
  let s = (seed>>>0) || 0x9e3779b9;
  const next = () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t>>>15, t | 1); t ^= t + Math.imul(t ^ t>>>7, t | 61); return ((t ^ t>>>14)>>>0) / 4294967296; };
  const R = () => next();
  R.int = (a,b) => a + Math.floor(next()*(b-a+1));
  R.nz = (a,b) => { let v=0; while(v===0) v=R.int(a,b); return v; };
  R.pick = arr => arr[Math.floor(next()*arr.length)];
  R.sign = () => next()<0.5?-1:1;
  R.shuffle = arr => { const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(next()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  R.real = (a,b,dp=2) => +(a + next()*(b-a)).toFixed(dp);
  R.seed = seed;
  return R;
};
M.newSeed = () => (Math.random()*2**31)>>>0;

/* ---------- text and math ---------- */
const esc = M.esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
M.tex = function(t, display=false){
  if(window.katex){ try{ return katex.renderToString(t,{displayMode:display,throwOnError:false,strict:"ignore",trust:false}); }catch(e){} }
  return `<code class="tex">${esc(t)}</code>`;
};
/* rich(): turns $..$ and $$..$$ into KaTeX. Text outside math is trusted HTML written by the site author. */
M.rich = function(s){
  if(s==null) return "";
  s = String(s);
  let out="", i=0;
  while(i<s.length){
    if(s[i]==="\\" && s[i+1]==="$"){ out+="$"; i+=2; continue; }
    if(s[i]==="$"){
      const disp = s[i+1]==="$"; const open = disp?2:1;
      const close = s.indexOf(disp?"$$":"$", i+open);
      if(close<0){ out+=s.slice(i); break; }
      out += M.tex(s.slice(i+open, close), disp); i = close+open; continue;
    }
    out += s[i]; i++;
  }
  return out;
};
/* el(tag, attrs, ...children) */
M.el = function(tag, attrs={}, ...kids){
  const e=document.createElement(tag);
  for(const k in attrs){ const v=attrs[k]; if(v==null||v===false) continue;
    if(k==="html") e.innerHTML=v; else if(k==="rich") e.innerHTML=M.rich(v); else if(k.startsWith("on")) e.addEventListener(k.slice(2),v); else if(k==="style"&&typeof v==="object") Object.assign(e.style,v); else e.setAttribute(k,v===true?"":v); }
  kids.flat().forEach(c=>{ if(c==null||c===false) return; e.append(c.nodeType?c:document.createTextNode(String(c))); });
  return e;
};
M.$ = (s,r=document)=>r.querySelector(s);
M.$$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
M.shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

/* ---------- number formatting for generators ---------- */
function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; }
M.gcd = gcd;
M.frac = function(n,d=1){ // LaTeX for n/d reduced
  if(d<0){ n=-n; d=-d; } const g=gcd(n,d); n/=g; d/=g;
  if(d===1) return String(n);
  return (n<0?"-":"")+`\\frac{${Math.abs(n)}}{${d}}`;
};
M.fracA = function(n,d=1){ if(d<0){ n=-n; d=-d; } const g=gcd(n,d); n/=g; d/=g; return d===1?String(n):`(${n}/${d})`; }; // ascii for answers
M.num = (v,dp=4) => { if(Math.abs(v-Math.round(v))<1e-10) return String(Math.round(v)); return String(+v.toFixed(dp)); };
/* coefficient helpers for building polynomials in LaTeX: term(3,"x",2) -> "3x^{2}" */
M.term = function(c, v="x", p=1, first=false){
  if(c===0) return "";
  const sign = c<0 ? "-" : (first?"":"+");
  const a = Math.abs(c);
  const coef = (a===1 && p!==0) ? "" : String(a);
  const vv = p===0 ? "" : p===1 ? v : `${v}^{${p}}`;
  return sign + coef + vv;
};
M.poly = function(coefs, v="x"){ // coefs from highest power: [a_n,...,a_0]
  const n=coefs.length-1; let s="", first=true;
  coefs.forEach((c,i)=>{ if(c===0) return; s+=M.term(c,v,n-i,first); first=false; });
  return s||"0";
};
M.signed = (c, s="") => (c<0?`- ${Math.abs(c)}${s}`:`+ ${c}${s}`); // "+ 3x" / "- 3x"
M.pm = c => c<0?`-${Math.abs(c)}`:`+${c}`;

/* ---------- dates ---------- */
M.today = () => { const d=new Date(); return new Date(d.getFullYear(),d.getMonth(),d.getDate()); };
M.parseDate = s => { const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); };
M.fmtDate = (s,opt={month:"short",day:"numeric"}) => M.parseDate(s).toLocaleDateString("en-CA",opt);
M.LAUNCH = "2026-10-21";
M.recent = (s, days=7) => { if(!s) return false; const d=M.parseDate(s); const age=(M.today()-d)/864e5; return age < days && age > -1; };
/* "new this week": a lecture given in the last 7 days, or anything added to the site in the last 7 days after launch */
M.isNew = (added, lectureDate) => M.recent(lectureDate) || (added && added>M.LAUNCH && M.recent(added));

/* ---------- lookups (filled once studydata is present) ---------- */
M.lec = id => M.lectures.find(l=>l.id===id);
M.unit = id => (M.COURSE&&M.COURSE.units||[]).find(u=>u.id===id);
M.unitOf = lid => { const L=M.lec(lid); return L?M.unit(L.unit):null; };
M.gen = gid => { for(const L of M.lectures){ const g=(L.gens||[]).find(x=>x.id===gid); if(g) return {...g, lecture:L.id}; } return null; };
M.formula = fid => { for(const L of M.lectures){ const f=(L.formulas||[]).find(x=>x.id===fid); if(f) return {...f, lecture:L.id}; } return null; };
M.lecURL = (lid, step) => { const L=M.lec(lid); if(!L) return "#"; const u=M.unit(L.unit); return `unit-${u.n}.html#${lid}${step!=null?"."+step:""}`; };
M.refText = (lid, ref) => { const L=M.lec(lid); return `Lecture ${L?L.n:"?"}${ref?", "+ref:""}`; };

/* ---------- theme toggle + nav ---------- */
M.theme = function(){
  const saved = rawGet("m127.theme");
  if(saved==="dark"||saved==="light") document.documentElement.setAttribute("data-theme",saved);
};
M.toggleTheme = function(){
  const cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
  const nx = cur==="dark"?"light":"dark"; document.documentElement.setAttribute("data-theme",nx); rawSet("m127.theme",nx);
  document.dispatchEvent(new CustomEvent("m127-theme"));
};
M.theme();
M.LOGO = `<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="13" fill="none" stroke="var(--accent)" stroke-width="1.6"/><path d="M5 20 C9 20 11 9 15 9 S21 20 25 20" fill="none" stroke="var(--accent)" stroke-width="1.3"/><path d="M8.5 11.6 L21.5 6.4" stroke="var(--accent)" stroke-width=".8" stroke-dasharray="1.6 1.4"/><circle cx="15" cy="9" r="2.6" fill="var(--accent)"/></svg>`;
M.nav = function(current){
  const items=[["index.html#units","Units","units"],["formulas.html","Formulas","formulas"],["gym.html","Practice gym","gym"],["quiz.html","Quiz prep","quiz"],["midterm.html","Midterm prep","midterm"]];
  const h=document.createElement("header"); h.className="nav";
  h.innerHTML=`<div class="wrap"><a class="logo" href="index.html">${M.LOGO}<span>MATH 127 Interactive</span></a><nav aria-label="Site">${items.map(([href,t,k])=>`<a href="${href}"${k===current?' aria-current="page"':""}>${t}</a>`).join("")}<button type="button" onclick="window.GUIDE&&GUIDE.open()">Ask Tan</button><button type="button" class="themebtn" aria-label="Switch light or dark mode" title="Light or dark" onclick="M127.toggleTheme()"><svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 2.5 A7.5 7.5 0 0 1 10 17.5 Z" fill="currentColor"/></svg></button></nav></div>`;
  document.body.prepend(h);
};
M.footer = function(extra=""){
  const f=document.createElement("footer"); f.className="wrap foot";
  f.innerHTML=`An independent study aid for MATH 127 (Calculus 1 for the Sciences) at the University of Waterloo, built by Manaal Lakhani with help from Claude. It is not an official University of Waterloo resource; check everything against your lecture notes and LEARN. Formulas follow the Fall 2026 lecture notes, with lecture and page numbers. Course-notes problems are from D. Wolczuk, <i>Calculus for the Sciences</i> (CC BY-NC 4.0). Progress is saved only in this browser. ${extra}`;
  document.body.append(f);
};
})();
