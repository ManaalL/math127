/* Lecture 13 (Wed Oct 7): Graphs of trig functions, wave functions, modelling with trigonometry. Sections 2.5.1 (graphs, waves) and 2.5.2. Notes: 6 pages. */
(function(){
const M=M127;
const PI=Math.PI;
function piT(n,d){ if(n===0) return "0"; if(d<0){n=-n;d=-d;} const g=M.gcd(n,d); n/=g; d/=g; const s=n<0?"-":""; const an=Math.abs(n); const top=(an===1?"":an)+"\\pi"; return d===1?s+top:s+"\\frac{"+top+"}{"+d+"}"; }
function piA(n,d){ if(n===0) return "0"; if(d<0){n=-n;d=-d;} const g=M.gcd(n,d); n/=g; d/=g; const an=Math.abs(n); return (n<0?"-":"")+(an===1?"":an)+"pi"+(d===1?"":"/"+d); }
/* rationals as [n, d] */
const rq=(n,d=1)=>{ if(d<0){n=-n;d=-d;} const g=M.gcd(n,d); return [n/g,d/g]; };
const radd=(p,q)=>rq(p[0]*q[1]+q[0]*p[1],p[1]*q[1]), rsub=(p,q)=>radd(p,[-q[0],q[1]]);
const rT=p=>M.frac(p[0],p[1]), rA=p=>M.fracA(p[0],p[1]), rV=p=>p[0]/p[1];
const fmt=v=>{ const r=Math.round(v*100)/100; return String(r).replace("-","−"); };
const dec=v=>String(Math.round(v*1000)/1000);
/* exact cos/sin at multiples of pi/12 (only the special ones are used) */
const MAGS={0:["0","0"],2:["\\frac{1}{2}","1/2"],3:["\\frac{1}{\\sqrt{2}}","1/sqrt(2)"],4:["\\frac{\\sqrt{3}}{2}","sqrt(3)/2"],6:["1","1"]};
function exact(fn,j){ const m=((j%24)+24)%24; const cj=fn==="cos"?m:((m-6)%24+24)%24; // sin(x)=cos(x-pi/2)
  const ref=cj<=6?cj:cj<=12?12-cj:cj<=18?cj-12:24-cj; const sg=(cj<6||cj>18)?1:(cj>6&&cj<18)?-1:0; const g=MAGS[6-ref]; if(!g) return null; // MAGS holds |sin|, and |cos| at ref r is |sin| at 6-r
  if(g[1]==="0"||sg>0) return {t:g[0],a:g[1]}; return {t:"-"+g[0],a:"-("+g[1]+")"}; }

function dragPt(G,o){
  const NS="http://www.w3.org/2000/svg";
  const g=document.createElementNS(NS,"g"); g.setAttribute("class","drag"); g.setAttribute("tabindex","0"); g.setAttribute("role","slider"); g.setAttribute("aria-label",o.label||"Drag point");
  const h=document.createElementNS(NS,"circle"); h.setAttribute("r",14); h.setAttribute("style","fill:var(--c,var(--accent));fill-opacity:.14"); g.append(h);
  const c=document.createElementNS(NS,"circle"); c.setAttribute("r",6.5); c.setAttribute("class",o.filled?"dotf":"dot"); c.setAttribute("style","stroke-width:2.4"); g.append(c);
  G.layer.top.append(g);
  const toXY=e=>{ const pt=G.svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const m=G.svg.getScreenCTM(); const p=m?pt.matrixTransform(m.inverse()):{x:0,y:0}; return [G.iX(p.x),G.iY(p.y)]; };
  let on=false;
  g.addEventListener("pointerdown",e=>{ on=true; g.setPointerCapture(e.pointerId); e.preventDefault(); });
  g.addEventListener("pointermove",e=>{ if(on) o.onMove(...toXY(e)); });
  g.addEventListener("pointerup",()=>{ on=false; });
  g.addEventListener("keydown",e=>{ const k={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key]; if(k&&o.onKey){ e.preventDefault(); o.onKey(k[0],k[1]); } });
  return {set:(x,y)=>g.setAttribute("transform",`translate(${G.X(x)},${G.Y(y)})`)};
}
const linesHTML=L=>L.map((l,i)=>`<div style="margin:2px 0">${l} &nbsp;<span class="muted">(${i+1})</span></div>`).join("");
const lineOpts=n=>Array.from({length:n},(_,i)=>`Line (${i+1})`);
const coefT=(v,s)=>v===1?s:v===-1?"-"+s:`${v}${s}`;

M.lecture({
  id:"L13", n:13, date:"2026-10-07", added:"2026-10-21", unit:"u5", quiz:"Q5",
  title:"Wave Functions and Trig Models", sections:["2.5.1","2.5.2"], pages:6,
  summary:"The graphs of sin, cos and tan, what a, b, c and d do in y = a sin(b(x − c)) + d, how to read off the max, min, average, amplitude and period, and how to build a sine model from data like daily body temperature.",
  flags:[
    {ref:"p. 5", text:"The section heading on p. 5 reads \"2.5.1 Modelling with Trigonometry\". It should be 2.5.2. The content list on p. 1 and the Quiz 5 announcement (\"covers up to end of section 2.5.2\") both use 2.5.2."},
    {ref:"p. 6", text:"The sine graph used to find $c$ for the body temperature model is drawn against an axis labelled $x$. The model's variable is $t$ (hours). Read the axis as $t$."},
    {ref:"p. 2", text:"The sketch of $\\tan(x)$ passes a little below the point $\\left(\\frac{\\pi}{4}, 1\\right)$. The exact value is $\\tan\\left(\\frac{\\pi}{4}\\right) = 1$, so do not read values off that sketch."},
    {ref:"p. 2", text:"The course notes (Example 2.5.9, book p. 95) write $U(t) = a\\cos(bt) + c$, where $c$ is the average. In the lecture notes $c$ is the horizontal shift and $d$ is the average. Use the lecture letters: $y = a\\cos(b(x-c)) + d$."}
  ],
  formulas:[
    {id:"L13.f.sin", name:"Key features of $y = \\sin(x)$", tex:"\\text{period } 2\\pi,\\quad \\text{range } [-1, 1],\\quad \\text{invertible on } \\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]", ref:"p. 1",
      blank:{tex:"\\sin(x) \\text{ is invertible on } \\boxed{\\,?\\,}", answer:"[-pi/2, pi/2]", type:"interval"}},
    {id:"L13.f.cos", name:"Key features of $y = \\cos(x)$", tex:"\\text{period } 2\\pi,\\quad \\text{range } [-1, 1],\\quad \\text{invertible on } [0, \\pi]", ref:"p. 2",
      blank:{tex:"\\cos(x) \\text{ is invertible on } \\boxed{\\,?\\,}", answer:"[0, pi]", type:"interval"}},
    {id:"L13.f.tan", name:"Key features of $y = \\tan(x)$", tex:"\\text{period } \\pi,\\quad \\text{range } (-\\infty, \\infty),\\quad \\text{asymptotes } x = -\\frac{\\pi}{2} + k\\pi,\\quad \\text{invertible on } \\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)", note:"Open interval: $\\tan$ is not defined at $\\pm\\frac{\\pi}{2}$.", ref:"p. 2",
      blank:{tex:"\\text{The period of } \\tan(x) \\text{ is } \\boxed{\\,?\\,}", answer:"pi", type:"num"}},
    {id:"L13.f.forms", name:"Transformed trig functions", tex:"\\begin{aligned}y &= a\\sin(b(x-c)) + d\\\\ y &= a\\cos(b(x-c)) + d\\\\ y &= a\\tan(b(x-c)) + d\\end{aligned}", ref:"p. 2"},
    {id:"L13.f.roles", name:"What $a$, $b$, $c$, $d$ do", tex:"\\begin{aligned}a &: \\text{scaling in } y\\text{; reflection over the } x\\text{-axis if } a<0\\\\ b &: \\text{scaling in } x\\text{; reflection over the } y\\text{-axis if } b<0\\\\ c &: \\text{horizontal translation}\\\\ d &: \\text{vertical translation}\\end{aligned}", note:"$x - c$ with $c > 0$ moves the graph right by $c$.", ref:"p. 2"},
    {id:"L13.f.defs", name:"Wave vocabulary", tex:"\\begin{aligned}\\text{Period} &: \\text{the distance between successive peaks}\\\\ \\text{Maximum} &: \\text{the highest } y\\text{-value}\\\\ \\text{Minimum} &: \\text{the lowest } y\\text{-value}\\\\ \\text{Average} &: \\text{half-way between the maximum and minimum}\\\\ \\text{Amplitude} &: \\text{the difference between the maximum and the average}\\end{aligned}", ref:"p. 4"},
    {id:"L13.f.maxmin", name:"Max and min from average and amplitude", tex:"\\text{max} = \\text{average} + \\text{amplitude},\\qquad \\text{min} = \\text{average} - \\text{amplitude}", ref:"p. 4",
      blank:{tex:"\\text{min} = \\boxed{\\,?\\,}", text:true, accept:["average - amplitude","average-amplitude","avg - amplitude","average − amplitude"]}},
    {id:"L13.f.period", name:"Period of a sine or cosine wave", tex:"\\text{period} = \\left|\\frac{2\\pi}{b}\\right|", note:"For $y = a\\cos(bx)+d$ or $y = a\\sin(bx)+d$. Shifting by $c$ does not change it.", ref:"p. 5",
      blank:{tex:"\\text{period} = \\boxed{\\,?\\,}", answer:"abs(2pi/b)", vars:["b"], domain:[-3,-0.4]}},
    {id:"L13.f.amp", name:"Amplitude", tex:"\\text{amplitude} = |a|", note:"Always positive, even when $a<0$.", ref:"p. 5", blank:{tex:"\\text{amplitude} = \\boxed{\\,?\\,}", answer:"abs(a)", vars:["a"], domain:[-3,-0.4]}},
    {id:"L13.f.avg", name:"Average", tex:"\\text{average} = d", ref:"p. 5", blank:{tex:"\\text{average} = \\boxed{\\,?\\,}", text:true, accept:["d"]}},
    {id:"L13.f.max", name:"Maximum", tex:"\\text{max} = d + |a|", ref:"p. 5", blank:{tex:"\\text{max} = \\boxed{\\,?\\,}", answer:"d+abs(a)", vars:["a","d"], domain:[-3,-0.4]}},
    {id:"L13.f.min", name:"Minimum", tex:"\\text{min} = d - |a|", ref:"p. 5", blank:{tex:"\\text{min} = \\boxed{\\,?\\,}", answer:"d-abs(a)", vars:["a","d"], domain:[-3,-0.4]}},
    {id:"L13.f.fromdata", name:"Average and amplitude from the max and min", tex:"d = \\frac{\\text{max} + \\text{min}}{2},\\qquad |a| = \\frac{\\text{max} - \\text{min}}{2}", note:"The first is the definition of average (p. 4). The second is how the body temperature example gets $a = \\frac{1}{2}$ from a 1.0°C swing (p. 5).", ref:"pp. 4 to 5",
      blank:{tex:"d = \\boxed{\\,?\\,}", text:true, accept:["(max+min)/2","(max + min)/2","(min+max)/2","(min + max)/2"]}},
    {id:"L13.f.b", name:"$b$ from the period", tex:"\\text{period} = \\left|\\frac{2\\pi}{b}\\right| \\;\\Rightarrow\\; b = \\frac{2\\pi}{\\text{period}} \\quad (b>0)", note:"Body temperature: $24 = \\frac{2\\pi}{b}$, so $b = \\frac{\\pi}{12}$.", ref:"p. 5"},
    {id:"L13.f.body", name:"Body temperature model", tex:"T(t) = \\frac{1}{2}\\sin\\left(\\frac{\\pi}{12}(t-10)\\right) + 37", note:"$t$ in hours, $T$ in °C. Check: $T(16) = 37.5$, the maximum at 4 pm.", ref:"p. 6"}
  ],
  glossary:[
    {id:"L13.t.wave", term:"Wave function", def:"A function whose graph looks like a wave. Sine and cosine are used in science to model waves: water, sound, daily rhythms.", ref:"p. 4"},
    {id:"L13.t.period", term:"Period", def:"The distance between successive peaks. For $a\\sin(bx)+d$ or $a\\cos(bx)+d$ it is $\\left|\\frac{2\\pi}{b}\\right|$.", ref:"pp. 4 to 5"},
    {id:"L13.t.average", term:"Average", def:"The middle value of the wave, half-way between the maximum and the minimum. It equals the vertical shift $d$.", ref:"pp. 4 to 5"},
    {id:"L13.t.amplitude", term:"Amplitude", def:"The difference between the maximum and the average. It equals $|a|$, so it is never negative.", ref:"pp. 4 to 5"},
    {id:"L13.t.maxmin", term:"Maximum and minimum", def:"The highest and lowest $y$-values of the wave: $d + |a|$ and $d - |a|$.", ref:"pp. 4 to 5"},
    {id:"L13.t.hshift", term:"Horizontal translation", def:"The shift $c$ in $y = a\\sin(b(x - c)) + d$. With $c > 0$ the graph moves right by $c$. Factor $b$ out first: $\\sin(2x - \\pi) = \\sin(2(x - \\frac{\\pi}{2}))$ is a shift of $\\frac{\\pi}{2}$, not $\\pi$.", ref:"p. 2"},
    {id:"L13.t.vshift", term:"Vertical translation", def:"The shift $d$. It moves the whole wave up or down and becomes the average.", ref:"p. 2"},
    {id:"L13.t.invertible", term:"Interval of invertibility", def:"An interval where the function is one-to-one, so it has an inverse there. The notes use $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ for sin, $[0, \\pi]$ for cos and $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ for tan.", ref:"pp. 1 to 2"}
  ],
  figures:{
    graphs:{title:"Graphs of sin, cos and tan", cap:"<b>Fig. 13.1</b> The three basic graphs. The thick piece is the interval the notes use for an inverse. The hollow dot sits one period from the point you drag and has the same height. (Lecture 13, pp. 1 to 2)",
      build(host,{PLOT,M}){
        const G=PLOT.graph(host,{x:[-PI-0.2,3*PI+0.2],y:[-3,3],piX:true,ystep:1,c:"var(--u5)",xlabel:"x",ylabel:"y"});
        const F={sin:Math.sin,cos:Math.cos,tan:Math.tan};
        const INFO={sin:{P:2*PI,iv:[-PI/2,PI/2],txt:"period $2\\pi$, range $[-1,1]$, invertible on $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$"},cos:{P:2*PI,iv:[0,PI],txt:"period $2\\pi$, range $[-1,1]$, invertible on $[0, \\pi]$"},tan:{P:PI,iv:[-PI/2+0.02,PI/2-0.02],txt:"period $\\pi$, range $(-\\infty, \\infty)$, asymptotes $x = -\\frac{\\pi}{2} + k\\pi$, invertible on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$"}};
        let key="sin", hx=PI/4;
        const cur=x=>F[key](x);
        const asy=[-PI/2,PI/2,3*PI/2,5*PI/2].map(x=>G.vline(x,{cls:"lt dash"}));
        const curve=G.fn(cur);
        const piece=G.fn(cur,{cls:"cv c",from:INFO.sin.iv[0],to:INFO.sin.iv[1]}); piece.style.strokeWidth=4;
        const twin=G.open(0,0);
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        const clamp=y=>Math.max(-3.3,Math.min(3.3,y));
        const H=G.handle(hx,cur(hx),{f:x=>clamp(cur(x)),bounds:[-PI,3*PI],label:"Point on the graph",onMove:x=>{ hx=x; info(); }});
        PLOT.seg(ctl,{label:"Function",items:[["sin","sin(x)"],["cos","cos(x)"],["tan","tan(x)"]],value:key,onchange:v=>{ key=v; draw(); }});
        function info(){
          const I=INFO[key]; let x2=hx+I.P; if(x2>3*PI) x2=hx-I.P;
          const y=cur(hx), y2=cur(x2); twin.set(x2,clamp(y2)); twin.style.display=Math.abs(y)>3.2?"none":"";
          ro.innerHTML=M.rich(`$y = \\${key}(x)$: ${I.txt}`)+`<br>x = <b>${fmt(hx)}</b>, ${key}(x) = <b>${Math.abs(y)>1e6?"not defined":fmt(y)}</b> &nbsp; x ${x2>hx?"+":"−"} period = <b>${fmt(x2)}</b>, ${key} = <b>${Math.abs(y2)>1e6?"not defined":fmt(y2)}</b>`;
        }
        function draw(){ const I=INFO[key]; curve.update(cur); piece.update(cur,I.iv[0],I.iv[1]); asy.forEach(l=>l.style.display=key==="tan"?"":"none"); H.move(hx); info(); }
        draw();
      }},
    wave:{title:"a, b, c and d", cap:"<b>Fig. 13.2</b> $y = a\\sin(b(x-c)) + d$ or $y = a\\cos(b(x-c)) + d$. The dashed line is the average $d$, the vertical bar is the amplitude $|a|$, and the bracket is one period, $2\\pi/|b|$. The faint curve is the plain graph. (Lecture 13, pp. 2 to 5)",
      build(host,{PLOT,M}){
        const G=PLOT.graph(host,{x:[-PI,4*PI],y:[-7.5,7.5],piX:true,ystep:2,c:"var(--u5)",xlabel:"x",ylabel:"y"});
        const BL=[-3,-2,-1,-0.5,0.5,1,1.5,2,3,4], BT=["-3","-2","-1","-\\frac{1}{2}","\\frac{1}{2}","1","\\frac{3}{2}","2","3","4"];
        const PT=["\\frac{2\\pi}{3}","\\pi","2\\pi","4\\pi","4\\pi","2\\pi","\\frac{4\\pi}{3}","\\pi","\\frac{2\\pi}{3}","\\frac{\\pi}{2}"];
        let fn="cos", a=3, bi=7, cj=0, d=-1;
        const F=x=>fn==="sin"?Math.sin(x):Math.cos(x);
        const f=x=>a*F(BL[bi]*(x-cj*PI/12))+d;
        const base=G.fn(F,{cls:"lt dash"});
        const avg=G.line(-PI,0,4*PI,0,{cls:"tan dash",layer:G.layer.back});
        const mx=G.line(-PI,0,4*PI,0,{cls:"lt"}), mn=G.line(-PI,0,4*PI,0,{cls:"lt"});
        const curve=G.fn(f,{cls:"cv c"});
        const amp=G.line(0,0,0,0,{cls:"ln"}); amp.style.strokeWidth=2.2;
        const per=G.line(0,0,0,0,{cls:"ln"}), pe1=G.line(0,0,0,0,{cls:"ln"}), pe2=G.line(0,0,0,0,{cls:"ln"});
        const la=G.label(0,0,"amplitude",{cls:"lblc",dx:5}), lp=G.label(0,0,"period",{cls:"lblc",anchor:"middle",dy:-5}), lav=G.label(4*PI,0,"average",{cls:"lblc",anchor:"end",dy:-5});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        const fseg=PLOT.seg(ctl,{label:"Function",items:[["sin","sin"],["cos","cos"]],value:fn,onchange:v=>{ fn=v; draw(); }});
        const sa=PLOT.slider(ctl,{label:"a",min:-4,max:4,step:0.5,value:a,fmt:v=>String(v),oninput:v=>{ a=v; draw(); }});
        const sb=PLOT.slider(ctl,{label:"b",min:0,max:9,step:1,value:bi,fmt:i=>M.tex(BT[i]),oninput:v=>{ bi=v; draw(); }});
        const sc=PLOT.slider(ctl,{label:"c",min:-12,max:12,step:1,value:cj,fmt:j=>M.tex(piT(j,12)),oninput:v=>{ cj=v; draw(); }});
        const sd=PLOT.slider(ctl,{label:"d",min:-3,max:3,step:0.5,value:d,fmt:v=>String(v),oninput:v=>{ d=v; draw(); }});
        PLOT.seg(ctl,{label:"Examples from the notes",items:[["p3","3cos(2θ) − 1 (p. 3)"],["p4","2cos(4x) − 1 (p. 4)"],["plain","sin(x)"]],value:"",onchange:v=>{
          const P={p3:["cos",3,7,0,-1],p4:["cos",2,9,0,-1],plain:["sin",1,5,0,0]}[v]; [fn,a,bi,cj,d]=P; sa.set(a); sb.set(bi); sc.set(cj); sd.set(d);
          [...fseg.children].forEach(b=>b.setAttribute("aria-pressed",String(b.textContent===fn))); draw(); }});
        function draw(){
          const b=BL[bi], c=cj*PI/12, P=2*PI/Math.abs(b), A=Math.abs(a);
          base.update(F); curve.update(f);
          avg.set(-PI,d,4*PI,d); mx.set(-PI,d+A,4*PI,d+A); mn.set(-PI,d-A,4*PI,d-A); lav.set(4*PI,d);
          const show=A>0; [amp,per,pe1,pe2,la,lp].forEach(e=>e.style.display=show?"":"none");
          if(show){
            const th=fn==="sin"?(a>0?PI/2:3*PI/2):(a>0?0:PI);
            let xp=null; for(let m=-12;m<=12;m++){ const x=c+(th+2*PI*m)/b; if(x>=-PI+0.25&&(xp===null||x<xp)) xp=x; }
            const yb=d+A+0.7<=7.2?d+A+0.7:d-A-0.7;
            amp.set(xp,d,xp,d+A); la.set(xp,d+A/2);
            const x2=Math.min(xp+P,4*PI); per.set(xp,yb,x2,yb); pe1.set(xp,yb-0.3,xp,yb+0.3); pe2.set(x2,yb-0.3,x2,yb+0.3); lp.set((xp+x2)/2,yb);
          }
          const aT=a===1?"":a===-1?"-":String(a), bT=BT[bi]==="1"?"":BT[bi]==="-1"?"-":BT[bi];
          const inner=cj===0?`${bT}x`:`${bT==="-"?"-":bT}\\left(x ${cj<0?"+":"-"} ${piT(Math.abs(cj),12)}\\right)`;
          const dT=d===0?"":d<0?` - ${-d}`:` + ${d}`;
          ro.innerHTML=`${M.tex(`y = ${a===0?"0":aT+"\\"+fn+"\\left("+inner+"\\right)"}${dT}`)}<br>period ${M.tex(`2\\pi/|b| = ${PT[bi]}`)} &nbsp; amplitude ${M.tex(`|a| = ${A}`)} &nbsp; average ${M.tex(`d = ${d}`)} &nbsp; max ${M.tex(`d+|a| = ${d+A}`)} &nbsp; min ${M.tex(`d-|a| = ${d-A}`)}`;
        }
        draw();
      }},
    model:{title:"Build a model from the max and min", cap:"<b>Fig. 13.3</b> Daily body temperature. Drag the minimum and the maximum. The model is built the way the notes do it: average, amplitude, period from max to min, then the shift $c$. (Lecture 13, pp. 5 to 6)",
      build(host,{PLOT,M}){
        const G=PLOT.graph(host,{x:[0,48],y:[35,39],xstep:4,ystep:0.5,c:"var(--u5)",xlabel:"t (h)",ylabel:"T (°C)"});
        let tmin=4, Tmin=36.5, tmax=16, Tmax=37.5, fn="sin";
        const avg=G.line(0,37,48,37,{cls:"lt dash"});
        const curve=G.fn(()=>37,{cls:"cv c"});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        const pmin=dragPt(G,{label:"Minimum point",onMove:(x,y)=>{ tmin=Math.max(0,Math.min(47.5,Math.round(x*2)/2)); Tmin=Math.min(Tmax-0.2,Math.max(35.1,Math.round(y*10)/10)); fix("min"); draw(); },onKey:(dx,dy)=>{ tmin+=dx*0.5; Tmin=Math.min(Tmax-0.2,Tmin+dy*0.1); fix("min"); draw(); }});
        const pmax=dragPt(G,{label:"Maximum point",filled:true,onMove:(x,y)=>{ tmax=Math.max(0,Math.min(47.5,Math.round(x*2)/2)); Tmax=Math.max(Tmin+0.2,Math.min(38.9,Math.round(y*10)/10)); fix("max"); draw(); },onKey:(dx,dy)=>{ tmax+=dx*0.5; Tmax=Math.max(Tmin+0.2,Tmax+dy*0.1); fix("max"); draw(); }});
        const lmin=G.label(0,0,"min",{cls:"lblc",dx:10,dy:16}), lmax=G.label(0,0,"max",{cls:"lblc",dx:10,dy:-10});
        function fix(w){ tmin=Math.max(0,Math.min(47.5,tmin)); tmax=Math.max(0,Math.min(47.5,tmax)); if(Math.abs(tmax-tmin)<1){ if(w==="min") tmin=tmax+(tmin>=tmax?1:-1); else tmax=tmin+(tmax>=tmin?1:-1); } Tmin=Math.round(Tmin*10)/10; Tmax=Math.round(Tmax*10)/10; }
        PLOT.seg(ctl,{label:"Model",items:[["sin","sine model (notes)"],["cos","cosine model"]],value:fn,onchange:v=>{ fn=v; draw(); }});
        function draw(){
          const d=(Tmax+Tmin)/2, a=(Tmax-Tmin)/2, P=2*Math.abs(tmax-tmin), b=2*PI/P;
          let c=fn==="sin"?tmin+P/4:tmax; c=((c%P)+P)%P; c=Math.round(c*100)/100;
          const T=t=>a*(fn==="sin"?Math.sin(b*(t-c)):Math.cos(b*(t-c)))+d;
          curve.update(T); avg.set(0,d,48,d); pmin.set(tmin,Tmin); pmax.set(tmax,Tmax); lmin.set(tmin,Tmin); lmax.set(tmax,Tmax);
          const g=M.gcd(2,P), bT=`\\frac{${2/g===1?"":2/g}\\pi}{${P/g}}`.replace("\\frac{\\pi}{1}","\\pi").replace(/\\frac\{(\d*)\\pi\}\{1\}/,"$1\\pi");
          const cT=dec(c), aT=dec(a), dT=dec(d);
          ro.innerHTML=`${M.tex(`d = \\frac{${Tmax} + ${Tmin}}{2} = ${dT}`)} &nbsp; ${M.tex(`a = \\frac{${Tmax} - ${Tmin}}{2} = ${aT}`)}<br>period ${M.tex(`= 2\\cdot|${tmax} - ${tmin}| = ${P}`)}, so ${M.tex(`b = \\frac{2\\pi}{${P}} = ${bT}`)} &nbsp; ${fn==="sin"?`sine minimum sits ${M.tex("\\frac{P}{4}")} before ${M.tex("c")}, so ${M.tex(`c = ${tmin} + ${P/4}`)}`:`cosine maximum sits at ${M.tex("t = c")}, so ${M.tex(`c = ${tmax}`)}`}${(fn==="sin"?tmin+P/4:tmax)!==c?` (reduced by a period to ${M.tex(cT)})`:""}<br>${M.tex(`T(t) = ${aT}\\${fn}\\left(${bT}(t - ${cT})\\right) + ${dT}`)} &nbsp; check: ${M.tex(`T(${tmax}) = ${dec(T(tmax))}`)}`;
        }
        draw();
      }}
  },
  gens:[
    {id:"L13.g.features", title:"Max, min, average, amplitude, period", skill:"Read the wave features off $a\\sin(bx)+d$ or $a\\cos(bx)+d$", ref:"pp. 4 to 5",
      gen(R,d){
        const fn=R.pick(["sin","cos"]), v=R.pick(["x","\\theta","t"]);
        let a, bTeX, Pt, Pa, bStep, dd;          // a rational; d is {t,a,v} plus rational if possible
        if(d===1){ a=rq(R.int(2,5)*R.pick([1,1,1,-1])); const b=R.int(2,6); bTeX=`${b}${v}`; Pt=piT(2,b); Pa=piA(2,b); bStep=`${b}${v} = 2\\pi \\Rightarrow ${v} = ${Pt}`; dd=rq(R.int(-5,5)); }
        else if(d===2){ a=R.pick([rq(-1,2),rq(-3,2),rq(-2),rq(-3),rq(3,2),rq(5,2),rq(-5,2)]);
          if(R.int(0,1)){ const k=R.int(2,6); bTeX=`\\frac{${v}}{${k}}`; Pt=`${2*k}\\pi`; Pa=`${2*k}pi`; bStep=`\\frac{${v}}{${k}} = 2\\pi \\Rightarrow ${v} = ${2*k}\\pi`; }
          else { let p,q; do{ p=R.int(2,5); q=R.int(2,5); }while(M.gcd(p,q)!==1); bTeX=`\\frac{${p}${v}}{${q}}`; Pt=piT(2*q,p); Pa=piA(2*q,p); bStep=`\\frac{${p}${v}}{${q}} = 2\\pi \\Rightarrow ${v} = ${Pt}`; }
          dd=rq(R.int(-7,7),2); }
        else { a=R.pick([rq(-1,2),rq(-3,2),rq(-2),rq(-4),rq(5,2),rq(-1,3)]);
          const kind=R.pick(["pik","inv","kpi"]);
          if(kind==="pik"){ const k=R.int(2,8); bTeX=`\\frac{\\pi}{${k}}${v}`; Pt=String(2*k); Pa=String(2*k); bStep=`\\frac{\\pi}{${k}}${v} = 2\\pi \\Rightarrow ${v} = ${2*k}`; }
          else if(kind==="inv"){ bTeX=`\\frac{${v}}{\\pi}`; Pt="2\\pi^2"; Pa="2pi^2"; bStep=`\\frac{${v}}{\\pi} = 2\\pi \\Rightarrow ${v} = 2\\pi^2`; }
          else { const k=R.int(2,4); bTeX=`${k}\\pi ${v}`; Pt=M.frac(2,k); Pa=M.fracA(2,k); bStep=`${k}\\pi ${v} = 2\\pi \\Rightarrow ${v} = ${Pt}`; }
          dd=R.pick([null,null,rq(R.int(-4,4),2)]); }
        const A=rq(Math.abs(a[0]),a[1]);
        let D, Mx, Mn;
        if(dd){ D={t:rT(dd),a:rA(dd),v:rV(dd)}; const mx=radd(dd,A), mn=rsub(dd,A); Mx={t:rT(mx),a:rA(mx)}; Mn={t:rT(mn),a:rA(mn)}; }
        else { const s=R.pick([["\\pi","pi"],["-\\pi","-pi"],["\\sqrt{2}","sqrt(2)"]]); D={t:s[0],a:s[1]}; Mx={t:`${s[0]} + ${rT(A)}`,a:`${s[1]} + ${rA(A)}`}; Mn={t:`${s[0]} - ${rT(A)}`,a:`${s[1]} - ${rA(A)}`}; }
        const aT=a[1]===1?(a[0]===1?"":a[0]===-1?"-":String(a[0])):(a[0]<0?"-":"")+`\\frac{${Math.abs(a[0])}}{${a[1]}}`;
        const dpart=D.t==="0"?"":D.t.startsWith("-")?` - ${D.t.slice(1)}`:` + ${D.t}`;
        const f=`${aT}\\${fn}\\left(${bTeX}\\right)${dpart}`;
        const steps=[
          `Period: $\\${fn}$ normally completes its first period when its argument is $2\\pi$. So $f$ completes its first period when $${bStep}$. The period is $${Pt}$ (the same as $\\left|\\frac{2\\pi}{b}\\right|$).`,
          `Average: the average of $\\${fn}$ is 0, and ${D.t==="0"?"there is no vertical translation":"the graph is translated by $"+D.t+"$ vertically"}, so the average is $d = ${D.t}$.`,
          `Amplitude: the amplitude of $\\${fn}$ is 1. The vertical stretch gives amplitude $|a| = \\left|${rT(a)}\\right| = ${rT(A)}$.${a[0]<0?" The minus sign only reflects the graph over the $x$-axis; the amplitude stays positive.":""}`,
          `Max $=$ average $+$ amplitude $= ${Mx.t}$. Min $=$ average $-$ amplitude $= ${Mn.t}$.`];
        return {prompt:`Determine the maximum, minimum, average, amplitude and period of $$f(${v}) = ${f}$$`,
          parts:[{label:"Maximum",answer:{type:"num",answer:Mx.a}},{label:"Minimum",answer:{type:"num",answer:Mn.a}},{label:"Average",answer:{type:"num",answer:D.a}},{label:"Amplitude",answer:{type:"num",answer:rA(A)}},{label:"Period",answer:{type:"num",answer:Pa}}],
          hint:"For $y = a\\sin(bx) + d$: period $\\left|\\frac{2\\pi}{b}\\right|$, amplitude $|a|$, average $d$, max $d + |a|$, min $d - |a|$. Find $b$ carefully when it is a fraction or has $\\pi$ in it.",
          steps, answerTeX:`max $${Mx.t}$, min $${Mn.t}$, average $${D.t}$, amplitude $${rT(A)}$, period $${Pt}$`};
      }},
    {id:"L13.g.build", title:"Build a sinusoidal model", skill:"Find $a$, $b$, $c$, $d$ from a max, a min and a period", ref:"pp. 5 to 6",
      gen(R,d){
        if(d===1){
          const fn=R.pick(["cos","sin"]); const D=R.int(-2,6), A=R.pick([rq(1,2),rq(1),rq(3,2),rq(2),rq(3),rq(5,2)]);
          const mx=radd(rq(D),A), mn=rsub(rq(D),A);
          const [P,bT,bA]=R.pick([["2","\\pi","pi"],["4","\\frac{\\pi}{2}","pi/2"],["6","\\frac{\\pi}{3}","pi/3"],["8","\\frac{\\pi}{4}","pi/4"],["12","\\frac{\\pi}{6}","pi/6"],["24","\\frac{\\pi}{12}","pi/12"],["\\pi","2","2"],["4\\pi","\\frac{1}{2}","1/2"],["3","\\frac{2\\pi}{3}","2pi/3"]]);
          const yT=`y = ${rT(A)==="1"?"":rT(A)}\\${fn}\\left(${bT}\\,x\\right)${D===0?"":D<0?" - "+(-D):" + "+D}`;
          return {prompt:`Write a ${fn==="cos"?"cosine":"sine"} function $y = a\\${fn}(bx) + d$ with maximum $${rT(mx)}$, minimum $${rT(mn)}$ and period $${P}$. Take $a > 0$ and $b > 0$.`,
            parts:[{label:"$a =$",answer:{type:"num",answer:rA(A)}},{label:"$b =$",answer:{type:"num",answer:bA}},{label:"$d =$",answer:{type:"num",answer:String(D)}}],
            hint:"The average is half-way between the max and the min. The amplitude is max minus average. Then solve $\\text{period} = \\frac{2\\pi}{b}$ for $b$.",
            steps:[`Average: $d = \\frac{${rT(mx)} + ${rT(mn)}}{2} = ${D}$.`,`Amplitude: $a = \\text{max} - \\text{average} = ${rT(mx)} - ${D} = ${rT(A)}$.`,`Period: $${P} = \\frac{2\\pi}{b}$, so $b = \\frac{2\\pi}{${P}} = ${bT}$.`,`So $${yT}$.`],
            answerTeX:`$${yT}$`};
        }
        if(d===2){
          const half=R.int(2,6), P=2*half, D=R.int(3,20), A=R.int(2,9), mx=D+A, mn=D-A;
          const maxFirst=R.int(0,1)===1, t1=R.int(1,9), t2=t1+half;
          const tmax=maxFirst?t1:t2, c=((tmax%P)+P)%P;
          const bT=`\\frac{\\pi}{${half}}`;
          const pts=maxFirst?`a maximum point at $(${t1}, ${mx})$ and the next minimum point at $(${t2}, ${mn})$`:`a minimum point at $(${t1}, ${mn})$ and the next maximum point at $(${t2}, ${mx})$`;
          return {prompt:`Data can be modelled by $y = a\\cos(b(t - c)) + d$. There is ${pts}. Find $a$, $b$, $c$ and $d$ with $a > 0$, $b > 0$ and $0 \\le c < \\text{period}$.`,
            parts:[{label:"$a =$",answer:{type:"num",answer:String(A)}},{label:"$b =$",answer:{type:"num",answer:`pi/${half}`}},{label:"$c =$",answer:{type:"num",answer:String(c)}},{label:"$d =$",answer:{type:"num",answer:String(D)}}],
            hint:"From a max to the next min is half a period. Cosine has its maximum where the inside is 0, which is at $t = c$.",
            steps:[`Average: $d = \\frac{${mx} + ${mn}}{2} = ${D}$. Amplitude: $a = ${mx} - ${D} = ${A}$.`,`From ${maxFirst?"the max to the next min":"the min to the next max"} is half a cycle: $${t2} - ${t1} = ${half}$, so the period is $${P}$.`,`$${P} = \\frac{2\\pi}{b}$, so $b = \\frac{2\\pi}{${P}} = ${bT}$.`,
              `$\\cos(b(t-c))$ is largest when $t - c = 0$, so $c$ is the time of a maximum: $c = ${tmax}$${tmax!==c?`, and subtracting one period gives $c = ${c}$ in $[0, ${P})$`:""}.`,`So $y = ${A}\\cos\\left(${bT}(t - ${c})\\right) + ${D}$.`.replace("(t - 0)","t")],
            answerTeX:`$y = ${A}\\cos\\left(${bT}(t - ${c})\\right) + ${D}$`.replace("(t - 0)","t")};
        }
        // d3: word problems with a sine model
        const S=R.pick(["body","tide","wheel"]);
        let txt, P, mx, mn, tmax, unit, Tn, tn;
        if(S==="body"){ const avg=R.pick([36.8,36.9,37,37.1]), sw=R.pick([0.8,1,1.2,1.4]); P=24; mx=+(avg+sw/2).toFixed(2); mn=+(avg-sw/2).toFixed(2); const hp=R.int(2,6); tmax=12+hp; Tn="T"; tn="t"; unit="°C";
          txt=`A person's body temperature follows a sine wave with a period of 24 hours. The average is $${avg}$°C and the temperature swings by $${sw}$°C between the maximum and the minimum. The maximum is at ${hp} pm and the minimum at ${hp} am. Let $t$ be hours after midnight.`; }
        else if(S==="tide"){ P=12; mx=R.pick([6,7,8,9,10]); mn=R.pick([0.5,1,1.5,2]); tmax=R.int(1,11); Tn="h"; tn="t"; unit="m";
          txt=`At a harbour, high tide is $${mx}$ m and low tide is $${mn}$ m. High tides are 12 hours apart, and one high tide is at $t = ${tmax}$ hours after midnight. Model the water level with a sine function of $t$.`; }
        else { const D2=R.pick([20,30,40,50]); P=R.pick([4,6,8,10]); mn=2; mx=2+D2; tmax=R.int(1,P-1); Tn="H"; tn="t"; unit="m";
          txt=`A Ferris wheel has a diameter of $${D2}$ m and its lowest seat is $2$ m above the ground. It turns once every $${P}$ minutes, and a rider reaches the top at $t = ${tmax}$ minutes. Model the rider's height with a sine function of $t$.`; }
        const dd=+((mx+mn)/2).toFixed(3), a=+((mx-mn)/2).toFixed(3), q=P/4;
        let c=tmax-q; const raw=c; c=((c%P)+P)%P; c=+c.toFixed(3);
        const bT=`\\frac{\\pi}{${P/2}}`;
        return {prompt:`${txt} Write the model as $${Tn}(${tn}) = a\\sin(b(${tn} - c)) + d$ with $a > 0$, $b > 0$ and $0 \\le c < ${P}$. Find $a$, $b$, $c$ and $d$.`,
          parts:[{label:"$a =$",answer:{type:"num",answer:String(a)}},{label:"$b =$",answer:{type:"num",answer:`pi/${P/2}`}},{label:"$c =$",answer:{type:"num",answer:String(c)}},{label:"$d =$",answer:{type:"num",answer:String(dd)}}],
          hint:"Average and amplitude come from the max and min. Then $b = \\frac{2\\pi}{\\text{period}}$. The plain graph of $\\sin(bt)$ has its maximum a quarter period after $t = 0$; shift it so the maximum lands at the given time.",
          steps:[`Max $= ${mx}$, min $= ${mn}$. Average: $d = \\frac{${mx} + ${mn}}{2} = ${dd}$. Amplitude: $a = ${mx} - ${dd} = ${a}$.`,
            `Period: $${P} = \\left|\\frac{2\\pi}{b}\\right|$, so $b = \\frac{2\\pi}{${P}} = ${bT}$.`,
            `The plain graph of $\\sin\\left(${bT}${tn}\\right)$ has its maximum where $${bT}${tn} = \\frac{\\pi}{2}$, at $${tn} = ${q}$ (a quarter period).`,
            `We need the maximum at $${tn} = ${tmax}$, so translate right by $${tmax} - ${q} = ${+raw.toFixed(3)}$${raw!==c?`. That is negative, so add one period: $c = ${+raw.toFixed(3)} + ${P} = ${c}$ (the graph repeats every period, so this is the same curve)`:`: $c = ${c}$`}.`,
            `$${Tn}(${tn}) = ${a}\\sin\\left(${bT}(${tn} - ${c})\\right) + ${dd}$ ${unit}.`.replace(`(${tn} - 0)`,tn),
            `Check: $${Tn}(${tmax}) = ${a}\\sin\\left(${bT}(${tmax} - ${c})\\right) + ${dd} = ${a}\\sin\\left(${raw===c?"\\frac{\\pi}{2}":"\\frac{\\pi}{2} - 2\\pi"}\\right) + ${dd} = ${mx}$.`],
          answerTeX:`$${Tn}(${tn}) = ${a}\\sin\\left(${bT}(${tn} - ${c})\\right) + ${dd}$`.replace(`(${tn} - 0)`,tn)};
      }},
    {id:"L13.g.eval", title:"Use a model", skill:"Evaluate a wave model and find when it peaks", ref:"p. 6",
      gen(R,d){
        const k=R.pick([3,6,12]), P=2*k;
        const D=R.pick([4,5,6,8,10]), A=R.pick([1.5,2,2.5,3,3.5]);
        const fn=d===1?"cos":R.pick(["cos","sin"]);
        const c=d===3?R.int(1,k-1):0;
        const bT=`\\frac{\\pi}{${k}}`;
        const inner=c?`${bT}(t - ${c})`:`${bT}t`;
        const model=`h(t) = ${D} + ${A}\\${fn}\\left(${inner}\\right)`;
        let t0, j; do{ t0=R.int(0,P); j=12*(t0-c)/k; }while(!Number.isInteger(j)||!exact(fn,j)||(d>1&&t0===c));
        const e=exact(fn,j); const val=D+A*(fn==="cos"?Math.cos(PI*(t0-c)/k):Math.sin(PI*(t0-c)/k));
        const argT=piT(j,12);
        const parts=[{label:`$h(${t0})$`,answer:{type:"num",answer:`${D} + ${A}*(${e.a})`}}];
        const steps=[`$h(${t0}) = ${D} + ${A}\\${fn}\\left(${c?`${bT}(${t0} - ${c})`:`${bT}\\cdot ${t0}`}\\right) = ${D} + ${A}\\${fn}\\left(${argT}\\right)$.`,`$\\${fn}\\left(${argT}\\right) = ${e.t}$, so $h(${t0}) = ${D} + ${A}\\left(${e.t}\\right)${e.t.includes("sqrt")?"":` = ${+val.toFixed(4)}`}$${e.t.includes("sqrt")?` $\\approx ${val.toFixed(3)}$`:""}.`];
        let ansT=`$h(${t0}) = ${D} + ${A}\\left(${e.t}\\right)${e.t.includes("sqrt")?` \\approx ${val.toFixed(3)}`:` = ${+val.toFixed(4)}`}$`;
        if(d>=2){
          const want=d===2?"min":"max";
          // inside angle where fn hits want
          const th=fn==="cos"?(want==="max"?0:PI):(want==="max"?PI/2:3*PI/2);
          let t=c+th*k/PI; while(t>=P) t-=P; while(t<=0) t+=P; t=+t.toFixed(6);
          const label=want==="max"?"First time $t > 0$ of a maximum":"First time $t > 0$ of a minimum";
          parts.push({label,answer:{type:"num",answer:String(t)}});
          steps.push(`$\\${fn}$ reaches its ${want==="max"?"maximum 1":"minimum $-1$"} when its argument is $${fn==="cos"?(want==="max"?"0":"\\pi"):(want==="max"?"\\frac{\\pi}{2}":"\\frac{3\\pi}{2}")}$ (plus multiples of $2\\pi$).`);
          steps.push(`Solve $${inner} = ${fn==="cos"?(want==="max"?"0":"\\pi"):(want==="max"?"\\frac{\\pi}{2}":"\\frac{3\\pi}{2}")}$${want==="max"&&fn==="cos"?" (or $2\\pi$)":""}: the first $t>0$ is $t = ${t}$. The ${want==="max"?"maximum":"minimum"} value is $${D} ${want==="max"?"+":"-"} ${A} = ${want==="max"?D+A:D-A}$.`);
          ansT+=`, first ${want} at $t = ${t}$`;
        }
        return {prompt:`The water depth at a dock is $${model}$ metres, $t$ hours after midnight. ${d===1?`Find the depth at $t = ${t0}$.`:`Find the depth at $t = ${t0}$, and the first time after midnight that the depth is at its ${d===2?"minimum (low tide)":"maximum (high tide)"}.`}`,
          parts, verify:{value:val},
          hint:"Substitute, simplify the inside to a special angle, and use the exact value. For the time, set the inside equal to the angle where the trig function is at its max or min.",
          steps, answerTeX:ansT};
      }},
    {id:"L13.g.shift", title:"Read the transformations", skill:"Say what $a$, $b$, $c$, $d$ do to the graph", ref:"p. 2",
      gen(R,d){
        const fn=R.pick(["sin","cos"]);
        const shifts=[[3,"\\frac{\\pi}{4}"],[4,"\\frac{\\pi}{3}"],[2,"\\frac{\\pi}{6}"],[6,"\\frac{\\pi}{2}"]];
        if(d===1){
          const [cj,cT]=R.pick(shifts), dv=R.int(1,4), right=R.int(0,1)===1, up=R.int(0,1)===1;
          const y=`y = \\${fn}\\left(x ${right?"-":"+"} ${cT}\\right) ${up?"+":"-"} ${dv}`;
          const o=(r,u)=>`${r?"right":"left"} $${cT}$ and ${u?"up":"down"} $${dv}$`;
          const opts=[o(right,up),o(!right,up),o(right,!up),o(!right,!up)];
          const ord=R.shuffle([0,1,2,3]);
          return {prompt:`Compared with $y = \\${fn}(x)$, the graph of $${y}$ is shifted`, parts:[{answer:{type:"mc",options:ord.map(i=>opts[i]),correct:ord.indexOf(0)}}],
            hint:"$x - c$ moves the graph right by $c$; $x + c$ is $x - (-c)$, a move left. The added constant moves it up or down.",
            steps:[`Write it as $y = \\${fn}(x - c) + d$ with $c = ${right?"":"-"}${cT}$ and $d = ${up?"":"-"}${dv}$.`,`$c ${right?">":"<"} 0$ moves the graph ${right?"right":"left"}, and $d ${up?">":"<"} 0$ moves it ${up?"up":"down"}.`],
            answerTeX:o(right,up)};
        }
        if(d===2){
          const a=R.pick([2,3,4,-2,-3]), b=R.pick([2,3,4]), [cj,cT]=R.pick(shifts), dv=R.nz(-3,3);
          const y=`y = ${a}\\${fn}\\left(${b}\\left(x - ${cT}\\right)\\right) ${dv<0?"-":"+"} ${Math.abs(dv)}`;
          const desc=(st,rf,hc,rt,vu)=>`vertical stretch by ${st}${rf?", reflect over the $x$-axis":""}, horizontal ${hc?"compression":"stretch"} by a factor of ${b}, shift ${rt?"right":"left"} $${cT}$, shift ${vu?"up":"down"} $${Math.abs(dv)}$`;
          const ref=a<0, up=dv>0, st=Math.abs(a);
          const right=desc(st,ref,true,true,up);
          const opts=[right,desc(st,!ref,true,true,up),desc(st,ref,false,true,up),desc(st,ref,true,false,up)];
          const ord=R.shuffle([0,1,2,3]);
          return {prompt:`Which list describes how to get the graph of $${y}$ from $y = \\${fn}(x)$?`, parts:[{answer:{type:"mc",options:ord.map(i=>opts[i]),correct:ord.indexOf(0)}}],
            hint:"$a$: vertical stretch by $|a|$, reflection if $a<0$. $b>1$: horizontal compression by a factor of $b$. $x - c$: right by $c$. $+d$: up by $d$.",
            steps:[`$a = ${a}$: vertical stretch by a factor of ${st}${ref?", and $a<0$ reflects the graph over the $x$-axis":""}.`,`$b = ${b}$: horizontal compression by a factor of ${b} (the period becomes $\\frac{2\\pi}{${b}}$).`,`$c = ${cT}$: shift right $${cT}$. $d = ${dv}$: shift ${up?"up":"down"} $${Math.abs(dv)}$.`],
            answerTeX:right};
        }
        const b=R.pick([2,3,4]), kk=R.pick([1,2,3]), den=R.pick([1,2,3,4,6].filter(x=>x!==1||kk>0));
        const kT=piT(kk,den), sh=piT(kk,den*b);
        const y=`y = \\${fn}\\left(${b}x - ${kT}\\right)`;
        const opts=[`right $${sh}$`,`right $${kT}$`,`left $${sh}$`,`right $${piT(kk*b,den)}$`];
        const uniq=[...new Set(opts)]; while(uniq.length<4) uniq.push(`left $${kT}$`);
        const ord=R.shuffle([0,1,2,3]);
        return {prompt:`What is the horizontal translation of $${y}$ compared with $y = \\${fn}(${b}x)$?`, parts:[{answer:{type:"mc",options:ord.map(i=>uniq[i]),correct:ord.indexOf(0)}}],
          hint:"Factor $b$ out of the bracket first, so it looks like $b(x - c)$.",
          steps:[`Factor out ${b}: $${b}x - ${kT} = ${b}\\left(x - ${sh}\\right)$.`,`So $c = ${sh}$: the graph moves right by $${sh}$, not by $${kT}$.`],
          answerTeX:`right $${sh}$`};
      }},
    {id:"L13.g.error", title:"Find the first mistake", skill:"Spot the first wrong line in a wave or model solution", ref:"pp. 4 to 6",
      gen(R,d){
        let prob, L, bad, why, mc=null;
        const pick=d===1?"amp":d===2?R.pick(["per","build"]):R.pick(["build","three","three"]);
        if(pick==="amp"){
          const a=-R.int(2,5), b=R.int(2,4), dv=R.int(-3,4), fn=R.pick(["sin","cos"]);
          prob=`Determine the max, average, amplitude and period of $f(x) = ${a}\\${fn}(${b}x) ${dv<0?"-":"+"} ${Math.abs(dv)}$.`;
          const v=R.int(0,1);
          if(v===0){ L=[`Period: $${b}x = 2\\pi$, so the period is $${piT(2,b)}$.`,`Average: $d = ${dv}$.`,`Amplitude: $a = ${a}$.`,`Max $= d + a = ${dv+a}$.`];
            bad=2; why=`Amplitude is $|a| = ${-a}$, never negative. Then max $= ${dv} + ${-a} = ${dv-a}$.`; }
          else { L=[`Period: $\\frac{${b}}{2\\pi}$.`,`Average: $d = ${dv}$.`,`Amplitude: $|a| = ${-a}$.`,`Max $= d + |a| = ${dv-a}$.`];
            bad=0; why=`Period $= \\left|\\frac{2\\pi}{b}\\right| = \\frac{2\\pi}{${b}} = ${piT(2,b)}$, not $\\frac{b}{2\\pi}$.`; }
        } else if(pick==="per"){
          const k=R.int(2,6), a=R.int(2,4), dv=R.int(-2,3);
          const inv=R.int(0,1)===1;
          if(inv){ prob=`Determine the amplitude, average and period of $f(\\theta) = ${a}\\cos\\left(\\frac{\\theta}{\\pi}\\right) ${dv<0?"-":"+"} ${Math.abs(dv)}$.`;
            L=[`Amplitude: $|a| = ${a}$.`,`Average: $d = ${dv}$.`,`Here $b = \\frac{1}{\\pi}$.`,`Period: $\\left|\\frac{2\\pi}{b}\\right| = \\frac{2\\pi}{1/\\pi} = 2$.`];
            bad=3; why=`$\\frac{2\\pi}{1/\\pi} = 2\\pi\\cdot\\pi = 2\\pi^2$.`; }
          else { prob=`Determine the amplitude and period of $f(t) = ${a}\\sin\\left(\\frac{\\pi}{${k}}t\\right)$.`;
            L=[`Amplitude: $|a| = ${a}$.`,`Here $b = \\frac{\\pi}{${k}}$.`,`Period: $\\left|\\frac{2\\pi}{b}\\right| = 2\\pi\\cdot\\frac{\\pi}{${k}} = \\frac{2\\pi^2}{${k}}$.`];
            bad=2; why=`Dividing by $\\frac{\\pi}{${k}}$ means multiplying by $\\frac{${k}}{\\pi}$: period $= 2\\pi\\cdot\\frac{${k}}{\\pi} = ${2*k}$.`; }
        } else if(pick==="build"){
          const mx=R.pick([37.5,37.4,37.6]), mn=+(74-mx).toFixed(1), v=R.int(0,3);
          prob=`Body temperature is a sine wave with period 24 hours, maximum $${mx}$°C at 4 pm and minimum $${mn}$°C at 4 am. Write $T(t) = a\\sin(b(t-c)) + d$, $t$ in hours.`;
          const A=+((mx-mn)/2).toFixed(2);
          const good=[`$d = \\frac{${mx} + ${mn}}{2} = 37$`,`$a = ${mx} - 37 = ${A}$`,`$24 = \\frac{2\\pi}{b}$, so $b = \\frac{\\pi}{12}$`,`The plain graph has its minimum at $t = -6$. Move it to $t = 4$: shift right 10, so $c = 10$`,`$T(t) = ${A}\\sin\\left(\\frac{\\pi}{12}(t-10)\\right) + 37$`];
          L=good.slice();
          if(v===0){ L[1]=`$a = ${mx} - ${mn} = ${+(mx-mn).toFixed(2)}$`; bad=1; why=`The amplitude is max minus average, $${mx} - 37 = ${A}$. Max minus min is twice the amplitude.`; }
          else if(v===1){ L[2]=`$24 = \\frac{2\\pi}{b}$, so $b = \\frac{24}{2\\pi} = \\frac{12}{\\pi}$`; bad=2; why=`Solve for $b$: $b = \\frac{2\\pi}{24} = \\frac{\\pi}{12}$.`; }
          else if(v===2){ L[3]=`The plain graph has its minimum at $t = -6$. Move it to $t = 4$: shift right 10, so $c = -10$`; L[4]=`$T(t) = ${A}\\sin\\left(\\frac{\\pi}{12}(t+10)\\right) + 37$`; bad=3; why=`A shift right by 10 is $t - 10$, so $c = 10$.`; }
          else { L[4]=`$${A}\\sin\\left(\\frac{\\pi}{12}(t-10)\\right) + 37$`; bad=4; why=`Every number is right, but the last line never says what it equals. Write $T(t) = \\ldots$; the quizzes take marks off for a missing left side.`; }
        } else {
          const [P,bT]=R.pick([[2,"\\pi"],[4,"\\frac{\\pi}{2}"],[6,"\\frac{\\pi}{3}"],[8,"\\frac{\\pi}{4}"]]);
          const D=R.int(1,5), A=R.int(1,3), mx=D+A, mn=D-A;
          prob=`Write a cosine function with maximum $${mx}$, minimum $${mn}$ and period $${P}$. Three students answered. Which answer is correct?`;
          const c0=`$y = ${A===1?"":A}\\cos\\left(${bT}\\,x\\right) + ${D}$`;
          const c1=`$y = ${2*A}\\cos\\left(${bT}\\,x\\right) + ${D}$`;
          const c2=`$y = ${A===1?"":A}\\cos\\left(${P}x\\right) + ${D}$`;
          const c3=`$y = ${A===1?"":A}\\cos\\left(${bT}\\,x\\right) + ${mx}$`;
          const pool=R.shuffle([c1,c2,c3]).slice(0,2); const opts=R.shuffle([c0,...pool]);
          mc={type:"mc",options:opts,correct:opts.indexOf(c0)};
          why=`Average $\\frac{${mx}+${mn}}{2} = ${D}$, amplitude $${mx} - ${D} = ${A}$, and $b = \\frac{2\\pi}{${P}} = ${bT}$. So ${c0}.`;
          return {prompt:prob, parts:[{answer:mc}], hint:"Check each answer: does it have the right average, amplitude and period?", steps:[`Average: $d = ${D}$. Amplitude: $${A}$. Period $${P} = \\frac{2\\pi}{b}$ gives $b = ${bT}$.`,why,`The wrong answers use $a = \\text{max} - \\text{min}$, or put the period itself in for $b$, or use the max as the average.`], answerTeX:c0};
        }
        return {prompt:`A problem and an answer are below. The answer would not get full marks. Select the first line with a mistake.<p>Problem: ${prob}</p>${linesHTML(L)}`,
          parts:[{answer:{type:"mc",options:lineOpts(L.length),correct:bad,keep:true}}],
          hint:"Check: amplitude $|a|$ is positive, period $\\left|\\frac{2\\pi}{b}\\right|$, $x - c$ is a shift right, and the answer names its function.",
          steps:[`Line (${bad+1}) is the first mistake.`,why], answerTeX:`Line (${bad+1})`};
      }}
  ],
  exam:[
    {id:"L13.q1", ref:"p. 5", multi:true, q:"Let $f(x) = 4\\cos(3x) - 2$. Select all true statements.", opts:[["The maximum is 2",1,"$d + |a| = -2 + 4 = 2$."],["The minimum is $-6$",1,"$d - |a| = -2 - 4 = -6$."],["The period is $\\frac{2\\pi}{3}$",1,"$\\left|\\frac{2\\pi}{3}\\right|$."],["The average is 4",0,"4 is the amplitude. The average is $d = -2$."],["The period is 3",0,"$b = 3$ squeezes the graph; the period is $\\frac{2\\pi}{3}$."]]},
    {id:"L13.q2", ref:"p. 5", q:"The period of $5\\sin\\left(\\frac{\\pi}{4}x\\right) - 1$ is", opts:[["8",1,"$\\frac{2\\pi}{\\pi/4} = 2\\pi\\cdot\\frac{4}{\\pi} = 8$."],["$\\frac{\\pi^2}{2}$",0,"That multiplies by $b$ instead of dividing."],["$8\\pi$",0,"The $\\pi$ cancels."],["$\\frac{\\pi}{4}$",0,"That is $b$, not the period."]]},
    {id:"L13.q3", ref:"p. 5", q:"True or false: the amplitude of $f(x) = -3\\sin(2x) + 1$ is $-3$.", opts:[["False",1,"Amplitude $= |a| = 3$. The minus sign reflects the graph over the $x$-axis."],["True",0,"Amplitude is a distance from the average to the max, so it is never negative."]]},
    {id:"L13.q4", ref:"pp. 1 to 2", multi:true, q:"On which of these intervals is $\\cos(x)$ one-to-one? Select all that apply.", opts:[["$[0, \\pi]$",1,"The interval the notes use (p. 2): cos falls from 1 to $-1$."],["$[\\pi, 2\\pi]$",1,"cos rises from $-1$ to 1, so no value repeats."],["$\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$",0,"That is the interval for sin. $\\cos\\left(-\\frac{\\pi}{4}\\right) = \\cos\\left(\\frac{\\pi}{4}\\right)$."],["$[0, 2\\pi]$",0,"A full period repeats values: $\\cos(0) = \\cos(2\\pi)$."]]},
    {id:"L13.q5", ref:"p. 2", q:"The vertical asymptotes of $y = \\tan(x)$ are at", opts:[["$x = -\\frac{\\pi}{2} + k\\pi$",1,"Where $\\cos(x) = 0$ (p. 2)."],["$x = k\\pi$",0,"Those are the zeros of $\\tan(x)$."],["$x = \\frac{\\pi}{2} + 2k\\pi$",0,"That misses every second asymptote; tan has period $\\pi$."],["There are none",0,"$\\tan = \\frac{\\sin}{\\cos}$ blows up where $\\cos = 0$."]]},
    {id:"L13.q6", ref:"p. 2", q:"The horizontal translation of $y = 2\\sin(3x - \\pi)$ compared with $y = 2\\sin(3x)$ is", opts:[["right $\\frac{\\pi}{3}$",1,"$3x - \\pi = 3\\left(x - \\frac{\\pi}{3}\\right)$, so $c = \\frac{\\pi}{3}$."],["right $\\pi$",0,"Factor out $b = 3$ first."],["left $\\frac{\\pi}{3}$",0,"$x - c$ with $c > 0$ is a move right."],["right $3\\pi$",0,"You divide by $b$, not multiply."]]},
    {id:"L13.q7", ref:"pp. 5 to 6", q:"A problem and answer are below. Select the first line with a mistake. Problem: high tide is 9 m at midnight, low tide is 1 m, and high tides are 12 hours apart. Write $h(t) = a\\cos(bt) + d$. (1) $d = \\frac{9+1}{2} = 5$ (2) $a = 9 - 5 = 4$ (3) $b = \\frac{12}{2\\pi} = \\frac{6}{\\pi}$ (4) $h(t) = 4\\cos\\left(\\frac{6}{\\pi}t\\right) + 5$", keep:true, opts:[["Line (1)",0,"The average is half-way between max and min: 5."],["Line (2)",0,"Amplitude is max minus average: 4."],["Line (3)",1,"$12 = \\frac{2\\pi}{b}$ gives $b = \\frac{2\\pi}{12} = \\frac{\\pi}{6}$."],["Line (4)",0,"Line (4) carries the mistake from line (3), but line (3) is first."]]},
    {id:"L13.q8", ref:"p. 6", q:"For the notes' model $T(t) = \\frac{1}{2}\\sin\\left(\\frac{\\pi}{12}(t-10)\\right) + 37$, what is $T(4)$?", opts:[["36.5",1,"$\\frac{\\pi}{12}(4-10) = -\\frac{\\pi}{2}$ and $\\sin\\left(-\\frac{\\pi}{2}\\right) = -1$: $37 - \\frac{1}{2}$. The minimum, at 4 am."],["37.5",0,"That is $T(16)$, the maximum at 4 pm."],["37",0,"That is the average, reached at $t = 10$ and $t = 22$."],["36",0,"The amplitude is $\\frac{1}{2}$, so the minimum is $36.5$."]]},
    {id:"L13.q9", ref:"p. 5", q:"The depth of water is $d(t) = 10 + A\\cos\\left(\\frac{\\pi t}{6}\\right)$ m with $A > 0$. High and low water differ by 12 m. Then $A =$", opts:[["6",1,"Max minus min is $(10 + A) - (10 - A) = 2A = 12$."],["12",0,"12 m is max minus min, which is twice the amplitude."],["2",0,"That would be $\\frac{12}{6}$, which mixes in the $\\frac{\\pi}{6}$."],["22",0,"That is a possible max depth, not $A$."]]},
    {id:"L13.q10", ref:"p. 5", q:"True or false: for $y = 3\\cos(-2x)$, the period is $-\\pi$.", opts:[["False",1,"Period $= \\left|\\frac{2\\pi}{b}\\right| = \\left|\\frac{2\\pi}{-2}\\right| = \\pi$. A period is a distance, so it is positive."],["True",0,"The absolute value bars in $\\left|\\frac{2\\pi}{b}\\right|$ are there for this case."]]},
    {id:"L13.q11", ref:"p. 5", q:"Which is a cosine function with maximum 5, minimum 1 and period 4?", opts:[["$y = 2\\cos\\left(\\frac{\\pi}{2}x\\right) + 3$",1,"Average 3, amplitude 2, $b = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$."],["$y = 4\\cos\\left(\\frac{\\pi}{2}x\\right) + 3$",0,"4 is max minus min. The amplitude is half of that."],["$y = 2\\cos(4x) + 3$",0,"Period of this one is $\\frac{2\\pi}{4} = \\frac{\\pi}{2}$, not 4."],["$y = 2\\cos\\left(\\frac{\\pi}{2}x\\right) + 5$",0,"5 is the max; the average is 3."]]},
    {id:"L13.q12", ref:"p. 2", q:"In $y = a\\cos(b(x-c)) + d$, what does $a < 0$ do to the graph?", opts:[["Reflects it over the $x$-axis (and scales it by $|a|$)",1,"From p. 2: $a$ is a scaling in $y$, with a reflection over the $x$-axis if $a < 0$."],["Reflects it over the $y$-axis",0,"That is what $b < 0$ does."],["Shifts it down by $|a|$",0,"Vertical shifts come from $d$."],["Makes the amplitude negative",0,"Amplitude is $|a|$."]]}
  ],
  steps:[
    {type:"read", title:"The three graphs", body:`<p>You need to know these three graphs and their key features (pp. 1 to 2):</p><ul><li>$y = \\sin(x)$: period $2\\pi$, range $[-1, 1]$, invertible on $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$. It starts at $(0, 0)$ and peaks at $\\frac{\\pi}{2}$.</li><li>$y = \\cos(x)$: period $2\\pi$, range $[-1, 1]$, invertible on $[0, \\pi]$. It starts at its peak, $(0, 1)$.</li><li>$y = \\tan(x)$: period $\\pi$, range $(-\\infty, \\infty)$, vertical asymptotes at $x = -\\frac{\\pi}{2} + k\\pi$, invertible on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$.</li></ul><p>The tan interval is open because $\\tan$ is not defined at $\\pm\\frac{\\pi}{2}$. These intervals set up the inverse trig functions in Lecture 14.</p>`, ref:"pp. 1 to 2"},
    {type:"explore", title:"Periods and invertible pieces", fig:"graphs", body:`<p>Periodic means the graph repeats: $f(x + \\text{period}) = f(x)$.</p><p><b>Try it.</b> Drag the point along sin and watch the hollow dot one period ahead: always the same height. Switch to tan: the period drops to $\\pi$ and the thick piece is open at both ends, between two asymptotes.</p>`},
    {type:"read", title:"What a, b, c and d do", body:`<p>You are expected to sketch $y = a\\sin(b(x-c)) + d$, $y = a\\cos(b(x-c)) + d$ and $y = a\\tan(b(x-c)) + d$ with transformations (p. 2):</p><ul><li>$a$ scales in $y$. If $a < 0$ it also reflects over the $x$-axis.</li><li>$b$ scales in $x$. If $b < 0$ it also reflects over the $y$-axis. $b = 2$ squeezes the graph by a factor of 2.</li><li>$c$ is a horizontal translation. $x - c$ with $c>0$ moves right.</li><li>$d$ is a vertical translation.</li></ul><div class="box warn"><b class="t">Watch for this</b>The shift is only $c$ once $b$ is factored out. $\\cos(2x - \\pi) = \\cos\\left(2\\left(x - \\frac{\\pi}{2}\\right)\\right)$ is shifted right by $\\frac{\\pi}{2}$.</div>`, ref:"p. 2"},
    {type:"example", title:"Sketch in three stages", ex:{q:"Sketch the graph of $f(\\theta) = 3\\cos(2\\theta) - 1$ for $0 \\le \\theta \\le 2\\pi$.", ref:"p. 3",
      steps:[{t:"Start with $y = \\cos(2\\theta)$: a horizontal compression by a factor of 2. Value 1 at $0, \\pi, 2\\pi$; value $-1$ at $\\frac{\\pi}{2}, \\frac{3\\pi}{2}$; zeros at $\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}$.",why:"The argument $2\\theta$ reaches $2\\pi$ when $\\theta = \\pi$, so two full periods fit in $[0, 2\\pi]$."},{t:"$y = 3\\cos(2\\theta)$: a vertical stretch by a factor of 3. Now the peaks are 3 and the troughs $-3$.",why:"The coefficient 3 multiplies every $y$-value."},{t:"$y = 3\\cos(2\\theta) - 1$: translate down 1 unit. Peaks 2 at $\\theta = 0, \\pi, 2\\pi$; troughs $-4$ at $\\theta = \\frac{\\pi}{2}, \\frac{3\\pi}{2}$.",why:"The $-1$ is a vertical translation."}], ans:"A cosine wave between $-4$ and $2$ with period $\\pi$, starting at its peak $(0, 2)$."}},
    {type:"explore", title:"Move the sliders", fig:"wave", body:`<p>Every wave on the quiz is this one with different numbers. The readout shows the five features from p. 5.</p><p><b>Try it.</b> Pick the p. 3 example and check the max 2 and min $-4$. Then make $a$ negative: the wave flips, but the amplitude stays $|a|$. Set $b = -2$: the period is still $\\pi$, because of the absolute value in $\\left|\\frac{2\\pi}{b}\\right|$. Finally move $c$ and watch the whole wave slide sideways without changing any of the five numbers.</p>`},
    {type:"mcq", title:"Check yourself", q:"Compared with $y = \\sin(x)$, the graph of $y = \\sin\\left(x + \\frac{\\pi}{3}\\right) - 2$ is", opts:[["left $\\frac{\\pi}{3}$ and down 2",true,"$x + \\frac{\\pi}{3} = x - \\left(-\\frac{\\pi}{3}\\right)$, so $c = -\\frac{\\pi}{3}$: a move left. $d = -2$: down."],["right $\\frac{\\pi}{3}$ and down 2",false,"A plus sign inside means a move left."],["left $\\frac{\\pi}{3}$ and up 2",false,"$-2$ moves it down."],["right 2 and up $\\frac{\\pi}{3}$",false,"The number inside the bracket is the horizontal shift."]]},
    {type:"read", title:"Wave functions", body:`<p>sin and cos are called wave functions because their graphs look like waves. Science uses them for water waves, sound and daily rhythms (p. 4). For a wave you usually want:</p><div class="box def"><b class="t">Definitions (p. 4)</b><ul><li>Period: the distance between successive peaks.</li><li>Maximum: the highest $y$-value. Minimum: the lowest $y$-value.</li><li>Average: the middle value, half-way between the maximum and the minimum.</li><li>Amplitude: the difference between the maximum and the average.</li></ul></div><p>So max $=$ average $+$ amplitude and min $=$ average $-$ amplitude.</p>`, ref:"p. 4"},
    {type:"example", title:"Five features of one wave", ex:{q:"Determine the max, min, average, amplitude and period of $f(x) = 2\\cos(4x) - 1$.", ref:"p. 4",
      steps:[{t:"$\\cos$ normally completes its first period when its argument is $2\\pi$. So $f$ completes its first period when $4x = 2\\pi$, that is $x = \\frac{\\pi}{2}$.",why:"Set the inside equal to $2\\pi$ and solve."},{t:"The period is $\\frac{\\pi}{2}$.",why:"One full wave fits between $x = 0$ and $x = \\frac{\\pi}{2}$."},{t:"The average of $\\cos(x)$ is 0. With a translation down by 1 unit, the average is $-1$.",why:"$d = -1$."},{t:"The amplitude of $\\cos(x)$ is 1. A vertical stretch by a factor of 2 makes it 2.",why:"$|a| = 2$."},{t:"Max $=$ average $+$ amplitude $= (-1) + 2 = 1$. Min $=$ average $-$ amplitude $= (-1) - 2 = -3$.",why:"From the definitions on p. 4."}], ans:"period $\\frac{\\pi}{2}$, average $-1$, amplitude 2, max 1, min $-3$"}},
    {type:"read", title:"The formulas", body:`<p>The last example gives formulas (p. 5). For $y = a\\cos(bx) + d$ or $y = a\\sin(bx) + d$:</p>$$\\text{period} = \\left|\\frac{2\\pi}{b}\\right|,\\quad \\text{amplitude} = |a|,\\quad \\text{average} = d,\\quad \\text{max} = d + |a|,\\quad \\text{min} = d - |a|$$<p>A horizontal shift $c$ slides the wave sideways, so it changes none of these.</p><div class="box warn"><b class="t">Watch for this</b>When $b$ has $\\pi$ in it, divide carefully. For $\\sin\\left(\\frac{\\pi}{3}x\\right)$, period $= 2\\pi \\cdot \\frac{3}{\\pi} = 6$. For $\\sin\\left(\\frac{x}{\\pi}\\right)$, $b = \\frac{1}{\\pi}$ and the period is $2\\pi\\cdot\\pi = 2\\pi^2$.</div>`, ref:"p. 5"},
    {type:"try", title:"Your turn: the five features", gen:"L13.g.features", diff:2},
    {type:"mcq", title:"A sign trap", q:"For $f(x) = -2\\cos\\left(\\frac{x}{\\pi}\\right) + 1$, which is right?", opts:[["max 3, amplitude 2, period $2\\pi^2$",true,"$d + |a| = 1 + 2$; $|a| = 2$; $\\frac{2\\pi}{1/\\pi} = 2\\pi^2$."],["max $-1$, amplitude $-2$, period $2\\pi^2$",false,"Amplitude is $|a|$, so the max is $1 + 2 = 3$."],["max 3, amplitude 2, period 2",false,"$\\frac{2\\pi}{1/\\pi}$ is $2\\pi\\cdot\\pi$, not 2."],["max 1, amplitude 2, period $\\frac{2}{\\pi^2}$",false,"1 is the average, and the period is $\\left|\\frac{2\\pi}{b}\\right|$."]]},
    {type:"example", title:"A model for body temperature", ex:{q:"Body temperature is a sine wave with a period of about 24 hours. The average is 37.0°C, it swings about 1.0°C between max and min, the max is at 4 pm and the min at 4 am. Write a sine function for body temperature.", ref:"pp. 5 to 6",
      steps:[{t:"Write it as $T(t) = a\\sin(b(t-c)) + d$ with $t$ in hours.",why:"Same as before, plus a horizontal shift."},{t:"The average is $d = 37$. The max-to-min difference is 1.0°C, so $a = \\frac{1}{2}$. So max $= 37.5$ and min $= 36.5$.",why:"Amplitude is half the swing from max to min."},{t:"$\\text{period} = \\left|\\frac{2\\pi}{b}\\right|$: $24 = \\frac{2\\pi}{b}$, so $b = \\frac{\\pi}{12}$.",why:"Solve for $b$."},{t:"The plain graph of $\\sin\\left(\\frac{\\pi}{12}t\\right)$ has a minimum at $t = -6$. Move it to $t = 4$ (4 am): a translation right by 10, so $c = 10$.",why:"$x - c$ with $c > 0$ moves the graph right."},{t:"$T(t) = \\frac{1}{2}\\sin\\left(\\frac{\\pi}{12}(t-10)\\right) + 37$ in degrees Celsius.",why:"Put the four numbers in."},{t:"Check: $T(16) = \\frac{1}{2}\\sin\\left(\\frac{\\pi}{12}\\cdot 6\\right) + 37 = \\frac{1}{2}\\sin\\left(\\frac{\\pi}{2}\\right) + 37 = 37.5$, the max at 4 pm.",why:"The notes advise checking with a value of $t$."}], ans:"$T(t) = \\frac{1}{2}\\sin\\left(\\frac{\\pi}{12}(t-10)\\right) + 37$ °C"}},
    {type:"explore", title:"Fit the model yourself", fig:"model", body:`<p>Two points fix a sine model: a maximum and the next minimum. From them you get the average, the amplitude, half the period and the shift.</p><p><b>Try it.</b> Leave the points at 4 am and 4 pm and check that you get the notes' answer, $c = 10$. Then drag the maximum to 6 pm: the period becomes 28 hours. Switch to the cosine model: $c$ is just the time of the maximum, the way the course notes do Exercise 2.5.16.</p>`},
    {type:"try", title:"Your turn: build a model", gen:"L13.g.build", diff:2},
    {type:"try", title:"Your turn: use a model", gen:"L13.g.eval", diff:2},
    {type:"formulas", title:"Lecture 13 formulas"}
  ]
});
})();
