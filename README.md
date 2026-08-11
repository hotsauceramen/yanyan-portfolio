# Mark Ian Tolentino Portfolio

One-page, white, minimalist, Apple-inspired portfolio built with plain HTML/CSS/JavaScript.

## Folder structure

```text
yanyan-portfolio-v1/
├── index.html
├── style.css
├── script.js
├── README.md
├── .gitignore
└── assets/
    └── images/
        └── graphic-design/
            └── PUT-DESIGNS-HERE.txt
```

## Add your 100+ graphic designs

Put JPG, PNG, or WebP files into:

`assets/images/graphic-design/`

Then open `script.js` and list the filenames:

```js
const DESIGN_IMAGES = [
  "design-001.jpg",
  "design-002.jpg",
  "design-003.jpg",
];
```

The site initially shows 25 and loads 25 more when the visitor clicks **Show more**.

## YouTube videos

The showreel and six Best Works are already embedded in `index.html`.

Showreel:
`ogrtAzHDZTw`

Best Works:
- `GFbDPocC5Hg` — Camino Coffee Commercial
- `1X1lFt82DEI` — Rotary Club of Balibago 2026 Recap
- `bh_d4Qx1Ro8` — LINC Command Center — App Demo
- `TTOAaR2-xOw` — Makimura Christmas Platters
- `rPQtLmvqqic` — Beautéderm Byaheng Kalinga Highlights
- `Wo5r7lH9PXQ` — One Magalang Basketball Season 5

## Before publishing

Resume contact details are already entered in `index.html`:
- 0927 233 0096
- tolentinomarkian23@gmail.com
- Magalang, Pampanga, Philippines

Edit the About text/tools if desired.

## Run locally

From the project folder:

```bash
python3 -m http.server 8000
```

Then open:

`http://localhost:8000`

You can also open `index.html` directly, but the local server is recommended.

## Deploy

This is a static site: no npm, framework, build command, or backend is required.

1. Create a GitHub repository.
2. Upload the contents of this folder.
3. Import the GitHub repository into Vercel.
4. Deploy with the default/static settings.


## Video autoplay behavior

The YouTube videos are configured for:

- Muted autoplay
- Continuous looping
- Play when approximately 55% visible
- Pause when scrolled away
- Only one portfolio video playing at a time

Browsers generally require autoplay to be muted. Visitors can use the YouTube controls to turn sound on or pause/play manually.
