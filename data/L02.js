/* Lecture 2 (Fri Sept 11): Tangent line approximation, differential approximation. Sections 1.1.3, 1.1.4. Notes: 5 pages. */
(function(){
const M=M127;
/* ---- small helpers (kept inside this file's scope) ---- */
const Q=(n,d=1)=>{ if(d<0){ n=-n; d=-d; } const g=M.gcd(n,d)||1; return {n:n/g,d:d/g}; };
const qadd=(a,b)=>Q(a.n*b.d+b.n*a.d,a.d*b.d), qmul=(a,b)=>Q(a.n*b.n,a.d*b.d);
const qT=q=>M.frac(q.n,q.d), qA=q=>M.fracA(q.n,q.d), qV=q=>q.n/q.d;
/* value object used to print lines: v = number, abs = TeX of |v|, tex = signed TeX, asc = ascii */
const V=q=>({v:qV(q),abs:M.frac(Math.abs(q.n),q.d),tex:qT(q),asc:qA(q)});
const S=(v,abs,asc)=>({v,abs,tex:(v<0?"-":"")+abs,asc});
const co=c=>c===1?"":c===-1?"-":String(c);
const xm=a=>a===0?"x":a>0?`x - ${a}`:`x + ${-a}`;        // TeX of x - a for an integer a
const xp=k=>k===0?"x":k>0?`x + ${k}`:`x - ${-k}`;         // TeX of x + k
const dec=v=>String(+v.toFixed(6));                        // decimal for display
const nd=(f,a)=>{ const h=1e-6*Math.max(1,Math.abs(a)); return (f(a+h)-f(a-h))/(2*h); };
const fx=v=>`(${v.toFixed(12)})`;
/* y = c + m(x - a), with xa = TeX of "x - a" (or "x" when a = 0) */
function lineTeX(c,m,xa){
  const br = xa==="x" ? "x" : (xa.includes("\\frac")?`\\left(${xa}\\right)`:`(${xa})`);
  const mp = (m.abs==="1"?"":m.abs)+br;
  if(m.v===0) return `y = ${c.tex}`;
  if(c.v===0) return `y = ${m.v<0?"-":""}${mp}`;
  return `y = ${c.tex} ${m.v<0?"-":"+"} ${mp}`;
}
const lineA=(c,m,aA)=>`y = ${c.asc} + (${m.asc})*(x - (${aA}))`;
/* evaluate a polynomial (coefs from highest power) at an integer, shown with brackets */
function evalPolyTeX(coefs,a){
  const n=coefs.length-1; const out=[];
  coefs.forEach((c,i)=>{ if(c===0) return; const k=n-i; const A=Math.abs(c);
    const body = k===0 ? String(A) : (A===1?"":A)+(k===1?`(${a})`:`(${a})^{${k}}`);
    out.push(out.length? ` ${c<0?"-":"+"} ${body}` : (c<0?"-":"")+body); });
  return out.join("")||"0";
}
const evalPoly=(coefs,a)=>coefs.reduce((s,c)=>s*a+c,0);
const hasY=s=>/^\s*y\s*=/.test(s);
const lineSpec=(ans,c,m,aNum,f)=>({answer:ans,vars:["x"],domain:[-2,2],form:hasY,
  formWhy:"Same line, but write it as an equation that starts with y = (Warning, p. 3).",placeholder:"e.g. y = 3 + 2(x - 1)",
  help:"Start with y =. Point-slope form is fine; it is checked by value."});

/* ---- function bank for tangent lines ---- */
function tanBank(R,d){
  if(d===1){
    const cubic=R.pick([false,false,true]);
    const a=R.nz(-3,3);
    let coefs, dco;
    if(!cubic){ const p=R.nz(-3,3), q=R.int(-6,6), r=R.int(-6,6); coefs=[p,q,r]; dco=[2*p,q]; }
    else { const s=R.pick([1,-1]), q=R.nz(-5,5), r=R.int(-5,5); coefs=[s,0,q,r]; dco=[3*s,0,q]; }
    const c=evalPoly(coefs,a), m=evalPoly(dco,a);
    return {fT:M.poly(coefs), f:x=>evalPoly(coefs,x), dT:M.poly(dco), aT:String(a), aA:String(a), a, xa:xm(a),
      c:V(Q(c)), m:V(Q(m)), rule:"Power rule on each term.",
      vals:[`$f(${a}) = ${evalPolyTeX(coefs,a)} = ${c}$`,`$f'(${a}) = ${evalPolyTeX(dco,a)} = ${m}$`]};
  }
  if(d===2){
    const kind=R.pick(["sqrt","recip","exp","root"]);
    if(kind==="sqrt"){ const k=R.int(-3,5), s=R.int(1,4), a=s*s-k; const inside=xp(k);
      return {fT:k===0?"\\sqrt{x}":`\\sqrt{${inside}}`, f:x=>Math.sqrt(x+k), dT:`\\frac{1}{2\\sqrt{${inside}}}`, aT:String(a), aA:String(a), a, xa:xm(a),
        c:V(Q(s)), m:V(Q(1,2*s)), rule:"Write $\\sqrt{"+inside+"} = ("+inside+")^{1/2}$ and use the power rule with the chain rule (the inside has derivative 1).",
        vals:[`$f(${a}) = \\sqrt{${a+k}} = ${s}$`,`$f'(${a}) = \\frac{1}{2\\sqrt{${a+k}}} = ${M.frac(1,2*s)}$`]}; }
    if(kind==="recip"){ const n=R.pick([1,2]), a=R.pick([1,2,-1,-2,3]);
      const fT=n===1?"\\frac{1}{x}":"\\frac{1}{x^2}", dT=n===1?"-\\frac{1}{x^2}":"-\\frac{2}{x^3}";
      const c=Q(1,Math.pow(a,n)), m=Q(-n,Math.pow(a,n+1));
      return {fT, f:x=>1/Math.pow(x,n), dT, aT:String(a), aA:String(a), a, xa:xm(a), c:V(c), m:V(m),
        rule:`Write $f(x) = x^{${-n}}$, so $f'(x) = ${-n}x^{${-n-1}}$.`,
        vals:[`$f(${a}) = \\frac{1}{(${a})^{${n}}} = ${qT(c)}$`,`$f'(${a}) = -\\frac{${n}}{(${a})^{${n+1}}} = ${qT(m)}$`]}; }
    if(kind==="exp"){ const A=R.nz(-4,4), k=R.nz(-3,3);
      return {fT:`${co(A)}e^{${co(k)}x}`, f:x=>A*Math.exp(k*x), dT:`${co(A*k)}e^{${co(k)}x}`, aT:"0", aA:"0", a:0, xa:"x", c:V(Q(A)), m:V(Q(A*k)),
        rule:"Chain rule: the derivative of $e^{"+co(k)+"x}$ is $"+co(k)+"e^{"+co(k)+"x}$.",
        vals:[`$f(0) = ${co(A)}e^{0} = ${A}$`,`$f'(0) = ${co(A*k)}e^{0} = ${A*k}$`]}; }
    const n=R.pick([2,3,4,5]);
    return {fT:n===2?"\\sqrt{1+x}":`(1+x)^{1/${n}}`, f:x=>Math.pow(1+x,1/n), dT:`\\frac{1}{${n}}(1+x)^{-\\frac{${n-1}}{${n}}}`, aT:"0", aA:"0", a:0, xa:"x",
      c:V(Q(1)), m:V(Q(1,n)), rule:"Power rule: bring down $\\frac{1}{"+n+"}$ and subtract 1 from the power.",
      vals:[`$f(0) = 1^{1/${n}} = 1$`,`$f'(0) = \\frac{1}{${n}}(1)^{-\\frac{${n-1}}{${n}}} = \\frac{1}{${n}}$`]};
  }
  const kind=R.pick(["trig","trig","sqrtq","xexp","quot"]);
  if(kind==="trig"){
    const r3="\\frac{\\sqrt{3}}{2}", r2="\\frac{\\sqrt{2}}{2}", h="\\frac{1}{2}";
    const T=[["\\frac{\\pi}{6}","pi/6",Math.PI/6,S(.5,h,"1/2"),S(Math.sqrt(3)/2,r3,"sqrt(3)/2")],
             ["\\frac{\\pi}{4}","pi/4",Math.PI/4,S(Math.SQRT1_2,r2,"sqrt(2)/2"),S(Math.SQRT1_2,r2,"sqrt(2)/2")],
             ["\\frac{\\pi}{3}","pi/3",Math.PI/3,S(Math.sqrt(3)/2,r3,"sqrt(3)/2"),S(.5,h,"1/2")],
             ["\\frac{\\pi}{2}","pi/2",Math.PI/2,S(1,"1","1"),S(0,"0","0")],
             ["\\frac{2\\pi}{3}","2pi/3",2*Math.PI/3,S(Math.sqrt(3)/2,r3,"sqrt(3)/2"),S(-.5,h,"-1/2")],
             ["\\frac{3\\pi}{4}","3pi/4",3*Math.PI/4,S(Math.SQRT1_2,r2,"sqrt(2)/2"),S(-Math.SQRT1_2,r2,"-sqrt(2)/2")],
             ["\\pi","pi",Math.PI,S(0,"0","0"),S(-1,"1","-1")]];
    const [aT,aA,a,sn,cs]=R.pick(T); const isSin=R.pick([true,false]);
    const neg=o=>S(-o.v,o.abs,`-(${o.asc})`);
    const c=isSin?sn:cs, m=isSin?cs:neg(sn);
    return {fT:isSin?"\\sin(x)":"\\cos(x)", f:isSin?Math.sin:Math.cos, dT:isSin?"\\cos(x)":"-\\sin(x)", aT, aA, a, xa:`x - ${aT}`, c, m,
      rule:isSin?"From the derivative table (Lecture 1, p. 3).":"From the derivative table (Lecture 1, p. 3).",
      vals:[`$f\\left(${aT}\\right) = ${isSin?"\\sin":"\\cos"}\\left(${aT}\\right) = ${c.tex}$`,`$f'\\left(${aT}\\right) = ${isSin?"\\cos":"-\\sin"}\\left(${aT}\\right) = ${m.tex}$`]};
  }
  if(kind==="sqrtq"){ const [a,k,s]=R.pick([[4,9,5],[3,16,5],[2,5,3],[1,3,2],[2,12,4],[1,8,3],[-4,9,5],[-2,5,3],[-1,3,2]]);
    return {fT:`\\sqrt{x^2 + ${k}}`, f:x=>Math.sqrt(x*x+k), dT:`\\frac{x}{\\sqrt{x^2 + ${k}}}`, aT:String(a), aA:String(a), a, xa:xm(a), c:V(Q(s)), m:V(Q(a,s)),
      rule:`Chain rule: $\\frac{1}{2}(x^2+${k})^{-1/2}\\cdot 2x = \\frac{x}{\\sqrt{x^2+${k}}}$.`,
      vals:[`$f(${a}) = \\sqrt{${a*a} + ${k}} = \\sqrt{${s*s}} = ${s}$`,`$f'(${a}) = \\frac{${a}}{\\sqrt{${s*s}}} = ${M.frac(a,s)}$`]}; }
  if(kind==="xexp"){ const n=R.int(1,3);
    const fT=n===1?"xe^{x}":`x^{${n}}e^{x}`, dT=n===1?"e^{x} + xe^{x}":`${n}${n-1===1?"x":`x^{${n-1}}`}e^{x} + x^{${n}}e^{x}`;
    return {fT, f:x=>Math.pow(x,n)*Math.exp(x), dT, aT:"1", aA:"1", a:1, xa:"x - 1", c:S(Math.E,"e","e"), m:S((n+1)*Math.E,`${n+1}e`,`${n+1}*e`),
      rule:"Product rule: $(fg)' = f'g + fg'$.", vals:[`$f(1) = 1\\cdot e^{1} = e$`,`$f'(1) = ${n===1?"e + e":`${n}e + e`} = ${n+1}e$`]}; }
  const k=R.int(1,4), a=R.pick([0,1]);
  const c=Q(a,a+k), m=Q(k,(a+k)*(a+k));
  return {fT:`\\frac{x}{x + ${k}}`, f:x=>x/(x+k), dT:`\\frac{${k}}{(x + ${k})^2}`, aT:String(a), aA:String(a), a, xa:xm(a), c:V(c), m:V(m),
    rule:`Quotient rule: $\\frac{(1)(x+${k}) - x(1)}{(x+${k})^2} = \\frac{${k}}{(x+${k})^2}$.`,
    vals:[`$f(${a}) = \\frac{${a}}{${a+k}}${a===0?" = 0":""}$`,`$f'(${a}) = \\frac{${k}}{(${a+k})^2} = ${qT(m)}$`]};
}

M.lecture({
  id:"L02", n:2, date:"2026-09-11", added:"2026-10-21", unit:"u1", quiz:"Q2",
  title:"Tangent Line and Differential Approximations", sections:["1.1.3","1.1.4"], pages:5,
  summary:"Write lines in point-slope form, find the tangent line $y = f(a) + f'(a)(x-a)$, use it to approximate values near $a$, and approximate a change with $\\Delta y \\approx f'(a)\\Delta x$.",
  flags:[
    {ref:"p. 2", text:"The NOTE says to focus on the behaviour of the function around $(a, f(a))$, but the example right above it is a plain line through $(x_0, y_0) = (3, 2)$, with no function and no $a$. Read it as: keep the form that shows the point you were given, here $(3, 2)$. The $(a, f(a))$ notation only starts on p. 3 with tangent lines."}
  ],
  formulas:[
    {id:"L02.f.slope", name:"Slope as a ratio of changes", tex:"m = \\frac{\\Delta y}{\\Delta x} = \\frac{y - y_0}{x - x_0}", note:"$(x, y)$ is a generic point on the line and $(x_0, y_0)$ is a fixed point on it.", ref:"p. 1",
      blank:{tex:"m = \\frac{\\Delta y}{\\Delta x} = \\frac{\\boxed{\\,?\\,}}{x - x_0}", text:true, accept:["y - y_0","y-y_0","y - y0","y-y0","y - y_{0}"]}},
    {id:"L02.f.pointslope", name:"Point-slope form of a line", tex:"y = y_0 + m(x - x_0)", note:"The line with slope $m$ through the point $(x_0, y_0)$. This is the form we will always use. Do not simplify it.", ref:"p. 1",
      blank:{tex:"y = y_0 + \\boxed{\\,?\\,}", text:true, accept:["m(x - x_0)","m(x-x_0)","m(x - x0)","m(x-x0)","m*(x-x0)","m(x - x_{0})"]}},
    {id:"L02.f.tanline", name:"Equation of the tangent line", tex:"y = f(a) + f'(a)(x - a)", note:"The tangent line to $y = f(x)$ at $x = a$. It has slope $f'(a)$ and passes through $(a, f(a))$. Don't forget the $y =$.", ref:"p. 3",
      blank:{tex:"y = f(a) + \\boxed{\\,?\\,}(x - a)", text:true, accept:["f'(a)","f'(a) "]}},
    {id:"L02.f.linapprox", name:"Tangent line (linear) approximation", tex:"f(x) \\approx f(a) + f'(a)(x - a)", note:"when $x$ is close to $a$. Pick the $x$ that makes $f(x)$ equal to the value you want.", ref:"p. 4",
      blank:{tex:"f(x) \\approx \\boxed{\\,?\\,}", text:true, accept:["f(a)+f'(a)(x-a)","f(a) + f'(a)(x - a)","f(a)+f'(a)(x - a)","f(a) + f'(a)(x-a)"]}},
    {id:"L02.f.change", name:"Linear approximation, change form", tex:"f(x) - f(a) \\approx f'(a)(x - a)", note:"Subtract $f(a)$ from both sides of the tangent line approximation.", ref:"p. 5",
      blank:{tex:"f(x) - f(a) \\approx \\boxed{\\,?\\,}", text:true, accept:["f'(a)(x-a)","f'(a)(x - a)","f'(a)*(x-a)"]}},
    {id:"L02.f.diffapprox", name:"Differential approximation", tex:"\\Delta y \\approx f'(a)\\Delta x", note:"$\\Delta y = f(x) - f(a)$ is the change in the $y$-values and $\\Delta x = x - a$ is the change in the $x$-values. $a$ is the original $x$ value.", ref:"p. 5",
      blank:{tex:"\\Delta y \\approx \\boxed{\\,?\\,}", text:true, accept:["f'(a)Δx","f'(a) Δx","f'(a)*Δx","f'(a)\\Delta x","f'(a)Delta x","f'(a) Delta x","f'(a)(x-a)","f'(a)(x - a)"]}}
  ],
  glossary:[
    {id:"L02.t.pointslope", term:"Point-slope form", def:"$y = y_0 + m(x - x_0)$: the line with slope $m$ through $(x_0, y_0)$. It puts the focus on a point you choose instead of on the $y$-intercept.", ref:"p. 1"},
    {id:"L02.t.slope", term:"Slope", def:"Rise over run between any two points on a line: $m = \\frac{\\Delta y}{\\Delta x} = \\frac{y - y_0}{x - x_0}$.", ref:"p. 1"},
    {id:"L02.t.tangent", term:"Tangent line", def:"The line that touches $y = f(x)$ at $(a, f(a))$ with slope $f'(a)$. Its equation is $y = f(a) + f'(a)(x - a)$.", ref:"p. 3"},
    {id:"L02.t.linapprox", term:"Tangent line (linear) approximation", def:"Using the tangent line in place of the function near $a$: $f(x) \\approx f(a) + f'(a)(x - a)$ when $x$ is close to $a$.", ref:"p. 4"},
    {id:"L02.t.dx", term:"$\\Delta x$", def:"The change in $x$: new value minus original value, $\\Delta x = x - a$. It is negative when $x$ goes down (3 to 2.8 gives $\\Delta x = -0.2$).", ref:"p. 5"},
    {id:"L02.t.dy", term:"$\\Delta y$", def:"The change in the $y$-values: $\\Delta y = f(x) - f(a)$, new output minus original output.", ref:"p. 5"},
    {id:"L02.t.diffapprox", term:"Differential approximation", def:"$\\Delta y \\approx f'(a)\\Delta x$: the change in $y$ is about the slope at the original point times the change in $x$. Good when $\\Delta x$ is small.", ref:"p. 5"}
  ],
  figures:{
    pointslope:{title:"Point-slope form", cap:"<b>Fig. 2.1</b> The line $y = y_0 + m(x - x_0)$ through a point you choose. The same line also crosses the $y$-axis at $b$, but point-slope form keeps the focus on $(x_0, y_0)$. (Lecture 2, pp. 1 to 3)",
      build(host,{PLOT}){
        const G=PLOT.graph(host,{x:[-1,6],y:[-1,5],c:"var(--u1)",xlabel:"x",ylabel:"y",xstep:1,ystep:1});
        let x0=3, y0=2, m=-0.5;
        const ln=G.tangent(x0,y0,m,{cls:"tan"});
        const bd=G.dot(0,3.5,{r:4}); const bl=G.label(0,3.5,"b",{cls:"lblc",dx:8,dy:-6});
        const pl=G.label(x0,y0,"(x₀, y₀)",{cls:"lblc",dx:10,dy:-10});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        G.handle(x0,y0,{bounds:[0,5.5],label:"Point (x0, y0)",step:0.1,onMove:(x,y)=>{ x0=x; y0=y; draw(); }});
        PLOT.slider(ctl,{label:"slope m",min:-2,max:2,step:0.25,value:m,fmt:v=>v.toFixed(2),oninput:v=>{ m=v; draw(); }});
        const n=v=>(+v.toFixed(2)).toString().replace("-","−");
        function draw(){
          ln.at(x0,y0,m); const b=y0-m*x0; const show=b>=-1&&b<=5;
          bd.style.display=show?"":"none"; bl.style.display=show?"":"none"; if(show){ bd.set(0,b); bl.set(0,b); }
          pl.set(x0,y0);
          const xs=x0>=0?`x − ${n(x0)}`:`x + ${n(-x0)}`;
          ro.innerHTML=`point-slope: <b>y = ${n(y0)} ${m<0?"−":"+"} ${n(Math.abs(m))}(${xs})</b> &nbsp; same line as y = ${n(b)} ${m<0?"−":"+"} ${n(Math.abs(m))}x (focus on b)`;
        }
        draw();
      }},
    tanapprox:{title:"Tangent line approximation", cap:"<b>Fig. 2.2</b> Near $a$ the tangent line $y = f(a) + f'(a)(x - a)$ stays close to the curve, so $f(x) \\approx f(a) + f'(a)(x - a)$. Move $x$ away from $a$ and the gap grows. (Lecture 2, pp. 3 to 5)",
      build(host,{PLOT}){
        const F={
          q:{f:x=>Math.pow(x+3,0.25), df:x=>0.25*Math.pow(x+3,-0.75), a:-2, x:-1.9, view:{x:[-3.2,2.6],y:[-0.3,1.6]}, ba:[-2.7,2.2], bx:[-2.95,2.5], name:"(x+3)^(1/4)"},
          s:{f:x=>Math.sqrt(x+1), df:x=>0.5/Math.sqrt(x+1), a:8, x:7, view:{x:[-1.5,16],y:[-0.5,4.6]}, ba:[0,15], bx:[-0.9,15.5], name:"√(x+1)"},
          n:{f:Math.sin, df:Math.cos, a:Math.PI/3, x:1.3, view:{x:[-1,4],y:[-1.4,1.8]}, ba:[-0.8,3.8], bx:[-0.9,3.9], name:"sin(x)"}};
        const top=PLOT.controls(host); const box=document.createElement("div"); host.append(box); const ro=PLOT.readout(host);
        PLOT.seg(top,{label:"Function",items:[["q","(x+3)<sup>1/4</sup>, a = −2"],["s","√(x+1), a = 8"],["n","sin x, a = π/3"]],value:"q",onchange:k=>make(k)});
        function make(k){
          box.innerHTML=""; const D=F[k]; let a=D.a, x=D.x;
          const G=PLOT.graph(box,{x:D.view.x,y:D.view.y,c:"var(--u1)",xlabel:"x",ylabel:"y"});
          G.fn(D.f,{cls:"cv"});
          const tan=G.tangent(a,D.f(a),D.df(a),{cls:"tan dash"});
          const v1=G.line(x,0,x,1,{cls:"lt dash"});
          const pt=G.dot(x,D.f(x),{r:4}), pl=G.dot(x,0,{r:4,filled:true});
                    const P=G.handle(a,D.f(a),{f:D.f,bounds:D.ba,label:"Point of tangency a",clickToMove:false,onMove:v=>{ a=v; draw(); }});
          const X=G.handle(x,0,{axis:"x",bounds:D.bx,label:"x value",onMove:v=>{ x=v; draw(); }});
          function draw(){
            const fa=D.f(a), m=D.df(a), L=fa+m*(x-a), fv=D.f(x);
            tan.at(a,fa,m); v1.set(x,Math.min(0,fv,L),x,Math.max(0,fv,L)); pt.set(x,fv); pl.set(x,L);
            ro.innerHTML=`a = <b>${a.toFixed(2)}</b> &nbsp; x = <b>${x.toFixed(2)}</b> &nbsp; Δx = x − a = ${(x-a).toFixed(2)}<br>true f(x) = <b>${fv.toFixed(4)}</b> &nbsp; tangent line gives <b>${L.toFixed(4)}</b> &nbsp; error ${Math.abs(L-fv).toFixed(4)}`;
          }
          draw();
        }
        make("q");
      }},
    diffapprox:{title:"The differential approximation", cap:"<b>Fig. 2.3</b> $f(x) = x^3 + x + 3$. The true change $\\Delta y$ is the rise along the curve. The differential approximation $f'(a)\\Delta x$ is the rise along the tangent line. Smaller $\\Delta x$, smaller gap. (Lecture 2, p. 5)",
      build(host,{PLOT}){
        const f=x=>x*x*x+x+3, df=x=>3*x*x+1;
        const G=PLOT.graph(host,{x:[1.95,3.85],y:[8,62],c:"var(--u1)",xlabel:"x",ylabel:"y",xstep:0.5,ystep:10});
        G.fn(f,{cls:"cv"});
        let a=3, dx=-0.2;
        const tan=G.tangent(a,f(a),df(a),{cls:"tan dash"});
        const run=G.line(0,0,1,1,{cls:"lt dash"}), rt=G.line(0,0,1,1,{cls:"tan",layer:G.layer.top}), rc=G.line(0,0,1,1,{cls:"ln"});
        const q=G.dot(0,0,{r:4}), qt=G.dot(0,0,{r:3.5,filled:true});
        const l1=G.label(0,0,"Δy",{cls:"lbl",dx:8}), l2=G.label(0,0,"f′(a)Δx",{cls:"lblc",dx:-8,anchor:"end"});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        G.handle(a,f(a),{f,bounds:[2.6,3.2],snap:0.1,step:0.1,label:"Original x value a",clickToMove:false,onMove:v=>{ a=v; draw(); }});
        PLOT.slider(ctl,{label:"Δx",min:-0.6,max:0.6,step:0.05,value:dx,fmt:v=>v.toFixed(2),oninput:v=>{ dx=Math.abs(v)<1e-9?0.05:v; draw(); }});
        function draw(){
          const b=a+dx, fa=f(a), est=df(a)*dx, tru=f(b)-fa;
          tan.at(a,fa,df(a)); run.set(a,fa,b,fa); rc.set(b,fa,b,f(b)); rt.set(b,fa,b,fa+est);
          q.set(b,f(b)); qt.set(b,fa+est);
          l1.set(b,fa+tru/2); l2.set(b,fa+est/2);
          ro.innerHTML=`a = <b>${a.toFixed(1)}</b> &nbsp; Δx = <b>${dx.toFixed(2)}</b> &nbsp; f′(a) = ${df(a).toFixed(2)}<br>Δy ≈ f′(a)Δx = <b>${est.toFixed(3)}</b> &nbsp; true Δy = <b>${tru.toFixed(3)}</b> &nbsp; gap ${Math.abs(est-tru).toFixed(3)}`;
        }
        draw();
      }}
  },
  gens:[
    {id:"L02.g.pointslope", title:"Point-slope form", skill:"Write the point-slope equation of a line", ref:"pp. 1 to 3",
      gen(R,d){
        let x0=R.int(-4,4), y0=R.int(-5,5), m, extra=[];
        if(d===1) m=Q(R.nz(-5,5));
        else if(d===2) m=Q(R.nz(-5,5),R.pick([2,3,4,5]));
        else { let x1; do{ x1=R.int(-4,5); }while(x1===x0); const y1=R.int(-5,5); m=Q(y1-y0,x1-x0);
          extra=[`Slope first: $m = \\frac{\\Delta y}{\\Delta x} = \\frac{${y1} - (${y0})}{${x1} - (${x0})} = ${qT(m)}$.`];
          const P=`(${x0}, ${y0})`, P2=`(${x1}, ${y1})`;
          const ans=lineA(V(Q(y0)),V(m),String(x0));
          return {prompt:`Find the point-slope equation of the line through $${P}$ and $${P2}$. Use $${P}$ as the point.`,
            answer:lineSpec(ans), hint:"Find the slope $m = \\frac{y - y_0}{x - x_0}$ from the two points, then use $y = y_0 + m(x - x_0)$.",
            steps:[...extra,`Point-slope form: $y = y_0 + m(x - x_0)$ with $x_0 = ${x0}$, $y_0 = ${y0}$.`,`$${lineTeX(V(Q(y0)),V(m),xm(x0))}$`,`Do not simplify: the form shows the point $${P}$ (p. 2).`],
            answerTeX:`$${lineTeX(V(Q(y0)),V(m),xm(x0))}$`, verify:{expr:`${y0} + (${qV(m)})*(x - (${x0}))`}};
        }
        const ans=lineA(V(Q(y0)),V(m),String(x0)), tex=lineTeX(V(Q(y0)),V(m),xm(x0));
        return {prompt:`Find the point-slope equation of the line with slope $m = ${qT(m)}$ that passes through the point $(${x0}, ${y0})$.`,
          answer:lineSpec(ans), hint:"Point-slope form: $y = y_0 + m(x - x_0)$. Watch the signs when $x_0$ is negative.",
          steps:[`$y = y_0 + m(x - x_0)$ with $m = ${qT(m)}$, $x_0 = ${x0}$, $y_0 = ${y0}$.`,`$y = ${y0} + (${qT(m)})(x - (${x0}))$`,`Tidy the signs: $${tex}$. Leave it in this form (p. 2).`],
          answerTeX:`$${tex}$`, verify:{expr:`${y0} + (${qV(m)})*(x - (${x0}))`}};
      }},
    {id:"L02.g.tanline", title:"Equation of the tangent line", skill:"Find $y = f(a) + f'(a)(x - a)$", ref:"p. 3",
      gen(R,d){
        const B=tanBank(R,d); const tex=lineTeX(B.c,B.m,B.xa);
        const fa=B.f(B.a), sl=nd(B.f,B.a);
        return {prompt:`Find the equation of the tangent line to $f(x) = ${B.fT}$ at $a = ${B.aT}$.`,
          answer:lineSpec(lineA(B.c,B.m,B.aA)),
          hint:"Find $f'(x)$, then $f(a)$ and $f'(a)$, and put them in $y = f(a) + f'(a)(x - a)$. Keep the $y =$.",
          steps:[`The tangent line is $y = f(a) + f'(a)(x - a)$ with $a = ${B.aT}$.`,`$f'(x) = ${B.dT}$. ${B.rule}`,`${B.vals[0]} and ${B.vals[1]}.`,`So the tangent line is $${tex}$.`],
          answerTeX:`$${tex}$`, verify:{expr:`${fx(fa)} + ${fx(sl)}*(x - ${fx(B.a)})`}};
      }},
    {id:"L02.g.approx", title:"Approximate a value with the tangent line", skill:"Choose the right $x$ and use $f(x) \\approx f(a) + f'(a)(x - a)$", ref:"pp. 4 to 5",
      gen(R,d){
        const H=[10,20,-10,-20,5,-5];
        if(d===1){
          if(R.pick([true,false])){ // tangent line given, plug in
            const a=R.int(-2,4), c=R.int(-4,6), m=Q(R.nz(-4,4),R.pick([1,2,4,5])), hn=R.pick([1,2,5,-1,-2,-5]);
            const h=Q(hn,10), X=(a*10+hn)/10, ans=qadd(Q(c),qmul(m,h));
            const tl=lineTeX(V(Q(c)),V(m),xm(a));
            return {prompt:`The equation of the tangent line for a function $f$ at $a = ${a}$ is $${tl}$. Use the tangent line to approximate $f(${dec(X)})$.`,
              answer:{type:"num",answer:qA(ans)}, verify:{value:c+qV(m)*(X-a)},
              hint:"The tangent line approximation is $f(x) \\approx$ (the right side of the tangent line). Put in the $x$ you want, then subtract $a$ inside the bracket.",
              steps:[`Tangent line approximation: $f(x) \\approx ${tl.slice(4)}$ for $x$ near $${a}$.`,`$f(${dec(X)}) \\approx ${c} + (${qT(m)})(${dec(X)} - (${a})) = ${c} + (${qT(m)})(${dec(hn/10)})$`,`$= ${qT(ans)}$${ans.d>1?` $\\approx ${dec(qV(ans))}$`:""}.`],
              answerTeX:`$f(${dec(X)}) \\approx ${qT(ans)}$`};
          }
          const n=R.pick([2,3,4,5]), hn=R.pick(H), h=hn/100, base=dec(1+h), ans=qadd(Q(1),Q(hn,100*n));
          const fT=n===2?"\\sqrt{1+x}":`(1+x)^{1/${n}}`, tgt=n===2?`\\sqrt{${base}}`:`(${base})^{1/${n}}`;
          return {prompt:`The tangent line to $f(x) = ${fT}$ at $a = 0$ is $y = 1 + \\frac{1}{${n}}x$. Use it to approximate $${tgt}$.`,
            answer:{type:"num",answer:qA(ans)}, verify:{value:1+h/n},
            hint:`Which $x$ makes $f(x) = ${tgt}$? It is not ${base}.`,
            steps:[`Tangent line approximation: $f(x) \\approx 1 + \\frac{1}{${n}}x$ for $x$ near 0.`,`Take $x = ${dec(h)}$ (not ${base}) because $f(${dec(h)}) = ${n===2?`\\sqrt{1 + (${dec(h)})}`:`(1 + (${dec(h)}))^{1/${n}}`} = ${tgt}$.`,`$${tgt} = f(${dec(h)}) \\approx 1 + \\frac{1}{${n}}(${dec(h)}) = ${qT(ans)}$.`],
            answerTeX:`$${tgt} \\approx ${qT(ans)}$`};
        }
        if(d===2){
          const kind=R.pick(["root0","sqrtsq","pow23"]);
          if(kind==="root0"){ const n=R.pick([2,3,4,5]), hn=R.pick(H), h=hn/100, base=dec(1+h), ans=qadd(Q(1),Q(hn,100*n));
            const fT=n===2?"\\sqrt{1+x}":`(1+x)^{1/${n}}`, tgt=n===2?`\\sqrt{${base}}`:`(${base})^{1/${n}}`;
            return {prompt:`Use the tangent line of $f(x) = ${fT}$ at $a = 0$ to approximate $${tgt}$.`,
              answer:{type:"num",answer:qA(ans)}, verify:{value:1+nd(x=>Math.pow(1+x,1/n),0)*h},
              hint:"Find the tangent line at 0 first. Then pick the $x$ that makes $f(x)$ equal the number you want.",
              steps:[`$f'(x) = \\frac{1}{${n}}(1+x)^{-\\frac{${n-1}}{${n}}}$, so $f'(0) = \\frac{1}{${n}}$ and $f(0) = 1$.`,`Tangent line: $y = f(0) + f'(0)(x - 0) = 1 + \\frac{1}{${n}}x$, so $f(x) \\approx 1 + \\frac{1}{${n}}x$.`,`Take $x = ${dec(h)}$ (not ${base}) because $f(${dec(h)}) = ${tgt}$.`,`$${tgt} \\approx 1 + \\frac{1}{${n}}(${dec(h)}) = ${qT(ans)}$.`],
              answerTeX:`$${tgt} \\approx ${qT(ans)}$`};
          }
          if(kind==="sqrtsq"){ const s=R.int(2,9); let dl; do{ dl=R.pick([1,2,3,-1,-2,-3]); }while(Number.isInteger(Math.sqrt(s*s+dl)));
            const N=s*s+dl, ans=qadd(Q(s),Q(dl,2*s));
            return {prompt:`Use the tangent line of $f(x) = \\sqrt{x}$ at $a = ${s*s}$ to approximate $\\sqrt{${N}}$.`,
              answer:{type:"num",answer:qA(ans)}, verify:{value:s+nd(Math.sqrt,s*s)*dl},
              hint:"Here $f(x) = \\sqrt{x}$, so the $x$ you plug in is the number under the root.",
              steps:[`$f'(x) = \\frac{1}{2\\sqrt{x}}$, so $f(${s*s}) = ${s}$ and $f'(${s*s}) = \\frac{1}{2(${s})} = ${M.frac(1,2*s)}$.`,`$f(x) \\approx ${s} + ${M.frac(1,2*s)}(x - ${s*s})$ for $x$ near ${s*s}.`,`Take $x = ${N}$ because $f(${N}) = \\sqrt{${N}}$.`,`$\\sqrt{${N}} \\approx ${s} + ${M.frac(1,2*s)}(${dl}) = ${qT(ans)}$.`],
              answerTeX:`$\\sqrt{${N}} \\approx ${qT(ans)}$`};
          }
          const s=R.pick([2,3]), a=s*s*s, dl=R.pick([1,-1,2,-2]), N=a+dl, ans=qadd(Q(s*s),Q(2*dl,3*s));
          return {prompt:`Use the tangent line of $f(x) = x^{2/3}$ at $a = ${a}$ to approximate $${N}^{2/3}$.`,
            answer:{type:"num",answer:qA(ans)}, verify:{value:s*s+nd(x=>Math.cbrt(x)**2,a)*dl},
            hint:`$${a}^{1/3} = ${s}$. Use $f'(x) = \\frac{2}{3}x^{-1/3}$.`,
            steps:[`$f'(x) = \\frac{2}{3}x^{-1/3}$, so $f(${a}) = ${s}^2 = ${s*s}$ and $f'(${a}) = \\frac{2}{3}\\cdot\\frac{1}{${s}} = ${M.frac(2,3*s)}$.`,`$f(x) \\approx ${s*s} + ${M.frac(2,3*s)}(x - ${a})$.`,`Take $x = ${N}$ because $f(${N}) = ${N}^{2/3}$.`,`$${N}^{2/3} \\approx ${s*s} + ${M.frac(2,3*s)}(${dl}) = ${qT(ans)}$.`],
            answerTeX:`$${N}^{2/3} \\approx ${qT(ans)}$`};
        }
        const kind=R.pick(["shiftroot","shiftsqrt","shiftsin","shiftexp"]);
        if(kind==="shiftroot"){ const n=R.pick([2,3,4]), k=R.int(2,5), a=1-k, hn=R.pick(H), h=hn/100, base=dec(1+h), X=(a*100+hn)/100, ans=qadd(Q(1),Q(hn,100*n));
          const ins=xp(k), fT=n===2?`\\sqrt{${ins}}`:`(${ins})^{1/${n}}`, tgt=n===2?`\\sqrt{${base}}`:`(${base})^{1/${n}}`;
          return {prompt:`Use the tangent line for $f(x) = ${fT}$ at $a = ${a}$ to approximate $${tgt}$.`,
            answer:{type:"num",answer:qA(ans)}, verify:{value:1+nd(x=>Math.pow(x+k,1/n),a)*(X-a)},
            hint:`Solve $x + ${k} = ${base}$ for the $x$ to plug in.`,
            steps:[`$f'(x) = \\frac{1}{${n}}(${ins})^{-\\frac{${n-1}}{${n}}}$, so $f(${a}) = 1^{1/${n}} = 1$ and $f'(${a}) = \\frac{1}{${n}}$.`,`$f(x) \\approx 1 + \\frac{1}{${n}}(${xm(a)})$ for $x$ near $${a}$.`,`Take $x = ${dec(X)}$ because $f(${dec(X)}) = ${n===2?`\\sqrt{${dec(X)} + ${k}}`:`(${dec(X)} + ${k})^{1/${n}}`} = ${tgt}$.`,`$${tgt} = f(${dec(X)}) \\approx 1 + \\frac{1}{${n}}(${dec(X)} + ${-a}) = 1 + \\frac{1}{${n}}(${dec(h)}) = ${qT(ans)}$.`],
            answerTeX:`$${tgt} \\approx ${qT(ans)}$`};
        }
        if(kind==="shiftsqrt"){ const k=R.int(1,5), s=R.int(2,4), a=s*s-k, dl=R.pick([1,-1]), N=s*s+dl, X=N-k, ans=qadd(Q(s),Q(dl,2*s));
          return {prompt:`Use the tangent line for $f(x) = \\sqrt{${xp(k)}}$ at $a = ${a}$ to approximate $\\sqrt{${N}}$.`,
            answer:{type:"num",answer:qA(ans)}, verify:{value:s+nd(x=>Math.sqrt(x+k),a)*(X-a)},
            hint:`Which $x$ gives $x + ${k} = ${N}$?`,
            steps:[`$f'(x) = \\frac{1}{2\\sqrt{${xp(k)}}}$, so $f(${a}) = \\sqrt{${s*s}} = ${s}$ and $f'(${a}) = ${M.frac(1,2*s)}$.`,`$f(x) \\approx ${s} + ${M.frac(1,2*s)}(${xm(a)})$.`,`Take $x = ${X}$ because $f(${X}) = \\sqrt{${X} + ${k}} = \\sqrt{${N}}$ (make sure $f(x)$ is the value you want, p. 5).`,`$\\sqrt{${N}} \\approx ${s} + ${M.frac(1,2*s)}(${X} ${a<0?"+":"-"} ${Math.abs(a)}) = ${qT(ans)}$.`],
            answerTeX:`$\\sqrt{${N}} \\approx ${qT(ans)}$`};
        }
        if(kind==="shiftsin"){ const [tT,tA,tv,sumT]=R.pick([["\\frac{\\pi}{12}","pi/12",Math.PI/12,"\\frac{13\\pi}{12}"],["\\frac{\\pi}{10}","pi/10",Math.PI/10,"\\frac{11\\pi}{10}"],["\\frac{\\pi}{8}","pi/8",Math.PI/8,"\\frac{9\\pi}{8}"],["\\frac{\\pi}{6}","pi/6",Math.PI/6,"\\frac{7\\pi}{6}"]]);
          return {prompt:`Use the tangent line for $f(x) = \\sin(x + \\pi)$ at $a = 0$ to approximate $\\sin\\left(${sumT}\\right)$.`,
            answer:{type:"num",answer:`-${tA}`,rel:1e-4}, verify:{value:Math.sin(Math.PI)+nd(x=>Math.sin(x+Math.PI),0)*tv},
            hint:`Which $x$ makes $x + \\pi = ${sumT}$?`,
            steps:[`$f'(x) = \\cos(x + \\pi)$, so $f'(0) = \\cos(\\pi) = -1$ and $f(0) = \\sin(\\pi) = 0$.`,`Tangent line: $y = f(0) + f'(0)(x - 0) = -x$, so $f(x) \\approx -x$.`,`Take $x = ${tT}$ (not $${sumT}$) because $f\\left(${tT}\\right) = \\sin\\left(${tT} + \\pi\\right) = \\sin\\left(${sumT}\\right)$.`,`$\\sin\\left(${sumT}\\right) \\approx -${tT}$.`],
            answerTeX:`$\\sin\\left(${sumT}\\right) \\approx -${tT}$`};
        }
        const k=R.int(1,3), hn=R.pick([10,20,-10,5,-5]), h=hn/100, X=(k*100+hn)/100, ans=qadd(Q(1),Q(hn,100));
        return {prompt:`Use the tangent line for $f(x) = e^{x - ${k}}$ at $a = ${k}$ to approximate $e^{${dec(h)}}$.`,
          answer:{type:"num",answer:qA(ans)}, verify:{value:1+nd(x=>Math.exp(x-k),k)*(X-k)},
          hint:`Which $x$ makes $x - ${k} = ${dec(h)}$?`,
          steps:[`$f'(x) = e^{x - ${k}}$, so $f(${k}) = e^0 = 1$ and $f'(${k}) = 1$.`,`$f(x) \\approx 1 + 1(x - ${k})$.`,`Take $x = ${dec(X)}$ because $f(${dec(X)}) = e^{${dec(X)} - ${k}} = e^{${dec(h)}}$.`,`$e^{${dec(h)}} \\approx 1 + (${dec(X)} - ${k}) = ${dec(1+h)}$.`],
          answerTeX:`$e^{${dec(h)}} \\approx ${dec(1+h)}$`};
      }},
    {id:"L02.g.diffapprox", title:"Approximate a change: $\\Delta y \\approx f'(a)\\Delta x$", skill:"Use the differential approximation", ref:"p. 5",
      gen(R,d){
        const DX=[1,2,-1,-2,5,-5];
        if(d===1){
          if(R.pick([true,false])){ // only the derivative is known
            const k=R.nz(-3,4); let a; do{ a=R.pick([1,2,4,5]); }while(a+k===0);
            const dn=R.pick(DX), fpa=Q(a+k,a), ans=qmul(fpa,Q(dn,10)), b=(a*10+dn)/10;
            return {prompt:`All you know about $y = f(x)$ is its derivative, $f'(x) = \\frac{x ${k<0?"-":"+"} ${Math.abs(k)}}{x}$. Approximate $\\Delta y$ when $x$ changes from $x = ${a}$ to $x = ${dec(b)}$.`,
              answer:{type:"num",answer:qA(ans)}, verify:{value:(a+k)/a*(b-a)},
              hint:"You do not need $f$ itself. $\\Delta y \\approx f'(a)\\Delta x$ with $a$ the original $x$ value.",
              steps:[`$a = ${a}$ (the original $x$ value) and $\\Delta x = ${dec(b)} - ${a} = ${dec(dn/10)}$.`,`$f'(${a}) = \\frac{${a} ${k<0?"-":"+"} ${Math.abs(k)}}{${a}} = ${qT(fpa)}$.`,`$\\Delta y \\approx f'(${a})\\Delta x = ${qT(fpa)}(${dec(dn/10)}) = ${qT(ans)}$.`],
              answerTeX:`$\\Delta y \\approx ${qT(ans)}$`};
          }
          const p=R.nz(-3,3), r=R.int(-5,5), a=R.int(-2,3); let q; do{ q=R.int(-5,5); }while(2*p*a+q===0); const dn=R.pick(DX), coefs=[p,q,r], fpa=2*p*a+q, b=(a*10+dn)/10, ans=Q(fpa*dn,10);
          return {prompt:`Let $f(x) = ${M.poly(coefs)}$. Approximate the change in $y$ if $x$ changes from ${a} to ${dec(b)}.`,
            answer:{type:"num",answer:qA(ans)}, verify:{value:nd(x=>evalPoly(coefs,x),a)*(b-a)},
            hint:"$\\Delta y \\approx f'(a)\\Delta x$. $a$ is where you start, and $\\Delta x$ is new minus old.",
            steps:[`$f'(x) = ${M.poly([2*p,q])}$ and $a = ${a}$ is the original $x$ value.`,`$\\Delta x = x - a = ${dec(b)} - (${a}) = ${dec(dn/10)}$.`,`$\\Delta y \\approx f'(${a})\\Delta x = (${fpa})(${dec(dn/10)}) = ${qT(ans)}$${ans.d>1?` $= ${dec(qV(ans))}$`:""}.`],
            answerTeX:`$\\Delta y \\approx ${dec(qV(ans))}$`};
        }
        if(d===2){
          const kind=R.pick(["cubic","sqrt","recip","exp"]);
          if(kind==="cubic"){ const q=R.int(1,4), r=R.int(-5,5), a=R.int(1,4), dn=R.pick([-1,-2,1,2,-5]), coefs=[1,0,q,r], fpa=3*a*a+q, b=(a*10+dn)/10, ans=Q(fpa*dn,10);
            return {prompt:`Let $f(x) = ${M.poly(coefs)}$. Approximate the change in $y$ if $x$ changes from ${a} to ${dec(b)}.`,
              answer:{type:"num",answer:qA(ans)}, verify:{value:nd(x=>evalPoly(coefs,x),a)*(b-a)},
              hint:"The original $x$ value is $a$. If $x$ goes down, $\\Delta x$ is negative.",
              steps:[`$f'(x) = ${M.poly([3,0,q])}$ and $a = ${a}$ (the original $x$ value).`,`$\\Delta x = x - a = ${dec(b)} - ${a} = ${dec(dn/10)}$.`,`$\\Delta y \\approx f'(${a})\\Delta x = (${fpa})(${dec(dn/10)}) = ${dec(qV(ans))}$.`],
              answerTeX:`$\\Delta y \\approx ${dec(qV(ans))}$`};
          }
          if(kind==="sqrt"){ const s=R.int(2,9), dl=R.pick([1,-1,2,-2]), ans=Q(dl,2*s);
            return {prompt:`Use the differential approximation to approximate the change in $y = \\sqrt{x}$ as $x$ changes from ${s*s} to ${s*s+dl}.`,
              answer:{type:"num",answer:qA(ans)}, verify:{value:nd(Math.sqrt,s*s)*dl},
              hint:"$f'(x) = \\frac{1}{2\\sqrt{x}}$. Evaluate it at the original $x$ value.",
              steps:[`$f'(x) = \\frac{1}{2\\sqrt{x}}$, $a = ${s*s}$, $\\Delta x = ${s*s+dl} - ${s*s} = ${dl}$.`,`$f'(${s*s}) = \\frac{1}{2\\sqrt{${s*s}}} = ${M.frac(1,2*s)}$.`,`$\\Delta y \\approx f'(${s*s})\\Delta x = ${M.frac(1,2*s)}(${dl}) = ${qT(ans)}$.`],
              answerTeX:`$\\Delta y \\approx ${qT(ans)}$`};
          }
          if(kind==="recip"){ const c=R.nz(-4,4), n=R.pick([1,2]), a=R.pick([1,2]), dn=R.pick(DX), b=(a*10+dn)/10, fpa=Q(-c*n,Math.pow(a,n+1)), ans=qmul(fpa,Q(dn,10));
            const fT=n===1?`\\frac{${c}}{x}`:`\\frac{${c}}{x^2}`;
            return {prompt:`Use the differential approximation to approximate the change in $y = ${fT}$ as $x$ changes from ${a} to ${dec(b)}.`,
              answer:{type:"num",answer:qA(ans)}, verify:{value:nd(x=>c/Math.pow(x,n),a)*(b-a)},
              hint:`Write $y = ${c}x^{${-n}}$ and use the power rule.`,
              steps:[`$f(x) = ${c}x^{${-n}}$, so $f'(x) = ${-c*n}x^{${-n-1}}$. $a = ${a}$ and $\\Delta x = ${dec(dn/10)}$.`,`$f'(${a}) = \\frac{${-c*n}}{${a}^{${n+1}}} = ${qT(fpa)}$.`,`$\\Delta y \\approx f'(${a})\\Delta x = ${qT(fpa)}(${dec(dn/10)}) = ${qT(ans)}$.`],
              answerTeX:`$\\Delta y \\approx ${qT(ans)}$`};
          }
          const k=R.nz(-3,3), hn=R.pick([3,5,-2,10,-4]), ans=Q(k*hn,100);
          return {prompt:`Let $f(x) = e^{${co(k)}x}$. Approximate the change in $y$ if $x$ changes from 0 to ${dec(hn/100)}.`,
            answer:{type:"num",answer:qA(ans)}, verify:{value:nd(x=>Math.exp(k*x),0)*hn/100},
            hint:"Chain rule for $f'(x)$, then $e^0 = 1$.",
            steps:[`$f'(x) = ${co(k)}e^{${co(k)}x}$, so $f'(0) = ${k}$. $a = 0$ and $\\Delta x = ${dec(hn/100)}$.`,`$\\Delta y \\approx f'(0)\\Delta x = (${k})(${dec(hn/100)}) = ${dec(qV(ans))}$.`],
            answerTeX:`$\\Delta y \\approx ${dec(qV(ans))}$`};
        }
        const kind=R.pick(["sphere","ball","cube","bact"]);
        if(kind==="sphere"||kind==="ball"){ const a=R.int(2,6), dn=R.pick([1,-1,2,-2]), dr=dn/10;
          const sph=kind==="sphere"; const f=sph?(r=>4*Math.PI*r*r):(r=>4/3*Math.PI*r*r*r);
          const coef=+(sph?8*a*dn/10:4*a*a*dn/10).toFixed(6); const cT=dec(coef);
          return {prompt:`${sph?"The surface area of a spherical cell is $S(r) = 4\\pi r^2$":"The volume of a spherical droplet is $V(r) = \\frac{4}{3}\\pi r^3$"}, with $r$ in µm. Approximate the change in ${sph?"surface area":"volume"} when the radius changes from ${a} µm to ${dec(a+dr)} µm. Give the number in ${sph?"µm²":"µm³"} (you can type pi).`,
            answer:{type:"num",answer:`${coef}*pi`}, verify:{value:nd(f,a)*dr},
            hint:sph?"$S'(r) = 8\\pi r$. Use the original radius.":"$V'(r) = 4\\pi r^2$. Use the original radius.",
            steps:[sph?`$S'(r) = 8\\pi r$ (µm²/µm), $a = ${a}$ µm, $\\Delta r = ${dec(dr)}$ µm.`:`$V'(r) = 4\\pi r^2$ (µm³/µm), $a = ${a}$ µm, $\\Delta r = ${dec(dr)}$ µm.`,
              sph?`$\\Delta S \\approx S'(${a})\\Delta r = 8\\pi(${a})(${dec(dr)}) = ${cT}\\pi$ µm².`:`$\\Delta V \\approx V'(${a})\\Delta r = 4\\pi(${a})^2(${dec(dr)}) = ${cT}\\pi$ µm³.`,
              `Units check: (${sph?"µm²":"µm³"}/µm) × µm = ${sph?"µm²":"µm³"}.`],
            answerTeX:`$${sph?"\\Delta S":"\\Delta V"} \\approx ${cT}\\pi$ ${sph?"µm²":"µm³"}`};
        }
        if(kind==="cube"){ const s=R.pick([2,3]), t0=s*s*s-1, rate=R.int(2,9), A=3*s*s*rate, dt=R.pick([1,0.5,2]), ans=rate*dt;
          return {prompt:`A painting's value in dollars is modelled by $V(t) = ${A}(1+t)^{1/3}$, where $t$ is years from now. Approximate how much value it gains from $t = ${t0}$ to $t = ${dec(t0+dt)}$.`,
            answer:{type:"num",answer:String(ans)}, verify:{value:nd(t=>A*Math.cbrt(1+t),t0)*dt},
            hint:`$V'(t) = \\frac{${A}}{3}(1+t)^{-2/3}$. At $t = ${t0}$, $1 + t = ${s*s*s}$.`,
            steps:[`$V'(t) = ${A/3}(1+t)^{-2/3}$ dollars per year. $a = ${t0}$ and $\\Delta t = ${dec(dt)}$.`,`$V'(${t0}) = ${A/3}(${s*s*s})^{-2/3} = \\frac{${A/3}}{${s*s}} = ${rate}$.`,`$\\Delta V \\approx V'(${t0})\\Delta t = ${rate}(${dec(dt)}) = ${dec(ans)}$ dollars.`],
            answerTeX:`$\\Delta V \\approx ${dec(ans)}$ dollars`};
        }
        const k=R.pick([0.02,0.05,0.1]), Na=R.pick([100,200,250,400]), a=R.pick([5,10,20]), dt=R.pick([0.5,1,0.2]), ans=k*Na*dt;
        return {prompt:`A bacteria population $N(t)$, in millions, with $t$ in days, grows according to $\\frac{dN}{dt} = ${k}N$. If $N(${a}) = ${Na}$, approximate the change in population from day ${a} to day ${dec(a+dt)}.`,
          answer:{type:"num",answer:dec(ans)}, verify:{value:k*Na*dt},
          hint:`You do not need a formula for $N$. The equation gives $N'(${a})$ from $N(${a})$.`,
          steps:[`$a = ${a}$ and $\\Delta t = ${dec(dt)}$. $\\Delta N \\approx N'(${a})\\Delta t$.`,`$N'(${a}) = ${k}N(${a}) = ${k}(${Na}) = ${dec(k*Na)}$ million per day.`,`$\\Delta N \\approx ${dec(k*Na)}(${dec(dt)}) = ${dec(ans)}$ million.`],
          answerTeX:`$\\Delta N \\approx ${dec(ans)}$ million`};
      }},
    {id:"L02.g.errline", title:"Find the first mistake", skill:"Spot errors in tangent line and approximation work", ref:"pp. 3 to 5",
      gen(R,d){
        const box=(lines)=>`<div class="box">${lines.map((l,i)=>`<p>(${i+1})&nbsp; ${l}</p>`).join("")}</div>`;
        const lineOpts=n=>Array.from({length:n},(_,i)=>`Line (${i+1})`);
        if(d===1||d===2){
          let L, bad, why, fix, prob;
          if(d===1||R.pick([true,false])){
            const n=R.pick([2,3,4,5]), hn=R.pick([10,20,5,-10]), h=dec(hn/100), base=dec(1+hn/100);
            const fT=`(1+x)^{1/${n}}`, tgt=`(${base})^{1/${n}}`, ans=qadd(Q(1),Q(hn,100*n));
            const err=d===1?R.pick(["noy","shift"]):R.pick(["exp","slope","noy","shift"]);
            prob=`Let $f(x) = ${fT}$. Find the equation of the tangent line to $f$ at $a = 0$ and use it to approximate $${tgt}$.`;
            L=[`$f'(x) = \\frac{1}{${n}}(1+x)^{-\\frac{${n-1}}{${n}}}$`,`So the slope at $a = 0$ is $f'(0) = \\frac{1}{${n}}(1)^{-\\frac{${n-1}}{${n}}} = \\frac{1}{${n}}$`,
               `The tangent line is $y = f(0) + f'(0)(x - 0) = 1 + \\frac{1}{${n}}x$`,`Take $x = ${h}$: $${tgt} = f(${h}) \\approx 1 + \\frac{1}{${n}}(${h}) = ${qT(ans)}$`];
            if(err==="exp"){ bad=0; L[0]=`$f'(x) = \\frac{1}{${n}}(1+x)^{\\frac{${n+1}}{${n}}}$`; L[1]=`So the slope at $a = 0$ is $f'(0) = \\frac{1}{${n}}(1)^{\\frac{${n+1}}{${n}}} = \\frac{1}{${n}}$`; why=`The power rule subtracts 1 from the power: $\\frac{1}{${n}} - 1 = -\\frac{${n-1}}{${n}}$. Line (1) adds 1 instead. The slope still comes out as $\\frac{1}{${n}}$ because 1 to any power is 1, but line (1) is wrong.`; }
            if(err==="slope"){ bad=1; L[1]=`So the slope at $a = 0$ is $f'(0) = (1)^{-\\frac{${n-1}}{${n}}} = 1$`; L[2]=`The tangent line is $y = f(0) + f'(0)(x - 0) = 1 + x$`; L[3]=`Take $x = ${h}$: $${tgt} = f(${h}) \\approx 1 + ${h} = ${base}$`; why=`The factor $\\frac{1}{${n}}$ was dropped: $f'(0) = \\frac{1}{${n}}$.`; }
            if(err==="noy"){ bad=2; L[2]=`The tangent line is $f(0) + f'(0)(x - 0) = 1 + \\frac{1}{${n}}x$`;
              why=`Line (3) is not an equation. The tangent line must be written $y = 1 + \\frac{1}{${n}}x$ (Warning, p. 3).`; }
            if(err==="shift"){ bad=3; const w=qadd(Q(1),Q(100+hn,100*n)); L[3]=`Take $x = ${base}$: $${tgt} \\approx 1 + \\frac{1}{${n}}(${base}) = ${qT(w)}$`; why=`$f(${base}) = (1 + ${base})^{1/${n}}$, which is not $${tgt}$. Take $x = ${h}$, so $${tgt} \\approx ${qT(ans)}$ (Warning, p. 5).`; }
          } else {
            const s=R.int(2,6); let dl; do{ dl=R.pick([1,2,-1,-2]); }while(Number.isInteger(Math.sqrt(s*s+dl)));
            const N=s*s+dl, a=s*s, ans=qadd(Q(s),Q(dl,2*s)); const err=R.pick(["deriv","slope","sign","plugdelta"]);
            prob=`Use the tangent line of $f(x) = \\sqrt{x}$ at $a = ${a}$ to approximate $\\sqrt{${N}}$.`;
            L=[`$f'(x) = \\frac{1}{2}x^{-1/2} = \\frac{1}{2\\sqrt{x}}$`,`So $f(${a}) = ${s}$ and $f'(${a}) = \\frac{1}{2\\sqrt{${a}}} = ${M.frac(1,2*s)}$`,
               `The tangent line approximation is $f(x) \\approx ${s} + ${M.frac(1,2*s)}(x - ${a})$`,`Take $x = ${N}$: $\\sqrt{${N}} \\approx ${s} + ${M.frac(1,2*s)}(${dl}) = ${qT(ans)}$`];
            if(err==="deriv"){ bad=0; const m=Q(s,2), w=qadd(Q(s),qmul(m,Q(dl))); L[0]=`$f'(x) = \\frac{1}{2}x^{1/2}$`; L[1]=`So $f(${a}) = ${s}$ and $f'(${a}) = \\frac{1}{2}\\sqrt{${a}} = ${qT(m)}$`; L[2]=`The tangent line approximation is $f(x) \\approx ${s} + ${qT(m)}(x - ${a})$`; L[3]=`Take $x = ${N}$: $\\sqrt{${N}} \\approx ${s} + ${qT(m)}(${dl}) = ${qT(w)}$`; why="The power rule gives $\\frac{1}{2}x^{1/2 - 1} = \\frac{1}{2}x^{-1/2}$. The power must drop by 1."; }
            if(err==="slope"){ bad=1; const m=Q(1,2*a), w=qadd(Q(s),qmul(m,Q(dl))); L[1]=`So $f(${a}) = ${s}$ and $f'(${a}) = \\frac{1}{2(${a})} = ${qT(m)}$`; L[2]=`The tangent line approximation is $f(x) \\approx ${s} + ${qT(m)}(x - ${a})$`; L[3]=`Take $x = ${N}$: $\\sqrt{${N}} \\approx ${s} + ${qT(m)}(${dl}) = ${qT(w)}$`; why=`The square root was dropped: $f'(${a}) = \\frac{1}{2\\sqrt{${a}}} = \\frac{1}{${2*s}}$.`; }
            if(err==="sign"){ bad=2; const w=qadd(Q(s),qmul(Q(1,2*s),Q(N+a))); L[2]=`The tangent line approximation is $f(x) \\approx ${s} + ${M.frac(1,2*s)}(x + ${a})$`; L[3]=`Take $x = ${N}$: $\\sqrt{${N}} \\approx ${s} + ${M.frac(1,2*s)}(${N + a}) = ${qT(w)}$`; why=`The bracket is $(x - a) = (x - ${a})$, not $(x + ${a})$.`; }
            if(err==="plugdelta"){ bad=3; const w=qadd(Q(s),qmul(Q(1,2*s),Q(dl-a))); L[3]=`Take $x = ${dl}$: $\\sqrt{${N}} \\approx ${s} + ${M.frac(1,2*s)}(${dl} - ${a}) = ${qT(w)}$`; why=`For $f(x) = \\sqrt{x}$ you plug in $x = ${N}$ itself, because $f(${N}) = \\sqrt{${N}}$. Here $x = ${dl}$ gives $f(${dl})$, which is not the value you want.`; }
          }
          return {prompt:`A problem and an answer are below. The answer would not get full marks. Which is the first line with a mistake?<p>Problem: ${prob}</p>${box(L)}`,
            parts:[{answer:{type:"mc",options:lineOpts(4),correct:bad,keep:true}}],
            hint:"Check each line on its own: the derivative, the slope at $a$, the form of the tangent line (does it start with $y =$?), and the $x$ that is plugged in.",
            steps:[`Line (${bad+1}) is the first mistake.`,why].concat(bad===1?["Line (1) is correct."]:bad>1?[`Lines (1) to (${bad}) are correct.`]:[]),
            answerTeX:`Line (${bad+1})`};
        }
        // d = 3: three student answers for a differential approximation
        const p=R.pick([1,2,3]), q=R.int(-4,4); let a, dn;
        do{ a=R.int(1,4); dn=R.pick([1,2,-1,-2,5]); }while(2*p*a+q===0);
        const b=(a*10+dn)/10, fp=x=>2*p*x+q, ok=fp(a)*dn/10;
        const fT=M.poly([p,q,0]), dT=M.poly([2*p,q]);
        const good=[`$f'(x) = ${dT}$ and $a = ${a}$`,`$\\Delta x = ${dec(b)} - ${a} = ${dec(dn/10)}$`,`$\\Delta y \\approx f'(${a})\\Delta x = (${fp(a)})(${dec(dn/10)}) = ${dec(ok)}$`];
        const wB=[`$f'(x) = ${dT}$ and $a = ${dec(b)}$`,`$\\Delta x = ${dec(b)} - ${a} = ${dec(dn/10)}$`,`$\\Delta y \\approx f'(${dec(b)})\\Delta x = (${dec(fp(b))})(${dec(dn/10)}) = ${dec(fp(b)*dn/10)}$`];
        const wS=[`$f'(x) = ${dT}$ and $a = ${a}$`,`$\\Delta x = ${a} - ${dec(b)} = ${dec(-dn/10)}$`,`$\\Delta y \\approx f'(${a})\\Delta x = (${fp(a)})(${dec(-dn/10)}) = ${dec(-ok)}$`];
        const wN=[`$f'(x) = ${dT}$ and $a = ${a}$`,`$\\Delta x = ${dec(b)} - ${a} = ${dec(dn/10)}$`,`$\\Delta y \\approx f'(${a}) = ${fp(a)}$`];
        const wrong=R.shuffle([wB,wS,wN]).slice(0,2);
        const order=R.shuffle([0,1,2]); const sets=[good,...wrong];
        const shown=order.map(i=>sets[i]); const correct=order.indexOf(0);
        const prompt=`Let $f(x) = ${fT}$. Approximate the change in $y$ as $x$ changes from ${a} to ${dec(b)}. Three students answered. Which answer is correct?`+
          shown.map((s,i)=>`<p>Answer #${i+1}:</p>${box(s)}`).join("");
        return {prompt, parts:[{answer:{type:"mc",options:["Answer #1","Answer #2","Answer #3"],correct,keep:true}}],
          hint:"$a$ is the original $x$ value, $\\Delta x$ is new minus original, and the approximation multiplies by $\\Delta x$.",
          steps:[`$a$ is the original $x$ value, ${a}, so the slope is $f'(${a}) = ${fp(a)}$.`,`$\\Delta x = x - a = ${dec(b)} - ${a} = ${dec(dn/10)}$.`,`$\\Delta y \\approx (${fp(a)})(${dec(dn/10)}) = ${dec(ok)}$. That is Answer #${correct+1}.`],
          answerTeX:`Answer #${correct+1}`};
      }}
  ],
  exam:[
    {id:"L02.q1", ref:"pp. 3 to 4", q:"Which of these is the equation of the tangent line to $y = f(x)$ at $x = a$?", keep:false,
      opts:[["$y = f(a) + f'(a)(x - a)$",1,"Point-slope form with the point $(a, f(a))$ and slope $f'(a)$ (p. 3)."],["$f(x) \\approx f(a) + f'(a)(x - a)$",0,"That is the tangent line approximation, not the equation of the line (p. 4)."],["$f(a) + f'(a)(x - a)$",0,"Not an equation: the $y =$ is missing (Warning, p. 3)."],["$y = f(a) + f'(x)(x - a)$",0,"The slope is the number $f'(a)$, not the function $f'(x)$."]]},
    {id:"L02.q2", ref:"p. 4", q:"The tangent line to $f$ at $a = 3$ is $y = 2 - \\frac{1}{4}(x - 3)$. The tangent line approximation of $f(3.4)$ is", keep:false,
      opts:[["$1.9$",1,"$2 - \\frac{1}{4}(3.4 - 3) = 2 - 0.1 = 1.9$."],["$2.1$",0,"The slope is negative, so the value goes down."],["$1.15$",0,"That uses $2 - \\frac{1}{4}(3.4)$ and forgets to subtract $a = 3$."],["$2$",0,"That is $f(3)$, the value at the point of tangency."]]},
    {id:"L02.q3", ref:"pp. 4 to 5", q:"The tangent line to $f(x) = (1+x)^{1/5}$ at $a = 0$ is $y = 1 + \\frac{1}{5}x$. Using it to approximate $(0.95)^{1/5}$ gives", keep:false,
      opts:[["$0.99$",1,"Take $x = -0.05$ since $f(-0.05) = (0.95)^{1/5}$. Then $1 + \\frac{1}{5}(-0.05) = 0.99$."],["$1.19$",0,"That plugs in $x = 0.95$, which gives $f(0.95) = (1.95)^{1/5}$."],["$1.01$",0,"The sign of $x$ is wrong: $0.95 = 1 + x$ means $x = -0.05$."],["$1$",0,"That is $f(0)$. You still need the $\\frac{1}{5}x$ term."]]},
    {id:"L02.q4", ref:"p. 5", q:"$f'(x) = x^2 - 1$. Using the differential approximation, the change in $y$ as $x$ goes from 3 to 2.9 is about", keep:false,
      opts:[["$-0.8$",1,"$a = 3$, $\\Delta x = -0.1$, $f'(3) = 8$, so $\\Delta y \\approx 8(-0.1) = -0.8$."],["$0.8$",0,"$\\Delta x = 2.9 - 3$ is negative."],["$-0.741$",0,"That uses $f'(2.9)$. The slope is taken at the original value $a = 3$."],["$8$",0,"That is $f'(3)$. Multiply by $\\Delta x$."]]},
    {id:"L02.q5", ref:"p. 5", q:"True or false: the differential approximation $\\Delta y \\approx f'(a)\\Delta x$ comes from subtracting $f(a)$ from both sides of the tangent line approximation.", keep:true,
      opts:[["True",1,"$f(x) - f(a) \\approx f'(a)(x - a)$, and the two sides are $\\Delta y$ and $f'(a)\\Delta x$ (p. 5)."],["False",0,"It is exactly how the notes derive it on p. 5."]]},
    {id:"L02.q6", ref:"pp. 2 to 3", q:"True or false: $y = 2 - \\frac{1}{2}(x - 3)$ and $y = \\frac{7}{2} - \\frac{1}{2}x$ are different lines.", keep:true,
      opts:[["True",0,"Expand: $2 - \\frac{1}{2}x + \\frac{3}{2} = \\frac{7}{2} - \\frac{1}{2}x$. Same line."],["False",1,"Same line. The first form shows the point $(3, 2)$, the second shows the $y$-intercept $3.5$ (pp. 2 to 3)."]]},
    {id:"L02.q7", ref:"pp. 1 to 2", q:"Select all the equations of the line with slope $-2$ through $(1, 4)$.", multi:true,
      opts:[["$y = 4 - 2(x - 1)$",1,"Point-slope form with $x_0 = 1$, $y_0 = 4$."],["$y = 6 - 2x$",1,"Expand $4 - 2(x - 1) = 6 - 2x$. Correct, though the notes prefer point-slope form."],["$y = 1 - 2(x - 4)$",0,"This passes through $(4, 1)$: the coordinates are swapped."],["$4 - 2(x - 1)$",0,"An expression, not an equation. It needs $y =$."]]},
    {id:"L02.q8", ref:"p. 5", q:"Problem: use the tangent line for $f(x) = \\sqrt{x+1}$ at $a = 8$ to approximate $\\sqrt{8}$.<br>(1) $f'(x) = \\frac{1}{2\\sqrt{x+1}}$, so $f'(8) = \\frac{1}{6}$.<br>(2) $f(x) \\approx 3 + \\frac{1}{6}(x - 8)$.<br>(3) We want $\\sqrt{8}$, so take $x = 8$.<br>(4) $\\sqrt{8} \\approx 3 + \\frac{1}{6}(0) = 3$.<br>Which is the first line with a mistake?", keep:true,
      opts:[["Line (1)",0,"$\\frac{1}{2\\sqrt{9}} = \\frac{1}{6}$. Correct."],["Line (2)",0,"$f(8) = 3$, so this is the correct tangent line approximation."],["Line (3)",1,"$f(8) = \\sqrt{9}$, not $\\sqrt{8}$. Take $x = 7$ so $f(7) = \\sqrt{8}$, which gives $\\frac{17}{6}$ (Warning, p. 5)."],["Line (4)",0,"It follows from line (3), but line (3) is already wrong."]]},
    {id:"L02.q9", ref:"p. 4", q:"You want to approximate $\\sqrt{26}$ with a tangent line of $f(x) = \\sqrt{x}$. Which $a$ should you use?", keep:false,
      opts:[["$a = 25$",1,"Close to 26, and you can compute $f(25) = 5$ and $f'(25) = \\frac{1}{10}$ exactly."],["$a = 26$",0,"You would need $\\sqrt{26}$ to build the line, which is what you are trying to find."],["$a = 36$",0,"You can compute it, but 36 is far from 26, so the approximation is poor."],["$a = 0$",0,"$f'(0)$ does not exist, and 0 is far from 26."]]},
    {id:"L02.q10", ref:"p. 5", q:"In $\\Delta y \\approx f'(a)\\Delta x$, the number $a$ is", keep:false,
      opts:[["the original $x$ value",1,"The notes: '$a$ is the original $x$ value' (p. 5)."],["the new $x$ value",0,"The new value is $x$. $\\Delta x = x - a$."],["the change in $x$",0,"That is $\\Delta x$."],["the slope",0,"The slope is $f'(a)$."]]},
    {id:"L02.q11", ref:"pp. 4 to 5", q:"Select all the true statements about $f(x) \\approx f(a) + f'(a)(x - a)$.", multi:true,
      opts:[["It is a good approximation when $x$ is close to $a$",1,"Boxed statement, p. 4."],["The smaller $\\Delta x = x - a$ is, the better it usually is",1,"The tangent line hugs the curve near $a$."],["It is equally good for every $x$",0,"The gap grows as $x$ moves away from $a$ (try Fig. 2.2)."],["It is the equation of the tangent line",0,"The equation of the line starts with $y =$. This is the approximation (Warning, p. 4)."]]},
    {id:"L02.q12", ref:"p. 5", q:"$x$ changes from 5 to 4.7. What is $\\Delta x$?", keep:false,
      opts:[["$-0.3$",1,"$\\Delta x = x - a = 4.7 - 5$."],["$0.3$",0,"New minus original, so it is negative here."],["$4.7$",0,"That is the new value, not the change."],["$-4.7$",0,"Subtract the original value 5 from the new value 4.7."]]}
  ],
  steps:[
    {type:"read", title:"Point-slope form", fig:"pointslope", body:`<p>High school gave you $y = mx + b$. Calculus rarely uses it, because it is built around the $y$-intercept $b$. In calculus you want the focus on a point you choose (p. 1).</p><p>Start from the slope between a fixed point $(x_0, y_0)$ and any point $(x, y)$ on the line:</p>$$m = \\frac{\\Delta y}{\\Delta x} = \\frac{y - y_0}{x - x_0}$$<p>Multiply by $x - x_0$ and move $y_0$ across: $y_0 + m(x - x_0) = y$.</p><div class="box def"><b class="t">Point-slope form (p. 1)</b>The line with slope $m$ through $(x_0, y_0)$ is $y = y_0 + m(x - x_0)$.</div><p><b>Try it.</b> Drag the point and change $m$. The readout shows the same line both ways. Only the point-slope version tells you the point.</p>`, ref:"pp. 1 to 2"},
    {type:"example", title:"A line through $(3, 2)$", ex:{q:"Find the point-slope equation of the line with slope $m = -\\frac{1}{2}$ that passes through the point $(3, 2)$.", ref:"p. 2",
      steps:[{t:"$y = y_0 + m(x - x_0)$",why:"Start from point-slope form."},{t:"$y = 2 - \\frac{1}{2}(x - 3)$",why:"Put in $x_0 = 3$, $y_0 = 2$, $m = -\\frac{1}{2}$."},{t:"Stop here. Do not 'simplify'.",why:"The NOTE on p. 2: the point of this form is to show the point $(3, 2)$. $y = \\frac{7}{2} - \\frac{1}{2}x$ is the same line, but it shows the $y$-intercept instead (p. 3)."}],
      ans:"$y = 2 - \\frac{1}{2}(x - 3)$"}},
    {type:"read", title:"The equation of the tangent line", body:`<p>$f'(a)$ is the slope of the tangent line to $y = f(x)$ at the point $(a, f(a))$. Put that point and that slope into point-slope form ($x_0 = a$, $y_0 = f(a)$, $m = f'(a)$):</p><div class="box def"><b class="t">Tangent line (p. 3)</b>The equation of the tangent line to $y = f(x)$ at $x = a$ is $$y = f(a) + f'(a)(x - a)$$</div><div class="box warn"><b class="t">Warning (p. 3)</b>Don't forget to include the $y =$ part of the equation. Without it, it is not an equation, and quizzes take marks off for that.</div>`, ref:"p. 3"},
    {type:"example", title:"Tangent line to $\\sin(x)$", ex:{q:"Find the equation of the tangent line to $f(x) = \\sin(x)$ at $a = \\frac{\\pi}{3}$.", ref:"p. 3",
      steps:[{t:"$y = f(a) + f'(a)(x - a)$",why:"Always start from the formula."},{t:"$f'(x) = \\cos(x)$",why:"Derivative table from Lecture 1."},{t:"$y = f\\left(\\frac{\\pi}{3}\\right) + f'\\left(\\frac{\\pi}{3}\\right)\\left(x - \\frac{\\pi}{3}\\right)$",why:"Put in $a = \\frac{\\pi}{3}$."},{t:"$y = \\frac{\\sqrt{3}}{2} + \\frac{1}{2}\\left(x - \\frac{\\pi}{3}\\right)$",why:"$\\sin\\left(\\frac{\\pi}{3}\\right) = \\frac{\\sqrt{3}}{2}$ and $\\cos\\left(\\frac{\\pi}{3}\\right) = \\frac{1}{2}$."}],
      ans:"$y = \\frac{\\sqrt{3}}{2} + \\frac{1}{2}\\left(x - \\frac{\\pi}{3}\\right)$"}},
    {type:"try", title:"Your turn: tangent lines", gen:"L02.g.tanline"},
    {type:"read", title:"Using the tangent line to approximate", body:`<p>Close to $a$, the tangent line and the curve are almost the same. So you can use the line's height in place of the function's value (p. 4):</p><div class="box def"><b class="t">Tangent line (linear) approximation (p. 4)</b>$$f(x) \\approx f(a) + f'(a)(x - a)$$ when $x$ is close to $a$.</div><div class="box warn"><b class="t">Warning (p. 4)</b>Keep these apart:<br>the tangent line: $y = f(a) + f'(a)(x - a)$<br>the tangent line approximation: $f(x) \\approx f(a) + f'(a)(x - a)$</div><p>To approximate a number, pick the $x$ that makes $f(x)$ equal to that number (Warning, p. 5). This is the step quizzes test most.</p>`, ref:"pp. 4 to 5"},
    {type:"explore", title:"How good is the tangent line?", fig:"tanapprox", ref:"pp. 4 to 5", body:`<p>The dashed line is the tangent line at $a$. The hollow dot is the true value $f(x)$ and the filled dot is what the tangent line gives.</p><p><b>Try it.</b> On the first function, leave $a = -2$ and set $x = -1.9$: that is the example on p. 4, where $f(-1.9) = (1.1)^{1/4}$. Then drag $x$ far from $a$ and watch the error grow. Switch to $\\sqrt{x+1}$ with $a = 8$ and $x = 7$ for the p. 5 exercise.</p>`},
    {type:"example", title:"Approximate $(1.1)^{1/4}$", ex:{q:"Use the tangent line for $f(x) = (x+3)^{1/4}$ at $a = -2$ to approximate $(1.1)^{1/4}$.", ref:"p. 4",
      steps:[{t:"$f(x) \\approx f(a) + f'(a)(x - a)$",why:"The tangent line approximation."},{t:"$f'(x) = \\frac{1}{4}(x + 3)^{-3/4}$",why:"Power rule; the inside $x + 3$ has derivative 1."},{t:"$f(x) \\approx f(-2) + f'(-2)(x + 2) = 1 + \\frac{1}{4}(x + 2)$",why:"$f(-2) = 1^{1/4} = 1$ and $f'(-2) = \\frac{1}{4}(1)^{-3/4} = \\frac{1}{4}$."},{t:"Take $x = -1.9$",why:"$f(-1.9) = (-1.9 + 3)^{1/4} = (1.1)^{1/4}$. The $x$ must make $f(x)$ the value you want. $x = 1.1$ would give $(4.1)^{1/4}$."},{t:"$(1.1)^{1/4} = f(-1.9) \\approx 1 + \\frac{1}{4}(-1.9 + 2) = 1 + \\frac{1}{4}(0.1)$",why:"Substitute."},{t:"$= 1 + \\frac{1}{40} = \\frac{41}{40}$",why:"Arithmetic. The true value is about 1.0241, and $\\frac{41}{40} = 1.025$."}],
      ans:"$(1.1)^{1/4} \\approx \\frac{41}{40}$"}},
    {type:"mcq", title:"Which $x$ do you plug in?", q:"The tangent line of $f(x) = \\sqrt{1 + x}$ at $a = 0$ gives $f(x) \\approx 1 + \\frac{1}{2}x$. To approximate $\\sqrt{1.2}$, which $x$ do you use?", keep:true,
      opts:[["$x = 0.2$",true,"$f(0.2) = \\sqrt{1 + 0.2} = \\sqrt{1.2}$."],["$x = 1.2$",false,"$f(1.2) = \\sqrt{2.2}$. That is not the number you want."],["$x = 1.44$",false,"That is $1.2^2$; it has nothing to do with $f$."],["$x = 0$",false,"That only gives $f(0) = 1$, the point of tangency."]],
      after:"So $\\sqrt{1.2} \\approx 1 + \\frac{1}{2}(0.2) = 1.1$. The true value is about 1.0954."},
    {type:"try", title:"Your turn: approximate a value", gen:"L02.g.approx"},
    {type:"read", title:"Approximating a change", body:`<p>In science you often care how much something changes, not its exact value. A scientist studying a drug's effect on stomach acid cannot measure a fixed starting or ending amount, since that varies from person to person. They want to know by how much the drug changes it (p. 5).</p><p>Start from the linear approximation and subtract $f(a)$ from both sides:</p>$$f(x) - f(a) \\approx f'(a)(x - a)$$<p>The left side is the change in the $y$-values, $\\Delta y$. The bracket is the change in the $x$-values, $\\Delta x$.</p><div class="box def"><b class="t">Differential approximation (p. 5)</b>$$\\Delta y \\approx f'(a)\\Delta x$$ $a$ is the original $x$ value and $\\Delta x = x - a$.</div><p>In words: change in output ≈ slope at the start × change in input.</p>`, ref:"p. 5"},
    {type:"explore", title:"Rise along the curve vs rise along the tangent", fig:"diffapprox", ref:"p. 5", body:`<p>The thin vertical segment is the true change $\\Delta y$. The thick coloured segment is $f'(a)\\Delta x$, the rise along the tangent line.</p><p><b>Try it.</b> The figure starts at the p. 5 example: $a = 3$, $\\Delta x = -0.2$. Read off $\\Delta y \\approx -5.6$ against the true $-5.248$. Then slide $\\Delta x$ toward 0 and watch the two segments become the same length.</p>`},
    {type:"example", title:"Change in $y$ from 3 to 2.8", ex:{q:"Let $f(x) = x^3 + x + 3$. Approximate the change in $y$ if $x$ changes from 3 to 2.8.", ref:"p. 5",
      steps:[{t:"$f'(x) = 3x^2 + 1$",why:"Power rule."},{t:"$a = 3$",why:"$a$ is the original $x$ value."},{t:"$\\Delta x = x - a = 2.8 - 3 = -0.2$",why:"New minus original. $x$ goes down, so $\\Delta x$ is negative."},{t:"$\\Delta y \\approx f'(3)\\Delta x = (28)(-0.2) = -5.6$",why:"$f'(3) = 3(9) + 1 = 28$."}],
      ans:"$\\Delta y \\approx -5.6$ (the true change is $-5.248$)"}},
    {type:"try", title:"Your turn: approximate a change", gen:"L02.g.diffapprox"},
    {type:"mcq", title:"Spot the mistake", q:"A student approximates the change in $y = x^2$ as $x$ goes from 5 to 4.9:<br>(1) $f'(x) = 2x$<br>(2) $a = 4.9$<br>(3) $\\Delta x = 4.9 - 5 = -0.1$<br>(4) $\\Delta y \\approx f'(4.9)(-0.1) = -0.98$<br>Which is the first line with a mistake?", keep:true,
      opts:[["Line (1)",false,"$\\frac{d}{dx}x^2 = 2x$ is right."],["Line (2)",true,"$a$ is the original $x$ value, 5, not the new one."],["Line (3)",false,"$\\Delta x$ is right."],["Line (4)",false,"It carries the error from line (2), but line (2) came first."]],
      after:"With $a = 5$: $\\Delta y \\approx f'(5)(-0.1) = 10(-0.1) = -1$."},
    {type:"formulas", title:"Lecture 2 formulas"}
  ]
});
})();
