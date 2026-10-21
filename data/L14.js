/* Lecture 14 (Fri Oct 9): Inverse trig functions. Section 2.5.3. Notes: 5 pages. */
(function(){
"use strict";
const P=Math.PI;
const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; };
/* an angle k*pi/den: TeX, ascii (for answers), unicode (for readouts) and value */
function ang(k,den){
  if(k===0) return {t:"0",a:"0",u:"0",v:0};
  const g=gcd(k,den), n=k/g, d=den/g, s=n<0?"-":"", m=Math.abs(n), c=m===1?"":String(m);
  return {t:d===1?`${s}${c}\\pi`:`${s}\\frac{${c}\\pi}{${d}}`, a:d===1?`${n}*pi`:`${n}*pi/${d}`, u:d===1?`${s}${c}π`:`${s}${c}π/${d}`, v:k*P/den};
}
const k12=v=>Math.round(v/(P/12));
/* exact values of sin, cos, tan at multiples of pi/6 and pi/4 */
const EX=[[0,"0","0"],[0.5,"\\frac{1}{2}","1/2"],[Math.SQRT1_2,"\\frac{1}{\\sqrt{2}}","1/sqrt(2)"],[Math.sqrt(3)/2,"\\frac{\\sqrt{3}}{2}","sqrt(3)/2"],[1,"1","1"],[Math.sqrt(3),"\\sqrt{3}","sqrt(3)"],[1/Math.sqrt(3),"\\frac{1}{\\sqrt{3}}","1/sqrt(3)"]];
function exact(v){ const av=Math.abs(v); const e=EX.find(r=>Math.abs(r[0]-av)<1e-9); if(!e) return null; const neg=v<0&&av>1e-9; return {t:(neg?"-":"")+e[1], a:(neg?"-":"")+e[2], v:neg?-e[0]:e[0]}; }
const INV={
  arcsin:{f:"sin", fn:Math.sin, inv:Math.asin, ran:"\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]", dom:"[-1, 1]", lo:-P/2, hi:P/2},
  arccos:{f:"cos", fn:Math.cos, inv:Math.acos, ran:"[0, \\pi]", dom:"[-1, 1]", lo:0, hi:P},
  arctan:{f:"tan", fn:Math.tan, inv:Math.atan, ran:"\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)", dom:"(-\\infty, \\infty)", lo:-P/2, hi:P/2}
};
const inRange=(fn,v)=>{ const I=INV[fn]; return fn==="arctan"? (v>I.lo+1e-9 && v<I.hi-1e-9) : (v>=I.lo-1e-9 && v<=I.hi+1e-9); };
const par=s=>`\\left(${s}\\right)`;
/* the reasoning for arc(v) = angle, in the lecture's words */
function evalSteps(fn,X,A){
  const I=INV[fn], f=I.f, steps=[`We want the angle $\\theta$ in $${I.ran}$ with $\\${f}(\\theta) = ${X.t}$.`];
  if(X.v<-1e-9){
    const R=ang(k12(I.inv(-X.v)),12);
    steps.push(`The angle in quadrant I with $\\${f}(\\theta) = ${exact(-X.v).t}$ is $${R.t}$.`);
    steps.push(fn==="arccos"?`Cosine is negative in quadrant II, so $\\theta = \\pi - ${R.t} = ${A.t}$, which is in $[0, \\pi]$.`:`$\\${f}$ is negative for angles between $-\\frac{\\pi}{2}$ and $0$, so $\\theta = ${A.t}$, which is in $${I.ran}$.`);
  } else steps.push(`$\\${f}${par(A.t)} = ${X.t}$ and $${A.t}$ is in $${I.ran}$.`);
  steps.push(`So $\\${fn}${par(X.t)} = ${A.t}$.`);
  return steps;
}
/* sides of a right triangle: sqrt(sq) with a sign */
function side(sq,sign){ const r=Math.round(Math.sqrt(sq)), pf=r*r===sq; const body=pf?String(r):`\\sqrt{${sq}}`, asc=pf?String(r):`sqrt(${sq})`;
  return {t:(sign<0?"-":"")+body, a:(sign<0?"-":"")+asc, b:body, ba:asc, v:sign*Math.sqrt(sq), int:pf?sign*r:null, sq, sign, u:(sign<0?"−":"")+(pf?String(r):"√"+sq)}; }
const iside=n=>side(n*n,n<0?-1:1);
function ratio(top,bot){ const neg=(top.v<0)!==(bot.v<0);
  if(bot.int!=null&&Math.abs(bot.int)===1&&top.int==null) return {t:`${neg?"-":""}${top.b}`, a:`${neg?"-":""}${top.ba}`, v:top.v/bot.v};
  if(top.int!=null&&bot.int!=null) return {t:M127.frac(top.int,bot.int), a:M127.fracA(top.int,bot.int), v:top.v/bot.v};
  return {t:`${neg?"-":""}\\frac{${top.b}}{${bot.b}}`, a:`${neg?"-":""}(${top.ba})/(${bot.ba})`, v:top.v/bot.v}; }
const RAT={sin:["o","h"],cos:["a","h"],tan:["o","a"],csc:["h","o"],sec:["h","a"],cot:["a","o"]};
const TRIG={sin:Math.sin,cos:Math.cos,tan:Math.tan,csc:x=>1/Math.sin(x),sec:x=>1/Math.cos(x),cot:x=>1/Math.tan(x)};
/* build the let-statement triangle for arc(p/q) */
function triangle(fn,p,q){
  const c=M127.frac(p,q);
  let o,a,h,unk;
  if(fn==="arctan"){ o=iside(p); a=iside(q); h=side(p*p+q*q,1); unk="h"; }
  else if(fn==="arcsin"){ o=iside(p); h=iside(q); a=side(q*q-p*p,1); unk="a"; }
  else { a=iside(p); h=iside(q); o=side(q*q-p*p,1); unk="o"; }
  const S={o,a,h};
  const f=INV[fn].f, set=fn==="arctan"?"\\frac{o}{a}":fn==="arcsin"?"\\frac{o}{h}":"\\frac{a}{h}";
  const known=fn==="arctan"?`o = ${o.t}$ and $a = ${a.t}`:fn==="arcsin"?`o = ${o.t}$ and $h = ${h.t}`:`a = ${a.t}$ and $h = ${h.t}`;
  const sq=n=>n<0?`(${n})^2`:`${n}^2`;
  const lines=[];
  if(unk==="h"){ lines.push(`$h^2 = ${sq(o.int)} + ${sq(a.int)}$, so $h^2 = ${h.sq}$.`); lines.push(`$\\sqrt{h^2} = \\sqrt{${h.sq}}$, so $|h| = ${h.b}$.`); lines.push(`$h = ${h.b}$ since the hypotenuse $> 0$.`); }
  else { const U=unk, K=unk==="a"?o:a;
    lines.push(`$h^2 = o^2 + a^2$: $${sq(h.int)} = ${U==="a"?`${sq(o.int)} + a^2`:`o^2 + ${sq(a.int)}`}$, so $${U}^2 = ${S[U].sq}$.`);
    lines.push(`$\\sqrt{${U}^2} = \\sqrt{${S[U].sq}}$, so $|${U}| = ${S[U].b}$.`);
    lines.push(U==="a"?`$a = ${a.b}$ since $\\theta$ is in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$, where $\\cos(\\theta) \\ge 0$.`:`$o = ${o.b}$ since $\\theta$ is in $[0, \\pi]$, where $\\sin(\\theta) \\ge 0$.`); }
  const quad = fn==="arccos" ? (p<0?"\\frac{\\pi}{2} < \\theta < \\pi":"0 < \\theta < \\frac{\\pi}{2}") : (p<0?"-\\frac{\\pi}{2} < \\theta < 0":"0 < \\theta < \\frac{\\pi}{2}");
  return {S,c,f,set,known,lines,quad,theta:INV[fn].inv(p/q)};
}
const sideName={o:"opposite",a:"adjacent",h:"hypotenuse"};

M127.lecture({
  id:"L14", n:14, date:"2026-10-09", added:"2026-10-21", unit:"u5", quiz:"MT",
  title:"Inverse Trig Functions", sections:["2.5.3"], pages:5,
  summary:"arcsin, arccos and arctan: the intervals they come from, their domains and ranges, how to evaluate them, when arccos(cos(x)) = x, and the let statement for things like sec(arctan(2)).",
  flags:[
    {ref:"p. 5", text:"The notes write the domain of $\\arccos(\\cos(x))$ as $[-\\infty, \\infty]$. It should be $(-\\infty, \\infty)$: $\\infty$ is not a number, so it always gets a round bracket."},
    {ref:"course notes p. 103", text:"The course notes print the domain of arctan as $(\\infty, \\infty)$. It should be $(-\\infty, \\infty)$, all real numbers, as the lecture notes give on p. 2."}
  ],
  formulas:[
    {id:"L14.f.arccos-def", name:"Definition of arccos", tex:"\\arccos \\text{ is the inverse of } \\cos \\text{ on } [0, \\pi]", ref:"p. 1", blank:{tex:"\\arccos \\text{ is the inverse of } \\cos \\text{ on } \\boxed{\\,?\\,}", answer:"[0, pi]", type:"interval"}},
    {id:"L14.f.arccos-dom", name:"Domain of arccos", tex:"\\text{domain of } \\arccos = [-1, 1]", note:"A blank in the notes, filled with the standard answer.", ref:"p. 1", blank:{tex:"\\text{domain of } \\arccos = \\boxed{\\,?\\,}", answer:"[-1, 1]", type:"interval"}},
    {id:"L14.f.arccos-ran", name:"Range of arccos", tex:"\\text{range of } \\arccos = [0, \\pi]", note:"A blank in the notes, filled with the standard answer.", ref:"p. 1", blank:{tex:"\\text{range of } \\arccos = \\boxed{\\,?\\,}", answer:"[0, pi]", type:"interval"}},
    {id:"L14.f.io", name:"Input and output of an inverse trig function", tex:"\\arccos,\\ \\arcsin,\\ \\arctan \\text{ input a ratio and output an angle}", note:"Because cos, sin and tan input an angle and output a ratio. A blank in the notes, filled with the standard answer.", ref:"pp. 1, 2, 4", blank:{tex:"\\arccos \\text{ inputs a } \\boxed{\\,?\\,} \\text{ and outputs an angle}", text:true, accept:["ratio","a ratio","number","a number"]}},
    {id:"L14.f.notation", name:"Notation", tex:"\\arccos(x),\\ \\arcsin(x),\\ \\arctan(x) \\ \\text{ rather than } \\ \\cos^{-1}(x),\\ \\sin^{-1}(x),\\ \\tan^{-1}(x)", note:"The course avoids $\\cos^{-1}$ so it is not confused with $\\sec(x)=\\frac{1}{\\cos(x)}$ (and the same for csc and cot). Later courses will likely use $\\cos^{-1}$.", ref:"pp. 1, 2, 4"},
    {id:"L14.f.arctan-def", name:"Definition of arctan", tex:"\\arctan \\text{ is the inverse of } \\tan \\text{ on } \\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)", ref:"p. 2", blank:{tex:"\\arctan \\text{ is the inverse of } \\tan \\text{ on } \\boxed{\\,?\\,}", answer:"(-pi/2, pi/2)", type:"interval"}},
    {id:"L14.f.arctan-dom", name:"Domain of arctan", tex:"\\text{domain of } \\arctan = (-\\infty, \\infty)", note:"All real numbers. A blank in the notes, filled with the standard answer.", ref:"p. 2", blank:{tex:"\\text{domain of } \\arctan = \\boxed{\\,?\\,}", answer:"(-inf, inf)", type:"interval"}},
    {id:"L14.f.arctan-ran", name:"Range of arctan", tex:"\\text{range of } \\arctan = \\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)", note:"A blank in the notes, filled with the standard answer.", ref:"p. 2", blank:{tex:"\\text{range of } \\arctan = \\boxed{\\,?\\,}", answer:"(-pi/2, pi/2)", type:"interval"}},
    {id:"L14.f.arctan-asym", name:"Horizontal asymptotes of arctan", tex:"\\arctan(x) \\to \\frac{\\pi}{2} \\text{ as } x \\to \\infty, \\qquad \\arctan(x) \\to -\\frac{\\pi}{2} \\text{ as } x \\to -\\infty", ref:"p. 2", blank:{tex:"\\arctan(x) \\to \\boxed{\\,?\\,} \\text{ as } x \\to \\infty", answer:"pi/2", type:"num"}},
    {id:"L14.f.let", name:"The let statement", tex:"\\text{Let } \\theta = \\arctan(2). \\text{ Then } \\tan(\\theta) = 2 \\text{ and } 0 < \\theta < \\frac{\\pi}{2}.", note:"Then draw a right triangle with $\\frac{o}{a} = \\frac{2}{1}$ and find the missing side with $h^2 = o^2 + a^2$.", ref:"p. 3", blank:{tex:"\\text{Let } \\theta = \\arctan(2). \\text{ Then } \\tan(\\theta) = \\boxed{\\,?\\,}", answer:"2", type:"num"}},
    {id:"L14.f.arcsin-def", name:"Definition of arcsin", tex:"\\arcsin \\text{ is the inverse of } \\sin \\text{ on } \\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]", ref:"p. 3", blank:{tex:"\\arcsin \\text{ is the inverse of } \\sin \\text{ on } \\boxed{\\,?\\,}", answer:"[-pi/2, pi/2]", type:"interval"}},
    {id:"L14.f.arcsin-dom", name:"Domain of arcsin", tex:"\\text{domain of } \\arcsin = [-1, 1]", note:"A blank in the notes, filled with the standard answer.", ref:"p. 3", blank:{tex:"\\text{domain of } \\arcsin = \\boxed{\\,?\\,}", answer:"[-1, 1]", type:"interval"}},
    {id:"L14.f.arcsin-ran", name:"Range of arcsin", tex:"\\text{range of } \\arcsin = \\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]", note:"A blank in the notes, filled with the standard answer.", ref:"p. 3", blank:{tex:"\\text{range of } \\arcsin = \\boxed{\\,?\\,}", answer:"[-pi/2, pi/2]", type:"interval"}},
    {id:"L14.f.cos-arccos", name:"Cancellation: cos of arccos", tex:"\\cos(\\arccos(x)) = x \\quad \\text{for } x \\in [-1, 1]", ref:"p. 4", blank:{tex:"\\cos(\\arccos(x)) = x \\quad \\text{for } x \\in \\boxed{\\,?\\,}", answer:"[-1, 1]", type:"interval"}},
    {id:"L14.f.arccos-cos", name:"Cancellation: arccos of cos", tex:"\\arccos(\\cos(x)) = x \\quad \\text{only for } x \\in [0, \\pi]", note:"Outside $[0, \\pi]$, work out $\\cos(x)$ first, then take arccos.", ref:"p. 5", blank:{tex:"\\arccos(\\cos(x)) = x \\quad \\text{only for } x \\in \\boxed{\\,?\\,}", answer:"[0, pi]", type:"interval"}},
    {id:"L14.f.val-arccos", name:"Special value of arccos", tex:"\\arccos\\left(-\\frac{1}{\\sqrt{2}}\\right) = \\frac{3\\pi}{4}", ref:"p. 1", blank:{tex:"\\arccos\\left(-\\frac{1}{\\sqrt{2}}\\right) = \\boxed{\\,?\\,}", answer:"3pi/4", type:"num"}},
    {id:"L14.f.val-arctan", name:"Special value of arctan", tex:"\\arctan\\left(\\frac{1}{\\sqrt{3}}\\right) = \\frac{\\pi}{6}", ref:"p. 2", blank:{tex:"\\arctan\\left(\\frac{1}{\\sqrt{3}}\\right) = \\boxed{\\,?\\,}", answer:"pi/6", type:"num"}},
    {id:"L14.f.val-arctanpi", name:"arctan of tan of pi", tex:"\\arctan(\\tan(\\pi)) = \\arctan(0) = 0", note:"$\\pi$ is not in the range of arctan, so you cannot cancel.", ref:"p. 3", blank:{tex:"\\arctan(\\tan(\\pi)) = \\boxed{\\,?\\,}", answer:"0", type:"num"}},
    {id:"L14.f.val-arcsin", name:"Special value of arcsin", tex:"\\arcsin\\left(-\\frac{1}{\\sqrt{2}}\\right) = -\\frac{\\pi}{4}", ref:"p. 4", blank:{tex:"\\arcsin\\left(-\\frac{1}{\\sqrt{2}}\\right) = \\boxed{\\,?\\,}", answer:"-pi/4", type:"num"}}
  ],
  glossary:[
    {id:"L14.t.arccos", term:"arccos", def:"The inverse of cos on $[0, \\pi]$. It takes a ratio in $[-1, 1]$ and gives back the angle in $[0, \\pi]$ with that cosine. $\\arccos\\left(\\frac{1}{2}\\right) = \\frac{\\pi}{3}$.", ref:"p. 1"},
    {id:"L14.t.arctan", term:"arctan", def:"The inverse of tan on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$. It takes any real number and gives back the angle in $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ with that tangent.", ref:"p. 2"},
    {id:"L14.t.arcsin", term:"arcsin", def:"The inverse of sin on $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$. It takes a ratio in $[-1, 1]$ and gives back the angle in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ with that sine.", ref:"p. 3"},
    {id:"L14.t.restrict", term:"Restricted interval", def:"A piece of the domain where a trig function is one-to-one, so it has an inverse there. cos uses $[0, \\pi]$, tan uses $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, sin uses $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$. These intervals become the ranges of the inverses.", ref:"pp. 1 to 3"},
    {id:"L14.t.cancel", term:"Cancellation Property", def:"An inverse undoes its function, but only for inputs in the right set. $\\cos(\\arccos(x)) = x$ for every $x$ in $[-1, 1]$, while $\\arccos(\\cos(x)) = x$ only when $x$ is in $[0, \\pi]$.", ref:"pp. 4 to 5"},
    {id:"L14.t.let", term:"Let statement", def:"To simplify something like $\\sec(\\arctan(2))$, write \"Let $\\theta = \\arctan(2)$\". Then $\\tan(\\theta) = 2$ and you can draw a right triangle for $\\theta$.", ref:"p. 3"},
    {id:"L14.t.asym", term:"Horizontal asymptote of arctan", def:"The graph of arctan flattens out toward $\\frac{\\pi}{2}$ as $x \\to \\infty$ and toward $-\\frac{\\pi}{2}$ as $x \\to -\\infty$. It never reaches them.", ref:"p. 2"},
    {id:"L14.t.ratio", term:"Ratio and angle", def:"sin, cos and tan take an angle and give a ratio of side lengths. Their inverses do the reverse: they take a ratio and give an angle.", ref:"p. 1"}
  ],
  figures:{
    reflect:{title:"A trig function and its inverse", cap:"<b>Fig. 14.1</b> Each trig function cut down to the interval where it is one-to-one (ink), and its inverse (colour). The inverse is the reflection in the line $y = x$, so the domain and range swap. (Lecture 14, pp. 1 to 3)",
      build(host,{PLOT}){
        const D={
          cos:{f:Math.cos,g:Math.acos,a:0,b:P,ha:0,hb:12,x:[-2.2,6.1],y:[-1.6,3.6],nm:"cos",inm:"arccos",I:"[0, π]",Rg:"[−1, 1]",start:8,
            ends:[[0,1,"(0, 1)",-7,-6],[P,-1,"(π, −1)",7,4],[1,0,"(1, 0)",6,15],[-1,P,"(−1, π)",7,-2]]},
          sin:{f:Math.sin,g:Math.asin,a:-P/2,b:P/2,ha:-6,hb:6,x:[-3.36,3.36],y:[-2.1,2.1],nm:"sin",inm:"arcsin",I:"[−π/2, π/2]",Rg:"[−1, 1]",start:2,
            ends:[[P/2,1,"(π/2, 1)",7,4],[-P/2,-1,"(−π/2, −1)",-7,4],[1,P/2,"(1, π/2)",7,-2],[-1,-P/2,"(−1, −π/2)",-7,6]]},
          tan:{f:Math.tan,g:Math.atan,a:-P/2+0.002,b:P/2-0.002,ha:-4,hb:4,x:[-4.8,4.8],y:[-3,3],nm:"tan",inm:"arctan",I:"(−π/2, π/2)",Rg:"(−∞, ∞)",start:3,ends:[]}
        };
        let key="cos";
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Function",items:[["cos","cos"],["sin","sin"],["tan","tan"]],value:key,onchange:v=>{ key=v; draw(); }});
        const box=document.createElement("div"); host.append(box);
        const ro=PLOT.readout(host);
        const piU=t=>ang(k12(t),12).u;
        function draw(){
          box.innerHTML=""; const S=D[key];
          const G=PLOT.graph(box,{x:S.x,y:S.y,h:360,c:"var(--u5)",xstep:1,ystep:1,samples:500});
          const lo=Math.max(S.x[0],S.y[0]), hi=Math.min(S.x[1],S.y[1]);
          G.line(lo,lo,hi,hi,{cls:"lt dash"});
          G.fn(S.f,{cls:"lt dash"});
          if(key==="tan"){ G.vline(-P/2); G.vline(P/2); G.hline(-P/2); G.hline(P/2); }
          G.fn(S.f,{from:S.a,to:S.b,cls:"cv"});
          G.fn(S.g,{from:key==="tan"?S.x[0]:-1,to:key==="tan"?S.x[1]:1,cls:"cv c"});
          S.ends.forEach(([x,y,t,dx,dy])=>{ G.closed(x,y,{r:3.5}); G.label(x,y,t,{cls:"lblc",dx,dy,anchor:dx>0?"start":"end"}); });
          const conn=G.line(0,0,0,0,{cls:"lt dash",layer:G.layer.front});
          const mir=G.dot(0,0,{filled:true});
          const upd=t=>{ const r=S.f(t); conn.set(t,r,r,t); mir.set(r,t);
            ro.innerHTML=`θ = <b>${piU(t)}</b> ≈ ${t.toFixed(3)}, so ${S.nm}(θ) = <b>${r.toFixed(3)}</b>. Reflected point: ${S.inm}(<b>${r.toFixed(3)}</b>) = <b>${t.toFixed(3)}</b>.<br>${S.nm} on ${S.I} has range ${S.Rg}. So ${S.inm} has domain ${S.Rg} and range ${S.I}.<br><span class="muted">Ink: ${S.nm} on ${S.I}. Colour: ${S.inm}. Dashed: the line y = x and the rest of ${S.nm}${key==="tan"?", plus the asymptotes at ±π/2":""}.</span>`; };
          const t0=S.start*P/12;
          G.handle(t0,S.f(t0),{f:S.f,bounds:[S.ha*P/12,S.hb*P/12],snap:P/12,step:P/12,label:`Point on ${S.nm}`,onMove:upd});
          upd(t0);
        }
        draw();
      }},
    saw:{title:"arccos(cos(x)) and arcsin(sin(x))", cap:"<b>Fig. 14.2</b> $y = \\arccos(\\cos(x))$ is defined for every $x$, but it only outputs angles in $[0, \\pi]$. It equals $x$ only on the shaded interval. Everywhere else it zigzags with slope $\\pm 1$. Switch to $\\arcsin(\\sin(x))$ to compare. (Lecture 14, pp. 4 to 5)",
      build(host,{PLOT}){
        const D={
          cos:{h:x=>Math.acos(Math.max(-1,Math.min(1,Math.cos(x)))),f:Math.cos,lo:0,hi:P,nm:"cos",inm:"arccos",I:"[0, π]",start:15},
          sin:{h:x=>Math.asin(Math.max(-1,Math.min(1,Math.sin(x)))),f:Math.sin,lo:-P/2,hi:P/2,nm:"sin",inm:"arcsin",I:"[−π/2, π/2]",start:15}
        };
        let key="cos";
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Function",items:[["cos","arccos(cos(x))"],["sin","arcsin(sin(x))"]],value:key,onchange:v=>{ key=v; draw(); }});
        const box=document.createElement("div"); host.append(box);
        const ro=PLOT.readout(host);
        function draw(){
          box.innerHTML=""; const S=D[key];
          const G=PLOT.graph(box,{x:[-3.75,6.9],y:[-2,3.7],h:320,piX:true,ystep:100,c:"var(--u5)",samples:800});
          G.between(()=>3.7,()=>-2,S.lo,S.hi);
          [[P/2,"π/2"],[P,"π"],[-P/2,"−π/2"]].forEach(([y,t])=>{ G.line(-0.08,y,0.08,y,{cls:"ax"}); G.label(0,y,t,{cls:"lblc",dx:-6,dy:4,anchor:"end"}); });
          G.line(-2,-2,3.7,3.7,{cls:"lt dash"});
          G.label(3.05,3.4,"y = x",{cls:"lblc",anchor:"end"});
          G.fn(S.h,{cls:"cv c"});
          const ghost=G.open(0,0);
          const upd=x=>{ const k=k12(x), y=S.h(x), inside=x>=S.lo-1e-9&&x<=S.hi+1e-9; ghost.set(x,Math.max(-2,Math.min(3.7,x))); ghost.style.display=(inside||x>3.7||x<-2)?"none":"";
            ro.innerHTML=`x = <b>${ang(k,12).u}</b>. ${S.nm}(x) = ${S.f(x).toFixed(3)}. ${S.inm}(${S.f(x).toFixed(3)}) = <b>${ang(k12(y),12).u}</b>.<br>`+(inside?`x is in ${S.I}, so ${S.inm}(${S.nm}(x)) = x.`:`x is not in ${S.I}, so ${S.inm}(${S.nm}(x)) is not x.${x>3.7||x<-2?"":" The open dot shows where y = x would be."}`); };
          const x0=S.start*P/12;
          G.handle(x0,S.h(x0),{f:S.h,bounds:[-P,2*P],snap:P/12,step:P/12,label:"Point on the zigzag",onMove:upd});
          upd(x0);
        }
        draw();
      }},
    tri:{title:"The let statement triangle", cap:"<b>Fig. 14.3</b> Let $\\theta$ be the output of arctan, arcsin or arccos. The range of the inverse tells you which quadrant $\\theta$ is in, and so the sign of each side. The hypotenuse is always positive. The triangle is drawn to scale with the hypotenuse fixed. (Lecture 14, p. 3)",
      build(host,{PLOT}){
        const LIST={arctan:[[-4,1],[-3,1],[-2,1],[-1,2],[1,3],[1,2],[2,1],[3,1],[4,1],[7,1]],
          arcsin:[[-4,5],[-2,3],[-1,4],[1,4],[1,3],[2,5],[1,2],[2,3],[3,4],[4,5]],
          arccos:[[-4,5],[-2,3],[-1,4],[1,4],[1,3],[2,5],[1,2],[2,3],[3,4],[4,5]]};
        let key="arccos", idx=2;
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Inverse",items:[["arctan","arctan"],["arcsin","arcsin"],["arccos","arccos"]],value:key,onchange:v=>{ key=v; idx=Math.min(idx,LIST[key].length-1); sl.set(idx); draw(); }});
        const cstr=([p,q])=>q===1?String(p).replace("-","−"):`${p<0?"−":""}${Math.abs(p)}/${q}`;
        const sl=PLOT.slider(ctl,{label:"Input c",min:0,max:9,step:1,value:idx,fmt:v=>cstr(LIST[key][v]),oninput:v=>{ idx=v; draw(); }});
        const G=PLOT.graph(host,{x:[-5.29,5.29],y:[-3.1,3.1],h:340,c:"var(--u5)",xstep:100,ystep:100,grid:false});
        const R=2.5;
        G.param(t=>R*Math.cos(t),t=>R*Math.sin(t),0,2*P,{cls:"lt dash"});
        const L1=G.line(0,0,1,0,{cls:"ln"}), L2=G.line(1,0,1,1,{cls:"ln"}), L3=G.line(0,0,1,1,{cls:"tan"});
        const arc=G.param(t=>0,t=>0,0,1,{cls:"tan"});
        const la=G.label(0,0,"",{cls:"lbl",anchor:"middle"}), lo=G.label(0,0,"",{cls:"lbl"}), lh=G.label(0,0,"",{cls:"lblc"}), lt=G.label(0,0,"θ",{cls:"lblc"});
        const ro=PLOT.readout(host);
        function draw(){
          sl.out.innerHTML=cstr(LIST[key][idx]);
          const [p,q]=LIST[key][idx], T=triangle(key,p,q), {o,a,h}=T.S, s=R/h.v, th=T.theta;
          const A=a.v*s, O=o.v*s;
          L1.set(0,0,A,0); L2.set(A,0,A,O); L3.set(0,0,A,O);
          let d=""; for(let i=0;i<=40;i++){ const t=th*i/40; d+=(i?"L":"M")+G.X(0.55*Math.cos(t)).toFixed(1)+" "+G.Y(0.55*Math.sin(t)).toFixed(1)+" "; } arc.setAttribute("d",d);
          lt.set(0.85*Math.cos(th/2),0.85*Math.sin(th/2)-0.1);
          la.set(A/2,0); la.setAttribute("y",G.Y(0)+(O>=0?16:-8)); la.textContent=`a = ${a.u}`;
          lo.set(A,O/2); lo.setAttribute("x",G.X(A)+(A>=0?7:-7)); lo.setAttribute("text-anchor",A>=0?"start":"end"); lo.textContent=`o = ${o.u}`;
          lh.set(A/2,O/2); lh.setAttribute("x",G.X(A/2)+(A>=0?-10:10)); lh.setAttribute("y",G.Y(O/2)+(O>=0?-8:16)); lh.setAttribute("text-anchor",A>=0?"end":"start"); lh.textContent=`h = ${h.u}`;
          const show=nm=>{ const [tp,bt]=RAT[nm]; const top=T.S[tp], bot=T.S[bt]; return `${nm} θ = ${tp}/${bt} = ${top.u}/${bot.u}`; };
          const quad = th>P/2?"II":th>0?"I":"IV";
          const rng = key==="arccos"?"[0, π]":key==="arcsin"?"[−π/2, π/2]":"(−π/2, π/2)";
          const known = key==="arctan"?`tan θ = ${cstr([p,q])} = o/a`:key==="arcsin"?`sin θ = ${cstr([p,q])} = o/h`:`cos θ = ${cstr([p,q])} = a/h`;
          ro.innerHTML=`Let θ = ${key}(${cstr([p,q])}). Then ${known}, and θ is in ${rng}: here quadrant <b>${quad}</b>, θ ≈ ${th.toFixed(3)}.<br>${show("sin")} &nbsp; ${show("cos")} &nbsp; ${show("tan")}<br>${show("csc")} &nbsp; ${show("sec")} &nbsp; ${show("cot")}`;
        }
        draw();
      }}
  },
  gens:[
    {id:"L14.g.eval", title:"Evaluate an inverse trig function", skill:"Evaluate arcsin, arccos and arctan at special values", ref:"pp. 1 to 4",
      gen(R,d){
        const pick=(neg)=>{ const fn=R.pick(["arcsin","arccos","arctan"]);
          const pool=fn==="arctan"?[0,1/Math.sqrt(3),1,Math.sqrt(3)]:[0,0.5,Math.SQRT1_2,Math.sqrt(3)/2,1];
          let v=R.pick(neg?pool.slice(1):pool); if(neg && R.int(1,10)<=7) v=-v;
          const X=exact(v), th=INV[fn].inv(X.v), A=ang(k12(th),12);
          return {fn,X,A,k:k12(th),val:th}; };
        if(d<3){ const E=pick(d===2);
          return {prompt:`Evaluate $\\${E.fn}${par(E.X.t)}$.`, answer:{type:"num",answer:E.A.a}, verify:{value:E.val},
            hint:`$\\${E.fn}$ outputs an angle in $${INV[E.fn].ran}$. Find the angle in that interval whose ${INV[E.fn].f} is $${E.X.t}$.`,
            steps:evalSteps(E.fn,E.X,E.A), answerTeX:`$\\${E.fn}${par(E.X.t)} = ${E.A.t}$`};
        }
        const E1=pick(true); let E2=pick(true); let guard=0; while(E2.fn===E1.fn&&guard++<10) E2=pick(true);
        const a=R.pick([2,3]), b=R.pick([1,-1,2,-2]);
        const K=a*E1.k+b*E2.k, A=ang(K,12);
        const bt=b===1?"+":b===-1?"-":b>0?`+ ${b}`:`- ${-b}`;
        const expr=`${a}\\${E1.fn}${par(E1.X.t)} ${bt}\\${E2.fn}${par(E2.X.t)}`;
        return {prompt:`Evaluate $${expr}$.`, answer:{type:"num",answer:A.a}, verify:{value:a*E1.val+b*E2.val},
          hint:"Evaluate each inverse trig function on its own first, using its range. Then combine.",
          steps:evalSteps(E1.fn,E1.X,E1.A).concat(evalSteps(E2.fn,E2.X,E2.A)).concat([`Combine: $${a}${par(E1.A.t)} ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}${par(E2.A.t)} = ${A.t}$.`]),
          answerTeX:`$${expr} = ${A.t}$`};
      }},
    {id:"L14.g.comp", title:"Inverse of a trig function, or the other way round", skill:"Decide when cancellation works for arcsin(sin x), arccos(cos x), arctan(tan x)", ref:"pp. 1 to 5",
      gen(R,d){
        const fn=R.pick(["arcsin","arccos","arctan"]), I=INV[fn], f=I.f;
        if(d===1 && R.int(0,1)===0){ // trig(arc(c)): cancels for c in the domain
          let p,q; if(fn==="arctan"){ q=R.pick([1,1,2,3]); p=R.nz(-9,9); } else { q=R.int(2,7); p=R.nz(1-q,q-1); }
          const c=M127.frac(p,q), ca=M127.fracA(p,q);
          return {prompt:`Evaluate $\\${f}${par(`\\${fn}${par(c)}`)}$.`, answer:{type:"num",answer:ca}, verify:{value:I.fn(I.inv(p/q))},
            hint:`Ask whether $${c}$ is in the domain of $\\${fn}$ (the range of $\\${f}$).`,
            steps:[`Since $${c}$ is in the range of $\\${f}$, which is $${I.dom}$ and is the domain of $\\${fn}$, the Cancellation Property applies.`,`So $\\${f}${par(`\\${fn}${par(c)}`)} = ${c}$.`], answerTeX:`$${c}$`};
        }
        if(d<=2){ // standard angles: in the range (cancels) or not (compute the value first)
          const ks=[];
          for(let k=-12;k<=24;k++){ if(k%2!==0&&k%3!==0) continue; const v=k*P/12; if(fn==="arctan"&&Math.abs(Math.cos(v))<1e-9) continue; const inside=inRange(fn,v); if((d===1)===inside) ks.push(k); }
          const k=R.pick(ks), T=ang(k,12), X=exact(I.fn(T.v)), out=I.inv(X.v), A=ang(k12(out),12);
          const expr=`\\${fn}${par(`\\${f}${par(T.t)}`)}`;
          const steps= d===1 ? [`$${T.t}$ is in $${I.ran}$, the range of $\\${fn}$.`,`So by the Cancellation Property, $${expr} = ${T.t}$.`]
            : [`$${T.t}$ is not in $${I.ran}$, the range of $\\${fn}$, so we cannot cancel.`,`Work out the inside first: $\\${f}${par(T.t)} = ${X.t}$.`].concat(evalSteps(fn,X,A).slice(0,-1)).concat([`So $${expr} = \\${fn}${par(X.t)} = ${A.t}$.`]);
          return {prompt:`Evaluate $${expr}$.`, answer:{type:"num",answer:A.a}, verify:{value:I.inv(I.fn(T.v))},
            hint:`First ask: is $${T.t}$ in $${I.ran}$, the range of $\\${fn}$?`, steps, answerTeX:`$${expr} = ${A.t}$`};
        }
        // d3: non-standard angles, shift into the range using period and symmetry
        const den=R.pick([5,7,8,9]);
        let n, guard=0;
        do { n=R.nz(-3*den,3*den); guard++; } while(guard<50 && (gcd(n,den)!==1 || inRange(fn,n*P/den) || (fn==="arctan"&&Math.abs(Math.cos(n*P/den))<1e-9)));
        const T=ang(n,den), expr=`\\${fn}${par(`\\${f}${par(T.t)}`)}`;
        const steps=[`$${T.t}$ is not in $${I.ran}$, the range of $\\${fn}$, so we cannot cancel. Find an angle in the range with the same ${f} value.`];
        let res;
        if(fn==="arctan"){ const m=Math.round(n/den), psi=n-den*m;
          steps.push(`$\\tan$ has period $\\pi$, so $\\tan${par(T.t)} = \\tan${par(`${T.t} ${m>0?"-":"+"} ${ang(Math.abs(m)*den,den).t}`)} = \\tan${par(ang(psi,den).t)}$.`); res=psi; }
        else { const m=Math.round(n/(2*den)); let phi=n-2*den*m;
          if(m!==0) steps.push(`$\\${f}$ has period $2\\pi$, so $\\${f}${par(T.t)} = \\${f}${par(`${T.t} ${m>0?"-":"+"} ${ang(2*Math.abs(m)*den,den).t}`)} = \\${f}${par(ang(phi,den).t)}$.`);
          if(fn==="arccos"){ if(phi<0){ steps.push(`$\\cos(-x) = \\cos(x)$, so $\\cos${par(ang(phi,den).t)} = \\cos${par(ang(-phi,den).t)}$.`); phi=-phi; } res=phi; }
          else { if(2*Math.abs(phi)<=den) res=phi;
            else if(phi>0){ res=den-phi; steps.push(`From the graph of sin, $\\sin(\\pi - x) = \\sin(x)$, so $\\sin${par(ang(phi,den).t)} = \\sin${par(`\\pi - ${ang(phi,den).t}`)} = \\sin${par(ang(res,den).t)}$.`); }
            else { res=-den-phi; steps.push(`From the graph of sin, $\\sin(-\\pi - x) = \\sin(x)$, so $\\sin${par(ang(phi,den).t)} = \\sin${par(`-\\pi + ${ang(-phi,den).t}`)} = \\sin${par(ang(res,den).t)}$.`); } } }
        const A=ang(res,den);
        steps.push(`$${A.t}$ is in $${I.ran}$, so $${expr} = \\${fn}${par(`\\${f}${par(A.t)}`)} = ${A.t}$.`);
        return {prompt:`Evaluate $${expr}$.`, answer:{type:"num",answer:A.a}, verify:{value:I.inv(I.fn(T.v))},
          hint:`$${T.t}$ is outside the range of $\\${fn}$. Use the period of $\\${f}$ ${fn==="arccos"?"and $\\cos(-x)=\\cos(x)$":fn==="arcsin"?"and $\\sin(\\pi - x) = \\sin(x)$":""} to move it into $${I.ran}$.`,
          steps, answerTeX:`$${expr} = ${A.t}$`};
      }},
    {id:"L14.g.triangle", title:"Trig of an inverse trig function", skill:"Use a let statement and a right triangle", ref:"p. 3",
      gen(R,d){
        let fn,p,q,F;
        if(d===1){ fn="arctan"; p=R.pick([2,3,4,5,6,7]); q=1; F=R.pick(["sin","cos","sec","csc"]); }
        else if(d===2){ fn=R.pick(["arcsin","arccos"]); do { q=R.int(3,7); p=R.int(1,q-1); } while(gcd(p,q)!==1); F=R.pick(fn==="arcsin"?["cos","tan","sec","cot"]:["sin","tan","csc","cot"]); }
        else { fn=R.pick(["arcsin","arccos","arctan","arctan"]);
          if(fn==="arctan"){ if(R.int(0,1)){ p=-R.pick([2,3,4,5]); q=1; } else { do { q=R.int(2,5); p=R.nz(-6,6); } while(gcd(p,q)!==1); } F=R.pick(["sin","cos","sec","csc"]); }
          else { do { q=R.int(3,7); p=-R.int(1,q-1); } while(gcd(p,q)!==1); F=R.pick(fn==="arcsin"?["cos","tan","sec","cot"]:["sin","tan","csc","cot"]); } }
        const T=triangle(fn,p,q), [tp,bt]=RAT[F], r=ratio(T.S[tp],T.S[bt]), f=T.f;
        const expr=`\\${F}${par(`\\${fn}${par(T.c)}`)}`;
        const steps=[`Let $\\theta = \\${fn}${par(T.c)}$. This makes sense since $\\${fn}$ outputs an angle.`,
          `By definition of inverses, $\\${f}(\\theta) = ${T.c}$. Since $\\theta$ is in the range of $\\${fn}$ and $\\${f}(\\theta)${p<0?"<":">"}0$, we know $${T.quad}$.`,
          `Draw a right triangle: $${T.set} = \\${f}(\\theta) = ${q===1?`\\frac{${p}}{1}`:T.c}$, so $${T.known}$.`+(p<0?` The hypotenuse is always positive, so the minus sign goes on the ${fn==="arccos"?"adjacent":"opposite"} side.`:"")].concat(T.lines)
          .concat([`So $${expr} = \\${F}(\\theta) = \\frac{${tp}}{${bt}} = ${r.t}$.`]);
        return {prompt:`Evaluate $${expr}$.`, answer:{type:"num",answer:r.a}, verify:{value:TRIG[F](INV[fn].inv(p/q))},
          hint:`Let $\\theta = \\${fn}${par(T.c)}$, so $\\${f}(\\theta) = ${T.c}$. Draw the triangle, find the missing side with $h^2 = o^2 + a^2$, and use the range of $\\${fn}$ for its sign.`,
          steps, answerTeX:`$${expr} = ${r.t}$`};
      }},
    {id:"L14.g.domran", title:"Domain and range", skill:"State the domain and range of inverse trig functions and compositions", ref:"pp. 1 to 5",
      gen(R,d){
        const RG={arcsin:[-6,6,"["],arccos:[0,12,"["],arctan:[-6,6,"("]};
        const iv=(lo,hi,open)=>({a:`${open?"(":"["}${lo.a}, ${hi.a}${open?")":"]"}`, t:`${open?"\\left(":"\\left["}${lo.t}, ${hi.t}${open?"\\right)":"\\right]"}`});
        const ALL={a:"(-inf, inf)",t:"(-\\infty, \\infty)"};
        const PI=(k,e=0)=>{ const A=ang(k,12); if(!e) return A; return {t:A.t==="0"?String(e):`${A.t} ${e>0?"+":"-"} ${Math.abs(e)}`, a:`${A.a}+(${e})`}; };
        let fx, D, Rg, steps;
        if(d===1){ const fn=R.pick(["arcsin","arccos","arctan"]), I=INV[fn], g=RG[fn], e=R.pick([0,0,0,1,-1,2]);
          fx=`\\${fn}(x)${e?` ${e>0?"+":"-"} ${Math.abs(e)}`:""}`; D=fn==="arctan"?ALL:{a:"[-1, 1]",t:"[-1, 1]"}; const R0=iv(PI(g[0]),PI(g[1]),g[2]==="("); Rg=iv(PI(g[0],e),PI(g[1],e),g[2]==="(");
          steps=[`$\\${fn}$ is the inverse of $\\${I.f}$ on $${I.ran}$.`,`The domain of an inverse is the range of the original function: $\\${I.f}$ on $${I.ran}$ outputs $${D.t}$.`,`The range of an inverse is the interval we restricted to: $${R0.t}$.`].concat(e?[`Adding $${e}$ moves every output by $${e}$ and does not change the domain. The range is $${Rg.t}$.`]:[]); }
        else if(d===2){ const c=R.pick(["acos","asin","cosa","sina","tana"]);
          const map={acos:["\\arccos(\\cos(x))",ALL,{a:"[0, pi]",t:"[0, \\pi]"},"cos accepts every real number, and arccos accepts all of its outputs in $[-1,1]$.","arccos can only output angles in $[0, \\pi]$, and it outputs all of them."],
            asin:["\\arcsin(\\sin(x))",ALL,{a:"[-pi/2, pi/2]",t:"\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]"},"sin accepts every real number, and arcsin accepts all of its outputs in $[-1,1]$.","arcsin can only output angles in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$, and it outputs all of them."],
            cosa:["\\cos(\\arccos(x))",{a:"[-1, 1]",t:"[-1, 1]"},{a:"[-1, 1]",t:"[-1, 1]"},"arccos only accepts inputs in $[-1, 1]$.","By the Cancellation Property the function is $x$ on $[-1, 1]$, and that takes every value in $[-1, 1]$."],
            sina:["\\sin(\\arcsin(x))",{a:"[-1, 1]",t:"[-1, 1]"},{a:"[-1, 1]",t:"[-1, 1]"},"arcsin only accepts inputs in $[-1, 1]$.","By the Cancellation Property the function is $x$ on $[-1, 1]$, and that takes every value in $[-1, 1]$."],
            tana:["\\tan(\\arctan(x))",ALL,ALL,"arctan accepts every real number, and tan accepts every output of arctan.","The function is $x$ for every real $x$, so it takes every real value."]};
          const m=map[c]; fx=m[0]; D=m[1]; Rg=m[2]; steps=[`Domain: ${m[3]} So the domain is $${D.t}$.`,`Range: ${m[4]} So the range is $${Rg.t}$.`]; }
        else { const fn=R.pick(["arcsin","arccos","arctan"]), I=INV[fn], g=RG[fn];
          const c=R.pick([2,3,-1,-2]), e=R.pick([0,0,1,-1,2]), inner=R.int(0,1)?["x/b",R.pick([2,3,4,5])]:["kx",R.pick([2,3,4])];
          const it=inner[0]==="x/b"?`\\frac{x}{${inner[1]}}`:`${inner[1]}x`;
          fx=`${c===1?"":c===-1?"-":c}\\${fn}${par(it)}${e?` ${e>0?"+":"-"} ${Math.abs(e)}`:""}`;
          if(fn==="arctan") D=ALL; else { const B=inner[0]==="x/b"?{t:String(inner[1]),a:String(inner[1])}:{t:`\\frac{1}{${inner[1]}}`,a:`1/${inner[1]}`}; D={a:`[-${B.a}, ${B.a}]`,t:`\\left[-${B.t}, ${B.t}\\right]`}; }
          let lo=c*g[0], hi=c*g[1]; if(c<0) [lo,hi]=[hi,lo];
          Rg=iv(PI(lo,e),PI(hi,e),g[2]==="(");
          steps=[fn==="arctan"?`arctan accepts every real number, so the domain is $(-\\infty, \\infty)$.`:`$\\${fn}$ only accepts inputs in $[-1, 1]$, so we need $-1 \\le ${it} \\le 1$. Solving gives $${D.t}$.`,
            `As $x$ runs over the domain, $\\${fn}${par(it)}$ outputs every angle in $${iv(PI(g[0]),PI(g[1]),g[2]==="(").t}$.`,
            `Multiply by $${c}$: ${c<0?"the interval flips and ":""}it becomes $${iv(PI(lo),PI(hi),g[2]==="(").t}$.`+(e?` Then add $${e}$: $${Rg.t}$.`:"")]; }
        return {prompt:`Find the domain and range of $f(x) = ${fx}$. Use interval notation.`,
          parts:[{label:"Domain",answer:{type:"interval",answer:D.a}},{label:"Range",answer:{type:"interval",answer:Rg.a}}],
          hint:"The domain of an inverse trig function is the range of the original trig function. The range is the interval the trig function was restricted to. Watch round versus square brackets.",
          steps, answerTeX:`Domain $${D.t}$, range $${Rg.t}$`};
      }},
    {id:"L14.g.error", title:"Find the mistake", skill:"Spot the first wrong line in an inverse trig solution", ref:"pp. 1 to 5",
      gen(R,d){
        const kind = d===1?"comp":d===2?"tri":R.pick(["pick","tri"]);
        const fmt=L=>L.map((s,i)=>`<p style="margin:2px 0">(${i+1}) ${s}</p>`).join("");
        if(kind==="comp"){
          const fn=R.pick(["arcsin","arccos"]), I=INV[fn], f=I.f;
          const ks=fn==="arcsin"?[8,9,10,14,15,16,20,21,22,-8,-10]:[-4,-3,-2,-8,-9,14,15,16,20,21,22];
          const k=R.pick(ks), T=ang(k,12), X=exact(I.fn(T.v)), out=I.inv(X.v), A=ang(k12(out),12);
          const alt=ang(fn==="arcsin"?12-k12(out):24-k12(out),12);
          const wrongR=fn==="arcsin"?"[0, \\pi]":"\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]";
          const good=[`$${T.t}$ is not in $${I.ran}$, the range of $\\${fn}$, so the Cancellation Property does not apply.`,`$\\${f}${par(T.t)} = ${X.t}$.`,`So $\\${fn}${par(`\\${f}${par(T.t)}`)} = \\${fn}${par(X.t)}$.`,`$= ${A.t}$, since $\\${f}${par(A.t)} = ${X.t}$ and $${A.t}$ is in $${I.ran}$.`];
          const bad={0:`$${T.t}$ is not in $${wrongR}$, the range of $\\${fn}$, so the Cancellation Property does not apply.`,1:`$\\${f}${par(T.t)} = ${exact(-X.v).t}$.`,3:`$= ${alt.t}$, since $\\${f}${par(alt.t)} = ${X.t}$.`};
          const why={0:`The range of $\\${fn}$ is $${I.ran}$, not $${wrongR}$.`,1:`The sign is wrong: $\\${f}${par(T.t)} = ${X.t}$.`,3:`$${alt.t}$ is not in $${I.ran}$, so it cannot be an output of $\\${fn}$. The answer is $${A.t}$.`};
          const e=R.pick([0,1,3]); const L=good.slice(); L[e]=bad[e];
          return {prompt:`A problem and answer are shown below. The answer would not get full marks. Select the first line that has a mistake.<p style="margin:6px 0 2px">Problem: evaluate $\\${fn}${par(`\\${f}${par(T.t)}`)}$.</p>${fmt(L)}`,
            parts:[{answer:{type:"mc",options:L.map((s,i)=>`Line (${i+1})`),correct:e,keep:true}}],
            hint:`Check each line against the range of $\\${fn}$, which is $${I.ran}$.`,
            steps:[`Line (${e+1}) is the first mistake. ${why[e]}`,`A correct solution: ${good.map((s,i)=>`(${i+1}) ${s}`).join(" ")}`], answerTeX:`Line (${e+1})`};
        }
        if(kind==="tri"){
          const fn=d===3?R.pick(["arcsin","arccos"]):R.pick(["arcsin","arccos"]); let p,q; do { q=R.int(3,7); p=R.int(1,q-1)*(d===3?-1:1); } while(gcd(p,q)!==1);
          const T=triangle(fn,p,q), f=T.f, U=fn==="arcsin"?"a":"o", F=R.pick(fn==="arcsin"?["sec","tan","cos"]:["csc","tan","sin"]);
          const [tp,bt]=RAT[F], r=ratio(T.S[tp],T.S[bt]), rw=ratio(T.S[bt],T.S[tp]);
          const N=T.S[U].sq, Nb=T.S[U].b, H=q, K=fn==="arcsin"?"o":"a";
          const rng=fn==="arcsin"?"-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}":"0 \\le \\theta \\le \\pi";
          const wrng=fn==="arcsin"?"0 \\le \\theta \\le \\pi":"-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}";
          const sq=n=>n<0?`(${n})^2`:`${n}^2`;
          const good=[`Let $\\theta = \\${fn}${par(T.c)}$.`,
            `By definition of inverses, $\\${f}(\\theta) = ${T.c}$, with $${rng}$.`,
            `In the triangle $${K} = ${p}$ and $h = ${q}$, so $${H}^2 = ${sq(p)} + ${U}^2$ and $${U}^2 = ${N}$.`,
            `$\\sqrt{${U}^2} = \\sqrt{${N}}$, so $|${U}| = ${Nb}$.`,
            `$${U} = ${Nb}$, since ${fn==="arcsin"?"$\\cos(\\theta) \\ge 0$":"$\\sin(\\theta) \\ge 0$"} when $${rng}$.`,
            `So $\\${F}${par(`\\${fn}${par(T.c)}`)} = \\frac{${tp}}{${bt}} = ${r.t}$.`];
          const bad=[`Let $\\theta = \\${f}${par(T.c)}$.`,`By definition of inverses, $\\${f}(\\theta) = ${T.c}$, with $${wrng}$.`,`In the triangle $${K} = ${p}$ and $h = ${q}$, so $${H}^2 = ${sq(p)} + ${U}^2$ and $${U}^2 = ${q*q+p*p}$.`,
            `$\\sqrt{${U}^2} = ${U} = ${Nb}$.`,`$${U} = -${Nb}$, since $\\theta$ is in quadrant ${fn==="arcsin"?(p<0?"III":"II"):(p<0?"III":"IV")}.`,`So $\\${F}${par(`\\${fn}${par(T.c)}`)} = \\frac{${bt}}{${tp}} = ${rw.t}$.`];
          const why=[`$\\theta$ must be the output of $\\${fn}$, so the let statement is $\\theta = \\${fn}${par(T.c)}$.`,`The range of $\\${fn}$ is $${rng}$, not $${wrng}$.`,`Pythagoras gives $${U}^2 = ${q}^2 - ${sq(p)} = ${N}$, not a sum.`,`$\\sqrt{${U}^2} = |${U}|$, not $${U}$. The absolute value bars are needed before you decide the sign.`,`$\\theta$ is in the range of $\\${fn}$, where ${fn==="arcsin"?"cosine":"sine"} is never negative, so $${U} = ${Nb}$.`,`$\\${F}(\\theta) = \\frac{${tp}}{${bt}}$, not $\\frac{${bt}}{${tp}}$.`];
          const e=R.int(0,5); const L=good.slice(); L[e]=bad[e];
          return {prompt:`A problem and answer are shown below. The answer would not get full marks. Select the first line that has a mistake.<p style="margin:6px 0 2px">Problem: evaluate $\\${F}${par(`\\${fn}${par(T.c)}`)}$.</p>${fmt(L)}`,
            parts:[{answer:{type:"mc",options:L.map((s,i)=>`Line (${i+1})`),correct:e,keep:true}}],
            hint:"Check the let statement, the range of the inverse, Pythagoras, the absolute value bars, the sign, and the ratio, in that order.",
            steps:[`Line (${e+1}) is the first mistake. ${why[e]}`,`A correct solution: ${good.map((s,i)=>`(${i+1}) ${s}`).join(" ")}`], answerTeX:`Line (${e+1})`};
        }
        // pick the correct student
        const fn=R.pick(["arcsin","arccos","arctan"]), I=INV[fn], f=I.f;
        const ks=[]; for(let k=-12;k<=24;k++){ if(k%2!==0&&k%3!==0) continue; const v=k*P/12; if(inRange(fn,v)) continue; const X=exact(I.fn(v)); if(!X||Math.abs(X.v)<1e-9||Math.abs(Math.abs(X.v)-1)<1e-9&&fn!=="arctan") continue; if(fn==="arctan"&&Math.abs(Math.cos(v))<1e-9) continue; ks.push(k); }
        const k=R.pick(ks), T=ang(k,12), X=exact(I.fn(T.v)), A=ang(k12(I.inv(X.v)),12), Xn=exact(-X.v), An=ang(k12(I.inv(-X.v)),12);
        const expr=`\\${fn}${par(`\\${f}${par(T.t)}`)}`;
        const W=[[`$${T.t}$ is not in $${I.ran}$, so I cannot cancel. $\\${f}${par(T.t)} = ${X.t}$, so the answer is $\\${fn}${par(X.t)} = ${A.t}$.`,true],
          [`$\\${fn}$ and $\\${f}$ are inverses, so they cancel and the answer is $${T.t}$.`,false],
          [`$\\${f}${par(T.t)} = ${Xn.t}$, so the answer is $\\${fn}${par(Xn.t)} = ${An.t}$.`,false]];
        const order=R.shuffle([0,1,2]), names=["A","B","C"];
        const body=order.map((oi,j)=>`<p style="margin:2px 0">Student ${names[j]}: ${W[oi][0]}</p>`).join("");
        const correct=order.indexOf(0);
        return {prompt:`Three students evaluated $${expr}$. Which student is correct?${body}`,
          parts:[{answer:{type:"mc",options:names.map(n=>`Student ${n}`),correct,keep:true}}],
          hint:`Is $${T.t}$ in the range of $\\${fn}$? If not, work out the inside first, and check its sign.`,
          steps:[`$${T.t}$ is not in $${I.ran}$, the range of $\\${fn}$, so the student who cancelled is wrong.`,`$\\${f}${par(T.t)} = ${X.t}$ (check the sign from the quadrant), so the student with $${Xn.t}$ is wrong.`,`$\\${fn}${par(X.t)} = ${A.t}$. Student ${names[correct]} is correct.`], answerTeX:`Student ${names[correct]}`};
      }}
  ],
  exam:[
    {id:"L14.q1", ref:"p. 2", q:"What are the domain and range of $\\arctan$?", opts:[
      ["Domain $(-\\infty, \\infty)$, range $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$",1,"tan on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ outputs every real number, so arctan accepts every real number and outputs angles in that open interval."],
      ["Domain $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, range $(-\\infty, \\infty)$",0,"That is the restricted tan. The inverse swaps the domain and range."],
      ["Domain $[-1, 1]$, range $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$",0,"That is arcsin."],
      ["Domain $(-\\infty, \\infty)$, range $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$",0,"The endpoints are not included: tan does not exist at $\\pm\\frac{\\pi}{2}$, and arctan only approaches them."]]},
    {id:"L14.q2", ref:"pp. 4 to 5", multi:true, q:"Select all statements that are true for every $x$ in the domain of the left side.", opts:[
      ["$\\cos(\\arccos(x)) = x$",1,"The domain is $[-1, 1]$, and arccos gives an angle whose cosine is $x$ (p. 4)."],
      ["$\\arccos(\\cos(x)) = x$",0,"Only for $x$ in $[0, \\pi]$. For example $\\arccos(\\cos(2\\pi)) = \\arccos(1) = 0$."],
      ["$\\tan(\\arctan(x)) = x$",1,"Every real $x$ is in the domain of arctan, and tan undoes it."],
      ["$\\arcsin(\\sin(x)) = x$",0,"Only for $x$ in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$. For example $\\arcsin(\\sin(\\pi)) = \\arcsin(0) = 0$."]]},
    {id:"L14.q3", ref:"p. 1", q:"$\\arccos\\left(\\cos\\left(-\\frac{\\pi}{5}\\right)\\right) =$", opts:[
      ["$\\frac{\\pi}{5}$",1,"$-\\frac{\\pi}{5}$ is not in $[0, \\pi]$. Since $\\cos(-x) = \\cos(x)$, this is $\\arccos\\left(\\cos\\left(\\frac{\\pi}{5}\\right)\\right)$, and $\\frac{\\pi}{5}$ is in $[0, \\pi]$."],
      ["$-\\frac{\\pi}{5}$",0,"arccos never outputs a negative angle."],
      ["$\\frac{4\\pi}{5}$",0,"$\\cos\\left(\\frac{4\\pi}{5}\\right) = -\\cos\\left(\\frac{\\pi}{5}\\right)$, the wrong sign."],
      ["$\\frac{9\\pi}{5}$",0,"It has the right cosine, but it is not in $[0, \\pi]$."]]},
    {id:"L14.q4", ref:"pp. 2 to 3", q:"$\\arctan\\left(\\tan\\left(\\frac{3\\pi}{4}\\right)\\right) =$", opts:[
      ["$-\\frac{\\pi}{4}$",1,"$\\tan\\left(\\frac{3\\pi}{4}\\right) = -1$, and $\\arctan(-1) = -\\frac{\\pi}{4}$, which is in $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$."],
      ["$\\frac{3\\pi}{4}$",0,"$\\frac{3\\pi}{4}$ is not in the range of arctan, so you cannot cancel."],
      ["$\\frac{\\pi}{4}$",0,"$\\tan\\left(\\frac{3\\pi}{4}\\right)$ is $-1$, not 1."],
      ["$-\\frac{3\\pi}{4}$",0,"Not in $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$."]]},
    {id:"L14.q5", ref:"p. 4", q:"True or false: $\\arcsin\\left(\\sin\\left(\\frac{2\\pi}{3}\\right)\\right) = \\frac{2\\pi}{3}$.", opts:[
      ["False",1,"$\\frac{2\\pi}{3}$ is not in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$. $\\sin\\left(\\frac{2\\pi}{3}\\right) = \\frac{\\sqrt{3}}{2}$ and $\\arcsin\\left(\\frac{\\sqrt{3}}{2}\\right) = \\frac{\\pi}{3}$."],
      ["True",0,"Cancellation only works when the angle is in the range of arcsin."]]},
    {id:"L14.q6", ref:"p. 3", q:"$\\sec(\\arctan(3)) =$", opts:[
      ["$\\sqrt{10}$",1,"Let $\\theta = \\arctan(3)$: $\\tan(\\theta) = \\frac{3}{1}$, so $o = 3$, $a = 1$, $h = \\sqrt{10}$, and $\\sec(\\theta) = \\frac{h}{a} = \\sqrt{10}$."],
      ["$\\frac{1}{\\sqrt{10}}$",0,"That is $\\cos(\\theta) = \\frac{a}{h}$."],
      ["$\\frac{3}{\\sqrt{10}}$",0,"That is $\\sin(\\theta) = \\frac{o}{h}$."],
      ["$\\frac{\\sqrt{10}}{3}$",0,"That is $\\csc(\\theta) = \\frac{h}{o}$."]]},
    {id:"L14.q7", ref:"p. 3", keep:true, q:"A student evaluates $\\cos\\left(\\arcsin\\left(-\\frac{3}{5}\\right)\\right)$. Select the first line that has a mistake.<p style=\"margin:2px 0\">(1) Let $\\theta = \\arcsin\\left(-\\frac{3}{5}\\right)$, so $\\sin(\\theta) = -\\frac{3}{5}$ with $-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}$.</p><p style=\"margin:2px 0\">(2) In the triangle $o = -3$ and $h = 5$, so $5^2 = (-3)^2 + a^2$ and $a^2 = 16$.</p><p style=\"margin:2px 0\">(3) $|a| = 4$, and $a = -4$ because $\\sin(\\theta) < 0$.</p><p style=\"margin:2px 0\">(4) So $\\cos\\left(\\arcsin\\left(-\\frac{3}{5}\\right)\\right) = \\frac{a}{h} = -\\frac{4}{5}$.</p>", opts:[
      ["Line (1)",0,"Correct: arcsin outputs an angle in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$."],
      ["Line (2)",0,"Correct use of $h^2 = o^2 + a^2$."],
      ["Line (3)",1,"$\\theta$ is in $\\left[-\\frac{\\pi}{2}, 0\\right)$, quadrant IV, where cosine is positive. So $a = 4$ and the answer is $\\frac{4}{5}$."],
      ["Line (4)",0,"$\\frac{a}{h}$ is the right ratio for cosine. The mistake came earlier."]]},
    {id:"L14.q8", ref:"p. 1", q:"Since cos inputs an angle and outputs a ratio, arccos", opts:[
      ["inputs a ratio and outputs an angle",1,"The inverse swaps inputs and outputs. These were blanks in the notes, filled with the standard answer."],
      ["inputs an angle and outputs a ratio",0,"That describes cos itself."],
      ["inputs an angle and outputs an angle",0,"The input of arccos is an output of cos, which is a ratio."],
      ["inputs a ratio and outputs $\\frac{1}{\\cos}$ of it",0,"That is sec. This mix-up is why the course writes arccos, not $\\cos^{-1}$."]]},
    {id:"L14.q9", ref:"p. 2", q:"Which describes the graph of $\\theta = \\arctan(x)$?", opts:[
      ["Increasing, with horizontal asymptotes $\\theta = \\frac{\\pi}{2}$ as $x \\to \\infty$ and $\\theta = -\\frac{\\pi}{2}$ as $x \\to -\\infty$",1,"This is the key information the notes ask you to remember."],
      ["Vertical asymptotes at $x = \\pm\\frac{\\pi}{2}$",0,"Those belong to tan. Reflecting in $y = x$ turns them into horizontal asymptotes."],
      ["It passes through $\\left(1, \\frac{\\pi}{2}\\right)$",0,"$\\arctan(1) = \\frac{\\pi}{4}$, so it passes through $\\left(1, \\frac{\\pi}{4}\\right)$."],
      ["Decreasing on its whole domain",0,"tan is increasing on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, so arctan is increasing too."]]},
    {id:"L14.q10", ref:"p. 5", q:"On the interval $[\\pi, 2\\pi]$, the graph of $y = \\arccos(\\cos(x))$ is the line", opts:[
      ["$y = 2\\pi - x$",1,"For $x$ in $[\\pi, 2\\pi]$, $\\cos(x) = \\cos(2\\pi - x)$ and $2\\pi - x$ is in $[0, \\pi]$. It goes from $\\pi$ down to 0 with slope $-1$."],
      ["$y = x$",0,"That only holds on $[0, \\pi]$."],
      ["$y = x - \\pi$",0,"At $x = \\pi$ this gives 0, but $\\arccos(\\cos(\\pi)) = \\arccos(-1) = \\pi$."],
      ["$y = x - 2\\pi$",0,"That gives negative outputs, and arccos only outputs angles in $[0, \\pi]$."]]},
    {id:"L14.q11", ref:"p. 4", multi:true, q:"Select all that are correct.", opts:[
      ["$\\arcsin(1) = \\frac{\\pi}{2}$",1,"$\\sin\\left(\\frac{\\pi}{2}\\right) = 1$ and $\\frac{\\pi}{2}$ is in the range of arcsin."],
      ["$\\arccos(0) = \\frac{\\pi}{2}$",1,"$\\cos\\left(\\frac{\\pi}{2}\\right) = 0$ and $\\frac{\\pi}{2}$ is in $[0, \\pi]$."],
      ["$\\arcsin(2) = \\frac{\\pi}{3}$",0,"2 is not in the domain $[-1, 1]$, so $\\arcsin(2)$ does not exist."],
      ["$\\arccos(-1) = -\\pi$",0,"$\\arccos(-1) = \\pi$. $-\\pi$ is not in $[0, \\pi]$."]]},
    {id:"L14.q12", ref:"p. 3", q:"Is the provided answer correct?<p style=\"margin:4px 0\">Problem: evaluate $\\sin\\left(\\arccos\\left(-\\frac{1}{3}\\right)\\right)$.</p><p style=\"margin:4px 0\">Answer: Let $\\theta = \\arccos\\left(-\\frac{1}{3}\\right)$, so $\\cos(\\theta) = -\\frac{1}{3}$ with $0 \\le \\theta \\le \\pi$. In the triangle $a = -1$, $h = 3$, so $o^2 = 9 - 1 = 8$ and $|o| = \\sqrt{8}$. Since $\\cos(\\theta) < 0$, $\\theta$ is in quadrant II, so $o = -\\sqrt{8}$ and $\\sin(\\theta) = -\\frac{\\sqrt{8}}{3}$.</p>", opts:[
      ["No, the solution is not correct",1,"In quadrant II sine is positive. Since $0 \\le \\theta \\le \\pi$, $\\sin(\\theta) \\ge 0$, so $o = \\sqrt{8}$ and the answer is $\\frac{\\sqrt{8}}{3}$."],
      ["Yes, the solution is correct",0,"The quadrant is right but the sign of $o$ is not: the opposite side points up in quadrant II."]]}
  ],
  steps:[
    {type:"read", title:"Why trig functions need a smaller interval", body:`<p>A function has an inverse only if it is one-to-one: each output comes from exactly one input. Trig functions repeat, so on all real numbers they are not one-to-one. For example $\\cos(0) = \\cos(2\\pi) = 1$, so an inverse would not know which angle to give back for 1.</p><p>The fix from Lecture 9: keep one interval where the function is one-to-one, and invert only that piece.</p><div class="box def"><b class="t">Review question 1 (p. 1)</b>If $f$ is invertible and continuous on $I = [a, b]$, then the range of $f^{-1}$ is $I$, and the domain of $f^{-1}$ is the range of $f$ on $I$: $[f(a), f(b)]$ if $f(a) < f(b)$, or $[f(b), f(a)]$ if $f(b) < f(a)$.</div><p>So the interval you pick for the trig function becomes the range of its inverse. That is the reason to memorize the three intervals in this lecture.</p>`, ref:"p. 1"},
    {type:"read", title:"arccos", body:`<p>The inverse of cos on the interval $[0, \\pi]$ is called arccos (p. 1).</p><div class="box def"><b class="t">arccos</b>Domain $[-1, 1]$. Range $[0, \\pi]$. Since cos inputs an angle and outputs a ratio, arccos inputs a ratio and outputs an angle.</div><p>The graph of $\\theta = \\arccos(x)$ goes down from $(-1, \\pi)$ through $\\left(0, \\frac{\\pi}{2}\\right)$ to $(1, 0)$, with both endpoints included.</p><p>The course writes arccos instead of $\\cos^{-1}$ so you do not mix it up with $\\sec(x) = \\frac{1}{\\cos(x)}$. Later courses will likely use $\\cos^{-1}$.</p><p class="muted small">The domain, the range, and the words ratio and angle are blanks in the printed notes. They are filled in here with the standard answers.</p>`, ref:"p. 1"},
    {type:"explore", title:"The inverse is a reflection", fig:"reflect", body:`<p>Each inverse is the graph of the restricted trig function reflected in the line $y = x$. Reflecting swaps $x$ and $y$, so the domain and range swap.</p><p><b>Try it.</b> Drag the point along cos on $[0, \\pi]$ to $\\theta = \\frac{2\\pi}{3}$. The reflected point shows $\\arccos(-0.5) = 2.094$, which is $\\frac{2\\pi}{3}$. Then switch to sin and tan and read off the domain and range of arcsin and arctan.</p>`, ref:"pp. 1 to 3"},
    {type:"example", title:"Evaluating arccos", ex:{q:"Evaluate (a) $\\arccos\\left(-\\frac{1}{\\sqrt{2}}\\right)$ (b) $\\arccos\\left(\\cos\\left(\\frac{2\\pi}{3}\\right)\\right)$.", ref:"p. 1",
      steps:[{t:"(a) We want the angle $\\theta$ in $[0, \\pi]$ with $\\cos(\\theta) = -\\frac{1}{\\sqrt{2}}$.",why:"arccos outputs an angle in its range, $[0, \\pi]$."},
        {t:"$\\cos\\left(\\frac{\\pi}{4}\\right) = \\frac{1}{\\sqrt{2}}$. Cosine is negative in quadrant II, so $\\theta = \\pi - \\frac{\\pi}{4} = \\frac{3\\pi}{4}$.",why:"The reference angle is $\\frac{\\pi}{4}$, and $\\frac{3\\pi}{4}$ is in $[0, \\pi]$."},
        {t:"$\\arccos\\left(-\\frac{1}{\\sqrt{2}}\\right) = \\frac{3\\pi}{4}$.",why:"This is the answer in the notes."},
        {t:"(b) $\\frac{2\\pi}{3}$ is in $[0, \\pi]$, the range of arccos.",why:"Always check this first."},
        {t:"So $\\arccos\\left(\\cos\\left(\\frac{2\\pi}{3}\\right)\\right) = \\frac{2\\pi}{3}$.",why:"arccos undoes cos for angles in its range."}],
      ans:"(a) $\\frac{3\\pi}{4}$ (b) $\\frac{2\\pi}{3}$"}},
    {type:"try", title:"Your turn: evaluate", gen:"L14.g.eval"},
    {type:"read", title:"arctan and arcsin", body:`<p>From the graph of tan, tan is invertible on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$. The inverse is arctan (p. 2).</p><div class="box def"><b class="t">arctan</b>Domain $(-\\infty, \\infty)$. Range $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$. It inputs a ratio and outputs an angle. Its graph has a horizontal asymptote at $\\frac{\\pi}{2}$ as $x \\to \\infty$ and at $-\\frac{\\pi}{2}$ as $x \\to -\\infty$.</div><p>The inverse of sin on $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ is arcsin (p. 3).</p><div class="box def"><b class="t">arcsin</b>Domain $[-1, 1]$. Range $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$. It inputs a ratio and outputs an angle. Its graph goes up from $\\left(-1, -\\frac{\\pi}{2}\\right)$ through the origin to $\\left(1, \\frac{\\pi}{2}\\right)$.</div><div class="box warn"><b class="t">Watch the brackets</b>arctan has round brackets because tan does not exist at $\\pm\\frac{\\pi}{2}$. arcsin and arccos have square brackets because their endpoints are reached.</div><p class="muted small">The domains, ranges, and the words ratio and angle are blanks in the printed notes, filled in here with the standard answers.</p>`, ref:"pp. 2 to 4"},
    {type:"example", title:"When you cannot cancel", ex:{q:"Evaluate (a) $\\arctan\\left(\\frac{1}{\\sqrt{3}}\\right)$ (b) $\\arctan(\\tan(\\pi))$.", ref:"pp. 2 to 3",
      steps:[{t:"(a) $\\tan\\left(\\frac{\\pi}{6}\\right) = \\frac{1}{\\sqrt{3}}$ and $\\frac{\\pi}{6}$ is in $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$.",why:"Find the angle in the range of arctan with this tangent."},
        {t:"So $\\arctan\\left(\\frac{1}{\\sqrt{3}}\\right) = \\frac{\\pi}{6}$.",why:"Answer from p. 2."},
        {t:"(b) $\\pi$ is not in the range of arctan, $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$.",why:"So arctan cannot output $\\pi$, and the answer is not $\\pi$."},
        {t:"Work out the inside first: $\\tan(\\pi) = 0$.",why:"From the unit circle, $\\sin(\\pi) = 0$."},
        {t:"$\\arctan(\\tan(\\pi)) = \\arctan(0) = 0$.",why:"$\\tan(0) = 0$ and 0 is in the range. This is the answer on p. 3."}],
      ans:"(a) $\\frac{\\pi}{6}$ (b) $0$"}},
    {type:"explore", title:"The zigzag of arccos(cos(x))", fig:"saw", body:`<p>Two examples on pp. 4 to 5 show the difference between the two orders.</p><ul><li>$y = \\cos(\\arccos(x))$ has domain $[-1, 1]$ and range $[-1, 1]$. By the Cancellation Property it is just the segment $y = x$ from $(-1, -1)$ to $(1, 1)$.</li><li>$y = \\arccos(\\cos(x))$ has domain $(-\\infty, \\infty)$ and range $[0, \\pi]$. The Cancellation Property only applies on $[0, \\pi]$. Everywhere else you have to plot points, and you get a zigzag.</li></ul><p><b>Try it.</b> Drag the point to $x = \\frac{5\\pi}{4}$. The output is $\\frac{3\\pi}{4}$: that is the p. 2 exercise $\\arccos\\left(\\cos\\left(\\frac{5\\pi}{4}\\right)\\right)$. Switch to arcsin(sin(x)) at the same $x$ to get $-\\frac{\\pi}{4}$, the p. 4 exercise.</p>`, ref:"pp. 4 to 5"},
    {type:"mcq", title:"Check yourself", q:"Which of these equal $\\frac{\\pi}{3}$? Select all that apply.", multi:true, opts:[
      ["$\\arcsin\\left(\\sin\\left(\\frac{2\\pi}{3}\\right)\\right)$",true,"$\\sin\\left(\\frac{2\\pi}{3}\\right) = \\frac{\\sqrt{3}}{2}$, and $\\arcsin\\left(\\frac{\\sqrt{3}}{2}\\right) = \\frac{\\pi}{3}$."],
      ["$\\arccos\\left(\\cos\\left(-\\frac{\\pi}{3}\\right)\\right)$",true,"$\\cos\\left(-\\frac{\\pi}{3}\\right) = \\frac{1}{2}$, and $\\arccos\\left(\\frac{1}{2}\\right) = \\frac{\\pi}{3}$."],
      ["$\\arcsin\\left(\\sin\\left(\\frac{4\\pi}{3}\\right)\\right)$",false,"$\\sin\\left(\\frac{4\\pi}{3}\\right) = -\\frac{\\sqrt{3}}{2}$, so this is $-\\frac{\\pi}{3}$."],
      ["$\\arctan\\left(\\tan\\left(-\\frac{\\pi}{3}\\right)\\right)$",false,"$-\\frac{\\pi}{3}$ is in the range of arctan, so this cancels to $-\\frac{\\pi}{3}$."]],
      after:"Check whether the angle is in the range first. If it is not, evaluate the inside and then the inverse."},
    {type:"try", title:"Your turn: compositions", gen:"L14.g.comp", diff:2},
    {type:"example", title:"The let statement", ex:{q:"Evaluate $\\sec(\\arctan(2))$.", ref:"p. 3",
      steps:[{t:"Let $\\theta = \\arctan(2)$.",why:"This makes sense since arctan outputs an angle."},
        {t:"By definition of inverses, $\\tan(\\theta) = 2$. Also $0 < \\theta < \\frac{\\pi}{2}$.",why:"$\\theta$ is in $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ and $\\tan(\\theta) > 0$, so it is in the first quadrant."},
        {t:"$\\frac{o}{a} = \\tan(\\theta) = \\frac{2}{1}$, so draw a right triangle with $o = 2$, $a = 1$ and hypotenuse $h$.",why:"Now it is the same as the Lecture 12 problems."},
        {t:"$h^2 = 2^2 + 1^2$, so $h^2 = 5$.",why:"Pythagoras."},
        {t:"$\\sqrt{h^2} = \\sqrt{5}$, so $|h| = \\sqrt{5}$.",why:"$\\sqrt{h^2} = |h|$, not $h$."},
        {t:"$h = \\sqrt{5}$ since the hypotenuse $> 0$.",why:"Only now do you drop the bars."},
        {t:"$\\sec(\\arctan(2)) = \\sec(\\theta) = \\frac{h}{a} = \\sqrt{5}$.",why:"$\\sec = \\frac{1}{\\cos} = \\frac{h}{a}$."}],
      ans:"$\\sec(\\arctan(2)) = \\sqrt{5}$"}},
    {type:"explore", title:"Signs come from the range", fig:"tri", body:`<p>The let statement gives you a triangle for $\\theta$. The range of the inverse tells you which quadrant $\\theta$ is in:</p><ul><li>arctan or arcsin of a negative number: $\\theta$ is in quadrant IV, so $o < 0$ and $a > 0$.</li><li>arccos of a negative number: $\\theta$ is in quadrant II, so $a < 0$ and $o > 0$.</li><li>The hypotenuse is always positive.</li></ul><p><b>Try it.</b> Pick arccos and set $c = -1/4$. You get $a = -1$, $h = 4$, $o = \\sqrt{15}$, so $\\sin\\left(\\arccos\\left(-\\frac{1}{4}\\right)\\right) = \\frac{\\sqrt{15}}{4}$. Then pick arcsin with $c = 2/5$ and read off $\\sec(\\theta) = \\frac{5}{\\sqrt{21}}$.</p>`, ref:"p. 3"},
    {type:"try", title:"Your turn: let statements", gen:"L14.g.triangle", diff:2},
    {type:"mcq", title:"Check the sign", q:"Let $\\theta = \\arcsin\\left(-\\frac{2}{5}\\right)$. Which is true?", opts:[
      ["$\\cos(\\theta) = \\frac{\\sqrt{21}}{5}$",true,"$\\theta$ is in $\\left[-\\frac{\\pi}{2}, 0\\right)$, where cosine is positive. $a^2 = 25 - 4 = 21$."],
      ["$\\cos(\\theta) = -\\frac{\\sqrt{21}}{5}$",false,"Cosine is never negative on the range of arcsin."],
      ["$\\theta$ is in quadrant III",false,"arcsin never outputs an angle in quadrant III."],
      ["$\\tan(\\theta) = \\frac{2}{\\sqrt{21}}$",false,"$\\tan(\\theta) = \\frac{o}{a} = \\frac{-2}{\\sqrt{21}}$, which is negative."]]},
    {type:"try", title:"Find the mistake", gen:"L14.g.error", diff:2},
    {type:"formulas", title:"Lecture 14 formulas"}
  ]
});
})();
