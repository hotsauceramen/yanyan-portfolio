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
   Number of designs displayed
   during each automatic showcase.
*/

const SET_SIZE = 10;

/*
   Time between showcase rotations.
   6000 = 6 seconds.
*/

const SHOWCASE_INTERVAL = 6000;

/*
   Showcase starts in random mode.
*/

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
   RANDOM IMAGE SELECTION
   ========================================================= */

/*
   Returns exactly 10 unique random images
   from the complete 100-image collection.

   IMPORTANT:

   There is NO memory of previous selections.

   An image can appear again on the next
   rotation.

   The only restriction is that the same
   image cannot appear twice within one set.
*/

function getRandomDesigns() {
  const shuffled = [...DESIGN_IMAGES];

  /*
     Fisher-Yates shuffle
     gives us a genuinely randomized
     ordering of the complete collection.
  */

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  /*
     Take only the first 10
     from the shuffled 100.
  */

  return shuffled.slice(0, SET_SIZE);
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

  /*
     First 20 images load eagerly.
     The rest use lazy loading.
  */

  img.loading = index < 20 ? "eager" : "lazy";

  img.decoding = "async";

  /*
     Detect the original image dimensions.

     Landscape images with an aspect ratio
     of 1.35 or wider receive the
     design-landscape class.

     This allows CSS to make them span
     two columns.
  */

  function detectAspectRatio() {
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      const aspectRatio = img.naturalWidth / img.naturalHeight;

      if (aspectRatio >= 1.35) {
        item.classList.add("design-landscape");
      } else {
        item.classList.remove("design-landscape");
      }
    }
  }

  /*
     Detect once the image finishes loading.
  */

  img.addEventListener("load", detectAspectRatio);

  /*
     Also attempt detection immediately
     in case the image was already cached.
  */

  if (img.complete) {
    detectAspectRatio();
  }

  /*
     Remove broken images.
  */

  img.onerror = () => {
    item.remove();
  };

  item.appendChild(img);

  /*
     Open image lightbox.
  */

  item.addEventListener("click", () => {
    openModal(img.src, img.alt);
  });

  return item;
}

/* =========================================================
   RENDER RANDOM SHOWCASE
   ========================================================= */

function renderRandomShowcase() {
  if (!grid) return;

  /*
     Select a completely new random
     group of 10 from all 100 images.
  */

  const files = getRandomDesigns();

  /*
     Fade current collection out.
  */

  grid.classList.add("design-grid-fading");

  setTimeout(() => {
    /*
       Clear the old images.
    */

    grid.innerHTML = "";

    /*
       Add the new random collection.
    */

    files.forEach((file, index) => {
      grid.appendChild(createDesignCard(file, index));
    });

    /*
       Fade the new collection in.
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

/*
   Start automatic random showcase.
*/

function startShowcase() {
  clearInterval(showcaseTimer);

  showcaseTimer = setInterval(() => {
    if (!showcaseMode) {
      return;
    }

    /*
         Every rotation independently
         chooses 10 random images.

         There is NO previous-set memory.
      */

    renderRandomShowcase();
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

    /*
       Render every image.

       The original aspect ratio is preserved.
    */

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
   BACK TO RANDOM SHOWCASE
   ========================================================= */

function returnToShowcase() {
  showcaseMode = true;

  grid.classList.add("design-grid-fading");

  setTimeout(() => {
    /*
       Immediately choose a completely
       random collection of 10.
    */

    renderRandomShowcase();

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
  if (empty) {
    empty.style.display = "none";
  }

  /*
     First showcase is also random.
  */

  renderRandomShowcase();

  /*
     Start the 6-second random rotation.
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
          /*
                     Keep only one YouTube
                     video actively playing.
                  */

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
    if (!youtubeReady) {
      return;
    }

    entries.forEach((entry) => {
      const player = youtubePlayers.get(entry.target);

      if (!player) {
        return;
      }

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
