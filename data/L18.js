/* Lecture 18 (Mon Oct 26): Limits as x -> a: one-sided, two-sided and infinite limits, limit laws, determinate forms. Section 3.1.1. Notes: 7 pages. */
(function(){
const M=M127;
/* ---------- small helpers for this lecture ---------- */
const INF="$\\infty$", NINF="$-\\infty$", DNE="does not exist";
const vT=v=>v==="inf"?"\\infty":v==="-inf"?"-\\infty":String(v);            // TeX of a limit value
const vO=v=>v==="dne"?DNE:v==="inf"?INF:v==="-inf"?NINF:`$${v}$`;             // option text of a limit value
const sgnT=s=>s<0?"-":"+";                                                     // the ^- / ^+ on a
const limT=(aT,s)=>`\\lim_{x\\to ${aT}${s?"^"+sgnT(s):""}}`;
const xm=a=>M.poly([1,-a]);                                                    // x - a
const xp=k=>M.poly([1,k]);                                                     // x + k
const Q=(n,d=1)=>{ if(d<0){ n=-n; d=-d; } const g=M.gcd(n,d); return [n/g,d/g]; };
const qT=q=>M.frac(q[0],q[1]), qA=q=>M.fracA(q[0],q[1]), qEq=(a,b)=>a[0]*b[1]===a[1]*b[0];
const qAdd=(a,b)=>Q(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const polyF=(co,x)=>co.reduce((s,c)=>s*x+c,0);
const listLines=L=>L.map((l,i)=>`<div>(${i+1})&nbsp; ${l}</div>`).join("");
const mkMC=(n,first)=>{ const o=[]; for(let i=1;i<=n;i++) o.push(`Line (${i})`); o.push("There is no mistake"); return {type:"mc",options:o,correct:first===0?n:first-1}; };
const signWord=v=>v>0?"positive":"negative";
// substitute x = a into a polynomial, as TeX: 2(3)^2 - 4(3) + 1
const subPoly=(co,a)=>{ const n=co.length-1; let s="";
  co.forEach((c,i)=>{ if(c===0) return; const p=n-i, A=Math.abs(c), neg=c<0;
    const body=p===0?String(A):`${A===1?"":A}(${a})${p>1?`^{${p}}`:""}`;
    s+= s===""?(neg?"-":"")+body:(neg?" - ":" + ")+body; });
  return s||"0"; };
// two-sided options from a list of rational candidates: unique values, then "does not exist"
function twoOpts(cands, extra){
  const out=[], seen=new Set();
  cands.forEach(q=>{ const t=`$${qT(q)}$`; if(!seen.has(t)){ seen.add(t); out.push(t); } });
  let k=1; while(out.length<3){ const q=qAdd(extra,[k,1]); const t=`$${qT(q)}$`; if(!seen.has(t)){ seen.add(t); out.push(t); } k++; }
  out.push(DNE); return out;
}

/* ---------- inline SVG graph for the graph-reading generator ---------- */
function graphSVG(o){
  const W=340,H=250,pl=28,pr=12,pt=10,pb=22,X0=-0.3,X1=6.5,Y0=-2.5,Y1=6.5;
  const X=x=>+(pl+(x-X0)/(X1-X0)*(W-pl-pr)).toFixed(1), Y=y=>+(H-pb-(y-Y0)/(Y1-Y0)*(H-pt-pb)).toFixed(1);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.label}" style="--c:var(--u7);display:block;width:100%;max-width:400px;height:auto;margin:10px 0">`;
  s+=`<defs><clipPath id="${o.uid}"><rect x="${pl}" y="${pt}" width="${W-pl-pr}" height="${H-pt-pb}"/></clipPath></defs>`;
  for(let v=0;v<=6;v++) s+=`<line class="gr" x1="${X(v)}" x2="${X(v)}" y1="${pt}" y2="${H-pb}"/>`;
  for(let v=-2;v<=6;v++) s+=`<line class="gr" x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}"/>`;
  s+=`<line class="ax" x1="${pl}" x2="${W-pr}" y1="${Y(0)}" y2="${Y(0)}"/><line class="ax" x1="${X(0)}" x2="${X(0)}" y1="${pt}" y2="${H-pb}"/>`;
  for(let v=1;v<=6;v++) s+=`<text x="${X(v)}" y="${Y(0)+14}" text-anchor="middle">${v}</text>`;
  for(let v=-2;v<=6;v++) if(v) s+=`<text x="${X(0)-5}" y="${Y(v)+4}" text-anchor="end">${v<0?"\u2212"+(-v):v}</text>`;
  s+=`<text x="${W-pr}" y="${Y(0)-6}" text-anchor="end">x</text><text x="${X(0)+6}" y="${pt+10}">y</text>`;
  (o.asym||[]).forEach(a=>{ s+=`<line class="lt dash" x1="${X(a)}" x2="${X(a)}" y1="${pt}" y2="${H-pb}"/>`; });
  s+=`<g clip-path="url(#${o.uid})">`;
  o.pieces.forEach(p=>{ const n=p.n||40; let d="";
    for(let i=0;i<=n;i++){ const x=p.a+(p.b-p.a)*i/n; let y=p.f(x); if(!isFinite(y)) continue; y=Math.max(-50,Math.min(50,y)); d+=(d?"L":"M")+X(x)+" "+Y(y)+" "; }
    s+=`<path class="cv c" d="${d}"/>`; });
  s+=`</g>`;
  o.marks.forEach(m=>{ s+= m.open?`<circle cx="${X(m.x)}" cy="${Y(m.y)}" r="4.5" style="fill:var(--paper);stroke:var(--c);stroke-width:1.8"/>`:`<circle cx="${X(m.x)}" cy="${Y(m.y)}" r="4.5" class="dotf"/>`; });
  return s+"</svg>";
}

/* ---------- pieces for piecewise functions: tex, exact value q(a) as [n,d], float f(x) ---------- */
const pPoly=co=>({tex:M.poly(co), q:a=>Q(polyF(co,a)), f:x=>polyF(co,x), co});
const pRatX=k=>({tex:`\\frac{x^2 ${k<0?"-":"+"} ${Math.abs(k)}}{x}`, q:a=>Q(a*a+k,a), f:x=>(x*x+k)/x});
const pRatL=(k,m)=>({tex:`\\frac{${xp(k)}}{${xm(m)}}`, q:a=>Q(a+k,a-m), f:x=>(x+k)/(x-m)});
const pRecip=k=>({tex:`\\frac{${k}}{x}`, q:a=>Q(k,a), f:x=>k/x});
const mkCo=(R,kind)=>kind==="lin"?[R.nz(-3,3),R.int(-5,5)]:[R.pick([1,1,-1,2]),R.int(-3,3),R.int(-5,5)];

/* ---------- families of k/0 limits for the infinite-limit generator ----------
   each returns {fT, aT, aN, topT, LT, Lv (numeric value of the top), botT, dS(s): sign of the bottom on side s, why(s), f, sides} */
const INFAM={
  F1:R=>{ const N=R.nz(-7,7), a=R.int(-4,4);
    return {fT:`\\frac{${N}}{${xm(a)}}`, aT:String(a), aN:a, topT:String(N), LT:String(N), Lv:N, topConst:true, botT:xm(a), dS:s=>s,
      why:s=>s<0?`$x < ${a}$, so $${xm(a)} < 0$`:`$x > ${a}$, so $${xm(a)} > 0$`, f:x=>N/(x-a)}; },
  F2:R=>{ const a=R.int(-4,4); let p=R.int(-5,5); if(a+p===0) p+=1;
    return {fT:`\\frac{${xp(p)}}{${xm(a)}}`, aT:String(a), aN:a, topT:xp(p), LT:String(a+p), Lv:a+p, botT:xm(a), dS:s=>s,
      why:s=>s<0?`$x < ${a}$, so $${xm(a)} < 0$`:`$x > ${a}$, so $${xm(a)} > 0$`, f:x=>(x+p)/(x-a)}; },
  F3:R=>{ const a=R.int(-3,4); let p=R.int(-5,5); if(a+p===0) p+=1; const bt=a===0?"-x":`${a} - x`;
    return {fT:`\\frac{${xp(p)}}{${bt}}`, aT:String(a), aN:a, topT:xp(p), LT:String(a+p), Lv:a+p, botT:bt, dS:s=>-s,
      why:s=>s<0?`$x < ${a}$, so $${bt} > 0$ (approaching from the left does not make the bottom negative)`:`$x > ${a}$, so $${bt} < 0$`, f:x=>(x+p)/(a-x)}; },
  F4:(R,neg)=>{ const c=R.int(1,3), aN=neg?-c:c; let p=R.int(-4,4); if(aN+p===0) p+=1;
    const bt=`x^2 - ${c*c}`;
    const why=s=>{ if(aN>0) return s<0?`$x$ is a little less than $${c}$ (and positive), so $x^2 < ${c*c}$ and $${bt} < 0$`:`$x$ is a little more than $${c}$, so $x^2 > ${c*c}$ and $${bt} > 0$`;
      return s<0?`$x$ is a little less than $-${c}$ (like $${(-c-0.01).toFixed(2)}$), so $x^2 > ${c*c}$ and $${bt} > 0$`:`$x$ is a little more than $-${c}$ (like $${(-c+0.01).toFixed(2)}$), so $x^2 < ${c*c}$ and $${bt} < 0$`; };
    return {fT:`\\frac{${xp(p)}}{${bt}}`, aT:String(aN), aN, topT:xp(p), LT:String(aN+p), Lv:aN+p, botT:bt, dS:s=>aN>0?s:-s, why, f:x=>(x+p)/(x*x-c*c)}; },
  F5:R=>{ const a=R.int(-3,3); let p=R.int(-5,5); if(a+p===0) p+=1; const bt=a===0?"x^2":`(${xm(a)})^2`;
    return {fT:`\\frac{${xp(p)}}{${bt}}`, aT:String(a), aN:a, topT:xp(p), LT:String(a+p), Lv:a+p, botT:bt, dS:()=>1,
      why:()=>`a square is never negative, so $${bt} > 0$ for $x \\ne ${a}$`, f:x=>(x+p)/((x-a)*(x-a))}; },
  asin:()=>({fT:"\\frac{\\arcsin(x)}{1 - x}", aT:"1", aN:1, topT:"\\arcsin(x)", LT:"\\frac{\\pi}{2}", Lv:Math.PI/2, botT:"1 - x", dS:s=>-s, sides:[-1],
      why:()=>"$x < 1$, so $1 - x > 0$ (approaching from the left does not make the bottom negative)", f:x=>Math.asin(x)/(1-x)}),
  acos:()=>({fT:"\\frac{\\arccos(x)}{x + 1}", aT:"-1", aN:-1, topT:"\\arccos(x)", LT:"\\pi", Lv:Math.PI, botT:"x + 1", dS:s=>s, sides:[1],
      why:()=>"$x > -1$, so $x + 1 > 0$", f:x=>Math.acos(x)/(x+1)}),
  exp:R=>{ const a=R.int(-2,2); const LT=a===0?"1":a===1?"e":`e^{${a}}`;
    return {fT:`\\frac{e^x}{${xm(a)}}`, aT:String(a), aN:a, topT:"e^x", LT, Lv:Math.exp(a), botT:xm(a), dS:s=>s,
      why:s=>s<0?`$x < ${a}$, so $${xm(a)} < 0$`:`$x > ${a}$, so $${xm(a)} > 0$`, f:x=>Math.exp(x)/(x-a)}; },
  cosx:()=>({fT:"\\frac{\\cos(x)}{x}", aT:"0", aN:0, topT:"\\cos(x)", LT:"1", Lv:1, botT:"x", dS:s=>s,
      why:s=>s<0?"$x < 0$":"$x > 0$", f:x=>Math.cos(x)/x}),
  ln:R=>{ let p=R.int(-4,4); if(p===-1) p=2;
    return {fT:`\\frac{${xp(p)}}{\\ln(x)}`, aT:"1", aN:1, topT:xp(p), LT:String(1+p), Lv:1+p, botT:"\\ln(x)", dS:s=>s,
      why:s=>s<0?"$\\ln(x) < 0$ for $0 < x < 1$":"$\\ln(x) > 0$ for $x > 1$", f:x=>(x+p)/Math.log(x)}; },
  tan:()=>({fT:"\\tan(x)", aT:"\\frac{\\pi}{2}", aN:Math.PI/2, topT:"\\sin(x)", LT:"1", Lv:1, botT:"\\cos(x)", dS:s=>-s, tan:true,
      why:s=>s<0?"just left of $\\frac{\\pi}{2}$ (first quadrant) $\\cos(x) > 0$":"just right of $\\frac{\\pi}{2}$ (second quadrant) $\\cos(x) < 0$", f:x=>Math.tan(x)})
};
const infAns=(F,s)=>F.Lv*F.dS(s)>0?"inf":"-inf";
function infCheck(F,s,ans){ const y=F.f(F.aN+s*1e-7); const want=ans==="inf"?1:-1; if(!(Math.abs(y)>1e4 && Math.sign(y)===want)) throw new Error(`L18 sign check failed for ${F.fT} side ${s}`); }

/* ---------- determinate forms for the forms generator ---------- */
const FORMS={
  Lp:R=>{ const L=R.nz(-9,9); return {t:`\\frac{${L}}{0^+}`, ans:L>0?"inf":"-inf", L, why:`A number near $${L}$ divided by tiny ${"positive"} numbers. The size grows without bound and the sign is ${signWord(L)}.`}; },
  Lm:R=>{ const L=R.nz(-9,9); return {t:`\\frac{${L}}{0^-}`, ans:L>0?"-inf":"inf", L, why:`A number near $${L}$ divided by tiny negative numbers. The size grows without bound and the sign is ${L>0?"negative (positive over negative)":"positive (negative over negative)"}.`}; },
  Linf:R=>{ const L=R.nz(-9,9); return {t:`\\frac{${L}}{\\infty}`, ans:"0", L, why:`A number near $${L}$ divided by larger and larger numbers gets closer and closer to 0.`}; },
  zinf:()=>({t:"\\frac{0}{\\infty}", ans:"0", why:"Numbers near 0 divided by larger and larger numbers get closer and closer to 0."}),
  infL:R=>{ const L=R.nz(-9,9); return {t:`\\frac{\\infty}{${L}}`, ans:L>0?"inf":"-inf", L, why:`Larger and larger numbers divided by a number near $${L}$ stay larger and larger. The sign is ${L>0?"positive":"negative (positive over negative)"}.`}; },
  infzm:()=>({t:"\\frac{\\infty}{0^-}", ans:"-inf", why:"Larger and larger positive numbers divided by tiny negative numbers: the size grows and the sign is negative."}),
  infinf:()=>({t:"\\infty + \\infty", ans:"inf", why:"Adding two larger and larger positive numbers gives larger and larger positive numbers."}),
  Ltimes:R=>{ const L=R.nz(-9,9); return {t:`${L}\\cdot\\infty`, ans:L>0?"inf":"-inf", L, why:`A number near $${L}$ times larger and larger numbers: the size grows and the sign is ${signWord(L)}.`}; },
  zpow:()=>({t:"0^{\\infty}", ans:"0", pow:true, why:"Positive numbers near 0 raised to larger and larger powers get closer to 0 (for example $0.1^{10} = 0.0000000001$)."}),
  infpow:()=>({t:"\\infty^{\\infty}", ans:"inf", pow:true, why:"Larger and larger numbers raised to larger and larger powers grow without bound."}),
  infnpow:()=>({t:"\\infty^{-\\infty}", ans:"0", pow:true, why:"$\\infty^{-\\infty}$ behaves like $\\frac{1}{\\infty^{\\infty}}$: 1 divided by larger and larger numbers, so it approaches 0."}),
  ninfzp:()=>({t:"\\frac{-\\infty}{0^+}", ans:"-inf", why:"Larger and larger negative numbers divided by tiny positive numbers: the size grows and the sign stays negative."}),
  ninfzm:()=>({t:"\\frac{-\\infty}{0^-}", ans:"inf", why:"Larger and larger negative numbers divided by tiny negative numbers: the size grows and negative over negative is positive."}),
  Lnin:R=>{ const L=R.nz(-9,9); return {t:`${L}\\cdot(-\\infty)`, ans:L>0?"-inf":"inf", L, why:`A number near $${L}$ times larger and larger negative numbers: the size grows and the sign is ${L>0?"negative":"positive (negative times negative)"}.`}; },
  Lninf:R=>{ const L=R.nz(-9,9); return {t:`\\frac{${L}}{-\\infty}`, ans:"0", L, why:`A number near $${L}$ divided by numbers that get larger and larger in size gets closer and closer to 0.`}; }
};

M.lecture({
  id:"L18", n:18, date:"2026-10-26", added:"2026-10-26", unit:"u7", quiz:"Q6",
  title:"Limits as x Approaches a", sections:["3.1.1"], pages:7,
  summary:"What one-sided, two-sided and infinite limits mean, how to read them off a graph, the limit laws and direct substitution, piecewise and absolute value limits, and how to reason out a determinate form like $\\frac{3}{0^-}$ by asking what the top and bottom approach and with what sign.",
  flags:[
    {ref:"p. 3", text:"The limit laws start with \"Suppose the limits $\\lim_{x\\to a^+} f(x)$ and $\\lim_{x\\to a^+} g(x)$ exist\" and the notes then say \"We have stated the limit laws for right-hand limits\", but all seven laws are printed with $x \\to a$, not $x \\to a^+$. The laws work the same way for $x \\to a^+$, $x \\to a^-$ and $x \\to a$, as long as the limits you split into exist (and, for law 6, the bottom limit is not 0). The course notes (p. 131) print them with $x \\to a^+$."}
  ],
  formulas:[
    {id:"L18.f.right", name:"Right-hand limit", tex:"\\lim_{x\\to a^+} f(x) = L", note:"The values of $f(x)$ can be made as close to $L$ as we want by taking $x$ sufficiently close to $a$ where $x > a$.", ref:"p. 1",
      blank:{tex:"\\lim_{x\\to a^+} f(x) = L \\text{ uses only } x \\boxed{\\,?\\,} a", text:true, accept:[">","x>a",">a"]}},
    {id:"L18.f.left", name:"Left-hand limit", tex:"\\lim_{x\\to a^-} f(x) = L", note:"The values of $f(x)$ can be made as close to $L$ as we want by taking $x$ sufficiently close to $a$ where $x < a$.", ref:"p. 1",
      blank:{tex:"\\lim_{x\\to a^-} f(x) = L \\text{ uses only } x \\boxed{\\,?\\,} a", text:true, accept:["<","x<a","<a"]}},
    {id:"L18.f.two", name:"Two-sided limit", tex:"\\lim_{x\\to a} f(x) = L", note:"The values of $f(x)$ can be made as close to $L$ as we want by taking $x$ sufficiently close to $a$.", ref:"p. 1"},
    {id:"L18.f.iff", name:"Two-sided limit from one-sided limits", tex:"\\lim_{x\\to a} f(x) = L \\iff \\lim_{x\\to a^-} f(x) = L = \\lim_{x\\to a^+} f(x)", ref:"p. 1",
      blank:{tex:"\\lim_{x\\to a} f(x) = L \\iff \\lim_{x\\to a^-} f(x) = L = \\lim_{x\\to a^{\\boxed{\\,?\\,}}} f(x)", text:true, accept:["+","^+","a+","a^+","plus"]}},
    {id:"L18.f.dne", name:"When a limit does not exist", tex:"f(x) \\text{ not approaching a single number as } x \\to a \\;\\Rightarrow\\; \\text{the limit does not exist}", note:"This holds for any limit: $x \\to a^-$, $x \\to a^+$ or $x \\to a$.", ref:"p. 1"},
    {id:"L18.f.fa", name:"The value $f(a)$ does not matter", tex:"\\lim_{x\\to a^-} f(x),\\ \\lim_{x\\to a^+} f(x),\\ \\lim_{x\\to a} f(x) \\text{ do not depend on } f(a)", note:"Including whether $f(a)$ exists. A limit only looks at values of $f(x)$ as $x$ gets infinitely close to $a$.", ref:"p. 1"},
    {id:"L18.f.law1", name:"Limit law 1 (constant)", tex:"\\lim_{x\\to a} c = c", ref:"p. 3", blank:{tex:"\\lim_{x\\to a} c = \\boxed{\\,?\\,}", answer:"c", vars:["c"]}},
    {id:"L18.f.law2", name:"Limit law 2 ($x$)", tex:"\\lim_{x\\to a} x = a", ref:"p. 3", blank:{tex:"\\lim_{x\\to a} x = \\boxed{\\,?\\,}", answer:"a", vars:["a"]}},
    {id:"L18.f.law3", name:"Limit law 3 (sum and difference)", tex:"\\lim_{x\\to a}[f(x) \\pm g(x)] = \\lim_{x\\to a} f(x) \\pm \\lim_{x\\to a} g(x)", ref:"p. 3"},
    {id:"L18.f.law4", name:"Limit law 4 (constant multiple)", tex:"\\lim_{x\\to a}[cf(x)] = c\\lim_{x\\to a} f(x)", ref:"p. 3", blank:{tex:"\\lim_{x\\to a}[cf(x)] = \\boxed{\\,?\\,}\\lim_{x\\to a} f(x)", answer:"c", vars:["c"]}},
    {id:"L18.f.law5", name:"Limit law 5 (product)", tex:"\\lim_{x\\to a}[f(x)g(x)] = \\lim_{x\\to a} f(x)\\lim_{x\\to a} g(x)", ref:"p. 3"},
    {id:"L18.f.law6", name:"Limit law 6 (quotient)", tex:"\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\frac{\\lim_{x\\to a} f(x)}{\\lim_{x\\to a} g(x)}, \\text{ if } \\lim_{x\\to a} g(x) \\ne 0", ref:"p. 3",
      blank:{tex:"\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\frac{\\lim_{x\\to a} f(x)}{\\lim_{x\\to a} g(x)}, \\text{ if } \\lim_{x\\to a} g(x) \\ne \\boxed{\\,?\\,}", answer:"0", type:"num"}},
    {id:"L18.f.law7", name:"Limit law 7 (power)", tex:"\\lim_{x\\to a}[f(x)]^n = [\\lim_{x\\to a} f(x)]^n", note:"For any $n$, if $\\lim_{x\\to a} f(x)$ is in the domain of $(\\cdot)^n$.", ref:"p. 3",
      blank:{tex:"\\lim_{x\\to a}[f(x)]^n = [\\lim_{x\\to a} f(x)]^{\\boxed{\\,?\\,}}", answer:"n", vars:["n"], domain:[0.5,3]}},
    {id:"L18.f.laws-sides", name:"Limit laws for every kind of limit", tex:"\\text{The limit laws apply to } x\\to a^+,\\ x\\to a^- \\text{ and } x\\to a", note:"On quizzes and tests you do not have to state which limit law you used.", ref:"p. 3"},
    {id:"L18.f.subst", name:"Direct substitution", tex:"\\lim_{x\\to a^+} f(x) = f(a) \\quad\\text{and}\\quad \\lim_{x\\to a^-} f(x) = f(a)", note:"If $a$ is in the domain of $f$ and $f$ is any combination of constant functions, power functions, polynomials, rational functions and the absolute value function.", ref:"p. 3",
      blank:{tex:"\\lim_{x\\to a^-} f(x) = \\boxed{\\,?\\,} \\text{ (}a\\text{ in the domain, } f \\text{ built from polynomials, rational, power, absolute value)}", text:true, accept:["f(a)"]}},
    {id:"L18.f.abs", name:"Absolute value example", tex:"\\lim_{x\\to -1^-}\\frac{|x+1|}{x+1} = -1,\\quad \\lim_{x\\to -1^+}\\frac{|x+1|}{x+1} = 1", note:"Since $|x+1| = -(x+1)$ when $x < -1$ and $|x+1| = x+1$ when $x > -1$. So $\\lim_{x\\to -1}\\frac{|x+1|}{x+1}$ does not exist.", ref:"p. 4"},
    {id:"L18.f.inf", name:"Infinite limit (definition)", tex:"\\lim_{x\\to a^+} f(x) = \\infty \\quad\\text{or}\\quad \\lim_{x\\to a^+} f(x) = -\\infty", note:"$\\infty$: the values of $f$ can be made arbitrarily large and positive by making $x$ infinitely close to $a$ and greater than $a$. $-\\infty$: arbitrarily large and negative. Similar for $x \\to a^-$ and $x \\to a$.", ref:"p. 5"},
    {id:"L18.f.inf-dne", name:"An infinite limit does not exist", tex:"\\lim f(x) = \\pm\\infty \\;\\Rightarrow\\; \\text{the limit does not exist (the limit laws cannot be applied)}", note:"'$= \\infty$' tells you how the function diverges. It is not approaching a single number.", ref:"p. 5"},
    {id:"L18.f.tan", name:"Limit of tangent at $\\frac{\\pi}{2}$ from the left", tex:"\\lim_{x\\to \\frac{\\pi}{2}^-}\\tan(x) = \\infty", ref:"p. 5",
      blank:{tex:"\\lim_{x\\to \\frac{\\pi}{2}^-}\\tan(x) = \\boxed{\\,?\\,}", text:true, accept:["inf","∞","infinity","+inf","+∞","oo","\\infty"]}},
    {id:"L18.f.recip", name:"Limit of $\\frac{1}{x}$ at 0 from the left", tex:"\\lim_{x\\to 0^-}\\frac{1}{x} = -\\infty", ref:"p. 5",
      blank:{tex:"\\lim_{x\\to 0^-}\\frac{1}{x} = \\boxed{\\,?\\,}", text:true, accept:["-inf","-∞","-infinity","−∞","−inf","-oo","-\\infty"]}},
    {id:"L18.f.form", name:"Writing a form", tex:"\\frac{x+1}{x^2-4} \\text{ has the form } \\frac{3}{0^-} \\text{ as } x\\to 2^-", note:"The form describes the two parts: the top approaches 3, the bottom approaches 0 through negative values.", ref:"p. 6"},
    {id:"L18.f.zeros", name:"$0^+$ and $0^-$", tex:"0^+,\\ 0^- \\text{ describe how a quantity approaches zero}", note:"They are not numbers, and we are not actually dividing by zero.", ref:"p. 6"},
    {id:"L18.f.Lzm", name:"The form $\\frac{L}{0^-}$", tex:"\\frac{L}{0^-}: \\quad L > 0 \\Rightarrow -\\infty, \\qquad L < 0 \\Rightarrow \\infty", note:"$L$ is a non-zero number.", ref:"p. 6",
      blank:{tex:"\\frac{L}{0^-} \\text{ with } L > 0 \\text{ gives } \\boxed{\\,?\\,}", text:true, accept:["-inf","-∞","-infinity","−∞","−inf","-oo","-\\infty"]}},
    {id:"L18.f.det", name:"Determinate form (definition)", tex:"\\text{a form for an expression that is not defined whose value (or } \\pm\\infty\\text{) we can deduce immediately}", ref:"p. 6"},
    {id:"L18.f.det-list", name:"Some determinate forms", tex:"\\frac{L}{0^+},\\ \\frac{L}{0^-},\\ \\frac{L}{\\infty},\\ \\frac{0}{\\infty},\\ \\frac{\\infty}{L},\\ \\frac{\\infty}{0^-},\\ \\infty + \\infty,\\ L\\cdot\\infty,\\ 0^\\infty,\\ \\infty^\\infty", note:"$L$ is a non-zero number. When a limit has a determinate form, reason out its value.", ref:"p. 6"},
    {id:"L18.f.reason", name:"A way to reason about forms", tex:"\\text{1. What do the parts approach? 2. If a part} \\to 0\\text{, is it} + \\text{or} - \\text{nearby? 3. Magnitude? 4. Sign?}", note:"Ask yourself: what do the different parts approach; if a part approaches zero, is it positive or negative nearby; what happens to the magnitude of the expression; what sign does the expression have.", ref:"p. 6"},
    {id:"L18.f.side", name:"The side does not set the sign", tex:"x\\to 1^- \\;\\Rightarrow\\; 1 - x \\to 0^+", note:"The side from which $x$ approaches does not automatically tell you the sign of the denominator.", ref:"p. 7",
      blank:{tex:"x\\to 1^- \\;\\Rightarrow\\; 1 - x \\to 0^{\\boxed{\\,?\\,}}", text:true, accept:["+","^+","plus"]}},
    {id:"L18.f.arcsin", name:"Example with a form", tex:"\\lim_{x\\to 1^-}\\frac{\\arcsin(x)}{1-x} = \\infty \\text{ since it has the form } \\frac{\\frac{\\pi}{2}}{0^+}", note:"Do NOT write $\\lim_{x\\to 1^-}\\frac{\\arcsin(x)}{1-x} = \\frac{\\pi/2}{0^+}$. We cannot say something is equal to an expression that is not defined.", ref:"p. 7"}
  ],
  glossary:[
    {id:"L18.t.left", term:"Left-hand limit", def:"$\\lim_{x\\to a^-} f(x)$: the number the values of $f(x)$ approach as $x$ gets close to $a$ from below ($x < a$).", ref:"p. 1"},
    {id:"L18.t.right", term:"Right-hand limit", def:"$\\lim_{x\\to a^+} f(x)$: the number the values of $f(x)$ approach as $x$ gets close to $a$ from above ($x > a$).", ref:"p. 1"},
    {id:"L18.t.two", term:"Two-sided limit", def:"$\\lim_{x\\to a} f(x) = L$ exactly when both one-sided limits equal $L$. If they differ, or one does not exist, the two-sided limit does not exist.", ref:"p. 1"},
    {id:"L18.t.dne", term:"Does not exist", def:"A limit does not exist if the values of $f(x)$ are not approaching a single number. A limit that 'equals' $\\infty$ or $-\\infty$ also does not exist.", ref:"pp. 1, 5"},
    {id:"L18.t.inf", term:"Infinite limit", def:"$\\lim f(x) = \\infty$ (or $-\\infty$) means the values of $f$ become arbitrarily large and positive (or negative). It describes how the limit fails to exist.", ref:"p. 5"},
    {id:"L18.t.laws", term:"Limit laws", def:"Seven rules for splitting a limit into simpler limits (sums, constant multiples, products, quotients with a non-zero bottom, powers). They only apply when the limits involved exist.", ref:"p. 3"},
    {id:"L18.t.subst", term:"Direct substitution", def:"If $a$ is in the domain of $f$ and $f$ is built from constants, powers, polynomials, rational functions and absolute values, the limit at $a$ is just $f(a)$.", ref:"p. 3"},
    {id:"L18.t.zero", term:"$0^+$ and $0^-$", def:"Shorthand for 'approaches zero through positive values' and 'approaches zero through negative values'. They are not numbers.", ref:"p. 6"},
    {id:"L18.t.det", term:"Determinate form", def:"A form like $\\frac{3}{0^-}$ or $0^\\infty$ for an expression that is not defined, where you can deduce the value of the limit (or that it is $\\pm\\infty$) right away.", ref:"p. 6"}
  ],
  figures:{
    lecgraph:{title:"Read limits off the lecture graph", cap:"<b>Fig. 18.1</b> The graph from the example on p. 2. Drag the point along the $x$-axis toward the dashed line $x = a$ from each side and watch where the heights go. Open circles are not on the graph; filled dots are. (Lecture 18, p. 2)",
      build(host,{PLOT,M}){
        const f=x=>x<3?(Math.abs(x-2)<1e-9?1:x+1):x<=4?3+(4-x)*(4-x):4-(x-4)*(x-4);
        const G=PLOT.graph(host,{x:[-0.4,5.6],y:[-0.7,4.8],c:"var(--u7)",xlabel:"x",ylabel:"y",xstep:1,ystep:1,label:"Graph of f from the p. 2 example"});
        G.fn(x=>x+1,{from:0,to:3,cls:"cv c"}); G.fn(x=>3+(4-x)*(4-x),{from:3,to:4,cls:"cv c"}); G.fn(x=>4-(x-4)*(x-4),{from:4,to:5,cls:"cv c"});
        G.open(2,3); G.closed(2,1); G.closed(4,3); G.open(4,4);
        const D={2:{L:3,R:3,fv:1,fa:"1 (the filled dot at (2, 1))"},3:{L:4,R:4,fv:4,fa:"4 (the corner of the graph)"},4:{L:3,R:4,fv:3,fa:"3 (the filled dot at (4, 3))"}};
        let a=4, seen={l:false,r:false};
        const va=G.vline(a), drop=G.line(0,0,0,0,{cls:"lt dash"}), across=G.line(0,0,0,0,{cls:"lt dash"});
        const pt=G.dot(0,0,{filled:true});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        let h=null;
        PLOT.seg(ctl,{label:"Point a",value:"4",items:[["2","a = 2"],["3","a = 3"],["4","a = 4"]],onchange:v=>{ a=+v; seen={l:false,r:false}; va.set(a,G.y0,a,G.y1); h.move(a-0.9); }});
        function upd(x){
          const d=x-a, at=Math.abs(d)<0.011, near=Math.abs(d)<=0.2;
          const y=at?D[a].fv:f(x);
          pt.set(at?a:x,y); drop.set(at?a:x,0,at?a:x,y); across.set(0,y,at?a:x,y);
          if(near&&!at){ if(d<0) seen.l=true; else seen.r=true; }
          const side=at?"at a":d<0?"left of a":"right of a";
          let msg=`x = <b>${x.toFixed(2)}</b> (${side}) &nbsp; f(x) = <b>${y.toFixed(2)}</b><br>`;
          if(at) msg+=`At x = ${a} itself, f(${a}) = ${D[a].fa}. The limit ignores this value.`;
          else if(near) msg+=`Close to ${a} from the ${d<0?"left":"right"}: the heights approach <b>${d<0?D[a].L:D[a].R}</b>, so lim<sub>x→${a}${d<0?"⁻":"⁺"}</sub> f(x) = ${d<0?D[a].L:D[a].R}.`;
          else msg+=`Drag closer to x = ${a}.`;
          msg+="<br>";
          if(seen.l&&seen.r) msg+= D[a].L===D[a].R?`Both sides approach ${D[a].L}, so lim<sub>x→${a}</sub> f(x) = <b>${D[a].L}</b>.`:`Left side ${D[a].L}, right side ${D[a].R}: lim<sub>x→${a}</sub> f(x) <b>does not exist</b>.`;
          else msg+=`Visit both sides of ${a} to get the two-sided limit.`;
          ro.innerHTML=msg;
        }
        h=G.handle(a-0.9,0,{axis:"x",bounds:[0,5],step:0.02,label:"x value",onMove:x=>upd(x)});
        upd(a-0.9);
      }},
    sides:{title:"Close in from both sides", cap:"<b>Fig. 18.2</b> Shrink $h$ and compare $f(a-h)$ with $f(a+h)$. A jump gives two different one-sided limits, an asymptote sends the values off to $\\pm\\infty$, and the value at $x = a$ itself never enters. (Lecture 18, pp. 1 and 4 to 7)",
      build(host,{PLOT,M}){
        const C={
          jump:{a:-1, x:[-3,1], xs:0.5, y:[-2,2], f:x=>Math.abs(x+1)/(x+1), lim:["−1","1","does not exist"], fa:"not defined",
            draw:G=>{ G.fn(()=>-1,{from:-3,to:-1,cls:"cv c"}); G.fn(()=>1,{from:-1,to:1,cls:"cv c"}); G.open(-1,-1); G.open(-1,1); }},
          piece:{a:4, x:[-0.3,6], xs:1, y:[-1.5,5.5], f:x=>x<2?x*x-1:x===2?3:x<4?(x*x+2)/x:1/x, lim:["9/2","1/4","does not exist"], fa:"1/4",
            draw:G=>{ G.fn(x=>x*x-1,{from:0,to:2,cls:"cv c"}); G.fn(x=>(x*x+2)/x,{from:2,to:4,cls:"cv c"}); G.fn(x=>1/x,{from:4,to:6,cls:"cv c"}); G.closed(2,3); G.open(4,4.5); G.closed(4,0.25); }},
          asym:{a:2, x:[0,4], xs:0.5, y:[-8,8], f:x=>(x+1)/(x*x-4), lim:["−∞","∞","does not exist"], fa:"not defined",
            draw:G=>{ G.fn(x=>(x+1)/(x*x-4),{from:0,to:4,cls:"cv c"}); }},
          asin:{a:1, x:[-1.2,1.8], xs:0.5, y:[-2,20], f:x=>(x>=-1&&x<1)?Math.asin(x)/(1-x):NaN, lim:["∞","none: x > 1 is outside the domain of arcsin","only the left-hand limit makes sense here"], fa:"not defined",
            draw:G=>{ G.fn(x=>Math.asin(x)/(1-x),{from:-1,to:0.999,cls:"cv c"}); G.closed(-1,Math.asin(-1)/2); }}
        };
        let key="jump", s=0.3;
        const ctl=PLOT.controls(host);
        const wrapSeg=sg=>[...sg.children].forEach(b=>{ b.style.flex="1 0 auto"; b.style.minWidth="0"; });
        wrapSeg(PLOT.seg(ctl,{label:"Function",value:key,items:[["jump","|x+1|/(x+1)"],["piece","p. 4 piecewise"],["asym","(x+1)/(x²−4)"],["asin","arcsin(x)/(1−x)"]],onchange:v=>{ key=v; build(); }}));
        const wrap=document.createElement("div"); host.append(wrap);
        const ro=PLOT.readout(host), ctl2=PLOT.controls(host);
        PLOT.slider(ctl2,{label:"h (distance from a)",min:0,max:3,step:0.01,value:s,fmt:v=>Math.pow(10,-v).toPrecision(2),oninput:v=>{ s=v; upd(); }});
        let G, dl, dr, gl, gr;
        const fmt=v=>!isFinite(v)?"not defined":(Math.abs(v)>=100?v.toFixed(1):v.toFixed(4)).replace("-","−");
        function build(){
          wrap.innerHTML=""; const c=C[key];
          G=PLOT.graph(wrap,{x:c.x,y:c.y,xstep:c.xs,c:"var(--u7)",xlabel:"x",ylabel:"y",label:"Graph for the both-sides explorer"});
          G.vline(c.a); c.draw(G);
          gl=G.line(0,0,0,0,{cls:"lt dash"}); gr=G.line(0,0,0,0,{cls:"lt dash"});
          dl=G.dot(0,0,{filled:true}); dr=G.dot(0,0,{filled:true});
          upd();
        }
        function place(d,g,x,y,c){ const ok=isFinite(y)&&y>=c.y[0]&&y<=c.y[1]; d.style.display=ok?"":"none"; g.style.display=ok?"":"none"; if(ok){ d.set(x,y); g.set(x,0,x,y); } }
        function upd(){
          const c=C[key], h=Math.pow(10,-s), xl=c.a-h, xr=c.a+h, yl=c.f(xl), yr=c.f(xr);
          place(dl,gl,xl,yl,c); place(dr,gr,xr,yr,c);
          let msg=`a = ${String(c.a).replace("-","−")}, h = ${h.toPrecision(2)}<br>x = a − h = ${xl.toFixed(4).replace("-","−")}: &nbsp; f(x) = <b>${fmt(yl)}</b><br>x = a + h = ${xr.toFixed(4).replace("-","−")}: &nbsp; f(x) = <b>${fmt(yr)}</b><br>`;
          if(h<=0.011) msg+=`Left-hand limit: <b>${c.lim[0]}</b>. Right-hand limit: <b>${c.lim[1]}</b>. Two-sided: <b>${c.lim[2]}</b>. (f(a) is ${c.fa}, which does not matter.)`;
          else msg+=`Shrink h below 0.01 to see the limits.`;
          ro.innerHTML=msg;
        }
        build();
      }},
    table:{title:"Top and bottom, one at a time", cap:"<b>Fig. 18.3</b> A $\\frac{L}{0}$ limit, split into its top and its bottom. The graph shows only the bottom near $x = a$: whether it is above or below the axis on your side gives $0^+$ or $0^-$. The table shrinks $h$. (Lecture 18, pp. 5 to 7)",
      build(host,{PLOT,M}){
        const rich=t=>(M&&M.rich)?M.rich(t):t;
        const C={
          a:{a:2, aT:"2", top:x=>x+1, bot:x=>x*x-4, topT:"x + 1", botT:"x^2 - 4", LT:"3", Lv:3, sides:[-1,1], x:[0.8,3.2], y:[-4,7]},
          b:{a:-2, aT:"-2", top:x=>x+1, bot:x=>x*x-4, topT:"x + 1", botT:"x^2 - 4", LT:"-1", Lv:-1, sides:[-1,1], x:[-3.2,-0.8], y:[-4,7]},
          c:{a:1, aT:"1", top:x=>Math.asin(x), bot:x=>1-x, topT:"\\arcsin(x)", botT:"1 - x", LT:"\\frac{\\pi}{2}", Lv:Math.PI/2, sides:[-1], x:[-0.5,2], y:[-1.2,1.6]},
          d:{a:0, aT:"0", top:()=>1, bot:x=>x, topT:"1", botT:"x", LT:"1", Lv:1, sides:[-1,1], x:[-1.5,1.5], y:[-1.5,1.5]}
        };
        let key="a", side=-1;
        const ctl=PLOT.controls(host);
        const wrapSeg=sg=>[...sg.children].forEach(b=>{ b.style.flex="1 0 auto"; b.style.minWidth="0"; });
        wrapSeg(PLOT.seg(ctl,{label:"Limit",value:key,items:[["a","(x+1)/(x²−4), x→2"],["b","(x+1)/(x²−4), x→−2"],["c","arcsin(x)/(1−x), x→1"],["d","1/x, x→0"]],onchange:v=>{ key=v; build(); }}));
        PLOT.seg(ctl,{label:"Side",value:"-1",items:[["-1","from the left"],["1","from the right"]],onchange:v=>{ side=+v; build(); }});
        const wrap=document.createElement("div"); host.append(wrap);
        const tab=document.createElement("div"); tab.style.overflowX="auto"; tab.style.margin="8px 0"; host.append(tab);
        const ro=PLOT.readout(host);
        const m=v=>String(v).replace(/-/g,"−");
        function build(){
          const c=C[key]; wrap.innerHTML="";
          const G=PLOT.graph(wrap,{x:c.x,y:c.y,h:260,xstep:0.5,c:"var(--u7)",xlabel:"x",ylabel:"bottom",label:"Graph of the bottom of the fraction"});
          G.vline(c.a);
          const ok=c.sides.includes(side);
          G.fn(c.bot,{cls:"cv c"});
          if(ok){ [0.6,0.35,0.15].forEach(h=>{ const x=c.a+side*h; G.dot(x,c.bot(x),{filled:true}); }); }
          const sT=side<0?"-":"+", hs=[0.1,0.01,0.001,0.0001];
          if(!ok){ tab.innerHTML=""; ro.innerHTML=rich(`For $x > 1$, $\\arcsin(x)$ is not defined, so only the left-hand limit makes sense here. Switch the side to "from the left".`); return; }
          let rows=hs.map(h=>{ const x=c.a+side*h, t=c.top(x), b=c.bot(x); return `<tr><td>${m(x.toFixed(4))}</td><td>${m(t.toFixed(4))}</td><td>${m(b.toPrecision(3))}</td><td>${m((t/b).toFixed(1))}</td></tr>`; }).join("");
          tab.innerHTML=`<table style="border-collapse:collapse;width:100%;font-family:var(--mono);font-size:.86rem;text-align:right"><thead><tr><th style="padding:3px 6px">x</th><th style="padding:3px 6px">top</th><th style="padding:3px 6px">bottom</th><th style="padding:3px 6px">top/bottom</th></tr></thead><tbody>${rows}</tbody></table>`;
          tab.querySelectorAll("td").forEach(td=>{ td.style.padding="3px 6px"; td.style.borderTop="1px solid var(--rule)"; });
          const bs=Math.sign(c.bot(c.a+side*1e-6)), zs=bs>0?"+":"-", ans=c.Lv*bs>0?"\\infty":"-\\infty";
          ro.innerHTML=rich(`Top: $${c.topT} \\to ${c.LT}$. Bottom: $${c.botT} \\to 0^${zs}$ (it is ${bs>0?"above":"below"} the axis on this side).<br>The form is $\\frac{${c.LT}}{0^${zs}}$, so $\\displaystyle\\lim_{x\\to ${c.aT}^${sT}}\\frac{${c.topT}}{${c.botT}} = ${ans}$.`);
        }
        build();
      }}
  },
  gens:[
    {id:"L18.g.graph", title:"Limits from a graph", skill:"Read one-sided and two-sided limits off a graph", ref:"pp. 1 to 2",
      gen(R,d){
        const uid="l18g"+R.int(100000,999999);
        const other=ex=>R.pick([0,1,2,3,4].filter(v=>!ex.includes(v)));
        const types=d===1?["jumpL","jumpR","holeDot","holeNone"]:["jumpL","jumpR","holeDot","holeNone","cont","jumpOpen"];
        const asym=d===3&&R.int(0,1)===1;
        const B={};
        [2,4].forEach(b=>{
          if(b===4&&asym){ const s1=R.pick([1,-1]), rk=R.pick(["inf","-inf","fin"]);
            B[4]={b:4,type:"asym",s1,Lm:s1>0?"inf":"-inf",Lp:rk==="fin"?R.int(0,4):rk,fb:null};
            if(rk==="fin"&&R.int(0,1)){ B[4].fb=B[4].Lp; B[4].closedR=true; } return; }
          const t=R.pick(types), Lm=R.int(0,4);
          const Lp=(t==="jumpL"||t==="jumpR"||t==="jumpOpen")?other([Lm]):Lm;
          const fb=t==="jumpL"?Lm:t==="jumpR"?Lp:t==="holeDot"?other([Lm]):t==="holeNone"?null:t==="cont"?Lm:other([Lm,Lp]);
          B[b]={b,type:t,Lm,Lp,fb};
        });
        const y0=R.int(0,4), y6=R.int(0,4), P=[];
        P.push({f:x=>y0+(B[2].Lm-y0)*x/2,a:0,b:2,n:2});
        if(asym){ const A=B[2].Lp, s1=B[4].s1; P.push({f:x=>A+s1*(1/(4-x)-0.5),a:2,b:3.996,n:300});
          const rk=B[4].Lp;
          if(rk==="inf"||rk==="-inf"){ const t=rk==="inf"?1:-1; P.push({f:x=>y6+t*(1/(x-4)-0.5),a:4.004,b:6,n:300}); }
          else P.push({f:x=>rk+(y6-rk)*(x-4)/2,a:4,b:6,n:2});
        } else {
          const A=B[2].Lp, Z=B[4].Lm, k=R.pick([-0.8,0,0.8]);
          P.push({f:x=>A+(Z-A)*(x-2)/2+k*(x-2)*(x-4),a:2,b:4,n:k?40:2});
          const C=B[4].Lp, k2=R.pick([-0.6,0,0.6]);
          P.push({f:x=>C+(y6-C)*(x-4)/2+k2*(x-4)*(x-6),a:4,b:6,n:k2?40:2});
        }
        const marks=[], mk=(x,y,open)=>marks.push({x,y,open});
        [2,4].forEach(b=>{ const p=B[b];
          if(p.type==="asym"){ if(typeof p.Lp==="number") mk(4,p.Lp,!p.closedR); return; }
          if(p.type==="jumpL"){ mk(b,p.Lm,false); mk(b,p.Lp,true); }
          else if(p.type==="jumpR"){ mk(b,p.Lm,true); mk(b,p.Lp,false); }
          else if(p.type==="holeDot"){ mk(b,p.Lm,true); mk(b,p.fb,false); }
          else if(p.type==="holeNone"){ mk(b,p.Lm,true); }
          else if(p.type==="jumpOpen"){ mk(b,p.Lm,true); mk(b,p.Lp,true); mk(b,p.fb,false); }
        });
        const label="Graph of f on 0 to 6. "+marks.map(m=>`${m.open?"Open circle":"Filled dot"} at (${m.x}, ${m.y}).`).join(" ")+(asym?" Vertical asymptote at x = 4.":"");
        const svg=graphSVG({pieces:P,marks,asym:asym?[4]:[],uid,label});
        const tb=asym?4:R.pick([2,4]), T=B[tb];
        const kinds=d===1?[R.pick(["L","R"])]:d===2?R.pick([["two","f"],["L","R"],["two","f"]]):["L","R","two"];
        const two=T.Lm===T.Lp?T.Lm:"dne";
        const nums=new Set(); [T.Lm,T.Lp,T.fb].forEach(v=>{ if(typeof v==="number") nums.add(v); });
        while(nums.size<3) nums.add(other([...nums]));
        const numOpts=[...nums].sort((x,y)=>x-y).map(v=>`$${v}$`);
        const limOpts=numOpts.concat([DNE]).concat(d===3?[INF,NINF]:[]);
        const fOpts=numOpts.concat(["not defined"]);
        const val={L:T.Lm,R:T.Lp,two};
        const lab={L:`$\\lim_{x\\to ${tb}^-} f(x)$`,R:`$\\lim_{x\\to ${tb}^+} f(x)$`,two:`$\\lim_{x\\to ${tb}} f(x)$`,f:`$f(${tb})$`};
        const parts=kinds.map(k=>k==="f"?{label:lab.f,answer:{type:"mc",options:fOpts,correct:T.fb==null?fOpts.length-1:fOpts.indexOf(`$${T.fb}$`)}}
          :{label:lab[k],answer:{type:"mc",options:limOpts,correct:limOpts.indexOf(vO(val[k]))}});
        const sideLine=s=>{ const v=s<0?T.Lm:T.Lp, sg=sgnT(s), w=s<0?"left":"right";
          if(v==="inf"||v==="-inf") return `From the ${w} of $x = ${tb}$, the curve runs ${v==="inf"?"up":"down"} along the dashed asymptote $x = ${tb}$ and its values become arbitrarily large and ${v==="inf"?"positive":"negative"}, so $\\lim_{x\\to ${tb}^${sg}} f(x) = ${vT(v)}$.`;
          const m=marks.find(q=>q.x===tb&&q.y===v);
          const at=m?(m.open?`the open circle at $(${tb}, ${v})$`:`the filled dot at $(${tb}, ${v})$`):`the point $(${tb}, ${v})$, where the curve passes through`;
          return `Follow the curve toward $x = ${tb}$ from the ${w}. The heights approach ${at}. So $\\lim_{x\\to ${tb}^${sg}} f(x) = ${v}$.`; };
        const steps=[];
        if(kinds.includes("L")||kinds.includes("two")) steps.push(sideLine(-1));
        if(kinds.includes("R")||kinds.includes("two")) steps.push(sideLine(1));
        if(kinds.includes("two")) steps.push(two!=="dne"?`Both one-sided limits are $${vT(two)}$, so $\\lim_{x\\to ${tb}} f(x) = ${vT(two)}$.`:`The left side gives $${vT(T.Lm)}$ and the right side gives $${vT(T.Lp)}$. They are not the same, so $\\lim_{x\\to ${tb}} f(x)$ does not exist.`);
        if(kinds.includes("f")) steps.push(T.fb!=null?(T.type==="cont"?`The graph passes through $(${tb}, ${T.fb})$ with no break, so $f(${tb}) = ${T.fb}$.`:`The filled dot at $x = ${tb}$ is at $(${tb}, ${T.fb})$, so $f(${tb}) = ${T.fb}$.`)+`${two!=="dne"&&two!==T.fb?" The limit is a different number: the value of $f(a)$ does not affect a limit.":""}`:`There is no filled dot at $x = ${tb}$, so $f(${tb})$ is not defined.${two!=="dne"?" The limit still exists: $f(a)$ does not matter.":""}`);
        const ansParts=kinds.map(k=>k==="f"?(T.fb==null?`$f(${tb})$ is not defined`:`$f(${tb}) = ${T.fb}$`):(val[k]==="dne"?`${lab[k]} does not exist`:`$${lab[k].slice(1,-1)} = ${vT(val[k])}$`));
        return {prompt:`Use the graph of $f$ to evaluate ${kinds.length>1?"each of the following":"the limit"}.${svg}`+(d===3?`<p class="small muted">If a limit is $\\infty$ or $-\\infty$, pick that instead of "does not exist".</p>`:""),
          parts, hint:"Cover up what happens exactly at $x = a$. For a left-hand limit, look only at the curve just to the left of $a$ and ask what height it is heading to. Open circles show where the curve is heading, but they are not points on the graph.",
          steps, answerTeX:ansParts.join("; ")};
      }},
    {id:"L18.g.piecewise", title:"Limits of a piecewise function", skill:"One-sided and two-sided limits at the break points of a piecewise function", ref:"pp. 3 to 4",
      gen(R,d){
        const sideStep=(s,a,pc,cond)=>`For ${cond}, $f(x) = ${pc.tex}$. So $${limT(a,s)} f(x) = ${limT(a,s)}\\left(${pc.tex}\\right) = ${qT(pc.q(a))}$ (substitute $x = ${a}$).`;
        if(d===1){
          const a=R.int(-2,3), p1=pPoly(mkCo(R,R.pick(["lin","quad"]))); const co2=mkCo(R,R.pick(["lin","quad"]));
          if(R.int(0,4)<2) co2[co2.length-1]+=polyF(p1.co,a)-polyF(co2,a);
          const p2=pPoly(co2), leftIn=R.int(0,1)===1;
          const c1=leftIn?`x \\le ${a}`:`x < ${a}`, c2=leftIn?`x > ${a}`:`x \\ge ${a}`;
          const L=p1.q(a), Rv=p2.q(a), fa=leftIn?L:Rv, same=qEq(L,Rv);
          const opts=twoOpts([L,Rv,fa],L), correct=same?opts.indexOf(`$${qT(L)}$`):opts.length-1;
          return {prompt:`Let $$f(x) = \\begin{cases} ${p1.tex} & ${c1} \\\\ ${p2.tex} & ${c2} \\end{cases}$$ Find each limit.`,
            parts:[{label:`$${limT(a,-1)} f(x)$`,answer:{type:"num",answer:qA(L)}},{label:`$${limT(a,1)} f(x)$`,answer:{type:"num",answer:qA(Rv)}},{label:`$${limT(a,0)} f(x)$`,answer:{type:"mc",options:opts,correct}}],
            verify:{value:p1.f(a)},
            hint:`Left of $x = ${a}$ use the top formula, right of $x = ${a}$ use the bottom one. Each piece is a polynomial, so substitute $x = ${a}$.`,
            steps:[sideStep(-1,a,p1,`$x < ${a}$`),sideStep(1,a,p2,`$x > ${a}$`), same?`Both one-sided limits are $${qT(L)}$, so $${limT(a,0)} f(x) = ${qT(L)}$.`:`$${qT(L)} \\ne ${qT(Rv)}$, so $${limT(a,0)} f(x)$ does not exist.`],
            answerTeX:`$${qT(L)}$, $${qT(Rv)}$, ${same?`$${qT(L)}$`:"does not exist"}`};
        }
        if(d===2){
          const a=R.int(1,3); let p2;
          if(R.int(0,1)){ const k=R.int(0,1)?a*R.nz(-2,3):R.nz(-5,6); p2=pRatX(k); } else { const m=R.int(a-4,a-1), k=R.int(-4,4); p2=pRatL(k,m); }
          const co1=mkCo(R,R.pick(["lin","quad"])); const Rv=p2.q(a);
          if(Rv[1]===1&&R.int(0,1)) co1[co1.length-1]+=Rv[0]-polyF(co1,a);
          const p1=pPoly(co1), L=p1.q(a), same=qEq(L,Rv);
          const c=R.int(0,2)===0&&L[1]===1?L[0]:R.int(-3,6);
          const opts=twoOpts([L,Rv,Q(c)],L), correct=same?opts.indexOf(`$${qT(L)}$`):opts.length-1;
          return {prompt:`Let $$f(x) = \\begin{cases} ${p1.tex} & x < ${a} \\\\ ${c} & x = ${a} \\\\ ${p2.tex} & x > ${a} \\end{cases}$$ Find each limit.`,
            parts:[{label:`$${limT(a,-1)} f(x)$`,answer:{type:"num",answer:qA(L)}},{label:`$${limT(a,1)} f(x)$`,answer:{type:"num",answer:qA(Rv)}},{label:`$${limT(a,0)} f(x)$`,answer:{type:"mc",options:opts,correct}}],
            verify:{value:p1.f(a)},
            hint:`Use the formula for $x < ${a}$ on the left and the formula for $x > ${a}$ on the right. The value $f(${a}) = ${c}$ does not matter for any of the limits.`,
            steps:[sideStep(-1,a,p1,`$x < ${a}$`),sideStep(1,a,p2,`$x > ${a}$`)+` The bottom is not 0 at $x = ${a}$, so substitution is allowed.`, same?`Both one-sided limits are $${qT(L)}$, so $${limT(a,0)} f(x) = ${qT(L)}$. The value $f(${a}) = ${c}$ plays no part.`:`$${qT(L)} \\ne ${qT(Rv)}$, so $${limT(a,0)} f(x)$ does not exist. The value $f(${a}) = ${c}$ plays no part.`],
            answerTeX:`$${qT(L)}$, $${qT(Rv)}$, ${same?`$${qT(L)}$`:"does not exist"}`};
        }
        // d3: four pieces, like the exercise on p. 4
        const a=R.int(1,2), b=a+R.pick([2,3]);
        const p2=R.int(0,1)?pRatX(R.nz(-4,6)):pRatL(R.int(-4,4),R.int(a-4,a-1));
        const co1=mkCo(R,R.pick(["lin","quad"])); const A2=p2.q(a);
        if(A2[1]===1&&R.int(0,1)) co1[co1.length-1]+=A2[0]-polyF(co1,a);
        const p1=pPoly(co1), p3=R.int(0,1)?pRecip(R.nz(-6,6)):pPoly(mkCo(R,"lin"));
        const c=R.int(-3,6);
        const La=p1.q(a), Ra=A2, Lb=p2.q(b), Rb=p3.q(b), sameA=qEq(La,Ra), sameB=qEq(Lb,Rb);
        const optsB=twoOpts([Lb,Rb,Rb],Lb), optsA=twoOpts([La,Ra,Q(c)],La);
        return {prompt:`Let $$f(x) = \\begin{cases} ${p1.tex} & x < ${a} \\\\ ${c} & x = ${a} \\\\ ${p2.tex} & ${a} < x < ${b} \\\\ ${p3.tex} & x \\ge ${b} \\end{cases}$$ Find each limit.`,
          parts:[{label:`$${limT(b,-1)} f(x)$`,answer:{type:"num",answer:qA(Lb)}},{label:`$${limT(b,1)} f(x)$`,answer:{type:"num",answer:qA(Rb)}},
            {label:`$${limT(b,0)} f(x)$`,answer:{type:"mc",options:optsB,correct:sameB?optsB.indexOf(`$${qT(Lb)}$`):optsB.length-1}},
            {label:`$${limT(a,0)} f(x)$`,answer:{type:"mc",options:optsA,correct:sameA?optsA.indexOf(`$${qT(La)}$`):optsA.length-1}}],
          verify:{value:p2.f(b)},
          hint:`At each break point, use the piece that holds just to the left and the piece that holds just to the right. The single value at $x = ${a}$ does not matter.`,
          steps:[sideStep(-1,b,p2,`$${a} < x < ${b}$`),sideStep(1,b,p3,`$x \\ge ${b}$`), sameB?`Both sides give $${qT(Lb)}$, so $${limT(b,0)} f(x) = ${qT(Lb)}$.`:`$${qT(Lb)} \\ne ${qT(Rb)}$, so $${limT(b,0)} f(x)$ does not exist.`,
            sideStep(-1,a,p1,`$x < ${a}$`),sideStep(1,a,p2,`$${a} < x < ${b}$`), sameA?`Both sides give $${qT(La)}$, so $${limT(a,0)} f(x) = ${qT(La)}$ (the value $f(${a}) = ${c}$ does not matter).`:`$${qT(La)} \\ne ${qT(Ra)}$, so $${limT(a,0)} f(x)$ does not exist.`],
          answerTeX:`$${qT(Lb)}$, $${qT(Rb)}$, ${sameB?`$${qT(Lb)}$`:"does not exist"}, ${sameA?`$${qT(La)}$`:"does not exist"}`};
      }},
    {id:"L18.g.subst", title:"Limit laws and direct substitution", skill:"Evaluate a limit by substituting when $a$ is in the domain", ref:"p. 3",
      gen(R,d){
        const a=R.int(-3,3), s=R.pick([-1,0,0,1]), lt=limT(a,s);
        let fT, val, f, steps;
        if(d===1){
          const co=R.int(0,1)?[R.nz(-4,4),R.int(-6,6),R.int(-9,9)]:[R.nz(-2,2),R.int(-3,3),R.int(-5,5),R.int(-6,6)];
          fT=`\\left(${M.poly(co)}\\right)`; val=Q(polyF(co,a)); f=x=>polyF(co,x);
          steps=[`Polynomials are defined everywhere, so $${a}$ is in the domain and the limit is the value at $x = ${a}$.`,`$${lt}${fT} = ${subPoly(co,a)}$`,`$= ${qT(val)}$`];
        } else if(d===2){
          if(R.int(0,1)){ const co1=mkCo(R,R.pick(["lin","quad"])); let m=R.int(-4,4); if(m===a) m=a+R.pick([-2,2]); const co2=R.int(0,1)?[1,-m]:[1,0,R.int(1,6)];
            const top=polyF(co1,a), bot=polyF(co2,a);
            fT=`\\frac{${M.poly(co1)}}{${M.poly(co2)}}`; val=Q(top,bot); f=x=>polyF(co1,x)/polyF(co2,x);
            steps=[`At $x = ${a}$ the bottom is $${subPoly(co2,a)} = ${bot} \\ne 0$, so $${a}$ is in the domain of this rational function.`,`$${lt}${fT} = \\frac{${subPoly(co1,a)}}{${subPoly(co2,a)}} = \\frac{${top}}{${bot}}$`,`$= ${qT(val)}$`];
          } else { let p=R.int(-4,4); if(p===a) p+=3; let q=R.int(-4,5); if(a+q===0) q+=1;
            fT=`\\frac{|${xm(p)}|}{${xp(q)}}`; val=Q(Math.abs(a-p),a+q); f=x=>Math.abs(x-p)/(x+q);
            const sub1=(u,k)=>k===0?`${u}`:`${u} ${k<0?"-":"+"} ${Math.abs(k)}`;
            steps=[`At $x = ${a}$ the bottom is $${a+q} \\ne 0$. The function is built from an absolute value and a rational function, so substitute.`,`$${lt}${fT} = \\frac{|${sub1(a,-p)}|}{${sub1(a,q)}} = \\frac{|${a-p}|}{${a+q}} = \\frac{${Math.abs(a-p)}}{${a+q}}$`,`$= ${qT(val)}$`]; }
        } else {
          const kind=R.pick(["abs","sqrt","pow"]);
          if(kind==="abs"){ const p=R.int(1,9), k=R.nz(-4,4), q=R.int(1,6), top=Math.abs(a*a-p)+k*a, bot=a*a+q;
            fT=`\\frac{\\left|x^2 - ${p}\\right| ${k<0?"-":"+"} ${Math.abs(k)===1?"":Math.abs(k)}x}{x^2 + ${q}}`; val=Q(top,bot); f=x=>(Math.abs(x*x-p)+k*x)/(x*x+q);
            steps=[`The bottom $x^2 + ${q}$ is never 0, so $${a}$ is in the domain. Substitute.`,`$${lt}${fT} = \\frac{\\left|(${a})^2 - ${p}\\right| ${k<0?"-":"+"} ${Math.abs(k)===1?"":Math.abs(k)}(${a})}{(${a})^2 + ${q}} = \\frac{${Math.abs(a*a-p)} ${k*a<0?"-":"+"} ${Math.abs(k*a)}}{${bot}}$`,`$= ${qT(val)}$`];
          } else if(kind==="sqrt"){ const sq=R.int(Math.abs(a)+1,6), k=sq*sq-a*a; let m=R.int(-4,4); if(m===a) m=a+R.pick([-1,1,2]);
            fT=`\\frac{\\sqrt{x^2 + ${k}}}{${xm(m)}}`; val=Q(sq,a-m); f=x=>Math.sqrt(x*x+k)/(x-m);
            steps=[`At $x = ${a}$: $x^2 + ${k} = ${sq*sq} > 0$ (so the square root is defined) and the bottom is $${a-m} \\ne 0$. Substitute (a power function of a polynomial, divided by a polynomial).`,`$${lt}${fT} = \\frac{\\sqrt{${a*a} + ${k}}}{${a-m}} = \\frac{\\sqrt{${sq*sq}}}{${a-m}} = \\frac{${sq}}{${a-m}}$`,`$= ${qT(val)}$`];
          } else { let k=R.int(-3,3); if(Math.abs(a+k)>3) k=-a+R.int(-2,2); let m=R.int(-4,4); if(m===a) m=a+R.pick([-2,1,3]);
            const t=Math.pow(a+k,3);
            fT=`\\frac{(${xp(k)})^3}{${xm(m)}}`; val=Q(t,a-m); f=x=>Math.pow(x+k,3)/(x-m);
            steps=[`At $x = ${a}$ the bottom is $${a-m} \\ne 0$, so $${a}$ is in the domain. Substitute (limit laws 6 and 7).`,`$${lt}${fT} = \\frac{(${a+k})^3}{${a-m}} = \\frac{${t}}{${a-m}}$`,`$= ${qT(val)}$`];
          }
        }
        return {prompt:`Evaluate $$${lt}${fT}.$$`, answer:{type:"num",answer:qA(val),placeholder:"e.g. 3/4"}, verify:{value:f(a)},
          hint:"Check that $a$ is in the domain (no zero in a denominator, nothing negative under a square root). Then the limit is the value of the function at $a$.",
          steps, answerTeX:`$${lt}${fT} = ${qT(val)}$`};
      }},
    {id:"L18.g.abs", title:"Absolute value limits", skill:"Split an absolute value into its two cases to find one-sided limits", ref:"p. 4",
      gen(R,d){
        const v=d===1?R.pick(["V1","V1","V4"]):d===2?R.pick(["V1k","V2","V4"]):R.pick(["V3","V5","V2"]);
        if(v==="V4"){ let p=R.int(-4,4), c=R.int(-3,3); if(c===p) c=p+R.pick([-2,1,2]); let q=R.int(-4,5); if(c+q===0) q+=1;
          const val=Q(Math.abs(c-p),c+q), fT=`\\frac{|${xm(p)}|}{${xp(q)}}`;
          return {prompt:`Evaluate $$${limT(c,0)}${fT}.$$`, answer:{type:"num",answer:qA(val)}, verify:{value:Math.abs(c-p)/(c+q)},
            hint:`Is $x = ${c}$ a place where the absolute value changes its formula? If not, and the bottom is not 0 there, just substitute.`,
            steps:[`The formula for $|${xm(p)}|$ only changes at $x = ${p}$, and we are taking $x \\to ${c}$. The bottom is $${c+q} \\ne 0$ at $x = ${c}$.`,`So $${c}$ is in the domain and we substitute: $${limT(c,0)}${fT} = \\frac{|${c-p}|}{${c+q}} = \\frac{${Math.abs(c-p)}}{${c+q}}$.`,`$= ${qT(val)}$`],
            answerTeX:`$${qT(val)}$`};
        }
        let a, fT, L, Rv, lines, f;
        if(v==="V1"||v==="V1k"){ a=R.int(-4,4); const k=v==="V1"?1:R.pick([-3,-2,2,3,4,5]); const kk=k===1?"":String(k);
          fT=`\\frac{${kk}|${xm(a)}|}{${xm(a)}}`; L=-k; Rv=k; f=x=>k*Math.abs(x-a)/(x-a);
          const negX=a===0?"-x":`-(${xm(a)})`, topL=kk?`${kk}\\cdot(${negX})`:negX, topR=kk?`${kk}(${xm(a)})`:xm(a), pk=v=>v<0?`(${v})`:String(v);
          lines=[`${a===0?"For $x < 0$,":`For $x < ${a}$, $${xm(a)} < 0$, so`} $|${xm(a)}| = ${negX}$ and $${limT(a,-1)}${fT} = ${limT(a,-1)}\\frac{${topL}}{${xm(a)}} = ${limT(a,-1)}${pk(-k)} = ${-k}$.`,
            `${a===0?"For $x > 0$,":`For $x > ${a}$, $${xm(a)} > 0$, so`} $|${xm(a)}| = ${xm(a)}$ and $${limT(a,1)}${fT} = ${limT(a,1)}\\frac{${topR}}{${xm(a)}} = ${limT(a,1)}${pk(k)} = ${k}$.`]; }
        else if(v==="V2"){ a=R.int(-4,4); const bt=a===0?"-x":`${a} - x`;
          fT=`\\frac{|${xm(a)}|}{${bt}}`; L=1; Rv=-1; f=x=>Math.abs(x-a)/(a-x);
          lines=[`${a===0?"For $x < 0$,":`For $x < ${a}$, $${xm(a)} < 0$, so`} $|${xm(a)}| = ${a===0?"-x":`-(${xm(a)}) = ${bt}`}$ and $${limT(a,-1)}${fT} = ${limT(a,-1)}\\frac{${bt}}{${bt}} = ${limT(a,-1)} 1 = 1$.`,
            `For $x > ${a}$, $|${xm(a)}| = ${xm(a)} = -(${bt})$, so $${limT(a,1)}${fT} = ${limT(a,1)}\\frac{-(${bt})}{${bt}} = ${limT(a,1)}(-1) = -1$.`]; }
        else if(v==="V3"){ a=R.nz(-4,4); const top=M.poly([1,-a,0]);
          fT=`\\frac{${top}}{|${xm(a)}|}`; L=-a; Rv=a; f=x=>(x*x-a*x)/Math.abs(x-a);
          lines=[`Factor the top: $${top} = x(${xm(a)})$.`,
            `For $x < ${a}$, $|${xm(a)}| = -(${xm(a)})$, so $${limT(a,-1)}${fT} = ${limT(a,-1)}\\frac{x(${xm(a)})}{-(${xm(a)})} = ${limT(a,-1)}(-x) = ${-a}$.`,
            `For $x > ${a}$, $|${xm(a)}| = ${xm(a)}$, so $${limT(a,1)}${fT} = ${limT(a,1)}\\frac{x(${xm(a)})}{${xm(a)}} = ${limT(a,1)} x = ${a}$.`]; }
        else { a=R.int(1,3); const bt=`x^2 - ${a*a}`;
          fT=`\\frac{|${bt}|}{${xm(a)}}`; L=-2*a; Rv=2*a; f=x=>Math.abs(x*x-a*a)/(x-a);
          lines=[`$${bt} = (${xm(a)})(x + ${a})$, and $x + ${a} > 0$ near $x = ${a}$. So $${bt}$ has the same sign as $${xm(a)}$.`,
            `For $x < ${a}$ (near ${a}), $${bt} < 0$, so $${limT(a,-1)}${fT} = ${limT(a,-1)}\\frac{-(${xm(a)})(x + ${a})}{${xm(a)}} = ${limT(a,-1)}(-(x + ${a})) = ${-2*a}$.`,
            `For $x > ${a}$, $${bt} > 0$, so $${limT(a,1)}${fT} = ${limT(a,1)}\\frac{(${xm(a)})(x + ${a})}{${xm(a)}} = ${limT(a,1)}(x + ${a}) = ${2*a}$.`]; }
        const opts=twoOpts([Q(L),Q(Rv),Q(0)],Q(L));
        return {prompt:`Let $f(x) = ${fT}$. Find each limit.`,
          parts:[{label:`$${limT(a,-1)} f(x)$`,answer:{type:"num",answer:String(L)}},{label:`$${limT(a,1)} f(x)$`,answer:{type:"num",answer:String(Rv)}},{label:`$${limT(a,0)} f(x)$`,answer:{type:"mc",options:opts,correct:opts.length-1}}],
          verify:{value:f(a-1e-7)},
          hint:`The formula for $|${xm(a)}|$ changes at $x = ${a}$: it is $-(${xm(a)})$ when $x < ${a}$ and $${xm(a)}$ when $x > ${a}$. Use left and right limits.`,
          steps:lines.concat([`The one-sided limits $${L}$ and $${Rv}$ are different, so $${limT(a,0)} f(x)$ does not exist.`]),
          answerTeX:`$${L}$, $${Rv}$, does not exist`};
      }},
    {id:"L18.g.infinite", title:"Infinite limits: the form $\\frac{L}{0}$", skill:"Decide $\\infty$ or $-\\infty$ from the signs of the top and bottom", ref:"pp. 5 to 7",
      gen(R,d){
        const kinds=d===1?["F1","F2","F2"]:d===2?["F2","F3","F4","tan","cosx","asin"]:["F4n","F5","F2two","F3","asin","acos","exp","ln","tan"];
        const k=R.pick(kinds);
        const F=k==="F4n"?INFAM.F4(R,true):k==="F2two"?INFAM.F2(R):INFAM[k](R,false);
        const two=k==="F5"||k==="F2two";
        const limOpts=[INF,NINF,"$0$",DNE];
        if(two){
          const aL=infAns(F,-1), aR=infAns(F,1); infCheck(F,-1,aL); infCheck(F,1,aR);
          const ans=aL===aR?aL:"dne";
          return {prompt:`Evaluate $$${limT(F.aT,0)}${F.fT}.$$<p class="small muted">If the limit is $\\infty$ or $-\\infty$, pick that instead of "does not exist".</p>`,
            parts:[{answer:{type:"mc",options:limOpts,correct:limOpts.indexOf(vO(ans))}}],
            hint:"The bottom approaches 0, so the limit laws do not apply. Look at each side: what does the top approach, and is the bottom positive or negative there?",
            steps:[`Top: $${F.topT} \\to ${F.LT}$, a ${signWord(F.Lv)} number. Bottom: $${F.botT} \\to 0$.`,
              `From the left: ${F.why(-1)}, so the form is $\\frac{${F.LT}}{0^${F.dS(-1)>0?"+":"-"}}$ and $${limT(F.aT,-1)}${F.fT} = ${vT(aL)}$.`,
              `From the right: ${F.why(1)}, so the form is $\\frac{${F.LT}}{0^${F.dS(1)>0?"+":"-"}}$ and $${limT(F.aT,1)}${F.fT} = ${vT(aR)}$.`,
              ans!=="dne"?`Both sides go to $${vT(ans)}$, so $${limT(F.aT,0)}${F.fT} = ${vT(ans)}$.`:`The two sides go off in different directions, so $${limT(F.aT,0)}${F.fT}$ does not exist (and is not $\\infty$ or $-\\infty$).`],
            answerTeX:ans==="dne"?"Does not exist":`$${limT(F.aT,0)}${F.fT} = ${vT(ans)}$`};
        }
        const s=F.sides?F.sides[0]:R.pick([-1,1]);
        const ans=infAns(F,s); infCheck(F,s,ans);
        const ds=F.dS(s), zs=ds>0?"+":"-";
        const zOpts=["$0^+$ (through positive values)","$0^-$ (through negative values)"];
        const pre=F.tan?"Write $\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}$. ":"";
        return {prompt:`Evaluate $$${limT(F.aT,s)}${F.fT}.$$`,
          parts:[{label:`${pre}As $x\\to ${F.aT}^${sgnT(s)}$, the bottom $${F.botT}$ approaches`,answer:{type:"mc",options:zOpts,correct:ds>0?0:1}},
            {label:`$${limT(F.aT,s)}${F.fT} =$`,answer:{type:"mc",options:limOpts,correct:limOpts.indexOf(vO(ans))}}],
          hint:"Ask the four questions from p. 6: what do the top and bottom approach? Is the bottom positive or negative near $a$ on this side? Then the size grows without bound, and the sign is (sign of top) divided by (sign of bottom).",
          steps:[F.topConst?`Top: the constant $${F.LT}$, a ${signWord(F.Lv)} number.`:`${pre}Top: as $x\\to ${F.aT}^${sgnT(s)}$, $${F.topT} \\to ${F.LT}$, a ${signWord(F.Lv)} number.`,
            `Bottom: ${F.why(s)}. So $${F.botT} \\to 0^${zs}$.`,
            `The limit has the form $\\frac{${F.LT}}{0^${zs}}$: numbers near $${F.LT}$ divided by tiny ${signWord(ds)} numbers. The size grows without bound and the sign is ${signWord(F.Lv*ds)}.`,
            `So $${limT(F.aT,s)}${F.fT} = ${vT(ans)}$. (Write "has the form", never "$= \\frac{${F.LT}}{0^${zs}}$".)`],
          answerTeX:`$${limT(F.aT,s)}${F.fT} = ${vT(ans)}$`};
      }},
    {id:"L18.g.forms", title:"Evaluate a determinate form", skill:"Reason out what a determinate form gives", ref:"pp. 6 to 7",
      gen(R,d){
        const pool=d===1?["Lp","Lm","Linf","zinf"]:d===2?["Lp","Lm","infL","infzm","infinf","Ltimes","zinf"]:["zpow","infpow","infnpow","ninfzp","ninfzm","Lnin","Lninf","Ltimes","infzm"];
        const F=FORMS[R.pick(pool)](R);
        const opts=[INF,NINF,"$0$"];
        if(F.L!=null) opts.push(`$${F.L}$`); else if(F.pow) opts.push("$1$");
        const ansO=F.ans==="0"?"$0$":vO(F.ans);
        return {prompt:`Evaluate the determinate form $${F.t}$.`,
          parts:[{answer:{type:"mc",options:opts,correct:opts.indexOf(ansO)}}],
          hint:"Think of each part as a number that is getting close to its value: tiny, huge, or near $L$. Then ask what happens to the size of the whole expression and what its sign is.",
          steps:[F.why,`So $${F.t}$ gives $${F.ans==="0"?"0":vT(F.ans)}$.`],
          answerTeX:`$${F.ans==="0"?"0":vT(F.ans)}$`};
      }},
    {id:"L18.g.error", title:"Find the first mistake", skill:"Spot errors in limit work: signs, forms written as values, dropped lim", ref:"pp. 4 to 7",
      gen(R,d){
        const T=d===1?R.pick(["A","E"]):d===2?R.pick(["A","B","C","E"]):R.pick(["B","C","D","E","A"]);
        let lines, first, why, prompt;
        if(T==="A"){ // |x-a|/(x-a), p. 4 style
          const a=R.int(-4,4), xa=xm(a), E=`\\frac{|${xa}|}{${xa}}`;
          const e=R.pick(d===1?["e1","e3","e4","e6"]:d===2?["e1","e2","e3","e4","e6","none"]:["e2","e4","none"]);
          const L1=`$${limT(a,-1)}${E} = ${limT(a,-1)}\\frac{-(${xa})}{${xa}}$ since $${xa} < 0$ when $x < ${a}$`;
          let l1=L1, l2=`$= ${limT(a,-1)}(-1) = -1$`, l3=`$${limT(a,1)}${E} = ${limT(a,1)}\\frac{${xa}}{${xa}} = ${limT(a,1)} 1 = 1$ since $${xa} > 0$ when $x > ${a}$`, l4=`Thus, $${limT(a,0)}${E}$ does not exist.`;
          first=0; why="Every line is correct: the one-sided limits are $-1$ and $1$, which are different.";
          if(e==="e1"){ l1=`$${limT(a,-1)}${E} = ${limT(a,-1)}\\frac{${xa}}{${xa}}$ since $${xa} > 0$ when $x < ${a}$`; l2=`$= ${limT(a,-1)} 1 = 1$`; l4=`Both one-sided limits are 1, so $${limT(a,0)}${E} = 1$.`; first=1; why=`When $x < ${a}$, $${xa}$ is negative, so $|${xa}| = -(${xa})$. Line (1) has the sign wrong.`; }
          if(e==="e2"){ l1=`$${limT(a,-1)}${E} = \\frac{-(${xa})}{${xa}}$ since $${xa} < 0$ when $x < ${a}$`; l2=`$= -1$`; first=1; why=`Line (1) drops the $\\lim$ on the right side. The limit is not equal to the expression $\\frac{-(${xa})}{${xa}}$. Keep writing $\\lim$ until you actually take the limit.`; }
          if(e==="e3"){ l2=`$= ${limT(a,-1)}(-1) = 1$`; l4=`Both one-sided limits are 1, so $${limT(a,0)}${E} = 1$.`; first=2; why="The limit of the constant $-1$ is $-1$, not $1$ (limit law 1). Line (2) is wrong."; }
          if(e==="e4"){ l4=`Thus, $${limT(a,0)}${E} = 0$.`; first=4; why="The one-sided limits are $-1$ and $1$. They are different, so the two-sided limit does not exist. You cannot average them to get 0."; }
          if(e==="e6"){ l3=`$${limT(a,1)}${E} = ${limT(a,1)}\\frac{-(${xa})}{${xa}} = -1$ since $${xa} < 0$ when $x > ${a}$`; l4=`Both one-sided limits are $-1$, so $${limT(a,0)}${E} = -1$.`; first=3; why=`When $x > ${a}$, $${xa}$ is positive, so $|${xa}| = ${xa}$. Line (3) has the sign wrong.`; }
          lines=[l1,l2,l3,l4]; prompt=`A student evaluates $${limT(a,0)}${E}$:`;
        } else if(T==="B"){ // (x+p)/(x^2-c^2), pp. 5 to 6 style
          const c=R.int(1,3), s=R.pick([-1,1]); let p=R.int(-4,4); if(c+p===0) p+=1;
          const L=c+p, bt=`x^2 - ${c*c}`, E=`\\frac{${xp(p)}}{${bt}}`, z=s<0?"-":"+", zw=s<0?"+":"-", ans=L*s>0?"\\infty":"-\\infty", wrongAns=L*s>0?"-\\infty":"\\infty";
          const e=R.pick(d===2?["b1","b2","b4","none"]:["b2","b3","b4","none"]);
          let l1=`As $x\\to ${c}^${sgnT(s)}$, the top $${xp(p)} \\to ${L}$.`;
          let l2=`Since $x ${s<0?"<":">"} ${c}$ (and $x > 0$), $x^2 ${s<0?"<":">"} ${c*c}$, so $${bt} \\to 0^${z}$.`;
          let l3=`So $${E}$ has the form $\\frac{${L}}{0^${z}}$.`, l4=`Hence $${limT(c,s)}${E} = ${ans}$.`;
          first=0; why=`Every line is correct: the form $\\frac{${L}}{0^${z}}$ gives $${ans}$.`;
          if(e==="b1"){ let W=L+R.pick([-2,-1,1,2]); if(W===0) W=2*L; const wa=W*s>0?"\\infty":"-\\infty"; l1=`As $x\\to ${c}^${sgnT(s)}$, the top $${xp(p)} \\to ${W}$.`; l3=`So $${E}$ has the form $\\frac{${W}}{0^${z}}$.`; l4=`Hence $${limT(c,s)}${E} = ${wa}$.`; first=1; why=`The top approaches $${c} ${p<0?"-":"+"} ${Math.abs(p)} = ${L}$, not $${W}$.`; }
          if(e==="b2"){ l2=`Since $x\\to ${c}^${sgnT(s)}$, $${bt} \\to 0^${zw}$.`; l3=`So $${E}$ has the form $\\frac{${L}}{0^${zw}}$.`; l4=`Hence $${limT(c,s)}${E} = ${wrongAns}$.`; first=2; why=`For $x$ a little ${s<0?"less":"more"} than $${c}$, $x^2 ${s<0?"<":">"} ${c*c}$, so the bottom approaches $0^${z}$, not $0^${zw}$.`; }
          if(e==="b3"){ l3=`So $${limT(c,s)}${E} = \\frac{${L}}{0^${z}}$.`; first=3; why="Line (3) says the limit equals $\\frac{"+L+"}{0^"+z+"}$. That is an expression that is not defined, not a value. Write \"has the form\" (p. 7 warning)."; }
          if(e==="b4"){ l4=`Hence $${limT(c,s)}${E} = ${wrongAns}$.`; first=4; why=`The form $\\frac{${L}}{0^${z}}$ is ${signWord(L)} divided by ${s<0?"negative":"positive"}, which is ${signWord(L*s)}. So the limit is $${ans}$.`; }
          lines=[l1,l2,l3,l4]; prompt=`A student evaluates $${limT(c,s)}${E}$:`;
        } else if(T==="C"){ // N/(b - x) as x -> b^-, p. 7 warning
          const b=R.int(-3,4); let p=R.int(-5,5); if(b+p===0) p+=1;
          const L=b+p, bt=b===0?"-x":`${b} - x`, E=`\\frac{${xp(p)}}{${bt}}`, ans=L>0?"\\infty":"-\\infty", wrongAns=L>0?"-\\infty":"\\infty";
          const e=R.pick(d===2?["c1","c3","none"]:["c1","c2","none"]);
          let l1=`As $x\\to ${b}^-$, the top $${xp(p)} \\to ${L}$.`, l2=`Since $x < ${b}$, $${bt} \\to 0^+$.`, l3=`The limit has the form $\\frac{${L}}{0^+}$.`, l4=`So $${limT(b,-1)}${E} = ${ans}$.`;
          first=0; why=`Every line is correct. Approaching from the left makes $${bt}$ positive, so the form is $\\frac{${L}}{0^+}$.`;
          if(e==="c1"){ l2=`Since $x\\to ${b}^-$, $${bt} \\to 0^-$.`; l3=`The limit has the form $\\frac{${L}}{0^-}$.`; l4=`So $${limT(b,-1)}${E} = ${wrongAns}$.`; first=2; why=`The side does not automatically give the sign of the bottom (p. 7). When $x < ${b}$, $${bt} > 0$, so the bottom approaches $0^+$.`; }
          if(e==="c2"){ l3=`So $${limT(b,-1)}${E} = \\frac{${L}}{0^+}$.`; first=3; why="We cannot say a limit is equal to an expression that is not defined. Line (3) should say the limit has the form $\\frac{"+L+"}{0^+}$."; }
          if(e==="c3"){ l4=`So $${limT(b,-1)}${E} = ${wrongAns}$.`; first=4; why=`$\\frac{${L}}{0^+}$ is ${signWord(L)} divided by positive, so the limit is $${ans}$.`; }
          lines=[l1,l2,l3,l4]; prompt=`A student evaluates $${limT(b,-1)}${E}$:`;
        } else if(T==="D"){ // the 0/0 trap
          const a=R.int(1,5), E=`\\frac{x^2 - ${a*a}}{${xm(a)}}`, v=R.int(0,1);
          lines=[`As $x\\to ${a}$, the top $x^2 - ${a*a} \\to 0$.`,`As $x\\to ${a}$, the bottom $${xm(a)} \\to 0$.`, v?`So $${limT(a,0)}${E} = \\frac{0}{0}$.`:`So the limit has the form $\\frac{0}{0}$.`,`Therefore the limit does not exist.`];
          first=v?3:4; why=(v?"Line (3) writes the limit as equal to $\\frac{0}{0}$, an expression that is not defined. ":"")+`$\\frac{0}{0}$ is not one of the determinate forms on p. 6, so getting it tells you nothing yet, and you cannot conclude the limit does not exist. (In fact $\\frac{x^2 - ${a*a}}{${xm(a)}} = x + ${a}$ for $x \\ne ${a}$, so the limit is $${2*a}$.)`;
          prompt=`A student evaluates $${limT(a,0)}${E}$:`;
        } else { // piecewise with f(a) different from the limit
          const a=R.int(-2,3), co1=mkCo(R,"lin"), co2=mkCo(R,"quad"); co2[2]+=polyF(co1,a)-polyF(co2,a);
          const p1=pPoly(co1), p2=pPoly(co2), v=polyF(co1,a); let c=R.int(-4,6); if(c===v) c=v+R.pick([-3,2,4]);
          const e=R.pick(d===1?["t1","t2","t4"]:d===2?["t1","t2","t3","t4","none"]:["t2","t3","none"]);
          let l1=`$${limT(a,-1)} f(x) = ${limT(a,-1)}\\left(${p1.tex}\\right) = ${v}$`, l2=`$${limT(a,1)} f(x) = ${limT(a,1)}\\left(${p2.tex}\\right) = ${v}$`, l3=`Both one-sided limits are $${v}$, so $${limT(a,0)} f(x) = ${v}$.`;
          first=0; why=`Every line is correct. The value $f(${a}) = ${c}$ does not affect the limit.`;
          if(e==="t1"){ l1=`$${limT(a,-1)} f(x) = ${limT(a,-1)} ${c} = ${c}$`; l3=`The one-sided limits are different, so $${limT(a,0)} f(x)$ does not exist.`; first=1; why=`For $x < ${a}$ the formula is $${p1.tex}$, not the single value $f(${a}) = ${c}$. A limit never uses the value at $x = ${a}$.`; }
          if(e==="t2"){ l3=`Both one-sided limits are $${v}$, so $${limT(a,0)} f(x) = f(${a}) = ${c}$.`; first=3; why=`The two-sided limit is $${v}$. The value $f(${a}) = ${c}$ does not matter for the limit (p. 1).`; }
          if(e==="t3"){ l2=`$${limT(a,1)} f(x) = ${p2.tex} = ${v}$`; first=2; why=`Line (2) drops the $\\lim$: it says the expression $${p2.tex}$ equals $${v}$, which is false. Keep $\\lim$ until you substitute.`; }
          if(e==="t4"){ const w=v+R.pick([-2,-1,1,2]); l2=`$${limT(a,1)} f(x) = ${limT(a,1)}\\left(${p2.tex}\\right) = ${w}$`; l3=`The one-sided limits are different, so $${limT(a,0)} f(x)$ does not exist.`; first=2; why=`Substituting $x = ${a}$ into $${p2.tex}$ gives $${v}$, not $${w}$.`; }
          lines=[l1,l2,l3]; prompt=`Let $$f(x) = \\begin{cases} ${p1.tex} & x < ${a} \\\\ ${c} & x = ${a} \\\\ ${p2.tex} & x > ${a} \\end{cases}$$ A student evaluates $${limT(a,0)} f(x)$:`;
        }
        const ans=mkMC(lines.length,first);
        return {prompt:`${prompt}${listLines(lines)}Select the first line that has a mistake.`,
          parts:[{answer:ans}],
          hint:"Check each line on its own: right formula for the side? right sign for the bottom? Is a limit being set equal to a form or to an expression without $\\lim$? Is a conclusion drawn from $\\frac{0}{0}$?",
          steps:[why, first?`So the first mistake is in line (${first}).`:"So there is no mistake."],
          answerTeX:first?`Line (${first})`:"There is no mistake"};
      }}
  ],
  exam:[
    {id:"L18.q1", ref:"p. 2", q:"The graph of $f$ has an open circle at $(3, 2)$ and a filled dot at $(3, 5)$. On both sides of $x = 3$ the curve heads into the open circle. What is $\\lim_{x\\to 3} f(x)$?", opts:[
      ["$2$",1,"Both sides head to height 2. The filled dot is $f(3)$, which a limit ignores."],
      ["$5$",0,"That is $f(3)$. A limit only looks at values near $x = 3$, not at $x = 3$."],
      ["Does not exist",0,"Both one-sided limits are 2, so the limit exists."],
      ["$3.5$",0,"Never average values. The curve heads to 2 from both sides."]]},
    {id:"L18.q2", ref:"p. 1", multi:true, q:"Suppose $\\lim_{x\\to a} f(x) = L$. Select all statements that must be true.", opts:[
      ["$\\lim_{x\\to a^-} f(x) = L$",1,"The two-sided limit is $L$ exactly when both one-sided limits are $L$."],
      ["$\\lim_{x\\to a^+} f(x) = L$",1,"Same reason."],
      ["$f(a) = L$",0,"Not necessarily. The value of $f(a)$ does not matter for the limit."],
      ["$f(a)$ is defined",0,"Not necessarily. The limit can exist even when $f(a)$ does not."]]},
    {id:"L18.q3", ref:"p. 5", q:"True or false: if $\\lim_{x\\to 2^+} f(x) = \\infty$, then this limit exists.", opts:[
      ["False",1,"The values are not approaching a single number. '$= \\infty$' only says how the limit fails to exist."],
      ["True",0,"Despite the equal sign, a limit that 'equals' $\\infty$ does not exist (p. 5)."]]},
    {id:"L18.q4", ref:"p. 3", q:"$\\lim_{x\\to -2}\\frac{x^3 + 1}{x - 1} = $", opts:[
      ["$\\frac{7}{3}$",1,"The bottom is $-3 \\ne 0$, so substitute: $\\frac{-8 + 1}{-3} = \\frac{-7}{-3} = \\frac{7}{3}$."],
      ["$-\\frac{7}{3}$",0,"Check the sign: negative over negative is positive."],
      ["$3$",0,"$(-2)^3 = -8$, so the top is $-7$."],
      ["Does not exist",0,"$-2$ is in the domain, so direct substitution works."]]},
    {id:"L18.q5", ref:"pp. 6 to 7", q:"$\\lim_{x\\to 3^+}\\frac{x + 2}{3 - x} = $", opts:[
      ["$-\\infty$",1,"Top $\\to 5$. For $x > 3$, $3 - x < 0$, so the bottom $\\to 0^-$. The form $\\frac{5}{0^-}$ gives $-\\infty$."],
      ["$\\infty$",0,"Approaching from the right does not make the bottom positive here: $3 - x < 0$ when $x > 3$."],
      ["$0$",0,"Dividing by tiny numbers makes the size grow, not shrink."],
      ["$\\frac{5}{0}$",0,"A limit cannot equal an expression that is not defined."]]},
    {id:"L18.q6", ref:"p. 6", multi:true, q:"Select all the forms that are in the notes' list of determinate forms ($L$ is a non-zero number).", opts:[
      ["$\\frac{L}{0^-}$",1,"In the list. It gives $-\\infty$ if $L > 0$ and $\\infty$ if $L < 0$."],
      ["$0^\\infty$",1,"In the list. It gives 0."],
      ["$\\frac{0}{0}$",0,"Not in the list. Getting $\\frac{0}{0}$ tells you nothing yet."],
      ["$L\\cdot\\infty$",1,"In the list. It gives $\\pm\\infty$ with the sign of $L$."],
      ["$\\infty - \\infty$",0,"Not in the list (the list has $\\infty + \\infty$). The answer depends on how fast each part grows."]]},
    {id:"L18.q7", ref:"p. 7", q:"Evaluate the determinate form $\\frac{-4}{0^+}$.", opts:[
      ["$-\\infty$",1,"Negative divided by tiny positive numbers: large and negative."],
      ["$\\infty$",0,"The sign is negative over positive."],
      ["$0$",0,"Dividing by tiny numbers makes the size grow."],
      ["$-4$",0,"The bottom is shrinking toward 0, which changes the size a lot."]]},
    {id:"L18.q8", ref:"p. 5", q:"$\\lim_{x\\to \\frac{\\pi}{2}^+}\\tan(x) = $", opts:[
      ["$-\\infty$",1,"Just right of $\\frac{\\pi}{2}$, $\\sin(x)$ is near 1 and $\\cos(x)$ is a tiny negative number: the form $\\frac{1}{0^-}$."],
      ["$\\infty$",0,"That is the limit from the left (p. 5)."],
      ["$0$",0,"$\\cos(x) \\to 0$ on the bottom, so the size blows up."],
      ["$1$",0,"$\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}$, and the bottom goes to 0."]]},
    {id:"L18.q9", ref:"p. 7", q:"Three students finish $\\lim_{x\\to -1^+}\\frac{\\arccos(x)}{x + 1}$.<br>A: $= \\frac{\\pi}{0^+}$<br>B: $= \\infty$<br>C: $= -\\infty$<br>Which answer is fully correct?", opts:[
      ["Student B",1,"Top $\\to \\arccos(-1) = \\pi$. For $x > -1$, $x + 1 > 0$. The form $\\frac{\\pi}{0^+}$ gives $\\infty$."],
      ["Student A",0,"A limit cannot be equal to an expression that is not defined. Say it has the form $\\frac{\\pi}{0^+}$."],
      ["Student C",0,"The bottom is positive when $x > -1$, and $\\pi > 0$, so the sign is positive."],
      ["None of them",0,"Student B is right."]]},
    {id:"L18.q10", ref:"p. 4", q:"A student evaluates $\\lim_{x\\to 2}\\frac{2x - 4}{|x - 2|}$:<div>(1)&nbsp; $\\lim_{x\\to 2^-}\\frac{2x-4}{|x-2|} = \\lim_{x\\to 2^-}\\frac{2(x-2)}{-(x-2)}$ since $x - 2 < 0$ when $x < 2$</div><div>(2)&nbsp; $= \\lim_{x\\to 2^-}(-2) = -2$</div><div>(3)&nbsp; $\\lim_{x\\to 2^+}\\frac{2x-4}{|x-2|} = \\frac{2(x-2)}{x-2} = 2$</div><div>(4)&nbsp; Thus $\\lim_{x\\to 2}\\frac{2x-4}{|x-2|}$ does not exist.</div>Select the first line that has a mistake.", opts:[
      ["Line (3)",1,"It drops $\\lim$ on the right: the limit is not equal to the expression $\\frac{2(x-2)}{x-2}$. Write $\\lim_{x\\to 2^+}\\frac{2(x-2)}{x-2} = \\lim_{x\\to 2^+} 2 = 2$."],
      ["Line (1)",0,"Correct: $|x - 2| = -(x-2)$ when $x < 2$."],
      ["Line (2)",0,"Correct: $\\frac{2(x-2)}{-(x-2)} = -2$."],
      ["Line (4)",0,"The conclusion is right: $-2 \\ne 2$."],
      ["There is no mistake",0,"Look at how line (3) is written."]]},
    {id:"L18.q11", ref:"p. 4", q:"Let $f(x) = \\begin{cases} 2x - 1 & x < 3 \\\\ 7 & x = 3 \\\\ x^2 - 4 & x > 3 \\end{cases}$. What is $\\lim_{x\\to 3} f(x)$?", opts:[
      ["$5$",1,"Left: $2(3) - 1 = 5$. Right: $3^2 - 4 = 5$. Both sides agree, and $f(3) = 7$ does not matter."],
      ["$7$",0,"That is $f(3)$, which a limit ignores."],
      ["Does not exist",0,"Both one-sided limits are 5."],
      ["$6$",0,"Recheck: $2(3) - 1 = 5$."]]},
    {id:"L18.q12", ref:"p. 3", q:"True or false: $\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\frac{\\lim_{x\\to a} f(x)}{\\lim_{x\\to a} g(x)}$ whenever both limits on the right exist.", opts:[
      ["False",1,"Limit law 6 also needs $\\lim_{x\\to a} g(x) \\ne 0$."],
      ["True",0,"If the bottom limit is 0 you cannot split the quotient. That is when you reason with forms instead."]]}
  ],
  steps:[
    {type:"read", title:"What a limit asks", body:`<p>Picture walking along a graph toward the vertical line $x = a$ with your eyes on the height. A limit is the height you are heading to, not the height you find when you arrive.</p><div class="box def"><b class="t">Three kinds of limit (p. 1)</b><ul><li>$\\lim_{x\\to a^+} f(x) = L$: the values of $f(x)$ can be made as close to $L$ as we want by taking $x$ sufficiently close to $a$ where $x > a$ (from the right).</li><li>$\\lim_{x\\to a^-} f(x) = L$: the same, but with $x < a$ (from the left).</li><li>$\\lim_{x\\to a} f(x) = L$: the same, with $x$ sufficiently close to $a$ on either side.</li></ul></div><p>The two-sided limit is built from the one-sided ones:</p>$$\\lim_{x\\to a} f(x) = L \\iff \\lim_{x\\to a^-} f(x) = L = \\lim_{x\\to a^+} f(x)$$<p>If the values of $f(x)$ are not approaching a single number, the limit does not exist.</p><div class="box warn"><b class="t">Watch for this</b>The value of $f(a)$, and even whether $f(a)$ exists, does not matter. A limit only looks at values of $f(x)$ as $x$ gets infinitely close to $a$ (p. 1).</div>`, ref:"p. 1"},
    {type:"explore", title:"Walk toward a from each side", fig:"lecgraph", body:`<p>This is the graph from the example on p. 2. The open circle at $(2, 3)$ is a hole; the filled dot at $(2, 1)$ is the actual value $f(2)$. At $x = 4$ the curve on the left ends at the filled dot $(4, 3)$ and the curve on the right starts at the open circle $(4, 4)$.</p><p><b>Try it.</b> Pick $a = 4$. Drag the point from $x = 3$ toward 4 and read the heights, then drag it from $x = 5$ back toward 4. You get two different numbers, so the two-sided limit does not exist. Then pick $a = 2$: both sides head to 3 even though $f(2) = 1$.</p>`, ref:"p. 2"},
    {type:"example", title:"Read nine limits off one graph", ex:{q:"Use the graph on p. 2 (line from $(0, 1)$ to $(3, 4)$ with an open circle at $(2, 3)$ and a filled dot at $(2, 1)$; a curve from $(3, 4)$ down to the filled dot $(4, 3)$; an open circle at $(4, 4)$ and a curve down to $(5, 3)$) to evaluate the one-sided and two-sided limits at $x = 2, 3, 4$.", ref:"p. 2",
      steps:[{t:"(a) $\\lim_{x\\to 2^-} f(x) = 3$ and (b) $\\lim_{x\\to 2^+} f(x) = 3$",why:"From either side, the line heads into the open circle at height 3."},
        {t:"(c) $\\lim_{x\\to 2} f(x) = 3$",why:"Both one-sided limits are 3. The filled dot $f(2) = 1$ does not matter."},
        {t:"(d) $\\lim_{x\\to 3^-} f(x) = 4$, (e) $\\lim_{x\\to 3^+} f(x) = 4$, (f) $\\lim_{x\\to 3} f(x) = 4$",why:"The graph has a corner at $(3, 4)$ but no break, so both sides head to 4."},
        {t:"(g) $\\lim_{x\\to 4^-} f(x) = 3$",why:"From the left, the curve comes down to the filled dot at height 3."},
        {t:"(h) $\\lim_{x\\to 4^+} f(x) = 4$",why:"From the right, the curve starts at the open circle at height 4."},
        {t:"(i) $\\lim_{x\\to 4} f(x)$ does not exist",why:"The one-sided limits 3 and 4 are different."}],
      ans:"(a) 3, (b) 3, (c) 3, (d) 4, (e) 4, (f) 4, (g) 3, (h) 4, (i) does not exist."}},
    {type:"mcq", title:"Check yourself", q:"In the p. 2 graph, $f(2) = 1$ but $\\lim_{x\\to 2} f(x) = 3$. Why is that allowed?", opts:[
      ["A limit only looks at values of $f(x)$ as $x$ gets close to 2, not at $x = 2$",true,"Exactly the note on p. 1."],
      ["The filled dot at $(2, 1)$ must be a mistake",false,"Nothing is wrong. A function can have a hole with its actual value somewhere else."],
      ["Two-sided limits always equal the height of an open circle",false,"Not always: at $x = 4$ the two sides disagree and the limit does not exist."],
      ["Because $f(2)$ is less than 3",false,"The size of $f(2)$ has nothing to do with it."]]},
    {type:"try", title:"Your turn: read a graph", gen:"L18.g.graph"},
    {type:"read", title:"Limit laws and direct substitution", body:`<p>When you do not have a graph, you split a limit into simpler pieces with the limit laws (p. 3). For a constant $c$, when the limits involved exist:</p><ol><li>$\\lim_{x\\to a} c = c$</li><li>$\\lim_{x\\to a} x = a$</li><li>$\\lim_{x\\to a}[f(x) \\pm g(x)] = \\lim_{x\\to a} f(x) \\pm \\lim_{x\\to a} g(x)$</li><li>$\\lim_{x\\to a}[cf(x)] = c\\lim_{x\\to a} f(x)$</li><li>$\\lim_{x\\to a}[f(x)g(x)] = \\lim_{x\\to a} f(x)\\lim_{x\\to a} g(x)$</li><li>$\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\frac{\\lim_{x\\to a} f(x)}{\\lim_{x\\to a} g(x)}$, if $\\lim_{x\\to a} g(x) \\ne 0$</li><li>$\\lim_{x\\to a}[f(x)]^n = [\\lim_{x\\to a} f(x)]^n$, for any $n$, if $\\lim_{x\\to a} f(x)$ is in the domain of $(\\cdot)^n$</li></ol><p>They work for left-hand, right-hand and two-sided limits. On quizzes you do not have to say which law you used.</p><div class="box def"><b class="t">Direct substitution (p. 3)</b>If $a$ is in the domain of $f$ and $f$ is any combination of constant functions, power functions, polynomials, rational functions and the absolute value function, then $$\\lim_{x\\to a^+} f(x) = f(a) \\quad\\text{and}\\quad \\lim_{x\\to a^-} f(x) = f(a).$$</div><p>For example, $-1$ is in the domain of $\\frac{x^3 + 2x}{x - 3}$ (the bottom is $-4$), so $$\\lim_{x\\to -1}\\frac{x^3 + 2x}{x - 3} = \\frac{-1 - 2}{-4} = \\frac{3}{4}.$$</p><div class="box warn"><b class="t">Watch for this</b>Substitution needs $a$ in the domain. If the bottom goes to 0, law 6 does not apply and you need the reasoning later in this lecture. For a piecewise function, the formula can change at $a$, so use one-sided limits there.</div>`, ref:"p. 3"},
    {type:"example", title:"An absolute value at its corner", ex:{q:"Evaluate $\\lim_{x\\to -1}\\frac{|x+1|}{x+1}$.", ref:"p. 4",
      steps:[{t:"The formula for $|x+1|$ changes at $x = -1$, so use left and right limits.",why:"The absolute value function is a piecewise defined function."},
        {t:"$\\lim_{x\\to -1^-}\\frac{|x+1|}{x+1} = \\lim_{x\\to -1^-}\\frac{-(x+1)}{x+1}$",why:"$(x+1) < 0$ when $x < -1$, so $|x+1| = -(x+1)$."},
        {t:"$= \\lim_{x\\to -1^-}(-1) = -1$",why:"Cancel $x + 1$ (it is not 0 for $x \\ne -1$), then limit law 1."},
        {t:"$\\lim_{x\\to -1^+}\\frac{|x+1|}{x+1} = \\lim_{x\\to -1^+}\\frac{x+1}{x+1} = \\lim_{x\\to -1^+} 1 = 1$",why:"$(x+1) > 0$ when $x > -1$, so $|x+1| = x+1$."},
        {t:"Thus, $\\lim_{x\\to -1}\\frac{|x+1|}{x+1}$ does not exist.",why:"The one-sided limits $-1$ and $1$ are different."}],
      ans:"The limit does not exist (left $-1$, right $1$)."}},
    {type:"explore", title:"Close in from both sides", fig:"sides", body:`<p>For the piecewise exercise on p. 4, $f(x) = x^2 - 1$ for $x < 2$, $f(2) = 3$, $f(x) = \\frac{x^2 + 2}{x}$ for $2 < x < 4$ and $f(x) = \\frac{1}{x}$ for $x \\ge 4$. At $x = 4$ the left piece gives $\\frac{18}{4} = \\frac{9}{2}$ and the right piece gives $\\frac{1}{4}$.</p><p><b>Try it.</b> Pick the jump $\\frac{|x+1|}{x+1}$ and slide $h$ all the way down. The left point sits at $-1$, the right point at $1$. Then pick the p. 4 piecewise function and check $\\frac{9}{2}$ and $\\frac{1}{4}$. Last, pick $\\frac{x+1}{x^2-4}$: as $h$ shrinks, the values run off the screen in opposite directions.</p>`, ref:"pp. 4 to 7"},
    {type:"try", title:"Your turn: piecewise limits", gen:"L18.g.piecewise"},
    {type:"read", title:"Infinite limits and determinate forms", body:`<div class="box def"><b class="t">Infinite limits (p. 5)</b>If the values of $f$ can be made arbitrarily large and positive by making $x$ infinitely close to $a$ and greater than $a$, we write $\\lim_{x\\to a^+} f(x) = \\infty$. Arbitrarily large and negative: $\\lim_{x\\to a^+} f(x) = -\\infty$. Same idea for $x \\to a^-$ and $x \\to a$.</div><p>From the graphs: $\\lim_{x\\to\\frac{\\pi}{2}^-}\\tan(x) = \\infty$ and $\\lim_{x\\to 0^-}\\frac{1}{x} = -\\infty$.</p><div class="box warn"><b class="t">Important (p. 5)</b>Despite the equal sign, a limit that 'equals' $\\infty$ or $-\\infty$ does not exist. The notation tells you how the function diverges. You cannot apply the limit laws to such limits.</div><p>When the top approaches a non-zero number $L$ and the bottom approaches 0, write down the form. For $\\lim_{x\\to 2^-}\\frac{x+1}{x^2-4}$: the top approaches 3, and since $x < 2$, $x^2 < 4$, so the bottom approaches 0 through negative values. We say $\\frac{x+1}{x^2-4}$ has the form $\\frac{3}{0^-}$, and numbers near 3 divided by tiny negative numbers are huge and negative: the limit is $-\\infty$ (p. 6).</p><p>$0^+$ and $0^-$ describe how a quantity approaches zero. They are not numbers. The form $\\frac{L}{0^-}$ gives $-\\infty$ if $L > 0$ and $\\infty$ if $L < 0$.</p><div class="box def"><b class="t">Determinate forms (p. 6)</b>Forms for expressions that are not defined where we can immediately deduce the value (or that it is $\\pm\\infty$). With $L$ a non-zero number: $$\\frac{L}{0^+},\\ \\frac{L}{0^-},\\ \\frac{L}{\\infty},\\ \\frac{0}{\\infty},\\ \\frac{\\infty}{L},\\ \\frac{\\infty}{0^-},\\ \\infty + \\infty,\\ L\\cdot\\infty,\\ 0^\\infty,\\ \\infty^\\infty$$ (In $0^\\infty$ the base is a positive number near 0, so it gives 0.)</div><p>Four questions to ask (p. 6): What do the parts approach? If a part approaches zero, is it positive or negative nearby? What happens to the magnitude? What sign does the expression have?</p><div class="box warn"><b class="t">Two warnings (p. 7)</b>The side does not automatically give the sign of the bottom: as $x \\to 1^-$, $1 - x \\to 0^+$. And never write a limit equal to a form, like $= \\frac{\\pi/2}{0^+}$. Say it "has the form".</div>`, ref:"pp. 5 to 7"},
    {type:"explore", title:"Split the top from the bottom", fig:"table", body:`<p>The table shows the top, the bottom and the whole fraction for $x$ closer and closer to $a$. The graph shows only the bottom, so you can see its sign on the side you pick.</p><p><b>Try it.</b> Start with $\\frac{x+1}{x^2-4}$ as $x \\to 2$ from the left: top near 3, bottom tiny and negative, fraction large and negative. Then pick $x \\to -2$ from the left. $x$ is on the left again, but now $x^2 > 4$, so the bottom is positive. With top $\\to -1$, the form is $\\frac{-1}{0^+}$ and the limit is $-\\infty$.</p>`, ref:"pp. 5 to 7"},
    {type:"example", title:"A form with arcsin", ex:{q:"Evaluate $\\lim_{x\\to 1^-}\\frac{\\arcsin(x)}{1-x}$.", ref:"p. 7",
      steps:[{t:"Top: $\\arcsin(x) \\to \\arcsin(1) = \\frac{\\pi}{2}$",why:"As $x \\to 1$ from the left, the arcsin graph rises to $\\frac{\\pi}{2}$. This is a positive number."},
        {t:"Bottom: $1 - x \\to 0^+$",why:"$x < 1$, so $1 - x > 0$. Approaching from the left does not make the bottom negative (warning, p. 7)."},
        {t:"The limit has the form $\\frac{\\frac{\\pi}{2}}{0^+}$",why:"A positive number divided by tiny positive numbers: the size grows and the sign is positive."},
        {t:"$\\lim_{x\\to 1^-}\\frac{\\arcsin(x)}{1-x} = \\infty$",why:"Write the form in words next to the answer. Do not write $= \\frac{\\pi/2}{0^+}$: a limit cannot equal an expression that is not defined."}],
      ans:"$\\lim_{x\\to 1^-}\\frac{\\arcsin(x)}{1-x} = \\infty$, since it has the form $\\frac{\\frac{\\pi}{2}}{0^+}$."}},
    {type:"try", title:"Your turn: infinite limits", gen:"L18.g.infinite"},
    {type:"mcq", title:"Which line is written correctly?", q:"Which of these is a correct final line for $\\lim_{x\\to 2^-}\\frac{x+1}{x^2-4}$?", opts:[
      ["$\\lim_{x\\to 2^-}\\frac{x+1}{x^2-4} = -\\infty$, since it has the form $\\frac{3}{0^-}$",true,"The value is stated, and the form is given as the reason."],
      ["$\\lim_{x\\to 2^-}\\frac{x+1}{x^2-4} = \\frac{3}{0^-}$",false,"A limit cannot equal an expression that is not defined (p. 7)."],
      ["$\\lim_{x\\to 2^-}\\frac{x+1}{x^2-4} = \\infty$, since $x \\to 2^-$",false,"The sign is wrong: the bottom is negative for $x$ just below 2, so the limit is $-\\infty$."],
      ["$\\lim_{x\\to 2^-}\\frac{x+1}{x^2-4} = \\frac{3}{0}$, not defined",false,"An expression that is not defined is not an answer. Reason out the form instead."]],
      after:"Write the value, then give the form as the reason: \"$= -\\infty$, since it has the form $\\frac{3}{0^-}$\"."},
    {type:"try", title:"Find the first mistake", gen:"L18.g.error"},
    {type:"formulas", title:"Lecture 18 formulas"}
  ]
});
})();
