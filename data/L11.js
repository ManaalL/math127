/* Lecture 11 (Fri Oct 2): Calculus with logarithms, logarithmic scales. Sections 2.4.4 and 2.4.6 (2.4.5 is not covered). Notes: 4 pages. */
(function(){
const M=M127;
const F=(n,d=1)=>{ if(d<0){ n=-n; d=-d; } const g=M.gcd(n,d); return [n/g,d/g]; };
const Ft=x=>M.frac(x[0],x[1]);
const cT=(n,d,body,first)=>{ const [p,q]=F(n,d); if(p===0) return ""; const s=p<0?"-":(first?"":"+"); const a=Math.abs(p);
  const c=q===1?(a===1&&body?"":String(a)):`\\frac{${a}}{${q}}`; return s+c+body; };
const cc=c=>c===1?"":c===-1?"-":String(c);
const kx=(k,v="x")=>k<0?`-\\frac{${-k}}{${v}}`:`\\frac{${k}}{${v}}`;            // k/x with the sign in front
const sgnLn=(k,arg,first)=>`${k<0?"-":(first?"":"+")}${Math.abs(k)===1?"":Math.abs(k)}\\ln(${arg})`; // k ln(arg), signed
const lines=L=>L.map((t,i)=>`$$${t}\\qquad(${i+1})$$`).join("");
const simpson=(f,a,b,N=400)=>{ const h=(b-a)/N; let s=0; for(let i=0;i<=N;i++){ const x=a+i*h; s+=((i===0||i===N)?1:(i%2?4:2))*f(x); } return s*h/3; };
const sup=v=>{ const r=Math.round(v*10)/10; return Number.isInteger(r)?String(r):r.toFixed(1); };

M.lecture({
  id:"L11", n:11, date:"2026-10-02", added:"2026-10-21", unit:"u4", quiz:"Q5",
  title:"Calculus with Logarithms and Logarithmic Scales", sections:["2.4.4","2.4.6"], pages:4,
  summary:"The derivatives of $\\ln(x)$ and $\\log_a(x)$, the antiderivative $\\ln(\\lvert x\\rvert)+C$ and why it needs the absolute value, and logarithmic scales: the Richter scale and decibels. Section 2.4.5 (growth and decay) was not covered.",
  flags:[
    {ref:"p. 1", text:"The exercise asks for the derivative of $f(x)=\\ln(x-e^x)$. This function is not defined for any real $x$: $e^x - x \\ge 1$ for every $x$ (its smallest value is 1, at $x=0$), so $x - e^x \\le -1 < 0$ and $\\ln$ of it is not defined anywhere. The rules give $\\frac{1-e^x}{x-e^x}$ on paper, but there is no function to differentiate. It was probably meant to be $\\ln(e^x - x)$, whose derivative is $\\frac{e^x-1}{e^x-x}$."},
    {ref:"p. 2", text:"The log scale paragraph says \"instead of plotting the values like 100,000,000,000\" ($10^{11}$) and then plots $\\log_{10}(100{,}000{,}000{,}000{,}000) = 14$ ($10^{14}$). The two numbers do not match. $\\log_{10}(10^{14}) = 14$ is right, but $\\log_{10}(100{,}000{,}000{,}000) = 11$."},
    {ref:"p. 3", text:"The notes say a magnitude 6 earthquake is \"10 times more powerful\" than a magnitude 5, and a magnitude 7 is \"1000 times more powerful\" than a magnitude 4. The formula $M_L=\\log_{10}\\left(\\frac{A}{A_0}\\right)$ measures maximum amplitude, so these numbers are amplitude ratios: 10 times and 1000 times larger maximum amplitude. They are correct as amplitude ratios. In seismology the energy released grows about 31.6 times per magnitude, so \"powerful\" is loose wording. The exercise on p. 4 uses the same convention, and its answer choices only work as amplitude ratios."},
    {ref:"pp. 3 to 4", text:"The decibel example asks \"how many times more intense\" and then answers \"$10^{3.5}$ times louder\" and \"about 3000 times louder\". The ratio $\\frac{I_1}{I_2} = 10^{3.5}$ is a ratio of intensities, so it should say \"$10^{3.5}$ times more intense\". How loud a sound feels is not the same thing as its intensity. The arithmetic is correct."}
  ],
  formulas:[
    {id:"L11.f.d-loga", name:"Derivative of $\\log_a(x)$ (memorize)", tex:"\\frac{d}{dx}\\log_a(x) = \\frac{1}{x\\ln(a)}", ref:"p. 1", blank:{tex:"\\frac{d}{dx}\\log_a(x) = \\boxed{\\,?\\,}", answer:"1/(x*ln(a))", vars:["x","a"], domain:[1.5,4]}},
    {id:"L11.f.d-ln", name:"Derivative of $\\ln(x)$ (memorize)", tex:"\\frac{d}{dx}\\ln(x) = \\frac{1}{x}", ref:"p. 1", blank:{tex:"\\frac{d}{dx}\\ln(x) = \\boxed{\\,?\\,}", answer:"1/x", vars:["x"], domain:[0.5,4]}},
    {id:"L11.f.int-loga", name:"Integral giving $\\log_a$ (memorize)", tex:"\\int \\frac{1}{x\\ln(a)}\\,dx = \\log_a(\\lvert x\\rvert) + C", ref:"p. 1", blank:{tex:"\\int \\frac{1}{x\\ln(a)}\\,dx = \\boxed{\\,?\\,} + C", text:true, accept:["log_a(|x|)","log_a|x|","log_a(abs(x))","logₐ(|x|)","logₐ|x|"]}},
    {id:"L11.f.int-ln", name:"Integral of $\\frac1x$ (memorize)", tex:"\\int \\frac{1}{x}\\,dx = \\ln(\\lvert x\\rvert) + C", note:"Do not forget the absolute value (p. 2).", ref:"p. 1", blank:{tex:"\\int \\frac{1}{x}\\,dx = \\boxed{\\,?\\,} + C", text:true, accept:["ln(|x|)","ln|x|","ln(abs(x))","ln (|x|)","ln | x |"]}},
    {id:"L11.f.abs-warn", name:"Why the absolute value", tex:"\\text{domain of } \\frac{1}{x}:\\ (-\\infty,0) \\text{ and } (0,\\infty)", note:"$\\ln(x)$ only covers $x>0$. $\\ln(\\lvert x\\rvert)$ covers both pieces, so it matches the domain of $\\frac1x$.", ref:"p. 2"},
    {id:"L11.f.logscale", name:"Log scale idea", tex:"\\log_{10}(100{,}000{,}000{,}000{,}000) = 14", note:"Plot $\\log_{10}$ of a value instead of the value. (The notes' sentence before this has the wrong number of zeros: see the flag for p. 2.)", ref:"p. 2"},
    {id:"L11.f.richter", name:"Richter scale", tex:"M_L = \\log_{10}\\left(\\frac{A}{A_0}\\right)", note:"$A$ is the maximum amplitude; $A_0$ is a constant that depends on the distance from the epicenter.", ref:"p. 3", blank:{tex:"M_L = \\boxed{\\,?\\,}", text:true, accept:["log_10(A/A_0)","log_10(A/A0)","log(A/A_0)","log(A/A0)","log10(A/A0)","log_10(A/A_0) "]}},
    {id:"L11.f.richter-step", name:"One step on the Richter scale", tex:"M_L \\text{ up by } 1 \\;\\Rightarrow\\; \\text{maximum amplitude } \\times 10", note:"Up by $d$ means $10^d$ times the maximum amplitude: magnitude 7 vs 4 is $10^3 = 1000$ times.", ref:"p. 3"},
    {id:"L11.f.db", name:"Decibel scale", tex:"D = 10\\log_{10}\\left(\\frac{I}{10^{-12}}\\right) \\text{ decibels}", note:"$I$ is the intensity of the sound waves in watts per square meter.", ref:"p. 3", blank:{tex:"D = \\boxed{\\,?\\,} \\text{ decibels}", text:true, accept:["10log_10(I/10^(-12))","10log(I/10^-12)","10*log_10(I/10^(-12))","10log_10(I/10^-12)","10log(I/10^(-12))","10*log(I/10^(-12))"]}},
    {id:"L11.f.db-inv", name:"Intensity from decibels", tex:"I = 10^{-12}\\cdot 10^{D/10}", note:"From the example on p. 3: divide by 10, undo $\\log_{10}$, multiply by $10^{-12}$.", ref:"p. 3", blank:{tex:"I = 10^{-12}\\cdot \\boxed{\\,?\\,}", answer:"10^(D/10)", vars:["D"], domain:[0,14]}},
    {id:"L11.f.split", name:"Estimating a half power of 10", tex:"10^{3.5} = 10^3\\cdot 10^{0.5} = 1000\\sqrt{10}", note:"$\\sqrt{10}\\approx 3$, so $10^{3.5}\\approx 3000$. No calculator needed.", ref:"p. 4", blank:{tex:"10^{3.5} = 10^3\\cdot 10^{0.5} = \\boxed{\\,?\\,}", text:true, accept:["1000sqrt(10)","1000*sqrt(10)","1000√10","1000 sqrt(10)","1000sqrt10"]}},
    {id:"L11.f.ph", name:"pH scale", tex:"\\text{pH} = -\\log_{10}([H^+])", note:"The lecture lists the pH scale (p. 2) without a formula. This formula is from the course notes, section 2.4.6. Lower pH means more acidic; down by 1 means 10 times the $[H^+]$.", ref:"p. 2"}
  ],
  glossary:[
    {id:"L11.t.lnabs", term:"$\\ln(\\lvert x\\rvert)$", def:"The antiderivative of $\\frac1x$. It is defined for every $x\\ne0$, just like $\\frac1x$, and its derivative is $\\frac1x$ on both sides of 0.", ref:"pp. 1 to 2"},
    {id:"L11.t.logscale", term:"Logarithmic scale", def:"A scale that records $\\log_{10}$ of a quantity instead of the quantity. Equal steps on the scale mean equal ratios: each step of 1 is a factor of 10.", ref:"p. 2"},
    {id:"L11.t.richter", term:"Richter scale", def:"$M_L=\\log_{10}\\left(\\frac{A}{A_0}\\right)$. A base-10 log scale for earthquakes. Up 1 in magnitude means 10 times the maximum amplitude.", ref:"p. 3"},
    {id:"L11.t.amp", term:"Maximum amplitude $A$", def:"The size of the largest recorded wave of an earthquake. $A_0$ is a reference constant that depends on the distance from the epicenter.", ref:"p. 3"},
    {id:"L11.t.db", term:"Decibel", def:"The unit of loudness: $D = 10\\log_{10}\\left(\\frac{I}{10^{-12}}\\right)$. Up 10 decibels means 10 times the intensity.", ref:"p. 3"},
    {id:"L11.t.intensity", term:"Intensity $I$", def:"The power of a sound wave per unit area, in watts per square meter (W/m²). $10^{-12}$ W/m² is the reference value, which is 0 dB.", ref:"p. 3"},
    {id:"L11.t.ph", term:"pH", def:"A log scale for acidity: $\\text{pH}=-\\log_{10}([H^+])$, where $[H^+]$ is the hydrogen ion concentration in moles per litre. From the course notes; the lecture only names it.", ref:"p. 2"}
  ],
  figures:{
    lnabs:{title:"Why ln(|x|)", cap:"<b>Fig. 11.1</b> $\\frac1x$ is defined for every $x\\ne0$, but $\\ln(x)$ only exists for $x>0$. The graph of $y=\\ln(\\lvert x\\rvert)$ has two branches, and the tangent slope at any point is $\\frac1x$, on both sides. (Lecture 11, pp. 1 to 2)",
      build(host,{PLOT}){
        let mode="abs", s=-2;
        const G=PLOT.graph(host,{x:[-5,5],y:[-3,2.5],c:"var(--u4)",xlabel:"x",ylabel:"y",xstep:1,ystep:1});
        G.fn(x=>x>0?Math.log(x):NaN,{cls:"cv c",from:0.01});
        const left=G.fn(x=>x<0?Math.log(-x):NaN,{cls:"cv c",to:-0.01});
        const f=x=>Math.log(Math.max(Math.abs(x),0.06));
        const tan=G.tangent(s,f(s),1/s);
        const lbl=G.label(-4.9,Math.log(4.9),"y = ln(|x|)",{cls:"lblc",dy:-10});
        G.label(4.9,Math.log(4.9),"y = ln(x)",{cls:"lblc",anchor:"end",dy:-10});
        const ctl=PLOT.controls(host), ro=PLOT.readout(host);
        PLOT.seg(ctl,{label:"Which function",items:[["abs","show ln(|x|)"],["plain","show ln(x) only"]],value:"abs",onchange:v=>{ mode=v; draw(); }});
        G.handle(s,f(s),{f,bounds:[-4.8,4.8],step:0.1,label:"Point on the curve",onMove:x=>{ s=x; draw(); }});
        function draw(){
          left.setAttribute("class",mode==="abs"?"cv c":"lt dash");
          lbl.textContent=mode==="abs"?"y = ln(|x|)":"ln(x) not defined here";
          const near=Math.abs(s)<0.1;
          tan.style.display=near?"none":""; if(!near) tan.at(s,f(s),1/s);
          if(near) ro.innerHTML="x = 0 is not in the domain of 1/x or of ln(|x|).";
          else if(mode==="plain"&&s<0) ro.innerHTML=`x = <b>${s.toFixed(2)}</b>: ln(x) is not defined, but 1/x = <b>${(1/s).toFixed(3)}</b> is defined. ln(|x|) fills the gap: its slope here is also 1/x.`;
          else ro.innerHTML=`x = <b>${s.toFixed(2)}</b> &nbsp; y = ln(|x|) = <b>${Math.log(Math.abs(s)).toFixed(3)}</b> &nbsp; tangent slope = 1/x = <b>${(1/s).toFixed(3)}</b>`;
        }
        draw();
      }},
    logscale:{title:"What a step on a log scale means", cap:"<b>Fig. 11.2</b> Top row: two readings on a log scale. Bars: the actual amounts on an ordinary (linear) scale, with the larger amount at full width. A gap of a few units on the log scale is a factor of thousands in the amounts. (Lecture 11, pp. 2 to 4)",
      build(host,{PLOT}){
        const MODES={
          richter:{lo:0,hi:10,step:0.1,v:[7,4],xs:1,sym:"M",lab:"magnitude",qty:"maximum amplitude A",lin:v=>Math.pow(10,v),ex:(a,b)=>a-b,expl:(a,b)=>`M₁ − M₂ = ${sup(a-b)}, so A₁/A₂ = 10<sup>${sup(a-b)}</sup>`},
          db:{lo:0,hi:140,step:1,v:[140,105],xs:20,sym:"D",lab:"decibels",qty:"intensity I",lin:v=>Math.pow(10,v/10),ex:(a,b)=>(a-b)/10,expl:(a,b)=>`(D₁ − D₂)/10 = ${sup((a-b)/10)}, so I₁/I₂ = 10<sup>${sup((a-b)/10)}</sup>`},
          ph:{lo:0,hi:14,step:0.1,v:[3,6],xs:1,sym:"pH",lab:"pH",qty:"[H⁺]",lin:v=>Math.pow(10,-v),ex:(a,b)=>b-a,expl:(a,b)=>`pH₂ − pH₁ = ${sup(b-a)}, so [H⁺]₁/[H⁺]₂ = 10<sup>${sup(b-a)}</sup>`}
        };
        const top=PLOT.controls(host); const wrap=document.createElement("div"); host.append(wrap);
        PLOT.seg(top,{label:"Scale",items:[["richter","Richter"],["db","Decibels"],["ph","pH"]],value:"richter",onchange:v=>render(v)});
        const fmt=r=>r>=1e6?r.toExponential(2).replace("e+"," × 10^"):r>=100?Math.round(r).toLocaleString("en-CA"):r>=1?r.toFixed(2):r.toPrecision(3);
        function render(key){
          wrap.innerHTML=""; const Md=MODES[key]; let [v1,v2]=Md.v; const W=Md.hi-Md.lo;
          const G=PLOT.graph(wrap,{x:[Md.lo,Md.hi],y:[0,4],w:400,h:230,grid:false,xstep:Md.xs,ystep:100,c:"var(--u4)",xlabel:Md.lab});
          G.line(Md.lo,3.3,Md.hi,3.3,{cls:"ln"});
          G.label(Md.lo,3.72,"log scale: the two readings",{cls:"lbl",dx:4});
          const d1=G.dot(v1,3.3,{filled:true}), d2=G.dot(v2,3.3);
          const t1=G.label(v1,3.3,"1",{cls:"lblc",anchor:"middle",dy:-9}), t2=G.label(v2,3.3,"2",{cls:"lblc",anchor:"middle",dy:-9});
          G.label(Md.lo,2.62,`linear scale: amount 1 (${Md.qty})`,{cls:"lbl",dx:4});
          G.label(Md.lo,1.52,`linear scale: amount 2`,{cls:"lbl",dx:4});
          const b1=G.between(()=>2.45,()=>1.95,Md.lo,Md.hi), b2=G.between(()=>1.35,()=>0.85,Md.lo,Md.hi); b1.style.fillOpacity=".55"; b2.style.fillOpacity=".3";
          const n1=G.label(Md.lo,2.2,"",{cls:"lblc",dx:6,dy:4}), n2=G.label(Md.lo,1.1,"",{cls:"lblc",dx:6,dy:4});
          const ctl=PLOT.controls(wrap), ro=PLOT.readout(wrap);
          PLOT.slider(ctl,{label:`reading 1 (${Md.sym}₁)`,min:Md.lo,max:Md.hi,step:Md.step,value:v1,fmt:v=>(+v).toFixed(Md.step<1?1:0),oninput:v=>{ v1=v; draw(); }});
          PLOT.slider(ctl,{label:`reading 2 (${Md.sym}₂)`,min:Md.lo,max:Md.hi,step:Md.step,value:v2,fmt:v=>(+v).toFixed(Md.step<1?1:0),oninput:v=>{ v2=v; draw(); }});
          function draw(){
            d1.set(v1,3.3); d2.set(v2,3.3); t1.set(v1,3.3); t2.set(v2,3.3);
            const L1=Md.lin(v1), L2=Md.lin(v2), mx=Math.max(L1,L2), w1=W*L1/mx, w2=W*L2/mx;
            b1.update(()=>2.45,()=>1.95,Md.lo,Md.lo+w1); b2.update(()=>1.35,()=>0.85,Md.lo,Md.lo+w2);
            const tiny=(w,L)=>w<0.01*W?`too thin to see: ${L===mx?"1":"1/"+fmt(mx/L)} of the full width`:"";
            n1.set(Md.lo+w1,2.2,tiny(w1,L1)); n2.set(Md.lo+w2,1.1,tiny(w2,L2));
            const ex=Math.round(Md.ex(v1,v2)*100)/100, r=Math.pow(10,ex);
            const half=ex>0 && Math.abs(ex*2-Math.round(ex*2))<1e-6 && Math.abs(ex-Math.round(ex))>0.1;
            ro.innerHTML=`${Md.expl(v1,v2)} ${r>=1?`≈ <b>${fmt(r)}</b>: amount 1 is about ${fmt(r)} times amount 2.`:`≈ <b>${fmt(r)}</b>: amount 1 is about 1/${fmt(1/r)} of amount 2.`}`+(half?`<br>Half powers of 10: 10<sup>0.5</sup> = √10 ≈ 3, so this is about ${fmt(3*Math.pow(10,Math.floor(ex)))}.`:"");
          }
          draw();
        }
        render("richter");
      }}
  },
  gens:[
    {id:"L11.g.dlog", title:"Derivatives with logarithms", skill:"Differentiate $\\ln$ and $\\log_a$ with the product, quotient and chain rules", ref:"p. 1",
      gen(R,d){
        const kinds=d===1?["cln","loga","lnlin"]:d===2?["xnln","xlnq","logalin"]:["quot","lnpoly","expln"];
        const k=R.pick(kinds);
        if(k==="cln"){ const c=R.nz(-6,6), b=R.nz(-5,5), n=R.int(2,4);
          return {prompt:`Find $f'(x)$ for $f(x) = ${cc(c)}\\ln(x) ${M.term(b,"x",n)}$.`, answer:{answer:`${c}/x + ${b*n}*x^${n-1}`,vars:["x"],domain:[0.4,3]}, verify:{deriv:`${c}*ln(x) + ${b}*x^${n}`},
            hint:"$\\frac{d}{dx}\\ln(x) = \\frac1x$. Differentiate term by term.",
            steps:[`$\\frac{d}{dx}\\left(${cc(c)}\\ln(x)\\right) = ${kx(c)}$`,`$\\frac{d}{dx}\\left(${M.term(b,"x",n,true)}\\right) = ${M.term(b*n,"x",n-1,true)}$`],
            answerTeX:`$f'(x) = ${kx(c)} ${M.term(b*n,"x",n-1)}$`}; }
        if(k==="loga"){ const a=R.pick([2,3,5,10]), c=R.nz(-5,5);
          const at=`${c<0?"-":""}\\frac{${Math.abs(c)}}{x\\ln(${a})}`;
          return {prompt:`Find $\\frac{dy}{dx}$ for $y = ${cc(c)}\\log_{${a}}(x)$.`, answer:{answer:`${c}/(x*ln(${a}))`,vars:["x"],domain:[0.4,3]}, verify:{deriv:`${c}*log_${a}(x)`},
            hint:"$\\frac{d}{dx}\\log_a(x) = \\frac{1}{x\\ln(a)}$. The $\\ln(a)$ is a constant.",
            steps:[`From the table on p. 1: $\\frac{d}{dx}\\log_{${a}}(x) = \\frac{1}{x\\ln(${a})}$.`,`Constant rule: $\\frac{dy}{dx} = ${c}\\cdot\\frac{1}{x\\ln(${a})} = ${at}$.`], answerTeX:`$\\frac{dy}{dx} = ${at}$`}; }
        if(k==="lnlin"){ const a=R.int(2,6), b=R.int(1,9);
          return {prompt:`Find $f'(x)$ for $f(x) = \\ln(${a}x + ${b})$.`, answer:{answer:`${a}/(${a}x+${b})`,vars:["x"],domain:[0.2,3]}, verify:{deriv:`ln(${a}x+${b})`},
            hint:"Chain rule: the outside is $\\ln(u)$, with derivative $\\frac1u$.",
            steps:[`Let $u = ${a}x+${b}$, so $\\frac{du}{dx} = ${a}$.`,`$\\frac{d}{du}\\ln(u) = \\frac{1}{u}$.`,`Chain rule: $f'(x) = \\frac{1}{${a}x+${b}}\\cdot ${a} = \\frac{${a}}{${a}x+${b}}$.`], answerTeX:`$f'(x) = \\frac{${a}}{${a}x+${b}}$`}; }
        if(k==="xnln"){ const n=R.int(2,4);
          return {prompt:`Differentiate $f(x) = x^{${n}}\\ln(x)$.`, answer:{answer:`${n}x^${n-1}*ln(x) + x^${n-1}`,vars:["x"],domain:[0.3,3]}, verify:{deriv:`x^${n}*ln(x)`},
            hint:"Product rule: $(fg)' = f'g + fg'$.",
            steps:[`Product rule with $x^{${n}}$ and $\\ln(x)$.`,`$f'(x) = ${n}x^{${n-1}}\\ln(x) + x^{${n}}\\cdot\\frac{1}{x}$`,`$x^{${n}}\\cdot\\frac1x = ${n===2?"x":`x^{${n-1}}`}$, so $f'(x) = ${M.term(n,"x",n-1,true)}\\ln(x) + ${n===2?"x":`x^{${n-1}}`}$.`],
            answerTeX:`$f'(x) = ${M.term(n,"x",n-1,true)}\\ln(x) + ${n===2?"x":`x^{${n-1}}`}$`}; }
        if(k==="xlnq"){ const m=R.pick([1,1,2]), c=R.int(2,9)*(R()<0.25?-1:1);
          const q=`x^2${M.pm(c)}`, dom=c>0?[-2,2]:[Math.sqrt(-c)+0.3,Math.sqrt(-c)+2.5];
          const xm=m===1?"x":"x^2", d1t=m===1?"":"2x";
          const ans=m===1?`ln(${q}) + 2x^2/(${q})`:`2x*ln(${q}) + 2x^3/(${q})`;
          const at=m===1?`\\ln(${q}) + \\frac{2x^2}{${q}}`:`2x\\ln(${q}) + \\frac{2x^3}{${q}}`;
          return {prompt:`Find the derivative of $g(x) = ${xm}\\ln(${q})$.`, answer:{answer:ans,vars:["x"],domain:dom}, verify:{deriv:`${m===1?"x":"x^2"}*ln(${q})`},
            hint:"Product rule, then the chain rule for $\\ln("+q+")$. Keep brackets around $(2x)$.",
            steps:[`Product rule: $g'(x) = ${m===1?"1":"2x"}\\cdot\\ln(${q}) + ${xm}\\cdot\\frac{d}{dx}\\ln(${q})$.`,`Chain rule: $\\frac{d}{dx}\\ln(${q}) = \\frac{1}{${q}}\\cdot(2x + 0)$.`,`So $g'(x) = ${m===1?"1":"2x"}\\cdot\\ln(${q}) + ${xm}\\cdot\\frac{1}{${q}}\\cdot(2x) = ${at}$.`],
            answerTeX:`$g'(x) = ${at}$`}; }
        if(k==="logalin"){ const a=R.pick([2,3,10]), p=R.int(2,5), b=R.int(1,7);
          return {prompt:`Find $f'(x)$ for $f(x) = \\log_{${a}}(${p}x+${b})$.`, answer:{answer:`${p}/((${p}x+${b})*ln(${a}))`,vars:["x"],domain:[0.2,3]}, verify:{deriv:`log_${a}(${p}x+${b})`},
            hint:"Chain rule with $\\frac{d}{du}\\log_a(u) = \\frac{1}{u\\ln(a)}$.",
            steps:[`Let $u = ${p}x+${b}$, so $\\frac{du}{dx} = ${p}$.`,`$\\frac{d}{du}\\log_{${a}}(u) = \\frac{1}{u\\ln(${a})}$.`,`$f'(x) = \\frac{1}{(${p}x+${b})\\ln(${a})}\\cdot ${p} = \\frac{${p}}{(${p}x+${b})\\ln(${a})}$`],
            answerTeX:`$f'(x) = \\frac{${p}}{(${p}x+${b})\\ln(${a})}$`}; }
        if(k==="quot"){ const n=R.int(1,3); const xn=n===1?"x":`x^{${n}}`;
          return {prompt:`Differentiate $f(x) = \\frac{\\ln(x)}{${xn}}$.`, answer:{answer:`(1 - ${n}*ln(x))/x^${n+1}`,vars:["x"],domain:[0.3,3]}, verify:{deriv:`ln(x)/x^${n}`},
            hint:"Quotient rule $\\frac{f'g-fg'}{g^2}$. Simplify $\\frac1x\\cdot x^n$ before you finish.",
            steps:[`Top: $\\ln(x)$, derivative $\\frac1x$. Bottom: $${xn}$, derivative $${n===1?"1":`${n}x^{${n-1}}`}$.`,`Quotient rule: $f'(x) = \\frac{\\frac{1}{x}\\cdot ${xn} - \\ln(x)\\cdot ${n===1?"1":`${n}x^{${n-1}}`}}{(${xn})^2}$.`,n===1?`Simplify: $f'(x) = \\frac{1-\\ln(x)}{x^2}$.`:`The top is $x^{${n-1}} - ${n}x^{${n-1}}\\ln(x) = x^{${n-1}}(1-${n}\\ln(x))$; the bottom is $x^{${2*n}}$. Cancel $x^{${n-1}}$: $f'(x) = \\frac{1-${n}\\ln(x)}{x^{${n+1}}}$.`],
            answerTeX:`$f'(x) = \\frac{1-${n===1?"":n}\\ln(x)}{x^{${n+1}}}$`}; }
        if(k==="lnpoly"){ const p=R.int(1,6), q=R.int(1,9);
          const u=`x^2+${p}x+${q}`;
          return {prompt:`Find $\\frac{dy}{dx}$ for $y = \\ln(${u})$.`, answer:{answer:`(2x+${p})/(${u})`,vars:["x"],domain:[0,3]}, verify:{deriv:`ln(${u})`},
            hint:"Chain rule: $\\frac{d}{dx}\\ln(u) = \\frac{1}{u}\\cdot\\frac{du}{dx}$.",
            steps:[`Let $u = ${u}$, so $\\frac{du}{dx} = 2x+${p}$.`,`$\\frac{dy}{dx} = \\frac{1}{${u}}\\cdot(2x+${p}) = \\frac{2x+${p}}{${u}}$`], answerTeX:`$\\frac{dy}{dx} = \\frac{2x+${p}}{${u}}$`}; }
        const k2=R.pick([-2,-1,2,3]);
        const ek=`e^{${cc(k2)}x}`;
        return {prompt:`Differentiate $f(x) = ${ek}\\ln(x)$.`, answer:{answer:`${k2}*e^(${k2}x)*ln(x) + e^(${k2}x)/x`,vars:["x"],domain:[0.3,2]}, verify:{deriv:`e^(${k2}x)*ln(x)`},
          hint:"Product rule, and the chain rule for $"+ek+"$.",
          steps:[`$\\frac{d}{dx}${ek} = ${cc(k2)}${ek}$ (chain rule) and $\\frac{d}{dx}\\ln(x) = \\frac1x$.`,`Product rule: $f'(x) = ${cc(k2)}${ek}\\ln(x) + ${ek}\\cdot\\frac{1}{x}$.`],
          answerTeX:`$f'(x) = ${cc(k2)}${ek}\\ln(x) + \\frac{${ek}}{x}$`};
      }},
    {id:"L11.g.int1x", title:"Antiderivatives with $\\ln(\\lvert x\\rvert)$", skill:"Integrate $\\frac{k}{x}$ and keep the absolute value and $+C$", ref:"pp. 1 to 2",
      gen(R,d){
        const NEG=[-3.5,-0.4];
        if(d===1){ const k=R.nz(-6,6), m=R.nz(-5,5), n=R.int(1,3);
          const aT=`${sgnLn(k,"\\lvert x\\rvert",true)} ${cT(m,n+1,`x^{${n+1}}`)} + C`;
          return {prompt:`Evaluate $\\displaystyle\\int\\left(${kx(k)} ${M.term(m,"x",n)}\\right)dx$.`, answer:{answer:`${k}*ln(abs(x)) + ${m}/${n+1}*x^${n+1} + C`,vars:["x"],domain:NEG,plusC:true,consts:[]}, verify:{antideriv:`${k}/x + ${m}*x^${n}`},
            hint:"$\\int\\frac1x\\,dx = \\ln(\\lvert x\\rvert)+C$. Keep the absolute value and the $+C$.",
            steps:[`Integrate term by term.`,`$\\int ${kx(k)}\\,dx = ${k}\\int\\frac{1}{x}\\,dx = ${sgnLn(k,"\\lvert x\\rvert",true)}$`,`$\\int ${M.term(m,"x",n,true)}\\,dx = ${cT(m,n+1,`x^{${n+1}}`,true)}$`,`So the answer is $${aT}$.`], answerTeX:`$${aT}$`}; }
        if(d===2){ const kind=R.pick(["sq","two","frac"]);
          if(kind==="sq"){ const p=R.nz(-5,5);
            const aT=`\\frac{1}{2}x^2 ${M.term(2*p,"x",1)} ${sgnLn(p*p,"\\lvert x\\rvert")} + C`;
            return {prompt:`Evaluate $\\displaystyle\\int\\frac{(x${M.pm(p)})^2}{x}\\,dx$.`, answer:{answer:`x^2/2 + ${2*p}x + ${p*p}*ln(abs(x)) + C`,vars:["x"],domain:NEG,plusC:true,consts:[]}, verify:{antideriv:`(x+${p})^2/x`},
              hint:"There is no quotient rule for integrals. Expand the top and divide each term by $x$ first.",
              steps:[`Expand: $(x${M.pm(p)})^2 = x^2 ${M.term(2*p,"x",1)} ${M.pm(p*p)}$.`,`Divide each term by $x$: $\\frac{(x${M.pm(p)})^2}{x} = x ${M.pm(2*p)} + \\frac{${p*p}}{x}$.`,`Integrate: $\\int\\left(x ${M.pm(2*p)} + \\frac{${p*p}}{x}\\right)dx = ${aT}$.`], answerTeX:`$${aT}$`}; }
          if(kind==="two"){ const a=R.nz(-5,5), b=R.nz(-5,5);
            const aT=`${sgnLn(a,"\\lvert x\\rvert",true)} ${b>0?"-":"+"} \\frac{${Math.abs(b)}}{x} + C`;
            return {prompt:`Evaluate $\\displaystyle\\int\\left(${kx(a)} ${b<0?"-":"+"} \\frac{${Math.abs(b)}}{x^2}\\right)dx$.`, answer:{answer:`${a}*ln(abs(x)) - ${b}/x + C`,vars:["x"],domain:NEG,plusC:true,consts:[]}, verify:{antideriv:`${a}/x + ${b}/x^2`},
              hint:"Write $\\frac{1}{x^2} = x^{-2}$ and use the power rule for that term. The $\\frac1x$ term is the one exception to the power rule.",
              steps:[`$\\int ${kx(a)}\\,dx = ${sgnLn(a,"\\lvert x\\rvert",true)}$`,`$\\int \\frac{${b}}{x^2}\\,dx = ${b}\\int x^{-2}\\,dx = ${b}\\cdot\\frac{x^{-1}}{-1} = ${-b<0?"-":""}\\frac{${Math.abs(b)}}{x}$`,`So the answer is $${aT}$.`], answerTeX:`$${aT}$`}; }
          const p=R.nz(-4,4), q=R.nz(-6,6);
          const aT=`${cT(p,2,"x^2",true)} ${sgnLn(q,"\\lvert x\\rvert")} + C`;
          return {prompt:`Evaluate $\\displaystyle\\int\\frac{${M.term(p,"x",2,true)}${M.term(q,"x",0)}}{x}\\,dx$.`, answer:{answer:`${p}/2*x^2 + ${q}*ln(abs(x)) + C`,vars:["x"],domain:NEG,plusC:true,consts:[]}, verify:{antideriv:`(${p}x^2+${q})/x`},
            hint:"Split the fraction into two terms first.",
            steps:[`Split: $\\frac{${M.term(p,"x",2,true)}${M.term(q,"x",0)}}{x} = ${M.term(p,"x",1,true)} ${q<0?"-":"+"} \\frac{${Math.abs(q)}}{x}$.`,`$\\int ${M.term(p,"x",1,true)}\\,dx = ${cT(p,2,"x^2",true)}$ and $\\int ${kx(q)}\\,dx = ${sgnLn(q,"\\lvert x\\rvert",true)}$.`,`So the answer is $${aT}$.`], answerTeX:`$${aT}$`};
        }
        const kind=R.pick(["loga","shift","mix"]);
        if(kind==="loga"){ const a=R.pick([2,3,5,10]), c=R.nz(-4,4);
          const aT=`${cc(c)}\\log_{${a}}(\\lvert x\\rvert) + C`;
          return {prompt:`Evaluate $\\displaystyle\\int\\frac{${c}}{x\\ln(${a})}\\,dx$.`, answer:{answer:`${c}*log_${a}(abs(x)) + C`,vars:["x"],domain:NEG,plusC:true,consts:[]}, verify:{antideriv:`${c}/(x*ln(${a}))`},
            hint:"From the table on p. 1: $\\int\\frac{1}{x\\ln(a)}\\,dx = \\log_a(\\lvert x\\rvert)+C$.",
            steps:[`Pull out the constant: $\\int\\frac{${c}}{x\\ln(${a})}\\,dx = ${c}\\int\\frac{1}{x\\ln(${a})}\\,dx$.`,`Table on p. 1: $= ${c}\\log_{${a}}(\\lvert x\\rvert) + C$.`], answerTeX:`$${aT}$`}; }
        if(kind==="shift"){ const c=R.nz(-4,4), k=R.nz(-5,5);
          const arg=`\\lvert x${M.pm(c)}\\rvert`;
          return {prompt:`Evaluate $\\displaystyle\\int\\frac{${k}}{x${M.pm(c)}}\\,dx$.`, answer:{answer:`${k}*ln(abs(x+${c})) + C`,vars:["x"],domain:[-c-3.5,-c-0.4],plusC:true,consts:[]}, verify:{antideriv:`${k}/(x+${c})`},
            hint:"Guess $\\ln(\\lvert x"+M.pm(c)+"\\rvert)$ and check its derivative with the chain rule. The inside has derivative 1.",
            steps:[`By the chain rule, $\\frac{d}{dx}\\ln(${arg}) = \\frac{1}{x${M.pm(c)}}\\cdot 1$ (for $x\\ne ${-c}$).`,`So $\\int\\frac{${k}}{x${M.pm(c)}}\\,dx = ${sgnLn(k,arg,true)} + C$.`,`Keep the absolute value: $\\frac{1}{x${M.pm(c)}}$ is defined for $x<${-c}$ too.`], answerTeX:`$${sgnLn(k,arg,true)} + C$`}; }
        const a=R.pick([2,3,5]), k=R.nz(-4,4);
        const aT=`\\frac{${a}^x}{\\ln(${a})} ${sgnLn(k,"\\lvert x\\rvert")} + C`;
        return {prompt:`Evaluate $\\displaystyle\\int\\left(${a}^x ${k<0?"-":"+"} ${kx(Math.abs(k))}\\right)dx$.`, answer:{answer:`${a}^x/ln(${a}) + ${k}*ln(abs(x)) + C`,vars:["x"],domain:NEG,plusC:true,consts:[]}, verify:{antideriv:`${a}^x + ${k}/x`},
          hint:"$\\int a^x\\,dx = \\frac{a^x}{\\ln(a)}+C$ (Lecture 10) and $\\int\\frac1x\\,dx = \\ln(\\lvert x\\rvert)+C$.",
          steps:[`$\\int ${a}^x\\,dx = \\frac{${a}^x}{\\ln(${a})}$`,`$\\int ${kx(k)}\\,dx = ${sgnLn(k,"\\lvert x\\rvert",true)}$`,`So the answer is $${aT}$.`], answerTeX:`$${aT}$`};
      }},
    {id:"L11.g.defint", title:"Definite integrals of $\\frac{k}{x}$", skill:"Evaluate $\\int_a^b\\frac{k}{x}\\,dx$, including negative limits", ref:"p. 2",
      gen(R,d){
        if(d===1){ let p, q; do{ p=R.pick([1,1,2,3,4]); q=R.pick([2,3,4,6,8,9]); }while(q<=p); const k=R.nz(-5,5);
          const r=F(q,p), val=k*Math.log(q/p);
          return {prompt:`Evaluate $\\displaystyle\\int_{${p}}^{${q}}${kx(k)}\\,dx$. Give the exact value.`, answer:{type:"num",answer:`${k}*(ln(${q}) - ln(${p}))`}, verify:{value:simpson(x=>k/x,p,q)},
            hint:"Antiderivative $k\\ln(\\lvert x\\rvert)$, then top limit minus bottom limit.",
            steps:[`$\\displaystyle\\int_{${p}}^{${q}}${kx(k)}\\,dx = \\Big[${cc(k)}\\ln(\\lvert x\\rvert)\\Big]_{${p}}^{${q}}$`,`$= ${cc(k)}\\left(\\ln(${q}) - \\ln(${p})\\right)$`+(p===1?` $= ${cc(k)}\\ln(${q})$ since $\\ln(1)=0$.`:` $= ${cc(k)}\\ln\\left(${Ft(r)}\\right)$`),`$\\approx ${val.toFixed(4)}$`],
            answerTeX:`$${cc(k)}\\ln\\left(${Ft(r)}\\right)$`}; }
        if(d===2){ let p, q; do{ p=R.int(1,4); q=R.int(2,8); }while(q<=p); const k=R.nz(-5,5);
          const val=k*(Math.log(p)-Math.log(q));
          return {prompt:`Evaluate $\\displaystyle\\int_{-${q}}^{-${p}}${kx(k,"t")}\\,dt$. Give the exact value.`, answer:{type:"num",answer:`${k}*(ln(${p}) - ln(${q}))`}, verify:{value:simpson(t=>k/t,-q,-p)},
            hint:"An antiderivative of $\\frac1t$ is $\\ln(\\lvert t\\rvert)$. Without the absolute value you would be taking $\\ln$ of a negative number.",
            steps:[`$\\displaystyle\\int_{-${q}}^{-${p}}${kx(k,"t")}\\,dt = \\Big[${cc(k)}\\ln(\\lvert t\\rvert)\\Big]_{-${q}}^{-${p}}$`,`$= ${cc(k)}\\left(\\ln(\\lvert -${p}\\rvert) - \\ln(\\lvert -${q}\\rvert)\\right) = ${cc(k)}\\left(\\ln(${p}) - \\ln(${q})\\right)$`,`$= ${cc(k)}\\ln\\left(${Ft(F(p,q))}\\right) \\approx ${val.toFixed(4)}$`+(p===1?` (here $\\ln(1)=0$, so it is $${cc(-k)}\\ln(${q})$)`:"")],
            answerTeX:`$${cc(k)}\\ln\\left(${Ft(F(p,q))}\\right)$`}; }
        if(R()<0.5){ const c=R.int(1,4), side=R.pick([-1,1]); let l, m; do{ l=R.int(1,3); m=R.int(2,5); }while(m<=l);
          const A=side<0?-c-m:-c+l, B=side<0?-c-l:-c+m;   // |A+c| and |B+c|
          const uA=Math.abs(A+c), uB=Math.abs(B+c), val=Math.log(uB)-Math.log(uA);
          return {prompt:`Evaluate $\\displaystyle\\int_{${A}}^{${B}}\\frac{1}{x+${c}}\\,dx$. Give the exact value.`, answer:{type:"num",answer:`ln(${uB}) - ln(${uA})`}, verify:{value:simpson(x=>1/(x+c),A,B)},
            hint:"An antiderivative of $\\frac{1}{x+"+c+"}$ is $\\ln(\\lvert x+"+c+"\\rvert)$. Check that $x=-"+c+"$ is not inside the interval.",
            steps:[`The interval $[${A}, ${B}]$ does not contain $x=-${c}$, so the integral is fine.`,`$\\displaystyle\\int_{${A}}^{${B}}\\frac{1}{x+${c}}\\,dx = \\Big[\\ln(\\lvert x+${c}\\rvert)\\Big]_{${A}}^{${B}} = \\ln(\\lvert ${B+c}\\rvert) - \\ln(\\lvert ${A+c}\\rvert)$`,`$= \\ln(${uB}) - \\ln(${uA})$`+(uB===1?` $= -\\ln(${uA})$`:uA===1?` $= \\ln(${uB})$`:"")+` $\\approx ${val.toFixed(4)}$`],
            answerTeX:`$\\ln(${uB}) - \\ln(${uA})$`}; }
        let p, q; do{ p=R.int(1,3); q=R.int(2,5); }while(q<=p);
        const val=Math.log(p)-Math.log(q)+1/p-1/q, fr=F(q-p,p*q);
        return {prompt:`Evaluate $\\displaystyle\\int_{-${q}}^{-${p}}\\left(\\frac{1}{x}+\\frac{1}{x^2}\\right)dx$. Give the exact value.`, answer:{type:"num",answer:`ln(${p}) - ln(${q}) + 1/${p} - 1/${q}`}, verify:{value:simpson(x=>1/x+1/(x*x),-q,-p)},
          hint:"Antiderivative $\\ln(\\lvert x\\rvert) - \\frac{1}{x}$. Be careful with the signs when you plug in negative numbers.",
          steps:[`An antiderivative is $\\ln(\\lvert x\\rvert) - \\frac1x$.`,`At $x=-${p}$: $\\ln(${p}) - \\frac{1}{-${p}} = \\ln(${p}) + \\frac{1}{${p}}$. At $x=-${q}$: $\\ln(${q}) + \\frac{1}{${q}}$.`,`Subtract: $\\ln(${p}) - \\ln(${q}) + \\frac{1}{${p}} - \\frac{1}{${q}} = \\ln\\left(${Ft(F(p,q))}\\right) + ${Ft(fr)} \\approx ${val.toFixed(4)}$`],
          answerTeX:`$\\ln\\left(${Ft(F(p,q))}\\right) + ${Ft(fr)}$`};
      }},
    {id:"L11.g.ivp", title:"Initial value problems with $\\ln(\\lvert x\\rvert)$", skill:"Solve $y' = \\frac{k}{x} + \\dots$ with a negative starting point", ref:"p. 2",
      gen(R,d){
        const x0=R()<0.75?-R.int(1,5):R.int(1,4), y0=R.int(-5,6), m=Math.abs(x0);
        const dom=x0<0?[-6,-0.3]:[0.3,6];
        const lnm=v=>`\\ln(\\lvert ${v}\\rvert)`;
        if(d===1){ let k=R.nz(-5,5); if(k===1&&x0===-2&&y0===4) k=2;
          const Cv=m===1?`${y0}`:`${y0} ${k>0?"-":"+"} ${Math.abs(k)===1?"":Math.abs(k)}\\ln(${m})`;
          const yT=`y = ${sgnLn(k,"\\lvert x\\rvert",true)} ${m===1?M.pm(y0):`${M.pm(y0)} ${k>0?"-":"+"} ${Math.abs(k)===1?"":Math.abs(k)}\\ln(${m})`}`;
          return {prompt:`Solve the initial value problem $y' = ${kx(k)}$, $y(${x0}) = ${y0}$.`, answer:{answer:`${k}*ln(abs(x)) + ${y0} - ${k}*ln(${m})`,vars:["x"],domain:dom}, verify:{antideriv:`${k}/x`},
            hint:"All solutions are $y=\\int "+kx(k)+"\\,dx$. Use $\\ln(\\lvert x\\rvert)$: the starting point "+(x0<0?"is negative":"may be anywhere")+".",
            steps:[`All solutions of the differential equation are given by $y = \\displaystyle\\int ${kx(k)}\\,dx = ${sgnLn(k,"\\lvert x\\rvert",true)} + C$.`,`The initial condition says that $y = ${y0}$ when $x = ${x0}$. Hence, $${y0} = ${cc(k)}${lnm(x0)} + C$.`,m===1?`$\\ln(1) = 0$, so $${y0} = C$.`:`$${lnm(x0)} = \\ln(${m})$, so $C = ${Cv}$.`,`Hence, the solution is $${yT}$.`],
            answerTeX:`$${yT}$`}; }
        if(d===2){ const k=R.nz(-4,4), b=R.nz(-4,4);
          // y' = k/x + b/x^2  ->  y = k ln|x| - b/x + C
          const atx0=`${k}${lnm(x0)} - \\frac{${b}}{${x0}}`;
          const Cn=y0 - k*Math.log(m) + b/x0;
          const cFr=F(y0*x0+b,x0); // y0 + b/x0 as a fraction
          const CT=`${Ft(cFr)}${k===0||m===1?"":` ${k>0?"-":"+"} ${Math.abs(k)===1?"":Math.abs(k)}\\ln(${m})`}`;
          const yT=`y = ${sgnLn(k,"\\lvert x\\rvert",true)} ${b>0?"-":"+"} \\frac{${Math.abs(b)}}{x} ${CT.startsWith("-")?"- "+CT.slice(1):"+ "+CT}`;
          return {prompt:`Solve the initial value problem $y' = ${kx(k)} ${b<0?"-":"+"} \\frac{${Math.abs(b)}}{x^2}$, $y(${x0}) = ${y0}$.`, answer:{answer:`${k}*ln(abs(x)) - ${b}/x + ${y0} + ${b}/(${x0}) - ${k}*ln(${m})`,vars:["x"],domain:dom}, verify:{antideriv:`${k}/x + ${b}/x^2`},
            hint:"Integrate each term ($\\frac{1}{x^2}=x^{-2}$), then plug in the starting point. Watch the signs.",
            steps:[`All solutions of the differential equation are given by $y = \\displaystyle\\int\\left(${kx(k)} ${b<0?"-":"+"} \\frac{${Math.abs(b)}}{x^2}\\right)dx = ${sgnLn(k,"\\lvert x\\rvert",true)} ${b>0?"-":"+"} \\frac{${Math.abs(b)}}{x} + C$.`,`The initial condition says that $y = ${y0}$ when $x = ${x0}$. Hence, $${y0} = ${atx0} + C$.`,`$-\\frac{${b}}{${x0}} = ${Ft(F(-b,x0))}$${m===1?" and $\\ln(1)=0$":""}, so $C = ${CT}$.`,`Hence, the solution is $${yT}$.`],
            answerTeX:`$${yT}$`}; }
        const a=R.pick([2,3,5]), j=R.int(0,2), c=R.nz(-3,3), sgn=x0<0?-1:1, X=sgn*Math.pow(a,j);
        const dom3=X<0?[-30,-0.3]:[0.3,30];
        const Cv=y0-c*j;
        const yT=`y = ${cc(c)}\\log_{${a}}(\\lvert x\\rvert) ${M.pm(Cv)}`;
        return {prompt:`Solve the initial value problem $y' = \\frac{${c}}{x\\ln(${a})}$, $y(${X}) = ${y0}$.`, answer:{answer:`${c}*log_${a}(abs(x)) + ${Cv}`,vars:["x"],domain:dom3}, verify:{antideriv:`${c}/(x*ln(${a}))`},
          hint:"$\\int\\frac{1}{x\\ln(a)}\\,dx = \\log_a(\\lvert x\\rvert)+C$.",
          steps:[`All solutions of the differential equation are given by $y = \\displaystyle\\int\\frac{${c}}{x\\ln(${a})}\\,dx = ${cc(c)}\\log_{${a}}(\\lvert x\\rvert) + C$.`,`The initial condition says that $y = ${y0}$ when $x = ${X}$. Hence, $${y0} = ${c}\\log_{${a}}(\\lvert ${X}\\rvert) + C = ${c}\\cdot ${j} + C$.`,`So $C = ${Cv}$.`,`Hence, the solution is $${yT}$.`],
          answerTeX:`$${yT}$`};
      }},
    {id:"L11.g.richter", title:"The Richter scale", skill:"Compare earthquakes with $M_L=\\log_{10}\\left(\\frac{A}{A_0}\\right)$", ref:"pp. 3 to 4",
      gen(R,d){
        const setup=(M1,M2)=>[`Let $A_1$ and $A_2$ be the maximum amplitudes. From $M_L=\\log_{10}\\left(\\frac{A}{A_0}\\right)$: $\\log_{10}\\left(\\frac{A_1}{A_0}\\right) = ${M1}$ and $\\log_{10}\\left(\\frac{A_2}{A_0}\\right) = ${M2}$.`,`By the definition of $\\log_{10}$: $A_1 = A_0\\cdot 10^{${M1}}$ and $A_2 = A_0\\cdot 10^{${M2}}$.`,`$\\frac{A_1}{A_2} = \\frac{10^{${M1}}}{10^{${M2}}} = 10^{${sup(M1-M2)}}$ (the $A_0$ cancels).`];
        if(d===1){ const dd=R.int(1,4), M2=R.pick([2,2.5,3,3.5,4,4.5,5]), M1=M2+dd;
          if(R()<0.7) return {prompt:`How many times larger is the maximum amplitude of a magnitude ${M1} earthquake than that of a magnitude ${M2} earthquake?`, answer:{type:"num",rel:1e-6,answer:Math.pow(10,dd)},
            hint:"Each step of 1 on the Richter scale multiplies the maximum amplitude by 10.",
            steps:setup(M1,M2).concat([`$10^{${dd}} = ${Math.pow(10,dd)}$, so it is ${Math.pow(10,dd)} times larger.`]), answerTeX:`$${Math.pow(10,dd)}$ times`};
          return {prompt:`The maximum amplitude of a magnitude ${M2} earthquake is what fraction of the maximum amplitude of a magnitude ${M1} earthquake?`, answer:{type:"num",rel:1e-6,answer:`1/${Math.pow(10,dd)}`},
            hint:"Going down 1 on the Richter scale divides the maximum amplitude by 10.",
            steps:setup(M2,M1).concat([`$10^{-${dd}} = \\frac{1}{${Math.pow(10,dd)}}$.`]), answerTeX:`$\\frac{1}{${Math.pow(10,dd)}}$`}; }
        if(d===2){ const k=R.int(1,4), dd=k+0.5, M2=R.pick([2,2.5,3,3.5,4]), M1=M2+dd, P=Math.pow(10,k);
          const pool=[[`${dd} times`,0],[`${P.toLocaleString("en-CA")} times`,0],[`${(dd*P).toLocaleString("en-CA")} times`,0],[`${(5*P).toLocaleString("en-CA")} times`,0],[`${(10*P).toLocaleString("en-CA")} times`,0]];
          const pick=R.shuffle(pool).slice(0,4).concat([[`${(3*P).toLocaleString("en-CA")} times`,1]]);
          const uniq=[...new Map(pick.map(o=>[o[0],o])).values()];
          const opts=uniq.sort((u,v)=>parseFloat(u[0].replace(/,/g,""))-parseFloat(v[0].replace(/,/g,"")));
          return {prompt:`Approximately how many times larger is the maximum amplitude of a magnitude ${M1} earthquake than that of a magnitude ${M2} earthquake? Select the best answer.`,
            parts:[{answer:{type:"mc",options:opts.map(o=>o[0]),correct:opts.findIndex(o=>o[1]),keep:true}}],
            hint:"The difference is "+dd+". Split $10^{"+dd+"} = 10^{"+k+"}\\cdot 10^{0.5}$ and use $\\sqrt{10}\\approx 3$.",
            steps:setup(M1,M2).concat([`$10^{${dd}} = 10^{${k}}\\cdot 10^{0.5} = ${P.toLocaleString("en-CA")}\\sqrt{10}$.`,`$\\sqrt{10}\\approx 3$, so this is about $${(3*P).toLocaleString("en-CA")}$ times. (Exactly, $10^{${dd}}\\approx ${Math.round(Math.pow(10,dd)).toLocaleString("en-CA")}$.)`]),
            answerTeX:`About ${(3*P).toLocaleString("en-CA")} times`}; }
        if(R()<0.5){ const k=R.int(1,4), M2=R.pick([2.1,2.4,3.2,3.6,4.3,1.8]), M1=+(M2+k).toFixed(1), P=Math.pow(10,k);
          return {prompt:`An earthquake has ${P.toLocaleString("en-CA")} times the maximum amplitude of a magnitude ${M2} earthquake measured at the same distance. What is its magnitude?`, answer:{type:"num",rel:1e-6,answer:M1,tol:1e-6},
            hint:"Write $A_1 = "+P+"A_2$ and use the product rule for logs.",
            steps:[`$A_1 = ${P}A_2$, so $M_1 = \\log_{10}\\left(\\frac{${P}A_2}{A_0}\\right) = \\log_{10}(${P}) + \\log_{10}\\left(\\frac{A_2}{A_0}\\right)$.`,`$\\log_{10}(${P}) = ${k}$ and $\\log_{10}\\left(\\frac{A_2}{A_0}\\right) = ${M2}$.`,`So $M_1 = ${k} + ${M2} = ${M1}$.`], answerTeX:`Magnitude $${M1}$`}; }
        const k=R.int(1,4), dd=k+0.5, M2=R.pick([2,3,3.5,4]), M1=M2+dd;
        return {prompt:`Find the exact value of $\\frac{A_1}{A_2}$, where $A_1$ is the maximum amplitude of a magnitude ${M1} earthquake and $A_2$ that of a magnitude ${M2} earthquake. Write it as a power of 10 or as a whole number times $\\sqrt{10}$.`, answer:{type:"num",rel:1e-6,answer:`10^(${dd})`},
          hint:"Solve each Richter equation for $A$, then divide.",
          steps:setup(M1,M2).concat([`$10^{${dd}} = 10^{${k}}\\sqrt{10}\\approx ${Math.round(Math.pow(10,dd)).toLocaleString("en-CA")}$.`]), answerTeX:`$10^{${dd}} = ${Math.pow(10,k)}\\sqrt{10}$`};
      }},
    {id:"L11.g.db", title:"Decibels", skill:"Solve $D = 10\\log_{10}\\left(\\frac{I}{10^{-12}}\\right)$ for $I$ and compare sounds", ref:"pp. 3 to 4",
      gen(R,d){
        const chain=(D,i)=>{ const e=D/10; return [`$${D} = 10\\log_{10}\\left(\\frac{I_${i}}{10^{-12}}\\right)$`,`$${sup(e)} = \\log_{10}\\left(\\frac{I_${i}}{10^{-12}}\\right)$ (divide by 10)`,`$10^{${sup(e)}} = \\frac{I_${i}}{10^{-12}}$ (definition of $\\log_{10}$)`,`$I_${i} = 10^{${sup(e)}}\\cdot 10^{-12} = 10^{${sup(e-12)}}$ W/m²`]; };
        if(d===1){
          if(R()<0.7){ const D=R.int(2,13)*10, e=D/10-12;
            return {prompt:`The loudness of a sound is $D = 10\\log_{10}\\left(\\frac{I}{10^{-12}}\\right)$ decibels, where $I$ is the intensity in W/m². Find the intensity of a sound that measures ${D} decibels.`, answer:{type:"num",rel:1e-6,answer:`10^(${e})`},
              hint:"Divide by 10, then undo $\\log_{10}$: $\\log_{10}(u)=v$ means $u = 10^v$.",
              steps:chain(D,1).map(s=>s.replace(/I_1/g,"I")), answerTeX:`$I = 10^{${e}}$ W/m²`}; }
          const e=R.int(2,10), D=10*(12-e);
          return {prompt:`A sound has intensity $I = 10^{-${e}}$ W/m². How many decibels is it? Use $D = 10\\log_{10}\\left(\\frac{I}{10^{-12}}\\right)$.`, answer:{type:"num",rel:1e-6,answer:D},
            hint:"Simplify the fraction with exponent rules first: $\\frac{10^{-"+e+"}}{10^{-12}} = 10^{-"+e+"+12}$.",
            steps:[`$\\frac{10^{-${e}}}{10^{-12}} = 10^{-${e}-(-12)} = 10^{${12-e}}$`,`$\\log_{10}(10^{${12-e}}) = ${12-e}$`,`$D = 10\\cdot ${12-e} = ${D}$ decibels`], answerTeX:`$${D}$ dB`}; }
        if(d===2){
          if(R()<0.5){ const D=R.int(2,13)*10+5, e=D/10-12;
            return {prompt:`Using $D = 10\\log_{10}\\left(\\frac{I}{10^{-12}}\\right)$ decibels, find the intensity $I$ (in W/m²) of a sound that measures ${D} decibels.`, answer:{type:"num",rel:1e-6,answer:`10^(${e})`},
              hint:"Same steps as always: divide by 10, undo the $\\log_{10}$, multiply by $10^{-12}$.",
              steps:chain(D,1).map(s=>s.replace(/I_1/g,"I")), answerTeX:`$I = 10^{${sup(e)}}$ W/m²`}; }
          let D1,D2; do{ D1=R.int(4,14)*10; D2=R.int(1,10)*10; }while(D1<=D2);
          const r=(D1-D2)/10;
          return {prompt:`How many times more intense is a sound that measures $D_1 = ${D1}$ decibels than a sound that measures $D_2 = ${D2}$ decibels?`, answer:{type:"num",tol:0.5,answer:Math.pow(10,r)},
            hint:"Find each intensity first, then divide: $\\frac{I_1}{I_2}$.",
            steps:chain(D1,1).concat(chain(D2,2)).concat([`$\\frac{I_1}{I_2} = \\frac{10^{${sup(D1/10-12)}}}{10^{${sup(D2/10-12)}}} = 10^{${r}} = ${Math.pow(10,r).toLocaleString("en-CA")}$`]), answerTeX:`$10^{${r}} = ${Math.pow(10,r).toLocaleString("en-CA")}$ times`}; }
        let D1,D2; do{ D1=R.int(6,14)*10+R.pick([0,5]); D2=R.int(2,11)*10+R.pick([0,5]); }while(D1-D2<15 || ((D1-D2)/10)%1===0);
        const r=(D1-D2)/10, k=Math.floor(r), P=Math.pow(10,k);
        const pool=[`${(r*P).toLocaleString("en-CA")} times`,`${P.toLocaleString("en-CA")} times`,`${(5*P).toLocaleString("en-CA")} times`,`${(10*P).toLocaleString("en-CA")} times`];
        const opts=[...new Set(R.shuffle(pool).slice(0,3).concat([`${(3*P).toLocaleString("en-CA")} times`]))].sort((u,v)=>parseFloat(u.replace(/,/g,""))-parseFloat(v.replace(/,/g,"")));
        return {prompt:`Sound 1 measures $D_1 = ${D1}$ decibels and sound 2 measures $D_2 = ${D2}$ decibels.`,
          parts:[{label:"Exact value of $\\frac{I_1}{I_2}$ (a power of 10)",answer:{type:"num",tol:0.5,answer:`10^(${r})`}},{label:"About how many times more intense is sound 1?",answer:{type:"mc",options:opts,correct:opts.indexOf(`${(3*P).toLocaleString("en-CA")} times`),keep:true}}],
          hint:"Find each intensity, divide, then split off $10^{0.5}=\\sqrt{10}\\approx 3$.",
          steps:chain(D1,1).concat(chain(D2,2)).concat([`$\\frac{I_1}{I_2} = \\frac{10^{${sup(D1/10-12)}}}{10^{${sup(D2/10-12)}}} = 10^{${r}}$`,`$10^{${r}} = 10^{${k}}\\cdot 10^{0.5} = ${P.toLocaleString("en-CA")}\\sqrt{10}\\approx ${(3*P).toLocaleString("en-CA")}$`]),
          answerTeX:`$10^{${r}}$, about ${(3*P).toLocaleString("en-CA")} times more intense`};
      }},
    {id:"L11.g.err", title:"Find the mistake", skill:"Error analysis: $\\ln(\\lvert x\\rvert)$, $+C$, brackets and decibels", ref:"pp. 1 to 4",
      gen(R,d){
        if(d===1){ const k=R.nz(-6,6), m=R.nz(-5,5), n=R.int(1,3);
          const body=`${cT(m,n+1,`x^{${n+1}}`)}`;
          const opts=R.shuffle([[`$${sgnLn(k,"\\lvert x\\rvert",true)} ${body} + C$`,1],[`$${sgnLn(k,"x",true)} ${body} + C$`,0],[`$${sgnLn(k,"\\lvert x\\rvert",true)} ${body}$`,0]]);
          return {prompt:`Three students evaluated $\\displaystyle\\int\\left(${kx(k)} ${M.term(m,"x",n)}\\right)dx$. Which answer would get full marks?`,
            parts:[{answer:{type:"mc",options:opts.map(o=>o[0]),correct:opts.findIndex(o=>o[1])}}],
            hint:"Check two things: the absolute value inside $\\ln$, and the $+C$.",
            steps:[`$\\int\\frac{1}{x}\\,dx = \\ln(\\lvert x\\rvert)+C$. The absolute value is needed because $\\frac1x$ is defined for $x<0$ too (p. 2).`,`An indefinite integral needs $+C$.`,`So the full-marks answer is $${sgnLn(k,"\\lvert x\\rvert",true)} ${body} + C$.`],
            answerTeX:`$${sgnLn(k,"\\lvert x\\rvert",true)} ${body} + C$`}; }
        const yesno=R()<0.3;
        const wrap=(prob,good,bad,at,why,okWhy)=>{
          if(yesno){ const showBad=R()<0.6;
            return {prompt:`Is the provided answer to the following problem correct?<br>Problem: ${prob}<br>Answer:${lines(showBad?bad:good)}`,
              parts:[{answer:{type:"mc",options:["Yes, the solution is correct.","No, the solution is not correct."],correct:showBad?1:0,keep:true}}],
              hint:"Check every line, including notation: brackets, $dx$, absolute values and $+C$.",
              steps:showBad?[`Line (${at}) is wrong. ${why}`,`The correct work is:${lines(good)}`]:[`Every line is right. ${okWhy}`], answerTeX:showBad?"No, the solution is not correct.":"Yes, the solution is correct."}; }
          return {prompt:`A problem and answer are shown below. The answer would not get a perfect score. Select the first line that has a mistake.<br>Problem: ${prob}<br>Answer:${lines(bad)}`,
            parts:[{answer:{type:"mc",options:bad.map((t,i)=>`(${i+1})`),correct:at-1,keep:true}}],
            hint:"Graders take marks off for notation too: a missing $dx$, a missing \"$y =$\", missing brackets or a missing absolute value.",
            steps:[`The first mistake is in line (${at}). ${why}`,`The correct work is:${lines(good)}`], answerTeX:`Line (${at})`};
        };
        const kind=d===2?R.pick(["ivp","der"]):R.pick(["ivp","der","db"]);
        if(kind==="ivp"){ const k=R.int(2,6), m=R.int(2,5), y0=R.int(1,6);
          const good=[`y = \\int\\frac{${k}}{x}\\,dx`,`= ${k}\\ln(\\lvert x\\rvert) + C`,`${y0} = ${k}\\ln(\\lvert -${m}\\rvert) + C`,`${y0} - ${k}\\ln(${m}) = C`,`y = ${k}\\ln(\\lvert x\\rvert) + ${y0} - ${k}\\ln(${m})`];
          const at=R.pick([1,2,4,5]); let bad=good.slice(), why;
          if(at===1){ bad[0]=`y = \\int\\frac{${k}}{x}`; why="The integral has no $dx$. Write $y = \\int\\frac{"+k+"}{x}\\,dx$."; }
          if(at===2){ bad=[good[0],`= ${k}\\ln(x) + C`,`${y0} = ${k}\\ln(-${m}) + C`,`${y0} - ${k}\\ln(-${m}) = C`,`y = ${k}\\ln(x) + ${y0} - ${k}\\ln(-${m})`]; why="The antiderivative of $\\frac1x$ is $\\ln(\\lvert x\\rvert)$. Without the absolute value, the next line takes $\\ln$ of a negative number, which is not defined."; }
          if(at===4){ bad[3]=`${y0} + ${k}\\ln(${m}) = C`; bad[4]=`y = ${k}\\ln(\\lvert x\\rvert) + ${y0} + ${k}\\ln(${m})`; why=`To get $C$ alone, subtract $${k}\\ln(${m})$ from both sides: $C = ${y0} - ${k}\\ln(${m})$.`; }
          if(at===5){ bad[4]=`= ${k}\\ln(\\lvert x\\rvert) + ${y0} - ${k}\\ln(${m})`; why="The last line has to say what is equal to what. The solution is a function $y$: write \"$y =$\". Starting the line with \"=\" makes it equal to the line above, which is $C$."; }
          return wrap(`Solve the initial value problem $y' = \\frac{${k}}{x}$, $y(-${m}) = ${y0}$.`,good,bad,at,why,"The absolute value is kept, $C$ is found correctly and the answer is written as $y = \\dots$.");
        }
        if(kind==="der"){ const mm=R.pick([1,2,3]), c=R.int(1,9);
          const q=`x^2+${c}`, xm=mm===1?"x":`x^{${mm}}`, dxm=mm===1?"1":mm===2?"2x":`${mm}x^{${mm-1}}`, top=mm===1?"2x^2":`2x^{${mm+1}}`;
          const good=[`g'(x) = (${xm})'\\ln(${q}) + ${xm}\\left(\\ln(${q})\\right)'`,`= ${dxm}\\cdot\\ln(${q}) + ${xm}\\cdot\\frac{1}{${q}}\\cdot(2x)`,`= ${dxm==="1"?"":dxm}\\ln(${q}) + \\frac{${top}}{${q}}`];
          const at=R.int(1,3); let bad=good.slice(), why;
          if(at===1){ bad=[`g'(x) = (${xm})'\\left(\\ln(${q})\\right)'`,`= ${dxm}\\cdot\\frac{1}{${q}}\\cdot(2x)`,`= \\frac{${mm===1?"2x":`${2*mm}x^{${mm}}`}}{${q}}`]; why="The product rule is $(fg)' = f'g + fg'$, not $f'g'$."; }
          if(at===2){ if(R()<0.5){ bad[1]=`= ${dxm}\\cdot\\ln(${q}) + ${xm}\\cdot\\frac{1}{${q}}`; bad[2]=`= ${dxm==="1"?"":dxm}\\ln(${q}) + \\frac{${xm}}{${q}}`; why="The chain rule factor is missing: $\\frac{d}{dx}\\ln("+q+") = \\frac{1}{"+q+"}\\cdot 2x$."; }
                      else { bad[1]=`= ${dxm}\\cdot\\ln(${q}) + ${xm}\\cdot 1/x^2+${c}\\cdot 2x`; why="Missing brackets: $1/x^2+"+c+"$ means $\\frac{1}{x^2}+"+c+"$. It must be written $\\frac{1}{"+q+"}$ or $1/("+q+")$. Graders take marks off for this even when the next line is right."; } }
          if(at===3){ bad[2]=`= ${dxm==="1"?"":dxm}\\ln(${q}) + \\frac{2x^{${mm}}}{${q}}`; why=`$${xm}\\cdot 2x = ${top}$, not $2x^{${mm}}$.`; }
          return wrap(`Find the derivative of $g(x) = ${xm}\\ln(${q})$.`,good,bad,at,why,"Product rule, then the chain rule with brackets, then simplify.");
        }
        const e=R.int(5,13), D=10*e;
        const good=[`${D} = 10\\log_{10}\\left(\\frac{I}{10^{-12}}\\right)`,`${e} = \\log_{10}\\left(\\frac{I}{10^{-12}}\\right)`,`10^{${e}} = \\frac{I}{10^{-12}}`,`10^{${e}}\\cdot 10^{-12} = I`,`10^{${e-12}} = I`];
        const at=R.int(2,5); let bad=good.slice(), why;
        if(at===2){ bad=[good[0],`${D-10} = \\log_{10}\\left(\\frac{I}{10^{-12}}\\right)`,`10^{${D-10}} = \\frac{I}{10^{-12}}`,`10^{${D-10}}\\cdot 10^{-12} = I`,`10^{${D-22}} = I`]; why="To undo the factor 10, divide both sides by 10. Subtracting 10 is wrong."; }
        if(at===3){ bad=[good[0],good[1],`e^{${e}} = \\frac{I}{10^{-12}}`,`e^{${e}}\\cdot 10^{-12} = I`,`I = e^{${e}}\\cdot 10^{-12}`]; why="The log is base 10, so $\\log_{10}(u) = "+e+"$ means $u = 10^{"+e+"}$, not $e^{"+e+"}$."; }
        if(at===4){ bad=[good[0],good[1],good[2],`\\frac{10^{${e}}}{10^{-12}} = I`,`10^{${e+12}} = I`]; why="To get $I$ alone, multiply both sides by $10^{-12}$, do not divide."; }
        if(at===5){ bad[4]=`10^{${-12*e}} = I`; why="When you multiply powers of 10 you add the exponents: $10^{"+e+"}\\cdot10^{-12} = 10^{"+(e-12)+"}$."; }
        return wrap(`Using $D = 10\\log_{10}\\left(\\frac{I}{10^{-12}}\\right)$, find the intensity $I$ of a sound that measures ${D} decibels.`,good,bad,at,why,"Divide by 10, undo $\\log_{10}$, multiply by $10^{-12}$, add exponents.");
      }}
  ],
  exam:[
    {id:"L11.q1", ref:"p. 1", q:"$\\frac{d}{dx}\\log_3(x) = $", opts:[
      ["$\\frac{1}{x\\ln(3)}$",1,"From the table on p. 1."],
      ["$\\frac{1}{x}$",0,"That is the derivative of $\\ln(x)$ only. For base 3 you divide by $\\ln(3)$."],
      ["$\\frac{\\ln(3)}{x}$",0,"$\\ln(3)$ goes in the denominator."],
      ["$3^x\\ln(3)$",0,"That is the derivative of $3^x$."]]},
    {id:"L11.q2", ref:"p. 2", q:"Which answer to $\\int\\frac{1}{x}\\,dx$ would get full marks?", opts:[
      ["$\\ln(\\lvert x\\rvert) + C$",1,"Absolute value and $+C$ (pp. 1 to 2)."],
      ["$\\ln(x) + C$",0,"Missing the absolute value. $\\ln(x)$ does not exist for $x<0$, but $\\frac1x$ does."],
      ["$\\ln(\\lvert x\\rvert)$",0,"Missing $+C$."],
      ["$-\\frac{1}{x^2} + C$",0,"That is the derivative of $\\frac1x$, not an antiderivative."]]},
    {id:"L11.q3", ref:"p. 1", q:"$\\frac{d}{dx}\\ln(5x) = $", opts:[
      ["$\\frac{1}{x}$",1,"Chain rule: $\\frac{1}{5x}\\cdot 5 = \\frac1x$. Or: $\\ln(5x) = \\ln(5)+\\ln(x)$, and $\\ln(5)$ is a constant."],
      ["$\\frac{5}{x}$",0,"The 5 from the chain rule cancels with the 5 in $5x$."],
      ["$\\frac{1}{5x}$",0,"Missing the chain rule factor 5."],
      ["$\\frac{\\ln(5)}{x}$",0,"$\\ln(5)$ is a constant term, so its derivative is 0."]]},
    {id:"L11.q4", ref:"p. 2", multi:true, q:"Select all of the functions that are antiderivatives of $\\frac{1}{x}$ on the interval $(-\\infty,0)$.", opts:[
      ["$\\ln(\\lvert x\\rvert)$",1,"Its derivative is $\\frac1x$ for every $x\\ne0$."],
      ["$\\ln(-x)$",1,"For $x<0$, $\\lvert x\\rvert = -x$. Chain rule: $\\frac{1}{-x}\\cdot(-1) = \\frac1x$."],
      ["$\\ln(x)$",0,"Not defined for $x<0$."],
      ["$\\ln(\\lvert x\\rvert) + 7$",1,"Adding a constant does not change the derivative."]]},
    {id:"L11.q5", ref:"p. 3", q:"Approximately how many times larger is the maximum amplitude of a magnitude 5.5 earthquake than that of a magnitude 3 earthquake? Select the best answer.", opts:[
      ["2.5 times",0,"The scale is logarithmic: a difference of 2.5 is a factor of $10^{2.5}$."],
      ["25 times",0,"$10^{2.5}$ is not $2.5\\cdot 10$."],
      ["250 times",0,"$2.5\\cdot 100$ mixes up the exponent and the multiplier."],
      ["300 times",1,"$10^{2.5} = 100\\sqrt{10}\\approx 100\\cdot 3 = 300$."],
      ["1000 times",0,"That would be a difference of 3."]]},
    {id:"L11.q6", ref:"p. 3", q:"With $D = 10\\log_{10}\\left(\\frac{I}{10^{-12}}\\right)$, what is the intensity of an 80 decibel sound?", opts:[
      ["$10^{-4}$ W/m²",1,"$8 = \\log_{10}\\left(\\frac{I}{10^{-12}}\\right)$, so $I = 10^8\\cdot10^{-12} = 10^{-4}$."],
      ["$10^{8}$ W/m²",0,"That is $\\frac{I}{10^{-12}}$; you still multiply by $10^{-12}$."],
      ["$10^{-96}$ W/m²",0,"Multiplying powers of 10 adds exponents: $8 + (-12) = -4$."],
      ["$e^8\\cdot 10^{-12}$ W/m²",0,"The log is base 10, so undo it with $10^{(\\cdot)}$, not $e^{(\\cdot)}$."]]},
    {id:"L11.q7", ref:"pp. 3 to 4", q:"How many times more intense is a 75 decibel sound than a 55 decibel sound?", opts:[
      ["100 times",1,"$I_1 = 10^{-4.5}$ and $I_2 = 10^{-6.5}$, so $\\frac{I_1}{I_2} = 10^{2} = 100$."],
      ["20 times",0,"Decibels are a log scale; a gap of 20 dB is a factor of $10^{20/10}$."],
      ["$10^{20}$ times",0,"Divide the gap by 10 first: $D = 10\\log_{10}(\\dots)$."],
      ["$\\frac{75}{55}$ times",0,"Ratios of decibel readings mean nothing; compare the intensities."]]},
    {id:"L11.q8", ref:"p. 2", keep:true, q:"The answer below would not get a perfect score. Select the first line with a mistake.<br>Problem: Solve the initial value problem $y' = \\frac{2}{x}$, $y(-e) = 5$.<br>Answer:$$y = \\int\\frac{2}{x}\\,dx\\qquad(1)$$$$= 2\\ln(\\lvert x\\rvert) + C\\qquad(2)$$$$5 = 2\\ln(-e) + C\\qquad(3)$$$$5 = 2 + C\\qquad(4)$$$$y = 2\\ln(\\lvert x\\rvert) + 3\\qquad(5)$$", opts:[
      ["(1)",0,"Correct, with the $dx$."],
      ["(2)",0,"Correct, with the absolute value."],
      ["(3)",1,"It should be $5 = 2\\ln(\\lvert -e\\rvert) + C$. $\\ln(-e)$ is not defined. The bars were dropped too early."],
      ["(4)",0,"This uses $\\ln(e)=1$, which is what (3) should have said."],
      ["(5)",0,"The final answer is right, but (3) is already wrong."]]},
    {id:"L11.q9", ref:"p. 1", q:"True or false: $\\frac{d}{dx}\\ln(x^2+1) = \\frac{1}{x^2+1}$.", opts:[
      ["False",1,"Chain rule: $\\frac{1}{x^2+1}\\cdot 2x = \\frac{2x}{x^2+1}$."],
      ["True",0,"You need to multiply by the derivative of the inside, $2x$."]]},
    {id:"L11.q10", ref:"p. 2", q:"Using $\\text{pH} = -\\log_{10}([H^+])$ (from the course notes), how does the $[H^+]$ of a substance with pH 3 compare to one with pH 5?", opts:[
      ["It is 100 times larger.",1,"$[H^+] = 10^{-3}$ vs $10^{-5}$: the ratio is $10^2$."],
      ["It is 100 times smaller.",0,"Lower pH means more acidic, so more $H^+$."],
      ["It is 2 times larger.",0,"pH is a log scale: a gap of 2 is a factor of $10^2$."],
      ["It is $\\frac35$ as large.",0,"Ratios of the readings mean nothing on a log scale."]]},
    {id:"L11.q11", ref:"p. 2", q:"$\\displaystyle\\int_{-4}^{-2}\\frac{1}{x}\\,dx = $", opts:[
      ["$-\\ln(2)$",1,"$\\ln(\\lvert -2\\rvert) - \\ln(\\lvert -4\\rvert) = \\ln(2) - \\ln(4) = -\\ln(2)$. Negative, as it should be: $\\frac1x<0$ on $[-4,-2]$."],
      ["$\\ln(2)$",0,"Check the sign: the integrand is negative on the whole interval."],
      ["Not defined, because $\\ln$ of a negative number is not defined",0,"The antiderivative is $\\ln(\\lvert x\\rvert)$, which is fine for negative $x$."],
      ["$\\ln(6)$",0,"Subtracting logs divides the inputs."]]},
    {id:"L11.q12", ref:"p. 1", keep:true, q:"Is the provided answer correct?<br>Problem: Find the derivative of $f(x) = x\\ln(x^2+4)$.<br>Answer: By the product and chain rules, $f'(x) = 1\\cdot\\ln(x^2+4) + x\\cdot\\frac{1}{x^2+4}\\cdot(2x) = \\ln(x^2+4) + \\frac{2x^2}{x^2+4}$.", opts:[
      ["Yes, the solution is correct.",1,"Product rule, chain rule with brackets, and correct simplification."],
      ["No, the solution is not correct.",0,"Every step checks out: $x\\cdot 2x = 2x^2$."]]}
  ],
  steps:[
    {type:"read", title:"Derivatives of logarithms", body:`<p>Two more derivatives to memorize (p. 1):</p>$$\\frac{d}{dx}\\ln(x) = \\frac{1}{x}\\qquad\\qquad \\frac{d}{dx}\\log_a(x) = \\frac{1}{x\\ln(a)}$$<p>The first one connects to Lecture 10. There, $\\ln(x)=\\int_1^x\\frac1t\\,dt$. By the Fundamental Theorem of Calculus (Lecture 8), its derivative is the integrand at $x$: $\\frac1x$.</p><div class="box"><b class="t">Example (p. 1)</b>$f(x)=\\log_2(x)$ gives $f'(x) = \\frac{1}{x\\ln(2)}$.</div><div class="box warn"><b class="t">About the exercise on p. 1</b>The exercise $f(x)=\\ln(x-e^x)$ has no domain: $x-e^x$ is negative for every $x$, so $\\ln$ of it never exists. See the flag. Practise the rules on $\\ln(e^x-x)$ instead: its derivative is $\\frac{e^x-1}{e^x-x}$.</div>`, ref:"p. 1"},
    {type:"example", title:"Product rule with ln", ex:{q:"Find the derivative of $g(x) = x\\ln(x^2+1)$.", ref:"p. 1",
      steps:[{t:"$g'(x) = 1\\cdot\\ln(x^2+1) + x\\cdot\\frac{d}{dx}\\ln(x^2+1)$",why:"Product rule with the factors $x$ and $\\ln(x^2+1)$."},
        {t:"$\\frac{d}{dx}\\ln(x^2+1) = \\frac{1}{x^2+1}\\cdot(2x+0)$",why:"Chain rule: outside $\\ln(u)$ has derivative $\\frac1u$; inside $u=x^2+1$ has derivative $2x$."},
        {t:"$g'(x) = \\ln(x^2+1) + x\\cdot\\frac{1}{x^2+1}\\cdot(2x+0)$",why:"Put the pieces together. Keep the brackets around $(2x+0)$."},
        {t:"$= \\ln(x^2+1) + \\frac{2x^2}{x^2+1}$",why:"$x\\cdot 2x = 2x^2$."}],
      ans:"$g'(x) = \\ln(x^2+1) + \\dfrac{2x^2}{x^2+1}$"}},
    {type:"try", title:"Your turn: derivatives with logs", gen:"L11.g.dlog"},
    {type:"read", title:"Integrals that give logarithms", body:`<p>Read the derivative table backwards and you get two integrals to memorize (p. 1):</p>$$\\int\\frac{1}{x}\\,dx = \\ln(\\lvert x\\rvert)+C\\qquad\\qquad \\int\\frac{1}{x\\ln(a)}\\,dx = \\log_a(\\lvert x\\rvert)+C$$<div class="box warn"><b class="t">Warning (p. 2)</b>Do not forget the absolute values. $\\frac1x$ is defined on $(-\\infty,0)$ and $(0,\\infty)$, but $\\ln(x)$ only exists for $x>0$. $\\ln(\\lvert x\\rvert)$ covers both pieces, so the antiderivative has the same domain as the function you started with.</div><p>This is also the one gap in the power rule for integrals: $\\int x^n\\,dx = \\frac{x^{n+1}}{n+1}+C$ fails for $n=-1$ because you would divide by 0. $\\ln(\\lvert x\\rvert)$ fills that gap.</p>`, ref:"pp. 1 to 2"},
    {type:"explore", title:"Two branches, one slope rule", fig:"lnabs", body:`<p><b>Try it.</b> Drag the point to $x=-2$. The tangent slope reads $-0.5$, which is $\\frac{1}{-2}$. Drag it to $x=2$: the slope is $0.5 = \\frac12$. Now press "show ln(x) only" and drag back to negative $x$. $\\ln(x)$ has nothing there, but $\\frac1x$ still needs an antiderivative. That is the job of the absolute value.</p>`, ref:"pp. 1 to 2"},
    {type:"mcq", title:"Which answer gets full marks?", q:"Three students evaluated $\\int\\frac{3}{x}\\,dx$. Which answer would get full marks?", opts:[["$3\\ln(\\lvert x\\rvert)+C$",true,"Absolute value and $+C$."],["$3\\ln(x)+C$",false,"Missing the absolute value."],["$3\\ln(\\lvert x\\rvert)$",false,"Missing $+C$."]],
      after:"Quizzes test exactly this: the right idea with a dropped absolute value or a missing $+C$ loses marks."},
    {type:"example", title:"An initial value problem at a negative x", ex:{q:"Solve the initial value problem $y' = \\frac1x + \\frac{1}{x^2}$, $y(-1) = 2$.", ref:"p. 2",
      steps:[{t:"All solutions of the differential equation are given by $y = \\int\\left(\\frac1x+\\frac{1}{x^2}\\right)dx = \\ln(\\lvert x\\rvert) - \\frac{1}{x} + C$",why:"$\\int x^{-2}\\,dx = \\frac{x^{-1}}{-1} = -\\frac1x$. Write \"$y =$\" and the $dx$: both are worth marks."},
        {t:"The initial condition says that $y=2$ when $x=-1$. Hence, $2 = \\ln(\\lvert -1\\rvert) - \\frac{1}{-1} + C$",why:"Substitute the starting point. The absolute value makes $\\ln(\\lvert -1\\rvert) = \\ln(1)$ legal."},
        {t:"$2 = 0 + 1 + C$",why:"$\\ln(1)=0$ and $-\\frac{1}{-1} = 1$."},
        {t:"$1 = C$",why:"Solve for $C$."},
        {t:"Hence, the solution is $y(x) = \\ln(\\lvert x\\rvert) - \\frac1x + 1$.",why:"Put $C$ back in and state the function."}],
      ans:"$y = \\ln(\\lvert x\\rvert) - \\dfrac1x + 1$. (Strictly it is valid on $(-\\infty,0)$, the interval that contains $x=-1$.)"}},
    {type:"try", title:"Your turn: initial value problems", gen:"L11.g.ivp"},
    {type:"try", title:"Your turn: antiderivatives", gen:"L11.g.int1x"},
    {type:"read", title:"Logarithmic scales", body:`<p>Some quantities range over a huge interval. If the sound of breathing were plotted 1 cm above the $x$-axis, a jet taking off would be 100,000,000 km up, past Mercury (p. 2).</p><p>The fix is to plot the logarithm of the value instead of the value. For example $\\log_{10}(100{,}000{,}000{,}000{,}000) = 14$. A 15-digit number becomes 14.</p><p class="muted small">The notes' sentence before this mentions 100,000,000,000 (11 zeros) but plots the 14-zero number. See the flag for p. 2.</p><p>Log scales in science (p. 2): the Richter scale, the pH scale, the decibel scale, the stellar magnitude scale, and microbial counts.</p><div class="box"><b class="t">How to read a log scale</b>Equal steps mean equal ratios. On a base-10 scale, up 1 means times 10, up 2 means times 100, up 0.5 means times $\\sqrt{10}\\approx 3$.</div>`, ref:"p. 2"},
    {type:"read", title:"Richter and decibels", body:`<div class="box def"><b class="t">Richter scale (p. 3)</b>$$M_L = \\log_{10}\\left(\\frac{A}{A_0}\\right)$$ $A$ is the maximum amplitude and $A_0$ is a constant that depends on the distance from the epicenter.</div><p>The coefficient of $\\log_{10}$ is 1, so up 1 in magnitude means 10 times the maximum amplitude. Magnitude 6 vs 5: 10 times. Magnitude 7 vs 4: $10^3=1000$ times (p. 3). The notes call this "more powerful", but it is the amplitude that is 10 times larger (see the flag).</p><div class="box def"><b class="t">Decibels (p. 3)</b>$$D = 10\\log_{10}\\left(\\frac{I}{10^{-12}}\\right)\\text{ decibels}$$ $I$ is the intensity of the sound waves in W/m².</div><p>Here the coefficient is 10, so up 10 dB means 10 times the intensity.</p><p class="muted small">The pH scale is in the list on p. 2. Its formula, from the course notes, is $\\text{pH} = -\\log_{10}([H^+])$: down 1 in pH means 10 times the $[H^+]$.</p>`, ref:"p. 3"},
    {type:"explore", title:"Seeing a log scale", fig:"logscale", body:`<p><b>Try it.</b> On Richter, set the readings to 7 and 4: amount 2 is a sliver, $\\frac{1}{1000}$ of amount 1. Now set them to 7 and 2.5, the lecture's exercise: the ratio is $10^{4.5}\\approx 31{,}623$. Switch to Decibels and set 140 and 105, the lecture's example: $10^{3.5}\\approx 3162$.</p>`, ref:"pp. 2 to 4"},
    {type:"example", title:"Comparing two sounds", ex:{q:"How many times more intense is a sound that measures $D_1 = 140$ decibels than a sound that measures $D_2 = 105$ decibels?", ref:"pp. 3 to 4",
      steps:[{t:"$140 = 10\\log_{10}\\left(\\frac{I_1}{10^{-12}}\\right)$",why:"Put $D_1$ into the decibel formula."},
        {t:"$14 = \\log_{10}\\left(\\frac{I_1}{10^{-12}}\\right)$",why:"Divide both sides by 10."},
        {t:"$10^{14} = \\frac{I_1}{10^{-12}}$",why:"Definition of $\\log_{10}$: $\\log_{10}(u) = v$ means $u = 10^v$."},
        {t:"$10^{14}\\cdot 10^{-12} = I_1$, so $I_1 = 10^2$",why:"Multiply both sides by $10^{-12}$ and add the exponents."},
        {t:"Same steps for $D_2$: $10.5 = \\log_{10}\\left(\\frac{I_2}{10^{-12}}\\right)$, so $I_2 = 10^{10.5}\\cdot 10^{-12} = 10^{-1.5}$",why:"$105\\div 10 = 10.5$."},
        {t:"$\\frac{I_1}{I_2} = \\frac{10^2}{10^{-1.5}} = 10^{3.5}$",why:"Quotient rule for exponents: $2-(-1.5) = 3.5$."},
        {t:"$10^{3.5} = 10^3\\cdot 10^{0.5} = 1000\\sqrt{10}\\approx 3000$",why:"No calculator: $\\sqrt{10}\\approx 3$."}],
      ans:"The 140 dB sound is $10^{3.5}\\approx 3000$ times more intense. (The notes say \"louder\"; the ratio is of intensities. See the flag.)"}},
    {type:"mcq", title:"The exercise from p. 4", q:"Approximately how many times more powerful (in maximum amplitude) is a magnitude 7 earthquake than a magnitude 2.5 earthquake?", opts:[["4.5 times",false,"4.5 is the difference on the scale. The amplitudes differ by $10^{4.5}$."],["10000 times",false,"That is $10^4$; you still need the extra $10^{0.5}\\approx 3$."],["30000 times",true,"$10^{4.5} = 10^4\\cdot\\sqrt{10}\\approx 10000\\cdot 3 = 30000$."],["45000 times",false,"$10^{0.5}$ is $\\sqrt{10}$, not 4.5."],["50000 times",false,"$\\sqrt{10}\\approx 3.16$, not 5."]], keep:true,
      after:"Exactly, $10^{4.5}\\approx 31{,}623$. Quiz answers are built so that $\\sqrt{10}\\approx 3$ picks out the right choice."},
    {type:"try", title:"Your turn: decibels", gen:"L11.g.db"},
    {type:"formulas", title:"Lecture 11 formulas"}
  ]
});
})();
