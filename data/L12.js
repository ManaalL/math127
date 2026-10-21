/* Lecture 12 (Mon Oct 5): Radians and trigonometric functions, values at non-standard angles, trig identities. Section 2.5.1. Notes: 5 pages. */
(function(){
const M=M127;
const PI=Math.PI;

/* ---------- exact values ---------- */
/* angles are stored as j = angle in twelfths of pi, so pi/6 is j=2, pi/4 is j=3, pi/3 is j=4, pi/2 is j=6 */
function piT(n,d){ if(n===0) return "0"; if(d<0){n=-n;d=-d;} const g=M.gcd(n,d); n/=g; d/=g; const s=n<0?"-":""; const an=Math.abs(n); const top=(an===1?"":an)+"\\pi"; return d===1?s+top:s+"\\frac{"+top+"}{"+d+"}"; }
function piA(n,d){ if(n===0) return "0"; if(d<0){n=-n;d=-d;} const g=M.gcd(n,d); n/=g; d/=g; const an=Math.abs(n); return (n<0?"-":"")+(an===1?"":an)+"pi"+(d===1?"":"/"+d); }
const jT=j=>piT(j,12), jA=j=>piA(j,12);
const V=(t,a,v)=>({t,a,v});
const R2=Math.SQRT2, R3=Math.sqrt(3);
const MAG={
  sin:{0:V("0","0",0),2:V("\\frac{1}{2}","1/2",.5),3:V("\\frac{1}{\\sqrt{2}}","1/sqrt(2)",1/R2),4:V("\\frac{\\sqrt{3}}{2}","sqrt(3)/2",R3/2),6:V("1","1",1)},
  cos:{0:V("1","1",1),2:V("\\frac{\\sqrt{3}}{2}","sqrt(3)/2",R3/2),3:V("\\frac{1}{\\sqrt{2}}","1/sqrt(2)",1/R2),4:V("\\frac{1}{2}","1/2",.5),6:V("0","0",0)},
  tan:{0:V("0","0",0),2:V("\\frac{1}{\\sqrt{3}}","1/sqrt(3)",1/R3),3:V("1","1",1),4:V("\\sqrt{3}","sqrt(3)",R3),6:null},
  csc:{0:null,2:V("2","2",2),3:V("\\sqrt{2}","sqrt(2)",R2),4:V("\\frac{2}{\\sqrt{3}}","2/sqrt(3)",2/R3),6:V("1","1",1)},
  sec:{0:V("1","1",1),2:V("\\frac{2}{\\sqrt{3}}","2/sqrt(3)",2/R3),3:V("\\sqrt{2}","sqrt(2)",R2),4:V("2","2",2),6:null},
  cot:{0:null,2:V("\\sqrt{3}","sqrt(3)",R3),3:V("1","1",1),4:V("\\frac{1}{\\sqrt{3}}","1/sqrt(3)",1/R3),6:V("0","0",0)}
};
const FN={sin:Math.sin,cos:Math.cos,tan:Math.tan,csc:x=>1/Math.sin(x),sec:x=>1/Math.cos(x),cot:x=>Math.cos(x)/Math.sin(x)};
function jinfo(j){ const m=((j%24)+24)%24; let q=0, ref;
  if(m%6===0) ref=(m===0||m===12)?0:6; else if(m<6){q=1;ref=m;} else if(m<12){q=2;ref=12-m;} else if(m<18){q=3;ref=m-12;} else {q=4;ref=24-m;}
  const ss=(m>0&&m<12)?1:(m>12)?-1:0, cs=(m<6||m>18)?1:(m>6&&m<18)?-1:0;
  return {m,q,ref,ss,cs}; }
function exact(fn,j){ const I=jinfo(j); const mag=MAG[fn][I.ref]; if(!mag) return null;
  const sg={sin:I.ss,cos:I.cs,tan:I.ss*I.cs,csc:I.ss,sec:I.cs,cot:I.ss*I.cs}[fn];
  if(mag.v===0||sg>=0) return mag; return V("-"+mag.t,"-("+mag.a+")",-mag.v); }
const QN=["","I","II","III","IV"];
const QW=["","first","second","third","fourth"];

/* ---------- small helpers ---------- */
const sqT=n=>{ const r=Math.round(Math.sqrt(n)); return r*r===n?String(r):`\\sqrt{${n}}`; };
const sqA=n=>{ const r=Math.round(Math.sqrt(n)); return r*r===n?String(r):`sqrt(${n})`; };
const par=t=>t.startsWith("-")?`(${t})`:t;
const RATIO={sin:["o","h"],cos:["a","h"],tan:["o","a"],csc:["h","o"],sec:["h","a"],cot:["a","o"]};
const strip=t=>t.startsWith("-")?t.slice(1):t;
function ratioTeX(n,d){ const neg=(n.t.startsWith("-"))!==(d.t.startsWith("-")); const nn=strip(n.t), dd=strip(d.t);
  const raw=`\\frac{${n.t}}{${d.t}}`; const simp=(neg?"-":"")+(dd==="1"?nn:`\\frac{${nn}}{${dd}}`);
  return raw===simp?raw:`${raw} = ${simp}`; }

/* draggable point with my own snapping (the kit's handle follows the pointer exactly) */
function dragPt(G,o){
  const NS="http://www.w3.org/2000/svg";
  const g=document.createElementNS(NS,"g"); g.setAttribute("class","drag"); g.setAttribute("tabindex","0"); g.setAttribute("role","slider"); g.setAttribute("aria-label",o.label||"Drag point");
  const h=document.createElementNS(NS,"circle"); h.setAttribute("r",14); h.setAttribute("style","fill:var(--c,var(--accent));fill-opacity:.14"); g.append(h);
  const c=document.createElementNS(NS,"circle"); c.setAttribute("r",6.5); c.setAttribute("class","dot"); c.setAttribute("style","stroke-width:2.4"); g.append(c);
  G.layer.top.append(g);
  const toXY=e=>{ const pt=G.svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const m=G.svg.getScreenCTM(); const p=m?pt.matrixTransform(m.inverse()):{x:0,y:0}; return [G.iX(p.x),G.iY(p.y)]; };
  let on=false;
  g.addEventListener("pointerdown",e=>{ on=true; g.setPointerCapture(e.pointerId); e.preventDefault(); });
  g.addEventListener("pointermove",e=>{ if(on) o.onMove(...toXY(e)); });
  g.addEventListener("pointerup",()=>{ on=false; });
  g.addEventListener("keydown",e=>{ const k={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key]; if(k&&o.onKey){ e.preventDefault(); o.onKey(k[0],k[1]); } });
  if(o.clickPlot) G.svg.addEventListener("pointerdown",e=>{ if(e.target.closest&&e.target.closest(".drag")) return; o.onMove(...toXY(e)); });
  return {set:(x,y)=>g.setAttribute("transform",`translate(${G.X(x)},${G.Y(y)})`)};
}
function pathEl(G,cls,layer){ const p=document.createElementNS("http://www.w3.org/2000/svg","path"); p.setAttribute("class",cls); (layer||G.layer.main).append(p); return p; }

/* ---------- trig equation solver for the generators and the figure ----------
   finds every x in [0, 2pi] with fn(n x) = kv, by checking all multiples of pi/12 for theta = n x (all special-value solutions are there) */
function solveB(fn,n,kv){ const out=[]; for(let j=0;j<=24*n;j++){ const th=j*PI/12; const v=FN[fn](th); if(isFinite(v)&&Math.abs(v-kv)<1e-9) out.push(j*24/(12*n)); } return out; } // x in 24ths of pi
const k24T=k=>piT(k,24), k24A=k=>piA(k,24);
const uniq=a=>[...new Set(a)].sort((x,y)=>x-y);
const thetaList=(fn,n,kv)=>{ const L=[]; for(let j=0;j<=24*n;j++){ const v=FN[fn](j*PI/12); if(isFinite(v)&&Math.abs(v-kv)<1e-9) L.push(j); } return L; };

/* special k values */
const KV={
  "1/2":V("\\frac{1}{2}","1/2",.5),"-1/2":V("-\\frac{1}{2}","-1/2",-.5),
  "r2":V("\\frac{1}{\\sqrt{2}}","1/sqrt(2)",1/R2),"-r2":V("-\\frac{1}{\\sqrt{2}}","-1/sqrt(2)",-1/R2),
  "r3":V("\\frac{\\sqrt{3}}{2}","sqrt(3)/2",R3/2),"-r3":V("-\\frac{\\sqrt{3}}{2}","-sqrt(3)/2",-R3/2),
  "1":V("1","1",1),"-1":V("-1","-1",-1),"0":V("0","0",0),
  "s3":V("\\sqrt{3}","sqrt(3)",R3),"-s3":V("-\\sqrt{3}","-sqrt(3)",-R3),"i3":V("\\frac{1}{\\sqrt{3}}","1/sqrt(3)",1/R3),"-i3":V("-\\frac{1}{\\sqrt{3}}","-1/sqrt(3)",-1/R3)
};
const REFOF={sin:{"1/2":2,"r2":3,"r3":4,"1":6,"0":0},cos:{"1/2":4,"r2":3,"r3":2,"1":0,"0":6},tan:{"1":3,"s3":4,"i3":2,"0":0}};
const posQ={sin:"I and II",cos:"I and IV",tan:"I and III"}, negQ={sin:"III and IV",cos:"II and III",tan:"II and IV"};
function whereLine(fn,key,varT,rangeT,list){ // one line of working: where fn(var)=k on the range
  const base=key.replace("-",""), neg=key.startsWith("-");
  const vals=list.length?list.join(",\\ "):"\\text{no values}";
  if(base==="0"||base==="1"&&fn!=="tan") return `$\\${fn}(${varT}) = ${KV[key].t}$ on $${rangeT}$ at $${varT} = ${vals}$ (read these off the unit circle or the graph of $\\${fn}$).`;
  const r=REFOF[fn][base];
  return `The reference angle is $${jT(r)}$ because $\\${fn}\\left(${jT(r)}\\right) = ${KV[base].t}$. $\\${fn}$ is ${neg?"negative":"positive"} in quadrants ${neg?negQ[fn]:posQ[fn]}, so on $${rangeT}$: $${varT} = ${vals}$.`;
}

/* ---------- error-analysis rendering ---------- */
const linesHTML=L=>L.map((l,i)=>`<div style="margin:2px 0">${l} &nbsp;<span class="muted">(${i+1})</span></div>`).join("");
const lineOpts=n=>Array.from({length:n},(_,i)=>`Line (${i+1})`);

M.lecture({
  id:"L12", n:12, date:"2026-10-05", added:"2026-10-21", unit:"u5", quiz:"Q5",
  title:"Trig Values and Identities", sections:["2.5.1"], pages:5,
  summary:"Radians, the six trig functions at the special angles in every quadrant, finding one trig ratio from another with a triangle, and the six identities you use to solve trig equations on an interval.",
  flags:[],
  formulas:[
    {id:"L12.f.radians", name:"Calculus uses radians", tex:"\\text{Calculus is done entirely in radians.}", note:"$\\pi$ radians is $180^\\circ$ (course notes p. 86).", ref:"p. 1"},
    {id:"L12.f.angles", name:"Basic angles to know", tex:"0,\\ \\frac{\\pi}{6},\\ \\frac{\\pi}{4},\\ \\frac{\\pi}{3},\\ \\frac{\\pi}{2}", note:"Know sin, cos, tan, csc, sec and cot at these, then use the special triangles or the graphs to get the other quadrants.", ref:"p. 1"},
    {id:"L12.f.sinvals", name:"Sine at the basic angles", tex:"\\sin(0)=0,\\ \\sin\\left(\\tfrac{\\pi}{6}\\right)=\\tfrac{1}{2},\\ \\sin\\left(\\tfrac{\\pi}{4}\\right)=\\tfrac{1}{\\sqrt{2}},\\ \\sin\\left(\\tfrac{\\pi}{3}\\right)=\\tfrac{\\sqrt{3}}{2},\\ \\sin\\left(\\tfrac{\\pi}{2}\\right)=1", note:"From the special triangles: legs $1$, $\\sqrt{3}$, hypotenuse $2$ for $\\frac{\\pi}{6}$ and $\\frac{\\pi}{3}$; legs $1$, $1$, hypotenuse $\\sqrt{2}$ for $\\frac{\\pi}{4}$. The notes ask you to know these (p. 1); the full table is in the course notes, p. 87.", ref:"p. 1",
      blank:{tex:"\\sin\\left(\\tfrac{\\pi}{3}\\right)=\\boxed{\\,?\\,}", answer:"sqrt(3)/2", type:"num"}},
    {id:"L12.f.cosvals", name:"Cosine at the basic angles", tex:"\\cos(0)=1,\\ \\cos\\left(\\tfrac{\\pi}{6}\\right)=\\tfrac{\\sqrt{3}}{2},\\ \\cos\\left(\\tfrac{\\pi}{4}\\right)=\\tfrac{1}{\\sqrt{2}},\\ \\cos\\left(\\tfrac{\\pi}{3}\\right)=\\tfrac{1}{2},\\ \\cos\\left(\\tfrac{\\pi}{2}\\right)=0", note:"Cosine runs through the sine values backwards.", ref:"p. 1",
      blank:{tex:"\\cos\\left(\\tfrac{\\pi}{6}\\right)=\\boxed{\\,?\\,}", answer:"sqrt(3)/2", type:"num"}},
    {id:"L12.f.tanvals", name:"Tangent at the basic angles", tex:"\\tan(0)=0,\\ \\tan\\left(\\tfrac{\\pi}{6}\\right)=\\tfrac{1}{\\sqrt{3}},\\ \\tan\\left(\\tfrac{\\pi}{4}\\right)=1,\\ \\tan\\left(\\tfrac{\\pi}{3}\\right)=\\sqrt{3},\\ \\tan\\left(\\tfrac{\\pi}{2}\\right)\\text{ undefined}", note:"$\\tan = \\frac{\\sin}{\\cos}$. $\\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$.", ref:"p. 1",
      blank:{tex:"\\tan\\left(\\tfrac{\\pi}{3}\\right)=\\boxed{\\,?\\,}", answer:"sqrt(3)", type:"num"}},
    {id:"L12.f.sin", name:"Sine as a ratio", tex:"\\sin\\theta = \\frac{o}{h}", note:"$o$ = opposite side, $h$ = hypotenuse.", ref:"p. 1", blank:{tex:"\\sin\\theta = \\boxed{\\,?\\,}", answer:"o/h", vars:["o","h"], domain:[1,3]}},
    {id:"L12.f.cos", name:"Cosine as a ratio", tex:"\\cos\\theta = \\frac{a}{h}", note:"$a$ = adjacent side.", ref:"p. 2", blank:{tex:"\\cos\\theta = \\boxed{\\,?\\,}", answer:"a/h", vars:["a","h"], domain:[1,3]}},
    {id:"L12.f.sec", name:"Secant as a ratio", tex:"\\sec\\theta = \\frac{h}{a}", note:"$\\sec\\theta = \\frac{1}{\\cos\\theta}$.", ref:"p. 2", blank:{tex:"\\sec\\theta = \\boxed{\\,?\\,}", answer:"h/a", vars:["a","h"], domain:[1,3]}},
    {id:"L12.f.others", name:"Tangent, cosecant, cotangent as ratios", tex:"\\tan\\theta = \\frac{o}{a},\\quad \\csc\\theta = \\frac{h}{o},\\quad \\cot\\theta = \\frac{a}{o}", note:"The notes list all six functions (p. 1) and use $\\tan(\\theta) = \\frac{2}{1}$ as opposite over adjacent (p. 2). The ratio table is in the course notes, p. 87.", ref:"pp. 1 to 3",
      blank:{tex:"\\csc\\theta = \\boxed{\\,?\\,}", answer:"h/o", vars:["o","h"], domain:[1,3]}},
    {id:"L12.f.signs", name:"Signs of the sides by quadrant", tex:"\\text{I: } a>0,\\ o>0 \\qquad \\text{II: } a<0,\\ o>0 \\qquad \\text{III: } a<0,\\ o<0 \\qquad \\text{IV: } a>0,\\ o<0", note:"The hypotenuse is always positive. The signs come from copying the triangle into the quadrant (pp. 1 to 2).", ref:"pp. 1 to 2"},
    {id:"L12.f.pythag", name:"Pythagorean Theorem (missing side)", tex:"h^2 = o^2 + a^2", ref:"p. 2", blank:{tex:"h^2 = \\boxed{\\,?\\,}", answer:"o^2+a^2", vars:["o","a"]}},
    {id:"L12.f.sqrtsq", name:"Square root of a square", tex:"\\sqrt{h^2} = \\lvert h\\rvert", note:"Then pick the sign: $h>0$ always; a leg takes the sign of its quadrant.", ref:"p. 2", blank:{tex:"\\sqrt{a^2} = \\boxed{\\,?\\,}", text:true, accept:["|a|","abs(a)","| a |"]}},
    {id:"L12.f.pythid", name:"Pythagorean identity", tex:"\\sin^2(x) + \\cos^2(x) = 1", ref:"p. 3", blank:{tex:"\\sin^2(x) + \\boxed{\\,?\\,} = 1", answer:"cos(x)^2", vars:["x"]}},
    {id:"L12.f.odd", name:"Sine is odd", tex:"\\sin(-x) = -\\sin(x)", ref:"p. 3", blank:{tex:"\\sin(-x) = \\boxed{\\,?\\,}", answer:"-sin(x)", vars:["x"]}},
    {id:"L12.f.even", name:"Cosine is even", tex:"\\cos(-x) = \\cos(x)", ref:"p. 3", blank:{tex:"\\cos(-x) = \\boxed{\\,?\\,}", answer:"cos(x)", vars:["x"]}},
    {id:"L12.f.double", name:"Double angle (sine)", tex:"\\sin(2x) = 2\\sin(x)\\cos(x)", ref:"p. 3", blank:{tex:"\\sin(2x) = \\boxed{\\,?\\,}", answer:"2sin(x)cos(x)", vars:["x"]}},
    {id:"L12.f.sinadd", name:"Sine addition", tex:"\\sin(x+y) = \\sin(x)\\cos(y) + \\cos(x)\\sin(y)", ref:"p. 3", blank:{tex:"\\sin(x+y) = \\boxed{\\,?\\,}", answer:"sin(x)cos(y)+cos(x)sin(y)", vars:["x","y"]}},
    {id:"L12.f.cosadd", name:"Cosine addition", tex:"\\cos(x+y) = \\cos(x)\\cos(y) - \\sin(x)\\sin(y)", note:"Minus sign here, plus sign in the sine version.", ref:"p. 3", blank:{tex:"\\cos(x+y) = \\boxed{\\,?\\,}", answer:"cos(x)cos(y)-sin(x)sin(y)", vars:["x","y"]}},
    {id:"L12.f.supp", name:"Supplementary angle", tex:"\\sin(\\pi - x) = \\sin(x)", note:"Shown on p. 4 with the sine addition identity.", ref:"p. 4", blank:{tex:"\\sin(\\pi - x) = \\boxed{\\,?\\,}", answer:"sin(x)", vars:["x"]}},
    {id:"L12.f.cos2", name:"Double angle (cosine)", tex:"\\cos(2x) = \\cos^2(x) - \\sin^2(x)", note:"Exercise on p. 4: cosine addition with $y = x$.", ref:"p. 4", blank:{tex:"\\cos(2x) = \\boxed{\\,?\\,}", answer:"cos(x)^2-sin(x)^2", vars:["x"]}},
    {id:"L12.f.pivals", name:"Values at $\\pi$", tex:"\\sin(\\pi) = 0,\\quad \\cos(\\pi) = -1", ref:"p. 4", blank:{tex:"\\cos(\\pi) = \\boxed{\\,?\\,}", answer:"-1", type:"num"}}
  ],
  glossary:[
    {id:"L12.t.radian", term:"Radian", def:"The unit for angles in calculus. A full turn is $2\\pi$ radians, so $\\pi$ is a half turn and $\\frac{\\pi}{2}$ is a quarter turn. Calculus is done entirely in radians.", ref:"p. 1"},
    {id:"L12.t.special", term:"Special triangles", def:"The two right triangles you can draw from memory: legs $1$ and $\\sqrt{3}$ with hypotenuse $2$ (angles $\\frac{\\pi}{6}$ and $\\frac{\\pi}{3}$), and legs $1$ and $1$ with hypotenuse $\\sqrt{2}$ (angle $\\frac{\\pi}{4}$).", ref:"p. 1"},
    {id:"L12.t.ref", term:"Reference angle", def:"The angle between the end of $\\theta$ and the $x$-axis. $\\frac{7\\pi}{6}$ is $\\frac{\\pi}{6}$ past the negative $x$-axis, so its reference angle is $\\frac{\\pi}{6}$. The notes call this relating the angle to an angle in the first quadrant.", ref:"p. 1"},
    {id:"L12.t.quadrant", term:"Quadrant", def:"One of the four quarters of the $xy$-plane, numbered I to IV counterclockwise from the top right. The quadrant decides the signs of the triangle's sides.", ref:"pp. 1 to 2"},
    {id:"L12.t.hyp", term:"Hypotenuse", def:"The longest side of a right triangle, opposite the right angle. In this method it is always positive; only the legs $o$ and $a$ can be negative.", ref:"p. 2"},
    {id:"L12.t.identity", term:"Trigonometric identity", def:"An equation that is true for every value of the variable, like $\\sin^2(x)+\\cos^2(x)=1$. You use identities to rewrite an expression, not to find $x$.", ref:"p. 3"},
    {id:"L12.t.oddeven", term:"Odd and even", def:"Sine is odd: $\\sin(-x) = -\\sin(x)$. Cosine is even: $\\cos(-x)=\\cos(x)$. Flipping the sign of the angle flips the sign of sine but not cosine.", ref:"p. 3"},
    {id:"L12.t.interval", term:"Solving on an interval", def:"Finding every $x$ in a given interval, like $[0, 2\\pi]$, that makes the equation true. If the equation has $\\sin(2x)$, let $\\theta = 2x$ and double the interval to $[0, 4\\pi]$.", ref:"pp. 4 to 5"}
  ],
  figures:{
    circle:{title:"The unit circle", cap:"<b>Fig. 12.1</b> On the unit circle the point at angle $\\theta$ is $(\\cos\\theta, \\sin\\theta)$. The horizontal leg is $\\cos\\theta$, the vertical leg is $\\sin\\theta$, and the hypotenuse is 1. (Lecture 12, p. 1; unit circle from the course notes, p. 87)",
      build(host,{PLOT,M}){
        const G=PLOT.graph(host,{x:[-1.45,1.45],y:[-1.25,1.25],w:420,h:361,c:"var(--u5)",xstep:0.5,ystep:0.5,xlabel:"x",ylabel:"y"});
        G.param(Math.cos,Math.sin,0,2*PI,{cls:"cv"});
        for(let j=0;j<24;j++) if(j%2===0||j%3===0) G.closed(Math.cos(j*PI/12),Math.sin(j*PI/12),{r:2.3});
        const arc=pathEl(G,"tan");
        const rad=G.line(0,0,1,0,{cls:"ln"});
        const cl=G.line(0,0,1,0,{color:"var(--u6)"}); cl.style.strokeWidth=3.2;
        const sl=G.line(1,0,1,0,{color:"var(--c)"}); sl.style.strokeWidth=3.2;
        const lc=G.label(0,0,"cos θ",{cls:"lblc",anchor:"middle"}); lc.style.fill="var(--u6)";
        const ls=G.label(0,0,"sin θ",{cls:"lblc"});
        const lt=G.label(0.3,0.1,"θ",{cls:"lblc"});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        let th=7*PI/6, snap=true;
        const P=dragPt(G,{label:"Angle on the unit circle",clickPlot:true,onMove:(x,y)=>{ let t=Math.atan2(y,x); if(t<0) t+=2*PI; set(t); },onKey:(dx,dy)=>set(th+(dx||dy)*(snap?PI/12:0.02))});
        PLOT.seg(ctl,{label:"Angle mode",items:[["snap","Special angles"],["free","Any angle"]],value:"snap",onchange:v=>{ snap=v==="snap"; set(th); }});
        const S=PLOT.slider(ctl,{label:"θ (radians)",min:0,max:+(2*PI).toFixed(3),step:0.001,value:th,fmt:v=>v.toFixed(2),oninput:v=>set(v)});
        function set(t){
          t=((t%(2*PI))+2*PI)%(2*PI);
          let j=null;
          if(snap){ const sp=[]; for(let k=0;k<=24;k++) if(k%2===0||k%3===0) sp.push(k); let best=0; sp.forEach(k=>{ if(Math.abs(k*PI/12-t)<Math.abs(best*PI/12-t)) best=k; }); j=best%24; t=j*PI/12; }
          th=t; draw(j); }
        function draw(j){
          const c=Math.cos(th), s=Math.sin(th);
          P.set(c,s); rad.set(0,0,c,s); cl.set(0,0,c,0); sl.set(c,0,c,s); S.set(th.toFixed(3));
          let d=""; const r=0.2; for(let i=0;i<=40;i++){ const t=th*i/40; d+=(i?"L":"M")+G.X(r*Math.cos(t)).toFixed(1)+" "+G.Y(r*Math.sin(t)).toFixed(1)+" "; } arc.setAttribute("d",d);
          lt.set(0.3*Math.cos(th/2)+0.02,0.3*Math.sin(th/2)-0.03);
          lc.set(c/2, 0); lc.setAttribute("y",G.Y(0)+(s>=0?16:-8));
          ls.set(c,s/2); ls.setAttribute("x",G.X(c)+(c>=0?6:-48));
          if(j!=null){ const I=jinfo(j); const f=fn=>{ const e=exact(fn,j); return e?e.t:"\\text{undefined}"; };
            ro.innerHTML=`${M.tex(`\\theta = ${jT(j)}`)} &nbsp; ${I.q?`quadrant ${QN[I.q]}, reference angle ${M.tex(jT(I.ref))}`:"on an axis"}<br>${M.tex(`\\cos\\theta = ${f("cos")}`)} &nbsp; ${M.tex(`\\sin\\theta = ${f("sin")}`)} &nbsp; ${M.tex(`\\tan\\theta = ${f("tan")}`)}`;
          } else ro.innerHTML=`θ = <b>${th.toFixed(3)}</b> rad (${(th*180/PI).toFixed(1)}°) &nbsp; cos θ = <b>${c.toFixed(3)}</b> &nbsp; sin θ = <b>${s.toFixed(3)}</b> &nbsp; tan θ = <b>${Math.abs(c)<1e-9?"undefined":(s/c).toFixed(3)}</b>`;
        }
        set(th);
      }},
    triangle:{title:"One ratio to another", cap:"<b>Fig. 12.2</b> Drag the corner of the triangle into any quadrant. The legs $a$ and $o$ take the signs of the coordinates; the hypotenuse $h = \\sqrt{o^2+a^2}$ is always positive. (Lecture 12, pp. 2 to 3)",
      build(host,{PLOT,M}){
        const G=PLOT.graph(host,{x:[-5.5,5.5],y:[-4.5,4.5],w:560,h:459,c:"var(--u5)",xstep:1,ystep:1,xlabel:"x",ylabel:"y"});
        const hyp=G.line(0,0,1,1,{cls:"tan"}); hyp.style.strokeWidth=2.4;
        const la=G.line(0,0,1,0,{cls:"ln"}); la.style.strokeWidth=2.4;
        const lo=G.line(1,0,1,1,{cls:"ln"}); lo.style.strokeWidth=2.4;
        const sq1=G.line(0,0,0,0,{cls:"lt"}), sq2=G.line(0,0,0,0,{cls:"lt"});
        const arc=pathEl(G,"lt");
        const ta=G.label(0,0,"a",{cls:"lbl",anchor:"middle"}), tob=G.label(0,0,"o",{cls:"lbl"}), th=G.label(0,0,"h",{cls:"lbl",anchor:"middle"});
        const ro=PLOT.readout(host);
        let A=-3, O=1;
        const P=dragPt(G,{label:"Corner of the triangle",clickPlot:true,onMove:(x,y)=>put(Math.round(x),Math.round(y)),onKey:(dx,dy)=>put(A+dx,O+dy)});
        function put(x,y){ x=Math.max(-5,Math.min(5,x)); y=Math.max(-4,Math.min(4,y)); if(x===0) x=A>0?1:-1; if(y===0) y=O>0?1:-1; A=x; O=y; draw(); }
        function draw(){
          P.set(A,O); hyp.set(0,0,A,O); la.set(0,0,A,0); lo.set(A,0,A,O);
          const e=0.3, sx=A>0?-e:e, sy=O>0?e:-e; sq1.set(A+sx,0,A+sx,sy); sq2.set(A+sx,sy,A,sy);
          let t0=Math.atan2(O,A); if(t0<0) t0+=2*PI; let d=""; for(let i=0;i<=40;i++){ const t=t0*i/40; d+=(i?"L":"M")+G.X(0.7*Math.cos(t)).toFixed(1)+" "+G.Y(0.7*Math.sin(t)).toFixed(1)+" "; } arc.setAttribute("d",d);
          ta.set(A/2,0,`a = ${A}`.replace("-","−")); ta.setAttribute("y",G.Y(0)+(O>0?16:-8));
          tob.set(A,O/2,`o = ${O}`.replace("-","−")); tob.setAttribute("x",G.X(A)+(A>0?8:-58));
          const h2=A*A+O*O; th.set(A/2,O/2,"h"); th.setAttribute("x",G.X(A/2)+(A*O>0?-14:14)); th.setAttribute("y",G.Y(O/2)+(O>0?-6:14));
          const q=A>0?(O>0?1:4):(O>0?2:3);
          const a=V(String(A),"",A), o=V(String(O),"",O), h=V(sqT(h2),"",Math.sqrt(h2)); const S={a,o,h};
          const r=fn=>{ const [n,dd]=RATIO[fn]; return `\\${fn}\\theta = ${ratioTeX(S[n],S[dd])}`; };
          ro.innerHTML=`Quadrant ${QN[q]}: ${M.tex(`a = ${A},\\ o = ${O},\\ h = \\sqrt{(${A})^2 + (${O})^2} = ${sqT(h2)}`)}<br>${M.tex(r("sin"))} &nbsp; ${M.tex(r("cos"))} &nbsp; ${M.tex(r("tan"))}<br>${M.tex(r("csc"))} &nbsp; ${M.tex(r("sec"))} &nbsp; ${M.tex(r("cot"))}`;
        }
        draw();
      }},
    solve:{title:"Solving on [0, 2π]", cap:"<b>Fig. 12.3</b> The solutions of $f(x) = k$ on $[0, 2\\pi]$ are where the horizontal line $y = k$ meets the graph. $\\sin(2x)$ runs through two full periods on $[0,2\\pi]$, so it hits each level twice as often as $\\sin(x)$. (Lecture 12, pp. 4 to 5)",
      build(host,{PLOT,M}){
        const G=PLOT.graph(host,{x:[-0.35,2*PI+0.35],y:[-1.5,1.5],piX:true,ystep:0.5,c:"var(--u5)",xlabel:"x",ylabel:"y"});
        G.vline(2*PI,{cls:"lt"});
        const fns={sin1:["sin",1,"\\sin(x)"],sin2:["sin",2,"\\sin(2x)"],cos1:["cos",1,"\\cos(x)"],cos2:["cos",2,"\\cos(2x)"]};
        let key="sin2", ki=5;
        const KS=["-1","-r3","-r2","-1/2","0","1/2","r2","r3","1"];
        const cur=x=>{ const [f,n]=fns[key]; return FN[f](n*x); };
        const curve=G.fn(cur,{cls:"cv c",from:0,to:2*PI});
        const hl=G.line(-0.35,0,2*PI+0.35,0,{cls:"tan dash"});
        const dots=[]; for(let i=0;i<9;i++){ const d=G.dot(0,0,{filled:true}); d.style.display="none"; dots.push(d); }
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        PLOT.seg(ctl,{label:"Function",items:[["sin1","sin(x)"],["sin2","sin(2x)"],["cos1","cos(x)"],["cos2","cos(2x)"]],value:key,onchange:v=>{ key=v; draw(); }});
        PLOT.slider(ctl,{label:"k",min:0,max:8,step:1,value:ki,fmt:i=>M.tex(KV[KS[i]].t),oninput:v=>{ ki=v; draw(); }});
        function draw(){
          const [f,n,t]=fns[key]; const k=KV[KS[ki]];
          curve.update(cur,0,2*PI); hl.set(-0.35,k.v,2*PI+0.35,k.v);
          const xs=solveB(f,n,k.v);
          dots.forEach((d,i)=>{ if(i<xs.length){ d.style.display=""; d.set(xs[i]*PI/24,k.v); } else d.style.display="none"; });
          const th=thetaList(f,n,k.v).map(jT);
          ro.innerHTML=`${M.tex(`${t} = ${k.t}`)} &nbsp; ${xs.length} solution${xs.length===1?"":"s"} in ${M.tex("[0,2\\pi]")}: ${M.tex(xs.map(k24T).join(",\\ ")||"\\text{none}")}`+(n===2?`<br>With ${M.tex("\\theta = 2x")}, ${M.tex("\\theta")} runs over ${M.tex("[0,4\\pi]")}: ${M.tex("\\theta = "+(th.join(",\\ ")||"\\text{none}"))}`:"");
        }
        draw();
      }}
  },
  gens:[
    {id:"L12.g.special", title:"Exact values at special angles", skill:"Evaluate a trig function at a special angle in any quadrant", ref:"p. 1",
      gen(R,d){
        const fns=d===1?["sin","cos"]:d===2?["tan","sec","csc","cot","sin","cos"]:["sin","cos","tan","sec","csc","cot"];
        const pool=[]; for(let j=1;j<24;j++) if((j%2===0||j%3===0)&&(d>1||j%6!==0||R.int(1,4)===1)) pool.push(j);
        let fn, j, e, guard=0;
        do{ fn=R.pick(fns); j=R.pick(pool); if(d===1&&j%6===0&&R.int(1,3)>1) j=R.pick(pool.filter(x=>x%6)); if(d===3){ j = R.int(0,1)? j-24 : j+24; } e=exact(fn,j); guard++; }while((!e||(d===2&&jinfo(j).q===1))&&guard<50);
        if(!e){ fn="sin"; j=d===3?-20:14; e=exact(fn,j); }
        const I=jinfo(j), m=I.m, ang=jT(j);
        const check=FN[fn](j*PI/12); if(Math.abs(check-e.v)>1e-9) throw new Error("exact table mismatch");
        const steps=[];
        if(j<0||j>=24) steps.push(`Move into $[0, 2\\pi)$ by ${j<0?"adding":"subtracting"} $2\\pi$: $${ang} ${j<0?"+":"-"} 2\\pi = ${jT(m)}$. Angles that differ by full turns of $2\\pi$ end in the same place.`);
        if(I.q){
          const sides={2:["\\sqrt{3}","1","2"],3:["1","1","\\sqrt{2}"],4:["1","\\sqrt{3}","2"]}[I.ref];
          const sa=(I.cs<0?"-":"")+sides[0], so=(I.ss<0?"-":"")+sides[1];
          steps.push(`Draw $${jT(m)}$ in the $xy$-plane. It ends in quadrant ${QN[I.q]}, and it makes an angle of $${jT(I.ref)}$ with the $x$-axis. Relate it to $${jT(I.ref)}$ in the first quadrant.`);
          steps.push(`Special triangle for $${jT(I.ref)}$: horizontal side $${sides[0]}$, vertical side $${sides[1]}$, hypotenuse $${sides[2]}$. Copy it into quadrant ${QN[I.q]}: $a = ${sa}$, $o = ${so}$, $h = ${sides[2]}$ (the hypotenuse stays positive).`);
          const S={a:V(sa),o:V(so),h:V(sides[2])}; const [n,dd]=RATIO[fn];
          steps.push(`$\\${fn}\\left(${ang}\\right) = \\frac{${n}}{${dd}} = ${ratioTeX(S[n],S[dd])}$.`);
        } else {
          const pt={0:"(1, 0)",6:"(0, 1)",12:"(-1, 0)",18:"(0, -1)"}[m], axis={0:"positive $x$-axis",6:"positive $y$-axis",12:"negative $x$-axis",18:"negative $y$-axis"}[m];
          const cx={0:"1",6:"0",12:"-1",18:"0"}[m], sy={0:"0",6:"1",12:"0",18:"-1"}[m];
          steps.push(`$${jT(m)}$ lands on the ${axis}. On the unit circle that point is $${pt}$, so $\\cos = ${cx}$ and $\\sin = ${sy}$ (or read them off the graphs of sin and cos).`);
          const form={sin:`${sy}`,cos:`${cx}`,tan:`\\frac{\\sin}{\\cos} = \\frac{${sy}}{${cx}}`,csc:`\\frac{1}{\\sin} = \\frac{1}{${sy}}`,sec:`\\frac{1}{\\cos} = \\frac{1}{${cx}}`,cot:`\\frac{\\cos}{\\sin} = \\frac{${cx}}{${sy}}`}[fn];
          steps.push(`$\\${fn}\\left(${ang}\\right) = ${form}${form===e.t?"":" = "+e.t}$.`);
        }
        return {prompt:`Find the exact value of $\\${fn}\\left(${ang}\\right)$.`, answer:{type:"num",answer:e.a}, verify:{value:check},
          hint:"Find the quadrant and the angle to the $x$-axis. Copy the special triangle into that quadrant with signs, then take the ratio. Remember $\\csc = \\frac{h}{o}$, $\\sec = \\frac{h}{a}$, $\\cot = \\frac{a}{o}$.",
          steps, answerTeX:`$\\${fn}\\left(${ang}\\right) = ${e.t}$`};
      }},
    {id:"L12.g.triangle", title:"One trig ratio from another", skill:"Use a right triangle and the quadrant to find a trig value", ref:"p. 2",
      gen(R,d){
        const Q=d===1?1:R.pick([2,3,4]);
        const given=d===3?R.pick(["sec","csc","cot","tan"]):R.pick(["sin","cos","tan"]);
        const sx=(Q===2||Q===3)?-1:1, sy=(Q===3||Q===4)?-1:1;
        let A,O,H2,miss;
        if(given==="tan"||given==="cot"){ let p,q; do{ p=R.int(1,7); q=R.int(1,7); }while(M.gcd(p,q)!==1||(p===1&&q===1)); O=p; A=q; H2=p*p+q*q; miss="h"; }
        else { let h,l; do{ h=R.int(3,9); l=R.int(1,h-1); }while(M.gcd(h,l)!==1||2*l===h); H2=h*h; if(given==="sin"||given==="csc"){ O=l; miss="a"; A=Math.sqrt(h*h-l*l); } else { A=l; miss="o"; O=Math.sqrt(h*h-l*l); } }
        const h=Math.sqrt(H2), aS=sx*A, oS=sy*O;
        const sideT=(k)=>{ if(k==="h") return miss==="h"?sqT(H2):String(h); if(k==="a") return miss==="a"?(sx<0?"-":"")+sqT(H2-O*O):String(aS); return miss==="o"?(sy<0?"-":"")+sqT(H2-A*A):String(oS); };
        const sideA=(k)=>{ if(k==="h") return miss==="h"?sqA(H2):String(h); if(k==="a") return miss==="a"?(sx<0?"-":"")+sqA(H2-O*O):String(aS); return miss==="o"?(sy<0?"-":"")+sqA(H2-A*A):String(oS); };
        const S={a:V(sideT("a"),sideA("a")),o:V(sideT("o"),sideA("o")),h:V(sideT("h"),sideA("h"))};
        const [gn,gd]=RATIO[given];
        const kn={a:aS,o:oS,h}[gn], kd={a:aS,o:oS,h}[gd];
        const gT=M.frac(kn,kd);
        const others=["sin","cos","tan","csc","sec","cot"].filter(f=>f!==given);
        const target=R.pick(others);
        const [tn,td]=RATIO[target];
        const intv={1:"0 < \\theta < \\frac{\\pi}{2}",2:"\\frac{\\pi}{2} < \\theta < \\pi",3:"\\pi < \\theta < \\frac{3\\pi}{2}",4:R.pick(["\\frac{3\\pi}{2} < \\theta < 2\\pi","-\\frac{\\pi}{2} < \\theta < 0"])}[Q];
        const name={o:"opposite",a:"adjacent",h:"hypotenuse"};
        const steps=[];
        const mid=`\\frac{${S[gn].t}}{${S[gd].t}}`; const setup=`$\\${given}(\\theta) = ${gT}${mid===gT?"":" = "+mid} = \\frac{${gn}}{${gd}}$, so $${gn} = ${S[gn].t}$ and $${gd} = ${S[gd].t}$.`;
        const why = Q===1?"":Q===3&&miss==="h"?" In quadrant III both legs are negative.":(kn<0||kd<0)?" The hypotenuse is always positive, so the minus sign goes on the leg.":"";
        steps.push(`$${intv}$ puts $\\theta$ in quadrant ${QN[Q]}. Draw the right triangle there. ${setup}${why}`);
        if(miss==="h"){
          steps.push(`$h^2 = o^2 + a^2 = ${par(String(oS))}^2 + ${par(String(aS))}^2 = ${H2}$.`);
          steps.push(`$\\sqrt{h^2} = \\sqrt{${H2}}$, so $|h| = ${sqT(H2)}$, and $h = ${sqT(H2)}$ since the hypotenuse $> 0$.`);
        } else {
          const kv=miss==="a"?O:A, ks=miss==="a"?oS:aS, ms=miss==="a"?sx:sy, nn=H2-kv*kv;
          steps.push(`$h^2 = o^2 + a^2$: $\\ ${h}^2 = ${miss==="a"?par(String(ks))+"^2 + a^2":"o^2 + "+par(String(ks))+"^2"}$, so $${miss}^2 = ${H2} - ${kv*kv} = ${nn}$.`);
          steps.push(`$\\sqrt{${miss}^2} = \\sqrt{${nn}}$, so $|${miss}| = ${sqT(nn)}$. In quadrant ${QN[Q]}, $${miss} ${ms<0?"<":">"} 0$, so $${miss} = ${S[miss].t}$.`);
        }
        steps.push(`$\\${target}(\\theta) = \\frac{${tn}}{${td}} = ${ratioTeX(S[tn],S[td])}$.`);
        const th=Math.atan2(oS,aS);
        if(Math.abs(FN[given](th)-kn/kd)>1e-9) throw new Error("given value mismatch");
        return {prompt:`Given that $\\${given}(\\theta) = ${gT}$ and $${intv}$, find the exact value of $\\${target}(\\theta)$.`,
          answer:{type:"num",answer:`(${S[tn].a})/(${S[td].a})`}, verify:{value:FN[target](th)},
          hint:`Write $\\${given}(\\theta)$ as $\\frac{${gn}}{${gd}}$, draw the triangle in quadrant ${QN[Q]}, find the missing side with $h^2 = o^2 + a^2$, and give it the sign of its quadrant. The hypotenuse is always positive.`,
          steps, answerTeX:`$\\${target}(\\theta) = ${ratioTeX(S[tn],S[td])}$`};
      }},
    {id:"L12.g.trigvar", title:"Trig ratios in terms of $x$", skill:"Find a trig expression in $x$ from a triangle with variable sides", ref:"p. 3",
      gen(R,d){
        const k=R.int(1,5), m=R.int(2,5);
        const kx=k===1?"x":`${k}x`, kxA=`${k}*x`, k2=k*k, kk2=k===1?"x^2":`${k2}x^2`;
                // each template: given TeX, sides (o,a,h) as [TeX, ascii], missing side, Pythagoras lines, quadrant text, theta (ascii) for the check, domain
        const tpl={
          tanKx:()=>({F:"tan",g:kx,frac:`\\frac{${kx}}{1}`,Q:"0 < \\theta < \\frac{\\pi}{2}",qn:"I",s:{o:[kx,kxA],a:["1","1"],h:[`\\sqrt{${kk2}+1}`,`sqrt(${k2}x^2+1)`]},miss:"h",
            py:[`h^2 = (${kx})^2 + 1^2`,`h^2 = ${kk2}+1`,`\\sqrt{h^2} = \\sqrt{${kk2}+1}`,`|h| = \\sqrt{${kk2}+1}`,`h = \\sqrt{${kk2}+1} \\quad\\text{since } h>0`],th:`arctan(${k}x)`,dom:[0.2,3],why:""}),
          tanXm:()=>({F:"tan",g:`\\frac{x}{${m}}`,frac:`\\frac{x}{${m}}`,Q:"0 < \\theta < \\frac{\\pi}{2}",qn:"I",s:{o:["x","x"],a:[String(m),String(m)],h:[`\\sqrt{x^2+${m*m}}`,`sqrt(x^2+${m*m})`]},miss:"h",
            py:[`h^2 = x^2 + ${m}^2`,`h^2 = x^2+${m*m}`,`|h| = \\sqrt{x^2+${m*m}}`,`h = \\sqrt{x^2+${m*m}} \\quad\\text{since } h>0`],th:`arctan(x/${m})`,dom:[0.3,4]}),
          secQ1:()=>{ const kk=R.int(2,4), mm=R.pick([1,3,5].filter(v=>M.gcd(v,kk)===1)); const kxx=`${kk}x`; return {F:"sec",g:`\\frac{${kxx}}{${mm}}`,frac:`\\frac{${kxx}}{${mm}}`,Q:"0 < \\theta < \\frac{\\pi}{2}",qn:"I",s:{h:[kxx,`${kk}*x`],a:[String(mm),String(mm)],o:[`\\sqrt{${kk*kk}x^2-${mm*mm}}`,`sqrt(${kk*kk}x^2-${mm*mm})`]},miss:"o",
            py:[`(${kxx})^2 = o^2 + ${mm}^2`,`o^2 = ${kk*kk}x^2-${mm*mm}`,`|o| = \\sqrt{${kk*kk}x^2-${mm*mm}}`,`o = \\sqrt{${kk*kk}x^2-${mm*mm}} \\quad\\text{since we are in the first quadrant}`],th:`arccos(${mm}/(${kk}x))`,dom:[1.15*mm/kk,3*mm/kk+1]}; },
          sinQ14:()=>{ const mm=R.int(k+1,k+5); const mm2=mm*mm; return {F:"sin",g:`\\frac{${kx}}{${mm}}`,frac:`\\frac{${kx}}{${mm}}`,Q:"-\\frac{\\pi}{2} < \\theta < \\frac{\\pi}{2}",qn:"I or IV",s:{o:[kx,kxA],h:[String(mm),String(mm)],a:[`\\sqrt{${mm2}-${kk2}}`,`sqrt(${mm2}-${k2}x^2)`]},miss:"a",
            py:[`${mm}^2 = (${kx})^2 + a^2`,`a^2 = ${mm2}-${kk2}`,`|a| = \\sqrt{${mm2}-${kk2}}`,`a = \\sqrt{${mm2}-${kk2}} \\quad\\text{since } a>0 \\text{ when } -\\tfrac{\\pi}{2}<\\theta<\\tfrac{\\pi}{2}`],th:`arcsin(${k}x/${mm})`,dom:[0.15*mm/k,0.85*mm/k]}; },
          sinQ2:()=>{ const mm=R.int(k+1,k+5); const mm2=mm*mm; return {F:"sin",g:`\\frac{${kx}}{${mm}}`,frac:`\\frac{${kx}}{${mm}}`,Q:"\\frac{\\pi}{2} < \\theta < \\pi",qn:"II",s:{o:[kx,kxA],h:[String(mm),String(mm)],a:[`-\\sqrt{${mm2}-${kk2}}`,`-sqrt(${mm2}-${k2}x^2)`]},miss:"a",
            py:[`${mm}^2 = (${kx})^2 + a^2`,`a^2 = ${mm2}-${kk2}`,`|a| = \\sqrt{${mm2}-${kk2}}`,`-a = \\sqrt{${mm2}-${kk2}} \\quad\\text{since } a<0`,`a = -\\sqrt{${mm2}-${kk2}}`],th:`pi - arcsin(${k}x/${mm})`,dom:[0.1*mm/k,0.85*mm/k]}; },
          cosQ12:()=>{ const mm=R.int(k+1,k+5); const mm2=mm*mm; return {F:"cos",g:`\\frac{${kx}}{${mm}}`,frac:`\\frac{${kx}}{${mm}}`,Q:"0 < \\theta < \\pi",qn:"I or II",s:{a:[kx,kxA],h:[String(mm),String(mm)],o:[`\\sqrt{${mm2}-${kk2}}`,`sqrt(${mm2}-${k2}x^2)`]},miss:"o",
            py:[`${mm}^2 = o^2 + (${kx})^2`,`o^2 = ${mm2}-${kk2}`,`|o| = \\sqrt{${mm2}-${kk2}}`,`o = \\sqrt{${mm2}-${kk2}} \\quad\\text{since } o>0 \\text{ when } 0<\\theta<\\pi`],th:`arccos(${k}x/${mm})`,dom:[0.15*mm/k,0.85*mm/k]}; },
          cosQ4:()=>{ const mm=R.int(k+1,k+5); const mm2=mm*mm; return {F:"cos",g:`\\frac{${kx}}{${mm}}`,frac:`\\frac{${kx}}{${mm}}`,Q:"-\\frac{\\pi}{2} < \\theta < 0",qn:"IV",s:{a:[kx,kxA],h:[String(mm),String(mm)],o:[`-\\sqrt{${mm2}-${kk2}}`,`-sqrt(${mm2}-${k2}x^2)`]},miss:"o",
            py:[`${mm}^2 = o^2 + (${kx})^2`,`o^2 = ${mm2}-${kk2}`,`|o| = \\sqrt{${mm2}-${kk2}}`,`-o = \\sqrt{${mm2}-${kk2}} \\quad\\text{since } o<0 \\text{ in quadrant IV}`,`o = -\\sqrt{${mm2}-${kk2}}`],th:`-arccos(${k}x/${mm})`,dom:[0.1*mm/k,0.85*mm/k]}; },
          secNeg:()=>{ const q3=R.int(0,1)===1; return {F:"sec",g:"-x",frac:"\\frac{x}{-1}",Q:q3?"\\pi < \\theta < \\frac{3\\pi}{2}":"\\frac{\\pi}{2} < \\theta < \\pi",qn:q3?"III":"II",s:{h:["x","x"],a:["-1","-1"],o:[q3?"-\\sqrt{x^2-1}":"\\sqrt{x^2-1}",q3?"-sqrt(x^2-1)":"sqrt(x^2-1)"]},miss:"o",
            py:[`o^2 + (-1)^2 = x^2`,`o^2 = x^2-1`,`|o| = \\sqrt{x^2-1}`].concat(q3?[`-o = \\sqrt{x^2-1} \\quad\\text{since we are in the third quadrant}`,`o = -\\sqrt{x^2-1}`]:[`o = \\sqrt{x^2-1} \\quad\\text{since } o>0 \\text{ in the second quadrant}`]),th:q3?"2pi - arccos(-1/x)":"arccos(-1/x)",dom:[1.2,5],why:" The hypotenuse is always positive, so write $-x = \\frac{x}{-1}$ and put the minus sign on the adjacent side."}; },
          sinMx:()=>{ const q2=R.int(0,1)===1; return {F:"sin",g:`\\frac{${m}}{x}`,frac:`\\frac{${m}}{x}`,Q:q2?"\\frac{\\pi}{2} < \\theta < \\pi":"0 < \\theta < \\frac{\\pi}{2}",qn:q2?"II":"I",s:{o:[String(m),String(m)],h:["x","x"],a:[(q2?"-":"")+`\\sqrt{x^2-${m*m}}`,(q2?"-":"")+`sqrt(x^2-${m*m})`]},miss:"a",
            py:[`x^2 = ${m}^2 + a^2`,`a^2 = x^2-${m*m}`,`|a| = \\sqrt{x^2-${m*m}}`].concat(q2?[`-a = \\sqrt{x^2-${m*m}} \\quad\\text{since } a<0`,`a = -\\sqrt{x^2-${m*m}}`]:[`a = \\sqrt{x^2-${m*m}} \\quad\\text{since we are in the first quadrant}`]),th:q2?`pi - arcsin(${m}/x)`:`arcsin(${m}/x)`,dom:[m*1.15,m*4]}; },
          cosSq:()=>({F:"cos",g:`\\frac{x}{\\sqrt{x^2+${m*m}}}`,frac:`\\frac{x}{\\sqrt{x^2+${m*m}}}`,Q:"0 < \\theta < \\pi",qn:"I or II",s:{a:["x","x"],h:[`\\sqrt{x^2+${m*m}}`,`sqrt(x^2+${m*m})`],o:[String(m),String(m)]},miss:"o",
            py:[`o^2 + x^2 = \\left(\\sqrt{x^2+${m*m}}\\right)^2`,`o^2 + x^2 = x^2+${m*m}`,`o^2 = ${m*m}`,`|o| = ${m}`,`o = ${m} \\quad\\text{since } o>0 \\text{ when } 0<\\theta<\\pi`],th:`arccos(x/sqrt(x^2+${m*m}))`,dom:[0.3,4]}),
          sinSq:()=>({F:"sin",g:`\\frac{x}{\\sqrt{x^2+${m*m}}}`,frac:`\\frac{x}{\\sqrt{x^2+${m*m}}}`,Q:"\\frac{\\pi}{2} < \\theta < \\pi",qn:"II",s:{o:["x","x"],h:[`\\sqrt{x^2+${m*m}}`,`sqrt(x^2+${m*m})`],a:[`-${m}`,`-${m}`]},miss:"a",
            py:[`\\left(\\sqrt{x^2+${m*m}}\\right)^2 = x^2 + a^2`,`a^2 = ${m*m}`,`|a| = ${m}`,`a = -${m} \\quad\\text{since } a<0 \\text{ in the second quadrant}`],th:`pi - arcsin(x/sqrt(x^2+${m*m}))`,dom:[0.3,4]})
        };
        const names=d===1?["tanKx","tanXm","secQ1","sinMx"]:d===2?["sinQ14","sinQ2","cosQ12","cosSq","sinMx"]:["secNeg","sinSq","cosQ4","sinQ2","secNeg"];
        let t=tpl[R.pick(names)]();
        if(d===1&&t.qn!=="I") t=tpl.tanKx();
        const [gn,gd]=RATIO[t.F];
        const tg=R.pick(["sin","cos","tan","csc","sec","cot"].filter(f=>f!==t.F&&RATIO[f].includes(t.miss)));
        const [tn,td]=RATIO[tg];
        const S={o:V(t.s.o[0],t.s.o[1]),a:V(t.s.a[0],t.s.a[1]),h:V(t.s.h[0],t.s.h[1])};
        const steps=[`Rewrite as a ratio of sides: $\\${t.F}(\\theta) = ${t.frac} = \\frac{${gn}}{${gd}}$, so $${gn} = ${S[gn].t}$ and $${gd} = ${S[gd].t}$. Draw the triangle in quadrant ${t.qn}.${t.why||""}`,
          `Pythagoras for the missing side $${t.miss}$: $$\\begin{aligned}${t.py.map(l=>l.replace("=","&=")).join("\\\\")}\\end{aligned}$$`,
          `$\\${tg}(\\theta) = \\frac{${tn}}{${td}} = ${ratioTeX(S[tn],S[td])}$.`];
        return {prompt:`Given that $\\${t.F}(\\theta) = ${t.g}$ and $${t.Q}$, find $\\${tg}(\\theta)$ in terms of $x$.`,
          answer:{answer:`(${S[tn].a})/(${S[td].a})`,vars:["x"],domain:t.dom}, verify:{expr:`${tg==="csc"?"1/sin":tg==="sec"?"1/cos":tg==="cot"?"1/tan":tg}(${t.th})`},
          hint:"Write the given value as a fraction of two sides, draw the triangle, use $h^2 = o^2 + a^2$ for the third side ($\\sqrt{o^2} = |o|$), then choose its sign from the quadrant.",
          steps, answerTeX:`$\\${tg}(\\theta) = ${ratioTeX(S[tn],S[td])}$`};
      }},
    {id:"L12.g.solve", title:"Solve a trig equation on $[0, 2\\pi]$", skill:"Use identities and special values to find every solution on an interval", ref:"pp. 4 to 5",
      gen(R,d){
        let eq, steps=[], conds=[], f, extraZero=false;
        const I2="0 \\le x \\le 2\\pi";
        if(d===1){
          const kind=R.pick(["lin","lin","sq","prod"]);
          if(kind==="lin"){
            const fn=R.pick(["sin","cos","tan"]);
            const forms=fn==="tan"?[["1","F = 1"],["-1","F + 1 = 0"],["s3","F = \\sqrt{3}"],["-s3","F + \\sqrt{3} = 0"],["i3","\\sqrt{3}\\,F = 1"],["-i3","\\sqrt{3}\\,F + 1 = 0"]]
              :[["1/2","2F - 1 = 0"],["-1/2","2F + 1 = 0"],["r3","2F = \\sqrt{3}"],["-r3","2F + \\sqrt{3} = 0"],["r2","\\sqrt{2}\\,F = 1"],["-r2","\\sqrt{2}\\,F + 1 = 0"],["-1","F + 1 = 0"],["0","3F = 0"]];
            const [key,form]=R.pick(forms); const k=KV[key];
            eq=form.replace("F",`\\${fn}(x)`);
            conds=[[fn,key]];
            steps.push(`Isolate the trig function: $\\${fn}(x) = ${k.t}$.`);
            f=x=>FN[fn](x)-k.v;
          } else if(kind==="sq"){
            const [fn,lhs,key]=R.pick([["sin","4\\sin^2(x) = 1","1/2"],["cos","4\\cos^2(x) = 1","1/2"],["sin","2\\sin^2(x) = 1","r2"],["cos","2\\cos^2(x) = 1","r2"],["sin","4\\sin^2(x) = 3","r3"],["cos","4\\cos^2(x) = 3","r3"],["tan","\\tan^2(x) = 3","s3"],["tan","3\\tan^2(x) = 1","i3"]]);
            const k=KV[key]; eq=lhs;
            steps.push(`Divide: $\\${fn}^2(x) = \\left(${k.t}\\right)^2$. A difference of squares: $\\left(\\${fn}(x) - ${k.t}\\right)\\left(\\${fn}(x) + ${k.t}\\right) = 0$, so $\\${fn}(x) = ${k.t}$ or $\\${fn}(x) = -${k.t}$.`);
            conds=[[fn,key],[fn,"-"+key]];
            f=x=>FN[fn](x)**2-k.v**2;
          } else {
            const [key,form]=R.pick([["-1/2","2\\cos(x) + 1"],["1/2","2\\cos(x) - 1"],["-r2","\\sqrt{2}\\cos(x) + 1"],["1/2","2\\sin(x) - 1"],["-1/2","2\\sin(x) + 1"]]);
            const fn=form.includes("cos")?"cos":"sin", k=KV[key];
            eq=`x\\left(${form}\\right) = 0`;
            steps.push(`A product is 0 only when a factor is 0: $x = 0$ or $${form} = 0$, that is $\\${fn}(x) = ${k.t}$.`);
            conds=[[fn,key]]; extraZero=true;
            f=x=>x*(FN[fn](x)-k.v);
          }
        } else if(d===2){
          const kind=R.pick(["s2","c2","sc","sc","cc"]);
          const keys=["1/2","-1/2","r3","-r3","r2","-r2"];
          const key=R.pick(kind==="cc"?["1/2","-1/2","r3","-r3","0"]:keys), k=KV[key];
          const fn=kind==="c2"||kind==="cc"?"cos":"sin";
          if(kind==="s2"||kind==="c2"){ eq=`\\${fn}(2x) = ${k.t}`; }
          else if(kind==="sc"){ const half={"1/2":"\\frac{1}{4}","-1/2":"-\\frac{1}{4}","r3":"\\frac{\\sqrt{3}}{4}","-r3":"-\\frac{\\sqrt{3}}{4}","r2":"\\frac{1}{2\\sqrt{2}}","-r2":"-\\frac{1}{2\\sqrt{2}}"}[key];
            eq=`\\sin(x)\\cos(x) = ${half}`; steps.push(`The left side looks like $2\\sin(x)\\cos(x) = \\sin(2x)$. Multiply both sides by 2: $2\\sin(x)\\cos(x) = ${k.t}$, so $\\sin(2x) = ${k.t}$.`); }
          else { eq=`\\cos^2(x) - \\sin^2(x) = ${k.t}`; steps.push(`$\\cos^2(x) - \\sin^2(x) = \\cos(2x)$ (cosine addition with $y = x$), so $\\cos(2x) = ${k.t}$.`); }
          const th=thetaList(fn,2,k.v).map(jT);
          steps.push(`Let $\\theta = 2x$. Since $0 \\le x \\le 2\\pi$, we get $0 \\le \\frac{\\theta}{2} \\le 2\\pi$, so $0 \\le \\theta \\le 4\\pi$.`);
          steps.push(whereLine(fn,key,"\\theta","[0, 4\\pi]",th));
          steps.push(`Substitute $2x$ back in for $\\theta$ and divide by 2.`);
          conds=[[fn,key,2]];
          f=x=>FN[fn](2*x)-k.v;
        } else {
          const kind=R.pick(["sin2s","sin2c","quad","quad","pq"]);
          if(kind==="sin2s"){ const [a,b,key]=R.pick([[2,1,"-1"],[-2,1,"1"],[1,1,"-1/2"],[-1,1,"1/2"],[2,-1,"1"],[1,-1,"1/2"]]);
            const aT=a===1?"":a===-1?"-":String(a), bT=b===1?"+":b===-1?"-":(b<0?"-":"+")+Math.abs(b);
            eq=`${aT}\\sin(x) ${bT} \\sin(2x) = 0`;
            steps.push(`Use $\\sin(2x) = 2\\sin(x)\\cos(x)$: $\\ ${aT}\\sin(x) ${b<0?"-":"+"} ${2*Math.abs(b)}\\sin(x)\\cos(x) = 0$.`);
            steps.push(`Factor out $\\sin(x)$ (do not divide by it, or you lose solutions): $\\sin(x)\\left(${a} ${b<0?"-":"+"} ${2*Math.abs(b)}\\cos(x)\\right) = 0$. So $\\sin(x) = 0$ or $\\cos(x) = ${KV[key].t}$.`);
            conds=[["sin","0"],["cos",key]]; f=x=>a*Math.sin(x)+b*Math.sin(2*x);
          } else if(kind==="sin2c"){ const [a,b,key]=R.pick([[2,1,"-1"],[-2,1,"1"],[1,1,"-1/2"],[-1,1,"1/2"],[1,-1,"1/2"],[2,-1,"1"]]);
            const aT=a===1?"":a===-1?"-":String(a), bT=b===1?"+":b===-1?"-":(b<0?"-":"+")+Math.abs(b);
            eq=`${aT}\\cos(x) ${bT} \\sin(2x) = 0`;
            steps.push(`Use $\\sin(2x) = 2\\sin(x)\\cos(x)$: $\\ ${aT}\\cos(x) ${b<0?"-":"+"} ${2*Math.abs(b)}\\sin(x)\\cos(x) = 0$.`);
            steps.push(`Factor out $\\cos(x)$ (dividing by $\\cos(x)$ would lose solutions): $\\cos(x)\\left(${a} ${b<0?"-":"+"} ${2*Math.abs(b)}\\sin(x)\\right) = 0$. So $\\cos(x) = 0$ or $\\sin(x) = ${KV[key].t}$.`);
            conds=[["cos","0"],["sin",key]]; f=x=>a*Math.cos(x)+b*Math.sin(2*x);
          } else if(kind==="quad"){
            const Q=R.pick([
              ["2\\sin^2(x) + \\cos(x) = 1","$2(1-\\cos^2(x)) + \\cos(x) = 1$, so $2\\cos^2(x) - \\cos(x) - 1 = 0$.","(2\\cos(x) + 1)(\\cos(x) - 1) = 0","cos",["-1/2","1"],x=>2*Math.sin(x)**2+Math.cos(x)-1,"\\sin^2(x) = 1 - \\cos^2(x)"],
              ["2\\cos^2(x) + 3\\sin(x) = 3","$2(1-\\sin^2(x)) + 3\\sin(x) = 3$, so $2\\sin^2(x) - 3\\sin(x) + 1 = 0$.","(2\\sin(x) - 1)(\\sin(x) - 1) = 0","sin",["1/2","1"],x=>2*Math.cos(x)**2+3*Math.sin(x)-3,"\\cos^2(x) = 1 - \\sin^2(x)"],
              ["2\\sin^2(x) - \\cos(x) = 1","$2(1-\\cos^2(x)) - \\cos(x) = 1$, so $2\\cos^2(x) + \\cos(x) - 1 = 0$.","(2\\cos(x) - 1)(\\cos(x) + 1) = 0","cos",["1/2","-1"],x=>2*Math.sin(x)**2-Math.cos(x)-1,"\\sin^2(x) = 1 - \\cos^2(x)"],
              ["2\\cos^2(x) - 3\\sin(x) = 0","$2(1-\\sin^2(x)) - 3\\sin(x) = 0$, so $2\\sin^2(x) + 3\\sin(x) - 2 = 0$.","(2\\sin(x) - 1)(\\sin(x) + 2) = 0","sin",["1/2"],x=>2*Math.cos(x)**2-3*Math.sin(x),"\\cos^2(x) = 1 - \\sin^2(x)"],
              ["2\\cos^2(x) + \\sin(x) = 1","$2(1-\\sin^2(x)) + \\sin(x) = 1$, so $2\\sin^2(x) - \\sin(x) - 1 = 0$.","(2\\sin(x) + 1)(\\sin(x) - 1) = 0","sin",["-1/2","1"],x=>2*Math.cos(x)**2+Math.sin(x)-1,"\\cos^2(x) = 1 - \\sin^2(x)"],
              ["2\\sin^2(x) + 3\\cos(x) = 3","$2(1-\\cos^2(x)) + 3\\cos(x) = 3$, so $2\\cos^2(x) - 3\\cos(x) + 1 = 0$.","(2\\cos(x) - 1)(\\cos(x) - 1) = 0","cos",["1/2","1"],x=>2*Math.sin(x)**2+3*Math.cos(x)-3,"\\sin^2(x) = 1 - \\cos^2(x)"]]);
            eq=Q[0];
            steps.push(`Use $\\sin^2(x)+\\cos^2(x) = 1$ to write everything in one function: $${Q[6]}$. Then ${Q[1]}`);
            steps.push(`Factor: $${Q[2]}$. So ${Q[4].map(k=>`$\\${Q[3]}(x) = ${KV[k].t}$`).join(" or ")}${Q[4].length===1?` (the other factor gives $\\sin(x) = -2$, which is impossible because $-1 \\le \\sin(x) \\le 1$)`:""}.`);
            conds=Q[4].map(k=>[Q[3],k]); f=Q[5];
          } else {
            const [c,key]=R.pick([[2,"1"],[-2,"-1"],[4,"1/2"],[-4,"-1/2"]]);
            const cT=c===2?"2":c===-2?"-2":String(c), half=c/2;
            eq=`\\cos^2(x) = -\\sin^2(x) ${c<0?"-":"+"} ${Math.abs(c)}\\sin(x)\\cos(x)`;
            steps.push(`Move $\\sin^2(x)$ across: $\\sin^2(x) + \\cos^2(x) = ${cT}\\sin(x)\\cos(x)$, so $1 = ${cT}\\sin(x)\\cos(x) = ${half===1?"":half===-1?"-":half}\\sin(2x)$ using $\\sin(2x) = 2\\sin(x)\\cos(x)$.`);
            steps.push(`So $\\sin(2x) = ${KV[key].t}$. Let $\\theta = 2x$; since $0 \\le x \\le 2\\pi$, $0 \\le \\theta \\le 4\\pi$.`);
            steps.push(whereLine("sin",key,"\\theta","[0, 4\\pi]",thetaList("sin",2,KV[key].v).map(jT)));
            conds=[["sin",key,2]]; f=x=>Math.cos(x)**2+Math.sin(x)**2-c*Math.sin(x)*Math.cos(x);
          }
        }
        let xs=[]; if(extraZero) xs.push(0);
        conds.forEach(([fn,key,n])=>{ const kv=KV[key].v; const L=solveB(fn,n||1,kv); xs.push(...L);
          if(!n) steps.push(whereLine(fn,key,"x","[0, 2\\pi]",L.map(k24T))); });
        xs=uniq(xs);
        xs.forEach(x=>{ if(Math.abs(f(x*PI/24))>1e-9) throw new Error("solution does not check: "+eq+" at "+x); });
        const ansT=xs.map(k24T).join(",\\ ")||"\\text{no solutions}";
        steps.push(`All solutions in $[0, 2\\pi]$: $x = ${ansT}$.`);
        return {prompt:`Find all values of $x$ in $[0, 2\\pi]$ such that $${eq}$.`, answer:{type:"list",answer:xs.length?xs.map(k24A).join(", "):"none"},
          hint:d===1?"Get the trig function by itself, find the reference angle, then list every quadrant where the function has that sign.":d===2?"Use $\\sin(2x) = 2\\sin(x)\\cos(x)$ or $\\cos(2x) = \\cos^2(x)-\\sin^2(x)$, then let $\\theta = 2x$. The interval for $\\theta$ is $[0, 4\\pi]$, not $[0, 2\\pi]$.":"Rewrite with an identity, move everything to one side and factor. Never divide by $\\sin(x)$ or $\\cos(x)$: set each factor to 0 instead.",
          steps, answerTeX:`$x = ${ansT}$`};
      }},
    {id:"L12.g.error", title:"Find the first mistake", skill:"Spot the first wrong line in a trig solution", ref:"pp. 1 to 5",
      gen(R,d){
        let prob, L, bad, why, fix;
        const pick=d===1?R.pick(["val","tri"]):d===2?R.pick(["tri","dbl","val"]):R.pick(["div","proof","dbl"]);
        if(pick==="val"){
          const j=R.pick([8,10,14,15,16,20,21,22,9]); const I=jinfo(j); const fn=R.pick(["sin","cos"]); const e=exact(fn,j);
          const sides={2:["\\sqrt{3}","1","2"],3:["1","1","\\sqrt{2}"],4:["1","\\sqrt{3}","2"]}[I.ref];
          const sgn=fn==="sin"?I.ss:I.cs, leg=fn==="sin"?sides[1]:sides[0];
          const wrongRef=R.int(0,1)===1&&I.ref!==3;
          const rT=jT(I.ref), wr=jT(I.ref===2?4:2);
          const neg=sgn<0;
          if(wrongRef){
            L=[`$${jT(j)}$ is in quadrant ${QN[I.q]}.`,`It makes an angle of $${wr}$ with the $x$-axis.`,`Use the special triangle for that angle and copy it into quadrant ${QN[I.q]}.`,`$\\${fn}\\left(${jT(j)}\\right) = ${sgn<0?"-":""}${MAG[fn][I.ref===2?4:2].t}$.`];
            bad=1; why=`The angle to the $x$-axis is $${rT}$, not $${wr}$. Line (1) is right.`;
          } else {
            L=[`$${jT(j)}$ is in quadrant ${QN[I.q]}.`,`It makes an angle of $${rT}$ with the $x$-axis.`,`In quadrant ${QN[I.q]} the ${fn==="sin"?"vertical":"horizontal"} side of the special triangle is $${neg?"":"-"}${leg}$.`,`$\\${fn}\\left(${jT(j)}\\right) = ${neg?strip(e.t):"-"+e.t}$.`];
            bad=2; why=`In quadrant ${QN[I.q]}, ${fn==="sin"?"$o$":"$a$"} is ${neg?"negative":"positive"}, so the side is $${neg?"-":""}${leg}$ and the answer is $${e.t}$.`;
          }
          prob=`Find the exact value of $\\${fn}\\left(${jT(j)}\\right)$.`;
        } else if(pick==="tri"){
          const Q=R.pick([2,4]); const [h,l]=R.pick([[3,2],[3,1],[5,2],[4,1],[4,3],[5,3],[7,2],[6,1]]);
          const n=h*h-l*l;
          if(Q===4){ // cos given, find tan, o<0
            const iv=R.pick(["-\\frac{\\pi}{2} < \\theta < 0","\\frac{3\\pi}{2} < \\theta < 2\\pi"]);
            prob=`Given $\\cos(\\theta) = \\frac{${l}}{${h}}$ and $${iv}$, find $\\tan(\\theta)$.`;
            L=[`$a = ${l}$ and $h = ${h}$.`,`$${h}^2 = o^2 + ${l}^2$, so $o^2 = ${n}$.`,`$|o| = ${sqT(n)}$.`,`$o = ${sqT(n)}$.`,`$\\tan(\\theta) = \\frac{o}{a} = \\frac{${sqT(n)}}{${l}}$.`];
            bad=3; why=`$\\theta$ is in quadrant IV, where $o < 0$. Line (4) should be $o = -${sqT(n)}$, so $\\tan(\\theta) = -\\frac{${sqT(n)}}{${l}}$.`;
          } else { // sin given in QII, find sec, a<0
            prob=`Given $\\sin(\\theta) = \\frac{${l}}{${h}}$ and $\\frac{\\pi}{2} < \\theta < \\pi$, find $\\sec(\\theta)$.`;
            const flip=R.int(0,1)===1;
            if(flip){ L=[`$o = ${l}$ and $h = ${h}$.`,`$h^2 = o^2 + a^2$, so $a^2 = ${h}^2 + ${l}^2 = ${h*h+l*l}$.`,`$|a| = ${sqT(h*h+l*l)}$, so $a = -${sqT(h*h+l*l)}$ since $a<0$.`,`$\\sec(\\theta) = \\frac{h}{a} = \\frac{${h}}{-${sqT(h*h+l*l)}}$.`];
              bad=1; why=`From $h^2 = o^2 + a^2$, $a^2 = h^2 - o^2 = ${n}$, not $h^2 + o^2$.`; }
            else { L=[`$o = ${l}$ and $h = ${h}$.`,`$${h}^2 = ${l}^2 + a^2$, so $a^2 = ${n}$.`,`$\\sqrt{a^2} = ${sqT(n)}$, so $|a| = ${sqT(n)}$.`,`$a = ${sqT(n)}$ since the hypotenuse is positive.`,`$\\sec(\\theta) = \\frac{h}{a} = \\frac{${h}}{${sqT(n)}}$.`];
              bad=3; why=`The hypotenuse is positive, but $a$ is a leg. In quadrant II, $a<0$, so $a = -${sqT(n)}$ and $\\sec(\\theta) = \\frac{${h}}{-${sqT(n)}}$.`; }
          }
        } else if(pick==="dbl"){
          const key=R.pick(["1/2","r3","r2","-1/2"]); const k=KV[key];
          const th1=thetaList("sin",1,k.v).filter(j=>j<=24);
          const variant=R.int(0,1);
          prob=`Find all $x$ in $[0, 2\\pi]$ with $\\sin(2x) = ${k.t}$.`;
          if(variant===0){
            L=[`Let $\\theta = 2x$.`,`Since $0 \\le x \\le 2\\pi$, we get $0 \\le \\theta \\le 2\\pi$.`,`$\\sin(\\theta) = ${k.t}$ at $\\theta = ${th1.map(jT).join(",\\ ")}$.`,`So $x = ${th1.map(j=>piT(j,24)).join(",\\ ")}$.`];
            bad=1; why=`$0 \\le \\frac{\\theta}{2} \\le 2\\pi$ gives $0 \\le \\theta \\le 4\\pi$. The answer misses the solutions from $[2\\pi, 4\\pi]$.`;
          } else {
            const th=thetaList("sin",2,k.v);
            L=[`Let $\\theta = 2x$.`,`Since $0 \\le x \\le 2\\pi$, we get $0 \\le \\theta \\le 4\\pi$.`,`$\\sin(\\theta) = ${k.t}$ at $\\theta = ${th.map(jT).join(",\\ ")}$.`,`So $x = 2\\theta = ${th.map(j=>jT(2*j)).join(",\\ ")}$.`];
            bad=3; why=`$\\theta = 2x$ means $x = \\frac{\\theta}{2}$, not $2\\theta$.`;
          }
        } else if(pick==="div"){
          const usecos=R.int(0,1)===1;
          if(usecos){ prob=`Find all $x$ in $[0, 2\\pi]$ with $2\\cos(x) + \\sin(2x) = 0$.`;
            L=[`$2\\cos(x) + 2\\sin(x)\\cos(x) = 0$`,`Divide both sides by $2\\cos(x)$: $1 + \\sin(x) = 0$`,`$\\sin(x) = -1$`,`$x = \\frac{3\\pi}{2}$`];
            bad=1; why=`Dividing by $2\\cos(x)$ throws away the solutions of $\\cos(x) = 0$. Factor instead: $2\\cos(x)(1+\\sin(x)) = 0$ gives $x = \\frac{\\pi}{2}, \\frac{3\\pi}{2}$.`; }
          else { prob=`Find all $x$ in $[0, 2\\pi]$ with $\\sin(x) + \\sin(2x) = 0$.`;
            L=[`$\\sin(x) + 2\\sin(x)\\cos(x) = 0$`,`Divide both sides by $\\sin(x)$: $1 + 2\\cos(x) = 0$`,`$\\cos(x) = -\\frac{1}{2}$`,`$x = \\frac{2\\pi}{3}, \\frac{4\\pi}{3}$`];
            bad=1; why=`Dividing by $\\sin(x)$ loses $\\sin(x) = 0$, which gives $x = 0, \\pi, 2\\pi$. The full answer is $x = 0, \\frac{2\\pi}{3}, \\pi, \\frac{4\\pi}{3}, 2\\pi$.`; }
        } else {
          const v=R.int(0,2);
          prob=`Show that $\\sin(\\pi - x) = \\sin(x)$.`;
          if(v===0){ L=[`$\\sin(\\pi - x) = \\sin(\\pi + (-x))$`,`$= \\sin(\\pi)\\cos(-x) + \\cos(\\pi)\\sin(-x)$`,`$= 0 + (-1)\\sin(x)$`,`$= -\\sin(x)$`]; bad=2; why=`$\\sin(-x) = -\\sin(x)$, so the last term is $(-1)\\cdot(-\\sin(x)) = \\sin(x)$.`; }
          else if(v===1){ L=[`$\\sin(\\pi - x) = \\sin(\\pi + (-x))$`,`$= \\sin(\\pi)\\sin(-x) + \\cos(\\pi)\\cos(-x)$`,`$= 0 + (-1)\\cos(x)$`,`$= -\\cos(x)$`]; bad=1; why=`Sine addition is $\\sin(x+y) = \\sin(x)\\cos(y) + \\cos(x)\\sin(y)$. Line (2) mixed up the factors.`; }
          else { L=[`$\\sin(\\pi - x) = \\sin(\\pi + (-x))$`,`$= \\sin(\\pi)\\cos(-x) + \\cos(\\pi)\\sin(-x)$`,`$= 0 + (1)\\cdot(-\\sin(x))$`,`$= -\\sin(x)$`]; bad=2; why=`$\\cos(\\pi) = -1$, not $1$.`; }
        }
        const opts=lineOpts(L.length);
        return {prompt:`A problem and an answer are below. The answer would not get full marks. Select the first line with a mistake.<p>Problem: ${prob}</p>${linesHTML(L)}`,
          parts:[{answer:{type:"mc",options:opts,correct:bad,keep:true}}],
          hint:"Check each line on its own: the identity used, the interval, the quadrant sign, and that nothing was divided away.",
          steps:[`Line (${bad+1}) is the first mistake.`,why], answerTeX:`Line (${bad+1})`};
      }}
  ],
  exam:[
    {id:"L12.q1", ref:"p. 1", q:"$\\sin\\left(\\frac{4\\pi}{3}\\right) =$", opts:[["$-\\frac{\\sqrt{3}}{2}$",1,"Quadrant III, reference angle $\\frac{\\pi}{3}$, and sine is negative there."],["$\\frac{\\sqrt{3}}{2}$",0,"Right size, wrong sign: in quadrant III the opposite side is negative."],["$-\\frac{1}{2}$",0,"That is $\\cos\\left(\\frac{4\\pi}{3}\\right)$."],["$-\\sqrt{3}$",0,"That is not a possible sine value; sine stays between $-1$ and $1$."]]},
    {id:"L12.q2", ref:"p. 1", multi:true, q:"Select all that equal $-\\frac{1}{2}$.", opts:[["$\\sin\\left(\\frac{7\\pi}{6}\\right)$",1,"Worked on p. 1: $\\frac{-1}{2}$."],["$\\cos\\left(\\frac{2\\pi}{3}\\right)$",1,"Quadrant II, reference angle $\\frac{\\pi}{3}$, cosine negative: $-\\frac{1}{2}$."],["$\\sin\\left(\\frac{11\\pi}{6}\\right)$",1,"Quadrant IV, reference angle $\\frac{\\pi}{6}$, sine negative."],["$\\sin\\left(\\frac{5\\pi}{6}\\right)$",0,"Quadrant II, where sine is positive: $\\frac{1}{2}$."],["$\\cos\\left(\\frac{5\\pi}{3}\\right)$",0,"Quadrant IV, where cosine is positive: $\\frac{1}{2}$."]]},
    {id:"L12.q3", ref:"p. 2", q:"True or false: $\\sqrt{a^2} = a$ for every real number $a$.", opts:[["False",1,"$\\sqrt{a^2} = |a|$. If $a = -3$, $\\sqrt{9} = 3 \\ne -3$. This is why the notes write $|a| = \\sqrt{8}$ and then pick the sign."],["True",0,"Try $a = -3$: $\\sqrt{(-3)^2} = 3$."]]},
    {id:"L12.q4", ref:"p. 2", q:"Given $\\sec(\\theta) = 4$ and $\\frac{3\\pi}{2} < \\theta < 2\\pi$, $\\sin(\\theta) =$", opts:[["$-\\frac{\\sqrt{15}}{4}$",1,"$h = 4$, $a = 1$, $o^2 = 15$, and $o < 0$ in quadrant IV."],["$\\frac{\\sqrt{15}}{4}$",0,"In quadrant IV the opposite side is negative."],["$-\\frac{1}{4}$",0,"That is not $\\sin$; $\\cos(\\theta) = \\frac{1}{4}$."],["$-\\sqrt{15}$",0,"That is $\\tan(\\theta) = \\frac{o}{a}$."]]},
    {id:"L12.q5", ref:"p. 3", multi:true, q:"Select all statements that are true for every $x$ (and $y$).", opts:[["$\\sin(-x) = -\\sin(x)$",1,"Sine is odd (p. 3)."],["$\\cos(2x) = \\cos^2(x) - \\sin^2(x)$",1,"Cosine addition with $y = x$ (p. 4)."],["$\\cos(-x) = -\\cos(x)$",0,"Cosine is even: $\\cos(-x) = \\cos(x)$."],["$\\sin(2x) = 2\\sin(x)$",0,"$\\sin(2x) = 2\\sin(x)\\cos(x)$. Try $x = \\frac{\\pi}{2}$: $\\sin(\\pi) = 0$ but $2\\sin\\left(\\frac{\\pi}{2}\\right) = 2$."],["$\\cos(x+y) = \\cos(x)\\cos(y) + \\sin(x)\\sin(y)$",0,"The cosine addition identity has a minus sign."]]},
    {id:"L12.q6", ref:"pp. 4 to 5", q:"How many solutions does $\\sin(2x) = \\frac{\\sqrt{3}}{2}$ have in $[0, 2\\pi]$?", opts:[["4",1,"$\\theta = 2x$ runs over $[0, 4\\pi]$: $\\theta = \\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{7\\pi}{3}, \\frac{8\\pi}{3}$, so $x = \\frac{\\pi}{6}, \\frac{\\pi}{3}, \\frac{7\\pi}{6}, \\frac{4\\pi}{3}$."],["2",0,"That is the count on $[0, 2\\pi]$ for $\\theta$. You need $[0, 4\\pi]$."],["1",0,"Sine reaches each value between $-1$ and $1$ more than once per period."],["8",0,"Doubling the interval doubles the count once, not twice."]]},
    {id:"L12.q7", ref:"p. 4", q:"Is the provided answer correct? Problem: find all $x$ in $[0,2\\pi]$ with $2\\sin(x) + \\sin(2x) = 0$. Answer: $2\\sin(x) + 2\\sin(x)\\cos(x) = 0$. Divide by $2\\sin(x)$: $1 + \\cos(x) = 0$, so $\\cos(x) = -1$ and $x = \\pi$.", opts:[["No, the solution is not correct",1,"Dividing by $2\\sin(x)$ loses $\\sin(x) = 0$. The full answer (p. 4) is $x = 0, \\pi, 2\\pi$."],["Yes, the solution is correct",0,"Check $x = 0$: $2\\sin(0)+\\sin(0) = 0$. It is a solution the answer missed."]]},
    {id:"L12.q8", ref:"p. 3", q:"Given $\\tan(\\theta) = 3x$ and $\\pi < \\theta < \\frac{3\\pi}{2}$ (so $x > 0$), $\\sec(\\theta) =$", opts:[["$-\\sqrt{9x^2+1}$",1,"Quadrant III: $o = -3x$, $a = -1$, $h = \\sqrt{9x^2+1}$, so $\\frac{h}{a} = -\\sqrt{9x^2+1}$."],["$\\sqrt{9x^2+1}$",0,"That is the first-quadrant answer. In quadrant III, $a < 0$."],["$\\frac{1}{\\sqrt{9x^2+1}}$",0,"That is $\\frac{a}{h}$ with the wrong sign, and it is cosine, not secant."],["$-\\sqrt{9x^2-1}$",0,"$h^2 = (3x)^2 + 1^2$, a sum."]]},
    {id:"L12.q9", ref:"p. 1", q:"Which angle is in quadrant IV with reference angle $\\frac{\\pi}{3}$?", opts:[["$\\frac{5\\pi}{3}$",1,"$2\\pi - \\frac{\\pi}{3} = \\frac{5\\pi}{3}$."],["$\\frac{4\\pi}{3}$",0,"That is $\\pi + \\frac{\\pi}{3}$, in quadrant III."],["$\\frac{2\\pi}{3}$",0,"That is $\\pi - \\frac{\\pi}{3}$, in quadrant II."],["$\\frac{11\\pi}{6}$",0,"Quadrant IV, but the reference angle is $\\frac{\\pi}{6}$."]]},
    {id:"L12.q10", ref:"p. 3", q:"True or false: if $\\sin(\\theta) = \\frac{2}{\\sqrt{7}}$ and $\\frac{\\pi}{2} < \\theta < \\pi$, then $\\csc(\\theta) = \\frac{\\sqrt{7}}{2}$.", opts:[["True",1,"$\\csc(\\theta) = \\frac{1}{\\sin(\\theta)}$. The quadrant does not change it, because the sign is already in $\\sin(\\theta)$."],["False",0,"No triangle is needed: $\\csc$ is the reciprocal of $\\sin$."]]},
    {id:"L12.q11", ref:"pp. 4 to 5", q:"A student solves $\\sin(x)\\cos(x) = \\frac{1}{4}$ on $[0, 2\\pi]$. Which is the first correct step?", opts:[["Multiply by 2: $\\sin(2x) = \\frac{1}{2}$",1,"$2\\sin(x)\\cos(x) = \\sin(2x)$ (p. 4)."],["$\\sin(x) = \\frac{1}{4}$ or $\\cos(x) = \\frac{1}{4}$",0,"That rule only works when the product equals 0."],["$\\sin(2x) = \\frac{1}{4}$",0,"$\\sin(x)\\cos(x)$ is half of $\\sin(2x)$, so you must multiply both sides by 2."],["$\\sin^2(x) = \\frac{1}{4}$",0,"$\\cos(x)$ is not $\\sin(x)$."]]}
  ],
  steps:[
    {type:"read", title:"What you should know", body:`<p>Section 2.5.1 is mostly review, but the quiz tests it hard (p. 1):</p><ol><li>Radians. Calculus is done entirely in radians. A full turn is $2\\pi$.</li><li>All six trig functions: sin, cos, tan, csc, sec, cot.</li><li>The graphs of sin, cos and tan.</li><li>The values of all six at the basic angles in any quadrant.</li></ol><p>If you know the values at $0, \\frac{\\pi}{6}, \\frac{\\pi}{4}, \\frac{\\pi}{3}, \\frac{\\pi}{2}$, you can get every other quadrant by copying the special triangles, or by reading the graphs.</p><div class="box def"><b class="t">Special triangles</b>For $\\frac{\\pi}{6}$ and $\\frac{\\pi}{3}$: legs $1$ and $\\sqrt{3}$, hypotenuse $2$. For $\\frac{\\pi}{4}$: legs $1$ and $1$, hypotenuse $\\sqrt{2}$. The side across from $\\frac{\\pi}{6}$ is the short one, $1$.</div>`, ref:"p. 1"},
    {type:"explore", title:"The unit circle", fig:"circle", body:`<p>On a circle of radius 1, the point at angle $\\theta$ is $(\\cos\\theta, \\sin\\theta)$. That is the special triangle with hypotenuse 1: the horizontal leg is cosine and the vertical leg is sine. The signs of the coordinates are the signs of cos and sin in that quadrant.</p><p><b>Try it.</b> Drag the point to $\\frac{7\\pi}{6}$ (just past the negative $x$-axis). Check that $\\sin\\theta = -\\frac{1}{2}$. Then go to $\\frac{5\\pi}{6}$ and $\\frac{11\\pi}{6}$: same reference angle, different signs.</p>`},
    {type:"example", title:"An angle in the third quadrant", ex:{q:"Determine $\\sin\\left(\\frac{7\\pi}{6}\\right)$.", ref:"p. 1",
      steps:[{t:"Draw $\\frac{7\\pi}{6}$ in the $xy$-plane. It sweeps past the negative $x$-axis by $\\frac{\\pi}{6}$, so it ends in the third quadrant.",why:"$\\frac{7\\pi}{6} = \\pi + \\frac{\\pi}{6}$."},{t:"Relate it to $\\frac{\\pi}{6}$ in the first quadrant: special triangle with horizontal leg $\\sqrt{3}$, vertical leg $1$, hypotenuse $2$.",why:"The triangle for the reference angle has the right side lengths."},{t:"Copy it into the third quadrant: horizontal leg $-\\sqrt{3}$, vertical leg $-1$, hypotenuse $2$.",why:"In quadrant III both $x$ and $y$ are negative. The hypotenuse stays positive."},{t:"$\\sin\\left(\\frac{7\\pi}{6}\\right) = \\frac{o}{h} = \\frac{-1}{2}$.",why:"Sine is opposite over hypotenuse."}], ans:"$\\sin\\left(\\frac{7\\pi}{6}\\right) = -\\frac{1}{2}$"}},
    {type:"try", title:"Your turn: special values", gen:"L12.g.special"},
    {type:"read", title:"One ratio from another", body:`<p>When the angle is not special, you are given one ratio and an interval, and asked for another ratio (p. 2). The method:</p><ol><li>Write the given value as a fraction of two sides: $\\sin\\theta = \\frac{o}{h}$, $\\cos\\theta = \\frac{a}{h}$, $\\tan\\theta = \\frac{o}{a}$, $\\sec\\theta = \\frac{h}{a}$, and so on.</li><li>The interval tells you the quadrant. Draw the right triangle there.</li><li>Find the missing side with $h^2 = o^2 + a^2$.</li><li>Take the square root carefully: $\\sqrt{a^2} = |a|$. Then pick the sign. The hypotenuse is always positive. A leg is negative if it points left ($a$) or down ($o$).</li><li>Take the ratio you were asked for.</li></ol><p>The same method works when the sides contain $x$. On p. 3, $\\tan(\\theta) = 2x = \\frac{2x}{1}$ with $0<\\theta<\\frac{\\pi}{2}$ gives $h = \\sqrt{4x^2+1}$, so $\\sec(\\theta) = \\frac{h}{a} = \\sqrt{4x^2+1}$.</p><div class="box warn"><b class="t">Watch for this</b>The quizzes give marks for the line $|a| = \\sqrt{8}$ and for the sentence that picks the sign, like "since $a<0$". Write both.</div>`, ref:"pp. 2 to 3"},
    {type:"example", title:"A triangle in the second quadrant", ex:{q:"Given that $\\sin(\\theta) = \\frac{1}{3}$ and $\\frac{\\pi}{2} < \\theta < \\pi$, find $\\sec(\\theta)$.", ref:"p. 2",
      steps:[{t:"Draw the right triangle in the second quadrant with $\\sin(\\theta) = \\frac{1}{3} = \\frac{o}{h}$: $o = 1$, $h = 3$.",why:"$\\frac{\\pi}{2} < \\theta < \\pi$ is quadrant II."},{t:"$3^2 = 1^2 + a^2$, so $8 = a^2$.",why:"Pythagorean Theorem, $h^2 = o^2 + a^2$."},{t:"$\\sqrt{8} = \\sqrt{a^2} = |a|$.",why:"The square root of a square is the absolute value."},{t:"$\\sqrt{8} = -a$ since $a < 0$, so $a = -\\sqrt{8}$.",why:"In quadrant II the adjacent side points left."},{t:"$\\sec(\\theta) = \\frac{h}{a} = \\frac{3}{-\\sqrt{8}}$.",why:"Secant is hypotenuse over adjacent."}], ans:"$\\sec(\\theta) = \\frac{3}{-\\sqrt{8}} = -\\frac{3\\sqrt{2}}{4}$"}},
    {type:"explore", title:"Signs come from the quadrant", fig:"triangle", body:`<p>Every triangle here has its corner at a point $(a, o)$. The legs are the coordinates, so they carry the signs. The hypotenuse is a distance, so it is positive.</p><p><b>Try it.</b> Put the corner at $(-3, 1)$, then $(-3, -1)$, then $(3, -1)$. Watch which of the six ratios change sign. Then find a corner where $\\tan\\theta = 2$ but $\\theta$ is in quadrant III.</p>`},
    {type:"try", title:"Your turn: one ratio from another", gen:"L12.g.triangle", diff:2},
    {type:"try", title:"Your turn: sides with $x$ in them", gen:"L12.g.trigvar"},
    {type:"read", title:"The six identities", body:`<p>These are all the identities you need to memorize for this course (p. 3):</p>$$\\begin{aligned}\\sin^2(x) + \\cos^2(x) &= 1\\\\ \\sin(-x) &= -\\sin(x)\\\\ \\cos(-x) &= \\cos(x)\\\\ \\sin(2x) &= 2\\sin(x)\\cos(x)\\\\ \\sin(x+y) &= \\sin(x)\\cos(y) + \\cos(x)\\sin(y)\\\\ \\cos(x+y) &= \\cos(x)\\cos(y) - \\sin(x)\\sin(y)\\end{aligned}$$<p>Others come from these. On p. 4, $\\sin(\\pi - x) = \\sin(\\pi + (-x)) = \\sin(\\pi)\\cos(-x) + \\cos(\\pi)\\sin(-x) = 0 + (-1)(-\\sin(x)) = \\sin(x)$. And cosine addition with $y = x$ gives $\\cos(2x) = \\cos^2(x) - \\sin^2(x)$.</p>`, ref:"pp. 3 to 4"},
    {type:"mcq", title:"Check the identities", q:"Which of these follow from the six identities on p. 3? Select all.", multi:true,
      opts:[["$\\cos(2x) = \\cos^2(x) - \\sin^2(x)$",true,"Cosine addition with $y = x$."],["$\\sin(\\pi - x) = \\sin(x)$",true,"Shown on p. 4 with sine addition."],["$\\sin(x + y) = \\sin(x) + \\sin(y)$",false,"Sine does not split over a sum. Try $x = y = \\frac{\\pi}{2}$: $\\sin(\\pi) = 0$ but $1 + 1 = 2$."],["$\\cos(-x) = -\\cos(x)$",false,"Cosine is even: $\\cos(-x) = \\cos(x)$."]]},
    {type:"example", title:"Solving with the double angle", ex:{q:"Find all values of $x$ in $[0, 2\\pi]$ such that $\\sin(x)\\cos(x) = \\frac{1}{4}$.", ref:"pp. 4 to 5",
      steps:[{t:"Multiply both sides by 2: $2\\sin(x)\\cos(x) = \\frac{1}{2}$, so $\\sin(2x) = \\frac{1}{2}$.",why:"The left side reminds us of $2\\sin(x)\\cos(x) = \\sin(2x)$."},{t:"Let $\\theta = 2x$. Since $0 \\le x \\le 2\\pi$, we get $0 \\le \\frac{\\theta}{2} \\le 2\\pi$, so $0 \\le \\theta \\le 4\\pi$.",why:"The interval doubles along with the angle."},{t:"$\\sin(\\theta) = \\frac{1}{2}$ with $0 \\le \\theta \\le 4\\pi$: $\\theta = \\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{13\\pi}{6}, \\frac{17\\pi}{6}$.",why:"Reference angle $\\frac{\\pi}{6}$, sine positive in quadrants I and II, then add $2\\pi$ for the second turn."},{t:"$2x = \\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{13\\pi}{6}, \\frac{17\\pi}{6}$, so $x = \\frac{\\pi}{12}, \\frac{5\\pi}{12}, \\frac{13\\pi}{12}, \\frac{17\\pi}{12}$.",why:"Substitute $2x$ back for $\\theta$ and divide by 2."}], ans:"$x = \\frac{\\pi}{12}, \\frac{5\\pi}{12}, \\frac{13\\pi}{12}, \\frac{17\\pi}{12}$"}},
    {type:"explore", title:"Why the interval doubles", fig:"solve", body:`<p>On p. 4, $2\\sin(x) + \\sin(2x) = 0$ becomes $2\\sin(x)(1 + \\cos(x)) = 0$, so $\\sin(x) = 0$ or $\\cos(x) = -1$: $x = 0, \\pi, 2\\pi$. Factor; never divide by $\\sin(x)$.</p><p><b>Try it.</b> Set the function to sin(x) and $k = \\frac{1}{2}$: two solutions. Switch to sin(2x): four. Then try cos(2x) with $k = -1$ and read off $x = \\frac{\\pi}{2}, \\frac{3\\pi}{2}$.</p>`},
    {type:"try", title:"Your turn: solve on an interval", gen:"L12.g.solve", diff:2},
    {type:"mcq", title:"Is the answer correct?", q:"Problem: find all $x$ in $[0,2\\pi]$ with $2\\sin(x) - \\sin(2x) = 0$. Answer: $2\\sin(x) - 2\\sin(x)\\cos(x) = 0$, so $2\\sin(x)(1 - \\cos(x)) = 0$. So $\\sin(x) = 0$ or $\\cos(x) = 1$, giving $x = 0, \\pi, 2\\pi$. Is this correct?",
      opts:[["Yes",true,"Identity, factor, set each factor to 0. $\\cos(x) = 1$ gives $0$ and $2\\pi$ again, so each value is listed once."],["No, it misses $x = \\frac{\\pi}{2}$",false,"$2\\sin\\left(\\frac{\\pi}{2}\\right) - \\sin(\\pi) = 2 \\ne 0$."],["No, you cannot factor out $2\\sin(x)$",false,"Factoring is fine. Dividing by $\\sin(x)$ is what loses solutions."]]},
    {type:"formulas", title:"Lecture 12 formulas"}
  ]
});
})();
