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

/* =========================================================
   SHOWCASE SETTINGS
   ========================================================= */

const SHOWCASE_SIZE = 10;

const SHOWCASE_INTERVAL = 6000;

const FADE_DURATION = 700;

/* =========================================================
   SHOWCASE STATE
   ========================================================= */

let currentShowcase = [];

let showcaseMode = true;

let showcaseTimer = null;

let isTransitioning = false;

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
   RANDOM IMAGE SELECTION
   ========================================================= */

/*
   Selects completely random images from all 100.

   We make sure the exact same image set isn't immediately
   repeated on the next transition.
*/

function getRandomShowcase() {
  if (DESIGN_IMAGES.length <= SHOWCASE_SIZE) {
    return [...DESIGN_IMAGES];
  }

  let selected;

  do {
    const shuffled = [...DESIGN_IMAGES];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[i],
      ];
    }

    selected = shuffled.slice(0, SHOWCASE_SIZE);
  } while (
    currentShowcase.length > 0 &&
    selected.every((file) => currentShowcase.includes(file))
  );

  return selected;
}

/* =========================================================
   PRELOAD IMAGE
   ========================================================= */

function preloadImage(file) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };

    img.src = `assets/images/graphic-design/${file}`;
  });
}

/* =========================================================
   PRELOAD SHOWCASE
   ========================================================= */

async function preloadShowcase(files) {
  await Promise.all(files.map((file) => preloadImage(file)));
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

  img.loading = "eager";

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
   RENDER INITIAL SHOWCASE
   ========================================================= */

function renderInitialShowcase() {
  if (!grid) return;

  const files = getRandomShowcase();

  currentShowcase = files;

  grid.innerHTML = "";

  files.forEach((file, index) => {
    grid.appendChild(createDesignCard(file, index));
  });

  grid.classList.remove("design-grid-fading");
}

/* =========================================================
   SMOOTH SHOWCASE TRANSITION
   ========================================================= */

async function transitionToRandomShowcase() {
  if (!grid) return;

  if (!showcaseMode) return;

  if (isTransitioning) return;

  isTransitioning = true;

  /*
     Choose the next random group BEFORE
     changing anything on screen.
  */

  const nextShowcase = getRandomShowcase();

  /*
     Preload every image first.

     The current images remain visible while
     the next group loads.
  */

  await preloadShowcase(nextShowcase);

  /*
     Make sure the user didn't leave showcase mode
     while the images were loading.
  */

  if (!showcaseMode) {
    isTransitioning = false;

    return;
  }

  /*
     Fade current images out.
  */

  grid.classList.add("design-grid-fading");

  /*
     Wait for the CSS fade-out.
  */

  await new Promise((resolve) => {
    setTimeout(resolve, FADE_DURATION);
  });

  /*
     Replace the images while they're invisible.
  */

  grid.innerHTML = "";

  nextShowcase.forEach((file, index) => {
    grid.appendChild(createDesignCard(file, index));
  });

  currentShowcase = nextShowcase;

  /*
     Force the browser to acknowledge
     the new invisible state before fading in.
  */

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      grid.classList.remove("design-grid-fading");

      isTransitioning = false;
    });
  });
}

/* =========================================================
   START SHOWCASE
   ========================================================= */

function startShowcase() {
  clearInterval(showcaseTimer);

  showcaseTimer = setInterval(() => {
    if (!showcaseMode) return;

    transitionToRandomShowcase();
  }, SHOWCASE_INTERVAL);
}

/* =========================================================
   STOP SHOWCASE
   ========================================================= */

function stopShowcase() {
  clearInterval(showcaseTimer);

  showcaseTimer = null;
}

/* =========================================================
   SHOW ALL 100
   ========================================================= */

async function renderAllDesigns() {
  if (!grid) return;

  showcaseMode = false;

  stopShowcase();

  /*
     Don't start another random transition.
  */

  isTransitioning = false;

  /*
     Fade the current showcase out.
  */

  grid.classList.add("design-grid-fading");

  await new Promise((resolve) => {
    setTimeout(resolve, FADE_DURATION);
  });

  /*
     Show all 100.
  */

  grid.innerHTML = "";

  DESIGN_IMAGES.forEach((file, index) => {
    grid.appendChild(createDesignCard(file, index));
  });

  /*
     Fade everything back in.
  */

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      grid.classList.remove("design-grid-fading");
    });
  });

  viewAll.textContent = "Back to showcase";
}

/* =========================================================
   RETURN TO SHOWCASE
   ========================================================= */

async function returnToShowcase() {
  if (!grid) return;

  showcaseMode = true;

  stopShowcase();

  /*
     Pick a completely new random set.
  */

  const nextShowcase = getRandomShowcase();

  /*
     Preload it before touching the screen.
  */

  await preloadShowcase(nextShowcase);

  /*
     Fade the 100-image gallery out.
  */

  grid.classList.add("design-grid-fading");

  await new Promise((resolve) => {
    setTimeout(resolve, FADE_DURATION);
  });

  /*
     Replace gallery with random showcase.
  */

  grid.innerHTML = "";

  nextShowcase.forEach((file, index) => {
    grid.appendChild(createDesignCard(file, index));
  });

  currentShowcase = nextShowcase;

  /*
     Fade new showcase in.
  */

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      grid.classList.remove("design-grid-fading");
    });
  });

  viewAll.textContent = "View all 100 works";

  /*
     Restart automatic rotation.
  */

  startShowcase();
}

/* =========================================================
   VIEW ALL BUTTON
   ========================================================= */

viewAll.addEventListener("click", () => {
  if (isTransitioning) return;

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
  if (!modal || !modalImg) return;

  modalImg.src = src;

  modalImg.alt = alt;

  modal.classList.add("open");

  modal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");
}

function closeModal() {
  if (!modal || !modalImg) return;

  modal.classList.remove("open");

  modal.setAttribute("aria-hidden", "true");

  modalImg.src = "";

  document.body.classList.remove("modal-open");
}

if (close) {
  close.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

/* =========================================================
   START GRAPHIC DESIGN SHOWCASE
   ========================================================= */

if (DESIGN_IMAGES.length > 0 && grid) {
  if (empty) {
    empty.style.display = "none";
  }

  /*
     Render the first random set immediately.
  */

  renderInitialShowcase();

  /*
     Start automatic random rotation.
  */

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

/* =========================================================
   CREATE YOUTUBE PLAYERS
   ========================================================= */

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
