/* Lecture 4 (Wed Sept 16): The net change problem. Riemann sums, the definite integral, FTC Part 2. Section 1.2.1. Notes: 7 pages. */
(function(){
const M=M127;
/* exact fractions for Riemann sums */
const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; };
const Q=(n,d=1)=>{ if(d<0){ n=-n; d=-d; } const g=gcd(n,d); return {n:n/g,d:d/g}; };
const qadd=(a,b)=>Q(a.n*b.d+b.n*a.d,a.d*b.d), qsub=(a,b)=>Q(a.n*b.d-b.n*a.d,a.d*b.d), qmul=(a,b)=>Q(a.n*b.n,a.d*b.d);
const qtex=q=>M.frac(q.n,q.d), qasc=q=>q.d===1?String(q.n):`(${q.n}/${q.d})`, qv=q=>q.n/q.d;
const isTerm=q=>{ let d=q.d; while(d%2===0) d/=2; while(d%5===0) d/=5; return d===1; };
const qshow=q=>isTerm(q)?M.num(qv(q),4):`${qtex(q)} \\approx ${qv(q).toFixed(3)}`;
const ttex=q=>q.d===1?String(q.n):q.d===2?M.num(qv(q),2):qtex(q);      // t-values: halves as decimals, thirds as fractions
const par=s=>String(s).trim().startsWith("-")?`(${s})`:String(s);
const dec1=v=>(v/10).toFixed(1);                                        // tenths -> "2.6"
const simpson=(f,a,b,n=600)=>{ const h=(b-a)/n; let s=f(a)+f(b); for(let i=1;i<n;i++) s+=f(a+i*h)*(i%2?4:2); return s*h/3; };
const tbl=(ts,vs,lab)=>`$$\\begin{array}{c|${"c".repeat(ts.length)}} t & ${ts.join(" & ")} \\\\ \\hline ${lab} & ${vs.join(" & ")} \\end{array}$$`;
const ORD=["","first","second","third","fourth","fifth","sixth","seventh"];
const lineOpts=k=>Array.from({length:k},(_,i)=>`The first line with a mistake is (${i+1}).`);

M127.lecture({
  id:"L04", n:4, date:"2026-09-16", added:"2026-10-21", unit:"u2", quiz:"Q2",
  title:"The Net Change Problem", sections:["1.2.1"], pages:7,
  summary:"When a rate is not constant, cut the interval into small pieces and add rate times width (the Left Riemann Sum). With infinitely many pieces you get the definite integral, the exact net change, and FTC Part 2 lets you compute it as $F(b)-F(a)$.",
  flags:[
    {ref:"p. 5", text:"The example on p. 5 shades the region between $y=\\cos(t)$ and the $t$-axis on $[0,\\pi]$ and gives the answer $\\int_0^{\\pi}\\cos(t)\\,dt$. That integral equals $\\sin(\\pi)-\\sin(0) = 0$, but the shaded region has area 2. The integral is a signed area: the part below the axis counts as negative."},
    {ref:"p. 4", text:"The boxed statement (net change = area under the curve) and NOTE 2 are only true as written when $f(x) \\ge 0$ on $[a,b]$. Where the graph of $f$ is below the axis, the integral subtracts that area."},
    {ref:"p. 2", text:"The notes say \"the amount of water entering the tank over the first two minutes\". The interval is $t=1$ to $t=3$: two minutes long, but not the first two minutes."},
    {ref:"p. 4", text:"The notes write $F'(x)\\,dx = dy$. Since the function is called $F$, this differential should be $dF$ (or $dy$ with $y = F(x)$)."},
    {ref:"p. 5", text:"The course notes state FTC Part 2 with an extra condition: $f$ is continuous on $[a,b]$. The lecture notes leave it out. Every function in this lecture is continuous, so no answer here changes."},
    {ref:"p. 3", text:"The lecture notes define $t_i = a + i\\Delta t$ for $0 \\le i \\le n$ (all the endpoints). The course notes write $0 \\le i \\le n-1$ (only the ones the left sum uses). Both give the same sum: the left sum stops at $f(t_{n-1})$."}
  ],
  formulas:[
    {id:"L04.f.constrate", name:"Constant-rate formulas", tex:"\\text{distance} = \\text{velocity} \\times \\text{time}", note:"Also cardiac output = heart rate × stroke volume, and absorbance = molar absorptivity × path length × concentration. These only work when every quantity is constant.", ref:"p. 1"},
    {id:"L04.f.dt", name:"Width of the subintervals", tex:"\\Delta t = \\frac{b-a}{n}", ref:"p. 3", blank:{tex:"\\Delta t = \\boxed{\\,?\\,}", answer:"(b-a)/n", vars:["a","b","n"], domain:[1,3]}},
    {id:"L04.f.ti", name:"End points of the subintervals", tex:"t_i = a + i\\Delta t, \\quad 0 \\le i \\le n", ref:"p. 3", blank:{tex:"t_i = \\boxed{\\,?\\,}, \\quad 0 \\le i \\le n", text:true, accept:["a+iΔt","a + iΔt","a+i*Δt","a + i Δt","a+i\\Delta t","a+i dt","a+i*dt","a+iDelta t","a + i*Delta t"]}},
    {id:"L04.f.left", name:"Left Riemann Sum", tex:"\\Delta F \\approx f(t_0)\\Delta t + f(t_1)\\Delta t + f(t_2)\\Delta t + \\cdots + f(t_{n-1})\\Delta t", note:"Approximates the net change of $F$ with $F'(t) = f(t)$ from $t=a$ to $t=b$ using $n$ subdivisions. Each $f(t_i)\\Delta t$ is the area of a rectangle.", ref:"p. 3", blank:{tex:"\\Delta F \\approx f(t_0)\\Delta t + f(t_1)\\Delta t + \\cdots + f(t_{\\boxed{\\,?\\,}})\\Delta t", answer:"n-1", vars:["n"], domain:[2,9]}},
    {id:"L04.f.netarea", name:"Net change equals area under the rate curve", tex:"\\text{Area under the curve} = F(b) - F(a)", note:"The area under the graph of $F'(x) = f(x)$ from $x=a$ to $x=b$. As written this needs $f(x) \\ge 0$; area below the axis counts as negative.", ref:"p. 4", blank:{tex:"\\text{Area under the curve} = \\boxed{\\,?\\,}", text:true, accept:["F(b)-F(a)","F(b) - F(a)","F(b)−F(a)"]}},
    {id:"L04.f.defint", name:"Definite integral", tex:"\\text{net change of } F \\text{ from } x=a \\text{ to } x=b = \\int_a^b f(x)\\,dx, \\quad F'(x) = f(x)", note:"$f$ is called the integrand.", ref:"p. 4"},
    {id:"L04.f.sumdiff", name:"Integral as a sum of differentials", tex:"\\int_a^b F'(x)\\,dx, \\qquad F'(x)\\,dx = dy", note:"\"The sum of infinitely many differentials.\" The notes write $dy$; with the function named $F$ it is $dF$.", ref:"pp. 4 to 5"},
    {id:"L04.f.ftc2", name:"Fundamental Theorem of Calculus, Part 2", tex:"F'(x) = f(x) \\;\\Rightarrow\\; \\int_a^b f(x)\\,dx = F(b) - F(a)", note:"$F(x)$ is any function with $F'(x) = f(x)$.", ref:"p. 5", blank:{tex:"F'(x) = f(x) \\;\\Rightarrow\\; \\int_a^b f(x)\\,dx = \\boxed{\\,?\\,}", text:true, accept:["F(b)-F(a)","F(b) - F(a)","F(b)−F(a)"]}},
    {id:"L04.f.bar", name:"\"Evaluated from $a$ to $b$\"", tex:"F(x)\\Big|_a^b = F(b) - F(a), \\qquad \\int_a^b f(x)\\,dx = F(x)\\Big|_a^b", ref:"p. 6", blank:{tex:"F(x)\\Big|_a^b = \\boxed{\\,?\\,}", text:true, accept:["F(b)-F(a)","F(b) - F(a)","F(b)−F(a)"]}}
  ],
  glossary:[
    {id:"L04.t.dt", term:"$\\Delta t$ (width of a subinterval)", def:"Cut $[a,b]$ into $n$ equal pieces. Each piece has width $\\Delta t = \\frac{b-a}{n}$.", ref:"p. 3"},
    {id:"L04.t.ti", term:"End points $t_i$", def:"$t_i = a + i\\Delta t$ for $0 \\le i \\le n$. So $t_0 = a$ and $t_n = b$.", ref:"p. 3"},
    {id:"L04.t.left", term:"Left Riemann Sum", def:"$f(t_0)\\Delta t + f(t_1)\\Delta t + \\cdots + f(t_{n-1})\\Delta t$. Each term is a rectangle whose height is the rate at the left end of its piece. It never uses $t_n = b$.", ref:"p. 3"},
    {id:"L04.t.net", term:"Net change", def:"How much a quantity changed overall from $a$ to $b$: $F(b) - F(a)$. Increases and decreases cancel each other.", ref:"p. 4"},
    {id:"L04.t.defint", term:"Definite integral", def:"$\\int_a^b f(x)\\,dx$: the exact net change of $F$ from $x=a$ to $x=b$ when $F'(x) = f(x)$. Its value is a number.", ref:"p. 4"},
    {id:"L04.t.integrand", term:"Integrand", def:"The function being integrated: the $f$ in $\\int_a^b f(x)\\,dx$.", ref:"p. 4"},
    {id:"L04.t.longs", term:"Long S ($\\int$)", def:"The integral sign. It used to be a letter, and it stands for adding up infinitely many infinitely small quantities.", ref:"p. 4"},
    {id:"L04.t.ftc", term:"FTC Part 2", def:"If $F'(x) = f(x)$, then $\\int_a^b f(x)\\,dx = F(b) - F(a)$. It turns a net change into a subtraction.", ref:"p. 5"},
    {id:"L04.t.bar", term:"Evaluated from $a$ to $b$", def:"$F(x)\\Big|_a^b$ is shorthand for $F(b) - F(a)$.", ref:"p. 6"}
  ],
  figures:{
    riemann:{title:"Left and right Riemann sums", cap:"<b>Fig. 4.1</b> Each rectangle has width $\\Delta t$ and height $f(t_i)$, so its area is $f(t_i)\\Delta t$. Adding them approximates the net change, and more subdivisions give a better approximation. The notes use the left sum; the right sum is here only to compare. (Lecture 4, pp. 2 to 3)",
      build(host,{PLOT}){
        const PI=Math.PI;
        const S={
          water:{f:t=>t*t-t+1, a:1, b:3, bl:"3", x:[0.55,3.3], y:[-0.7,7.8], xs:0.5, ys:1, piX:false, exact:20/3, ex:"20/3 ≈ 6.6667", lab:"f(t) = t² − t + 1 L/min"},
          dec:{f:t=>4-t*t, a:0, b:2, bl:"2", x:[-0.3,2.35], y:[-0.6,4.6], xs:0.5, ys:1, piX:false, exact:16/3, ex:"16/3 ≈ 5.3333", lab:"f(t) = 4 − t²"},
          cos:{f:Math.cos, a:0, b:PI, bl:"π", x:[-0.25,3.45], y:[-1.35,1.35], ys:0.5, piX:true, exact:0, ex:"0", lab:"f(t) = cos(t)"}};
        let key="water", side="left", n=4;
        const opt={x:S.water.x, y:S.water.y, c:"var(--u2)", xlabel:"t", ylabel:"f(t)", xstep:0.5, ystep:1};
        const G=PLOT.graph(host,opt);
        const R=G.rects([]);
        const curve=G.fn(S.water.f,{cls:"cv c"});
        let dots=[];
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Rate function",items:[["water","Water tank"],["dec","4 − t²"],["cos","cos(t)"]],value:"water",onchange:v=>{ key=v; setFn(); }});
        PLOT.seg(ctl,{label:"Which endpoint",items:[["left","Left sum"],["right","Right sum"]],value:"left",onchange:v=>{ side=v; draw(); }});
        PLOT.slider(ctl,{label:"Subdivisions n",min:1,max:40,step:1,value:n,oninput:v=>{ n=v; draw(); }});
        const ro=PLOT.readout(host);
        function setFn(){ const s=S[key]; opt.piX=s.piX; opt.xstep=s.xs; opt.ystep=s.ys; G.setView(s.x,s.y); curve.update(s.f); draw(); }
        function draw(){
          const s=S[key], dt=(s.b-s.a)/n, L=[], used=[]; let sum=0;
          dots.forEach(d=>d.remove()); dots=[];
          for(let i=0;i<n;i++){ const t=side==="left"?s.a+i*dt:s.a+(i+1)*dt; const h=s.f(t); sum+=h*dt; L.push({x:s.a+i*dt,w:dt,h}); used.push(t); if(n<=16) dots.push(G.dot(t,h,{filled:true,r:3.5})); }
          R.update(L);
          const nm=v=>(+v.toFixed(3)).toString();
          const list=n<=6?` &nbsp; uses t = ${used.map(nm).join(", ")}`:"";
          ro.innerHTML=`${s.lab} on [${s.a}, ${s.bl}] &nbsp; Δt = <b>${nm(dt)}</b>${list}<br>${side} sum = <b>${sum.toFixed(4)}</b> &nbsp; exact net change = <b>${s.ex}</b> &nbsp; error = <b>${(sum-s.exact).toFixed(4)}</b>`;
        }
        draw();
      }},
    signed:{title:"Area below the axis counts as negative", cap:"<b>Fig. 4.2</b> $y=\\cos(t)$ from $t=0$ to $t=b$. The integral $\\int_0^b\\cos(t)\\,dt = \\sin(b)$ adds the area above the axis and subtracts the area below it. On $[0,\\pi]$ the shaded region has area 2 but the integral is 0. (Lecture 4, pp. 4 to 5)",
      build(host,{PLOT}){
        const PI=Math.PI;
        const G=PLOT.graph(host,{x:[-0.25,3.45],y:[-1.35,1.35],piX:true,ystep:0.5,c:"var(--u2)",xlabel:"t",ylabel:"y"});
        const A=G.area(Math.cos,0,PI);
        G.fn(Math.cos,{cls:"cv c"});
        const vl=G.line(PI,0,PI,-1,{cls:"lt dash"});
        G.label(0.35,0.3,"+ above",{cls:"lblc"});
        const neg=G.label(2.15,-0.3,"− below",{cls:"lblc"});
        const ro=PLOT.readout(host);
        const upd=b=>{ A.update(Math.cos,0,b); vl.set(b,0,b,Math.cos(b)); neg.style.display=b>PI/2+0.25?"":"none";
          const I=Math.sin(b), area=b<=PI/2?Math.sin(b):2-Math.sin(b);
          ro.innerHTML=`b = <b>${b.toFixed(3)}</b> &nbsp; ∫₀ᵇ cos(t) dt = sin(b) = <b>${Math.abs(I)<5e-4?"0.000":I.toFixed(3)}</b> &nbsp; shaded area = <b>${area.toFixed(3)}</b>`; };
        G.handle(PI,Math.cos(PI),{f:Math.cos,bounds:[0.02,PI],label:"Upper limit b",onMove:x=>upd(x)}); upd(PI);
      }},
    ftc:{title:"FTC Part 2: the area equals the rise in F", cap:"<b>Fig. 4.3</b> Bottom: the area under $y=f(x)$ from $a$ to $b$, computed by adding thin rectangles. Top: an antiderivative $F$ with $F'(x)=f(x)$. The rise $F(b)-F(a)$ matches the area. (Lecture 4, pp. 5 to 6)",
      build(host,{PLOT}){
        const PI=Math.PI;
        const P={lin:{f:x=>2*x,F:x=>x*x,fl:"f(x) = 2x",Fl:"F(x) = x²",x:[-0.3,3.35],yF:[-1,10.4],yf:[-0.8,6.8],a:1,b:2,lo:0,hi:Math.PI,piX:false,ysF:2,ysf:2},
                 cos:{f:Math.cos,F:Math.sin,fl:"f(x) = cos(x)",Fl:"F(x) = sin(x)",x:[-0.25,3.45],yF:[-1.3,1.3],yf:[-1.3,1.3],a:0,b:PI/4,lo:0,hi:PI,piX:true,ysF:0.5,ysf:0.5}};
        let key="lin", a=1, b=2;
        const oT={x:P.lin.x,y:P.lin.yF,h:230,c:"var(--u2)",xlabel:"x",ylabel:"F",ystep:2}, oB={x:P.lin.x,y:P.lin.yf,h:230,c:"var(--u2)",xlabel:"x",ylabel:"f",ystep:2};
        const T=PLOT.graph(host,oT), B=PLOT.graph(host,oB);
        const Fc=T.fn(P.lin.F,{cls:"cv c"}), fc=B.fn(P.lin.f,{cls:"cv c"});
        const area=B.area(P.lin.f,a,b);
        const ha=T.line(0,0,1,1,{cls:"lt dash"}), hb=T.line(0,0,1,1,{cls:"lt dash"}), rise=T.line(0,0,1,1,{cls:"tan"});
        const pa=T.dot(a,1,{filled:true,r:4}), pb=T.dot(b,4,{filled:true,r:4});
        const rl=T.label(0,0,"F(b) − F(a)",{cls:"lblc",dx:-6,anchor:"end"});
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Integrand",items:[["lin","f(x) = 2x"],["cos","f(x) = cos(x)"]],value:"lin",onchange:v=>{ key=v; const p=P[v]; a=p.a; b=p.b; oT.piX=oB.piX=p.piX; oT.ystep=p.ysF; oB.ystep=p.ysf; T.setView(p.x,p.yF); B.setView(p.x,p.yf); Fc.update(p.F); fc.update(p.f); Ha.move(a); Hb.move(b); draw(); }});
        const ro=PLOT.readout(host);
        const Ha=B.handle(a,0,{axis:"x",bounds:[0,Math.PI],clickToMove:false,label:"Lower limit a",onMove:x=>{ a=Math.max(P[key].lo,Math.min(P[key].hi,x)); draw(); }});
        const Hb=B.handle(b,0,{axis:"x",bounds:[0,Math.PI],clickToMove:false,label:"Upper limit b",onMove:x=>{ b=Math.max(P[key].lo,Math.min(P[key].hi,x)); draw(); }});
        function draw(){
          const p=P[key], Fa=p.F(a), Fb=p.F(b);
          area.update(p.f,a,b);
          ha.set(T.x0,Fa,a,Fa); hb.set(T.x0,Fb,b,Fb); rise.set(b,Fa,b,Fb); pa.set(a,Fa); pb.set(b,Fb); const rt=b<T.x1-1.1; rl.setAttribute("text-anchor",rt?"start":"end"); rl.setAttribute("x",T.X(b)+(rt?6:-6)); rl.setAttribute("y",T.Y((Fa+Fb)/2)+4);
          const h=(b-a)/400; let s=0; for(let i=0;i<400;i++) s+=p.f(a+(i+0.5)*h)*h;   // thin rectangles (midpoints)
          ro.innerHTML=`${p.fl}, ${p.Fl} &nbsp; a = <b>${a.toFixed(3)}</b> &nbsp; b = <b>${b.toFixed(3)}</b><br>area under f (signed) = <b>${s.toFixed(4)}</b> &nbsp; F(b) − F(a) = <b>${(Fb-Fa).toFixed(4)}</b>`;
        }
        draw();
      }}
  },
  gens:[
    {id:"L04.g.lefttable", title:"Left Riemann sum from a table", skill:"Approximate a net change from table values, ignoring extra columns", ref:"p. 3",
      gen(R,d){
        const ctxs=[
          {desc:"the rate water flows into a tank, in L/min", qn:"volume of water in the tank", Qn:"V", u:"L", neg:true},
          {desc:"the rate the temperature of a lake changes, in °C/h", qn:"temperature of the lake", Qn:"T", u:"°C", neg:true},
          {desc:"the rate of rainfall, in mm/h", qn:"rainfall", Qn:"H", u:"mm", neg:false},
          {desc:"the rate a cell culture grows, in thousand cells/h", qn:"number of cells (in thousands)", Qn:"N", u:"thousand cells", neg:true},
          {desc:"the rate a patient absorbs a drug, in mg/h", qn:"amount of drug absorbed", Qn:"D", u:"mg", neg:false}];
        const c=R.pick(ctxs);
        let a, n, dt, cols;
        if(d===1){ a=R.int(0,2); n=R.pick([3,4]); dt=R.pick([Q(1),Q(1,2)]); cols=[]; for(let k=0;k<=n;k++) cols.push(qadd(Q(a),qmul(Q(k),dt))); }
        else if(d===2){
          if(R.int(0,1)===0){ dt=R.pick([Q(1),Q(1,2)]); n=R.pick([2,3]); const m=R.int(1,2); a=R.int(Math.ceil(m*qv(dt)),3); cols=[]; for(let k=-m;k<=n;k++) cols.push(qadd(Q(a),qmul(Q(k),dt))); }
          else { const pr=R.pick([[Q(1),Q(1,2)],[Q(2),Q(1)]]); dt=pr[0]; n=R.pick([2,3]); a=R.int(0,2); cols=[]; const steps=n*qv(dt)/qv(pr[1]); for(let k=0;k<=steps;k++) cols.push(qadd(Q(a),qmul(Q(k),pr[1]))); }
        } else {
          const lay=R.pick(["mix","twothirds","wide"]); a=R.int(0,2);
          if(lay==="mix"){ n=3; dt=Q(1,3); cols=[Q(0),Q(1,3),Q(1,2),Q(2,3),Q(1)].map(q=>qadd(q,Q(a))); }
          else if(lay==="twothirds"){ n=3; dt=Q(2,3); cols=[0,1,2,3,4,5].map(k=>qadd(Q(a),Q(k,3))); }
          else { n=2; dt=Q(1); a=R.int(1,2); cols=[-1,-0.5,0,0.5,1,1.5,2].map(k=>qadd(Q(a),Q(Math.round(k*2),2))); }
        }
        const b=qadd(Q(a),qmul(Q(n),dt));
        const vals=cols.map(()=> d===1||!c.neg ? R.int(5,48) : R.nz(-30,45));
        const usedT=[]; for(let i=0;i<n;i++) usedT.push(qadd(Q(a),qmul(Q(i),dt)));
        const key=q=>q.n+"/"+q.d;
        const idx=usedT.map(t=>cols.findIndex(q=>key(q)===key(t)));
        const S=idx.reduce((s,i)=>s+vals[i],0);
        const res=Q(S*dt.n,10*dt.d);
        const unused=cols.filter((q,i)=>!idx.includes(i));
        const table=tbl(cols.map(ttex),vals.map(dec1),"r(t)");
        const ask=d===3?`approximate $\\int_{${ttex(Q(a))}}^{${ttex(b)}} r(t)\\,dt$, the net change in the ${c.qn}`:`approximate the net change in the ${c.qn} from $t = ${ttex(Q(a))}$ to $t = ${ttex(b)}$`;
        const dtT=qtex(dt);
        const allT=[]; for(let i=0;i<=n;i++) allT.push(`t_{${i}} = ${ttex(qadd(Q(a),qmul(Q(i),dt)))}`);
        const terms=idx.map(i=>`${par(dec1(vals[i]))}\\cdot ${dtT}`).join(" + ");
        return {prompt:`Let $r(t)$ be ${c.desc}. Some values of $r$ are given in the table.${table}Use the Left Riemann Sum with $n = ${n}$ subdivisions to ${ask}.`,
          answer:{type:"num", answer:qasc(res), tol:0.0015},
          verify:{value:idx.reduce((s,i)=>s+vals[i]/10*qv(dt),0)},
          hint:"Find $\\Delta t = \\frac{b-a}{n}$ and the points $t_i = a + i\\Delta t$ first. Then read only the columns for $t_0, \\dots, t_{n-1}$.",
          steps:[`$a = ${ttex(Q(a))}$, $b = ${ttex(b)}$, $n = ${n}$, so $\\Delta t = \\frac{b-a}{n} = \\frac{${ttex(b)} - ${ttex(Q(a))}}{${n}} = ${dtT}$.`,
            `$t_i = a + i\\Delta t$ for $0 \\le i \\le ${n}$: $${allT.join(",\\ ")}$.`,
            `The left sum uses $t_0$ to $t_{${n-1}}$ only. `+(unused.length?`The column${unused.length>1?"s":""} at $t = ${unused.map(ttex).join(",\\ ")}$ ${unused.length>1?"are":"is"} not used.`:`The last column, $t_{${n}} = ${ttex(b)}$, is not used.`),
            `$\\Delta ${c.Qn} \\approx ${usedT.map((t,i)=>`r(t_{${i}})\\Delta t`).join(" + ")} = ${terms}$`,
            `$= ${dtT}\\left(${idx.map(i=>dec1(vals[i])).join(" + ").replace(/\+ -/g,"- ")}\\right) = ${qshow(res)}$ ${c.u}`],
          answerTeX:`$\\Delta ${c.Qn} \\approx ${qshow(res)}$ ${c.u}`};
      }},
    {id:"L04.g.leftformula", title:"Left Riemann sum from a formula", skill:"Compute $\\Delta t$, the $t_i$ and the left sum for a given rate", ref:"p. 3",
      gen(R,d){
        let fq, ff, ftex, a, n, span;
        const poly=co=>({q:t=>co.reduce((r,c)=>qadd(qmul(r,t),Q(c)),Q(0)), f:t=>co.reduce((r,c)=>r*t+c,0), tex:M.poly(co,"t")});
        if(d===1){ const P=R.int(0,1)===0?poly([R.int(1,5),R.int(-2,6)]):poly([1,0,R.int(-1,4)]); fq=P.q; ff=P.f; ftex=P.tex; a=R.int(0,2); n=R.pick([3,4]); span=n; }
        else if(d===2){ const P=poly([1,R.int(-3,2),R.int(1,4)]); fq=P.q; ff=P.f; ftex=P.tex; a=R.int(0,2); n=R.pick([3,4]); span=n/2; }
        else { const k=R.pick([1,2,3,6]); const kind=R.pick(["recip","invsq","recip"]);
          if(kind==="recip"){ fq=t=>Q(k*t.d,t.n); ff=t=>k/t; ftex=`\\frac{${k}}{t}`; }
          else { fq=t=>Q(k*t.d*t.d,t.n*t.n); ff=t=>k/(t*t); ftex=`\\frac{${k}}{t^2}`; }
          a=R.int(1,2); [span,n]=R.pick([[1,2],[1,3],[1,4],[2,4],[2,3],[3,3]]); }
        const dt=Q(Math.round(span*2),2*n);
        const b=qadd(Q(a),qmul(Q(n),dt));
        const ts=[]; for(let i=0;i<=n;i++) ts.push(qadd(Q(a),qmul(Q(i),dt)));
        const vs=ts.slice(0,n).map(fq);
        const res=vs.reduce((s,v)=>qadd(s,qmul(v,dt)),Q(0));
        let fl=0; for(let i=0;i<n;i++) fl+=ff(qv(ts[i]))*qv(dt);
        const dtT=qtex(dt);
        return {prompt:`The rate of change of $F(t)$ is $f(t) = ${ftex}$ for $${a} \\le t \\le ${ttex(b)}$. Use the Left Riemann Sum with $n = ${n}$ subdivisions to approximate the net change in $F$ from $t = ${a}$ to $t = ${ttex(b)}$.`,
          answer:{type:"num", answer:qasc(res), tol:0.0015}, verify:{value:fl},
          hint:"Three steps: $\\Delta t = \\frac{b-a}{n}$, then $t_i = a + i\\Delta t$, then add $f(t_i)\\Delta t$ for $i = 0$ to $n-1$.",
          steps:[`$\\Delta t = \\frac{b-a}{n} = \\frac{${ttex(b)} - ${a}}{${n}} = ${dtT}$`,
            `$t_i = a + i\\Delta t = ${a} + i\\cdot ${dtT}$, so $${ts.map((t,i)=>`t_{${i}} = ${ttex(t)}`).join(",\\ ")}$.`,
            `$\\Delta F \\approx ${ts.slice(0,n).map((t,i)=>`f(t_{${i}})\\Delta t`).join(" + ")} = ${ts.slice(0,n).map(t=>`f(${ttex(t)})\\Delta t`).join(" + ")}$`,
            `$= ${vs.map(v=>`${par(qtex(v))}\\cdot ${dtT}`).join(" + ")}$`,
            `$= ${qshow(res)}$`],
          answerTeX:`$\\Delta F \\approx ${qshow(res)}$`};
      }},
    {id:"L04.g.meaning", title:"What does the integral of a rate mean?", skill:"Interpret $\\int_a^b r(t)\\,dt$ as a net change, with units and the right limits", ref:"pp. 4 to 5",
      gen(R,d){
        const C=[
          {r:"r",F:"H",desc:"the rate of rainfall, in mm/h, $t$ hours after midnight",start:"A rain gauge already holds 4 mm of water at the start.",qn:"the depth of water in the rain gauge",qu:"mm",ru:"mm/h",wu:"mm/h²",tu:"h",tn:"hour",tw:"hours"},
          {r:"r",F:"V",desc:"the rate oxygen is transferred to the blood, in L/min, $t$ minutes after a test starts",start:"",qn:"the volume of oxygen transferred to the blood",qu:"L",ru:"L/min",wu:"L/min²",tu:"min",tn:"minute",tw:"minutes"},
          {r:"v",F:"s",desc:"the velocity of a cyclist, in m/s, $t$ seconds after a timer starts",start:"The cyclist is 20 m past the start line when the timer starts.",qn:"the position of the cyclist",qu:"m",ru:"m/s",wu:"m/s²",tu:"s",tn:"second",tw:"seconds"},
          {r:"a",F:"v",desc:"the acceleration of a car, in m/s², $t$ seconds after a timer starts",start:"The car is moving at 5 m/s when the timer starts.",qn:"the velocity of the car",qu:"m/s",ru:"m/s²",wu:"m/s³",tu:"s",tn:"second",tw:"seconds"},
          {r:"R",F:"W",desc:"the rate water flows into a reservoir, in megalitres per day, $t$ days after a storm",start:"The reservoir holds 40 megalitres when the storm ends.",qn:"the volume of water in the reservoir",qu:"megalitres",ru:"megalitres/day",wu:"megalitres/day²",tu:"days",tn:"day",tw:"days"},
          {r:"g",F:"N",desc:"the growth rate of a bacteria colony, in cells/h, $t$ hours after nutrients are added",start:"There are 100 cells when the nutrients are added.",qn:"the number of cells",qu:"cells",ru:"cells/h",wu:"cells/h²",tu:"h",tn:"hour",tw:"hours"}];
        const c=R.pick(C);
        const A=R.int(d===3?1:0,3), B=A+R.int(2,6);
        const I=`$\\int_{${A}}^{${B}} ${c.r}(t)\\,dt$`;
        if(d===1){
          const right=`The net change in ${c.qn} from $t = ${A}$ to $t = ${B}$`;
          const opts=[right,`${c.qn[0].toUpperCase()+c.qn.slice(1)} at time $t = ${B}$`,`The rate of change of ${c.qn} at time $t = ${B}$`,`The net change in the rate $${c.r}(t)$ from $t = ${A}$ to $t = ${B}$`,`The time it takes for ${c.qn} to change by ${B-A} ${c.qu}`];
          const o=R.shuffle([0,1,2,3,4]);
          return {prompt:`Let $${c.r}(t)$ be ${c.desc}. ${c.start} What does ${I} represent?`, parts:[{answer:{type:"mc",options:o.map(i=>opts[i]),correct:o.indexOf(0)}}],
            hint:`$${c.r}(t)$ is a rate of change. What does integrating a rate give you?`,
            steps:[`$${c.r}(t)$ is the rate of change of ${c.qn}: if $${c.F}(t)$ is ${c.qn}, then $${c.F}'(t) = ${c.r}(t)$.`,`By definition, ${I} $= ${c.F}(${B}) - ${c.F}(${A})$, the net change in ${c.qn} from $t=${A}$ to $t=${B}$.`,`It is not the amount at $t = ${B}$: that would also need the starting amount $${c.F}(${A})$.`],
            answerTeX:right+"."};
        }
        if(d===2){
          const opts=[c.qu,c.ru,c.wu,c.tu].map(u=>u);
          const o=R.shuffle([0,1,2,3]);
          return {prompt:`Let $${c.r}(t)$ be ${c.desc}. What are the units of ${I}?`, parts:[{answer:{type:"mc",options:o.map(i=>opts[i]),correct:o.indexOf(0)}}],
            hint:"Think of $\\int r(t)\\,dt$ as a sum of terms $r(t_i)\\Delta t$. Multiply the units.",
            steps:[`Each piece $${c.r}(t)\\,dt$ is a rate times a small time: (${c.ru}) × (${c.tu}).`,`The time units cancel, leaving ${c.qu}.`,`That makes sense: the integral of a rate is a change in ${c.qn}, measured in ${c.qu}.`],
            answerTeX:c.qu};
        }
        const k=R.int(2,6);
        const mode=R.int(0,1);
        const lo=mode===0?k-1:A, hi=mode===0?k:A+k;
        const ask=mode===0?`during the ${ORD[k]} ${c.tn}`:`from $t = ${A}$ to $t = ${A+k}$`;
        const right=`$\\int_{${lo}}^{${hi}} ${c.F}'(t)\\,dt$`;
        const opts=[right, mode===0?`$\\int_{0}^{${k}} ${c.F}'(t)\\,dt$`:`$\\int_{0}^{${k}} ${c.F}'(t)\\,dt$`, `$\\int_{${lo}}^{${hi}} ${c.F}(t)\\,dt$`, `$${c.F}'(${hi}) - ${c.F}'(${lo})$`, mode===0?`$\\int_{${k}}^{${k+1}} ${c.F}'(t)\\,dt$`:`$\\int_{${A}}^{${A+k}} ${c.F}''(t)\\,dt$`];
        const o=R.shuffle([0,1,2,3,4]);
        return {prompt:`$${c.F}(t)$ is ${c.qn} (in ${c.qu}), where $t$ is measured in ${c.tw}. Which expression gives the change in ${c.qn} ${ask}?`, parts:[{answer:{type:"mc",options:o.map(i=>opts[i]),correct:o.indexOf(0)}}],
          hint:"Integrate the rate of change, $"+c.F+"'(t)$, and pick the limits from the time interval in words.",
          steps:[`The change in a quantity is the integral of its rate of change, so the integrand is $${c.F}'(t)$, not $${c.F}(t)$.`, mode===0?`The ${ORD[k]} ${c.tn} runs from $t = ${k-1}$ to $t = ${k}$ (the first runs from 0 to 1).`:`The interval is $t = ${A}$ to $t = ${A+k}$.`, `So the change is ${right} $= ${c.F}(${hi}) - ${c.F}(${lo})$.`],
          answerTeX:right};
      }},
    {id:"L04.g.ftc", title:"Evaluate a definite integral (FTC Part 2)", skill:"Find $F$ with $F'=f$, then compute $F(b)-F(a)$", ref:"pp. 5 to 6",
      gen(R,d){
        const PI=Math.PI;
        if(d===1){
          if(R.int(0,1)===0){ const k=R.nz(-6,9), a=R.int(-3,1), b=a+R.int(1,5); const kt=M.term(k,"t",1,true); const val=k*b-k*a;
            return {prompt:`Evaluate $\\int_{${a}}^{${b}} ${k}\\,dt$.`, answer:{type:"num",answer:String(val)}, verify:{value:simpson(()=>k,a,b)},
              hint:"Find a function whose derivative is the constant "+k+". Watch the variable: it is $t$.",
              steps:[`The integrand is $f(t) = ${k}$. A function with $F'(t) = ${k}$ is $F(t) = ${kt}$.`,`$\\int_{${a}}^{${b}} ${k}\\,dt = ${kt}\\Big|_{${a}}^{${b}} = ${par(k)}(${b}) - ${par(k)}(${a})$`,`$= ${k*b} - ${par(k*a)} = ${val}$`],
              answerTeX:`$${val}$`}; }
          const m=R.pick([2,4,6]), a=R.int(0,2), b=a+R.int(1,3), h=m/2; const val=h*(b*b-a*a);
          return {prompt:`Evaluate $\\int_{${a}}^{${b}} ${m}x\\,dx$.`, answer:{type:"num",answer:String(val)}, verify:{value:simpson(x=>m*x,a,b)},
            hint:"What function has derivative $"+m+"x$? Check: $\\frac{d}{dx}x^2 = 2x$.",
            steps:[`The integrand is $f(x) = ${m}x$. A function with $F'(x) = ${m}x$ is $F(x) = ${M.term(h,"x",2,true)}$.`,`$\\int_{${a}}^{${b}} ${m}x\\,dx = ${M.term(h,"x",2,true)}\\Big|_{${a}}^{${b}} = ${h===1?"":h}(${b})^2 - ${h===1?"":h}(${a})^2$`,`$= ${h*b*b} - ${h*a*a} = ${val}$`],
            answerTeX:`$${val}$`};
        }
        if(d===2){
          const p=R.nz(-3,3), q=R.int(-4,4), r=R.int(-5,5), a=R.int(-1,1), b=a+R.int(1,3);
          const ftex=M.poly([p,q,r],"x");
          const Fq=x=>qadd(qadd(qmul(Q(p,3),Q(x*x*x)),qmul(Q(q,2),Q(x*x))),Q(r*x));
          const mono=(c,pw,first)=>{ if(c.n===0) return ""; const s=c.n<0?"-":(first?"":"+"); const ab=Q(Math.abs(c.n),c.d); return s+(ab.n===1&&ab.d===1?"":qtex(ab))+(pw===1?"x":`x^{${pw}}`); };
          let Ftex=mono(Q(p,3),3,true); Ftex+=mono(Q(q,2),2,!Ftex); Ftex+=mono(Q(r),1,!Ftex);
          const Fb=Fq(b), Fa=Fq(a), val=qsub(Fb,Fa);
          return {prompt:`Evaluate $\\int_{${a}}^{${b}} \\left(${ftex}\\right)dx$.`, answer:{type:"num",answer:qasc(val)}, verify:{value:simpson(x=>p*x*x+q*x+r,a,b)},
            hint:"Guess $F$ term by term: $\\frac{d}{dx}\\frac13x^3 = x^2$ and $\\frac{d}{dx}\\frac12x^2 = x$. Then compute $F(b)-F(a)$ with brackets.",
            steps:[`The integrand is $f(x) = ${ftex}$. A function with $F'(x) = f(x)$ is $F(x) = ${Ftex}$.`,`$\\int_{${a}}^{${b}} \\left(${ftex}\\right)dx = \\left(${Ftex}\\right)\\Big|_{${a}}^{${b}} = F(${b}) - F(${a})$`,`$F(${b}) = ${qtex(Fb)}$ and $F(${a}) = ${qtex(Fa)}$.`,`So the integral is $${qtex(Fb)} - ${par(qtex(Fa))} = ${qtex(val)}$.`],
            answerTeX:`$${qtex(val)}$`};
        }
        const kind=R.pick(["cos","exp","negsin","recip"]);
        if(kind==="cos"){
          const ang=[["0",0,"0","0"],["\\frac{\\pi}{6}",PI/6,"\\frac{1}{2}","1/2"],["\\frac{\\pi}{4}",PI/4,"\\frac{1}{\\sqrt{2}}","1/sqrt(2)"],["\\frac{\\pi}{3}",PI/3,"\\frac{\\sqrt{3}}{2}","sqrt(3)/2"],["\\frac{\\pi}{2}",PI/2,"1","1"],["\\pi",PI,"0","0"]];
          const li=R.pick([0,0,1]), ui=R.int(li+1,5); const L=ang[li], U=ang[ui];
          const ans=li===0?U[3]:`${U[3]} - 1/2`;
          const fin=li===0?U[2]:(U[3]==="1"?"\\frac{1}{2}":U[3]==="0"?"-\\frac{1}{2}":`${U[2]} - \\frac{1}{2}`);
          return {prompt:`Evaluate $\\int_{${L[0]}}^{${U[0]}} \\cos(x)\\,dx$.`, answer:{type:"num",answer:ans}, verify:{value:simpson(Math.cos,L[1],U[1])},
            hint:"Which function has derivative $\\cos(x)$? Then use exact values of sine.",
            steps:[`A function with $F'(x) = \\cos(x)$ is $F(x) = \\sin(x)$.`,`$\\int_{${L[0]}}^{${U[0]}} \\cos(x)\\,dx = \\sin(x)\\Big|_{${L[0]}}^{${U[0]}} = \\sin\\left(${U[0]}\\right) - \\sin\\left(${L[0]}\\right)$`,`$= ${U[2]} - ${L[2]}${fin!==`${U[2]} - ${L[2]}`?` = ${fin}`:""}$`],
            answerTeX:`$${fin}$`};
        }
        if(kind==="exp"){ const c=R.int(1,3), a=R.pick([0,0,-1]);
          const ans=a===0?`e^${c} - 1`:`e^${c} - e^(-1)`; const fin=a===0?`e^{${c}} - 1`:`e^{${c}} - e^{-1}`;
          return {prompt:`Evaluate $\\int_{${a}}^{${c}} e^x\\,dx$.`, answer:{type:"num",answer:ans}, verify:{value:simpson(Math.exp,a,c)},
            hint:"$e^x$ is its own derivative.",
            steps:[`A function with $F'(x) = e^x$ is $F(x) = e^x$.`,`$\\int_{${a}}^{${c}} e^x\\,dx = e^x\\Big|_{${a}}^{${c}} = e^{${c}} - e^{${a}}$`,`$= ${fin}$${a===0?" since $e^0 = 1$":""}.`],
            answerTeX:`$${fin} \\approx ${(Math.exp(c)-Math.exp(a)).toFixed(3)}$`}; }
        if(kind==="negsin"){ const ang=[["\\frac{\\pi}{3}",PI/3,"\\frac12",Q(-1,2)],["\\frac{\\pi}{2}",PI/2,"0",Q(-1)],["\\pi",PI,"-1",Q(-2)]]; const U=R.pick(ang);
          return {prompt:`Evaluate $\\int_0^{${U[0]}} -\\sin(x)\\,dx$.`, answer:{type:"num",answer:qasc(U[3])}, verify:{value:simpson(x=>-Math.sin(x),0,U[1])},
            hint:"$\\frac{d}{dx}\\cos(x) = -\\sin(x)$.",
            steps:[`A function with $F'(x) = -\\sin(x)$ is $F(x) = \\cos(x)$.`,`$\\int_0^{${U[0]}} -\\sin(x)\\,dx = \\cos(x)\\Big|_0^{${U[0]}} = \\cos\\left(${U[0]}\\right) - \\cos(0)$`,`$= ${U[2]} - 1 = ${qtex(U[3])}$`],
            answerTeX:`$${qtex(U[3])}$`}; }
        const k=R.int(1,4), m=R.pick([2,4,6]), b=R.int(2,4), h=m/2;
        const Fq=x=>qadd(Q(-k,x),Q(h*x*x)); const val=qsub(Fq(b),Fq(1));
        return {prompt:`Evaluate $\\int_1^{${b}} \\left(\\frac{${k}}{x^2} + ${m}x\\right)dx$.`, answer:{type:"num",answer:qasc(val)}, verify:{value:simpson(x=>k/(x*x)+m*x,1,b)},
          hint:"$\\frac{d}{dx}\\left(-\\frac{1}{x}\\right) = \\frac{1}{x^2}$.",
          steps:[`A function with $F'(x) = \\frac{${k}}{x^2} + ${m}x$ is $F(x) = -\\frac{${k}}{x} + ${M.term(h,"x",2,true)}$.`,`$\\int_1^{${b}} \\left(\\frac{${k}}{x^2} + ${m}x\\right)dx = \\left(-\\frac{${k}}{x} + ${M.term(h,"x",2,true)}\\right)\\Big|_1^{${b}}$`,`$= \\left(-\\frac{${k}}{${b}} + ${h===1?"":h}(${b})^2\\right) - \\left(-\\frac{${k}}{1} + ${h===1?"":h}(1)^2\\right) = ${qtex(Fq(b))} - ${par(qtex(Fq(1)))}$`,`$= ${qtex(val)}$`],
          answerTeX:`$${qtex(val)}$`};
      }},
    {id:"L04.g.netchange", title:"Net change from a rate", skill:"Use a definite integral of a rate, or check which $f$ fits $\\int_a^b f'(x)\\,dx$", ref:"pp. 4 to 6",
      gen(R,d){
        if(d===1){
          const C=R.pick([["a balloon's volume","cm³/s","s","V","cm³"],["the volume of water in a pool","L/min","min","W","L"],["the mass of a growing crystal","mg/h","h","m","mg"],["the height of a rising tide","cm/h","h","h","cm"]]);
          const k=R.int(2,12), a=R.int(0,4), b=a+R.int(1,6); const val=k*(b-a);
          return {prompt:`Assume ${C[0]} changes at a constant rate of ${k} ${C[1]} from $t = ${a}$ ${C[2]} to $t = ${b}$ ${C[2]}. Use a definite integral to find the net change.`,
            answer:{type:"num",answer:String(val)}, verify:{value:simpson(()=>k,a,b)},
            hint:"Write the rate as a function, $"+C[3]+"'(t) = "+k+"$, and find a function with that derivative.",
            steps:[`The rate of change is $${C[3]}'(t) = ${k}$ ${C[1]}.`,`An antiderivative of $${C[3]}'(t)$ is $${C[3]}(t) = ${k}t$.`,`The net change is $\\int_{${a}}^{${b}} ${k}\\,dt = ${k}t\\Big|_{${a}}^{${b}} = ${k}(${b}) - ${k}(${a}) = ${val}$ ${C[4]}.`],
            answerTeX:`$${val}$ ${C[4]}`};
        }
        if(d===2){
          const C=R.pick([["v(t)","m/s","the change in position","s","m"],["a(t)","m/s²","the change in velocity","v","m/s"],["r(t)","L/min","the change in the volume of water in a tank","V","L"]]);
          let p,q,r; do{ p=R.int(0,2); q=R.int(-3,3); r=R.int(-4,6); }while(p===0&&q===0);
          const co=[3*p,2*q,r]; const ftex=M.poly(co,"t"); const Fp=t=>p*t*t*t+q*t*t+r*t; const Ftex=M.poly([p,q,r,0],"t");
          const a=R.int(0,2), b=a+R.int(1,3); const val=Fp(b)-Fp(a);
          return {prompt:`An object has ${C[0].startsWith("v")?"velocity":C[0].startsWith("a")?"acceleration":"inflow rate"} $${C[0]} = ${ftex}$ ${C[1]}, where $t$ is in ${C[1].includes("min")?"minutes":"seconds"}. Find ${C[2]} from $t = ${a}$ to $t = ${b}$.`.replace("An object has inflow rate","Water flows into a tank at the rate"),
            answer:{type:"num",answer:String(val)}, verify:{value:simpson(t=>co[0]*t*t+co[1]*t+co[2],a,b)},
            hint:"The change is the definite integral of the rate. Find a function whose derivative is the rate.",
            steps:[`${C[2][0].toUpperCase()+C[2].slice(1)} is $\\int_{${a}}^{${b}} \\left(${ftex}\\right)dt$.`,`A function with derivative $${ftex}$ is $${C[3]}(t) = ${Ftex}$.`,`$\\int_{${a}}^{${b}} \\left(${ftex}\\right)dt = \\left(${Ftex}\\right)\\Big|_{${a}}^{${b}} = ${Fp(b)} - ${par(Fp(a))} = ${val}$ ${C[4]}.`],
            answerTeX:`$${val}$ ${C[4]}`};
        }
        const a=R.int(0,2), b=a+R.int(1,2);
        const k=R.int(1,7), m=R.pick([3,4,5]);
        const cands=[["x^2",x=>x*x],[`x^2 + ${k}`,x=>x*x+k],[`${m}x`,x=>m*x],["x^3",x=>x*x*x],[`${m}x^2`,x=>m*x*x],[String(k+1),x=>k+1],["x",x=>x],["2x",x=>2*x],[`x^3 - ${k}`,x=>x*x*x-k]];
        const pick=R.int(0,cands.length-1); const V=cands[pick][1](b)-cands[pick][1](a);
        const wrong=R.shuffle(cands.filter((c,i)=>i!==pick && c[1](b)-c[1](a)!==V && c[0]!==cands[pick][0])).slice(0,4);
        const all=[cands[pick],...wrong]; const o=R.shuffle(all.map((c,i)=>i));
        return {prompt:`If $\\int_{${a}}^{${b}} f'(x)\\,dx = ${V}$, which of these could be $f(x)$?`,
          parts:[{answer:{type:"mc",options:o.map(i=>`$f(x) = ${all[i][0]}$`),correct:o.indexOf(0)}}],
          hint:`FTC Part 2 says $\\int_{${a}}^{${b}} f'(x)\\,dx = f(${b}) - f(${a})$. Test each option.`,
          steps:[`By FTC Part 2, $\\int_{${a}}^{${b}} f'(x)\\,dx = f(${b}) - f(${a})$, so you need $f(${b}) - f(${a}) = ${V}$.`,...all.map(c=>`$f(x) = ${c[0]}$: $f(${b}) - f(${a}) = ${c[1](b)} - ${par(c[1](a))} = ${c[1](b)-c[1](a)}$${c===all[0]?", which works.":"."}`)],
          answerTeX:`$f(x) = ${all[0][0]}$`};
      }},
    {id:"L04.g.erroran", title:"Find the first mistake", skill:"Spot math and notation errors in net change and Riemann sum solutions", ref:"pp. 3 to 6",
      gen(R,d){
        if(d===1 || (d===2 && R.int(0,1)===0)){
          const m=R.int(1,3), j=R.int(1,3), k=j*(m+1), b=R.int(1,3);
          const val=j*Math.pow(b,m+1);
          const e=d===1?R.pick([1,4,5]):R.pick([2,3]);
          const Qt=M.term(j,"t",m+1,true), rate=`${k}t${m===1?"":`^{${m}}`}`;
          let Ql=Qt, fin=val, finTxt=`${val} - 0 = ${val}`;
          if(e===1){ const c=k*m, p=m-1; Ql=p===0?String(c):M.term(c,"t",p,true); const wb=p===0?0:c*Math.pow(b,p); fin=wb; finTxt=p===0?`${c} - ${c} = 0`:`${wb} - 0 = ${wb}`; }
          let wrongVal=j*b*(m+1); if(wrongVal===val) wrongVal=val+j;
          const L=[`A function whose derivative is $Q'(t) = ${rate}$ is $Q(t) = ${Ql}$.`,
            e===2?`$\\Delta Q = \\int_0^{${b}} ${rate}$`:`$\\Delta Q = \\int_0^{${b}} ${rate}\\,dt$`,
            e===3?`$= ${Ql}\\Big|_{${b}}^{0}$`:`$= ${Ql}\\Big|_0^{${b}}$`,
            e===4?`$= Q(0) - Q(${b})$`:`$= Q(${b}) - Q(0)$`,
            e===4?`$= 0 - ${val} = -${val}$`:e===5?`$= ${wrongVal} - 0 = ${wrongVal}$`:`$= ${finTxt}$`];
          const why={1:`Line (1) is wrong: $${Ql}$ is the derivative of the rate, not an antiderivative. The right choice is $Q(t) = ${Qt}$, since $\\frac{d}{dt}${Qt} = ${rate}$.`,
            2:`Line (2) is missing the $dt$. An integral without its differential is not valid notation, and graders take marks off.`,
            3:`Line (3) has the limits upside down. $F(t)\\Big|_0^{${b}}$ means $F(${b}) - F(0)$; writing $\\Big|_{${b}}^{0}$ means $F(0) - F(${b})$.`,
            4:`Line (4) subtracts in the wrong order. FTC Part 2 gives $Q(b) - Q(a) = Q(${b}) - Q(0)$.`,
            5:`Line (5) has an arithmetic slip: $Q(${b}) = ${j===1?"":j}(${b})^{${m+1}} = ${val}$, not ${wrongVal}.`};
          return {prompt:`A problem and answer are shown. The answer would not get a perfect score. Select the first line that has a mistake.<div class="box note"><b class="t">Problem</b>If the rate of change of a quantity $Q$ is $Q'(t) = ${rate}$, what is the net change in $Q$ from $t = 0$ to $t = ${b}$?</div><div class="box note"><b class="t">Answer</b><ol>${L.map(s=>`<li>${s}</li>`).join("")}</ol></div>`,
            parts:[{answer:{type:"mc",options:lineOpts(5),correct:e-1,keep:true}}],
            hint:"Check each line on its own: is the antiderivative right, is every integral written with $dt$, and is the subtraction $Q(b) - Q(a)$?",
            steps:[why[e],`The correct solution: $Q(t) = ${Qt}$, $\\Delta Q = \\int_0^{${b}} ${rate}\\,dt = ${Qt}\\Big|_0^{${b}} = Q(${b}) - Q(0) = ${val}$.`],
            answerTeX:`Line (${e})`};
        }
        if(d===2){
          const p=R.pick([2,4,6,-2]), q=R.int(-4,5), a=R.int(0,1), b=a+R.int(1,3), h=p/2;
          const F=x=>h*x*x+q*x; const V=F(b)-F(a);
          const ftex=`${M.term(p,"x",1,true)}${M.term(q,"x",0)}`, Ftex=`${M.term(h,"x",2,true)}${M.term(q,"x",1)}`;
          const good=`$\\int_{${a}}^{${b}} (${ftex})\\,dx = \\left(${Ftex}\\right)\\Big|_{${a}}^{${b}} = ${F(b)} - ${par(F(a))} = ${V}$`;
          const nodx=`$\\int_{${a}}^{${b}} (${ftex}) = \\left(${Ftex}\\right)\\Big|_{${a}}^{${b}} = ${F(b)} - ${par(F(a))} = ${V}$`;
          const nobr=`$\\int_{${a}}^{${b}} (${ftex})\\,dx = ${Ftex}\\Big|_{${a}}^{${b}} = ${F(b)} - ${par(F(a))} = ${V}$`;
          const rev=`$\\int_{${a}}^{${b}} (${ftex})\\,dx = \\left(${Ftex}\\right)\\Big|_{${a}}^{${b}} = ${F(a)} - ${par(F(b))} = ${-V}$`;
          const bad=R.shuffle([[nodx,"is missing the $dx$ on the integral"],[nobr,"has no brackets around $"+Ftex+"$, so the bar only applies to the last term"],[rev,"subtracts $F(b)$ from $F(a)$, which flips the sign"]]).slice(0,2);
          const order=R.shuffle([0,1,2]); const ans=[[good,""],...bad];
          const shown=order.map(i=>ans[i]);
          return {prompt:`A question and three answers are shown. Select the correct answer.<div class="box note"><b class="t">Problem</b>Evaluate $\\int_{${a}}^{${b}} (${ftex})\\,dx$.</div>${shown.map((s,i)=>`<div class="box note"><b class="t">Answer #${i+1}</b>${s[0]}</div>`).join("")}`,
            parts:[{answer:{type:"mc",options:[1,2,3].map(i=>`Answer #${i} is correct.`),correct:order.indexOf(0),keep:true}}],
            hint:"Look for the $dx$, the brackets around $F(x)$ before the bar, and the order $F(b) - F(a)$.",
            steps:shown.map((s,i)=>s[1]?`Answer #${i+1} ${s[1]}.`:`Answer #${i+1} is correct: it keeps the $dx$, brackets the whole antiderivative, and computes $F(${b}) - F(${a})$.`),
            answerTeX:`Answer #${order.indexOf(0)+1}`};
        }
        // d3: left Riemann sum with n = 4
        const c=R.int(0,3), a=R.int(0,1), b=a+2; const half=Q(1,2);
        const f=t=>qadd(qmul(t,t),Q(c)); const ftex=`t^2${c?` + ${c}`:""}`;
        const T=i=>qadd(Q(a),Q(i,2));
        const e=R.pick([1,3,4,5,6]);
        const pts=e===3?[1,2,3,4].map(T):e===4?[0,1,2,3].map(i=>Q(a+i)):[0,1,2,3].map(T);
        const vals=pts.map(f);
        const plug=e===5?pts:vals;
        const sum=plug.reduce((s,v)=>qadd(s,qmul(v,half)),Q(0));
        const sumNoDt=vals.reduce((s,v)=>qadd(s,v),Q(0));
        const L=[e===1?`$\\Delta t = \\frac{n}{b-a} = \\frac{4}{${b}-${a}} = 2$`:`$\\Delta t = \\frac{b-a}{n} = \\frac{${b}-${a}}{4} = \\frac12$`,
          `$t_i = a + i\\Delta t = ${a} + i\\cdot\\frac12$, for $0 \\le i \\le 4$`,
          e===3?`$\\Delta F \\approx f(t_1)\\Delta t + f(t_2)\\Delta t + f(t_3)\\Delta t + f(t_4)\\Delta t$`:`$\\Delta F \\approx f(t_0)\\Delta t + f(t_1)\\Delta t + f(t_2)\\Delta t + f(t_3)\\Delta t$`,
          `$= ${pts.map(t=>`f(${ttex(t)})\\cdot\\frac12`).join(" + ")}$`,
          `$= ${plug.map(v=>`${qtex(v)}\\cdot\\frac12`).join(" + ")}$`,
          e===6?`$= ${qtex(sumNoDt)}$`:`$= ${qtex(sum)}$`];
        const okPts=[0,1,2,3].map(T), okVals=okPts.map(f), okSum=okVals.reduce((s,v)=>qadd(s,qmul(v,half)),Q(0));
        const why={1:"Line (1) has the fraction upside down: $\\Delta t = \\frac{b-a}{n}$.",3:"Line (3) uses $f(t_1)$ to $f(t_4)$. That is a right sum. The left sum uses $t_0$ to $t_3$.",4:`Line (4) plugs in $t = ${a}, ${a+1}, ${a+2}, ${a+3}$. Those are $a + i$, not $a + i\\Delta t$; the points are ${okPts.map(ttex).join(", ")}.`,5:"Line (5) writes the $t$-values instead of $f(t_i)$. Each height must be $f(t_i) = t_i^2"+(c?` + ${c}`:"")+"$.",6:"Line (6) adds the heights but forgets to multiply by $\\Delta t = \\frac12$."};
        return {prompt:`A problem and answer are shown. The answer would not get a perfect score. Select the first line that has a mistake.<div class="box note"><b class="t">Problem</b>The rate of change of $F(t)$ is $f(t) = ${ftex}$. Use the Left Riemann Sum with $n = 4$ subdivisions to approximate the net change in $F$ from $t = ${a}$ to $t = ${b}$.</div><div class="box note"><b class="t">Answer</b><ol>${L.map(s=>`<li>${s}</li>`).join("")}</ol></div>`,
          parts:[{answer:{type:"mc",options:lineOpts(6),correct:e-1,keep:true}}],
          hint:"Check $\\Delta t$, then which $t_i$ the left sum uses, then that each height is $f(t_i)$, then the arithmetic.",
          steps:[why[e],`Correct work: $\\Delta t = \\frac12$, points ${okPts.map(ttex).join(", ")}, so $\\Delta F \\approx \\frac12\\left(${okVals.map(qtex).join(" + ")}\\right) = ${qtex(okSum)}$.`],
          answerTeX:`Line (${e})`};
      }}
  ],
  exam:[
    {id:"L04.q1", ref:"pp. 4 to 5", multi:true, q:"Let $F'(x) = f(x)$. Which of these describe $\\int_2^5 f(x)\\,dx$? Select all that apply.", opts:[
      ["The exact net change in $F$ as $x$ goes from 2 to 5",1,"This is the definition of the definite integral (p. 4)."],
      ["$F(5) - F(2)$",1,"FTC Part 2 (p. 5)."],
      ["The area under $y = f(x)$ from 2 to 5, when $f(x) \\ge 0$ on $[2,5]$",1,"Net change equals area under the graph when the graph is above the axis."],
      ["The value of $F$ at $x = 5$",0,"That leaves out the starting value $F(2)$."],
      ["A collection of functions",0,"That describes an indefinite integral (Lecture 5). A definite integral is a number."]]},
    {id:"L04.q2", ref:"p. 5", q:"$r(t)$ is the rate a glacier loses ice, in tonnes per day, where $t$ is in days. The units of $\\int_0^{30} r(t)\\,dt$ are", opts:[
      ["tonnes",1,"(tonnes/day) × (days) = tonnes."],["tonnes per day",0,"That is the unit of the rate $r(t)$ itself."],["days",0,"The days cancel."],["tonnes per day²",0,"That would be the unit of $r'(t)$."]]},
    {id:"L04.q3", ref:"p. 4", q:"$h(t)$ is the height of a seedling in cm, $t$ weeks after planting. Which expression gives the change in height during the third week?", opts:[
      ["$\\int_2^3 h'(t)\\,dt$",1,"The third week runs from $t=2$ to $t=3$, and you integrate the rate $h'$."],
      ["$\\int_0^3 h'(t)\\,dt$",0,"That is the change over the first three weeks."],
      ["$\\int_2^3 h(t)\\,dt$",0,"Integrate the rate of change, not the height."],
      ["$\\int_3^4 h'(t)\\,dt$",0,"That is the fourth week."]]},
    {id:"L04.q4", ref:"p. 5", q:"True or False: $\\int_0^{\\pi}\\cos(t)\\,dt$ equals the total area of the region between $y=\\cos(t)$ and the $t$-axis on $[0,\\pi]$.", opts:[
      ["False",1,"The integral is $\\sin(\\pi) - \\sin(0) = 0$, but the region has area 2. The part below the axis counts as negative in the integral."],
      ["True",0,"Only true when the graph stays above the axis. Here half of it is below."]]},
    {id:"L04.q5", ref:"p. 3", q:"The table gives the rate $r(t)$, in L/min, that water enters a tank.$$\\begin{array}{c|ccccc} t & 0 & 0.5 & 1 & 1.5 & 2 \\\\ \\hline r(t) & 2 & 4 & 6 & 3 & 8 \\end{array}$$Use the Left Riemann Sum with $n = 2$ to approximate the change in volume from $t = 0$ to $t = 2$.", opts:[
      ["8 L",1,"$\\Delta t = 1$, so $t_0 = 0$, $t_1 = 1$: $2(1) + 6(1) = 8$. The columns at 0.5, 1.5 and 2 are not used."],
      ["7.5 L",0,"That is the left sum with $n = 4$ and $\\Delta t = 0.5$. The question says $n = 2$."],
      ["14 L",0,"That uses the right endpoints $t = 1$ and $t = 2$."],
      ["16 L",0,"A left sum with $n = 2$ has two terms. $r(t_2) = r(2)$ is not used."]]},
    {id:"L04.q6", ref:"p. 3", q:"For a left Riemann sum on $[1, 4]$ with $n = 6$, what is $t_3$?", opts:[
      ["2.5",1,"$\\Delta t = \\frac{4-1}{6} = 0.5$, so $t_3 = 1 + 3(0.5) = 2.5$."],
      ["2",0,"That is $t_2$."],
      ["1.5",0,"That is $3\\Delta t$. You still need to start at $a = 1$."],
      ["3",0,"That is $t_4$."]]},
    {id:"L04.q7", ref:"p. 5", multi:true, q:"If $\\int_1^3 f'(x)\\,dx = 8$, which of these could be $f(x)$? Select all that apply.", opts:[
      ["$f(x) = x^2$",1,"$f(3) - f(1) = 9 - 1 = 8$."],
      ["$f(x) = x^2 - 4$",1,"$5 - (-3) = 8$. Adding a constant does not change $f(b) - f(a)$."],
      ["$f(x) = 4x$",1,"$12 - 4 = 8$."],
      ["$f(x) = 2x$",0,"$6 - 2 = 4$."],
      ["$f(x) = x^3$",0,"$27 - 1 = 26$."]]},
    {id:"L04.q8", ref:"p. 6", q:"Select the first line with a mistake.<div class=\"box note\"><b class=\"t\">Problem</b>Evaluate $\\int_1^3 4x\\,dx$.</div><div class=\"box note\"><b class=\"t\">Answer</b>(1) The integrand is $f(x) = 4x$, and $F(x) = 2x^2$ has $F'(x) = 4x$.<br>(2) $\\int_1^3 4x\\,dx = 2x^2\\Big|_1^3$<br>(3) $= 2(1)^2 - 2(3)^2$<br>(4) $= -16$</div>", opts:[
      ["Line (3)",1,"It computes $F(1) - F(3)$. FTC Part 2 needs $F(3) - F(1) = 18 - 2 = 16$."],
      ["Line (1)",0,"$\\frac{d}{dx}2x^2 = 4x$, so $F$ is right."],
      ["Line (2)",0,"Correct notation: the $dx$ is there and the bar is applied to $2x^2$."],
      ["Line (4)",0,"Line (4) follows from line (3), but the first mistake is earlier."]]},
    {id:"L04.q9", ref:"pp. 2 to 3", q:"True or False: in the water tank example, using 8 subintervals instead of 4 should give a better approximation of the water that entered.", opts:[
      ["True",1,"Smaller $\\Delta t$ means the rate changes less across each piece (p. 2)."],
      ["False",0,"The notes say: use more subdivisions for a better approximation."]]},
    {id:"L04.q10", ref:"p. 7", q:"Evaluate $\\int_{-2}^{1} 3\\,dt$.", opts:[
      ["9",1,"$3t\\Big|_{-2}^{1} = 3(1) - 3(-2) = 3 + 6 = 9$. Also a 3 by 3 rectangle."],
      ["-3",0,"Sign slip: $3(1) - 3(-2) = 3 - (-6)$, not $3 - 6$."],
      ["3",0,"That is only $F(1)$."],
      ["-9",0,"That is $F(-2) - F(1)$, the wrong order."]]},
    {id:"L04.q11", ref:"pp. 4 to 5", multi:true, q:"Which statements about the notation $\\int_a^b f(x)\\,dx$ are true? Select all that apply.", opts:[
      ["$\\int$ is a long S: it stands for summing infinitely many infinitely small quantities",1,"From the NOTE on p. 4."],
      ["$f$ is called the integrand",1,"Definition on p. 4."],
      ["$f(x)\\,dx$ plays the role of $f(t_i)\\Delta t$, the area of one very thin rectangle",1,"The integral comes from the Riemann sum with infinitely many rectangles."],
      ["Once you know $F$, you can drop the $dx$",0,"The $dx$ belongs to the integral every time you write it. Graders take marks off when it is missing."],
      ["$a$ and $b$ are called integrands",0,"They are the limits of the integral."]]},
    {id:"L04.q12", ref:"p. 1", q:"Why can't you use distance = velocity × time for a ball rolling down a hill?", opts:[
      ["Its velocity is not constant",1,"The formula only works when every quantity is constant (p. 1)."],
      ["Distance is not measured in metres",0,"Units are not the issue."],
      ["Time is not a variable",0,"Time is the independent variable here."],
      ["The formula only works for cars",0,"It works for anything moving at a constant velocity."]]}
  ],
  steps:[
    {type:"read", title:"When the rate is not constant", body:`<p>Lots of science formulas multiply a rate by a time (p. 1):</p>$$\\text{distance} = \\text{velocity}\\times\\text{time}$$<p>Others are cardiac output = heart rate × stroke volume, and absorbance = molar absorptivity × path length × concentration.</p><p>All of these only work when every quantity is constant. Drive at exactly 60 km/h for 2 hours and you go 120 km. If your speed keeps changing, one multiplication can't give you the distance.</p><p>The plan for this lecture: cut the time into short pieces. On a short piece the rate barely changes, so rate × time is almost right. Add up the pieces.</p>`, ref:"p. 1"},
    {type:"example", title:"Water entering a tank", ex:{q:"Water enters a tank at a rate of $F'(t) = t^2 - t + 1$ L/min for $1 \\le t \\le 3$. Approximate the amount of water $\\Delta F$ that enters from $t = 1$ to $t = 3$ minutes.", ref:"pp. 1 to 2",
      steps:[
        {t:"One step: $a = 1$ and $\\Delta t = 3 - 1 = 2$, so $\\Delta F \\approx F'(1)\\Delta t = (1^2 - 1 + 1)\\cdot 2 = 2$ L.", why:"This is the differential approximation $\\Delta y \\approx f'(a)\\Delta x$ from Lecture 2."},
        {t:"That is not a good approximation, because $\\Delta t = 2$ is too big.", why:"The differential approximation needs a small $\\Delta t$. Over 2 minutes the rate changes a lot."},
        {t:"Take $\\Delta t = \\frac12$: split $[1,3]$ into 4 pieces, $[1,1.5]$, $[1.5,2]$, $[2,2.5]$ and $[2.5,3]$.", why:"Same idea, smaller pieces. Approximate each piece, then add."},
        {t:"$\\Delta F_1 \\approx F'(1)\\Delta t = 1\\cdot\\frac12 = \\frac12$ L", why:"Use the rate at the left end of $[1, 1.5]$."},
        {t:"$\\Delta F_2 \\approx F'(1.5)\\Delta t = (1.5^2 - 1.5 + 1)\\cdot\\frac12 = \\frac74\\cdot\\frac12 = \\frac78$ L", why:"$2.25 - 1.5 + 1 = 1.75 = \\frac74$."},
        {t:"$\\Delta F_3 \\approx F'(2)\\Delta t = \\frac32$ L and $\\Delta F_4 \\approx F'(2.5)\\Delta t = \\frac{19}{8}$ L", why:"$F'(2) = 3$ and $F'(2.5) = 6.25 - 2.5 + 1 = \\frac{19}{4}$; each is multiplied by $\\frac12$."},
        {t:"$\\Delta F \\approx \\frac12 + \\frac78 + \\frac32 + \\frac{19}{8} = \\frac{21}{4}$ L", why:"Over eighths: $\\frac{4 + 7 + 12 + 19}{8} = \\frac{42}{8} = \\frac{21}{4}$."}],
      ans:"$\\Delta F \\approx \\frac{21}{4} = 5.25$ L. To do better, use more subdivisions. (With FTC Part 2 from later in this lecture, the exact amount is $\\frac{20}{3} \\approx 6.67$ L. The notes do not compute this.)"}},
    {type:"read", title:"The Left Riemann Sum", body:`<p>The example works for any rate and any interval (p. 3).</p><div class="box def"><b class="t">Left Riemann Sum (p. 3)</b>To approximate the net change of $F(t)$, with rate of change $F'(t) = f(t)$, from $t = a$ to $t = b$ using $n$ subdivisions, let $$\\Delta t = \\frac{b-a}{n} \\quad\\text{(the width of the subintervals)}$$ $$t_i = a + i\\Delta t,\\ 0 \\le i \\le n \\quad\\text{(the end points)}$$ Then $$\\Delta F \\approx f(t_0)\\Delta t + f(t_1)\\Delta t + f(t_2)\\Delta t + \\cdots + f(t_{n-1})\\Delta t$$</div><p>Each $f(t_i)\\Delta t$ is the area of a rectangle: height $f(t_i)$, width $\\Delta t$. The height comes from the left end of each piece, so the last point $t_n = b$ is never plugged in.</p><div class="box warn"><b class="t">Watch for this</b>Quizzes give half marks just for writing $\\Delta t$ and the $t_i$ correctly. Write them out before you start adding.</div>`, ref:"p. 3"},
    {type:"explore", title:"More rectangles, better approximation", fig:"riemann", body:`<p>As you take more and more subdivisions, the rectangles get closer to the area under the graph of $y = f(t)$. With infinitely many, you get the exact area (p. 3).</p><p><b>Try it.</b> With the water tank and the left sum, set $n = 4$: the readout shows $5.25$, the $\\frac{21}{4}$ from the example. Slide $n$ up to 40 and watch the sum move toward $\\frac{20}{3} \\approx 6.667$. Then switch to the right sum. For this increasing rate it lands above the exact value instead of below.</p>`, ref:"pp. 2 to 3"},
    {type:"mcq", title:"Which points go in?", q:"You use a left Riemann sum with $n = 4$ to approximate the net change from $t = 1$ to $t = 3$. Which $t$-values do you plug into $f$?", opts:[
      ["$1,\\ 1.5,\\ 2,\\ 2.5$",true,"$\\Delta t = \\frac{3-1}{4} = \\frac12$, and the left sum uses $t_0$ to $t_3$."],
      ["$1.5,\\ 2,\\ 2.5,\\ 3$",false,"Those are the right endpoints."],
      ["$1,\\ 1.5,\\ 2,\\ 2.5,\\ 3$",false,"That is five values. With $n = 4$ there are four rectangles, and $t_4 = 3$ is not used."],
      ["$1,\\ 2,\\ 3,\\ 4$",false,"That uses $\\Delta t = 1$ and goes past $b = 3$."]]},
    {type:"try", title:"Your turn: a table with extra columns", gen:"L04.g.lefttable", body:`<div class="box warn"><b class="t">Tables with extra columns</b>Midterm and quiz tables often list more $t$-values than you need. Work out $\\Delta t$ and the $t_i$ first, then read only those columns. Never use $t_n = b$ in a left sum.</div>`},
    {type:"read", title:"Net change is an area, and an integral", body:`<p>As $n \\to \\infty$ the rectangles fill the region under the graph of the rate. So the net change is an area (p. 4).</p><div class="box def"><b class="t">Net change = area (p. 4)</b>The net change $\\Delta F$ of a quantity $F(x)$ as $x$ changes from $a$ to $b$ is equal to the area under the graph of $F'(x) = f(x)$ from $x = a$ to $x = b$: $$\\text{Area under the curve} = F(b) - F(a)$$</div><div class="box def"><b class="t">Definite integral (p. 4)</b>If $F$ has rate of change $F'(x) = f(x)$, the net change of $F$ from $x = a$ to $x = b$ is written $$\\int_a^b f(x)\\,dx$$ The function $f$ is the integrand.</div><p>The notation tells the story. $\\int$ is a long S, for sum. $f(x)\\,dx$ is one infinitely thin rectangle: height $f(x)$, width $dx$. With $F'(x) = f(x)$, each $F'(x)\\,dx$ is a differential, so $\\int_a^b F'(x)\\,dx$ is the sum of infinitely many differentials (pp. 4 to 5).</p><div class="box warn"><b class="t">Watch for this</b>The integral equals the area only when the graph is above the axis. Where $f(x) < 0$ the quantity is going down, and the integral counts that area as negative. The next figure shows this.</div>`, ref:"pp. 4 to 5"},
    {type:"explore", title:"Signed area", fig:"signed", body:`<p>The example on p. 5 asks for the shaded region under $y = \\cos(t)$ on $[0,\\pi]$ as a definite integral, and gives $\\int_0^{\\pi}\\cos(t)\\,dt$.</p><p>That integral is $\\sin(\\pi) - \\sin(0) = 0$. The shaded region has area 2: 1 above the axis and 1 below. The integral adds the first part and subtracts the second.</p><p><b>Try it.</b> Drag the point to $b = \\frac{\\pi}{2}$ (about 1.571): the integral and the shaded area are both 1. Keep going to $b = \\pi$: the shaded area grows to 2 while the integral drops to 0.</p>`, ref:"pp. 4 to 5"},
    {type:"mcq", title:"What does it represent?", q:"$r(t)$ is the rate oxygen is transferred to the blood while breathing, in L/min. What does $\\int_0^4 r(t)\\,dt$ represent? (p. 5 exercise)", opts:[
      ["The net amount of oxygen, in L, transferred to the blood from $t = 0$ to $t = 4$ minutes",true,"The integral of a rate is a net change. Units: (L/min)(min) = L."],
      ["The rate oxygen is transferred at $t = 4$",false,"That would be $r(4)$, in L/min."],
      ["The average of $r(0)$ and $r(4)$",false,"The integral adds up the rate over the whole interval, not just the two ends."],
      ["The time it takes to transfer 4 L of oxygen",false,"The 4 is a time limit, not an amount."]],
      after:"Read an integral of a rate as: the net change in the quantity, from the lower limit to the upper limit, in (rate units) × (time units)."},
    {type:"try", title:"Your turn: reading an integral", gen:"L04.g.meaning"},
    {type:"read", title:"Exact answers: FTC Part 2", body:`<p>Riemann sums only approximate. For the exact value, use the fact that $\\int_a^b f(x)\\,dx$ is the net change of any $F$ with $F'(x) = f(x)$ (p. 5).</p><div class="box def"><b class="t">Fundamental Theorem of Calculus, Part 2 (p. 5)</b>If $F(x)$ is any function such that $F'(x) = f(x)$, then $$\\int_a^b f(x)\\,dx = F(b) - F(a)$$</div><p>Notation (p. 6): $F(x)\\Big|_a^b$ means $F(b) - F(a)$, read "evaluated from $a$ to $b$". So $\\int_a^b f(x)\\,dx = F(x)\\Big|_a^b$.</p><div class="box"><b class="t">Example (p. 6)</b>$\\int_1^2 2x\\,dx$: the integrand is $2x$, and $F(x) = x^2$ has $F'(x) = 2x$. So $$\\int_1^2 2x\\,dx = x^2\\Big|_1^2 = (2)^2 - (1)^2 = 3$$ Two readings: a quantity with rate $2x$ changes by exactly 3 from $x = 1$ to $x = 2$, and the area under $y = 2x$ from 1 to 2 is 3.</div><div class="box"><b class="t">Example (p. 6)</b>$$\\int_0^{\\pi/4}\\cos(x)\\,dx = \\sin(x)\\Big|_0^{\\pi/4} = \\sin\\left(\\frac{\\pi}{4}\\right) - \\sin(0) = \\frac{1}{\\sqrt2}$$</div><div class="box warn"><b class="t">Notation costs marks</b>Keep the $dx$ on every integral. Once you have $F$, write $F(x)\\Big|_a^b$ with brackets around all of $F$. Do not put $F$ back under an integral sign.</div>`, ref:"pp. 5 to 6"},
    {type:"explore", title:"Area under f, rise in F", fig:"ftc", body:`<p>FTC Part 2 says two very different things are equal: the area under the rate curve, and how much the antiderivative climbs.</p><p><b>Try it.</b> With $f(x) = 2x$, set $a = 1$ and $b = 2$: the area is 3 and $F(2) - F(1) = 4 - 1 = 3$. Drag either point and check that the two numbers stay equal. Then switch to $\\cos(x)$, keep $a = 0$, and put $b$ near $0.785$ ($\\frac{\\pi}{4}$) to see $\\frac{1}{\\sqrt2} \\approx 0.707$.</p>`, ref:"pp. 5 to 6"},
    {type:"try", title:"Your turn: evaluate an integral", gen:"L04.g.ftc"},
    {type:"try", title:"Quiz style: find the first mistake", gen:"L04.g.erroran"},
    {type:"formulas", title:"Lecture 4 formulas"}
  ]
});
})();
