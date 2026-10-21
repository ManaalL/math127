/* Lecture 6 (Mon Sept 21): Initial value problems (1.2.3), piecewise defined functions and the absolute value function (2.1.1). Notes: 5 pages. */
(function(){
const M=M127;
const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; };
const Q=(n,d=1)=>{ if(d<0){ n=-n; d=-d; } const g=gcd(n,d); return {n:n/g,d:d/g}; };
const qadd=(a,b)=>Q(a.n*b.d+b.n*a.d,a.d*b.d), qsub=(a,b)=>Q(a.n*b.d-b.n*a.d,a.d*b.d), qmul=(a,b)=>Q(a.n*b.n,a.d*b.d);
const qtex=q=>M.frac(q.n,q.d), qasc=q=>q.d===1?String(q.n):`(${q.n}/${q.d})`;
const par=s=>String(s).trim().startsWith("-")?`(${s})`:String(s);
const csg=c=>c.n===0?"":c.n<0?`- ${qtex(Q(-c.n,c.d))}`:`+ ${qtex(c)}`;     // "+ 3", "- \frac{7}{2}"
const pT=(v,e)=>e.d===1?(e.n===1?v:`${v}^{${e.n}}`):`${v}^{${e.n}/${e.d}}`;
const tT=(c,v,e,first)=>{ if(c.n===0) return ""; const s=c.n<0?"-":(first?"":"+"); const ab=Q(Math.abs(c.n),c.d); if(e.n===0) return s+qtex(ab); return s+(ab.n===1&&ab.d===1?"":qtex(ab))+pT(v,e); };
const lineOpts=k=>Array.from({length:k},(_,i)=>`The first line with a mistake is (${i+1}).`);
const PI=Math.PI;

/* initial value problems: each returns {it (integrand TeX), ia (integrand ascii), Ft, Fa, sub (F(x0) written out), val {t,a}, C {t,a}, x0T, dom} */
function ivpPoly(a,b,x0,y0){ // dy/dx = a x + b
  const F=x=>qadd(qmul(Q(a,2),Q(x*x)),Q(b*x)); const v=F(x0), C=qsub(Q(y0),v);
  const ca=qtex(Q(a,2)), cc=ca==="1"?"":ca==="-1"?"-":ca;
  return {it:`${a===1?"":a===-1?"-":a}x ${b<0?"-":"+"} ${Math.abs(b)}`.replace(/ \+ 0$| - 0$/,""), ia:`${a}x + ${b}`,
    Ft:`${tT(Q(a,2),"x",Q(2),true)}${b?` ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}x`:""}`, Fa:`(${a}/2)x^2 + ${b}x`,
    sub:`${cc}(${x0})^2${b?` ${b<0?"-":"+"} ${Math.abs(b)}(${x0})`:""}`.replace(/\((-?\d+)\)/g,(m,g)=>g.startsWith("-")?`(${g})`:`(${g})`), val:{t:qtex(v),a:qasc(v),q:v}, C:{t:qtex(C),a:qasc(C),q:C}, x0T:String(x0), dom:[-3,3]};
}
const Cfinal=(C)=>C.q?(C.q.n===0?"":C.q.n<0?`- ${qtex(Q(-C.q.n,C.q.d))}`:`+ ${qtex(C.q)}`):(C.t.startsWith("-")?`- ${C.t.slice(1)}`:`+ ${C.t}`);

