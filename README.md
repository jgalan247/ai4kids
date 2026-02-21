# Teachable Machine — Year 7 Unit Website

A complete, static, offline-friendly website delivering a 6-lesson unit on Google Teachable Machine for Primary School students (UK curriculum).

## Quick Start

1. Download or clone this repository.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox).
3. That's it — no server needed!

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder.
5. Click **Save**. Your site will be live at `https://<username>.github.io/<repo-name>/`.

## Project Structure

```
AI4kids/
├── index.html                  # Home page — unit overview & progress
├── glossary.html               # Key vocabulary definitions
├── about.html                  # Credits & technical info
├── README.md                   # This file
│
├── css/
│   └── styles.css              # All styles (responsive + print)
│
├── js/
│   └── app.js                  # Progress tracker, auto-save, mode toggle
│
├── lessons/
│   ├── lesson-1.html           # Your First Model (2-class)
│   ├── lesson-2.html           # Bias & Fairness (background trick)
│   ├── lesson-3.html           # Training vs Testing (accuracy)
│   ├── lesson-4.html           # Three-Class Model (confusion)
│   ├── lesson-5.html           # Product Design (own idea)
│   └── lesson-6.html           # Showcase & Reflection (ethics)
│
├── resources/
│   └── index.html              # Downloads & dataset instructions
│
├── help/
│   └── index.html              # Student help sheet & FAQ
│
├── teacher/
│   └── index.html              # Teacher notes, timings, differentiation
│
└── assets/
    ├── resources/
    │   ├── Teachable_Machine_Year7_6_Lessons.docx
    │   ├── Teachable_Machine_Student_Help_Sheet.docx
    │   └── Teachable_Machine_Year7_6_Lessons_Starter_Deck.pptx
    ├── datasets/
    │   └── TeachableMachine_Demo_Datasets.zip
    └── images/
        └── (screenshot placeholders)
```

## Adding or Replacing Datasets

1. Place your dataset ZIP file in `assets/datasets/`.
2. Update the download links on the lesson pages and `resources/index.html` to point to the new file.
3. The ZIP should contain folders organised as:
   ```
   YourDataset/
   ├── TRAIN/
   │   ├── Class1/  (10+ images)
   │   └── Class2/  (10+ images)
   └── TEST/
       ├── Class1/  (5 images)
       └── Class2/  (5 images)
   ```

## Adding Resource Files

Place the following files in the `assets/resources/` directory:
- `Teachable_Machine_Year7_6_Lessons.docx` — Unit pack with all worksheets
- `Teachable_Machine_Student_Help_Sheet.docx` — Student reference guide
- `Teachable_Machine_Year7_6_Lessons_Starter_Deck.pptx` — Lesson starter slides

## Features

- **Progress tracker** — Students mark lessons as done; progress persists in localStorage.
- **Auto-save** — All form inputs save automatically to localStorage.
- **Student/Teacher mode** — Toggle in the header hides/shows teacher notes and suggested answers.
- **Print styles** — Each lesson page can be printed as a clean worksheet.
- **Offline-friendly** — No external CDNs or API calls. Works from the filesystem.
- **Accessible** — High contrast, large fonts, keyboard navigation, skip links, semantic HTML.
- **Responsive** — Sidebar collapses on smaller screens with a hamburger menu.

## Browser Support

Tested on Chrome, Edge, and Firefox. Works offline from the local filesystem.

## Licence

Educational resource for classroom use. Adapt freely to suit your students' needs.
