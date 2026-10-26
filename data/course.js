/* Course structure: units, quizzes, the full lecture schedule and key dates.
   Units are grouped by topic. Inside each unit, lectures are grouped by the quiz that first tests them.
   To add a unit after the midterm, add it to `units` and point new lecture files at it. */
window.M127 = window.M127 || {};
M127.COURSE = {
  code:"MATH 127", name:"Calculus 1 for the Sciences", term:"Fall 2026", school:"University of Waterloo",
  midterm:{date:"2026-10-29", time:"19:00", end:"20:50", label:"Midterm", covers:"up to and including section 2.7.2 (Lectures 1 to 17)", format:"12 multiple choice and 8 long answer", weight:"25%", lectures:["L01","L02","L03","L04","L05","L06","L07","L08","L09","L10","L11","L12","L13","L14","L15","L16","L17"]},
  units:[
    {id:"u1", n:1, title:"Rates of Change and Approximation", short:"Derivatives and approximation", lectures:["L01","L02","L03"],
      topics:["Derivative rules and units of a derivative","Tangent lines and linear approximation","Differentials and differential equations"]},
    {id:"u2", n:2, title:"Net Change and Antiderivatives", short:"Net change and antiderivatives", lectures:["L04","L05","L06"],
      topics:["Riemann sums and the definite integral","Antiderivatives and indefinite integrals","Solving simple DEs and initial value problems"]},
    {id:"u3", n:3, title:"Piecewise, Integral and Inverse Functions", short:"Piecewise, integral and inverse functions", lectures:["L07","L08","L09"], related:["L06"],
      topics:["Absolute value and piecewise functions","Integral functions and FTC Part 1","Inverse functions"]},
    {id:"u4", n:4, title:"Exponentials and Logarithms", short:"Exponentials and logarithms", lectures:["L10","L11"],
      topics:["Exponential functions and e","Logarithms and their properties","Calculus with logs, log scales"]},
    {id:"u5", n:5, title:"Trigonometric Functions", short:"Trig and inverse trig", lectures:["L12","L13","L14","L15"],
      topics:["Radians and the unit circle","Modelling with sine and cosine","Inverse trig functions","Derivatives and integrals of trig"]},
    {id:"u6", n:6, title:"Factorials and Implicit Differentiation", short:"Implicit and log differentiation", lectures:["L16","L17"],
      topics:["The factorial function","Implicit differentiation","Logarithmic differentiation"]},
    {id:"u7", n:7, title:"Limits, Continuity and Indeterminate Forms", short:"Limits and continuity", lectures:["L18","L19","L20","L21","L22","L23"],
      topics:["One-sided, two-sided and infinite limits","Continuity, the IVT and types of discontinuity","Limits at infinity, indeterminate forms and L'Hospital's Rule"]}
  ],
  /* quiz blocks: which lectures each quiz adds (quizzes are cumulative) */
  quizzes:[
    {id:"Q1", n:1, date:"2026-09-14", covers:"high school calculus", lectures:[], weight:"2%", practice:"PQ1"},
    {id:"Q2", n:2, date:"2026-09-21", covers:"up to section 1.2.1", lectures:["L01","L02","L03","L04"], weight:"2%", practice:"PQ2"},
    {id:"Q3", n:3, date:"2026-09-28", covers:"up to section 2.1.2", lectures:["L05","L06","L07"], weight:"2%", practice:"PQ3"},
    {id:"Q4", n:4, date:"2026-10-05", covers:"up to section 2.4.3", lectures:["L08","L09","L10"], weight:"2%", practice:"PQ4"},
    {id:"Q5", n:5, date:"2026-10-19", covers:"up to section 2.5.2", lectures:["L11","L12","L13"], weight:"2%", practice:"PQ5"},
    {id:"MT", n:0, date:"2026-10-29", covers:"up to section 2.7.2", lectures:["L14","L15","L16","L17"], weight:"25%", label:"Midterm only", midterm:true},
    {id:"Q6", n:6, date:"2026-11-02", covers:"up to section 3.1.2", lectures:["L18","L19"], weight:"2%"},
    {id:"Q7", n:7, date:"2026-11-09", covers:"up to section 3.2.3", lectures:["L20","L21","L22"], weight:"2%"},
    {id:"Q8", n:8, date:"2026-11-16", covers:"up to section 3.3.3", lectures:["L23","L24","L25"], weight:"2%"},
    {id:"Q9", n:9, date:"2026-11-23", covers:"up to section 3.4", lectures:["L26","L27","L28"], weight:"2%"},
    {id:"Q10", n:10, date:"2026-11-30", covers:"up to section 4.2.3", lectures:["L29","L30","L31"], weight:"2%"}
  ],
  /* the official course schedule. Lectures with a data file get a chapter; the rest show as upcoming. */
  schedule:[
    ["L01","2026-09-09","Derivatives review, rates of change","1.1.1, 1.1.2"],
    ["L02","2026-09-11","Tangent line approximation, differential approximation","1.1.3, 1.1.4"],
    ["L03","2026-09-14","Differentials, differential equations","1.1.4, 1.1.5"],
    ["L04","2026-09-16","The net change problem","1.2.1"],
    ["L05","2026-09-18","Antiderivatives","1.2.2"],
    ["L06","2026-09-21","Solving DEs, piecewise defined functions","1.2.3, 2.1.1"],
    ["L07","2026-09-23","Absolute value function","2.1.2"],
    ["L08","2026-09-25","Integral functions","2.2"],
    ["L09","2026-09-28","Inverse functions","2.3"],
    ["L10","2026-09-30","Exponential and logarithm functions","2.4.1 to 2.4.3"],
    ["L11","2026-10-02","Calculus with logarithms, logarithmic scales","2.4.4, 2.4.6"],
    ["L12","2026-10-05","Trigonometric functions","2.5.1"],
    ["L13","2026-10-07","Modelling with trig functions","2.5.2"],
    ["L14","2026-10-09","Inverse trig functions","2.5.3"],
    ["L15","2026-10-19","Calculus of trig functions","2.5.4"],
    ["L16","2026-10-21","Factorial function, implicitly defined functions","2.6, 2.7.1"],
    ["L17","2026-10-23","Derivatives of inverse functions, logarithmic differentiation","2.7.1, 2.7.2"],
    ["L18","2026-10-26","Limits","3.1.1"],
    ["L19","2026-10-28","Continuity","3.1.2"],
    ["L20","2026-10-30","IVT, classifying discontinuities","3.1.3, 3.1.4"],
    ["L21","2026-11-02","Limits at infinity, indeterminate forms","3.1.5, 3.2.1"],
    ["L22","2026-11-04","Indeterminate forms continued","3.2.2, 3.2.3"],
    ["L23","2026-11-06","Indeterminate products and powers","3.2.4, 3.2.5"],
    ["L24","2026-11-09","Asymptotes, intervals of increase and decrease","3.3.1, 3.3.2"],
    ["L25","2026-11-11","Critical numbers, local extrema","3.3.2, 3.3.3"],
    ["L26","2026-11-13","Intervals of concavity","3.3.4"],
    ["L27","2026-11-16","Curve sketching","3.4"],
    ["L28","2026-11-18","Curve sketching continued","3.4"],
    ["L29","2026-11-20","Absolute maxima and minima","4.1"],
    ["L30","2026-11-23","Optimization, linear approximation","4.1.2, 4.2.1"],
    ["L31","2026-11-25","Binomial approximation, quadratic approximation","4.2.2, 4.2.3"],
    ["L32","2026-11-27","Linear approximation error","4.2.4"],
    ["L33","2026-11-30","Integration by substitution","5.1"],
    ["L34","2026-12-02","Sigma notation, Riemann sums","5.2.1, 5.2.2"],
    ["L35","2026-12-04","Properties of definite integrals, area between curves","5.2.3, 5.3"],
    ["L36","2026-12-07","Approximating integrals","5.5"]
  ]
};
