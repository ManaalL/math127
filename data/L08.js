/* Lecture 8 (Fri Sept 25): Integral functions continued (Left Riemann Sums from tables and graphs, composition), derivative of an integral function, FTC Part 1. Sections 2.2.1, 2.2.2. Notes: 6 pages. */
(function(){
const M=M127;
const Q=(n,d=1)=>{ if(d<0){ n=-n; d=-d; } const g=M.gcd(n,d); return [n/g,d/g]; };
const qt=q=>M.frac(q[0],q[1]);
const qa=q=>q[1]===1?String(q[0]):`(${q[0]}/${q[1]})`;
const qv=q=>q[0]/q[1];
const qadd=(p,q)=>Q(p[0]*q[1]+q[0]*p[1],p[1]*q[1]);
const qmul=(p,q)=>Q(p[0]*q[0],p[1]*q[1]);
const fmt=(v,dp=3)=>String(+(+v).toFixed(dp)).replace("-","−");
const pw=s=>/^(\\theta|[a-zA-Z0-9])$/.test(s)?s:`\\left(${s}\\right)`;
const cf=(n,d=1)=>{ const f=M.frac(n,d); return f==="1"?"":f==="-1"?"-":f; };
const exact=q=>{ let dd=q[1]; while(dd%2===0) dd/=2; while(dd%5===0) dd/=5; return dd===1?String(+(qv(q)).toFixed(6)):`${qt(q)}\\approx ${qv(q).toFixed(4)}`; };
const lines=arr=>arr.map((t,i)=>`$$${t}\\qquad (${i+1})$$`).join("");
const simpson=(f,a,b,n=240)=>{ if(a===b) return 0; const h=(b-a)/n; let s=f(a)+f(b); for(let i=1;i<n;i++) s+=f(a+i*h)*(i%2?4:2); return s*h/3; };

/* integrands written as functions of a symbol: t(tex symbol), a(ascii symbol), anti(ascii) when elementary */
const INT={
  poly:{t:S=>`${pw(S)}^2+${S}-1`, a:S=>`(${S})^2+(${S})-1`, anti:S=>`(${S})^3/3+(${S})^2/2-(${S})`},
  sqrt:{t:S=>`\\sqrt{${S}}`, a:S=>`sqrt(${S})`, anti:S=>`2/3*(${S})^(3/2)`, need:"pos"},
  tcos:{t:S=>`${pw(S)}\\cos(${S})`, a:S=>`(${S})*cos(${S})`, anti:S=>`(${S})*sin(${S})+cos(${S})`},
  exp1:{t:S=>`e^{${S}}+1`, a:S=>`e^(${S})+1`, anti:S=>`e^(${S})+(${S})`},
  texp:{t:S=>`${pw(S)} e^{${S}}`, a:S=>`(${S})*e^(${S})`, anti:S=>`((${S})-1)*e^(${S})`},
  gauss:{t:S=>`e^{${pw(S)}^2}`, a:S=>`e^((${S})^2)`},
  sinsq:{t:S=>`\\sin\\left(${pw(S)}^2\\right)`, a:S=>`sin((${S})^2)`},
  expover:{t:S=>`\\frac{e^{${S}}}{${S}}`, a:S=>`e^(${S})/(${S})`, need:"nz"},
  sinc:{t:S=>`\\frac{\\sin(${S})}{${S}}`, a:S=>`sin(${S})/(${S})`, need:"nz"},
  recip:{t:S=>`\\frac{1}{${pw(S)}^2+1}`, a:S=>`1/((${S})^2+1)`, anti:S=>`arctan(${S})`},
  cbrt:{t:S=>`\\left(${pw(S)}^2+2\\right)^{1/3}`, a:S=>`((${S})^2+2)^(1/3)`},
  hyp:{t:S=>`\\sqrt{${pw(S)}^2+1}`, a:S=>`sqrt((${S})^2+1)`}
};
const H={
  sq:{t:"x^2",a:"x^2",dt:"2x",da:"2x",pos:true,dom:[-2,2]},
  cube:{t:"x^3",a:"x^3",dt:"3x^2",da:"3x^2",dom:[-1.5,1.5]},
  two:{t:"2x",a:"2x",dt:"2",da:"2",dom:[-2,2]},
  three:{t:"3x",a:"3x",dt:"3",da:"3",dom:[-1.5,1.5]},
  sin:{t:"\\sin(x)",a:"sin(x)",dt:"\\cos(x)",da:"cos(x)",dom:[-3,3]},
  exp:{t:"e^x",a:"e^x",dt:"e^x",da:"e^x",pos:true,nz:true,dom:[-2,1.2]},
  quad:{t:"x^2+2x",a:"x^2+2x",dt:"2x+2",da:"2x+2",multi:true,dom:[-2,1]},
  cos:{t:"\\cos(x)",a:"cos(x)",dt:"-\\sin(x)",da:"-sin(x)",neg:true,dom:[-3,3]},
  sq1:{t:"x^2+1",a:"x^2+1",dt:"2x",da:"2x",pos:true,nz:true,dom:[-1.5,1.5]},
  tan:{t:"\\tan(x)",a:"tan(x)",dt:"\\sec^2(x)",da:"1/cos(x)^2",dom:[-1.2,1.2]},
  ln:{t:"\\ln(x)",a:"ln(x)",dt:"\\frac{1}{x}",da:"1/x",dom:[0.3,3]},
  root:{t:"\\sqrt{x}",a:"sqrt(x)",dt:"\\frac{1}{2\\sqrt{x}}",da:"1/(2sqrt(x))",pos:true,nz:true,dom:[0.2,4]},
  gx:{t:"e^{x^2}",a:"e^(x^2)",dt:"2xe^{x^2}",da:"2x*e^(x^2)",pos:true,nz:true,dom:[-1.1,1.1]},
  poly2:{t:"2x^2+3x",a:"2x^2+3x",dt:"4x+3",da:"4x+3",multi:true,dom:[-2,1]}
};
const dB=h=>(h.multi||h.neg)?`\\left(${h.dt}\\right)`:h.dt;

M.lecture({
  id:"L08", n:8, date:"2026-09-25", added:"2026-10-21", unit:"u3", quiz:"Q4",
  title:"Integral Functions and FTC Part 1", sections:["2.2.1","2.2.2"], pages:6,
  summary:"Approximating integral functions with a Left Riemann Sum from a table or a graph, composing with an integral function, and the Fundamental Theorem of Calculus Part 1, with and without the Chain Rule.",
  flags:[
    {ref:"p. 4", text:"The notes call $\\int_a^x v(t)\\,dt$ \"the net distance travelled\". It is the net change in position (displacement). If the velocity changes sign, it is not the total distance travelled."}
  ],
  formulas:[
    {id:"L08.f.intfn", name:"Integral function", tex:"f(x)=\\int_a^x g(t)\\,dt", note:"$x$ is the independent variable of $f$ and $t$ is the variable of integration.", ref:"p. 1",
      blank:{tex:"f(x)=\\int_{\\boxed{\\,?\\,}}^x g(t)\\,dt", text:true, accept:["a"]}},
    {id:"L08.f.dt", name:"Left Riemann Sum: step size", tex:"\\Delta t=\\frac{b-a}{n}", ref:"p. 1",
      blank:{tex:"\\Delta t=\\boxed{\\,?\\,}", answer:"(b-a)/n", vars:["a","b","n"], domain:[1,4]}},
    {id:"L08.f.ti", name:"Left Riemann Sum: points", tex:"t_i=a+i\\Delta t, \\quad 0\\le i\\le n", ref:"p. 1",
      blank:{tex:"t_i=\\boxed{\\,?\\,}", text:true, accept:["a+iΔt","a+i\\Delta t","a+idt","a+i*Δt"]}},
    {id:"L08.f.lrs", name:"Left Riemann Sum ($n=3$)", tex:"\\int_a^b g(t)\\,dt\\approx g(t_0)\\Delta t+g(t_1)\\Delta t+g(t_2)\\Delta t", note:"Use the left end of each piece: $t_0$ up to $t_{n-1}$. The table may list $t_n=b$ too; it is not used.", ref:"p. 2"},
    {id:"L08.f.compose", name:"Composition with an integral function", tex:"f(x)=\\int_a^x g(t)\\,dt \\;\\Rightarrow\\; f(h(x))=\\int_a^{h(x)} g(t)\\,dt", note:"The only $x$ in $f$ is the top bound, so that is the only thing that changes.", ref:"p. 3",
      blank:{tex:"f(h(x))=\\int_a^{\\boxed{\\,?\\,}} g(t)\\,dt", text:true, accept:["h(x)"]}},
    {id:"L08.f.netpos", name:"Net change in position", tex:"\\Delta s(x)=\\int_a^x v(t)\\,dt", ref:"p. 4"},
    {id:"L08.f.dnetpos", name:"Its derivative is the velocity", tex:"v(x)=\\frac{d}{dx}\\int_a^x v(t)\\,dt", ref:"p. 4",
      blank:{tex:"\\frac{d}{dx}\\int_a^x v(t)\\,dt=\\boxed{\\,?\\,}", text:true, accept:["v(x)"]}},
    {id:"L08.f.ftc1", name:"Fundamental Theorem of Calculus, Part 1", tex:"f \\text{ continuous on } [a,x],\\ F(x)=\\int_a^x f(t)\\,dt \\;\\Rightarrow\\; F'(x)=f(x)", ref:"p. 4",
      blank:{tex:"F(x)=\\int_a^x f(t)\\,dt \\;\\Rightarrow\\; F'(x)=\\boxed{\\,?\\,}", text:true, accept:["f(x)"]}},
    {id:"L08.f.ftc1-chain", name:"FTC Part 1 with the Chain Rule", tex:"f(x)=\\int_a^{h(x)} g(t)\\,dt \\;\\Rightarrow\\; f'(x)=g(h(x))\\,h'(x)", note:"The pattern in the example on p. 5: write $f=g\\circ h$ with $g(x)=\\int_a^x$, then use the Chain Rule.", ref:"p. 5",
      blank:{tex:"f(x)=\\int_a^{h(x)} g(t)\\,dt \\;\\Rightarrow\\; f'(x)=\\boxed{\\,?\\,}", text:true, accept:["g(h(x))h'(x)","g(h(x))*h'(x)","h'(x)g(h(x))","g(h(x))·h'(x)"]}},
    {id:"L08.f.ftc2", name:"FTC Part 2 (review)", tex:"F'(x)=f(x) \\;\\Rightarrow\\; \\int_a^b f(x)\\,dx=F(b)-F(a)", note:"Asked in the review on p. 1. Stated in Lecture 4.", ref:"p. 1",
      blank:{tex:"\\int_a^b f(x)\\,dx=\\boxed{\\,?\\,}", text:true, accept:["F(b)-F(a)"]}}
  ],
  glossary:[
    {id:"L08.t.intfn", term:"Integral function", def:"A function of the form $f(x)=\\int_a^x g(t)\\,dt$. Its value at $x$ is the signed area under $g$ from $a$ to $x$.", ref:"p. 1"},
    {id:"L08.t.dummy", term:"Variable of integration", def:"The letter after $d$ in the integral, like $t$ in $\\int_a^x g(t)\\,dt$. It only lives inside the integral, so you can rename it without changing $f$.", ref:"p. 1"},
    {id:"L08.t.table", term:"Left Riemann Sum from a table", def:"Find $a$, $b$, $n$, then $\\Delta t$ and the points $t_0,\\dots,t_{n-1}$. Read $g$ at those points only, multiply by $\\Delta t$ and add.", ref:"pp. 1 to 2"},
    {id:"L08.t.compose", term:"Composition with an integral function", def:"To find $f(h(x))$ when $f(x)=\\int_a^x g(t)\\,dt$, replace the top bound $x$ with $h(x)$. The integrand and the $dt$ do not change.", ref:"p. 3"},
    {id:"L08.t.ftc1", term:"FTC Part 1", def:"If $f$ is continuous and $F(x)=\\int_a^x f(t)\\,dt$, then $F'(x)=f(x)$. The derivative cancels the integral, and you write the answer in the function's own variable.", ref:"p. 4"},
    {id:"L08.t.lower", term:"Lower limit", def:"The bottom number $a$ in $\\int_a^x$. Changing it shifts $F$ up or down by a constant, so it does not change $F'(x)$.", ref:"p. 5"},
    {id:"L08.t.disp", term:"Net change in position", def:"$\\int_a^x v(t)\\,dt$, the change in position from $t=a$ to $t=x$. The notes call it the net distance travelled.", ref:"p. 4"}
  ],
  figures:{
    lrsgraph:{title:"Rectangles under a graph", cap:"<b>Fig. 8.1</b> A curve through the points read from the graph on p. 2: $g(1)=2$, $g(2)=1$, $g(3)=2$, $g(4)=3$. The Left Riemann Sum for $f(4)=\\int_1^4 g(t)\\,dt$ uses the height at the left end of each piece. (Lecture 8, pp. 2 to 3)",
      build(host,{PLOT}){
        const g=t=>-(t**4)/6+4*t**3/3-17*t*t/6+2*t/3+3;
        let n=3;
        const G=PLOT.graph(host,{x:[0.4,4.5],y:[-0.3,3.6],c:"var(--u3)",xlabel:"t",ylabel:"y",xstep:1,ystep:1});
        G.area(g,1,4);
        const rects=G.rects([]);
        G.fn(g,{cls:"cv c",from:0.8,to:4.3});
        const dots=[];
        G.label(3.5,3.25,"y = g(t)",{cls:"lblc"});
        const ctl=PLOT.controls(host);
        PLOT.slider(ctl,{label:"Subdivisions n",min:1,max:12,step:1,value:n,oninput:v=>{ n=v; draw(); }});
        const ro=PLOT.readout(host);
        const exactA=simpson(g,1,4);
        function draw(){
          const dt=3/n, L=[]; let s=0; dots.forEach(d=>d.remove()); dots.length=0;
          for(let i=0;i<n;i++){ const ti=1+i*dt; L.push({x:ti,w:dt,h:g(ti)}); s+=g(ti)*dt; dots.push(G.dot(ti,g(ti),{filled:true,r:3.5})); }
          rects.update(L);
          ro.innerHTML=`Δt = (4 − 1)/${n} = <b>${fmt(dt)}</b> &nbsp; left sum ≈ <b>${fmt(s,4)}</b> &nbsp; area under this curve ≈ ${fmt(exactA,4)}`;
        }
        draw();
      }},
    ftc:{title:"FTC Part 1: area builds the function", cap:"<b>Fig. 8.2</b> Top: $g(t)$ with the signed area from $a$ to $x$ shaded. Bottom: $f(x)=\\int_a^x g(t)\\,dt$. The slope of $f$ at $x$ is the height $g(x)$, and moving $a$ only shifts $f$ up or down. (Lecture 8, p. 4)",
      build(host,{PLOT}){
        const g=t=>1.5*Math.cos(0.9*t), Gt=t=>(1.5/0.9)*Math.sin(0.9*t);
        let a=0.5, x=2;
        const F=s=>Gt(s)-Gt(a);
        const top=PLOT.graph(host,{x:[-0.2,7],y:[-2,2],h:220,c:"var(--u3)",xlabel:"t",ylabel:"y"});
        const area=top.area(g,a,x);
        top.fn(g,{cls:"cv c"});
        top.label(5.6,1.6,"y = g(t)",{cls:"lblc"});
        const aL=top.line(a,-2,a,2,{cls:"lt dash"}), aT=top.label(a,-1.8,"a",{cls:"lblc",dx:4});
        const hT=top.dot(x,g(x),{filled:true,r:4});
        const bot=PLOT.graph(host,{x:[-0.2,7],y:[-3.8,3.8],h:220,c:"var(--u3)",xlabel:"x",ylabel:"y"});
        const fc=bot.fn(F,{cls:"cv c"});
        bot.label(5.6,3.2,"y = f(x)",{cls:"lblc"});
        const tan=bot.tangent(x,F(x),g(x)), dot=bot.dot(x,F(x),{filled:true});
        const ctl=PLOT.controls(host);
        PLOT.slider(ctl,{label:"Lower limit a",min:0,max:3,step:0.25,value:a,fmt:v=>fmt(v,2),oninput:v=>{ a=v; draw(); }});
        const ro=PLOT.readout(host);
        const hd=top.handle(x,0,{axis:"x",bounds:[0,7],label:"Upper limit x",onMove:v=>{ x=v; draw(); }});
        function draw(){
          area.update(g,a,x); aL.set(a,-2,a,2); aT.set(a,-1.8); hT.set(x,g(x));
          fc.update(F); tan.at(x,F(x),g(x)); dot.set(x,F(x));
          ro.innerHTML=`x = ${fmt(x,2)} &nbsp; f(x) = signed area = <b>${fmt(F(x),3)}</b> &nbsp; slope of f at x = <b>${fmt(g(x),3)}</b> = g(x)`;
        }
        draw();
      }},
    chain:{title:"Why the Chain Rule shows up", cap:"<b>Fig. 8.3</b> $f(x)=\\int_0^{h(x)} g(t)\\,dt$ is the area up to $h(x)$. When $x$ grows by $dx$, the top limit moves by about $h'(x)\\,dx$, so the area grows by about $g(h(x))\\,h'(x)\\,dx$. (Lecture 8, p. 5)",
      build(host,{PLOT}){
        const g=t=>1+0.5*Math.sin(2*t), Gt=t=>t-0.25*Math.cos(2*t);
        const HS={sq:{h:x=>x*x,dh:x=>2*x,lab:"x²",max:2.05},two:{h:x=>2*x,dh:()=>2,lab:"2x",max:2.05},cube:{h:x=>x**3,dh:x=>3*x*x,lab:"x³",max:1.6}};
        let key="sq", x=1.2; const dx=0.1;
        const G=PLOT.graph(host,{x:[-0.2,4.6],y:[-0.3,1.8],c:"var(--u3)",xlabel:"t",ylabel:"y",ystep:0.5});
        const area=G.area(g,0,1);
        const sliver=G.between(g,()=>0,1,1.1); sliver.style.fill="var(--c,var(--accent))"; sliver.style.fillOpacity=".5";
        G.fn(g,{cls:"cv c"});
        G.label(3.4,1.62,"y = g(t)",{cls:"lblc"});
        const up=G.line(0,0,0,0,{cls:"lt dash"}), upL=G.label(0,0,"",{cls:"lblc",dx:4,dy:-4});
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Top limit",items:[["sq","h(x) = x²"],["two","h(x) = 2x"],["cube","h(x) = x³"]],value:key,onchange:v=>{ key=v; x=Math.min(x,HS[key].max); sl.set(x); draw(); }});
        const sl=PLOT.slider(ctl,{label:"x",min:0.2,max:2.05,step:0.01,value:x,fmt:v=>fmt(v,2),oninput:v=>{ x=Math.min(v,HS[key].max); draw(); }});
        const ro=PLOT.readout(host);
        function draw(){
          const S=HS[key], u=S.h(x), u2=S.h(x+dx);
          area.update(g,0,u); sliver.update(g,()=>0,u,Math.min(u2,4.6));
          up.set(u,0,u,g(u)); upL.set(u,g(u),`h(x) = ${fmt(u,2)}`);
          const f=s=>Gt(S.h(s))-Gt(0), num=(f(x+1e-4)-f(x-1e-4))/2e-4;
          ro.innerHTML=`h(x) = ${S.lab} = ${fmt(u,3)} &nbsp; h′(x) = ${fmt(S.dh(x),3)} &nbsp; g(h(x)) = ${fmt(g(u),3)}<br>f′(x) = g(h(x))·h′(x) = <b>${fmt(g(u)*S.dh(x),3)}</b> &nbsp; slope measured from the area: ${fmt(num,3)}`;
        }
        draw();
      }}
  },
  gens:[
    {id:"L08.g.lrs-table", title:"Left Riemann Sum from a table", skill:"Approximate $f(b)=\\int_a^b g(t)\\,dt$ from a table", ref:"pp. 1 to 3",
      gen(R,d){
        const n=d===1?R.pick([2,3]):R.pick([3,4]);
        const dt=d===1?R.pick([Q(1),Q(1,2)]):R.pick([Q(1),Q(1,2),Q(1,3),Q(1,4)]);
        const a=Q(R.int(-1,3));
        const pts=[]; for(let i=-1;i<=n;i++) pts.push({t:qadd(a,qmul(Q(i),dt)), v:(R.int(-40,40)/10), i});
        let cols=pts.filter(p=>p.i>=0&&(d===1?p.i<n:true));
        if(d===3){ cols=pts.slice(); if(dt[1]===3){ const mid=qadd(a,Q(1,2)); cols.splice(3,0,{t:mid,v:R.int(-40,40)/10,i:"m"}); } }
        const used=pts.filter(p=>p.i>=0&&p.i<n), b=qadd(a,qmul(Q(n),dt));
        const vs=v=>v.toFixed(1);
        const tbl=`$$\\begin{array}{c|${"c".repeat(cols.length)}} t & ${cols.map(p=>qt(p.t)).join(" & ")} \\\\ \\hline g(t) & ${cols.map(p=>vs(p.v)).join(" & ")}\\end{array}$$`;
        const sum10=used.reduce((s,p)=>s+Math.round(p.v*10),0);
        const val=Q(sum10*dt[0],10*dt[1]);
        const extra=cols.filter(p=>!(p.i>=0&&p.i<n)).map(p=>`$t=${qt(p.t)}$`);
        return {prompt:`Some values of a function $g$ are given in the table. Let $f(x)=\\int_{${qt(a)}}^x g(t)\\,dt$. Use the Left Riemann Sum Approximation with $n=${n}$ subdivisions to approximate $f(${qt(b)})$.${tbl}`,
          answer:{type:"num",answer:`${qa(dt)}*(${used.map(p=>vs(p.v)).join("+")})`}, verify:{value:qv(val)},
          hint:"$f("+qt(b)+")=\\int_{"+qt(a)+"}^{"+qt(b)+"} g(t)\\,dt$. Find $\\Delta t$ and the points $t_0,\\dots,t_{"+(n-1)+"}$, then read only those values from the table.",
          steps:[`$f(${qt(b)})=\\int_{${qt(a)}}^{${qt(b)}} g(t)\\,dt$, so $a=${qt(a)}$, $b=${qt(b)}$, $n=${n}$.`,
            `$\\Delta t=\\frac{b-a}{n}=\\frac{${qt(b)}-${qv(a)<0?`(${qt(a)})`:qt(a)}}{${n}}=${qt(dt)}$ and $t_i=a+i\\Delta t$.`,
            `${used.map(p=>`$t_${p.i}=${qt(p.t)}$`).join(", ")}. A left sum stops at $t_{${n-1}}$.${extra.length?` The table also lists ${extra.join(", ")}, which ${extra.length>1?"are":"is"} not used.`:""}`,
            `$f(${qt(b)})\\approx ${used.map(p=>`g(t_${p.i})\\Delta t`).join("+")} = ${qt(dt)}\\left(${used.map(p=>vs(p.v)).join("+").replace(/\+-/g,"-")}\\right)$.`,
            `$= ${qt(dt)}\\cdot(${(sum10/10).toFixed(1)}) = ${exact(val)}$.`],
          answerTeX:`$f(${qt(b)})\\approx ${exact(val)}$`};
      }},
    {id:"L08.g.evaluate", title:"Evaluate an integral function", skill:"Use FTC Part 2 to evaluate $\\int_a^x g(t)\\,dt$", ref:"p. 1",
      gen(R,d){
        if(d===1){
          const c=R.nz(-4,4), k=R.int(0,3), a=R.int(-2,2), b=R.int(-1,4);
          const B=a===b?b+1:b;
          const gT=k===0?String(c):M.term(c,"t",k,true), GT=k===0?`${cf(c)}t`:`${cf(c,k+1)}t^{${k+1}}`;
          const val=Q(c*(B**(k+1)-a**(k+1)),k+1);
          return {prompt:`Let $f(x)=\\int_{${a}}^x ${gT}\\,dt$. What is $f(${B})$?`, answer:{type:"num",answer:qa(val)}, verify:{value:qv(val)},
            hint:"$f("+B+")=\\int_{"+a+"}^{"+B+"}$. Find an antiderivative and use FTC Part 2: $F(b)-F(a)$.",
            steps:[`$f(${B})=\\int_{${a}}^{${B}} ${gT}\\,dt$.`,`An antiderivative of $${gT}$ is $${GT}$.`,`FTC Part 2: $f(${B})=\\left[${GT}\\right]_{${a}}^{${B}}=${qt(val)}$.`],
            answerTeX:`$f(${B})=${qt(val)}$`};
        }
        if(d===2){
          const c=R.nz(-4,4), k=R.int(1,3), m=R.int(-5,5), a=R.int(-2,3);
          const gT=`${M.term(c,"t",k,true)}${M.term(m,"t",0)}`;
          const ans=`${c}/${k+1}*(x^${k+1}-(${a})^${k+1})+${m}*(x-(${a}))`;
          const GT=`${cf(c,k+1)}t^{${k+1}}${m?M.term(m,"t",1):""}`;
          const cst=Q(-(c*a**(k+1))-(k+1)*m*a,k+1);
          const lead=cf(c,k+1);
          return {prompt:`Let $f(x)=\\int_{${a}}^x \\left(${gT}\\right)dt$. Find a formula for $f(x)$.`, answer:{answer:ans,vars:["x"],domain:[-2,2]}, verify:{antideriv:`${c}*x^${k}+${m}`},
            hint:"Antiderivative of the integrand, then $F(x)-F("+a+")$. Your answer should be in $x$, with no $t$ left.",
            steps:[`An antiderivative of $${gT}$ is $G(t)=${GT}$.`,`$f(x)=G(x)-G(${a})$ (FTC Part 2).`,`$= ${lead}x^{${k+1}}${m?M.term(m,"x",1):""}${cst[0]===0?"":(qv(cst)<0?"-":"+")+qt(Q(Math.abs(cst[0]),cst[1]))}$.`],
            answerTeX:`$f(x)=${lead}x^{${k+1}}${m?M.term(m,"x",1):""}${cst[0]===0?"":(qv(cst)<0?"-":"+")+qt(Q(Math.abs(cst[0]),cst[1]))}$`};
        }
        const C=R.pick([
          {g:"e^t",a:"0",G:"e^t",ans:"e^x-1",ansT:"e^x-1",gx:"e^x",dom:[-2,2]},
          {g:"e^t",a:"1",G:"e^t",ans:"e^x-e",ansT:"e^x-e",gx:"e^x",dom:[-2,2]},
          {g:"\\cos(t)",a:"0",G:"\\sin(t)",ans:"sin(x)",ansT:"\\sin(x)",gx:"cos(x)",dom:[-3,3]},
          {g:"\\sin(t)",a:"0",G:"-\\cos(t)",ans:"1-cos(x)",ansT:"1-\\cos(x)",gx:"sin(x)",dom:[-3,3]},
          {g:"e^{-t}",a:"0",G:"-e^{-t}",ans:"1-e^(-x)",ansT:"1-e^{-x}",gx:"e^(-x)",dom:[-2,2]},
          {g:"\\frac{1}{t^2}",a:"1",G:"-\\frac{1}{t}",ans:"1-1/x",ansT:"1-\\frac{1}{x}",gx:"1/x^2",dom:[0.5,3]},
          {g:"\\sin(t)",a:"\\pi",G:"-\\cos(t)",ans:"-1-cos(x)",ansT:"-1-\\cos(x)",gx:"sin(x)",dom:[-3,3]}]);
        return {prompt:`Let $f(x)=\\int_{${C.a}}^x ${C.g}\\,dt$. Find a formula for $f(x)$.`, answer:{answer:C.ans,vars:["x"],domain:C.dom}, verify:{antideriv:C.gx},
          hint:"Find an antiderivative $G(t)$, then $f(x)=G(x)-G("+C.a+")$. Check: your answer should give $f("+C.a+")=0$.",
          steps:[`An antiderivative of $${C.g}$ is $G(t)=${C.G}$.`,`$f(x)=G(x)-G(${C.a})$ by FTC Part 2.`,`$f(x)=${C.ansT}$. Check: at $x=${C.a}$ this gives 0, as it should.`],
          answerTeX:`$f(x)=${C.ansT}$`};
      }},
    {id:"L08.g.compose", title:"Composition with an integral function", skill:"Find $f(h(x))$ when $f$ is an integral function", ref:"pp. 3 to 4",
      gen(R,d){
        const keys=["sinsq","tcos","hyp","gauss","recip","texp","sinc","cbrt"];
        const I=INT[R.pick(keys)];
        const hs=[{t:S=>`${pw(S)}^2`,a:"x^2"},{t:S=>`e^{${S}}`,a:"e^x"},{t:S=>`2${pw(S)}+1`,a:"2x+1"},{t:S=>`\\sin(${S})`,a:"sin(x)"},{t:S=>`${pw(S)}^3`,a:"x^3"},{t:S=>`\\cos(${S})`,a:"cos(x)"},{t:S=>`${pw(S)}^2+${S}`,a:"x^2+x"}];
        const h=R.pick(hs), a=R.pick(["0","1","-1","2","3","-\\frac{1}{2}"]);
        const fT=`\\int_{${a}}^{x} ${I.t("t")}\\,dt`, hx=h.t("x");
        if(d===3){
          return {prompt:`Let $g(x)=\\int_{${a}}^x ${I.t("t")}\\,dt$ and $f(x)=\\int_{${a}}^{${hx}} ${I.t("t")}\\,dt$. What function $h(x)$ is required so that $f(x)=(g\\circ h)(x)$?`,
            answer:{answer:h.a,vars:["x"],domain:[-1.5,1.5]},
            hint:"In $g$, the only $x$ is the top bound. Compare the top bounds of $g$ and $f$.",
            steps:[`$(g\\circ h)(x)=g(h(x))$ replaces the top bound $x$ of $g$ with $h(x)$.`,`The top bound of $f$ is $${hx}$, and nothing else changed.`,`So $h(x)=${hx}$.`],
            answerTeX:`$h(x)=${hx}$`};
        }
        const outer=d===2&&R.int(0,1)===1;
        let right, opts;
        if(!outer){
          right=`$\\int_{${a}}^{${hx}} ${I.t("t")}\\,dt$`;
          opts=[right,`$\\int_{${a}}^{x} ${I.t(h.t("t"))}\\,dt$`,`$\\int_{${a}}^{${hx}} ${I.t(hx)}\\,dx$`,`$\\int_{x}^{${hx}} ${I.t("t")}\\,dt$`,`$${pw(hx)}\\int_{${a}}^{x} ${I.t("t")}\\,dt$`];
        } else {
          right=`$${h.t(`\\int_{${a}}^{x} ${I.t("t")}\\,dt`)}$`;
          opts=[right,`$\\int_{${a}}^{${hx}} ${I.t("t")}\\,dt$`,`$\\int_{${a}}^{x} ${h.t(I.t("t"))}\\,dt$`,`$${pw(hx)}\\int_{${a}}^{x} ${I.t("t")}\\,dt$`];
        }
        const sh=R.shuffle(opts);
        return {prompt:`Let $f(x)=${fT}$ and $h(x)=${hx}$. Which is $(${outer?"h\\circ f":"f\\circ h"})(x)$?`,
          parts:[{answer:{type:"mc",options:sh,correct:sh.indexOf(right)}}],
          hint:outer?"$(h\\circ f)(x)=h(f(x))$: the integral function goes inside $h$.":"$(f\\circ h)(x)=f(h(x))$. In $f$, the only $x$ is the top bound of the integral.",
          steps:outer?[`$(h\\circ f)(x)=h(f(x))$: put all of $f(x)$ into $h$.`,`So $(h\\circ f)(x)=${h.t(fT)}$.`,`$\\int_{${a}}^{${hx}}\\cdots$ would be $f(h(x))$, the other order.`]
            :[`$(f\\circ h)(x)=f(h(x))$: replace every $x$ in $f$ with $${hx}$.`,`In $f(x)=${fT}$ the only $x$ is the top bound. The integrand and $dt$ use $t$, and $t$ does not change.`,`So $f(h(x))=\\int_{${a}}^{${hx}} ${I.t("t")}\\,dt$.`],
          answerTeX:right};
      }},
    {id:"L08.g.ftc1", title:"FTC Part 1", skill:"Differentiate $\\int_a^x g(t)\\,dt$", ref:"pp. 4 to 5",
      gen(R,d){
        const [v,s]=d===1?["x","t"]:R.pick([["w","x"],["r","x"],["x","s"],["u","w"],["\\theta","x"],["t","s"],["x","r"]]);
        const vA=v==="\\theta"?"theta":v, sA=s;
        const c=R.nz(-5,5), k=R.int(2,4), m=R.int(1,9);
        const low=R.pick(d===3?[17,-7,96,-3,5]:[0,1,-2,3,2,-1]);
        const F=R.pick([
          {t:S=>`${M.term(c,S,k,true)}+${m}`,a:S=>`${c}*(${S})^${k}+${m}`,anti:S=>`${c}/${k+1}*(${S})^${k+1}+${m}*(${S})`},
          {t:S=>`${S} e^{${S}}+${S}`,a:S=>`(${S})*e^(${S})+(${S})`,anti:S=>`((${S})-1)*e^(${S})+(${S})^2/2`},
          {t:S=>`\\cos(${S})+${pw(S)}^2`,a:S=>`cos(${S})+(${S})^2`,anti:S=>`sin(${S})+(${S})^3/3`},
          {t:S=>`${m}\\sin(${S})`,a:S=>`${m}*sin(${S})`,anti:S=>`-${m}*cos(${S})`},
          {t:S=>`\\sqrt{${pw(S)}^2+${m}}`,a:S=>`sqrt((${S})^2+${m})`},
          {t:S=>`\\ln\\left(${pw(S)}^2+1\\right)`,a:S=>`ln((${S})^2+1)`},
          {t:S=>`e^{\\cos(${S})}`,a:S=>`e^(cos(${S}))`},
          {t:S=>`\\frac{${S}}{${pw(S)}^2+${m}}`,a:S=>`(${S})/((${S})^2+${m})`,anti:S=>`ln((${S})^2+${m})/2`}]);
        const fn=v==="x"?"f":R.pick(["f","g","h"]);
        const prompt=d===1?`Evaluate $\\frac{d}{dx}\\int_{${low}}^{x} ${F.t("t")}\\,dt$.`:`Find $${fn}'(${v})$ where $${fn}(${v})=\\int_{${low}}^{${v}} ${F.t(s)}\\,d${s}$.`;
        const out={prompt, answer:{answer:F.a(vA),vars:[vA],domain:[-2,2]},
          hint:"FTC Part 1: the derivative cancels the integral. Write the integrand with the function's own variable in place of the variable of integration.",
          steps:[d===1?`FTC Part 1 with $F(x)=\\int_{${low}}^x g(t)\\,dt$ and $g(t)=${F.t("t")}$: $F'(x)=g(x)$.`:`Here $${v}$ is the independent variable and $${s}$ is the variable of integration.`,
            d===1?`So the answer is $${F.t("x")}$.`:`FTC Part 1: $${fn}'(${v})$ is the integrand with $${s}$ replaced by $${v}$: $${fn}'(${v})=${F.t(v)}$.`,
            `The lower limit $${low}$ does not matter. Changing it only adds a constant to $${d===1?"F":fn}$, and constants differentiate to 0.`],
          answerTeX:d===1?`$${F.t("x")}$`:`$${fn}'(${v})=${F.t(v)}$`};
        if(F.anti) out.verify={deriv:F.anti(vA),v:vA};
        return out;
      }},
    {id:"L08.g.ftc-chain", title:"FTC Part 1 with the Chain Rule", skill:"Differentiate $\\int_a^{h(x)} g(t)\\,dt$", ref:"p. 5",
      gen(R,d){
        const hk=d===1?["sq","cube","two","three"]:d===2?["sin","exp","quad","cos","sq1"]:["tan","ln","root","gx","poly2"];
        const ik=d===1?["poly","exp1","tcos","sqrt","texp"]:d===2?["poly","sqrt","tcos","exp1","texp","recip","gauss","sinsq"]:["gauss","sinsq","expover","sinc","cbrt","hyp","texp","sqrt","recip"];
        let h, I, tries=0;
        do{ h=H[R.pick(hk)]; I=INT[R.pick(ik)]; tries++; } while(((I.need==="pos"&&!h.pos)||(I.need==="nz"&&!h.nz)) && tries<50);
        if((I.need==="pos"&&!h.pos)||(I.need==="nz"&&!h.nz)){ I=INT.poly; }
        const lows=I.need==="pos"?["0","1","4"]:I.need==="nz"?["1","2","3"]:d===3?["-\\sqrt{2}","-2","4","0"]:["0","1","-1","2","-3"];
        const lowT=R.pick(lows), lowA=lowT==="-\\sqrt{2}"?"-sqrt(2)":lowT;
        const s=d===3?R.pick(["t","w","u"]):"t";
        const ansA=`(${I.a(h.a)})*(${h.da})`;
        const gH=I.t(h.t);
        const special=(I===INT.sqrt&&h===H.sq)?[`Since $\\sqrt{x^2}=|x|$ (property (i)), this is $f'(x)=2x|x|$. It is not $2x^2$: that is wrong for $x<0$.`]:[];
        const out={prompt:`Let $f(x)=\\int_{${lowT}}^{${h.t}} ${I.t(s)}\\,d${s}$. Find $f'(x)$.`,
          answer:{answer:ansA,vars:["x"],domain:h.dom},
          hint:"Write $f(x)=g(h(x))$ with $g(x)=\\int_{"+lowT+"}^x "+I.t(s)+"\\,d"+s+"$ and $h(x)="+h.t+"$. FTC Part 1 gives $g'$, then use the Chain Rule.",
          steps:[`Let $g(x)=\\int_{${lowT}}^{x} ${I.t(s)}\\,d${s}$ and $h(x)=${h.t}$. Then $f(x)=g(h(x))$.`,
            `By FTC Part 1, $g'(x)=${I.t("x")}$.`,`$h'(x)=${h.dt}$.`,
            `Chain Rule: $f'(x)=g'(h(x))\\cdot h'(x)=${gH}\\cdot ${dB(h)}$.`].concat(special),
          answerTeX:`$f'(x)=${gH}\\cdot ${dB(h)}$`};
        if(I.anti) out.verify={deriv:I.anti(h.a)};
        return out;
      }},
    {id:"L08.g.find-error", title:"Find the first mistake", skill:"Error analysis: Riemann sums and FTC", ref:"pp. 1 to 5",
      gen(R,d){
        const T=d===1?"LRS":d===2?R.pick(["LRS","FTC"]):R.pick(["FTC","FTC","LRS"]);
        let prob, L, bad, note;
        if(T==="LRS"){
          const a=R.int(0,2), n=R.pick([3,4]), b=a+n/2, dt=Q(1,2);
          const vals=Array.from({length:n+1},()=>R.int(-30,40)/10), ts=vals.map((_,i)=>a+i/2);
          const tbl=`$$\\begin{array}{c|${"c".repeat(n+1)}} t & ${ts.join(" & ")} \\\\ \\hline g(t) & ${vals.map(v=>v.toFixed(1)).join(" & ")}\\end{array}$$`;
          const e=R.pick([1,3,4]); bad=e;
          const terms=Array.from({length:n},(_,i)=>`g(t_${i})\\Delta t`);
          prob=`Some values of $g$ are given. Let $f(x)=\\int_{${a}}^x g(t)\\,dt$. Use the Left Riemann Sum Approximation with $n=${n}$ subdivisions to approximate $f(${b})$.${tbl}`;
          const l1=e===1?`\\Delta t=\\frac{b-a}{n}=\\frac{${b}-0}{${n}}=${qt(Q(b*2,2*n))}`:`\\Delta t=\\frac{b-a}{n}=\\frac{${b}-${a}}{${n}}=\\frac{1}{2}`;
          const l2=`t_i=a+i\\Delta t=${a}+\\frac{i}{2},\\quad 0\\le i\\le ${n}`;
          const l3=e===3?`f(${b})\\approx ${terms.join("+")}+g(t_${n})\\Delta t`:`f(${b})\\approx ${terms.join("+")}`;
          const useV=(e===3?vals:vals.slice(0,n));
          const l4=e===4?`=\\frac12\\left(${ts.slice(0,n).join("+")}\\right)`:`=\\frac12\\left(${useV.map(v=>v.toFixed(1)).join("+").replace(/\+-/g,"-")}\\right)`;
          const sv=e===4?ts.slice(0,n).reduce((x,y)=>x+y,0):useV.reduce((x,y)=>x+Math.round(y*10),0)/10;
          const l5=`=${+(sv/2).toFixed(3)}`;
          L=[l1,l2,l3,l4,l5];
          if(e===1&&a===0){ L[0]=`\\Delta t=\\frac{b-a}{n}=\\frac{${b}-${a}}{${n+1}}=${qt(Q(b*2,2*(n+1)))}`; }
          note={1:"Line (1) gets $\\Delta t$ wrong. It is $\\frac{b-a}{n}=\\frac{"+b+"-"+a+"}{"+n+"}=\\frac12$.",3:`Line (3) adds $g(t_${n})\\Delta t$. A left sum with $n=${n}$ stops at $t_${n-1}$.`,4:"Line (4) plugs in the $t_i$ values instead of $g(t_i)$."}[e];
        } else {
          const hk=R.pick(["quad","sin","exp","poly2","sq1"]), h=H[hk];
          const I=INT[R.pick(["gauss","sinsq","hyp","recip","exp1"])];
          const a=R.pick([0,1,2,-1]), e=R.pick([2,3,4]); bad=e;
          prob=`Let $f(x)=\\int_{${a}}^{${h.t}} ${I.t("t")}\\,dt$. Find $f'(x)$.`;
          const l1=`\\text{Let } g(x)=\\int_{${a}}^{x} ${I.t("t")}\\,dt \\text{ and } h(x)=${h.t}, \\text{ so } f(x)=g(h(x))`;
          const l2=e===2?`g'(x)=${I.t("x")}-${pw(I.t(String(a)))}\\ \\text{ by FTC Part 1}`:`g'(x)=${I.t("x")}\\ \\text{ by FTC Part 1}`;
          const l3=e===3?`f'(x)=g'(x)\\cdot h'(x)`:`f'(x)=g'(h(x))\\cdot h'(x)`;
          let l4;
          if(e===4){ l4=h.multi?`=${I.t(h.t)}\\cdot ${h.dt}`:`=${I.t(h.t)}`; }
          else if(e===3){ l4=`=${I.t("x")}\\cdot ${dB(h)}`; }
          else { l4=`=\\left(${I.t(h.t)}-${pw(I.t(String(a)))}\\right)\\cdot ${dB(h)}`; }
          L=[l1,l2,l3,l4];
          note={2:"Line (2) subtracts the integrand at the lower limit. FTC Part 1 gives just $g'(x)="+I.t("x")+"$: the lower limit does not affect the derivative.",3:"Line (3) uses $g'(x)$ where the Chain Rule needs $g'(h(x))$.",4:h.multi?"Line (4) is missing brackets around $h'(x)="+h.dt+"$.":"Line (4) drops the factor $h'(x)="+h.dt+"$."}[e];
        }
        const opts=L.map((_,i)=>`Line (${i+1})`);
        return {prompt:`A problem and an answer are shown. The answer would not get a perfect score. Select the first line that has a mistake.<br><b>Problem.</b> ${prob}${T==="FTC"?"<br>":""}<b>Answer.</b>${lines(L)}`,
          parts:[{answer:{type:"mc",options:opts,correct:bad-1,keep:true}}],
          hint:T==="LRS"?"Check $\\Delta t$, which points a left sum uses, and that you plug in $g(t_i)$, not $t_i$.":"Check FTC Part 1 (the lower limit does not matter) and the Chain Rule (outside derivative at $h(x)$, times $h'(x)$).",
          steps:[`The first mistake is in line (${bad}).`,note].concat(bad===2?["Line (1) is correct."]:bad===3?["Lines (1) and (2) are correct."]:bad>3?[`Lines (1) to (${bad-1}) are correct.`]:[]),
          answerTeX:`Line (${bad})`};
      }}
  ],
  exam:[
    {id:"L08.q1", ref:"p. 1", q:"If $f(x)=\\int_2^x t\\,dt$, what is $f(4)$?", opts:[["$6$",1,"$\\left[\\frac{t^2}{2}\\right]_2^4=8-2=6$."],["$8$",0,"That is $\\frac{t^2}{2}$ at $t=4$. You still subtract the value at the lower limit 2."],["$4$",0,"That is the integrand at $t=4$, not the integral."],["$2$",0,"Check the antiderivative: it is $\\frac{t^2}{2}$."]]},
    {id:"L08.q2", ref:"pp. 1 to 4", multi:true, q:"Let $f(x)=\\int_1^x g(t)\\,dt$, where $g$ is continuous. Select all statements that are true.", opts:[["$f(1)=0$",1,"An integral from 1 to 1 is 0."],["$f'(x)=g(x)$",1,"FTC Part 1."],["$f'(x)=g(x)-g(1)$",0,"The lower limit does not change the derivative."],["$f(x)$ depends on $t$",0,"$t$ is the variable of integration. Only $x$ is left after integrating."],["$f(3)-f(2)=\\int_2^3 g(t)\\,dt$",1,"Area from 1 to 3 minus area from 1 to 2."]]},
    {id:"L08.q3", ref:"p. 3", q:"Let $g(x)=\\int_0^x \\sin(t^3)\\,dt$ and $h(x)=e^x$. Then $(g\\circ h)(x)=$", opts:[["$\\int_0^{e^x}\\sin(t^3)\\,dt$",1,"Replace the top bound $x$ with $e^x$."],["$\\int_0^{x}\\sin(e^{3t})\\,dt$",0,"The integrand does not change."],["$e^{\\int_0^x \\sin(t^3)\\,dt}$",0,"That is $(h\\circ g)(x)$."],["$\\int_0^{e^x}\\sin(e^{3x})\\,dx$",0,"Only the top bound changes. The integrand stays in $t$."]]},
    {id:"L08.q4", ref:"p. 5", q:"$\\frac{d}{dx}\\int_5^x \\left(t^3-125\\right)dt=$", opts:[["$x^3-125$",1,"FTC Part 1: put $x$ in for $t$."],["$x^3$",0,"The $-125$ is part of the integrand, so it stays."],["$3x^2$",0,"FTC Part 1 does not differentiate the integrand."],["$x^3-125-(5^3-125)$",0,"The lower limit never shows up in the derivative. (Here that term is 0 anyway.)"]]},
    {id:"L08.q5", ref:"p. 5", q:"If $g(w)=\\int_{-2}^{w} x e^{x}\\,dx$, then $g'(w)=$", opts:[["$we^w$",1,"The variable of integration is $x$. The answer is in $w$."],["$xe^x$",0,"The answer must use the function's own variable, $w$."],["$e^w+we^w$",0,"That differentiates the integrand. FTC Part 1 just returns it."],["$we^w+2e^{-2}$",0,"The lower limit does not appear in the derivative."]]},
    {id:"L08.q6", ref:"p. 5", q:"If $f(x)=\\int_1^{x^2}\\cos(t)\\,dt$, then $f'(x)=$", opts:[["$2x\\cos(x^2)$",1,"$g'(h(x))h'(x)$ with $h(x)=x^2$."],["$\\cos(x^2)$",0,"Missing the Chain Rule factor $h'(x)=2x$."],["$2x\\cos(x)$",0,"Evaluate the integrand at $h(x)=x^2$, not at $x$."],["$\\sin(x^2)-\\sin(1)$",0,"That is $f(x)$, not $f'(x)$."]]},
    {id:"L08.q7", ref:"p. 5", q:"If $f(x)=\\int_0^x e^{t^3}\\,dt$ and $\\frac{d}{dx}f(g(x))=3x^2e^{x^9}$, what is $g(x)$?", opts:[["$x^3$",1,"$f'(g(x))g'(x)=e^{(x^3)^3}\\cdot3x^2=3x^2e^{x^9}$."],["$x^9$",0,"Then the factor would be $9x^8$."],["$3x^2$",0,"Then the exponent would be $(3x^2)^3=27x^6$."],["$x^2$",0,"Then you would get $2xe^{x^6}$."]]},
    {id:"L08.q8", ref:"p. 2", keep:true, q:"A problem and an answer are shown. The answer would not get a perfect score. Select the first line with a mistake.<br><b>Problem.</b> $f(x)=\\int_0^x g(t)\\,dt$ with $g(0)=4$, $g(1)=3$, $g(2)=1$, $g(3)=2$. Use the Left Riemann Sum with $n=3$ to approximate $f(3)$.$$\\Delta t=\\frac{3-0}{3}=1\\qquad(1)$$$$t_i=0+i,\\ 0\\le i\\le3\\qquad(2)$$$$f(3)\\approx g(t_1)\\Delta t+g(t_2)\\Delta t+g(t_3)\\Delta t\\qquad(3)$$$$=3+1+2=6\\qquad(4)$$", opts:[["Line (1)",0,"$\\frac{b-a}{n}=\\frac{3-0}{3}=1$ is right."],["Line (2)",0,"$t_i=a+i\\Delta t=i$ is right."],["Line (3)",1,"That is a right sum. A left sum uses $t_0$, $t_1$, $t_2$: $4+3+1=8$."],["Line (4)",0,"It follows from line (3), but line (3) is already wrong."]]},
    {id:"L08.q9", ref:"p. 5", keep:true, q:"A problem and three answers are shown. Which answer is correct?<br><b>Problem.</b> Find $f'(x)$ for $f(x)=\\int_2^{3x}\\sqrt{1+t^2}\\,dt$.<br><b>Answer #1.</b> $f'(x)=\\sqrt{1+x^2}\\cdot3$<br><b>Answer #2.</b> $f'(x)=\\sqrt{1+(3x)^2}\\cdot3$<br><b>Answer #3.</b> $f'(x)=\\sqrt{1+(3x)^2}$", opts:[["Answer #1",0,"The integrand must be evaluated at $h(x)=3x$."],["Answer #2",1,"$g'(h(x))h'(x)$ with $h(x)=3x$, $h'(x)=3$."],["Answer #3",0,"Missing the Chain Rule factor $h'(x)=3$."]]},
    {id:"L08.q10", ref:"p. 5", keep:true, q:"True or false: $\\frac{d}{dx}\\int_a^x g(t)\\,dt$ depends on the value of $a$.", opts:[["True",0,"Try $a=0$ and $a=3$ with $g(t)=t^3+t+1$: both give $x^3+x+1$."],["False",1,"Changing $a$ adds a constant to the integral function, and constants differentiate to 0."]]},
    {id:"L08.q11", ref:"p. 4", q:"$P(t)$ is the size of a population and $P'(t)$ its growth rate, with $t$ in years. What is $\\frac{d}{dx}\\int_0^x P'(t)\\,dt$?", opts:[["$P'(x)$, the growth rate at time $x$",1,"FTC Part 1: the derivative of the net change function is the rate."],["$P(x)-P(0)$, the net change from 0 to $x$",0,"That is the integral itself, before taking the derivative."],["$P(x)$, the population at time $x$",0,"Differentiating a change in $P$ gives a rate, not a size."],["$0$",0,"The integral changes with $x$, so its derivative is not 0 in general."]]},
    {id:"L08.q12", ref:"p. 3", q:"Some values of $g$: $g(0)=1.2$, $g(0.5)=2.0$, $g(1)=0.6$, $g(1.5)=-0.4$, $g(2)=1.0$. Let $f(x)=\\int_{0.5}^x g(t)\\,dt$. The Left Riemann Sum with $n=3$ for $f(2)$ is", opts:[["$0.5(2.0+0.6-0.4)=1.1$",1,"$\\Delta t=\\frac{2-0.5}{3}=0.5$, and $t_0=0.5$, $t_1=1$, $t_2=1.5$."],["$0.5(1.2+2.0+0.6)=1.9$",0,"The integral starts at $0.5$, so $g(0)$ is not used."],["$0.5(0.6-0.4+1.0)=0.6$",0,"That uses $t_1$, $t_2$, $t_3$: a right sum."],["$2.0+0.6-0.4=2.2$",0,"Each term needs the factor $\\Delta t=0.5$."]]}
  ],
  steps:[
    {type:"read", title:"Integral functions, again", body:`<p>An integral function has the form (p. 1)</p>$$f(x)=\\int_a^x g(t)\\,dt$$<p>$x$ is the independent variable of $f$ and $t$ is the variable of integration. $f(x)$ is the signed area under $g$ from $a$ to $x$.</p><p>Most integral functions cannot be evaluated exactly, so you approximate a value like $f(b)=\\int_a^b g(t)\\,dt$ with a Left Riemann Sum:</p><ul><li>$\\Delta t=\\frac{b-a}{n}$</li><li>$t_i=a+i\\Delta t$ for $0\\le i\\le n$</li><li>$f(b)\\approx g(t_0)\\Delta t+g(t_1)\\Delta t+\\dots+g(t_{n-1})\\Delta t$</li></ul><p>You get the values of $g$ from a formula, a table, or a graph.</p>`, ref:"pp. 1 to 2"},
    {type:"explore", title:"Reading heights off a graph", fig:"lrsgraph", body:`<p>On p. 2 the notes approximate $f(4)$ for $f(x)=\\int_1^x g(t)\\,dt$ from a graph with $n=3$: $\\Delta t=\\frac{4-1}{3}=1$, $t_0=1$, $t_1=2$, $t_2=3$, and</p>$$f(4)\\approx g(1)\\cdot1+g(2)\\cdot1+g(3)\\cdot1=2+1+2=5$$<p><b>Try it.</b> With $n=3$ the sum is 5. Raise $n$ and watch the rectangles hug the curve. With a graph on a quiz you can only read heights at grid lines, which is why the questions pick $\\Delta t$ to land on them.</p>`},
    {type:"example", title:"From a table", ex:{q:"Values of $g$: $g(1)=-2.4$, $g(\\frac43)=-2.7$, $g(\\frac53)=-3.0$, $g(2)=-3.2$. Let $f(x)=\\int_1^x g(t)\\,dt$. Use the Left Riemann Sum Approximation with $n=3$ subdivisions to approximate $f(2)$.", ref:"pp. 1 to 2",
      steps:[{t:"$f(2)=\\int_1^2 g(t)\\,dt$, so $a=1$, $b=2$, $n=3$.",why:"Read the limits off the definition of $f$."},{t:"$\\Delta t=\\frac{b-a}{n}=\\frac{2-1}{3}=\\frac13$",why:"Three equal pieces."},{t:"$t_i=1+\\frac{i}{3}$: $t_0=1$, $t_1=\\frac43$, $t_2=\\frac53$, $t_3=2$.",why:"These match the columns of the table."},{t:"$f(2)\\approx g(1)\\Delta t+g(\\frac43)\\Delta t+g(\\frac53)\\Delta t$",why:"A left sum uses $t_0$, $t_1$, $t_2$. The value $g(2)=-3.2$ is not used."},{t:"$=-2.4\\cdot\\frac13-2.7\\cdot\\frac13-3.0\\cdot\\frac13=-0.8-0.9-1$",why:"Multiply each height by $\\Delta t$."},{t:"$=-2.7$",why:"The values of $g$ are negative, so the signed area is negative."}],
      ans:"$f(2)\\approx-2.7$"}},
    {type:"try", title:"Your turn: Left Riemann Sum from a table", gen:"L08.g.lrs-table"},
    {type:"read", title:"Composition with an integral function", body:`<p>You can compose integral functions like any other function, but it looks a little odd (p. 3). In a composition you replace every $x$ in the outside function with the inside function. In an integral function, the only $x$ is the top bound.</p><div class="box"><b class="t">Examples (p. 3)</b>If $f(x)=\\int_1^x(t^2+t)\\,dt$ and $g(x)=x^2$, then $f(g(x))=\\int_1^{x^2}(t^2+t)\\,dt$.<br>If $g(x)=\\int_{-1/2}^x\\sqrt{\\cos(t)+1}\\,dt$ and $h(x)=e^x$, then $g(h(x))=\\int_{-1/2}^{e^x}\\sqrt{\\cos(t)+1}\\,dt$.</div><div class="box warn"><b class="t">Watch for this</b>The integrand and the $dt$ do not change. Do not put $x^2$ or $e^x$ into the integrand.</div>`, ref:"p. 3"},
    {type:"mcq", title:"The exercise on p. 4", q:"$g(x)=\\int_{-1}^x\\sin(t^2)\\,dt$ and $h(x)=2x+1$. What is $(g\\circ h)(x)$?", opts:[["$\\int_{-1}^{2x+1}\\sin(t^2)\\,dt$",true,"Only the top bound changes."],["$\\int_{-1}^{x}\\sin\\left((2t+1)^2\\right)dt$",false,"The integrand does not change."],["$2\\int_{-1}^x\\sin(t^2)\\,dt+1$",false,"That is $(h\\circ g)(x)$."],["$\\int_{-1}^{2x+1}\\sin\\left((2x+1)^2\\right)dx$",false,"The integrand stays in $t$, and so does the $dt$."]]},
    {type:"try", title:"Your turn: composition", gen:"L08.g.compose"},
    {type:"read", title:"The derivative of an integral function", body:`<p>An integral is the opposite of a derivative, so you would expect the derivative to cancel the integral. It does, but watch the variable name (p. 4).</p><div class="box"><b class="t">Example (p. 4)</b>$s(t)$ is position and $v(t)$ is velocity. The area under $v$ over $[a,x]$ is the net change in position: $\\Delta s(x)=\\int_a^x v(t)\\,dt$. The rate of change of $\\Delta s(x)$ is the velocity at time $x$, so $v(x)=\\frac{d}{dx}\\int_a^x v(t)\\,dt$.</div><div class="box def"><b class="t">Theorem: FTC Part 1 (p. 4)</b>Assume $f$ is continuous on $[a,x]$ and $F(x)=\\int_a^x f(t)\\,dt$. Then $F'(x)=f(x)$.</div><p>The lower limit $a$ does not appear in the answer. Changing it only shifts $F$ by a constant.</p>`, ref:"p. 4"},
    {type:"explore", title:"Watch the area build $f$", fig:"ftc", body:`<p>The top graph is $g(t)$. The bottom graph is $f(x)=\\int_a^x g(t)\\,dt$, the signed area from $a$ to $x$.</p><p><b>Try it.</b> Drag the point on the top axis. Where $g$ is above the axis, the area grows and $f$ goes up. Where $g$ is below, $f$ goes down. The slope of $f$ always equals the height $g(x)$. Then move the lower limit $a$: the whole curve $f$ shifts up or down, but its slope at each $x$ stays the same.</p>`},
    {type:"example", title:"Two quick derivatives", ex:{q:"(a) Evaluate $\\frac{d}{dx}\\int_{-3}^x\\sin(t^2)\\,dt$. (b) Find $f'(w)$ where $f(w)=\\int_{17}^w(xe^x+x)\\,dx$.", ref:"p. 5",
      steps:[{t:"(a) $\\frac{d}{dx}\\int_{-3}^x\\sin(t^2)\\,dt=\\sin(x^2)$",why:"FTC Part 1: the integrand with $t$ replaced by $x$."},{t:"(b) Here $w$ is the independent variable and $x$ is the variable of integration.",why:"Read the variables before you start. The top bound tells you the function's variable."},{t:"$f'(w)=we^w+w$",why:"FTC Part 1: replace the variable of integration $x$ with $w$. The lower limit 17 plays no part."}],
      ans:"(a) $\\sin(x^2)$ (b) $f'(w)=we^w+w$"}},
    {type:"try", title:"Your turn: FTC Part 1", gen:"L08.g.ftc1"},
    {type:"example", title:"A function in the top bound", ex:{q:"Let $f(x)=\\int_{-\\sqrt2}^{x^3}\\left(t^2+t-1\\right)dt$. Find $f'(x)$.", ref:"p. 5",
      steps:[{t:"Let $g(x)=\\int_{-\\sqrt2}^x(t^2+t-1)\\,dt$ and $h(x)=x^3$. Then $f(x)=g(h(x))$.",why:"The top bound is a function of $x$, so $f$ is a composition."},{t:"$f'(x)=g'(h(x))\\cdot h'(x)$",why:"Chain Rule."},{t:"$g'(x)=x^2+x-1$",why:"FTC Part 1."},{t:"$f'(x)=\\left((x^3)^2+x^3-1\\right)\\cdot(3x^2)$",why:"Evaluate $g'$ at $h(x)=x^3$, times $h'(x)=3x^2$."},{t:"$=3x^8+3x^5-3x^2$",why:"Expand."}],
      ans:"$f'(x)=3x^8+3x^5-3x^2$"}},
    {type:"explore", title:"Where the extra factor comes from", fig:"chain", body:`<p>For $f(x)=\\int_0^{h(x)}g(t)\\,dt$, nudging $x$ by $dx$ moves the top limit by about $h'(x)\\,dx$. The new sliver of area has height $g(h(x))$ and width $h'(x)\\,dx$. So $f'(x)=g(h(x))\\,h'(x)$.</p><p><b>Try it.</b> Pick $h(x)=x^2$ and slide $x$ from 0.5 to 2. The sliver gets wider because $h'(x)=2x$ grows. The two numbers at the bottom (the formula and the slope measured from the area) always agree.</p>`},
    {type:"mcq", title:"The exercise on p. 5", q:"Let $f(x)=\\int_0^{x^2}\\sqrt{t}\\,dt$. Which is $f'(x)$?", opts:[["$\\sqrt{x^2}\\cdot2x=2x|x|$",true,"Chain Rule, then property (i): $\\sqrt{x^2}=|x|$."],["$2x^2$",false,"That uses $\\sqrt{x^2}=x$, which is wrong for $x<0$."],["$\\sqrt{x}\\cdot2x$",false,"Evaluate the integrand at the top bound $x^2$, not at $x$."],["$\\sqrt{x^2}$",false,"Missing the Chain Rule factor $2x$."]],
      after:"$2x|x|$ equals $2x^2$ only when $x\\ge0$."},
    {type:"try", title:"Your turn: FTC with the Chain Rule", gen:"L08.g.ftc-chain"},
    {type:"formulas", title:"Lecture 8 formulas"}
  ]
});
})();
