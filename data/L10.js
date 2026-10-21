/* Lecture 10 (Wed Sept 30): Exponential functions, e, logarithms and their properties, ln as an integral. Sections 2.4.1 to 2.4.3. Notes: 6 pages. */
(function(){
const M=M127;
/* exact fractions [num, den] */
const F=(n,d=1)=>{ if(d<0){ n=-n; d=-d; } const g=M.gcd(n,d); return [n/g,d/g]; };
const Fadd=(x,y)=>F(x[0]*y[1]+y[0]*x[1], x[1]*y[1]);
const Ft=x=>M.frac(x[0],x[1]);
const Fa=x=>x[1]===1?String(x[0]):`${x[0]}/${x[1]}`;
/* signed coefficient in front of a TeX body: cT(3,2,"x^{2}") -> "+\frac{3}{2}x^{2}" */
const cT=(n,d,body,first)=>{ const [p,q]=F(n,d); if(p===0) return ""; const s=p<0?"-":(first?"":"+"); const a=Math.abs(p);
  const c=q===1?(a===1&&body?"":String(a)):`\\frac{${a}}{${q}}`; return s+c+body; };
const cc=c=>c===1?"":c===-1?"-":String(c);           // coefficient written in front of a letter
const ccN=c=>c===1?"":c===-1?"-":`${c}\\cdot `;      // coefficient written in front of a number base like 5^x
const lin=c=>c===0?"x":`x${M.pm(c)}`;                 // x+2, x-1, x
const lines=L=>L.map((t,i)=>`$$${t}\\qquad(${i+1})$$`).join("");
const powTeX=(a,k)=>k>=0?String(Math.pow(a,k)):`\\frac{1}{${Math.pow(a,-k)}}`;
/* the ln( ) arguments in a typed answer must be simple linear pieces like x+2 (so ln of the whole product is not accepted) */
function lnArgsSimple(s){
  const t=String(s).replace(/\s+/g,""); let i=0;
  while((i=t.indexOf("ln(",i))>=0){ let k=i+3, dep=1; while(k<t.length&&dep){ if(t[k]==="(") dep++; else if(t[k]===")") dep--; k++; }
    const arg=t.slice(i+3,k-1); if(!/^[+-]?\d*\.?\d*\*?x([+-]\d+(\.\d+)?)?$/.test(arg) && !/^\d+$/.test(arg)) return false; i=k; }
  return true;
}
const noLogs=s=>!/ln|log|exp|e\s*\^|e\s*\*\*/.test(String(s));

M.lecture({
  id:"L10", n:10, date:"2026-09-30", added:"2026-10-21", unit:"u4", quiz:"Q4",
  title:"Exponential and Logarithm Functions", sections:["2.4.1","2.4.2","2.4.3"], pages:6,
  summary:"Exponential functions and their properties, the special base $e$, the derivative and integral of $a^x$, logarithms and their properties, and the original definition $\\ln(x)=\\int_1^x \\frac{1}{t}\\,dt$ that lets you estimate $\\ln$ with a Left Riemann Sum.",
  flags:[
    {ref:"p. 3", text:"The Logarithm Properties box says \"For $a > 1$ and $b > 1$\". There is no $b$ in any of the six properties, and the conditions that matter are missing. It should say: for $a > 1$, $x > 0$ and $y > 0$. The product and quotient rules need both $x > 0$ and $y > 0$, the power rule $\\log_a(x^y) = y\\log_a(x)$ needs $x > 0$ (any real $y$), and $\\log_a(a^y) = y$ holds for every real $y$. The properties themselves are correct."},
    {ref:"p. 4", text:"The examples write $e^{\\ln(2x)} = 2x$ and $e^{3\\ln(x)} = x^3$ with no domain. Both are only true for $x > 0$, because $\\ln$ of a number that is 0 or negative is undefined. The same goes for the $\\ln(f(x))$ expansion on p. 4: every factor has to be positive, so it holds for $x > 1$."}
  ],
  formulas:[
    {id:"L10.f.exp-def", name:"Exponential function", tex:"f(x) = a^x,\\quad a > 0", note:"The variable is in the exponent. Compare $x^2$, where the variable is in the base.", ref:"p. 1"},
    {id:"L10.f.exp-graph", name:"Graph of $y=a^x$ for $a>1$", tex:"\\text{as } x\\to\\infty,\\ a^x\\to\\infty;\\quad \\text{as } x\\to-\\infty,\\ a^x\\to 0;\\quad \\text{range } (0,\\infty)", note:"Always increasing, always concave up. Grows very slowly for $x<0$ and very fast for $x>0$.", ref:"p. 1"},
    {id:"L10.f.exp-prod", name:"Exponent property: product", tex:"a^x a^y = a^{x+y}", note:"for $a>0$, $b>0$ (all five exponent properties)", ref:"p. 2", blank:{tex:"a^x a^y = \\boxed{\\,?\\,}", answer:"a^(x+y)", vars:["a","x","y"], domain:[0.5,2.5]}},
    {id:"L10.f.exp-quot", name:"Exponent property: quotient", tex:"\\frac{a^x}{a^y} = a^{x-y}", ref:"p. 2", blank:{tex:"\\frac{a^x}{a^y} = \\boxed{\\,?\\,}", answer:"a^(x-y)", vars:["a","x","y"], domain:[0.5,2.5]}},
    {id:"L10.f.exp-pow", name:"Exponent property: power of a power", tex:"(a^x)^y = a^{xy}", ref:"p. 2", blank:{tex:"(a^x)^y = \\boxed{\\,?\\,}", answer:"a^(x*y)", vars:["a","x","y"], domain:[0.5,2]}},
    {id:"L10.f.exp-ab", name:"Exponent property: power of a product", tex:"(ab)^x = a^x b^x", ref:"p. 2", blank:{tex:"(ab)^x = \\boxed{\\,?\\,}", answer:"a^x*b^x", vars:["a","b","x"], domain:[0.5,2.5]}},
    {id:"L10.f.exp-zero", name:"Exponent property: zero exponent", tex:"a^0 = 1", ref:"p. 2", blank:{tex:"a^0 = \\boxed{\\,?\\,}", answer:"1", type:"num"}},
    {id:"L10.f.e", name:"Euler's number", tex:"e = 2.71828\\ldots", note:"The base chosen so that the slope of $y=e^x$ at $x=0$ is $m=1$.", ref:"p. 2"},
    {id:"L10.f.exp-nat", name:"Natural exponential function", tex:"\\exp(x) = e^x", ref:"p. 2"},
    {id:"L10.f.d-ax", name:"Derivative of $a^x$ (memorize)", tex:"\\frac{d}{dx}a^x = a^x\\ln(a)", note:"With $a=e$: $\\ln(e)=1$, so $\\frac{d}{dx}e^x = e^x$.", ref:"p. 2", blank:{tex:"\\frac{d}{dx}a^x = \\boxed{\\,?\\,}", answer:"a^x*ln(a)", vars:["x","a"], domain:[1.5,3]}},
    {id:"L10.f.int-ax", name:"Integral of $a^x$ (memorize)", tex:"\\int a^x\\,dx = \\frac{a^x}{\\ln(a)} + C", ref:"p. 2", blank:{tex:"\\int a^x\\,dx = \\boxed{\\,?\\,} + C", answer:"a^x/ln(a)", vars:["x","a"], domain:[1.5,3]}},
    {id:"L10.f.log-def", name:"Logarithm base $a$", tex:"\\log_a(x) = y \\quad \\text{if and only if} \\quad x = a^y", note:"for any $a > 1$", ref:"p. 3", blank:{tex:"\\log_a(x) = y \\quad \\text{if and only if} \\quad \\boxed{\\,?\\,}", text:true, accept:["x=a^y","x = a^y","a^y=x","a^y = x","x=a^(y)"]}},
    {id:"L10.f.ln-def", name:"Natural logarithm", tex:"\\ln(x) = \\log_e(x)", ref:"p. 3", blank:{tex:"\\ln(x) = \\boxed{\\,?\\,}", text:true, accept:["log_e(x)","log_e x","loge(x)","log_e(x) "]}},
    {id:"L10.f.log-graph", name:"Graph of $y=\\log_a(x)$ for $a>1$", tex:"\\text{as } x\\to\\infty,\\ \\log_a(x)\\to\\infty;\\quad \\text{as } x\\to 0^+,\\ \\log_a(x)\\to-\\infty;\\quad \\text{domain } (0,\\infty)", note:"Always increasing, always concave down. If $0<x<1$, then $\\log_a(x)<0$.", ref:"p. 3"},
    {id:"L10.f.log-inv1", name:"Log property: $a^{\\log_a(x)}$", tex:"a^{\\log_a(x)} = x", note:"Needs $x>0$. The notes' conditions are incomplete: see the flag for p. 3.", ref:"p. 3", blank:{tex:"a^{\\log_a(x)} = \\boxed{\\,?\\,}", answer:"x", vars:["x"], domain:[0.5,4]}},
    {id:"L10.f.log-inv2", name:"Log property: $\\log_a(a^y)$", tex:"\\log_a(a^y) = y", ref:"p. 3", blank:{tex:"\\log_a(a^y) = \\boxed{\\,?\\,}", answer:"y", vars:["y"], domain:[-3,3]}},
    {id:"L10.f.log-prod", name:"Log property: product", tex:"\\log_a(xy) = \\log_a(x) + \\log_a(y)", note:"Turns multiplication into addition. Needs $x>0$ and $y>0$.", ref:"p. 3", blank:{tex:"\\log_a(xy) = \\boxed{\\,?\\,}", text:true, accept:["log_a(x)+log_a(y)","log_a(x) + log_a(y)","log_a(y)+log_a(x)","log_a x + log_a y","logₐ(x)+logₐ(y)"]}},
    {id:"L10.f.log-quot", name:"Log property: quotient", tex:"\\log_a\\!\\left(\\frac{x}{y}\\right) = \\log_a(x) - \\log_a(y)", note:"Turns division into subtraction. Needs $x>0$ and $y>0$.", ref:"p. 3", blank:{tex:"\\log_a\\!\\left(\\frac{x}{y}\\right) = \\boxed{\\,?\\,}", text:true, accept:["log_a(x)-log_a(y)","log_a(x) - log_a(y)","log_a x - log_a y","logₐ(x)-logₐ(y)"]}},
    {id:"L10.f.log-pow", name:"Log property: power", tex:"\\log_a(x^y) = y\\log_a(x)", note:"Turns exponentiation into multiplication. Needs $x>0$.", ref:"p. 3", blank:{tex:"\\log_a(x^y) = \\boxed{\\,?\\,}", text:true, accept:["ylog_a(x)","y log_a(x)","y*log_a(x)","log_a(x)*y","log_a(x) y","y logₐ(x)"]}},
    {id:"L10.f.log-one", name:"Log property: $\\log_a(1)$", tex:"\\log_a(1) = 0", ref:"p. 3", blank:{tex:"\\log_a(1) = \\boxed{\\,?\\,}", answer:"0", type:"num"}},
    {id:"L10.f.ln-int", name:"$\\ln$ as an integral (original definition)", tex:"\\ln(x) = \\int_1^x \\frac{1}{t}\\,dt", note:"for any $x > 0$: the signed area under $y=\\frac1t$ from $t=1$ to $t=x$", ref:"p. 5", blank:{tex:"\\ln(x) = \\int_{\\boxed{\\,?\\,}}^{x} \\frac{1}{t}\\,dt", answer:"1", type:"num"}},
    {id:"L10.f.lrs", name:"Left Riemann Sum setup", tex:"\\Delta t = \\frac{b - a}{n}, \\qquad t_i = a + i\\Delta t", note:"For $\\ln(b)$: $g(t)=\\frac1t$ and $a=1$. The left sum uses $t_0$ up to $t_{n-1}$.", ref:"p. 5", blank:{tex:"\\Delta t = \\boxed{\\,?\\,}, \\qquad t_i = a + i\\Delta t", answer:"(b-a)/n", vars:["a","b","n"], domain:[1,4]}},
    {id:"L10.f.lrs-ln3", name:"Left Riemann Sum for $\\ln(3)$, $n=3$", tex:"\\ln(3) \\approx g(t_0)\\Delta t + g(t_1)\\Delta t + g(t_2)\\Delta t", note:"With $g(t)=\\frac1t$, $\\Delta t = \\frac23$: $\\frac23+\\frac25+\\frac27 = \\frac{142}{105}$. The true value is $\\ln(3)\\approx 1.0986$.", ref:"pp. 5 to 6"}
  ],
  glossary:[
    {id:"L10.t.exp", term:"Exponential function", def:"A function $f(x)=a^x$ with a fixed base $a>0$ and the variable in the exponent. For $a>1$ it is always increasing and its outputs are always positive.", ref:"p. 1"},
    {id:"L10.t.e", term:"Euler's number $e$", def:"The number $e = 2.71828\\ldots$, picked so that the graph of $y=e^x$ has slope exactly 1 at $x=0$. It makes the calculus formulas cleanest.", ref:"p. 2"},
    {id:"L10.t.expnat", term:"Natural exponential function", def:"$\\exp(x) = e^x$, the exponential function with base $e$.", ref:"p. 2"},
    {id:"L10.t.log", term:"Logarithm base $a$", def:"$\\log_a(x)$ is the power you raise $a$ to in order to get $x$: $\\log_a(x)=y$ exactly when $x=a^y$. In this course $a>1$.", ref:"p. 3"},
    {id:"L10.t.ln", term:"Natural logarithm", def:"The logarithm with base $e$, written $\\ln$. So $\\ln(x) = \\log_e(x)$, and $\\ln$ and $e^x$ undo each other.", ref:"p. 3"},
    {id:"L10.t.logdomain", term:"Domain of a logarithm", def:"$\\log_a(x)$ only accepts $x>0$, because $a^y$ is always positive. Its outputs can be any real number, and they are negative when $0<x<1$.", ref:"p. 3"},
    {id:"L10.t.lnarea", term:"$\\ln$ as an area", def:"For $x>0$, $\\ln(x)=\\int_1^x\\frac1t\\,dt$: the signed area under $y=\\frac1t$ from 1 to $x$. This is how $\\ln$ was first defined.", ref:"p. 5"},
    {id:"L10.t.lrs", term:"Left Riemann Sum", def:"An estimate of $\\int_a^b g(t)\\,dt$: cut $[a,b]$ into $n$ pieces of width $\\Delta t=\\frac{b-a}{n}$ and add up $g(t_i)\\Delta t$ for the left endpoints $t_0,\\dots,t_{n-1}$.", ref:"p. 5"}
  ],
  figures:{
    expbase:{title:"The base of an exponential", cap:"<b>Fig. 10.1</b> The curve is $y=a^x$; the faint dashed curve is $y=e^x$. The dashed line is the tangent at $x=0$, with slope $\\ln(a)$. Only $a=e$ gives slope 1. The solid line is the tangent at the point you drag: its slope is $a^x\\ln(a)$. (Lecture 10, pp. 1 to 2)",
      build(host,{PLOT}){
        let a=2, s=1;
        const f=x=>Math.pow(a,x);
        const G=PLOT.graph(host,{x:[-3,3],y:[-0.6,6],c:"var(--u4)",xlabel:"x",ylabel:"y",xstep:1,ystep:1});
        G.fn(Math.exp,{cls:"lt dash"});
        G.label(1.78,5.6,"eˣ",{cls:"lblc",dx:-14});
        const cur=G.fn(f,{cls:"cv c"});
        const t0=G.tangent(0,1,Math.log(a),{cls:"tan dash"});
        const tP=G.tangent(s,f(s),f(s)*Math.log(a),{cls:"tan"});
        G.dot(0,1,{filled:true,r:3.5});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        const P=G.handle(s,f(s),{f:x=>f(x),bounds:[-2.5,1.2],step:0.05,label:"Point on y = a^x",onMove:x=>{ s=x; draw(); }});
        const sl=PLOT.slider(ctl,{label:"base a",min:1.1,max:4,step:0.01,value:a,fmt:v=>v.toFixed(2),oninput:v=>{ a=v; redraw(); }});
        PLOT.seg(ctl,{label:"Preset bases",items:[["2","a = 2"],["e","a = e"],["3","a = 3"]],value:"2",onchange:v=>{ a=v==="e"?Math.E:+v; sl.set(+a.toFixed(2)); if(v==="e") sl.out.innerHTML="e ≈ 2.718"; redraw(); }});
        function redraw(){ cur.update(); P.move(s); }
        function draw(){
          const L=Math.log(a), h=f(s), m=h*L;
          t0.at(0,1,L); tP.at(s,h,m);
          const at=Math.abs(a-Math.E)<0.005?"e":a.toFixed(2);
          ro.innerHTML=`a = <b>${at}</b> &nbsp; slope at x = 0: ln(a) = <b>${L.toFixed(3)}</b><br>at x = ${s.toFixed(2)}: height aˣ = <b>${h.toFixed(3)}</b>, slope aˣ·ln(a) = <b>${m.toFixed(3)}</b>, slope ÷ height = <b>${(m/h).toFixed(3)}</b>`;
        }
        draw();
      }},
    loginv:{title:"Logarithms undo exponentials", cap:"<b>Fig. 10.2</b> $y=\\log_a(x)$ is the mirror image of $y=a^x$ across the line $y=x$. A point $(s, a^s)$ on the exponential becomes $(a^s, s)$ on the logarithm, which is the definition: $\\log_a(x)=y$ if and only if $x=a^y$. (Lecture 10, p. 3)",
      build(host,{PLOT}){
        let a=2, s=1;
        const ex=x=>Math.pow(a,x), lg=x=>x>0?Math.log(x)/Math.log(a):NaN;
        const G=PLOT.graph(host,{w:420,h:420,x:[-3,6],y:[-3,6],c:"var(--u4)",xlabel:"x",ylabel:"y",xstep:1,ystep:1});
        G.fn(x=>x,{cls:"lt dash"}); G.label(-2.6,-2.6,"y = x",{cls:"lblc",dx:8,dy:-4});
        const c1=G.fn(ex,{cls:"cv c"}), c2=G.fn(lg,{cls:"cv",from:0.004});
        const l1=G.label(0,0,"y = aˣ",{cls:"lblc",dx:8}), l2=G.label(0,0,"y = logₐ(x)",{cls:"lbl",anchor:"end",dy:-8});
        const link=G.line(0,0,1,1,{cls:"lt dash"});
        const Q=G.dot(ex(s),s,{filled:true});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        const P=G.handle(s,ex(s),{f:x=>ex(x),bounds:[-2.5,1.2],step:0.05,label:"Point on y = a^x",onMove:x=>{ s=x; draw(); }});
        PLOT.slider(ctl,{label:"base a",min:1.2,max:4,step:0.01,value:a,fmt:v=>v.toFixed(2),oninput:v=>{ a=v; c1.update(); c2.update(); P.move(s); }});
        function draw(){
          const y=ex(s); link.set(s,y,y,s); Q.set(y,s);
          const xl=Math.min(Math.log(5)/Math.log(a),4.4); l1.set(xl,ex(xl)); const y2=Math.min(lg(5.8),5.2); l2.set(Math.pow(a,y2),y2);
          ro.innerHTML=`(${s.toFixed(2)}, <b>${y.toFixed(3)}</b>) is on y = aˣ, so (<b>${y.toFixed(3)}</b>, ${s.toFixed(2)}) is on y = logₐ(x): log<sub>${a.toFixed(2)}</sub>(${y.toFixed(3)}) = <b>${s.toFixed(2)}</b>`;
        }
        draw();
      }},
    lnarea:{title:"ln(x) is an area", cap:"<b>Fig. 10.3</b> Top: the shaded area under $y=\\frac1t$ from $t=1$ to $t=x$ is $\\ln(x)$. Turn on rectangles to see the Left Riemann Sum. Bottom: the graph of $y=\\ln(x)$; the dot is the area above, and the open circle is the left sum. When $x<1$ the integral runs from right to left, so $\\ln(x)$ is negative. (Lecture 10, pp. 5 to 6)",
      build(host,{PLOT}){
        let x=3, n=3;
        const g=t=>1/t;
        const G=PLOT.graph(host,{x:[0,6.2],y:[0,2.6],h:250,c:"var(--u4)",xlabel:"t",ylabel:"y = 1/t",xstep:1,ystep:1});
        const rect=G.rects([]);
        const area=G.area(g,1,x,{noNeg:true});
        G.fn(g,{cls:"cv c",from:0.05});
        const H=PLOT.graph(host,{x:[0,6.2],y:[-1.6,2],h:220,c:"var(--u4)",xlabel:"x",ylabel:"y = ln(x)",xstep:1,ystep:1});
        H.fn(Math.log,{cls:"cv c",from:0.05});
        const drop=H.line(x,0,x,Math.log(x),{cls:"lt dash"});
        const sumDot=H.open(x,0), lnDot=H.dot(x,Math.log(x),{filled:true});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        G.handle(x,0,{axis:"x",bounds:[0.25,6],snap:0.05,step:0.05,label:"Upper limit x",onMove:v=>{ x=v; draw(); }});
        PLOT.slider(ctl,{label:"rectangles n",min:0,max:12,step:1,value:n,fmt:v=>v===0?"off":String(v),oninput:v=>{ n=v; draw(); }});
        function draw(){
          area.update(g,Math.min(1,x),Math.max(1,x));
          const p=area.querySelector("path"); if(p) p.setAttribute("class",x<1?"shade neg":"shade");
          let S=0; const list=[];
          if(n>0){ const dt=(x-1)/n; for(let i=0;i<n;i++){ const t=1+i*dt; list.push({x:dt>=0?t:t+dt,w:Math.abs(dt),h:g(t)}); S+=g(t)*dt; } }
          rect.update(list);
          const L=Math.log(x); drop.set(x,0,x,L); lnDot.set(x,L);
          sumDot.style.display=n>0?"":"none"; if(n>0) sumDot.set(x,Math.max(-1.6,Math.min(2,S)));
          ro.innerHTML=`x = <b>${x.toFixed(2)}</b> &nbsp; area from 1 to x = ln(x) = <b>${L.toFixed(4)}</b>`+(n>0?`<br>left sum with n = ${n}: <b>${S.toFixed(4)}</b> (Δt = ${((x-1)/n).toFixed(3)}), error ${(S-L).toFixed(4)}`:"")+(x<1?`<br>x &lt; 1: the integral runs from 1 back to x, so it is negative.`:"");
        }
        draw();
      }}
  },
  gens:[
    {id:"L10.g.lrs-ln", title:"Left Riemann Sum for ln", skill:"Approximate $\\ln(b)$ from $\\ln(x)=\\int_1^x\\frac1t\\,dt$", ref:"pp. 5 to 6",
      gen(R,d){
        const P = d===1?[[2,2],[3,2],[4,3],[5,2],[5,4],[7,3],[4,2]] : d===2?[[2,3],[2,4],[3,3],[3,4],[4,4],[5,3],[7,4],[6,5]] : [[2,5],[3,5],[4,6],[7,6],[6,4],[9,4],[3,6],[5,5],[8,5]];
        const [b,n]=R.pick(P);
        const dt=F(b-1,n), [p,q]=dt;
        const ts=[], terms=[]; let sum=[0,1], fl=0;
        for(let i=0;i<n;i++){ const t=F(q+i*p,q); ts.push(t); const term=F(p,q+i*p); terms.push(term); sum=Fadd(sum,term); fl+=(1/(1+i*(b-1)/n))*((b-1)/n); }
        const tT=t=>t[1]===1?String(t[0]):`${t[0]}/${t[1]}`;
        const inv=t=>t[1]===1?`\\frac{1}{${t[0]}}`:`\\frac{1}{${t[0]}/${t[1]}}`;
        const dtT=Ft(dt);
        const lead = d===3?`Recall that $\\ln(x)=\\displaystyle\\int_1^x\\frac{1}{t}\\,dt$. Use the Left Riemann Sum Approximation with $n=${n}$ subdivisions to approximate $\\ln(${b})$.`:`Approximate $\\ln(${b})$ using the Left Riemann Sum Approximation with $n = ${n}$ subdivisions.`;
        return {prompt:lead+" Give the exact value. A sum of fractions is fine.", answer:{type:"num",answer:Fa(sum)}, verify:{value:fl},
          hint:"Write $\\ln("+b+")$ as an integral first. Each rectangle has height $g(t_i)=\\frac{1}{t_i}$, not $t_i$, and the left sum stops at $t_{"+(n-1)+"}$.",
          steps:[
            `By definition, $\\ln(${b}) = \\displaystyle\\int_1^{${b}}\\frac{1}{t}\\,dt$. So $g(t)=\\frac{1}{t}$, $a=1$ and $b=${b}$.`,
            `$\\Delta t = \\frac{b-a}{n} = \\frac{${b}-1}{${n}} = ${dtT}$`,
            `$t_i = a + i\\Delta t = 1 + i\\cdot ${dtT}$, for $0\\le i\\le ${n}$. The left sum uses $t_0$ to $t_{${n-1}}$: `+ts.map((t,i)=>`$t_${i} = ${Ft(t)}$`).join(", ")+".",
            `$\\ln(${b}) \\approx `+ts.map((t,i)=>`g(t_${i})\\Delta t`).join(" + ")+`$`,
            `$= `+ts.map(t=>`${inv(t)}\\cdot ${dtT}`).join(" + ")+`$`,
            `$= `+terms.map(Ft).join(" + ")+` = ${Ft(sum)}$`,
            `So $\\ln(${b}) \\approx ${Ft(sum)} \\approx ${fl.toFixed(4)}$. (The true value is $\\ln(${b}) \\approx ${Math.log(b).toFixed(4)}$. The left sum is too big because $\\frac1t$ is decreasing.)`],
          answerTeX:`$\\ln(${b}) \\approx ${Ft(sum)}$`};
      }},
    {id:"L10.g.eval", title:"Evaluate and simplify logs and exponentials", skill:"Use the definition and properties of logarithms", ref:"pp. 3 to 5",
      gen(R,d){
        if(d===1){
          const kind=R.pick(["logint","logint","eln","lne"]);
          if(kind==="logint"){ const a=R.pick([2,3,5,10]); const kmax={2:6,3:4,5:3,10:4}[a]; const k=R.int(1,kmax)*(R()<0.35?-1:1);
            const N=powTeX(a,k);
            return {prompt:`Evaluate $\\log_{${a}}\\left(${N}\\right)$.`, answer:{type:"num",answer:k},
              hint:`$\\log_{${a}}(x)=y$ means $x = ${a}^y$. What power of ${a} gives $${N}$?`,
              steps:[`$\\log_{${a}}\\left(${N}\\right) = y$ means $${N} = ${a}^y$.`,`Since $${a}^{${k}} = ${N}$, we get $y = ${k}$.`,`Or with the properties: $\\log_{${a}}(${a}^{${k}}) = ${k}$.`], answerTeX:`$${k}$`};
          }
          if(kind==="eln"){ const m=R.int(2,12);
            return {prompt:`Simplify $e^{\\ln(${m})}$.`, answer:{type:"num",answer:m}, hint:"$e^x$ and $\\ln(x)$ undo each other: $a^{\\log_a(x)} = x$.",
              steps:[`Use $a^{\\log_a(x)} = x$ with $a = e$: $e^{\\ln(${m})} = ${m}$.`], answerTeX:`$${m}$`}; }
          const k=R.nz(-5,7);
          return {prompt:`Simplify $\\ln\\left(e^{${k}}\\right)$.`, answer:{type:"num",answer:k}, hint:"Use $\\log_a(a^y)=y$ with $a=e$.",
            steps:[`$\\ln$ is $\\log_e$, so $\\ln(e^{${k}}) = \\log_e(e^{${k}}) = ${k}$.`], answerTeX:`$${k}$`};
        }
        if(d===2){
          const kind=R.pick(["ekln","logsum","condense"]);
          if(kind==="ekln"){ const k=R.int(2,3), m=R.int(2,5), v=Math.pow(m,k);
            return {prompt:`Simplify $e^{${k}\\ln(${m})}$.`, answer:{answer:String(v),vars:[],form:noLogs,formWhy:"Simplify fully: no $e$ or $\\ln$ left."},
              hint:"There must be no coefficient in front of $\\ln$ before you cancel. Move it inside first.",
              steps:[`Power rule for logs: $${k}\\ln(${m}) = \\ln(${m}^{${k}})$.`,`So $e^{${k}\\ln(${m})} = e^{\\ln(${m}^{${k}})} = ${m}^{${k}} = ${v}$.`], answerTeX:`$${v}$`}; }
          if(kind==="logsum"){ const [u,v]=R.shuffle([3,5,7]).slice(0,2), i=R.int(1,3), j=R.int(1,2);
            const A=u*Math.pow(2,i), B=v*Math.pow(2,j), C=u*v, k=i+j;
            return {prompt:`Simplify $\\log_2(${A}) - \\log_2(${C}) + \\log_2(${B})$.`, answer:{type:"num",answer:k},
              hint:"Combine into one logarithm with the quotient and product rules, then simplify the fraction.",
              steps:[`Quotient rule: $\\log_2(${A}) - \\log_2(${C}) = \\log_2\\left(\\frac{${A}}{${C}}\\right)$.`,`Product rule: $\\log_2\\left(\\frac{${A}}{${C}}\\right) + \\log_2(${B}) = \\log_2\\left(\\frac{${A}\\cdot ${B}}{${C}}\\right) = \\log_2(${A*B/C})$.`,`$${A*B/C} = 2^{${k}}$, so $\\log_2(2^{${k}}) = ${k}$.`], answerTeX:`$${k}$`}; }
          const B=R.int(2,6), s=R.int(2,5), A=B*s, C=R.pick([2,3,5,7].filter(c=>c!==s)), v=s*C;
          return {prompt:`Write $\\ln(${A}) - \\ln(${B}) + \\ln(${C})$ as a single logarithm.`, answer:{answer:`ln(${v})`,vars:[],form:t=>(String(t).match(/ln|log/g)||[]).length<=1,formWhy:"Equal, but write it as one logarithm: $\\ln(\\text{number})$."},
            hint:"Subtraction of logs is division inside; addition is multiplication inside.",
            steps:[`Quotient rule: $\\ln(${A}) - \\ln(${B}) = \\ln\\left(\\frac{${A}}{${B}}\\right) = \\ln(${s})$.`,`Product rule: $\\ln(${s}) + \\ln(${C}) = \\ln(${s}\\cdot ${C}) = \\ln(${v})$.`], answerTeX:`$\\ln(${v})$`};
        }
        const kind=R.pick(["xy","quot","root"]);
        if(kind==="xy"){ const a=R.int(2,4), b=R.int(2,4), minus=R()<0.4;
          const ans=minus?`x^${a}/y^${b}`:`x^${a}*y^${b}`, at=minus?`\\frac{x^{${a}}}{y^{${b}}}`:`x^{${a}}y^{${b}}`;
          return {prompt:`Simplify $e^{${a}\\ln(x) ${minus?"-":"+"} ${b}\\ln(y)}$ for $x>0$, $y>0$.`, answer:{answer:ans,vars:["x","y"],domain:[0.5,3],form:noLogs,formWhy:"Simplify fully: no $e$ or $\\ln$ left."},
            hint:"Move each coefficient inside its logarithm, combine into one logarithm, then use $e^{\\ln(u)} = u$.",
            steps:[`Power rule: $${a}\\ln(x) = \\ln(x^{${a}})$ and $${b}\\ln(y) = \\ln(y^{${b}})$.`,minus?`Quotient rule: $\\ln(x^{${a}}) - \\ln(y^{${b}}) = \\ln\\left(\\frac{x^{${a}}}{y^{${b}}}\\right)$.`:`Product rule: $\\ln(x^{${a}}) + \\ln(y^{${b}}) = \\ln(x^{${a}}y^{${b}})$.`,`So the expression is $e^{\\ln\\left(${at}\\right)} = ${at}$.`], answerTeX:`$${at}$`}; }
        if(kind==="quot"){ const a=R.int(2,3), c=R.int(1,5);
          return {prompt:`Simplify $e^{${a}\\ln(x) - \\ln(x+${c})}$ for $x>0$.`, answer:{answer:`x^${a}/(x+${c})`,vars:["x"],domain:[0.5,3],form:noLogs,formWhy:"Simplify fully: no $e$ or $\\ln$ left."},
            hint:"Write the exponent as a single logarithm first.",
            steps:[`Power rule: $${a}\\ln(x) = \\ln(x^{${a}})$.`,`Quotient rule: $\\ln(x^{${a}}) - \\ln(x+${c}) = \\ln\\left(\\frac{x^{${a}}}{x+${c}}\\right)$.`,`$e^{\\ln(u)} = u$, so the answer is $\\frac{x^{${a}}}{x+${c}}$.`], answerTeX:`$\\frac{x^{${a}}}{x+${c}}$`}; }
        const k=R.pick([2,3]), m=R.int(1,3);
        const rt=k===2?"\\sqrt{x}":"\\sqrt[3]{x}";
        const body=m===1?rt:`${m===1?"":m}x\\cdot ${rt}`;
        return {prompt:`Simplify $e^{\\frac{1}{${k}}\\ln(x)${m>1?` + \\ln(${m}x)`:""}}$ for $x>0$.`, answer:{answer:m>1?`${m}x*x^(1/${k})`:`x^(1/${k})`,vars:["x"],domain:[0.5,3],form:noLogs,formWhy:"Simplify fully: no $e$ or $\\ln$ left."},
          hint:"Move the coefficient inside: $\\frac1k\\ln(x) = \\ln(x^{1/k})$.",
          steps:[`Power rule: $\\frac{1}{${k}}\\ln(x) = \\ln(x^{1/${k}}) = \\ln(${rt})$.`].concat(m>1?[`Product rule: $\\ln(${rt}) + \\ln(${m}x) = \\ln(${m}x${rt})$.`]:[]).concat([`$e^{\\ln(u)}=u$, so the answer is $${m>1?`${m}x${rt}`:rt}$.`]),
          answerTeX:`$${m>1?`${m}x${rt}`:rt}$`};
      }},
    {id:"L10.g.expand", title:"Expand $\\ln(f(x))$", skill:"Write $\\ln(f(x))$ as a sum and difference of logarithms", ref:"p. 4",
      gen(R,d){
        const nf=d===1?2:d===2?3:4;
        const pool=R.shuffle([0,1,2,3,4,5,-1,-2,-3]).slice(0,nf);
        const fac=pool.map(c=>({c,p:[R.int(1,d===1?3:4),1],top:true}));
        // place factors top or bottom
        if(d===1){ fac[1].top=R()<0.5; }
        else if(d===2){ const nb=R.int(1,2); fac.forEach((f,i)=>f.top=i>=nb); }
        else { const nb=R.int(1,2); fac.forEach((f,i)=>f.top=i>=nb); const r=R.int(0,nf-1); fac[r].p=[1,R.pick([2,3])]; fac[r].root=R()<0.5; }
        fac.sort((u,v)=>(u.c===0?-1:0)-(v.c===0?-1:0));
        const top=fac.filter(f=>f.top), bot=fac.filter(f=>!f.top);
        const facT=(f,alone)=>{ const inner=lin(f.c), [pn,pd]=f.p;
          if(pd>1) return f.root?(pd===2?`\\sqrt{${inner}}`:`\\sqrt[3]{${inner}}`):(f.c===0?`x^{1/${pd}}`:`(${inner})^{1/${pd}}`);
          if(pn===1) return (f.c===0||alone)?inner:`(${inner})`;
          return f.c===0?`x^{${pn}}`:`(${inner})^{${pn}}`; };
        const prodT=L=>L.map(f=>facT(f,L.length===1)).join("");
        const fT=bot.length?`\\frac{${prodT(top)}}{${prodT(bot)}}`:prodT(top);
        const lnT=f=>`\\ln(${f.c===0?"x":lin(f.c)})`;
        const lnFac=f=>`\\ln\\left(${facT(f,true)}\\right)`;
        const lnFacSimple=f=>(f.p[0]===1&&f.p[1]===1)?lnT(f):lnFac(f);
        const term=(f,sgn,first)=>cT(sgn*f.p[0],f.p[1],lnT(f),first);
        let ansT=""; let first=true; top.forEach(f=>{ ansT+=term(f,1,first); first=false; }); bot.forEach(f=>{ ansT+=term(f,-1,false); });
        const ans=top.map(f=>`+(${f.p[0]}/${f.p[1]})*ln(${lin(f.c)})`).concat(bot.map(f=>`-(${f.p[0]}/${f.p[1]})*ln(${lin(f.c)})`)).join("").replace(/^\+/,"");
        const lo=Math.max(0,...fac.map(f=>-f.c));
        const steps=[`Taking $\\ln$ of both sides gives $\\ln(f(x)) = \\ln\\left(${fT}\\right)$.`];
        if(bot.length) steps.push(`Quotient rule: $= \\ln\\left(${prodT(top)}\\right) - \\ln\\left(${prodT(bot)}\\right)$`);
        const topSum=top.map(lnFacSimple).join(" + "), botSum=bot.map(lnFacSimple).join(" + ");
        if(top.length>1||bot.length>1) steps.push(`Product rule on each part: $= ${topSum}${bot.length?(bot.length>1?` - \\left[${botSum}\\right]`:` - ${botSum}`):""}$`);
        steps.push(`Power rule $\\log_a(x^y)=y\\log_a(x)$ on each term${bot.length>1?", and distribute the minus sign over the bracket":""}: $= ${ansT}$`);
        if(fac.some(f=>f.p[1]>1)) steps.push(`A root is a fractional power: $\\sqrt{u} = u^{1/2}$ and $\\sqrt[3]{u}=u^{1/3}$.`);
        return {prompt:`Let $f(x) = ${fT}$. Write $\\ln(f(x))$ as a sum and difference of logarithms (no products, quotients or powers inside any $\\ln$).`,
          answer:{answer:ans,vars:["x"],domain:[lo+0.5,lo+3],form:lnArgsSimple,formWhy:"Equal, but each $\\ln$ should hold a single factor like $\\ln(x+2)$. Use the product, quotient and power rules."},
          hint:"Quotient rule first (top minus bottom), then the product rule, then bring each power down in front. Keep a bracket around the denominator's logs so the minus sign hits all of them.",
          steps, answerTeX:`$\\ln(f(x)) = ${ansT}$`};
      }},
    {id:"L10.g.dax", title:"Derivatives of $a^x$", skill:"Differentiate exponentials with any base", ref:"p. 2",
      gen(R,d){
        const a=R.pick([2,3,5,7,10]);
        if(d===1){ const c=R.nz(-6,6), b=R.nz(-5,5), n=R.int(1,4);
          const fT=`${ccN(c)}${a}^x ${M.term(b,"x",n)}`;
          return {prompt:`Find $f'(x)$ for $f(x) = ${fT}$.`, answer:{answer:`${c}*${a}^x*ln(${a}) + ${b*n}*x^${n-1}`,vars:["x"],domain:[-1.5,1.5]}, verify:{deriv:`${c}*${a}^x + ${b}*x^${n}`},
            hint:`$\\frac{d}{dx}a^x = a^x\\ln(a)$. This is not the power rule: the variable is in the exponent.`,
            steps:[`Differentiate term by term.`,`$\\frac{d}{dx}\\left(${ccN(c)}${a}^x\\right) = ${ccN(c)}${a}^x\\ln(${a})$`,`$\\frac{d}{dx}\\left(${M.term(b,"x",n,true)}\\right) = ${M.term(b*n,"x",n-1,true)}$`],
            answerTeX:`$f'(x) = ${ccN(c)}${a}^x\\ln(${a}) ${M.term(b*n,"x",n-1)}$`};
        }
        const kind=d===2?R.pick(["chain","prod"]):R.pick(["chainsq","quot","prodchain"]);
        if(kind==="chain"){ const k=R.pick([-3,-2,2,3,4]), m=R.int(-4,4);
          const inner=`${M.term(k,"x",1,true)}${M.term(m,"x",0)}`;
          return {prompt:`Find $\\frac{dy}{dx}$ for $y = ${a}^{${inner}}$.`, answer:{answer:`${a}^(${k}x+${m})*ln(${a})*${k}`,vars:["x"],domain:[-1,1]}, verify:{deriv:`${a}^(${k}x+${m})`},
            hint:"Chain rule: the outside is $a^u$, with derivative $a^u\\ln(a)$; the inside is $u = "+inner+"$.",
            steps:[`Let $u = ${inner}$, so $y = ${a}^u$ and $\\frac{du}{dx} = ${k}$.`,`$\\frac{dy}{du} = ${a}^u\\ln(${a})$.`,`Chain rule: $\\frac{dy}{dx} = ${a}^{${inner}}\\ln(${a})\\cdot ${k<0?`(${k})`:k} = ${k}\\ln(${a})\\,${a}^{${inner}}$.`],
            answerTeX:`$\\frac{dy}{dx} = ${k}\\ln(${a})\\,${a}^{${inner}}$`}; }
        if(kind==="prod"){ const n=R.int(1,3);
          const xn=n===1?"x":`x^{${n}}`, dxn=n===1?"":n===2?"2x":`${n}x^{${n-1}}`;
          return {prompt:`Differentiate $f(x) = ${xn}\\cdot ${a}^x$.`, answer:{answer:`${n}*x^${n-1}*${a}^x + x^${n}*${a}^x*ln(${a})`,vars:["x"],domain:[-1.5,1.5]}, verify:{deriv:`x^${n}*${a}^x`},
            hint:"Product rule $(fg)' = f'g + fg'$, with $\\frac{d}{dx}a^x = a^x\\ln(a)$.",
            steps:[`Factors: $${xn}$ and $${a}^x$. Their derivatives: $${n===1?"1":dxn}$ and $${a}^x\\ln(${a})$.`,`Product rule: $f'(x) = ${n===1?"1":dxn}\\cdot ${a}^x + ${xn}\\cdot ${a}^x\\ln(${a})$.`],
            answerTeX:`$f'(x) = ${dxn?dxn+"\\cdot ":""}${a}^x + ${xn}\\cdot ${a}^x\\ln(${a})$`}; }
        if(kind==="chainsq"){ const c=R.int(-3,3);
          const inner=`x^2${M.term(c,"x",0)}`;
          return {prompt:`Find $f'(x)$ for $f(x) = ${a}^{${inner}}$.`, answer:{answer:`2x*${a}^(x^2+${c})*ln(${a})`,vars:["x"],domain:[-1.2,1.2]}, verify:{deriv:`${a}^(x^2+${c})`},
            hint:"Chain rule with inside $u = "+inner+"$.",
            steps:[`Let $u = ${inner}$, so $\\frac{du}{dx} = 2x$.`,`$\\frac{d}{du}${a}^u = ${a}^u\\ln(${a})$.`,`So $f'(x) = ${a}^{${inner}}\\ln(${a})\\cdot 2x = 2x\\ln(${a})\\,${a}^{${inner}}$.`],
            answerTeX:`$f'(x) = 2x\\ln(${a})\\,${a}^{${inner}}$`}; }
        if(kind==="quot"){ const n=R.int(1,3); const xn=n===1?"x":`x^{${n}}`;
          const top=n===1?`${a}^x - x\\cdot ${a}^x\\ln(${a})`:`${n}x^{${n-1}}\\cdot ${a}^x - x^{${n}}\\cdot ${a}^x\\ln(${a})`;
          const simp=n===1?`\\frac{1 - x\\ln(${a})}{${a}^x}`:`\\frac{x^{${n-1}}\\left(${n} - x\\ln(${a})\\right)}{${a}^x}`;
          return {prompt:`Differentiate $f(x) = \\frac{${xn}}{${a}^x}$.`, answer:{answer:`x^${n-1}*(${n} - x*ln(${a}))/${a}^x`,vars:["x"],domain:[-1.5,1.5]}, verify:{deriv:`x^${n}/${a}^x`},
            hint:"Quotient rule $\\frac{f'g - fg'}{g^2}$ with $g = a^x$. At the end, cancel one factor of $a^x$.",
            steps:[`Top $${xn}$ has derivative $${n===1?"1":`${n}x^{${n-1}}`}$; bottom $${a}^x$ has derivative $${a}^x\\ln(${a})$.`,`Quotient rule: $f'(x) = \\frac{${top}}{(${a}^x)^2}$.`,`$(${a}^x)^2 = ${a}^{2x}$. Factor $${a}^x$ out of the top and cancel: $f'(x) = ${simp}$.`],
            answerTeX:`$f'(x) = ${simp}$`}; }
        const k=R.pick([-2,-1,2,3]), c=R.nz(-4,4);
        const ek=`${a}^{${cc(k)}x}`;
        return {prompt:`Differentiate $g(x) = ${cc(c)}x^2\\cdot ${ek}$.`, answer:{answer:`${c}*(2x*${a}^(${k}x) + x^2*${a}^(${k}x)*ln(${a})*${k})`,vars:["x"],domain:[-1.2,1.2]}, verify:{deriv:`${c}*x^2*${a}^(${k}x)`},
          hint:"Product rule, and the chain rule for $"+ek+"$.",
          steps:[`$\\frac{d}{dx}${ek} = ${a}^{${cc(k)}x}\\ln(${a})\\cdot ${k<0?`(${k})`:k}$ by the chain rule.`,`Product rule: $g'(x) = ${cc(c)}\\left[2x\\cdot ${ek} + x^2\\cdot ${k}\\ln(${a})\\,${ek}\\right]$.`],
          answerTeX:`$g'(x) = ${cc(c)}\\left[2x\\cdot ${ek} ${k<0?"-":"+"} ${Math.abs(k)===1?"":Math.abs(k)}\\ln(${a})\\,x^2\\cdot ${ek}\\right]$`};
      }},
    {id:"L10.g.iax", title:"Integrals of $a^x$", skill:"Antiderivatives, definite integrals and IVPs with $a^x$", ref:"pp. 2 to 3",
      gen(R,d){
        const a=R.pick([2,3,4,5,10]);
        if(d===1){ const c=R.nz(-5,5), b=R.nz(-6,6), n=R.int(1,3);
          const fT=`${ccN(c)}${a}^x ${M.term(b,"x",n)}`;
          const aT=`${c<0?"-":""}\\frac{${Math.abs(c)===1?"":Math.abs(c)+"\\cdot "}${a}^x}{\\ln(${a})} ${cT(b,n+1,`x^{${n+1}}`)}`;
          return {prompt:`Evaluate $\\displaystyle\\int \\left(${fT}\\right)dx$.`, answer:{answer:`${c}*${a}^x/ln(${a}) + ${b}/${n+1}*x^${n+1} + C`,vars:["x"],domain:[-1.5,1.5],plusC:true,consts:[]}, verify:{antideriv:`${c}*${a}^x + ${b}*x^${n}`},
            hint:"$\\int a^x\\,dx = \\frac{a^x}{\\ln(a)} + C$. Use the power rule for the other term. Do not forget $+C$.",
            steps:[`Integrate term by term.`,`$\\int ${ccN(c)}${a}^x\\,dx = ${c<0?"-":""}\\frac{${Math.abs(c)===1?"":Math.abs(c)+"\\cdot "}${a}^x}{\\ln(${a})}$`,`$\\int ${M.term(b,"x",n,true)}\\,dx = ${cT(b,n+1,`x^{${n+1}}`,true)}$`,`Add one constant: $${aT} + C$.`],
            answerTeX:`$${aT} + C$`};
        }
        if(d===2){ const c=R.int(1,4), L=R.pick([0,0,-1]), m=R.int(1,2);
          const val=c*(Math.pow(a,m)-Math.pow(a,L))/Math.log(a);
          const num=L===0?F(c*(Math.pow(a,m)-1),1):F(c*(Math.pow(a,m+1)-1),a);
          const resT=num[1]===1?`\\frac{${num[0]}}{\\ln(${a})}`:`\\frac{${num[0]}}{${num[1]}\\ln(${a})}`;
          let simpson=0; { const N=200, h=(m-L)/N; for(let i=0;i<=N;i++){ const x=L+i*h, w=(i===0||i===N)?1:(i%2?4:2); simpson+=w*c*Math.pow(a,x); } simpson*=h/3; }
          const aL=L===0?"1":`\\frac{1}{${a}}`;
          return {prompt:`Evaluate $\\displaystyle\\int_{${L}}^{${m}} ${c===1?"":c+"\\cdot "}${a}^x\\,dx$. Give the exact value.`, answer:{type:"num",answer:`${c}*(${a}^${m} - ${a}^(${L}))/ln(${a})`}, verify:{value:simpson},
            hint:"Antiderivative $\\frac{a^x}{\\ln(a)}$, then top limit minus bottom limit.",
            steps:[`An antiderivative of $${c===1?"":c+"\\cdot "}${a}^x$ is $\\frac{${c===1?"":c+"\\cdot "}${a}^x}{\\ln(${a})}$.`,`$\\displaystyle\\int_{${L}}^{${m}} ${c===1?"":c+"\\cdot "}${a}^x\\,dx = \\left[\\frac{${c===1?"":c+"\\cdot "}${a}^x}{\\ln(${a})}\\right]_{${L}}^{${m}} = \\frac{${c===1?"":c+"\\cdot "}${Math.pow(a,m)} - ${c===1?"":c+"\\cdot "}${aL}}{\\ln(${a})}$`,`$= ${resT} \\approx ${val.toFixed(4)}$`],
            answerTeX:`$${resT}$`};
        }
        const x0=R.pick([0,1,2,-1]), y0=R.int(-4,6), b=R.pick([0,R.nz(-4,4)]);
        const A=x0>=0?String(Math.pow(a,x0)):`\\frac{1}{${a}}`;
        const Aa=x0>=0?String(Math.pow(a,x0)):`(1/${a})`;
        const rhs=`${a}^x${b?M.term(b,"x",0):""}`;
        const yT=`\\frac{${a}^x}{\\ln(${a})}${b?M.term(b,"x",1):""}`;
        const Cconst=y0-b*x0;
        const Ct=`${Cconst?Cconst+" ":""}- \\frac{${A}}{\\ln(${a})}`, CtY=`${Cconst?M.pm(Cconst)+" ":""}- \\frac{${A}}{\\ln(${a})}`;
        return {prompt:`Solve the initial value problem $y' = ${rhs}$, $y(${x0}) = ${y0}$.`, answer:{answer:`${a}^x/ln(${a}) + ${b}*x + ${Cconst} - ${Aa}/ln(${a})`,vars:["x"],domain:[-1.5,1.5]}, verify:{antideriv:`${a}^x + ${b}`},
          hint:"Integrate to get all solutions with $+C$, then use the initial condition to find $C$.",
          steps:[`All solutions of the differential equation are given by $y = \\displaystyle\\int \\left(${rhs}\\right)dx = ${yT} + C$.`,`The initial condition says that $y = ${y0}$ when $x = ${x0}$. Hence, $${y0} = \\frac{${a}^{${x0}}}{\\ln(${a})}${b?` ${b<0?"-":"+"} ${Math.abs(b)}(${x0})`:""} + C$.`,`So $C = ${Ct}$.`,`Hence, the solution is $y = ${yT} ${CtY}$.`],
          answerTeX:`$y = ${yT} ${CtY}$`};
      }},
    {id:"L10.g.logeq", title:"Solve exponential and log equations", skill:"Undo $\\ln$ with $e^x$ (and back), and check the domain", ref:"pp. 3 to 4",
      gen(R,d){
        if(d===1){ const kind=R.pick(["loga","ex","lnx"]);
          if(kind==="loga"){ const a=R.pick([2,3,5,10]), n=R.nz(-2,a===2?5:3); const v=n>0?String(Math.pow(a,n)):`1/${Math.pow(a,-n)}`;
            return {prompt:`Solve $\\log_{${a}}(x) = ${n}$.`, answer:{type:"list",answer:v}, hint:"Use the definition: $\\log_a(x)=y$ if and only if $x=a^y$.",
              steps:[`By definition, $\\log_{${a}}(x) = ${n}$ means $x = ${a}^{${n}}$.`,`$${a}^{${n}} = ${powTeX(a,n)}$, and it is positive, so it is in the domain.`], answerTeX:`$x = ${powTeX(a,n)}$`}; }
          if(kind==="ex"){ const m=R.pick([2,3,5,6,7,10]);
            return {prompt:`Solve $e^x = ${m}$. Give the exact answer.`, answer:{type:"list",answer:`ln(${m})`}, hint:"Take $\\ln$ of both sides.",
              steps:[`Take $\\ln$ of both sides: $\\ln(e^x) = \\ln(${m})$.`,`$\\ln(e^x) = x$, so $x = \\ln(${m})$.`], answerTeX:`$x = \\ln(${m})$`}; }
          const k=R.nz(-3,4);
          return {prompt:`Solve $\\ln(x) = ${k}$. Give the exact answer.`, answer:{type:"list",answer:`e^(${k})`}, hint:"$\\ln(x)=y$ if and only if $x=e^y$.",
            steps:[`Apply $e^{(\\cdot)}$ to both sides: $e^{\\ln(x)} = e^{${k}}$.`,`So $x = e^{${k}}$, which is positive.`], answerTeX:`$x = e^{${k}}$`};
        }
        if(d===2){
          let r, s; do{ r=R.int(1,7); s=R.int(1,6); }while(r===s);
          if(R()<0.6){ const c=s-r, q=r*s;
            return {prompt:`Find all values of $x$ such that $\\ln(x) + \\ln(${lin(c)}) = \\ln(${q})$.`, answer:{type:"list",answer:String(r)},
              hint:"Combine the left side into one logarithm. After solving, check every answer in the original equation: $\\ln$ only accepts positive inputs.",
              steps:[`Product rule: $\\ln(x(${lin(c)})) = \\ln(${q})$.`,`Apply $e^{(\\cdot)}$ to both sides: $x(${lin(c)}) = ${q}$, so $${M.poly([1,c,-q])} = 0$.`,`Factor: $(x - ${r})(x + ${s}) = 0$, so $x = ${r}$ or $x = -${s}$.`,`Check the domain: $\\ln(x)$ needs $x > 0$. So $x = -${s}$ is rejected.`,`The only solution is $x = ${r}$.`],
              answerTeX:`$x = ${r}$ (reject $x=-${s}$)`}; }
          const p=r-s, q=r*s;
          return {prompt:`Find all values of $x$ such that $2\\ln(x) = \\ln(${M.term(p,"x",1,true)}${M.term(q,"x",0)})$.`, answer:{type:"list",answer:String(r)},
            hint:"Move the 2 inside first, then undo the logarithm. Check each answer in the original equation.",
            steps:[`Power rule: $2\\ln(x) = \\ln(x^2)$, so $\\ln(x^2) = \\ln(${M.term(p,"x",1,true)}${M.term(q,"x",0)})$.`,`Apply $e^{(\\cdot)}$: $x^2 = ${M.term(p,"x",1,true)}${M.term(q,"x",0)}$, so $${M.poly([1,-p,-q])} = 0$.`,`Factor: $(x - ${r})(x + ${s}) = 0$, so $x = ${r}$ or $x = -${s}$.`,`$\\ln(x)$ on the left needs $x>0$, so $x=-${s}$ is rejected.`,`The only solution is $x = ${r}$.`],
            answerTeX:`$x = ${r}$ (reject $x=-${s}$)`};
        }
        if(R()<0.5){ const c=R.pick([2,3,5]), t=R.int(2,7), k=R.pick([-3,-2,2,3,4]), b=R.int(-3,3), m=c*t;
          const inner=`${M.term(k,"x",1,true)}${M.term(b,"x",0)}`;
          return {prompt:`Solve $${c}e^{${inner}} = ${m}$. Give the exact answer.`, answer:{type:"list",answer:`(ln(${t}) - (${b}))/(${k})`},
            hint:"Get the exponential alone first, then take $\\ln$ of both sides.",
            steps:[`Divide by ${c}: $e^{${inner}} = ${t}$.`,`Take $\\ln$ of both sides: $${inner} = \\ln(${t})$.`,b?`$${cc(k)}x = \\ln(${t}) ${M.pm(-b)}$`:`$${cc(k)}x = \\ln(${t})$`,`$x = \\frac{\\ln(${t})${b?M.pm(-b):""}}{${k}}$`],
            answerTeX:`$x = \\frac{\\ln(${t})${b?M.pm(-b):""}}{${k}}$`}; }
        const a=R.pick([2,3,5]), k=R.int(2,4), m=R.pick([5,6,7,10,11,12].filter(v=>Math.abs(Math.log(v)/Math.log(a)-Math.round(Math.log(v)/Math.log(a)))>1e-9));
        return {prompt:`Solve $${a}^{${k}x} = ${m}$. Give the exact answer.`, answer:{type:"list",answer:`ln(${m})/(${k}*ln(${a}))`},
          hint:"Take $\\ln$ of both sides and use the power rule to bring the exponent down.",
          steps:[`Take $\\ln$ of both sides: $\\ln(${a}^{${k}x}) = \\ln(${m})$.`,`Power rule: $${k}x\\ln(${a}) = \\ln(${m})$.`,`Divide: $x = \\frac{\\ln(${m})}{${k}\\ln(${a})}$.`],
          answerTeX:`$x = \\frac{\\ln(${m})}{${k}\\ln(${a})}$`};
      }},
    {id:"L10.g.err", title:"Find the mistake", skill:"Error analysis: log properties and Left Riemann Sums", ref:"pp. 3 to 6",
      gen(R,d){
        const yesno = d>=2 && R()<0.3;
        const wrap=(prob,L,bad)=>{
          if(yesno){ const showBad=R()<0.6; const shown=showBad?L.badLines:L.good;
            return {prompt:`Is the provided answer to the following problem correct?<br>Problem: ${prob}<br>Answer:${lines(shown)}`,
              parts:[{answer:{type:"mc",options:["Yes, the solution is correct.","No, the solution is not correct."],correct:showBad?1:0,keep:true}}],
              hint:"Check each line against the properties, one at a time.",
              steps:showBad?[`Line (${L.at}) is wrong. ${L.why}`,`The correct work is:${lines(L.good)}`]:["Every line follows from the one before it.",`${L.okWhy}`],
              answerTeX:showBad?"No, the solution is not correct.":"Yes, the solution is correct."}; }
          return {prompt:`A problem and answer are shown below. The answer would not get a perfect score. Select the first line that has a mistake.<br>Problem: ${prob}<br>Answer:${lines(L.badLines)}`,
            parts:[{answer:{type:"mc",options:L.badLines.map((t,i)=>`(${i+1})`),correct:L.at-1,keep:true}}],
            hint:"Read the lines in order. A line is wrong if it does not follow from the one before it, even if a later line looks fine.",
            steps:[`The first mistake is in line (${L.at}). ${L.why}`,`The correct work is:${lines(L.good)}`],
            answerTeX:`Line (${L.at})`};
        };
        if(d===1){ const a=R.int(2,4), b=R.int(2,4);
          const good=[`e^{${a}\\ln(x) + ${b}\\ln(y)} = e^{\\ln(x^{${a}}) + \\ln(y^{${b}})}`,`= e^{\\ln(x^{${a}}y^{${b}})}`,`= x^{${a}}y^{${b}}`];
          const at=R.int(1,3); let bad, why;
          if(at===1){ bad=[`e^{${a}\\ln(x) + ${b}\\ln(y)} = e^{\\ln(${a}x) + \\ln(${b}y)}`,`= e^{\\ln(${a*b}xy)}`,`= ${a*b}xy`]; why=`The power rule is $${a}\\ln(x) = \\ln(x^{${a}})$, not $\\ln(${a}x)$.`; }
          else if(at===2){ bad=[good[0],`= e^{\\ln(x^{${a}} + y^{${b}})}`,`= x^{${a}} + y^{${b}}`]; why="The product rule says a sum of logs is the log of a product: $\\ln(u)+\\ln(v) = \\ln(uv)$, not $\\ln(u+v)$."; }
          else { bad=[good[0],good[1],`= x^{${a}} + y^{${b}}`]; why=`$e^{\\ln(u)} = u$, so $e^{\\ln(x^{${a}}y^{${b}})} = x^{${a}}y^{${b}}$. The product became a sum.`; }
          const prob=`Simplify $e^{${a}\\ln(x) + ${b}\\ln(y)}$ for $x>0$, $y>0$.`;
          if(!yesno){ // three-line items work better as "pick the right student answer" half the time
            if(R()<0.5){ const opts=R.shuffle([[`$x^{${a}}y^{${b}}$`,1],[`$${a*b}xy$`,0],[`$x^{${a}} + y^{${b}}$`,0]]);
              return {prompt:`Three students simplified $e^{${a}\\ln(x) + ${b}\\ln(y)}$ for $x>0$, $y>0$. Which answer is correct?`, parts:[{answer:{type:"mc",options:opts.map(o=>o[0]),correct:opts.findIndex(o=>o[1])}}],
                hint:"Move each coefficient inside its log, combine the logs, then cancel $e$ and $\\ln$.",
                steps:[`Power rule: $${a}\\ln(x) = \\ln(x^{${a}})$, $${b}\\ln(y) = \\ln(y^{${b}})$.`,`Product rule: $\\ln(x^{${a}}) + \\ln(y^{${b}}) = \\ln(x^{${a}}y^{${b}})$.`,`$e^{\\ln(u)} = u$, so the answer is $x^{${a}}y^{${b}}$. ($${a*b}xy$ comes from $${a}\\ln(x)=\\ln(${a}x)$, which is wrong; $x^{${a}}+y^{${b}}$ turns the product into a sum.)`],
                answerTeX:`$x^{${a}}y^{${b}}$`}; } }
          return wrap(prob,{good,badLines:bad,at,why,okWhy:"Power rule, then product rule, then $e^{\\ln(u)}=u$."});
        }
        if(d===2 || R()<0.4){
          const A=R.int(1,5), B=-R.int(1,3), m=R.int(2,4), n=R.int(2,3), k=R.int(2,4);
          const fT=`\\frac{(${lin(A)})^{${m}}}{x^{${n}}(${lin(B)})^{${k}}}`;
          const good=[`\\ln(f(x)) = \\ln\\left(${fT}\\right)`,`= \\ln((${lin(A)})^{${m}}) - \\ln(x^{${n}}(${lin(B)})^{${k}})`,`= \\ln((${lin(A)})^{${m}}) - \\left[\\ln(x^{${n}}) + \\ln((${lin(B)})^{${k}})\\right]`,`= ${m}\\ln(${lin(A)}) - ${n}\\ln(x) - ${k}\\ln(${lin(B)})`];
          const at=R.int(2,4); let bad, why;
          if(at===2){ bad=[good[0],`= \\frac{\\ln((${lin(A)})^{${m}})}{\\ln(x^{${n}}(${lin(B)})^{${k}})}`,`= \\frac{\\ln((${lin(A)})^{${m}})}{\\ln(x^{${n}}) + \\ln((${lin(B)})^{${k}})}`,`= \\frac{${m}\\ln(${lin(A)})}{${n}\\ln(x) + ${k}\\ln(${lin(B)})}`]; why="The log of a quotient is a difference of logs: $\\ln\\left(\\frac{u}{v}\\right) = \\ln(u) - \\ln(v)$, not a quotient of logs."; }
          else if(at===3){ bad=[good[0],good[1],`= \\ln((${lin(A)})^{${m}}) - \\ln(x^{${n}}) + \\ln((${lin(B)})^{${k}})`,`= ${m}\\ln(${lin(A)}) - ${n}\\ln(x) + ${k}\\ln(${lin(B)})`]; why=`The minus sign must apply to the whole denominator: $-\\ln(x^{${n}}(${lin(B)})^{${k}}) = -\\ln(x^{${n}}) - \\ln((${lin(B)})^{${k}})$. Keep the bracket.`; }
          else { if(R()<0.5){ bad=[good[0],good[1],good[2],`= ${m}\\ln(${lin(A)}) - ${n}\\ln(x) + ${k}\\ln(${lin(B)})`]; why="The minus sign in front of the bracket was not distributed to the last term."; }
                 else { bad=[good[0],good[1],good[2],`= ${m}\\ln(${lin(A)}) - \\ln(${n}x) - ${k}\\ln(${lin(B)})`]; why=`The power rule gives $\\ln(x^{${n}}) = ${n}\\ln(x)$, not $\\ln(${n}x)$.`; } }
          return wrap(`Let $f(x) = ${fT}$. Use properties of logarithms to write $\\ln(f(x))$ as a sum and difference of logarithms.`,{good,badLines:bad,at,why,okWhy:"Quotient rule, product rule inside a bracket, then the power rule with the minus sign distributed."});
        }
        // Left Riemann Sum for ln(b)
        const [b,n]=R.pick([[2,2],[3,2],[2,3],[3,3],[4,3],[5,4],[3,4],[2,4]]);
        const build=mode=>{ // mode: null (correct), "integrand", "dt", "right", "heights", "arith"
          const width = mode==="dt"?F(b,n):F(b-1,n);
          const ts=[]; for(let i=0;i<=n;i++) ts.push(Fadd([1,1],F(i*width[0],width[1])));
          const idx=mode==="right"?[...Array(n).keys()].map(i=>i+1):[...Array(n).keys()];
          const h=t=>(mode==="integrand"||mode==="heights")?t:F(t[1],t[0]);
          const terms=idx.map(i=>{ const hh=h(ts[i]); return F(hh[0]*width[0],hh[1]*width[1]); });
          let sum=[0,1]; terms.forEach(t=>sum=Fadd(sum,t));
          let sumT=Ft(sum);
          if(mode==="arith"){ const num=terms.reduce((s,t)=>s+t[0],0), den=terms.reduce((s,t)=>s+t[1],0); sumT=Ft(F(num,den)); }
          const L1=mode==="integrand"?`\\ln(${b}) = \\int_1^{${b}} t\\,dt,\\ \\text{ so } g(t) = t,\\ a = 1,\\ b = ${b}`:`\\ln(${b}) = \\int_1^{${b}} \\frac{1}{t}\\,dt,\\ \\text{ so } g(t) = \\frac{1}{t},\\ a = 1,\\ b = ${b}`;
          const L2=mode==="dt"?`\\Delta t = \\frac{b-a}{n} = \\frac{${b}}{${n}},\\quad t_i = 1 + i\\cdot ${Ft(width)}`:`\\Delta t = \\frac{b-a}{n} = \\frac{${b}-1}{${n}} = ${Ft(width)},\\quad t_i = 1 + i\\cdot ${Ft(width)}`;
          const L3=`\\ln(${b}) \\approx `+idx.map(i=>`g(t_${i})\\Delta t`).join(" + ");
          const hT=t=>(mode==="integrand"||mode==="heights")?Ft(t):(t[1]===1?`\\frac{1}{${t[0]}}`:`\\frac{1}{${t[0]}/${t[1]}}`);
          const L4=`= `+idx.map(i=>`${hT(ts[i])}\\cdot ${Ft(width)}`).join(" + ");
          const L5=`= `+terms.map(Ft).join(" + ")+` = ${sumT}`;
          return [L1,L2,L3,L4,L5];
        };
        const mode=R.pick(["integrand","dt","right","heights","arith"]);
        const at={integrand:1,dt:2,right:3,heights:4,arith:5}[mode];
        const why={integrand:"The definition is $\\ln(x) = \\int_1^x\\frac{1}{t}\\,dt$. The integrand is $\\frac1t$, not $t$.",
          dt:"$\\Delta t = \\frac{b-a}{n}$ with $a=1$, so the top should be $"+b+"-1$.",
          right:"A left sum uses $t_0$ to $t_{"+(n-1)+"}$. This line uses the right endpoints $t_1$ to $t_{"+n+"}$.",
          heights:"The heights are $g(t_i)=\\frac{1}{t_i}$. This line multiplies $t_i$ itself by $\\Delta t$.",
          arith:"The fractions were added wrongly: you cannot add the tops and add the bottoms. Use a common denominator."}[mode];
        return wrap(`Approximate $\\ln(${b})$ using the Left Riemann Sum Approximation with $n=${n}$ subdivisions.`,{good:build(null),badLines:build(mode),at,why,okWhy:"The setup, the left endpoints, the heights $\\frac{1}{t_i}$ and the arithmetic are all right."});
      }}
  ],
  exam:[
    {id:"L10.q1", ref:"p. 3", multi:true, q:"Assume $a>1$, $x>0$ and $y>0$. Select all of the valid properties.", opts:[
      ["$\\log_a\\left(\\frac{x}{y}\\right) = \\log_a(x) - \\log_a(y)$",1,"Quotient rule (p. 3)."],
      ["$\\log_a(x)\\log_a(y) = \\log_a(x+y)$",0,"No rule turns a product of logs into anything simple. Try $a=10$, $x=y=10$: $1\\cdot 1 \\ne \\log_{10}(20)$."],
      ["$a^{\\log_a(x)} = x$",1,"$\\log_a$ undoes $a^x$ (p. 3)."],
      ["$(a^x)^y = a^{x+y}$",0,"Power of a power multiplies: $(a^x)^y = a^{xy}$ (p. 2)."],
      ["$\\log_a(x^3) = 3\\log_a(x)$",1,"Power rule with $y=3$ (p. 3)."]]},
    {id:"L10.q2", ref:"p. 4", q:"What does $e^{3\\ln(2)}$ simplify to?", opts:[
      ["$8$",1,"$3\\ln(2) = \\ln(2^3) = \\ln(8)$, and $e^{\\ln(8)} = 8$."],
      ["$6$",0,"That treats $e^{3\\ln(2)}$ as $3\\cdot 2$. Move the 3 inside the log first."],
      ["$e^6$",0,"$e^{\\ln}$ cancels; there is no $e$ left."],
      ["$3\\ln(2)$",0,"That is the exponent, not the value."]]},
    {id:"L10.q3", ref:"p. 2", q:"$\\frac{d}{dx}\\,7^x = $", opts:[
      ["$7^x\\ln(7)$",1,"From the table on p. 2: $\\frac{d}{dx}a^x = a^x\\ln(a)$."],
      ["$x\\,7^{x-1}$",0,"That is the power rule, which is for $x^n$, not $a^x$."],
      ["$7^x$",0,"Only $e^x$ is its own derivative, because $\\ln(e)=1$."],
      ["$\\frac{7^x}{\\ln(7)}$",0,"That is the antiderivative."]]},
    {id:"L10.q4", ref:"p. 2", q:"Which answer to $\\int 4^x\\,dx$ would get full marks?", opts:[
      ["$\\frac{4^x}{\\ln(4)} + C$",1,"From the table on p. 2, with the constant."],
      ["$\\frac{4^x}{\\ln(4)}$",0,"Missing $+C$. An indefinite integral is a whole family of functions."],
      ["$4^x\\ln(4) + C$",0,"That is the derivative of $4^x$, plus $C$."],
      ["$\\frac{4^{x+1}}{x+1} + C$",0,"That is the power rule for integrals, which is for $x^n$."]]},
    {id:"L10.q5", ref:"p. 3", q:"True or false: if $0<x<1$, then $\\ln(x)<0$.", opts:[
      ["True",1,"$\\ln(x)=y$ means $x=e^y$, and $e^y<1$ only when $y<0$. In the area picture, the integral from 1 back to $x$ is negative."],
      ["False",0,"Try $x=\\frac1e$: $\\ln\\left(\\frac1e\\right) = -1$."]]},
    {id:"L10.q6", ref:"pp. 5 to 6", q:"Using $\\ln(x)=\\int_1^x\\frac1t\\,dt$, the Left Riemann Sum with $n=2$ subdivisions gives which estimate of $\\ln(2)$?", opts:[
      ["$\\frac12+\\frac13 = \\frac56$",1,"$\\Delta t=\\frac12$, $t_0=1$, $t_1=\\frac32$: $\\frac11\\cdot\\frac12 + \\frac{1}{3/2}\\cdot\\frac12$."],
      ["$\\frac13+\\frac14 = \\frac{7}{12}$",0,"That uses the right endpoints $t_1=\\frac32$ and $t_2=2$."],
      ["$1\\cdot\\frac12+\\frac32\\cdot\\frac12 = \\frac54$",0,"The heights are $\\frac{1}{t_i}$, not $t_i$."],
      ["$\\frac{1}{2}\\left(\\ln(1)+\\ln\\left(\\frac32\\right)\\right)$",0,"The integrand is $\\frac1t$, not $\\ln(t)$."]]},
    {id:"L10.q7", ref:"p. 4", keep:true, q:"The answer below would not get a perfect score. Select the first line with a mistake.<br>Problem: Let $f(x) = \\frac{x^3(x+4)}{(x-2)^2}$. Write $\\ln(f(x))$ as a sum and difference of logarithms.<br>Answer:$$\\ln(f(x)) = \\ln\\left(\\frac{x^3(x+4)}{(x-2)^2}\\right)\\qquad(1)$$$$= \\ln(x^3(x+4)) - \\ln((x-2)^2)\\qquad(2)$$$$= \\ln(x^3)\\ln(x+4) - \\ln((x-2)^2)\\qquad(3)$$$$= 3\\ln(x)\\ln(x+4) - 2\\ln(x-2)\\qquad(4)$$", opts:[
      ["(1)",0,"Taking $\\ln$ of both sides is fine."],
      ["(2)",0,"Quotient rule, used correctly."],
      ["(3)",1,"The log of a product is a sum: $\\ln(x^3(x+4)) = \\ln(x^3) + \\ln(x+4)$."],
      ["(4)",0,"This follows from (3), but (3) was already wrong."]]},
    {id:"L10.q8", ref:"p. 3", multi:true, q:"For $a>1$, select all of the statements that are true about $y = \\log_a(x)$.", opts:[
      ["It is always increasing.",1,"Listed on p. 3."],
      ["It is always concave down.",1,"Listed on p. 3."],
      ["Its domain is $(0,\\infty)$.",1,"You can only take the log of a positive number."],
      ["Its graph passes through $(0,1)$.",0,"That is $y=a^x$. The log passes through $(1,0)$ because $\\log_a(1)=0$."],
      ["As $x\\to 0^+$, $\\log_a(x)\\to 0$.",0,"It goes to $-\\infty$ (p. 3)."]]},
    {id:"L10.q9", ref:"p. 3", keep:true, q:"Is the provided answer correct?<br>Problem: Find all $x$ such that $\\ln(x) + \\ln(x+3) = \\ln(4)$.<br>Answer: $\\ln(x(x+3)) = \\ln(4)$, so $x^2+3x-4=0$, so $(x+4)(x-1)=0$. The solutions are $x=1$ and $x=-4$.", opts:[
      ["No, the solution is not correct.",1,"$x=-4$ is not allowed: $\\ln(-4)$ is undefined. The only solution is $x=1$."],
      ["Yes, the solution is correct.",0,"Check each answer in the original equation. $\\ln(x)$ needs $x>0$."]]},
    {id:"L10.q10", ref:"p. 3", q:"$\\log_2(12) - \\log_2(3) = $", opts:[
      ["$2$",1,"$\\log_2\\left(\\frac{12}{3}\\right) = \\log_2(4) = 2$."],
      ["$\\log_2(9)$",0,"Subtracting logs divides the inputs; it does not subtract them."],
      ["$\\frac{\\log_2(12)}{\\log_2(3)}$",0,"Subtracting logs is not dividing logs."],
      ["$4$",0,"$\\frac{12}{3}=4$, but the answer is $\\log_2(4)$."]]},
    {id:"L10.q11", ref:"p. 2", q:"Why is $e = 2.71828\\ldots$ the special base in calculus?", opts:[
      ["The graph of $y=e^x$ has slope exactly 1 at $x=0$.",1,"That is how $e$ is chosen (p. 2), and it makes $\\frac{d}{dx}e^x = e^x$."],
      ["It is the only base where $a^x$ is always increasing.",0,"Every base $a>1$ gives an increasing function."],
      ["It is the only base with $a^0=1$.",0,"$a^0=1$ for every $a>0$."],
      ["It is the base where $a^x$ crosses the line $y=x$.",0,"$e^x$ never touches $y=x$; $e^x > x$ for every $x$."]]},
    {id:"L10.q12", ref:"p. 5", q:"True or false: from the definition $\\ln(x) = \\int_1^x\\frac1t\\,dt$, we get $\\ln(1)=0$.", opts:[
      ["True",1,"$\\int_1^1\\frac1t\\,dt = 0$: there is no width, so no area."],
      ["False",0,"An integral whose limits are equal is always 0."]]}
  ],
  steps:[
    {type:"read", title:"Exponential functions", body:`<p>In $x^2$ the variable is in the base. In $2^x$ it is in the exponent. That second kind is an exponential function.</p><div class="box def"><b class="t">Definition (p. 1)</b>For $a>0$, a function of the form $f(x) = a^x$ is called an exponential function.</div><p>For $a>1$ the graph of $y=a^x$ (p. 1):</p><ul><li>is always increasing and always concave up,</li><li>grows very slowly for $x<0$ and very fast for $x>0$,</li><li>goes to $\\infty$ as $x\\to\\infty$ and to $0$ as $x\\to-\\infty$,</li><li>has range $(0,\\infty)$, so $a^x$ is never 0 or negative.</li></ul><p>The exponent properties, for $a>0$ and $b>0$ (p. 2):</p>$$a^xa^y=a^{x+y},\\quad \\frac{a^x}{a^y}=a^{x-y},\\quad (a^x)^y=a^{xy},\\quad (ab)^x=a^xb^x,\\quad a^0=1$$`, ref:"pp. 1 to 2"},
    {type:"explore", title:"Why the base e", fig:"expbase", body:`<p>One base makes the calculus cleanest: the base whose graph has slope $m=1$ at $x=0$. That base is $e=2.71828\\ldots$, called Euler's number. The natural exponential function is $\\exp(x)=e^x$ (p. 2).</p><p><b>Try it.</b> Move the base slider and watch the dashed tangent at $x=0$. Find the base where its slope reads about 1.000, then press a = e to check. Now drag the point along the curve. Whatever base you pick, slope ÷ height stays the same number, $\\ln(a)$.</p>`, ref:"p. 2"},
    {type:"read", title:"The derivative and integral of $a^x$", body:`<p>The figure showed that the slope of $a^x$ is always its height times the same number, $\\ln(a)$. That gives the two new things to memorize (p. 2):</p>$$\\frac{d}{dx}a^x = a^x\\ln(a) \\qquad\\qquad \\int a^x\\,dx = \\frac{a^x}{\\ln(a)} + C$$<p>With $a=e$, $\\ln(e)=1$, so $\\frac{d}{dx}e^x=e^x$, as you already knew.</p><div class="box"><b class="t">Examples (p. 2)</b>$f(x)=4^x$ gives $f'(x)=4^x\\ln(4)$.<br>$\\int 2^x\\,dx = \\frac{2^x}{\\ln(2)}+C$.<br>Exercise (p. 3): $y'=3^x$ has solutions $y = \\frac{3^x}{\\ln(3)}+C$.</div><div class="box warn"><b class="t">Watch for this</b>The power rule does not apply: $\\frac{d}{dx}5^x \\ne x\\,5^{x-1}$. The power rule is for a variable base and a fixed exponent. Here the base is fixed and the exponent varies.</div>`, ref:"pp. 2 to 3"},
    {type:"try", title:"Your turn: derivatives of $a^x$", gen:"L10.g.dax"},
    {type:"read", title:"Logarithms", body:`<p>$\\log_a(x)$ answers one question: what power of $a$ gives $x$? Since $2^3=8$, $\\log_2(8)=3$.</p><div class="box def"><b class="t">Definition (p. 3)</b>For any $a>1$, $\\log_a(x) = y$ if and only if $x = a^y$. With $a=e$ it is the natural logarithm: $\\ln(x)=\\log_e(x)$.</div><p>Logarithms can be defined for $0<a<1$ too, but this course sticks to $a>1$, and mostly to $\\ln$ (p. 3).</p><p>For $a>1$ the graph of $y=\\log_a(x)$ (p. 3):</p><ul><li>is always increasing and always concave down,</li><li>grows very quickly for $x<1$ and very slowly for $x>1$,</li><li>goes to $\\infty$ as $x\\to\\infty$ and to $-\\infty$ as $x\\to0^+$,</li><li>has domain $(0,\\infty)$, and $\\log_a(x)<0$ when $0<x<1$.</li></ul>`, ref:"p. 3"},
    {type:"explore", title:"Log and exponential are mirror images", fig:"loginv", body:`<p>$\\log_a$ undoes $a^x$, so they are inverse functions (Lecture 9). Their graphs are reflections of each other across $y=x$, and the domain and range swap: $a^x$ has range $(0,\\infty)$, so $\\log_a(x)$ has domain $(0,\\infty)$.</p><p><b>Try it.</b> Drag the point to $x=1$. It sits at $(1,a)$, and its mirror is $(a,1)$, so $\\log_a(a)=1$. Drag it to $x=0$: the mirror lands on $(1,0)$, so $\\log_a(1)=0$. Then move the base slider and watch both curves change together.</p>`, ref:"p. 3"},
    {type:"read", title:"Logarithm properties", body:`<div class="box def"><b class="t">Logarithm properties (p. 3)</b>For $a>1$ and $x>0$, $y>0$:$$a^{\\log_a(x)}=x,\\qquad \\log_a(a^y)=y,\\qquad \\log_a(1)=0$$$$\\log_a(xy)=\\log_a(x)+\\log_a(y),\\qquad \\log_a\\!\\left(\\frac{x}{y}\\right)=\\log_a(x)-\\log_a(y),\\qquad \\log_a(x^y)=y\\log_a(x)$$</div><p class="muted small">The box in the notes says "for $a>1$ and $b>1$". There is no $b$ in it; the conditions above are the ones that matter. See the flag for p. 3.</p><p>The last three are what make logs useful (p. 4). They turn multiplication into addition, division into subtraction, and powers into multiplication.</p><div class="box"><b class="t">Examples (p. 4)</b>$\\ln(e^{x^2}) = x^2$<br>$e^{\\ln(2x)} = 2x$<br>$e^{3\\ln(x)} = e^{\\ln(x^3)} = x^3$</div><div class="box warn"><b class="t">Watch for this</b>$e^{\\ln(u)}=u$ only works with nothing in front of the $\\ln$. Move a coefficient inside first: $3\\ln(x)=\\ln(x^3)$. And there is no rule for $\\log_a(x+y)$.</div>`, ref:"pp. 3 to 4"},
    {type:"mcq", title:"Check yourself", q:"For $x>0$, $e^{2\\ln(x)+\\ln(4)}$ simplifies to", opts:[["$4x^2$",true,"$2\\ln(x)+\\ln(4) = \\ln(x^2)+\\ln(4) = \\ln(4x^2)$, then $e^{\\ln(4x^2)}=4x^2$."],["$2x+4$",false,"$e^{2\\ln(x)}$ is not $2x$: the 2 goes inside as a power."],["$x^2+4$",false,"A sum of logs is the log of a product, not of a sum."],["$8x$",false,"Coefficients in front of $\\ln$ become powers, not factors."]]},
    {type:"mcq", title:"Which properties are real?", multi:true, q:"Assume $a>1$, $x>0$, $y>0$. Select all of the valid properties.", opts:[["$\\log_a(x^5) = 5\\log_a(x)$",true,"Power rule."],["$\\log_a(x+y) = \\log_a(x)+\\log_a(y)$",false,"There is no rule for the log of a sum. The product rule is $\\log_a(xy)$."],["$e^{x}e^{y} = e^{x+y}$",true,"Exponent property with $a=e$."],["$\\frac{\\log_a(x)}{\\log_a(y)} = \\log_a(x-y)$",false,"Not a property. The quotient rule is $\\log_a\\left(\\frac xy\\right) = \\log_a(x)-\\log_a(y)$."]],
      after:"Quiz questions like this mix real properties with ones that look right. Test a doubtful one with numbers: $\\log_{10}(10+10) \\approx 1.30$, but $\\log_{10}(10)+\\log_{10}(10)=2$."},
    {type:"example", title:"Expand $\\ln(f(x))$", ex:{q:"Let $f(x)=\\dfrac{(x+2)^2(x-1)}{x(x+3)^{1/2}}$. Write $\\ln(f(x))$ as a sum and difference of logarithms.", ref:"p. 4",
      steps:[{t:"$\\ln(f(x)) = \\ln\\left(\\frac{(x+2)^2(x-1)}{x(x+3)^{1/2}}\\right)$",why:"Take $\\ln$ of both sides."},
        {t:"$= \\ln((x+2)^2(x-1)) - \\ln(x(x+3)^{1/2})$",why:"Quotient rule: top minus bottom."},
        {t:"$= \\ln((x+2)^2) + \\ln(x-1) - \\left[\\ln(x) + \\ln((x+3)^{1/2})\\right]$",why:"Product rule on each part. The bracket keeps the minus sign on both bottom logs."},
        {t:"$= 2\\ln(x+2) + \\ln(x-1) - \\ln(x) - \\frac12\\ln(x+3)$",why:"Power rule brings each exponent down in front; then distribute the minus sign."}],
      ans:"$\\ln(f(x)) = 2\\ln(x+2)+\\ln(x-1)-\\ln(x)-\\frac12\\ln(x+3)$, valid where every factor is positive ($x>1$)."}},
    {type:"try", title:"Your turn: expand", gen:"L10.g.expand"},
    {type:"read", title:"The original definition of ln", body:`<p>Logarithms were invented decades before $e$, so historically $e^x$ is the inverse of $\\ln(x)$, not the other way round (p. 5). The first definition used the area under the hyperbola $y=\\frac1t$:</p><div class="box def"><b class="t">Definition (p. 5)</b>For any $x>0$, $$\\ln(x) = \\int_1^x\\frac{1}{t}\\,dt$$</div><p>This is an integral function, like the ones in Lecture 8. Some facts fall straight out of it:</p><ul><li>$\\ln(1)=\\int_1^1\\frac1t\\,dt = 0$.</li><li>For $x>1$ the area is positive, so $\\ln(x)>0$. For $0<x<1$ the integral runs backwards, so $\\ln(x)<0$.</li><li>Since $\\frac1t>0$, adding more area always makes $\\ln(x)$ bigger: $\\ln$ is increasing.</li></ul><p>It also means you can estimate $\\ln$ with a Left Riemann Sum. That is a quiz favourite.</p>`, ref:"p. 5"},
    {type:"explore", title:"ln(x) as an area", fig:"lnarea", body:`<p>The shaded area is $\\ln(x)$, and the bottom graph plots that area against $x$.</p><p><b>Try it.</b> Drag $x$ to 3 and set $n=3$. The left sum is $\\frac{142}{105}\\approx1.3524$, but $\\ln(3)\\approx1.0986$. It is too big because $\\frac1t$ is decreasing, so each rectangle's left edge is its tallest point. Raise $n$ to 12 and watch the error shrink. Then drag $x$ below 1 and see the area count as negative.</p>`, ref:"pp. 5 to 6"},
    {type:"example", title:"Approximate ln(3) with a Left Riemann Sum", ex:{q:"Approximate $\\ln(3)$ using the Left Riemann Sum Approximation with $n=3$ subdivisions.", ref:"pp. 5 to 6",
      steps:[{t:"By definition, $\\ln(3)=\\int_1^3\\frac1t\\,dt$. So $g(t)=\\frac1t$, $a=1$, $b=3$.",why:"Turn the log into an integral. Writing $g(t)$ out matters: graders take marks off for using a function you never defined."},
        {t:"$\\Delta t = \\frac{b-a}{n} = \\frac{3-1}{3} = \\frac23$",why:"Width of each rectangle."},
        {t:"$t_i = a+i\\Delta t = 1+i\\cdot\\frac23$, for $0\\le i\\le 3$",why:"The partition points."},
        {t:"$t_0 = 1,\\quad t_1 = \\frac53,\\quad t_2=\\frac73$",why:"A left sum uses $t_0$, $t_1$, $t_2$. It stops before $t_3=3$."},
        {t:"$\\ln(3)\\approx g(t_0)\\Delta t+g(t_1)\\Delta t+g(t_2)\\Delta t = g(1)\\Delta t+g\\left(\\frac53\\right)\\Delta t+g\\left(\\frac73\\right)\\Delta t$",why:"Height times width for each rectangle."},
        {t:"$= \\frac11\\cdot\\frac23+\\frac{1}{5/3}\\cdot\\frac23+\\frac{1}{7/3}\\cdot\\frac23 = \\frac23+\\frac35\\cdot\\frac23+\\frac37\\cdot\\frac23$",why:"$g(t)=\\frac1t$, and $\\frac{1}{5/3}=\\frac35$."},
        {t:"$= \\frac23+\\frac25+\\frac27 = \\frac{70}{105}+\\frac{42}{105}+\\frac{30}{105} = \\frac{142}{105}$",why:"Common denominator 105."}],
      ans:"$\\ln(3)\\approx\\frac{142}{105}\\approx 1.352$"}},
    {type:"try", title:"Your turn: a Left Riemann Sum for ln", gen:"L10.g.lrs-ln"},
    {type:"formulas", title:"Lecture 10 formulas"}
  ]
});
})();
