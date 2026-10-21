/* Lecture 1 (Wed Sept 9): Derivatives review, rates of change. Sections 1.1.1, 1.1.2. Notes: 5 pages. */
M127.lecture({
  id:"L01", n:1, date:"2026-09-09", added:"2026-10-21", unit:"u1", quiz:"Q2",
  title:"Derivatives and Rates of Change", sections:["1.1.1","1.1.2"], pages:5,
  summary:"The derivative rules you need from high school, what dy/dx means as a ratio of changes, and how to read the units of a derivative.",
  flags:[],
  formulas:[
    {id:"L01.f.const", name:"Derivative of a constant", tex:"\\frac{d}{dx}\\,c = 0", ref:"p. 3", blank:{tex:"\\frac{d}{dx}\\,c = \\boxed{\\,?\\,}", answer:"0", type:"num"}},
    {id:"L01.f.power", name:"Power rule", tex:"\\frac{d}{dx}\\,x^n = nx^{n-1}", note:"for $n \\neq 0$", ref:"p. 3", blank:{tex:"\\frac{d}{dx}\\,x^n = \\boxed{\\,?\\,}", answer:"n x^(n-1)", vars:["x","n"], domain:[0.5,3]}},
    {id:"L01.f.exp", name:"Derivative of $e^x$", tex:"\\frac{d}{dx}\\,e^x = e^x", ref:"p. 3", blank:{tex:"\\frac{d}{dx}\\,e^x = \\boxed{\\,?\\,}", answer:"e^x", vars:["x"]}},
    {id:"L01.f.sin", name:"Derivative of sine", tex:"\\frac{d}{dx}\\sin(x) = \\cos(x)", ref:"p. 3", blank:{tex:"\\frac{d}{dx}\\sin(x) = \\boxed{\\,?\\,}", answer:"cos(x)", vars:["x"]}},
    {id:"L01.f.cos", name:"Derivative of cosine", tex:"\\frac{d}{dx}\\cos(x) = -\\sin(x)", ref:"p. 3", blank:{tex:"\\frac{d}{dx}\\cos(x) = \\boxed{\\,?\\,}", answer:"-sin(x)", vars:["x"]}},
    {id:"L01.f.construle", name:"Constant rule", tex:"h(x)=cf(x) \\;\\Rightarrow\\; h'(x)=cf'(x)", ref:"p. 3", blank:{tex:"h(x)=cf(x) \\;\\Rightarrow\\; h'(x)=\\boxed{\\,?\\,}", answer:"c f'(x)", text:true, accept:["cf'(x)","c*f'(x)","c f'(x)","cf'","c f'"]}},
    {id:"L01.f.sum", name:"Sum rule", tex:"h(x)=f(x)+g(x) \\;\\Rightarrow\\; h'(x)=f'(x)+g'(x)", ref:"p. 3"},
    {id:"L01.f.product", name:"Product rule", tex:"h(x)=f(x)g(x) \\;\\Rightarrow\\; h'(x)=f'(x)g(x)+f(x)g'(x)", ref:"p. 3", blank:{tex:"h(x)=f(x)g(x) \\;\\Rightarrow\\; h'(x)=\\boxed{\\,?\\,}", text:true, accept:["f'(x)g(x)+f(x)g'(x)","f'g+fg'","f(x)g'(x)+f'(x)g(x)","fg'+f'g","f'(x)g(x) + f(x)g'(x)"]}},
    {id:"L01.f.quotient", name:"Quotient rule", tex:"h(x)=\\frac{f(x)}{g(x)} \\;\\Rightarrow\\; h'(x)=\\frac{f'(x)g(x)-f(x)g'(x)}{(g(x))^2}", ref:"p. 3", blank:{tex:"h(x)=\\frac{f(x)}{g(x)} \\;\\Rightarrow\\; h'(x)=\\frac{\\boxed{\\,?\\,}}{(g(x))^2}", text:true, accept:["f'(x)g(x)-f(x)g'(x)","f'g-fg'","f'(x)g(x) - f(x)g'(x)"]}},
    {id:"L01.f.chain", name:"Chain rule", tex:"h(x)=f(g(x)) \\;\\Rightarrow\\; h'(x)=f'(g(x))\\,g'(x)", ref:"p. 3", blank:{tex:"h(x)=f(g(x)) \\;\\Rightarrow\\; h'(x)=\\boxed{\\,?\\,}", text:true, accept:["f'(g(x))g'(x)","f'(g(x))*g'(x)","f'(g(x)) g'(x)","g'(x)f'(g(x))"]}},
    {id:"L01.f.def", name:"Definition of the derivative", tex:"\\frac{dy}{dx} = \\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}", ref:"p. 3"},
    {id:"L01.f.ratio", name:"Derivative as a ratio of changes", tex:"\\frac{dy}{dx} = \\lim_{h\\to 0}\\frac{\\Delta y}{\\Delta x}", note:"$\\Delta y = f(x+h)-f(x)$ is the change in $y$; $\\Delta x = h$ is the change in $x$.", ref:"pp. 3 to 4"},
    {id:"L01.f.units", name:"Units of a derivative", tex:"\\text{units of } \\frac{ds}{dt} = \\frac{\\text{units of } s}{\\text{units of } t}", note:"Example: $s$ in km, $t$ in hours, so $s'(t)$ is in km/h.", ref:"p. 4"},
    {id:"L01.f.notation", name:"Derivative notation", tex:"f',\\; f'',\\; f^{(n)},\\; f'(a) \\quad\\text{or}\\quad \\frac{dy}{dx},\\; \\frac{d^2y}{dx^2},\\; \\frac{d^ny}{dx^n},\\; \\left.\\frac{dy}{dx}\\right|_{a}", ref:"p. 3"}
  ],
  glossary:[
    {id:"L01.t.function", term:"Function", def:"An object: a machine that takes each allowed input and gives exactly one output. $f(x)=2\\sqrt{x}$ inputs a non-negative number $x$ and outputs $2\\sqrt{x}$. The formula is only a description of the machine.", ref:"p. 2"},
    {id:"L01.t.derivative", term:"Derivative", def:"The instantaneous rate of change of a function. $\\frac{dy}{dx}$ is the limit of the change in $y$ divided by the change in $x$ as the change in $x$ goes to 0.", ref:"pp. 3 to 4"},
    {id:"L01.t.deltas", term:"$\\Delta x$ and $\\Delta y$", def:"$\\Delta x$ is a change in the input. $\\Delta y = f(x+\\Delta x)-f(x)$ is the change in the output that it causes.", ref:"p. 3"},
    {id:"L01.t.rate", term:"Instantaneous rate of change", def:"How fast a quantity is changing at one instant. It is the derivative. If $s(t)$ is position, $s'(t)$ is velocity.", ref:"p. 4"},
    {id:"L01.t.indep", term:"Independent and dependent variable", def:"The input is the independent variable and the output is the dependent variable. In science they are named after what they measure: $t$ for time, $x$ for distance, $P$ for pressure.", ref:"p. 4"},
    {id:"L01.t.units", term:"Units of a derivative", def:"Units of the output divided by units of the input. Read them straight off the notation: $\\frac{ds}{dt}$ is (units of $s$) per (units of $t$).", ref:"p. 4"}
  ],
  figures:{
    secant:{title:"From secant to tangent", cap:"<b>Fig. 1.1</b> The slope of the secant line is $\\frac{\\Delta y}{\\Delta x}$. Shrink $\\Delta x = h$ and it becomes the slope of the tangent line, $\\frac{dy}{dx}$. (Lecture 1, pp. 3 to 4)",
      build(host,{PLOT,M}){
        const f=x=>0.25*x*x*x-1.2*x*x+1.2*x+2.4, df=x=>0.75*x*x-2.4*x+1.2;
        const G=PLOT.graph(host,{x:[-0.5,5.2],y:[-0.5,5],c:"var(--u1)",xlabel:"x",ylabel:"y"});
        G.fn(f);
        let a=0.9, h=1.6;
        const tan=G.tangent(a,f(a),df(a),{cls:"tan dash"});
        const sec=G.line(0,0,1,1,{cls:"tan"});
        const run=G.line(0,0,1,1,{cls:"lt dash"}), rise=G.line(0,0,1,1,{cls:"lt dash"});
        const q=G.dot(a+h,f(a+h),{filled:true});
        const lx=G.label(0,0,"Δx",{cls:"lblc",anchor:"middle",dy:14}), ly=G.label(0,0,"Δy",{cls:"lblc",dx:6});
        const ctl=PLOT.controls(host); const ro=PLOT.readout(host);
        const P=G.handle(a,f(a),{f,bounds:[0,4.2],label:"Point on the curve",onMove:x=>{ a=x; draw(); }});
        PLOT.slider(ctl,{label:"Δx = h",min:0.02,max:2,step:0.01,value:h,fmt:v=>v.toFixed(2),oninput:v=>{ h=v; draw(); }});
        function draw(){
          const b=a+h, m=(f(b)-f(a))/h;
          sec.set(-1, f(a)+m*(-1-a), 6, f(a)+m*(6-a)); tan.at(a,f(a),df(a)); q.set(b,f(b));
          run.set(a,f(a),b,f(a)); rise.set(b,f(a),b,f(b)); lx.set((a+b)/2,f(a)); ly.set(b,(f(a)+f(b))/2);
          ro.innerHTML=`secant slope Δy/Δx = <b>${m.toFixed(3)}</b> &nbsp; tangent slope dy/dx = <b>${df(a).toFixed(3)}</b> &nbsp; gap ${Math.abs(m-df(a)).toFixed(3)}`;
        }
        draw();
      }},
    units:{title:"Reading units off the notation", cap:"<b>Fig. 1.2</b> A calculator in boiling water: $T(t)=100-80e^{-t/20}$ °C, $t$ in minutes. The tangent slope $T'(t)$ is in °C per minute. (Lecture 1, p. 5)",
      build(host,{PLOT}){
        const T=t=>100-80*Math.exp(-t/20), dT=t=>4*Math.exp(-t/20);
        const G=PLOT.graph(host,{x:[0,80],y:[0,110],c:"var(--u1)",xlabel:"t (min)",ylabel:"T (°C)",xstep:10,ystep:20});
        G.fn(T); const tan=G.tangent(10,T(10),dT(10));
        const ro=PLOT.readout(host);
        const upd=t=>{ tan.at(t,T(t),dT(t)); ro.innerHTML=`t = <b>${t.toFixed(1)}</b> min &nbsp; T = <b>${T(t).toFixed(1)}</b> °C &nbsp; T′(t) = <b>${dT(t).toFixed(2)}</b> °C/min`; };
        G.handle(10,T(10),{f:T,bounds:[0,80],label:"Time",onMove:upd}); upd(10);
      }}
  },
  gens:[
    {id:"L01.g.power", title:"Power rule and sums", skill:"Differentiate a sum of powers", ref:"p. 3",
      gen(R,d){
        const M=M127;
        if(d===1){ const a=R.nz(-6,6), n=R.int(2,5), b=R.nz(-9,9), c=R.int(-9,9);
          const f=`${M.term(a,"x",n,true)}${M.term(b,"x",1)}${M.term(c,"x",0)}`;
          return {prompt:`Find $f'(x)$ for $f(x) = ${f}$.`, answer:{answer:`${a*n}x^${n-1}+${b}`,vars:["x"]}, verify:{deriv:`${a}x^${n}+${b}x+${c}`},
            hint:"Use the power rule $\\frac{d}{dx}x^n = nx^{n-1}$ on each term. The derivative of a constant is 0.",
            steps:[`Differentiate term by term (sum rule and constant rule).`,`$\\frac{d}{dx}\\left(${M.term(a,"x",n,true)}\\right) = ${a}\\cdot ${n}x^{${n-1}} = ${M.term(a*n,"x",n-1,true)}$`,`$\\frac{d}{dx}\\left(${M.term(b,"x",1,true)}\\right) = ${b}$`+(c?` and $\\frac{d}{dx}(${c}) = 0$.`:".")],
            answerTeX:`$f'(x) = ${M.term(a*n,"x",n-1,true)}${M.term(b,"x",0)}$`};
        }
        // negative and fractional powers: a/x^m + b*sqrt(x) (+ c x^k at hard)
        const a=R.nz(-5,5), m=R.int(1,3), b=R.nz(-6,6);
        const root=d===3?R.pick([3,2]):2;
        const k=d===3?R.int(2,4):null, c=d===3?R.nz(-4,4):0;
        const sq= root===2?`\\sqrt{x}`:`\\sqrt[3]{x}`, cf=v=>Math.abs(v)===1?"":String(Math.abs(v));
        const t1=(a<0?"-":"")+`\\frac{${Math.abs(a)}}{${m===1?"x":`x^{${m}}`}}`;
        let f=`${t1} ${b<0?"-":"+"} ${cf(b)}${sq}`+(k?` ${c<0?"-":"+"} ${cf(c)}x^{${k}}`:"");
        const ans=`${-a*m}*x^(${-m-1}) + ${b}/${root}*x^(1/${root}-1)`+(k?` + ${c*k}*x^${k-1}`:"");
        const g=M.gcd(Math.abs(b),root), bp=b/g, bq=root/g;
        const dsqA=`\\frac{${Math.abs(bp)}}{${bq===1?"":bq}${root===2?"\\sqrt{x}":"x^{2/3}"}}`, dsq=(bp<0?"-":"")+dsqA;
        return {prompt:`Find $\\frac{dy}{dx}$ for $y = ${f}$.`, answer:{answer:ans,vars:["x"],domain:[0.3,3]}, verify:{deriv:`${a}/x^${m}+${b}*x^(1/${root})`+(k?`+${c}x^${k}`:"")},
          hint:"Rewrite every term as a power of $x$ first: $\\frac{1}{x^m} = x^{-m}$ and $\\sqrt{x}=x^{1/2}$, $\\sqrt[3]{x} = x^{1/3}$.",
          steps:[`Rewrite with exponents: $y = ${M.term(a,"x",-m,true)} ${b<0?"-":"+"} ${cf(b)}x^{1/${root}}`+(k?` ${c<0?"-":"+"} ${cf(c)}x^{${k}}`:"")+`$.`,
            `Power rule on the first term: $${a}\\cdot(${-m})x^{${-m-1}} = ${M.term(-a*m,"x",-m-1,true)}$.`,
            `Power rule on the root: $${b}\\cdot\\frac{1}{${root}}x^{\\frac{1}{${root}}-1} = ${dsq}$.`].concat(k?[`Last term: $${c}\\cdot ${k}x^{${k-1}} = ${M.term(c*k,"x",k-1,true)}$.`]:[]),
          answerTeX:`$\\frac{dy}{dx} = ${M.term(-a*m,"x",-m-1,true)} ${bp<0?"-":"+"} ${dsqA}`+(k?` ${M.term(c*k,"x",k-1)}`:"")+`$`};
      }},
    {id:"L01.g.rules", title:"Product, quotient and chain rules", skill:"Choose and apply the right derivative rule", ref:"p. 3",
      gen(R,d){
        const M=M127;
        const kind = d===1?R.pick(["chain","product"]):d===2?R.pick(["chain","product","quotient"]):R.pick(["chain2","quotient","prodchain"]);
        if(kind==="chain"){ const a=R.nz(-4,4), b=R.nz(-6,6), n=R.int(2,6);
          return {prompt:`Find $\\frac{dy}{dx}$ for $y = (${M.term(a,"x",1,true)}${M.term(b,"x",0)})^{${n}}$.`, answer:{answer:`${n*a}*(${a}x+${b})^${n-1}`,vars:["x"],domain:[-1,1]}, verify:{deriv:`(${a}x+${b})^${n}`},
            hint:"Chain rule: the outside function is $u^{"+n+"}$ and the inside is $u = "+M.term(a,"x",1,true)+M.term(b,"x",0)+"$.",
            steps:[`Let $u = ${M.term(a,"x",1,true)}${M.term(b,"x",0)}$, so $y=u^{${n}}$.`,`$\\frac{dy}{du} = ${n}u^{${n-1}}$ and $\\frac{du}{dx} = ${a}$.`,`Chain rule: $\\frac{dy}{dx} = ${n}(${M.term(a,"x",1,true)}${M.term(b,"x",0)})^{${n-1}}\\cdot ${a<0?`(${a})`:a}$.`],
            answerTeX:`$\\frac{dy}{dx} = ${n*a}(${M.term(a,"x",1,true)}${M.term(b,"x",0)})^{${n-1}}$`};
        }
        if(kind==="product"){ const n=R.int(2,4), k=R.nz(-3,3);
          const pick=R.pick(["exp","sin","cos"]); const c=v=>v===1?"":v===-1?"-":String(v); const arg=`${c(k)}x`;
          const g = pick==="exp"?`e^{${arg}}`:pick==="sin"?`\\sin(${arg})`:`\\cos(${arg})`;
          const ga = pick==="exp"?`e^(${k}x)`:pick==="sin"?`sin(${k}x)`:`cos(${k}x)`;
          const dga = pick==="exp"?`${k}e^(${k}x)`:pick==="sin"?`${k}cos(${k}x)`:`${-k}sin(${k}x)`;
          const dgt = pick==="exp"?`${c(k)}e^{${arg}}`:pick==="sin"?`${c(k)}\\cos(${arg})`:`${c(-k)}\\sin(${arg})`;
          const xn1=M.term(n,"x",n-1,true);
          return {prompt:`Differentiate $f(x) = x^{${n}}${g}$.`, answer:{answer:`${n}x^${n-1}*${ga} + x^${n}*${dga}`,vars:["x"],domain:[-1.5,1.5]}, verify:{deriv:`x^${n}*${ga}`},
            hint:"Product rule: $(fg)' = f'g + fg'$. You will also need the chain rule for the second factor.",
            steps:[`Let the factors be $x^{${n}}$ and $${g}$.`,`$\\frac{d}{dx}x^{${n}} = ${xn1}$ and, by the chain rule, $\\frac{d}{dx}${g} = ${dgt}$.`,`Product rule: $f'(x) = ${xn1}${g} + x^{${n}}\\left(${dgt}\\right)$.`],
            answerTeX:`$f'(x) = ${xn1}${g} + x^{${n}}\\left(${dgt}\\right)$`};
        }
        if(kind==="quotient"){ const a=R.nz(-6,6), b=R.int(1,9), p=R.pick([1,2]);
          const den = p===1?`x+${b}`:`x^2+${b}`; const dden=p===1?"1":"2x";
          const at=M.term(a,"t",1,true), dT=den.replace(/x/g,"t"), ddT=dden.replace(/x/g,"t");
          return {prompt:`Differentiate $f(t) = \\frac{${at}}{${dT}}$.`, answer:{answer:`(${a}*(${dT}) - ${a}t*(${ddT}))/(${dT})^2`,vars:["t"],domain:[0,3]}, verify:{deriv:`${a}t/(${dT})`,v:"t"},
            hint:"Quotient rule: $\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}$. Watch the variable: it is $t$ here.",
            steps:[`Top: $${at}$, with derivative $${a}$. Bottom: $${dT}$, with derivative $${ddT}$.`,`Quotient rule: $f'(t) = \\frac{(${a})(${dT}) - (${at})(${ddT})}{(${dT})^2}$.`,
              p===1?`Simplify the top: $${M.term(a,"t",1,true)} ${M.pm(a*b)} ${M.term(-a,"t",1)} = ${a*b}$.`:`Simplify the top: $${M.term(a,"t",2,true)} ${M.pm(a*b)} ${M.term(-2*a,"t",2)} = ${M.term(-a,"t",2,true)} ${M.pm(a*b)}$.`],
            answerTeX: p===1?`$f'(t) = \\frac{${a*b}}{(t+${b})^2}$`:`$f'(t) = \\frac{${M.term(-a,"t",2,true)}${M.pm(a*b)}}{(t^2+${b})^2}$`};
        }
        if(kind==="chain2"){ const a=R.nz(-4,4), b=R.int(1,5), outer=R.pick(["sin","cos","exp","sqrt"]);
          const inner=`${a===1?"":a===-1?"-":a}x^2+${b}`, innerA=`(${a}x^2+${b})`;
          const map={sin:[`\\sin(${inner})`,`cos${innerA}*${2*a}x`,`${2*a}x\\cos(${inner})`],cos:[`\\cos(${inner})`,`-sin${innerA}*${2*a}x`,`${-2*a}x\\sin(${inner})`],exp:[`e^{${inner}}`,`e^${innerA}*${2*a}x`,`${2*a}xe^{${inner}}`],sqrt:[`\\sqrt{${inner}}`,`${a}x/sqrt${innerA}`,`${a<0?"-":""}\\frac{${Math.abs(a)===1?"":Math.abs(a)}x}{\\sqrt{${inner}}}`]};
          const [ft,ans,at]=map[outer];
          return {prompt:`Find $\\frac{dy}{dx}$ for $y = ${ft}$.`, answer:{answer:ans,vars:["x"],domain:outer==="sqrt"&&a<0?[-Math.sqrt(b/-a)*0.9,Math.sqrt(b/-a)*0.9]:[-1.2,1.2]}, verify:{deriv:{sin:`sin${innerA}`,cos:`cos${innerA}`,exp:`e^${innerA}`,sqrt:`sqrt${innerA}`}[outer]},
            hint:"Chain rule: differentiate the outside function, keep the inside the same, then multiply by the derivative of the inside.",
            steps:[`Inside: $u = ${inner}$, so $\\frac{du}{dx} = ${2*a}x$.`,`Outside: $y = ${outer==="sin"?"\\sin(u)":outer==="cos"?"\\cos(u)":outer==="exp"?"e^u":"\\sqrt{u} = u^{1/2}"}$, so $\\frac{dy}{du} = ${outer==="sin"?"\\cos(u)":outer==="cos"?"-\\sin(u)":outer==="exp"?"e^u":"\\frac{1}{2}u^{-1/2}"}$.`,`Multiply: $\\frac{dy}{dx} = ${at}$.`],
            answerTeX:`$\\frac{dy}{dx} = ${at}$`};
        }
        // prodchain: x * (ax+b)^n
        const a=R.nz(-3,3), b=R.nz(-5,5), n=R.int(2,4);
        const lin=`${M.term(a,"x",1,true)}${M.term(b,"x",0)}`, pw=n-1===1?`(${lin})`:`(${lin})^{${n-1}}`;
        return {prompt:`Differentiate $h(x) = x(${lin})^{${n}}$.`, answer:{answer:`(${a}x+${b})^${n} + x*${n*a}*(${a}x+${b})^${n-1}`,vars:["x"],domain:[-1,1]}, verify:{deriv:`x*(${a}x+${b})^${n}`},
          hint:"Product rule first, then the chain rule for the bracket.",
          steps:[`Product rule with $f(x)=x$ and $g(x)=(${lin})^{${n}}$.`,`$f'(x) = 1$ and $g'(x) = ${n}${pw}\\cdot ${a<0?`(${a})`:a}$ by the chain rule.`,`So $h'(x) = (${lin})^{${n}} ${M.term(n*a,"x",1)}${pw}$.`],
          answerTeX:`$h'(x) = (${lin})^{${n}} ${M.term(n*a,"x",1)}${pw}$`};
      }},
    {id:"L01.g.units", title:"Units of a derivative", skill:"Read the units of a derivative from the notation", ref:"p. 4",
      gen(R,d){
        const S=R.pick([
          ["P","pressure","kPa","t","time","s","s","the rate the pressure is changing with respect to time"],
          ["V","volume of a balloon","cm^3","r","radius","cm","cm","the rate the volume changes as the radius grows"],
          ["M","mass of a bacteria culture","mg","t","time","hours","hour","the growth rate of the culture"],
          ["C","drug concentration","mg/L","t","time","min","min","how fast the concentration is changing"],
          ["T","temperature","°C","x","depth","m","m","how fast temperature changes with depth"],
          ["D","cost","dollars","T","ore extracted","tons","ton","the extra cost per extra ton"],
          ["h","height of a plant","cm","w","water given","mL","mL","the change in height per extra mL of water"]]);
        const [Q,qn,qu,v,vn,vu,v1,mean]=S;
        const right=`${qu}/${v1}`;
        const opts=R.shuffle([right,`${v1}/${qu}`,qu,`${qu}·${v1}`]);
        return {prompt:`$${Q}(${v})$ is the ${qn}, in ${qu.replace("^3","³")}, when the ${vn} is $${v}$ ${vu}. What are the units of $\\frac{d${Q}}{d${v}}$?`,
          parts:[{answer:{type:"mc",options:opts.map(o=>o.replace("^3","³")),correct:opts.indexOf(right)}}],
          hint:`The notation tells you: $\\frac{d${Q}}{d${v}}$ is a change in $${Q}$ divided by a change in $${v}$.`,
          steps:[`$\\frac{d${Q}}{d${v}} = \\lim_{\\Delta ${v}\\to 0} \\frac{\\Delta ${Q}}{\\Delta ${v}}$, a change in ${qn} divided by a change in ${vn}.`,`So the units are (units of $${Q}$)/(units of $${v}$) = ${right.replace("^3","³")}.`,`It means ${mean}.`],
          answerTeX:right.replace("^3","³")};
      }},
    {id:"L01.g.meaning", title:"What does $f'(a)=b$ mean?", skill:"Interpret a derivative value in words", ref:"p. 5",
      gen(R,d){
        const S=R.pick([
          ["D","T","the cost of extracting $T$ tons of ore","dollars","tons","extracting","tons of ore","the cost"],
          ["W","t","the weight of a puppy $t$ weeks after birth","kg","weeks","at","weeks","the puppy's weight"],
          ["P","n","the profit from selling $n$ phones","dollars","phones","selling","phones","the profit"],
          ["H","t","the height of a tree $t$ years after planting","m","years","at","years","the tree's height"]]);
        const [F,v,desc,fu,vu,verb,vn,what]=S;
        const a=R.pick([10,20,50,100,200,2000]), b=R.pick([3,4,5,12,15,40]);
        const at=verb==="at"?`At ${a} ${vn}`:`When ${verb} ${a} ${vn}`;
        const atb=verb==="at"?`At ${b} ${vn}`:`When ${verb} ${b} ${vn}`;
        const right=`${at}, ${what} is increasing at a rate of ${b} ${fu}/${vu.replace(/s$/,"")}.`;
        const opts=[right,`${at}, ${what} is ${b} ${fu}.`,`${at}, ${what} is ${b} ${fu}/${vu.replace(/s$/,"")}.`,`${atb}, ${what} is ${a} ${fu}.`,`${atb}, ${what} is increasing at a rate of ${a} ${fu}/${vu.replace(/s$/,"")}.`];
        const order=R.shuffle([0,1,2,3,4]);
        return {prompt:`$${F}(${v})$ is ${desc}, in ${fu}. What does $${F}'(${a}) = ${b}$ mean?`,
          parts:[{answer:{type:"mc",options:order.map(i=>opts[i]),correct:order.indexOf(0)}}],
          hint:"The input of $"+F+"'$ is still a value of $"+v+"$. The output of $"+F+"'$ is a rate, so its units have a 'per'.",
          steps:[`The number inside the brackets, ${a}, is a value of $${v}$ (${vu}).`,`$${F}'(${a})$ is the instantaneous rate of change of ${what} at that point, in ${fu} per ${vu.replace(/s$/,"")}.`,`Positive means increasing. So: ${right}`],
          answerTeX:right};
      }},
    {id:"L01.g.eval", title:"Derivative at a point", skill:"Evaluate $f'(a)$", ref:"pp. 3 to 4",
      gen(R,d){
        const M=M127; const a=R.int(-2,3), c=R.nz(-4,4), n=R.int(2,d===1?3:4), k=R.nz(-3,3);
        if(d===1){ const b=R.nz(-6,6); const val=c*n*Math.pow(a,n-1)+b;
          return {prompt:`Let $f(x) = ${M.term(c,"x",n,true)}${M.term(b,"x",1)}$. Find $f'(${a})$.`, answer:{type:"num",answer:val},
            hint:"Differentiate first, then substitute.", steps:[`$f'(x) = ${M.term(c*n,"x",n-1,true)}${M.term(b,"x",0)}$.`,`$f'(${a}) = ${c*n}(${a})^{${n-1}} ${M.pm(b)} = ${val}$.`], answerTeX:`$${val}$`}; }
        const val=c*k; // f(x)=c e^{k(x-a)} + x^n => f'(a)= c k + n a^{n-1}
        const tot=val+n*Math.pow(a,n-1);
        const xa=a===0?"x":`x ${a<0?"+":"-"} ${Math.abs(a)}`, cc=c===1?"":c===-1?"-":String(c), kc=k===1?"":k===-1?"-":String(k);
        const ex=a===0?`${kc}x`:`${kc}(${xa})`;
        return {prompt:`Let $f(x) = ${cc}e^{${ex}} + x^{${n}}$. Find $f'(${a})$.`, answer:{type:"num",answer:tot},
          hint:"Chain rule on the exponential. At $x="+a+"$ the exponent is 0, and $e^0=1$.",
          steps:[`$f'(x) = ${c}\\cdot ${k<0?"("+k+")":k}\\,e^{${ex}} + ${n}x^{${n-1}}$.`,`At $x=${a}$: $e^{0}=1$, so $f'(${a}) = ${c*k} + ${n}(${a})^{${n-1}} = ${tot}$.`], answerTeX:`$${tot}$`};
      }}
  ],
  exam:[
    {id:"L01.q1", ref:"p. 3", q:"Which rule gives $\\frac{d}{dx}\\left[x^2\\sin(x)\\right]$ directly?", opts:[["Product rule",1,"Two functions multiplied together."],["Quotient rule",0,"Nothing is being divided."],["Chain rule only",0,"There is no function inside another function here."],["Power rule only",0,"The power rule handles $x^2$ but not the product."]]},
    {id:"L01.q2", ref:"p. 3", q:"$\\frac{d}{dx}\\cos(x) = $", opts:[["$-\\sin(x)$",1,"From the table on p. 3."],["$\\sin(x)$",0,"Missing the minus sign."],["$-\\cos(x)$",0,"That is the second derivative of $\\cos(x)$."],["$\\cos(x)$",0,"Only $e^x$ is its own derivative."]]},
    {id:"L01.q3", ref:"p. 4", q:"$s(t)$ is position in km and $t$ is time in hours. The units of $s'(t)$ are", opts:[["km/h",1,"Change in km over change in hours."],["h/km",0,"Upside down."],["km",0,"That is the unit of $s$."],["km/h²",0,"That would be $s''(t)$, acceleration."]]},
    {id:"L01.q4", ref:"p. 5", q:"$D(T)$ is the cost in dollars of extracting $T$ tons of ore. What does $D'(2000)=100$ mean?", opts:[["When extracting 2000 tons, the cost is increasing at a rate of \\$100/ton",1,"The derivative is a rate of change in dollars per ton."],["When extracting 2000 tons, the cost is \\$100",0,"That would be $D(2000)=100$."],["When extracting 2000 tons, the cost is \\$100/ton",0,"The cost itself is in dollars, not dollars per ton."],["When extracting 100 tons, the cost is \\$2000",0,"The input is 2000, not 100."]]},
    {id:"L01.q5", ref:"p. 3", q:"In $\\frac{dy}{dx} = \\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}$, the numerator $f(x+h)-f(x)$ is", opts:[["$\\Delta y$, the change in the output",1,"Output after minus output before."],["$\\Delta x$, the change in the input",0,"$h$ is $\\Delta x$."],["The slope of the tangent line",0,"Only the whole limit is the slope."],["Always zero",0,"Only in the limit does it go to 0, and so does $h$."]]},
    {id:"L01.q6", ref:"p. 4", q:"Let $f(x)=5x^3$. Which of these correctly finds $f'(x)$ with the product rule?", opts:[["$(5)'x^3 + 5(x^3)' = 0\\cdot x^3 + 5\\cdot 3x^2 = 15x^2$",1,"Treat 5 as the first factor; its derivative is 0."],["$(5)'(x^3)' = 0$",0,"The product rule is not the product of the derivatives."],["$5'\\cdot x^3 = 5x^3$",0,"The derivative of 5 is 0, not 5."],["$5x^3 + 15x^2$",0,"The function itself does not appear in its derivative here."]]},
    {id:"L01.q7", ref:"p. 4", q:"A function giving how blood pressure changes during a heartbeat should be written as", opts:[["$P(t)$",1,"Pressure depends on time here."],["$P(x)$",0,"$P(x)$ suits pressure along a distance $x$ from the heart."],["$t(P)$",0,"Pressure is the output, not the input."],["$y(x)$",0,"In science, name variables after what they measure."]]},
    {id:"L01.q8", ref:"p. 3", q:"If $h(x)=f(g(x))$, then $h'(x)=$", opts:[["$f'(g(x))\\,g'(x)$",1,"Chain rule."],["$f'(x)\\,g'(x)$",0,"The outside derivative is evaluated at $g(x)$."],["$f'(g'(x))$",0,"Not a rule."],["$f(g'(x))\\,g'(x)$",0,"Differentiate the outside function."]]},
    {id:"L01.q9", ref:"p. 5", q:"$T(t)=100-80e^{-t/20}$ °C with $t$ in minutes. Which is true?", opts:[["$T'(t)=4e^{-t/20}$ °C/min, so the temperature is always increasing",1,"Chain rule: $-80\\cdot(-\\tfrac{1}{20})e^{-t/20} = 4e^{-t/20} > 0$."],["$T'(t)=-80e^{-t/20}$ °C/min",0,"You need the chain rule factor $-\\tfrac{1}{20}$."],["$T'(t)=4e^{-t/20}$ °C, so the temperature is always increasing",0,"A derivative has units of °C per minute."],["$T'(t)$ is in minutes per °C",0,"Upside down."]]}
  ],
  steps:[
    {type:"read", title:"What this course is built on", body:`<p>Four ideas hold up everything in MATH 127 (p. 2):</p><ol><li>What a function is.</li><li>What the derivative represents.</li><li>Integrals are sums of infinitely small changes.</li><li>How derivatives and integrals are related.</li></ol><div class="box def"><b class="t">A function is an object</b>$f(x)=2\\sqrt{x}$ is a machine that inputs a non-negative number $x$ and outputs $2\\sqrt{x}$. The formula $2\\sqrt{x}$ only describes the machine.</div><p class="muted small">Long answer questions on quizzes 2 to 10, the midterm and the final come straight from the course notes: examples, mid-section exercises, end-of-section and end-of-chapter problems (p. 2).</p>`, ref:"pp. 1 to 2"},
    {type:"read", title:"Derivatives you must know", body:`<p>From the table on p. 3:</p>$$\\frac{d}{dx}c=0,\\quad \\frac{d}{dx}x^n = nx^{n-1}\\ (n\\ne0),\\quad \\frac{d}{dx}e^x=e^x,\\quad \\frac{d}{dx}\\sin x=\\cos x,\\quad \\frac{d}{dx}\\cos x=-\\sin x$$<p>And the rules, for differentiable $f$ and $g$:</p><ul><li>Constant rule: $(cf)' = cf'$</li><li>Sum rule: $(f+g)' = f'+g'$</li><li>Product rule: $(fg)' = f'g + fg'$</li><li>Quotient rule: $\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}$</li><li>Chain rule: $\\big(f(g(x))\\big)' = f'(g(x))\\,g'(x)$</li></ul>`, ref:"p. 3"},
    {type:"mcq", title:"Pick the rule", q:"To differentiate $f(t)=\\frac{3}{t^2+1}$, which two approaches both work? (p. 4 exercise)", multi:true,
      opts:[["The quotient rule",true,"Top 3, bottom $t^2+1$."],["The chain rule on $3(t^2+1)^{-1}$",true,"Outside $3u^{-1}$, inside $u=t^2+1$."],["Differentiate the top and bottom separately: $\\frac{0}{2t}$",false,"Derivatives do not split across a fraction."],["The product rule with $f=3$, $g=t^2+1$",false,"This is a quotient, not a product."]],
      after:"Either way you get $\\frac{df}{dt} = -\\frac{6t}{(t^2+1)^2}$."},
    {type:"explore", title:"dy/dx is a ratio of changes", fig:"secant", body:`<p>The definition of the derivative (p. 3):</p>$$\\frac{dy}{dx}=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}=\\lim_{h\\to 0}\\frac{\\Delta y}{\\Delta x}$$<p>$f(x+h)-f(x)$ is the change in $y$. $h$ is the change in $x$. So $\\frac{dy}{dx}$ is the slope of the secant line when the run is tiny.</p><p><b>Try it.</b> Drag the point along the curve, then slide $\\Delta x$ toward 0. Watch the secant slope close in on the tangent slope.</p>`, ref:"pp. 3 to 4"},
    {type:"example", title:"Two ways to one derivative", ex:{q:"Let $f(x)=5x^3$. What are the two ways you can find $f'(x)$?", ref:"p. 4",
      steps:[{t:"Constant rule: $f'(x) = 5(x^3)' = 5\\cdot 3x^2 = 15x^2$.",why:"5 is a constant multiple."},{t:"Product rule: $f'(x) = (5)'x^3 + 5(x^3)'$.",why:"Treat 5 and $x^3$ as two factors."},{t:"$= 0\\cdot x^3 + 5\\cdot 3x^2 = 15x^2$.",why:"The derivative of the constant 5 is 0."}], ans:"$f'(x)=15x^2$ either way."}},
    {type:"try", title:"Your turn: the rules", gen:"L01.g.rules"},
    {type:"read", title:"Variables in science", body:`<p>Math uses $x$ for the input and $y$ for the output. Science names variables after what they measure: $t$ for time, $x$ for distance, $P$ for pressure (p. 4).</p><ul><li>Blood pressure dropping as blood moves away from the heart: $P(x)$.</li><li>Blood pressure rising and falling during a heartbeat: $P(t)$.</li></ul><div class="box warn"><b class="t">Watch for this</b>Pay attention to the variable names. If the function is $f(t)$, the derivative is $\\frac{df}{dt}$, and your answer is written in $t$.</div>`, ref:"p. 4"},
    {type:"explore", title:"Units come from the notation", fig:"units", body:`<p>The derivative is the instantaneous rate of change (p. 4). The notation tells you the units.</p><div class="box"><b class="t">Example (p. 4)</b>If $s(t)$ is position in km and $t$ is in hours, then $s'(t)=\\frac{ds}{dt}$ is a change in km over a change in hours: km/h. It is the velocity.</div><p>In the figure, $T(t)=100-80e^{-t/20}$ is in °C and $t$ is in minutes, so $T'(t)$ is in °C/min. Drag the point: the slope is always positive, so the calculator keeps heating up, more slowly over time.</p>`, ref:"pp. 4 to 5"},
    {type:"try", title:"Units of a derivative", gen:"L01.g.units"},
    {type:"try", title:"What does the number mean?", gen:"L01.g.meaning"},
    {type:"mcq", title:"Check yourself", q:"$P(x)$ is blood pressure in mmHg at a distance $x$ cm from the heart. $P'(30) = -0.4$. Which statement is right?", opts:[["30 cm from the heart, pressure is dropping by about 0.4 mmHg per cm",true,"Negative rate: decreasing. Units mmHg/cm."],["Pressure is $-0.4$ mmHg at 30 cm",false,"That would be $P(30)$."],["After 30 seconds, pressure is dropping 0.4 mmHg per second",false,"The input is distance, not time."],["0.4 cm from the heart, pressure is 30 mmHg",false,"Mixed up the input and the output."]]},
    {type:"formulas", title:"Lecture 1 formulas"}
  ]
});
