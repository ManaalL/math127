/* Lecture 9 (Mon Sept 28): Inverse functions: definition on an interval, horizontal line test, finding an inverse, domain and range of the inverse, cancellation properties. Sections 2.3.1, 2.3.2. Notes: 6 pages. */
(function(){
const M=M127;
const fmt=(v,dp=3)=>String(+(+v).toFixed(dp)).replace("-","−");
const lines=arr=>arr.map((t,i)=>`$$${t}\\qquad (${i+1})$$`).join("");
const PI=Math.PI;
/* angles as multiples of pi/12 */
const piT=k=>{ if(k===0) return "0"; const g=M.gcd(k,12); let p=k/g; const q=12/g; const s=p<0?"-":""; p=Math.abs(p); const num=p===1?"\\pi":`${p}\\pi`; return q===1?`${s}${num}`:`${s}\\frac{${num}}{${q}}`; };
const piA=k=>k===0?"0":`${k}*pi/12`;
const toK=x=>Math.round(x*12/PI);
const VAL=[[1,"1","1"],[Math.sqrt(3)/2,"\\frac{\\sqrt{3}}{2}","sqrt(3)/2"],[Math.SQRT2/2,"\\frac{\\sqrt{2}}{2}","sqrt(2)/2"],[0.5,"\\frac{1}{2}","1/2"],[0,"0","0"]];
const valT=v=>{ for(const r of VAL){ if(Math.abs(Math.abs(v)-r[0])<1e-9) return (v<0&&r[0]!==0?"-":"")+r[1]; } return fmt(v); };
const valA=v=>{ for(const r of VAL){ if(Math.abs(Math.abs(v)-r[0])<1e-9) return (v<0&&r[0]!==0?"-":"")+r[2]; } return String(v); };
const niceK=k=>k%2===0||k%3===0;
const TRIG={
  sinA:{f:Math.sin,fn:"\\sin",lo:-6,hi:6,I:"\\left[-\\frac{\\pi}{2},\\frac{\\pi}{2}\\right]"},
  sinB:{f:Math.sin,fn:"\\sin",lo:6,hi:18,I:"\\left[\\frac{\\pi}{2},\\frac{3\\pi}{2}\\right]"},
  cosA:{f:Math.cos,fn:"\\cos",lo:0,hi:12,I:"[0,\\pi]"},
  cosB:{f:Math.cos,fn:"\\cos",lo:12,hi:24,I:"[\\pi,2\\pi]"}
};
const solveIn=(T,v)=>{ for(let k=T.lo;k<=T.hi;k++) if(niceK(k)&&Math.abs(T.f(k*PI/12)-v)<1e-9) return k; return null; };
const decoy=(T,v)=>{ for(let k=-12;k<=24;k++) if(niceK(k)&&(k<T.lo||k>T.hi)&&Math.abs(T.f(k*PI/12)-v)<1e-9) return k; return null; };
const fr=(n,d)=>M.frac(n,d);

M.lecture({
  id:"L09", n:9, date:"2026-09-28", added:"2026-10-21", unit:"u3", quiz:"Q4",
  title:"Inverse Functions", sections:["2.3.1","2.3.2"], pages:6,
  summary:"What it means for a function to be invertible on an interval, the horizontal line test, how to find an inverse without swapping variable names, the domain and range of an inverse, and when $f^{-1}(f(x))=x$ is allowed.",
  flags:[
    {ref:"p. 4", text:"The notes ask \"Why can we just plug in the end points of the interval $I$?\" and answer \"It can't!!!! If it did, it wouldn't pass the horizontal line test.\" Words are missing. The point is: a continuous function that is invertible on $[a,b]$ cannot turn around between $a$ and $b$. If it did, some horizontal line would cross its graph twice. So its values run from $f(a)$ to $f(b)$, and the endpoints give the whole domain of $f^{-1}$."},
    {ref:"p. 4", text:"The boxed rule says \"If $f$ is continuous on $I=[a,b]$\". It also needs $f$ to be invertible on $I$ (this is assumed on p. 3). For example $x^2$ is continuous on $[-1,2]$, the endpoints give $[1,4]$, but the values of $x^2$ there fill $[0,4]$."}
  ],
  formulas:[
    {id:"L09.f.def", name:"Inverse on an interval (definition)", tex:"g(y)=x \\iff f(x)=y \\quad \\text{for all } x \\text{ in } I, \\qquad g=f^{-1}", note:"If no interval is given, $I$ is the domain of $f$.", ref:"p. 1"},
    {id:"L09.f.notation", name:"Notation warning", tex:"f^{-1} \\ne \\frac{1}{f}", note:"$f^{-1}$ means the inverse of $f$.", ref:"p. 1"},
    {id:"L09.f.swap", name:"Inverse swaps the variables", tex:"f(x)=y \\iff f^{-1}(y)=x", ref:"p. 1",
      blank:{tex:"f(x)=y \\iff f^{-1}(y)=\\boxed{\\,?\\,}", text:true, accept:["x"]}},
    {id:"L09.f.hlt", name:"Horizontal Line Test", tex:"\\text{invertible on } I \\iff \\text{every horizontal line crosses the graph over } I \\text{ at most once}", note:"The notes state it as \"invertible if every horizontal line crosses at most once\". It works because $f^{-1}$ swaps the variables, so a second crossing would make $f^{-1}$ fail the vertical line test.", ref:"p. 2"},
    {id:"L09.f.find", name:"Finding an inverse (example)", tex:"V=2t^3+1 \\;\\Rightarrow\\; t=v^{-1}(V)=\\sqrt[3]{\\frac{V-1}{2}}", note:"Solve for the independent variable. Do not swap the variable names.", ref:"p. 3",
      blank:{tex:"v(t)=2t^3+1 \\;\\Rightarrow\\; v^{-1}(V)=\\boxed{\\,?\\,}", answer:"((V-1)/2)^(1/3)", vars:["V"], domain:[1.5,9]}},
    {id:"L09.f.domran", name:"Domain and range of $f^{-1}$", tex:"\\text{dom}(f^{-1})=\\{f(x): x \\text{ in } I\\}, \\qquad \\text{ran}(f^{-1})=I", note:"The domain of $f^{-1}$ is the range of $f$ restricted to $I$.", ref:"pp. 3 to 4",
      blank:{tex:"\\text{ran}(f^{-1})=\\boxed{\\,?\\,}", text:true, accept:["I"]}},
    {id:"L09.f.domab", name:"Domain of $f^{-1}$ on $[a,b]$", tex:"\\text{dom}(f^{-1})=[f(a),f(b)] \\ \\text{ or } \\ [f(b),f(a)]", note:"For $f$ continuous and invertible on $I=[a,b]$. Use whichever order puts the smaller number first.", ref:"p. 4"},
    {id:"L09.f.cancel1", name:"Cancellation property 1", tex:"(f^{-1}\\circ f)(x)=f^{-1}(f(x))=x \\quad \\text{for all } x \\text{ in } I", ref:"p. 5",
      blank:{tex:"f^{-1}(f(x))=x \\quad \\text{for all } x \\text{ in } \\boxed{\\,?\\,}", text:true, accept:["I"]}},
    {id:"L09.f.cancel2", name:"Cancellation property 2", tex:"(f\\circ f^{-1})(y)=f(f^{-1}(y))=y \\quad \\text{for all } y \\text{ with } f(x)=y \\text{ for some } x \\text{ in } I", ref:"p. 5"},
    {id:"L09.f.cancel-q", name:"When does it cancel?", tex:"\\text{Cancel only if the input is in the range of the outside function}", note:"For $f^{-1}(f(x))$: is $x$ in $I$? For $f(f^{-1}(y))$: is $y$ in the range of $f$ on $I$? If not, evaluate by hand.", ref:"p. 6"},
    {id:"L09.f.arccos", name:"arccos", tex:"\\arccos = \\text{the inverse of } \\cos \\text{ on } I=[0,\\pi]", note:"Its domain is $[-1,1]$ and its range is $[0,\\pi]$.", ref:"pp. 5 to 6",
      blank:{tex:"\\arccos \\text{ is the inverse of } \\cos \\text{ on } \\boxed{\\,?\\,}", text:true, accept:["[0,π]","[0,pi]","[0,\\pi]"]}}
  ],
  glossary:[
    {id:"L09.t.invertible", term:"Invertible on an interval", def:"$f$ is invertible on $I$ if there is a function $g$ with $g(y)=x$ exactly when $f(x)=y$, for all $x$ in $I$. Then $g$ is the inverse of $f$ on $I$.", ref:"p. 1"},
    {id:"L09.t.inverse", term:"Inverse $f^{-1}$", def:"The function that undoes $f$: it takes an output $y$ of $f$ and returns the input $x$ that produced it. It is not $\\frac{1}{f}$.", ref:"p. 1"},
    {id:"L09.t.hlt", term:"Horizontal line test", def:"$f$ is invertible on $I$ if every horizontal line crosses its graph over $I$ at most once.", ref:"p. 2"},
    {id:"L09.t.vlt", term:"Vertical line test", def:"A graph is a function of the horizontal variable if every vertical line crosses it at most once. Swapping the axes turns the horizontal line test into this one.", ref:"p. 2"},
    {id:"L09.t.noswap", term:"Do not swap the variable names", def:"To find $f^{-1}$, solve $y=f(x)$ for $x$ and write $f^{-1}(y)$. In science the letters mean something ($V$ is velocity, $t$ is time), so they stay.", ref:"p. 3"},
    {id:"L09.t.dom", term:"Domain of $f^{-1}$", def:"Every value $f(x)$ you get from $x$ in $I$: the range of $f$ restricted to $I$.", ref:"p. 3"},
    {id:"L09.t.ran", term:"Range of $f^{-1}$", def:"The interval $I$ itself.", ref:"p. 3"},
    {id:"L09.t.cancel", term:"Cancellation properties", def:"$f^{-1}(f(x))=x$ for $x$ in $I$, and $f(f^{-1}(y))=y$ for $y$ in the range of $f$ on $I$. Outside those, work it out by hand.", ref:"p. 5"},
    {id:"L09.t.arccos", term:"arccos", def:"The inverse of $\\cos$ on $[0,\\pi]$. $\\arccos(y)$ is the angle in $[0,\\pi]$ whose cosine is $y$.", ref:"pp. 5 to 6"}
  ],
  figures:{
    hlt:{title:"The horizontal line test", cap:"<b>Fig. 9.1</b> The bold part of the graph is $f$ on $I=[a,b]$. Move the horizontal line and count how often it crosses the bold part. If some line crosses twice, $f$ is not invertible on $I$. (Lecture 9, p. 2)",
      build(host,{PLOT}){
        const FN={
          sq:{f:x=>x*x,lab:"x²",x:[-3,3],y:[-1,9],a:-2,b:2,c:2.5},
          sqm:{f:x=>x*x-2,lab:"x² − 2",x:[-3,3],y:[-3,7],a:-3,b:0,c:1},
          cub:{f:x=>x**3+x,lab:"x³ + x",x:[-2,2],y:[-10,10],a:-2,b:2,c:3},
          cos:{f:Math.cos,lab:"cos(x)",x:[-0.5,6.8],y:[-1.5,1.5],a:0,b:6.28,c:0.4,pi:true}
        };
        let key="sq", a, b, c;
        const plot=document.createElement("div"); host.append(plot);
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Function",items:[["sq","x²"],["sqm","x² − 2"],["cub","x³ + x"],["cos","cos(x)"]],value:key,onchange:v=>{ key=v; setup(); }});
        const sa=PLOT.slider(ctl,{label:"Left end a",min:-3,max:7,step:0.05,value:-2,fmt:v=>fmt(v,2),oninput:v=>{ a=Math.min(v,b-0.1); draw(); }});
        const sb=PLOT.slider(ctl,{label:"Right end b",min:-3,max:7,step:0.05,value:2,fmt:v=>fmt(v,2),oninput:v=>{ b=Math.max(v,a+0.1); draw(); }});
        const sc=PLOT.slider(ctl,{label:"Horizontal line y = c",min:-10,max:10,step:0.05,value:2.5,fmt:v=>fmt(v,2),oninput:v=>{ c=v; draw(); }});
        const ro=PLOT.readout(host);
        let G, bold, hl, sI, dots=[];
        function setup(){
          const F=FN[key]; a=F.a; b=F.b; c=F.c;
          [[sa,F.x],[sb,F.x]].forEach(([s,r])=>{ s.min=r[0]; s.max=r[1]; });
          sc.min=F.y[0]; sc.max=F.y[1];
          sa.set(a); sb.set(b); sc.set(c);
          plot.innerHTML="";
          G=PLOT.graph(plot,{x:F.x,y:F.y,c:"var(--u3)",xlabel:"x",ylabel:"y",piX:!!F.pi});
          G.fn(F.f,{cls:"lt dash"});
          bold=G.fn(F.f,{cls:"cv c",width:3.2});
          hl=G.line(F.x[0],c,F.x[1],c,{cls:"tan dash"});
          sI=G.line(a,0,b,0,{cls:"tan"}); sI.style.strokeWidth=5; sI.style.strokeLinecap="round";
          dots=[];
          draw();
        }
        function draw(){
          const F=FN[key]; bold.update(F.f,a,b); hl.set(F.x[0],c,F.x[1],c); sI.set(a,0,b,0);
          dots.forEach(d=>d.remove()); dots=[];
          const N=600; let prev=F.f(a)-c;
          for(let i=1;i<=N;i++){ const x=a+(b-a)*i/N, v=F.f(x)-c; if(prev===0||prev*v<0||(i===N&&Math.abs(v)<1e-9)){ dots.push(G.dot(x,c,{filled:true})); } prev=v; }
          let inc=true, dec=true; for(let i=1;i<=N;i++){ const x0=a+(b-a)*(i-1)/N, x1=a+(b-a)*i/N; if(F.f(x1)<=F.f(x0)) inc=false; if(F.f(x1)>=F.f(x0)) dec=false; }
          const ok=inc||dec, n=dots.length;
          ro.innerHTML=`f(x) = ${F.lab} on I = [${fmt(a,2)}, ${fmt(b,2)}] &nbsp; the line y = ${fmt(c,2)} crosses <b>${n}</b> time${n===1?"":"s"}<br>${ok?`f is ${inc?"increasing":"decreasing"} on I, so every horizontal line crosses at most once: <b>invertible on I</b>`:`f turns around inside I, so some horizontal line crosses twice: <b>not invertible on I</b>`}`;
        }
        setup();
      }},
    domran:{title:"Domain and range of the inverse", cap:"<b>Fig. 9.2</b> $f$ on the interval $I$ (bold). The range of $f^{-1}$ is $I$ on the horizontal axis. The domain of $f^{-1}$ is the set of heights $f$ reaches on $I$, on the vertical axis. (Lecture 9, pp. 3 to 5)",
      build(host,{PLOT}){
        const FN={
          hair:{f:a=>140-3000/(60-a),I:[0,30],x:[-3,34],y:[-8,100],name:"B(a) = 140 − 3000/(60 − a)",v:"a",fv:"B",x0:10},
          exp:{f:x=>Math.exp(x)-x,I:[-5,0],x:[-5.8,1.2],y:[-0.6,6.2],name:"f(x) = eˣ − x",v:"x",fv:"f",x0:-2},
          sq:{f:x=>x*x-2,I:[-3,0],x:[-3.6,1.6],y:[-3,8],name:"f(x) = x² − 2 (I = (−∞, 0] cut at −3)",v:"x",fv:"f",x0:-1.5}
        };
        let key="hair";
        const plot=document.createElement("div"); host.append(plot);
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Example",items:[["hair","Hair, p. 5"],["exp","eˣ − x, p. 4"],["sq","x² − 2, p. 6"]],value:key,onchange:v=>{ key=v; build(); }});
        const ro=PLOT.readout(host);
        function build(){
          plot.innerHTML="";
          const F=FN[key], [A,B]=F.I, fa=F.f(A), fb=F.f(B), lo=Math.min(fa,fb), hi=Math.max(fa,fb);
          const G=PLOT.graph(plot,{x:F.x,y:F.y,c:"var(--u3)",xlabel:F.v,ylabel:F.fv});
          const ax=Math.min(Math.max(0,F.x[0]),F.x[1]);
          G.fn(F.f,{cls:"lt dash",from:F.x[0],to:Math.min(F.x[1],key==="hair"?59:F.x[1])});
          G.fn(F.f,{cls:"cv c",width:3,from:A,to:B});
          const sx=G.line(A,0,B,0,{cls:"tan"}); sx.style.strokeWidth=6; sx.style.strokeLinecap="round";
          const sy=G.line(ax,lo,ax,hi,{cls:"tan"}); sy.style.strokeWidth=6; sy.style.strokeLinecap="round";
          G.line(A,0,A,fa,{cls:"lt dash"}); G.line(B,0,B,fb,{cls:"lt dash"});
          G.line(ax,fa,A,fa,{cls:"lt dash"}); G.line(ax,fb,B,fb,{cls:"lt dash"});
          G.label(A,0,"range of f⁻¹ = I",{cls:"lblc",dx:4,dy:-8});
          G.label(ax,hi,"domain of f⁻¹",{cls:"lblc",dx:8,dy:-4});
          const hx=G.line(0,0,0,0,{cls:"lt"}), hy=G.line(0,0,0,0,{cls:"lt"});
          const upd=x=>{ const y=F.f(x); hx.set(x,0,x,y); hy.set(ax,y,x,y);
            ro.innerHTML=`${F.name} on I = [${fmt(A)}, ${fmt(B)}] &nbsp; domain of ${F.fv}⁻¹ = <b>[${fmt(lo,4)}, ${fmt(hi,4)}]</b> &nbsp; range of ${F.fv}⁻¹ = <b>[${fmt(A)}, ${fmt(B)}]</b><br>${F.fv}(${fmt(x,2)}) = ${fmt(y,2)} &nbsp;⟺&nbsp; ${F.fv}⁻¹(${fmt(y,2)}) = ${fmt(x,2)}`; };
          G.handle(F.x0,F.f(F.x0),{f:F.f,bounds:[A,B],label:"Point on the graph",onMove:upd}); upd(F.x0);
        }
        build();
      }},
    cancel:{title:"When the inverse cancels", cap:"<b>Fig. 9.3</b> The solid curve is $y=f^{-1}(f(x))$ and the dashed line is $y=x$. They agree only on the interval $I$ (marked on the axis). Outside $I$ you have to work it out by hand. (Lecture 9, pp. 5 to 6)",
      build(host,{PLOT}){
        const FN={
          sq:{g:x=>-Math.abs(x),f:x=>x*x-2,fi:y=>-Math.sqrt(y+2),I:[-4.2,0],x:[-4,4],y:[-4.2,4.2],lab:"f(x) = x² − 2 on (−∞, 0], f⁻¹(y) = −√(y + 2)",x0:2,pi:false},
          cos:{g:x=>Math.acos(Math.cos(x)),f:Math.cos,fi:Math.acos,I:[0,PI],x:[-2*PI,2*PI],y:[-1.5,4],lab:"cos on [0, π], inverse arccos",x0:2*PI,pi:true}
        };
        let key="sq";
        const plot=document.createElement("div"); host.append(plot);
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Function",items:[["sq","x² − 2 (p. 6)"],["cos","cos and arccos (p. 6)"]],value:key,onchange:v=>{ key=v; build(); }});
        const ro=PLOT.readout(host);
        function build(){
          plot.innerHTML="";
          const F=FN[key];
          const G=PLOT.graph(plot,{x:F.x,y:F.y,c:"var(--u3)",xlabel:"x",ylabel:"y",piX:F.pi});
          G.fn(x=>x,{cls:"lt dash"});
          const sI=G.line(Math.max(F.I[0],F.x[0]),0,F.I[1],0,{cls:"tan"}); sI.style.strokeWidth=6; sI.style.strokeLinecap="round";
          G.label(F.I[1],0,"I",{cls:"lblc",dx:-14,dy:16});
          G.fn(F.g,{cls:"cv c"});
          const upd=x=>{ const y=F.f(x), back=F.g(x), inI=x>=F.I[0]-1e-9&&x<=F.I[1]+1e-9;
            ro.innerHTML=`${F.lab}<br>x = ${fmt(x,3)} &nbsp; f(x) = ${fmt(y,3)} &nbsp; f⁻¹(f(x)) = <b>${fmt(back,3)}</b> &nbsp; ${inI?"x is in I, so it cancels":"x is not in I, so it does <b>not</b> cancel"}`; };
          G.handle(F.x0,F.g(F.x0),{f:F.g,bounds:F.x,label:"Input x",onMove:upd}); upd(F.x0);
        }
        build();
      }}
  },
  gens:[
    {id:"L09.g.eval-inv", title:"Evaluate $f^{-1}$ without a formula", skill:"Find $f^{-1}(c)$ by asking which $x$ gives $f(x)=c$", ref:"pp. 1 to 2",
      gen(R,d){
        if(d===1){
          const F=R.pick([
            {t:"x^3+x",f:x=>x**3+x,ks:[-2,-1,0,1,2,3]},
            {t:"x^3+2x+1",f:x=>x**3+2*x+1,ks:[-2,-1,0,1,2]},
            {t:"x^3+x^2+x+1",f:x=>x**3+x*x+x+1,ks:[-2,-1,0,1,2]},
            {t:"\\frac{1}{3}x^3+x-1",f:x=>x**3/3+x-1,ks:[-3,0,3]},
            {t:"2x^5+x-1",f:x=>2*x**5+x-1,ks:[-1,0,1]},
            {t:"x^3+4x-2",f:x=>x**3+4*x-2,ks:[-1,0,1,2]}]);
          const k=R.pick(F.ks), c=F.f(k);
          return {prompt:`Given that $f(x)=${F.t}$ is invertible on $(-\\infty,\\infty)$, what is $f^{-1}(${c})$?`, answer:{type:"num",answer:String(k)}, verify:{value:k},
            hint:"$f^{-1}("+c+")=x$ means $f(x)="+c+"$. Try small whole numbers for $x$.",
            steps:[`By definition, $f^{-1}(${c})=x$ if and only if $f(x)=${c}$.`,`Try small numbers: $f(${k})=${F.t.replace(/x/g,`(${k})`)}=${c}$.`,`So $f^{-1}(${c})=${k}$. Because $f$ is invertible, no other $x$ gives ${c}.`],
            answerTeX:`$f^{-1}(${c})=${k}$`};
        }
        if(d===2){
          const r1=R.int(-3,4), gap=R.int(2,6), side=R.pick(["right","left"]);
          const r2=side==="right"?r1-gap:r1+gap;  // r1 is the root in I
          const y=R.int(-5,8), B=-(r1+r2), C0=r1*r2+y;
          const v2=r1+r2; // twice the vertex
          const m=side==="right"?Math.ceil(v2/2):Math.floor(v2/2);
          const I=side==="right"?`[${m},\\infty)`:`(-\\infty,${m}]`;
          const ft=`x^2${M.term(B,"x",1)}${M.term(C0,"x",0)}`;
          return {prompt:`Given that $f(x)=${ft}$ is invertible on $${I}$, what is $f^{-1}(${y})$?`, answer:{type:"num",answer:String(r1)}, verify:{value:r1},
            hint:"Solve $f(x)="+y+"$. You will get two solutions. Only one of them is in the interval.",
            steps:[`$f^{-1}(${y})=x$ means $f(x)=${y}$ with $x$ in $${I}$.`,`$${ft}=${y}$ gives $x^2${M.term(B,"x",1)}${M.term(C0-y,"x",0)}=0$, so $(x${M.term(-r1,"x",0)})(x${M.term(-r2,"x",0)})=0$.`.replace("(x)","(x)"),`So $x=${r1}$ or $x=${r2}$. Only $x=${r1}$ is in $${I}$.`,`$f^{-1}(${y})=${r1}$.`],
            answerTeX:`$f^{-1}(${y})=${r1}$`};
        }
        const T=TRIG[R.pick(Object.keys(TRIG))];
        let v, k; do{ v=R.pick([0,0.5,-0.5,Math.SQRT2/2,-Math.SQRT2/2,Math.sqrt(3)/2,-Math.sqrt(3)/2,1,-1]); k=solveIn(T,v); } while(k===null);
        const dk=decoy(T,v);
        return {prompt:`Given that $f(x)=${T.fn}(x)$ is invertible on $${T.I}$, what is $f^{-1}\\left(${valT(v)}\\right)$?`, answer:{type:"num",answer:piA(k)}, verify:{value:k*PI/12},
          hint:"Find the angle $x$ in the interval with $"+T.fn+"(x)="+valT(v)+"$. There are many angles with this value, but only one is in the interval.",
          steps:[`$f^{-1}\\left(${valT(v)}\\right)=x$ means $${T.fn}(x)=${valT(v)}$ with $x$ in $${T.I}$.`].concat(dk!==null?[`$${T.fn}\\left(${piT(dk)}\\right)=${valT(v)}$, but $${piT(dk)}$ is not in the interval.`]:[]).concat([`$${T.fn}\\left(${piT(k)}\\right)=${valT(v)}$ and $${piT(k)}$ is in $${T.I}$.`,`So $f^{-1}\\left(${valT(v)}\\right)=${piT(k)}$.`]),
          answerTeX:`$${piT(k)}$`};
      }},
    {id:"L09.g.defn", title:"Using the definition", skill:"Read $f(a)=b$ as $f^{-1}(b)=a$", ref:"p. 1",
      gen(R,d){
        const a=R.nz(-6,9), q=R.pick([2,3,4,5,7]), p=R.nz(-9,9);
        const b=fr(p,q), bt=b.includes("frac")?b:b;
        const gname=R.pick(["g","h","f^{-1}"]);
        if(d===1){
          return {prompt:`Assume $f$ is invertible on $(-\\infty,\\infty)$ and $f(${a})=${bt}$. What is $f^{-1}\\left(${bt}\\right)$?`, answer:{type:"num",answer:String(a)}, verify:{value:a},
            hint:"$f(x)=y$ if and only if $f^{-1}(y)=x$.",
            steps:[`$f(x)=y$ if and only if $f^{-1}(y)=x$ (p. 1).`,`Here $x=${a}$ and $y=${bt}$.`,`So $f^{-1}\\left(${bt}\\right)=${a}$.`],
            answerTeX:`$f^{-1}\\left(${bt}\\right)=${a}$`};
        }
        const g=gname==="f^{-1}"?"g":gname;
        let c=R.nz(-6,9); if(c===a) c=a+1;
        let right, opts;
        if(d===2){
          right=`$${g}\\left(${bt}\\right)=${a}$`;
          opts=[right,`$${g}(${a})=${bt}$`,`$f\\left(${bt}\\right)=${a}$`,`$${g}\\left(${bt}\\right)=\\frac{1}{${a}}$`,`$${g}(${a})=\\frac{1}{${bt}}$`];
        } else {
          right=`$f(${c})\\ne ${bt}$`;
          opts=[right,`$${g}(${a})=${bt}$`,`$f\\left(${bt}\\right)=${a}$`,`$${g}(${c})=${a}$`,`$f(${c})=${bt}$ for some other input $${c}$`];
        }
        const sh=R.shuffle(opts);
        return {prompt:`Assume $f$ is invertible on $(-\\infty,\\infty)$ with inverse $${g}$, and $f(${a})=${bt}$. Which statement must be true?`,
          parts:[{answer:{type:"mc",options:sh,correct:sh.indexOf(right)}}],
          hint:"An inverse swaps input and output. And because $f$ is invertible, each output comes from only one input.",
          steps:d===2?[`$f(${a})=${bt}$ means $${g}\\left(${bt}\\right)=${a}$: the inverse sends the output back to the input.`,`$${g}(${a})$ and $f\\left(${bt}\\right)$ are not given by this information. $${g}$ is not $\\frac{1}{f}$ either.`]
            :[`If $f(${c})$ were also $${bt}$, the horizontal line $y=${bt}$ would cross the graph twice, and $f$ would not be invertible. So $f(${c})\\ne${bt}$.`,`The true statement $${g}\\left(${bt}\\right)=${a}$ is not among the options. The others swap input and output in the wrong place.`],
          answerTeX:right};
      }},
    {id:"L09.g.find-inv", title:"Find the inverse", skill:"Solve for the independent variable; keep the variable names", ref:"p. 3",
      gen(R,d){
        if(d===1){
          const kind=R.pick(["lin","lin","cube","mcube"]);
          const m=R.pick([2,3,4,5,-2,-3]), k=R.nz(-9,9);
          if(kind==="lin"){
            const ft=`${m}x${M.term(k,"x",0)}`, num=`y${M.term(-k,"y",0)}`;
            return {prompt:`Find the inverse $f^{-1}(y)$ of $f(x)=${ft}$.`, answer:{answer:`(y-(${k}))/(${m})`,vars:["y"],domain:[-5,5]},
              hint:"Write $y="+ft+"$ and solve for $x$. Keep the names: the answer is a function of $y$.",
              steps:[`$y=${ft}$`,`$${num}=${m}x$`,`$\\frac{${num}}{${m}}=x$`,`Thus $f^{-1}(y)=\\frac{${num}}{${m}}$.`],
              answerTeX:`$f^{-1}(y)=\\frac{${num}}{${m}}$`};
          }
          const mm=kind==="cube"?1:Math.abs(m), ft=`${mm===1?"":mm}x^3${M.term(k,"x",0)}`, num=`y${M.term(-k,"y",0)}`;
          const inner=mm===1?num:`\\frac{${num}}{${mm}}`;
          return {prompt:`Find the inverse $f^{-1}(y)$ of $f(x)=${ft}$.`, answer:{answer:mm===1?`(y-(${k}))^(1/3)`:`((y-(${k}))/${mm})^(1/3)`,vars:["y"],domain:[-6,6]},
            hint:"Get $x^3$ alone, then take the cube root of both sides.",
            steps:[`$y=${ft}$`,mm===1?`$${num}=x^3$`:`$${num}=${mm}x^3$, so $${inner}=x^3$`,`$\\sqrt[3]{${inner}}=\\sqrt[3]{x^3}=x$`,`Thus $f^{-1}(y)=\\sqrt[3]{${inner}}$.`],
            answerTeX:`$f^{-1}(y)=\\sqrt[3]{${inner}}$`};
        }
        if(d===2){
          const kind=R.pick(["sqc","sqc","shift","expanded"]), neg=R.pick([true,false]);
          if(kind==="sqc"){
            const c=R.int(1,9), ft=`x^2-${c}`, I=neg?"(-\\infty,0]":"[0,\\infty)";
            return {prompt:`Find the inverse $f^{-1}(y)$ of $f(x)=${ft}$ on the interval $${I}$.`, answer:{answer:`${neg?"-":""}sqrt(y+${c})`,vars:["y"],domain:[-c+0.2,-c+8]},
              hint:"Solve for $x$. When you take the square root of $x^2$, write $|x|$, then use the interval to remove the bars.",
              steps:[`$y=x^2-${c}$, so $y+${c}=x^2$.`,`$\\sqrt{y+${c}}=\\sqrt{x^2}=|x|$ (property (i)).`,neg?`$\\sqrt{y+${c}}=-x$ since $x\\le0$, so $-\\sqrt{y+${c}}=x$.`:`$\\sqrt{y+${c}}=x$ since $x\\ge0$.`,`Thus $f^{-1}(y)=${neg?"-":""}\\sqrt{y+${c}}$.`],
              answerTeX:`$f^{-1}(y)=${neg?"-":""}\\sqrt{y+${c}}$`};
          }
          const p=R.nz(-5,5), I=neg?`(-\\infty,${-p}]`:`[${-p},\\infty)`;
          const sq=`(x${M.term(p,"x",0)})^2`, ft=kind==="shift"?sq:`x^2${M.term(2*p,"x",1)}+${p*p}`;
          const xp=`x${M.term(p,"x",0)}`;
          return {prompt:`Find the inverse $f^{-1}(y)$ of $f(x)=${ft}$ on the interval $${I}$.`, answer:{answer:`${neg?"-":""}sqrt(y)-(${p})`,vars:["y"],domain:[0.2,8]},
            hint:(kind==="expanded"?"Factor first: it is a perfect square. ":"")+"Then $\\sqrt{(\\cdots)^2}=|\\cdots|$, and the interval tells you the sign.",
            steps:(kind==="expanded"?[`$y=${ft}=${sq}$`]:[`$y=${sq}$`]).concat([`$\\sqrt{y}=|${xp}|$ (property (i)).`,neg?`$\\sqrt{y}=-(${xp})$ since $x\\le${-p}$ means $${xp}\\le0$.`:`$\\sqrt{y}=${xp}$ since $x\\ge${-p}$ means $${xp}\\ge0$.`,neg?`$x=-\\sqrt{y}${M.term(-p,"x",0)}$`:`$x=\\sqrt{y}${M.term(-p,"x",0)}$`,`Thus $f^{-1}(y)=${neg?"-":""}\\sqrt{y}${M.term(-p,"x",0)}$.`]),
            answerTeX:`$f^{-1}(y)=${neg?"-":""}\\sqrt{y}${M.term(-p,"x",0)}$`};
        }
        const kind=R.pick(["vel","pop","tree","chirp","cs"]);
        if(kind==="vel"){
          const m=R.pick([2,3,4,5]), k=R.int(1,9);
          return {prompt:`Let $v(t)=${m}t^3+${k}$ m/s be the velocity of an object at time $t$ seconds. Find $v^{-1}$ (write it in terms of $V$) and say what it means.`,
            answer:{answer:`((V-${k})/${m})^(1/3)`,vars:["V"],domain:[k+0.5,k+20]},
            hint:"Let $V="+m+"t^3+"+k+"$ and solve for $t$. Do not swap the letters.",
            steps:[`Let $V=${m}t^3+${k}$.`,`$V-${k}=${m}t^3$, so $\\frac{V-${k}}{${m}}=t^3$.`,`$\\sqrt[3]{\\frac{V-${k}}{${m}}}=\\sqrt[3]{t^3}=t$.`,`Thus $t=v^{-1}(V)=\\sqrt[3]{\\frac{V-${k}}{${m}}}$. It gives the time $t$ at which the velocity $V$ is reached.`],
            answerTeX:`$v^{-1}(V)=\\sqrt[3]{\\frac{V-${k}}{${m}}}$, the time at which the velocity is $V$`};
        }
        if(kind==="pop"){
          const k=R.int(2,9);
          return {prompt:`$p(t)=t^3+${k}$ is the population of a culture in millions at time $t\\ge0$ hours. Find $p^{-1}$, written in terms of $P$.`,
            answer:{answer:`(P-${k})^(1/3)`,vars:["P"],domain:[k+0.5,k+30]},
            hint:"Let $P=t^3+"+k+"$ and solve for $t$.",
            steps:[`Let $P=t^3+${k}$.`,`$P-${k}=t^3$`,`$\\sqrt[3]{P-${k}}=t$`,`Thus $p^{-1}(P)=\\sqrt[3]{P-${k}}$: it inputs a population and outputs the time it is reached.`],
            answerTeX:`$p^{-1}(P)=\\sqrt[3]{P-${k}}$`};
        }
        if(kind==="tree"){
          const K=R.pick([50,80,100,200]);
          return {prompt:`$H(a)=\\dfrac{${K}a}{${K}+a}$ is the height in meters of a tree of age $a$ years. Find $H^{-1}$, written in terms of $h$.`,
            answer:{answer:`${K}h/(${K}-h)`,vars:["h"],domain:[1,K-5]},
            hint:"Let $h=H(a)$, multiply both sides by $"+K+"+a$, then collect the $a$ terms on one side.",
            steps:[`Let $h=\\frac{${K}a}{${K}+a}$, so $h(${K}+a)=${K}a$.`,`$${K}h+ha=${K}a$, so $${K}h=${K}a-ha=a(${K}-h)$.`,`$a=\\frac{${K}h}{${K}-h}$.`,`Thus $H^{-1}(h)=\\frac{${K}h}{${K}-h}$: the age of a tree that is $h$ meters tall.`],
            answerTeX:`$H^{-1}(h)=\\frac{${K}h}{${K}-h}$`};
        }
        if(kind==="chirp"){
          const m=R.pick([2,3,4,7]), k=R.int(5,40);
          return {prompt:`The number of chirps a cricket makes in 25 seconds is $N(T)=${m}T-${k}$, where $T$ is the temperature in °C. Find $N^{-1}$, written in terms of $N$.`,
            answer:{answer:`(N+${k})/${m}`,vars:["N"],domain:[0,60]},
            hint:"Let $N="+m+"T-"+k+"$ and solve for $T$.",
            steps:[`Let $N=${m}T-${k}$.`,`$N+${k}=${m}T$`,`$\\frac{N+${k}}{${m}}=T$`,`Thus $N^{-1}(N)=\\frac{N+${k}}{${m}}$: the temperature when the cricket chirps $N$ times in 25 seconds.`],
            answerTeX:`$N^{-1}(N)=\\frac{N+${k}}{${m}}$`};
        }
        const p=R.nz(-4,4), r=R.int(-5,5), q=p*p+r;
        const ft=`x^2${M.term(2*p,"x",1)}${M.term(q,"x",0)}`, xp=`x${M.term(p,"x",0)}`;
        return {prompt:`Find the inverse $f^{-1}(y)$ of $f(x)=${ft}$ on the interval $[${-p},\\infty)$.`, answer:{answer:`sqrt(y-(${r}))-(${p})`,vars:["y"],domain:[r+0.2,r+8]},
          hint:"Complete the square: $"+ft+"=("+xp+")^2"+M.term(r,"x",0)+"$.",
          steps:[`Complete the square: $y=(${xp})^2${M.term(r,"x",0)}$.`,`$y${M.term(-r,"y",0)}=(${xp})^2$, so $\\sqrt{y${M.term(-r,"y",0)}}=|${xp}|$.`,`$\\sqrt{y${M.term(-r,"y",0)}}=${xp}$ since $x\\ge${-p}$.`,`Thus $f^{-1}(y)=\\sqrt{y${M.term(-r,"y",0)}}${M.term(-p,"x",0)}$.`],
          answerTeX:`$f^{-1}(y)=\\sqrt{y${M.term(-r,"y",0)}}${M.term(-p,"x",0)}$`};
      }},
    {id:"L09.g.domran", title:"Domain and range of $f^{-1}$", skill:"Swap domain and range on the interval", ref:"pp. 3 to 5",
      gen(R,d){
        let C;
        const pickLin=()=>{ const m=R.pick([2,3,4,-2,-3]), k=R.int(-12,12), a=R.int(-3,5), b=a+R.int(2,6); return {t:`${m}x${M.term(k,"x",0)}`,f:x=>m*x+k,a,b,dir:m>0?"inc":"dec",why:`$f$ is a line with slope ${m}, so it is ${m>0?"increasing":"decreasing"}.`}; };
        if(d===1){
          if(R.int(0,1)){ C=pickLin(); }
          else { const c=R.int(1,9), neg=R.pick([true,false]); C={t:`x^2-${c}`,inf:true,neg,c}; }
        } else if(d===2){
          const k=R.pick(["cub","cubneg","sqrt","lin"]);
          if(k==="lin") C=pickLin();
          else if(k==="cub"){ const a=R.int(-2,0), b=a+R.int(1,3), s=R.int(-3,3); C={t:`x^3+x${M.term(s,"x",0)}`,f:x=>x**3+x+s,a,b,dir:"inc",why:"$f'(x)=3x^2+1>0$, so $f$ is increasing."}; }
          else if(k==="cubneg"){ const a=R.int(-2,0), b=a+R.int(1,3), s=R.int(-5,5); C={t:`${s}-x^3`,f:x=>s-x**3,a,b,dir:"dec",why:"$f'(x)=-3x^2\\le0$, so $f$ is decreasing."}; }
          else { const c=R.int(1,6), neg=R.pick([true,false]); C={t:`x^2+${c}`,inf:true,neg,c:-c}; }
        } else {
          const k=R.pick(["cos","sin","cosB","exp","exp2","quart"]);
          if(k==="cos") C={t:"\\cos(x)",trig:true,I:"[0,\\pi]",IA:"[0, pi]",dom:"[-1, 1]",domT:"[-1,1]",why:"$\\cos(0)=1$ and $\\cos(\\pi)=-1$, and cos is decreasing on $[0,\\pi]$."};
          else if(k==="sin") C={t:"\\sin(x)",trig:true,I:"\\left[-\\frac{\\pi}{2},\\frac{\\pi}{2}\\right]",IA:"[-pi/2, pi/2]",dom:"[-1, 1]",domT:"[-1,1]",why:"$\\sin(-\\frac{\\pi}{2})=-1$ and $\\sin(\\frac{\\pi}{2})=1$, and sin is increasing there."};
          else if(k==="cosB") C={t:"\\cos(x)",trig:true,I:"[\\pi,2\\pi]",IA:"[pi, 2pi]",dom:"[-1, 1]",domT:"[-1,1]",why:"$\\cos(\\pi)=-1$ and $\\cos(2\\pi)=1$, and cos is increasing on $[\\pi,2\\pi]$."};
          else if(k==="exp"){ const p=-R.int(2,6); C={t:"e^x-x",special:true,I:`[${p},0]`,IA:`[${p}, 0]`,dom:`[1, e^(${p})+${-p}]`,domT:`[1,e^{${p}}+${-p}]`,why:`$f'(x)=e^x-1<0$ for $x<0$, so $f$ is decreasing. $f(0)=1$ and $f(${p})=e^{${p}}+${-p}$.`}; }
          else if(k==="exp2"){ const q=R.int(1,3); C={t:"e^x-x",special:true,I:`[0,${q}]`,IA:`[0, ${q}]`,dom:`[1, e^${q}-${q}]`,domT:`[1,e^{${q}}-${q}]`,why:`$f'(x)=e^x-1>0$ for $x>0$, so $f$ is increasing. $f(0)=1$ and $f(${q})=e^{${q}}-${q}$.`}; }
          else C={t:"\\frac{3}{4}x^4+x^3-3x^2",special:true,I:"[-2,0]",IA:"[-2, 0]",dom:"[-8, 0]",domT:"[-8,0]",why:"$f'(x)=3x(x+2)(x-1)>0$ on $(-2,0)$, so $f$ is increasing. $f(-2)=12-8-12=-8$ and $f(0)=0$."};
        }
        let I, IA, dom, domT, steps;
        if(C.inf){
          I=C.neg?"(-\\infty,0]":"[0,\\infty)"; IA=C.neg?"(-inf, 0]":"[0, inf)";
          const lo=-C.c; dom=`[${lo}, inf)`; domT=`[${lo},\\infty)`;
          steps=[`The range of $f^{-1}$ is the interval $I=${I}$.`,`On $I$, $x^2$ takes every value from 0 up (it is smallest at $x=0$), so $f(x)=${C.t}$ takes every value from $${lo}$ up.`,`So the domain of $f^{-1}$ is $${domT}$.`];
        } else if(C.trig||C.special){
          I=C.I; IA=C.IA; dom=C.dom; domT=C.domT;
          steps=[`The range of $f^{-1}$ is $I=${I}$.`,C.why,`So the domain of $f^{-1}$ is $${domT}$.`];
        } else {
          const fa=C.f(C.a), fb=C.f(C.b), lo=Math.min(fa,fb), hi=Math.max(fa,fb);
          I=`[${C.a},${C.b}]`; IA=`[${C.a}, ${C.b}]`; dom=`[${lo}, ${hi}]`; domT=`[${lo},${hi}]`;
          steps=[`The range of $f^{-1}$ is $I=${I}$.`,C.why,`$f(${C.a})=${fa}$ and $f(${C.b})=${fb}$, so $f$ takes every value from ${lo} to ${hi} on $I$.`,`So the domain of $f^{-1}$ is $${domT}$.`];
        }
        return {prompt:`$f(x)=${C.t}$ is invertible on $I=${I}$. Find the domain and the range of $f^{-1}$. Give each as an interval.`,
          parts:[{label:"Domain of $f^{-1}$",answer:{type:"interval",answer:dom}},{label:"Range of $f^{-1}$",answer:{type:"interval",answer:IA}}],
          hint:"The range of $f^{-1}$ is $I$. The domain of $f^{-1}$ is every value $f$ takes on $I$.",
          steps, answerTeX:`Domain $${domT}$, range $${I}$`};
      }},
    {id:"L09.g.cancel", title:"Cancellation properties", skill:"Decide whether $f^{-1}(f(x))=x$ applies", ref:"pp. 5 to 6",
      gen(R,d){
        if(d<3){
          const k=R.int(1,9), side=R.pick(["neg","pos"]), I=side==="neg"?"(-\\infty,0]":"[0,\\infty)", inv=side==="neg"?`-\\sqrt{y+${k}}`:`\\sqrt{y+${k}}`;
          const which=d===1?R.pick(["ff","fif"]):R.pick(["fif","fif","ff"]);
          if(which==="ff"){
            const c=R.int(-k,12);
            return {prompt:`$f(x)=x^2-${k}$ is invertible on $${I}$ with inverse $f^{-1}(y)=${inv}$. What is $f\\left(f^{-1}(${c})\\right)$?`, answer:{type:"num",answer:String(c)}, verify:{value:c},
              hint:"Ask: is "+c+" in the range of $f$ on the interval (the domain of $f^{-1}$)?",
              steps:[`Ask: is ${c} in the range of $f$ on $${I}$? That range is $[-${k},\\infty)$.`,`Yes, so the Cancellation Property applies: $f\\left(f^{-1}(${c})\\right)=${c}$.`],
              answerTeX:`$${c}$`};
          }
          const out=d===2||R.int(0,1)===1; const mag=R.int(1,6);
          const c=side==="neg"?(out?mag:-mag):(out?-mag:mag);
          const val=side==="neg"?-Math.abs(c):Math.abs(c);
          return {prompt:`$f(x)=x^2-${k}$ is invertible on $${I}$ with inverse $f^{-1}(y)=${inv}$. What is $f^{-1}\\left(f(${c})\\right)$?`, answer:{type:"num",answer:String(val)}, verify:{value:val},
            hint:"Ask: is "+c+" in the range of $f^{-1}$, which is the interval?",
            steps:out?[`Ask: is ${c} in the range of $f^{-1}$, which is $${I}$? No.`,`So evaluate by hand: $f(${c})=(${c})^2-${k}=${c*c-k}$.`,`$f^{-1}(${c*c-k})=${side==="neg"?"-":""}\\sqrt{${c*c-k}+${k}}=${side==="neg"?"-":""}\\sqrt{${c*c}}=${val}$.`]
              :[`Ask: is ${c} in the range of $f^{-1}$, which is $${I}$? Yes.`,`So the Cancellation Property applies: $f^{-1}\\left(f(${c})\\right)=${c}$.`],
            answerTeX:`$${val}$`};
        }
        const kind=R.pick(["acos","acos","asin","cosacos"]);
        if(kind==="cosacos"){
          const v=R.pick([0.5,-0.5,Math.SQRT2/2,-Math.sqrt(3)/2,1/3,-2/5,0.2]);
          const vt=Math.abs(v-1/3)<1e-9?"\\frac{1}{3}":Math.abs(v+0.4)<1e-9?"-\\frac{2}{5}":Math.abs(v-0.2)<1e-9?"\\frac{1}{5}":valT(v);
          const va=Math.abs(v-1/3)<1e-9?"1/3":Math.abs(v+0.4)<1e-9?"-2/5":Math.abs(v-0.2)<1e-9?"1/5":valA(v);
          return {prompt:`Given that $\\cos(x)$ is invertible on $[0,\\pi]$ with inverse $\\arccos(x)$, evaluate $\\cos\\left(\\arccos\\left(${vt}\\right)\\right)$.`, answer:{type:"num",answer:va}, verify:{value:v},
            hint:"Ask: is there an $x$ in $[0,\\pi]$ with $\\cos(x)="+vt+"$? That is, is the input in the range of cos on $[0,\\pi]$?",
            steps:[`Ask: is $${vt}$ in the range of $\\cos$ on $[0,\\pi]$, which is $[-1,1]$? Yes.`,`So the Cancellation Property applies: $\\cos\\left(\\arccos\\left(${vt}\\right)\\right)=${vt}$.`],
            answerTeX:`$${vt}$`};
        }
        const isCos=kind==="acos", T=isCos?TRIG.cosA:TRIG.sinA;
        let k; do{ k=R.int(-12,24); } while(!niceK(k)||(k>=T.lo&&k<=T.hi&&R.int(0,3)>0));
        const v=T.f(k*PI/12), back=solveIn(T,v), inI=k>=T.lo&&k<=T.hi;
        const name=isCos?"\\arccos":"f^{-1}", fname=isCos?"\\cos":"f";
        const pre=isCos?`Given that $\\cos(x)$ is invertible on $[0,\\pi]$ with inverse $\\arccos(x)$, evaluate $\\arccos\\left(\\cos\\left(${piT(k)}\\right)\\right)$.`:`$f(x)=\\sin(x)$ is invertible on $\\left[-\\frac{\\pi}{2},\\frac{\\pi}{2}\\right]$. Evaluate $f^{-1}\\left(f\\left(${piT(k)}\\right)\\right)$.`;
        return {prompt:pre, answer:{type:"num",answer:piA(back)}, verify:{value:back*PI/12},
          hint:"Ask: is $"+piT(k)+"$ in the interval $"+T.I+"$? If not, find $"+(isCos?"\\cos":"\\sin")+"\\left("+piT(k)+"\\right)$ first.",
          steps:inI?[`Ask: is $${piT(k)}$ in $${T.I}$, the range of $${name}$? Yes.`,`So the Cancellation Property applies: the answer is $${piT(k)}$.`]
            :[`Ask: is $${piT(k)}$ in $${T.I}$, the range of $${name}$? No, so evaluate by hand.`,`$${isCos?"\\cos":"\\sin"}\\left(${piT(k)}\\right)=${valT(v)}$.`,`$${name}\\left(${valT(v)}\\right)$ is the angle in $${T.I}$ with $${isCos?"\\cos":"\\sin"}$ equal to $${valT(v)}$: it is $${piT(back)}$.`],
          answerTeX:`$${piT(back)}$`};
      }},
    {id:"L09.g.find-error", title:"Find the first mistake", skill:"Error analysis: finding an inverse", ref:"pp. 3 to 4",
      gen(R,d){
        const T=d===1?"A":d===2?R.pick(["A","D"]):R.pick(["B","D","A"]);
        let prob, L, bad, note;
        if(T==="A"){
          const c=R.int(1,9), e=R.pick([3,5,6]); bad=e;
          prob=`Find the inverse $f^{-1}(y)$ of $f(x)=x^2-${c}$ on the interval $(-\\infty,0]$.`;
          L=[`y=x^2-${c}`,`y+${c}=x^2`];
          if(e===3){ L.push(`\\sqrt{y+${c}}=x`); L.push(`\\text{Thus } f^{-1}(y)=\\sqrt{y+${c}}`); }
          else { L.push(`\\sqrt{y+${c}}=\\sqrt{x^2}`); L.push(`\\sqrt{y+${c}}=|x|`);
            if(e===5){ L.push(`\\sqrt{y+${c}}=x\\ \\text{ since } x\\le0`); L.push(`\\text{Thus } f^{-1}(y)=\\sqrt{y+${c}}`); }
            else { L.push(`\\sqrt{y+${c}}=-x\\ \\text{ since } x\\le0`); L.push(`-\\sqrt{x+${c}}=y, \\text{ so } f^{-1}(x)=-\\sqrt{x+${c}}`); } }
          note={3:"Line (3) takes $\\sqrt{x^2}=x$. Property (i) gives $|x|$, and the interval then decides the sign.",5:"Line (5) uses $|x|=x$, but $x\\le0$ means $|x|=-x$.",6:"Line (6) swaps the variable names. From line (5), $x=-\\sqrt{y+"+c+"}$, so $f^{-1}(y)=-\\sqrt{y+"+c+"}$."}[e];
        } else if(T==="B"){
          const p=R.int(1,5), q=R.int(-4,4), e=R.pick([1,3,5]); bad=e;
          const xp=`x+${p}`, rhs=`y${M.term(-q,"y",0)}`;
          prob=`Find the inverse $f^{-1}(y)$ of $f(x)=x^2+${2*p}x${M.term(p*p+q,"x",0)}$ on the interval $[-${p},\\infty)$.`;
          L=[e===1?`y=(x+${2*p})^2${M.term(q,"x",0)}`:`y=(${xp})^2${M.term(q,"x",0)}`];
          const xpp=e===1?`x+${2*p}`:xp;
          L.push(`${rhs}=(${xpp})^2`); L.push(`\\sqrt{${rhs}}=|${xpp}|`);
          L.push(e===3?`\\sqrt{${rhs}}=-(${xpp})\\ \\text{ since } x\\ge-${p}`:`\\sqrt{${rhs}}=${xpp}\\ \\text{ since } x\\ge-${p}`);
          L.push(e===5?`\\sqrt{x${M.term(-q,"x",0)}}-${p}=y, \\text{ so } f^{-1}(x)=\\sqrt{x${M.term(-q,"x",0)}}-${p}`:e===3?`x=-\\sqrt{${rhs}}-${e===1?2*p:p}, \\text{ so } f^{-1}(y)=-\\sqrt{${rhs}}-${p}`:`x=\\sqrt{${rhs}}-${e===1?2*p:p}, \\text{ so } f^{-1}(y)=\\sqrt{${rhs}}-${e===1?2*p:p}`);
          note={1:`Line (1) completes the square wrong: $x^2+${2*p}x+${p*p}=(x+${p})^2$.`,3:`Line (3) has the wrong sign: $x\\ge-${p}$ means $x+${p}\\ge0$, so $|x+${p}|=x+${p}$.`,5:"Line (5) swaps the variable names. The inverse is $f^{-1}(y)=\\sqrt{"+rhs+"}-"+p+"$."}[e];
        } else {
          const c=R.int(1,9), e=R.pick([1,2,3]); bad=e;
          prob=`$f(x)=x^2-${c}$ is invertible on $(-\\infty,0]$ with inverse $f^{-1}(y)=-\\sqrt{y+${c}}$. State the domain and range of $f^{-1}$.`;
          if(e===1) L=[`\\text{The domain of } f^{-1} \\text{ is } (-\\infty,0], \\text{ the interval } I`,`\\text{For } x\\le0,\\ f(x) \\text{ takes every value } \\ge -${c}`,`\\text{So the range of } f^{-1} \\text{ is } [-${c},\\infty)`];
          else if(e===2) L=[`\\text{The range of } f^{-1} \\text{ is } (-\\infty,0], \\text{ the interval } I`,`\\text{For } x\\le0,\\ f(x) \\text{ takes every value } \\le -${c}`,`\\text{So the domain of } f^{-1} \\text{ is } (-\\infty,-${c}]`];
          else L=[`\\text{The range of } f^{-1} \\text{ is } (-\\infty,0], \\text{ the interval } I`,`\\text{For } x\\le0,\\ f(x) \\text{ takes every value } \\ge -${c}`,`\\text{So the domain of } f^{-1} \\text{ is } (-\\infty,0]`];
          note={1:"Line (1) mixes them up: the interval $I$ is the range of $f^{-1}$, not its domain.",2:`Line (2) has the direction wrong. $x^2\\ge0$, so $x^2-${c}\\ge-${c}$.`,3:`Line (3) does not follow from line (2): the domain of $f^{-1}$ is the set of values of $f$, which is $[-${c},\\infty)$.`}[e];
        }
        const opts=L.map((_,i)=>`Line (${i+1})`);
        return {prompt:`A problem and an answer are shown. The answer would not get a perfect score. Select the first line that has a mistake.<br><b>Problem.</b> ${prob}<br><b>Answer.</b>${lines(L)}`,
          parts:[{answer:{type:"mc",options:opts,correct:bad-1,keep:true}}],
          hint:"Watch for $\\sqrt{x^2}$ written as $x$, a sign that does not match the interval, swapped variable names, and domain and range mixed up.",
          steps:[`The first mistake is in line (${bad}).`,note].concat(bad===2?["Line (1) is correct."]:bad===3?["Lines (1) and (2) are correct."]:bad>3?[`Lines (1) to (${bad-1}) are correct.`]:[]),
          answerTeX:`Line (${bad})`};
      }},
    {id:"L09.g.meaning", title:"What does $f^{-1}$ mean?", skill:"Interpret an inverse in context", ref:"pp. 3 and 5",
      gen(R,d){
        const S=R.pick([
          {f:"q",v:"p",desc:"$q=f(p)$ is the number of items sold when the price is $p$ dollars",inv:c=>`the price (in dollars) at which ${c} items are sold`,fwd:c=>`the number of items sold at a price of ${c} dollars`,c:R.int(5,40),n:"f"},
          {f:"C",v:"A",desc:"$C(A)$ is the cost, in thousands of dollars, of building a house with area $A$ square feet",inv:c=>`the area (in square feet) of a house that costs ${c} thousand dollars to build`,fwd:c=>`the cost (in thousands of dollars) of a house with area ${c} square feet`,c:R.pick([300,400,650,800]),n:"C"},
          {f:"T",v:"h",desc:"$T(h)$ is the air temperature in °C at altitude $h$ km",inv:c=>`the altitude (in km) where the temperature is ${c} °C`,fwd:c=>`the temperature (in °C) at an altitude of ${c} km`,c:R.pick([-20,-10,-5,4]),n:"T"},
          {f:"B",v:"a",desc:"$B(a)$ is the percent of hair remaining $a$ years after age 20",inv:c=>`the number of years after age 20 at which ${c}% of the hair remains`,fwd:c=>`the percent of hair remaining ${c} years after age 20`,c:R.pick([45,60,75,80]),n:"B"},
          {f:"v",v:"t",desc:"$v(t)$ is the velocity in m/s of an object $t$ seconds after it starts",inv:c=>`the time (in seconds) at which the velocity is ${c} m/s`,fwd:c=>`the velocity (in m/s) at time ${c} seconds`,c:R.int(10,30),n:"v"}]);
        const c=S.c;
        const right=`${S.inv(c)[0].toUpperCase()}${S.inv(c).slice(1)}`;
        const opts=[right,`${S.fwd(c)[0].toUpperCase()}${S.fwd(c).slice(1)}`,`One divided by $${S.n}(${c})$`,`The rate of change of $${S.n}$ when $${S.v}=${c}$`];
        if(d===3) opts.push(`${S.inv(c)[0].toUpperCase()}${S.inv(c).slice(1)}, divided by ${c}`);
        const sh=R.shuffle(opts);
        return {prompt:`${S.desc}. What does $${S.n}^{-1}(${c})$ represent?`,
          parts:[{answer:{type:"mc",options:sh,correct:sh.indexOf(right)}}],
          hint:"The inverse swaps input and output. Its input is a value of $"+S.n+"$, and its output is a value of $"+S.v+"$.",
          steps:[`$${S.n}$ inputs $${S.v}$ and outputs $${S.f}$. So $${S.n}^{-1}$ inputs a value of $${S.f}$ and outputs the matching $${S.v}$.`,`So $${S.n}^{-1}(${c})$ is ${S.inv(c)}.`,`$${S.n}^{-1}$ is not $\\frac{1}{${S.n}}$.`],
          answerTeX:right};
      }}
  ],
  exam:[
    {id:"L09.q1", ref:"p. 1", multi:true, q:"Assume $f$ is invertible on $(-\\infty,\\infty)$ with inverse $g$, and $f(-2)=7$. Select all statements that must be true.", opts:[["$g(7)=-2$",1,"$f(x)=y$ if and only if $g(y)=x$."],["$g(-2)=7$",0,"That swaps the roles. We only know where $g$ sends 7."],["$f(4)\\ne7$",1,"If $f(4)=7$ too, the line $y=7$ would cross the graph twice."],["$f(7)=-2$",0,"Nothing tells us $f(7)$."],["$g(7)=\\frac{1}{7}$",0,"$g$ is the inverse, not the reciprocal."]]},
    {id:"L09.q2", ref:"p. 1", keep:true, q:"True or false: $f^{-1}(x)=\\frac{1}{f(x)}$.", opts:[["True",0,"Try $f(x)=x+1$: $f^{-1}(y)=y-1$, which is not $\\frac{1}{x+1}$."],["False",1,"$f^{-1}$ means the inverse of $f$. It does not mean $\\frac1f$."]]},
    {id:"L09.q3", ref:"p. 2", q:"On which interval is $f(x)=(x-2)^2$ invertible?", opts:[["$[2,5]$",1,"$f$ is increasing there, so every horizontal line crosses at most once."],["$[0,5]$",0,"$f(1)=f(3)=1$: the line $y=1$ crosses twice."],["$[1,3]$",0,"Same problem: $f(1)=f(3)$."],["$(-\\infty,\\infty)$",0,"A parabola fails the horizontal line test on its whole domain."]]},
    {id:"L09.q4", ref:"pp. 3 to 4", q:"$f(x)=x^3+1$ is invertible on $I=[-1,2]$. The domain and range of $f^{-1}$ are", opts:[["Domain $[0,9]$, range $[-1,2]$",1,"$f(-1)=0$, $f(2)=9$, and $f$ is increasing. The range of $f^{-1}$ is $I$."],["Domain $[-1,2]$, range $[0,9]$",0,"Swapped. The interval $I$ is the range of $f^{-1}$."],["Domain $[-1,2]$, range $[-1,2]$",0,"The domain of $f^{-1}$ is the set of values of $f$ on $I$."],["Domain $(-\\infty,\\infty)$, range $[-1,2]$",0,"$f^{-1}$ only takes the values $f$ reaches on $I$."]]},
    {id:"L09.q5", ref:"p. 3", q:"The inverse of $f(x)=5x-3$ is", opts:[["$f^{-1}(y)=\\frac{y+3}{5}$",1,"$y=5x-3$, so $y+3=5x$ and $x=\\frac{y+3}{5}$."],["$f^{-1}(y)=\\frac{y-3}{5}$",0,"Moving $-3$ across gives $+3$."],["$f^{-1}(y)=\\frac{1}{5y-3}$",0,"That is the reciprocal, not the inverse."],["$f^{-1}(y)=5y+3$",0,"Divide by 5, do not multiply."]]},
    {id:"L09.q6", ref:"p. 3", q:"The inverse of $f(x)=x^2-4$ on $(-\\infty,0]$ is", opts:[["$f^{-1}(y)=-\\sqrt{y+4}$",1,"$\\sqrt{y+4}=|x|=-x$ because $x\\le0$."],["$f^{-1}(y)=\\sqrt{y+4}$",0,"That is the inverse on $[0,\\infty)$. Its outputs are not $\\le0$."],["$f^{-1}(y)=\\pm\\sqrt{y+4}$",0,"A function gives one output. The interval decides the sign."],["$f^{-1}(y)=-\\sqrt{y-4}$",0,"$y=x^2-4$ gives $y+4=x^2$."]]},
    {id:"L09.q7", ref:"pp. 5 to 6", multi:true, q:"$f(x)=x^2$ is invertible on $(-\\infty,0]$ with $f^{-1}(y)=-\\sqrt{y}$. Select all true statements.", opts:[["$f^{-1}(f(-3))=-3$",1,"$-3$ is in $(-\\infty,0]$, so it cancels."],["$f^{-1}(f(3))=3$",0,"3 is not in the interval: $f^{-1}(9)=-\\sqrt9=-3$."],["$f^{-1}(f(3))=-3$",1,"Worked out by hand: $f(3)=9$ and $f^{-1}(9)=-3$."],["$f(f^{-1}(4))=4$",1,"4 is in the range of $f$ on the interval, so it cancels."]]},
    {id:"L09.q8", ref:"p. 6", multi:true, q:"$\\cos(x)$ is invertible on $[0,\\pi]$ with inverse $\\arccos(x)$. Select all true statements.", opts:[["$\\arccos\\left(\\cos\\left(-\\frac{\\pi}{3}\\right)\\right)=\\frac{\\pi}{3}$",1,"$\\cos(-\\frac\\pi3)=\\frac12$ and $\\arccos(\\frac12)=\\frac\\pi3$."],["$\\arccos\\left(\\cos\\left(\\frac{4\\pi}{3}\\right)\\right)=\\frac{4\\pi}{3}$",0,"$\\frac{4\\pi}{3}$ is not in $[0,\\pi]$. $\\cos(\\frac{4\\pi}{3})=-\\frac12$ and $\\arccos(-\\frac12)=\\frac{2\\pi}{3}$."],["$\\cos\\left(\\arccos\\left(\\frac{2}{7}\\right)\\right)=\\frac{2}{7}$",1,"$\\frac27$ is in $[-1,1]$, the range of cos on $[0,\\pi]$."],["$\\arccos\\left(\\cos\\left(\\frac{\\pi}{2}\\right)\\right)=\\frac{\\pi}{2}$",1,"$\\frac\\pi2$ is in $[0,\\pi]$."]]},
    {id:"L09.q9", ref:"p. 3", keep:true, q:"A problem and an answer are shown. The answer would not get a perfect score. Select the first line with a mistake.<br><b>Problem.</b> Find the inverse of $f(x)=x^2+4x+4$ on $(-\\infty,-2]$.$$y=(x+2)^2\\qquad(1)$$$$\\sqrt{y}=|x+2|\\qquad(2)$$$$\\sqrt{y}=x+2\\ \\text{ since } x\\le-2\\qquad(3)$$$$f^{-1}(y)=\\sqrt{y}-2\\qquad(4)$$", opts:[["Line (1)",0,"$x^2+4x+4=(x+2)^2$."],["Line (2)",0,"Property (i)."],["Line (3)",1,"$x\\le-2$ means $x+2\\le0$, so $|x+2|=-(x+2)$. The inverse is $-\\sqrt{y}-2$."],["Line (4)",0,"It follows from line (3), but line (3) is already wrong."]]},
    {id:"L09.q10", ref:"p. 5", q:"$T(h)$ is the air temperature in °C at altitude $h$ km. What does $T^{-1}(-20)=6$ mean?", opts:[["At an altitude of 6 km the temperature is $-20$ °C",1,"$T^{-1}(-20)=6$ means $T(6)=-20$."],["At an altitude of $-20$ km the temperature is 6 °C",0,"That would be $T(-20)=6$."],["The temperature drops 20 °C every 6 km",0,"An inverse value is not a rate."],["$\\frac{1}{T(-20)}=6$",0,"$T^{-1}$ is not $\\frac{1}{T}$."]]},
    {id:"L09.q11", ref:"p. 4", q:"$f$ is continuous and invertible on $[a,b]$. Why is the domain of $f^{-1}$ the interval between $f(a)$ and $f(b)$?", opts:[["$f$ cannot turn around between $a$ and $b$; if it did, some horizontal line would cross the graph twice",1,"So $f$ climbs (or falls) steadily from $f(a)$ to $f(b)$ and hits every value in between."],["Because every function has its largest and smallest values at the endpoints",0,"Not true in general: $x^2$ on $[-1,2]$ is smallest at $x=0$."],["Because $f^{-1}(a)=f(b)$",0,"Not a property of inverses."],["Because the domain of $f^{-1}$ is always $[a,b]$",0,"$[a,b]$ is the range of $f^{-1}$."]]},
    {id:"L09.q12", ref:"p. 4", q:"$f(x)=e^x-x$ is invertible on $I=[0,2]$. The domain of $f^{-1}$ is", opts:[["$[1,e^2-2]$",1,"$f'(x)=e^x-1>0$ for $x>0$, so $f$ increases from $f(0)=1$ to $f(2)=e^2-2$."],["$[0,2]$",0,"That is the range of $f^{-1}$."],["$[0,e^2-2]$",0,"$f(0)=e^0-0=1$, not 0."],["$[1,e^2]$",0,"$f(2)=e^2-2$."]]}
  ],
  steps:[
    {type:"read", title:"What an inverse is", body:`<div class="box def"><b class="t">Definition (p. 1)</b>A function $f$ is invertible on an interval $I$ if there is a function $g$ with $g(y)=x$ if and only if $f(x)=y$, for all $x$ in $I$. Then $g$ is the inverse of $f$ on $I$, written $g=f^{-1}$.</div><p>Three notes from p. 1:</p><ol><li>$f^{-1}$ means the inverse of $f$. It does not mean $\\frac{1}{f}$.</li><li>An inverse lives on an interval, so a function can have different inverses on different intervals.</li><li>If no interval is given, $I$ is the domain of $f$.</li></ol><p>If $f$ inputs $x$ and outputs $y$, then $f^{-1}$ inputs $y$ and outputs $x$:</p>$$f(x)=y \\iff f^{-1}(y)=x$$<div class="box"><b class="t">Examples (pp. 1 to 2)</b>If $f(3)=6$, then $f^{-1}(6)=3$. If $f(x)=x^3+x$ is invertible on $[0,\\infty)$, then $f^{-1}(10)=2$, because $f(2)=10$. You do not need a formula for $f^{-1}$: just ask which $x$ gives the output.</div>`, ref:"pp. 1 to 2"},
    {type:"mcq", title:"Read the definition", multi:true, q:"$f$ is invertible on $(-\\infty,\\infty)$ and $f(4)=-1$. Select all statements that must be true.", opts:[["$f^{-1}(-1)=4$",true,"Output $-1$ goes back to input 4."],["$f^{-1}(4)=-1$",false,"That would need $f(-1)=4$, which we do not know."],["$f(0)\\ne-1$",true,"Only one input can give $-1$, and that input is 4."],["$f^{-1}(-1)=\\frac{1}{f(-1)}$",false,"$f^{-1}$ is not a reciprocal."]]},
    {type:"try", title:"Your turn: evaluate an inverse", gen:"L09.g.eval-inv"},
    {type:"explore", title:"The horizontal line test", fig:"hlt", body:`<div class="box def"><b class="t">Theorem: Horizontal Line Test (p. 2)</b>A function is invertible on an interval $I$ if every horizontal line crosses the graph of the function at most once.</div><p>Why it works: the inverse swaps the independent and dependent variables. If a horizontal line crossed $f$ twice, then after the swap a vertical line would cross the graph of $f^{-1}$ twice, and $f^{-1}$ would not be a function.</p><p><b>Try it.</b> With $x^2$ on $[-2,2]$, move the line: it crosses twice, so $x^2$ is not invertible there. Now drag the right end $b$ down to 0. On $[-2,0]$ every line crosses at most once (p. 2). Then try $x^2-2$, $x^3+x$, and $\\cos(x)$ on different intervals.</p>`},
    {type:"read", title:"Finding an inverse", body:`<p>To find the inverse on an interval (when it exists), solve the equation for the independent variable (p. 3).</p><div class="box warn"><b class="t">Do not swap the variable names (p. 3)</b>In high school you may have swapped $x$ and $y$ at the end. In science the letters mean something: $V$ is a velocity and $t$ is a time. If you swap them, $t$ would mean velocity. Solve for the input and write $f^{-1}(y)$.</div><p>When the equation has $x^2$ in it, you take a square root, use $\\sqrt{x^2}=|x|$, and let the interval decide the sign. That step is worth marks on quizzes.</p>`, ref:"p. 3"},
    {type:"example", title:"The velocity example", ex:{q:"Let $v(t)=2t^3+1$ m/s be the velocity of an object at time $t$ in seconds. Find $v^{-1}$ and state what it means.", ref:"p. 3",
      steps:[{t:"Let $V=2t^3+1$.",why:"Give the output its own letter. $V$ is a velocity."},{t:"$V-1=2t^3$",why:"Subtract 1."},{t:"$\\frac{V-1}{2}=t^3$",why:"Divide by 2."},{t:"$\\sqrt[3]{\\frac{V-1}{2}}=\\sqrt[3]{t^3}=t$",why:"Cube roots undo cubes, with no sign issue."},{t:"$t=v^{-1}(V)=\\sqrt[3]{\\frac{V-1}{2}}$",why:"The inverse inputs a velocity $V$ and outputs a time $t$."}],
      ans:"$v^{-1}(V)=\\sqrt[3]{\\frac{V-1}{2}}$. It gives the time $t$ at which the velocity $V$ is reached."}},
    {type:"example", title:"An inverse on half a parabola", ex:{q:"Find the inverse of $f(x)=x^2-2$ on $(-\\infty,0]$.", ref:"pp. 3 and 6",
      steps:[{t:"$y=x^2-2$",why:"Name the output."},{t:"$y+2=x^2$",why:"Get $x^2$ alone."},{t:"$\\sqrt{y+2}=\\sqrt{x^2}$",why:"Square root of both sides."},{t:"$\\sqrt{y+2}=|x|$",why:"Property (i)."},{t:"$\\sqrt{y+2}=-x$ since $x\\le0$",why:"On this interval $|x|=-x$."},{t:"$f^{-1}(y)=-\\sqrt{y+2}$",why:"Multiply by $-1$. This is the formula the notes use on p. 6."}],
      ans:"$f^{-1}(y)=-\\sqrt{y+2}$. On $[0,\\infty)$ the inverse would be $\\sqrt{y+2}$ instead."}},
    {type:"try", title:"Your turn: find the inverse", gen:"L09.g.find-inv"},
    {type:"explore", title:"Domain and range swap", fig:"domran", body:`<p>Since $f$ and $f^{-1}$ swap the independent and dependent variables (pp. 3 to 4):</p><ul><li>the domain of $f^{-1}$ is the set of all $y$ values you get by putting every $x$ in $I$ into $f$ (the range of $f$ restricted to $I$);</li><li>the range of $f^{-1}$ is the interval $I$.</li></ul><div class="box def"><b class="t">Box (p. 4)</b>If $f$ is continuous (and invertible) on $I=[a,b]$, the domain of $f^{-1}$ is $[f(a),f(b)]$ or $[f(b),f(a)]$, whichever has the smaller number first.</div><p>The endpoints are enough because an invertible continuous function cannot turn around inside $[a,b]$. See the note at the top of this chapter.</p><p><b>Try it.</b> Pick the $e^x-x$ example: $f(0)=1$ and $f(-5)=e^{-5}+5$, so the domain of $f^{-1}$ is $[1,e^{-5}+5]$ and the range is $[-5,0]$ (p. 4). Drag the point and read $f(x)=y$ as $f^{-1}(y)=x$.</p>`},
    {type:"example", title:"The hair example", ex:{q:"The percent of hair remaining $a$ years after age 20 is $B(a)=140-\\frac{3000}{60-a}$, $0\\le a\\le30$. Find the domain and range of $B^{-1}$. What do they represent, and what does $B^{-1}$ calculate?", ref:"p. 5",
      steps:[{t:"$B(0)=140-\\frac{3000}{60}=140-50=90$",why:"Value at the left end of $I=[0,30]$."},{t:"$B(30)=140-\\frac{3000}{30}=140-100=40$",why:"Value at the right end."},{t:"The domain of $B^{-1}$ is $[40,90]$.",why:"$B$ is continuous and invertible on $[0,30]$, so its values run between 40 and 90. Smaller number first."},{t:"The range of $B^{-1}$ is the interval $I=[0,30]$.",why:"The range of the inverse is always $I$."},{t:"The domain is the percent of hair remaining from age 20 to age 50. The range is the matching values of $a$.",why:"Translate each interval back into the story."},{t:"$B^{-1}$ calculates the age (years after 20) at which a given percent of hair remained.",why:"It inputs a percent and outputs $a$."}],
      ans:"Domain $[40,90]$, range $[0,30]$."}},
    {type:"try", title:"Your turn: domain and range of $f^{-1}$", gen:"L09.g.domran"},
    {type:"read", title:"Cancellation properties", body:`<p>You might expect a function and its inverse to always cancel. They do not, because the inverse is defined on an interval (p. 5).</p><div class="box def"><b class="t">Cancellation properties (p. 5)</b>If $f$ is invertible on $I$ with inverse $f^{-1}$, then<br>$f^{-1}(f(x))=x$ for all $x$ in $I$;<br>$f(f^{-1}(y))=y$ for all $y$ such that $f(x)=y$ for some $x$ in $I$.</div><p>One question covers both (p. 6): is the input in the range of the outside function? If yes, it cancels. If no, work it out by hand.</p><div class="box"><b class="t">Example (p. 6)</b>$f(x)=x^2-2$ on $(-\\infty,0]$ with $f^{-1}(y)=-\\sqrt{y+2}$. Is 3 in the range of $f$? Yes, so $f(f^{-1}(3))=3$. Is 5 in the range of $f^{-1}$? No, so $f^{-1}(f(5))=f^{-1}(23)=-\\sqrt{25}=-5$.</div>`, ref:"pp. 5 to 6"},
    {type:"explore", title:"Where it cancels", fig:"cancel", body:`<p>The solid curve is $y=f^{-1}(f(x))$. Where it sits on the dashed line $y=x$, the inverse cancels.</p><p><b>Try it.</b> In the $x^2-2$ example, drag $x$ to 5: $f^{-1}(f(5))=-5$, not 5. Then switch to cos and arccos and drag $x$ to $2\\pi$: $\\arccos(\\cos(2\\pi))=0$, the example on p. 6. Only inputs in $[0,\\pi]$ come back unchanged.</p>`},
    {type:"mcq", title:"The example on p. 6", q:"Given that $\\cos(x)$ is invertible on $[0,\\pi]$ with inverse $\\arccos(x)$, what is $\\arccos(\\cos(2\\pi))$?", opts:[["$0$",true,"$2\\pi$ is not in $[0,\\pi]$, so work it out: $\\cos(2\\pi)=1$, and the angle in $[0,\\pi]$ with cosine 1 is 0."],["$2\\pi$",false,"It only cancels for inputs in $[0,\\pi]$."],["$1$",false,"That is $\\cos(2\\pi)$. You still apply arccos."],["$\\pi$",false,"$\\cos(\\pi)=-1$, not 1."]],
      after:"And $\\cos\\left(\\arccos\\left(\\frac{1}{\\sqrt3}\\right)\\right)=\\frac{1}{\\sqrt3}$, because $\\frac{1}{\\sqrt3}$ is in $[-1,1]$."},
    {type:"try", title:"Your turn: cancel or not?", gen:"L09.g.cancel"},
    {type:"formulas", title:"Lecture 9 formulas"}
  ]
});
})();
