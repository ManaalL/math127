/* Lecture 17 (Fri Oct 23): Derivatives of inverse functions and logarithmic differentiation. Sections 2.7.1, 2.7.2. Notes: 3 pages. */
(function(){
const M=M127;
/* ---------- small TeX helpers for this lecture ---------- */
const co=c=>c===1?"":c===-1?"-":String(c);            // coefficient in front of a letter
const pw=(v,e)=>e===0?"":e===1?v:`${v}^{${e}}`;        // x^{e}
const sh=(s,v="x")=>s===0?v:(s>0?`${v}+${s}`:`${v}-${-s}`);   // x+2, x-1
const fr=(p,q)=>q==="1"?p:`\\frac{${p}}{${q}}`;       // TeX fraction, q "1" means no fraction
const listLines=L=>L.map((l,i)=>`<div>(${i+1})&nbsp; ${l}</div>`).join("");
const mkMC=(n,first)=>{ const opts=[]; for(let i=1;i<=n;i++) opts.push(`Line (${i})`); opts.push("There is no mistake"); return {type:"mc",options:opts,correct:first===0?n:first-1}; };

/* ---------- f(x)^g(x) templates. D (ascii) is written by hand from dS; the fuzz test checks it against the numeric derivative of (F)^(G) ---------- */
// fields: yT (whole function), F/G (ascii base/exponent), cond (TeX domain), dom, lnR (ln(y) after the power property), d1 (right side right after differentiating), dS (simplified), D (ascii of dS), rule
const POW={
  1:[
    R=>({yT:"x^{x}", F:"x", G:"x", cond:"x > 0", dom:[0.3,2.5], lnR:"x\\ln(x)", d1:"1\\cdot\\ln(x) + x\\cdot\\frac{1}{x}", dS:"\\ln(x) + 1", D:"ln(x)+1", rule:"product rule on $x\\ln(x)$"}),
    R=>{ const k=R.int(2,5); return {yT:`x^{${k}x}`, F:"x", G:`${k}*x`, cond:"x > 0", dom:[0.3,2], lnR:`${k}x\\ln(x)`, d1:`${k}\\ln(x) + ${k}x\\cdot\\frac{1}{x}`, dS:`${k}\\ln(x) + ${k}`, D:`${k}ln(x)+${k}`, rule:`product rule on $${k}x\\ln(x)$`}; },
    R=>{ const k=R.int(1,3), c=co(k); return {yT:`x^{${c}\\sin(x)}`, F:"x", G:`${k}*sin(x)`, cond:"x > 0", dom:[0.3,3], lnR:`${c}\\sin(x)\\ln(x)`, d1:`${c}\\cos(x)\\ln(x) + ${c}\\sin(x)\\cdot\\frac{1}{x}`, dS:`${c}\\cos(x)\\ln(x) + \\frac{${c}\\sin(x)}{x}`, D:`${k}cos(x)ln(x)+${k}sin(x)/x`, rule:`product rule on $${c}\\sin(x)\\ln(x)$`}; },
    R=>{ const k=R.int(1,3), c=co(k); return {yT:`x^{${c}\\cos(x)}`, F:"x", G:`${k}*cos(x)`, cond:"x > 0", dom:[0.3,3], lnR:`${c}\\cos(x)\\ln(x)`, d1:`-${c}\\sin(x)\\ln(x) + ${c}\\cos(x)\\cdot\\frac{1}{x}`, dS:`-${c}\\sin(x)\\ln(x) + \\frac{${c}\\cos(x)}{x}`, D:`-${k}sin(x)ln(x)+${k}cos(x)/x`, rule:`product rule on $${c}\\cos(x)\\ln(x)$`}; },
    R=>{ const n=R.int(2,3); return {yT:`x^{x^{${n}}}`, F:"x", G:`x^${n}`, cond:"x > 0", dom:[0.3,1.8], lnR:`x^{${n}}\\ln(x)`, d1:`${n}${pw("x",n-1)}\\ln(x) + x^{${n}}\\cdot\\frac{1}{x}`, dS:`${n}${pw("x",n-1)}\\ln(x) + ${pw("x",n-1)}`, D:`${n}x^${n-1}*ln(x)+x^${n-1}`, rule:`product rule on $x^{${n}}\\ln(x)$`}; },
    R=>{ const k=R.int(1,2), c=co(k); return {yT:`x^{${c}\\ln(x)}`, F:"x", G:`${k}*ln(x)`, cond:"x > 0", dom:[0.3,3], lnR:`${c}\\ln(x)\\ln(x)`, d1:`${c}\\cdot\\frac{1}{x}\\ln(x) + ${c}\\ln(x)\\cdot\\frac{1}{x}`, dS:`\\frac{${2*k}\\ln(x)}{x}`, D:`${2*k}ln(x)/x`, rule:`product rule on $${c}\\ln(x)\\ln(x)$`}; },
    R=>({yT:"x^{e^{x}}", F:"x", G:"e^x", cond:"x > 0", dom:[0.3,1.8], lnR:"e^{x}\\ln(x)", d1:"e^{x}\\ln(x) + e^{x}\\cdot\\frac{1}{x}", dS:"e^{x}\\ln(x) + \\frac{e^{x}}{x}", D:"e^x*ln(x)+e^x/x", rule:"product rule on $e^{x}\\ln(x)$"}),
    R=>({yT:"x^{\\sqrt{x}}", F:"x", G:"sqrt(x)", cond:"x > 0", dom:[0.3,3], lnR:"\\sqrt{x}\\ln(x)", d1:"\\frac{1}{2\\sqrt{x}}\\ln(x) + \\sqrt{x}\\cdot\\frac{1}{x}", dS:"\\frac{\\ln(x)}{2\\sqrt{x}} + \\frac{1}{\\sqrt{x}}", D:"ln(x)/(2sqrt(x))+1/sqrt(x)", rule:"product rule on $\\sqrt{x}\\ln(x)$, and $\\frac{\\sqrt{x}}{x} = \\frac{1}{\\sqrt{x}}$"})
  ],
  2:[
    R=>({yT:"x^{\\arctan(x)}", F:"x", G:"arctan(x)", cond:"x > 0", dom:[0.3,3], lnR:"\\arctan(x)\\ln(x)", d1:"\\frac{1}{1+x^2}\\ln(x) + \\arctan(x)\\cdot\\frac{1}{x}", dS:"\\frac{\\ln(x)}{1+x^2} + \\frac{\\arctan(x)}{x}", D:"ln(x)/(1+x^2)+arctan(x)/x", rule:"product rule on $\\arctan(x)\\ln(x)$, with $\\frac{d}{dx}\\arctan(x) = \\frac{1}{1+x^2}$"}),
    R=>({yT:"x^{\\arcsin(x)}", F:"x", G:"arcsin(x)", cond:"0 < x < 1", dom:[0.15,0.85], lnR:"\\arcsin(x)\\ln(x)", d1:"\\frac{1}{\\sqrt{1-x^2}}\\ln(x) + \\arcsin(x)\\cdot\\frac{1}{x}", dS:"\\frac{\\ln(x)}{\\sqrt{1-x^2}} + \\frac{\\arcsin(x)}{x}", D:"ln(x)/sqrt(1-x^2)+arcsin(x)/x", rule:"product rule on $\\arcsin(x)\\ln(x)$, with $\\frac{d}{dx}\\arcsin(x) = \\frac{1}{\\sqrt{1-x^2}}$"}),
    R=>({yT:"x^{\\tan(x)}", F:"x", G:"tan(x)", cond:"0 < x < \\frac{\\pi}{2}", dom:[0.2,1.3], lnR:"\\tan(x)\\ln(x)", d1:"\\sec^2(x)\\ln(x) + \\tan(x)\\cdot\\frac{1}{x}", dS:"\\sec^2(x)\\ln(x) + \\frac{\\tan(x)}{x}", D:"sec(x)^2*ln(x)+tan(x)/x", rule:"product rule on $\\tan(x)\\ln(x)$"}),
    R=>{ const c=R.int(1,5); return {yT:`(x+${c})^{x}`, F:`x+${c}`, G:"x", cond:`x > -${c}`, dom:[0.2,2.5], lnR:`x\\ln(x+${c})`, d1:`1\\cdot\\ln(x+${c}) + x\\cdot\\frac{1}{x+${c}}`, dS:`\\ln(x+${c}) + \\frac{x}{x+${c}}`, D:`ln(x+${c})+x/(x+${c})`, rule:`product rule on $x\\ln(x+${c})$`}; },
    R=>({yT:"x^{\\frac{1}{x}}", F:"x", G:"1/x", cond:"x > 0", dom:[0.3,3], lnR:"\\frac{1}{x}\\ln(x)", d1:"-\\frac{1}{x^2}\\ln(x) + \\frac{1}{x}\\cdot\\frac{1}{x}", dS:"\\frac{1 - \\ln(x)}{x^2}", D:"(1-ln(x))/x^2", rule:"product rule on $\\frac{1}{x}\\ln(x)$, with $\\frac{d}{dx}\\frac{1}{x} = -\\frac{1}{x^2}$"}),
    R=>({yT:"(\\ln(x))^{x}", F:"ln(x)", G:"x", cond:"x > 1", dom:[1.3,3], lnR:"x\\ln(\\ln(x))", d1:"1\\cdot\\ln(\\ln(x)) + x\\cdot\\frac{1}{\\ln(x)}\\cdot\\frac{1}{x}", dS:"\\ln(\\ln(x)) + \\frac{1}{\\ln(x)}", D:"ln(ln(x))+1/ln(x)", rule:"product rule on $x\\ln(\\ln(x))$, and the chain rule on $\\ln(\\ln(x))$"}),
    R=>{ const k=R.int(2,4); return {yT:`x^{\\sin(${k}x)}`, F:"x", G:`sin(${k}x)`, cond:"x > 0", dom:[0.3,3], lnR:`\\sin(${k}x)\\ln(x)`, d1:`${k}\\cos(${k}x)\\ln(x) + \\sin(${k}x)\\cdot\\frac{1}{x}`, dS:`${k}\\cos(${k}x)\\ln(x) + \\frac{\\sin(${k}x)}{x}`, D:`${k}cos(${k}x)ln(x)+sin(${k}x)/x`, rule:`product rule on $\\sin(${k}x)\\ln(x)$, and the chain rule on $\\sin(${k}x)$`}; },
    R=>{ const c=R.int(1,5); return {yT:`(x^2+${c})^{x}`, F:`x^2+${c}`, G:"x", cond:"", dom:[0.2,2], lnR:`x\\ln(x^2+${c})`, d1:`1\\cdot\\ln(x^2+${c}) + x\\cdot\\frac{2x}{x^2+${c}}`, dS:`\\ln(x^2+${c}) + \\frac{2x^2}{x^2+${c}}`, D:`ln(x^2+${c})+2x^2/(x^2+${c})`, rule:`product rule on $x\\ln(x^2+${c})$, and the chain rule on $\\ln(x^2+${c})$`}; }
  ],
  3:[
    R=>{ const k=R.int(1,3), kx=k===1?"x":`${k}x`; return {yT:`(\\cos(x))^{${kx}}`, F:"cos(x)", G:`${k}*x`, cond:"0 < x < \\frac{\\pi}{2}", dom:[0.1,1.3], lnR:`${kx}\\ln(\\cos(x))`, d1:`${k}\\ln(\\cos(x)) + ${kx}\\cdot\\frac{1}{\\cos(x)}\\cdot(-\\sin(x))`, dS:`${co(k)}\\ln(\\cos(x)) - ${kx}\\tan(x)`, D:`${k}ln(cos(x))-${k}x*tan(x)`, rule:`product rule on $${kx}\\ln(\\cos(x))$, and the chain rule on $\\ln(\\cos(x))$`}; },
    R=>({yT:"(\\sin(x))^{\\ln(x)}", F:"sin(x)", G:"ln(x)", cond:"0 < x < \\pi", dom:[0.3,2.8], lnR:"\\ln(x)\\ln(\\sin(x))", d1:"\\frac{1}{x}\\ln(\\sin(x)) + \\ln(x)\\cdot\\frac{1}{\\sin(x)}\\cdot\\cos(x)", dS:"\\frac{\\ln(\\sin(x))}{x} + \\ln(x)\\cot(x)", D:"ln(sin(x))/x+ln(x)*cot(x)", rule:"product rule on $\\ln(x)\\ln(\\sin(x))$, and the chain rule on $\\ln(\\sin(x))$"}),
    R=>({yT:"(\\ln(x))^{e^{x}}", F:"ln(x)", G:"e^x", cond:"x > 1", dom:[1.3,2.5], lnR:"e^{x}\\ln(\\ln(x))", d1:"e^{x}\\ln(\\ln(x)) + e^{x}\\cdot\\frac{1}{\\ln(x)}\\cdot\\frac{1}{x}", dS:"e^{x}\\ln(\\ln(x)) + \\frac{e^{x}}{x\\ln(x)}", D:"e^x*ln(ln(x))+e^x/(x*ln(x))", rule:"product rule on $e^{x}\\ln(\\ln(x))$, and the chain rule on $\\ln(\\ln(x))$"}),
    R=>({yT:"(\\sin(x))^{\\cos(x)}", F:"sin(x)", G:"cos(x)", cond:"0 < x < \\frac{\\pi}{2}", dom:[0.2,1.4], lnR:"\\cos(x)\\ln(\\sin(x))", d1:"-\\sin(x)\\ln(\\sin(x)) + \\cos(x)\\cdot\\frac{1}{\\sin(x)}\\cdot\\cos(x)", dS:"-\\sin(x)\\ln(\\sin(x)) + \\frac{\\cos^2(x)}{\\sin(x)}", D:"-sin(x)*ln(sin(x))+cos(x)^2/sin(x)", rule:"product rule on $\\cos(x)\\ln(\\sin(x))$, and the chain rule on $\\ln(\\sin(x))$"}),
    R=>{ const c=R.int(1,5); return {yT:`(x^2+${c})^{\\sin(x)}`, F:`x^2+${c}`, G:"sin(x)", cond:"", dom:[0.2,2.5], lnR:`\\sin(x)\\ln(x^2+${c})`, d1:`\\cos(x)\\ln(x^2+${c}) + \\sin(x)\\cdot\\frac{2x}{x^2+${c}}`, dS:`\\cos(x)\\ln(x^2+${c}) + \\frac{2x\\sin(x)}{x^2+${c}}`, D:`cos(x)*ln(x^2+${c})+2x*sin(x)/(x^2+${c})`, rule:`product rule on $\\sin(x)\\ln(x^2+${c})$, and the chain rule on $\\ln(x^2+${c})$`}; },
    R=>({yT:"(\\arctan(x))^{x}", F:"arctan(x)", G:"x", cond:"x > 0", dom:[0.3,3], lnR:"x\\ln(\\arctan(x))", d1:"1\\cdot\\ln(\\arctan(x)) + x\\cdot\\frac{1}{\\arctan(x)}\\cdot\\frac{1}{1+x^2}", dS:"\\ln(\\arctan(x)) + \\frac{x}{(1+x^2)\\arctan(x)}", D:"ln(arctan(x))+x/((1+x^2)*arctan(x))", rule:"product rule on $x\\ln(\\arctan(x))$, and the chain rule on $\\ln(\\arctan(x))$"}),
    R=>({yT:"\\left(1 + \\frac{1}{x}\\right)^{x}", F:"1+1/x", G:"x", cond:"x > 0", dom:[0.3,3], lnR:"x\\ln\\left(1 + \\frac{1}{x}\\right)", d1:"1\\cdot\\ln\\left(1 + \\frac{1}{x}\\right) + x\\cdot\\frac{1}{1 + \\frac{1}{x}}\\cdot\\left(-\\frac{1}{x^2}\\right)", dS:"\\ln\\left(1 + \\frac{1}{x}\\right) - \\frac{1}{x+1}", D:"ln(1+1/x)-1/(x+1)", rule:"product rule, and the chain rule on $\\ln\\left(1 + \\frac{1}{x}\\right)$. Then $x\\cdot\\frac{1}{1+\\frac{1}{x}}\\cdot\\frac{1}{x^2} = \\frac{1}{x+1}$"}),
    R=>({yT:"(\\cos(x))^{\\sin(x)}", F:"cos(x)", G:"sin(x)", cond:"0 < x < \\frac{\\pi}{2}", dom:[0.1,1.3], lnR:"\\sin(x)\\ln(\\cos(x))", d1:"\\cos(x)\\ln(\\cos(x)) + \\sin(x)\\cdot\\frac{1}{\\cos(x)}\\cdot(-\\sin(x))", dS:"\\cos(x)\\ln(\\cos(x)) - \\frac{\\sin^2(x)}{\\cos(x)}", D:"cos(x)*ln(cos(x))-sin(x)^2/cos(x)", rule:"product rule on $\\sin(x)\\ln(\\cos(x))$, and the chain rule on $\\ln(\\cos(x))$"})
  ]
};

/* ---------- inverse-function templates (y = inverse, rewrite with f(y) = x, differentiate implicitly) ---------- */
const INV={
  1:[
    R=>({yT:"\\ln(x)", relT:"e^{y} = x", why:"$\\ln$ is the inverse of $e^x$", diffT:"e^{y}y' = 1", solveT:"y' = \\frac{1}{e^{y}}", rw:["Since $e^{y} = x$, $y' = \\frac{1}{x}$."], ansT:"\\frac{1}{x}", ansA:"1/x", F:"ln(x)", dom:[0.3,3], cond:"x > 0"}),
    R=>({yT:"\\arcsin(x)", relT:"\\sin(y) = x", why:"$\\arcsin$ is the inverse of $\\sin$ on $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$", diffT:"\\cos(y)\\,y' = 1", solveT:"y' = \\frac{1}{\\cos(y)}", rw:["Triangle for $\\sin(y) = \\frac{x}{1}$: opposite $x$, hypotenuse 1, so the adjacent side is $\\sqrt{1-x^2}$. It is positive because $-\\frac{\\pi}{2} \\le y \\le \\frac{\\pi}{2}$.","$\\cos(y) = \\sqrt{1-x^2}$, so $y' = \\frac{1}{\\sqrt{1-x^2}}$."], ansT:"\\frac{1}{\\sqrt{1-x^2}}", ansA:"1/sqrt(1-x^2)", F:"arcsin(x)", dom:[-0.9,0.9], cond:"-1 < x < 1"}),
    R=>({yT:"\\arctan(x)", relT:"\\tan(y) = x", why:"$\\arctan$ is the inverse of $\\tan$ on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$", diffT:"\\sec^2(y)\\,y' = 1", solveT:"y' = \\frac{1}{\\sec^2(y)} = \\cos^2(y)", rw:["Triangle for $\\tan(y) = \\frac{x}{1}$: opposite $x$, adjacent 1, so the hypotenuse is $\\sqrt{1+x^2}$ (a hypotenuse is always positive).","$\\cos(y) = \\frac{1}{\\sqrt{1+x^2}}$, so $y' = \\left(\\frac{1}{\\sqrt{1+x^2}}\\right)^2 = \\frac{1}{1+x^2}$."], ansT:"\\frac{1}{1+x^2}", ansA:"1/(1+x^2)", F:"arctan(x)", dom:[-2,2], cond:""}),
    R=>({yT:"\\sqrt{x}", relT:"y^2 = x", why:"$\\sqrt{x}$ is the inverse of $x^2$ on $[0, \\infty)$", diffT:"2y\\,y' = 1", solveT:"y' = \\frac{1}{2y}", rw:["Since $y = \\sqrt{x}$, $y' = \\frac{1}{2\\sqrt{x}}$."], ansT:"\\frac{1}{2\\sqrt{x}}", ansA:"1/(2sqrt(x))", F:"sqrt(x)", dom:[0.3,3], cond:"x > 0"}),
    R=>({yT:"\\arccos(x)", relT:"\\cos(y) = x", why:"$\\arccos$ is the inverse of $\\cos$ on $[0, \\pi]$", diffT:"-\\sin(y)\\,y' = 1", solveT:"y' = -\\frac{1}{\\sin(y)}", rw:["Triangle for $\\cos(y) = \\frac{x}{1}$: adjacent $x$, hypotenuse 1, so the opposite side is $\\sqrt{1-x^2}$. It is positive because $0 \\le y \\le \\pi$, where $\\sin(y) \\ge 0$.","$\\sin(y) = \\sqrt{1-x^2}$, so $y' = -\\frac{1}{\\sqrt{1-x^2}}$."], ansT:"-\\frac{1}{\\sqrt{1-x^2}}", ansA:"-1/sqrt(1-x^2)", F:"arccos(x)", dom:[-0.9,0.9], cond:"-1 < x < 1"}),
    R=>{ const k=R.int(2,5); return {yT:`\\ln(${k}x)`, relT:`e^{y} = ${k}x`, why:"$\\ln$ is the inverse of $e^x$", diffT:`e^{y}y' = ${k}`, solveT:`y' = \\frac{${k}}{e^{y}}`, rw:[`Since $e^{y} = ${k}x$, $y' = \\frac{${k}}{${k}x} = \\frac{1}{x}$.`], ansT:"\\frac{1}{x}", ansA:"1/x", F:`ln(${k}x)`, dom:[0.3,3], cond:"x > 0"}; }
  ],
  2:[
    R=>{ const a=R.int(2,5), A=a*a; return {yT:`\\arcsin\\left(\\frac{x}{${a}}\\right)`, relT:`\\sin(y) = \\frac{x}{${a}}`, why:"$\\arcsin$ is the inverse of $\\sin$ on $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$", diffT:`\\cos(y)\\,y' = \\frac{1}{${a}}`, solveT:`y' = \\frac{1}{${a}\\cos(y)}`,
      rw:[`Triangle for $\\sin(y) = \\frac{x}{${a}}$: opposite $x$, hypotenuse ${a}, so the adjacent side is $\\sqrt{${A} - x^2}$. It is positive because $-\\frac{\\pi}{2} \\le y \\le \\frac{\\pi}{2}$.`,`$\\cos(y) = \\frac{\\sqrt{${A} - x^2}}{${a}}$, so $y' = \\frac{1}{${a}\\cdot\\frac{\\sqrt{${A} - x^2}}{${a}}} = \\frac{1}{\\sqrt{${A} - x^2}}$.`],
      ansT:`\\frac{1}{\\sqrt{${A} - x^2}}`, ansA:`1/sqrt(${A}-x^2)`, F:`arcsin(x/${a})`, dom:[-(a-0.4),a-0.4], cond:`-${a} < x < ${a}`}; },
    R=>{ const a=R.int(2,5), A=a*a; return {yT:`\\arctan\\left(\\frac{x}{${a}}\\right)`, relT:`\\tan(y) = \\frac{x}{${a}}`, why:"$\\arctan$ is the inverse of $\\tan$ on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$", diffT:`\\sec^2(y)\\,y' = \\frac{1}{${a}}`, solveT:`y' = \\frac{\\cos^2(y)}{${a}}`,
      rw:[`Triangle for $\\tan(y) = \\frac{x}{${a}}$: opposite $x$, adjacent ${a}, so the hypotenuse is $\\sqrt{${A} + x^2}$.`,`$\\cos^2(y) = \\frac{${A}}{${A} + x^2}$, so $y' = \\frac{1}{${a}}\\cdot\\frac{${A}}{${A} + x^2} = \\frac{${a}}{${A} + x^2}$.`],
      ansT:`\\frac{${a}}{${A} + x^2}`, ansA:`${a}/(${A}+x^2)`, F:`arctan(x/${a})`, dom:[-3,3], cond:""}; },
    R=>{ const a=R.int(1,4), A=a*a, xa=a===1?"x":`\\frac{x}{${a}}`; return {yT:`\\arccos${a===1?"(x)":`\\left(${xa}\\right)`}`, relT:`\\cos(y) = ${xa}`, why:"$\\arccos$ is the inverse of $\\cos$ on $[0, \\pi]$", diffT:`-\\sin(y)\\,y' = ${a===1?"1":`\\frac{1}{${a}}`}`, solveT:`y' = -\\frac{1}{${co(a)}\\sin(y)}`,
      rw:[`Triangle for $\\cos(y) = \\frac{x}{${a}}$: adjacent $x$, hypotenuse ${a}, so the opposite side is $\\sqrt{${A} - x^2}$. It is positive because $0 \\le y \\le \\pi$, where $\\sin(y) \\ge 0$.`,`$\\sin(y) = ${fr(`\\sqrt{${A} - x^2}`,String(a))}$, so $y' = -\\frac{1}{\\sqrt{${A} - x^2}}$.`],
      ansT:`-\\frac{1}{\\sqrt{${A} - x^2}}`, ansA:`-1/sqrt(${A}-x^2)`, F:a===1?"arccos(x)":`arccos(x/${a})`, dom:[-(a-0.3*a),a-0.3*a], cond:`-${a} < x < ${a}`}; },
    R=>{ const b=R.pick([2,3,5,10]); return {yT:`\\log_{${b}}(x)`, relT:`${b}^{y} = x`, why:`$\\log_{${b}}$ is the inverse of $${b}^x$`, diffT:`${b}^{y}\\ln(${b})\\,y' = 1`, solveT:`y' = \\frac{1}{${b}^{y}\\ln(${b})}`,
      rw:[`Since $${b}^{y} = x$, $y' = \\frac{1}{x\\ln(${b})}$.`], ansT:`\\frac{1}{x\\ln(${b})}`, ansA:`1/(x*ln(${b}))`, F:`ln(x)/ln(${b})`, dom:[0.3,3], cond:"x > 0"}; },
    R=>{ const n=R.int(3,5); return {yT:`\\sqrt[${n}]{x}`, relT:`y^{${n}} = x`, why:`$\\sqrt[${n}]{x}$ is the inverse of $x^{${n}}$${n%2===0?" on $[0, \\infty)$":""}`, diffT:`${n}y^{${n-1}}\\,y' = 1`, solveT:`y' = \\frac{1}{${n}y^{${n-1}}}`,
      rw:[`Since $y = \\sqrt[${n}]{x} = x^{1/${n}}$, $y^{${n-1}} = x^{${n-1}/${n}}$, so $y' = \\frac{1}{${n}x^{${n-1}/${n}}}$.`], ansT:`\\frac{1}{${n}x^{${n-1}/${n}}}`, ansA:`1/(${n}x^((${n-1})/${n}))`, F:`x^(1/${n})`, dom:[0.3,3], cond:"x > 0"}; }
  ],
  3:[
    R=>({yT:"\\arctan(e^{x})", relT:"\\tan(y) = e^{x}", why:"", diffT:"\\sec^2(y)\\,y' = e^{x}", solveT:"y' = e^{x}\\cos^2(y)", rw:["Triangle for $\\tan(y) = \\frac{e^{x}}{1}$: opposite $e^{x}$, adjacent 1, so the hypotenuse is $\\sqrt{1 + e^{2x}}$.","$\\cos^2(y) = \\frac{1}{1 + e^{2x}}$, so $y' = \\frac{e^{x}}{1 + e^{2x}}$."], ansT:"\\frac{e^{x}}{1 + e^{2x}}", ansA:"e^x/(1+e^(2x))", F:"arctan(e^x)", dom:[-2,2], cond:""}),
    R=>({yT:"\\arcsin(\\sqrt{x})", relT:"\\sin(y) = \\sqrt{x}", why:"", diffT:"\\cos(y)\\,y' = \\frac{1}{2\\sqrt{x}}", solveT:"y' = \\frac{1}{2\\sqrt{x}\\cos(y)}", rw:["Triangle for $\\sin(y) = \\frac{\\sqrt{x}}{1}$: opposite $\\sqrt{x}$, hypotenuse 1, so the adjacent side is $\\sqrt{1 - x}$. It is positive because $-\\frac{\\pi}{2} \\le y \\le \\frac{\\pi}{2}$.","$\\cos(y) = \\sqrt{1-x}$, so $y' = \\frac{1}{2\\sqrt{x}\\sqrt{1-x}}$."], ansT:"\\frac{1}{2\\sqrt{x}\\sqrt{1-x}}", ansA:"1/(2sqrt(x)*sqrt(1-x))", F:"arcsin(sqrt(x))", dom:[0.1,0.9], cond:"0 < x < 1"}),
    R=>({yT:"\\arctan(x^2)", relT:"\\tan(y) = x^2", why:"", diffT:"\\sec^2(y)\\,y' = 2x", solveT:"y' = 2x\\cos^2(y)", rw:["Triangle for $\\tan(y) = \\frac{x^2}{1}$: opposite $x^2$, adjacent 1, so the hypotenuse is $\\sqrt{1 + x^4}$.","$\\cos^2(y) = \\frac{1}{1 + x^4}$, so $y' = \\frac{2x}{1 + x^4}$."], ansT:"\\frac{2x}{1 + x^4}", ansA:"2x/(1+x^4)", F:"arctan(x^2)", dom:[-1.5,1.5], cond:""}),
    R=>({yT:"\\arcsin(x^2)", relT:"\\sin(y) = x^2", why:"", diffT:"\\cos(y)\\,y' = 2x", solveT:"y' = \\frac{2x}{\\cos(y)}", rw:["Triangle for $\\sin(y) = \\frac{x^2}{1}$: opposite $x^2$, hypotenuse 1, so the adjacent side is $\\sqrt{1 - x^4}$. It is positive because $-\\frac{\\pi}{2} \\le y \\le \\frac{\\pi}{2}$.","$\\cos(y) = \\sqrt{1-x^4}$, so $y' = \\frac{2x}{\\sqrt{1 - x^4}}$."], ansT:"\\frac{2x}{\\sqrt{1 - x^4}}", ansA:"2x/sqrt(1-x^4)", F:"arcsin(x^2)", dom:[-0.9,0.9], cond:"-1 < x < 1"}),
    R=>({yT:"\\arccos(e^{x})", relT:"\\cos(y) = e^{x}", why:"", diffT:"-\\sin(y)\\,y' = e^{x}", solveT:"y' = -\\frac{e^{x}}{\\sin(y)}", rw:["Triangle for $\\cos(y) = \\frac{e^{x}}{1}$: adjacent $e^{x}$, hypotenuse 1, so the opposite side is $\\sqrt{1 - e^{2x}}$. It is positive because $0 \\le y \\le \\pi$.","$\\sin(y) = \\sqrt{1 - e^{2x}}$, so $y' = -\\frac{e^{x}}{\\sqrt{1 - e^{2x}}}$."], ansT:"-\\frac{e^{x}}{\\sqrt{1 - e^{2x}}}", ansA:"-e^x/sqrt(1-e^(2x))", F:"arccos(e^x)", dom:[-2,-0.2], cond:"x < 0"}),
    R=>{ const c=R.int(1,6); return {yT:`\\ln(x^2 + ${c})`, relT:`e^{y} = x^2 + ${c}`, why:"", diffT:"e^{y}y' = 2x", solveT:"y' = \\frac{2x}{e^{y}}", rw:[`Since $e^{y} = x^2 + ${c}$, $y' = \\frac{2x}{x^2 + ${c}}$.`], ansT:`\\frac{2x}{x^2 + ${c}}`, ansA:`2x/(x^2+${c})`, F:`ln(x^2+${c})`, dom:[-2,2], cond:""}; }
  ]
};

/* ---------- y = x^{g(x)} pieces for the error-analysis items ---------- */
const GE=[
  {gT:"x", lnR:"x\\ln(x)", dA:"\\ln(x)", dB:"+ 1", prod:"\\frac{1}{x}", pow:"x\\cdot x^{x-1}", expo:"x^{x}\\ln(x)", pos:true, cond:"x > 0"},
  {gT:"\\sin(x)", lnR:"\\sin(x)\\ln(x)", dA:"\\cos(x)\\ln(x)", dB:"+ \\frac{\\sin(x)}{x}", prod:"\\frac{\\cos(x)}{x}", pow:"\\sin(x)\\,x^{\\sin(x)-1}", expo:"x^{\\sin(x)}\\ln(x)\\cos(x)", pos:true, cond:"x > 0"},
  {gT:"\\cos(x)", lnR:"\\cos(x)\\ln(x)", dA:"-\\sin(x)\\ln(x)", dB:"+ \\frac{\\cos(x)}{x}", prod:"-\\frac{\\sin(x)}{x}", pow:"\\cos(x)\\,x^{\\cos(x)-1}", expo:"-x^{\\cos(x)}\\ln(x)\\sin(x)", pos:false, cond:"x > 0"},
  {gT:"x^2", lnR:"x^2\\ln(x)", dA:"2x\\ln(x)", dB:"+ x", prod:"2", pow:"x^2\\cdot x^{x^2-1}", expo:"2x\\,x^{x^2}\\ln(x)", pos:true, cond:"x > 0"},
  {gT:"e^{x}", lnR:"e^{x}\\ln(x)", dA:"e^{x}\\ln(x)", dB:"+ \\frac{e^{x}}{x}", prod:"\\frac{e^{x}}{x}", pow:"e^{x}x^{e^{x}-1}", expo:"e^{x}x^{e^{x}}\\ln(x)", pos:true, cond:"x > 0"},
  {gT:"\\arctan(x)", lnR:"\\arctan(x)\\ln(x)", dA:"\\frac{\\ln(x)}{1+x^2}", dB:"+ \\frac{\\arctan(x)}{x}", prod:"\\frac{1}{x(1+x^2)}", pow:"\\arctan(x)\\,x^{\\arctan(x)-1}", expo:"\\frac{x^{\\arctan(x)}\\ln(x)}{1+x^2}", pos:true, cond:"x > 0"},
  {gT:"\\tan(x)", lnR:"\\tan(x)\\ln(x)", dA:"\\sec^2(x)\\ln(x)", dB:"+ \\frac{\\tan(x)}{x}", prod:"\\frac{\\sec^2(x)}{x}", pow:"\\tan(x)\\,x^{\\tan(x)-1}", expo:"\\sec^2(x)\\,x^{\\tan(x)}\\ln(x)", pos:true, cond:"0 < x < \\frac{\\pi}{2}"}
];

/* ---------- factors for products and quotients ---------- */
function factor(kind,a,m){ // a = shift (or c for quad, k for exp), m = power
  const s=sh(a);
  if(kind==="x") return {kind,root:0,ev:x=>Math.pow(x,m),dv:x=>m/x,T:pw("x",m),A:`x^${m}`,lnC:co(m),lnB:"\\ln(x)",dT:`\\frac{${m}}{x}`,dA:`${m}/x`};
  if(kind==="lin") return {kind,root:-a,ev:x=>Math.pow(x+a,m),dv:x=>m/(x+a),T:m===1?`(${s})`:`(${s})^{${m}}`,A:`(x+(${a}))^${m}`,lnC:co(m),lnB:`\\ln(${s})`,dT:`\\frac{${m}}{${s}}`,dA:`${m}/(x+(${a}))`};
  if(kind==="sqrt") return {kind,root:-a,ev:x=>Math.sqrt(x+a),dv:x=>1/(2*(x+a)),T:`\\sqrt{${s}}`,A:`sqrt(x+(${a}))`,lnC:"\\frac{1}{2}",lnB:`\\ln(${s})`,dT:`\\frac{1}{2(${s})}`,dA:`1/(2(x+(${a})))`,note:`$\\sqrt{${s}} = (${s})^{1/2}$`};
  if(kind==="cbrt") return {kind,root:-a,ev:x=>Math.cbrt(x+a),dv:x=>1/(3*(x+a)),T:`\\sqrt[3]{${s}}`,A:`(x+(${a}))^(1/3)`,lnC:"\\frac{1}{3}",lnB:`\\ln(${s})`,dT:`\\frac{1}{3(${s})}`,dA:`1/(3(x+(${a})))`,note:`$\\sqrt[3]{${s}} = (${s})^{1/3}$`};
  if(kind==="quad") return {kind,root:-99,ev:x=>Math.pow(x*x+a,m),dv:x=>2*m*x/(x*x+a),T:m===1?`(x^2+${a})`:`(x^2+${a})^{${m}}`,A:`(x^2+${a})^${m}`,lnC:co(m),lnB:`\\ln(x^2+${a})`,dT:`\\frac{${2*m}x}{x^2+${a}}`,dA:`${2*m}x/(x^2+${a})`,note:`chain rule: $\\frac{d}{dx}\\ln(x^2+${a}) = \\frac{2x}{x^2+${a}}$`};
  return {kind,root:-99,ev:x=>Math.exp(a*x),dv:x=>a,T:a===1?"e^{x}":`e^{${a}x}`,A:`e^(${a}x)`,lnC:"",lnB:a===1?"x":`${a}x`,dT:String(a),dA:String(a),note:`$\\ln(e^{${a===1?"":a}x}) = ${a===1?"":a}x$`};
}

/* ---------- triangle simplification: outer(inner(u)) ---------- */
const TRIG=["sin","cos","tan","sec","csc","cot"];
function triangle(inner,nT,nA,n2T,n2A,k){ // u = nT/k ; returns sides {o,a,h} as [TeX, ascii]
  const K=String(k), K2=k*k;
  if(inner==="arcsin"){ const adj=[`\\sqrt{${K2} - ${n2T}}`,`sqrt(${K2}-(${n2A}))`]; return {o:[nT,nA],h:[K,K],a:adj,third:"a",eq:`${K2} = a^2 + ${n2T}`,sign:"It is positive because $-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}$, where $\\cos(\\theta) \\ge 0$."}; }
  if(inner==="arccos"){ const opp=[`\\sqrt{${K2} - ${n2T}}`,`sqrt(${K2}-(${n2A}))`]; return {a:[nT,nA],h:[K,K],o:opp,third:"o",eq:`${K2} = ${n2T} + o^2`,sign:"It is positive because $0 \\le \\theta \\le \\pi$, where $\\sin(\\theta) \\ge 0$."}; }
  const hyp=[`\\sqrt{${K2} + ${n2T}}`,`sqrt(${K2}+(${n2A}))`]; return {o:[nT,nA],a:[K,K],h:hyp,third:"h",eq:`h^2 = ${n2T} + ${K2}`,sign:"A hypotenuse is always positive."};
}
const RATIO={sin:["o","h"],cos:["a","h"],tan:["o","a"],csc:["h","o"],sec:["h","a"],cot:["a","o"]};
const NAME={o:"opposite",a:"adjacent",h:"hypotenuse"};

/* ---------- which rule ---------- */
const WH=[
  ["x^{7}",0,"7x^{6}",""],["x^{\\pi}",0,"\\pi x^{\\pi-1}","x > 0"],["x^{\\sqrt{2}}",0,"\\sqrt{2}\\,x^{\\sqrt{2}-1}","x > 0"],["x^{e}",0,"e\\,x^{e-1}","x > 0"],["x^{-4}",0,"-4x^{-5}","x \\neq 0"],["x^{\\frac{3}{2}}",0,"\\frac{3}{2}x^{\\frac{1}{2}}","x > 0"],
  ["7^{x}",1,"7^{x}\\ln(7)",""],["\\pi^{x}",1,"\\pi^{x}\\ln(\\pi)",""],["e^{x}",1,"e^{x}\\ln(e) = e^{x}",""],["\\left(\\frac{1}{2}\\right)^{x}",1,"\\left(\\frac{1}{2}\\right)^{x}\\ln\\left(\\frac{1}{2}\\right)",""],["10^{x}",1,"10^{x}\\ln(10)",""],["(\\sqrt{2})^{x}",1,"(\\sqrt{2})^{x}\\ln(\\sqrt{2})",""],
  ["x^{x}",2,"x^{x}(\\ln(x) + 1)","x > 0"],["x^{\\sin(x)}",2,"x^{\\sin(x)}\\left(\\cos(x)\\ln(x) + \\frac{\\sin(x)}{x}\\right)","x > 0"],["(\\sin(x))^{x}",2,"(\\sin(x))^{x}\\left(\\ln(\\sin(x)) + x\\cot(x)\\right)","0 < x < \\pi"],["(x+1)^{x}",2,"(x+1)^{x}\\left(\\ln(x+1) + \\frac{x}{x+1}\\right)","x > -1"],["x^{\\ln(x)}",2,"x^{\\ln(x)}\\cdot\\frac{2\\ln(x)}{x}","x > 0"],["(\\ln(x))^{x}",2,"(\\ln(x))^{x}\\left(\\ln(\\ln(x)) + \\frac{1}{\\ln(x)}\\right)","x > 1"],["x^{2x}",2,"x^{2x}(2\\ln(x) + 2)","x > 0"]
];
const BASES=[{T:"\\pi",A:"pi",e:false},{T:"e",A:"e",e:true},{T:"3",A:"3",n:3},{T:"5",A:"5",n:5},{T:"2",A:"2",n:2}];
function powTerm(c,b){ // TeX for c x^{b} and its derivative
  const f=`${co(c)}x^{${b.T}}`;
  let d; if(b.n) d=`${c*b.n}${pw("x",b.n-1)}`; else d=`${c===1?"":c}${b.T}${b.e?"\\,":" "}x^{${b.T}-1}`;
  return {f,d};
}
function expTerm(c,b){ // TeX for c b^{x} (always written with a sign in front) and its derivative
  const s=c<0?" - ":" + ", a=Math.abs(c), cc=a===1?"":(b.n?`${a}\\cdot `:String(a));
  return {f:`${s}${cc}${b.T}^{x}`, d:b.e?`${s}${a===1?"":a}e^{x}`:`${s}${cc}${b.T}^{x}\\ln(${b.T})`};
}

M.lecture({
  id:"L17", n:17, date:"2026-10-23", added:"2026-10-26", unit:"u6", quiz:"MT",
  title:"Derivatives of Inverse Functions and Logarithmic Differentiation", sections:["2.7.1","2.7.2"], pages:3,
  summary:"How to get the derivative of $\\arcsin(x)$ from $\\sin(\\arcsin(x)) = x$, the chain rule and a right triangle. Then logarithmic differentiation: let $y = \\ldots$, take ln of both sides, use log properties, differentiate implicitly, and multiply by $y$. It handles a function to the power of a function, like $x^{\\cos(x)}$, and long products and quotients.",
  flags:[
    {ref:"p. 2", text:"The example asks for $f'(x)$ but the last line is written $y' = x^{\\cos(x)}\\left(-\\sin(x)\\ln(x) + \\frac{\\cos(x)}{x}\\right)$. That is fine because of the let statement $y = f(x)$, but on a test finish with the notation the question uses: $f'(x) = \\ldots$."},
    {ref:"p. 1", text:"The notes write $\\cos(\\arcsin(x)) = \\frac{a}{h}$, but the triangle has no side called $h$. $h$ is the hypotenuse, which is labelled 1. So $\\frac{a}{h} = \\frac{\\sqrt{1-x^2}}{1}$."},
    {ref:"p. 1", text:"The heading says \"2.7.1 Derivatives of Inverse Functions\", but Lecture 16 already used 2.7.1 for Implicit Differentiation. In the course notes the arcsin derivation is part of 2.7.1 Implicit Differentiation (Example 2.7.9, p. 119). It is the same section, not a new one."}
  ],
  formulas:[
    {id:"L17.f.cancel", name:"Cancellation property (used)", tex:"\\sin(\\arcsin(x)) = x", note:"For any $x$ with $-1 < x < 1$.", ref:"p. 1",
      blank:{tex:"\\sin(\\arcsin(x)) = \\boxed{\\,?\\,}", answer:"x", vars:["x"], domain:[-0.9,0.9]}},
    {id:"L17.f.eq21", name:"Differentiate both sides: equation (2.1)", tex:"\\cos(\\arcsin(x))\\cdot\\frac{d}{dx}\\arcsin(x) = 1", note:"Chain rule on the left side of $\\sin(\\arcsin(x)) = x$. The right side gives $\\frac{d}{dx}x = 1$.", ref:"p. 1",
      blank:{tex:"\\boxed{\\,?\\,}\\cdot\\frac{d}{dx}\\arcsin(x) = 1", answer:"cos(arcsin(x))", vars:["x"], domain:[-0.9,0.9]}},
    {id:"L17.f.cos-arcsin", name:"Triangle result", tex:"\\cos(\\arcsin(x)) = \\sqrt{1-x^2}", note:"Let $\\theta = \\arcsin(x)$: hypotenuse 1, opposite side $x$, adjacent side $a = \\sqrt{1-x^2}$. $a$ is positive since $-\\frac{\\pi}{2} < \\theta < \\frac{\\pi}{2}$.", ref:"p. 1",
      blank:{tex:"\\cos(\\arcsin(x)) = \\boxed{\\,?\\,}", answer:"sqrt(1-x^2)", vars:["x"], domain:[-0.9,0.9]}},
    {id:"L17.f.d-arcsin", name:"Derivative of arcsin", tex:"\\frac{d}{dx}(\\arcsin(x)) = \\frac{1}{\\sqrt{1-x^2}}", ref:"p. 1",
      blank:{tex:"\\frac{d}{dx}(\\arcsin(x)) = \\boxed{\\,?\\,}", answer:"1/sqrt(1-x^2)", vars:["x"], domain:[-0.9,0.9]}},
    {id:"L17.f.power", name:"Power function rule", tex:"f(x) = x^n,\\quad f'(x) = nx^{n-1}", note:"The base is the variable and the exponent $n$ is a constant.", ref:"p. 2",
      blank:{tex:"f(x) = x^n,\\quad f'(x) = \\boxed{\\,?\\,}", answer:"n x^(n-1)", vars:["n","x"], domain:[0.5,2]}},
    {id:"L17.f.exp", name:"Exponential function rule", tex:"g(x) = a^x,\\ a > 0,\\quad g'(x) = a^x\\ln(a)", note:"The base $a$ is a constant and the exponent is the variable.", ref:"p. 2",
      blank:{tex:"g(x) = a^x,\\ a > 0,\\quad g'(x) = \\boxed{\\,?\\,}", answer:"a^x ln(a)", vars:["a","x"], domain:[0.5,3]}},
    {id:"L17.f.neither", name:"$x^x$ is neither", tex:"h(x) = x^x,\\ x > 0", note:"Not a power function, because the exponent is not a constant. Not an exponential function, because the base is not a constant. Use logarithmic differentiation.", ref:"p. 2"},
    {id:"L17.f.logdiff", name:"Logarithmic differentiation", tex:"\\text{implicit differentiation} + \\text{properties of logarithms}", note:"For a non-constant function to the power of another non-constant function.", ref:"p. 2",
      blank:{tex:"\\text{implicit differentiation} + \\boxed{\\,?\\,}", text:true, accept:["properties of logarithms","properties of logs","log properties","logarithm properties","log laws","logarithm laws","laws of logarithms","laws of logs","the properties of logarithms","properties of logarithm"]}},
    {id:"L17.f.ln-power", name:"Taking ln of both sides (p. 2 example)", tex:"\\ln(y) = \\ln(x^{\\cos(x)}) = \\cos(x)\\ln(x)", note:"The power property $\\log_a(x^y) = y\\log_a(x)$ brings the exponent to the front.", ref:"p. 2",
      blank:{tex:"\\ln(x^{\\cos(x)}) = \\boxed{\\,?\\,}", answer:"cos(x)ln(x)", vars:["x"], domain:[0.5,3]}},
    {id:"L17.f.d-lny", name:"Derivative of the left side", tex:"\\frac{d}{dx}\\ln(y) = \\frac{1}{y}y'", note:"$y$ is a function of $x$, so the chain rule gives the $y'$. Every log differentiation has this left side (pp. 2 to 3).", ref:"p. 2",
      blank:{tex:"\\frac{d}{dx}\\ln(y) = \\boxed{\\,?\\,}", text:true, accept:["1/y y'","1/y*y'","(1/y)y'","(1/y)*y'","1/yy'","y'/y","y'*1/y","y'(1/y)","\\frac{1}{y}y'","\\frac{y'}{y}","(1/y)y′","y′/y"]}},
    {id:"L17.f.ex-xcos", name:"Example result: $x^{\\cos(x)}$", tex:"y' = x^{\\cos(x)}\\left(-\\sin(x)\\ln(x) + \\frac{\\cos(x)}{x}\\right)", note:"For $f(x) = x^{\\cos(x)}$, $x > 0$.", ref:"p. 2",
      blank:{tex:"y' = x^{\\cos(x)}\\left(\\boxed{\\,?\\,}\\right)", answer:"-sin(x)ln(x)+cos(x)/x", vars:["x"], domain:[0.5,3]}},
    {id:"L17.f.warning", name:"Warning", tex:"\\text{Do not skip steps. Do the same operation to both sides.}", note:"The most common error is not performing the same operation on both sides of the equation.", ref:"p. 2"},
    {id:"L17.f.ln-expand", name:"Expanding the log (p. 3 example)", tex:"\\ln(y) = 2\\ln(x) + 3\\ln(x-1) + \\frac{1}{2}\\ln(x+3) - 2\\ln(x+1) - 4\\ln(x+2)", note:"For $y = \\frac{x^2(x-1)^3\\sqrt{x+3}}{(x+1)^2(x+2)^4}$, $x > 1$. Top factors get $+$, bottom factors get $-$, each power comes to the front, and $\\sqrt{x+3} = (x+3)^{1/2}$.", ref:"p. 3",
      blank:{tex:"\\ln(y) = 2\\ln(x) + 3\\ln(x-1) + \\boxed{\\,?\\,} - 2\\ln(x+1) - 4\\ln(x+2)", answer:"1/2 ln(x+3)", vars:["x"], domain:[1.5,4]}},
    {id:"L17.f.d-expand", name:"Differentiating the expanded log (p. 3)", tex:"\\frac{1}{y}y' = \\frac{2}{x} + \\frac{3}{x-1} + \\frac{1}{2(x+3)} - \\frac{2}{x+1} - \\frac{4}{x+2}", ref:"p. 3",
      blank:{tex:"\\frac{1}{y}y' = \\frac{2}{x} + \\frac{3}{x-1} + \\boxed{\\,?\\,} - \\frac{2}{x+1} - \\frac{4}{x+2}", answer:"1/(2(x+3))", vars:["x"], domain:[1.5,4]}},
    {id:"L17.f.ex3-final", name:"Example result (p. 3)", tex:"y' = \\frac{x^2(x-1)^3\\sqrt{x+3}}{(x+1)^2(x+2)^4}\\cdot\\left(\\frac{2}{x} + \\frac{3}{x-1} + \\frac{1}{2(x+3)} - \\frac{2}{x+1} - \\frac{4}{x+2}\\right)", note:"Multiply by $y$ and substitute $y$ back.", ref:"p. 3"}
  ],
  glossary:[
    {id:"L17.t.principal", term:"Principal inverse", def:"The inverse you get by keeping only one piece of a function that is not one-to-one. $\\arcsin$ is the principal inverse of $\\sin$: it uses $\\sin$ on $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ only. The notes spell it 'principle'.", ref:"p. 1"},
    {id:"L17.t.cancel", term:"Cancellation property", def:"A function undoes its inverse. For $\\arcsin$: $\\sin(\\arcsin(x)) = x$. Differentiating both sides of this is how you find the derivative of the inverse.", ref:"p. 1"},
    {id:"L17.t.triangle", term:"Triangle step", def:"To write $\\cos(\\arcsin(x))$ without trig, let $\\theta = \\arcsin(x)$, so $\\sin(\\theta) = \\frac{x}{1}$. Draw a right triangle with opposite side $x$ and hypotenuse 1, find the third side with Pythagoras, and use the range of $\\theta$ to choose its sign.", ref:"p. 1"},
    {id:"L17.t.power", term:"Power function", def:"$x^n$ with $n$ a constant: the variable is in the base. Derivative $nx^{n-1}$.", ref:"p. 2"},
    {id:"L17.t.exponential", term:"Exponential function", def:"$a^x$ with $a > 0$ a constant: the variable is in the exponent. Derivative $a^x\\ln(a)$.", ref:"p. 2"},
    {id:"L17.t.logdiff", term:"Logarithmic differentiation", def:"Implicit differentiation plus properties of logarithms. Let $y = \\ldots$, take ln of both sides, simplify with log properties, differentiate both sides with respect to $x$, multiply by $y$, and substitute $y$ back.", ref:"pp. 2 to 3"},
    {id:"L17.t.let", term:"Let statement", def:"The first line of the method, for example 'Let $y = x^{\\cos(x)}$'. It gives the function a name so you can take ln of both sides.", ref:"p. 2"}
  ],
  figures:{
    arcsin:{title:"The slope of arcsin from the slope of sin", cap:"<b>Fig. 17.1</b> $y = \\arcsin(x)$ is $y = \\sin(x)$ on $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ reflected in the line $y = x$. At mirror points the slopes multiply to 1: $\\cos(\\theta)$ for $\\sin$ and $\\frac{1}{\\cos(\\theta)}$ for $\\arcsin$. That is equation (2.1). The triangle turns $\\cos(\\arcsin(x))$ into $\\sqrt{1-x^2}$. (Lecture 17, p. 1)",
      build(host,{PLOT,M}){
        const NS="http://www.w3.org/2000/svg";
        const mk=(tag,at,par)=>{ const e=document.createElementNS(NS,tag); for(const k in at) e.setAttribute(k,at[k]); if(par) par.append(e); return e; };
        let x0=0.8;
        const G=PLOT.graph(host,{x:[-2,2],y:[-2,2],w:440,h:432,c:"var(--u6)",xlabel:"x",ylabel:"y",xstep:0.5,ystep:0.5,label:"Graphs of sin and arcsin with tangent lines at mirror points"});
        G.line(-2,-2,2,2,{cls:"lt dash",layer:G.layer.back});
        G.fn(Math.sin,{from:-Math.PI/2,to:Math.PI/2,cls:"cv"});
        G.fn(Math.asin,{from:-1,to:1,cls:"cv c"});
        G.label(-1.92,1.78,"y = arcsin(x)",{cls:"lblc"});
        G.label(-1.92,1.5,"y = sin(x)",{cls:"lbl"});
        G.label(-1.92,1.22,"dashed: y = x",{cls:"lbl"});
        const tA=G.line(0,0,0,0,{cls:"tan",layer:G.layer.front}), tS=G.line(0,0,0,0,{cls:"ln",layer:G.layer.front,dash:"5 3"});
        const link=G.line(0,0,0,0,{cls:"lt dash",layer:G.layer.back});
        const mS=G.dot(0,0,{r:5});
        const ux=G.X(1)-G.X(0), uy=G.Y(0)-G.Y(1);
        const seg=(l,x,y,m,half)=>{ const t=half/Math.sqrt(ux*ux+m*m*uy*uy); l.set(x-t,y-m*t,x+t,y+m*t); };
        const ro=PLOT.readout(host);
        const tri=mk("svg",{viewBox:"0 0 320 150",class:"fig",role:"img","aria-label":"Right triangle for theta = arcsin(x)"});
        tri.style.setProperty("--c","var(--u6)"); tri.style.maxWidth="340px"; tri.style.display="block"; tri.style.margin="10px auto 0"; host.append(tri);
        const f=v=>(Math.abs(v)<5e-4?0:v).toFixed(2).replace("-","−");
        function drawTri(){
          tri.innerHTML="";
          const R=110, Ox=50, Oy=x0>=0?128:22, a=Math.sqrt(1-x0*x0), Ax=Ox+R*a, By=Oy-R*x0;
          mk("path",{d:`M${Ox} ${Oy} L${Ax} ${Oy} L${Ax} ${By} Z`,style:"fill:var(--c);fill-opacity:.12;stroke:var(--c);stroke-width:1.8"},tri);
          const s=x0>=0?-1:1; mk("path",{d:`M${Ax-10} ${Oy} L${Ax-10} ${Oy+s*10} L${Ax} ${Oy+s*10}`,style:"fill:none;stroke:var(--fig-stroke);stroke-width:1"},tri);
          const th=Math.asin(x0), rr=26; if(Math.abs(th)>0.02) mk("path",{d:`M${Ox+rr} ${Oy} A${rr} ${rr} 0 0 ${x0>0?0:1} ${Ox+rr*Math.cos(th)} ${Oy-rr*Math.sin(th)}`,style:"fill:none;stroke:var(--fig-stroke);stroke-width:1.2"},tri);
          const t=(x,y,s,anchor,cls)=>{ const e=mk("text",{x,y,"text-anchor":anchor||"start",class:cls||"lbl"},tri); e.textContent=s; return e; };
          t(Ox+rr+6,Oy+(x0>=0?-6:14),"θ","start");
          const mx=(Ox+Ax)/2, my=(Oy+By)/2, vx=Ax-mx, vy=Oy-my, vl=Math.hypot(vx,vy)||1;
          t(mx-16*vx/vl, my-16*vy/vl+4,"1","middle");
          t(Ax+8,(Oy+By)/2+4,`x = ${f(x0)}`,"start","lblc");
          t((Ox+Ax)/2,x0>=0?Oy+20:Oy-10,`a = √(1 − x²) = ${f(a)}`,"middle","lblc");
        }
        function upd(){
          const th=Math.asin(x0), mA=1/Math.sqrt(1-x0*x0), mSl=Math.cos(th);
          seg(tA,x0,th,mA,70); seg(tS,th,x0,mSl,70); mS.set(th,x0); link.set(x0,th,th,x0);
          ro.innerHTML=`x = <b>${f(x0)}</b>, θ = arcsin(x) = <b>${f(th)}</b><br>slope of sin at θ: cos θ = <b>${mSl.toFixed(3)}</b> (dashed tangent)<br>slope of arcsin at x: 1/√(1 − x²) = <b>${mA.toFixed(3)}</b> (solid tangent)<br>product: ${mSl.toFixed(3)} × ${mA.toFixed(3)} = <b>${(mSl*mA).toFixed(3)}</b>, which is equation (2.1)`;
          drawTri();
        }
        G.handle(x0,Math.asin(x0),{f:Math.asin,bounds:[-0.95,0.95],label:"Point on arcsin",onMove:x=>{ x0=x; upd(); }});
        upd();
      }},
    rules:{title:"Power rule? Exponential rule? Neither", cap:"<b>Fig. 17.2</b> Here both the base and the exponent change with $x$. The solid line is the true tangent, with the slope from logarithmic differentiation. The dashed line uses the power rule anyway and the dotted line uses the exponential rule anyway. Both give the wrong slope. (Lecture 17, p. 2)",
      build(host,{PLOT,M}){
        const C={
          xx:{x:[0,2.3],y:[-1,6],xs:0.5,b:[0.08,2.1],s0:1.5,f:x=>Math.pow(x,x),tr:x=>Math.pow(x,x)*(Math.log(x)+1),pw:x=>x*Math.pow(x,x-1),ex:x=>Math.pow(x,x)*Math.log(x),
            tex:"$y = x^{x}$. Power rule: $x\\cdot x^{x-1}$. Exponential rule: $x^{x}\\ln(x)$.<br>Logarithmic differentiation: $y' = x^{x}(\\ln(x) + 1)$."},
          xc:{x:[0,6.6],y:[-1,7],xs:1,b:[0.1,6.4],s0:1,f:x=>Math.pow(x,Math.cos(x)),tr:x=>Math.pow(x,Math.cos(x))*(-Math.sin(x)*Math.log(x)+Math.cos(x)/x),pw:x=>Math.cos(x)*Math.pow(x,Math.cos(x)-1),ex:x=>Math.pow(x,Math.cos(x))*Math.log(x)*(-Math.sin(x)),
            tex:"$y = x^{\\cos(x)}$. Power rule: $\\cos(x)\\,x^{\\cos(x)-1}$. Exponential rule with the chain rule: $x^{\\cos(x)}\\ln(x)\\cdot(-\\sin(x))$.<br>Logarithmic differentiation (p. 2): $y' = x^{\\cos(x)}\\left(-\\sin(x)\\ln(x) + \\frac{\\cos(x)}{x}\\right)$."}
        };
        let key="xx"; const sv={xx:C.xx.s0,xc:C.xc.s0};
        const rich=s=>(M&&M.rich)?M.rich(s):s;
        const ctl=PLOT.controls(host);
        const sg=PLOT.seg(ctl,{label:"Function",value:key,items:[["xx","y = xˣ"],["xc","y = x^cos(x) (p. 2)"]],onchange:v=>{ key=v; build(); }});
        [...sg.children].forEach(b=>{ b.style.flex="1 0 auto"; b.style.minWidth="0"; });
        const wrap=document.createElement("div"); host.append(wrap);
        const fx=document.createElement("div"); fx.className="small"; fx.style.margin="8px 0"; host.append(fx);
        const ro=PLOT.readout(host);
        let G,tT,tP,tE,ux,uy;
        const seg=(l,x,y,m,half)=>{ const t=half/Math.sqrt(ux*ux+m*m*uy*uy); l.set(x-t,y-m*t,x+t,y+m*t); };
        const f=v=>(Math.abs(v)<5e-4?0:v).toFixed(3).replace("-","−");
        function build(){
          wrap.innerHTML=""; const c=C[key];
          G=PLOT.graph(wrap,{x:c.x,y:c.y,xstep:c.xs,h:340,c:"var(--u6)",xlabel:"x",ylabel:"y",label:"Graph with the true tangent and two wrong tangents"});
          G.fn(c.f,{from:0.02,to:c.x[1],cls:"cv c",n:400});
          ux=G.X(1)-G.X(0); uy=G.Y(0)-G.Y(1);
          tP=G.line(0,0,0,0,{cls:"ln",layer:G.layer.front,dash:"7 4",color:"var(--bad)"});
          tE=G.line(0,0,0,0,{cls:"ln",layer:G.layer.front,dash:"1.5 3.5"});
          tT=G.line(0,0,0,0,{cls:"tan",layer:G.layer.front});
          G.handle(sv[key],c.f(sv[key]),{f:c.f,bounds:c.b,label:"Point on the curve",onMove:x=>{ sv[key]=x; upd(); }});
          fx.innerHTML=rich(c.tex);
          upd();
        }
        function upd(){
          const c=C[key], x=sv[key], y=c.f(x), m=c.tr(x), p=c.pw(x), e=c.ex(x);
          seg(tT,x,y,m,90); seg(tP,x,y,p,90); seg(tE,x,y,e,90);
          ro.innerHTML=`x = <b>${f(x)}</b>, y = <b>${f(y)}</b><br>true slope (solid): <b>${f(m)}</b><br>power rule used anyway (dashed): ${f(p)}<br>exponential rule used anyway (dotted): ${f(e)}<br>dashed + dotted = ${f(p+e)}`;
        }
        build();
      }},
    factors:{title:"ln turns a product into a sum", cap:"<b>Fig. 17.3</b> For $y = \\frac{x^p(x-1)^q}{(x+2)^r}$, taking ln gives a sum of three simple terms (thin curves). Their sum is $\\ln(y)$ (thick curve). The slope of $\\ln(y)$ is $\\frac{1}{y}y'$, which is one fraction per factor. (Lecture 17, p. 3)",
      build(host,{PLOT,M}){
        let p=2, q=3, r=4, x0=2;
        const rich=s=>(M&&M.rich)?M.rich(s):s;
        const G=PLOT.graph(host,{x:[1,5],y:[-8,8],h:360,c:"var(--u6)",xlabel:"x",ylabel:"",xstep:0.5,ystep:2,label:"ln(y) and its three terms"});
        const fP=x=>p*Math.log(x), fQ=x=>q*Math.log(x-1), fR=x=>-r*Math.log(x+2), fS=x=>fP(x)+fQ(x)+fR(x);
        const cP=G.fn(fP,{from:1,to:5,cls:"lt"}), cQ=G.fn(fQ,{from:1.0005,to:5,cls:"lt"}), cR=G.fn(fR,{from:1,to:5,cls:"lt"});
        const cS=G.fn(fS,{from:1.0005,to:5,cls:"cv c"});
        const lP=G.label(4.95,fP(4.95),"",{cls:"lbl",anchor:"end",dy:-6}), lQ=G.label(4.95,fQ(4.95),"",{cls:"lbl",anchor:"end",dy:-6}), lR=G.label(4.95,fR(4.95),"",{cls:"lbl",anchor:"end",dy:14});
        const tg=G.line(0,0,0,0,{cls:"tan",layer:G.layer.front});
        const ux=G.X(1)-G.X(0), uy=G.Y(0)-G.Y(1);
        const seg=(l,x,y,m,half)=>{ const t=half/Math.sqrt(ux*ux+m*m*uy*uy); l.set(x-t,y-m*t,x+t,y+m*t); };
        const fx=document.createElement("div"); fx.className="small"; fx.style.margin="8px 0"; host.append(fx);
        const ro=PLOT.readout(host), ctl=PLOT.controls(host);
        const h=G.handle(x0,fS(x0),{f:fS,bounds:[1.15,4.9],label:"Point on ln(y)",onMove:x=>{ x0=x; upd(); }});
        const pT=v=>v===0.5?"\\frac{1}{2}":(v%1? `\\frac{${2*v}}{2}`:String(v));
        const topT=()=>(p===0.5?"\\sqrt{x}":p===1?"x":p%1?`x^{${2*p}/2}`:`x^{${p}}`)+(q===1?"(x-1)":`(x-1)^{${q}}`);
        const botT=()=>r===1?"(x+2)":`(x+2)^{${r}}`;
        const cf=v=>v===1?"":pT(v);
        const dP=()=>p===0.5?"\\frac{1}{2x}":p%1?`\\frac{${2*p}}{2x}`:`\\frac{${p}}{x}`;
        function redraw(){ cP.update(fP,1,5); cQ.update(fQ,1.0005,5); cR.update(fR,1,5); cS.update(fS,1.0005,5);
          lP.set(4.95,fP(4.95),`${p} ln x`); lQ.set(4.95,fQ(4.95),`${q} ln(x−1)`); lR.set(4.95,fR(4.95),`−${r} ln(x+2)`);
          const pHi=fP(4.95)>=fQ(4.95); lP.setAttribute("y",G.Y(fP(4.95))+(pHi?-6:14)); lQ.setAttribute("y",G.Y(fQ(4.95))+(pHi?14:-6));
          fx.innerHTML=rich(`Thin curves: the three terms. Thick curve: their sum, $\\ln(y)$.<br>$y = \\frac{${topT()}}{${botT()}}$, $x > 1$<br>$\\ln(y) = ${cf(p)}\\ln(x) + ${cf(q)}\\ln(x-1) - ${cf(r)}\\ln(x+2)$<br>$\\frac{1}{y}y' = ${dP()} + \\frac{${q}}{x-1} - \\frac{${r}}{x+2}$`); }
        function upd(){
          const a=p/x0, b=q/(x0-1), c=r/(x0+2), s=a+b-c, y=Math.pow(x0,p)*Math.pow(x0-1,q)/Math.pow(x0+2,r);
          seg(tg,x0,fS(x0),s,80); h.setAttribute("transform",`translate(${G.X(x0)},${G.Y(fS(x0))})`);
          const F=v=>v.toFixed(3).replace("-","−");
          ro.innerHTML=`at x = <b>${x0.toFixed(2)}</b>: slope of ln(y) = ${F(a)} + ${F(b)} − ${F(c)} = <b>${F(s)}</b> = y′/y<br>y = ${y<1e-3?y.toExponential(2):F(y)}, so y′ = y × ${F(s)} = <b>${Math.abs(y*s)<1e-3?(y*s).toExponential(2):F(y*s)}</b>`;
        }
        PLOT.slider(ctl,{label:"p (power of x on top)",min:0.5,max:4,step:0.5,value:p,oninput:v=>{ p=v; redraw(); upd(); }});
        PLOT.slider(ctl,{label:"q (power of x − 1 on top)",min:1,max:4,step:1,value:q,oninput:v=>{ q=v; redraw(); upd(); }});
        PLOT.slider(ctl,{label:"r (power of x + 2 on the bottom)",min:1,max:4,step:1,value:r,oninput:v=>{ r=v; redraw(); upd(); }});
        redraw(); upd();
      }}
  },
  gens:[
    {id:"L17.g.power", title:"Logarithmic differentiation: $f(x)^{g(x)}$", skill:"Differentiate a function to the power of a function", ref:"p. 2",
      gen(R,d){
        const T=R.pick(POW[d])(R), nm=R.pick(["f","g","h"]);
        const cond=T.cond?`, $${T.cond}$`:"";
        const prompt=d===3?`Determine the derivative of $${nm}(x) = ${T.yT}$${cond}.`:`Use logarithmic differentiation to find $${nm}'(x)$ where $${nm}(x) = ${T.yT}$${cond}.`;
        const steps=[`Let $y = ${T.yT}$.`,`Take ln of both sides: $\\ln(y) = \\ln\\left(${T.yT}\\right)$.`,`Power property of logs, $\\ln(a^b) = b\\ln(a)$: $\\ln(y) = ${T.lnR}$.`,
          `Differentiate both sides with respect to $x$. The left side is $\\frac{1}{y}y'$ (chain rule). The right side needs the ${T.rule}: $\\frac{1}{y}y' = ${T.d1}$.`];
        if(T.d1!==T.dS) steps.push(`Simplify: $\\frac{1}{y}y' = ${T.dS}$.`);
        steps.push(`Multiply both sides by $y$: $y' = y\\left(${T.dS}\\right)$.`,`Substitute $y$ back: $${nm}'(x) = ${T.yT}\\left(${T.dS}\\right)$.`);
        return {prompt, answer:{answer:`(${T.F})^(${T.G})*(${T.D})`, vars:["x"], domain:T.dom, placeholder:"e.g. x^x(ln(x) + 1)"},
          verify:{deriv:`(${T.F})^(${T.G})`},
          hint:"Neither the power rule nor the exponential rule works here. Let $y = $ the function, take ln of both sides, bring the exponent down, then differentiate both sides (product rule on the right).",
          steps, answerTeX:`$${nm}'(x) = ${T.yT}\\left(${T.dS}\\right)$`};
      }},
    {id:"L17.g.prodquot", title:"Logarithmic differentiation of a product or quotient", skill:"Use logs to differentiate a long product or quotient", ref:"p. 3",
      gen(R,d){
        let top, bot, all, sgn, L, dom;
        for(let tries=0;;tries++){
          const mp=tries<10?(d===1?4:5):tries<25?3:2; // lower the powers if the values get too big for the checker
          const shifts=R.shuffle([-3,-2,-1,1,2,3,4,5]); let si=0; const nextShift=()=>shifts[si++];
          top=[]; bot=[];
          const useX=R.int(0,2)>0, xTop=R.int(0,2)>0;
          if(d===1){
            if(useX) (xTop?top:bot).push(factor("x",0,R.int(1,mp)));
            while(top.length+bot.length<3){ const f=factor("lin",nextShift(),R.int(1,mp)); (top.length<2&&(bot.length>=1||R.int(0,1)===0)?top:bot).push(f); }
            if(!top.length){ top.push(bot.pop()); }
            if(!bot.length){ bot.push(top.pop()); }
          } else {
            const n=d===2?4:5;
            const root=factor(d===3&&R.int(0,2)===0?"cbrt":"sqrt",nextShift(),1);
            (R.int(0,2)>0?top:bot).push(root);
            if(d===3){ const ex=R.int(0,1)===0?factor("quad",R.int(1,9),R.int(1,Math.min(3,mp))):factor("exp",R.int(1,Math.min(3,mp)),1); (R.int(0,1)===0?top:bot).push(ex); }
            if(useX) (xTop?top:bot).push(factor("x",0,R.int(1,mp)));
            while(top.length+bot.length<n){ const f=factor("lin",nextShift(),R.int(1,mp)); (top.length<=bot.length?top:bot).push(f); }
            if(!top.length) top.push(bot.pop()); if(!bot.length) bot.push(top.pop());
          }
          all=top.concat(bot); sgn=f=>top.includes(f)?1:-1;
          L=Math.max(...all.map(f=>f.root)); dom=[L+0.3,L+2];
          let big=0; for(let i=0;i<=8;i++){ const x=dom[0]+(dom[1]-dom[0])*i/8; let y=1, s=0; all.forEach(f=>{ y*=Math.pow(f.ev(x),sgn(f)); s+=sgn(f)*f.dv(x); }); big=Math.max(big,Math.abs(y),Math.abs(y*s)); }
          if(big<3000 || tries>40) break;
        }
        const cond=`x > ${L}`;
        const prodT=list=>list.map(f=>f.T).join("");
        const yT=`\\frac{${prodT(top)}}{${prodT(bot)}}`;
        const yA=`(${top.map(f=>f.A).join("*")})/(${bot.map(f=>f.A).join("*")})`;
        let lnT="", dT="", dA="";
        all.forEach((f,i)=>{ const s=sgn(f); lnT+=(i===0?(s<0?"-":""):(s<0?" - ":" + "))+(f.kind==="exp"?f.lnB:`${f.lnC}${f.lnB}`);
          dT+=(i===0?(s<0?"-":""):(s<0?" - ":" + "))+f.dT; dA+=(s<0?"-":"+")+`(${f.dA})`; });
        const notes=all.filter(f=>f.note).map(f=>f.note);
        const prompt=d===3?`Let $y = ${yT}$, $${cond}$. Find $y'$.`:`Use logarithmic differentiation to find $y'$ where $y = ${yT}$, $${cond}$.`;
        return {prompt,
          parts:[{label:"$\\frac{1}{y}y' =$",answer:{answer:dA,vars:["x"],domain:dom,placeholder:"e.g. 2/x + 3/(x-1) - 4/(x+2)"}},
                 {label:"$y' =$",answer:{answer:`${yA}*(${dA})`,vars:["x"],domain:dom,placeholder:"y written out, times the bracket"}}],
          verify:{deriv:`ln(${yA})`},
          hint:"Skip the quotient rule. Take ln of both sides and split the log: each factor on top becomes $+\\,$(power)$\\ln(\\ldots)$ and each factor on the bottom becomes $-\\,$(power)$\\ln(\\ldots)$. Then differentiate term by term.",
          steps:[`Take ln of both sides: $\\ln(y) = \\ln\\left(${yT}\\right)$.`,
            `Use the log properties (product, quotient and power)${notes.length?`, with ${notes.join(" and ")}`:""}: $\\ln(y) = ${lnT}$.`,
            `Differentiate both sides with respect to $x$: $\\frac{1}{y}y' = ${dT}$.`,
            `Multiply both sides by $y$: $y' = y\\left(${dT}\\right)$.`,
            `Substitute $y$ back: $y' = ${yT}\\cdot\\left(${dT}\\right)$.`],
          answerTeX:`$\\frac{1}{y}y' = ${dT}$, so $y' = ${yT}\\cdot\\left(${dT}\\right)$`};
      }},
    {id:"L17.g.inverse", title:"Derivative of an inverse function", skill:"Differentiate $f(y) = x$ implicitly and write $y'$ in terms of $x$", ref:"p. 1",
      gen(R,d){
        const T=R.pick(INV[d])(R), cond=T.cond?`, $${T.cond}$`:"";
        const prompt=d===3?`Let $y = ${T.yT}$${cond}. Rewrite this without the inverse function as $${T.relT}$. Differentiate implicitly and give $y'$ in terms of $x$.`
          :`Let $y = ${T.yT}$${cond}. Since ${T.why}, this means $${T.relT}$. Use implicit differentiation to find $y'$, and write it in terms of $x$.`;
        return {prompt, answer:{answer:T.ansA, vars:["x"], domain:T.dom, placeholder:"in terms of x, e.g. 1/sqrt(1-x^2)"},
          verify:{deriv:T.F},
          hint:"Differentiate both sides of the rewritten equation with respect to $x$. The left side has $y$ in it, so the chain rule gives a $y'$. Solve for $y'$, then use a triangle (or the equation itself) to replace the $y$.",
          steps:[`Rewrite: $${T.relT}$.`,`Differentiate both sides with respect to $x$ (chain rule on the left): $${T.diffT}$.`,`Solve: $${T.solveT}$.`].concat(T.rw),
          answerTeX:`$y' = ${T.ansT}$`};
      }},
    {id:"L17.g.triangle", title:"Simplify $\\cos(\\arcsin(x))$ and friends", skill:"Use a right triangle to remove an inverse trig function", ref:"p. 1",
      gen(R,d){
        const inner=R.pick(["arcsin","arccos","arctan"]);
        const self={arcsin:"sin",arccos:"cos",arctan:"tan"}[inner];
        const outer=R.pick(TRIG.filter(t=>t!==self));
        let nT="x", nA="x", n2T="x^2", n2A="x^2", k=1, dom;
        const trig=inner!=="arctan";
        if(d===1){ dom=trig?[0.1,0.9]:[0.2,3]; }
        else if(d===2){ if(R.int(0,1)===0){ k=R.int(2,5); dom=trig?[0.1*k,0.9*k]:[0.2,3]; } else { const c=R.int(2,4); nT=`${c}x`; nA=`${c}*x`; n2T=`${c*c}x^2`; n2A=`${c*c}x^2`; dom=trig?[0.1/c,0.9/c]:[0.1,2]; } }
        else { const pick=R.int(0,2); if(pick===0){ nT="x^2"; nA="x^2"; n2T="x^4"; n2A="x^4"; dom=trig?[0.1,0.9]:[0.2,1.8]; } else if(pick===1){ nT="\\sqrt{x}"; nA="sqrt(x)"; n2T="x"; n2A="x"; dom=trig?[0.05,0.9]:[0.2,3]; } else { k=R.int(2,4); const c=R.pick([1,3].filter(v=>v<k||!trig)); nT=c===1?"x":`${c}x`; nA=`${c}*x`; n2T=c===1?"x^2":`${c*c}x^2`; n2A=`${c*c}x^2`; dom=trig?[0.1*k/c,0.9*k/c]:[0.2,2]; } }
        const uT=k===1?nT:`\\frac{${nT}}{${k}}`, uA=k===1?nA:`(${nA})/${k}`;
        const S=triangle(inner,nT,nA,n2T,n2A,k);
        const [pn,pd]=RATIO[outer], num=S[pn], den=S[pd];
        const ansT=fr(num[0],den[0]), ansA=den[1]==="1"?`(${num[1]})`:`(${num[1]})/(${den[1]})`;
        const range=inner==="arcsin"?"-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}":inner==="arccos"?"0 \\le \\theta \\le \\pi":"-\\frac{\\pi}{2} < \\theta < \\frac{\\pi}{2}";
        const known=inner==="arctan"?`opposite ${"$"+nT+"$"}, adjacent ${k}`:inner==="arcsin"?`opposite ${"$"+nT+"$"}, hypotenuse ${k}`:`adjacent ${"$"+nT+"$"}, hypotenuse ${k}`;
        return {prompt:`Write $\\${outer}\\left(\\${inner}\\left(${uT}\\right)\\right)$ without any trig or inverse trig functions. Assume $${uT}$ is positive${trig?" and less than 1":""}.`,
          answer:{answer:ansA, vars:["x"], domain:dom, placeholder:"e.g. sqrt(1-x^2)"},
          verify:{expr:`${outer}(${inner}(${uA}))`},
          hint:`Let $\\theta = \\${inner}\\left(${uT}\\right)$, so $\\${self}(\\theta) = ${uT}$. Draw a right triangle with those two sides, find the third side with Pythagoras, then read off $\\${outer}(\\theta)$.`,
          steps:[`Let $\\theta = \\${inner}\\left(${uT}\\right)$. Then $\\${self}(\\theta) = ${k===1?`\\frac{${nT}}{1}`:uT}$ and $${range}$.`,
            `Right triangle: ${known}.`,
            `Pythagoras: $${S.eq}$, so the ${NAME[S.third]} is $${S[S.third][0]}$. ${S.sign}`,
            `$\\${outer}(\\theta) = \\frac{\\text{${NAME[pn]}}}{\\text{${NAME[pd]}}} = ${fr(num[0],den[0])}$.`],
          answerTeX:`$\\${outer}\\left(\\${inner}\\left(${uT}\\right)\\right) = ${ansT}$`};
      }},
    {id:"L17.g.which", title:"Power rule, exponential rule, or neither?", skill:"Pick the right rule for $x^a$, $a^x$ and $x^x$", ref:"p. 2",
      gen(R,d){
        if(d===1){ const [fT,kind,dT,cond]=R.pick(WH);
          const opts=["Power rule: $nx^{n-1}$","Exponential rule: $a^x\\ln(a)$","Neither: use logarithmic differentiation"];
          const why=kind===0?"The base is $x$ and the exponent is a constant, so it is a power function.":kind===1?"The base is a positive constant and the exponent is $x$, so it is an exponential function.":"Both the base and the exponent change with $x$. It is neither a power function nor an exponential function.";
          return {prompt:`Which rule finds the derivative of $f(x) = ${fT}$${cond?`, $${cond}$`:""}?`, parts:[{answer:{type:"mc",options:opts,correct:kind}}],
            hint:"Ask two questions: is the base a constant? Is the exponent a constant?",
            steps:[why, `$f'(x) = ${dT}$.`], answerTeX:opts[kind]};
        }
        const b=R.pick(BASES), c1=R.pick([1,2,3,4]), c2=R.pick([1,-1,2,-2,3,5]);
        const P1=powTerm(c1,b), E1=expTerm(c2,b);
        let fT=`${P1.f}${E1.f}`, dTeX=`${P1.d}${E1.d}`, fA=`${c1}*x^(${b.A})+(${c2})*(${b.A})^x`, dA=`${c1}*${b.A}*x^(${b.A}-1)+(${c2})*(${b.A})^x*ln(${b.A})`;
        const steps=[`$${P1.f}$ is a power function, since the exponent $${b.T}$ is a constant. The power rule gives $${P1.d}$.`,`$${E1.f.replace(/^ \+ /,"").replace(/^ - /,"-")}$ is an exponential function, since the base $${b.T}$ is a constant. The exponential rule gives $${E1.d.replace(/^ \+ /,"").replace(/^ - /,"-")}$${b.e?", since $\\ln(e) = 1$":""}.`];
        if(d===3){ const k=R.int(1,3), kx=k===1?"x":`${k}x`;
          fT+=` + x^{${kx}}`; fA+=`+x^(${k}*x)`; dA+=`+x^(${k}*x)*(${k}*ln(x)+${k})`; const dX=`x^{${kx}}(${co(k)}\\ln(x) + ${k})`; dTeX+=` + ${dX}`;
          steps.push(`$x^{${kx}}$ is neither. Let $y = x^{${kx}}$, so $\\ln(y) = ${kx}\\ln(x)$ and $\\frac{1}{y}y' = ${co(k)}\\ln(x) + ${kx}\\cdot\\frac{1}{x} = ${co(k)}\\ln(x) + ${k}$. So its derivative is $${dX}$.`); }
        steps.push(`$f'(x) = ${dTeX}$.`);
        return {prompt:`Find $f'(x)$ for $f(x) = ${fT}$, $x > 0$.`, answer:{answer:dA, vars:["x"], domain:[0.5,2], placeholder:"e.g. pi x^(pi-1) + pi^x ln(pi)"},
          verify:{deriv:fA},
          hint:"Treat each term on its own. Constant exponent: power rule. Constant base: exponential rule. Both change: logarithmic differentiation.",
          steps, answerTeX:`$f'(x) = ${dTeX}$`};
      }},
    {id:"L17.g.error", title:"Find the mistake in a log differentiation", skill:"Spot errors and notation slips in logarithmic differentiation", ref:"pp. 2 to 3",
      gen(R,d){
        const kind=d===1?R.pick(["C","C","A"]):d===2?"A":R.pick(["A","B","B"]);
        if(kind==="C"){
          const g=R.pick(GE), Y=`x^{${g.gT}}`, good=`${Y}\\left(${g.dA} ${g.dB}\\right)`;
          const wrong=[g.pow,g.expo,`${g.dA} ${g.dB}`];
          const noneRight=R.int(0,4)===0;
          const picks=noneRight?R.shuffle(wrong).slice(0,3):R.shuffle([good].concat(R.shuffle(wrong).slice(0,2)));
          const names=["A","B","C"], ci=picks.indexOf(good);
          return {prompt:`Three students find $y'$ for $y = ${Y}$, $${g.cond}$.<br>${picks.map((t,i)=>`Student ${names[i]}: $y' = ${t}$`).join("<br>")}<br>Which student is correct?`,
            parts:[{answer:{type:"mc",options:["Student A","Student B","Student C","None of them is correct"],correct:ci<0?3:ci}}],
            hint:"The base and the exponent both change, so neither the power rule nor the exponential rule applies. Do the logarithmic differentiation yourself and compare.",
            steps:[`$\\ln(y) = ${g.lnR}$, so $\\frac{1}{y}y' = ${g.dA} ${g.dB}$ and $y' = ${good}$.`,`$${g.pow}$ treats $y$ as a power function and $${g.expo}$ treats it as an exponential function. Both are wrong. $${g.dA} ${g.dB}$ forgot to multiply by $y$.`, ci<0?"None of the three students has the right answer.":`That is Student ${names[ci]}'s answer.`],
            answerTeX:ci<0?"None of them is correct":`Student ${names[ci]}`};
        }
        if(kind==="A"){
          let g=R.pick(GE); const errs=d===1?["e1","e2"]:["e1","e2","e4","e5","e8","none"];
          let e=R.pick(errs); if(e==="e5"&&!g.pos) g=GE[1];
          const Y=`x^{${g.gT}}`, D=`${g.dA} ${g.dB}`;
          const L1=`$\\ln(y) = \\ln\\left(${Y}\\right)$`, L2=`$\\ln(y) = ${g.lnR}$`, L3=`$\\frac{1}{y}y' = ${D}$`, L4=`$y' = y\\left(${D}\\right)$`, L5=`$y' = ${Y}\\left(${D}\\right)$`;
          let lines, first, why;
          if(e==="e1"){ lines=[L1,L2,`$\\frac{1}{y}y' = ${g.lnR}$`,`$y' = y\\cdot ${g.lnR}$`,`$y' = ${Y}\\cdot ${g.lnR}$`]; first=3; why=`the left side was differentiated ($\\frac{d}{dx}\\ln(y) = \\frac{1}{y}y'$) but the right side was not. Both sides need the same operation.`; }
          else if(e==="e2"){ lines=[L1,L2,`$\\frac{1}{y}y' = ${g.prod}$`,`$y' = y\\cdot ${g.prod}$`,`$y' = ${Y}\\cdot ${g.prod}$`]; first=3; why=`$${g.lnR}$ is a product, so it needs the product rule. Multiplying the two derivatives together is not the product rule.`; }
          else if(e==="e4"){ lines=[L1,L2,L3,`$y' = ${D}$`]; first=4; why="to get $y'$ alone, multiply both sides by $y$. The factor $y$ was dropped."; }
          else if(e==="e5"){ lines=[L1,L2,L3,L4,`$y' = ${Y}${g.dA} ${g.dB}$`]; first=5; why=`brackets are missing. $${Y}$ multiplies the whole sum, so it should be $y' = ${Y}\\left(${D}\\right)$.`; }
          else if(e==="e8"){ lines=[L1,L2,L3,L4,`$y' = \\ln\\left(${Y}\\right)\\left(${D}\\right)$`]; first=5; why=`$y = ${Y}$, not $\\ln\\left(${Y}\\right)$. Substitute $y$ itself.`; }
          else { lines=[L1,L2,L3,L4,L5]; first=0; why=""; }
          return {prompt:`A student uses logarithmic differentiation on $y = ${Y}$, $${g.cond}$:${listLines(lines)}Select the first line that has a mistake.`,
            parts:[{answer:mkMC(lines.length,first)}],
            hint:"Check that each line does the same thing to both sides, that the product rule is used on the right, and that the last line has brackets and $y$ substituted correctly.",
            steps:first===0?["Line (2) uses the power property. Line (3) differentiates both sides, with the product rule on the right.","Lines (4) and (5) multiply by $y$ and substitute it back, with brackets.","There is no mistake."]:[`Line (${first}) is the first mistake: ${why}`,`The correct work is ${[L1,L2,L3,L4,L5].join(", ")}.`],
            answerTeX:first===0?"There is no mistake":`Line (${first})`};
        }
        // B: product/quotient with a sqrt(x^2 + c) factor
        let a,b; do{ a=R.pick([-3,-2,-1,1,2,3,4]); b=R.pick([-3,-2,-1,1,2,3,4]); }while(a===b);
        const m=R.int(2,5), k=R.int(2,4), n=R.int(1,3), c=R.int(1,9), L=Math.max(0,-a,-b);
        const sa=sh(a), sb=sh(b), xn=pw("x",n);
        const topT=`(${sa})^{${m}}\\sqrt{x^2+${c}}`, botT=`(${sb})^{${k}}${xn}`, Y=`\\frac{${topT}}{${botT}}`;
        const lnC=`${m}\\ln(${sa}) + \\frac{1}{2}\\ln(x^2+${c}) - ${k}\\ln(${sb}) - ${co(n)}\\ln(x)`;
        const dC=`\\frac{${m}}{${sa}} + \\frac{x}{x^2+${c}} - \\frac{${k}}{${sb}} - \\frac{${n}}{x}`;
        const B1=`$\\ln(y) = \\ln\\left(${topT}\\right) - \\ln\\left(${botT}\\right)$`, B2=`$\\ln(y) = ${lnC}$`, B3=`$\\frac{1}{y}y' = ${dC}$`, B4=`$y' = y\\left(${dC}\\right)$`, B5=`$y' = ${Y}\\left(${dC}\\right)$`;
        const e=R.pick(["b1","b2","b3","b4","b5","none"]); let lines, first, why;
        if(e==="b1"){ const l2=`${m}\\ln(${sa}) + \\frac{1}{2}\\ln(x^2+${c}) - ${k}\\ln(${sb}) + ${co(n)}\\ln(x)`, d2=`\\frac{${m}}{${sa}} + \\frac{x}{x^2+${c}} - \\frac{${k}}{${sb}} + \\frac{${n}}{x}`;
          lines=[B1,`$\\ln(y) = ${l2}$`,`$\\frac{1}{y}y' = ${d2}$`,`$y' = y\\left(${d2}\\right)$`,`$y' = ${Y}\\left(${d2}\\right)$`]; first=2; why=`the minus sign in front of $\\ln\\left(${botT}\\right)$ applies to every term from the bottom: $-${k}\\ln(${sb}) - ${co(n)}\\ln(x)$.`; }
        else if(e==="b2"){ const l2=`${m}\\ln(${sa}) + 2\\ln(x^2+${c}) - ${k}\\ln(${sb}) - ${co(n)}\\ln(x)`, d2=`\\frac{${m}}{${sa}} + \\frac{4x}{x^2+${c}} - \\frac{${k}}{${sb}} - \\frac{${n}}{x}`;
          lines=[B1,`$\\ln(y) = ${l2}$`,`$\\frac{1}{y}y' = ${d2}$`,`$y' = y\\left(${d2}\\right)$`,`$y' = ${Y}\\left(${d2}\\right)$`]; first=2; why=`$\\sqrt{x^2+${c}} = (x^2+${c})^{1/2}$, so the power property gives $\\frac{1}{2}\\ln(x^2+${c})$, not $2\\ln(x^2+${c})$.`; }
        else if(e==="b3"){ const d2=`\\frac{${m}}{${sa}} + \\frac{1}{2(x^2+${c})} - \\frac{${k}}{${sb}} - \\frac{${n}}{x}`;
          lines=[B1,B2,`$\\frac{1}{y}y' = ${d2}$`,`$y' = y\\left(${d2}\\right)$`,`$y' = ${Y}\\left(${d2}\\right)$`]; first=3; why=`the chain rule is missing: $\\frac{d}{dx}\\frac{1}{2}\\ln(x^2+${c}) = \\frac{1}{2}\\cdot\\frac{2x}{x^2+${c}} = \\frac{x}{x^2+${c}}$.`; }
        else if(e==="b4"){ lines=[B1,B2,B3,`$y' = ${dC}$`]; first=4; why="to get $y'$ alone, multiply both sides by $y$. The factor $y$ was dropped."; }
        else if(e==="b5"){ lines=[B1,B2,B3,B4,`$${Y}\\left(${dC}\\right)$`]; first=5; why="the last line is only an expression. It must say what it equals: $y' = \\ldots$."; }
        else { lines=[B1,B2,B3,B4,B5]; first=0; }
        return {prompt:`A student finds $y'$ for $y = ${Y}$, $x > ${L}$:${listLines(lines)}Select the first line that has a mistake.`,
          parts:[{answer:mkMC(lines.length,first)}],
          hint:"Check the signs when the log of the bottom is subtracted, the power on the square root, the chain rule on $\\ln(x^2 + c)$, and the notation on the last line.",
          steps:first===0?["Line (2): top terms are added, bottom terms are subtracted, and $\\sqrt{x^2+c}$ gives $\\frac{1}{2}\\ln(x^2+c)$.","Line (3) differentiates each term, with the chain rule on $\\ln(x^2+c)$. Lines (4) and (5) multiply by $y$ and substitute it back.","There is no mistake."]:[`Line (${first}) is the first mistake: ${why}`,`The correct work is ${[B1,B2,B3,B4,B5].join(", ")}.`],
          answerTeX:first===0?"There is no mistake":`Line (${first})`};
      }}
  ],
  exam:[
    {id:"L17.q1", ref:"p. 1", q:"$\\frac{d}{dx}(\\arcsin(x)) =$", opts:[
      ["$\\frac{1}{\\sqrt{1-x^2}}$",1,"From $\\sin(\\arcsin(x)) = x$, the chain rule and the triangle (p. 1)."],
      ["$-\\frac{1}{\\sqrt{1-x^2}}$",0,"That is the derivative of $\\arccos(x)$. $\\arcsin$ is increasing, so its derivative is positive."],
      ["$\\frac{1}{1+x^2}$",0,"That is the derivative of $\\arctan(x)$."],
      ["$\\frac{1}{\\cos(x)}$",0,"Close to the step $\\frac{1}{\\cos(\\arcsin(x))}$, but the cosine is of $\\arcsin(x)$, not of $x$."],
      ["$\\cos(\\arcsin(x))$",0,"That is the factor in equation (2.1). You divide by it, you don't multiply."]]},
    {id:"L17.q2", ref:"p. 1", q:"True or false: taking $\\frac{d}{dx}$ of both sides of $\\sin(\\arcsin(x)) = x$ gives $\\cos(\\arcsin(x))\\cdot\\frac{d}{dx}\\arcsin(x) = 1$.", opts:[
      ["True",1,"Chain rule on the left (outside $\\sin$, inside $\\arcsin(x)$), and $\\frac{d}{dx}x = 1$ on the right. This is equation (2.1)."],
      ["False",0,"It is exactly equation (2.1) on p. 1."]]},
    {id:"L17.q3", ref:"p. 1", q:"Let $\\theta = \\arctan(x)$. Using a right triangle, $\\cos(\\arctan(x))$ equals", opts:[
      ["$\\frac{1}{\\sqrt{1+x^2}}$",1,"$\\tan(\\theta) = \\frac{x}{1}$: opposite $x$, adjacent 1, hypotenuse $\\sqrt{1+x^2}$. Cosine is adjacent over hypotenuse."],
      ["$\\sqrt{1-x^2}$",0,"That is $\\cos(\\arcsin(x))$. For $\\arctan$ the 1 is the adjacent side, not the hypotenuse."],
      ["$\\frac{x}{\\sqrt{1+x^2}}$",0,"That is opposite over hypotenuse, so it is $\\sin(\\arctan(x))$."],
      ["$\\sqrt{1+x^2}$",0,"That is hypotenuse over adjacent, so it is $\\sec(\\arctan(x))$."]]},
    {id:"L17.q4", ref:"p. 2", multi:true, q:"Select all functions where neither the power rule nor the exponential rule applies, so you need logarithmic differentiation.", opts:[
      ["$x^{\\sin(x)}$, $x > 0$",1,"The base $x$ and the exponent $\\sin(x)$ both change."],
      ["$(\\cos(x))^{x}$, $0 < x < \\frac{\\pi}{2}$",1,"Both the base and the exponent change."],
      ["$x^{\\pi}$",0,"$\\pi$ is a constant exponent: power rule, $\\pi x^{\\pi-1}$."],
      ["$\\pi^{x}$",0,"$\\pi$ is a constant base: exponential rule, $\\pi^x\\ln(\\pi)$."],
      ["$(x+1)^{x}$, $x > -1$",1,"Both the base and the exponent change."],
      ["$e^{x^2}$",0,"The base $e$ is a constant. The chain rule gives $2xe^{x^2}$."]]},
    {id:"L17.q5", ref:"p. 2", q:"Let $y = x^{\\tan(x)}$, $0 < x < \\frac{\\pi}{2}$. After taking ln of both sides and simplifying, you get", opts:[
      ["$\\ln(y) = \\tan(x)\\ln(x)$",1,"Power property: $\\ln(a^b) = b\\ln(a)$."],
      ["$\\ln(y) = (\\ln(x))^{\\tan(x)}$",0,"The exponent comes down in front. It does not stay as an exponent on the log."],
      ["$\\ln(y) = \\ln(\\tan(x))\\ln(x)$",0,"No log is taken of the exponent. It just moves to the front."],
      ["$\\ln(y) = \\tan(x) + \\ln(x)$",0,"$\\ln(a^b) = b\\ln(a)$ is a product, not a sum."]]},
    {id:"L17.q6", ref:"p. 2", q:"$y$ is a function of $x$. Then $\\frac{d}{dx}\\ln(y) =$", opts:[
      ["$\\frac{1}{y}y'$",1,"Chain rule: the derivative of $\\ln$ is $\\frac{1}{y}$, times the derivative of the inside, $y'$."],
      ["$\\frac{1}{y}$",0,"Missing the $y'$. That would be the derivative with respect to $y$."],
      ["$\\frac{1}{x}$",0,"The inside is $y$, not $x$."],
      ["$\\ln(y')$",0,"The derivative of a log is not the log of a derivative."]]},
    {id:"L17.q7", ref:"p. 2", q:"A student finds the derivative of $y = x^{e^{x}}$, $x > 0$:<div>(1)&nbsp; $\\ln(y) = e^{x}\\ln(x)$</div><div>(2)&nbsp; $\\frac{1}{y}y' = e^{x}\\cdot\\frac{1}{x}$</div><div>(3)&nbsp; $y' = y\\cdot\\frac{e^{x}}{x}$</div><div>(4)&nbsp; $y' = x^{e^{x}}\\cdot\\frac{e^{x}}{x}$</div>Select the first line that has a mistake.", opts:[
      ["Line (1)",0,"Correct: power property of logs."],
      ["Line (2)",1,"$e^{x}\\ln(x)$ is a product, so it needs the product rule: $e^{x}\\ln(x) + \\frac{e^{x}}{x}$."],
      ["Line (3)",0,"Multiplying by $y$ is the right move. The error came earlier."],
      ["Line (4)",0,"Substituting $y$ is right. The error came earlier."],
      ["There is no mistake",0,"The correct answer is $y' = x^{e^{x}}\\left(e^{x}\\ln(x) + \\frac{e^{x}}{x}\\right)$."]]},
    {id:"L17.q8", ref:"p. 2", q:"A student starts with $y = x^{\\sin(x)}$, $x > 0$, and writes $\\frac{y'}{y} = \\sin(x)\\ln(x)$. What went wrong?", opts:[
      ["The left side was differentiated but the right side was not",1,"$\\frac{y'}{y}$ is the derivative of $\\ln(y)$, but $\\sin(x)\\ln(x)$ is $\\ln(x^{\\sin(x)})$ before differentiating. Do the same operation to both sides (the warning on p. 2)."],
      ["ln should not be taken of $x^{\\sin(x)}$",0,"Taking ln of both sides is the right first step."],
      ["The power rule should have been used",0,"The exponent is not a constant, so the power rule does not apply."],
      ["Nothing is wrong",0,"Differentiating both sides gives $\\frac{y'}{y} = \\cos(x)\\ln(x) + \\frac{\\sin(x)}{x}$."]]},
    {id:"L17.q9", ref:"p. 3", multi:true, q:"Let $y = \\frac{x^3\\sqrt{x+1}}{(x+2)^5}$, $x > 0$. Select all the correct lines.", opts:[
      ["$\\ln(y) = 3\\ln(x) + \\frac{1}{2}\\ln(x+1) - 5\\ln(x+2)$",1,"Product, quotient and power properties, with $\\sqrt{x+1} = (x+1)^{1/2}$."],
      ["$\\ln(y) = 3\\ln(x) + \\frac{1}{2}\\ln(x+1) + 5\\ln(x+2)$",0,"The bottom factor is subtracted."],
      ["$\\frac{1}{y}y' = \\frac{3}{x} + \\frac{1}{2(x+1)} - \\frac{5}{x+2}$",1,"Differentiate each term of the line above."],
      ["$\\frac{1}{y}y' = \\frac{3}{x} + \\frac{2}{x+1} - \\frac{5}{x+2}$",0,"$\\frac{d}{dx}\\frac{1}{2}\\ln(x+1) = \\frac{1}{2(x+1)}$, not $\\frac{2}{x+1}$."],
      ["$\\ln(y) = \\frac{3\\ln(x) + \\frac{1}{2}\\ln(x+1)}{5\\ln(x+2)}$",0,"The log of a quotient is a difference of logs, not a quotient of logs."]]},
    {id:"L17.q10", ref:"p. 2", q:"Three students find $\\frac{d}{dx}x^{x}$ for $x > 0$.<br>A: $x\\cdot x^{x-1}$<br>B: $x^{x}\\ln(x)$<br>C: $x^{x}(\\ln(x) + 1)$<br>Which is correct?", opts:[
      ["C",1,"$\\ln(y) = x\\ln(x)$, so $\\frac{1}{y}y' = \\ln(x) + 1$ and $y' = x^{x}(\\ln(x) + 1)$."],
      ["A",0,"That is the power rule, which needs a constant exponent."],
      ["B",0,"That is the exponential rule, which needs a constant base."],
      ["None of them",0,"C is correct."]]},
    {id:"L17.q11", ref:"p. 2", q:"Which final answer for $y = (\\sin(x))^{x}$, $0 < x < \\pi$, is fully correct and written properly?", opts:[
      ["$y' = (\\sin(x))^{x}\\left(\\ln(\\sin(x)) + x\\cot(x)\\right)$",1,"$\\ln(y) = x\\ln(\\sin(x))$, so $\\frac{1}{y}y' = \\ln(\\sin(x)) + x\\cdot\\frac{\\cos(x)}{\\sin(x)}$. Multiply by $y$."],
      ["$y' = (\\sin(x))^{x}\\ln(\\sin(x)) + x\\cot(x)$",0,"Brackets are missing: $(\\sin(x))^{x}$ multiplies both terms."],
      ["$(\\sin(x))^{x}\\left(\\ln(\\sin(x)) + x\\cot(x)\\right)$",0,"Right expression, but it does not say what it equals. Write $y' =$."],
      ["$y' = x(\\sin(x))^{x-1}\\cos(x)$",0,"That is the power rule, which does not apply when the exponent changes."]]},
    {id:"L17.q12", ref:"p. 2", q:"True or false: to differentiate $g(x) = 2^x$ you need logarithmic differentiation.", opts:[
      ["False",1,"The base 2 is a constant, so $g$ is an exponential function: $g'(x) = 2^x\\ln(2)$."],
      ["True",0,"Logarithmic differentiation would work, but it is not needed. The exponential rule applies."]]}
  ],
  steps:[
    {type:"read", title:"Derivatives of inverse functions: the idea", body:`<p>You already know how to differentiate $\\sin(x)$. This section shows how to get the derivative of its inverse, $\\arcsin(x)$, from that. The same idea works for other inverse functions.</p><p>Start from the cancellation property. Doing $\\arcsin$ and then $\\sin$ gets you back to $x$:</p>$$\\sin(\\arcsin(x)) = x \\quad\\text{for } -1 < x < 1.$$<p>Both sides are the same function of $x$, so their derivatives are equal. The left side is a composition, so the chain rule gives the derivative of the outside ($\\cos$), evaluated at the inside, times the derivative of the inside:</p><div class="box"><b class="t">Equation (2.1), p. 1</b>$$\\cos(\\arcsin(x))\\cdot\\frac{d}{dx}\\arcsin(x) = 1$$</div><p>Now $\\frac{d}{dx}\\arcsin(x)$ is the only unknown. To solve for it you divide by $\\cos(\\arcsin(x))$, but first you write that in terms of $x$. A right triangle does it.</p>`, ref:"p. 1"},
    {type:"example", title:"Show that $\\frac{d}{dx}(\\arcsin(x)) = \\frac{1}{\\sqrt{1-x^2}}$", ex:{q:"Use the fact that $\\arcsin(x)$ is the principal inverse of $\\sin(x)$ to show that $\\frac{d}{dx}(\\arcsin(x)) = \\frac{1}{\\sqrt{1-x^2}}$.", ref:"p. 1",
      steps:[{t:"$\\sin(\\arcsin(x)) = x$ for $-1 < x < 1$",why:"Cancellation property."},
        {t:"$\\cos(\\arcsin(x))\\cdot\\frac{d}{dx}\\arcsin(x) = 1 \\qquad (2.1)$",why:"Take the derivative of both sides: chain rule on the left, $\\frac{d}{dx}x = 1$ on the right."},
        {t:"Let $\\theta = \\arcsin(x)$. Then $\\sin(\\theta) = x$.",why:"Definition of inverses. Draw a right triangle with angle $\\theta$, hypotenuse 1 and opposite side $x$, so $\\sin(\\theta) = \\frac{x}{1}$. Call the adjacent side $a$."},
        {t:"$1^2 = a^2 + x^2$, so $1 - x^2 = a^2$",why:"Pythagoras."},
        {t:"$\\sqrt{1-x^2} = |a|$, and $\\sqrt{1-x^2} = a$ since $-\\frac{\\pi}{2} < \\theta < \\frac{\\pi}{2}$",why:"A square root gives $|a|$. For angles between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$ the cosine is positive, so the adjacent side $a$ is positive."},
        {t:"$\\cos(\\arcsin(x)) = \\frac{a}{h} = \\frac{\\sqrt{1-x^2}}{1} = \\sqrt{1-x^2}$",why:"Cosine is adjacent over hypotenuse. The notes write $h$ for the hypotenuse, which is 1 here."},
        {t:"$\\sqrt{1-x^2}\\cdot\\frac{d}{dx}\\arcsin(x) = 1$",why:"Substitute into equation (2.1)."},
        {t:"$\\frac{d}{dx}\\arcsin(x) = \\frac{1}{\\sqrt{1-x^2}}$",why:"Divide. $\\sqrt{1-x^2} \\neq 0$ because $-1 < x < 1$."}],
      ans:"$\\frac{d}{dx}(\\arcsin(x)) = \\frac{1}{\\sqrt{1-x^2}}$"}},
    {type:"explore", title:"Mirror slopes and the triangle", fig:"arcsin", body:`<p>The graph of $\\arcsin$ is the graph of $\\sin$ (on $-\\frac{\\pi}{2} \\le x \\le \\frac{\\pi}{2}$) flipped over the line $y = x$. Flipping swaps rise and run, so the slopes at mirror points are reciprocals. That is what equation (2.1) says.</p><p><b>Try it.</b> Drag the point on $\\arcsin$ to $x = 0.5$. The slope of $\\sin$ at the mirror point is $\\cos(\\theta) \\approx 0.866$, the slope of $\\arcsin$ is about $1.155$, and their product is 1. Check that $\\frac{1}{\\sqrt{1 - 0.25}} \\approx 1.155$. Then drag toward $x = 0.95$: the triangle gets thin, $\\sqrt{1-x^2}$ gets close to 0, and the arcsin tangent gets steep. Try a negative $x$ too: the side $x$ points down, but $a$ stays positive.</p>`, ref:"p. 1"},
    {type:"mcq", title:"Check yourself: the sign of $a$", q:"In the triangle step, $\\sqrt{1-x^2} = |a|$. Why do the notes take $a = \\sqrt{1-x^2}$ and not $-\\sqrt{1-x^2}$?", opts:[
      ["Because $\\theta = \\arcsin(x)$ is between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$, where $\\cos(\\theta) > 0$",true,"Right. The adjacent side $a$ has the same sign as $\\cos(\\theta)$, and cosine is positive on that interval."],
      ["Because $x$ is always positive",false,"$x$ can be any number in $(-1, 1)$, including negatives. The sign of $a$ comes from the range of $\\theta$."],
      ["Because the hypotenuse is 1",false,"The hypotenuse is always positive, but that says nothing about the sign of the adjacent side."],
      ["It does not matter, both signs give the same derivative",false,"With $-\\sqrt{1-x^2}$ you would get a negative derivative, but $\\arcsin$ is increasing."]],
      after:"The sign always comes from the range of the inverse function. For $\\arccos$, $0 \\le \\theta \\le \\pi$, so there $\\sin(\\theta) \\ge 0$."},
    {type:"try", title:"Your turn: the triangle step", gen:"L17.g.triangle"},
    {type:"try", title:"Your turn: derivative of an inverse function", gen:"L17.g.inverse"},
    {type:"read", title:"Power, exponential, or neither", body:`<p>These three functions look alike but need different rules (p. 2):</p><ul><li>$f(x) = x^n$ is a power function. The base changes and the exponent is a constant: $f'(x) = nx^{n-1}$.</li><li>$g(x) = a^x$, $a > 0$, is an exponential function. The base is a constant and the exponent changes: $g'(x) = a^x\\ln(a)$.</li><li>$h(x) = x^x$, $x > 0$, is neither. The exponent is not a constant, so it is not a power function. The base is not a constant, so it is not an exponential function.</li></ul><p>So you need a new method for a non-constant function to the power of another non-constant function.</p><div class="box def"><b class="t">Logarithmic differentiation (p. 2)</b>A combination of implicit differentiation and properties of logarithms.</div><p>The quick test: is the base a constant? Is the exponent a constant? If both answers are no, use logarithmic differentiation.</p>`, ref:"p. 2"},
    {type:"explore", title:"What goes wrong with the old rules", fig:"rules", body:`<p>The solid tangent uses the slope from logarithmic differentiation. The dashed and dotted lines are what you get if you force the power rule or the exponential rule onto $x^x$. Neither one touches the curve the right way.</p><p><b>Try it.</b> Put the point at $x = 1$ on $y = x^x$. The true slope is $1^1(\\ln(1) + 1) = 1$, the power rule gives 1 and the exponential rule gives 0, so the power rule looks right there by luck. Now move to $x = 1.5$: the dashed line is clearly off. Look at the last line of the readout: the two wrong slopes add up to the true slope. Logarithmic differentiation picks up both pieces at once. Then switch to $x^{\\cos(x)}$, the example on p. 2.</p>`, ref:"p. 2"},
    {type:"read", title:"The steps of logarithmic differentiation", body:`<p>Every problem follows the same five steps (p. 2):</p><ol><li>Let statement: $y = $ the function.</li><li>Take ln of both sides.</li><li>Simplify with log properties. The power property $\\log_a(x^y) = y\\log_a(x)$ brings the exponent down in front.</li><li>Take the derivative of both sides with respect to $x$. $y$ is a function of $x$, so the left side is $\\frac{d}{dx}\\ln(y) = \\frac{1}{y}y'$. The right side usually needs the product rule.</li><li>Multiply both sides by $y$, then substitute $y$ back in terms of $x$.</li></ol><div class="box warn"><b class="t">Warning (p. 2)</b>Do not skip steps with these! The most common error is not performing the same operation on both sides of the equation.</div><p>On the midterm, write the words too: "Let $y = \\ldots$", "Taking ln of both sides". The long-answer marks are for the steps and the notation, not only the final line.</p>`, ref:"p. 2"},
    {type:"example", title:"Find $f'(x)$ for $f(x) = x^{\\cos(x)}$", ex:{q:"Let $f(x) = x^{\\cos(x)}$, $x > 0$. Find $f'(x)$.", ref:"p. 2",
      steps:[{t:"Let $y = x^{\\cos(x)}$.",why:"The key first step is a let statement."},
        {t:"$\\ln(y) = \\ln(x^{\\cos(x)})$",why:"Take ln of both sides. Same operation on both sides."},
        {t:"$\\ln(y) = \\cos(x)\\ln(x)$",why:"Power property: the exponent $\\cos(x)$ comes down in front."},
        {t:"$\\frac{1}{y}y' = -\\sin(x)\\ln(x) + \\frac{\\cos(x)}{x}$",why:"Differentiate both sides with respect to $x$. Left: chain rule, since $y$ is a function of $x$. Right: product rule, $(-\\sin(x))\\ln(x) + \\cos(x)\\cdot\\frac{1}{x}$."},
        {t:"$y' = y\\left(-\\sin(x)\\ln(x) + \\frac{\\cos(x)}{x}\\right)$",why:"Multiply both sides by $y$. The bracket keeps the whole sum multiplied."},
        {t:"$y' = x^{\\cos(x)}\\left(-\\sin(x)\\ln(x) + \\frac{\\cos(x)}{x}\\right)$",why:"Substitute $y = x^{\\cos(x)}$. The question asked for $f'(x)$, so you can write $f'(x) = \\ldots$ here."}],
      ans:"$f'(x) = x^{\\cos(x)}\\left(-\\sin(x)\\ln(x) + \\frac{\\cos(x)}{x}\\right)$"}},
    {type:"mcq", title:"The exercise on p. 2", q:"A student starts with $y = x^{\\cos(x)}$, $x > 0$, and writes $\\frac{y'}{y} = \\cos(x)\\ln(x)$. These are not equal. What is the mistake?", opts:[
      ["The left side was differentiated but the right side was not",true,"$\\frac{y'}{y}$ is the derivative of $\\ln(y)$, but $\\cos(x)\\ln(x)$ is just $\\ln(x^{\\cos(x)})$. Different operations were done to the two sides."],
      ["ln was taken of the wrong side",false,"Taking ln of both sides is the right first step. The problem is what happened next."],
      ["$\\ln(x^{\\cos(x)})$ should be $(\\ln(x))^{\\cos(x)}$",false,"$\\ln(x^{\\cos(x)}) = \\cos(x)\\ln(x)$ is correct."],
      ["The student should have used the exponential rule",false,"The base $x$ is not a constant, so the exponential rule does not apply."]],
      after:"Correct line: $\\frac{y'}{y} = -\\sin(x)\\ln(x) + \\frac{\\cos(x)}{x}$. This is the warning on p. 2 in action."},
    {type:"try", title:"Your turn: a function to the power of a function, midterm Q13(c) style", gen:"L17.g.power", diff:2},
    {type:"example", title:"A long quotient: let logs do the work", ex:{q:"Let $y = \\frac{x^2(x-1)^3\\sqrt{x+3}}{(x+1)^2(x+2)^4}$, $x > 1$. Find $y'$.", ref:"p. 3",
      steps:[{t:"$\\ln(y) = \\ln\\left(\\frac{x^2(x-1)^3\\sqrt{x+3}}{(x+1)^2(x+2)^4}\\right)$",why:"You could use the quotient, product and chain rules, but logs are much shorter. Take ln of both sides. $x > 1$ keeps every factor positive."},
        {t:"$\\ln(y) = 2\\ln(x) + 3\\ln(x-1) + \\frac{1}{2}\\ln(x+3) - 2\\ln(x+1) - 4\\ln(x+2)$",why:"Product property: each factor on top becomes a $+$ term. Quotient property: each factor on the bottom becomes a $-$ term. Power property: each power moves to the front, and $\\sqrt{x+3} = (x+3)^{1/2}$."},
        {t:"$\\frac{1}{y}y' = \\frac{2}{x} + \\frac{3}{x-1} + \\frac{1}{2(x+3)} - \\frac{2}{x+1} - \\frac{4}{x+2}$",why:"Differentiate both sides. Each $k\\ln(x+a)$ gives $\\frac{k}{x+a}$."},
        {t:"$y' = y\\left(\\frac{2}{x} + \\frac{3}{x-1} + \\frac{1}{2(x+3)} - \\frac{2}{x+1} - \\frac{4}{x+2}\\right)$",why:"Multiply both sides by $y$."},
        {t:"$y' = \\frac{x^2(x-1)^3\\sqrt{x+3}}{(x+1)^2(x+2)^4}\\cdot\\left(\\frac{2}{x} + \\frac{3}{x-1} + \\frac{1}{2(x+3)} - \\frac{2}{x+1} - \\frac{4}{x+2}\\right)$",why:"Substitute $y$ back. No need to simplify further."}],
      ans:"$y' = \\frac{x^2(x-1)^3\\sqrt{x+3}}{(x+1)^2(x+2)^4}\\cdot\\left(\\frac{2}{x} + \\frac{3}{x-1} + \\frac{1}{2(x+3)} - \\frac{2}{x+1} - \\frac{4}{x+2}\\right)$"}},
    {type:"explore", title:"One term per factor", fig:"factors", body:`<p>The log of a product is a sum of logs. So $\\ln(y)$ is a sum of simple curves, one per factor, and its slope is a sum of simple fractions. The slope of $\\ln(y)$ is $\\frac{1}{y}y'$. Multiply by $y$ to get $y'$.</p><p><b>Try it.</b> Leave $p = 2$, $q = 3$, $r = 4$ and drag the point to $x = 2$. The slope of $\\ln(y)$ is $\\frac{2}{2} + \\frac{3}{1} - \\frac{4}{4} = 3$. Set $p = 0.5$: the factor becomes $\\sqrt{x}$ and its term becomes $\\frac{1}{2}\\ln(x)$, with derivative $\\frac{1}{2x}$, like $\\sqrt{x+3}$ in the example. Then raise $r$ and watch the bottom term pull $\\ln(y)$ down.</p>`, ref:"p. 3"},
    {type:"try", title:"Your turn: a product or quotient", gen:"L17.g.prodquot"},
    {type:"formulas", title:"Lecture 17 formulas"}
  ]
});
})();
