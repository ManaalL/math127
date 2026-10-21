# MATH 127 Interactive

An interactive study site for MATH 127 (Calculus 1 for the Sciences) at the University of Waterloo, Fall 2026.

Manaal Lakhani, Honours Sciences @ UWaterloo, built with help from Claude.

## What's here

- **Units** (`unit-1.html` to `unit-6.html`): one page per unit. Lectures are grouped by the quiz that first tests them. Each lecture is a chapter with the key ideas, a worked example you step through, interactive graphs and generated practice problems. Each unit also has Explore, Practice, Mini exam and Glossary tabs.
- **Formula sheet** (`formulas.html`): every formula with its lecture and page. It has three modes: reference, Leitner flashcards, and fill in the blank. It shows a readiness score for each unit.
- **Practice gym** (`gym.html`): endless problems from any lectures you pick, in easy, medium or hard. It tracks your accuracy by topic.
- **Quiz prep** (`quiz.html`, `quiz-N.html`): a timed practice quiz in the real format for each quiz, plus problems, the prof's practice quiz and that quiz's formulas.
- **Midterm prep** (`midterm.html`): a practice midterm and the long-answer bank from the course notes. It also has the prof's practice questions with self-rating, a mistake log and a study plan.
- **Tan**: the study guide in the corner. Drag it along its curve, or tap it to ask about any formula or idea.

Progress is saved in your browser only.

## How it's built

Plain HTML, CSS and JavaScript, with no framework. Math is rendered with KaTeX. Each lecture is one file in `data/` (for example `data/L07.js`). `build/build.js` validates every data file and writes `assets/js/studydata.js` plus the unit and quiz pages. See [docs/DATA.md](docs/DATA.md) for the format and [docs/UPDATING.md](docs/UPDATING.md) for adding a lecture.

```
node build/build.js          # validate and build
node tests/fuzz.js 150       # run every problem generator many times and check every answer
python3 tests/site.py        # open every page in headless Chromium at laptop and phone widths, light and dark
```

## Sources

Formulas and definitions follow the Fall 2026 MATH 127 lecture notes. Course-notes problems are from D. Wolczuk, *Calculus for the Sciences* (CC BY-NC 4.0). Practice questions are from the course's practice quizzes and practice midterms. Real quiz questions are not reproduced.

This is an independent study aid, not an official University of Waterloo resource.
