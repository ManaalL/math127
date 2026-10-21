/* Lecture 16 (Wed Oct 21): The factorial function, implicitly defined functions, implicit differentiation. Sections 2.6, 2.7.1. Notes: 4 pages. */
(function(){
const M=M127;
/* ---------- small TeX helpers for this lecture ---------- */
// S([[c,body],...]): a signed sum in TeX. body "" means a constant. Coefficient 1 is left off.
const S=list=>{ let out="", first=true;
  list.filter(t=>t[0]!==0).forEach(([c,b])=>{ const neg=c<0, a=Math.abs(c); const core=b===""?String(a):(a===1?b:`${a}${b}`);
    out+= first?(neg?"-":"")+core:(neg?" - ":" + ")+core; first=false; });
  return out||"0"; };
// P(list): the same sum written as a continuation (always starts with + or -)
const P=list=>{ const s=S(list); if(s==="0") return ""; return s[0]==="-"?" - "+s.slice(1):" + "+s; };
const co=c=>c===1?"":c===-1?"-":String(c);            // coefficient in front of a letter
const pw=(v,e)=>e===0?"":e===1?v:`${v}^{${e}}`;        // x^{e}
const sh=(s,v="n")=>s===0?v:(s>0?`${v}+${s}`:`${v}-${-s}`);       // n+2, n-1
const fct=(s,v="n")=>s===0?(v.length>1?`(${v})!`:`${v}!`):`(${sh(s,v)})!`;              // (n+2)!
const par=(s,v="n")=>s===0?(v.length>1?`(${v})`:v):`(${sh(s,v)})`;
const prodT=(lo,hi,v="n")=>{ if(lo===hi) return sh(lo,v); const f=[]; for(let s=lo;s<=hi;s++) f.push(par(s,v)); return f.join(""); };
const prodA=(lo,hi,v="n")=>{ const f=[]; for(let s=lo;s<=hi;s++) f.push(`(${sh(s,v)})`); return f.join("*"); };
const ratioT=(p,q,v="n")=>p>q?prodT(q+1,p,v):`\\frac{1}{${prodT(p+1,q,v)}}`;
const ratioA=(p,q,v="n")=>p>q?prodA(q+1,p,v):`1/(${prodA(p+1,q,v)})`;
const expand=(end,c,v="n")=>{ let s=`1\\cdot 2\\cdots ${par(c,v)}`; for(let k=c+1;k<=end;k++) s+=`\\cdot ${par(k,v)}`; return s; };
const fact=n=>{ let r=1; for(let i=2;i<=n;i++) r*=i; return r; };
const prodN=(lo,hi)=>{ let r=1; for(let i=lo;i<=hi;i++) r*=i; return r; };
const dotsN=(lo,hi)=>{ const f=[]; for(let i=lo;i<=hi;i++) f.push(i); return f.join("\\cdot "); };
// tangent line y = b + m(x - a) in TeX (right-hand side only)
const lineRHS=(a,b,num,den)=>{ if(num===0) return String(b);
  const m=M.frac(num,den), neg=m[0]==="-", mag=neg?m.slice(1):m, mm=mag==="1"?"":mag;
  const xa=a===0?"x":`(x ${a>0?"-":"+"} ${Math.abs(a)})`;
  return b===0?`${neg?"-":""}${mm}${xa}`:`${b} ${neg?"-":"+"} ${mm}${xa}`; };
const lineA=(a,b,num,den)=>`${b} + (${M.fracA(num,den)})*(x - (${a}))`;

/* ---------- implicit differentiation templates (each checked with sympy: y' = -F_x/F_y) ---------- */
const IMP={
  T1:R=>{ const a=R.int(1,5), b=R.int(1,5), c=R.int(2,30), g=M.gcd(a,b), A=a/g, B=b/g;
    return {eq:`${S([[a,"x^2"],[b,"y^2"]])} = ${c}`, F:`${a}x^2+${b}y^2-${c}`, rule:"The chain rule on $y^2$ gives $2yy'$. The derivative of a constant is 0.",
      lines:[`${S([[2*a,"x"],[2*b,"yy'"]])} = 0`, `${S([[2*b,"yy'"]])} = ${S([[-2*a,"x"]])}`],
      ansT:`-\\frac{${co(A)}x}{${co(B)}y}`, ansA:`-(${A}*x)/(${B}*y)`, cond:"y"}; },
  T2:R=>{ const k=R.int(2,9);
    return {eq:`x^3 + y^3 = ${k}xy`, F:`x^3+y^3-${k}x*y`, rule:`Product rule on $${k}xy$: $${k}(1\\cdot y + xy')$. Chain rule on $y^3$: $3y^2y'$.`,
      lines:[`3x^2 + 3y^2y' = ${k}y + ${k}xy'`, `3y^2y' - ${k}xy' = ${k}y - 3x^2`, `y'(3y^2 - ${k}x) = ${k}y - 3x^2`],
      ansT:`\\frac{${k}y - 3x^2}{3y^2 - ${k}x}`, ansA:`(${k}y-3x^2)/(3y^2-${k}x)`, cond:`3y^2 - ${k}x`}; },
  T3:R=>{ const a=R.nz(-5,5), b=R.int(-6,6), rhs=S([[1,"x^3"],[a,"x"],[b,""]]), top=S([[3,"x^2"],[a,""]]);
    return {eq:`y^2 = ${rhs}`, F:`y^2-(x^3+(${a})x+(${b}))`, rule:"Chain rule on $y^2$ gives $2yy'$. The right side has no $y$, so differentiate it as usual.",
      lines:[`2yy' = ${top}`], ansT:`\\frac{${top}}{2y}`, ansA:`(3x^2+(${a}))/(2y)`, cond:"y"}; },
  T4:R=>{ const a=R.pick([-4,-3,-1,1,3,4]), c=R.int(1,9), rhs=S([[-2,"x"],[-a,"y"]]), den=S([[a,"x"],[2,"y"]]);
    return {eq:`${S([[1,"x^2"],[a,"xy"],[1,"y^2"]])} = ${c}`, F:`x^2+(${a})x*y+y^2-${c}`, rule:`Product rule on $${co(a)}xy$, chain rule on $y^2$.`,
      lines:[`${S([[2,"x"],[a,"(y + xy')"],[2,"yy'"]])} = 0`, `${S([[2,"x"],[a,"y"],[a,"xy'"],[2,"yy'"]])} = 0`, `${S([[a,"xy'"],[2,"yy'"]])} = ${rhs}`, `y'(${den}) = ${rhs}`],
      ansT:`\\frac{${rhs}}{${den}}`, ansA:`(-2x-(${a})y)/((${a})x+2y)`, cond:den}; },
  T5:R=>{ const m=R.int(2,5), n=R.int(2,5), c=R.int(1,9), g=M.gcd(m,n);
    return {eq:`x^{${m}} + y^{${n}} = ${c}`, F:`x^${m}+y^${n}-${c}`, rule:`Chain rule on $y^{${n}}$ gives $${n}${pw("y",n-1)}y'$.`,
      lines:[`${m}${pw("x",m-1)} + ${n}${pw("y",n-1)}y' = 0`, `${n}${pw("y",n-1)}y' = -${m}${pw("x",m-1)}`],
      ansT:`-\\frac{${m/g===1?"":m/g}${pw("x",m-1)}}{${n/g===1?"":n/g}${pw("y",n-1)}}`, ansA:`-(${m}x^${m-1})/(${n}y^${n-1})`, cond:"y"}; },
  T6:R=>{ const m=R.int(2,4), n=R.int(4,6), p=R.int(2,n-1), k=R.int(2,9);
    const den=`${n}x^{${m}}${pw("y",n-1)} - ${k*p}${pw("y",p-1)}`, top=`-${m}${pw("x",m-1)}y^{${n}}`;
    return {eq:`x^{${m}}y^{${n}} = ${k}y^{${p}}`, F:`x^${m}*y^${n}-${k}y^${p}`, rule:`Product rule on $x^{${m}}y^{${n}}$. Chain rule on every power of $y$: each one picks up a $y'$.`,
      lines:[`${m}${pw("x",m-1)}y^{${n}} + ${n}x^{${m}}${pw("y",n-1)}y' = ${k*p}${pw("y",p-1)}y'`, `${n}x^{${m}}${pw("y",n-1)}y' - ${k*p}${pw("y",p-1)}y' = ${top}`, `y'\\left(${den}\\right) = ${top}`],
      ansT:`\\frac{${top}}{${den}}`, ansA:`-(${m}x^${m-1}*y^${n})/(${n}x^${m}*y^${n-1}-${k*p}y^${p-1})`, cond:den}; },
  T7:R=>{ const a=R.int(1,4), n=R.pick([2,3]), ny=`x${pw("y",n-1)}`;
    return {eq:`${co(a)}xy^{${n}} = \\arctan(y)`, F:`${a}x*y^${n}-arctan(y)`, rule:`Product rule on $${co(a)}xy^{${n}}$. Chain rule on $\\arctan(y)$: $\\frac{1}{1+y^2}y'$.`,
      lines:[`${S([[a,`y^{${n}}`],[a*n,`${ny}y'`]])} = \\frac{1}{1+y^2}y'`, `${S([[a*n,`${ny}y'`]])} - \\frac{1}{1+y^2}y' = ${S([[-a,`y^{${n}}`]])}`, `y'\\left(${S([[a*n,ny]])} - \\frac{1}{1+y^2}\\right) = ${S([[-a,`y^{${n}}`]])}`, `\\text{Multiply the top and bottom by } (1+y^2).`],
      ansT:`\\frac{${S([[-a,`y^{${n}}`]])}(1+y^2)}{${S([[a*n,ny]])}(1+y^2) - 1}`, ansA:`(-${a}y^${n}*(1+y^2))/(${a*n}x*y^${n-1}*(1+y^2)-1)`, cond:`${S([[a*n,ny]])}(1+y^2) - 1`}; },
  T8:R=>{ const a=R.nz(-5,5), b=R.int(1,4), bx=b===1?"x":`${b}x`;
    return {eq:`y + y^2 = ${co(a)}\\sin(${bx})`, F:`y+y^2-(${a})*sin(${b}x)`, rule:`Chain rule on $y^2$ gives $2yy'$, and on $\\sin(${bx})$ it gives $${co(b)}\\cos(${bx})$.`,
      lines:[`y' + 2yy' = ${co(a*b)}\\cos(${bx})`, `y'(1 + 2y) = ${co(a*b)}\\cos(${bx})`],
      ansT:`\\frac{${co(a*b)}\\cos(${bx})}{1 + 2y}`, ansA:`(${a*b})*cos(${b}x)/(1+2y)`, cond:"1 + 2y"}; },
  T9:R=>{ const a=R.nz(-5,5), den=S([[1,""],[-a,"x"],[-2,"y"]]);
    return {eq:`${co(a)}xy + y^2 = y`, F:`(${a})x*y+y^2-y`, rule:`Product rule on $${co(a)}xy$: $${a===1?"":a===-1?"-":a}(1\\cdot y + xy')$. Chain rule on $y^2$: $2yy'$.`,
      lines:[`${S([[a,"(y + xy')"],[2,"yy'"]])} = y'`, `${S([[a,"y"],[a,"xy'"],[2,"yy'"]])} = y'`, `${S([[a,"y"]])} = ${S([[1,"y'"],[-a,"xy'"],[-2,"yy'"]])}`, `${S([[a,"y"]])} = y'(${den})`],
      ansT:`\\frac{${S([[a,"y"]])}}{${den}}`, ansA:`(${a})*y/(1-(${a})x-2y)`, cond:den}; },
  T10:R=>{ const k=R.nz(-5,5);
    return {eq:`\\sin(x) + \\cos(y) = ${co(k)}xy`, F:`sin(x)+cos(y)-(${k})x*y`, rule:`Chain rule on $\\cos(y)$: $-\\sin(y)y'$. Product rule on $${co(k)}xy$.`,
      lines:[`\\cos(x) - \\sin(y)y' = ${S([[k,"y"],[k,"xy'"]])}`, `\\cos(x)${P([[-k,"y"]])} = \\sin(y)y'${P([[k,"xy'"]])}`, `\\cos(x)${P([[-k,"y"]])} = y'\\left(\\sin(y)${P([[k,"x"]])}\\right)`],
      ansT:`\\frac{\\cos(x)${P([[-k,"y"]])}}{\\sin(y)${P([[k,"x"]])}}`, ansA:`(cos(x)-(${k})y)/(sin(y)+(${k})x)`, cond:`\\sin(y)${P([[k,"x"]])}`}; },
  T11:R=>{ const a=R.int(1,3), b=R.nz(-4,4), E=a===1?"e^{y}":`e^{${a}y}`;
    return {eq:`${E} = x^2${P([[b,"xy"]])}`, F:`e^(${a}y)-x^2-(${b})x*y`, rule:`Chain rule on $${E}$: $${co(a)}${E}y'$. Product rule on $${co(b)}xy$.`,
      lines:[`${co(a)}${E}y' = 2x${P([[b,"y"],[b,"xy'"]])}`, `${co(a)}${E}y'${P([[-b,"xy'"]])} = 2x${P([[b,"y"]])}`, `y'\\left(${co(a)}${E}${P([[-b,"x"]])}\\right) = 2x${P([[b,"y"]])}`],
      ansT:`\\frac{2x${P([[b,"y"]])}}{${co(a)}${E}${P([[-b,"x"]])}}`, ansA:`(2x+(${b})y)/(${a}*e^(${a}y)-(${b})x)`, cond:`${co(a)}${E}${P([[-b,"x"]])}`}; },
  T12:R=>{ const a=R.nz(-4,4), c=R.int(1,5), fn=R.pick(["sin","cos"]);
    const base={eq:`${c}${P([[a,"x"]])} = \\${fn}(xy^2)`, F:`${c}+(${a})x-${fn}(x*y^2)`, rule:`Chain rule on $\\${fn}(xy^2)$, and inside it the product rule: $\\frac{d}{dx}(xy^2) = y^2 + 2xyy'$.`};
    if(fn==="sin") return Object.assign(base,{lines:[`${a} = \\cos(xy^2)\\left(y^2 + 2xyy'\\right)`, `${a} = y^2\\cos(xy^2) + 2xy\\cos(xy^2)\\,y'`, `${a} - y^2\\cos(xy^2) = 2xy\\cos(xy^2)\\,y'`],
      ansT:`\\frac{${a} - y^2\\cos(xy^2)}{2xy\\cos(xy^2)}`, ansA:`(${a}-y^2*cos(x*y^2))/(2x*y*cos(x*y^2))`, cond:"2xy\\cos(xy^2)"});
    return Object.assign(base,{lines:[`${a} = -\\sin(xy^2)\\left(y^2 + 2xyy'\\right)`, `${a} = -y^2\\sin(xy^2) - 2xy\\sin(xy^2)\\,y'`, `${a} + y^2\\sin(xy^2) = -2xy\\sin(xy^2)\\,y'`],
      ansT:`-\\frac{${a} + y^2\\sin(xy^2)}{2xy\\sin(xy^2)}`, ansA:`-(${a}+y^2*sin(x*y^2))/(2x*y*sin(x*y^2))`, cond:"2xy\\sin(xy^2)"}); },
  T13:R=>{ const a=R.int(1,4), b=R.int(1,4), Ex=`e^{${S([[a,"x"],[b,"y"]])}}`;
    return {eq:`${Ex} = \\ln(xy^2)`, F:`e^(${a}x+${b}y)-ln(x*y^2)`, rule:`Chain rule on both sides. Inside the log, the product rule: $\\frac{d}{dx}(xy^2) = y^2 + 2xyy'$.`,
      lines:[`${Ex}\\left(${a}${P([[b,"y'"]])}\\right) = \\frac{1}{xy^2}\\left(y^2 + 2xyy'\\right)`, `${co(a)}${Ex} + ${co(b)}${Ex}y' = \\frac{1}{x} + \\frac{2}{y}y'`, `${co(b)}${Ex}y' - \\frac{2}{y}y' = \\frac{1}{x} - ${co(a)}${Ex}`, `y'\\left(${co(b)}${Ex} - \\frac{2}{y}\\right) = \\frac{1}{x} - ${co(a)}${Ex}`, `\\text{Divide, then multiply the top and bottom by } xy.`],
      ansT:`\\frac{y - ${co(a)}xy${Ex}}{${co(b)}xy${Ex} - 2x}`, ansA:`(1/x-${a}e^(${a}x+${b}y))/(${b}e^(${a}x+${b}y)-2/y)`, cond:`${co(b)}xy${Ex} - 2x`, dom:[0.3,0.9]}; },
  T14:R=>{ const a=R.int(1,5);
    return {eq:`${co(a)}x^2 + \\ln(xy) = \\cos(y)`, F:`${a}x^2+ln(x*y)-cos(y)`, rule:"Chain rule on $\\ln(xy)$ and $\\cos(y)$. Inside the log, the product rule: $\\frac{d}{dx}(xy) = y + xy'$.",
      lines:[`${2*a}x + \\frac{1}{xy}\\left(y + xy'\\right) = -\\sin(y)y'`, `\\text{Multiply both sides by } xy\\text{: } ${2*a}x^2y + y + xy' = -xy\\sin(y)y'`, `xy' + xy\\sin(y)y' = -${2*a}x^2y - y`, `y'\\left(x + xy\\sin(y)\\right) = -${2*a}x^2y - y`],
      ansT:`\\frac{-${2*a}x^2y - y}{x + xy\\sin(y)}`, ansA:`(-${2*a}x^2*y-y)/(x+x*y*sin(y))`, cond:"x + xy\\sin(y)"}; },
  T15:R=>{ const a=R.nz(-5,5);
    return {eq:`x^2y^2 = ${co(a)}x + \\sec(y)`, F:`x^2*y^2-(${a})x-sec(y)`, rule:"Product rule on $x^2y^2$. Chain rule on $\\sec(y)$: $\\sec(y)\\tan(y)y'$.",
      lines:[`2xy^2 + 2x^2yy' = ${a} + \\sec(y)\\tan(y)y'`, `2x^2yy' - \\sec(y)\\tan(y)y' = ${a} - 2xy^2`, `y'\\left(2x^2y - \\sec(y)\\tan(y)\\right) = ${a} - 2xy^2`],
      ansT:`\\frac{${a} - 2xy^2}{2x^2y - \\sec(y)\\tan(y)}`, ansA:`(${a}-2x*y^2)/(2x^2*y-sec(y)tan(y))`, cond:"2x^2y - \\sec(y)\\tan(y)"}; },
  T16:R=>{ const k=R.int(2,9);
    return {eq:`\\tan(y) + \\arctan(x) = ${k}y`, F:`tan(y)+arctan(x)-${k}y`, rule:"Chain rule on $\\tan(y)$: $\\sec^2(y)\\,y'$. $\\frac{d}{dx}\\arctan(x) = \\frac{1}{1+x^2}$ has no $y$ in it.",
      lines:[`\\sec^2(y)\\,y' + \\frac{1}{1+x^2} = ${k}y'`, `\\frac{1}{1+x^2} = ${k}y' - \\sec^2(y)\\,y'`, `\\frac{1}{1+x^2} = y'\\left(${k} - \\sec^2(y)\\right)`],
      ansT:`\\frac{1}{(1+x^2)\\left(${k} - \\sec^2(y)\\right)}`, ansA:`1/((1+x^2)*(${k}-sec(y)^2))`, cond:`${k} - \\sec^2(y)`}; },
  T17:R=>{ const a=R.int(1,3), ax2=a===1?"x^2":`${a}x^2`;
    return {eq:`y\\sin(${ax2}) = x\\sin(y^2)`, F:`y*sin(${a}x^2)-x*sin(y^2)`, rule:"Product rule on both sides, and the chain rule inside each sine.",
      lines:[`y'\\sin(${ax2}) + ${2*a}xy\\cos(${ax2}) = \\sin(y^2) + 2xyy'\\cos(y^2)`, `y'\\sin(${ax2}) - 2xyy'\\cos(y^2) = \\sin(y^2) - ${2*a}xy\\cos(${ax2})`, `y'\\left(\\sin(${ax2}) - 2xy\\cos(y^2)\\right) = \\sin(y^2) - ${2*a}xy\\cos(${ax2})`],
      ansT:`\\frac{\\sin(y^2) - ${2*a}xy\\cos(${ax2})}{\\sin(${ax2}) - 2xy\\cos(y^2)}`, ansA:`(sin(y^2)-${2*a}x*y*cos(${a}x^2))/(sin(${a}x^2)-2x*y*cos(y^2))`, cond:`\\sin(${ax2}) - 2xy\\cos(y^2)`}; }
};

/* ---------- distractors for factorial ratios ---------- */
function factOptions(R,p,q,v="n"){
  const good={t:ratioT(p,q,v), a:ratioA(p,q,v)};
  const pool=[];
  if(p>q){ pool.push({t:prodT(q,p,v)},{t:prodT(q+1,p+1,v)},{t:`\\frac{${sh(p,v)}}{${sh(q,v)}}`},{t:`\\frac{1}{${prodT(q+1,p,v)}}`}); if(p-q>=2) pool.push({t:sh(p,v)}); else pool.push({t:"1"}); }
  else { pool.push({t:`\\frac{1}{${prodT(p,q,v)}}`},{t:`\\frac{1}{${prodT(p+1,q+1,v)}}`},{t:`\\frac{${sh(p,v)}}{${sh(q,v)}}`},{t:prodT(p+1,q,v)}); if(q-p>=2) pool.push({t:`\\frac{1}{${sh(q,v)}}`}); else pool.push({t:"1"}); }
  const seen=new Set([good.t]); const opts=[good.t];
  R.shuffle(pool).forEach(o=>{ if(opts.length<5 && !seen.has(o.t)){ seen.add(o.t); opts.push(o.t); } });
  const order=R.shuffle(opts.map((_,i)=>i));
  return {options:order.map(i=>`$${opts[i]}$`), correct:order.indexOf(0), opts, order};
}

M.lecture({
  id:"L16", n:16, date:"2026-10-21", added:"2026-10-21", unit:"u6", quiz:"MT",
  title:"Factorials and Implicit Differentiation", sections:["2.6","2.7.1"], pages:4,
  summary:"What $n!$ means and how to simplify a ratio of factorials by cancelling. Then implicit differentiation: treat $y$ as a function of $x$, differentiate both sides, and solve for $y'$. Used for tangent lines to curves like circles and for a sphere whose volume and radius both change over time.",
  flags:[
    {ref:"p. 4", text:"The sphere example ends at $\\frac{1}{10\\pi} = \\frac{dr}{dt}$ with no units and no closing sentence. The answer is $\\frac{dr}{dt} = \\frac{1}{10\\pi}$ cm/s, about $0.0318$ cm/s: the radius is growing at about 0.032 cm per second when $r = 5$ cm. On a test, write the units and a sentence. Marks can be lost for missing notation."},
    {ref:"p. 3", text:"The tangent line in the second example is written $y = f(a) + f'(a)(x-a)$, but the curve $2x^3 + y^3 = 5xy$ has no function $f$. Read $f(a)$ as the $y$-value of the point (here 2) and $f'(a)$ as the slope $y'$ found at that point (here $\\frac{4}{7}$). The final line $y = 2 + \\frac{4}{7}(x-1)$ is correct."}
  ],
  formulas:[
    {id:"L16.f.fact-def", name:"Factorial", tex:"n! = 1\\cdot 2\\cdot 3\\cdots n", note:"For any integer $n \\ge 1$: the product of all integers from 1 to $n$ inclusive. Read as 'n factorial'.", ref:"p. 1",
      blank:{tex:"n! = \\boxed{\\,?\\,}", text:true, accept:["1*2*3*...*n","1*2*...*n","1·2·3⋯n","1·2·3···n","1·2·3...n","1·2·3…n","1⋅2⋅3⋯n","1\\cdot2\\cdot3\\cdotsn","1.2.3...n","1x2x3x...xn","1*2*3*…*n","1×2×3×...×n","123...n"]}},
    {id:"L16.f.zero-fact", name:"Zero factorial", tex:"0! = 1", note:"A special definition, not a product.", ref:"p. 1", blank:{tex:"0! = \\boxed{\\,?\\,}", answer:"1", type:"num"}},
    {id:"L16.f.fact-values", name:"First factorial values", tex:"0! = 1,\\ 1! = 1,\\ 2! = 2,\\ 3! = 6,\\ 4! = 24", ref:"p. 1", blank:{tex:"0! = 1,\\ 1! = 1,\\ 2! = 2,\\ 3! = 6,\\ 4! = \\boxed{\\,?\\,}", answer:"24", type:"num"}},
    {id:"L16.f.fact-ratio", name:"Factorial ratio (lecture example)", tex:"\\frac{(n-1)!}{(n+3)!} = \\frac{1}{n(n+1)(n+2)(n+3)}", note:"Write both as products and cancel $1\\cdot 2\\cdots(n-1)$.", ref:"p. 1",
      blank:{tex:"\\frac{(n-1)!}{(n+3)!} = \\frac{1}{\\boxed{\\,?\\,}}", answer:"n(n+1)(n+2)(n+3)", vars:["n"], domain:[2,6]}},
    {id:"L16.f.function", name:"Definition of a function", tex:"\\text{for each input there is exactly one output}", note:"So the circle $x^2+y^2=1$ cannot be written as $y = f(x)$ (vertical line test).", ref:"p. 2"},
    {id:"L16.f.implicit-def", name:"Implicitly defined function", tex:"\\text{there is some way to write it as a function, even if we don't know how}", ref:"p. 2"},
    {id:"L16.f.lambert", name:"Lambert $W$ function", tex:"we^w = z", note:"$z$ is the independent variable. Used in quantum mechanics, biochemistry and engineering.", ref:"p. 2"},
    {id:"L16.f.method", name:"Implicit differentiation", tex:"\\text{treat } y \\text{ as } y(x),\\ \\text{differentiate both sides, solve for } y'", note:"Before dividing, make sure what you divide by is not 0.", ref:"pp. 2 to 3"},
    {id:"L16.f.product-xy", name:"Product rule on $xy$", tex:"\\frac{d}{dx}\\left[x\\cdot y(x)\\right] = 1\\cdot y(x) + x\\cdot y'(x)", ref:"p. 3",
      blank:{tex:"\\frac{d}{dx}\\left[x\\cdot y(x)\\right] = \\boxed{\\,?\\,}", text:true, accept:["1*y(x)+x*y'(x)","y(x)+xy'(x)","y+xy'","y + x y'","1y+xy'","1*y+x*y'","xy'+y","xy'(x)+y(x)","y(x)+x*y'(x)"]}},
    {id:"L16.f.chain-y2", name:"Chain rule on $y^2$", tex:"\\frac{d}{dx}(y(x))^2 = 2y(x)\\,y'(x)", ref:"p. 3",
      blank:{tex:"\\frac{d}{dx}(y(x))^2 = \\boxed{\\,?\\,}", text:true, accept:["2y(x)y'(x)","2y(x)*y'(x)","2yy'","2y*y'","2y y'","2y(x)\\,y'(x)","2y'y","2y'(x)y(x)"]}},
    {id:"L16.f.tangent", name:"Tangent line", tex:"y = f(a) + f'(a)(x - a)", note:"For an implicit curve: $f(a)$ is the $y$-value of the point and $f'(a)$ is $y'$ at that point.", ref:"p. 3",
      blank:{tex:"y = \\boxed{\\,?\\,}", text:true, accept:["f(a)+f'(a)(x-a)","f(a)+f'(a)*(x-a)","f'(a)(x-a)+f(a)","f(a) + f'(a)(x - a)"]}},
    {id:"L16.f.sphere", name:"Volume of a sphere", tex:"V = \\frac{4}{3}\\pi r^3", ref:"p. 4", blank:{tex:"V = \\boxed{\\,?\\,}", answer:"4/3*pi*r^3", vars:["r"], domain:[0.5,3]}},
    {id:"L16.f.sphere-rate", name:"Sphere: volume rate and radius rate", tex:"\\frac{dV}{dt} = 4\\pi r^2\\frac{dr}{dt}", note:"Differentiate $V = \\frac{4}{3}\\pi r^3$ with respect to $t$. The chain rule gives the $\\frac{dr}{dt}$.", ref:"p. 4",
      blank:{tex:"\\frac{dV}{dt} = \\boxed{\\,?\\,}\\,\\frac{dr}{dt}", answer:"4pi r^2", vars:["r"], domain:[0.5,3]}}
  ],
  glossary:[
    {id:"L16.t.factorial", term:"Factorial, $n!$", def:"For an integer $n \\ge 1$, $n!$ is the product of all integers from 1 to $n$: $5! = 1\\cdot2\\cdot3\\cdot4\\cdot5 = 120$. Read it as 'n factorial'.", ref:"p. 1"},
    {id:"L16.t.zero-fact", term:"$0!$", def:"Defined to be 1. It is a special definition, so $0! = 1$, not 0.", ref:"p. 1"},
    {id:"L16.t.function", term:"Function", def:"A rule where each input has exactly one output.", ref:"p. 2"},
    {id:"L16.t.vlt", term:"Vertical line test", def:"If some vertical line hits a curve twice, the curve cannot be written as $y = f(x)$. The circle $x^2+y^2=1$ fails it.", ref:"p. 2"},
    {id:"L16.t.implicit", term:"Implicitly defined function", def:"An equation in $x$ and $y$ that we treat as $y$ being a function of $x$, even if we can't solve for $y$. There is some way to write it as a function, we just don't know how.", ref:"p. 2"},
    {id:"L16.t.lambert", term:"Lambert $W$ function", def:"The function defined implicitly by $we^w = z$, with $z$ the independent variable. You can't solve for $w$ with the functions you know.", ref:"p. 2"},
    {id:"L16.t.impdiff", term:"Implicit differentiation", def:"Think of $y$ as $y(x)$, take $\\frac{d}{dx}$ of both sides (product and chain rules wherever $y$ appears), then solve for $y'$.", ref:"pp. 2 to 3"},
    {id:"L16.t.de", term:"Differential equation", def:"An equation with an unknown function and its derivatives. The answer $y' = \\frac{y}{1-x-2y}$ is one, because it has $y$ and $y'$ in it.", ref:"p. 3"}
  ],
  figures:{
    cancel:{title:"Cancel the common factors", cap:"<b>Fig. 16.1</b> Each tile is one factor. The top and bottom share $1\\cdot 2\\cdots$ up to the smaller factorial, so those tiles cancel. What is left (coloured) is the answer. (Lecture 16, pp. 1 to 2)",
      build(host,{PLOT,M}){
        const NS="http://www.w3.org/2000/svg";
        const mk=(tag,at,par)=>{ const e=document.createElementNS(NS,tag); for(const k in at) e.setAttribute(k,at[k]); if(par) par.append(e); return e; };
        const W=400, H=176;
        const svg=mk("svg",{viewBox:`0 0 ${W} ${H}`,class:"fig",role:"img","aria-label":"Factor tiles for a ratio of factorials"});
        svg.style.setProperty("--c","var(--u6)"); svg.style.maxWidth="480px"; svg.style.display="block"; svg.style.margin="0 auto"; host.append(svg);
        const ctl=PLOT.controls(host); const ro=PLOT.readout(host);
        const forms={a:{p:1,q:0},b:{p:-1,q:1},c:{p:-1,q:3},d:{p:2,q:-2},e:{num:[7,10]}};
        let key="c", n=4;
        const sg=PLOT.seg(ctl,{label:"Ratio",value:key,items:[["a","(n+1)!/n!"],["b","(n−1)!/(n+1)!"],["c","(n−1)!/(n+3)!"],["d","(n+2)!/(n−2)!"],["e","7!/10!"]],onchange:v=>{ key=v; draw(); }});
        [...sg.children].forEach(b=>{ b.style.flex="1 0 auto"; b.style.minWidth="0"; });
        const sl=PLOT.slider(ctl,{label:"n",min:3,max:8,step:1,value:n,oninput:v=>{ n=v; draw(); }});
        const rich=s=>(M&&M.rich)?M.rich(s):s;
        function row(y,count,common,name,symb,most){
          const x0=58, gap=4, w=Math.min(50,(W-x0-6)/most-gap);
          const t=mk("text",{x:4,y:y+30,class:"lbl"},svg); t.textContent=name;
          for(let i=1;i<=count;i++){
            const x=x0+(i-1)*(w+gap), cancel=i<=common;
            mk("rect",{x,y,width:w,height:48,rx:5,style:cancel?"fill:var(--fig-soft);stroke:var(--fig-axis);stroke-width:1":"fill:var(--c);fill-opacity:.16;stroke:var(--c);stroke-width:1.6"},svg);
            const v=mk("text",{x:x+w/2,y:y+25,"text-anchor":"middle",style:`font-size:${w<34?15:17}px;font-family:var(--mono);fill:${cancel?"var(--ink2)":"var(--head)"};font-weight:${cancel?400:600}`},svg); v.textContent=String(i);
            if(symb && i>=n-3){ const s=mk("text",{x:x+w/2,y:y+41,"text-anchor":"middle",style:"font-size:10.5px;font-family:var(--mono);fill:var(--ink2)"},svg); s.textContent=(i===n?"n":i>n?`n+${i-n}`:`n−${n-i}`); }
            if(cancel) mk("line",{x1:x+4,y1:y+44,x2:x+w-4,y2:y+4,style:"stroke:var(--ink2);stroke-width:1.2;opacity:.65"},svg);
          }
          return x0+count*(w+gap);
        }
        function draw(){
          svg.innerHTML="";
          const f=forms[key], symb=!f.num; sl.disabled=!symb;
          const top=symb?n+f.p:f.num[0], bot=symb?n+f.q:f.num[1], common=Math.min(top,bot);
          const nameT=symb?(f.p===0?"n!":`(n${f.p>0?"+":"−"}${Math.abs(f.p)})!`):`${top}!`, nameB=symb?(f.q===0?"n!":`(n${f.q>0?"+":"−"}${Math.abs(f.q)})!`):`${bot}!`;
          const most=Math.max(top,bot);
          const e1=row(10,top,common,nameT,symb,most);
          const e2=row(112,bot,common,nameB,symb,most);
          mk("line",{x1:4,x2:Math.max(e1,e2),y1:86,y2:86,style:"stroke:var(--fig-stroke);stroke-width:1.6"},svg);
          // numbers
          const big=Math.max(top,bot), lo=common+1;
          const g=prodN(lo,big), dots=dotsN(lo,big);
          const numTeX = top>bot?(lo===big?String(big):`${dots} = ${g}`):(lo===big?`\\frac{1}{${big}}`:`\\frac{1}{${dots}} = \\frac{1}{${g}}`);
          const nv=`\\frac{${top}!}{${bot}!} = ${numTeX}`;
          if(symb){ const p=f.p,q=f.q, LHS=`\\frac{${fct(p)}}{${fct(q)}}`;
            ro.innerHTML=rich(`$\\displaystyle ${LHS} = ${ratioT(p,q)}$<br>With $n = ${n}$: $\\displaystyle ${nv}$`);
          } else ro.innerHTML=rich(`$\\displaystyle ${nv}$ (exercise, p. 1)`);
        }
        draw();
      }},
    implicit:{title:"Tangent lines on implicit curves", cap:"<b>Fig. 16.2</b> None of these curves is a function $y = f(x)$, but implicit differentiation still gives the slope at any point $(x, y)$ on them. The formula for $y'$ needs both coordinates. Where its denominator is 0 the tangent is vertical. (Lecture 16, pp. 2 to 3)",
      build(host,{PLOT,M}){
        const NS="http://www.w3.org/2000/svg";
        const rich=s=>(M&&M.rich)?M.rich(s):s;
        const r0=-1.324717957244746, U=Math.sqrt(2.3-r0);
        const th0=-0.66, th1=Math.PI/2-1e-4;
        const fol=th=>{ const t=Math.tan(th), d=2+t*t*t; return [5*t/d, 5*t*t/d]; };
        const C={
          fol:{name:"2x³ + y³ = 5xy", x:[-3.2,4], y:[-2.2,2.6], s0:(Math.atan(2)-th0)/(th1-th0),
            P:s=>fol(th0+s*(th1-th0)), num:(x,y)=>5*y-6*x*x, den:(x,y)=>3*y*y-5*x,
            tex:"$2x^3 + y^3 = 5xy \\;\\Rightarrow\\; 6x^2 + 3y^2y' = 5y + 5xy'$<br>$y' = \\dfrac{5y - 6x^2}{3y^2 - 5x}$",
            extra:G=>{ G.param(t=>fol(t)[0],t=>fol(t)[1],-Math.PI/2+1e-3,-1.2,{cls:"cv c"}); }},
          circ:{name:"x² + y² = 4", x:[-4,4], y:[-2.66,2.66], s0:5/6, P:s=>[2*Math.cos(2*Math.PI*s),2*Math.sin(2*Math.PI*s)], num:(x,y)=>-x, den:(x,y)=>y, wrap:true,
            tex:"$x^2 + y^2 = 4 \\;\\Rightarrow\\; 2x + 2yy' = 0$<br>$y' = -\\dfrac{x}{y}$"},
          ell:{name:"y² = x³ − x + 1", x:[-2,3], y:[-3.6,3.6], s0:(-Math.sqrt(-1-r0)/U+1)/2,
            P:s=>{ const u=(2*s-1)*U, x=r0+u*u, v=x*x*x-x+1; return [x,(u<0?-1:1)*Math.sqrt(Math.max(0,v))]; }, num:(x,y)=>3*x*x-1, den:(x,y)=>2*y,
            tex:"$y^2 = x^3 - x + 1 \\;\\Rightarrow\\; 2yy' = 3x^2 - 1$<br>$y' = \\dfrac{3x^2 - 1}{2y}$"}
        };
        let key="fol"; const sv={fol:C.fol.s0,circ:C.circ.s0,ell:C.ell.s0};
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Curve",value:key,items:[["fol","Lecture curve"],["circ","Circle"],["ell","Elliptic curve"]],onchange:v=>{ key=v; build(); }});
        const wrap=document.createElement("div"); host.append(wrap);
        const fx=document.createElement("div"); fx.className="small"; fx.style.margin="8px 0"; host.append(fx);
        const ro=PLOT.readout(host);
        const ctl2=PLOT.controls(host);
        const sl=PLOT.slider(ctl2,{label:"Move the point along the curve",min:0,max:1000,step:1,value:Math.round(sv[key]*1000),fmt:v=>{ const [x,y]=C[key].P(v/1000); return `(${x.toFixed(2)}, ${y.toFixed(2)})`; },oninput:v=>{ sv[key]=v/1000; upd(); }});
        let G, tan, vl, hg, samples=[];
        function build(){
          wrap.innerHTML=""; const c=C[key];
          G=PLOT.graph(wrap,{x:c.x,y:c.y,h:380,c:"var(--u6)",xlabel:"x",ylabel:"y",label:"Implicit curve "+c.name});
          if(key==="fol") G.param(t=>fol(t)[0],t=>fol(t)[1],th0,th1,{cls:"cv c",n:500});
          else G.param(t=>c.P(t)[0],t=>c.P(t)[1],0,1,{cls:"cv c",n:400});
          if(c.extra) c.extra(G);
          tan=G.line(0,0,0,0,{cls:"tan dash",layer:G.layer.front}); vl=G.line(0,c.y[0],0,c.y[1],{cls:"tan dash",layer:G.layer.front});
          samples=[]; for(let i=0;i<=600;i++){ const s=i/600, [x,y]=c.P(s); samples.push([s,G.X(x),G.Y(y)]); }
          hg=document.createElementNS(NS,"g"); hg.setAttribute("class","drag"); hg.setAttribute("tabindex","0"); hg.setAttribute("role","slider"); hg.setAttribute("aria-label","Point on the curve");
          const halo=document.createElementNS(NS,"circle"); halo.setAttribute("r","14"); halo.setAttribute("style","fill:var(--c,var(--accent));fill-opacity:.12"); hg.append(halo);
          const dot=document.createElementNS(NS,"circle"); dot.setAttribute("r","6.5"); dot.setAttribute("class","dot"); dot.setAttribute("style","stroke-width:2.4"); hg.append(dot);
          G.layer.top.append(hg);
          const svg=G.svg; let drag=false;
          const toSvg=e=>{ const pt=svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const m=svg.getScreenCTM(); return m?pt.matrixTransform(m.inverse()):{x:0,y:0}; };
          const nearest=p=>{ let best=0, bd=1e18; samples.forEach(([s,X,Y])=>{ const d=(X-p.x)**2+(Y-p.y)**2; if(d<bd){ bd=d; best=s; } }); return best; };
          svg.addEventListener("pointerdown",e=>{ drag=true; try{ svg.setPointerCapture(e.pointerId); }catch(_){} e.preventDefault(); sv[key]=nearest(toSvg(e)); upd(true); });
          svg.addEventListener("pointermove",e=>{ if(!drag) return; sv[key]=nearest(toSvg(e)); upd(true); });
          svg.addEventListener("pointerup",()=>{ drag=false; });
          hg.addEventListener("keydown",e=>{ let s=sv[key]; if(e.key==="ArrowRight"||e.key==="ArrowUp") s+=0.004; else if(e.key==="ArrowLeft"||e.key==="ArrowDown") s-=0.004; else return; e.preventDefault(); sv[key]=C[key].wrap?(s+1)%1:Math.max(0,Math.min(1,s)); upd(true); });
          fx.innerHTML=rich(c.tex);
          upd(true);
        }
        function upd(syncSlider){
          const c=C[key], [x,y]=c.P(sv[key]), nu=c.num(x,y), de=c.den(x,y);
          hg.setAttribute("transform",`translate(${G.X(x)},${G.Y(y)})`);
          if(syncSlider) sl.set(Math.round(sv[key]*1000));
          const f=v=>(Math.abs(v)<5e-4?0:v).toFixed(2).replace("-","−");
          let msg;
          if(Math.abs(nu)<0.03 && Math.abs(de)<0.03){ tan.style.display="none"; vl.style.display="none"; msg=`top and bottom are both about 0 here: the curve crosses itself at the origin, so there is no single tangent line`; }
          else if(Math.abs(de)<0.03 || Math.abs(nu/de)>40){ tan.style.display="none"; vl.style.display=""; vl.set(x,c.y[0],x,c.y[1]); msg=`denominator ≈ 0, so y′ is undefined: vertical tangent`; }
          else { const m=nu/de; vl.style.display="none"; tan.style.display="";
            let xa=c.x[0], xb=c.x[1]; const yAt=t=>y+m*(t-x), xAt=v=>x+(v-y)/m;
            if(Math.abs(m)>1e-9){ const u=[xAt(c.y[0]),xAt(c.y[1])].sort((p,q)=>p-q); xa=Math.max(xa,u[0]); xb=Math.min(xb,u[1]); }
            tan.set(xa,yAt(xa),xb,yAt(xb));
            msg=`y′ = ${f(nu)} / ${f(de)} = <b>${m.toFixed(3).replace("-","−")}</b>`; }
          ro.innerHTML=`point (x, y) = (<b>${f(x)}</b>, <b>${f(y)}</b>) &nbsp; ${msg}`;
        }
        build();
      }},
    sphere:{title:"Sphere: how fast the radius grows", cap:"<b>Fig. 16.3</b> Air goes into a ball at a fixed rate $\\frac{dV}{dt}$. From $\\frac{dV}{dt} = 4\\pi r^2\\frac{dr}{dt}$, the radius grows at $\\frac{dr}{dt} = \\frac{dV/dt}{4\\pi r^2}$ cm/s, which gets slower as the ball gets bigger. (Lecture 16, p. 4)",
      build(host,{PLOT,M}){
        let R=10, r=5;
        const f=x=>R/(4*Math.PI*x*x);
        const G=PLOT.graph(host,{x:[0,10.5],y:[0,0.8],c:"var(--u6)",xlabel:"r (cm)",ylabel:"dr/dt (cm/s)",xstep:1,ystep:0.1});
        const rmin=()=>Math.sqrt(R/(4*Math.PI*0.8)); const cv=G.fn(f,{from:rmin(),to:10.5,cls:"cv c"});
        const NS="http://www.w3.org/2000/svg";
        const ball=document.createElementNS(NS,"circle"); ball.setAttribute("style","fill:var(--c);fill-opacity:.14;stroke:var(--c);stroke-width:1.6"); G.layer.back.append(ball);
        const bl=G.label(7.6,0.4,"",{cls:"lblc",anchor:"middle"});
        const vg=G.vline(5), hl=G.line(0,0,0,0,{cls:"lt dash"});
        const ro=PLOT.readout(host), ctl=PLOT.controls(host);
        const h=G.handle(r,f(r),{f:x=>f(x),bounds:[1.5,10],label:"Radius",onMove:x=>{ r=x; draw(); }});
        PLOT.slider(ctl,{label:"dV/dt (cm³/s)",min:2,max:20,step:1,value:R,fmt:v=>v+" cm³/s",oninput:v=>{ R=v; cv.update(f,rmin(),10.5); h.move(r); }});
        function draw(){
          const cx=G.X(7.6), cy=G.Y(0.6); ball.setAttribute("cx",cx); ball.setAttribute("cy",cy); ball.setAttribute("r",(r*5).toFixed(1));
          bl.set(7.6,0.6,"ball, r = "+r.toFixed(1)+" cm"); bl.setAttribute("y",cy+r*5+14);
          vg.set(r,0,r,f(r)); hl.set(0,f(r),r,f(r));
          ro.innerHTML=`r = <b>${r.toFixed(2)}</b> cm &nbsp; dV/dt = <b>${R}</b> cm³/s &nbsp; dr/dt = ${R}/(4π·${r.toFixed(2)}²) = <b>${f(r).toFixed(4)}</b> cm/s`;
        }
        draw();
      }}
  },
  gens:[
    {id:"L16.g.fact-num", title:"Simplify factorials with numbers", skill:"Cancel factorials in a fraction of numbers", ref:"pp. 1 to 2",
      gen(R,d){
        if(d===1){ const b=R.int(4,18), diff=R.int(1,3), up=R.int(0,1)===1, a=up?b+diff:b-diff;
          const big=Math.max(a,b), small=Math.min(a,b), g=prodN(small+1,big), dots=dotsN(small+1,big);
          const ans=a>b?String(g):`1/${g}`, aT=a>b?String(g):`\\frac{1}{${g}}`;
          return {prompt:`Simplify $\\frac{${a}!}{${b}!}$.`, answer:{type:"num",rel:1e-9,answer:ans,placeholder:"e.g. 1/720"}, verify:{value:fact(a)/fact(b)},
            hint:`Write both as products. $${big}! = 1\\cdot 2\\cdots ${small}\\cdot ${small+1}\\cdots ${big}$, so it contains all of $${small}!$.`,
            steps:[`$${big}! = ${small}!\\cdot ${dots}$, because $${big}!$ is $1\\cdot 2\\cdots ${small}$ followed by ${small+1===big?`the factor ${big}`:`the factors ${small+1} to ${big}`}.`,
              a>b?`So $\\frac{${a}!}{${b}!} = \\frac{${b}!\\cdot ${dots}}{${b}!} = ${dots}$.`:`So $\\frac{${a}!}{${b}!} = \\frac{${a}!}{${a}!\\cdot ${dots}} = \\frac{1}{${dots}}$.`].concat(small+1===big?[]:[`$= ${aT}$.`]), answerTeX:`$${aT}$`};
        }
        if(d===2){ const kind=R.pick(["binom","binom","zero","f"]);
          if(kind==="binom"){ const a=R.int(5,9), b=R.int(2,a-2), c=a-b, big=Math.max(b,c), small=Math.min(b,c);
            const val=fact(a)/(fact(b)*fact(c));
            return {prompt:`Simplify $\\frac{${a}!}{${b}!\\cdot ${c}!}$.`, answer:{type:"num",rel:1e-9,answer:String(val)}, verify:{value:prodN(big+1,a)/fact(small)},
              hint:`Cancel the larger factorial on the bottom, $${big}!$, against the start of $${a}!$. Then divide by what is left.`,
              steps:[`$${a}! = ${big}!\\cdot ${dotsN(big+1,a)}$.`,`So $\\frac{${a}!}{${b}!\\cdot ${c}!} = \\frac{${dotsN(big+1,a)}}{${small}!} = \\frac{${prodN(big+1,a)}}{${fact(small)}}$.`,`$= ${val}$.`], answerTeX:`$${val}$`};
          }
          if(kind==="zero"){ const a=R.int(2,4), b=R.int(3,5), c=R.int(1,a), num=fact(a)*fact(b), den=fact(c);
            return {prompt:`Simplify $\\frac{${a}!\\,${b}!}{${c}!\\,0!}$.`, answer:{type:"num",rel:1e-9,answer:M.fracA(num,den)}, verify:{value:num/den},
              hint:"Remember $0! = 1$, not 0. Then work out each factorial.",
              steps:[`$0! = 1$ by definition, so the bottom is $${c}!\\cdot 1 = ${den}$.`,`Top: $${a}!\\cdot ${b}! = ${fact(a)}\\cdot ${fact(b)} = ${num}$.`,`$\\frac{${num}}{${den}} = ${M.frac(num,den)}$.`], answerTeX:`$${M.frac(num,den)}$`};
          }
          const p=R.pick([1,2,3]), q=R.pick([-1,0]), k=R.int(1,5), top=k+p, bot=k+q, val=prodN(bot+1,top);
          return {prompt:`Let $f(n) = \\frac{${fct(p)}}{${fct(q)}}$. Evaluate $f(${k})$.`, answer:{type:"num",rel:1e-9,answer:String(val)}, verify:{value:fact(top)/fact(bot)},
            hint:`Substitute first: $f(${k}) = \\frac{${top}!}{${bot}!}$.${bot===0?" And $0! = 1$.":""}`,
            steps:[`$f(${k}) = \\frac{${top}!}{${bot}!}$.`, bot===0?`$0! = 1$, so $f(${k}) = ${top}! = ${dotsN(1,top)}$.`:`$${top}! = ${bot}!\\cdot ${dotsN(bot+1,top)}$, so the $${bot}!$ cancels.`, `$f(${k}) = ${val}$.`], answerTeX:`$${val}$`};
        }
        const kind=R.pick(["four","four","square","solve"]);
        if(kind==="four"){ const c=R.int(9,14), a=c+R.int(1,2), b=R.int(5,9), dd=b+R.int(1,2);
          const num=prodN(c+1,a), den=prodN(b+1,dd), g=M.gcd(num,den);
          return {prompt:`Simplify $\\frac{${a}!\\,${b}!}{${c}!\\,${dd}!}$.`, answer:{type:"num",rel:1e-9,answer:M.fracA(num,den)}, verify:{value:(fact(a)/fact(c))*(fact(b)/fact(dd))},
            hint:`Split it into two fractions: $\\frac{${a}!}{${c}!}\\cdot\\frac{${b}!}{${dd}!}$, and simplify each one.`,
            steps:[`$\\frac{${a}!\\,${b}!}{${c}!\\,${dd}!} = \\frac{${a}!}{${c}!}\\cdot\\frac{${b}!}{${dd}!}$.`,`$\\frac{${a}!}{${c}!} = ${dotsN(c+1,a)} = ${num}$ and $\\frac{${b}!}{${dd}!} = \\frac{1}{${dotsN(b+1,dd)}} = \\frac{1}{${den}}$.`,`So the answer is $\\frac{${num}}{${den}}${g>1?` = ${M.frac(num,den)}`:""}$.`], answerTeX:`$${M.frac(num,den)}$`};
        }
        if(kind==="square"){ const m=R.int(6,10), a=m+R.int(2,3), b=m-1;
          const num=prodN(m+1,a), den=m, g=M.gcd(num,den);
          return {prompt:`Simplify $\\frac{${a}!\\,${b}!}{(${m}!)^2}$.`, answer:{type:"num",rel:1e-9,answer:M.fracA(num,den)}, verify:{value:(fact(a)/fact(m))*(fact(b)/fact(m))},
            hint:`$(${m}!)^2 = ${m}!\\cdot ${m}!$. Pair one $${m}!$ with $${a}!$ and the other with $${b}!$.`,
            steps:[`$\\frac{${a}!\\,${b}!}{(${m}!)^2} = \\frac{${a}!}{${m}!}\\cdot\\frac{${b}!}{${m}!}$.`,`$\\frac{${a}!}{${m}!} = ${dotsN(m+1,a)} = ${num}$ and $\\frac{${b}!}{${m}!} = \\frac{1}{${m}}$.`,`So the answer is $\\frac{${num}}{${m}}${g>1?` = ${M.frac(num,den)}`:""}$.`], answerTeX:`$${M.frac(num,den)}$`};
        }
        const nn=R.int(4,12), K=nn*(nn-1);
        return {prompt:`Find the value of $n$ that makes $n! = ${K}\\,(n-2)!$ true.`, answer:{type:"num",rel:1e-9,answer:String(nn)}, verify:{value:(1+Math.sqrt(1+4*K))/2},
          hint:"Divide both sides by $(n-2)!$ and simplify the left side.",
          steps:[`Divide by $(n-2)!$: $\\frac{n!}{(n-2)!} = ${K}$.`,`$\\frac{n!}{(n-2)!} = \\frac{1\\cdot 2\\cdots(n-2)(n-1)n}{1\\cdot 2\\cdots(n-2)} = (n-1)n$.`,`So $(n-1)n = ${K} = ${nn-1}\\cdot ${nn}$, which gives $n = ${nn}$.`], answerTeX:`$n = ${nn}$`};
      }},
    {id:"L16.g.fact-sym", title:"Simplify factorials with $n$", skill:"Simplify a ratio like $\\frac{(n-1)!}{(n+1)!}$", ref:"pp. 1 to 2",
      gen(R,d){
        if(d<3){ let p,q;
          if(d===1){ p=R.int(-2,2); q=p+R.pick([-1,1]); }
          else { p=R.int(-2,2); q=p+R.pick([-3,-2,2,3]); }
          const O=factOptions(R,p,q), c=Math.min(p,q);
          return {prompt:`Simplifying $\\frac{${fct(p)}}{${fct(q)}}$ gives`, parts:[{answer:{type:"mc",options:O.options,correct:O.correct}}],
            hint:"Write both factorials out as products from 1. The smaller one is the start of the bigger one, so it cancels.",
            steps:[`$\\frac{${fct(p)}}{${fct(q)}} = \\frac{${expand(p,c)}}{${expand(q,c)}}$`,`The factors $1\\cdot 2\\cdots ${par(c)}$ are on the top and the bottom, so they cancel.`,`$= ${ratioT(p,q)}$`],
            answerTeX:`$${ratioT(p,q)}$`};
        }
        const two=R.int(0,2)===0; let p,q,v;
        if(two){ v="2n"; p=R.pick([0,1,2]); q=p+R.pick([-2,-1,1,2]); }
        else { v="n"; p=R.int(-2,2); q=p+R.pick([-4,-3,-2,2,3,4]); }
        const c=Math.min(p,q);
        return {prompt:`Simplify $\\frac{${fct(p,v)}}{${fct(q,v)}}$. Leave no factorials in your answer.`, answer:{answer:ratioA(p,q,v),vars:["n"],domain:[3,8],form:s=>!/!/.test(s),formWhy:"Equivalent, but simplify it: no factorials should be left.",placeholder:"e.g. 1/(n(n+1))"},
          verify:{expr:`${fct(p,v).replace(/[{}]/g,"")}/${fct(q,v).replace(/[{}]/g,"")}`,v:"n"},
          hint:`Write both as products from 1. ${v==="2n"?"Careful: $(2n)!$ is the product up to $2n$, not $2\\cdot n!$.":"Find which factorial is smaller: it cancels completely."}`,
          steps:[`$\\frac{${fct(p,v)}}{${fct(q,v)}} = \\frac{${expand(p,c,v)}}{${expand(q,c,v)}}$`,`Cancel $1\\cdot 2\\cdots ${par(c,v)}$ from the top and the bottom.`,`$= ${ratioT(p,q,v)}$`],
          answerTeX:`$${ratioT(p,q,v)}$`};
      }},
    {id:"L16.g.implicit", title:"Implicit differentiation: find $y'$", skill:"Differentiate an implicitly defined function", ref:"pp. 2 to 4",
      gen(R,d){
        const pool=d===1?["T1","T2","T3","T4","T5"]:d===2?["T4","T6","T7","T8","T9","T10","T11"]:["T12","T13","T14","T15","T16","T17"];
        const key=R.pick(pool), T=IMP[key](R);
        const prompt=d===3?`Consider the implicitly defined function $${T.eq}$. Find $\\frac{dy}{dx}$.`:`Find $y'$ for the implicitly defined function $${T.eq}$.`;
        return {prompt, answer:{answer:T.ansA,vars:["x","y"],domain:T.dom||[0.3,1.2],placeholder:"in terms of x and y, e.g. (1 - 2x y^2)/(2x^2 y)"},
          implicitF:T.F,
          hint:"Treat $y$ as $y(x)$. Every term with a $y$ in it gets a $y'$ from the chain rule, and a product like $xy$ needs the product rule. Then collect the $y'$ terms and solve. Leave the answer in terms of $x$ and $y$.",
          steps:[`Treat $y$ as a function of $x$ and differentiate both sides with respect to $x$. ${T.rule}`].concat(T.lines.map(l=>`$${l}$`),[`$y' = ${T.ansT}$, assuming $${T.cond} \\neq 0$.`]),
          answerTeX:`$y' = ${T.ansT}$`};
      }},
    {id:"L16.g.tangent", title:"Tangent line to an implicit curve", skill:"Slope and tangent line at a point on an implicit curve", ref:"p. 3",
      gen(R,d){
        const kind=d===1?R.pick(["circle","ellipse"]):d===2?R.pick(["quad","cubic","cubic"]):R.pick(["x2y3","expy2","xey","sin"]);
        let eq,F,l1,sub,col,a,b,num,den;
        if(kind==="circle"){ a=R.nz(-4,4); b=R.nz(-4,4); const K=a*a+b*b;
          eq=`x^2 + y^2 = ${K}`; F=(x,y)=>x*x+y*y-K; l1="2x + 2yy' = 0"; sub=`2(${a}) + 2(${b})y' = 0`; num=-2*a; den=2*b; }
        else if(kind==="ellipse"){ const p=R.int(1,4), q=R.int(2,5); a=R.nz(-3,3); b=R.nz(-3,3); const K=p*a*a+q*b*b;
          eq=`${co(p)}x^2 + ${q}y^2 = ${K}`; F=(x,y)=>p*x*x+q*y*y-K; l1=`${2*p}x + ${2*q}yy' = 0`; sub=`${2*p}(${a}) + ${2*q}(${b})y' = 0`; num=-2*p*a; den=2*q*b; }
        else if(kind==="quad"){ let p,q,r; let tries=0; do{ p=R.nz(-3,3); q=R.int(1,3); r=R.int(-4,4); a=R.int(-3,3); b=R.nz(-3,3); tries++; }while(p*a+2*q*b===0 && tries<50); if(p*a+2*q*b===0){ p=1;q=1;r=0;a=1;b=1; }
          const K=a*a+p*a*b+q*b*b+r*a;
          eq=`${S([[1,"x^2"],[p,"xy"],[q,"y^2"],[r,"x"]])} = ${K}`; F=(x,y)=>x*x+p*x*y+q*y*y+r*x-K;
          l1=`${S([[2,"x"],[p,"(y + xy')"],[2*q,"yy'"],[r,""]])} = 0`; sub=`${S([[2,`(${a})`],[p,`(${b} + (${a})y')`],[2*q,`(${b})y'`],[r,""]])} = 0`;
          num=-(2*a+p*b+r); den=p*a+2*q*b; }
        else if(kind==="cubic"){ let p,k,tries=0, ok=false; while(!ok && tries<200){ tries++; p=R.int(1,4); a=R.pick([1,2,-1,-2,3]); b=R.pick([1,2,3,-1,-2]); const nm=p*a*a*a+b*b*b; if(nm%(a*b)!==0) continue; k=nm/(a*b); if(k===0||3*b*b-k*a===0) continue; ok=true; }
          if(!ok){ p=2;a=1;b=2;k=5; }
          eq=`${co(p)}x^3 + y^3 = ${co(k)}xy`; F=(x,y)=>p*x*x*x+y*y*y-k*x*y;
          l1=`${3*p}x^2 + 3y^2y' = ${S([[k,"y"],[k,"xy'"]])}`; sub=`${3*p*a*a} + ${3*b*b}y' = ${S([[k*b,""],[k*a,"y'"]])}`;
          num=k*b-3*p*a*a; den=3*b*b-k*a; }
        else if(kind==="x2y3"){ let p,tries=0; do{ p=R.nz(-4,4); a=R.nz(-2,2); b=R.nz(-2,2); tries++; }while(3*a*a*b*b+p*a===0 && tries<50); if(3*a*a*b*b+p*a===0){ p=1;a=1;b=1; }
          const K=a*a*b*b*b+p*a*b; eq=`x^2y^3${P([[p,"xy"]])} = ${K}`; F=(x,y)=>x*x*y*y*y+p*x*y-K;
          l1=`2xy^3 + 3x^2y^2y'${P([[p,"y"],[p,"xy'"]])} = 0`; sub=`${S([[2*a*b*b*b,""],[3*a*a*b*b,"y'"],[p*b,""],[p*a,"y'"]])} = 0`;
          num=-(2*a*b*b*b+p*b); den=3*a*a*b*b+p*a; }
        else if(kind==="expy2"){ const q=R.nz(-3,3); a=0; b=R.nz(-4,4); const E=q===1?"e^{x}":`e^{${q}x}`;
          eq=`y^2${E} = ${b*b}`; F=(x,y)=>y*y*Math.exp(q*x)-b*b; l1=`${S([[2,`yy'${E}`],[q,`y^2${E}`]])} = 0`; sub=`${S([[2*b,"y'"],[q*b*b,""]])} = 0 \\quad (e^{0} = 1)`;
          num=-q*b*b; den=2*b; }
        else if(kind==="xey"){ let q,tries=0; do{ q=R.nz(-3,3); a=R.int(-3,4); tries++; }while(a+q===0 && tries<50); if(a+q===0){ q=1; a=1; } b=0;
          eq=`xe^{y}${P([[q,"y"]])} = ${a}`; F=(x,y)=>x*Math.exp(y)+q*y-a; l1=`e^{y} + xe^{y}y'${P([[q,"y'"]])} = 0`; sub=`1 + (${a})y'${P([[q,"y'"]])} = 0 \\quad (e^{0} = 1)`;
          num=-1; den=a+q; }
        else { const p=R.nz(-3,3); a=0; b=0; const inside=S([[p,"x"],[1,"y"]]);
          eq=`\\sin(${inside}) = y^2\\cos(x)`; F=(x,y)=>Math.sin(p*x+y)-y*y*Math.cos(x); l1=`\\cos(${inside})\\left(${p} + y'\\right) = -y^2\\sin(x) + 2yy'\\cos(x)`; sub=`\\cos(0)\\left(${p} + y'\\right) = 0 + 0, \\text{ so } ${p} + y' = 0`;
          num=-p; den=1; }
        if(Math.abs(F(a,b))>1e-9) throw new Error("point not on curve");
        const g=M.gcd(num,den); let N=num/g, D=den/g; if(D<0){ N=-N; D=-D; }
        col=`${S([[den,"y'"]])} = ${num}`;
        const h=1e-5, Fx=(F(a+h,b)-F(a-h,b))/(2*h), Fy=(F(a,b+h)-F(a,b-h))/(2*h);
        const mT=M.frac(N,D), lT=lineRHS(a,b,N,D);
        return {prompt:`Find the slope of the tangent line and the equation of the tangent line to $${eq}$ at the point $(${a}, ${b})$.`,
          parts:[{label:"Slope $y'$ at the point",answer:{type:"num",answer:M.fracA(N,D)}},{label:"Tangent line: $y =$",answer:{answer:lineA(a,b,N,D),vars:["x"],placeholder:"e.g. 2 + 4/7(x - 1)"}}],
          verify:{value:-Fx/Fy},
          hint:"Differentiate implicitly first. Then substitute both $x$ and $y$ from the point before you solve for $y'$. Finish with $y = f(a) + f'(a)(x-a)$, where $f(a)$ is the $y$-value of the point.",
          steps:[`Differentiate both sides with respect to $x$, treating $y$ as $y(x)$: $${l1}$.`,`Substitute $x = ${a}$ and $y = ${b}$: $${sub}$.`,`Collect: $${col}$, so $y' = ${mT}$.`,`Tangent line $y = f(a) + f'(a)(x - a)$ with $a = ${a}$, $f(a) = ${b}$ and $f'(a) = ${mT}$:`,`$y = ${lT}$`],
          answerTeX:`$y' = ${mT}$ at $(${a}, ${b})$, and the tangent line is $y = ${lT}$`};
      }},
    {id:"L16.g.related", title:"Sphere: rates that are linked", skill:"Differentiate $V = \\frac{4}{3}\\pi r^3$ with respect to $t$", ref:"p. 4",
      gen(R,d){
        const units=(L,T,right)=>{ const o=R.shuffle([`${L}/${T}`,`${L}³/${T}`,`${L}²/${T}`,`${T}/${L}`]); return {type:"mc",options:o,correct:o.indexOf(right)}; };
        const piT=(n,dd)=>{ const g=M.gcd(n,dd); n/=g; dd/=g; const neg=n<0; n=Math.abs(n); const c=n===1?"":String(n); return (neg?"-":"")+(dd===1?`${c}\\pi`:`\\frac{${c}\\pi}{${dd}}`); };
        const overPi=(n,dd)=>{ const g=M.gcd(n,dd); n/=g; dd/=g; const neg=n<0; n=Math.abs(n); return `${neg?"-":""}\\frac{${n}}{${dd===1?"":dd}\\pi}`; };
        if(d===1 || (d===2 && R.int(0,1)===0)){
          const ctx=R.pick(["Air is being pumped into a spherical ball","A spherical balloon is being inflated","Helium is going into a spherical weather balloon"]);
          const diam=d===2; const Rv=R.pick([4,6,8,10,12,16,20,24,36]), r0=R.int(1,6), given=diam?`the diameter is ${2*r0} cm`:`the radius is ${r0} cm`;
          const n=Rv, dd=4*r0*r0;
          return {prompt:`${ctx} so that its volume increases at a rate of ${Rv} cm³/s. How fast is the radius increasing when ${given}?`,
            parts:[{label:"$\\frac{dr}{dt}$ (exact)",answer:{type:"num",answer:`${Rv}/(4*pi*${r0}^2)`,placeholder:"e.g. 1/(10pi)"}},{label:"Units of $\\frac{dr}{dt}$",answer:units("cm","s","cm/s")}],
            verify:{value:Rv/(4*Math.PI*r0*r0)},
            hint:`Start from $V = \\frac{4}{3}\\pi r^3$ and differentiate both sides with respect to $t$. ${diam?"Watch out: you were given the diameter.":"Both $V$ and $r$ depend on $t$."}`,
            steps:[`$V = \\frac{4}{3}\\pi r^3$, where $V$ and $r$ both change with time $t$.`,`Differentiate both sides with respect to $t$ (chain rule on $r^3$): $\\frac{dV}{dt} = 4\\pi r^2\\frac{dr}{dt}$.`].concat(diam?[`The diameter is ${2*r0} cm, so $r = ${r0}$ cm.`]:[],[`Substitute $\\frac{dV}{dt} = ${Rv}$ cm³/s and $r = ${r0}$ cm: $${Rv} = 4\\pi(${r0})^2\\frac{dr}{dt} = ${4*r0*r0}\\pi\\frac{dr}{dt}$.`,`$\\frac{dr}{dt} = ${overPi(n,dd)}$ cm/s $\\approx ${(Rv/(4*Math.PI*r0*r0)).toFixed(4)}$ cm/s. Write the units: cm/s.`]),
            answerTeX:`$\\frac{dr}{dt} = ${overPi(n,dd)}$ cm/s $\\approx ${(Rv/(4*Math.PI*r0*r0)).toFixed(4)}$ cm/s`};
        }
        if(d===2){ const r0=R.int(2,8), v=R.pick([[1,2],[1,4],[1,5],[2,1],[3,1],[1,10]]), vT=M.frac(v[0],v[1]);
          const n=4*r0*r0*v[0], dd=v[1], val=4*Math.PI*r0*r0*v[0]/v[1];
          return {prompt:`The radius of a spherical balloon is increasing at ${v[1]===1?v[0]:`$\\frac{${v[0]}}{${v[1]}}$`} cm/s. How fast is its volume increasing when the radius is ${r0} cm?`,
            parts:[{label:"$\\frac{dV}{dt}$ (exact)",answer:{type:"num",answer:`4*pi*${r0}^2*${v[0]}/${v[1]}`,placeholder:"e.g. 50pi"}},{label:"Units of $\\frac{dV}{dt}$",answer:units("cm","s","cm³/s")}],
            verify:{value:val},
            hint:"Differentiate $V = \\frac{4}{3}\\pi r^3$ with respect to $t$, then substitute. This time you are solving for $\\frac{dV}{dt}$.",
            steps:[`$V = \\frac{4}{3}\\pi r^3$, so $\\frac{dV}{dt} = 4\\pi r^2\\frac{dr}{dt}$.`,`Substitute $r = ${r0}$ cm and $\\frac{dr}{dt} = ${vT}$ cm/s: $\\frac{dV}{dt} = 4\\pi(${r0})^2\\cdot ${vT}$.`,`$\\frac{dV}{dt} = ${piT(n,dd)}$ cm³/s $\\approx ${val.toFixed(2)}$ cm³/s.`],
            answerTeX:`$\\frac{dV}{dt} = ${piT(n,dd)}$ cm³/s`};
        }
        const r0=R.int(1,6), Rv=R.pick([2,3,4,5,6,8,9,10,12]), T=R.pick(["min","s"]), melt=R.int(0,2)>0;
        const V0=piT(4*r0*r0*r0,3), n=-Rv, dd=4*r0*r0, val=-Rv/(4*Math.PI*r0*r0);
        const ctx=melt?`A spherical snowball is melting so that its volume decreases at ${Rv} cm³/${T}`:`Air leaks out of a spherical ball so that its volume decreases at ${Rv} cm³/${T}`;
        return {prompt:`${ctx}. Find $\\frac{dr}{dt}$ at the moment the volume is $${V0}$ cm³.`,
          parts:[{label:"$\\frac{dr}{dt}$ (exact)",answer:{type:"num",answer:`-${Rv}/(4*pi*${r0}^2)`,placeholder:"e.g. -1/(4pi)"}},{label:"Units of $\\frac{dr}{dt}$",answer:units("cm",T,`cm/${T}`)}],
          verify:{value:val},
          hint:"Decreasing means $\\frac{dV}{dt}$ is negative. You need $r$, so first solve $\\frac{4}{3}\\pi r^3 = $ the given volume.",
          steps:[`The volume is decreasing, so $\\frac{dV}{dt} = -${Rv}$ cm³/${T}.`,`Find $r$: $\\frac{4}{3}\\pi r^3 = ${V0}$ gives $r^3 = ${r0*r0*r0}$, so $r = ${r0}$ cm.`,`Differentiate $V = \\frac{4}{3}\\pi r^3$ with respect to $t$: $\\frac{dV}{dt} = 4\\pi r^2\\frac{dr}{dt}$.`,`$-${Rv} = 4\\pi(${r0})^2\\frac{dr}{dt}$, so $\\frac{dr}{dt} = ${overPi(n,dd)}$ cm/${T} $\\approx ${val.toFixed(4)}$ cm/${T}.`,`Negative: the radius is shrinking.`],
          answerTeX:`$\\frac{dr}{dt} = ${overPi(n,dd)}$ cm/${T}`};
      }},
    {id:"L16.g.error", title:"Find the first mistake", skill:"Spot errors in implicit differentiation and factorial work", ref:"pp. 1 to 3",
      gen(R,d){
        const listLines=L=>L.map((l,i)=>`<div>(${i+1})&nbsp; ${l}</div>`).join("");
        const mkMC=(n,first)=>{ const opts=[]; for(let i=1;i<=n;i++) opts.push(`Line (${i})`); opts.push("There is no mistake"); return {type:"mc",options:opts,correct:first===0?n:first-1}; };
        const kind=d===1?R.pick(["A","C","C"]):d===2?R.pick(["A","B"]):R.pick(["A","B","B"]);
        if(kind==="C"){ // three student answers, factorial
          const p=R.int(-2,2), q=p+R.pick([-2,-1,1,2]); const O=factOptions(R,p,q);
          const wrong=O.opts.slice(1); const noneRight=R.int(0,4)===0;
          const picks=noneRight?R.shuffle(wrong).slice(0,3):R.shuffle([O.opts[0]].concat(R.shuffle(wrong).slice(0,2)));
          const names=["A","B","C"], ci=picks.indexOf(O.opts[0]);
          const options=["Student A","Student B","Student C","None of them is correct"];
          return {prompt:`Three students simplify $\\frac{${fct(p)}}{${fct(q)}}$.<br>${picks.map((t,i)=>`Student ${names[i]}: $${t}$`).join("<br>")}<br>Which student is correct?`,
            parts:[{answer:{type:"mc",options,correct:ci<0?3:ci}}],
            hint:"Write both factorials out as products from 1 and cancel the common start.",
            steps:[`$\\frac{${fct(p)}}{${fct(q)}} = \\frac{${expand(p,Math.min(p,q))}}{${expand(q,Math.min(p,q))}}$`,`Cancel the common factors: $= ${O.opts[0]}$.`, ci<0?"None of the three students has this.":`That is Student ${names[ci]}'s answer.`],
            answerTeX:ci<0?"None of them is correct":`Student ${names[ci]}`};
        }
        if(kind==="A"){
          const a=R.nz(-4,4), b=R.nz(-4,4), c=R.int(1,9);
          const eq=`${S([[a,"x^2"],[b,"xy"],[1,"y^3"]])} = ${c}`;
          const rhs=S([[-2*a,"x"],[-b,"y"]]), den=S([[b,"x"],[3,"y^2"]]);
          const L1=`$${S([[2*a,"x"],[b,"(y + xy')"],[3,"y^2y'"]])} = 0$`, L2=`$${S([[2*a,"x"],[b,"y"],[b,"xy'"],[3,"y^2y'"]])} = 0$`, L3=`$${S([[b,"xy'"],[3,"y^2y'"]])} = ${rhs}$`, L4=`$y'(${den}) = ${rhs}$`, L5=`$y' = \\frac{${rhs}}{${den}}$`;
          const errs=d===1?["e1","e2","e3"]:d===2?["e1","e2","e3","e4","e5","e6","e7","none"]:["e4","e5","e6","e7","e3","none"];
          let e=R.pick(errs); if(e==="e7" && Math.abs(b)===1) e="e4";
          let lines, first, why;
          if(e==="e1"){ const r2=S([[-2*a,"x"],[-b,"y"],[-3,"y^2"]]); lines=[`$${S([[2*a,"x"],[b,"(y + xy')"],[3,"y^2"]])} = 0$`,`$${S([[2*a,"x"],[b,"y"],[b,"xy'"],[3,"y^2"]])} = 0$`,`$${S([[b,"xy'"]])} = ${r2}$`,`$y' = \\frac{${r2}}{${S([[b,"x"]])}}$`]; first=1; why="the chain rule was not used on $y^3$: $\\frac{d}{dx}y^3 = 3y^2y'$, not $3y^2$."; }
          else if(e==="e2"){ const dd=S([[b,""],[3,"y^2"]]); lines=[`$${S([[2*a,"x"],[b,"y'"],[3,"y^2y'"]])} = 0$`,`$${S([[b,"y'"],[3,"y^2y'"]])} = ${S([[-2*a,"x"]])}$`,`$y'(${dd}) = ${S([[-2*a,"x"]])}$`,`$y' = \\frac{${S([[-2*a,"x"]])}}{${dd}}$`]; first=1; why=`$${co(b)}xy$ is a product, so it needs the product rule: $\\frac{d}{dx}(${co(b)}xy) = ${co(b)}(y + xy')$, not $${co(b)}y'$.`; }
          else if(e==="e3"){ const r3=S([[c,""],[-2*a,"x"],[-b,"y"]]); lines=[`$${S([[2*a,"x"],[b,"(y + xy')"],[3,"y^2y'"]])} = ${c}$`,`$${S([[2*a,"x"],[b,"y"],[b,"xy'"],[3,"y^2y'"]])} = ${c}$`,`$${S([[b,"xy'"],[3,"y^2y'"]])} = ${r3}$`,`$y'(${den}) = ${r3}$`,`$y' = \\frac{${r3}}{${den}}$`]; first=1; why=`the right side is the constant ${c}, and the derivative of a constant is 0, not ${c}.`; }
          else if(e==="e4"){ const r4=S([[2*a,"x"],[b,"y"]]); lines=[L1,L2,`$${S([[b,"xy'"],[3,"y^2y'"]])} = ${r4}$`,`$y'(${den}) = ${r4}$`,`$y' = \\frac{${r4}}{${den}}$`]; first=3; why="moving $"+S([[2*a,"x"],[b,"y"]])+"$ to the other side changes the sign of every term. The right side should be $"+rhs+"$."; }
          else if(e==="e5"){ const d5=S([[b,""],[3,"y^2"]]); lines=[L1,L2,L3,`$y'(${d5}) = ${rhs}$`,`$y' = \\frac{${rhs}}{${d5}}$`]; first=4; why=`factoring $y'$ out of $${S([[b,"xy'"]])}$ leaves $${S([[b,"x"]])}$, so the bracket should be $(${den})$.`; }
          else if(e==="e6"){ lines=[L1,L2,L3,L4,`$y' = \\frac{${den}}{${rhs}}$`]; first=5; why="to solve for $y'$, divide both sides by the bracket. The fraction is upside down."; }
          else if(e==="e7"){ const d7=S([[1,"x"],[3,"y^2"]]); lines=[L1,`$${S([[2*a,"x"],[b,"y"],[1,"xy'"],[3,"y^2y'"]])} = 0$`,`$${S([[1,"xy'"],[3,"y^2y'"]])} = ${rhs}$`,`$y'(${d7}) = ${rhs}$`,`$y' = \\frac{${rhs}}{${d7}}$`]; first=2; why=`expanding $${S([[b,"(y + xy')"]])}$ gives $${S([[b,"y"],[b,"xy'"]])}$. The ${b} was dropped from the $xy'$ term.`; }
          else { lines=[L1,L2,L3,L4,L5]; first=0; why="every line is right."; }
          return {prompt:`A student finds $y'$ for $${eq}$:${listLines(lines)}Select the first line that has a mistake.`,
            parts:[{answer:mkMC(lines.length,first)}],
            hint:"Check line (1) carefully first: does every term with $y$ have a $y'$? Is $xy$ done with the product rule? Is the derivative of the constant 0?",
            steps:first===0?[`Line (1) is right: product rule on $${co(b)}xy$ and chain rule on $y^3$.`,"Lines (2) to (5) are correct algebra.",`So there is no mistake: $y' = \\frac{${rhs}}{${den}}$.`]:[`Line (${first}) is the first mistake: ${why}`,`The correct work is ${[L1,L2,L3,L4,L5].join(", ")}.`],
            answerTeX:first===0?"There is no mistake":`Line (${first})`};
        }
        // B: tangent line to x^2 + xy + y^2 = K at (a,b)
        let a,b,tries=0; do{ a=R.nz(-3,3); b=R.nz(-3,3); tries++; }while((a+2*b===0||2*a+b===0||a===b||a===-b) && tries<60); if(a+2*b===0||2*a+b===0||a===b||a===-b){ a=1; b=2; }
        const K=a*a+a*b+b*b, num=-(2*a+b), den=a+2*b, mT=M.frac(num,den);
        const L1="$2x + y + xy' + 2yy' = 0$", L2=`$2(${a}) + (${b}) + (${a})y' + 2(${b})y' = 0$`, L3=`$${S([[den,"y'"]])} = ${num}$`, L4=`$y' = ${mT}$`, L5=`$y = ${lineRHS(a,b,num,den)}$`;
        const errs=d===2?["f1","f2","f3","f4","f5"]:["f3","f4","f5","f6","f7","none"];
        let e=R.pick(errs), lines, first, why;
        if(e==="f1"){ const n2=-(2*a+3*b), d2=a; lines=[`$2x + y + xy' + 2y = 0$`,`$2(${a}) + (${b}) + (${a})y' + 2(${b}) = 0$`,`$${S([[d2,"y'"]])} = ${n2}$`,`$y' = ${M.frac(n2,d2)}$`,`$y = ${lineRHS(a,b,n2,d2)}$`]; first=1; why="the chain rule on $y^2$ gives $2yy'$, not $2y$."; }
        else if(e==="f2"){ const n2=-2*a; lines=[`$2x + xy' + 2yy' = 0$`,`$2(${a}) + (${a})y' + 2(${b})y' = 0$`,`$${S([[den,"y'"]])} = ${n2}$`,`$y' = ${M.frac(n2,den)}$`,`$y = ${lineRHS(a,b,n2,den)}$`]; first=1; why="the product rule on $xy$ gives $y + xy'$. The $y$ is missing."; }
        else if(e==="f3"){ const n2=-(2*b+a), d2=b+2*a; lines=[L1,`$2(${b}) + (${a}) + (${b})y' + 2(${a})y' = 0$`,`$${S([[d2,"y'"]])} = ${n2}$`,`$y' = ${M.frac(n2,d2)}$`,`$y = ${lineRHS(a,b,n2,d2)}$`]; first=2; why=`the point is $(${a}, ${b})$, so $x = ${a}$ and $y = ${b}$. The values were swapped.`; }
        else if(e==="f4"){ lines=[L1,L2,L3,`$y' = ${M.frac(-den,2*a+b)}$`,`$y = ${lineRHS(a,b,-den,2*a+b)}$`]; first=4; why=`from $${S([[den,"y'"]])} = ${num}$, divide by ${den}: $y' = ${mT}$. The fraction was flipped.`; }
        else if(e==="f5"){ lines=[L1,L2,L3,L4,`$${lineRHS(a,b,num,den)}$`]; first=5; why="a tangent line is an equation. It must start with $y =$. Without it, line (5) is only an expression."; }
        else if(e==="f6"){ lines=[L1,L2,L3,L4,`$y = ${lineRHS(b,a,num,den)}$`]; first=5; why=`in $y = f(a) + f'(a)(x - a)$, $a = ${a}$ is the $x$-value and $f(a) = ${b}$ is the $y$-value. They were swapped.`; }
        else if(e==="f7"){ lines=[L1,L2,L3,L4,`$y = ${lineRHS(-a,b,num,den)}$`]; first=5; why=`the bracket is $(x - a)$ with $a = ${a}$, which is $${a>0?`x - ${a}`:`x + ${-a}`}$.`; }
        else { lines=[L1,L2,L3,L4,L5]; first=0; why=""; }
        return {prompt:`A student finds the tangent line to $x^2 + xy + y^2 = ${K}$ at the point $(${a}, ${b})$:${listLines(lines)}Select the first line that has a mistake.`,
          parts:[{answer:mkMC(lines.length,first)}],
          hint:"Check each line against the one before it. Also check the notation: a tangent line needs $y =$ in front.",
          steps:first===0?["Line (1): product rule on $xy$, chain rule on $y^2$. Correct.",`Line (2) substitutes $x = ${a}$, $y = ${b}$. Lines (3) and (4) solve for $y' = ${mT}$.`,`Line (5) is $y = f(a) + f'(a)(x-a)$ with the right numbers. There is no mistake.`]:[`Line (${first}) is the first mistake: ${why}`,`The correct lines are ${[L1,L2,L3,L4,L5].join(", ")}.`],
          answerTeX:first===0?"There is no mistake":`Line (${first})`};
      }},
    {id:"L16.g.verify", title:"Is the implicit function a solution of the DE?", skill:"Verify a DE by implicit differentiation", ref:"p. 3",
      gen(R,d){
        const kind=d===1?"circ":d===2?R.pick(["sin","ln"]):R.pick(["exp","cube","sin"]);
        let rel,good,bad,diff,solve;
        if(kind==="circ"){ const a=R.int(1,5), b=R.int(1,5), g=M.gcd(a,b), A=a/g, B=b/g;
          rel=`${co(a)}x^2 + ${co(b)}y^2 = C`; diff=`${2*a}x + ${2*b}yy' = 0`; solve=`${2*b}yy' = -${2*a}x \\;\\Rightarrow\\; y' = -\\frac{${co(A)}x}{${co(B)}y}`;
          good=`y' = -\\frac{${co(A)}x}{${co(B)}y}`; bad=R.pick([`y' = \\frac{${co(A)}x}{${co(B)}y}`].concat(A!==B?[`y' = -\\frac{${co(B)}x}{${co(A)}y}`]:[`y' = -\\frac{y}{x}`])); }
        else if(kind==="sin"){ const k=R.int(1,4);
          rel=`y^2 + \\sin(y) = ${co(k)}x^3 + C`; diff=`2yy' + \\cos(y)y' = ${3*k}x^2`; solve=`y'(2y + \\cos(y)) = ${3*k}x^2 \\;\\Rightarrow\\; y' = \\frac{${3*k}x^2}{2y + \\cos(y)}`;
          good=`y' = \\frac{${3*k}x^2}{2y + \\cos(y)}`; bad=R.pick([`y' = \\frac{${3*k}x^2}{2y - \\cos(y)}`,`y' = \\frac{${co(k)}x^2}{2y + \\cos(y)}`,`y' = \\frac{${3*k}x^2}{2y + \\sin(y)}`]); }
        else if(kind==="ln"){ const c=R.int(1,4), n=R.int(2,4), cn=c*n;
          rel=`\\ln(y) = ${co(c)}x^{${n}} + C`; diff=`\\frac{1}{y}y' = ${cn}${pw("x",n-1)}`; solve=`y' = ${cn}${pw("x",n-1)}y`;
          good=`y' = ${cn}${pw("x",n-1)}y`; bad=R.pick([`y' = ${cn}${pw("x",n-1)}`,`y' = \\frac{${cn}${pw("x",n-1)}}{y}`].concat(c!==cn?[`y' = ${co(c)}${pw("x",n-1)}y`]:[])); }
        else if(kind==="exp"){ const a=R.int(1,5);
          rel=`e^{y} = ${co(a)}x^2 + C`; diff=`e^{y}y' = ${2*a}x`; solve=`y' = \\frac{${2*a}x}{e^{y}} = ${2*a}xe^{-y}`;
          good=`y' = ${2*a}xe^{-y}`; bad=R.pick([`y' = ${2*a}xe^{y}`,`y' = ${2*a}x`,`y' = ${co(a)}xe^{-y}`]); }
        else { const a=R.int(1,4);
          rel=`y^3 + y = ${co(a)}x^2 + C`; diff=`3y^2y' + y' = ${2*a}x`; solve=`y'(3y^2 + 1) = ${2*a}x \\;\\Rightarrow\\; y' = \\frac{${2*a}x}{3y^2 + 1}`;
          good=`y' = \\frac{${2*a}x}{3y^2 + 1}`; bad=R.pick([`y' = \\frac{${2*a}x}{3y^2}`,`y' = \\frac{${2*a}x}{y^3 + 1}`,`y' = \\frac{${2*a}x}{3y + 1}`]); }
        const yes=R.int(0,1)===0, de=yes?good:bad;
        return {prompt:`Is the implicitly defined function $${rel}$ (with $C$ a constant) a solution of the differential equation $${de}$?`,
          parts:[{answer:{type:"mc",options:["Yes, it is a solution","No, it is not a solution"],correct:yes?0:1}}],
          hint:"Differentiate the implicit function with respect to $x$ (the constant $C$ gives 0), solve for $y'$, and compare with the DE.",
          steps:[`Differentiate both sides with respect to $x$, treating $y$ as $y(x)$: $${diff}$.`,`Solve for $y'$: $${solve}$.`, yes?`This is the same as the DE, so $${rel}$ is a solution of $${de}$.`:`This is not the same as $${de}$, so $${rel}$ is not a solution of this DE.`],
          answerTeX:yes?"Yes, it is a solution":"No, it is not a solution"};
      }}
  ],
  exam:[
    {id:"L16.q1", ref:"p. 1", q:"Simplifying $\\frac{(n+2)!}{n!}$ gives", opts:[
      ["$(n+1)(n+2)$",1,"$(n+2)! = 1\\cdot 2\\cdots n\\cdot(n+1)(n+2)$. The $n!$ cancels and $(n+1)(n+2)$ is left."],
      ["$n+2$",0,"That forgets the factor $n+1$, which is also in $(n+2)!$ but not in $n!$."],
      ["$\\frac{n+2}{n}$",0,"You can't cancel the ! signs. Write the factorials out as products."],
      ["$n(n+1)(n+2)$",0,"The factor $n$ is part of $n!$, so it cancels."],
      ["$2$",0,"$(n+2)!$ is not $2\\cdot n!$. The difference is two extra factors, not a factor of 2."]]},
    {id:"L16.q2", ref:"p. 1", multi:true, q:"Select all that are equal to 6.", opts:[
      ["$3!$",1,"$1\\cdot 2\\cdot 3 = 6$."],
      ["$\\frac{4!}{2!\\cdot 2!}$",1,"$\\frac{24}{2\\cdot 2} = 6$."],
      ["$\\frac{6!}{5!}$",1,"$6! = 5!\\cdot 6$, so the ratio is 6."],
      ["$2\\cdot 3!$",0,"$2\\cdot 6 = 12$."],
      ["$\\frac{4!}{2!}$",0,"$\\frac{24}{2} = 12$, or $3\\cdot 4 = 12$."],
      ["$\\frac{3!}{0!}$",1,"$0! = 1$, so this is $3! = 6$."]]},
    {id:"L16.q3", ref:"p. 1", q:"True or false: $0! = 0$.", opts:[
      ["False",1,"$0!$ is defined to be 1 (p. 1)."],
      ["True",0,"$0!$ is a special definition: $0! = 1$."]]},
    {id:"L16.q4", ref:"p. 1", q:"$\\frac{8!}{11!} = $", opts:[
      ["$\\frac{1}{990}$",1,"$11! = 8!\\cdot 9\\cdot 10\\cdot 11$, so the ratio is $\\frac{1}{9\\cdot 10\\cdot 11} = \\frac{1}{990}$."],
      ["$\\frac{8}{11}$",0,"Factorials don't cancel like that. Write them out."],
      ["$\\frac{1}{3!}$",0,"$11 - 8 = 3$, but the leftover factors are 9, 10 and 11, not 1, 2 and 3."],
      ["$990$",0,"Upside down: $11!$ is on the bottom, and it is the bigger one."],
      ["$\\frac{1}{720}$",0,"That is $\\frac{7!}{10!}$, the exercise on p. 1."]]},
    {id:"L16.q5", ref:"p. 3", q:"If $y$ is a function of $x$, then $\\frac{d}{dx}\\left(y^4\\right) = $", opts:[
      ["$4y^3y'$",1,"Chain rule: $y$ is inside the function $u^4$, so you multiply by $y'$."],
      ["$4y^3$",0,"Missing $y'$. That would be the derivative with respect to $y$, not $x$."],
      ["$4x^3$",0,"The variable is $y$, not $x$."],
      ["$4(y')^3$",0,"The power rule acts on $y$, then the chain rule multiplies by $y'$ once."]]},
    {id:"L16.q6", ref:"pp. 2 to 3", multi:true, q:"$y$ is a function of $x$. Select all the correct derivatives with respect to $x$.", opts:[
      ["$\\frac{d}{dx}(xy) = y + xy'$",1,"Product rule: $1\\cdot y + x\\cdot y'$."],
      ["$\\frac{d}{dx}\\cos(y) = -\\sin(y)\\,y'$",1,"Chain rule with $y$ inside $\\cos$."],
      ["$\\frac{d}{dx}e^{y} = e^{y}$",0,"Missing the chain rule factor: it is $e^{y}y'$."],
      ["$\\frac{d}{dx}(x^2y^2) = 2xy^2 + 2x^2yy'$",1,"Product rule, with the chain rule on $y^2$."],
      ["$\\frac{d}{dx}(5y) = 5$",0,"It is $5y'$. $y$ is not $x$."]]},
    {id:"L16.q7", ref:"p. 2", q:"True or false: the circle $x^2 + y^2 = 1$ can be written as one function $y = f(x)$.", opts:[
      ["False",1,"For $x$ between $-1$ and 1 there are two $y$-values, $\\pm\\sqrt{1-x^2}$. A function has exactly one output for each input, so it fails the vertical line test."],
      ["True",0,"$y = \\sqrt{1-x^2}$ is only the top half. The full circle has two outputs for most inputs."]]},
    {id:"L16.q8", ref:"p. 3", q:"The slope of the tangent line to $x^2 + y^2 = 25$ at the point $(-3, 4)$ is", opts:[
      ["$\\frac{3}{4}$",1,"$2x + 2yy' = 0$ gives $y' = -\\frac{x}{y} = -\\frac{-3}{4} = \\frac{3}{4}$."],
      ["$-\\frac{3}{4}$",0,"Check the sign: $x = -3$, so $-\\frac{x}{y} = +\\frac{3}{4}$."],
      ["$\\frac{4}{3}$",0,"Upside down: $y' = -\\frac{x}{y}$, not $-\\frac{y}{x}$."],
      ["$-\\frac{4}{3}$",0,"That is the slope of the radius from the origin to the point. The tangent is perpendicular to it."]]},
    {id:"L16.q9", ref:"p. 3", q:"A student finds $y'$ for $x^3 + xy = y^2$:<div>(1)&nbsp; $3x^2 + y + xy' = 2yy'$</div><div>(2)&nbsp; $3x^2 + y = 2yy' + xy'$</div><div>(3)&nbsp; $3x^2 + y = y'(2y + x)$</div><div>(4)&nbsp; $y' = \\frac{3x^2 + y}{2y + x}$</div>Select the first line that has a mistake.", opts:[
      ["Line (1)",0,"Line (1) is right: product rule on $xy$, chain rule on $y^2$."],
      ["Line (2)",1,"Moving $xy'$ to the right side changes its sign: $3x^2 + y = 2yy' - xy'$."],
      ["Line (3)",0,"Line (3) factors line (2) correctly. The error came before it."],
      ["Line (4)",0,"Line (4) follows from line (3). The error came earlier."],
      ["There is no mistake",0,"The correct answer is $y' = \\frac{3x^2 + y}{2y - x}$."]]},
    {id:"L16.q10", ref:"p. 4", q:"Air is pumped into a spherical balloon so that its volume increases at 20 cm³/s. Which is the complete answer for $\\frac{dr}{dt}$ when $r = 2$ cm?", opts:[
      ["$\\frac{5}{4\\pi}$ cm/s",1,"$20 = 4\\pi(2)^2\\frac{dr}{dt} = 16\\pi\\frac{dr}{dt}$, so $\\frac{dr}{dt} = \\frac{20}{16\\pi} = \\frac{5}{4\\pi}$, in cm/s."],
      ["$\\frac{5}{4\\pi}$ cm³/s",0,"The number is right but the units are not. $r$ is in cm, so $\\frac{dr}{dt}$ is in cm/s."],
      ["$\\frac{5}{4\\pi}$",0,"The number is right, but a rate needs its units."],
      ["$320\\pi$ cm/s",0,"That multiplies by $4\\pi r^2$ instead of dividing."]]},
    {id:"L16.q11", ref:"p. 3", q:"Solving $y = y'(1 - x - 2y)$ for $y'$, the notes write \"assuming $1 - x - 2y \\neq 0$\". Why?", opts:[
      ["You divide by $1 - x - 2y$, and you can't divide by 0",1,"Whenever you divide by something, check it is not 0 (p. 3)."],
      ["Because $y'$ is always positive",0,"The sign of $y'$ has nothing to do with it."],
      ["Because implicit functions never cross the line $1 - x - 2y = 0$",0,"The assumption is about the division step, not where the curve goes."],
      ["It is only a style choice and can be left out",0,"The notes say you need to ensure what you divide by is not 0."]]},
    {id:"L16.q12", ref:"p. 3", q:"Three students find the tangent line to $x^2 + y^2 = 4$ at $(1, -\\sqrt{3})$.<br>A: $y = -\\sqrt{3} + \\frac{1}{\\sqrt{3}}(x - 1)$<br>B: $-\\sqrt{3} + \\frac{1}{\\sqrt{3}}(x - 1)$<br>C: $y = 1 + \\frac{1}{\\sqrt{3}}(x + \\sqrt{3})$<br>Which answer is fully correct?", opts:[
      ["A",1,"$y' = -\\frac{x}{y} = -\\frac{1}{-\\sqrt{3}} = \\frac{1}{\\sqrt{3}}$, and $y = f(a) + f'(a)(x-a)$ with $a = 1$, $f(a) = -\\sqrt{3}$."],
      ["B",0,"Missing $y =$. A tangent line is an equation, and quizzes take marks off for this."],
      ["C",0,"The $x$- and $y$-values of the point were swapped."],
      ["None of them",0,"A is correct."]]}
  ],
  steps:[
    {type:"read", title:"What $n!$ means", body:`<p>$n!$ (read 'n factorial') multiplies every whole number from 1 up to $n$ (p. 1):</p><div class="box def"><b class="t">Definition (p. 1)</b>For any integer $n \\ge 1$, $$n! = 1\\cdot 2\\cdot 3\\cdots n.$$ For $n = 0$ there is a special definition: $0! = 1$.</div><p>The first few values:</p>$$0! = 1,\\quad 1! = 1,\\quad 2! = 1\\cdot 2 = 2,\\quad 3! = 1\\cdot 2\\cdot 3 = 6,\\quad 4! = 1\\cdot 2\\cdot 3\\cdot 4 = 24$$<p>The idea you use most: a bigger factorial contains every smaller one. $5! = 1\\cdot 2\\cdot 3\\cdot 4\\cdot 5 = 4!\\cdot 5$, and $(n+1)! = n!\\cdot(n+1)$. That is why fractions of factorials cancel so well.</p><div class="box warn"><b class="t">Watch for this</b>$0! = 1$, not 0. And $(2n)!$ is not $2\\cdot n!$: $(2n)!$ multiplies all the way up to $2n$.</div>`, ref:"p. 1"},
    {type:"explore", title:"Cancel the common factors", fig:"cancel", body:`<p>To simplify a fraction of factorials, write both out as products from 1. The smaller factorial is the start of the bigger one, so it cancels completely. Only the extra factors of the bigger one are left.</p><p><b>Try it.</b> Pick $\\frac{(n-1)!}{(n+3)!}$ and set $n = 4$. The top is $3! = 1\\cdot2\\cdot3$, the bottom is $7!$. Tiles 1 to 3 cancel and $4\\cdot5\\cdot6\\cdot7 = 840$ is left on the bottom, so the answer is $\\frac{1}{840}$. Then try $7!/10!$ (the exercise on p. 1).</p>`, ref:"pp. 1 to 2"},
    {type:"example", title:"Simplify $\\frac{(n-1)!}{(n+3)!}$", ex:{q:"Simplify $\\frac{(n-1)!}{(n+3)!}$.", ref:"p. 1",
      steps:[{t:"$(n-1)! = 1\\cdot 2\\cdot 3\\cdots(n-2)\\cdot(n-1)$",why:"Definition of factorial: every integer from 1 to $n-1$."},
        {t:"$(n+3)! = 1\\cdot 2\\cdot 3\\cdots(n-2)\\cdot(n-1)\\cdot n\\cdot(n+1)\\cdot(n+2)\\cdot(n+3)$",why:"Every integer from 1 to $n+3$. It starts with all of $(n-1)!$, then four more factors."},
        {t:"$\\frac{(n-1)!}{(n+3)!} = \\frac{1\\cdot 2\\cdot 3\\cdots(n-2)\\cdot(n-1)}{1\\cdot 2\\cdot 3\\cdots(n-2)\\cdot(n-1)\\cdot n\\cdot(n+1)\\cdot(n+2)\\cdot(n+3)}$",why:"Put the two products in the fraction."},
        {t:"$= \\frac{1}{n(n+1)(n+2)(n+3)}$",why:"Everything on top also appears on the bottom, so it cancels to 1. The four extra factors stay on the bottom."},
        {t:"Check with $n = 4$: $\\frac{3!}{7!} = \\frac{1}{4\\cdot 5\\cdot 6\\cdot 7} = \\frac{1}{840}$.",why:"The exercise on p. 2. Plugging in a number is a quick way to test your algebra."}],
      ans:"$\\frac{(n-1)!}{(n+3)!} = \\frac{1}{n(n+1)(n+2)(n+3)}$"}},
    {type:"try", title:"Your turn: factorials", gen:"L16.g.fact-sym"},
    {type:"read", title:"Curves that are not $y = f(x)$", body:`<p>Is the circle $x^2 + y^2 = 1$ a function? A function has exactly one output for each input (p. 2). For $x = 0$ the circle has two points, $y = 1$ and $y = -1$. So you can't write the circle as $y = f(x)$. That is what the vertical line test says.</p><div class="box def"><b class="t">Implicitly defined function (p. 2)</b>We treat $y$ as a function of $x$ anyway: there is some way to write it as a function, even if we don't actually know how to do it.</div><p>These come up a lot in science. One example is the Lambert $W$ function, defined by $$we^w = z$$ where $z$ is the independent variable. You can't solve this for $w$ with the functions you know, but it is used in quantum mechanics, biochemistry and engineering (p. 2).</p><p>Calculus lets us study how such functions behave. So the next question is: how do you find $y'$ when you can't solve for $y$?</p>`, ref:"p. 2"},
    {type:"read", title:"How implicit differentiation works", body:`<p>Assume $y$ is a function of $x$, so every $y$ is really $y(x)$. Then take the derivative of both sides like normal (p. 2). Two rules do most of the work:</p><div class="box"><b class="t">Product rule on $xy$ (p. 3)</b>$xy$ is the function $x$ times the function $y(x)$: $$\\frac{d}{dx}\\left[x\\cdot y(x)\\right] = 1\\cdot y(x) + x\\cdot y'(x)$$</div><div class="box"><b class="t">Chain rule on $y^2$ (p. 3)</b>$y(x)$ is inside the function $u^2$: $$\\frac{d}{dx}(y(x))^2 = 2y(x)\\,y'(x)$$</div><p>So any time you differentiate something with $y$ in it, a $y'$ appears. Terms with only $x$ are done as usual, with no $y'$.</p><p>After differentiating, collect the $y'$ terms on one side, factor out $y'$, and divide. Whenever you divide by something, make sure it is not 0 (p. 3). Your answer has both $x$ and $y$ in it. That makes it a differential equation.</p>`, ref:"pp. 2 to 3"},
    {type:"example", title:"Find $y'$ for $xy + y^2 = y$", ex:{q:"Find $y'$ for the implicitly defined function $xy + y^2 = y$.", ref:"pp. 2 to 3",
      steps:[{t:"Think of the equation as $x\\cdot y(x) + (y(x))^2 = y(x)$.",why:"$y$ is a function of $x$. Writing $y(x)$ shows where the product and chain rules are needed."},
        {t:"$\\left[1\\cdot y(x) + x\\cdot y'(x)\\right] + 2(y(x))\\cdot y'(x) = y'(x)$",why:"Product rule on $x\\cdot y(x)$, chain rule on $(y(x))^2$, and $\\frac{d}{dx}y(x) = y'(x)$."},
        {t:"$y + xy' + 2yy' = y'$",why:"Same line, written the short way."},
        {t:"$y = y' - xy' - 2yy'$",why:"Move every $y'$ term to the right and keep $y$ on the left."},
        {t:"$y = y'(1 - x - 2y)$",why:"Factor out $y'$."},
        {t:"$\\frac{y}{1 - x - 2y} = y'$, assuming $1 - x - 2y \\neq 0$",why:"Divide by the bracket. You can only divide if it is not 0."}],
      ans:"$y' = \\frac{y}{1 - x - 2y}$, a differential equation."}},
    {type:"mcq", title:"Check yourself", q:"$y$ is a function of $x$. Which of these are correct?", multi:true, opts:[
      ["$\\frac{d}{dx}(y^2) = 2yy'$",true,"Chain rule."],
      ["$\\frac{d}{dx}(xy) = xy'$",false,"Product rule: $y + xy'$. The $y$ term is missing."],
      ["$\\frac{d}{dx}\\sin(y) = \\cos(y)\\,y'$",true,"Chain rule with $y$ inside $\\sin$."],
      ["$\\frac{d}{dx}(x^2) = 2x$",true,"No $y$ in it, so no $y'$."],
      ["$\\frac{d}{dx}(y) = 1$",false,"$\\frac{d}{dx}y = y'$. Only $\\frac{d}{dx}x = 1$."]],
      after:"Rule of thumb: a $y'$ appears exactly when you differentiate something that contains $y$."},
    {type:"explore", title:"Slopes on curves that fail the vertical line test", fig:"implicit", body:`<p>Implicit differentiation gives $y'$ as a formula in $x$ and $y$. To get a number you need the whole point, not only $x$: on the circle, $x = 1$ has two points with different slopes.</p><p><b>Try it.</b> On the lecture curve $2x^3 + y^3 = 5xy$, start at the point $(1, 2)$: the readout shows $y' = 4/7 \\approx 0.571$, the slope from the next example. Drag the point around the loop. Find a spot where the denominator $3y^2 - 5x$ is 0 and the tangent turns vertical. Then switch to the circle and check that $y' = -\\frac{x}{y}$ is 0 at the top and bottom.</p>`, ref:"pp. 2 to 3"},
    {type:"example", title:"Tangent line to $2x^3 + y^3 = 5xy$ at $(1, 2)$", ex:{q:"Find the tangent line to $2x^3 + y^3 = 5xy$ at the point $(1, 2)$.", ref:"p. 3",
      steps:[{t:"$6x^2 + 3y^2y' = 5y + 5xy'$",why:"Differentiate both sides with respect to $x$: chain rule on $y^3$, product rule on $5xy$."},
        {t:"$6(1)^2 + 3(2)^2y' = 5(2) + 5(1)y'$",why:"Substitute $x = 1$ and $y = 2$ before solving. It keeps the algebra small."},
        {t:"$6 + 12y' = 10 + 5y'$",why:"Arithmetic."},
        {t:"$7y' = 4$, so $y' = \\frac{4}{7}$",why:"Collect the $y'$ terms and divide by 7."},
        {t:"$y = f(a) + f'(a)(x - a)$",why:"Tangent line formula. Here $a = 1$, $f(a) = 2$ is the $y$-value of the point and $f'(a) = \\frac{4}{7}$ is the slope."},
        {t:"$y = 2 + \\frac{4}{7}(x - 1)$",why:"Substitute. Keep the $y =$: without it the answer is not an equation."}],
      ans:"$y = 2 + \\frac{4}{7}(x - 1)$"}},
    {type:"try", title:"Your turn: find $y'$ (midterm Q20 style)", gen:"L16.g.implicit", diff:3},
    {type:"try", title:"Your turn: tangent line", gen:"L16.g.tangent"},
    {type:"example", title:"A growing ball: how fast is the radius changing?", ex:{q:"Air is being pumped into a spherical ball so that its volume increases at a rate of 10 cm³/s. How fast is the radius of the ball increasing when the radius is 5 cm?", ref:"p. 4",
      steps:[{t:"$V = \\frac{4}{3}\\pi r^3$",why:"Volume of a sphere. Both $V$ and $r$ change with time, so this is an implicitly defined function of $t$."},
        {t:"$\\frac{dV}{dt} = 4\\pi r^2\\frac{dr}{dt}$",why:"Differentiate both sides with respect to $t$. $r$ depends on $t$, so the chain rule gives $3r^2\\cdot\\frac{dr}{dt}$, and $\\frac{4}{3}\\cdot 3 = 4$."},
        {t:"$10 = 4\\pi(5)^2\\frac{dr}{dt}$",why:"Substitute $\\frac{dV}{dt} = 10$ cm³/s and $r = 5$ cm."},
        {t:"$\\frac{1}{10\\pi} = \\frac{dr}{dt}$",why:"$4\\pi\\cdot 25 = 100\\pi$, and $\\frac{10}{100\\pi} = \\frac{1}{10\\pi}$."},
        {t:"$\\frac{dr}{dt} = \\frac{1}{10\\pi}$ cm/s $\\approx 0.0318$ cm/s",why:"The notes stop without units. $r$ is in cm and $t$ in seconds, so the rate is in cm/s. Write it, with a sentence."}],
      ans:"When $r = 5$ cm, the radius is increasing at $\\frac{1}{10\\pi}$ cm/s, about 0.032 cm/s."}},
    {type:"explore", title:"Same air, slower growth", fig:"sphere", body:`<p>The same 10 cm³ of air each second makes the radius grow more slowly as the ball gets bigger. The new air is spread over a surface of area $4\\pi r^2$, which keeps growing.</p><p><b>Try it.</b> Drag the point to $r = 5$ and check that $\\frac{dr}{dt} \\approx 0.0318$ cm/s. Then halve the radius to $r = 2.5$: the rate is 4 times bigger, because $r^2$ is in the denominator. Change $\\frac{dV}{dt}$ and see the whole curve scale up or down.</p>`, ref:"p. 4"},
    {type:"mcq", title:"Find the mistake", q:"A student finds the tangent line to $x^2 + xy + y^2 = 7$ at $(1, 2)$:<div>(1)&nbsp; $2x + y + xy' + 2yy' = 0$</div><div>(2)&nbsp; $2 + 2 + y' + 4y' = 0$</div><div>(3)&nbsp; $y' = -\\frac{4}{5}$</div><div>(4)&nbsp; $2 - \\frac{4}{5}(x - 1)$</div>Select the first line that has a mistake.", opts:[
      ["Line (1)",false,"Product rule on $xy$ and chain rule on $y^2$ are both right."],
      ["Line (2)",false,"$x = 1$, $y = 2$ substituted correctly."],
      ["Line (3)",false,"$4 + 5y' = 0$ gives $y' = -\\frac{4}{5}$."],
      ["Line (4)",true,"Missing $y =$. The tangent line is the equation $y = 2 - \\frac{4}{5}(x - 1)$."],
      ["There is no mistake",false,"Line (4) is an expression, not an equation."]],
      after:"Notation counts on quizzes and the midterm. A tangent line always starts with $y =$."},
    {type:"formulas", title:"Lecture 16 formulas"}
  ]
});
})();
