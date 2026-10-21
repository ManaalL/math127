/* Lecture 15 (Mon Oct 19): Calculus of trig functions. Section 2.5.4. Notes: 3 pages. */
(function(){
"use strict";
const P=Math.PI;
const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; };
const cT=c=>c===1?"":c===-1?"-":String(c);            // coefficient in front of a function
const sgn=(c,first)=>first?(c<0?"-":""):(c<0?"- ":"+ ");           // sign between terms
const ab=c=>Math.abs(c)===1?"":String(Math.abs(c));
/* derivative of each trig function: sign and body, in TeX and ascii */
const TD={
  sin:{s:1, t:u=>`\\cos(${u})`, a:u=>`cos(${u})`},
  cos:{s:-1, t:u=>`\\sin(${u})`, a:u=>`sin(${u})`},
  tan:{s:1, t:u=>`\\sec^2(${u})`, a:u=>`sec(${u})^2`},
  sec:{s:1, t:u=>`\\sec(${u})\\tan(${u})`, a:u=>`sec(${u})*tan(${u})`},
  csc:{s:-1, t:u=>`\\csc(${u})\\cot(${u})`, a:u=>`csc(${u})*cot(${u})`},
  cot:{s:-1, t:u=>`\\csc^2(${u})`, a:u=>`csc(${u})^2`}
};
const TX={sin:"\\sin",cos:"\\cos",tan:"\\tan",sec:"\\sec",csc:"\\csc",cot:"\\cot"};
/* derivative of arcsin, arccos, arctan at u */
const sqU=(u)=>/^[a-z]$/.test(u)?`${u}^2`:`(${u})^2`;
const cdot=c=>c===1?"":c===-1?"-":`${c}\\cdot`;
const AD={
  arcsin:{s:1, t:u=>`\\frac{1}{\\sqrt{1-${sqU(u)}}}`, a:u=>`1/sqrt(1-(${u})^2)`, den:u=>`\\sqrt{1-${sqU(u)}}`},
  arccos:{s:-1, t:u=>`\\frac{1}{\\sqrt{1-${sqU(u)}}}`, a:u=>`1/sqrt(1-(${u})^2)`, den:u=>`\\sqrt{1-${sqU(u)}}`},
  arctan:{s:1, t:u=>`\\frac{1}{1+${sqU(u)}}`, a:u=>`1/(1+(${u})^2)`, den:u=>`1+${sqU(u)}`}
};
const ATX={arcsin:"\\arcsin",arccos:"\\arccos",arctan:"\\arctan"};
const signed=(s,t)=>s<0?`-${t}`:t;
/* exact numbers used in definite integrals and IVPs: {t: TeX, a: ascii, v: value} */
const N=(t,a,v)=>({t,a,v});
const pi=(n,d)=>{ const g=gcd(n,d); n/=g; d/=g; const s=n<0?"-":"", m=Math.abs(n); return N(d===1?`${s}${m===1?"":m}\\pi`:`${s}\\frac{${m===1?"":m}\\pi}{${d}}`, `${n}*pi/${d}`, n*P/d); };
/* Simpson's rule, used only to check answers independently */
function simpson(f,a,b,n=2000){ const h=(b-a)/n; let s=f(a)+f(b); for(let i=1;i<n;i++) s+=(i%2?4:2)*f(a+i*h); return s*h/3; }

M127.lecture({
  id:"L15", n:15, date:"2026-10-19", added:"2026-10-21", unit:"u5", quiz:"MT",
  title:"Calculus of Trig Functions", sections:["2.5.4"], pages:3,
  summary:"The derivative and antiderivative tables for all six trig functions and for arcsin, arccos and arctan, why some antiderivatives have $\\ln(|\\,\\cdot\\,|)$, and how to use the tables with the chain rule, definite integrals and initial value problems.",
  flags:[
    {ref:"course notes Exercise 2.5.30(b)", text:"The official solution gives $\\frac{d}{dx}\\arcsin(x^2+1) = \\frac{2x}{\\sqrt{1-x^4}}$. That is the derivative of $\\arcsin(x^2)$. The chain rule gives $\\frac{2x}{\\sqrt{1-(x^2+1)^2}}$. (Also, $\\arcsin(x^2+1)$ only exists at $x = 0$.)"},
    {ref:"course notes Section 2.5 Problem 21(c)", text:"The problem says $y(1) = 1$, but the official solution substitutes $y(0) = 1$. With $y(1) = 1$ the answer is $y = 3\\arccos(x) + 1$."}
  ],
  formulas:[
    {id:"L15.f.d-sin", name:"Derivative of sin", tex:"\\frac{d}{dx}\\sin(x) = \\cos(x)", ref:"p. 1", blank:{tex:"\\frac{d}{dx}\\sin(x) = \\boxed{\\,?\\,}", answer:"cos(x)", vars:["x"]}},
    {id:"L15.f.d-cos", name:"Derivative of cos", tex:"\\frac{d}{dx}\\cos(x) = -\\sin(x)", ref:"p. 1", blank:{tex:"\\frac{d}{dx}\\cos(x) = \\boxed{\\,?\\,}", answer:"-sin(x)", vars:["x"]}},
    {id:"L15.f.d-tan", name:"Derivative of tan", tex:"\\frac{d}{dx}\\tan(x) = \\sec^2(x)", ref:"p. 1", blank:{tex:"\\frac{d}{dx}\\tan(x) = \\boxed{\\,?\\,}", answer:"sec(x)^2", vars:["x"], domain:[-1.2,1.2]}},
    {id:"L15.f.d-sec", name:"Derivative of sec", tex:"\\frac{d}{dx}\\sec(x) = \\sec(x)\\tan(x)", ref:"p. 1", blank:{tex:"\\frac{d}{dx}\\sec(x) = \\boxed{\\,?\\,}", answer:"sec(x)*tan(x)", vars:["x"], domain:[-1.2,1.2]}},
    {id:"L15.f.d-csc", name:"Derivative of csc", tex:"\\frac{d}{dx}\\csc(x) = -\\csc(x)\\cot(x)", ref:"p. 1", blank:{tex:"\\frac{d}{dx}\\csc(x) = \\boxed{\\,?\\,}", answer:"-csc(x)*cot(x)", vars:["x"], domain:[0.3,2.8]}},
    {id:"L15.f.d-cot", name:"Derivative of cot", tex:"\\frac{d}{dx}\\cot(x) = -\\csc^2(x)", ref:"p. 1", blank:{tex:"\\frac{d}{dx}\\cot(x) = \\boxed{\\,?\\,}", answer:"-csc(x)^2", vars:["x"], domain:[0.3,2.8]}},
    {id:"L15.f.d-abs", name:"Derivative of an absolute value", tex:"\\frac{d}{dx}|u| = \\frac{u}{|u|}\\,u'", note:"Used with the chain rule on p. 1: $\\frac{d}{dx}\\ln(|u|) = \\frac{1}{|u|}\\cdot\\frac{u}{|u|}\\cdot u'$.", ref:"p. 1", blank:{tex:"\\frac{d}{dx}|u| = \\boxed{\\,?\\,}\\,u'", text:true, accept:["u/|u|","u/abs(u)","\\frac{u}{|u|}"]}},
    {id:"L15.f.i-sin", name:"Integral of sin", tex:"\\int \\sin(x)\\,dx = -\\cos(x) + C", ref:"p. 2", blank:{tex:"\\int \\sin(x)\\,dx = \\boxed{\\,?\\,} + C", answer:"-cos(x)", vars:["x"]}},
    {id:"L15.f.i-cos", name:"Integral of cos", tex:"\\int \\cos(x)\\,dx = \\sin(x) + C", ref:"p. 2", blank:{tex:"\\int \\cos(x)\\,dx = \\boxed{\\,?\\,} + C", answer:"sin(x)", vars:["x"]}},
    {id:"L15.f.i-tan", name:"Integral of tan", tex:"\\int \\tan(x)\\,dx = \\ln(|\\sec(x)|) + C", ref:"p. 2", blank:{tex:"\\int \\tan(x)\\,dx = \\boxed{\\,?\\,} + C", answer:"ln(abs(sec(x)))", vars:["x"], domain:[1.7,3]}},
    {id:"L15.f.i-sec", name:"Integral of sec", tex:"\\int \\sec(x)\\,dx = \\ln(|\\sec(x)+\\tan(x)|) + C", ref:"p. 2", blank:{tex:"\\int \\sec(x)\\,dx = \\boxed{\\,?\\,} + C", answer:"ln(abs(sec(x)+tan(x)))", vars:["x"], domain:[1.7,3]}},
    {id:"L15.f.i-sec2", name:"Integral of sec squared", tex:"\\int \\sec^2(x)\\,dx = \\tan(x) + C", ref:"p. 2", blank:{tex:"\\int \\sec^2(x)\\,dx = \\boxed{\\,?\\,} + C", answer:"tan(x)", vars:["x"], domain:[-1.2,1.2]}},
    {id:"L15.f.i-sectan", name:"Integral of sec times tan", tex:"\\int \\sec(x)\\tan(x)\\,dx = \\sec(x) + C", ref:"p. 2", blank:{tex:"\\int \\sec(x)\\tan(x)\\,dx = \\boxed{\\,?\\,} + C", answer:"sec(x)", vars:["x"], domain:[-1.2,1.2]}},
    {id:"L15.f.i-csc", name:"Integral of csc", tex:"\\int \\csc(x)\\,dx = -\\ln(|\\csc(x)+\\cot(x)|) + C", ref:"p. 2", blank:{tex:"\\int \\csc(x)\\,dx = \\boxed{\\,?\\,} + C", answer:"-ln(abs(csc(x)+cot(x)))", vars:["x"], domain:[3.4,6]}},
    {id:"L15.f.i-csc2", name:"Integral of csc squared", tex:"\\int \\csc^2(x)\\,dx = -\\cot(x) + C", ref:"p. 2", blank:{tex:"\\int \\csc^2(x)\\,dx = \\boxed{\\,?\\,} + C", answer:"-cot(x)", vars:["x"], domain:[0.3,2.8]}},
    {id:"L15.f.i-csccot", name:"Integral of csc times cot", tex:"\\int \\csc(x)\\cot(x)\\,dx = -\\csc(x) + C", ref:"p. 2", blank:{tex:"\\int \\csc(x)\\cot(x)\\,dx = \\boxed{\\,?\\,} + C", answer:"-csc(x)", vars:["x"], domain:[0.3,2.8]}},
    {id:"L15.f.d-arcsin", name:"Derivative of arcsin", tex:"\\frac{d}{dx}\\arcsin(x) = \\frac{1}{\\sqrt{1-x^2}}", ref:"p. 2", blank:{tex:"\\frac{d}{dx}\\arcsin(x) = \\boxed{\\,?\\,}", answer:"1/sqrt(1-x^2)", vars:["x"], domain:[-0.9,0.9]}},
    {id:"L15.f.d-arccos", name:"Derivative of arccos", tex:"\\frac{d}{dx}\\arccos(x) = -\\frac{1}{\\sqrt{1-x^2}}", ref:"p. 2", blank:{tex:"\\frac{d}{dx}\\arccos(x) = \\boxed{\\,?\\,}", answer:"-1/sqrt(1-x^2)", vars:["x"], domain:[-0.9,0.9]}},
    {id:"L15.f.d-arctan", name:"Derivative of arctan", tex:"\\frac{d}{dx}\\arctan(x) = \\frac{1}{1+x^2}", ref:"p. 2", blank:{tex:"\\frac{d}{dx}\\arctan(x) = \\boxed{\\,?\\,}", answer:"1/(1+x^2)", vars:["x"]}},
    {id:"L15.f.i-arcsin", name:"Integral giving arcsin", tex:"\\int \\frac{1}{\\sqrt{1-x^2}}\\,dx = \\arcsin(x) + C", ref:"p. 3", blank:{tex:"\\int \\frac{1}{\\sqrt{1-x^2}}\\,dx = \\boxed{\\,?\\,} + C", answer:"arcsin(x)", vars:["x"], domain:[-0.9,0.9]}},
    {id:"L15.f.i-arccos", name:"Integral giving arccos", tex:"\\int \\frac{-1}{\\sqrt{1-x^2}}\\,dx = \\arccos(x) + C", ref:"p. 3", blank:{tex:"\\int \\frac{-1}{\\sqrt{1-x^2}}\\,dx = \\boxed{\\,?\\,} + C", answer:"arccos(x)", vars:["x"], domain:[-0.9,0.9]}},
    {id:"L15.f.i-arctan", name:"Integral giving arctan", tex:"\\int \\frac{1}{1+x^2}\\,dx = \\arctan(x) + C", ref:"p. 3", blank:{tex:"\\int \\frac{1}{1+x^2}\\,dx = \\boxed{\\,?\\,} + C", answer:"arctan(x)", vars:["x"]}}
  ],
  glossary:[
    {id:"L15.t.dtable", term:"Trig derivative table", def:"The six derivatives on p. 1. The three co-functions (cos, csc, cot) get a minus sign: $\\frac{d}{dx}\\cos(x) = -\\sin(x)$, $\\frac{d}{dx}\\csc(x) = -\\csc(x)\\cot(x)$, $\\frac{d}{dx}\\cot(x) = -\\csc^2(x)$.", ref:"p. 1"},
    {id:"L15.t.absd", term:"Derivative of $|u|$", def:"$\\frac{d}{dx}|u| = \\frac{u}{|u|}\\,u'$. The fraction $\\frac{u}{|u|}$ is 1 when $u > 0$ and $-1$ when $u < 0$.", ref:"p. 1"},
    {id:"L15.t.lnabs", term:"$\\ln(|\\,\\cdot\\,|)$ antiderivative", def:"The integrals of tan, sec and csc are logs of absolute values. ln only accepts positive inputs, and $\\sec(x)$ or $\\csc(x)$ can be negative, so the bars must stay. The same idea as $\\int \\frac{1}{x}\\,dx = \\ln(|x|) + C$.", ref:"p. 2"},
    {id:"L15.t.plusc", term:"$+ C$", def:"Every indefinite integral ends in $+ C$, because adding a constant does not change the derivative. A definite integral is a number, so it has no $+ C$.", ref:"p. 2"},
    {id:"L15.t.ivp", term:"Initial value problem", def:"A differential equation plus one known point, like $y' = \\sec(x)\\tan(x)$, $y\\left(\\frac{\\pi}{4}\\right) = 2$. Integrate to get every solution, then use the point to find $C$.", ref:"p. 2"},
    {id:"L15.t.intfn", term:"Integral function", def:"A function like $g(x) = \\int_3^x \\cot(t)\\,dt$. By the Fundamental Theorem of Calculus, $g'(x) = \\cot(x)$.", ref:"p. 2"},
    {id:"L15.t.invd", term:"Inverse trig derivatives", def:"$\\frac{d}{dx}\\arcsin(x) = \\frac{1}{\\sqrt{1-x^2}}$, $\\frac{d}{dx}\\arccos(x) = -\\frac{1}{\\sqrt{1-x^2}}$, $\\frac{d}{dx}\\arctan(x) = \\frac{1}{1+x^2}$. Read backwards, they give three new integrals.", ref:"pp. 2 to 3"}
  ],
  figures:{
    slope:{title:"Slope of f and the graph of f′", cap:"<b>Fig. 15.1</b> Top: $f$ with its tangent line at the point you drag. Bottom: $f'$ from the table. The height of the dot on the bottom graph is the slope of the tangent line on top. (Lecture 15, pp. 1 to 2)",
      build(host,{PLOT}){
        const sec=x=>1/Math.cos(x);
        const D={
          tan:{f:Math.tan,d:x=>sec(x)**2,x:[-1.5,1.5],y:[-4.5,4.5],dy:[-1,10.5],b:1.25,xs:0.5,ft:"f(x) = tan(x)",dt:"f′(x) = sec²(x)",start:0.6},
          sec:{f:sec,d:x=>sec(x)*Math.tan(x),x:[-1.5,1.5],y:[-0.6,4.2],dy:[-8,8],b:1.15,xs:0.5,ft:"f(x) = sec(x)",dt:"f′(x) = sec(x)tan(x)",start:0.6},
          arcsin:{f:Math.asin,d:x=>1/Math.sqrt(1-x*x),x:[-1.15,1.15],y:[-1.9,1.9],dy:[-0.3,4],b:0.95,xs:0.5,ft:"f(x) = arcsin(x)",dt:"f′(x) = 1/√(1 − x²)",start:0.5},
          arccos:{f:Math.acos,d:x=>-1/Math.sqrt(1-x*x),x:[-1.15,1.15],y:[-0.3,3.5],dy:[-4,0.3],b:0.95,xs:0.5,ft:"f(x) = arccos(x)",dt:"f′(x) = −1/√(1 − x²)",start:0.5},
          arctan:{f:Math.atan,d:x=>1/(1+x*x),x:[-4.2,4.2],y:[-1.9,1.9],dy:[-0.15,1.2],b:4,xs:1,ft:"f(x) = arctan(x)",dt:"f′(x) = 1/(1 + x²)",start:1}
        };
        let key="tan";
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Function",items:[["tan","tan"],["sec","sec"],["arcsin","arcsin"],["arccos","arccos"],["arctan","arctan"]],value:key,onchange:v=>{ key=v; draw(); }});
        const box=document.createElement("div"); host.append(box);
        const ro=PLOT.readout(host);
        function draw(){
          box.innerHTML=""; const S=D[key];
          const G=PLOT.graph(box,{x:S.x,y:S.y,h:250,c:"var(--u5)",xstep:S.xs,samples:500});
          const lim=key.startsWith("arc")&&key!=="arctan"?{from:-1,to:1}:{};
          G.fn(S.f,{cls:"cv",...lim});
          G.label(S.x[0],S.y[1],S.ft,{cls:"lbl",dx:8,dy:16});
          const H=PLOT.graph(box,{x:S.x,y:S.dy,h:190,c:"var(--u5)",xstep:S.xs,samples:500});
          H.fn(S.d,{cls:"cv c",...(lim.from!=null?{from:-0.999,to:0.999}:{})});
          H.label(S.x[0],S.dy[1],S.dt,{cls:"lblc",dx:8,dy:16});
          const tan=G.line(0,0,0,0,{cls:"tan",layer:G.layer.front});
          const seg=(a,y,m)=>{ const w=Math.min((S.x[1]-S.x[0])*0.22,(S.y[1]-S.y[0])*0.32/Math.max(Math.abs(m),1e-9)); tan.set(a-w,y-m*w,a+w,y+m*w); };
          const dot=H.dot(S.start,S.d(S.start),{filled:true});
          const upd=a=>{ const h=1e-5, num=(S.f(a+h)-S.f(a-h))/(2*h), m=S.d(a); seg(a,S.f(a),m); dot.set(a,Math.max(S.dy[0],Math.min(S.dy[1],m)));
            ro.innerHTML=`x = <b>${a.toFixed(2)}</b>. Slope of the tangent line (measured) ≈ <b>${num.toFixed(3)}</b>. From the table, ${S.dt.replace("f′(x)","f′("+a.toFixed(2)+")")} = <b>${m.toFixed(3)}</b>.`; };
          G.handle(S.start,S.f(S.start),{f:S.f,bounds:[-S.b,S.b],step:0.05,label:"Point on f",onMove:upd});
          upd(S.start);
        }
        draw();
      }},
    abs:{title:"Why ln needs absolute value bars", cap:"<b>Fig. 15.2</b> $y = \\ln(|\\sec(x)|)$, an antiderivative of $\\tan(x)$. On the shaded intervals $\\sec(x) < 0$, so $\\ln(\\sec(x))$ does not exist there. $\\ln(|\\sec(x)|)$ does, and its slope is still $\\tan(x)$. (Lecture 15, p. 2)",
      build(host,{PLOT}){
        const F=x=>Math.log(Math.abs(1/Math.cos(x)));
        const G=PLOT.graph(host,{x:[-4.9,4.9],y:[-0.6,3.2],h:300,piX:true,ystep:1,c:"var(--u5)",samples:900});
        G.between(()=>3.2,()=>-0.6,P/2,3*P/2); G.between(()=>3.2,()=>-0.6,-3*P/2,-P/2);
        [-3*P/2,-P/2,P/2,3*P/2].forEach(x=>G.vline(x));
        G.label(P,2.9,"sec(x) < 0",{cls:"lblc",anchor:"middle"}); G.label(-P,2.9,"sec(x) < 0",{cls:"lblc",anchor:"middle"});
        G.fn(F,{cls:"cv c"});
        const ro=PLOT.readout(host);
        const tan=G.line(0,0,0,0,{cls:"tan",layer:G.layer.front});
        const seg=(a,y,m)=>{ const w=Math.min(1.6,1.2/Math.max(Math.abs(m),1e-9)); tan.set(a-w,y-m*w,a+w,y+m*w); };
        const Fc=x=>Math.min(3.1,F(x));
        const upd=a=>{ const c=Math.cos(a), s=1/c, near=Math.abs(c)<0.05;
          tan.style.display=near?"none":""; if(!near) seg(a,F(a),Math.tan(a));
          ro.innerHTML=near?`x = <b>${a.toFixed(2)}</b> is next to a vertical asymptote, where sec(x) blows up. Move away a little.`
            :`x = <b>${a.toFixed(2)}</b>. sec(x) = <b>${s.toFixed(3)}</b>${s<0?", which is negative, so ln(sec(x)) does not exist here":""}. ln(|sec(x)|) = <b>${F(a).toFixed(3)}</b>. Slope of the tangent = tan(x) = <b>${Math.tan(a).toFixed(3)}</b>.`; };
        G.handle(2.5,Fc(2.5),{f:Fc,bounds:[-4.7,4.7],step:0.05,label:"Point on the curve",onMove:upd});
        upd(2.5);
      }},
    area:{title:"Definite integrals that give arcsin and arctan", cap:"<b>Fig. 15.3</b> The shaded area is the definite integral from 0 to $b$. By the table it is $\\arcsin(b) - \\arcsin(0)$ or $\\arctan(b) - \\arctan(0)$. The readout compares this with a sum of 400 thin rectangles. (Lecture 15, p. 3)",
      build(host,{PLOT}){
        const D={
          asin:{f:t=>1/Math.sqrt(1-t*t),F:Math.asin,x:[-0.12,1.05],y:[-0.25,3.6],max:0.95,b:0.5,xs:0.25,nm:"arcsin",lab:"y = 1/√(1 − t²)",v:"t"},
          atan:{f:x=>1/(1+x*x),F:Math.atan,x:[-0.3,3.3],y:[-0.12,1.2],max:3,b:2,xs:0.5,nm:"arctan",lab:"y = 1/(1 + x²)",v:"x"}
        };
        let key="asin";
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Integrand",items:[["asin","1/√(1 − t²)"],["atan","1/(1 + x²)"]],value:key,onchange:v=>{ key=v; draw(); }});
        const sbox=document.createElement("div"); ctl.append(sbox);
        const box=document.createElement("div"); host.append(box);
        const ro=PLOT.readout(host);
        const special={asin:{0.5:"π/6"},atan:{1:"π/4"}};
        function draw(){
          box.innerHTML=""; sbox.innerHTML=""; const S=D[key]; let b=S.b;
          const G=PLOT.graph(box,{x:S.x,y:S.y,h:280,c:"var(--u5)",xstep:S.xs,xlabel:S.v});
          const sh=G.area(S.f,0,b);
          G.fn(S.f,{cls:"cv c",from:key==="asin"?-0.1:S.x[0],to:key==="asin"?0.985:S.x[1]});
          G.label(S.x[1],S.y[1],S.lab,{cls:"lblc",anchor:"end",dx:-6,dy:16});
          const vl=G.line(b,0,b,S.f(b),{cls:"lt dash"});
          const upd=()=>{ sh.update(S.f,0,b); vl.set(b,0,b,S.f(b)); const n=400, h=b/n; let sum=0; for(let i=0;i<n;i++) sum+=S.f((i+0.5)*h)*h;
            const sp=special[key][+b.toFixed(2)];
            ro.innerHTML=`Integral from 0 to <b>${b.toFixed(2)}</b> = ${S.nm}(${b.toFixed(2)}) − ${S.nm}(0) = <b>${S.F(b).toFixed(4)}</b>${sp?` = ${sp}`:""}.<br>Sum of 400 thin rectangles ≈ <b>${sum.toFixed(4)}</b>.`; };
          PLOT.slider(sbox,{label:"Upper limit b",min:0,max:S.max,step:0.01,value:b,fmt:v=>v.toFixed(2),oninput:v=>{ b=v; upd(); }});
          upd();
        }
        draw();
      }}
  },
  gens:[
    {id:"L15.g.trigderiv", title:"Derivatives of trig functions", skill:"Use the trig derivative table with the chain, product and quotient rules", ref:"p. 1",
      gen(R,d){
        if(d===1){ const F=R.pick(["tan","sec","csc","cot"]), T=TD[F], c=R.nz(-5,5), k=R.int(1,4);
          const u=k===1?"x":`${k}x`, ua=`(${k}*x)`, K=c*k*T.s;
          const dom=(F==="tan"||F==="sec")?[-1.2/k,1.2/k]:[0.25/k,2.85/k];
          return {prompt:`Find $f'(x)$ for $f(x) = ${cT(c)}${TX[F]}(${u})$.`, answer:{answer:`${K}*${T.a(ua)}`,vars:["x"],domain:dom}, verify:{deriv:`${c}*${F}(${k}*x)`},
            hint:`Use the table on p. 1 and the chain rule: the inside is $u = ${u}$.`,
            steps:[`From the table, $\\frac{d}{du}${TX[F]}(u) = ${signed(T.s,T.t("u"))}$.`,k===1?`Here $u = x$, so no extra chain factor.`:`Chain rule with $u = ${u}$, so $u' = ${k}$.`,`$f'(x) = ${cdot(c)}\\left(${signed(T.s,T.t(u))}\\right)${k===1?"":`\\cdot ${k}`} = ${cT(K)}${T.t(u)}$.`],
            answerTeX:`$f'(x) = ${cT(K)}${T.t(u)}$`};
        }
        if(d===2){ const F=R.pick(["tan","sec","csc","cot"]), T=TD[F];
          if(R.int(0,1)===0){ // chain
            const IN=(F==="tan"||F==="sec")?[["x^2","x^2","2x","2*x",[-1,1]],["e^x","e^x","e^x","e^x",[-2,0.3]],["\\sqrt{x}","sqrt(x)","\\frac{1}{2\\sqrt{x}}","1/(2*sqrt(x))",[0.1,1.4]]]
              :[["x^2+1","x^2+1","2x","2*x",[0,1.2]],["e^x","e^x","e^x","e^x",[-2,1]],["\\sqrt{x}","sqrt(x)","\\frac{1}{2\\sqrt{x}}","1/(2*sqrt(x))",[0.1,8]]];
            const [it,ia,dt,da,dom]=R.pick(IN);
            return {prompt:`Find $f'(x)$ for $f(x) = ${TX[F]}(${it})$.`, answer:{answer:`${T.s}*${T.a("("+ia+")")}*${da}`,vars:["x"],domain:dom}, verify:{deriv:`${F}(${ia})`},
              hint:"Chain rule: differentiate the outside trig function with the table, keep the inside, then multiply by the derivative of the inside.",
              steps:[`Let $u = ${it}$, so $u' = ${dt}$.`,`From the table, $\\frac{d}{du}${TX[F]}(u) = ${signed(T.s,T.t("u"))}$.`,`Chain rule: $f'(x) = ${signed(T.s,T.t(it))}\\cdot ${dt.startsWith("\\frac")?dt:`(${dt})`}$.`],
              answerTeX:`$f'(x) = ${signed(T.s,T.t(it))}\\cdot ${dt.startsWith("\\frac")?dt:`(${dt})`}$`};
          }
          const n=R.int(2,3), dom=(F==="tan"||F==="sec")?[-1.2,1.2]:[0.3,2.8];
          const d1=`${n}x${n-1===1?"":`^{${n-1}}`}`;
          return {prompt:`Find $f'(x)$ for $f(x) = x^{${n}}${TX[F]}(x)$.`, answer:{answer:`${n}*x^${n-1}*${F}(x) + x^${n}*${T.s}*${T.a("x")}`,vars:["x"],domain:dom}, verify:{deriv:`x^${n}*${F}(x)`},
            hint:"Product rule: $(fg)' = f'g + fg'$, with the trig derivative from the table.",
            steps:[`Product rule with $x^{${n}}$ and $${TX[F]}(x)$.`,`$\\frac{d}{dx}x^{${n}} = ${d1}$ and $\\frac{d}{dx}${TX[F]}(x) = ${signed(T.s,T.t("x"))}$.`,`$f'(x) = ${d1}${TX[F]}(x) ${T.s<0?"-":"+"} x^{${n}}${T.t("x")}$.`],
            answerTeX:`$f'(x) = ${d1}${TX[F]}(x) ${T.s<0?"-":"+"} x^{${n}}${T.t("x")}$`};
        }
        const kind=R.pick(["secln","tanexp","expcot","cscroot"]);
        if(kind==="secln"){ const k=R.int(1,2), u=k===1?"x":`${k}x`;
          return {prompt:`Find $f'(x)$ for $f(x) = \\sec(${u})\\ln(x)$.`, answer:{answer:`${k}*sec(${k}*x)*tan(${k}*x)*ln(x) + sec(${k}*x)/x`,vars:["x"],domain:[0.2,1.2/k]}, verify:{deriv:`sec(${k}*x)*ln(x)`},
            hint:"Product rule, and the chain rule on $\\sec("+u+")$.",
            steps:[`Product rule with $\\sec(${u})$ and $\\ln(x)$.`,`$\\frac{d}{dx}\\sec(${u}) = \\sec(${u})\\tan(${u})${k===1?"":"\\cdot 2"}$ and $\\frac{d}{dx}\\ln(x) = \\frac{1}{x}$.`,`$f'(x) = ${k===1?"":"2"}\\sec(${u})\\tan(${u})\\ln(x) + \\frac{\\sec(${u})}{x}$.`],
            answerTeX:`$f'(x) = ${k===1?"":"2"}\\sec(${u})\\tan(${u})\\ln(x) + \\frac{\\sec(${u})}{x}$`};
        }
        if(kind==="tanexp"){
          return {prompt:"Find $f'(x)$ for $f(x) = \\frac{\\tan(e^x)}{x}$.", answer:{answer:"(x*sec(e^x)^2*e^x - tan(e^x))/x^2",vars:["x"],domain:[-2,-0.2]}, verify:{deriv:"tan(e^x)/x"},
            hint:"Quotient rule, with the chain rule for $\\tan(e^x)$.",
            steps:["Top: $\\tan(e^x)$, with derivative $\\sec^2(e^x)\\cdot e^x$ by the chain rule. Bottom: $x$, with derivative 1.","Quotient rule: $f'(x) = \\frac{\\sec^2(e^x)e^x\\cdot x - \\tan(e^x)\\cdot 1}{x^2}$."],
            answerTeX:"$f'(x) = \\frac{x e^x\\sec^2(e^x) - \\tan(e^x)}{x^2}$"};
        }
        if(kind==="expcot"){ const k=R.pick([2,3,-1,-2]), e=`e^{${k===1?"":k===-1?"-":k}x}`, ea=`e^(${k}*x)`;
          return {prompt:`Find $f'(x)$ for $f(x) = ${e}\\cot(x)$.`, answer:{answer:`${k}*${ea}*cot(x) - ${ea}*csc(x)^2`,vars:["x"],domain:[0.3,2.8]}, verify:{deriv:`${ea}*cot(x)`},
            hint:"Product rule. $\\frac{d}{dx}\\cot(x) = -\\csc^2(x)$.",
            steps:[`$\\frac{d}{dx}${e} = ${k}${e}$ (chain rule) and $\\frac{d}{dx}\\cot(x) = -\\csc^2(x)$.`,`Product rule: $f'(x) = ${k}${e}\\cot(x) + ${e}\\left(-\\csc^2(x)\\right)$.`],
            answerTeX:`$f'(x) = ${k}${e}\\cot(x) - ${e}\\csc^2(x)$`};
        }
        const k=R.int(1,2), u=k===1?"x":`${k}x`;
        return {prompt:`Find $f'(x)$ for $f(x) = \\frac{\\csc(${u})}{\\sqrt{x}}$.`, answer:{answer:`(-${k}*csc(${k}*x)*cot(${k}*x)*sqrt(x) - csc(${k}*x)/(2*sqrt(x)))/x`,vars:["x"],domain:[0.2,2.8/k]}, verify:{deriv:`csc(${k}*x)/sqrt(x)`},
          hint:"Quotient rule (or write it as $\\csc("+u+")x^{-1/2}$ and use the product rule).",
          steps:[`Top: $\\csc(${u})$, derivative $${k===1?"":`-${k}`}${k===1?"-":""}\\csc(${u})\\cot(${u})$. Bottom: $\\sqrt{x}$, derivative $\\frac{1}{2\\sqrt{x}}$.`,`Quotient rule: $f'(x) = \\frac{${k===1?"-":`-${k}`}\\csc(${u})\\cot(${u})\\sqrt{x} - \\csc(${u})\\cdot\\frac{1}{2\\sqrt{x}}}{x}$.`],
          answerTeX:`$f'(x) = \\frac{${k===1?"-":`-${k}`}\\csc(${u})\\cot(${u})\\sqrt{x} - \\frac{\\csc(${u})}{2\\sqrt{x}}}{x}$`};
      }},
    {id:"L15.g.invderiv", title:"Derivatives of inverse trig functions", skill:"Differentiate arcsin, arccos and arctan with the chain and product rules", ref:"p. 2",
      gen(R,d){
        const fn=R.pick(["arcsin","arccos","arctan"]), A=AD[fn], X=ATX[fn];
        if(d===1){ const k=R.int(2,5), c=R.pick([1,2,3,-1,-2]), K=c*k*A.s, u=`${k}x`;
          const dom=fn==="arctan"?[-2,2]:[-0.9/k,0.9/k];
          const top=Math.abs(K), tt=fn==="arctan"?`\\frac{${top}}{1+(${u})^2}`:`\\frac{${top}}{\\sqrt{1-(${u})^2}}`;
          return {prompt:`Find $f'(x)$ for $f(x) = ${cT(c)}${X}(${u})$.`, answer:{answer:`${K}*${A.a(`${k}*x`)}`,vars:["x"],domain:dom}, verify:{deriv:`${c}*${fn}(${k}*x)`},
            hint:`Use $\\frac{d}{dx}${X}(x) = ${signed(A.s,A.t("x"))}$ from p. 2 and the chain rule with $u = ${u}$.`,
            steps:[`From the table, $\\frac{d}{du}${X}(u) = ${signed(A.s,A.t("u"))}$.`,`Chain rule with $u = ${u}$, $u' = ${k}$.`,`$f'(x) = ${cdot(c)}\\left(${signed(A.s,A.t(u))}\\right)\\cdot ${k} = ${K<0?"-":""}${tt}$.`],
            answerTeX:`$f'(x) = ${K<0?"-":""}${tt}$`};
        }
        if(d===2){ const kind=R.pick(["prod","exp","root","pow"]);
          if(kind==="prod"){ const n=R.int(1,3), dom=fn==="arctan"?[-2,2]:[-0.9,0.9];
            const xn=n===1?"x":`x^{${n}}`, d1=n===1?"":n===2?"2x":`3x^{2}`;
            const first=n===1?`${X}(x)`:`${d1}${X}(x)`;
            const second=fn==="arctan"?`\\frac{${xn}}{1+x^2}`:`\\frac{${xn}}{\\sqrt{1-x^2}}`;
            return {prompt:`Find $f'(x)$ for $f(x) = ${xn}${X}(x)$.`, answer:{answer:`${n}*x^${n-1}*${fn}(x) + x^${n}*${A.s}*${A.a("x")}`,vars:["x"],domain:dom}, verify:{deriv:`x^${n}*${fn}(x)`},
              hint:"Product rule, with the inverse trig derivative from the table on p. 2.",
              steps:[`Product rule with $${xn}$ and $${X}(x)$.`,`$\\frac{d}{dx}${xn} = ${n===1?"1":d1}$ and $\\frac{d}{dx}${X}(x) = ${signed(A.s,A.t("x"))}$.`,`$f'(x) = ${first} ${A.s<0?"-":"+"} ${second}$.`],
              answerTeX:`$f'(x) = ${first} ${A.s<0?"-":"+"} ${second}$`};
          }
          if(kind==="exp"){ const dom=fn==="arctan"?[-2,2]:[-3,-0.1];
            const res=fn==="arctan"?`\\frac{e^x}{1+e^{2x}}`:`\\frac{e^x}{\\sqrt{1-e^{2x}}}`;
            return {prompt:`Let $f(x) = ${X}(e^x)$. Find $f'(x)$.`, answer:{answer:`${A.s}*${A.a("e^x")}*e^x`,vars:["x"],domain:dom}, verify:{deriv:`${fn}(e^x)`},
              hint:"Chain rule with $u = e^x$. Then $(e^x)^2 = e^{2x}$.",
              steps:[`Chain rule with $u = e^x$, $u' = e^x$.`,`$f'(x) = ${signed(A.s,A.t("e^x"))}\\cdot e^x$.`,`$= ${signed(A.s,res)}$, since $(e^x)^2 = e^{2x}$.`],
              answerTeX:`$f'(x) = ${signed(A.s,res)}$`};
          }
          if(kind==="root"){ const g=fn==="arctan"?"arctan":R.pick(["arcsin","arccos"]), B=AD[g], dom=g==="arctan"?[0.1,4]:[0.05,0.95];
            const res=g==="arctan"?`\\frac{1}{2\\sqrt{t}\\,(1+t)}`:`\\frac{1}{2\\sqrt{t}\\sqrt{1-t}}`;
            return {prompt:`Evaluate $\\frac{d}{dt}${ATX[g]}(\\sqrt{t})$.`, answer:{answer:`${B.s}*${B.a("sqrt(t)")}*1/(2*sqrt(t))`,vars:["t"],domain:dom}, verify:{deriv:`${g}(sqrt(t))`,v:"t"},
              hint:"Chain rule with $u = \\sqrt{t}$, $u' = \\frac{1}{2\\sqrt{t}}$. Then $(\\sqrt{t})^2 = t$.",
              steps:[`Chain rule with $u = \\sqrt{t}$, $u' = \\frac{1}{2\\sqrt{t}}$.`,`$\\frac{d}{dt}${ATX[g]}(\\sqrt{t}) = ${signed(B.s,B.t("\\sqrt{t}"))}\\cdot\\frac{1}{2\\sqrt{t}}$.`,`$= ${signed(B.s,res)}$, since $(\\sqrt{t})^2 = t$.`],
              answerTeX:`$${signed(B.s,res)}$`};
          }
          const n=R.int(2,3), dom=fn==="arctan"?[-1.5,1.5]:[-0.9,0.9];
          const res=fn==="arctan"?`\\frac{${n}x^{${n-1}}}{1+x^{${2*n}}}`:`\\frac{${n}x^{${n-1}}}{\\sqrt{1-x^{${2*n}}}}`;
          return {prompt:`Find $f'(x)$ for $f(x) = ${X}(x^{${n}})$.`, answer:{answer:`${A.s}*${A.a(`x^${n}`)}*${n}*x^${n-1}`,vars:["x"],domain:dom}, verify:{deriv:`${fn}(x^${n})`},
            hint:`Chain rule with $u = x^{${n}}$. Then $(x^{${n}})^2 = x^{${2*n}}$.`,
            steps:[`Chain rule with $u = x^{${n}}$, $u' = ${n}x^{${n-1}}$.`,`$f'(x) = ${signed(A.s,A.t(`x^{${n}}`))}\\cdot ${n}x^{${n-1}}$.`,`$= ${signed(A.s,res)}$.`],
            answerTeX:`$f'(x) = ${signed(A.s,res)}$`};
        }
        const kind=R.pick(["exparctan","simplify","arctanln","arcsintan"]);
        if(kind==="exparctan"){ const k=R.int(1,3), e=`e^{${k===1?"":k}x}`;
          return {prompt:`Find $f'(x)$ for $f(x) = ${e}\\arctan(x)$.`, answer:{answer:`${k}*e^(${k}*x)*arctan(x) + e^(${k}*x)/(1+x^2)`,vars:["x"],domain:[-2,2]}, verify:{deriv:`e^(${k}*x)*arctan(x)`},
            hint:"Product rule.", steps:[`$\\frac{d}{dx}${e} = ${k===1?"":k}${e}$ and $\\frac{d}{dx}\\arctan(x) = \\frac{1}{1+x^2}$.`,`Product rule: $f'(x) = ${k===1?"":k}${e}\\arctan(x) + \\frac{${e}}{1+x^2}$.`],
            answerTeX:`$f'(x) = ${k===1?"":k}${e}\\arctan(x) + \\frac{${e}}{1+x^2}$`};
        }
        if(kind==="simplify"){ const g=R.pick(["arcsin","arccos"]);
          const f=g==="arcsin"?"x\\arcsin(x) + \\sqrt{1-x^2}":"x\\arccos(x) - \\sqrt{1-x^2}";
          const p1=g==="arcsin"?"\\arcsin(x) + \\frac{x}{\\sqrt{1-x^2}}":"\\arccos(x) - \\frac{x}{\\sqrt{1-x^2}}";
          const p2=g==="arcsin"?"\\frac{1}{2}(1-x^2)^{-1/2}\\cdot(-2x) = -\\frac{x}{\\sqrt{1-x^2}}":"-\\frac{1}{2}(1-x^2)^{-1/2}\\cdot(-2x) = \\frac{x}{\\sqrt{1-x^2}}";
          return {prompt:`Find $h'(x)$ for $h(x) = ${f}$ and simplify.`, answer:{answer:`${g}(x)`,vars:["x"],domain:[-0.9,0.9]}, verify:{deriv:g==="arcsin"?"x*arcsin(x)+sqrt(1-x^2)":"x*arccos(x)-sqrt(1-x^2)"},
            hint:"Product rule on the first term, chain rule on the square root. Two terms cancel.",
            steps:[`Product rule: $\\frac{d}{dx}\\left[x${ATX[g]}(x)\\right] = ${p1}$.`,`Chain rule: $\\frac{d}{dx}\\left[${g==="arcsin"?"":"-"}\\sqrt{1-x^2}\\right] = ${p2}$.`,`Add: the $\\frac{x}{\\sqrt{1-x^2}}$ terms cancel, so $h'(x) = ${ATX[g]}(x)$.`],
            answerTeX:`$h'(x) = ${ATX[g]}(x)$`};
        }
        if(kind==="arctanln"){
          return {prompt:"Find $g'(x)$ for $g(x) = \\arctan(\\ln(x))$.", answer:{answer:"1/(1+ln(x)^2)*1/x",vars:["x"],domain:[0.3,3]}, verify:{deriv:"arctan(ln(x))"},
            hint:"Chain rule with $u = \\ln(x)$.", steps:["Chain rule with $u = \\ln(x)$, $u' = \\frac{1}{x}$.","$g'(x) = \\frac{1}{1+(\\ln(x))^2}\\cdot\\frac{1}{x}$."],
            answerTeX:"$g'(x) = \\frac{1}{1+(\\ln(x))^2}\\cdot\\frac{1}{x}$"};
        }
        const k=R.int(1,2), u=k===1?"x":`${k}x`;
        return {prompt:`Find $f'(x)$ for $f(x) = \\arcsin(x)\\tan(${u})$.`, answer:{answer:`tan(${k}*x)/sqrt(1-x^2) + ${k}*arcsin(x)*sec(${k}*x)^2`,vars:["x"],domain:k===1?[-0.9,0.9]:[-0.7,0.7]}, verify:{deriv:`arcsin(x)*tan(${k}*x)`},
          hint:"Product rule, and the chain rule on $\\tan("+u+")$.",
          steps:[`$\\frac{d}{dx}\\arcsin(x) = \\frac{1}{\\sqrt{1-x^2}}$ and $\\frac{d}{dx}\\tan(${u}) = ${k===1?"":"2"}\\sec^2(${u})$.`,`Product rule: $f'(x) = \\frac{\\tan(${u})}{\\sqrt{1-x^2}} + ${k===1?"":"2"}\\arcsin(x)\\sec^2(${u})$.`],
          answerTeX:`$f'(x) = \\frac{\\tan(${u})}{\\sqrt{1-x^2}} + ${k===1?"":"2"}\\arcsin(x)\\sec^2(${u})$`};
      }},
    {id:"L15.g.antideriv", title:"Antiderivatives from the tables", skill:"Integrate using the trig and inverse trig antiderivative tables", ref:"pp. 2 to 3",
      gen(R,d){
        /* [integrand TeX body, integrand ascii, antiderivative sign, antiderivative TeX body, antiderivative ascii body, fraction?] */
        const E={
          sin:["\\sin(x)","sin(x)",-1,"\\cos(x)","cos(x)"], cos:["\\cos(x)","cos(x)",1,"\\sin(x)","sin(x)"],
          sec2:["\\sec^2(x)","sec(x)^2",1,"\\tan(x)","tan(x)"], sectan:["\\sec(x)\\tan(x)","sec(x)*tan(x)",1,"\\sec(x)","sec(x)"],
          csc2:["\\csc^2(x)","csc(x)^2",-1,"\\cot(x)","cot(x)"], csccot:["\\csc(x)\\cot(x)","csc(x)*cot(x)",-1,"\\csc(x)","csc(x)"],
          atan:["1+x^2","1/(1+x^2)",1,"\\arctan(x)","arctan(x)",true], asin:["\\sqrt{1-x^2}","1/sqrt(1-x^2)",1,"\\arcsin(x)","arcsin(x)",true],
          tan:["\\tan(x)","tan(x)",1,"\\ln(|\\sec(x)|)","ln(abs(sec(x)))"], sec:["\\sec(x)","sec(x)",1,"\\ln(|\\sec(x)+\\tan(x)|)","ln(abs(sec(x)+tan(x)))"],
          csc:["\\csc(x)","csc(x)",-1,"\\ln(|\\csc(x)+\\cot(x)|)","ln(abs(csc(x)+cot(x)))"]};
        const REW={sec2:m=>`\\frac{${m||1}}{\\cos^2(x)}`,sectan:m=>`\\frac{${m}\\sin(x)}{\\cos^2(x)}`,csc2:m=>`\\frac{${m||1}}{\\sin^2(x)}`,csccot:m=>`\\frac{${m}\\cos(x)}{\\sin^2(x)}`,tan:m=>`\\frac{${m}\\sin(x)}{\\cos(x)}`};
        const REWWHY={sec2:"$\\frac{1}{\\cos^2(x)} = \\sec^2(x)$",sectan:"$\\frac{\\sin(x)}{\\cos^2(x)} = \\frac{1}{\\cos(x)}\\cdot\\frac{\\sin(x)}{\\cos(x)} = \\sec(x)\\tan(x)$",csc2:"$\\frac{1}{\\sin^2(x)} = \\csc^2(x)$",csccot:"$\\frac{\\cos(x)}{\\sin^2(x)} = \\frac{1}{\\sin(x)}\\cdot\\frac{\\cos(x)}{\\sin(x)} = \\csc(x)\\cot(x)$",tan:"$\\frac{\\sin(x)}{\\cos(x)} = \\tan(x)$"};
        const integrandT=(c,k,first,rew)=>{ const e=E[k]; if(rew) return `${sgn(c,first)}${REW[k](ab(c))}`; if(e[5]) return `${sgn(c,first)}\\frac{${Math.abs(c)}}{${e[0]}}`; return `${sgn(c,first)}${ab(c)}${e[0]}`; };
        const antiT=(c,k,first)=>{ const e=E[k], K=c*e[2]; return `${sgn(K,first)}${ab(K)}${e[3]}`; };
        const antiA=(c,k)=>`${c*E[k][2]}*${E[k][4]}`;
        const intA=(c,k)=>`${c}*${E[k][1]}`;
        const basic=["sin","cos","sec2","sectan","csc2","csccot","atan","asin"];
        let terms=[], extra=null;
        if(d===1){ let c1, k1; do{ c1=R.nz(-6,6); k1=R.pick(basic); }while(c1===1&&k1==="cos"); terms=[[c1,k1,false]]; }
        else if(d===2){ const ks=R.shuffle(basic.slice()); terms=[[R.nz(-5,5),ks[0],false],[R.nz(-5,5),ks[1],false]]; const n=R.int(0,3), m=R.nz(-4,4)*(n+1); extra={m,n}; }
        else { const lk=R.pick(["tan","sec","csc"]), rk=R.pick(Object.keys(REW).filter(k=>k!==lk)); terms=R.shuffle([[R.nz(-4,4),lk,false],[R.nz(-4,4),rk,true]]); }
        const pw=extra?(extra.n===0?String(Math.abs(extra.m)):`${Math.abs(extra.m)===1?"":Math.abs(extra.m)}x${extra.n===1?"":`^{${extra.n}}`}`):"";
        const intT=terms.map((t,i)=>integrandT(t[0],t[1],i===0,t[2])).join(" ")+(extra?` ${extra.m<0?"-":"+"} ${pw}`:"");
        const q=extra?extra.m/(extra.n+1):0;
        const pwA=extra?` ${q<0?"-":"+"} ${Math.abs(q)===1?"":Math.abs(q)}x${extra.n+1===1?"":`^{${extra.n+1}}`}`:"";
        const ansT=terms.map((t,i)=>antiT(t[0],t[1],i===0)).join(" ")+pwA+" + C";
        const ansA=terms.map(t=>antiA(t[0],t[1])).join(" + ")+(extra?` + ${q}*x^${extra.n+1}`:"")+" + C";
        const intAsc=terms.map(t=>intA(t[0],t[1])).join(" + ")+(extra?` + ${extra.m}*x^${extra.n}`:"");
        const steps=[];
        terms.filter(t=>t[2]).forEach(t=>steps.push(`Rewrite first: ${REWWHY[t[1]]}.`));
        if(terms.length>1||extra) steps.push(`Split the integral and pull out the constants: integrate each term on its own.`);
        terms.forEach(t=>{ const e=E[t[1]]; steps.push(`$\\int ${e[5]?`\\frac{1}{${e[0]}}`:e[0]}\\,dx = ${e[2]<0?"-":""}${e[3]} + C$ (table)`+(t[0]===1?".":`, so $\\int ${integrandT(t[0],t[1],true,false)}\\,dx = ${antiT(t[0],t[1],true)} + C$.`)); });
        if(extra) steps.push(`Power rule: $\\int ${extra.m<0?"-":""}${pw}\\,dx = ${q===1?"":q===-1?"-":q}x${extra.n+1===1?"":`^{${extra.n+1}}`} + C$.`);
        steps.push(`Put it together, with one $+ C$: $${ansT}$.`);
        return {prompt:terms.length===1&&!extra?`Evaluate $\\int ${intT}\\,dx$.`:`Evaluate $\\int \\left(${intT}\\right)dx$.`,
          answer:{answer:ansA,vars:["x"],domain:d===3?[3.3,4.5]:[0.2,0.9],plusC:true,consts:[]}, verify:{antideriv:intAsc},
          hint:"Match each term to a row of the tables on pp. 2 to 3. "+(d===3?"Rewrite fractions of sin and cos as sec, csc, tan or cot first. ":"")+"Keep the absolute value bars in any ln, and end with + C.",
          steps, answerTeX:`$${ansT}$`};
      }},
    {id:"L15.g.defint", title:"Definite integrals with trig", skill:"Evaluate a definite integral with a trig or inverse trig antiderivative", ref:"pp. 2 to 3",
      gen(R,d){
        const sec=x=>1/Math.cos(x);
        /* [integrand TeX, var, a TeX, b TeX, a, b, F TeX (in var), F(b) TeX, F(a) TeX, result {t,a}, integrand fn] */
        const C1=[
          ["\\sin(x)","x","0","\\frac{\\pi}{3}",0,P/3,"-\\cos(x)","-\\frac{1}{2}","-1",N("\\frac{1}{2}","1/2"),Math.sin],
          ["\\sin(x)","x","0","\\frac{\\pi}{2}",0,P/2,"-\\cos(x)","0","-1",N("1","1"),Math.sin],
          ["\\sin(x)","x","0","\\pi",0,P,"-\\cos(x)","1","-1",N("2","2"),Math.sin],
          ["\\cos(x)","x","0","\\frac{\\pi}{6}",0,P/6,"\\sin(x)","\\frac{1}{2}","0",N("\\frac{1}{2}","1/2"),Math.cos],
          ["\\cos(x)","x","0","\\frac{\\pi}{3}",0,P/3,"\\sin(x)","\\frac{\\sqrt{3}}{2}","0",N("\\frac{\\sqrt{3}}{2}","sqrt(3)/2"),Math.cos],
          ["\\sec^2(x)","x","0","\\frac{\\pi}{6}",0,P/6,"\\tan(x)","\\frac{1}{\\sqrt{3}}","0",N("\\frac{1}{\\sqrt{3}}","1/sqrt(3)"),x=>sec(x)**2],
          ["\\sec^2(x)","x","0","\\frac{\\pi}{4}",0,P/4,"\\tan(x)","1","0",N("1","1"),x=>sec(x)**2],
          ["\\sec^2(x)","x","0","\\frac{\\pi}{3}",0,P/3,"\\tan(x)","\\sqrt{3}","0",N("\\sqrt{3}","sqrt(3)"),x=>sec(x)**2],
          ["\\frac{1}{\\sqrt{1-t^2}}","t","0","\\frac{1}{2}",0,0.5,"\\arcsin(t)","\\frac{\\pi}{6}","0",N("\\frac{\\pi}{6}","pi/6"),t=>1/Math.sqrt(1-t*t)],
          ["\\frac{1}{\\sqrt{1-t^2}}","t","0","\\frac{\\sqrt{3}}{2}",0,Math.sqrt(3)/2,"\\arcsin(t)","\\frac{\\pi}{3}","0",N("\\frac{\\pi}{3}","pi/3"),t=>1/Math.sqrt(1-t*t)],
          ["\\frac{1}{1+x^2}","x","0","1",0,1,"\\arctan(x)","\\frac{\\pi}{4}","0",N("\\frac{\\pi}{4}","pi/4"),x=>1/(1+x*x)],
          ["\\frac{1}{1+x^2}","x","0","\\sqrt{3}",0,Math.sqrt(3),"\\arctan(x)","\\frac{\\pi}{3}","0",N("\\frac{\\pi}{3}","pi/3"),x=>1/(1+x*x)]];
        const C2=[
          ["\\sec(x)\\tan(x)","x","0","\\frac{\\pi}{4}",0,P/4,"\\sec(x)","\\sqrt{2}","1",N("\\sqrt{2} - 1","sqrt(2)-1"),x=>sec(x)*Math.tan(x)],
          ["\\sec(x)\\tan(x)","x","0","\\frac{\\pi}{3}",0,P/3,"\\sec(x)","2","1",N("1","1"),x=>sec(x)*Math.tan(x)],
          ["\\csc^2(x)","x","\\frac{\\pi}{4}","\\frac{\\pi}{2}",P/4,P/2,"-\\cot(x)","0","-1",N("1","1"),x=>1/Math.sin(x)**2],
          ["\\csc^2(x)","x","\\frac{\\pi}{6}","\\frac{\\pi}{2}",P/6,P/2,"-\\cot(x)","0","-\\sqrt{3}",N("\\sqrt{3}","sqrt(3)"),x=>1/Math.sin(x)**2],
          ["\\csc(x)\\cot(x)","x","\\frac{\\pi}{6}","\\frac{\\pi}{2}",P/6,P/2,"-\\csc(x)","-1","-2",N("1","1"),x=>Math.cos(x)/Math.sin(x)**2],
          ["\\csc(x)\\cot(x)","x","\\frac{\\pi}{4}","\\frac{\\pi}{2}",P/4,P/2,"-\\csc(x)","-1","-\\sqrt{2}",N("\\sqrt{2} - 1","sqrt(2)-1"),x=>Math.cos(x)/Math.sin(x)**2],
          ["\\frac{1}{1+x^2}","x","-1","1",-1,1,"\\arctan(x)","\\frac{\\pi}{4}","-\\frac{\\pi}{4}",N("\\frac{\\pi}{2}","pi/2"),x=>1/(1+x*x)],
          ["\\frac{1}{1+x^2}","x","-1","\\sqrt{3}",-1,Math.sqrt(3),"\\arctan(x)","\\frac{\\pi}{3}","-\\frac{\\pi}{4}",N("\\frac{7\\pi}{12}","7*pi/12"),x=>1/(1+x*x)],
          ["\\frac{1}{\\sqrt{1-t^2}}","t","-\\frac{1}{2}","\\frac{1}{2}",-0.5,0.5,"\\arcsin(t)","\\frac{\\pi}{6}","-\\frac{\\pi}{6}",N("\\frac{\\pi}{3}","pi/3"),t=>1/Math.sqrt(1-t*t)],
          ["\\frac{1}{\\sqrt{1-t^2}}","t","-\\frac{1}{2}","\\frac{\\sqrt{3}}{2}",-0.5,Math.sqrt(3)/2,"\\arcsin(t)","\\frac{\\pi}{3}","-\\frac{\\pi}{6}",N("\\frac{\\pi}{2}","pi/2"),t=>1/Math.sqrt(1-t*t)]];
        const C3=[
          ["\\tan(x)","x","0","\\frac{\\pi}{4}",0,P/4,"\\ln(|\\sec(x)|)","\\ln(\\sqrt{2})","\\ln(1)",N("\\ln(\\sqrt{2})","ln(sqrt(2))"),Math.tan],
          ["\\tan(x)","x","0","\\frac{\\pi}{3}",0,P/3,"\\ln(|\\sec(x)|)","\\ln(2)","\\ln(1)",N("\\ln(2)","ln(2)"),Math.tan],
          ["\\sec(x)","x","0","\\frac{\\pi}{4}",0,P/4,"\\ln(|\\sec(x)+\\tan(x)|)","\\ln(\\sqrt{2}+1)","\\ln(1)",N("\\ln(\\sqrt{2}+1)","ln(sqrt(2)+1)"),sec],
          ["\\sec(x)","x","0","\\frac{\\pi}{3}",0,P/3,"\\ln(|\\sec(x)+\\tan(x)|)","\\ln(2+\\sqrt{3})","\\ln(1)",N("\\ln(2+\\sqrt{3})","ln(2+sqrt(3))"),sec]];
        let c;
        if(d===3 && R.int(0,2)===0){ // c sec^2 + m on [0, b]
          const B=R.pick([[6,"\\frac{1}{\\sqrt{3}}","1/sqrt(3)"],[4,"1","1"],[3,"\\sqrt{3}","sqrt(3)"]]), k=B[0], cc=R.nz(-4,4), m=R.nz(1,4)*R.pick([1,-1]);
          const bT=`\\frac{\\pi}{${k}}`;
          const ct=B[2]==="1"?String(cc):B[0]===6?(cc<0?`-\\frac{${-cc}}{\\sqrt{3}}`:`\\frac{${cc}}{\\sqrt{3}}`):`${cT(cc)}\\sqrt{3}`;
          const resT=`${ct} ${m<0?"-":"+"} ${pi(Math.abs(m),k).t}`, resA=`${cc}*${B[2]} + ${m}*pi/${k}`;
          const it=`${cT(cc)}\\sec^2(x) ${m<0?"-":"+"} ${Math.abs(m)}`;
          return {prompt:`Evaluate $\\int_0^{${bT}} \\left(${it}\\right)dx$.`, answer:{type:"num",answer:resA}, verify:{value:simpson(x=>cc/Math.cos(x)**2+m,0,P/k)},
            hint:"Antiderivative from the table, then $F(b) - F(a)$. A definite integral has no $+ C$.",
            steps:[`An antiderivative of $${it}$ is $${cT(cc)}\\tan(x) ${m<0?"-":"+"} ${Math.abs(m)}x$.`,`$\\int_0^{${bT}} \\left(${it}\\right)dx = \\left(${cT(cc)}\\tan(x) ${m<0?"-":"+"} ${Math.abs(m)}x\\right)\\Big|_0^{${bT}}$.`,`$= ${cT(cc)}\\tan\\left(${bT}\\right) ${m<0?"-":"+"} ${Math.abs(m)}\\cdot${bT} - 0 = ${resT}$.`],
            answerTeX:`$${resT}$`};
        }
        c=R.pick(d===1?C1:d===2?C2:C3);
        const [it,v,aT,bT,a,b,FT,FbT,FaT,res,fn]=c;
        const minus=FaT.startsWith("-")?`- (${FaT})`:`- ${FaT}`;
        return {prompt:`Evaluate $\\int_{${aT}}^{${bT}} ${it}\\,d${v}$.`, answer:{type:"num",answer:res.a}, verify:{value:simpson(fn,a,b)},
          hint:`Find an antiderivative in the table on ${it.includes("frac")?"p. 3":"p. 2"}, then compute $F(b) - F(a)$. No $+ C$ in a definite integral.`,
          steps:[`From the table, an antiderivative of $${it}$ is $${FT}$.`,`$\\int_{${aT}}^{${bT}} ${it}\\,d${v} = ${FT}\\Big|_{${aT}}^{${bT}}$.`,`$= ${FbT} ${minus}$, using the special values at $${bT}$ and $${aT}$.`,`$= ${res.t}$.`],
          answerTeX:`$${res.t}$`};
      }},
    {id:"L15.g.ivp", title:"Initial value problems with trig", skill:"Solve y' = f(x), y(a) = b when f is in the trig tables", ref:"p. 2",
      gen(R,d){
        /* exact values are linear combinations r + p*pi + s2*sqrt(2) + s3*sqrt(3) with rational coefficients */
        const fr=(n,dd=1)=>{ if(dd<0){ n=-n; dd=-dd; } const g=gcd(n,dd); return [n/g,dd/g]; };
        const fadd=(x,y)=>fr(x[0]*y[1]+y[0]*x[1],x[1]*y[1]), fmul=(x,k)=>fr(x[0]*k,x[1]);
        const lin=o=>Object.assign({r:[0,1],p:[0,1],s2:[0,1],s3:[0,1]},o);
        const ladd=(A,B)=>({r:fadd(A.r,B.r),p:fadd(A.p,B.p),s2:fadd(A.s2,B.s2),s3:fadd(A.s3,B.s3)});
        const lmul=(A,k)=>({r:fmul(A.r,k),p:fmul(A.p,k),s2:fmul(A.s2,k),s3:fmul(A.s3,k)});
        const linT=A=>{ const parts=[]; const t=(f,sym)=>{ const [n,dd]=f; if(n===0) return; const m=Math.abs(n);
            const body=!sym?(dd===1?String(m):`\\frac{${m}}{${dd}}`):(dd===1?`${m===1?"":m}${sym}`:`\\frac{${m===1?"":m}${sym}}{${dd}}`); parts.push([n<0,body]); };
          t(A.r,""); t(A.p,"\\pi"); t(A.s2,"\\sqrt{2}"); t(A.s3,"\\sqrt{3}");
          if(!parts.length) return "0"; return parts.map(([neg,bd],i)=>i===0?(neg?"-":"")+bd:(neg?" - ":" + ")+bd).join(""); };
        const linA=A=>`(${A.r[0]}/${A.r[1]}) + (${A.p[0]}/${A.p[1]})*pi + (${A.s2[0]}/${A.s2[1]})*sqrt(2) + (${A.s3[0]}/${A.s3[1]})*sqrt(3)`;
        /* x0 entries: [TeX, value, x0 as lin, F(x0) as lin] */
        const CASES=[
          {yt:"\\sec(x)\\tan(x)", ya:"sec(x)*tan(x)", Ft:"\\sec(x)", Fa:"sec(x)", Ff:x=>1/Math.cos(x), dom:()=>[-1.2,1.2],
            x0s:[["0",0,lin({}),lin({r:[1,1]})],["\\frac{\\pi}{4}",P/4,lin({p:[1,4]}),lin({s2:[1,1]})],["\\frac{\\pi}{3}",P/3,lin({p:[1,3]}),lin({r:[2,1]})]]},
          {yt:"\\sec^2(x)", ya:"sec(x)^2", Ft:"\\tan(x)", Fa:"tan(x)", Ff:Math.tan, dom:x0=>x0>P/2?[1.7,3]:[-1.2,1.2],
            x0s:[["\\frac{\\pi}{4}",P/4,lin({p:[1,4]}),lin({r:[1,1]})],["\\frac{\\pi}{3}",P/3,lin({p:[1,3]}),lin({s3:[1,1]})],["\\frac{3\\pi}{4}",3*P/4,lin({p:[3,4]}),lin({r:[-1,1]})]]},
          {yt:"\\sin(x)", ya:"sin(x)", Ft:"-\\cos(x)", Fa:"-cos(x)", Ff:x=>-Math.cos(x), dom:()=>[-3,3],
            x0s:[["\\frac{\\pi}{3}",P/3,lin({p:[1,3]}),lin({r:[-1,2]})],["\\pi",P,lin({p:[1,1]}),lin({r:[1,1]})],["\\frac{2\\pi}{3}",2*P/3,lin({p:[2,3]}),lin({r:[1,2]})]]},
          {yt:"\\frac{1}{\\sqrt{1-x^2}}", den:"\\sqrt{1-x^2}", ya:"1/sqrt(1-x^2)", Ft:"\\arcsin(x)", Fa:"arcsin(x)", Ff:Math.asin, dom:()=>[-0.9,0.9],
            x0s:[["0",0,lin({}),lin({})],["\\frac{1}{2}",0.5,lin({r:[1,2]}),lin({p:[1,6]})],["1",1,lin({r:[1,1]}),lin({p:[1,2]})],["-\\frac{1}{2}",-0.5,lin({r:[-1,2]}),lin({p:[-1,6]})]]},
          {yt:"\\frac{1}{1+x^2}", den:"1+x^2", ya:"1/(1+x^2)", Ft:"\\arctan(x)", Fa:"arctan(x)", Ff:Math.atan, dom:()=>[-2,2],
            x0s:[["1",1,lin({r:[1,1]}),lin({p:[1,4]})],["-1",-1,lin({r:[-1,1]}),lin({p:[-1,4]})],["\\sqrt{3}",Math.sqrt(3),lin({s3:[1,1]}),lin({p:[1,3]})],["0",0,lin({}),lin({})]]}];
        const CS=R.pick(CASES), [x0T,x0,X0,FX0]=R.pick(CS.x0s);
        const c=d===1?1:R.pick([2,3,-1,-2,4]), m=d===3?R.nz(-3,3):0, y0=R.nz(-4,6);
        const integ=(CS.den?(c===1?CS.yt:`\\frac{${c}}{${CS.den}}`):`${cT(c)}${CS.yt}`)+(m?` ${m<0?"-":"+"} ${Math.abs(m)}`:"");
        const Fc=(CS.Ft.startsWith("-")?`${cT(-c)}${CS.Ft.slice(1)}`:`${cT(c)}${CS.Ft}`)+(m?` ${m<0?"-":"+"} ${ab(m)}x`:"");
        const at=`\\left(${x0T}\\right)`;
        const FcAt=(CS.Ft.startsWith("-")?`${cT(-c)}${CS.Ft.slice(1)}`:`${cT(c)}${CS.Ft}`).replace("(x)",at)+(m?` ${m<0?"-":"+"} ${Math.abs(m)}\\cdot${at}`:"");
        const rhs=ladd(lmul(FX0,c),lmul(X0,m));             // c F(x0) + m x0
        const Cl=ladd(lin({r:[y0,1]}),lmul(rhs,-1));         // C = y0 - c F(x0) - m x0
        const CT=linT(Cl), rhsT=linT(rhs);
        const fin=`y = ${Fc}${CT==="0"?"":(CT.startsWith("-")?` - ${CT.slice(1)}`:` + ${CT}`)}`;
        const Fbare=CS.Ft.replace(/^-/,"").replace("(x)",at), FX0T=linT(CS.Ft.startsWith("-")?lmul(FX0,-1):FX0);
        const Cnum=y0-c*CS.Ff(x0)-m*x0;
        return {prompt:`Solve the initial value problem $y' = ${integ}$, $y${at} = ${y0}$.`,
          answer:{answer:`${c}*(${CS.Fa}) + ${m}*x + ${linA(Cl)}`,vars:["x"],domain:CS.dom(x0)}, verify:{expr:`${c}*(${CS.Fa}) + ${m}*x + (${Cnum.toFixed(12)})`},
          hint:"Integrate to get every solution, $y = F(x) + C$. Then substitute the initial condition to find $C$.",
          steps:[`$y = ${m?`\\int \\left(${integ}\\right)dx`:`\\int ${integ}\\,dx`} = ${Fc} + C$.`,`Substitute $y${at} = ${y0}$: $${y0} = ${FcAt} + C$.`,`$${Fbare} = ${FX0T}$, so $${y0} = ${rhsT} + C$ and $C = ${CT}$.`,`$${fin}$`],
          answerTeX:`$${fin}$`};
      }},
    {id:"L15.g.error", title:"Find the mistake", skill:"Spot the first wrong line in a trig calculus solution", ref:"pp. 1 to 3",
      gen(R,d){
        const fmt=L=>L.map((s,i)=>`<p style="margin:2px 0">(${i+1}) ${s}</p>`).join("");
        const ask="A problem and answer are shown below. The answer would not get full marks. Select the first line that has a mistake.";
        const pack=(prob,good,bad,why,e,hint)=>{ const L=good.slice(); L[e]=bad[e];
          return {prompt:`${ask}<p style="margin:6px 0 2px">Problem: ${prob}</p>${fmt(L)}`, parts:[{answer:{type:"mc",options:L.map((s,i)=>`Line (${i+1})`),correct:e,keep:true}}],
            hint, steps:[`Line (${e+1}) is the first mistake. ${why[e]}`,`A correct solution: ${good.map((s,i)=>`(${i+1}) ${s}`).join(" ")}`], answerTeX:`Line (${e+1})`}; };
        if(d===1){
          const fn=R.pick(["arcsin","arccos","arctan"]), A=AD[fn], X=ATX[fn];
          const G=R.pick([["x^2","2x","x","x^4"],["x^3","3x^2","3x","x^6"],["e^x","e^x","xe^{x-1}","e^{2x}"],["3x","3","x","9x^2"]]);
          const [g,dg,wdg,g2]=G;
          const outer=signed(A.s,A.t("u")), outerBad=fn==="arcsin"?"\\frac{1}{\\sqrt{1+u^2}}":fn==="arccos"?"\\frac{1}{\\sqrt{1-u^2}}":"\\frac{1}{1-u^2}";
          const lin3=`${signed(A.s,A.t(g))}\\cdot ${dg.length>1?`(${dg})`:dg}`, lin3b=`${signed(A.s,A.t("x"))}\\cdot ${dg.length>1?`(${dg})`:dg}`;
          const fin=fn==="arctan"?`\\frac{${dg}}{1+${g2}}`:`\\frac{${dg}}{\\sqrt{1-${g2}}}`, finBad=fn==="arctan"?`\\frac{${dg}}{1+${g}}`:`\\frac{${dg}}{1-${g2}}`;
          const good=[`From the table, $\\frac{d}{du}${X}(u) = ${outer}$.`,`Let $u = ${g}$, so $u' = ${dg}$.`,`By the chain rule, $f'(x) = ${lin3}$.`,`$f'(x) = ${signed(A.s,fin)}$.`];
          const bad=[`From the table, $\\frac{d}{du}${X}(u) = ${outerBad}$.`,`Let $u = ${g}$, so $u' = ${wdg}$.`,`By the chain rule, $f'(x) = ${lin3b}$.`,`$f'(x) = ${signed(A.s,finBad)}$.`];
          const why=[`The table on p. 2 gives $\\frac{d}{du}${X}(u) = ${outer}$.`,`$\\frac{d}{dx}${g} = ${dg}$.`,`The outside derivative must be evaluated at $u = ${g}$, not at $x$.`,fn==="arctan"?`$(${g})^2 = ${g2}$, so the bottom is $1+${g2}$.`:`The square root was dropped from the bottom.`];
          return pack(`find $f'(x)$ for $f(x) = ${X}(${g})$.`,good,bad,why,R.int(0,3),"Check the table entry, the inside derivative, where the outside derivative is evaluated, and the algebra.");
        }
        if(d===2){
          const CS=R.pick([["\\sec(x)\\tan(x)","\\sec(x)","\\sec(x)\\tan^2(x) + \\sec^3(x)",[["\\frac{\\pi}{3}","2",[2,1]],["0","1",[1,1]]]],
            ["\\sec^2(x)","\\tan(x)","2\\sec^2(x)\\tan(x)",[["\\frac{\\pi}{4}","1",[1,1]]]],
            ["\\sin(x)","-\\cos(x)","\\cos(x)",[["\\pi","1",[1,1]],["\\frac{\\pi}{3}","-\\frac{1}{2}",[-1,2]]]],
            ["\\frac{1}{1+x^2}","\\arctan(x)","-\\frac{2x}{(1+x^2)^2}",[["1","\\frac{\\pi}{4}",null]]],
            ["\\frac{1}{\\sqrt{1-x^2}}","\\arcsin(x)","\\frac{x}{(1-x^2)^{3/2}}",[["\\frac{1}{2}","\\frac{\\pi}{6}",null],["1","\\frac{\\pi}{2}",null]]]]);
          const [yt,Ft,dWrong,X0s]=CS, [x0T,vT,rat]=R.pick(X0s), y0=R.int(2,6);
          const at=s=>s.replace(/\(x\)/g,`\\left(${x0T}\\right)`);
          let Ct, CtW;
          if(rat){ Ct=M127.frac(y0*rat[1]-rat[0],rat[1]); CtW=M127.frac(y0*rat[1]+rat[0],rat[1]); } else { Ct=`${y0} - ${vT}`; CtW=`${y0} + ${vT}`; }
          const negV=vT.startsWith("-")?vT.slice(1):`-${vT}`;
          const good=[`$y = \\int ${yt}\\,dx$`,`$y = ${Ft} + C$`,`Substituting $y\\left(${x0T}\\right) = ${y0}$: $${y0} = ${at(Ft)} + C$`,`$${y0} = ${vT} + C$, so $C = ${Ct}$`,`$y = ${Ft} + ${Ct}$`];
          const bad=[`$y = \\int ${yt}$`,`$y = ${Ft}$`,`Substituting $y\\left(${x0T}\\right) = ${y0}$: $${x0T} = ${Ft.replace("(x)",`(${y0})`)} + C$`,`$${y0} = ${negV} + C$, so $C = ${CtW}$`,`$${Ft} + ${Ct}$`];
          const why=["The $dx$ is missing. An integral sign always needs its $dx$.","The $+ C$ is missing, so there is nothing for the initial condition to find.","The initial condition was substituted the wrong way round: $x = "+x0T+"$ and $y = "+y0+"$.",`The special value has the wrong sign: $${at(Ft)} = ${vT}$.`,"The answer must be an equation: write $y = \\ldots$, not just the expression."];
          return pack(`solve the initial value problem $y' = ${yt}$, $y\\left(${x0T}\\right) = ${y0}$.`,good,bad,why,R.int(0,4),"Look for a missing $dx$, a missing $+ C$, the initial condition substituted correctly, the special value, and $y =$ in the final answer.");
        }
        const CS=R.pick([["\\tan(x)","\\ln(|\\sec(x)|)","\\sec^2(x)",[["\\frac{\\pi}{4}","\\sqrt{2}","\\frac{1}{\\sqrt{2}}"],["\\frac{\\pi}{3}","2","\\frac{1}{2}"]],s=>`\\ln(${s})`,"\\ln(|\\sec(0)|)","\\ln(1)"],
          ["\\sec(x)","\\ln(|\\sec(x)+\\tan(x)|)","\\sec(x)\\tan(x)",[["\\frac{\\pi}{4}","\\sqrt{2}+1","\\frac{1}{\\sqrt{2}}+1"],["\\frac{\\pi}{3}","2+\\sqrt{3}","\\frac{1}{2}+\\sqrt{3}"]],s=>`\\ln(${s})`,"\\ln(|\\sec(0)+\\tan(0)|)","\\ln(1)"]]);
        const [it,FT,dT,Bs,lnf,F0,ln1]=CS, [bT,vb,vbBad]=R.pick(Bs);
        const Fb=FT.replace(/\(x\)/g,`\\left(${bT}\\right)`);
        const good=[`$\\int_0^{${bT}} ${it}\\,dx = ${FT}\\Big|_0^{${bT}}$`,`$= ${Fb} - ${F0}$`,`$= ${lnf(vb)} - ${ln1}$`,`$= ${lnf(vb)}$`];
        const bad=[`$\\int_0^{${bT}} ${it}\\,dx = ${dT}\\Big|_0^{${bT}}$`,`$= ${F0} - ${Fb}$`,`$= ${lnf(vbBad)} - ${ln1}$`,`$= ${lnf(vb)} + C$`];
        const why=[`That is the derivative of $${it}$, not an antiderivative. From the table, $\\int ${it}\\,dx = ${FT} + C$.`,"The order is $F(b) - F(a)$: upper limit first.",`$\\sec\\left(${bT}\\right) = \\frac{1}{\\cos\\left(${bT}\\right)}$, not $\\cos\\left(${bT}\\right)$.`,"A definite integral is a number. It has no $+ C$."];
        return pack(`evaluate $\\int_0^{${bT}} ${it}\\,dx$.`,good,bad,why,R.int(0,3),"Check the antiderivative against the table, the order $F(b) - F(a)$, the special values, and whether a $+ C$ belongs.");
      }}
  ],
  exam:[
    {id:"L15.q1", ref:"p. 1", q:"$\\frac{d}{dx}\\sec(x) =$", opts:[
      ["$\\sec(x)\\tan(x)$",1,"From the table on p. 1."],
      ["$\\sec^2(x)$",0,"That is the derivative of $\\tan(x)$."],
      ["$-\\sec(x)\\tan(x)$",0,"Only the co-functions (cos, csc, cot) get a minus sign."],
      ["$\\sec(x)\\cot(x)$",0,"Not in the table. Compare $\\frac{d}{dx}\\csc(x) = -\\csc(x)\\cot(x)$."]]},
    {id:"L15.q2", ref:"p. 2", q:"$\\int \\csc(x)\\cot(x)\\,dx =$", opts:[
      ["$-\\csc(x) + C$",1,"Since $\\frac{d}{dx}\\csc(x) = -\\csc(x)\\cot(x)$, the antiderivative needs the minus sign."],
      ["$\\csc(x) + C$",0,"Differentiate it: you get $-\\csc(x)\\cot(x)$, the wrong sign."],
      ["$-\\cot(x) + C$",0,"That is $\\int \\csc^2(x)\\,dx$."],
      ["$-\\csc(x)$",0,"Missing $+ C$. Quizzes take marks off for this."]]},
    {id:"L15.q3", ref:"p. 2", multi:true, q:"Select all rows that match the antiderivative table in the notes.", opts:[
      ["$\\int \\tan(x)\\,dx = \\ln(|\\sec(x)|) + C$",1,"Row 2 of the table."],
      ["$\\int \\sec(x)\\,dx = \\ln(|\\sec(x)+\\tan(x)|) + C$",1,"Row 2 of the table, and the worked example on p. 1 checks it."],
      ["$\\int \\csc(x)\\,dx = \\ln(|\\csc(x)+\\cot(x)|) + C$",0,"Missing the minus sign: it is $-\\ln(|\\csc(x)+\\cot(x)|) + C$."],
      ["$\\int \\sin(x)\\,dx = \\cos(x) + C$",0,"It is $-\\cos(x) + C$, since $\\frac{d}{dx}\\cos(x) = -\\sin(x)$."]]},
    {id:"L15.q4", ref:"p. 3", q:"$\\frac{d}{dt}\\arctan(\\sqrt{t}) =$", opts:[
      ["$\\frac{1}{2\\sqrt{t}\\,(1+t)}$",1,"$\\frac{1}{1+(\\sqrt{t})^2}\\cdot\\frac{1}{2\\sqrt{t}}$, and $(\\sqrt{t})^2 = t$."],
      ["$\\frac{1}{1+t}$",0,"Missing the chain rule factor $\\frac{1}{2\\sqrt{t}}$."],
      ["$\\frac{1}{1+\\sqrt{t}}\\cdot\\frac{1}{2\\sqrt{t}}$",0,"The inside must be squared: $1+(\\sqrt{t})^2 = 1+t$."],
      ["$\\frac{1}{2\\sqrt{t}\\,(1+t^2)}$",0,"Squared $t$ instead of $\\sqrt{t}$."]]},
    {id:"L15.q5", ref:"p. 1", q:"True or false: $\\frac{d}{dx}\\ln(|\\sec(x)+\\tan(x)|) = \\sec(x)$.", opts:[
      ["True",1,"Worked on p. 1: the absolute values combine into $|\\sec(x)+\\tan(x)|^2 = (\\sec(x)+\\tan(x))^2$, which cancels, leaving $\\sec(x)$."],
      ["False",0,"It is the example on p. 1, and it matches $\\int \\sec(x)\\,dx = \\ln(|\\sec(x)+\\tan(x)|) + C$."]]},
    {id:"L15.q6", ref:"p. 3", q:"$\\int_0^2 \\frac{1}{1+x^2}\\,dx =$", opts:[
      ["$\\arctan(2)$",1,"$\\arctan(x)\\Big|_0^2 = \\arctan(2) - \\arctan(0) = \\arctan(2)$."],
      ["$\\frac{1}{5} - 1 = -\\frac{4}{5}$",0,"That puts the limits into the integrand instead of an antiderivative."],
      ["$\\arctan(2) + C$",0,"A definite integral is a number, so no $+ C$."],
      ["$\\frac{\\pi}{4}$",0,"That is $\\arctan(1)$. The upper limit is 2."]]},
    {id:"L15.q7", ref:"p. 2", keep:true, q:"Solve $y' = \\sec^2(x)$, $y\\left(\\frac{\\pi}{4}\\right) = 3$. Select the first line that has a mistake.<p style=\"margin:2px 0\">(1) $y = \\int \\sec^2(x)\\,dx = \\tan(x) + C$</p><p style=\"margin:2px 0\">(2) Substituting $y\\left(\\frac{\\pi}{4}\\right) = 3$: $3 = \\tan\\left(\\frac{\\pi}{4}\\right) + C$</p><p style=\"margin:2px 0\">(3) $3 = 1 + C$, so $C = 2$</p><p style=\"margin:2px 0\">(4) $\\tan(x) + 2$</p>", opts:[
      ["Line (1)",0,"Correct: $dx$ is there, the table gives $\\tan(x)$, and there is a $+ C$."],
      ["Line (2)",0,"Correct substitution: $x = \\frac{\\pi}{4}$, $y = 3$."],
      ["Line (3)",0,"$\\tan\\left(\\frac{\\pi}{4}\\right) = 1$, so this is right."],
      ["Line (4)",1,"The answer must be the equation $y = \\tan(x) + 2$. Leaving off \"$y =$\" loses marks."]]},
    {id:"L15.q8", ref:"p. 2", q:"Is the provided answer correct?<p style=\"margin:4px 0\">Problem: find $f'(x)$ for $f(x) = x^3\\arcsin(x)$.</p><p style=\"margin:4px 0\">Answer: By the product rule, $f'(x) = 3x^2\\arcsin(x) + \\frac{x^3}{\\sqrt{1-x^2}}$.</p>", opts:[
      ["Yes, the solution is correct",1,"$\\frac{d}{dx}x^3 = 3x^2$ and $\\frac{d}{dx}\\arcsin(x) = \\frac{1}{\\sqrt{1-x^2}}$, combined with the product rule."],
      ["No, the solution is not correct",0,"Both pieces of the product rule are there, with the right table entry."]]},
    {id:"L15.q9", ref:"p. 2", q:"Let $g(x) = \\int_3^x \\cot(t)\\,dt$. Then $g'(x) =$", opts:[
      ["$\\cot(x)$",1,"By the Fundamental Theorem of Calculus, the derivative of $\\int_a^x f(t)\\,dt$ is $f(x)$."],
      ["$\\cot(x) - \\cot(3)$",0,"The lower limit is a constant, so it does not show up in $g'$."],
      ["$-\\csc^2(x)$",0,"That differentiates $\\cot$ again. FTC just gives back the integrand."],
      ["$\\cot(t)$",0,"The answer must be in terms of $x$."]]},
    {id:"L15.q10", ref:"p. 3", multi:true, q:"Which of these are antiderivatives of $\\frac{1}{\\sqrt{1-x^2}}$? Select all that apply.", opts:[
      ["$\\arcsin(x)$",1,"From the table on p. 3."],
      ["$\\arcsin(x) + 7$",1,"Adding a constant does not change the derivative."],
      ["$-\\arccos(x)$",1,"$\\frac{d}{dx}\\left(-\\arccos(x)\\right) = -\\left(-\\frac{1}{\\sqrt{1-x^2}}\\right) = \\frac{1}{\\sqrt{1-x^2}}$."],
      ["$\\arccos(x)$",0,"Its derivative is $-\\frac{1}{\\sqrt{1-x^2}}$, the wrong sign."]]},
    {id:"L15.q11", ref:"p. 1", q:"$\\frac{d}{dx}\\csc(x^2+1) =$", opts:[
      ["$-\\csc(x^2+1)\\cot(x^2+1)\\cdot(2x)$",1,"Table entry for csc, then the chain rule factor $2x$ (p. 1)."],
      ["$-\\csc(x^2+1)\\cot(x^2+1)$",0,"Missing the chain rule factor $2x$."],
      ["$\\csc(x^2+1)\\cot(x^2+1)\\cdot(2x)$",0,"Missing the minus sign from the table."],
      ["$-\\csc^2(x^2+1)\\cdot(2x)$",0,"That pattern is the derivative of $\\cot$, not $\\csc$."]]},
    {id:"L15.q12", ref:"pp. 2 to 3", q:"$\\int \\left(3\\cos(x) - \\frac{2}{1+x^2}\\right)dx =$", opts:[
      ["$3\\sin(x) - 2\\arctan(x) + C$",1,"Each term from the tables, with one $+ C$."],
      ["$-3\\sin(x) - 2\\arctan(x) + C$",0,"$\\int \\cos(x)\\,dx = \\sin(x) + C$, with no minus sign."],
      ["$3\\sin(x) - 2\\ln(1+x^2) + C$",0,"$\\frac{1}{1+x^2}$ integrates to $\\arctan(x)$, not a log."],
      ["$3\\sin(x) - 2\\arctan(x)$",0,"Missing $+ C$."]]}
  ],
  steps:[
    {type:"read", title:"The trig derivative table", body:`<p>These six derivatives are on p. 1. You need them memorized for the midterm.</p>$$\\begin{aligned}\\frac{d}{dx}\\sin(x) &= \\cos(x) \\\\ \\frac{d}{dx}\\cos(x) &= -\\sin(x) \\\\ \\frac{d}{dx}\\tan(x) &= \\sec^2(x) \\\\ \\frac{d}{dx}\\cot(x) &= -\\csc^2(x) \\\\ \\frac{d}{dx}\\sec(x) &= \\sec(x)\\tan(x) \\\\ \\frac{d}{dx}\\csc(x) &= -\\csc(x)\\cot(x)\\end{aligned}$$<div class="box note"><b class="t">A way to remember them</b>Take the rule for sin, tan or sec, swap every function for its "co" partner (sin and cos, tan and cot, sec and csc), and add a minus sign. That gives the rule for cos, cot or csc. So you only need to learn sin, tan and sec.</div><p class="muted small">Review question 3 (p. 1): $\\arcsin\\left(\\frac{\\sqrt{3}}{2}\\right) = \\frac{\\pi}{3}$ and $\\arccos\\left(-\\frac{1}{2}\\right) = \\frac{2\\pi}{3}$.</p>`, ref:"p. 1"},
    {type:"explore", title:"See the table on a graph", fig:"slope", body:`<p>The derivative at a point is the slope of the tangent line there. The bottom graph is the formula from the table. If the table is right, the dot on the bottom graph sits at the height of the slope on top.</p><p><b>Try it.</b> With tan, drag the point to $x = 0$: the slope is 1, and $\\sec^2(0) = 1$. Drag it toward 1.2 and watch $\\sec^2(x)$ shoot up. Then switch to arccos and check that every slope is negative, which is where the minus sign in its derivative comes from.</p>`, ref:"pp. 1 to 2"},
    {type:"example", title:"Chain rule with csc", ex:{q:"Find the derivative of $f(x) = \\csc(x^2+1)$.", ref:"p. 1",
      steps:[{t:"The outside function is $\\csc(u)$ and the inside is $u = x^2+1$, so $u' = 2x$.",why:"Chain rule: outside, then inside."},
        {t:"From the table, $\\frac{d}{du}\\csc(u) = -\\csc(u)\\cot(u)$.",why:"Keep the minus sign: csc is a co-function."},
        {t:"$f'(x) = -\\csc(x^2+1)\\cot(x^2+1)\\cdot(2x)$.",why:"Evaluate the outside derivative at $x^2+1$ and multiply by $2x$. This is the answer in the notes."}],
      ans:"$f'(x) = -\\csc(x^2+1)\\cot(x^2+1)\\cdot(2x)$"}},
    {type:"try", title:"Your turn: trig derivatives", gen:"L15.g.trigderiv", diff:2},
    {type:"example", title:"Where $\\ln(|\\sec(x)+\\tan(x)|)$ comes from", ex:{q:"Find the derivative of $g(x) = \\ln(|\\sec(x)+\\tan(x)|) + C$.", ref:"p. 1",
      steps:[{t:"$g'(x) = \\frac{1}{|\\sec(x)+\\tan(x)|}\\cdot\\frac{\\sec(x)+\\tan(x)}{|\\sec(x)+\\tan(x)|}\\cdot\\left(\\sec(x)\\tan(x) + \\sec^2(x)\\right) + 0$",why:"Chain rule three times: $\\frac{d}{du}\\ln(u) = \\frac{1}{u}$, then $\\frac{d}{du}|u| = \\frac{u}{|u|}$, then the derivative of the inside. The constant $C$ gives 0."},
        {t:"$= \\frac{1}{|\\sec(x)+\\tan(x)|^2}\\cdot(\\sec(x)+\\tan(x))\\cdot(\\tan(x)+\\sec(x))\\sec(x)$",why:"Factor $\\sec(x)$ out of the last bracket."},
        {t:"$= \\frac{(\\sec(x)+\\tan(x))^2}{(\\sec(x)+\\tan(x))^2}\\cdot\\sec(x)$",why:"$|u|^2 = u^2$, so the bars go away."},
        {t:"$= \\sec(x)$",why:"So $\\ln(|\\sec(x)+\\tan(x)|) + C$ is the antiderivative of $\\sec(x)$."}],
      ans:"$g'(x) = \\sec(x)$"}},
    {type:"explore", title:"Why the bars stay", fig:"abs", body:`<p>The antiderivatives of tan, sec and csc on p. 2 are logs of absolute values. ln only accepts positive inputs. $\\sec(x)$ is negative whenever $\\cos(x)$ is, so without the bars the formula would not exist on half of the real line. With the bars it works everywhere $\\tan(x)$ does.</p><p>It is the same reason $\\int \\frac{1}{x}\\,dx = \\ln(|x|) + C$ (review question 2, p. 1).</p><p><b>Try it.</b> Drag the point into a shaded interval, for example $x = 2.5$. $\\sec(x)$ is negative there, but the curve still exists and the slope of its tangent is still $\\tan(x)$.</p>`, ref:"pp. 1 to 2"},
    {type:"read", title:"The trig antiderivative table", body:`<p>Read the derivative table backwards to get these (p. 2). Every one ends in $+ C$.</p>$$\\begin{aligned}\\int \\sin(x)\\,dx &= -\\cos(x) + C \\\\ \\int \\cos(x)\\,dx &= \\sin(x) + C \\\\ \\int \\sec^2(x)\\,dx &= \\tan(x) + C \\\\ \\int \\csc^2(x)\\,dx &= -\\cot(x) + C \\\\ \\int \\sec(x)\\tan(x)\\,dx &= \\sec(x) + C \\\\ \\int \\csc(x)\\cot(x)\\,dx &= -\\csc(x) + C\\end{aligned}$$<p>Three more do not come from reading the table backwards. You have to memorize them:</p>$$\\begin{aligned}\\int \\tan(x)\\,dx &= \\ln(|\\sec(x)|) + C \\\\ \\int \\sec(x)\\,dx &= \\ln(|\\sec(x)+\\tan(x)|) + C \\\\ \\int \\csc(x)\\,dx &= -\\ln(|\\csc(x)+\\cot(x)|) + C\\end{aligned}$$<div class="box warn"><b class="t">Marks you can lose</b>Missing $dx$, missing $+ C$, and dropping the absolute value bars inside ln all cost marks on quizzes.</div>`, ref:"p. 2"},
    {type:"mcq", title:"Check yourself", q:"Which are correct? Select all that apply.", multi:true, opts:[
      ["$\\int \\sec(x)\\tan(x)\\,dx = \\sec(x) + C$",true,"Because $\\frac{d}{dx}\\sec(x) = \\sec(x)\\tan(x)$."],
      ["$\\int \\csc^2(x)\\,dx = \\cot(x) + C$",false,"$\\frac{d}{dx}\\cot(x) = -\\csc^2(x)$, so the answer is $-\\cot(x) + C$."],
      ["$\\int \\tan(x)\\,dx = \\ln(|\\sec(x)|) + C$",true,"From the table on p. 2."],
      ["$\\int \\tan(x)\\,dx = \\sec^2(x) + C$",false,"$\\sec^2(x)$ is the derivative of $\\tan(x)$, not its antiderivative."]],
      after:"To check any antiderivative, differentiate it and see if you get back the integrand."},
    {type:"read", title:"Inverse trig: derivatives and integrals", body:`<p>The derivatives of the inverse trig functions are on p. 2:</p>$$\\begin{aligned}\\frac{d}{dx}\\arcsin(x) &= \\frac{1}{\\sqrt{1-x^2}} \\\\ \\frac{d}{dx}\\arccos(x) &= -\\frac{1}{\\sqrt{1-x^2}} \\\\ \\frac{d}{dx}\\arctan(x) &= \\frac{1}{1+x^2}\\end{aligned}$$<p>Read backwards, they give three integrals (p. 3):</p>$$\\begin{aligned}\\int \\frac{1}{\\sqrt{1-x^2}}\\,dx &= \\arcsin(x) + C \\\\ \\int \\frac{-1}{\\sqrt{1-x^2}}\\,dx &= \\arccos(x) + C \\\\ \\int \\frac{1}{1+x^2}\\,dx &= \\arctan(x) + C\\end{aligned}$$<p>The derivatives of arcsin and arccos differ only by a minus sign. That makes sense: arccos is decreasing, so its slope is always negative.</p>`, ref:"pp. 2 to 3"},
    {type:"example", title:"Chain rule with arccos", ex:{q:"Let $f(x) = \\arccos(e^x)$. Find $f'(x)$.", ref:"p. 2",
      steps:[{t:"The inside is $u = e^x$, so $u' = e^x$.",why:"Chain rule."},
        {t:"$f'(x) = -\\frac{1}{\\sqrt{1-(e^x)^2}}\\cdot e^x$",why:"The arccos row of the table, evaluated at $e^x$, times $u'$."},
        {t:"$= -\\frac{e^x}{\\sqrt{1-e^{2x}}}$",why:"$(e^x)^2 = e^{2x}$. This is the answer in the notes."}],
      ans:"$f'(x) = -\\frac{e^x}{\\sqrt{1-e^{2x}}}$"}},
    {type:"try", title:"Your turn: inverse trig derivatives", gen:"L15.g.invderiv", diff:2},
    {type:"explore", title:"A definite integral that gives an angle", fig:"area", body:`<div class="box"><b class="t">Example (p. 3)</b>$$\\begin{aligned}\\int_0^{1/2} \\frac{1}{\\sqrt{1-t^2}}\\,dt &= \\arcsin(t)\\Big|_0^{1/2} \\\\ &= \\arcsin\\left(\\frac{1}{2}\\right) - \\arcsin(0) \\\\ &= \\frac{\\pi}{6} - 0 = \\frac{\\pi}{6}\\end{aligned}$$</div><p>The area under the curve is a net change, so it equals the change in an antiderivative.</p><p><b>Try it.</b> With $b = 0.50$ the readout shows 0.5236, which is $\\frac{\\pi}{6}$, and the rectangle sum agrees. Switch to $\\frac{1}{1+x^2}$ and set $b = 2$: that is the p. 3 exercise, $\\int_0^2 \\frac{1}{1+x^2}\\,dx = \\arctan(2) \\approx 1.1071$.</p>`, ref:"p. 3"},
    {type:"mcq", title:"More than one antiderivative", q:"Which of these are antiderivatives of $\\frac{1}{1+x^2}$? Select all that apply.", multi:true, opts:[
      ["$\\arctan(x) + 5$",true,"Any constant can be added."],
      ["$\\arctan(x) - \\frac{\\pi}{2}$",true,"$-\\frac{\\pi}{2}$ is just a constant."],
      ["$\\ln(1+x^2)$",false,"Its derivative is $\\frac{2x}{1+x^2}$."],
      ["$-\\frac{1}{x}$",false,"That would come from $\\frac{1}{x^2}$, not $\\frac{1}{1+x^2}$."]]},
    {type:"try", title:"Initial value problem", gen:"L15.g.ivp", diff:2},
    {type:"try", title:"Find the mistake", gen:"L15.g.error", diff:2},
    {type:"formulas", title:"Lecture 15 formulas"}
  ]
});
})();