M127.lecture({
  id:"L06", n:6, date:"2026-09-21", added:"2026-10-21", unit:"u2", quiz:"Q3",
  title:"Initial Value Problems and Piecewise Functions", sections:["1.2.3","2.1.1"], pages:5,
  summary:"An initial value problem is a differential equation plus a starting point: find all solutions with $+C$, then use the initial condition to find $C$. Then piecewise defined functions, the absolute value function, and the properties of $|x|$, including $\\sqrt{x^2} = |x|$.",
  flags:[
    {ref:"p. 1", text:"The letter $C$ means two different things on p. 1. In $\\frac{dC}{dt} = -\\frac{\\ln(6)}{4}C$ it is the drug concentration. Two lines later, \"use the initial condition to solve for $C$\" means the constant of integration. They are not the same $C$."}
  ],
  formulas:[
    {id:"L06.f.drug", name:"Drug decay (a DE)", tex:"\\frac{dC}{dt} = -\\frac{\\ln(6)}{4}C", note:"Exponential decay of a drug in the bloodstream; $C$ is the concentration.", ref:"p. 1"},
    {id:"L06.f.drugivp", name:"Drug decay with a starting value (an IVP)", tex:"\\frac{dC}{dt} = -\\frac{\\ln(6)}{4}C, \\qquad C(0) = 1.5", note:"Initial concentration 1.5 mg/ml.", ref:"p. 1"},
    {id:"L06.f.ivp", name:"Initial value problem", tex:"\\text{IVP} = \\text{differential equation} + \\text{initial condition(s)}", ref:"p. 1", blank:{tex:"\\text{IVP} = \\text{differential equation} + \\boxed{\\,?\\,}", text:true, accept:["initial condition","initial conditions","initial condition(s)","an initial condition"]}},
    {id:"L06.f.method", name:"Solving an IVP", tex:"y = \\int f(x)\\,dx = F(x) + C, \\quad \\text{then use } y(x_0) = y_0 \\text{ to solve for } C", note:"First find all solutions of the DE, then substitute the initial condition.", ref:"pp. 1 to 2"},
    {id:"L06.f.piecewise", name:"Piecewise defined function", tex:"\\text{different definitions on different parts of its domain}", ref:"p. 3"},
    {id:"L06.f.abs", name:"Absolute value", tex:"|x| = \\begin{cases} -x & \\text{if } x < 0 \\\\ x & \\text{if } x \\ge 0 \\end{cases}", ref:"p. 3", blank:{tex:"|x| = \\begin{cases} \\boxed{\\,?\\,} & \\text{if } x < 0 \\\\ x & \\text{if } x \\ge 0 \\end{cases}", answer:"-x", vars:["x"], domain:[-3,-0.5]}},
    {id:"L06.f.absf", name:"Absolute value of a function", tex:"f(x) < 0 \\Rightarrow |f(x)| = -f(x); \\qquad f(x) \\ge 0 \\Rightarrow |f(x)| = f(x)", ref:"p. 4", blank:{tex:"f(x) < 0 \\Rightarrow |f(x)| = \\boxed{\\,?\\,}", text:true, accept:["-f(x)","−f(x)","-f"]}},
    {id:"L06.f.p1", name:"Property (i)", tex:"|x| = \\sqrt{x^2}", ref:"p. 4", blank:{tex:"|x| = \\boxed{\\,?\\,}", answer:"sqrt(x^2)", vars:["x"]}},
    {id:"L06.f.p2", name:"Property (ii)", tex:"|xy| = |x|\\,|y|", ref:"p. 4", blank:{tex:"|xy| = \\boxed{\\,?\\,}", answer:"abs(x)*abs(y)", vars:["x","y"]}},
    {id:"L06.f.p3", name:"Property (iii)", tex:"|x| = a \\iff x = \\pm a", note:"for any $a \\ge 0$", ref:"p. 4", blank:{tex:"|x| = a \\iff \\boxed{\\,?\\,}", text:true, accept:["x=±a","x = ±a","x=+-a","x = +-a","x=a or x=-a","x = a or x = -a","x=±a, a≥0"]}},
    {id:"L06.f.p4", name:"Property (iv)", tex:"|x| < a \\iff -a < x < a", note:"for any $a > 0$", ref:"p. 4", blank:{tex:"|x| < a \\iff \\boxed{\\,?\\,}", text:true, accept:["-a<x<a","-a < x < a","−a<x<a","−a < x < a"]}},
    {id:"L06.f.p5", name:"Property (v)", tex:"|x| > a \\iff x < -a \\text{ or } x > a", note:"for any $a > 0$", ref:"p. 4", blank:{tex:"|x| > a \\iff \\boxed{\\,?\\,}", text:true, accept:["x<-a or x>a","x < -a or x > a","x>a or x<-a","x > a or x < -a","x<−a or x>a"]}}
  ],
  glossary:[
    {id:"L06.t.ivp", term:"Initial value problem (IVP)", def:"A differential equation together with initial condition(s). The DE is the general principle; the condition picks out one specific case.", ref:"p. 1"},
    {id:"L06.t.ic", term:"Initial condition", def:"A known point on the solution, like $y(2) = -3$: when $x = 2$, $y = -3$. You use it to find the value of $C$.", ref:"pp. 1 to 2"},
    {id:"L06.t.piece", term:"Piecewise defined function", def:"A function with different formulas on different parts of its domain. To evaluate it, first find which condition your $x$ satisfies.", ref:"p. 3"},
    {id:"L06.t.domain", term:"Domain of a piecewise function", def:"Every $x$ covered by at least one piece. If no condition includes a point (like $x = 3$ in the example on p. 3), that point is not in the domain.", ref:"p. 3"},
    {id:"L06.t.abs", term:"Absolute value", def:"$|x| = -x$ if $x < 0$ and $|x| = x$ if $x \\ge 0$. It is a piecewise defined function, and its output is never negative.", ref:"p. 3"},
    {id:"L06.t.sqrt", term:"$\\sqrt{x^2} = |x|$", def:"Property (i). The square root is never negative, so $\\sqrt{x^2}$ is $x$ only when $x \\ge 0$. For $x < 0$ it is $-x$.", ref:"p. 4"}
  ],
  figures:{
    ivp:{title:"One point picks one solution", cap:"<b>Fig. 6.1</b> All solutions of $\\frac{dy}{dx} = f(x)$ form a family $y = F(x) + C$ (faint curves). An initial condition $y(x_0) = y_0$ is a single point, and exactly one curve passes through it. (Lecture 6, pp. 1 to 2)",
      build(host,{PLOT}){
        const S={lin:{f:"x + 1",F:x=>x*x/2+x,Ft:"½x² + x",p:[2,-3]},sq:{f:"x²",F:x=>x*x*x/3,Ft:"⅓x³",p:[1,3]},cos:{f:"cos(x)",F:Math.sin,Ft:"sin(x)",p:[PI/3,5]}};
        let key="lin", x0=2, y0=-3;
        const G=PLOT.graph(host,{x:[-4.2,4.2],y:[-8.5,8.5],c:"var(--u2)",xlabel:"x",ylabel:"y",xstep:1,ystep:2});
        const Cs=[-8,-6,-4,-2,0,2,4,6,8];
        const faint=Cs.map(k=>{ const p=G.fn(x=>S[key].F(x)+k); p.style.opacity=".28"; return p; });
        const main=G.fn(x=>S[key].F(x)+y0-S[key].F(x0),{cls:"cv c"});
        const hx=G.line(0,0,0,0,{cls:"lt dash"}), hy=G.line(0,0,0,0,{cls:"lt dash"});
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Differential equation",items:[["lin","dy/dx = x + 1"],["sq","dy/dx = x²"],["cos","dy/dx = cos(x)"]],value:"lin",onchange:v=>{ key=v; [x0,y0]=S[v].p; faint.forEach((p,i)=>p.update(x=>S[key].F(x)+Cs[i])); H.remove(); H=mk(); draw(); }});
        const ro=PLOT.readout(host);
        const mk=()=>G.handle(x0,y0,{bounds:[-4,4],label:"Initial condition point",onMove:(x,y)=>{ x0=x; y0=y; draw(); }});
        let H=mk();
        function draw(){
          const s=S[key], C=y0-s.F(x0);
          main.update(x=>s.F(x)+C); hx.set(x0,0,x0,y0); hy.set(0,y0,x0,y0);
          ro.innerHTML=`dy/dx = ${s.f}: all solutions y = ${s.Ft} + C<br>initial condition y(<b>${x0.toFixed(2)}</b>) = <b>${y0.toFixed(2)}</b> &nbsp; so ${y0.toFixed(2)} = ${s.F(x0).toFixed(3)} + C &nbsp; C = <b>${C.toFixed(3)}</b>`;
        }
        draw();
      }},
    piecewise:{title:"Which piece?", cap:"<b>Fig. 6.2</b> Left: the example on p. 3, $f(x) = x^2 - 3$ if $x < -1$, $7$ if $-1 \\le x < 3$, $\\cos(x)$ if $x > 3$. Right: $|x|$ as a piecewise function. A filled dot means that endpoint belongs to the piece; an open dot means it does not. (Lecture 6, p. 3)",
      build(host,{PLOT}){
        const S={ex:{x:[-4.2,6.6],y:[-4,9.6],ys:2,pieces:[{f:x=>x*x-3,from:-4.2,to:-1,tex:"x² − 3",cond:x=>x<-1,ct:"x < −1"},{f:()=>7,from:-1,to:3,tex:"7",cond:x=>x>=-1&&x<3,ct:"−1 ≤ x < 3"},{f:Math.cos,from:3,to:6.6,tex:"cos(x)",cond:x=>x>3,ct:"x > 3"}],
                      dots:[[-1,-2,0],[-1,7,1],[3,7,0],[3,Math.cos(3),0]], x0:-2},
                 abs:{x:[-4.2,4.2],y:[-1.2,4.6],ys:1,pieces:[{f:x=>-x,from:-4.2,to:0,tex:"−x",cond:x=>x<0,ct:"x < 0"},{f:x=>x,from:0,to:4.2,tex:"x",cond:x=>x>=0,ct:"x ≥ 0"}], dots:[[0,0,1]], x0:-3}};
        let key="ex", xv=-2;
        const opt={x:S.ex.x,y:S.ex.y,c:"var(--u2)",xlabel:"x",ylabel:"y",xstep:1,ystep:2};
        const G=PLOT.graph(host,opt);
        let paths=[], dots=[];
        const vl=G.line(0,0,0,0,{cls:"lt dash"}), pt=G.dot(0,0,{filled:true,r:4.5});
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Function",items:[["ex","Example on p. 3"],["abs","|x|"]],value:"ex",onchange:v=>{ key=v; const s=S[v]; opt.ystep=s.ys; G.setView(s.x,s.y); setup(); H.move(s.x0); }});
        const ro=PLOT.readout(host);
        function setup(){ paths.forEach(p=>p.remove()); dots.forEach(d=>d.remove()); const s=S[key];
          paths=s.pieces.map(p=>G.fn(p.f,{from:p.from,to:p.to,cls:"cv c"}));
          dots=s.dots.map(([x,y,c])=>c?G.closed(x,y):G.open(x,y)); }
        setup();
        const H=G.handle(xv,0,{axis:"x",bounds:[-4,6.5],snap:0.25,label:"x value",onMove:x=>{ xv=x; draw(); }});
        function draw(){
          const s=S[key]; const lo=s.x[0]+0.2, hi=s.x[1]-0.2; if(xv<lo||xv>hi){ H.move(Math.max(lo,Math.min(hi,xv))); return; }
          const p=s.pieces.find(q=>q.cond(xv));
          if(!p){ vl.set(xv,0,xv,0); pt.style.display="none"; ro.innerHTML=`x = <b>${xv.toFixed(2)}</b>: no condition includes this x, so it is not in the domain. f has no value here.`; return; }
          const y=p.f(xv); pt.style.display=""; pt.set(xv,y); vl.set(xv,0,xv,y);
          ro.innerHTML=`x = <b>${xv.toFixed(2)}</b> satisfies <b>${p.ct}</b>, so use ${p.tex}: &nbsp; f(${xv.toFixed(2)}) = <b>${y.toFixed(3)}</b>`;
        }
        draw();
      }},
    sqrtabs:{title:"The square root of a square", cap:"<b>Fig. 6.3</b> y = √(x²) (colour) next to $y = x$ (dashed). They agree for $x \\ge 0$. For $x < 0$, √(x²) $= -x$, so y = √(x²) is the graph of $|x|$. (Lecture 6, p. 4)",
      build(host,{PLOT}){
        const G=PLOT.graph(host,{x:[-4.2,4.2],y:[-4.4,4.6],c:"var(--u2)",xlabel:"x",ylabel:"y",xstep:1,ystep:1});
        G.fn(x=>x,{cls:"ln dash"});
        G.fn(x=>Math.sqrt(x*x),{cls:"cv c"});
        G.label(2.3,3.6,"y = √(x²)",{cls:"lblc"}); G.label(2.2,1.3,"y = x",{cls:"lbl"});
        const vl=G.line(0,0,0,0,{cls:"lt dash"}), p1=G.dot(0,0,{filled:true,r:4}), p2=G.dot(0,0,{r:4});
        const ro=PLOT.readout(host);
        const upd=x=>{ const s=Math.sqrt(x*x); vl.set(x,Math.min(0,x),x,Math.max(s,x)); p1.set(x,s); p2.set(x,x);
          ro.innerHTML=`x = <b>${x.toFixed(2)}</b> &nbsp; √(x²) = √${(x*x).toFixed(4).replace(/\.?0+$/,"")} = <b>${s.toFixed(2)}</b> = |x| &nbsp; ${x<0?`(this is −x, not x)`:`(equal to x, since x ≥ 0)`}<br>(√x)² = ${x<0?"not defined: √x needs x ≥ 0":`<b>${x.toFixed(2)}</b>`}`; };
        G.handle(-2.5,0,{axis:"x",bounds:[-4,4],snap:0.25,label:"x value",onMove:x=>upd(x)}); upd(-2.5);
      }}
  },
  gens:[
    {id:"L06.g.ivp", title:"Solve an initial value problem", skill:"Integrate with $+C$, then use the initial condition to find $C$", ref:"pp. 1 to 2",
      gen(R,d){
        let P, v="x";
        if(d===1){ const a=R.nz(-4,4), b=R.int(-5,5), x0=R.int(-2,3), y0=R.int(-9,9); P=ivpPoly(a,b,x0,y0); P.y0=y0; }
        else if(d===2){ const kind=R.pick(["sq","rt","exp","trig"]);
          if(kind==="sq"){ const a=R.nz(-3,3), b=R.int(-5,5), x0=R.int(-2,2), y0=R.int(-9,9);
            const F=x=>qadd(Q(a*x*x*x,3),Q(b*x)), val=F(x0), C=qsub(Q(y0),val);
            P={it:`${a===1?"":a===-1?"-":a}x^2${b?` ${b<0?"-":"+"} ${Math.abs(b)}`:""}`, ia:`${a}x^2 + ${b}`, Ft:`${tT(Q(a,3),"x",Q(3),true)}${b?` ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}x`:""}`, Fa:`(${a}/3)x^3 + ${b}x`,
              sub:`${qtex(Q(a,3))}(${x0})^3${b?` ${b<0?"-":"+"} ${Math.abs(b)}(${x0})`:""}`, val:{t:qtex(val),a:qasc(val),q:val}, C:{t:qtex(C),a:qasc(C),q:C}, x0T:String(x0), y0, dom:[-2,2]}; }
          else if(kind==="rt"){ const k=R.nz(-3,3), r=R.int(1,3), x0=r*r, y0=R.int(-8,8); const val=Q(2*k*r), C=qsub(Q(y0),val);
            P={it:`\\frac{${k}}{\\sqrt{x}}`.replace("\\frac{-","-\\frac{"), ia:`${k}/sqrt(x)`, Ft:`${2*k}\\sqrt{x}`, Fa:`${2*k}sqrt(x)`, sub:`${2*k}\\sqrt{${x0}}`, val:{t:qtex(val),a:qasc(val),q:val}, C:{t:qtex(C),a:qasc(C),q:C}, x0T:String(x0), y0, dom:[0.5,9], note:`Write $\\frac{1}{\\sqrt x} = x^{-1/2}$: the power rule gives $\\frac{x^{1/2}}{1/2} = 2\\sqrt{x}$.`}; }
          else if(kind==="exp"){ const a=R.int(1,5), b=R.int(1,4); let y0=R.int(-6,9); v=R.pick(["x","t"]); if(a===1&&b===3&&y0===5) y0=6;   /* dy/dx = 1 - 3e^x, y(0) = 5 is a real quiz question */ const val=Q(-b), C=qsub(Q(y0),val);
            P={it:`${a} - ${b===1?"":b}e^{${v}}`, ia:`${a} - ${b}e^(${v})`, Ft:`${a===1?"":a}${v} - ${b===1?"":b}e^{${v}}`, Fa:`${a}${v} - ${b}e^(${v})`, sub:`${a}(0) - ${b===1?"":b}e^{0}`, val:{t:qtex(val),a:qasc(val),q:val}, C:{t:qtex(C),a:qasc(C),q:C}, x0T:"0", y0, dom:[-2,2]}; }
          else { const k=R.int(1,4), isSin=R.int(0,1)===0, X=R.pick([["0",0],["\\pi",PI],["\\frac{\\pi}{2}",PI/2]]), y0=R.int(-6,8);
            const raw=isSin?-k*Math.cos(X[1]):k*Math.sin(X[1]); const val=Q(Math.round(raw)), C=qsub(Q(y0),val); const kk=k===1?"":k;
            P={it:`${kk}\\${isSin?"sin":"cos"}(x)`, ia:`${k}*${isSin?"sin":"cos"}(x)`, Ft:isSin?`-${kk}\\cos(x)`:`${kk}\\sin(x)`, Fa:isSin?`-${k}*cos(x)`:`${k}*sin(x)`, sub:isSin?`-${kk}\\cos\\left(${X[0]}\\right)`:`${kk}\\sin\\left(${X[0]}\\right)`, val:{t:qtex(val),a:qasc(val),q:val}, C:{t:qtex(C),a:qasc(C),q:C}, x0T:X[0], y0, dom:[-2,2]}; } }
        else { const kind=R.pick(["cos","frac","split","exp2"]);
          if(kind==="cos"){ const k=R.int(1,2), X=R.pick([["\\frac{\\pi}{3}",["\\frac{\\sqrt{3}}{2}","sqrt(3)/2"],["\\sqrt{3}","sqrt(3)"]],["\\frac{\\pi}{6}",["\\frac{1}{2}","1/2",Q(1,2)],["1","1",Q(1)]],["\\frac{\\pi}{4}",["\\frac{1}{\\sqrt{2}}","1/sqrt(2)"],["\\sqrt{2}","sqrt(2)"]]]); const y0=R.nz(-4,8);
            const V=X[k]; const val={t:V[0],a:V[1],q:V[2]};
            const C=V[2]?{t:qtex(qsub(Q(y0),V[2])),a:qasc(qsub(Q(y0),V[2])),q:qsub(Q(y0),V[2])}:{t:`${y0} - ${V[0]}`,a:`${y0} - ${V[1]}`};
            P={it:`${k===1?"":k}\\cos(x)`, ia:`${k}*cos(x)`, Ft:`${k===1?"":k}\\sin(x)`, Fa:`${k}*sin(x)`, sub:`${k===1?"":k}\\sin\\left(${X[0]}\\right)`, val, C, x0T:X[0], y0, dom:[-2,2]}; }
          else if(kind==="frac"){ const E=R.pick([[Q(-1,3),3,"x^{-1/3}"],[Q(1,2),2,"\\sqrt{x}"],[Q(2,3),3,"x^{2/3}"]]); const e=E[0], q=E[1], r=R.int(1,2), x0=Math.pow(r,q), c=R.pick([1,2,3]), y0=R.int(-5,8);
            const e1=Q(e.n+e.d,e.d), coef=qmul(Q(c),Q(e1.d,e1.n)); const val=qmul(coef,Q(Math.pow(r,e1.n))), C=qsub(Q(y0),val);
            P={it:`${c===1?"":c}${E[2]}`, ia:`${c}*x^(${e.n}/${e.d})`, Ft:tT(coef,"x",e1,true), Fa:`(${coef.n}/${coef.d})*x^(${e1.n}/${e1.d})`, sub:`${qtex(coef)}(${x0})^{${e1.n}/${e1.d}}`, val:{t:qtex(val),a:qasc(val),q:val}, C:{t:qtex(C),a:qasc(C),q:C}, x0T:String(x0), y0, dom:[0.5,8], note:`Power rule: add 1 to the power, $${qtex(e)} + 1 = ${qtex(e1)}$, and divide by $${qtex(e1)}$. Then $(${x0})^{${e1.n}/${e1.d}} = ${Math.pow(r,e1.n)}$.`}; }
          else if(kind==="split"){ const a=R.nz(-4,4), y0=R.int(-5,8); const val=Q(1-a), C=qsub(Q(y0),val);
            P={it:`\\frac{x^2 ${a<0?"-":"+"} ${Math.abs(a)}}{x^2}`, ia:`(x^2 + ${a})/x^2`, Ft:`x ${a<0?"+":"-"} \\frac{${Math.abs(a)}}{x}`, Fa:`x - ${a}/x`, sub:`1 ${a<0?"+":"-"} \\frac{${Math.abs(a)}}{1}`, val:{t:qtex(val),a:qasc(val),q:val}, C:{t:qtex(C),a:qasc(C),q:C}, x0T:"1", y0, dom:[0.4,3], note:`Split first: $\\frac{x^2 ${a<0?"-":"+"} ${Math.abs(a)}}{x^2} = 1 ${a<0?"-":"+"} ${Math.abs(a)===1?"":Math.abs(a)}x^{-2}$.`}; }
          else { const a=R.nz(-3,3), b=R.int(1,4), y0=R.int(-5,8); v="t"; const val=Q(b), C=qsub(Q(y0),val);
            P={it:`${a===1?"":a===-1?"-":a}\\cos(t) + ${b===1?"":b}e^{t}`, ia:`${a}*cos(t) + ${b}e^t`, Ft:`${a===1?"":a===-1?"-":a}\\sin(t) + ${b===1?"":b}e^{t}`, Fa:`${a}*sin(t) + ${b}e^t`, sub:`${a===1?"":a===-1?"-":a}\\sin(0) + ${b===1?"":b}e^{0}`, val:{t:qtex(val),a:qasc(val),q:val}, C:{t:qtex(C),a:qasc(C),q:C}, x0T:"0", y0, dom:[-2,2]}; } }
        const dv=v==="t"?"t":"x";
        const yfin=`${P.Ft} ${Cfinal(P.C)}`.trim();
        const solveC=P.C.q?`$${P.y0} ${P.val.q.n<0?"+ "+qtex(Q(-P.val.q.n,P.val.q.d)):"- "+P.val.t} = C$, so $C = ${P.C.t}$`:`$C = ${P.C.t}$`;
        return {prompt:`Solve the initial value problem $\\frac{dy}{d${dv}} = ${P.it}$, $\\ y(${P.x0T}) = ${P.y0}$.`,
          parts:[{label:"Solution: $y =$", answer:{answer:`${P.Fa} + (${P.C.a})`, vars:[dv], domain:P.dom}},{label:"The value of $C$", answer:{type:"num", answer:P.C.a}}],
          verify:{antideriv:P.ia, v:dv},
          hint:`Step 1: all solutions are $y = \\int (${P.it})\\,d${dv} = F(${dv}) + C$. Step 2: put $${dv} = ${P.x0T}$ and $y = ${P.y0}$ into that and solve for $C$.`,
          steps:[`All solutions of the differential equation are given by $y = \\int ${P.it.includes(" ")||P.it.includes("frac")?`\\left(${P.it}\\right)`:P.it}\\,d${dv} = ${P.Ft} + C$.`+(P.note?` ${P.note}`:""),
            `The initial condition $y(${P.x0T}) = ${P.y0}$ tells us that $y = ${P.y0}$ when $${dv} = ${P.x0T}$.`,
            `$${P.y0} = ${P.sub} + C$`, `$${P.y0} = ${P.val.t} + C$`, solveC+".",
            `Therefore, the solution to the initial value problem is $y = ${yfin}$.`],
          answerTeX:`$y = ${yfin}$`};
      }},
    {id:"L06.g.ivperr", title:"Find the mistake in an IVP", skill:"Spot wrong antiderivatives, swapped substitutions, sign slips and missing notation in IVP solutions", ref:"pp. 1 to 2",
      gen(R,d){
        if(d===1){
          const a=R.nz(-3,3)*2, b=R.int(-4,4), x0=R.int(-2,3); let y0=R.int(-8,8);
          const F=x=>qadd(Q(a*x*x,2),Q(b*x)), Fw=x=>Q(a*x*x+b*x);
          if(F(x0).n===y0&&F(x0).d===1) y0+=1;
          const e=R.pick([2,3,4,5]);
          const ftex=`${a}x${b?` ${b<0?"-":"+"} ${Math.abs(b)}`:""}`;
          const Ft=`${tT(Q(a,2),"x",Q(2),true)}${b?` ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}x`:""}`;
          const Fwt=`${tT(Q(a),"x",Q(2),true)}${b?` ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}x`:""}`;
          const useW=e===2; const FF=useW?Fw:F, FFt=useW?Fwt:Ft;
          const xin=e===3?y0:x0, lhs=e===3?x0:y0;
          const sub=`${qtex(useW?Q(a):Q(a,2))}(${xin})^2${b?` ${b<0?"-":"+"} ${Math.abs(b)}(${xin})`:""}`.replace(/^1\(/,"(").replace(/^-1\(/,"-(");
          let val=FF(xin); if(e===4) val=qadd(val,Q(R.pick([1,-1,2])));
          let C=qsub(Q(lhs),val); if(e===5) C=qsub(val,Q(lhs));
          const L=[`$y = \\int (${ftex})\\,dx$`,`$y = ${FFt} + C$`,`$${lhs} = ${sub} + C$`,`$${lhs} = ${qtex(val)} + C$`,`$C = ${qtex(C)}$`,`Therefore $y = ${FFt} ${csg(C)}$.`];
          const Fx0=F(x0), Cok=qsub(Q(y0),Fx0);
          const why={2:`Line (2) has the wrong antiderivative: $\\int ${a}x\\,dx = ${tT(Q(a,2),"x",Q(2),true)}$, not $${tT(Q(a),"x",Q(2),true)}$. Check by differentiating.`,
            3:`Line (3) swaps the roles of $x$ and $y$. $y(${x0}) = ${y0}$ means $x = ${x0}$ and $y = ${y0}$, so the line should be $${y0} = F(${x0}) + C$.`,
            4:`Line (4) evaluates $F(${x0})$ wrong. It should be $${qtex(Fx0)}$.`,
            5:`Line (5) has a sign slip solving for $C$: from $${y0} = ${qtex(Fx0)} + C$ you get $C = ${y0} - ${par(qtex(Fx0))} = ${qtex(Cok)}$.`};
          return {prompt:`A problem and answer are shown. The answer would not get a perfect score. Select the first line that has a mistake.<div class="box note"><b class="t">Problem</b>Solve the initial value problem $\\frac{dy}{dx} = ${ftex}$, $y(${x0}) = ${y0}$.</div><div class="box note"><b class="t">Answer</b><ol>${L.map(s=>`<li>${s}</li>`).join("")}</ol></div>`,
            parts:[{answer:{type:"mc",options:lineOpts(6),correct:e-1,keep:true}}],
            hint:"Check the antiderivative by differentiating, then check that $x_0$ went in for $x$ and $y_0$ for $y$, then the arithmetic.",
            steps:[why[e],`Correct solution: $y = ${Ft} + C$, $${y0} = ${qtex(Fx0)} + C$, $C = ${qtex(Cok)}$, so $y = ${Ft} ${csg(Cok)}$.`],
            answerTeX:`Line (${e})`};
        }
        if(d===2){
          const k=R.int(1,4), isSin=R.int(0,1)===0, X=isSin?R.pick([["0",0],["\\pi",PI]]):R.pick([["\\frac{\\pi}{2}",PI/2],["\\pi",PI]]); let y0=R.int(-5,7);
          const kk=k===1?"":k, fn=isSin?"\\sin":"\\cos";
          const Fgood=isSin?`-${kk}\\cos(x)`:`${kk}\\sin(x)`, Fbad=isSin?`${kk}\\cos(x)`:`-${kk}\\sin(x)`;
          const gv=Math.round(isSin?-k*Math.cos(X[1]):k*Math.sin(X[1]));
          if(gv===y0) y0+=1;
          const e=R.pick([1,2,6]); const Ft=e===2?Fbad:Fgood; const v=e===2?-gv:gv;
          const subT=(e===2?Fbad:Fgood).replace("(x)",`\\left(${X[0]}\\right)`);
          const C=y0-v, Cok=y0-gv;
          const sgn=c=>c===0?"":c<0?`- ${-c}`:`+ ${c}`;
          const L=[e===1?`$y = \\int ${kk}${fn}(x)$`:`$y = \\int ${kk}${fn}(x)\\,dx$`,`$y = ${Ft} + C$`,`$${y0} = ${subT} + C$`,`$${y0} = ${v} + C$`,`$C = ${C}$`,e===6?`Therefore the solution is $${Ft} ${sgn(C)}$.`:`Therefore $y = ${Ft} ${sgn(C)}$.`];
          const why={1:"Line (1) is missing the $dx$. An integral without its differential is not valid notation.",2:`Line (2) has the wrong sign: $\\int ${fn}(x)\\,dx = ${isSin?"-\\cos(x)":"\\sin(x)"} + C$. Check: $\\frac{d}{dx}(${Fbad}) = ${isSin?`-${kk}\\sin(x)`:`-${kk}\\cos(x)`}$.`,6:"Line (6) is not an equation: it is missing the \"$y =$\". The final answer must say what $y$ is."};
          return {prompt:`A problem and answer are shown. The answer would not get a perfect score. Select the first line that has a mistake.<div class="box note"><b class="t">Problem</b>Solve the initial value problem $\\frac{dy}{dx} = ${kk}${fn}(x)$, $y\\left(${X[0]}\\right) = ${y0}$.</div><div class="box note"><b class="t">Answer</b><ol>${L.map(s=>`<li>${s}</li>`).join("")}</ol></div>`,
            parts:[{answer:{type:"mc",options:lineOpts(6),correct:e-1,keep:true}}],
            hint:"Notation counts: every integral needs its $dx$, and the final answer needs \"$y =$\". Also check the sign of the antiderivative.",
            steps:[why[e],`Correct solution: $y = ${Fgood} + C$, $${y0} = ${gv} + C$, $C = ${Cok}$, so $y = ${Fgood} ${sgn(Cok)}$.`],
            answerTeX:`Line (${e})`};
        }
        const k=R.nz(-3,3), r=R.int(1,3), x0=r*r; let y0=R.int(-6,8); const val=2*k*r; if(val===y0) y0+=1; const C=y0-val;
        const sgn=c=>c===0?"":c<0?`- ${-c}`:`+ ${c}`;
        const it=`\\frac{${k}}{\\sqrt{x}}`.replace("\\frac{-","-\\frac{");
        const head=`$y = \\int ${it}\\,dx = ${2*k}\\sqrt{x} + C$<br>Using $y(${x0}) = ${y0}$: $${y0} = ${2*k}\\sqrt{${x0}} + C = ${val} + C$`;
        const good=`${head}, so $C = ${C}$.<br>Therefore $y = ${2*k}\\sqrt{x} ${sgn(C)}$.`;
        const bads=R.shuffle([[`${head}, so $C = ${y0}$.<br>Therefore $y = ${2*k}\\sqrt{x} ${sgn(y0)}$.`,`sets $C = ${y0}$, the $y$-value, instead of solving $${y0} = ${val} + C$ for $C$`],
          [`${head}, so $C = ${C}$.<br>Therefore the solution is $${2*k}\\sqrt{x} ${sgn(C)}$.`,"never writes \"$y =$\", so the final answer is not an equation"],
          [`$y = \\int ${it}\\,dx = ${-k}\\cdot\\frac{1}{2}x^{-3/2} + C$<br>Using $y(${x0}) = ${y0}$ to find $C$, the solution is $y = ${2*k}\\sqrt{x} ${sgn(C)}$.`,"differentiates instead of integrating in the first line"],
          [`$y = \\int ${it}\\,dx = ${2*k}\\sqrt{x} + C$<br>Therefore $y = ${2*k}\\sqrt{x} + C$.`,"never uses the initial condition, so $C$ is still unknown"]]).slice(0,2);
        const all=[[good,""],...bads]; const o=R.shuffle([0,1,2]); const shown=o.map(i=>all[i]);
        return {prompt:`A question and three answers are shown. Select the correct answer.<div class="box note"><b class="t">Problem</b>Solve the initial value problem $y' = ${it}$, $y(${x0}) = ${y0}$.</div>${shown.map((s,i)=>`<div class="box note"><b class="t">Answer #${i+1}</b>${s[0]}</div>`).join("")}`,
          parts:[{answer:{type:"mc",options:[1,2,3].map(i=>`Answer #${i} is correct.`),correct:o.indexOf(0),keep:true}}],
          hint:"A full answer integrates with $+C$, substitutes the initial condition, solves for $C$, and ends with $y = \\dots$.",
          steps:shown.map((s,i)=>s[1]?`Answer #${i+1} ${s[1]}.`:`Answer #${i+1} is correct: $${y0} = ${val} + C$ gives $C = ${C}$, and it ends with $y = ${2*k}\\sqrt{x} ${sgn(C)}$.`),
          answerTeX:`Answer #${o.indexOf(0)+1}`};
      }},
    {id:"L06.g.piecewise", title:"Evaluate a piecewise function", skill:"Pick the right piece (watch $<$ versus $\\le$) and find the domain", ref:"p. 3",
      gen(R,d){
        const p=R.int(-3,0), q=p+R.int(2,4), c1=R.int(-4,3), c2=R.nz(-6,8), m=R.nz(-3,3), c3=R.int(-3,4);
        const P1={t:`x^2 ${c1<0?"-":"+"} ${Math.abs(c1)}`.replace(" + 0",""), f:x=>x*x+c1, s:x=>`(${x})^2 ${c1<0?"-":"+"} ${Math.abs(c1)}`.replace(" + 0","")};
        const P2={t:String(c2), f:()=>c2, s:()=>String(c2)};
        const P3=R.int(0,1)===0?{t:`${m===1?"":m===-1?"-":m}x ${c3<0?"-":"+"} ${Math.abs(c3)}`.replace(" + 0",""), f:x=>m*x+c3, s:x=>`${m}(${x}) ${c3<0?"-":"+"} ${Math.abs(c3)}`.replace(" + 0","")}:{t:"\\cos(x)", f:Math.cos, s:x=>`\\cos(${x})`, cos:true};
        if(d<3){
          const in2=R.int(0,1)===0; // does piece 2 include its left end?
          const c=[`x ${in2?"<":"\\le"} ${p}`,`${p} ${in2?"\\le":"<"} x < ${q}`,`x \\ge ${q}`];
          const cond=[x=>in2?x<p:x<=p, x=>(in2?x>=p:x>p)&&x<q, x=>x>=q];
          const fx=`f(x) = \\begin{cases} ${P1.t} & \\text{if } ${c[0]} \\\\ ${P2.t} & \\text{if } ${c[1]} \\\\ ${P3.t} & \\text{if } ${c[2]} \\end{cases}`;
          const xs=d===1?R.pick([p-R.int(1,2),R.int(p+1,q-1),q+R.int(1,2)]):R.pick([p,q]);
          const i=cond.findIndex(f=>f(xs)); const P=[P1,P2,P3][i]; const val=P.f(xs);
          const ans=P.cos?`cos(${xs})`:String(val);
          return {prompt:`Let $$${fx}$$ Find $f(${xs})$.`, answer:{type:"num",answer:ans},
            hint:`Check each condition with $x = ${xs}$. Be careful with $<$ versus $\\le$ at the break points.`,
            steps:[`$x = ${xs}$ satisfies $${c[i]}$${d===2?` (it fails the other conditions: ${c.filter((_,j)=>j!==i).map(s=>`$${s}$`).join(" and ")})`:""}.`,`So use the ${["first","second","third"][i]} piece: $f(${xs}) = ${P.s(xs)}${P.cos||P.s(xs)===String(val)?"":` = ${val}`}$.`],
            answerTeX:`$f(${xs}) = ${P.cos?`\\cos(${xs})`:val}$`};
        }
        const T=R.int(1,4), r=q+R.int(1,3);
        const lay={1:{c:[`x < ${p}`,`${p} \\le x < ${q}`,`x > ${q}`],ans:`(-inf,${q}) U (${q},inf)`,tex:`(-\\infty, ${q}) \\cup (${q}, \\infty)`,why:`$x = ${q}$ is in no piece: the second needs $x < ${q}$ and the third needs $x > ${q}$.`},
                   2:{c:[`x \\le ${p}`,`${q} < x \\le ${r}`,`x > ${r}`],ans:`(-inf,${p}] U (${q},inf)`,tex:`(-\\infty, ${p}] \\cup (${q}, \\infty)`,why:`Every $x$ with $${p} < x \\le ${q}$ is in no piece.`},
                   3:{c:[`x < ${p}`,`${p} < x < ${q}`,`x \\ge ${q}`],ans:`(-inf,${p}) U (${p},inf)`,tex:`(-\\infty, ${p}) \\cup (${p}, \\infty)`,why:`$x = ${p}$ is in no piece: both of the first two conditions use a strict inequality there.`},
                   4:{c:[`x < ${p}`,`${p} \\le x \\le ${q}`,`x > ${r}`],ans:`(-inf,${q}] U (${r},inf)`,tex:`(-\\infty, ${q}] \\cup (${r}, \\infty)`,why:`Every $x$ with $${q} < x \\le ${r}$ is in no piece.`}}[T];
        const fx=`f(x) = \\begin{cases} ${P1.t} & \\text{if } ${lay.c[0]} \\\\ ${P2.t} & \\text{if } ${lay.c[1]} \\\\ ${P3.t} & \\text{if } ${lay.c[2]} \\end{cases}`;
        return {prompt:`Let $$${fx}$$ What is the domain of $f$? Write it as a union of intervals.`, answer:{type:"interval",answer:lay.ans},
          hint:"The domain is every $x$ that satisfies at least one condition. Look for gaps between the pieces.",
          steps:[`The pieces cover ${lay.c.map(s=>`$${s}$`).join(", ")}.`,lay.why,`So the domain is $${lay.tex}$.`],
          answerTeX:`$${lay.tex}$`};
      }},
    {id:"L06.g.abs", title:"Absolute value and $\\sqrt{x^2}$", skill:"Use the definition of $|x|$ and property (i), $\\sqrt{x^2} = |x|$", ref:"pp. 3 to 4",
      gen(R,d){
        if(d===1){
          if(R.int(0,2)===0){ const k=R.pick([2,3,5,6,7]);
            return {prompt:`Use the definition of $|x|$ to evaluate $|-\\sqrt{${k}}|$.`, answer:{type:"num",answer:`sqrt(${k})`},
              hint:"Is $-\\sqrt{"+k+"}$ negative or not? The definition has one formula for each case.",
              steps:[`$-\\sqrt{${k}} < 0$, so $|x| = -x$ applies.`,`$|-\\sqrt{${k}}| = -(-\\sqrt{${k}}) = \\sqrt{${k}}$`], answerTeX:`$\\sqrt{${k}}$`}; }
          let k; do{ k=R.int(2,30); }while(Number.isInteger(Math.sqrt(k)));
          const m=R.int(0,1)===0?Math.floor(Math.sqrt(k)):Math.ceil(Math.sqrt(k)); const rootFirst=R.int(0,1)===0;
          const ex=rootFirst?`\\sqrt{${k}} - ${m}`:`${m} - \\sqrt{${k}}`; const exA=rootFirst?`sqrt(${k}) - ${m}`:`${m} - sqrt(${k})`;
          const neg=rootFirst?Math.sqrt(k)<m:m<Math.sqrt(k);
          const res=neg?(rootFirst?`${m} - \\sqrt{${k}}`:`\\sqrt{${k}} - ${m}`):ex;
          const cmp=m*m<k?`$${m} = \\sqrt{${m*m}} < \\sqrt{${k}}$`:`$\\sqrt{${k}} < \\sqrt{${m*m}} = ${m}$`;
          return {prompt:`Evaluate $|${ex}|$ exactly.`, answer:{type:"num",answer:neg?`-(${exA})`:exA, rel:1e-6},
            hint:`Decide the sign of $${ex}$ first by comparing $\\sqrt{${k}}$ with $${m} = \\sqrt{${m*m}}$.`,
            steps:[`Compare: ${cmp}.`,`So $${ex} ${neg?"<":">"} 0$.`,neg?`By definition, $|${ex}| = -(${ex}) = ${res}$.`:`By definition, $|${ex}| = ${ex}$.`],
            answerTeX:`$${res}$`};
        }
        if(d===2){
          const kind=R.pick(["neg","negk","shift","shiftpos"]);
          if(kind==="neg") return {prompt:"Simplify $\\sqrt{x^2}$ if $x < 0$.", answer:{answer:"-x",vars:["x"],domain:[-3,-0.3]},
            hint:"Use property (i), then the definition of $|x|$.", steps:["$\\sqrt{x^2} = |x|$ by property (i).","$= -x$ by the definition of absolute value, since $x < 0$."], answerTeX:"$-x$"};
          if(kind==="negk"){ const k=R.int(2,5), s=R.int(0,1)===0;
            return {prompt:`Simplify $\\sqrt{${k*k}x^2}$ if $x ${s?"<":">"} 0$.`, answer:{answer:s?`-${k}x`:`${k}x`,vars:["x"],domain:s?[-3,-0.3]:[0.3,3]},
              hint:`$${k*k}x^2 = (${k}x)^2$. Then use property (i).`,
              steps:[`$\\sqrt{${k*k}x^2} = \\sqrt{(${k}x)^2} = |${k}x|$ by property (i).`,`$= ${k}|x|$ by property (ii).`,s?`$= ${k}(-x) = -${k}x$, since $x < 0$.`:`$= ${k}x$, since $x > 0$.`], answerTeX:s?`$-${k}x$`:`$${k}x$`}; }
          const a=R.nz(-4,4), below=kind==="shift";
          const sq=`x^2 ${a>0?"-":"+"} ${2*Math.abs(a)}x + ${a*a}`, xa=`x ${a>0?"-":"+"} ${Math.abs(a)}`;
          return {prompt:`Simplify $\\sqrt{${sq}}$ if $x ${below?"<":">"} ${a}$.`, answer:{answer:below?`${a} - x`:`x - ${a}`,vars:["x"],domain:below?[a-3,a-0.3]:[a+0.3,a+3]},
            hint:`The expression under the root is a perfect square: $(${xa})^2$.`,
            steps:[`$${sq} = (${xa})^2$.`,`$\\sqrt{(${xa})^2} = |${xa}|$ by property (i).`,below?`Since $x < ${a}$, $${xa} < 0$, so $|${xa}| = -(${xa}) = ${a} - x$.`:`Since $x > ${a}$, $${xa} > 0$, so $|${xa}| = ${xa}$.`],
            answerTeX:below?`$${a} - x$`:`$${xa}$`};
        }
        if(R.int(0,1)===0){ const k=R.pick([4,9,16,25,36,5,7,10]), c=R.int(-6,6), rhs=k+c;
          const r=Number.isInteger(Math.sqrt(k))?String(Math.sqrt(k)):`\\sqrt{${k}}`, ra=Number.isInteger(Math.sqrt(k))?String(Math.sqrt(k)):`sqrt(${k})`;
          return {prompt:`Solve $x^2 ${c<0?"-":"+"} ${Math.abs(c)} = ${rhs}$ for $x$, showing all steps.`.replace(" - 0 ="," =").replace(" + 0 ="," ="), answer:{type:"list",answer:`${ra}, -${ra}`},
            hint:"Isolate $x^2$, take square roots of both sides, and use $\\sqrt{x^2} = |x|$. Then property (iii).",
            steps:[`${c?`Isolate $x^2$: `:""}$x^2 = ${k}$`,`$\\sqrt{x^2} = \\sqrt{${k}}$`,`$|x| = ${r}$ by property (i).`,`$x = \\pm ${r}$ by property (iii).`],
            answerTeX:`$x = ${r}$ or $x = -${r}$`}; }
        const a=R.nz(-5,5), b=R.int(1,6);
        return {prompt:`Solve $(x ${a<0?"+":"-"} ${Math.abs(a)})^2 = ${b*b}$ for $x$, showing all steps.`, answer:{type:"list",answer:`${a+b}, ${a-b}`},
          hint:"Take square roots of both sides and use $\\sqrt{u^2} = |u|$, then property (iii).",
          steps:[`$\\sqrt{(x ${a<0?"+":"-"} ${Math.abs(a)})^2} = \\sqrt{${b*b}}$`,`$|x ${a<0?"+":"-"} ${Math.abs(a)}| = ${b}$ by property (i).`,`$x ${a<0?"+":"-"} ${Math.abs(a)} = \\pm ${b}$ by property (iii).`,`$x = ${a} + ${b} = ${a+b}$ or $x = ${a} - ${b} = ${a-b}$.`],
          answerTeX:`$x = ${a+b}$ or $x = ${a-b}$`};
      }}
  ],
  exam:[
    {id:"L06.q1", ref:"p. 1", q:"Which of these is an initial value problem?", opts:[
      ["$\\frac{dy}{dx} = 3x^2$, $y(1) = 4$",1,"A differential equation with an initial condition."],["$\\frac{dy}{dx} = 3x^2$",0,"No initial condition: this is just a DE, with infinitely many solutions."],["$y = x^3 + 3$",0,"That is a function, not an equation involving a derivative."],["$y(1) = 4$",0,"A condition on its own, with no differential equation."]]},
    {id:"L06.q2", ref:"pp. 1 to 2", q:"Solve $\\frac{dy}{dx} = 6x$, $y(1) = 5$.", opts:[
      ["$y = 3x^2 + 2$",1,"$y = 3x^2 + C$, and $5 = 3 + C$ gives $C = 2$."],["$y = 3x^2 + 5$",0,"That sets $C$ equal to the $y$-value. You need to subtract $3(1)^2$."],["$y = 3x^2 + C$",0,"These are all solutions of the DE. The IVP wants the one with $y(1) = 5$."],["$y = 3x^2 - 2$",0,"Sign slip: $5 - 3 = 2$."]]},
    {id:"L06.q3", ref:"p. 1", q:"What is the first step in solving an initial value problem like $\\frac{dy}{dx} = f(x)$, $y(x_0) = y_0$?", opts:[
      ["Find all solutions of the DE: $y = \\int f(x)\\,dx = F(x) + C$",1,"Then use the initial condition to solve for $C$ (p. 1)."],["Substitute $x_0$ into $f(x)$",0,"$f$ is the derivative. The initial condition belongs to $y$."],["Set $C = y_0$",0,"$C$ is only $y_0$ when $F(x_0) = 0$."],["Differentiate $f(x)$",0,"You need to integrate, not differentiate."]]},
    {id:"L06.q4", ref:"p. 2", q:"True or False: if you forget the $+C$, you can still solve the initial value problem.", opts:[
      ["False",1,"Without $C$ there is nothing to solve for, so you can't make the solution pass through the initial point."],["True",0,"The initial condition is used to find $C$. No $C$, no way to finish."]]},
    {id:"L06.q5", ref:"p. 2", q:"Select the first line with a mistake.<div class=\"box note\"><b class=\"t\">Problem</b>Solve $\\frac{dy}{dx} = 2x - 1$, $y(2) = 1$.</div><div class=\"box note\"><b class=\"t\">Answer</b>(1) $y = \\int (2x - 1)\\,dx$<br>(2) $y = x^2 - x + C$<br>(3) $2 = (1)^2 - 1 + C$<br>(4) $C = 2$<br>(5) Therefore $y = x^2 - x + 2$.</div>", opts:[
      ["Line (3)",1,"$y(2) = 1$ means $x = 2$ and $y = 1$. It should be $1 = (2)^2 - 2 + C$, so $C = -1$."],["Line (2)",0,"$\\frac{d}{dx}(x^2 - x) = 2x - 1$, so it is right."],["Line (4)",0,"It follows from line (3), but line (3) is already wrong."],["Line (1)",0,"Correct, with the $dx$."]]},
    {id:"L06.q6", ref:"p. 3", q:"$f(x) = \\begin{cases} 2x + 1 & \\text{if } x < 1 \\\\ 5 & \\text{if } 1 \\le x < 4 \\\\ x^2 & \\text{if } x > 4 \\end{cases}$. What is $f(1)$?", opts:[
      ["5",1,"$x = 1$ satisfies $1 \\le x < 4$, the second piece."],["3",0,"That uses the first piece, but $1 < 1$ is false."],["1",0,"That is $x^2$ at $x = 1$; the third piece needs $x > 4$."],["Not defined",0,"$x = 1$ is covered by the second piece."]]},
    {id:"L06.q7", ref:"p. 3", q:"For the same $f$, what is the domain?", opts:[
      ["$(-\\infty, 4) \\cup (4, \\infty)$",1,"No piece includes $x = 4$: the second needs $x < 4$ and the third needs $x > 4$."],["$(-\\infty, \\infty)$",0,"Check $x = 4$: it fails every condition."],["$(-\\infty, 1) \\cup (1, \\infty)$",0,"$x = 1$ is in the second piece."],["$[1, 4)$",0,"That is only the second piece."]]},
    {id:"L06.q8", ref:"p. 4", q:"If $x < 0$, then $\\sqrt{x^2} =$", opts:[
      ["$-x$",1,"$\\sqrt{x^2} = |x|$ by property (i), and $|x| = -x$ for $x < 0$."],["$x$",0,"$x$ is negative here, but a square root is never negative."],["$\\pm x$",0,"A square root gives one value, never two."],["$-|x|$",0,"That is negative, but $\\sqrt{x^2} \\ge 0$."]]},
    {id:"L06.q9", ref:"p. 4", q:"True or False: $|-a| = a$ for all real numbers $a$.", opts:[
      ["False",1,"Try $a = -2$: $|-(-2)| = |2| = 2 \\neq -2$. In general $|-a| = |a|$."],["True",0,"It fails when $a$ is negative."]]},
    {id:"L06.q10", ref:"p. 4", multi:true, q:"Which of these are true for all real $x$ and $y$? Select all that apply.", opts:[
      ["$\\sqrt{x^2} = |x|$",1,"Property (i)."],["$|xy| = |x|\\,|y|$",1,"Property (ii)."],["$|-x| = |x|$",1,"By property (ii) with $-x = (-1)x$: $|-1|\\,|x| = |x|$."],["$(\\sqrt{x})^2 = x$",0,"Only for $x \\ge 0$; $\\sqrt{x}$ is not defined for $x < 0$."],["$|x| = x$",0,"Only for $x \\ge 0$."]]},
    {id:"L06.q11", ref:"p. 4", q:"A question and three answers are shown. Which answer is correct?<div class=\"box note\"><b class=\"t\">Problem</b>Solve $x^2 - 4 = 12$.</div><div class=\"box note\"><b class=\"t\">Answer #1</b>$x^2 = 16$, so $x = 4$.</div><div class=\"box note\"><b class=\"t\">Answer #2</b>$x^2 = 16$, $\\sqrt{x^2} = \\sqrt{16}$, $x = 4$.</div><div class=\"box note\"><b class=\"t\">Answer #3</b>$x^2 = 16$, $\\sqrt{x^2} = \\sqrt{16}$, $|x| = 4$, $x = \\pm 4$.</div>", opts:[
      ["Answer #3",1,"It uses $\\sqrt{x^2} = |x|$, then property (iii) to get both solutions."],["Answer #1",0,"It misses $x = -4$."],["Answer #2",0,"$\\sqrt{x^2}$ is $|x|$, not $x$. That is the most common mistake (p. 4), and it loses $x = -4$."]]},
    {id:"L06.q12", ref:"p. 4", q:"$|x| < 3$ is the same as", opts:[
      ["$-3 < x < 3$",1,"Property (iv) with $a = 3$."],["$x < 3$",0,"That includes $x = -10$, where $|x| = 10$."],["$x < -3$ or $x > 3$",0,"That is $|x| > 3$, property (v)."],["$x = \\pm 3$",0,"That is $|x| = 3$, property (iii)."]]}
  ],
  steps:[
    {type:"read", title:"A differential equation plus a starting point", body:`<p>A differential equation states a general scientific principle. The DE $$\\frac{dC}{dt} = -\\frac{\\ln(6)}{4}C$$ describes the exponential decay of a drug in the bloodstream (p. 1). But a real patient is a specific case: say the starting concentration was 1.5 mg/ml. You write that as $$\\frac{dC}{dt} = -\\frac{\\ln(6)}{4}C, \\qquad C(0) = 1.5$$</p><div class="box def"><b class="t">Definition (p. 1)</b>A differential equation with initial condition(s) is called an initial value problem (IVP).</div><p>To solve one: first find all solutions of the DE (the family, with $+C$). Then use the initial condition to solve for $C$ (p. 1).</p><div class="box warn"><b class="t">Two different C's</b>In the drug example, $C$ is the concentration. In "solve for $C$", $C$ is the constant of integration. Don't mix them up.</div>`, ref:"p. 1"},
    {type:"example", title:"Solving an IVP, line by line", ex:{q:"Solve the initial value problem $\\frac{dy}{dx} = x + 1$, $y(2) = -3$.", ref:"pp. 1 to 2",
      steps:[
        {t:"All solutions of the differential equation are given by $y = \\int (x + 1)\\,dx = \\frac12x^2 + x + C$.", why:"Writing $y = \\int(\\dots)\\,dx$ earns marks on quizzes, so write it."},
        {t:"The initial condition $y(2) = -3$ tells us that $y = -3$ when $x = 2$.", why:"Inside the brackets is the $x$-value; after the equals sign is the $y$-value."},
        {t:"$-3 = \\frac12(2)^2 + 2 + C$", why:"Substitute $x = 2$ and $y = -3$."},
        {t:"$-3 = 4 + C$", why:"$\\frac12\\cdot 4 + 2 = 4$."},
        {t:"$-7 = C$", why:"Subtract 4 from both sides."},
        {t:"Therefore, the solution to the initial value problem is $y = \\frac12x^2 + x - 7$.", why:"Put the value of $C$ back in, and keep the \"$y =$\"."}],
      ans:"$y = \\frac12x^2 + x - 7$. Check: $y(2) = 2 + 2 - 7 = -3$."}},
    {type:"explore", title:"One point picks one curve", fig:"ivp", body:`<p>Without an initial condition, a DE like $\\frac{dy}{dx} = x + 1$ has infinitely many solutions, one for each $C$. The initial condition is a single point, and only one curve in the family goes through it.</p><p><b>Try it.</b> The point starts at $(2, -3)$, the example: the readout gives $C = -7$. Drag the point anywhere and watch $C$ change. Then switch to $\\frac{dy}{dx} = x^2$: the point jumps to $(1, 3)$, the second example on p. 2, and $C = \\frac83 \\approx 2.667$.</p>`, ref:"pp. 1 to 2"},
    {type:"mcq", title:"Check yourself", q:"Solve the initial value problem $\\frac{dy}{dx} = x^2$, $y(1) = 3$. (p. 2)", opts:[
      ["$y = \\frac13x^3 + \\frac83$",true,"$y = \\frac13x^3 + C$, and $3 = \\frac13 + C$ gives $C = \\frac83$."],["$y = \\frac13x^3 + 3$",false,"That sets $C = 3$, but $y(1)$ also includes $\\frac13(1)^3$."],["$y = 2x + 1$",false,"That differentiates $x^2$ instead of integrating it."],["$y = \\frac13x^3 + C$",false,"That is every solution of the DE. The initial condition picks one."]],
      after:"Check any IVP answer by plugging in: $y(1) = \\frac13 + \\frac83 = 3$."},
    {type:"try", title:"Your turn: solve an IVP", gen:"L06.g.ivp"},
    {type:"try", title:"Quiz style: spot the mistake", gen:"L06.g.ivperr"},
    {type:"read", title:"Piecewise defined functions", body:`<div class="box def"><b class="t">Definition (p. 3)</b>A piecewise defined function is a function which can have different definitions on different parts of its domain.</div><p>To evaluate one, first find the condition your $x$ satisfies, then use that piece. Watch the difference between $<$ and $\\le$ at the break points.</p><div class="box"><b class="t">Example (p. 3)</b>$$f(x) = \\begin{cases} x^2 - 3 & \\text{if } x < -1 \\\\ 7 & \\text{if } -1 \\le x < 3 \\\\ \\cos(x) & \\text{if } x > 3 \\end{cases}$$ (a) $f(-2) = (-2)^2 - 3 = 1$, since $-2 < -1$.<br>(b) $f(4) = \\cos(4)$, since $4 > 3$.<br>(c) The domain is $(-\\infty, 3) \\cup (3, \\infty)$. No piece includes $x = 3$: the second needs $x < 3$ and the third needs $x > 3$.</div>`, ref:"p. 3"},
    {type:"explore", title:"Which piece does x use?", fig:"piecewise", body:`<p>A filled dot belongs to its piece; an open dot does not.</p><p><b>Try it.</b> Drag $x$ to $-1$: the readout uses the second piece and gives 7, not $(-1)^2 - 3 = -2$. Drag to $x = 3$: no piece applies, so $f(3)$ has no value. Then switch to $|x|$ and drag to a negative $x$: the output is $-x$, a positive number.</p>`, ref:"p. 3"},
    {type:"mcq", title:"Recognize this function", q:"Let $f(x) = -x$ if $x < 0$ and $f(x) = x$ if $x \\ge 0$. What is $f(-\\sqrt{2})$? (p. 3 exercise)", opts:[
      ["$\\sqrt{2}$",true,"$-\\sqrt2 < 0$, so $f(-\\sqrt2) = -(-\\sqrt2) = \\sqrt2$."],["$-\\sqrt{2}$",false,"That uses the second piece, but $-\\sqrt2 \\ge 0$ is false."],["$2$",false,"Nothing gets squared here."],["Not defined",false,"Every real number is covered by one of the two pieces."]],
      after:"Also $f(-3) = 3$ and $f(4) = 4$. This function is the absolute value function."},
    {type:"try", title:"Your turn: piecewise functions", gen:"L06.g.piecewise"},
    {type:"read", title:"The absolute value function", body:`<p>The function in the last question is $|x|$ (p. 3).</p><div class="box def"><b class="t">Definition (p. 3)</b>$$|x| = \\begin{cases} -x & \\text{if } x < 0 \\\\ x & \\text{if } x \\ge 0 \\end{cases}$$</div><p>The $-x$ looks like it makes things negative, but when $x < 0$, $-x$ is positive. That is the point. In general (p. 4): if $f(x) < 0$ then $|f(x)| = -f(x)$, and if $f(x) \\ge 0$ then $|f(x)| = f(x)$.</p><div class="box"><b class="t">Properties to memorize (p. 4)</b>(i) $|x| = \\sqrt{x^2}$<br>(ii) $|xy| = |x|\\,|y|$<br>(iii) $|x| = a$ if and only if $x = \\pm a$, for any $a \\ge 0$<br>(iv) $|x| < a$ if and only if $-a < x < a$, for any $a > 0$<br>(v) $|x| > a$ if and only if $x < -a$ or $x > a$, for any $a > 0$</div><p>One exercise on p. 4 asks whether $|-a| = a$ for all real $a$. It doesn't: $a = -2$ gives $|2| = 2 \\neq -2$.</p>`, ref:"pp. 3 to 4"},
    {type:"explore", title:"Why the square root of a square is |x|", fig:"sqrtabs", body:`<p>A square root is never negative, so $\\sqrt{x^2}$ can't be $x$ when $x$ is negative. Two examples from p. 4:</p><ul><li>At $x = -3$: $|-3| = -(-3) = 3$ and $\\sqrt{(-3)^2} = \\sqrt9 = 3$.</li><li>If $x < 0$: $\\sqrt{x^2} = |x|$ by property (i), and $|x| = -x$ by the definition.</li></ul><div class="box warn"><b class="t">The most common mistake (p. 4)</b>Not using $\\sqrt{x^2} = |x|$ whenever you see $\\sqrt{x^2}$. To solve $x^2 - 4 = 12$: $x^2 = 16$, $\\sqrt{x^2} = \\sqrt{16}$, $|x| = 4$, $x = \\pm 4$.</div><p><b>Try it.</b> Drag $x$ to $-3$ and compare $\\sqrt{x^2}$ with $x$. Then drag to a positive value. Also read the last line: $(\\sqrt{x})^2 = x$ only when $x \\ge 0$.</p>`, ref:"pp. 4 to 5"},
    {type:"try", title:"Your turn: absolute value", gen:"L06.g.abs"},
    {type:"formulas", title:"Lecture 6 formulas"}
  ]
});
})();
