/* Lecture 7 (Wed Sept 23): Absolute value and error, solving absolute value inequalities, derivative of |x|, integral functions and the error function. Sections 2.1.2, 2.2.1. Notes: 5 pages. */
(function(){
const M=M127;
/* ---------- small helpers ---------- */
const Q=(n,d=1)=>{ if(d<0){ n=-n; d=-d; } const g=M.gcd(n,d); return [n/g,d/g]; };
const qt=q=>M.frac(q[0],q[1]);
const qa=q=>q[1]===1?String(q[0]):`${q[0]}/${q[1]}`;
const qv=q=>q[0]/q[1];
const isSq=n=>Number.isInteger(Math.sqrt(n));
const sqT=n=>isSq(n)?String(Math.sqrt(n)):`\\sqrt{${n}}`;
const sqA=n=>isSq(n)?String(Math.sqrt(n)):`sqrt(${n})`;
const lin=(p,q)=>M.term(p,"x",1,true)+M.term(q,"x",0);          // "2x+3"
const xm=a=>a===0?"x":`x ${a<0?"+":"-"} ${Math.abs(a)}`;           // x - a
const flip={"<":">","\\le":"\\ge",">":"<","\\ge":"\\le"};
const strictOf=r=>r==="<"||r===">";
const fmt=(v,dp=3)=>String(+(+v).toFixed(dp)).replace("-","−");
const simpson=(f,a,b,n=240)=>{ if(a===b) return 0; const h=(b-a)/n; let s=f(a)+f(b); for(let i=1;i<n;i++) s+=f(a+i*h)*(i%2?4:2); return s*h/3; };
const lines=arr=>arr.map((t,i)=>`$$${t}\\qquad (${i+1})$$`).join("");
const lineOpts=n=>Array.from({length:n},(_,i)=>`Line (${i+1})`);

M.lecture({
  id:"L07", n:7, date:"2026-09-23", added:"2026-10-21", unit:"u3", quiz:"Q3",
  title:"Absolute Value, Error and Integral Functions", sections:["2.1.2","2.2.1"], pages:5,
  summary:"How absolute value writes an error bound, how to solve absolute value inequalities (with cases when $x^2$ shows up), the derivative of $|x|$, and a first look at integral functions such as the error function.",
  flags:[
    {ref:"p. 5", text:"In the error function example the notes write $\\Delta t = \\frac{1.5-0}{4} = \\frac12$, but the example uses $n=3$ subdivisions. It should be $\\Delta t = \\frac{1.5-0}{3} = \\frac12$. The value $\\frac12$ and the final answer are right."},
    {ref:"p. 4", text:"The velocity example starts with $v(t) = 5t-3$ and $f(x)=\\int_0^x v(t)\\,dt$, but parts (a) to (c) use $a(t)$ and the answers say \"net change in velocity\". The answers match $f(x)=\\int_0^x a(t)\\,dt$ where $a(t)$ is the acceleration. If you use $v(t)$ as first written, $\\int_0^x v(t)\\,dt$ is the net change in position, not velocity."},
    {ref:"p. 5", text:"The notes say there does not exist an antiderivative of $e^{-t^2}$. More precisely, there is no antiderivative you can write with the usual functions (powers, exponentials, logs, trig). That is why $\\operatorname{erf}$ has to be approximated."}
  ],
  formulas:[
    {id:"L07.f.error", name:"Absolute value as an error bound", tex:"|a-b| < r", note:"$b$ is an approximation of $a$, and $r$ is an upper bound for the error.", ref:"p. 1",
      blank:{tex:"\\boxed{\\,?\\,} < r", text:true, accept:["|a-b|","|b-a|","abs(a-b)"]}},
    {id:"L07.f.error-ex", name:"Error bound as a range (example)", tex:"|e-2.7|<0.02 \\iff -0.02<e-2.7<0.02 \\iff 2.68<e<2.72", ref:"p. 1",
      blank:{tex:"|e-2.7|<0.02 \\iff 2.68<e<\\boxed{\\,?\\,}", answer:"2.72", type:"num"}},
    {id:"L07.f.def", name:"Definition of absolute value", tex:"|x| = \\begin{cases} -x & \\text{if } x<0 \\\\ x & \\text{if } x\\ge 0\\end{cases}", note:"Stated in Lecture 6, p. 3. Used for the two cases on p. 2.", ref:"p. 2",
      blank:{tex:"\\text{If } x<0, \\text{ then } |x| = \\boxed{\\,?\\,}", answer:"-x", vars:["x"], domain:[-3,-0.2]}},
    {id:"L07.f.prop1", name:"Property (i)", tex:"|x| = \\sqrt{x^2}", note:"Stated in Lecture 6, p. 4. Every time you see $\\sqrt{x^2}$, write $|x|$.", ref:"pp. 2 to 3",
      blank:{tex:"\\sqrt{x^2} = \\boxed{\\,?\\,}", answer:"abs(x)", vars:["x"], domain:[-3,3]}},
    {id:"L07.f.prop4", name:"Property (iv)", tex:"|x| < a \\iff -a < x < a, \\quad a>0", note:"Stated in Lecture 6, p. 4. The bars come off when you use it.", ref:"pp. 1 to 2",
      blank:{tex:"|x| < a \\iff \\boxed{\\,?\\,}", text:true, accept:["-a<x<a","-a < x < a"]}},
    {id:"L07.f.prop5", name:"Property (v)", tex:"|x| > a \\iff x < -a \\text{ or } x > a, \\quad a>0", note:"Stated in Lecture 6, p. 4. Mentioned in the warning on p. 2.", ref:"p. 2",
      blank:{tex:"|x| > a \\iff \\boxed{\\,?\\,}", text:true, accept:["x<-a or x>a","x<-aorx>a","x>a or x<-a","x < -a or x > a"]}},
    {id:"L07.f.dabs-derive", name:"Where $\\frac{x}{|x|}$ comes from", tex:"\\frac{d}{dx}|x| = \\frac{d}{dx}(x^2)^{1/2} = \\frac{1}{2}(x^2)^{-1/2}\\cdot(2x) = \\frac{x}{\\sqrt{x^2}} = \\frac{x}{|x|}", note:"Property (i) and the Chain Rule.", ref:"p. 3"},
    {id:"L07.f.dabs", name:"Derivative of absolute value", tex:"f(x)=|x| \\;\\Rightarrow\\; f'(x)=\\frac{x}{|x|}", note:"For $x\\ne0$. At $x=0$ the graph has a corner and there is no derivative.", ref:"p. 3",
      blank:{tex:"f(x)=|x| \\;\\Rightarrow\\; f'(x)=\\boxed{\\,?\\,}", answer:"x/abs(x)", vars:["x"], domain:[-3,3]}},
    {id:"L07.f.dabs-chain", name:"Absolute value with the Chain Rule", tex:"\\frac{d}{dx}|u(x)| = \\frac{u(x)}{|u(x)|}\\,u'(x)", note:"The pattern in the example $f(x)=|x^2+x|$, $f'(x)=\\frac{x^2+x}{|x^2+x|}(2x+1)$. Valid where $u(x)\\ne0$.", ref:"p. 3",
      blank:{tex:"\\frac{d}{dx}|u(x)| = \\boxed{\\,?\\,}", text:true, accept:["u(x)/|u(x)|*u'(x)","u/|u|*u'","(u/|u|)u'","u(x)u'(x)/|u(x)|","uu'/|u|","u'u/|u|","u/|u|u'"]}},
    {id:"L07.f.netchange", name:"Integral of a rate is a net change", tex:"\\int_a^b g(t)\\,dt = \\text{net change in } G(t) \\text{ from } t=a \\text{ to } t=b", note:"Here $g(t)$ is the rate of change of $G(t)$.", ref:"p. 3"},
    {id:"L07.f.intfn-meaning", name:"What an integral function measures", tex:"f(x)=\\int_a^x g(t)\\,dt = \\text{net change in } G(t) \\text{ from } t=a \\text{ to } t=x", ref:"p. 3"},
    {id:"L07.f.intfn", name:"Integral function (definition)", tex:"f(x) = \\int_a^x g(t)\\,dt", note:"$x$ is the independent variable of $f$. $t$ is the variable of integration.", ref:"p. 4",
      blank:{tex:"f(x) = \\int_a^{\\boxed{\\,?\\,}} g(t)\\,dt", text:true, accept:["x"]}},
    {id:"L07.f.erf", name:"Error function", tex:"\\operatorname{erf}(x) = \\frac{2}{\\sqrt{\\pi}}\\int_0^x e^{-t^2}\\,dt", note:"It cannot be evaluated exactly (except at $x=0$), so you approximate it.", ref:"pp. 4 to 5",
      blank:{tex:"\\operatorname{erf}(x) = \\boxed{\\,?\\,}\\int_0^x e^{-t^2}\\,dt", answer:"2/sqrt(pi)", type:"num"}},
    {id:"L07.f.dt", name:"Left Riemann Sum: step size", tex:"\\Delta t = \\frac{b-a}{n}", ref:"p. 5",
      blank:{tex:"\\Delta t = \\boxed{\\,?\\,}", answer:"(b-a)/n", vars:["a","b","n"], domain:[1,4]}},
    {id:"L07.f.ti", name:"Left Riemann Sum: points", tex:"t_i = a + i\\Delta t", ref:"p. 5",
      blank:{tex:"t_i = \\boxed{\\,?\\,}", text:true, accept:["a+iΔt","a+i\\Delta t","a+i delta t","a+idt","a+i(Δt)","a+i*Δt"]}},
    {id:"L07.f.lrs", name:"Left Riemann Sum ($n=3$)", tex:"\\int_a^b g(t)\\,dt \\approx g(t_0)\\Delta t + g(t_1)\\Delta t + g(t_2)\\Delta t", note:"With $n$ subdivisions you add $n$ terms, $t_0$ up to $t_{n-1}$. The right endpoint $t_n=b$ is not used.", ref:"p. 5",
      blank:{tex:"\\int_a^b g(t)\\,dt \\approx g(t_0)\\Delta t + g(t_1)\\Delta t + \\boxed{\\,?\\,}", text:true, accept:["g(t_2)Δt","g(t_2)\\Delta t","g(t2)Δt","g(t_2)dt","g(t2)dt"]}}
  ],
  glossary:[
    {id:"L07.t.error", term:"Upper bound for the error", def:"A number $r$ that the error in an approximation is guaranteed to stay below. If $b$ approximates $a$, you write $|a-b|<r$.", ref:"p. 1"},
    {id:"L07.t.abs", term:"Absolute value", def:"$|x|$ is $-x$ when $x<0$ and $x$ when $x\\ge0$. It is the distance from $x$ to 0, so $|a-b|$ is the distance between $a$ and $b$.", ref:"p. 2"},
    {id:"L07.t.drop", term:"Dropping the bars", def:"When you use property (iv) or (v), the absolute value signs disappear: $|x+1|\\le4$ becomes $-4\\le x+1\\le4$. Keeping the bars is a common mistake.", ref:"p. 2"},
    {id:"L07.t.cases", term:"Cases", def:"When you reach $|x|$ with no sign given, split into Case 1 ($x<0$, so $|x|=-x$) and Case 2 ($x\\ge0$, so $|x|=x$), then combine the answers.", ref:"p. 2"},
    {id:"L07.t.corner", term:"Corner", def:"A sharp point on a graph, like $y=|x|$ at $x=0$. The slope jumps from $-1$ to $1$, so the derivative does not exist there.", ref:"p. 3"},
    {id:"L07.t.intfn", term:"Integral function", def:"A function of the form $f(x)=\\int_a^x g(t)\\,dt$. It gives the net change in $G(t)$ from $t=a$ to $t=x$, which is the signed area under $g$ from $a$ to $x$.", ref:"p. 4"},
    {id:"L07.t.vars", term:"Independent variable and variable of integration", def:"In $f(x)=\\int_a^x g(t)\\,dt$, $x$ is the input of $f$ and $t$ only lives inside the integral. After integrating, only $x$ is left.", ref:"p. 3"},
    {id:"L07.t.erf", term:"Error function", def:"$\\operatorname{erf}(x)=\\frac{2}{\\sqrt\\pi}\\int_0^x e^{-t^2}\\,dt$, the most used integral function in science. Its values have to be approximated.", ref:"p. 4"},
    {id:"L07.t.lrs", term:"Left Riemann Sum", def:"An approximation of $\\int_a^b g(t)\\,dt$: split $[a,b]$ into $n$ equal pieces of width $\\Delta t$ and add $g(t_i)\\Delta t$ using the left end of each piece.", ref:"p. 5"}
  ],
  figures:{
    errband:{title:"Absolute value as a distance", cap:"<b>Fig. 7.1</b> $|x-a|$ is the distance from $x$ to $a$. The solutions of $|x-a|<r$ are the numbers within $r$ of $a$. The solutions of $|x-a|>r$ are the rest. (Lecture 7, pp. 1 to 2)",
      build(host,{PLOT}){
        const X0=-6.5, X1=8.5;
        let a=-1, r=4, mode="lt";
        const f=x=>Math.abs(x-a), line=()=>r;
        const G=PLOT.graph(host,{x:[X0,X1],y:[-1,6.5],c:"var(--u3)",xlabel:"x",ylabel:"y"});
        const shIn=G.between(f,line,a-r,a+r), shL=G.between(f,line,X0,a-r), shR=G.between(f,line,a+r,X1);
        const cv=G.fn(f,{cls:"cv c"});
        const hl=G.line(X0,r,X1,r,{cls:"tan dash"});
        const vL=G.line(0,0,0,0,{cls:"lt dash"}), vR=G.line(0,0,0,0,{cls:"lt dash"});
        const s1=G.line(0,0,0,0,{cls:"tan"}), s2=G.line(0,0,0,0,{cls:"tan"});
        [s1,s2].forEach(s=>{ s.style.strokeWidth=5; s.style.strokeLinecap="round"; });
        const oL=G.open(0,0), oR=G.open(0,0);
        const lab=G.label(0,0,"y = |x − a|",{cls:"lblc",dx:8,dy:4});
        const lr=G.label(X0,0,"y = r",{cls:"lblc",dx:4,dy:-6});
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Inequality",items:[["lt","|x − a| &lt; r"],["gt","|x − a| &gt; r"]],value:mode,onchange:v=>{ mode=v; draw(); }});
        PLOT.slider(ctl,{label:"Centre a",min:-2,max:4,step:0.5,value:a,fmt:v=>fmt(v),oninput:v=>{ a=v; draw(); }});
        PLOT.slider(ctl,{label:"Error bound r",min:0.5,max:4,step:0.25,value:r,fmt:v=>fmt(v),oninput:v=>{ r=v; draw(); }});
        const ro=PLOT.readout(host);
        function draw(){
          const lo=a-r, hi=a+r;
          cv.update(f); hl.set(X0,r,X1,r); lr.set(X0,r);
          vL.set(lo,0,lo,r); vR.set(hi,0,hi,r); oL.set(lo,0); oR.set(hi,0);
          const lx=Math.min(X1-3.2,a+4.2); lab.set(lx,f(lx));
          const ins=a===0?"x":a<0?`x + ${fmt(-a)}`:`x − ${fmt(a)}`;
          if(mode==="lt"){
            shIn.style.display=""; shL.style.display="none"; shR.style.display="none"; shIn.update(f,line,lo,hi);
            s1.set(lo,0,hi,0); s2.style.display="none";
            ro.innerHTML=`|${ins}| &lt; ${fmt(r)} &nbsp;⟺&nbsp; −${fmt(r)} &lt; ${ins} &lt; ${fmt(r)} &nbsp;⟺&nbsp; <b>${fmt(lo)} &lt; x &lt; ${fmt(hi)}</b>`;
          } else {
            shIn.style.display="none"; shL.style.display=""; shR.style.display=""; shL.update(f,line,X0,lo); shR.update(f,line,hi,X1);
            s1.set(X0,0,lo,0); s2.style.display=""; s2.set(hi,0,X1,0);
            ro.innerHTML=`|${ins}| &gt; ${fmt(r)} &nbsp;⟺&nbsp; ${ins} &lt; −${fmt(r)} or ${ins} &gt; ${fmt(r)} &nbsp;⟺&nbsp; <b>x &lt; ${fmt(lo)} or x &gt; ${fmt(hi)}</b>`;
          }
        }
        draw();
      }},
    abscases:{title:"When $x^2$ is inside the bars", cap:"<b>Fig. 7.2</b> $|x^2-c|<k$ means $c-k<x^2<c+k$: the parabola has to sit inside the band. Usually that happens on two pieces, one for $x<0$ and one for $x\\ge0$. (Lecture 7, p. 2)",
      build(host,{PLOT}){
        const X0=-3.3, X1=3.3, Y0=-1.5;
        let c=2, k=1;
        const f=x=>x*x;
        const G=PLOT.graph(host,{x:[X0,X1],y:[Y0,9.5],c:"var(--u3)",xlabel:"x",ylabel:"y"});
        const band=G.between(()=>c+k,()=>Math.max(c-k,Y0),X0,X1);
        const top=G.line(X0,0,X1,0,{cls:"tan dash"}), bot=G.line(X0,0,X1,0,{cls:"tan dash"});
        G.fn(f);
        const hL=G.fn(f,{cls:"cv c",width:4.5}), hR=G.fn(f,{cls:"cv c",width:4.5});
        const s1=G.line(0,0,0,0,{cls:"tan"}), s2=G.line(0,0,0,0,{cls:"tan"});
        [s1,s2].forEach(s=>{ s.style.strokeWidth=5; s.style.strokeLinecap="round"; });
        const d=[G.open(0,0),G.open(0,0),G.open(0,0),G.open(0,0)];
        const lt=G.label(X0,0,"y = c + k",{cls:"lblc",dx:4,dy:-6}), lb=G.label(X0,0,"y = c − k",{cls:"lblc",dx:4,dy:14});
        const ctl=PLOT.controls(host);
        PLOT.slider(ctl,{label:"c",min:0.5,max:5,step:0.5,value:c,fmt:v=>fmt(v),oninput:v=>{ c=v; draw(); }});
        PLOT.slider(ctl,{label:"k",min:0.25,max:4,step:0.25,value:k,fmt:v=>fmt(v),oninput:v=>{ k=v; draw(); }});
        const ro=PLOT.readout(host);
        function draw(){
          const up=c+k, lw=c-k, R2=Math.sqrt(up);
          top.set(X0,up,X1,up); lt.set(X0,up);
          if(lw>Y0){ bot.style.display=""; lb.style.display=""; bot.set(X0,lw,X1,lw); lb.set(X0,lw); } else { bot.style.display="none"; lb.style.display="none"; }
          band.update(()=>up,()=>Math.max(lw,Y0),X0,X1);
          let head=`|x² − ${fmt(c)}| &lt; ${fmt(k)} &nbsp;⟺&nbsp; ${fmt(lw)} &lt; x² &lt; ${fmt(up)}`;
          if(lw>=0){
            const R1=Math.sqrt(lw);
            hL.update(f,-R2,-R1); hR.update(f,R1,R2); hR.style.display=""; s2.style.display="";
            s1.set(-R2,0,-R1,0); s2.set(R1,0,R2,0);
            d.forEach((p,i)=>{ p.style.display=""; p.set([-R2,-R1,R1,R2][i],0); });
            ro.innerHTML=`${head} &nbsp;⟺&nbsp; ${fmt(R1)} &lt; |x| &lt; ${fmt(R2)}<br>Case 1 (x &lt; 0) and Case 2 (x ≥ 0) give <b>−${fmt(R2)} &lt; x &lt; −${fmt(R1)}</b> and <b>${fmt(R1)} &lt; x &lt; ${fmt(R2)}</b>`;
          } else {
            hL.update(f,-R2,R2); hR.style.display="none"; s2.style.display="none";
            s1.set(-R2,0,R2,0);
            d.forEach((p,i)=>{ if(i===1||i===2){ p.style.display="none"; } else { p.style.display=""; p.set(i===0?-R2:R2,0); } });
            ro.innerHTML=`${head}<br>x² ≥ 0 &gt; ${fmt(lw)} always holds, so only |x| &lt; ${fmt(R2)} matters: <b>−${fmt(R2)} &lt; x &lt; ${fmt(R2)}</b>`;
          }
        }
        draw();
      }},
    absderiv:{title:"The slope of $|u(x)|$", cap:"<b>Fig. 7.3</b> The slope of $|u|$ is $\\frac{u}{|u|}\\cdot u'$. Where $u<0$ the graph is flipped, so the slope changes sign. Where $u=0$ there is a corner and no derivative. (Lecture 7, p. 3)",
      build(host,{PLOT}){
        const FN={
          abs:{u:x=>x, du:()=>1, ut:"x", b:[-2.4,2.4], x:-1.2},
          quad:{u:x=>x*x+x, du:x=>2*x+1, ut:"x² + x", b:[-2.25,1.55], x:-0.6},
          exp:{u:x=>Math.exp(x)+x, du:x=>Math.exp(x)+1, ut:"eˣ + x", b:[-2.4,1.15], x:-1.2}
        };
        let key="abs";
        const plot=document.createElement("div"); host.append(plot);
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Function",items:[["abs","|x|"],["quad","|x² + x|"],["exp","|eˣ + x|"]],value:key,onchange:v=>{ key=v; build(); }});
        const ro=PLOT.readout(host);
        function build(){
          plot.innerHTML="";
          const F=FN[key], f=x=>Math.abs(F.u(x));
          const G=PLOT.graph(plot,{x:[-2.5,2.5],y:[-1.5,4.5],c:"var(--u3)",xlabel:"x",ylabel:"y"});
          G.fn(F.u,{cls:"lt dash"});
          G.fn(f,{cls:"cv c"});
          G.label(-2.45,4.1,"dashed: u(x)   solid: |u(x)|",{cls:"lblc"});
          const tan=G.tangent(F.x,f(F.x),0);
          const upd=x=>{
            const u=F.u(x), du=F.du(x);
            if(Math.abs(u)<0.03){ tan.style.display="none"; ro.innerHTML=`x = ${fmt(x,2)} &nbsp; u = ${F.ut} = ${fmt(u,2)}: the inside is 0 here, so there is a corner and <b>no derivative</b>`; return; }
            const s=u/Math.abs(u), m=s*du; tan.style.display=""; tan.at(x,f(x),m);
            ro.innerHTML=`x = ${fmt(x,2)} &nbsp; u = ${F.ut} = ${fmt(u,2)} &nbsp; u/|u| = <b>${s>0?"1":"−1"}</b> &nbsp; u′ = ${fmt(du,2)} &nbsp; slope f′(x) = <b>${fmt(m,2)}</b>`;
          };
          G.handle(F.x,f(F.x),{f,bounds:F.b,label:"Point on the graph",onMove:upd}); upd(F.x);
        }
        build();
      }},
    erf:{title:"Approximating the error function", cap:"<b>Fig. 7.4</b> $f(x)=\\int_0^x e^{-t^2}\\,dt$ is the shaded area. The rectangles are the Left Riemann Sum with $n$ subdivisions. For $x<0$, $\\Delta t$ is negative, so the sum is negative. (Lecture 7, pp. 4 to 5)",
      build(host,{PLOT}){
        const g=t=>Math.exp(-t*t);
        let x=1.5, n=3;
        const G=PLOT.graph(host,{x:[-2.3,2.3],y:[-0.22,1.3],c:"var(--u3)",xlabel:"t",ylabel:"y",ystep:0.2});
        const area=G.area(g,0,x);
        const rects=G.rects([]);
        G.fn(g,{cls:"cv c"});
        G.label(0.9,1.12,"y = e^(−t²)",{cls:"lblc"});
        const ctl=PLOT.controls(host);
        PLOT.slider(ctl,{label:"Upper limit x",min:-2,max:2,step:0.1,value:x,fmt:v=>fmt(v,1),oninput:v=>{ x=v; draw(); }});
        PLOT.slider(ctl,{label:"Subdivisions n",min:1,max:12,step:1,value:n,oninput:v=>{ n=v; draw(); }});
        const ro=PLOT.readout(host);
        function draw(){
          area.update(g,0,x);
          const dt=x/n, L=[]; let s=0;
          for(let i=0;i<n;i++){ const ti=i*dt; s+=g(ti)*dt; L.push(dt>=0?{x:ti,w:dt,h:g(ti)}:{x:ti+dt,w:-dt,h:g(ti)}); }
          rects.update(L);
          const tv=simpson(g,0,x);
          ro.innerHTML=`Δt = (${fmt(x,1)} − 0)/${n} = <b>${fmt(dt,4)}</b> &nbsp; left sum ≈ <b>${fmt(s,4)}</b> &nbsp; f(${fmt(x,1)}) ≈ ${fmt(tv,4)} &nbsp; erf(${fmt(x,1)}) ≈ ${fmt(2/Math.sqrt(Math.PI)*tv,4)}`;
        }
        draw();
      }}
  },
  gens:[
    {id:"L07.g.abs-ineq", title:"Absolute value inequalities", skill:"Solve $|px+q|<r$ and $|px+q|>r$", ref:"p. 2",
      gen(R,d){
        const rels=d===1?["<","\\le"]:["<","\\le",">","\\ge"];
        if(d===1){
          const a=R.nz(-8,8), b=R.int(1,9), rel=R.pick(["<","\\le"]), st=strictOf(rel);
          const lo=a-b, hi=a+b, ins=xm(a);
          return {prompt:`Find all values of $x$ such that $|${ins}| ${rel} ${b}$.`,
            answer:{type:"interval",answer:`${st?"(":"["}${lo}, ${hi}${st?")":"]"}`},
            hint:"Property (iv): $|u| < a$ is the same as $-a < u < a$. The bars come off.",
            steps:[`By property (iv): $-${b} ${rel} ${ins} ${rel} ${b}$. The absolute value signs are gone.`,
              `${a>0?`Add ${a}`:`Subtract ${-a}`} in all three parts: $-${b} ${a>0?"+":"-"} ${Math.abs(a)} ${rel} x ${rel} ${b} ${a>0?"+":"-"} ${Math.abs(a)}$.`,
              `So $${lo} ${rel} x ${rel} ${hi}$.`],
            answerTeX:`$${lo} ${rel} x ${rel} ${hi}$, that is $x$ in $${st?"(":"["}${lo}, ${hi}${st?")":"]"}$`};
        }
        const kind=d===2?R.pick(["A","B","C"]):R.pick(["D","E","F"]);
        const iv=(lo,hi,st)=>`${st?"(":"["}${qa(lo)}, ${qa(hi)}${st?")":"]"}`;
        const ivT=(lo,hi,st)=>`${st?"(":"["}${qt(lo)}, ${qt(hi)}${st?")":"]"}`;
        if(kind==="A"||kind==="C"){
          const p=R.int(2,5), q=R.nz(-9,9), r=R.int(1,9);
          const u=lin(p,q), lo=Q(-r-q,p), hi=Q(r-q,p);
          const qs=q>0?"-":"+", qq=Math.abs(q);
          if(kind==="A"){ const rel=R.pick(["<","\\le"]), st=strictOf(rel);
            return {prompt:`Find all values of $x$ such that $|${u}| ${rel} ${r}$.`, answer:{type:"interval",answer:iv(lo,hi,st)},
              hint:"Use property (iv) to drop the bars, then get $x$ alone in the middle. Whatever you do, do it to all three parts.",
              steps:[`Property (iv): $-${r} ${rel} ${u} ${rel} ${r}$.`,`${q>0?"Subtract":"Add"} ${qq}: $${-r-q} ${rel} ${p}x ${rel} ${r-q}$.`,`Divide all three parts by ${p} (positive, so the signs stay): $${qt(lo)} ${rel} x ${rel} ${qt(hi)}$.`],
              answerTeX:`$${qt(lo)} ${rel} x ${rel} ${qt(hi)}$, that is $${ivT(lo,hi,st)}$`}; }
          const rel=R.pick([">","\\ge"]), st=strictOf(rel), rl=rel===">"?"<":"\\le";
          const ans=`(-inf, ${qa(lo)}${st?")":"]"} U ${st?"(":"["}${qa(hi)}, inf)`;
          return {prompt:`Find all values of $x$ such that $|${u}| ${rel} ${r}$.`, answer:{type:"interval",answer:ans},
            hint:"Property (v): $|u| > a$ means $u < -a$ or $u > a$. You get two separate pieces.",
            steps:[`Property (v): $${u} ${rl} -${r}$ or $${u} ${rel} ${r}$.`,`First piece: $${p}x ${rl} ${-r-q}$, so $x ${rl} ${qt(lo)}$.`,`Second piece: $${p}x ${rel} ${r-q}$, so $x ${rel} ${qt(hi)}$.`],
            answerTeX:`$x ${rl} ${qt(lo)}$ or $x ${rel} ${qt(hi)}$`};
        }
        if(kind==="B"){
          const k=R.int(2,4), q=R.nz(-6,6), r=R.int(1,5), rel=R.pick(["<","\\le"]), st=strictOf(rel);
          const kr=k*r, lo=Q(-kr-q), hi=Q(kr-q);
          return {prompt:`Find all values of $x$ such that $\\dfrac{|${xm(-q)}|}{${k}} ${rel} ${r}$.`, answer:{type:"interval",answer:iv(lo,hi,st)},
            hint:`Multiply both sides by ${k} first, so the absolute value is on its own.`,
            steps:[`Multiply by ${k}: $|${xm(-q)}| ${rel} ${kr}$.`,`Property (iv): $-${kr} ${rel} ${xm(-q)} ${rel} ${kr}$.`,`${q>0?"Subtract":"Add"} ${Math.abs(q)}: $${qa(lo)} ${rel} x ${rel} ${qa(hi)}$.`],
            answerTeX:`$${qa(lo)} ${rel} x ${rel} ${qa(hi)}$`};
        }
        if(kind==="D"){
          const p=R.int(2,4), q=R.int(1,9), r=R.int(1,9), rel=R.pick(["<","\\le"]), st=strictOf(rel);
          const lo=Q(q-r,p), hi=Q(q+r,p), u=`${q} - ${p===1?"":p}x`;
          return {prompt:`Find all values of $x$ such that $|${u}| ${rel} ${r}$.`, answer:{type:"interval",answer:iv(lo,hi,st)},
            hint:"Property (iv) first. When you divide by a negative number, both inequality signs flip.",
            steps:[`Property (iv): $-${r} ${rel} ${u} ${rel} ${r}$.`,`${q>0?"Subtract":"Add"} ${Math.abs(q)}: $${-r-q} ${rel} -${p}x ${rel} ${r-q}$.`,`Divide by $-${p}$. Dividing by a negative flips both signs: $${qt(Q(r+q,p))} ${flip[rel]} x ${flip[rel]} ${qt(Q(q-r,p))}$.`,`Written from smallest to largest: $${qt(lo)} ${rel} x ${rel} ${qt(hi)}$.`],
            answerTeX:`$${qt(lo)} ${rel} x ${rel} ${qt(hi)}$`};
        }
        if(kind==="E"){
          const c=R.int(2,4), p=R.int(1,3), q=R.nz(-5,5), r=R.int(1,9), rel=R.pick([">","\\ge"]), st=strictOf(rel), rl=rel===">"?"<":"\\le";
          const rc=Q(r,c), lo=Q(-r-q*c,c*p), hi=Q(r-q*c,c*p), u=lin(p,q);
          const ans=`(-inf, ${qa(lo)}${st?")":"]"} U ${st?"(":"["}${qa(hi)}, inf)`;
          return {prompt:`Find all values of $x$ satisfying $${c}|${u}| ${rel} ${r}$.`, answer:{type:"interval",answer:ans},
            hint:`Divide by ${c} first. Then property (v) splits it into two pieces.`,
            steps:[`Divide by ${c}: $|${u}| ${rel} ${qt(rc)}$.`,`Property (v): $${u} ${rl} -${qt(rc)}$ or $${u} ${rel} ${qt(rc)}$.`,`${q>0?"Subtract":"Add"} ${Math.abs(q)}${p>1?` and divide by ${p}`:""}: $x ${rl} ${qt(lo)}$ or $x ${rel} ${qt(hi)}$.`],
            answerTeX:`$x ${rl} ${qt(lo)}$ or $x ${rel} ${qt(hi)}$`};
        }
        // F: |x - a| < m/n
        const a=R.nz(-6,6), nn=R.pick([2,3,4,5]), m=R.int(1,nn-1), rel=R.pick(["<","\\le"]), st=strictOf(rel);
        const b=Q(m,nn), lo=Q(a*nn-m,nn), hi=Q(a*nn+m,nn);
        return {prompt:`Find all values of $x$ satisfying $|${xm(a)}| ${rel} ${qt(b)}$.`, answer:{type:"interval",answer:iv(lo,hi,st)},
          hint:"Property (iv), then add or subtract in all three parts. Write $"+Math.abs(a)+"$ with denominator "+b[1]+" to combine the fractions.",
          steps:[`Property (iv): $-${qt(b)} ${rel} ${xm(a)} ${rel} ${qt(b)}$.`,`${a>0?"Add":"Subtract"} ${Math.abs(a)}, which is $\\frac{${Math.abs(a)*b[1]}}{${b[1]}}$, in all three parts: $${qt(lo)} ${rel} x ${rel} ${qt(hi)}$.`],
          answerTeX:`$${qt(lo)} ${rel} x ${rel} ${qt(hi)}$`};
      }},
    {id:"L07.g.abs-quad", title:"Inequalities with $x^2$", skill:"Use $\\sqrt{x^2}=|x|$ and cases", ref:"pp. 2 to 3",
      gen(R,d){
        const iv=(a,b,lc,rc)=>`${lc?"[":"("}${a}, ${b}${rc?"]":")"}`;
        if(d===1){
          const c=R.pick([2,3,4,5,6,7,9,10,16]), rel=R.pick([">","<","\\ge","\\le"]), st=strictOf(rel);
          const s=sqT(c), sa=sqA(c);
          if(rel===">"||rel==="\\ge"){ const rl=rel===">"?"<":"\\le";
            return {prompt:`Find all values of $x$ such that $x^2 ${rel} ${c}$.`, answer:{type:"interval",answer:`(-inf, -${sa}${st?")":"]"} U ${st?"(":"["}${sa}, inf)`},
              hint:"Take the square root of both sides, then use $\\sqrt{x^2}=|x|$. Do not write $x$.",
              steps:[`Square root of both sides: $\\sqrt{x^2} ${rel} ${s}$.`,`Property (i): $\\sqrt{x^2}=|x|$, so $|x| ${rel} ${s}$.`,`Property (v): $x ${rl} -${s}$ or $x ${rel} ${s}$.`],
              answerTeX:`$x ${rl} -${s}$ or $x ${rel} ${s}$`}; }
          return {prompt:`Find all values of $x$ such that $x^2 ${rel} ${c}$.`, answer:{type:"interval",answer:iv(`-${sa}`,sa,!st,!st)},
            hint:"Take the square root of both sides, then use $\\sqrt{x^2}=|x|$.",
            steps:[`Square root of both sides: $\\sqrt{x^2} ${rel} ${s}$.`,`Property (i): $|x| ${rel} ${s}$.`,`Property (iv): $-${s} ${rel} x ${rel} ${s}$.`],
            answerTeX:`$-${s} ${rel} x ${rel} ${s}$`};
        }
        const caseSteps=(A,B,r1,r2)=>[`Case 1: if $x<0$, then $|x|=-x$, so $${A} ${r1} -x ${r2} ${B}$. Multiply by $-1$, which flips both signs: $-${A} ${flip[r1]} x ${flip[r2]} -${B}$.`,`Case 2: if $x\\ge0$, then $|x|=x$, so $${A} ${r1} x ${r2} ${B}$.`];
        if(d===2){
          const c1=R.int(1,6), c2=c1+R.int(1,7), r1=R.pick(["<","\\le"]), r2=R.pick(["<","\\le"]);
          const m=R.pick([1,1,2,3]), s=R.int(-4,4);
          const k1=m*c1+s, k2=m*c2+s;
          const mid=`${m===1?"":m}x^2${M.term(s,"x",0)}`;
          const A=sqT(c1), B=sqT(c2), Aa=sqA(c1), Ba=sqA(c2);
          const n1=r1==="\\le", n2=r2==="\\le";
          const ans=`${iv(`-${Ba}`,`-${Aa}`,n2,n1)} U ${iv(Aa,Ba,n1,n2)}`;
          const pre=(m===1&&s===0)?[]:[`${s!==0?`${s>0?"Subtract":"Add"} ${Math.abs(s)}`:""}${s!==0&&m!==1?" and divide":""}${s===0?"Divide":""}${m!==1?` by ${m}`:""}: $${c1} ${r1} x^2 ${r2} ${c2}$.`];
          return {prompt:`Find all values of $x$ satisfying $${k1} ${r1} ${mid} ${r2} ${k2}$.`, answer:{type:"interval",answer:ans},
            hint:"Get $x^2$ alone in the middle, take square roots, write $|x|$, then do Case 1 ($x<0$) and Case 2 ($x\\ge0$).",
            steps:pre.concat([`Square roots: $\\sqrt{${c1}} ${r1} \\sqrt{x^2} ${r2} \\sqrt{${c2}}$, and by property (i), $${A} ${r1} |x| ${r2} ${B}$.`],caseSteps(A,B,r1,r2),[`So the solutions are $-${B} ${r2} x ${r1} -${A}$ and $${A} ${r1} x ${r2} ${B}$.`]),
            answerTeX:`$-${B} ${r2} x ${r1} -${A}$ and $${A} ${r1} x ${r2} ${B}$`};
        }
        const kind=R.pick(["A","A","B","C"]);
        if(kind==="A"){
          const c=R.int(2,8), k=R.int(1,c-1), rel=R.pick(["<","\\le"]), n=rel==="\\le";
          const A=sqT(c-k), B=sqT(c+k), Aa=sqA(c-k), Ba=sqA(c+k);
          return {prompt:`Find all values of $x$ satisfying $|x^2-${c}| ${rel} ${k}$.`, answer:{type:"interval",answer:`${iv(`-${Ba}`,`-${Aa}`,n,n)} U ${iv(Aa,Ba,n,n)}`},
            hint:"Property (iv) first (the bars come off), then this is like $c_1 < x^2 < c_2$.",
            steps:[`Property (iv): $-${k} ${rel} x^2-${c} ${rel} ${k}$.`,`Add ${c}: $${c-k} ${rel} x^2 ${rel} ${c+k}$.`,`Square roots and property (i): $${A} ${rel} |x| ${rel} ${B}$.`].concat(caseSteps(A,B,rel,rel),[`So $-${B} ${rel} x ${rel} -${A}$ and $${A} ${rel} x ${rel} ${B}$.`]),
            answerTeX:`$-${B} ${rel} x ${rel} -${A}$ and $${A} ${rel} x ${rel} ${B}$`};
        }
        if(kind==="B"){
          const c=R.int(1,3), k=c+R.int(1,5), rel=R.pick(["<","\\le"]), n=rel==="\\le";
          const B=sqT(c+k), Ba=sqA(c+k);
          return {prompt:`Find all values of $x$ satisfying $|x^2-${c}| ${rel} ${k}$.`, answer:{type:"interval",answer:iv(`-${Ba}`,Ba,n,n)},
            hint:"After property (iv), look at the left side. Can $x^2$ ever be less than a negative number?",
            steps:[`Property (iv): $-${k} ${rel} x^2-${c} ${rel} ${k}$.`,`Add ${c}: $${c-k} ${rel} x^2 ${rel} ${c+k}$.`,`$x^2\\ge0>${c-k}$ for every $x$, so the left inequality always holds. Only $x^2 ${rel} ${c+k}$ matters.`,`Square roots and property (i): $|x| ${rel} ${B}$, so by property (iv), $-${B} ${rel} x ${rel} ${B}$.`],
            answerTeX:`$-${B} ${rel} x ${rel} ${B}$`};
        }
        const c=R.int(3,8), k=R.int(1,c-1), A=sqT(c-k), B=sqT(c+k), Aa=sqA(c-k), Ba=sqA(c+k);
        return {prompt:`Find all values of $x$ such that $|${c}-x^2| > ${k}$.`, answer:{type:"interval",answer:`(-inf, -${Ba}) U (-${Aa}, ${Aa}) U (${Ba}, inf)`},
          hint:"Property (v) gives two inequalities. Solve each one for $x^2$, then use $\\sqrt{x^2}=|x|$.",
          steps:[`Property (v): $${c}-x^2>${k}$ or $${c}-x^2<-${k}$.`,`First: $x^2<${c-k}$, so $|x|<${A}$, which gives $-${A}<x<${A}$.`,`Second: $x^2>${c+k}$, so $|x|>${B}$, which gives $x<-${B}$ or $x>${B}$ (property (v)).`,`Put the pieces together.`],
          answerTeX:`$x<-${B}$, or $-${A}<x<${A}$, or $x>${B}$`};
      }},
    {id:"L07.g.abs-deriv", title:"Derivative of $|u(x)|$", skill:"Differentiate an absolute value with the Chain Rule", ref:"p. 3",
      gen(R,d){
        let U;
        if(d===1){ const a=R.nz(-6,6), b=R.nz(-9,9); U={t:lin(a,b),a:`${a}x+${b}`,dt:String(a),da:String(a),one:true,dom:[-3,3]}; }
        else if(d===2){
          const b=R.nz(-5,5), c=R.nz(-6,6), k=R.nz(-4,4), kk=R.pick([1,2,3]);
          U=R.pick([
            {t:`x^2${M.term(b,"x",1)}`,a:`x^2+${b}x`,dt:`2x${M.term(b,"x",0)}`,da:`2x+${b}`,dom:[-3,3]},
            {t:`x^3${M.term(c,"x",0)}`,a:`x^3+${c}`,dt:`3x^2`,da:`3x^2`,one:true,dom:[-2,2]},
            {t:`e^x${M.term(k,"x",1)}`,a:`e^x+${k}x`,dt:`e^x${M.term(k,"x",0)}`,da:`e^x+${k}`,dom:[-2,2]},
            {t:`x^2+${kk===1?"":kk}\\cos(x)`,a:`x^2+${kk}cos(x)`,dt:`2x-${kk===1?"":kk}\\sin(x)`,da:`2x-${kk}sin(x)`,dom:[-3,3]},
            {t:`e^x-${kk+1}`,a:`e^x-${kk+1}`,dt:`e^x`,da:`e^x`,one:true,dom:[-2,2]},
            {t:`\\sin(x)${M.term(-kk,"x",0)}`,a:`sin(x)-${kk}`,dt:`\\cos(x)`,da:`cos(x)`,one:true,dom:[-3,3]}]);
        } else {
          const pick=R.pick(["xsin","xexp","oneminus","xabs","xabs2"]);
          if(pick==="xabs"||pick==="xabs2"){
            const n=pick==="xabs"?1:2;
            const ans=n===1?`abs(x)+x*x/abs(x)`:`2x*abs(x)+x^2*x/abs(x)`;
            return {prompt:`Find $f'(x)$ for $f(x) = x${n===2?"^2":""}|x|$.`, answer:{answer:ans,vars:["x"],domain:[-3,3]}, verify:{deriv:`x^${n}*abs(x)`},
              hint:"Product Rule first. The derivative of $|x|$ is $\\frac{x}{|x|}$. At the end, $x^2 = |x|^2$ lets you simplify.",
              steps:[`Product Rule with factors $x${n===2?"^2":""}$ and $|x|$: $f'(x) = ${n===1?"1":"2x"}\\cdot|x| + x${n===2?"^2":""}\\cdot\\frac{x}{|x|}$.`,
                `$= ${n===1?"|x|":"2x|x|"} + \\frac{x^${n+1}}{|x|}$.`,
                n===1?`Since $x^2=|x|^2$, $\\frac{x^2}{|x|} = |x|$. So $f'(x) = |x|+|x| = 2|x|$.`:`Since $x^2=|x|^2$, $\\frac{x^3}{|x|} = x\\cdot\\frac{x^2}{|x|} = x|x|$. So $f'(x) = 2x|x|+x|x| = 3x|x|$.`,
                `This holds for $x\\ne0$ (the formula for $\\frac{d}{dx}|x|$ needs $x\\ne0$).`],
              answerTeX:n===1?`$f'(x) = |x| + \\frac{x^2}{|x|} = 2|x|$`:`$f'(x) = 2x|x| + \\frac{x^3}{|x|} = 3x|x|$`};
          }
          const k=R.pick([1,2,3]);
          U={xsin:{t:"x\\sin(x)",a:"x*sin(x)",dt:"\\sin(x)+x\\cos(x)",da:"sin(x)+x*cos(x)",dom:[-3,3],prod:true},
             xexp:{t:`xe^x-${k}`,a:`x*e^x-${k}`,dt:"e^x+xe^x",da:"e^x+x*e^x",dom:[-2,2],prod:true},
             oneminus:{t:`${k}-e^{x^2}`,a:`${k}-e^(x^2)`,dt:"-2xe^{x^2}",da:"-2x*e^(x^2)",one:true,dom:[-1.4,1.4]}}[pick];
        }
        const dtB=U.one?(U.dt.startsWith("-")?`\\left(${U.dt}\\right)`:U.dt):`\\left(${U.dt}\\right)`;
        const fr=`\\frac{${U.t}}{|${U.t}|}`;
        return {prompt:`Find $f'(x)$ for $f(x) = |${U.t}|$.`, answer:{answer:`(${U.a})/abs(${U.a})*(${U.da})`,vars:["x"],domain:U.dom}, verify:{deriv:`abs(${U.a})`},
          hint:"Chain Rule with $\\frac{d}{dx}|x|=\\frac{x}{|x|}$: you get $\\frac{u}{|u|}\\cdot u'$ where $u$ is everything inside the bars.",
          steps:[`The inside function is $u = ${U.t}$.`,
            U.prod?`By the Product Rule, $u' = ${U.dt}$.`:`$u' = ${U.dt}$.`,
            `Chain Rule: $f'(x) = \\frac{u}{|u|}\\cdot u' = ${fr}\\cdot ${dtB}$. ${U.one?"Keep":"Keep the brackets around $u'$ and keep"} the bars in the denominator.`,
            `This is valid wherever $${U.t}\\ne0$.`],
          answerTeX:`$f'(x) = ${fr}\\cdot ${dtB}$`};
      }},
    {id:"L07.g.sqrt-sign", title:"Simplify using a sign", skill:"Use $\\sqrt{x^2}=|x|$ and the given sign of $x$", ref:"pp. 2 to 3",
      gen(R,d){
        const clean=s=>String(s).replace(/\s+/g,"");
        const why="That is equal, but not fully simplified. Use the sign you were given to remove the absolute value bars, and cancel what you can.";
        const kind=d===1?R.pick(["a","b"]):d===2?R.pick(["b","c","c"]):R.pick(["c","d","e"]);
        if(kind==="a"){
          const a=R.nz(-6,6), gt=R.pick([true,false]), ins=xm(a);
          return {prompt:`Simplify $\\sqrt{(${ins})^2}$ where $x ${gt?">":"<"} ${a}$.`,
            answer:{answer:gt?`x-(${a})`:`${a}-x`,vars:["x"],domain:gt?[a+0.3,a+4]:[a-4,a-0.3],form:s=>!/sqrt|abs|\||√/.test(clean(s)),formWhy:why},
            hint:"Property (i) turns $\\sqrt{u^2}$ into $|u|$. Then decide the sign of $u$ from the condition on $x$.",
            steps:[`Property (i): $\\sqrt{(${ins})^2} = |${ins}|$.`,gt?`Since $x>${a}$, $${ins}>0$, so $|${ins}| = ${ins}$.`:`Since $x<${a}$, $${ins}<0$, so $|${ins}| = -(${ins}) = ${a} - x$.`],
            answerTeX:gt?`$${ins}$`:`$${a}-x$`};
        }
        if(kind==="b"){
          const m=R.pick([1,2,3]), c=m*m, out=R.pick([true,false]);
          return {prompt:`If ${out?`$x > ${m}$`:`$-${m} < x < ${m}$`}, what is $|${c}-x^2|$ without absolute value signs?`,
            answer:{answer:out?`x^2-${c}`:`${c}-x^2`,vars:["x"],domain:out?[m+0.2,m+3]:[-m+0.2,m-0.2],form:s=>!/abs|\|/.test(clean(s)),formWhy:why},
            hint:"Find the sign of the inside, $"+c+"-x^2$, for these $x$. Then use the definition of absolute value.",
            steps:out?[`If $x>${m}$, then $x^2>${c}$, so $${c}-x^2<0$.`,`By definition, $|u|=-u$ when $u<0$: $|${c}-x^2| = -(${c}-x^2) = x^2-${c}$.`]
              :[`If $-${m}<x<${m}$, then $x^2<${c}$, so $${c}-x^2>0$.`,`By definition, $|u|=u$ when $u\\ge0$: $|${c}-x^2| = ${c}-x^2$.`],
            answerTeX:out?`$x^2-${c}$`:`$${c}-x^2$`};
        }
        const k=R.int(1,9);
        if(kind==="c"){
          const neg=R.pick([true,true,false]);
          return {prompt:`Given that $x ${neg?"<":">"} 0$, fully simplify $\\dfrac{\\sqrt{x^4+${k===1?"":k}x^2}}{x}$.`,
            answer:{answer:`${neg?"-":""}sqrt(x^2+${k})`,vars:["x"],domain:neg?[-3,-0.3]:[0.3,3],form:s=>!/abs|\||x\^4|\/x|sqrt\(x\^2\)/.test(clean(s)),formWhy:why},
            hint:"Factor $x^2$ out of the square root, split the root, and use $\\sqrt{x^2}=|x|$. Then use the sign of $x$.",
            steps:[`$\\frac{\\sqrt{x^4+${k===1?"":k}x^2}}{x} = \\frac{\\sqrt{x^2(x^2+${k})}}{x} = \\frac{\\sqrt{x^2}\\sqrt{x^2+${k}}}{x}$.`,`Property (i): $= \\frac{|x|\\sqrt{x^2+${k}}}{x}$.`,neg?`Since $x<0$, $|x|=-x$: $= \\frac{-x\\sqrt{x^2+${k}}}{x}$.`:`Since $x>0$, $|x|=x$: $= \\frac{x\\sqrt{x^2+${k}}}{x}$.`,`Cancel the $x$: $= ${neg?"-":""}\\sqrt{x^2+${k}}$.`],
            answerTeX:`$${neg?"-":""}\\sqrt{x^2+${k}}$`};
        }
        if(kind==="d"){
          return {prompt:`Given that $x<0$, simplify $x\\sqrt{1+\\dfrac{${k}}{x^2}}$ by moving the $x$ inside the square root.`,
            answer:{answer:`-sqrt(x^2+${k})`,vars:["x"],domain:[-3,-0.3],form:s=>!/abs|\||\/x/.test(clean(s)),formWhy:why},
            hint:"For $x<0$, $x=-|x|=-\\sqrt{x^2}$. The minus sign stays outside the root.",
            steps:[`Since $x<0$, $|x|=-x$, so $x=-|x|=-\\sqrt{x^2}$ (property (i)).`,`$x\\sqrt{1+\\frac{${k}}{x^2}} = -\\sqrt{x^2}\\sqrt{1+\\frac{${k}}{x^2}} = -\\sqrt{x^2\\left(1+\\frac{${k}}{x^2}\\right)}$.`,`$= -\\sqrt{x^2+${k}}$.`],
            answerTeX:`$-\\sqrt{x^2+${k}}$`};
        }
        return {prompt:`Given that $x<0$, simplify $\\dfrac{\\sqrt{x^2+${k}}}{x}$ by factoring $x^2$ out of the square root.`,
          answer:{answer:`-sqrt(1+${k}/x^2)`,vars:["x"],domain:[-3,-0.3],form:s=>!/abs|\||sqrt\(x\^2/.test(clean(s)),formWhy:why},
          hint:"$x^2+"+k+" = x^2\\left(1+\\frac{"+k+"}{x^2}\\right)$. Then $\\sqrt{x^2}=|x|=-x$ because $x<0$.",
          steps:[`$\\frac{\\sqrt{x^2+${k}}}{x} = \\frac{\\sqrt{x^2\\left(1+\\frac{${k}}{x^2}\\right)}}{x} = \\frac{\\sqrt{x^2}\\sqrt{1+\\frac{${k}}{x^2}}}{x}$.`,`Property (i): $= \\frac{|x|\\sqrt{1+\\frac{${k}}{x^2}}}{x}$.`,`Since $x<0$, $|x|=-x$: $= \\frac{-x\\sqrt{1+\\frac{${k}}{x^2}}}{x} = -\\sqrt{1+\\frac{${k}}{x^2}}$.`],
          answerTeX:`$-\\sqrt{1+\\frac{${k}}{x^2}}$`};
      }},
    {id:"L07.g.error-range", title:"Error bounds", skill:"Turn an error bound into a range of values", ref:"p. 1",
      gen(R,d){
        if(d===1){
          const C=R.pick([["\\pi","pi",3.14,0.01],["\\sqrt{2}","sqrt(2)",1.4,0.02],["\\sqrt{3}","sqrt(3)",1.73,0.01],["\\ln(2)","ln(2)",0.69,0.01],["e","e",2.72,0.01],["\\sqrt{5}","sqrt(5)",2.24,0.01]]);
          const [sym,,b,r]=C, dp=Math.max(String(b).split(".")[1].length,String(r).split(".")[1].length);
          const lo=(b-r).toFixed(dp), hi=(b+r).toFixed(dp);
          return {prompt:`$${sym}$ is approximately $${b}$, and this approximation is within $\\pm ${r}$. So $|${sym}-${b}|<${r}$. Find the range of values this gives for $${sym}$.`,
            answer:{type:"interval",answer:`(${lo}, ${hi})`},
            hint:"Property (iv) drops the bars. Then add the approximation to all three parts.",
            steps:[`Property (iv): $-${r} < ${sym}-${b} < ${r}$.`,`Add $${b}$ to all three parts: $${b}-${r} < ${sym} < ${b}+${r}$.`,`So $${lo} < ${sym} < ${hi}$.`],
            answerTeX:`$${lo} < ${sym} < ${hi}$`};
        }
        const S=R.pick([["v","the velocity of an asteroid","km/s",[8,14],[0.2,0.9]],["m","the mass of a sample","g",[2,9],[0.1,0.5]],["T","a patient's temperature","°C",[36,39],[0.1,0.4]],["L","the length of a leaf","cm",[4,12],[0.2,0.8]],["D","a drug dose","mg",[20,60],[1,4]]]);
        const [sym,what,unit,[b0,b1],[r0,r1]]=S;
        const big=r1>=1;
        const b=big?R.int(b0,b1):R.int(b0*10,b1*10)/10, r=big?R.int(r0,r1):R.int(r0*10,r1*10)/10;
        const dp=big?0:1, lo=(b-r).toFixed(dp), hi=(b+r).toFixed(dp);
        if(d===2){
          return {prompt:`Data predicts ${what} to be ${b} ${unit}, with an absolute error of at most ${r} ${unit}. Write this as an absolute value inequality and give every possible true value $${sym}$ as an interval.`,
            answer:{type:"interval",answer:`[${lo}, ${hi}]`},
            hint:"\"At most\" means $\\le$. The error is the distance between the true value and the prediction: $|"+sym+"-"+b+"|$.",
            steps:[`The error is $|${sym}-${b}|$, and "at most ${r}" means $|${sym}-${b}|\\le ${r}$.`,`Property (iv): $-${r}\\le ${sym}-${b}\\le ${r}$.`,`Add ${b}: $${lo}\\le ${sym}\\le ${hi}$.`],
            answerTeX:`$|${sym}-${b}|\\le${r}$, so $${lo}\\le ${sym}\\le ${hi}$`};
        }
        const right=`$|${sym}-${b}|\\le ${r}$`;
        const opts=R.shuffle([right,`$|${sym}+${b}|\\le ${r}$`,`$|${sym}-${r}|\\le ${b}$`,`$${sym}-${b}\\le ${r}$`,`$|${sym}|-${b}\\le ${r}$`]);
        return {prompt:`Data predicts ${what} to be ${b} ${unit}, with an absolute error of at most ${r} ${unit}. Which inequality describes every possible true value $${sym}$?`,
          parts:[{answer:{type:"mc",options:opts,correct:opts.indexOf(right)}}],
          hint:"The error is the distance between the true value and the prediction. Distance is an absolute value of a difference.",
          steps:[`The error in the prediction is $|${sym}-${b}|$ (true value minus prediction).`,`"At most ${r}" means $\\le ${r}$.`,`So ${right}. $${sym}-${b}\\le${r}$ alone is not enough: it allows values far below ${b}.`],
          answerTeX:right};
      }},
    {id:"L07.g.erf-lrs", title:"Left Riemann Sum for $\\int_0^x e^{-t^2}dt$", skill:"Approximate an integral function value", ref:"p. 5",
      gen(R,d){
        const opts=d===1?[[Q(1),2],[Q(3,2),3],[Q(2),2],[Q(2),4],[Q(3),3],[Q(3,2),2]]:d===2?[[Q(1),4],[Q(2),4],[Q(3,5),3],[Q(6,5),3],[Q(1),2,"erf"],[Q(3,2),3,"erf"]]:[[Q(-1),2],[Q(-3,2),3],[Q(-2),4],[Q(-1),4],[Q(-1),2,"erf"],[Q(-2),2,"erf"]];
        const [b,n,mode]=R.pick(opts);
        const dt=Q(b[0],b[1]*n), bT=qv(b)===Math.round(qv(b))?String(qv(b)):String(qv(b));
        const ts=[], termsT=[], termsA=[];
        for(let i=0;i<n;i++){ const ti=Q(i*dt[0],dt[1]); ts.push(ti); const ex=Q(-ti[0]*ti[0],ti[1]*ti[1]);
          termsT.push(ex[0]===0?"1":`e^{${qt(ex)}}`); termsA.push(`exp(${qa(ex)})`); }
        const fac=mode==="erf"?"2/sqrt(pi)*":"";
        const ansA=`${fac}(${qa(dt)})*(${termsA.join("+")})`;
        const val=(mode==="erf"?2/Math.sqrt(Math.PI):1)*qv(dt)*ts.reduce((s,t)=>s+Math.exp(-qv(t)*qv(t)),0);
        const name=mode==="erf"?`\\operatorname{erf}(${bT})`:`f(${bT})`;
        const dtT=qv(dt)<0?`\\left(${qt(dt)}\\right)`:qt(dt);
        const pre=mode==="erf"?"\\frac{2}{\\sqrt{\\pi}}\\cdot":"";
        const setup=mode==="erf"?`Recall $\\operatorname{erf}(x)=\\frac{2}{\\sqrt\\pi}\\int_0^x e^{-t^2}\\,dt$, so $${name} = \\frac{2}{\\sqrt\\pi}\\int_0^{${bT}} e^{-t^2}\\,dt$. Approximate the integral, then multiply by $\\frac{2}{\\sqrt\\pi}$.`:`$f(${bT}) = \\int_0^{${bT}} e^{-t^2}\\,dt$, so $g(t)=e^{-t^2}$, $a=0$, $b=${bT}$.`;
        return {prompt:mode==="erf"?`Use the Left Riemann Sum Approximation with $n=${n}$ subdivisions to approximate $\\operatorname{erf}(${bT})$. You can leave your answer as an exact sum or give 4 decimals.`
            :`Let $f(x)=\\int_0^x e^{-t^2}\\,dt$. Use the Left Riemann Sum Approximation with $n=${n}$ subdivisions to approximate $f(${bT})$. You can leave your answer as an exact sum or give 4 decimals.`,
          answer:{type:"num",answer:ansA}, verify:{value:val},
          hint:"$\\Delta t=\\frac{b-a}{n}$ and $t_i=a+i\\Delta t$. A left sum uses $t_0$ up to $t_{n-1}$."+(qv(b)<0?" Here $b<a$, so $\\Delta t$ is negative.":""),
          steps:[setup,`$\\Delta t=\\frac{b-a}{n}=\\frac{${bT}-0}{${n}}=${qt(dt)}$.${qv(b)<0?" It is negative because $b<a$.":""}`,
            `$t_i=a+i\\Delta t=i\\cdot ${qv(dt)<0?`\\left(${qt(dt)}\\right)`:qt(dt)}$, so ${ts.map((t,i)=>`$t_${i}=${qt(t)}$`).join(", ")}. A left sum stops at $t_{${n-1}}$.`,
            `$${name} \\approx ${pre}\\left(g(t_0)\\Delta t+\\dots+g(t_{${n-1}})\\Delta t\\right) = ${pre}${dtT}\\left(${termsT.join("+")}\\right)$.`,
            `$\\approx ${val.toFixed(4)}$.`],
          answerTeX:`$${name}\\approx ${pre}${dtT}\\left(${termsT.join("+")}\\right)\\approx ${val.toFixed(4)}$`};
      }},
    {id:"L07.g.find-error", title:"Find the first mistake", skill:"Error analysis: absolute value work", ref:"pp. 2 to 3",
      gen(R,d){
        const T=d===1?"T4":d===2?R.pick(["T1","T3"]):R.pick(["T1","T2","T3"]);
        let prob, L, bad, note;
        if(T==="T4"){
          const p=R.int(2,4), q=R.nz(-6,6), r=R.int(2,9), u=lin(p,q);
          const e=R.pick([1,2,4]); bad=e;
          const qs=q>0?"-":"+", aq=Math.abs(q);
          const l1=e===1?`-${r} < |${u}| < ${r}`:`-${r} < ${u} < ${r}`;
          const sl=e===2?-r+q:-r-q, sr=e===2?r+q:r-q;
          const l2=e===2?`-${r} ${qs==="-"?"+":"-"} ${aq} < ${p}x < ${r} ${qs==="-"?"+":"-"} ${aq}`:`-${r} ${qs} ${aq} < ${p}x < ${r} ${qs} ${aq}`;
          const l3=`${sl} < ${p}x < ${sr}`;
          const l4=e===4?`${qt(Q(sl,p))} > x > ${qt(Q(sr,p))}`:`${qt(Q(sl,p))} < x < ${qt(Q(sr,p))}`;
          prob=`Find all values of $x$ such that $|${u}|<${r}$.`; L=[l1,l2,l3,l4];
          note={1:"Line (1) keeps the absolute value bars. Property (iv) gives $-"+r+"<"+u+"<"+r+"$ with no bars.",2:`Line (2) ${q>0?"adds":"subtracts"} ${aq} instead of ${q>0?"subtracting":"adding"} it.`,4:`Line (4) flips the signs, but dividing by the positive number ${p} does not flip anything.`}[e];
        } else if(T==="T1"){
          const c=R.int(3,8), k=R.int(1,c-1), A=sqT(c-k), B=sqT(c+k);
          const e=R.pick([1,4,5]); bad=e;
          prob=`Find all values of $x$ satisfying $|x^2-${c}|\\le ${k}$.`;
          L=[e===1?`-${k}\\le |x^2-${c}|\\le ${k}`:`-${k}\\le x^2-${c}\\le ${k}`,`${c-k}\\le x^2\\le ${c+k}`,`\\sqrt{${c-k}}\\le\\sqrt{x^2}\\le\\sqrt{${c+k}}`];
          if(e===4){ L.push(`${A}\\le x\\le ${B}`); L.push(`\\text{So the solutions are } ${A}\\le x\\le ${B}`); }
          else { L.push(`${A}\\le |x|\\le ${B}`); L.push(e===5?`\\text{Case 1, } x<0:\\ ${A}\\le -x\\le ${B},\\ \\text{so } -${A}\\le x\\le -${B}`:`\\text{Case 1, } x<0:\\ ${A}\\le -x\\le ${B},\\ \\text{so } -${A}\\ge x\\ge -${B}`); L.push(`\\text{Case 2, } x\\ge0:\\ ${A}\\le x\\le ${B}`); }
          note={1:"Line (1) keeps the absolute value bars after using property (iv).",4:"Line (4) writes $x$ where property (i) gives $|x|$. That loses the negative solutions.",5:"Line (5) multiplies by $-1$ without flipping the inequality signs."}[e];
        } else if(T==="T3"){
          const k=R.int(1,9), e=R.pick([3,4,5]); bad=e;
          prob=`Given that $x<0$, fully simplify $\\dfrac{\\sqrt{x^4+${k===1?"":k}x^2}}{x}$.`;
          L=[`\\frac{\\sqrt{x^4+${k===1?"":k}x^2}}{x}=\\frac{\\sqrt{x^2(x^2+${k})}}{x}`,`=\\frac{\\sqrt{x^2}\\sqrt{x^2+${k}}}{x}`];
          if(e===3){ L.push(`=\\frac{x\\sqrt{x^2+${k}}}{x}`); L.push(`=\\sqrt{x^2+${k}}`); }
          else if(e===4){ L.push(`=\\frac{|x|\\sqrt{x^2+${k}}}{x}`); L.push(`=\\frac{x\\sqrt{x^2+${k}}}{x}\\ \\text{ since } x<0`); L.push(`=\\sqrt{x^2+${k}}`); }
          else { L.push(`=\\frac{|x|\\sqrt{x^2+${k}}}{x}`); L.push(`=\\frac{-x\\sqrt{x^2+${k}}}{x}\\ \\text{ since } x<0`); L.push(`=\\sqrt{x^2+${k}}`); }
          note={3:"Line (3) uses $\\sqrt{x^2}=x$. Property (i) says $\\sqrt{x^2}=|x|$.",4:"Line (4) uses $|x|=x$, but for $x<0$, $|x|=-x$.",5:"Line (5) loses the minus sign: $\\frac{-x}{x}=-1$."}[e];
        } else {
          const k=R.pick([1,2,3]);
          const U=R.pick([{u:`${k}-e^{x^2}`,a:"0",b:"2xe^{x^2}"},{u:`x^2-${k+2}x`,a:"2x",b:`${k+2}`},{u:"e^x-x^2",a:"e^x",b:"2x"},{u:"\\cos(x)-x",a:"-\\sin(x)",b:"1"}]);
          const fr=`\\frac{${U.u}}{|${U.u}|}`, e=R.pick([1,2,3]); bad=e;
          prob=`Determine the derivative of $f(x)=|${U.u}|$.`;
          L=[e===1?`f'(x)=\\left(${U.u}\\right)'\\ \\text{ since absolute value does not change a derivative}`:`f'(x)=${fr}\\cdot\\left(${U.u}\\right)'`];
          if(e===2){ L.push(`=${fr}\\cdot ${U.a} - ${U.b}`); L.push(`=\\frac{(${U.u})\\cdot ${U.a}}{|${U.u}|} - ${U.b}`); }
          else if(e===3){ L.push(`=${fr}\\cdot\\left(${U.a} - ${U.b}\\right)`); L.push(`=${U.a} - ${U.b}\\ \\text{ since } ${fr}=1`); }
          else { L.push(`=${U.a} - ${U.b}`); L.push(`\\text{So } f'(x)=${U.a} - ${U.b}`); }
          note={1:"Line (1) drops the absolute value. You need the Chain Rule with $\\frac{d}{dx}|u|=\\frac{u}{|u|}u'$.",2:"Line (2) is missing brackets: $u'$ has two terms, so it must be $\\left("+U.a+"-"+U.b+"\\right)$.",3:"Line (3) treats $\\frac{u}{|u|}$ as 1. It is $-1$ wherever $u<0$."}[e];
        }
        const opts=lineOpts(L.length);
        return {prompt:`A problem and an answer are shown. The answer would not get a perfect score. Select the first line that has a mistake.<br><b>Problem.</b> ${prob}<br><b>Answer.</b>${lines(L)}`,
          parts:[{answer:{type:"mc",options:opts,correct:bad-1,keep:true}}],
          hint:"Check each line against the one before it. Watch for leftover bars, missing brackets, $\\sqrt{x^2}$ written as $x$, and signs that should flip.",
          steps:[`The first mistake is in line (${bad}).`,note].concat(bad===2?["Line (1) is correct."]:bad===3?["Lines (1) and (2) are correct."]:bad>3?[`Lines (1) to (${bad-1}) are correct.`]:[]),
          answerTeX:`Line (${bad})`};
      }}
  ],
  exam:[
    {id:"L07.q1", ref:"p. 2", q:"If $x<3$, then $|x-3|$ is equal to", opts:[["$3-x$",1,"$x-3<0$, so by definition $|x-3|=-(x-3)=3-x$."],["$x-3$",0,"That only holds when $x\\ge3$. Here $x-3$ is negative."],["$-(3-x)$",0,"That is $x-3$, which is negative here. An absolute value is never negative."],["$|x|-3$",0,"Absolute value does not split across a difference."]]},
    {id:"L07.q2", ref:"p. 3", q:"True or false: $\\sqrt{(x+2)^2}=x+2$ for all real $x$.", keep:true, opts:[["True",0,"Try $x=-5$: the left side is $\\sqrt{9}=3$ and the right side is $-3$."],["False",1,"Property (i) gives $\\sqrt{(x+2)^2}=|x+2|$, which equals $x+2$ only when $x\\ge-2$."]]},
    {id:"L07.q3", ref:"p. 2", multi:true, q:"Select all values of $x$ that satisfy $|2x-1|\\le5$.", opts:[["$x=-2$",1,"$-5\\le2x-1\\le5$ gives $-2\\le x\\le3$, and the endpoint is included."],["$x=3$",1,"$|6-1|=5\\le5$."],["$x=0$",1,"$|-1|=1\\le5$."],["$x=-3$",0,"$|-7|=7>5$."],["$x=3.5$",0,"$|6|=6>5$."]]},
    {id:"L07.q4", ref:"p. 1", multi:true, q:"A scale reads a mass of 4.5 g with an absolute error of at most 0.3 g. Select all the possible true masses.", opts:[["4.5 g",1,"Error 0."],["4.75 g",1,"$|4.75-4.5|=0.25\\le0.3$."],["4.2 g",1,"$|4.2-4.5|=0.3$, and \"at most\" includes 0.3."],["4.85 g",0,"$|4.85-4.5|=0.35>0.3$."],["4.1 g",0,"$|4.1-4.5|=0.4>0.3$."]]},
    {id:"L07.q5", ref:"p. 2", q:"If $|x+4|>2$, then", opts:[["$x+4<-2$ or $x+4>2$",1,"Property (v)."],["$-2<x+4<2$",0,"That is $|x+4|<2$."],["$x+4>-2$ or $x+4<2$",0,"Every number satisfies this. The directions are backwards."],["$-2>x+4>2$",0,"No number is both below $-2$ and above 2."]]},
    {id:"L07.q6", ref:"p. 2", keep:true, q:"A problem and an answer are shown. The answer would not get a perfect score. Select the first line with a mistake.<br><b>Problem.</b> Find all $x$ with $3\\le x^2<7$.$$\\sqrt3\\le\\sqrt{x^2}<\\sqrt7\\qquad(1)$$$$\\sqrt3\\le|x|<\\sqrt7\\qquad(2)$$$$\\text{Case 1, } x<0:\\ \\sqrt3\\le-x<\\sqrt7, \\text{ so } -\\sqrt3\\le x<-\\sqrt7\\qquad(3)$$$$\\text{Case 2, } x\\ge0:\\ \\sqrt3\\le x<\\sqrt7\\qquad(4)$$", opts:[["Line (1)",0,"Taking square roots of positive numbers keeps the order."],["Line (2)",0,"Property (i): $\\sqrt{x^2}=|x|$."],["Line (3)",1,"Multiplying by $-1$ flips both signs: $-\\sqrt3\\ge x>-\\sqrt7$."],["Line (4)",0,"For $x\\ge0$, $|x|=x$."]]},
    {id:"L07.q7", ref:"p. 2", keep:true, q:"A problem and three answers are shown. Which answer is correct?<br><b>Problem.</b> Find all $x$ such that $|x+1|<3$.<br><b>Answer #1.</b> $-3<|x+1|<3$, so $-4<x<2$.<br><b>Answer #2.</b> $-3<x+1<3$, so $-4<x<2$.<br><b>Answer #3.</b> $|x|+1<3$, so $|x|<2$, so $-2<x<2$.", opts:[["Answer #1",0,"It keeps the bars. Property (iv) gives $-3<x+1<3$ with no bars."],["Answer #2",1,"Property (iv) with the bars dropped, then subtract 1 from all three parts."],["Answer #3",0,"$|x+1|$ is not $|x|+1$."]]},
    {id:"L07.q8", ref:"p. 3", q:"$\\frac{d}{dx}\\left|x^3-2\\right|=$", opts:[["$\\frac{x^3-2}{|x^3-2|}\\cdot3x^2$",1,"Chain Rule: $\\frac{u}{|u|}\\cdot u'$ with $u=x^3-2$."],["$\\frac{x}{|x|}\\cdot3x^2$",0,"The fraction uses the inside function $x^3-2$, not $x$."],["$|3x^2|$",0,"You cannot move the derivative inside the bars."],["$\\frac{3x^2}{|3x^2|}$",0,"The fraction is $\\frac{u}{|u|}$ with $u=x^3-2$, and then you multiply by $u'$."]]},
    {id:"L07.q9", ref:"p. 4", q:"If $a(t)$ is the acceleration of an object, then $g(x)=\\int_3^x a(t)\\,dt$ represents", opts:[["The net change in velocity from $t=3$ to any time $t=x$",1,"Acceleration is the rate of change of velocity, and the integral of a rate is a net change."],["The net change in acceleration from $t=3$ to $t=x$",0,"You integrate acceleration to get a change in velocity, not acceleration."],["The rate of change of velocity at time $t=x$",0,"That is $a(x)$ itself."],["The velocity at time $t=x$",0,"Only if the velocity at $t=3$ is 0. In general it is a change in velocity."]]},
    {id:"L07.q10", ref:"p. 3", q:"In $f(x)=\\int_0^x e^{-t^2}\\,dt$, which statement is true?", opts:[["$x$ is the independent variable of $f$ and $t$ is the variable of integration",1,"The NOTE on p. 3."],["$t$ is the independent variable of $f$",0,"$f$ is a function of $x$. $t$ only lives inside the integral."],["$f(x)$ depends on both $x$ and $t$",0,"After integrating, $t$ is gone. Only the upper limit $x$ is left."],["$f(x)$ is a fixed number that does not depend on $x$",0,"The upper limit is $x$, so the value changes with $x$."]]},
    {id:"L07.q11", ref:"p. 5", q:"Let $f(x)=\\int_0^x e^{-t^2}\\,dt$. The Left Riemann Sum with $n=2$ subdivisions for $f(1)$ is", opts:[["$\\frac12\\left(1+e^{-1/4}\\right)$",1,"$\\Delta t=\\frac12$, $t_0=0$, $t_1=\\frac12$."],["$\\frac12\\left(e^{-1/4}+e^{-1}\\right)$",0,"That uses $t_1$ and $t_2$: a right sum."],["$\\frac12\\left(1+e^{-1/4}+e^{-1}\\right)$",0,"$n=2$ means two terms. The right endpoint $t_2=1$ is not used."],["$1+e^{-1/4}$",0,"Each term needs the factor $\\Delta t=\\frac12$."]]},
    {id:"L07.q12", ref:"p. 2", keep:true, q:"Is the provided answer correct?<br><b>Problem.</b> For $x>2$, write $|2-x|+x$ without absolute value signs.<br><b>Answer.</b> Since $x>2$, $2-x<0$. So by definition $|2-x|=-(2-x)=x-2$, and $|2-x|+x=2x-2$.", opts:[["Yes, the answer is correct",1,"Each step is valid: the sign of the inside decides which part of the definition to use."],["No, the answer is not correct",0,"Check with $x=5$: $|2-5|+5=8$ and $2(5)-2=8$."]]}
  ],
  steps:[
    {type:"read", title:"Absolute value as an error bound", body:`<p>In science you rarely know an exact value. You find an approximation $b$ of a true value $a$, and you want an upper bound $r$ for the error. Absolute value writes this in one line (p. 1):</p>$$|a-b|<r$$<p>$|a-b|$ is the distance between the true value and the approximation, so this says the approximation is off by less than $r$.</p><div class="box"><b class="t">Example (p. 1)</b>$e$ is approximately $2.7$, within $\\pm0.02$. So $|e-2.7|<0.02$. By property (iv) this is the same as $-0.02<e-2.7<0.02$. Add $2.7$ to all three parts: $2.68<e<2.72$.</div><p>You often use this to find a range of values.</p>`, ref:"p. 1"},
    {type:"explore", title:"Dropping the bars", fig:"errband", body:`<p>Two properties from Lecture 6 do the work (for $a>0$):</p><ul><li>(iv) $|x|<a$ if and only if $-a<x<a$</li><li>(v) $|x|>a$ if and only if $x<-a$ or $x>a$</li></ul><div class="box"><b class="t">Example (p. 2)</b>$|x+1|\\le4$ gives $-4\\le x+1\\le4$. Subtract 1 from all three parts: $-5\\le x\\le3$.</div><div class="box warn"><b class="t">Watch for this</b>When you use property (iv) or (v), the absolute value signs come off. Writing $-4\\le|x+1|\\le4$ is the common mistake the notes warn about (p. 2), and quizzes take marks for it.</div><p><b>Try it.</b> Set $a=-1$ and $r=4$: the solution runs from $-5$ to $3$, just like the example. Then switch to $>$ and watch the solution split into two pieces.</p>`},
    {type:"try", title:"Your turn: absolute value inequalities", gen:"L07.g.abs-ineq"},
    {type:"read", title:"When $x^2$ shows up", body:`<p>In $|x^2-2|<1$ you use property (iv) and end up with $x^2$ trapped between two numbers. You cannot just take a square root and write $x$. Use property (i):</p>$$\\sqrt{x^2}=|x|$$<p>Then split into two cases using the definition of absolute value:</p><ul><li>Case 1: if $x<0$, then $|x|=-x$.</li><li>Case 2: if $x\\ge0$, then $|x|=x$.</li></ul><p>In Case 1 you multiply by $-1$ at the end, and that flips every inequality sign. Forgetting the flip, or skipping Case 1, are the usual ways to lose marks here.</p><p class="muted small">Property (i) and the definition were stated in Lecture 6. Lecture 7 uses them on p. 2. Quiz markers give part marks for writing $\\sqrt{x^2}=|x|$ and for each case.</p>`, ref:"p. 2"},
    {type:"explore", title:"Two pieces or one", fig:"abscases", body:`<p>For $|x^2-c|<k$, property (iv) gives $c-k<x^2<c+k$. In the figure, the band is $c-k<y<c+k$ and the solutions are the $x$ where the parabola $y=x^2$ sits inside the band.</p><p><b>Try it.</b> Start at $c=2$, $k=1$ (the example on p. 2): two pieces, $-\\sqrt3<x<-1$ and $1<x<\\sqrt3$. Now raise $k$ past $c$. Once $c-k$ is negative, the bottom of the band cannot cut the parabola, and the two pieces join into one.</p>`},
    {type:"example", title:"Solve $|x^2-2|<1$", ex:{q:"Find all values of $x$ such that $|x^2-2|<1$.", ref:"p. 2",
      steps:[{t:"$-1<x^2-2<1$",why:"Property (iv). The bars come off."},{t:"$1<x^2<3$",why:"Add 2 to all three parts."},{t:"$\\sqrt1<\\sqrt{x^2}<\\sqrt3$",why:"Take square roots. All three parts are positive, so the order stays the same."},{t:"$1<|x|<\\sqrt3$",why:"Property (i): $\\sqrt{x^2}=|x|$."},{t:"Case 1: if $x<0$, then $1<-x<\\sqrt3$, so $-1>x>-\\sqrt3$.",why:"$|x|=-x$ when $x<0$. Multiplying by $-1$ flips both signs."},{t:"Case 2: if $x\\ge0$, then $1<x<\\sqrt3$.",why:"$|x|=x$ when $x\\ge0$."}],
      ans:"$-\\sqrt3<x<-1$ and $1<x<\\sqrt3$"}},
    {type:"mcq", title:"The exercise on p. 3", q:"Which is the solution of $x^2>4$?", opts:[["$x<-2$ or $x>2$",true,"$\\sqrt{x^2}>2$, so $|x|>2$, then property (v)."],["$x>2$",false,"This misses Case 1. $x=-3$ works too: $9>4$."],["$x>\\pm2$",false,"Not a valid statement. Write the two pieces separately."],["$-2<x<2$",false,"That is the solution of $x^2<4$."]]},
    {type:"try", title:"Your turn: inequalities with $x^2$", gen:"L07.g.abs-quad"},
    {type:"explore", title:"The derivative of $|x|$", fig:"absderiv", body:`<p>Write $|x|=\\sqrt{x^2}$ (property (i)) and use the Chain Rule (p. 3):</p>$$\\frac{d}{dx}|x|=\\frac{d}{dx}(x^2)^{1/2}=\\frac12(x^2)^{-1/2}\\cdot(2x)=\\frac{x}{\\sqrt{x^2}}=\\frac{x}{|x|}$$<p>Add it to the derivatives you memorize. $\\frac{x}{|x|}$ is $-1$ for $x<0$ and $1$ for $x>0$: the two slopes of the V. At $x=0$ it divides by zero and the graph has a corner, so there is no derivative there.</p><p>With an inside function $u$, the Chain Rule gives $\\frac{d}{dx}|u|=\\frac{u}{|u|}\\cdot u'$.</p><p><b>Try it.</b> On $|x|$, drag the point across $x=0$ and watch the slope jump from $-1$ to $1$. Then pick $|x^2+x|$. The dashed curve is $x^2+x$. Where it dips below the axis, $|x^2+x|$ flips it up, and the slope changes sign.</p>`},
    {type:"example", title:"Differentiate $|x^2+x|$", ex:{q:"Determine the derivative of $f(x)=|x^2+x|$.", ref:"p. 3",
      steps:[{t:"Inside function: $u=x^2+x$, so $u'=2x+1$.",why:"Name the inside first."},{t:"$f'(x)=\\frac{x^2+x}{|x^2+x|}\\cdot(2x+1)$",why:"Chain Rule with $\\frac{d}{dx}|u|=\\frac{u}{|u|}\\cdot u'$. Keep the brackets around $2x+1$."},{t:"Valid wherever $x^2+x\\ne0$, that is $x\\ne0$ and $x\\ne-1$.",why:"The formula divides by $|x^2+x|$. The notes do not mention this."}],
      ans:"$f'(x)=\\frac{x^2+x}{|x^2+x|}(2x+1)$"}},
    {type:"try", title:"Your turn: derivatives with absolute value", gen:"L07.g.abs-deriv"},
    {type:"read", title:"Integral functions", body:`<p>From Lecture 4: if $g(t)$ is the rate of change of a quantity $G(t)$, then $\\int_a^b g(t)\\,dt$ is the net change in $G(t)$ from $t=a$ to $t=b$. Now let the top limit move (p. 3):</p>$$f(x)=\\int_a^x g(t)\\,dt$$<p>is a function that outputs the net change in $G(t)$ from $t=a$ to $t=x$. A function of this form is called an integral function (p. 4). Since a definite integral is an area under the graph of $g(t)$, $f(x)$ is the area from $a$ to $x$.</p><div class="box warn"><b class="t">Watch for this</b>$x$ is the independent variable of $f$. $t$ is the variable of integration. Keep them apart.</div><div class="box"><b class="t">Example (p. 4)</b>Acceleration $a(t)$ is the rate of change of velocity. So $f(x)=\\int_0^x a(t)\\,dt$ is the net change in velocity from $t=0$ to any time $t=x$. $f(2)$ is the net change in velocity from $t=0$ to $t=2$. $g(x)=\\int_3^x a(t)\\,dt$ is the net change in velocity from $t=3$ to any time $t=x$.</div><p class="muted small">The notes set this example up with $v(t)=5t-3$, but the parts use $a(t)$. See the note at the top of this chapter.</p>`, ref:"pp. 3 to 4"},
    {type:"explore", title:"The error function", fig:"erf", body:`<p>The most used integral function in science is the error function (p. 4):</p>$$\\operatorname{erf}(x)=\\frac{2}{\\sqrt\\pi}\\int_0^x e^{-t^2}\\,dt$$<p>You cannot write an antiderivative of $e^{-t^2}$ with the usual functions, so you cannot evaluate this exactly (except at $x=0$). When you need a value, you approximate it, for example with a Left Riemann Sum (p. 5).</p><p><b>Try it.</b> Set $x=1.5$ and $n=3$. The three rectangles add to about $1.0733$, the answer on p. 5. Push $n$ up and the sum closes in on the true value, about $0.8562$. Then drag $x$ below 0 and watch $\\Delta t$ turn negative.</p>`},
    {type:"example", title:"Approximate $f(1.5)$", ex:{q:"Let $f(x)=\\int_0^x e^{-t^2}\\,dt$. Approximate $f(1.5)$ using the Left Riemann Sum Approximation with $n=3$ subdivisions.", ref:"p. 5",
      steps:[{t:"$f(1.5)=\\int_0^{1.5}e^{-t^2}\\,dt$, so $g(t)=e^{-t^2}$, $a=0$, $b=1.5$.",why:"Read the integrand and the limits off the definition of $f$."},{t:"$\\Delta t=\\frac{b-a}{n}=\\frac{1.5-0}{3}=\\frac12$",why:"Three equal pieces. The notes print a 4 in the denominator; it should be 3."},{t:"$t_i=a+i\\Delta t=\\frac{i}{2}$, so $t_0=0$, $t_1=\\frac12$, $t_2=1$, $t_3=\\frac32$.",why:"The subdivision points."},{t:"$f(1.5)\\approx g(t_0)\\Delta t+g(t_1)\\Delta t+g(t_2)\\Delta t$",why:"A left sum uses the left end of each piece: $t_0$, $t_1$, $t_2$, not $t_3$."},{t:"$=e^{-(0)^2}\\cdot\\frac12+e^{-(1/2)^2}\\cdot\\frac12+e^{-(1)^2}\\cdot\\frac12$",why:"Put each $t_i$ into $g$."},{t:"$=\\frac12+\\frac{e^{-1/4}}{2}+\\frac{e^{-1}}{2}$",why:"$e^0=1$. On a quiz (no calculators) you can stop here. It is about $1.0733$."}],
      ans:"$f(1.5)\\approx\\frac12+\\frac{e^{-1/4}}{2}+\\frac{e^{-1}}{2}\\approx1.0733$"}},
    {type:"mcq", title:"The exercise on p. 5", q:"Why does the Left Riemann Sum with $n=3$ for $f(-1.5)=\\int_0^{-1.5}e^{-t^2}\\,dt$ give the negative of the answer for $f(1.5)$?", opts:[["$\\Delta t=\\frac{-1.5-0}{3}=-\\frac12$ is negative, and $e^{-t^2}$ has the same values at $0,-\\frac12,-1$ as at $0,\\frac12,1$",true,"So every term keeps its size and changes sign."],["Because $e^{-t^2}$ is negative when $t<0$",false,"$e^{-t^2}>0$ for every $t$."],["Because a left sum always gives a negative answer",false,"No. The answer for $f(1.5)$ is positive."],["Because the sample points become $t_1$, $t_2$, $t_3$",false,"A left sum still uses $t_0$, $t_1$, $t_2$."]],
      after:"$f(-1.5)\\approx-\\frac12\\left(1+e^{-1/4}+e^{-1}\\right)\\approx-1.0733$."},
    {type:"formulas", title:"Lecture 7 formulas"}
  ]
});
})();
