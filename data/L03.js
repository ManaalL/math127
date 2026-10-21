/* Lecture 3 (Mon Sept 14): Differentials, differential equations. Sections 1.1.4, 1.1.5. Notes: 4 pages. */
(function(){
const M=M127;
const Q=(n,d=1)=>{ if(d<0){ n=-n; d=-d; } const g=M.gcd(n,d)||1; return {n:n/g,d:d/g}; };
const qT=q=>M.frac(q.n,q.d), qA=q=>M.fracA(q.n,q.d);
const co=c=>c===1?"":c===-1?"-":String(c);
/* signed sum of terms [[coef, body]]: body "" means a constant */
const sumT=terms=>{ const t=terms.filter(([c])=>c!==0); if(!t.length) return "0";
  return t.map(([c,b],i)=>{ const a=Math.abs(c); const body=b?((a===1?"":a)+b):String(a); return i?` ${c<0?"-":"+"} ${body}`:(c<0?"-":"")+body; }).join(""); };
/* monomial sums [[coef, exp]] in x, exponents may be negative */
const comb=terms=>{ const m=new Map(); terms.forEach(([c,e])=>{ if(c) m.set(e,(m.get(e)||0)+c); }); return [...m.entries()].filter(([e,c])=>c!==0).sort((a,b)=>b[0]-a[0]).map(([e,c])=>[c,e]); };
const polyT=(terms,v="x")=>{ const L=comb(terms); if(!L.length) return "0";
  return L.map(([c,e],i)=>{ const a=Math.abs(c); let t;
    if(e===0) t=String(a); else if(e>0) t=(a===1?"":a)+(e===1?v:`${v}^{${e}}`); else t=`\\frac{${a}}{${e===-1?v:`${v}^{${-e}}`}}`;
    return i?` ${c<0?"-":"+"} ${t}`:(c<0?"-":"")+t; }).join(""); };
const sameP=(a,b)=>{ const A=comb(a), B=comb(b); return A.length===B.length && A.every(([c,e],i)=>c===B[i][0]&&e===B[i][1]); };
const dP=t=>t.filter(([c,e])=>e!==0).map(([c,e])=>[c*e,e-1]);
const evP=(t,x)=>t.reduce((s,[c,e])=>s+c*Math.pow(x,e),0);
const ekx=k=>`e^{${co(k)}x}`;
const box=lines=>`<div class="box">${lines.map((l,i)=>`<p>(${i+1})&nbsp; ${l}</p>`).join("")}</div>`;

/* ---- candidate solutions for "is it a solution?" problems ----
   each template returns {de, lhsName, cands:[{y, ok, lines:[...], Y, Y1, Y2}], res(c,x)} */
function tplKy(R){
  let k; do{ k=R.nz(-3,4); }while(k===1); const A=R.nz(-5,5), B=R.nz(-5,5);
  const de=`\\frac{dy}{dx} = ${k}y`;
  const rhs=inner=>`${k}y = ${k}\\left(${inner}\\right)`;
  const c=[
    {y:sumT([[A,ekx(k)]]), ok:true, Y:x=>A*Math.exp(k*x), Y1:x=>k*A*Math.exp(k*x),
      lines:[`Left hand side: $\\frac{dy}{dx} = ${sumT([[k*A,ekx(k)]])}$ (chain rule).`,`Right hand side: $${rhs(sumT([[A,ekx(k)]]))} = ${sumT([[k*A,ekx(k)]])}$.`]},
    {y:sumT([[A,ekx(k)],[B,""]]), ok:false, Y:x=>A*Math.exp(k*x)+B, Y1:x=>k*A*Math.exp(k*x),
      lines:[`Left hand side: $\\frac{dy}{dx} = ${sumT([[k*A,ekx(k)]])}$ (the constant has derivative 0).`,`Right hand side: $${rhs(sumT([[A,ekx(k)],[B,""]]))} = ${sumT([[k*A,ekx(k)],[k*B,""]])}$.`]},
    {y:sumT([[A,"e^{x}"]]), ok:false, Y:x=>A*Math.exp(x), Y1:x=>A*Math.exp(x),
      lines:[`Left hand side: $\\frac{dy}{dx} = ${sumT([[A,"e^{x}"]])}$.`,`Right hand side: $${rhs(sumT([[A,"e^{x}"]]))} = ${sumT([[k*A,"e^{x}"]])}$.`]},
    {y:sumT([[A,`x${ekx(k)}`]]), ok:false, Y:x=>A*x*Math.exp(k*x), Y1:x=>A*Math.exp(k*x)+k*A*x*Math.exp(k*x),
      lines:[`Left hand side (product rule): $\\frac{dy}{dx} = ${sumT([[A,ekx(k)],[k*A,`x${ekx(k)}`]])}$.`,`Right hand side: $${rhs(sumT([[A,`x${ekx(k)}`]]))} = ${sumT([[k*A,`x${ekx(k)}`]])}$.`]}];
  return {de, cands:c, res:(C,x)=>C.Y1(x)-k*C.Y(x)};
}
/* linear first-order DE  y' + (s/x) y = rhs  with monomial candidates */
function tplMono(R,kind){
  let s, rhs, de, cands;
  const mk=(terms)=>{ const y1=dP(terms), sy=terms.map(([c,e])=>[s*c,e-1]); const lhs=comb([...y1,...sy]);
    const lines=s===0?[]:[`$\\frac{dy}{dx} = ${polyT(y1)}$.`];
    if(s!==0) lines.push(`$\\frac{${Math.abs(s)===1?"":Math.abs(s)}y}{x} = \\frac{${Math.abs(s)}}{x}\\left(${polyT(terms)}\\right) = ${polyT(terms.map(([c,e])=>[Math.abs(s)*c,e-1]))}$.`);
    lines.push(s===0?`Left hand side: $\\frac{dy}{dx} = ${polyT(y1)}$. Right hand side: $${polyT(rhs)}$.`:
      `Left hand side: $${s<0?`\\frac{dy}{dx} - \\frac{${Math.abs(s)===1?"":Math.abs(s)}y}{x}`:`\\frac{dy}{dx} + \\frac{${s===1?"":s}y}{x}`} = ${polyT(lhs)}$. Right hand side: $${polyT(rhs)}$.`);
    return {y:polyT(terms), ok:sameP(lhs,rhs), lines, Y:x=>evP(terms,x), Y1:x=>evP(y1,x)}; };
  if(kind==="poly"){ s=0; const k=R.int(1,4), P=R.nz(-3,3), C=R.nz(-6,6); rhs=[[(k+1)*P,k]];
    de=`\\frac{dy}{dx} = ${polyT(rhs)}`;
    cands=[mk([[P,k+1],[C,0]]), mk([[(k+1)*P,k+1],[C,0]]), mk([[P,k+1],[C,1]]), mk([[P,k+2],[C,0]])];
  } else if(kind==="power"){ const n=R.int(2,4), A=R.nz(-4,4), B=R.nz(-5,5);
    de=`\\frac{dy}{dx} = \\frac{${n}y}{x}`;
    const mk2=terms=>{ const y1=dP(terms), ny=terms.map(([c,e])=>[n*c,e-1]);
      return {y:polyT(terms), ok:sameP(y1,ny), Y:x=>evP(terms,x), Y1:x=>evP(y1,x),
        lines:[`Left hand side: $\\frac{dy}{dx} = ${polyT(y1)}$.`,`Right hand side: $\\frac{${n}y}{x} = \\frac{${n}}{x}\\left(${polyT(terms)}\\right) = ${polyT(ny)}$ (for $x \\neq 0$).`]}; };
    cands=[mk2([[A,n]]), mk2([[A,n],[B,0]]), mk2([[A,n+1]]), mk2([[n*A,n-1]])];
    return {de, cands, res:(C,x)=>C.Y1(x)-n*C.Y(x)/x};
  } else { // lin: y' - (n/x) y = b x^m
    let n,m; do{ n=R.int(1,3); m=R.int(0,2); }while(m+1===n);
    const P=R.nz(-3,3), C=R.nz(-4,4), b=P*(m+1-n); s=-n; rhs=[[b,m]];
    de=`\\frac{dy}{dx} - \\frac{${n===1?"":n}y}{x} = ${polyT(rhs)}`;
    cands=[mk([[P,m+1],[C,n]]), mk([[P,m+1],[C,n+1]]), mk([[P+1,m+1],[C,n]]), mk([[P,m+1],[C,0]])];
    if(n+1===m+1) cands[1]=mk([[P,m+1],[C,n+2]]);
    return {de, cands, res:(Cd,x)=>Cd.Y1(x)-n*Cd.Y(x)/x-b*Math.pow(x,m)};
  }
  return {de, cands, res:(C,x)=>C.Y1(x)-evP(rhs,x)};
}
function tplSecond(R){
  const k=R.int(1,3), k2=k*k, A=R.nz(-4,4), B=R.nz(-4,4);
  const cs=`\\cos(${co(k)}x)`, sn=`\\sin(${co(k)}x)`, ek=ekx(k);
  const de=`\\frac{d^2y}{dx^2} + ${k2===1?"":k2}y = 0`;
  const c=[
    {y:sumT([[A,cs],[B,sn]]), ok:true, Y:x=>A*Math.cos(k*x)+B*Math.sin(k*x), Y1:x=>-k*A*Math.sin(k*x)+k*B*Math.cos(k*x), Y2:x=>-k2*A*Math.cos(k*x)-k2*B*Math.sin(k*x),
      lines:[`$\\frac{dy}{dx} = ${sumT([[-k*A,sn],[k*B,cs]])}$ and $\\frac{d^2y}{dx^2} = ${sumT([[-k2*A,cs],[-k2*B,sn]])}$.`,`Left hand side: $\\left(${sumT([[-k2*A,cs],[-k2*B,sn]])}\\right) + ${k2===1?"":k2}\\left(${sumT([[A,cs],[B,sn]])}\\right) = 0$. Right hand side: $0$.`]},
    {y:sumT([[A,cs],[B,""]]), ok:false, Y:x=>A*Math.cos(k*x)+B, Y1:x=>-k*A*Math.sin(k*x), Y2:x=>-k2*A*Math.cos(k*x),
      lines:[`$\\frac{d^2y}{dx^2} = ${sumT([[-k2*A,cs]])}$.`,`Left hand side: $${sumT([[-k2*A,cs]])} + ${k2===1?"":k2}\\left(${sumT([[A,cs],[B,""]])}\\right) = ${k2*B}$. Right hand side: $0$.`]},
    {y:sumT([[A,ek]]), ok:false, Y:x=>A*Math.exp(k*x), Y1:x=>k*A*Math.exp(k*x), Y2:x=>k2*A*Math.exp(k*x),
      lines:[`$\\frac{d^2y}{dx^2} = ${sumT([[k2*A,ek]])}$.`,`Left hand side: $${sumT([[k2*A,ek]])} + ${k2===1?"":k2}\\left(${sumT([[A,ek]])}\\right) = ${sumT([[2*k2*A,ek]])}$. Right hand side: $0$.`]},
    {y:sumT([[A,sn],[B,"x"]]), ok:false, Y:x=>A*Math.sin(k*x)+B*x, Y1:x=>k*A*Math.cos(k*x)+B, Y2:x=>-k2*A*Math.sin(k*x),
      lines:[`$\\frac{d^2y}{dx^2} = ${sumT([[-k2*A,sn]])}$.`,`Left hand side: $${sumT([[-k2*A,sn]])} + ${k2===1?"":k2}\\left(${sumT([[A,sn],[B,"x"]])}\\right) = ${sumT([[k2*B,"x"]])}$. Right hand side: $0$.`]}];
  return {de, cands:c, res:(C,x)=>C.Y2(x)+k2*C.Y(x)};
}
function tplSecond2(R){
  const m=R.pick([2,3,-1,-2]);
  const A=R.nz(-4,4), B=R.nz(-4,4), em=ekx(m), en=ekx(-m), m2=m*m;
  const de=`\\frac{d^2y}{dx^2} = ${co(m)}\\frac{dy}{dx}`;
  const c=[
    {y:sumT([[A,em],[B,""]]), ok:true, Y:x=>A*Math.exp(m*x)+B, Y1:x=>m*A*Math.exp(m*x), Y2:x=>m2*A*Math.exp(m*x),
      lines:[`$\\frac{dy}{dx} = ${sumT([[m*A,em]])}$, so the left hand side is $\\frac{d^2y}{dx^2} = ${sumT([[m2*A,em]])}$.`,`Right hand side: $${co(m)}\\frac{dy}{dx} = ${co(m)}\\left(${sumT([[m*A,em]])}\\right) = ${sumT([[m2*A,em]])}$.`]},
    {y:sumT([[A,em],[B,"x"]]), ok:false, Y:x=>A*Math.exp(m*x)+B*x, Y1:x=>m*A*Math.exp(m*x)+B, Y2:x=>m2*A*Math.exp(m*x),
      lines:[`$\\frac{dy}{dx} = ${sumT([[m*A,em],[B,""]])}$, so the left hand side is $\\frac{d^2y}{dx^2} = ${sumT([[m2*A,em]])}$.`,`Right hand side: $${co(m)}\\frac{dy}{dx} = ${co(m)}\\left(${sumT([[m*A,em],[B,""]])}\\right) = ${sumT([[m2*A,em],[m*B,""]])}$.`]},
    {y:sumT([[A,"x^{2}"],[B,""]]), ok:false, Y:x=>A*x*x+B, Y1:x=>2*A*x, Y2:x=>2*A,
      lines:[`$\\frac{dy}{dx} = ${sumT([[2*A,"x"]])}$, so the left hand side is $\\frac{d^2y}{dx^2} = ${2*A}$.`,`Right hand side: $${co(m)}\\frac{dy}{dx} = ${sumT([[2*A*m,"x"]])}$.`]},
    {y:sumT([[A,en]]), ok:false, Y:x=>A*Math.exp(-m*x), Y1:x=>-m*A*Math.exp(-m*x), Y2:x=>m2*A*Math.exp(-m*x),
      lines:[`$\\frac{dy}{dx} = ${sumT([[-m*A,en]])}$, so the left hand side is $\\frac{d^2y}{dx^2} = ${sumT([[m2*A,en]])}$.`,`Right hand side: $${co(m)}\\frac{dy}{dx} = ${sumT([[-m2*A,en]])}$.`]}];
  return {de, cands:c, res:(C,x)=>C.Y2(x)-m*C.Y1(x)};
}
function tplShift(R){
  const b=R.nz(-3,3), C=R.nz(-4,4);
  const de=`\\frac{dy}{dx} - y = ${co(b)}x`;
  const c=[
    {y:sumT([[C,"e^{x}"],[-b,"x"],[-b,""]]), ok:true, Y:x=>C*Math.exp(x)-b*x-b, Y1:x=>C*Math.exp(x)-b,
      lines:[`$\\frac{dy}{dx} = ${sumT([[C,"e^{x}"],[-b,""]])}$.`,`Left hand side: $\\left(${sumT([[C,"e^{x}"],[-b,""]])}\\right) - \\left(${sumT([[C,"e^{x}"],[-b,"x"],[-b,""]])}\\right) = ${sumT([[b,"x"]])}$. Right hand side: $${sumT([[b,"x"]])}$.`]},
    {y:sumT([[C,"e^{x}"],[-b,"x"],[b,""]]), ok:false, Y:x=>C*Math.exp(x)-b*x+b, Y1:x=>C*Math.exp(x)-b,
      lines:[`$\\frac{dy}{dx} = ${sumT([[C,"e^{x}"],[-b,""]])}$.`,`Left hand side: $\\left(${sumT([[C,"e^{x}"],[-b,""]])}\\right) - \\left(${sumT([[C,"e^{x}"],[-b,"x"],[b,""]])}\\right) = ${sumT([[b,"x"],[-2*b,""]])}$. Right hand side: $${sumT([[b,"x"]])}$.`]},
    {y:sumT([[C,"e^{x}"],[b,"x"],[b,""]]), ok:false, Y:x=>C*Math.exp(x)+b*x+b, Y1:x=>C*Math.exp(x)+b,
      lines:[`$\\frac{dy}{dx} = ${sumT([[C,"e^{x}"],[b,""]])}$.`,`Left hand side: $\\left(${sumT([[C,"e^{x}"],[b,""]])}\\right) - \\left(${sumT([[C,"e^{x}"],[b,"x"],[b,""]])}\\right) = ${sumT([[-b,"x"]])}$. Right hand side: $${sumT([[b,"x"]])}$.`]},
    {y:sumT([[C,"e^{-x}"],[-b,"x"],[-b,""]]), ok:false, Y:x=>C*Math.exp(-x)-b*x-b, Y1:x=>-C*Math.exp(-x)-b,
      lines:[`$\\frac{dy}{dx} = ${sumT([[-C,"e^{-x}"],[-b,""]])}$.`,`Left hand side: $\\left(${sumT([[-C,"e^{-x}"],[-b,""]])}\\right) - \\left(${sumT([[C,"e^{-x}"],[-b,"x"],[-b,""]])}\\right) = ${sumT([[-2*C,"e^{-x}"],[b,"x"]])}$. Right hand side: $${sumT([[b,"x"]])}$.`]}];
  return {de, cands:c, res:(Cd,x)=>Cd.Y1(x)-Cd.Y(x)-b*x};
}
/* order of a DE */
function dTeX(j,Y,X,style){ if(j===0) return Y; if(style==="p") return Y+"'".repeat(j); return j===1?`\\frac{d${Y}}{d${X}}`:`\\frac{d^{${j}}${Y}}{d${X}^{${j}}}`; }
function powT(j,Y,X,style,p){ const t=dTeX(j,Y,X,style); if(p===1) return t; if(j===0) return `${Y}^{${p}}`; return style==="p"?`(${t})^{${p}}`:`\\left(${t}\\right)^{${p}}`; }

M.lecture({
  id:"L03", n:3, date:"2026-09-14", added:"2026-10-21", unit:"u1", quiz:"Q2",
  title:"Differentials and Differential Equations", sections:["1.1.4","1.1.5"], pages:4,
  summary:"The differential $dy = f'(x)\\,dx$ and its units, what a differential equation is, how to check that a function is a solution, and how to find the order of a differential equation.",
  flags:[
    {ref:"p. 3", text:"In the $y = \\cos(x) + C$ example, the notes write \"$C = 0$. In that case, we would have $-y = \\cos(x)$ which does equal the left hand side\". That has a sign error. With $C = 0$, $y = \\cos(x)$, so $-y = -\\cos(x)$, and that is what equals the left hand side $\\frac{d^2y}{dx^2} = -\\cos(x)$. It should read $-y = -\\cos(x)$. The conclusion, that only $C = 0$ works, is right."}
  ],
  formulas:[
    {id:"L03.f.differential", name:"The differential $dy$", tex:"dy = f'(x)\\,dx", note:"For differentiable $y = f(x)$. $dx$ is an infinitely small change in $x$. Since $dx$ is infinitely small, $dy$ is too. Always multiply by the differential.", ref:"p. 1",
      blank:{tex:"dy = \\boxed{\\,?\\,}", text:true, accept:["f'(x)dx","f'(x) dx","f'(x)*dx","f'(x)\\,dx","f'(x) * dx"]}},
    {id:"L03.f.units", name:"Units of a differential", tex:"\\text{units of } dy = (\\text{units of } f') \\times (\\text{units of } dx) = \\text{units of } f", note:"Example: $f$ in Newtons, $w$ in kg. $f'(w)$ is in Newtons/kg and $dw$ is in kg, so $dy$ is in Newtons.", ref:"p. 1",
      blank:{tex:"\\text{units of } dy = \\text{units of } \\boxed{\\,?\\,}", text:true, accept:["f","y","f(x)"]}},
    {id:"L03.f.prop", name:"Rate proportional to amount", tex:"\\frac{dy}{dx} = ky", note:"The rate of change of $y$ equals $k$ (the constant of proportionality) times the amount of $y$. Populations and radioactive decay behave like this.", ref:"p. 2",
      blank:{tex:"\\frac{dy}{dx} = \\boxed{\\,?\\,}", answer:"k*y", vars:["k","y"], domain:[0.5,3]}},
    {id:"L03.f.de", name:"Differential equation (definition)", tex:"\\begin{gathered}\\text{an equation involving an unknown function}\\\\ \\text{and one or more of its derivatives}\\end{gathered}", note:"DE for short.", ref:"p. 2"},
    {id:"L03.f.predprey", name:"Predator-prey system", tex:"\\frac{dP}{dt} = (\\lambda - \\eta p)P", note:"$P(t)$ is the prey population, $p(t)$ the predator population, $\\lambda$ the growth rate of the prey and $\\eta$ the rate at which predators eat prey.", ref:"p. 2",
      blank:{tex:"\\frac{dP}{dt} = (\\boxed{\\,?\\,})P", text:true, accept:["λ - ηp","λ-ηp","λ - η p","lambda - eta p","lambda-eta*p","lambda - eta*p","\\lambda - \\eta p"]}},
    {id:"L03.f.shm", name:"Simple harmonic motion", tex:"x'' = -\\frac{k}{m}x", note:"$x$ is the position of a mass $m$ on a spring with spring constant $k$.", ref:"p. 3",
      blank:{tex:"x'' = \\boxed{\\,?\\,}", answer:"-k/m*x", vars:["k","m","x"], domain:[0.5,3]}},
    {id:"L03.f.solution", name:"Solution of a DE (definition)", tex:"\\begin{gathered}\\text{a function that satisfies the DE:}\\\\ \\text{it makes both sides equal}\\end{gathered}", note:"Check it by working out the left hand side and the right hand side separately, then comparing.", ref:"p. 3"},
    {id:"L03.f.family", name:"Parameter and family of solutions", tex:"y = Cx^2 \\text{ solves } \\frac{dy}{dx} = \\frac{2y}{x} \\text{ for every real } C", note:"$C$ is a parameter and $y = Cx^2$ is a family of solutions. A DE may have infinitely many solutions.", ref:"p. 3"},
    {id:"L03.f.order", name:"Order of a DE (definition)", tex:"\\begin{gathered}\\text{order} = \\text{the order of the highest derivative}\\\\ \\text{of the unknown function in the equation}\\end{gathered}", note:"Powers do not count: $\\left(\\frac{d^2y}{dx^2}\\right)^3$ is still a second derivative.", ref:"p. 4"}
  ],
  glossary:[
    {id:"L03.t.dx", term:"Differential $dx$", def:"An infinitely small change in $x$.", ref:"p. 1"},
    {id:"L03.t.dy", term:"Differential $dy$", def:"$dy = f'(x)\\,dx$ for differentiable $y = f(x)$. It is infinitely small because $dx$ is. Its units are the units of $f$.", ref:"p. 1"},
    {id:"L03.t.de", term:"Differential equation (DE)", def:"An equation involving an unknown function and one or more of its derivatives, such as $\\frac{dy}{dx} = ky$.", ref:"p. 2"},
    {id:"L03.t.k", term:"Constant of proportionality", def:"The $k$ in $\\frac{dy}{dx} = ky$: the rate of change of $y$ is $k$ times the amount of $y$.", ref:"p. 2"},
    {id:"L03.t.solution", term:"Solution of a DE", def:"A function that satisfies the DE, meaning it makes both sides of the equation equal.", ref:"p. 3"},
    {id:"L03.t.sides", term:"Left hand side, right hand side", def:"The two sides of the DE. To check a solution, work out each side on its own using the given function, then compare them.", ref:"p. 3"},
    {id:"L03.t.parameter", term:"Parameter", def:"A constant like $C$ in $y = Cx^2$ that can take any real value.", ref:"p. 3"},
    {id:"L03.t.family", term:"Family of solutions", def:"A formula with a parameter that gives a solution for every value of the parameter, like $y = Cx^2$ for $\\frac{dy}{dx} = \\frac{2y}{x}$.", ref:"p. 3"},
    {id:"L03.t.order", term:"Order of a DE", def:"The order of the highest derivative of the unknown function in the equation. Exponents on a derivative do not change it.", ref:"p. 4"}
  ],
  figures:{
    dyfig:{title:"dy and Δy", cap:"<b>Fig. 3.1</b> $y = f(w) = w^3 + w^2$, $f$ in Newtons and $w$ in kg. $dy = f'(w)\\,dw$ is the rise along the tangent line; $\\Delta y$ is the rise along the curve. As $dw$ shrinks, they agree. (Lecture 3, p. 1)",
      build(host,{PLOT}){
        const f=w=>w*w*w+w*w, df=w=>3*w*w+2*w;
        const G=PLOT.graph(host,{x:[0,2.3],y:[-0.5,15],c:"var(--u1)",xlabel:"w (kg)",ylabel:"y (N)",xstep:0.5,ystep:2});
        G.fn(f,{cls:"cv"});
        let w=1, dw=0.4;
        const tan=G.tangent(w,f(w),df(w),{cls:"tan dash"});
        const run=G.line(0,0,1,1,{cls:"lt dash"}), rt=G.line(0,0,1,1,{cls:"tan",layer:G.layer.top}), rc=G.line(0,0,1,1,{cls:"ln"});
        const l1=G.label(0,0,"Δy",{cls:"lbl",dx:8}), l2=G.label(0,0,"dy",{cls:"lblc",dx:-8,anchor:"end"}), l3=G.label(0,0,"dw",{cls:"lblc",anchor:"middle",dy:14});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        G.handle(w,f(w),{f,bounds:[0.2,1.8],snap:0.05,step:0.05,label:"Value of w",clickToMove:false,onMove:v=>{ w=v; draw(); }});
        PLOT.slider(ctl,{label:"dw (kg)",min:0.02,max:0.5,step:0.01,value:dw,fmt:v=>v.toFixed(2),oninput:v=>{ dw=v; draw(); }});
        function draw(){
          const b=w+dw, fw=f(w), dy=df(w)*dw, Dy=f(b)-fw;
          tan.at(w,fw,df(w)); run.set(w,fw,b,fw); rc.set(b,fw,b,f(b)); rt.set(b,fw,b,fw+dy);
          l1.set(b,fw+Dy/2); l2.set(b,fw+dy/2); l3.set((w+b)/2,fw);
          ro.innerHTML=`f′(w) = 3w² + 2w = <b>${df(w).toFixed(2)}</b> N/kg &nbsp; dw = <b>${dw.toFixed(2)}</b> kg<br>dy = f′(w) dw = <b>${dy.toFixed(3)}</b> N &nbsp; Δy = <b>${Dy.toFixed(3)}</b> N &nbsp; (N/kg × kg = N)`;
        }
        draw();
      }},
    field:{title:"A family of solutions", cap:"<b>Fig. 3.2</b> The short marks have slope $\\frac{2y}{x}$, which is what the DE $\\frac{dy}{dx} = \\frac{2y}{x}$ asks for at each point. Every curve $y = Cx^2$ follows the marks, so each one is a solution. (Lecture 3, p. 3)",
      build(host,{PLOT}){
        const G=PLOT.graph(host,{x:[-3,3],y:[-4,4],c:"var(--u1)",xlabel:"x",ylabel:"y",xstep:1,ystep:1});
        const kx=(G.W-G.pad.l-G.pad.r)/(G.x1-G.x0), ky=(G.H-G.pad.t-G.pad.b)/(G.y1-G.y0), Lp=14;
        for(let x=-2.75;x<=2.76;x+=0.5) for(let y=-3.5;y<=3.51;y+=0.5){ const s=2*y/x; const n=Math.hypot(kx,s*ky); const ux=Lp/2/n, uy=Lp*s/2/n; G.line(x-ux,y-uy,x+ux,y+uy,{cls:"lt",layer:G.layer.back}); }
        let C=0.5, xp=1.5;
        const cur=G.fn(x=>C*x*x,{cls:"cv c",width:2.4});
        const tan=G.tangent(xp,C*xp*xp,2*C*xp,{cls:"tan dash"});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        const P=G.handle(xp,C*xp*xp,{f:x=>C*x*x,bounds:[-2.6,2.6],step:0.05,label:"Point on the curve",onMove:v=>{ xp=v; draw(); }});
        PLOT.slider(ctl,{label:"C",min:-2,max:2,step:0.25,value:C,fmt:v=>v.toFixed(2),oninput:v=>{ C=v; cur.update(x=>C*x*x); P.move(xp); }});
        function draw(){
          const y=C*xp*xp, lhs=2*C*xp; tan.at(xp,y,lhs);
          const rhs=Math.abs(xp)<0.05?null:2*y/xp;
          ro.innerHTML=`y = ${C.toFixed(2)}x² &nbsp; at x = <b>${xp.toFixed(2)}</b>: &nbsp; LHS dy/dx = 2Cx = <b>${lhs.toFixed(3)}</b> &nbsp; RHS 2y/x = <b>${rhs==null?"no value at x = 0":rhs.toFixed(3)}</b>`;
        }
        draw();
      }},
    cosC:{title:"Both sides of the DE", cap:"<b>Fig. 3.3</b> For $y = \\cos(x) + C$ and $\\frac{d^2y}{dx^2} = -y$: the left hand side is $-\\cos(x)$ and the right hand side is $-\\cos(x) - C$. They match only when $C = 0$. (Lecture 3, p. 3)",
      build(host,{PLOT}){
        const G=PLOT.graph(host,{x:[-0.3,2*Math.PI+0.3],y:[-3.5,3.5],c:"var(--u1)",xlabel:"x",ylabel:"",piX:true,ystep:1});
        let C=1;
        const L=x=>-Math.cos(x), Rr=x=>-Math.cos(x)-C;
        const gap=G.between(L,Rr,0,2*Math.PI,{});
        G.fn(L,{cls:"cv c",width:2.4});
        const rc=G.fn(Rr,{cls:"cv",dash:"6 4"});
        const lL=G.label(Math.PI,L(Math.PI),"LHS = −cos x",{cls:"lblc",anchor:"middle"});
        const lR=G.label(0.1,Rr(0.1),"RHS = −cos x − C",{cls:"lbl",anchor:"start"});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        PLOT.slider(ctl,{label:"C",min:-2,max:2,step:0.25,value:C,fmt:v=>v.toFixed(2),oninput:v=>{ C=v; draw(); }});
        function draw(){
          rc.update(Rr); gap.update(L,Rr,0,2*Math.PI); lR.set(0.1,Rr(0.1));
          lR.setAttribute("dy", C>=0?18:-8); lL.setAttribute("dy", C>=0?-8:18);
          ro.innerHTML=`LHS − RHS = <b>${C.toFixed(2)}</b> for every x &nbsp; ${Math.abs(C)<1e-9?"equal: y = cos(x) is a solution":"not equal: not a solution"}`;
        }
        draw();
      }}
  },
  gens:[
    {id:"L03.g.dy", title:"Find the differential", skill:"Write $du = f'(x)\\,dx$ with the brackets", ref:"pp. 1 to 2",
      gen(R,d){
        const v=R.pick(["x","x","t","w"]), o=R.pick(["y","u"]);
        const X=s=>s.replace(/x/g,v);
        let fT,fA,dT,dA,br=true,dom=[-1.5,1.5],extra="";
        if(d===1){ const a=R.nz(-4,4), b=R.int(-5,5), c=R.int(-6,6), k=R.int(-9,9);
          fT=M.poly([a,b,c,k],v); fA=`${a}${v}^3+${b}${v}^2+${c}${v}+${k}`; dT=M.poly([3*a,2*b,c],v); dA=`${3*a}${v}^2+${2*b}${v}+${c}`;
          br=[3*a,2*b,c].filter(z=>z!==0).length>1; extra="Power rule on each term.";
        } else if(d===2){
          const kind=R.pick(["cosk","sinq","expk","sqrtl","recip","powl"]);
          if(kind==="cosk"){ const k=R.int(2,5), c=R.nz(-4,4); fT=X(`\\cos(${k}x) ${c<0?"-":"+"} ${Math.abs(c)===1?"":Math.abs(c)}x`); fA=X(`cos(${k}x)+${c}x`); dT=X(`${c} - ${k}\\sin(${k}x)`); dA=X(`${c}-${k}sin(${k}x)`); extra=X(`Chain rule: $\\frac{d}{dx}\\cos(${k}x) = -\\sin(${k}x)\\cdot ${k}$.`); }
          if(kind==="sinq"){ const p=R.nz(-3,3); let q; do{ q=R.nz(-4,4); }while(p===1&&q===1);   /* sin(x^2 + x) is a real quiz question */ const inner=polyT([[p,2],[q,1]],v); fT=`\\sin(${inner})`; fA=X(`sin(${p}x^2+${q}x)`); dT=`(${polyT([[2*p,1],[q,0]],v)})\\cos(${inner})`; dA=X(`(${2*p}x+${q})*cos(${p}x^2+${q}x)`); br=false; extra=`Chain rule: the inside $${inner}$ has derivative $${polyT([[2*p,1],[q,0]],v)}$.`; }
          if(kind==="expk"){ const k=R.nz(-3,3); fT=X(`e^{${co(k)}x^2}`); fA=X(`e^(${k}x^2)`); dT=X(`${co(2*k)}xe^{${co(k)}x^2}`); dA=X(`${2*k}x*e^(${k}x^2)`); br=false; extra=X(`Chain rule: the inside $${co(k)}x^2$ has derivative $${2*k}x$.`); dom=[-1,1]; }
          if(kind==="sqrtl"){ const p=R.int(1,5), q=R.int(1,5); fT=X(`\\sqrt{${p===1?"":p}x + ${q}}`); fA=X(`sqrt(${p}x+${q})`); dT=X(`\\frac{${p}}{2\\sqrt{${p===1?"":p}x + ${q}}}`); dA=X(`${p}/(2sqrt(${p}x+${q}))`); br=false; extra=X(`Chain rule: $\\frac{1}{2}(${p===1?"":p}x+${q})^{-1/2}\\cdot ${p}$.`); dom=[0.2,2]; }
          if(kind==="recip"){ const c=R.nz(-5,5), n=R.int(1,3); fT=X(`\\frac{${c}}{${n===1?"x":`x^{${n}}`}}`); fA=X(`${c}/x^${n}`); dT=X(`${-c*n<0?"-":""}\\frac{${Math.abs(c*n)}}{x^{${n+1}}}`); dA=X(`${-c*n}/x^${n+1}`); br=false; extra=X(`Write it as $${c}x^{${-n}}$ and use the power rule.`); dom=[0.4,2]; }
          if(kind==="powl"){ const p=R.nz(-3,3), q=R.nz(-4,4), n=R.int(2,5); const inn=X(`${co(p)}x ${q<0?"-":"+"} ${Math.abs(q)}`); fT=`(${inn})^{${n}}`; fA=X(`(${p}x+${q})^${n}`); dT=`${n*p}(${inn})^{${n-1===1?"":n-1}}`.replace("^{}",""); dA=X(`${n*p}(${p}x+${q})^${n-1}`); br=false; extra=`Chain rule: bring down the ${n}, lower the power by 1, and multiply by the derivative of the inside, ${p}.`; dom=[-1,1]; }
        } else {
          const kind=R.pick(["prodexp","prodsin","quot","expsqrt"]);
          if(kind==="prodexp"){ const n=R.int(1,3), k=R.nz(-3,3); const xn=n===1?"x":`x^{${n}}`, xn1=n===1?"":n===2?"2x":`${n}x^{${n-1}}`;
            fT=X(`${xn}e^{${co(k)}x}`); fA=X(`x^${n}*e^(${k}x)`); dT=X(`${xn1||"1"}e^{${co(k)}x} ${k<0?"-":"+"} ${Math.abs(k)===1?"":Math.abs(k)}${xn}e^{${co(k)}x}`).replace(/^1e/,"e"); dA=X(`${n}x^${n-1}*e^(${k}x)+${k}x^${n}*e^(${k}x)`); extra="Product rule, with the chain rule on the exponential."; }
          if(kind==="prodsin"){ const n=R.int(1,3), k=R.int(2,4); const xn=n===1?"x":`x^{${n}}`, xn1=n===1?"":n===2?"2x":`${n}x^{${n-1}}`;
            fT=X(`${xn}\\sin(${k}x)`); fA=X(`x^${n}*sin(${k}x)`); dT=X(`${xn1}\\sin(${k}x) + ${k}${xn}\\cos(${k}x)`); dA=X(`${n}x^${n-1}*sin(${k}x)+${k}x^${n}*cos(${k}x)`); extra="Product rule: $(fg)' = f'g + fg'$, with the chain rule on $\\sin$."; }
          if(kind==="quot"){ const k=R.int(1,6); fT=X(`\\frac{x}{x^2 + ${k}}`); fA=X(`x/(x^2+${k})`); dT=X(`\\frac{${k} - x^2}{(x^2 + ${k})^2}`); dA=X(`(${k}-x^2)/(x^2+${k})^2`); br=false; extra=X(`Quotient rule: $\\frac{(1)(x^2+${k}) - x(2x)}{(x^2+${k})^2}$.`); }
          if(kind==="expsqrt"){ const k=R.nz(-3,3); const E=X(`${co(k)}x + \\sqrt{x}`); fT=`e^{${E}}`; fA=X(`e^(${k}x+sqrt(x))`); dT=X(`e^{${E}}\\left(${k} + \\frac{1}{2\\sqrt{x}}\\right)`); dA=X(`e^(${k}x+sqrt(x))*(${k}+1/(2sqrt(x)))`); br=true; extra=X(`Chain rule: the exponent $${E}$ has derivative $${k} + \\frac{1}{2\\sqrt{x}}$.`); dom=[0.3,2]; }
        }
        const dv=`d${v}`;
        const ans=`(${dA})*${dv}`;
        const final= br?`\\left(${dT}\\right)${dv}`:`${dT}\\,${dv}`;
        return {prompt:`Find $d${o}$ for $${o} = f(${v}) = ${fT}$.`,
          answer:{answer:ans,vars:[v,"d"],domain:dom,placeholder:`e.g. (3${v}^2 + 1) d${v}`,help:`Type the right hand side with the differential, like (3${v}^2 + 1) d${v}. Brackets matter.`},
          hint:`Start with $d${o} = f'(${v})\\,${dv}$. Don't forget to multiply by $${dv}$.`,
          steps:[`$d${o} = f'(${v})\\,${dv}$`,`$f'(${v}) = ${dT}$. ${extra}`,`$d${o} = ${final}$`].concat(br?[`The brackets are needed because $${dv}$ multiplies the whole derivative (Warning, p. 2).`]:[]),
          answerTeX:`$d${o} = ${final}$`, _t:{f:fA,v}};
      }},
    {id:"L03.g.units", title:"Units of a differential", skill:"Units of $dy$ are the units of $f$", ref:"p. 1",
      gen(R,d){
        const S=R.pick([["force","Newtons","w","mass","kg","kg"],["position","m","t","time","s","s"],["mass","kg","t","time","min","min"],["volume","mL","t","time","s","s"],["temperature","°C","t","time","min","min"],["cost","dollars","T","ore extracted","tons","ton"],["concentration","mg/L","t","time","h","h"],["pressure","kPa","h","depth","m","m"]]);
        const [qn,qu,v,vn,vu,v1]=S; const a=R.nz(-5,5), b=R.nz(-6,6), n=R.int(2,3);
        const qb=qu.includes("/")?`(${qu})`:qu, rate=`${qb}/${v1}`;
        const fT=polyT([[a,n],[b,1]],v), dT=polyT([[a*n,n-1],[b,0]],v);
        const uDy=R.shuffle([qu,rate,vu,`${qb}·${vu}`]), uFp=R.shuffle([rate,qu,`${v1}/${qb}`,`${qb}·${vu}`]);
        const pDy={label:"Units of $dy$",answer:{type:"mc",options:uDy,correct:uDy.indexOf(qu)}};
        const pFp={label:`Units of $f'(${v})$`,answer:{type:"mc",options:uFp,correct:uFp.indexOf(rate)}};
        const pEx={label:"$dy =$",answer:{answer:`(${a*n}${v}^${n-1}+${b})*d${v}`,vars:[v,"d"],domain:[-2,2],placeholder:`e.g. (2${v} + 1) d${v}`,help:`Include d${v} and brackets.`}};
        const parts=d===1?[pDy]:d===2?[pFp,pDy]:[pEx,pDy];
        return {prompt:`Let $y = f(${v}) = ${fT}$, where $f$ is the ${qn} in ${qu} and $${v}$ is the ${vn} in ${vu}.`+(d===1?" What are the units of $dy$?":d===2?" Give the units of $f'("+v+")$ and of $dy$.":" Find $dy$ and give its units."),
          parts, hint:`$dy = f'(${v})\\,d${v}$. $f'(${v})$ is in ${qu} per ${v1}, and $d${v}$ is a change in $${v}$, so it is in ${vu}.`,
          steps:[`$dy = f'(${v})\\,d${v} = \\left(${dT}\\right)d${v}$.`,`Units of $f'(${v})$: ${rate}. Units of $d${v}$: ${vu} (it is a change in $${v}$).`,`Units of $dy$: ${rate} × ${vu} = ${qu}.`,`This makes sense: $dy$ is a change in $f$, which is measured in ${qu} (p. 1).`],
          answerTeX:(d===3?`$dy = \\left(${dT}\\right)d${v}$, in `:d===2?`$f'(${v})$ in ${rate}; $dy$ in `:"$dy$ is in ")+qu};
      }},
    {id:"L03.g.verify", title:"Is it a solution?", skill:"Check a function against a DE: left side, right side, conclusion", ref:"pp. 3 to 4",
      gen(R,d){
        const T = d===1 ? (R.pick(["ky","poly","power"])) : d===2 ? R.pick(["lin","power","shift"]) : R.pick(["second","second2","shift"]);
        const t = T==="ky"?tplKy(R) : T==="second"?tplSecond(R) : T==="second2"?tplSecond2(R) : T==="shift"?tplShift(R) : tplMono(R,T);
        const yes="Yes, it is a solution.", no="No, it is not a solution.";
        if(d===1){
          const c = R.pick([true,false]) ? t.cands[0] : R.pick(t.cands.slice(1));
          return {prompt:`Is $y = ${c.y}$ a solution of the differential equation $${t.de}$?`,
            parts:[{answer:{type:"mc",options:[yes,no],correct:c.ok?0:1,keep:true}}],
            hint:"Work out the left hand side and the right hand side separately using the given $y$, then compare.",
            steps:[...c.lines, c.ok?`The left hand side equals the right hand side, so $y = ${c.y}$ is a solution.`:`The left hand side does not equal the right hand side, so $y = ${c.y}$ is not a solution.`],
            answerTeX:c.ok?yes:no, _t:{t,c:[c]}};
        }
        const order=R.shuffle([0,1,2,3]); const shown=order.map(i=>t.cands[i]); const correct=order.indexOf(0);
        return {prompt:`Which of these is a solution of the differential equation $${t.de}$?`,
          parts:[{answer:{type:"mc",options:shown.map(c=>`$y = ${c.y}$`),correct}}],
          hint:"Test each one: left hand side and right hand side, separately. Exactly one makes them equal.",
          steps:shown.flatMap((c,i)=>[`Option ${i+1}, $y = ${c.y}$:`,...c.lines.map(l=>"&nbsp;&nbsp;"+l),`&nbsp;&nbsp;${c.ok?"Equal, so it is a solution.":"Not equal, so it is not a solution."}`]),
          answerTeX:`$y = ${t.cands[0].y}$`, _t:{t,c:t.cands}};
      }},
    {id:"L03.g.order", title:"Order of a DE", skill:"Find the highest derivative; ignore powers", ref:"p. 4",
      gen(R,d){
        const [Y,X]=d===3?R.pick([["y","x"],["P","t"],["x","t"]]):["y","x"];
        const n=R.int(1,3); const sty=R.pick(["p","l"]), st=()=>sty;
        const coefs=["",X+" ",`${X}^{2}`,`e^{${X}}`,"3"];
        const terms=[];
        const ph=d===1?1:d===2?R.pick([1,2]):R.pick([2,3,4].filter(p=>p!==n));
        terms.push({t:powT(n,Y,X,st(),ph), j:n, p:ph});
        const nl=d===1?1:2;
        for(let i=0;i<nl;i++){ const j=R.int(0,n-1); let p=d===1?1:R.pick([1,2,3,4,5]); if(d>=2&&i===0) p=Math.max(n+1,R.int(2,5)); terms.push({t:powT(j,Y,X,st(),p), j, p}); }
        const extra=R.pick([`${X}^{${R.int(2,5)}}`,`e^{${X}}`,`\\sin(${X})`,`${R.int(2,9)}`]);
        const parts=R.shuffle([...new Set(terms.map(z=>{ const c=R.pick(coefs); return (c&&c!=="3"&&z.j>0&&R.pick([true,false]))?`${c}${z.t}`:z.t; }))]);
        const cut=R.int(1,parts.length);
        let lhs=parts.slice(0,cut).join(" + "), rhs=parts.slice(cut).join(" + ");
        rhs = rhs? `${rhs} + ${extra}` : extra;
        const de=`${lhs} = ${rhs}`;
        const listed=terms.filter(z=>z.j>0).map(z=>`$${dTeX(z.j,Y,X,"l")}$ (order ${z.j})`).filter((s,i,a)=>a.indexOf(s)===i);
        const powNote=terms.some(z=>z.p>1)?"Exponents such as $(\\cdot)^2$ or $"+Y+"^4$ are powers. They do not change the order (p. 4).":"No derivative is higher than this one.";
        return {prompt:`What is the order of the differential equation $$${de}$$`,
          parts:[{answer:{type:"mc",options:["The order is 1.","The order is 2.","The order is 3.","The order is 4."],correct:n-1,keep:true}}],
          hint:"The order is the highest derivative of the unknown function that appears. Ignore exponents.",
          steps:[`The unknown function is $${Y}$. Derivatives that appear: ${listed.join(", ")}.`,`The highest is the derivative of order ${n}.`,powNote],
          answerTeX:`The order is ${n}.`};
      }},
    {id:"L03.g.findC", title:"Which value of $C$ works?", skill:"Find the constant that makes a function a solution", ref:"p. 3",
      gen(R,d){
        const x0=0.7;
        if(d===1){ const A=R.nz(-4,4), m=R.int(-6,6);
          const Y=(C,x)=>A*Math.cos(x)+C, Y2=x=>-A*Math.cos(x); const res=C=>Y2(x0)+Y(C,x0)-m;
          const cs=sumT([[A,"\\cos(x)"]]);
          return {prompt:`For which value of $C$ is $y = ${cs} + C$ a solution of $\\frac{d^2y}{dx^2} + y = ${m}$?`,
            answer:{type:"num",answer:String(m)}, verify:{value:-res(0)/(res(1)-res(0))},
            hint:"Find $\\frac{d^2y}{dx^2}$, add $y$, and simplify. Then set it equal to the right hand side.",
            steps:[`$\\frac{dy}{dx} = ${sumT([[-A,"\\sin(x)"]])}$ and $\\frac{d^2y}{dx^2} = ${sumT([[-A,"\\cos(x)"]])}$.`,`Left hand side: $${sumT([[-A,"\\cos(x)"]])} + \\left(${cs} + C\\right) = C$.`,`The right hand side is ${m}, so the two sides are equal exactly when $C = ${m}$.`],
            answerTeX:`$C = ${m}$`};
        }
        if(d===2){
          if(R.pick([true,false])){ const k=R.nz(-3,3), A=R.nz(-4,4), T=R.nz(-9,9);
            const res=C=>k*A*Math.exp(k*x0)-k*(A*Math.exp(k*x0)+C-T);
            const yT=sumT([[A,ekx(k)]]);
            return {prompt:`For which value of $C$ is $y = ${yT} + C$ a solution of $\\frac{dy}{dx} = ${co(k)}(y ${T<0?"+":"-"} ${Math.abs(T)})$?`,
              answer:{type:"num",answer:String(T)}, verify:{value:-res(0)/(res(1)-res(0))},
              hint:"Left hand side from the derivative, right hand side by substituting $y$. Compare the constant terms.",
              steps:[`Left hand side: $\\frac{dy}{dx} = ${sumT([[k*A,ekx(k)]])}$.`,`Right hand side: $${co(k)}\\left(${yT} + C ${T<0?"+":"-"} ${Math.abs(T)}\\right) = ${sumT([[k*A,ekx(k)]])} ${k<0?"-":"+"} ${Math.abs(k)===1?"":Math.abs(k)}(C ${T<0?"+":"-"} ${Math.abs(T)})$.`,`Equal exactly when $${co(k)}(C ${T<0?"+":"-"} ${Math.abs(T)}) = 0$, so $C = ${T}$.`],
              answerTeX:`$C = ${T}$`};
          }
          const k=R.nz(-4,4), A=R.nz(-4,4), b=R.nz(-9,9); const ans=Q(-b,k);
          const res=C=>k*A*Math.exp(k*x0)-(k*(A*Math.exp(k*x0)+C)+b);
          const yT=sumT([[A,ekx(k)]]);
          return {prompt:`For which value of $C$ is $y = ${yT} + C$ a solution of $\\frac{dy}{dx} = ${co(k)}y ${b<0?"-":"+"} ${Math.abs(b)}$?`,
            answer:{type:"num",answer:qA(ans)}, verify:{value:-res(0)/(res(1)-res(0))},
            hint:"Substitute into both sides. The exponential parts match, so the constants must match too.",
            steps:[`Left hand side: $\\frac{dy}{dx} = ${sumT([[k*A,ekx(k)]])}$.`,`Right hand side: $${co(k)}\\left(${yT} + C\\right) ${b<0?"-":"+"} ${Math.abs(b)} = ${sumT([[k*A,ekx(k)],[k,"C"],[b,""]])}$.`,`Equal exactly when $${sumT([[k,"C"],[b,""]])} = 0$, so $C = ${qT(ans)}$.`],
            answerTeX:`$C = ${qT(ans)}$`};
        }
        if(R.pick([true,false])){
          let r,s; do{ r=R.int(1,3); s=R.nz(-3,3); }while(s===r);
          const p=r+s, q=r*s, A=R.nz(-3,3), m=R.nz(-12,12), ans=Q(m,q);
          const Y=(C,x)=>A*Math.exp(r*x)+C, Y1=x=>r*A*Math.exp(r*x), Y2=x=>r*r*A*Math.exp(r*x);
          const res=C=>Y2(x0)-p*Y1(x0)+q*Y(C,x0)-m;
          const de=sumT([[1,"\\frac{d^2y}{dx^2}"],[-p,"\\frac{dy}{dx}"],[q,"y"]]);
          const er=ekx(r), yT=sumT([[A,er]]);
          return {prompt:`For which value of $C$ is $y = ${yT} + C$ a solution of $${de} = ${m}$?`,
            answer:{type:"num",answer:qA(ans)}, verify:{value:-res(0)/(res(1)-res(0))},
            hint:"Find $\\frac{dy}{dx}$ and $\\frac{d^2y}{dx^2}$, substitute, and collect the $e$ terms. They cancel, leaving a constant.",
            steps:[`$\\frac{dy}{dx} = ${sumT([[r*A,er]])}$ and $\\frac{d^2y}{dx^2} = ${sumT([[r*r*A,er]])}$.`,
              `Left hand side: $${sumT([[r*r*A,er]])} ${p===0?"":`${-p<0?"-":"+"} ${Math.abs(p)===1?"":Math.abs(p)}\\left(${sumT([[r*A,er]])}\\right)`} ${q<0?"-":"+"} ${Math.abs(q)===1?"":Math.abs(q)}\\left(${yT} + C\\right)$.`,
              `The $${er}$ terms cancel, because $${r*r} ${-p*r<0?"-":"+"} ${Math.abs(p*r)} ${q<0?"-":"+"} ${Math.abs(q)} = 0$. That leaves $${q}C$.`,
              `So $${q}C = ${m}$ and $C = ${qT(ans)}$.`],
            answerTeX:`$C = ${qT(ans)}$`};
        }
        const b=R.nz(-4,4), C0=R.nz(-3,3);
        const res=D=>(C0*Math.exp(x0)-b)-(C0*Math.exp(x0)-b*x0+D)-b*x0;
        const yT=`${sumT([[C0,"e^{x}"],[-b,"x"]])} + D`;
        return {prompt:`For which value of $D$ is $y = ${yT}$ a solution of $\\frac{dy}{dx} - y = ${co(b)}x$?`,
          answer:{type:"num",answer:String(-b)}, verify:{value:-res(0)/(res(1)-res(0))},
          hint:"Compute $\\frac{dy}{dx} - y$ and simplify. It should be "+`$${co(b)}x$`+" for every $x$.",
          steps:[`$\\frac{dy}{dx} = ${sumT([[C0,"e^{x}"],[-b,""]])}$.`,`Left hand side: $\\left(${sumT([[C0,"e^{x}"],[-b,""]])}\\right) - \\left(${yT}\\right) = ${sumT([[b,"x"],[-b,""]])} - D$.`,`This equals $${co(b)}x$ exactly when $${-b} - D = 0$, so $D = ${-b}$.`],
          answerTeX:`$D = ${-b}$`};
      }},
    {id:"L03.g.err", title:"Find the first mistake", skill:"Spot notation and algebra errors in $du$ and DE checks", ref:"pp. 1 to 3",
      gen(R,d){
        const lineOpts=n=>Array.from({length:n},(_,i)=>`Line (${i+1})`);
        if(d===1){
          const kind=R.pick(["a","b"]), k=R.int(2,5), n=R.int(2,4);
          let fT, raw, simp, nochain;
          const xn1=n-1===1?"x":`x^{${n-1}}`;
          if(kind==="a"){ fT=`x^{${n}} + \\sin(${k}x)`; raw=`${n}${xn1} + \\cos(${k}x)\\cdot ${k}`; simp=`${n}${xn1} + ${k}\\cos(${k}x)`; nochain=`${n}${xn1} + \\cos(${k}x)`; }
          else { fT=`e^{${k}x} + x^{${n}}`; raw=`e^{${k}x}\\cdot ${k} + ${n}${xn1}`; simp=`${k}e^{${k}x} + ${n}${xn1}`; nochain=`e^{${k}x} + ${n}${xn1}`; }
          const err=R.pick(["nodx","nobr","chain"]);
          let L=[`$du = f'(x)\\,dx$`,`$= \\left(${raw}\\right)dx$`,`$= \\left(${simp}\\right)dx$`], bad, why;
          if(err==="nodx"){ bad=0; L=[`$du = f'(x)$`,`$= ${raw}$`,`$= ${simp}$`]; why="The differential is missing: $du = f'(x)\\,dx$. Don't forget to multiply by the differential (Warning, p. 2). Quizzes give marks just for writing this line correctly."; }
          if(err==="nobr"){ bad=1; L[1]=`$= ${raw}\\,dx$`; L[2]=`$= ${simp}\\,dx$`; why="Without brackets, $dx$ only multiplies the last term. The brackets around the whole derivative are needed (Warning, p. 2)."; }
          if(err==="chain"){ bad=2; L[2]=`$= \\left(${nochain}\\right)dx$`; why=`The chain rule factor ${k} was lost when simplifying. It should be $\\left(${simp}\\right)dx$.`; }
          return {prompt:`A problem and an answer are below. The answer would not get full marks. Which is the first line with a mistake?<p>Problem: Find $du$ for $u = f(x) = ${fT}$.</p>${box(L)}`,
            parts:[{answer:{type:"mc",options:lineOpts(3),correct:bad,keep:true}}],
            hint:"Check: is the differential there? Are there brackets around the whole derivative? Is each derivative right?",
            steps:[`Line (${bad+1}) is the first mistake.`,why,`Correct answer: $du = \\left(${simp}\\right)dx$.`],
            answerTeX:`Line (${bad+1})`};
        }
        if(d===2){
          let k; do{ k=R.nz(-3,4); }while(k===1); const A=R.nz(-4,4), B=R.nz(-5,5);
          const e=ekx(k), de=`\\frac{dy}{dx} = ${k}y`;
          const variant=R.pick(["chain","concl1","br","const","concl2"]);
          const isSol=variant==="chain"||variant==="concl1";
          const yT=isSol?sumT([[A,e]]):sumT([[A,e],[B,""]]);
          const lhs=sumT([[k*A,e]]);
          const rhsFull=isSol?`${k}\\left(${yT}\\right) = ${sumT([[k*A,e]])}`:`${k}\\left(${yT}\\right) = ${sumT([[k*A,e],[k*B,""]])}`;
          let L=[`The left hand side is $\\frac{dy}{dx} = ${lhs}$.`,`The right hand side is $${k}y = ${rhsFull}$.`,
            isSol?`Since the left hand side equals the right hand side, $y = ${yT}$ is a solution.`:`Since the left hand side does not equal the right hand side, $y = ${yT}$ is not a solution.`];
          let bad, why;
          if(variant==="chain"){ bad=0; L[0]=`The left hand side is $\\frac{dy}{dx} = ${sumT([[A,e]])}$.`; L[2]=`Since the left hand side does not equal the right hand side, $y = ${yT}$ is not a solution.`; why=`The chain rule factor is missing: $\\frac{d}{dx}\\left(${sumT([[A,e]])}\\right) = ${lhs}$. With that fixed, both sides are $${lhs}$ and $y$ is a solution.`; }
          if(variant==="concl1"){ bad=2; L[2]=`Since the left hand side does not equal the right hand side, $y = ${yT}$ is not a solution.`; why=`Both sides are $${lhs}$, so they are equal and $y$ is a solution.`; }
          if(variant==="br"){ bad=1; L[1]=`The right hand side is $${k}y = ${sumT([[k*A,e],[B,""]])}$.`; why=`$${k}y$ means ${k} times all of $y$: $${k}\\left(${yT}\\right) = ${sumT([[k*A,e],[k*B,""]])}$. The brackets are missing. (The final conclusion happens to be right.)`; }
          if(variant==="const"){ bad=0; L[0]=`The left hand side is $\\frac{dy}{dx} = ${sumT([[k*A,e],[B,""]])}$.`; why=`The derivative of the constant ${B} is 0, so $\\frac{dy}{dx} = ${lhs}$. (The final conclusion happens to be right.)`; }
          if(variant==="concl2"){ bad=2; L[2]=`Since both sides contain $${lhs}$, the left hand side equals the right hand side, so $y = ${yT}$ is a solution.`; why=`The right hand side has an extra ${k*B}, so the sides are not equal and $y$ is not a solution.`; }
          return {prompt:`A problem and an answer are below. The answer would not get full marks. Which is the first line with a mistake?<p>Problem: Determine whether $y = ${yT}$ is a solution of the differential equation $${de}$.</p>${box(L)}`,
            parts:[{answer:{type:"mc",options:lineOpts(3),correct:bad,keep:true}}],
            hint:"Redo each line yourself: the derivative, the substitution into the right hand side (with brackets), and the conclusion.",
            steps:[`Line (${bad+1}) is the first mistake.`,why,`Correct conclusion: $y = ${yT}$ ${isSol?"is":"is not"} a solution.`],
            answerTeX:`Line (${bad+1})`};
        }
        const p=R.nz(-3,3); let q; do{ q=R.nz(-4,4); }while(p===1&&q===1);   // e^(x^2 + x) is used on a real quiz
        const E=polyT([[p,2],[q,1]]), dE=polyT([[2*p,1],[q,0]]);
        const variant=R.pick(["ok","br","concl","ok2"]);
        let prob, L, correct, why;
        if(variant==="ok2"){ const c=R.nz(-5,5); const E2=polyT([[p,2]]);
          prob=`Check whether $y = e^{${E2}}$ is a solution of $\\frac{dy}{dx} = ${co(2*p)}xy ${c<0?"-":"+"} ${Math.abs(c)}$.`;
          L=[`The left hand side is $y' = e^{${E2}}\\cdot ${2*p}x = ${co(2*p)}xe^{${E2}}$.`,`The right hand side is $${co(2*p)}xy ${c<0?"-":"+"} ${Math.abs(c)} = ${co(2*p)}xe^{${E2}} ${c<0?"-":"+"} ${Math.abs(c)}$.`,`Since the left hand side does not equal the right hand side, $y = e^{${E2}}$ is not a solution.`];
          correct=0; why=`Every line is right. The right hand side has the extra ${c}, so $y$ is not a solution, and the answer says so.`;
        } else {
          prob=`Check whether $y = e^{${E}}$ is a solution of $\\frac{dy}{dx} = (${dE})y$.`;
          const good1=`The left hand side is $y' = e^{${E}}(${dE})$.`, rhs=`The right hand side is $(${dE})y = (${dE})e^{${E}}$.`;
          if(variant==="ok"){ L=[good1,rhs,`Since the left hand side equals the right hand side, $y = e^{${E}}$ is a solution.`]; correct=0; why="Chain rule with brackets, correct substitution, correct conclusion."; }
          if(variant==="br"){ L=[`The left hand side is $y' = e^{${E}}\\cdot ${p<0?`(${co(2*p)}x)`:`${co(2*p)}x`} ${q<0?"-":"+"} ${Math.abs(q)}$.`,rhs,`Since the left hand side does not equal the right hand side, $y = e^{${E}}$ is not a solution.`]; correct=1; why=`The derivative is missing brackets: $y' = e^{${E}}(${dE})$. With the brackets the two sides are equal, so $y$ is a solution.`; }
          if(variant==="concl"){ L=[good1,rhs,`Since the left hand side does not equal the right hand side, $y = e^{${E}}$ is not a solution.`]; correct=2; why="The derivative and the right hand side are right and they are the same expression, so the conclusion should be that $y$ is a solution."; }
        }
        const opts=["Yes, the answer is correct.","No. The derivative in the answer is wrong.","No. The derivative is right, but the conclusion is wrong."];
        return {prompt:`Here is a problem and a student's answer. Is the answer right?<p>Problem: ${prob}</p>${box(L)}`,
          parts:[{answer:{type:"mc",options:opts,correct,keep:true}}],
          hint:"Differentiate $y$ yourself with the chain rule (keep the brackets), substitute into the right hand side, and compare with the answer's conclusion.",
          steps:[why, `So the right choice is: ${opts[correct]}`],
          answerTeX:opts[correct]};
      }}
  ],
  exam:[
    {id:"L03.q1", ref:"p. 1", q:"For a differentiable function $y = f(x)$, the differential $dy$ is", opts:[["$dy = f'(x)\\,dx$",1,"The definition on p. 1."],["$dy = f'(x)$",0,"Missing the differential $dx$."],["$dy \\approx f'(a)\\Delta x$",0,"That is the differential approximation for $\\Delta y$ from Lecture 2."],["$dy = f(x)\\,dx$",0,"It uses the derivative $f'(x)$, not $f(x)$."]]},
    {id:"L03.q2", ref:"pp. 1 to 2", q:"Let $u = \\sin(3x)$. Then $du =$", opts:[["$3\\cos(3x)\\,dx$",1,"Chain rule, then multiply by $dx$."],["$\\cos(3x)\\,dx$",0,"Missing the chain rule factor 3."],["$3\\cos(3x)$",0,"Missing the differential $dx$."],["$-3\\cos(3x)\\,dx$",0,"The derivative of $\\sin$ is $\\cos$, with no minus sign."]]},
    {id:"L03.q3", ref:"p. 1", q:"$y = f(t)$ is a volume in mL and $t$ is time in seconds. The units of $dy$ are", opts:[["mL",1,"(mL/s) × s = mL. $dy$ is a change in $f$."],["mL/s",0,"Those are the units of $f'(t)$."],["s",0,"Those are the units of $dt$."],["mL·s",0,"Multiply mL/s by s, not mL by s."]]},
    {id:"L03.q4", ref:"p. 4", q:"What is the order of $(y')^4 + xy'' = e^{y}$?", keep:true, opts:[["1",0,"$y''$ appears, which is a second derivative."],["2",1,"The highest derivative is $y''$. The 4 is a power."],["3",0,"No third derivative appears."],["4",0,"The exponent 4 is a power, not an order."]]},
    {id:"L03.q5", ref:"p. 1", q:"True or false: since $dx$ is infinitely small, $dy$ is also infinitely small.", keep:true, opts:[["True",1,"The NOTE on p. 1."],["False",0,"$dy = f'(x)\\,dx$ is a finite number times an infinitely small one."]]},
    {id:"L03.q6", ref:"p. 3", q:"Select all the solutions of $\\frac{dy}{dx} = 3y$.", multi:true, opts:[["$y = e^{3x}$",1,"Both sides are $3e^{3x}$."],["$y = 5e^{3x}$",1,"Both sides are $15e^{3x}$."],["$y = e^{3x} + 1$",0,"Left side $3e^{3x}$, right side $3e^{3x} + 3$."],["$y = 3e^{x}$",0,"Left side $3e^{x}$, right side $9e^{x}$."],["$y = 0$",1,"Both sides are 0, so it satisfies the DE."]]},
    {id:"L03.q7", ref:"p. 3", q:"Problem: determine whether $y = xe^{2x}$ is a solution of $\\frac{dy}{dx} - 2y = e^{2x}$.<br>(1) $y' = 2xe^{2x}$<br>(2) Left hand side: $2xe^{2x} - 2xe^{2x} = 0$<br>(3) Right hand side: $e^{2x}$<br>(4) Since $0 \\neq e^{2x}$, $y$ is not a solution.<br>Which is the first line with a mistake?", keep:true,
      opts:[["Line (1)",1,"Product rule: $y' = e^{2x} + 2xe^{2x}$. Then the left side is $e^{2x}$ and $y$ is a solution."],["Line (2)",0,"It follows from line (1); the first error is earlier."],["Line (3)",0,"The right side is $e^{2x}$."],["Line (4)",0,"It follows from the earlier lines; the first error is earlier."]]},
    {id:"L03.q8", ref:"p. 3", q:"For which values of $C$ is $y = Cx^3$ a solution of $\\frac{dy}{dx} = \\frac{3y}{x}$?", opts:[["Every real number $C$",1,"Left: $3Cx^2$. Right: $\\frac{3Cx^3}{x} = 3Cx^2$ (for $x \\ne 0$). A family of solutions."],["Only $C = 0$",0,"$C = 0$ works, but so does every other $C$."],["Only $C = 1$",0,"Nothing in the check depends on $C$ being 1."],["No value of $C$",0,"Both sides come out as $3Cx^2$."]]},
    {id:"L03.q9", ref:"p. 3", q:"$y = \\cos(x) + C$ solves $\\frac{d^2y}{dx^2} = -y$ only when $C = 0$. Which line correctly finishes the check for $C = 0$?", opts:[["$-y = -\\cos(x)$, which equals $\\frac{d^2y}{dx^2} = -\\cos(x)$",1,"With $C = 0$, $y = \\cos(x)$, so $-y = -\\cos(x)$."],["$-y = \\cos(x)$, which equals $\\frac{d^2y}{dx^2}$",0,"Sign slip: $-y = -\\cos(x)$. The lecture notes have this slip on p. 3."],["$\\frac{d^2y}{dx^2} = \\cos(x)$, which equals $y$",0,"$\\frac{d^2y}{dx^2} = -\\cos(x)$."],["It works for every $C$, so 0 is fine",0,"The sides differ by $C$, so only $C = 0$ works."]]},
    {id:"L03.q10", ref:"p. 2", q:"Problem: let $u = (x^2 + 1)^3$. Find $du$.<br>(1) $du = f'(x)\\,dx$<br>(2) $du = 3(x^2 + 1)^2\\cdot 2x$<br>(3) $du = 6x(x^2 + 1)^2\\,dx$<br>Which is the first line with a mistake?", keep:true,
      opts:[["Line (1)",0,"That is the definition."],["Line (2)",1,"The differential $dx$ is missing. It should be $3(x^2 + 1)^2\\cdot 2x\\,dx$."],["Line (3)",0,"Line (3) is correct, but line (2) already lost the $dx$."]]},
    {id:"L03.q11", ref:"p. 2", q:"Which of these is NOT a differential equation?", opts:[["$x^2 + y^2 = 1$",1,"No derivative of the unknown function appears."],["$y' = xy$",0,"It involves $y'$."],["$\\frac{d^2x}{dt^2} = -9x$",0,"Simple harmonic motion: it involves $x''$."],["$\\frac{dP}{dt} = 0.02P$",0,"Rate proportional to amount."]]},
    {id:"L03.q12", ref:"p. 2", q:"Which is a correct way to write $dy$ for $y = t^4 - 5t$?", opts:[["$(4t^3 - 5)\\,dt$",1,"Derivative in brackets, times $dt$."],["$4t^3 - 5\\,dt$",0,"Without brackets, $dt$ only multiplies the 5."],["$4t^3 - 5$",0,"The differential is missing."],["$(4t^3 - 5)\\,dx$",0,"The variable is $t$, so the differential is $dt$."]]}
  ],
  steps:[
    {type:"read", title:"From $\\Delta$ to $d$", body:`<p>The differential approximation from Lecture 2 estimates $\\Delta y$ from some $\\Delta x$. In many real problems it is not accurate enough. Next lecture the definite integral will give better approximations, and sometimes the exact value. To build it, you need new notation (p. 1).</p><div class="box def"><b class="t">Definition (p. 1)</b>Assume $y = f(x)$ is differentiable. The differential $dx$ is an infinitely small change in $x$, and the differential $dy$ is $$dy = f'(x)\\,dx$$</div><p>Since $dx$ is infinitely small, $dy$ is also infinitely small. You cannot calculate them as numbers, but you can do algebra with them, including adding up infinitely many of them (p. 1).</p>`, ref:"p. 1"},
    {type:"explore", title:"$dy$ next to $\\Delta y$", fig:"dyfig", ref:"p. 1", body:`<p>$dy = f'(w)\\,dw$ is the rise along the tangent line over a run of $dw$. $\\Delta y$ is the real rise along the curve.</p><p><b>Try it.</b> Slide $dw$ down toward 0.02 and watch $dy$ and $\\Delta y$ become almost equal. Check the units in the readout: N/kg times kg is N.</p>`},
    {type:"example", title:"$dy$ with units", ex:{q:"Find $dy$ given that $y = f(w) = w^3 + w^2$. If the units of $f$ are Newtons and the units of $w$ are kg, determine the units of $dy$.", ref:"p. 1",
      steps:[{t:"$dy = f'(w)\\,dw$",why:"The definition, written with the variable $w$."},{t:"$dy = (3w^2 + 2w)\\,dw$",why:"Power rule. The brackets are needed because $dw$ multiplies the whole derivative."},{t:"Units of $f'(w)$: Newtons/kg. Units of $dw$: kg.",why:"$f'(w)$ is a change in $f$ over a change in $w$. $dw$ is a change in $w$."},{t:"Units of $dy$: Newtons/kg × kg = Newtons",why:"This makes sense: $dy$ is a change in $f$, and $f$ is in Newtons."}],
      ans:"$dy = (3w^2 + 2w)\\,dw$, in Newtons"}},
    {type:"example", title:"$du$ for $u = \\frac{1}{x}$", ex:{q:"Find $du$ for $u = f(x) = \\frac{1}{x}$.", ref:"p. 2",
      steps:[{t:"$du = f'(x)\\,dx$",why:"Start with the definition. Quizzes give marks for this line alone."},{t:"$du = -\\frac{1}{x^2}\\,dx$",why:"$\\frac{1}{x} = x^{-1}$, so $f'(x) = -x^{-2}$."}],
      ans:"$du = -\\frac{1}{x^2}\\,dx$"}},
    {type:"try", title:"Your turn: differentials", gen:"L03.g.dy"},
    {type:"read", title:"Differential equations", body:`<p>Often the rate of change of a quantity is proportional to the amount of it. A bigger population grows faster, and a radioactive element decays faster when there is more of it (p. 2). That gives equations like</p>$$\\frac{dy}{dx} = ky$$<p>The rate of change of $y$ equals $k$, the constant of proportionality, times the amount of $y$.</p><div class="box def"><b class="t">Definition (p. 2)</b>A differential equation (DE) is an equation involving an unknown function and one or more of its derivatives.</div><ul><li>Predator-prey (p. 2): $\\frac{dP}{dt} = (\\lambda - \\eta p)P$, where $P$ is the prey, $p$ the predators, $\\lambda$ the prey's growth rate and $\\eta$ the rate predators eat prey.</li><li>Simple harmonic motion (p. 3): $x'' = -\\frac{k}{m}x$ for a mass $m$ on a spring with spring constant $k$.</li></ul>`, ref:"pp. 2 to 3"},
    {type:"read", title:"What a solution is", body:`<div class="box def"><b class="t">Definition (p. 3)</b>A function that satisfies a differential equation is called a solution of the differential equation.</div><p>'Satisfies' means it makes both sides of the DE equal. The method:</p><ol><li>Work out the left hand side using the given function.</li><li>Work out the right hand side on its own.</li><li>Compare them and write a conclusion sentence.</li></ol><p class="muted small">On quizzes the conclusion sentence is worth marks, and a missing bracket in the derivative is the usual way to lose them.</p>`, ref:"p. 3"},
    {type:"example", title:"A whole family of solutions", ex:{q:"Show that $y = Cx^2$ is a solution of the differential equation $\\frac{dy}{dx} = \\frac{2y}{x}$ for any real number $C$.", ref:"p. 3",
      steps:[{t:"Left hand side: $\\frac{dy}{dx} = 2Cx$",why:"$C$ is a constant, so the power rule gives $2Cx$."},{t:"Right hand side: $\\frac{2y}{x} = \\frac{2Cx^2}{x} = 2Cx$",why:"Substitute $y = Cx^2$; cancel one $x$, which is allowed since $x \\neq 0$."},{t:"Left hand side equals right hand side, so $y = Cx^2$ is a solution for any real number $C$.",why:"Always finish with the conclusion."},{t:"$C$ is a parameter and $y = Cx^2$ is a family of solutions.",why:"A DE can have infinitely many solutions (p. 3)."}],
      ans:"Both sides are $2Cx$, so every $y = Cx^2$ is a solution."}},
    {type:"explore", title:"Solutions follow the slope marks", fig:"field", ref:"p. 3", body:`<p>At every point $(x, y)$ the DE $\\frac{dy}{dx} = \\frac{2y}{x}$ says what the slope must be. The short marks draw those slopes.</p><p><b>Try it.</b> Move the $C$ slider: every parabola $y = Cx^2$ runs along the marks. Drag the point and compare LHS and RHS in the readout; they are always equal (except at $x = 0$, where $\\frac{2y}{x}$ has no value).</p>`},
    {type:"example", title:"When a family fails", ex:{q:"Is $y = \\cos(x) + C$ a solution of the differential equation $\\frac{d^2y}{dx^2} = -y$ for all real numbers $C$?", ref:"p. 3",
      steps:[{t:"$\\frac{dy}{dx} = -\\sin(x)$, so $\\frac{d^2y}{dx^2} = -\\cos(x)$",why:"Differentiate twice. The constant $C$ disappears."},{t:"Right hand side: $-y = -(\\cos(x) + C) = -\\cos(x) - C$",why:"The minus sign goes on every term, so the brackets matter."},{t:"Left hand side does not equal right hand side, so $y = \\cos(x) + C$ is not a solution for all real numbers $C$.",why:"They differ by $C$."},{t:"It works for $C = 0$: then $-y = -\\cos(x)$, which equals the left hand side.",why:"The notes write $-y = \\cos(x)$ here. That is a sign slip; with $y = \\cos(x)$, $-y = -\\cos(x)$ (see the flag)."}],
      ans:"Not a solution for all $C$. Only $C = 0$ works."}},
    {type:"explore", title:"Watch the two sides", fig:"cosC", ref:"p. 3", body:`<p>The solid curve is the left hand side, $\\frac{d^2y}{dx^2} = -\\cos(x)$. The dashed curve is the right hand side, $-y = -\\cos(x) - C$. The shaded strip is the gap between them.</p><p><b>Try it.</b> Move $C$ to 0. The curves lie on top of each other and the gap vanishes. Any other $C$ shifts the dashed curve, so the two sides are never equal.</p>`},
    {type:"try", title:"Your turn: is it a solution?", gen:"L03.g.verify"},
    {type:"read", title:"The order of a DE", body:`<div class="box def"><b class="t">Definition (p. 4)</b>The order of a differential equation is the order of the highest derivative of the unknown function in the equation.</div><div class="box"><b class="t">Example (p. 4)</b>(a) $y'' + x^2y = x^4 + (y')^3$ has order 2.<br>(b) $x\\frac{d^3y}{dx^3} = \\frac{dy}{dx} + e^x$ has order 3.</div><div class="box warn"><b class="t">Watch for this</b>Powers are not orders. In (a), $(y')^3$ is a first derivative cubed, and $x^4$ is not a derivative at all.</div>`, ref:"p. 4"},
    {type:"mcq", title:"Power or order?", q:"What is the order of $\\left(\\frac{d^2y}{dx^2}\\right)^3 = y^3\\frac{dy}{dx}$? (p. 4 exercise)", keep:true,
      opts:[["1",false,"$\\frac{d^2y}{dx^2}$ is a second derivative, and it appears."],["2",true,"The highest derivative is $\\frac{d^2y}{dx^2}$. The cube is a power."],["3",false,"The 3 is an exponent, not a third derivative."],["6",false,"Order is not found by multiplying powers."]],
      after:"Part (a) of the same exercise, $\\frac{dy}{dx} + y^2 = x^3$, has order 1."},
    {type:"mcq", title:"Check a solution", q:"Is $y = e^x - x - 1$ a solution of $\\frac{dy}{dx} - y = x$? (p. 4 exercise)", keep:true,
      opts:[["Yes: $(e^x - 1) - (e^x - x - 1) = x$",true,"$\\frac{dy}{dx} = e^x - 1$. Subtract all of $y$, with brackets, and you get $x$."],["No: the left hand side is $e^x - 1$",false,"That is only $\\frac{dy}{dx}$. You still have to subtract $y$."],["No: $(e^x - 1) - e^x - x - 1 = -x - 2$",false,"Missing brackets around $y$. The minus must hit every term."],["Only when $x = 0$",false,"The two sides are equal for every $x$."]],
      after:"Left hand side: $(e^x - 1) - (e^x - x - 1) = x$, which is the right hand side, so it is a solution."},
    {type:"formulas", title:"Lecture 3 formulas"}
  ]
});
})();
