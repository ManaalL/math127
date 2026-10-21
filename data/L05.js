/* Lecture 5 (Fri Sept 18): Antiderivatives and indefinite integrals (1.2.2), solving dy/dx = f(x) (start of 1.2.3). Notes: 5 pages. */
(function(){
const M=M127;
const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; };
const Q=(n,d=1)=>{ if(d<0){ n=-n; d=-d; } const g=gcd(n,d); return {n:n/g,d:d/g}; };
const qmul=(a,b)=>Q(a.n*b.n,a.d*b.d), qadd=(a,b)=>Q(a.n*b.d+b.n*a.d,a.d*b.d);
const qtex=q=>M.frac(q.n,q.d);
/* powers and terms: c and e are fractions {n,d} */
const pT=(v,e)=>e.d===1?(e.n===1?v:`${v}^{${e.n}}`):`${v}^{${e.n}/${e.d}}`;
const pA=(v,e)=>e.d===1?`${v}^(${e.n})`:`${v}^(${e.n}/${e.d})`;
const tT=(c,v,e,first)=>{ if(c.n===0) return ""; const s=c.n<0?"-":(first?"":"+"); const ab=Q(Math.abs(c.n),c.d); if(e.n===0) return s+qtex(ab); return s+(ab.n===1&&ab.d===1?"":qtex(ab))+pT(v,e); };
const tA=(c,v,e)=>e.n===0?`(${c.n}/${c.d})`:`(${c.n}/${c.d})*${pA(v,e)}`;
const sumT=(L,v)=>{ let s="",first=true; for(const [c,e] of L){ const x=tT(c,v,e,first); if(x){ s+=x; first=false; } } return s||"0"; };
const sumA=(L,v)=>L.filter(([c])=>c.n!==0).map(([c,e])=>tA(c,v,e)).join(" + ")||"0";
const anti=([c,e])=>[qmul(c,Q(e.d,e.n+e.d)),Q(e.n+e.d,e.d)];               // power rule, e != -1
const cf=(c,body)=>c===1?body:c===-1?`-${body}`:`${c}${body}`;              // coefficient in front of a function
const sg=(s,first)=>first||s.startsWith("-")?s:"+"+s;
const lineOpts=k=>Array.from({length:k},(_,i)=>`The first line with a mistake is (${i+1}).`);

/* atoms for the table of integrals: integrand and antiderivative, as TeX and ascii */
const ATOM={
  exp:(c,v)=>({t:cf(c,`e^{${v}}`), a:`${c}*e^(${v})`, Ft:cf(c,`e^{${v}}`), Fa:`${c}*e^(${v})`, why:`$\\int e^{${v}}\\,d${v} = e^{${v}}$`}),
  sin:(c,v)=>({t:cf(c,`\\sin(${v})`), a:`${c}*sin(${v})`, Ft:cf(-c,`\\cos(${v})`), Fa:`${-c}*cos(${v})`, why:`$\\int\\sin(${v})\\,d${v} = -\\cos(${v})$`}),
  cos:(c,v)=>({t:cf(c,`\\cos(${v})`), a:`${c}*cos(${v})`, Ft:cf(c,`\\sin(${v})`), Fa:`${c}*sin(${v})`, why:`$\\int\\cos(${v})\\,d${v} = \\sin(${v})$`}),
  con:(c,v)=>({t:String(c), a:`${c}`, Ft:cf(c,v), Fa:`${c}*${v}`, why:`$\\frac{d}{d${v}}(${cf(c,v)}) = ${c}$`}),
  pow:(c,v,n)=>({t:cf(c,`${v}^{${n}}`), a:`${c}*${v}^${n}`, Ft:tT(Q(c,n+1),v,Q(n+1),true), Fa:`(${c}/${n+1})*${v}^${n+1}`, why:`the power rule with $n = ${n}$`}),
  inv:(c,v,n)=>({t:`\\frac{${c}}{${v}^{${n}}}`.replace(/\\frac\{-/,"-\\frac{"), a:`${c}/${v}^${n}`, Ft:tT(Q(c,1-n),v,Q(1-n),true), Fa:tA(Q(c,1-n),v,Q(1-n)), why:`$\\frac{1}{${v}^{${n}}} = ${v}^{-${n}}$ and the power rule`})
};

M127.lecture({
  id:"L05", n:5, date:"2026-09-18", added:"2026-10-21", unit:"u2", quiz:"Q3",
  title:"Antiderivatives and Indefinite Integrals", sections:["1.2.2","1.2.3"], pages:5,
  summary:"An antiderivative undoes a derivative. The indefinite integral $\\int f(x)\\,dx = F(x) + C$ is the whole family of antiderivatives. You get them from a short table, two rules, and some algebra first, and they solve differential equations like $\\frac{dy}{dx} = 2x$.",
  flags:[],
  formulas:[
    {id:"L05.f.def", name:"Antiderivative", tex:"F'(x) = f(x) \\;\\Rightarrow\\; F \\text{ is an antiderivative of } f", ref:"p. 1", blank:{tex:"F \\text{ is an antiderivative of } f \\text{ if } \\boxed{\\,?\\,}", text:true, accept:["F'(x)=f(x)","F'(x) = f(x)","F'=f","F' = f"]}},
    {id:"L05.f.family", name:"Antiderivatives of $4x^3$", tex:"F(x) = x^4 + C", note:"For any real number $C$. Examples: $x^4 + \\sqrt2$, $x^4 - 17$.", ref:"p. 1", blank:{tex:"\\text{antiderivatives of } 4x^3:\\ F(x) = \\boxed{\\,?\\,} + C", answer:"x^4", vars:["x"]}},
    {id:"L05.f.indef", name:"Indefinite integral", tex:"\\int f(x)\\,dx = F(x) + C", note:"$F$ is any antiderivative of $f$ and $C$ is any real number. This is the collection of all antiderivatives.", ref:"p. 2", blank:{tex:"\\int f(x)\\,dx = F(x) + \\boxed{\\,?\\,}", text:true, accept:["C","c"]}},
    {id:"L05.f.defvsindef", name:"Definite vs indefinite", tex:"\\int_a^b f(x)\\,dx \\text{ is a number;} \\quad \\int f(x)\\,dx \\text{ is a collection of functions}", note:"The number is a net change, an area under a graph, or an infinite sum of differentials.", ref:"p. 2", blank:{tex:"\\int f(x)\\,dx \\text{ is a } \\boxed{\\,?\\,}", text:true, accept:["collection of functions","family of functions","set of functions","collection of all antiderivatives"]}},
    {id:"L05.f.zero", name:"Integral of 0", tex:"\\int 0\\,dx = C", ref:"p. 3", blank:{tex:"\\int 0\\,dx = \\boxed{\\,?\\,}", text:true, accept:["C","c"]}},
    {id:"L05.f.power", name:"Power rule for integrals", tex:"\\int x^n\\,dx = \\frac{1}{n+1}x^{n+1} + C", note:"for $n \\neq -1$", ref:"p. 3", blank:{tex:"\\int x^n\\,dx = \\boxed{\\,?\\,} + C", answer:"x^(n+1)/(n+1)", vars:["x","n"], domain:[0.5,3]}},
    {id:"L05.f.exp", name:"Integral of $e^x$", tex:"\\int e^x\\,dx = e^x + C", ref:"p. 3", blank:{tex:"\\int e^x\\,dx = \\boxed{\\,?\\,} + C", answer:"e^x", vars:["x"]}},
    {id:"L05.f.cos", name:"Integral of cosine", tex:"\\int \\cos(x)\\,dx = \\sin(x) + C", ref:"p. 3", blank:{tex:"\\int \\cos(x)\\,dx = \\boxed{\\,?\\,} + C", answer:"sin(x)", vars:["x"]}},
    {id:"L05.f.sin", name:"Integral of sine", tex:"\\int \\sin(x)\\,dx = -\\cos(x) + C", ref:"p. 3", blank:{tex:"\\int \\sin(x)\\,dx = \\boxed{\\,?\\,} + C", answer:"-cos(x)", vars:["x"]}},
    {id:"L05.f.const", name:"Constant multiple", tex:"\\int kf(x)\\,dx = kF(x) + C", note:"$F$ is an antiderivative of $f$; $k$ is any real number.", ref:"p. 3", blank:{tex:"\\int kf(x)\\,dx = \\boxed{\\,?\\,} + C", text:true, accept:["kF(x)","k F(x)","k*F(x)","kF"]}},
    {id:"L05.f.sum", name:"Sum rule", tex:"\\int \\left(f(x) + g(x)\\right)dx = F(x) + G(x) + C", note:"$F$ and $G$ are antiderivatives of $f$ and $g$.", ref:"p. 3", blank:{tex:"\\int \\left(f(x) + g(x)\\right)dx = \\boxed{\\,?\\,} + C", text:true, accept:["F(x)+G(x)","F(x) + G(x)","F+G","G(x)+F(x)"]}},
    {id:"L05.f.split", name:"Splitting a fraction", tex:"\\frac{a+b}{c} = \\frac{a}{c} + \\frac{b}{c}", note:"Use it when the integrand is a fraction with a sum on top.", ref:"p. 4", blank:{tex:"\\frac{a+b}{c} = \\boxed{\\,?\\,}", answer:"a/c + b/c", vars:["a","b","c"], domain:[1,3]}},
    {id:"L05.f.solve", name:"Solving $\\frac{dy}{dx} = f(x)$", tex:"\\frac{dy}{dx} = f(x) \\;\\Rightarrow\\; y = \\int f(x)\\,dx", note:"This gives all solutions, so the answer has a $+C$.", ref:"p. 4", blank:{tex:"\\frac{dy}{dx} = f(x) \\;\\Rightarrow\\; y = \\boxed{\\,?\\,}", text:true, accept:["∫f(x)dx","∫ f(x) dx","int f(x) dx","integral of f(x) dx","∫f(x) dx","F(x)+C","F(x) + C"]}}
  ],
  glossary:[
    {id:"L05.t.anti", term:"Antiderivative", def:"A function $F$ with $F'(x) = f(x)$. $x^4$ is an antiderivative of $4x^3$. So is $x^4 - 17$.", ref:"p. 1"},
    {id:"L05.t.indef", term:"Indefinite integral", def:"$\\int f(x)\\,dx = F(x) + C$: the collection of all antiderivatives of $f$. Its answer is a family of functions, not a number.", ref:"p. 2"},
    {id:"L05.t.C", term:"The $+C$", def:"Any real number can be added to an antiderivative, since the derivative of a constant is 0. Writing $+C$ says you mean all of them.", ref:"pp. 1 to 2"},
    {id:"L05.t.check", term:"Checking an antiderivative", def:"Differentiate your answer. If you get the integrand back, it is right.", ref:"p. 1"},
    {id:"L05.t.n1", term:"$n \\neq -1$", def:"The power rule $\\int x^n\\,dx = \\frac{1}{n+1}x^{n+1} + C$ would divide by 0 when $n = -1$, so it does not cover $\\int \\frac{1}{x}\\,dx$.", ref:"p. 3"},
    {id:"L05.t.allsol", term:"All solutions of $\\frac{dy}{dx} = f(x)$", def:"Every function whose derivative is $f(x)$: $y = \\int f(x)\\,dx = F(x) + C$.", ref:"p. 4"}
  ],
  figures:{
    fam:{title:"A family of antiderivatives", cap:"<b>Fig. 5.1</b> The curves $y = F(x) + C$ for $C = -3, \\dots, 3$. At the same $x$ every curve has the same slope, $f(x)$, so every one of them is an antiderivative of $f$. The slider picks one value of $C$. (Lecture 5, pp. 1 to 2)",
      build(host,{PLOT}){
        const S={cube:{f:x=>4*x*x*x,F:x=>x*x*x*x,fl:"4x³",Fl:"x⁴",x:[-1.9,1.9],y:[-4.6,9.2],xs:0.5,ys:2,bd:[-1.35,1.35],x0:1},
                 lin:{f:x=>2*x,F:x=>x*x,fl:"2x",Fl:"x²",x:[-3.2,3.2],y:[-4.6,9.2],xs:1,ys:2,bd:[-2.4,2.4],x0:1},
                 cos:{f:Math.cos,F:Math.sin,fl:"cos(x)",Fl:"sin(x)",x:[-3.4,3.4],y:[-4.6,4.6],xs:1,ys:1,bd:[-3.2,3.2],x0:0.8}};
        let key="cube", C=0, x0=1;
        const opt={x:S.cube.x,y:S.cube.y,c:"var(--u2)",xlabel:"x",ylabel:"y",xstep:0.5,ystep:2};
        const G=PLOT.graph(host,opt);
        const Cs=[-3,-2,-1,0,1,2,3];
        const faint=Cs.map(k=>{ const p=G.fn(x=>S[key].F(x)+k); p.style.opacity=".3"; return p; });
        const ticks=Cs.map(()=>G.line(0,0,0,0,{cls:"lt"}));
        const main=G.fn(x=>S[key].F(x)+C,{cls:"cv c"});
        const tan=G.tangent(1,1,4,{cls:"tan dash"});
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Function",items:[["cube","f(x) = 4x³"],["lin","f(x) = 2x"],["cos","f(x) = cos(x)"]],value:"cube",onchange:v=>{ key=v; const s=S[v]; opt.xstep=s.xs; opt.ystep=s.ys; G.setView(s.x,s.y); faint.forEach((p,i)=>p.update(x=>s.F(x)+Cs[i])); x0=s.x0; H.move(x0); draw(); }});
        PLOT.slider(ctl,{label:"Constant C",min:-3,max:3,step:0.5,value:0,fmt:v=>v.toFixed(1),oninput:v=>{ C=v; main.update(x=>S[key].F(x)+C); H.move(x0); draw(); }});
        const ro=PLOT.readout(host);
        const H=G.handle(1,1,{f:x=>S[key].F(x)+C,bounds:[-3.2,3.2],label:"x position",onMove:x=>{ const b=S[key].bd; if(x<b[0]||x>b[1]){ x0=Math.max(b[0],Math.min(b[1],x)); H.move(x0); return; } x0=x; draw(); }});
        function draw(){
          const s=S[key], m=s.f(x0), dx=(s.x[1]-s.x[0])*0.06;
          Cs.forEach((k,i)=>{ const y=s.F(x0)+k; ticks[i].set(x0-dx,y-m*dx,x0+dx,y+m*dx); });
          tan.at(x0,s.F(x0)+C,m); main.update(x=>s.F(x)+C);
          ro.innerHTML=`F(x) = ${s.Fl} + C with C = <b>${C.toFixed(1)}</b> &nbsp; at x = <b>${x0.toFixed(2)}</b>: slope = f(x) = ${s.fl} = <b>${m.toFixed(3)}</b> on every curve`;
        }
        draw();
      }},
    power:{title:"The power rule, run backwards", cap:"<b>Fig. 5.2</b> $f(x) = x^n$ (dark) and $F(x) = \\frac{1}{n+1}x^{n+1}$ (colour), for $x > 0$. Drag the point along $F$: its tangent slope always equals the height of $f$ at the same $x$. At $n = -1$ the formula would divide by $n + 1 = 0$. (Lecture 5, pp. 2 to 3)",
      build(host,{PLOT}){
        let n=2, x0=1.2;
        const G=PLOT.graph(host,{x:[-0.2,3.2],y:[-2.6,5.2],c:"var(--u2)",xlabel:"x",ylabel:"y",xstep:0.5,ystep:1});
        const fp=(x)=>Math.pow(x,n), Fp=x=>Math.pow(x,n+1)/(n+1);
        const fc=G.fn(x=>x>0?fp(x):NaN,{from:0.02,to:3.2});
        const Fc=G.fn(x=>x>0?Fp(x):NaN,{cls:"cv c",from:0.02,to:3.2});
        const tan=G.tangent(1,1,1,{cls:"tan dash"});
        const vl=G.line(0,0,0,0,{cls:"lt dash"}), dot=G.dot(1,1,{filled:true,r:4});
        const ctl=PLOT.controls(host);
        PLOT.slider(ctl,{label:"Power n",min:-3,max:3,step:0.5,value:n,fmt:v=>v.toFixed(1),oninput:v=>{ n=v; fc.update(x=>x>0?fp(x):NaN,0.02,3.2); if(n!==-1) Fc.update(x=>x>0?Fp(x):NaN,0.02,3.2); H.move(x0); draw(); }});
        const ro=PLOT.readout(host);
        const H=G.handle(x0,Fp(x0),{f:x=>n===-1?0:Fp(x),bounds:[0.3,3],label:"Point on F",onMove:x=>{ x0=x; draw(); }});
        function draw(){
          const bad=n===-1; Fc.style.display=tan.style.display=H.style.display=bad?"none":"";
          vl.set(x0,0,x0,fp(x0)); dot.set(x0,fp(x0));
          if(bad){ ro.innerHTML=`n = <b>−1</b>: not allowed. The formula would need 1/(n + 1) = 1/0. The power rule does not give an antiderivative of 1/x.`; return; }
          const m=Math.pow(x0,n); tan.at(x0,Fp(x0),m);
          const e=+(n+1).toFixed(1);
          ro.innerHTML=`∫ x^${n} dx = x^${e} / ${e} + C &nbsp; at x = <b>${x0.toFixed(2)}</b>: slope of F = <b>${m.toFixed(3)}</b>, height of f = <b>${fp(x0).toFixed(3)}</b>`;
        }
        draw();
      }}
  },
  gens:[
    {id:"L05.g.power", title:"Power rule antiderivatives", skill:"Rewrite as powers of $x$, then integrate term by term with $+C$", ref:"p. 3",
      gen(R,d){
        const FORMS=[
          {e:Q(1,2), t:A=>`${A===1?"":A}\\sqrt{x}`},{e:Q(-1,2), t:A=>`\\frac{${A}}{\\sqrt{x}}`},{e:Q(1,3), t:A=>`${A===1?"":A}\\sqrt[3]{x}`},
          {e:Q(2,3), t:A=>`${A===1?"":A}x^{2/3}`},{e:Q(3,2), t:A=>`${A===1?"":A}x\\sqrt{x}`},{e:Q(-1,3), t:A=>`\\frac{${A}}{\\sqrt[3]{x}}`},
          {e:Q(-2), t:A=>`\\frac{${A}}{x^2}`},{e:Q(-3), t:A=>`\\frac{${A}}{x^3}`},{e:Q(4), t:A=>`${A===1?"":A}x^4`}];
        let terms, itex;
        if(d===1){ const n=R.int(2,5); terms=[[Q(R.nz(-6,6)),Q(n)],[Q(R.nz(-8,8)),Q(1)],[Q(R.int(-9,9)),Q(0)]]; itex=sumT(terms,"x"); }
        else { const pool=d===2?[R.pick([FORMS[6],FORMS[7]]),R.pick([FORMS[0],FORMS[1]])]:R.shuffle(FORMS.slice(0,8)).slice(0,3);
          const cs=pool.map(()=>R.nz(-6,6)); terms=pool.map((f,i)=>[Q(cs[i]),f.e]);
          itex=pool.map((f,i)=>{ const A=Math.abs(cs[i]); const s=f.t(A); return (cs[i]<0?"-":(i?"+":""))+s; }).join(""); }
        const F=terms.map(anti);
        const v="x";
        return {prompt:`Evaluate $\\int \\left(${itex}\\right)dx$.`,
          answer:{answer:sumA(F,v)+" + C", vars:["x"], plusC:true, consts:[], domain:d===1?[-2,2]:[0.3,3]},
          verify:{antideriv:sumA(terms,v)},
          hint:"Write every term as $x^n$ (roots are fractional powers, $\\frac{1}{x^m} = x^{-m}$). Then add 1 to each power and divide by the new power.",
          steps:[d===1?`Each term is already a power of $x$.`:`Rewrite with exponents: $\\int\\left(${sumT(terms,v)}\\right)dx$.`,
            ...terms.filter(([c])=>c.n!==0).map(t=>`$\\int ${tT(t[0],v,t[1],true)}\\,dx = ${tT(anti(t)[0],v,anti(t)[1],true)}$ (power rule with $n = ${qtex(t[1])}$, so $n + 1 = ${qtex(anti(t)[1])}$)`),
            `Add the pieces and write one $+C$: $${sumT(F,v)} + C$.`],
          answerTeX:`$${sumT(F,v)} + C$`};
      }},
    {id:"L05.g.table", title:"Exponentials, sines and cosines", skill:"Use the table of integrals with the constant multiple and sum rules", ref:"p. 3",
      gen(R,d){
        const v=R.pick(["x","t","w"]);
        let keys;
        if(d===1) keys=[R.pick(["exp","sin","cos","sin","cos"])];
        else if(d===2) keys=R.shuffle(["exp","sin","cos","con","pow"]).slice(0,2);
        else keys=[...R.shuffle(["exp","sin","cos"]).slice(0,2),R.pick(["pow","inv"]),"con"];
        const atoms=keys.map(k=>{ const c=R.nz(-6,6); return k==="pow"?ATOM.pow(c,v,R.int(2,4)):k==="inv"?ATOM.inv(Math.abs(c),v,R.int(2,3)):ATOM[k](c,v); });
        const it=atoms.map((a,i)=>sg(a.t,i===0)).join(" "), Ft=atoms.map((a,i)=>sg(a.Ft,i===0)).join(" ");
        const ia=atoms.map(a=>a.a).join(" + "), Fa=atoms.map(a=>a.Fa).join(" + ");
        return {prompt:`Evaluate $\\int ${atoms.length>1?`\\left(${it}\\right)`:it}\\,d${v}$.`,
          answer:{answer:`${Fa} + C`, vars:[v], plusC:true, consts:[], domain:keys.includes("inv")?[0.4,2.5]:[-2,2]},
          verify:{antideriv:ia, v},
          hint:`Split the integral into one piece per term, pull out the constants, and use the table on p. 3. Watch the sign for $\\sin$. The variable is $${v}$.`,
          steps:[...(atoms.length>1?[`Sum rule: integrate each term separately.`]:[]),
            ...atoms.map(a=>`$\\int ${a.t}\\,d${v} = ${a.Ft}$, using ${a.why}.`),
            `So $\\int ${atoms.length>1?`\\left(${it}\\right)`:it}\\,d${v} = ${Ft} + C$.`],
          answerTeX:`$${Ft} + C$`};
      }},
    {id:"L05.g.algebra", title:"Simplify first, then integrate", skill:"Split a fraction, cancel or expand before using the power rule", ref:"pp. 3 to 4",
      gen(R,d){
        const v="x";
        if(d<3){
          let A=R.nz(-6,6), B=R.nz(-6,6), r, p, q, top, itA;
          if(d===1){ r=R.int(1,2); p=r+R.int(1,3); do{ q=r+R.int(0,2); }while(q===p); if(q>p) [p,q]=[q,p]; }
          else { r=R.int(2,3); if(R.int(0,1)===0){ p=r+1; q=0; } else { p=r; q=0; } }
          top=sumT([[Q(A),Q(p)],[Q(B),Q(q)]],v); itA=`(${A}*x^${p} + ${B}*x^${q})/x^${r}`;
          const xr=r===1?"x":`x^{${r}}`;
          const parts=[[Q(A),Q(p-r)],[Q(B),Q(q-r)]];
          const F=parts.map(anti);
          const splitT=`\\frac{${tT(Q(A),v,Q(p),true)}}{${xr}} ${B<0?"-":"+"} \\frac{${tT(Q(Math.abs(B)),v,Q(q),true)}}{${xr}}`;
          return {prompt:`Evaluate $\\int \\frac{${top}}{${xr}}\\,dx$.`,
            answer:{answer:sumA(F,v)+" + C", vars:["x"], plusC:true, consts:[], domain:[0.4,3]}, verify:{antideriv:itA},
            hint:"There is no quotient rule for integrals. Split the fraction with $\\frac{a+b}{c} = \\frac ac + \\frac bc$, simplify each piece to a power of $x$, then integrate.",
            steps:[`Split the fraction: $\\int\\left(${splitT}\\right)dx$`,`Simplify each piece: $\\int\\left(${sumT(parts,v)}\\right)dx$`,`Power rule on each term: $${sumT(F,v)} + C$`],
            answerTeX:`$${sumT(F,v)} + C$`};
        }
        const kind=R.pick(["fact","fact2","sq","root","cube"]);
        if(kind==="fact"||kind==="fact2"){ const k=R.int(1,5), plus=kind==="fact"; const s=plus?"+":"-";
          const F=[[Q(1,2),Q(2)],[Q(plus?-k:k),Q(1)]];
          return {prompt:`Evaluate $\\int \\frac{t^2 - ${k*k}}{t ${s} ${k}}\\,dt$.`,
            answer:{answer:sumA(F,"t")+" + C", vars:["t"], plusC:true, consts:[], domain:plus?[0.3,3]:[k+0.4,k+3]}, verify:{antideriv:`(t^2 - ${k*k})/(t ${s} ${k})`, v:"t"},
            hint:`Factor the top as a difference of squares, $t^2 - ${k*k} = (t - ${k})(t + ${k})$.`,
            steps:[`$\\int \\frac{t^2 - ${k*k}}{t ${s} ${k}}\\,dt = \\int \\frac{(t - ${k})(t + ${k})}{t ${s} ${k}}\\,dt$`,`$= \\int (t ${plus?"-":"+"} ${k})\\,dt$`,`$= \\frac{1}{2}t^2 ${plus?"-":"+"} ${k===1?"":k}t + C$`],
            answerTeX:`$\\frac{1}{2}t^2 ${plus?"-":"+"} ${k===1?"":k}t + C$`}; }
        if(kind==="sq"){ const c=R.nz(-4,4); const T=[[Q(1),Q(4)],[Q(2*c),Q(2)],[Q(c*c),Q(0)]]; const F=T.map(anti);
          return {prompt:`Evaluate $\\int (x^2 ${c<0?"-":"+"} ${Math.abs(c)})^2\\,dx$.`,
            answer:{answer:sumA(F,v)+" + C", vars:["x"], plusC:true, consts:[], domain:[-2,2]}, verify:{antideriv:`(x^2 + ${c})^2`},
            hint:"Expand the square first. $(a+b)^2 = a^2 + 2ab + b^2$.",
            steps:[`Expand: $(x^2 ${c<0?"-":"+"} ${Math.abs(c)})^2 = ${sumT(T,v)}$.`,`$\\int \\left(${sumT(T,v)}\\right)dx = ${sumT(F,v)} + C$`],
            answerTeX:`$${sumT(F,v)} + C$`}; }
        if(kind==="root"){ const b=R.nz(-5,5); const T=[[Q(1),Q(3,2)],[Q(b),Q(-1,2)]]; const F=T.map(anti);
          return {prompt:`Evaluate $\\int \\frac{x^2 ${b<0?"-":"+"} ${Math.abs(b)}}{\\sqrt{x}}\\,dx$.`,
            answer:{answer:sumA(F,v)+" + C", vars:["x"], plusC:true, consts:[], domain:[0.3,3]}, verify:{antideriv:`(x^2 + ${b})/sqrt(x)`},
            hint:"Split the fraction and write $\\sqrt{x} = x^{1/2}$. Dividing by $x^{1/2}$ subtracts $\\frac12$ from each power.",
            steps:[`Split: $\\int\\left(\\frac{x^2}{x^{1/2}} ${b<0?"-":"+"} \\frac{${Math.abs(b)}}{x^{1/2}}\\right)dx = \\int\\left(${sumT(T,v)}\\right)dx$`,`Power rule: $${sumT(F,v)} + C$`],
            answerTeX:`$${sumT(F,v)} + C$`}; }
        const a=R.int(1,4), b=R.nz(-4,4); const T=[[Q(a),Q(2,3)],[Q(b),Q(1,6)]]; const F=T.map(anti);
        return {prompt:`Evaluate $\\int \\frac{${a===1?"":a}x ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}\\sqrt{x}}{\\sqrt[3]{x}}\\,dx$.`,
          answer:{answer:sumA(F,v)+" + C", vars:["x"], plusC:true, consts:[], domain:[0.3,3]}, verify:{antideriv:`(${a}x + ${b}sqrt(x))/x^(1/3)`},
          hint:"Write $\\sqrt{x} = x^{1/2}$ and $\\sqrt[3]{x} = x^{1/3}$, split, and subtract exponents: $\\frac{x^a}{x^b} = x^{a-b}$.",
          steps:[`Rewrite: $\\int\\frac{${a===1?"":a}x ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}x^{1/2}}{x^{1/3}}\\,dx = \\int\\left(${sumT(T,v)}\\right)dx$, since $1 - \\frac13 = \\frac23$ and $\\frac12 - \\frac13 = \\frac16$.`,`Power rule: $${sumT(F,v)} + C$`],
          answerTeX:`$${sumT(F,v)} + C$`};
      }},
    {id:"L05.g.check", title:"Which one is an antiderivative?", skill:"Check a candidate antiderivative by differentiating it", ref:"pp. 1 to 2",
      gen(R,d){
        const K=R.pick(["2e","\\pi","-7","\\sqrt{2}","\\frac{1}{3}","5"]);
        const withK=s=>`${s} ${K.startsWith("-")?"- "+K.slice(1):"+ "+K}`;
        let f, right, dr, wrong;
        if(d===1){ const n=R.int(2,4), k=R.pick([n+1,2*(n+1),3,4,6]); const c=Q(k,n+1);
          f=`${k}x^{${n}}`; right=withK(tT(c,"x",Q(n+1),true)); dr=`$\\frac{d}{dx}\\left(${tT(c,"x",Q(n+1),true)}\\right) = ${qtex(c)}\\cdot ${n+1}x^{${n}} = ${k}x^{${n}}$, and the constant $${K}$ has derivative 0`;
          wrong=[[tT(Q(k*n),"x",Q(n-1),true),"is the derivative of $f$, not an antiderivative"],[`${k}x^{${n+1}}`,`has derivative $${k*(n+1)}x^{${n}}$, so it forgot to divide by $${n+1}$`],[tT(Q(k,n),"x",Q(n+1),true),`divides by $${n}$ instead of $${n+1}$`]]; }
        else if(d===2){ const T=R.pick(["rt","pw","sin"]);
          if(T==="rt"){ f="\\frac{1}{\\sqrt{x}}"; right=withK("2\\sqrt{x}"); dr="$\\frac{d}{dx}2x^{1/2} = 2\\cdot\\frac12x^{-1/2} = \\frac{1}{\\sqrt{x}}$"; wrong=[["-\\frac{1}{2x^{3/2}}","is the derivative of $f$"],["\\frac{1}{2\\sqrt{x}}","is the derivative of $\\sqrt{x}$, not an antiderivative of $\\frac{1}{\\sqrt x}$"],["\\frac{\\sqrt{x}}{2}","has derivative $\\frac{1}{4\\sqrt{x}}$"]]; }
          else if(T==="pw"){ f="x^{2/3}"; right=withK("\\frac{3}{5}x^{5/3}"); dr="$\\frac{d}{dx}\\frac35x^{5/3} = \\frac35\\cdot\\frac53x^{2/3} = x^{2/3}$"; wrong=[["\\frac{5}{3}x^{5/3}","has derivative $\\frac{25}{9}x^{2/3}$"],["\\frac{2}{3}x^{-1/3}","is the derivative of $f$"],["x^{5/3}","has derivative $\\frac53x^{2/3}$"]]; }
          else { const k=R.int(2,5); f=`${k}\\sin(x)`; right=withK(`-${k}\\cos(x)`); dr=`$\\frac{d}{dx}(-${k}\\cos(x)) = -${k}(-\\sin(x)) = ${k}\\sin(x)$`; wrong=[[`${k}\\cos(x)`,`has derivative $-${k}\\sin(x)$: wrong sign`],[`-${k}\\sin(x)`,`has derivative $-${k}\\cos(x)$`],[`-\\cos(${k}x)`,`has derivative $${k}\\sin(${k}x)$, not $${k}\\sin(x)$`]]; } }
        else { const T=R.pick(["ex2","sin","cos","cosx2"]);
          if(T==="ex2"){ const a=R.int(1,3); f=`${2*a}xe^{x^2}`; right=withK(`${a===1?"":a}e^{x^2}`); dr=`$\\frac{d}{dx}${a===1?"":a}e^{x^2} = ${a===1?"":a}e^{x^2}\\cdot 2x = ${2*a}xe^{x^2}$ by the chain rule`; wrong=[[`${a===1?"":a}x^2e^{x^2}`,"needs the product rule, and its derivative has an extra $e^{x^2}$ term"],[`${2*a}e^{x^2} + ${4*a}x^2e^{x^2}`,"is the derivative of $f$"],[`${2*a}e^{x^2}`,`has derivative $${4*a}xe^{x^2}$, twice too big`]]; }
          else if(T==="sin"){ const k=R.int(2,4); f=`\\sin(${k}x)`; right=withK(`-\\frac{1}{${k}}\\cos(${k}x)`); dr=`$\\frac{d}{dx}\\left(-\\frac{1}{${k}}\\cos(${k}x)\\right) = -\\frac{1}{${k}}\\cdot(-\\sin(${k}x))\\cdot ${k} = \\sin(${k}x)$`; wrong=[[`-\\cos(${k}x)`,`has derivative $${k}\\sin(${k}x)$, ${k} times too big`],[`${k}\\cos(${k}x)`,`is the derivative of $f$`],[`\\frac{1}{${k}}\\cos(${k}x)`,"has the wrong sign"]]; }
          else if(T==="cos"){ const k=R.int(2,4); f=`\\cos(${k}x)`; right=withK(`\\frac{1}{${k}}\\sin(${k}x)`); dr=`$\\frac{d}{dx}\\frac{1}{${k}}\\sin(${k}x) = \\frac{1}{${k}}\\cos(${k}x)\\cdot ${k} = \\cos(${k}x)$`; wrong=[[`\\sin(${k}x)`,`has derivative $${k}\\cos(${k}x)$`],[`-${k}\\sin(${k}x)`,"is the derivative of $f$"],[`-\\frac{1}{${k}}\\sin(${k}x)`,"has the wrong sign"]]; }
          else { f="2x\\cos(x^2)"; right=withK("\\sin(x^2)"); dr="$\\frac{d}{dx}\\sin(x^2) = \\cos(x^2)\\cdot 2x$ by the chain rule"; wrong=[["x^2\\sin(x^2)","needs the product rule and does not give $2x\\cos(x^2)$"],["-\\sin(x^2)","has the wrong sign"],["\\cos(x^2)","has derivative $-2x\\sin(x^2)$"]]; } }
        { const j=R.int(0,wrong.length-1); if(!/\+ \d$/.test(wrong[j][0])) wrong[j]=[withK(wrong[j][0]),wrong[j][1]]; }
        const opts=[right,...wrong.map(w=>w[0])].map(s=>`$F(x) = ${s}$`);
        const o=R.shuffle(opts.map((_,i)=>i));
        return {prompt:`Which of these is an antiderivative of $f(x) = ${f}$?`,
          parts:[{answer:{type:"mc",options:o.map(i=>opts[i]),correct:o.indexOf(0)}}],
          hint:"Differentiate each option. The one whose derivative is exactly $f(x)$ is an antiderivative. A constant added on the end is fine.",
          steps:[`Check by differentiating (p. 1). ${dr}.`,`So $F(x) = ${right}$ works. The constant $${K}$ does not change the derivative.`,...wrong.map(w=>`$${w[0]}$ ${w[1]}.`)],
          answerTeX:`$F(x) = ${right}$`};
      }},
    {id:"L05.g.erroran", title:"Find the first mistake", skill:"Spot errors in antiderivative work, including a missing $+C$ or $dx$", ref:"pp. 2 to 4",
      gen(R,d){
        if(d===1){
          const a=R.pick([2,3,4,5,6,8]), n=R.int(2,5), b=R.nz(-7,7);
          const c=Q(a,n+1), e=R.int(1,3);
          const bt=b<0?`- ${-b}`:`+ ${b}`;
          const L=[e===1?`$\\int (${a}x^{${n}} ${bt})\\,dx = \\int ${a}x^{${n}}\\,dx \\cdot \\int ${b<0?`(${b})`:b}\\,dx$`:`$\\int (${a}x^{${n}} ${bt})\\,dx = \\int ${a}x^{${n}}\\,dx + \\int ${b<0?`(${b})`:b}\\,dx$`,
            e===2?`$= ${a}\\cdot\\frac{x^{${n+1}}}{${n}} ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}x + C$`:`$= ${a}\\cdot\\frac{x^{${n+1}}}{${n+1}} ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}x + C$`,
            e===3?`$= ${tT(c,"x",Q(n+1),true)} ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}x$`:`$= ${tT(e===2?Q(a,n):c,"x",Q(n+1),true)} ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}x + C$`];
          const why={1:"Line (1) turns the sum into a product. The sum rule splits $\\int(f+g)\\,dx$ into $\\int f\\,dx + \\int g\\,dx$. There is no product rule like this for integrals.",2:`Line (2) divides by $${n}$. The power rule divides by the new power, $n + 1 = ${n+1}$.`,3:"Line (3) dropped the $+C$. An indefinite integral is the whole family of antiderivatives, and graders take marks off without it."};
          return {prompt:`A problem and answer are shown. The answer would not get a perfect score. Select the first line that has a mistake.<div class="box note"><b class="t">Problem</b>Evaluate $\\int (${a}x^{${n}} ${bt})\\,dx$.</div><div class="box note"><b class="t">Answer</b><ol>${L.map(s=>`<li>${s}</li>`).join("")}</ol></div>`,
            parts:[{answer:{type:"mc",options:lineOpts(3),correct:e-1,keep:true}}],
            hint:"Check the sum rule, then the power rule (add 1, divide by the new power), then the $+C$.",
            steps:[why[e],`Correct: $\\int (${a}x^{${n}} ${bt})\\,dx = ${tT(c,"x",Q(n+1),true)} ${b<0?"-":"+"} ${Math.abs(b)===1?"":Math.abs(b)}x + C$.`],
            answerTeX:`Line (${e})`};
        }
        if(d===2){
          const A=R.int(1,6), B=R.int(2,6), e=R.int(1,4);
          const L=[e===1?`$\\int \\frac{${A} + ${B}x^3}{x^2}\\,dx = \\int\\left(\\frac{${A}}{x^2} + ${B}x^3\\right)dx$`:`$\\int \\frac{${A} + ${B}x^3}{x^2}\\,dx = \\int\\left(\\frac{${A}}{x^2} + \\frac{${B}x^3}{x^2}\\right)dx$`,
            e===2?`$= \\int\\left(${A}x^{2} + ${B}x\\right)dx$`:`$= \\int\\left(${A}x^{-2} + ${B}x\\right)dx$`,
            e===3?`$= \\frac{${A}x^{-3}}{-3} + \\frac{${B}x^2}{2} + C$`:e===2?`$= \\frac{${A}x^{3}}{3} + \\frac{${B}x^2}{2} + C$`:`$= \\frac{${A}x^{-1}}{-1} + \\frac{${B}x^2}{2} + C$`,
            e===4?`$= \\frac{${A}}{x} + ${qtex(Q(B,2))}x^2 + C$`:e===3?`$= -\\frac{${A}}{3x^3} + ${qtex(Q(B,2))}x^2 + C$`:e===2?`$= ${qtex(Q(A,3))}x^3 + ${qtex(Q(B,2))}x^2 + C$`:`$= -\\frac{${A}}{x} + ${qtex(Q(B,2))}x^2 + C$`];
          const why={1:`Line (1) only divides the first term by $x^2$. Both terms on top must be divided: $\\frac{${B}x^3}{x^2} = ${B}x$.`,2:`Line (2) has the wrong sign on the exponent: $\\frac{1}{x^2} = x^{-2}$, not $x^2$.`,3:"Line (3) subtracts 1 from the power. Integrating adds 1: $x^{-2}$ becomes $\\frac{x^{-1}}{-1}$.",4:"Line (4) lost the minus sign: $\\frac{x^{-1}}{-1} = -\\frac{1}{x}$."};
          return {prompt:`A problem and answer are shown. The answer would not get a perfect score. Select the first line that has a mistake.<div class="box note"><b class="t">Problem</b>Evaluate $\\int \\frac{${A} + ${B}x^3}{x^2}\\,dx$.</div><div class="box note"><b class="t">Answer</b><ol>${L.map(s=>`<li>${s}</li>`).join("")}</ol></div>`,
            parts:[{answer:{type:"mc",options:lineOpts(4),correct:e-1,keep:true}}],
            hint:"Split the fraction (every term on top gets divided), rewrite $\\frac{1}{x^2}$ as a power, then add 1 to each power.",
            steps:[why[e],`Correct: $\\int \\frac{${A} + ${B}x^3}{x^2}\\,dx = \\int\\left(${A}x^{-2} + ${B}x\\right)dx = -\\frac{${A}}{x} + ${qtex(Q(B,2))}x^2 + C$.`],
            answerTeX:`Line (${e})`};
        }
        const k=R.int(2,6), m=R.int(2,6);
        const good=`$\\int (${k}\\sin(x) + ${m}e^x)\\,dx = -${k}\\cos(x) + ${m}e^x + C$`;
        const bads=R.shuffle([[`$\\int (${k}\\sin(x) + ${m}e^x)\\,dx = -${k}\\cos(x) + ${m}e^x$`,"is missing the $+C$"],[`$\\int (${k}\\sin(x) + ${m}e^x)\\,dx = ${k}\\cos(x) + ${m}e^x + C$`,"has the wrong sign: $\\int\\sin(x)\\,dx = -\\cos(x) + C$"],[`$\\int (${k}\\sin(x) + ${m}e^x) = -${k}\\cos(x) + ${m}e^x + C$`,"is missing the $dx$"],[`$\\int (${k}\\sin(x) + ${m}e^x)\\,dx = -${k}\\cos(x) + ${m}xe^x + C$`,"has the wrong antiderivative of $e^x$: it is $e^x$ itself"]]).slice(0,2);
        const all=[[good,""],...bads]; const o=R.shuffle([0,1,2]); const shown=o.map(i=>all[i]);
        return {prompt:`A question and three answers are shown. Select the correct answer.<div class="box note"><b class="t">Problem</b>Evaluate $\\int (${k}\\sin(x) + ${m}e^x)\\,dx$.</div>${shown.map((s,i)=>`<div class="box note"><b class="t">Answer #${i+1}</b>${s[0]}</div>`).join("")}`,
          parts:[{answer:{type:"mc",options:[1,2,3].map(i=>`Answer #${i} is correct.`),correct:o.indexOf(0),keep:true}}],
          hint:"Check the sign of $\\int \\sin(x)\\,dx$, the $dx$ and the $+C$.",
          steps:shown.map((s,i)=>s[1]?`Answer #${i+1} ${s[1]}.`:`Answer #${i+1} is correct: $\\int\\sin(x)\\,dx = -\\cos(x)$, $\\int e^x\\,dx = e^x$, with $dx$ and $+C$.`),
          answerTeX:`Answer #${o.indexOf(0)+1}`};
      }},
    {id:"L05.g.solvede", title:"Solve $\\frac{dy}{dx} = f(x)$", skill:"Find all solutions of a simple differential equation", ref:"pp. 4 to 5",
      gen(R,d){
        if(d===1){ const a=R.nz(-6,6), n=R.int(1,4), b=R.nz(-8,8);
          const T=[[Q(a),Q(n)],[Q(b),Q(0)]], F=T.map(anti);
          return {prompt:`Solve $\\frac{dy}{dx} = ${sumT(T,"x")}$.`, answer:{answer:`y = ${sumA(F,"x")} + C`, vars:["x"], plusC:true, consts:[], domain:[-2,2]}, verify:{antideriv:sumA(T,"x")},
            hint:"You want every function whose derivative is the right-hand side: $y = \\int(\\dots)\\,dx$.",
            steps:[`All solutions are given by $y = \\int\\left(${sumT(T,"x")}\\right)dx$.`,`$y = ${sumT(F,"x")} + C$`],
            answerTeX:`$y = ${sumT(F,"x")} + C$`}; }
        if(d===2){ const a=R.nz(-4,4), b=R.nz(-4,4), c=R.nz(-5,5);
          const at=[ATOM.sin(a,"t"),ATOM.exp(b,"t"),ATOM.con(c,"t")];
          const it=at.map((x,i)=>sg(x.t,i===0)).join(" "), Ft=at.map((x,i)=>sg(x.Ft,i===0)).join(" ");
          return {prompt:`Solve $\\frac{dy}{dt} = ${it}$.`, answer:{answer:`y = ${at.map(x=>x.Fa).join(" + ")} + C`, vars:["t"], plusC:true, consts:[], domain:[-2,2]}, verify:{antideriv:at.map(x=>x.a).join(" + "), v:"t"},
            hint:"The notation $\\frac{dy}{dt}$ says the variable is $t$. Integrate each term with the table on p. 3.",
            steps:[`All solutions are given by $y = \\int\\left(${it}\\right)dt$.`,`Term by term: ${at.map(x=>`$\\int ${x.t}\\,dt = ${x.Ft}$`).join(", ")}.`,`$y = ${Ft} + C$`],
            answerTeX:`$y = ${Ft} + C$`}; }
        const kind=R.pick(["split","sin","ex2"]);
        if(kind==="split"){ const k=R.nz(-4,4); const T=[[Q(1),Q(1)],[Q(k),Q(-1,2)]], F=T.map(anti);
          return {prompt:`Solve $\\frac{dy}{dx} = \\frac{x^2 ${k<0?"-":"+"} ${Math.abs(k)===1?"":Math.abs(k)}\\sqrt{x}}{x}$.`, answer:{answer:`y = ${sumA(F,"x")} + C`, vars:["x"], plusC:true, consts:[], domain:[0.3,3]}, verify:{antideriv:`(x^2 + ${k}sqrt(x))/x`},
            hint:"You don't know an antiderivative of this fraction directly. Split it first.",
            steps:[`$y = \\int \\frac{x^2 ${k<0?"-":"+"} ${Math.abs(k)===1?"":Math.abs(k)}\\sqrt{x}}{x}\\,dx = \\int\\left(\\frac{x^2}{x} ${k<0?"-":"+"} \\frac{${Math.abs(k)===1?"":Math.abs(k)}x^{1/2}}{x}\\right)dx$`,`$= \\int\\left(${sumT(T,"x")}\\right)dx$`,`$y = ${sumT(F,"x")} + C$`],
            answerTeX:`$y = ${sumT(F,"x")} + C$`}; }
        if(kind==="sin"){ const k=R.int(2,4);
          return {prompt:`Solve $\\frac{dy}{dx} = \\sin(${k}x)$.`, answer:{answer:`y = -1/${k}*cos(${k}x) + C`, vars:["x"], plusC:true, consts:[], domain:[-2,2]}, verify:{antideriv:`sin(${k}x)`},
            hint:"Guess and check, like the $x^{2/3}$ example on p. 2. Try $-\\cos("+k+"x)$, differentiate, then fix the constant.",
            steps:[`$y = \\int\\sin(${k}x)\\,dx$. Guess $-\\cos(${k}x)$: its derivative is $${k}\\sin(${k}x)$ by the chain rule.`,`That is ${k} times too big, so multiply by $\\frac{1}{${k}}$.`,`$y = -\\frac{1}{${k}}\\cos(${k}x) + C$. Check: $\\frac{dy}{dx} = -\\frac{1}{${k}}(-\\sin(${k}x))\\cdot ${k} = \\sin(${k}x)$.`],
            answerTeX:`$y = -\\frac{1}{${k}}\\cos(${k}x) + C$`}; }
        const a=R.int(1,4);
        return {prompt:`Solve $\\frac{dy}{dx} = ${2*a}xe^{x^2}$.`, answer:{answer:`y = ${a}e^(x^2) + C`, vars:["x"], plusC:true, consts:[], domain:[-1.2,1.2]}, verify:{antideriv:`${2*a}x*e^(x^2)`},
          hint:"Guess and check: what is $\\frac{d}{dx}e^{x^2}$?",
          steps:[`$y = \\int ${2*a}xe^{x^2}\\,dx$. By the chain rule, $\\frac{d}{dx}e^{x^2} = 2xe^{x^2}$.`,`So you need ${a===1?"exactly $e^{x^2}$":`$${a}$ of them: $\\frac{d}{dx}${a}e^{x^2} = ${2*a}xe^{x^2}$`}.`,`$y = ${a===1?"":a}e^{x^2} + C$`],
          answerTeX:`$y = ${a===1?"":a}e^{x^2} + C$`};
      }}
  ],
  exam:[
    {id:"L05.q1", ref:"p. 3", q:"$\\int 6x^2\\,dx =$", opts:[
      ["$2x^3 + C$",1,"Power rule: $6\\cdot\\frac{x^3}{3} = 2x^3$, plus $C$."],["$12x + C$",0,"That is the derivative of $6x^2$."],["$2x^3$",0,"Missing the $+C$."],["$6x^3 + C$",0,"You need to divide by the new power, 3."]]},
    {id:"L05.q2", ref:"p. 1", multi:true, q:"Which of these are antiderivatives of $f(x) = 3x^2e^{x^3}$? Select all that apply.", opts:[
      ["$e^{x^3}$",1,"Chain rule: $\\frac{d}{dx}e^{x^3} = e^{x^3}\\cdot 3x^2$."],
      ["$e^{x^3} - \\pi$",1,"$\\pi$ is a constant; its derivative is 0."],
      ["$e^{x^3} + 4e$",1,"$4e$ is a constant too, even though it has an $e$ in it."],
      ["$x^3e^{x^3}$",0,"Product rule gives $3x^2e^{x^3} + 3x^5e^{x^3}$, which is not $f$."],
      ["$6xe^{x^3} + 9x^4e^{x^3}$",0,"That is $f'(x)$, the derivative, not an antiderivative."]]},
    {id:"L05.q3", ref:"p. 3", q:"$\\int \\sin(x)\\,dx =$", opts:[
      ["$-\\cos(x) + C$",1,"Check: $\\frac{d}{dx}(-\\cos(x)) = \\sin(x)$."],["$\\cos(x) + C$",0,"Wrong sign: $\\frac{d}{dx}\\cos(x) = -\\sin(x)$."],["$-\\sin(x) + C$",0,"Its derivative is $-\\cos(x)$."],["$\\sin(x)\\cos(x) + C$",0,"Not from the table, and its derivative is not $\\sin(x)$."]]},
    {id:"L05.q4", ref:"p. 2", q:"True or False: $\\int_0^1 x\\,dx$ and $\\int x\\,dx$ are the same kind of object.", opts:[
      ["False",1,"The definite integral is a number ($\\frac12$). The indefinite integral is a collection of functions ($\\frac12x^2 + C$)."],
      ["True",0,"One is a number and the other is a family of functions (p. 2)."]]},
    {id:"L05.q5", ref:"p. 4", q:"$\\int \\frac{x^3 + 2}{x^3}\\,dx =$", opts:[
      ["$x - \\frac{1}{x^2} + C$",1,"Split: $1 + 2x^{-3}$. Then $\\int 2x^{-3}\\,dx = \\frac{2x^{-2}}{-2} = -x^{-2}$."],
      ["$x + \\frac{1}{x^2} + C$",0,"The power $-2$ in the denominator of $\\frac{x^{-2}}{-2}$ gives a minus sign."],
      ["$x - \\frac{2}{x^2} + C$",0,"You still need to divide $2x^{-2}$ by $-2$."],
      ["$\\frac{\\frac14x^4 + 2x}{\\frac14x^4} + C$",0,"You can't integrate the top and bottom separately. Split the fraction first."]]},
    {id:"L05.q6", ref:"p. 3", q:"For which value of $n$ does $\\int x^n\\,dx = \\frac{1}{n+1}x^{n+1} + C$ NOT work?", opts:[
      ["$n = -1$",1,"Then $n + 1 = 0$ and the formula divides by 0."],["$n = 0$",0,"$\\int 1\\,dx = x + C$, which the formula gives."],["$n = \\frac12$",0,"$\\int x^{1/2}\\,dx = \\frac23x^{3/2} + C$ works."],["$n = -2$",0,"$\\int x^{-2}\\,dx = -x^{-1} + C$ works."]]},
    {id:"L05.q7", ref:"pp. 1 to 2", q:"A student writes $\\int 4x^3\\,dx = x^4$. What is wrong?", opts:[
      ["It is missing $+C$: $x^4$ is only one antiderivative",1,"The indefinite integral is the collection of all of them, $x^4 + C$."],
      ["The power rule gives $\\frac{4}{3}x^4$",0,"$\\frac{d}{dx}x^4 = 4x^3$, so the coefficient is right."],
      ["It should be $12x^2$",0,"That is the derivative, not the integral."],
      ["Nothing is wrong",0,"Graders take marks off for a missing $+C$."]]},
    {id:"L05.q8", ref:"p. 3", q:"Select the first line with a mistake.<div class=\"box note\"><b class=\"t\">Problem</b>Evaluate $\\int \\frac{t^2 - 9}{t - 3}\\,dt$.</div><div class=\"box note\"><b class=\"t\">Answer</b>(1) $\\int \\frac{t^2 - 9}{t - 3}\\,dt = \\int \\frac{(t-3)(t+3)}{t-3}\\,dt$<br>(2) $= \\int (t + 3)\\,dt$<br>(3) $= \\frac12t^2 + 3t$</div>", opts:[
      ["Line (3)",1,"It is missing the $+C$. The rest is right."],["Line (1)",0,"$t^2 - 9 = (t-3)(t+3)$ is a correct factoring."],["Line (2)",0,"Cancelling $t - 3$ is fine where the integrand is defined."],["There is no mistake",0,"An indefinite integral needs $+C$."]]},
    {id:"L05.q9", ref:"p. 3", q:"$\\int 5\\,dw =$", opts:[
      ["$5w + C$",1,"The $dw$ says the variable is $w$, and $\\frac{d}{dw}5w = 5$."],["$5x + C$",0,"Wrong variable: the integral is with respect to $w$."],["$5 + C$",0,"Its derivative is 0, not 5."],["$C$",0,"That is $\\int 0\\,dw$."]]},
    {id:"L05.q10", ref:"p. 3", multi:true, q:"Which of these are equal to $\\int (2\\cos(x) + 3e^x)\\,dx$? Select all that apply.", opts:[
      ["$2\\sin(x) + 3e^x + C$",1,"Table plus the constant multiple and sum rules."],
      ["$2\\int\\cos(x)\\,dx + 3\\int e^x\\,dx$",1,"This is what the theorem on p. 3 lets you write."],
      ["$2\\sin(x) + 3e^x$",0,"Missing $+C$: that is only one antiderivative."],
      ["$-2\\sin(x) + 3e^x + C$",0,"$\\int\\cos(x)\\,dx = \\sin(x)$, no minus sign."]]},
    {id:"L05.q11", ref:"p. 2", q:"You claim $F(x) = \\frac35x^{5/3}$ is an antiderivative of $f(x) = x^{2/3}$. What should $F'(x)$ be if you are right?", opts:[
      ["$x^{2/3}$",1,"$\\frac35\\cdot\\frac53x^{2/3} = x^{2/3}$, which is $f$. So the claim is right."],["$\\frac35x^{2/3}$",0,"The $\\frac53$ from the power rule cancels the $\\frac35$."],["$x^{5/3}$",0,"Differentiating lowers the power by 1."],["$\\frac{2}{3}x^{-1/3}$",0,"That is $f'(x)$."]]},
    {id:"L05.q12", ref:"p. 4", q:"What are all the solutions of $\\frac{dy}{dx} = 2x$?", opts:[
      ["$y = x^2 + C$",1,"$y = \\int 2x\\,dx = x^2 + C$ (p. 4)."],["$y = x^2$",0,"That is only one solution. The question asks for all of them."],["$\\frac{dy}{dx} = x^2 + C$",0,"The answer should give $y$, not $\\frac{dy}{dx}$."],["$y = 2 + C$",0,"That differentiates to 0."]]}
  ],
  steps:[
    {type:"read", title:"Undoing a derivative", body:`<p>To evaluate $\\int_a^b f(x)\\,dx$ with FTC Part 2 you need a function $F$ whose derivative is $f$. You are running a derivative backwards (p. 1).</p><div class="box def"><b class="t">Definition (p. 1)</b>For a given function $f$, any function $F$ such that $F'(x) = f(x)$ is called an antiderivative of $f$.</div><p>An antiderivative of $f(x) = 4x^3$ is $F(x) = x^4$. But $x^4 + \\sqrt2$ and $x^4 - 17$ work too, because a constant has derivative 0. In fact $F(x) = x^4 + C$ works for every real number $C$, so there are infinitely many antiderivatives (p. 1).</p><div class="box"><b class="t">Always check</b>Differentiate your answer. If you get the original function back, you are right (p. 1).</div>`, ref:"p. 1"},
    {type:"explore", title:"One function, many antiderivatives", fig:"fam", body:`<p>Adding a constant slides a graph up or down without changing its shape. So every curve $F(x) + C$ has the same slope at the same $x$, and they all have the same derivative.</p><p><b>Try it.</b> Drag the point and read the slope: it is $f(x)$ on every curve, not just the coloured one. Move the $C$ slider and check that the slope does not change. Try the same with $f(x) = \\cos(x)$.</p>`, ref:"pp. 1 to 2"},
    {type:"example", title:"Guess, check, adjust", ex:{q:"What is an antiderivative of $f(x) = x^{2/3}$?", ref:"p. 2",
      steps:[
        {t:"Taking a derivative subtracts one from the power, so taking an antiderivative adds one. The antiderivative will contain $x^{5/3}$.", why:"$\\frac23 + 1 = \\frac53$."},
        {t:"The derivative of $x^{5/3}$ is $\\frac53x^{2/3}$.", why:"Power rule for derivatives (Lecture 1)."},
        {t:"That is $\\frac53$ times too big, so multiply by $\\frac35$: $F(x) = \\frac35x^{5/3}$.", why:"The $\\frac35$ cancels the $\\frac53$."},
        {t:"Check: $F'(x) = \\frac35\\cdot\\frac53x^{2/3} = x^{2/3} = f(x)$.", why:"Checking by differentiating is also a good way to find antiderivatives (p. 1)."}],
      ans:"$F(x) = \\frac35x^{5/3}$. Any $\\frac35x^{5/3} + C$ works too."}},
    {type:"read", title:"The indefinite integral", body:`<p>Sometimes you need every antiderivative at once, so there is notation for the whole collection (p. 2).</p><div class="box def"><b class="t">Definition (p. 2)</b>If $F$ is any antiderivative of $f$, the collection of all antiderivatives of $f$ is called the indefinite integral of $f$: $$\\int f(x)\\,dx = F(x) + C$$ for any real number $C$.</div><p>Picking one value of $C$ gives a single antiderivative.</p><div class="box warn"><b class="t">Two kinds of integral (p. 2)</b>$\\int_a^b f(x)\\,dx$ is a number: a net change, an area, an infinite sum of differentials. $\\int f(x)\\,dx$ is a collection of functions: all the antiderivatives of $f$. That is why it needs $+C$.</div>`, ref:"p. 2"},
    {type:"mcq", title:"Number or functions?", q:"Which of these is right?", opts:[
      ["$\\int_0^2 e^x\\,dx = e^2 - 1$ is a number, and $\\int e^x\\,dx = e^x + C$ is a collection of functions",true,"Definite integral: a number. Indefinite integral: all antiderivatives (p. 2)."],
      ["Both are numbers",false,"$\\int e^x\\,dx$ has no limits, so there is nothing to plug in."],
      ["Both are collections of functions",false,"$e^2 - 1 \\approx 6.39$ is one number."],
      ["$\\int_0^2 e^x\\,dx = e^x + C$",false,"With limits, you evaluate: $e^x\\Big|_0^2 = e^2 - 1$."]]},
    {type:"read", title:"The table and two rules", body:`<p>Every row of this table is a derivative rule read backwards (p. 3):</p>$$\\int 0\\,dx = C \\qquad \\int x^n\\,dx = \\frac{1}{n+1}x^{n+1} + C\\ \\ (n \\ne -1)$$ $$\\int e^x\\,dx = e^x + C \\qquad \\int\\cos(x)\\,dx = \\sin(x) + C \\qquad \\int\\sin(x)\\,dx = -\\cos(x) + C$$<div class="box def"><b class="t">Theorem (p. 3)</b>If $F$ is an antiderivative of $f$ and $G$ is an antiderivative of $g$, then for all real numbers $k$ $$\\int kf(x)\\,dx = kF(x) + C \\qquad \\int\\left(f(x) + g(x)\\right)dx = F(x) + G(x) + C$$</div><div class="box warn"><b class="t">Watch for this</b>$\\int\\sin(x)\\,dx$ has a minus sign; $\\int\\cos(x)\\,dx$ does not. Check by differentiating. And the power rule can't handle $n = -1$, since it would divide by 0.</div>`, ref:"p. 3"},
    {type:"explore", title:"Power rule, backwards", fig:"power", body:`<p>The power rule for integrals is the derivative power rule undone: add 1 to the power, then divide by the new power.</p><p><b>Try it.</b> Drag the point along $F$ and compare the slope of $F$ with the height of $f$ in the readout: they match. Slide $n$ to $\\frac12$, then $-2$, then $-1$ and see where the formula stops working.</p>`, ref:"pp. 2 to 3"},
    {type:"try", title:"Your turn: the power rule", gen:"L05.g.power"},
    {type:"read", title:"Simplify before you integrate", body:`<p>If the integrand isn't in the table, use algebra to turn it into pieces that are (pp. 3 to 4). There is no product rule or quotient rule for integrals.</p><div class="box"><b class="t">Strategy 1: apply a property (p. 3)</b>$$\\int\\frac{t^2 - 4}{t + 2}\\,dt = \\int\\frac{(t-2)(t+2)}{t+2}\\,dt = \\int(t - 2)\\,dt = \\frac12t^2 - 2t + C$$</div><div class="box"><b class="t">Strategy 2: split a fraction (p. 4)</b>If the integrand is a fraction with a sum on top, use $$\\frac{a + b}{c} = \\frac{a}{c} + \\frac{b}{c}$$</div>`, ref:"pp. 3 to 4"},
    {type:"example", title:"Split the fraction", ex:{q:"Evaluate $\\int\\frac{1 + x^3}{x^2}\\,dx$.", ref:"p. 4",
      steps:[
        {t:"$\\int\\frac{1 + x^3}{x^2}\\,dx = \\int\\left(\\frac{1}{x^2} + \\frac{x^3}{x^2}\\right)dx$", why:"Strategy 2: $\\frac{a+b}{c} = \\frac ac + \\frac bc$."},
        {t:"$= \\int\\left(\\frac{1}{x^2} + x\\right)dx$", why:"$\\frac{x^3}{x^2} = x$."},
        {t:"$= -\\frac{1}{x} + \\frac12x^2 + C$", why:"$\\frac{1}{x^2} = x^{-2}$, and the power rule gives $\\frac{x^{-1}}{-1} = -\\frac1x$. One $+C$ covers both terms."}],
      ans:"$\\int\\frac{1 + x^3}{x^2}\\,dx = -\\frac{1}{x} + \\frac12x^2 + C$"}},
    {type:"try", title:"Your turn: algebra first", gen:"L05.g.algebra"},
    {type:"mcq", title:"Which are antiderivatives?", multi:true, q:"Which of these are antiderivatives of $f(x) = 4x^3$? Select all that apply.", opts:[
      ["$x^4$",true,"$\\frac{d}{dx}x^4 = 4x^3$."],["$x^4 + \\sqrt2$",true,"Adding a constant keeps the derivative the same (p. 1)."],["$x^4 - 17$",true,"Same reason. There are infinitely many antiderivatives."],["$12x^2$",false,"That is the derivative of $4x^3$."],["$4x^4$",false,"Its derivative is $16x^3$."]],
      after:"All antiderivatives together: $\\int 4x^3\\,dx = x^4 + C$."},
    {type:"try", title:"Quiz style: find the first mistake", gen:"L05.g.erroran"},
    {type:"read", title:"Solving simple differential equations", body:`<p>Antiderivatives solve first order differential equations of the form $\\frac{dy}{dx} = f(x)$ (p. 4). You want all functions whose derivative is $f(x)$, and that is exactly the indefinite integral.</p><div class="box"><b class="t">Example (p. 4)</b>Solve $\\frac{dy}{dx} = 2x$. All solutions are given by $$y = \\int 2x\\,dx = x^2 + C$$</div><p>The exercises on pp. 4 to 5 work the same way. For $\\frac{dy}{dt} = \\sin(t) + e^t + 1$, the variable is $t$ and $y = -\\cos(t) + e^t + t + C$. For $\\frac{dy}{dx} = \\sin(2x)$ or $4xe^{x^2}$, guess and check like the $x^{2/3}$ example: $y = -\\frac12\\cos(2x) + C$ and $y = 2e^{x^2} + C$.</p><div class="box warn"><b class="t">Watch for this</b>Write the answer as $y = \\dots + C$. The $+C$ is what makes it all solutions.</div>`, ref:"pp. 4 to 5"},
    {type:"try", title:"Your turn: solve a DE", gen:"L05.g.solvede"},
    {type:"formulas", title:"Lecture 5 formulas"}
  ]
});
})();
