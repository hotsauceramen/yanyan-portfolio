/* =========================================================
   YANYAN PORTFOLIO
   GRAPHIC DESIGN SHOWCASE + YOUTUBE VIDEO SYSTEM
   ========================================================= */

/* =========================================================
   GRAPHIC DESIGN
   ========================================================= */

const DESIGN_IMAGES = Array.from(
  { length: 100 },
  (_, i) => `design-${String(i + 1).padStart(3, "0")} Large.jpeg`,
);

/*
   100 designs
   ↓
   10 sets
   ↓
   10 designs per set
*/

const SET_SIZE = 10;

const SHOWCASE_INTERVAL = 6000;

let currentSet = 0;

let showcaseMode = true;

/* =========================================================
   ELEMENTS
   ========================================================= */

const grid = document.getElementById("design-grid");

const more = document.getElementById("load-more");

const empty = document.getElementById("design-empty");

/* =========================================================
   CREATE "VIEW ALL" BUTTON
   ========================================================= */

const viewAll = document.createElement("button");

viewAll.className = "view-all-designs";

viewAll.type = "button";

viewAll.textContent = "View all 100 works";

viewAll.style.display = "block";

if (more) {
  more.style.display = "none";
}

if (grid && grid.parentNode) {
  grid.parentNode.insertBefore(viewAll, grid.nextSibling);
}

/* =========================================================
   CREATE DESIGN CARD
   ========================================================= */

function createDesignCard(file, index) {
  const item = document.createElement("button");

  item.className = "design-item";

  item.type = "button";

  item.setAttribute("aria-label", `Open graphic design ${index + 1}`);

  const img = document.createElement("img");

  img.src = `assets/images/graphic-design/${file}`;

  img.alt = `Graphic design work ${index + 1}`;

  img.loading = index < 20 ? "eager" : "lazy";

  img.decoding = "async";

  img.onerror = () => {
    item.remove();
  };

  item.appendChild(img);

  item.addEventListener("click", () => {
    openModal(img.src, img.alt);
  });

  return item;
}

/* =========================================================
   RENDER SHOWCASE SET
   ========================================================= */

function renderShowcaseSet(setNumber) {
  if (!grid) return;

  const start = setNumber * SET_SIZE;

  const end = start + SET_SIZE;

  const files = DESIGN_IMAGES.slice(start, end);

  /*
     Fade current set out.
  */

  grid.classList.add("design-grid-fading");

  setTimeout(() => {
    grid.innerHTML = "";

    files.forEach((file, index) => {
      grid.appendChild(createDesignCard(file, start + index));
    });

    /*
       Fade new set in.
    */

    requestAnimationFrame(() => {
      grid.classList.remove("design-grid-fading");
    });
  }, 700);
}

/* =========================================================
   AUTOMATIC ROTATION
   ========================================================= */

let showcaseTimer;

function startShowcase() {
  clearInterval(showcaseTimer);

  showcaseTimer = setInterval(() => {
    if (!showcaseMode) return;

    currentSet = (currentSet + 1) % 10;

    renderShowcaseSet(currentSet);
  }, SHOWCASE_INTERVAL);
}

/* =========================================================
   SHOW ALL 100
   ========================================================= */

function renderAllDesigns() {
  showcaseMode = false;

  clearInterval(showcaseTimer);

  grid.classList.add("design-grid-fading");

  setTimeout(() => {
    grid.innerHTML = "";

    DESIGN_IMAGES.forEach((file, index) => {
      grid.appendChild(createDesignCard(file, index));
    });

    requestAnimationFrame(() => {
      grid.classList.remove("design-grid-fading");
    });

    viewAll.textContent = "Back to showcase";
  }, 700);
}

/* =========================================================
   BACK TO SHOWCASE
   ========================================================= */

function returnToShowcase() {
  showcaseMode = true;

  currentSet = 0;

  grid.classList.add("design-grid-fading");

  setTimeout(() => {
    renderShowcaseSet(currentSet);

    viewAll.textContent = "View all 100 works";

    startShowcase();
  }, 700);
}

/* =========================================================
   VIEW ALL BUTTON
   ========================================================= */

viewAll.addEventListener("click", () => {
  if (showcaseMode) {
    renderAllDesigns();
  } else {
    returnToShowcase();
  }
});

/* =========================================================
   IMAGE LIGHTBOX
   ========================================================= */

const modal = document.getElementById("image-modal");

const modalImg = document.getElementById("modal-image");

const close = document.getElementById("modal-close");

function openModal(src, alt) {
  modalImg.src = src;

  modalImg.alt = alt;

  modal.classList.add("open");

  modal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("open");

  modal.setAttribute("aria-hidden", "true");

  modalImg.src = "";

  document.body.classList.remove("modal-open");
}

close.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

/* =========================================================
   START GRAPHIC DESIGN SHOWCASE
   ========================================================= */

if (DESIGN_IMAGES.length > 0) {
  empty.style.display = "none";

  renderShowcaseSet(currentSet);

  startShowcase();
}

/* =========================================================
   YOUTUBE AUTOPLAY SYSTEM
   ========================================================= */

const youtubeFrames = Array.from(
  document.querySelectorAll(".video-frame iframe"),
);

const youtubePlayers = new Map();

let youtubeReady = false;

/*
   YouTube calls this automatically
   when the API finishes loading.
*/

window.onYouTubeIframeAPIReady = function () {
  youtubeReady = true;

  createYouTubePlayers();
};

/*
   Create YouTube players.
*/

function createYouTubePlayers() {
  youtubeFrames.forEach((iframe) => {
    const player = new YT.Player(iframe, {
      events: {
        onReady: (event) => {
          event.target.mute();

          youtubePlayers.set(iframe, event.target);
        },

        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            youtubePlayers.forEach((otherPlayer) => {
              if (otherPlayer !== event.target) {
                try {
                  otherPlayer.pauseVideo();
                } catch (error) {}
              }
            });
          }
        },
      },
    });
  });
}

/* =========================================================
   VIDEO INTERSECTION OBSERVER
   ========================================================= */

const videoObserver = new IntersectionObserver(
  (entries) => {
    if (!youtubeReady) return;

    entries.forEach((entry) => {
      const player = youtubePlayers.get(entry.target);

      if (!player) return;

      try {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          player.mute();

          player.playVideo();
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
          player.pauseVideo();
        }
      } catch (error) {}
    });
  },

  {
    threshold: [0, 0.2, 0.55, 0.8],
  },
);

youtubeFrames.forEach((iframe) => {
  videoObserver.observe(iframe);
});
