# How the content is stored

Every lecture lives in its own file, `data/L07.js`. Adding a lecture means adding one file, listing it in `data/course.js`, and running the build.

```
node build/build.js            # validate everything and write assets/js/studydata.js + unit pages
node build/build.js --check --only L07   # validate one lecture
node tests/fuzz.js 150 --lec L07         # run every generator in L07 at 3 difficulties x 150 seeds
python3 tests/walk.py L07                # click through every chapter step in a headless browser
```

## Stable IDs

IDs never change once published, because saved progress (first-try scores, Leitner boxes, mistake log, ratings) is keyed on them.

| Thing | Pattern | Example |
|---|---|---|
| Lecture | `L` + two digits | `L07` |
| Formula | `Lxx.f.<slug>` | `L07.f.abs-def` |
| Generator (problem type) | `Lxx.g.<slug>` | `L07.g.abs-ineq` |
| Exam question | `Lxx.q<k>` | `L07.q3` |
| Glossary term | `Lxx.t.<slug>` | `L07.t.piecewise` |
| Prof review question | set + number | `PQ3.10`, `PMA.17b` |
| Course-notes problem | book numbering | `CN2.1-P4b` |

Never reuse or renumber an ID. To retire something, delete it (old progress for it is ignored).

## A lecture file

```js
M127.lecture({
  id:"L07", n:7, date:"2026-09-23", added:"2026-10-21",   // added = the day it went on the site
  unit:"u3", quiz:"Q3",                                    // must match data/course.js
  title:"The Absolute Value Function", sections:["2.1.2"], pages:5,
  summary:"One or two plain sentences.",
  flags:[{ref:"p. 5", text:"The notes write ... It should be ..."}],   // errors in the lecture notes
  formulas:[ {id, name, tex, note?, ref:"p. 2", blank?:{tex, answer, vars?, domain?, type?} | {tex, text:true, accept:[...]}} ],
  glossary:[ {id, term, def, ref} ],
  figures:{ key:{title, cap, build(host, {PLOT, M}){ ... }} },
  gens:[ {id, title, skill, ref, gen(R, d){ return problem; }} ],
  exam:[ {id, ref, q, opts:[[text, isCorrect, why], ...], multi?} ],
  steps:[ ... the chapter, in order ... ]
});
```

### Text and math
All text fields accept HTML and `$...$` / `$$...$$` LaTeX (KaTeX). Inside JS template strings, write backslashes twice: `"$\\frac{dy}{dx}$"`. A literal dollar sign is `\\$`.

### Formulas
`tex` is LaTeX without dollars. `ref` is the lecture page. `blank` powers the fill-in-the-blank drill: `blank.tex` is the formula with one piece replaced by `\\boxed{\\,?\\,}`, and `blank.answer` is the missing piece in typed math (checked by evaluating at random points). For pieces that are not checkable by evaluation (like `f'(x)g(x)+f(x)g'(x)`), use `text:true, accept:[...]` with every reasonable spelling.

### Steps (the chapter)
| type | fields | what it shows |
|---|---|---|
| `read` | title, body, fig?, ref | key idea in plain words |
| `example` | title, ex:{q, steps:[{t, why}], ans, ref}, fig? | worked example revealed one step at a time |
| `explore` | title, fig, body | an interactive figure with instructions |
| `mcq` | title, q, opts, multi?, after? | concept check, counts toward the first-try score |
| `try` | title, gen, diff? | a generated problem, counts toward the first-try score |
| `formulas` | title | the lecture's formula cards |

### Generators
`gen(R, d)` gets a seeded random source `R` (`R.int(a,b)`, `R.nz(a,b)` non-zero, `R.pick(arr)`, `R.shuffle(arr)`, `R.real(a,b,dp)`) and difficulty `d` (1 easy, 2 medium, 3 hard). The same seed always gives the same problem, so the mistake log can recreate it. It returns:

```js
{
  prompt:"Find $f'(x)$ for $f(x) = ...$.",
  answer:{type:"expr", answer:"6x^2 - 4", vars:["x"], domain:[-2,2]},   // or parts:[{label, answer}, ...]
  hint:"...",
  steps:["...", "..."],             // the worked solution, one string per line
  answerTeX:"$f'(x) = 6x^2 - 4$",
  verify:{deriv:"2x^3 - 4x"}        // optional independent check run by tests/fuzz.js
}
```

Answer types: `expr` (equivalent forms accepted by evaluating at random points in `domain`; add `plusC:true` for antiderivatives), `num` (with `tol` or `rel`), `interval` (`"(0,4]"`, `"(-inf,1) U [3,inf)"`), `list` (`"1, -3"`), `mc` (`options:[...]`, `correct:index`).

`verify` lets the fuzz test check the answer without trusting the generator: `{deriv:"f"}` (answer must be the derivative of f), `{antideriv:"g"}` (derivative of answer must be g), `{expr:"..."}` (same function, computed another way), `{value:n}`.

### Practice questions from the prof and the course notes
`data/review/*.js` call `M127.addReview([...])` with `{id, set, src, lec, kind:"mc"|"long", q, opts?, multi?, a, steps?, marks?}`.
`data/longanswer/*.js` call `M127.addLongAnswer([...])` with `{id, src, lec, kind, page, q, sol:[...], ans, marks?, note?}`.

Real quiz questions are never copied onto the site. They decide what the generators and exam questions emphasise.
