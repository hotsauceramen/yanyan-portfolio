/* =========================================================
   YANYAN PORTFOLIO
   GRAPHIC DESIGN + BROADCAST + YOUTUBE SYSTEM
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
   CREATE VIEW ALL BUTTON
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
   RANDOM DESIGN SELECTION
   ========================================================= */

function getRandomShowcase() {
  if (DESIGN_IMAGES.length <= SHOWCASE_SIZE) {
    return [...DESIGN_IMAGES];
  }

  const shuffled = [...DESIGN_IMAGES];

  /*
     Fisher-Yates shuffle.
     Every rotation starts with
     a completely fresh random order.
  */

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled.slice(0, SHOWCASE_SIZE);
}

/* =========================================================
   PRELOAD IMAGE
   ========================================================= */

function preloadImage(file) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => resolve(true);

    img.onerror = () => resolve(false);

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

  /*
     Detect landscape artwork.

     Landscape designs wider than 1.35:1
     span two columns.
  */

  const detectAspectRatio = () => {
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      const ratio = img.naturalWidth / img.naturalHeight;

      if (ratio >= 1.35) {
        item.classList.add("design-landscape");
      } else {
        item.classList.remove("design-landscape");
      }
    }
  };

  img.addEventListener("load", detectAspectRatio);

  img.onerror = () => {
    item.remove();
  };

  item.appendChild(img);

  item.addEventListener("click", () => {
    openModal(img.src, img.alt);
  });

  /*
     Cached image safety check.
  */

  if (img.complete) {
    detectAspectRatio();
  }

  return item;
}

/* =========================================================
   INITIAL SHOWCASE
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
     Pick the next completely
     random group immediately.
  */

  const nextShowcase = getRandomShowcase();

  /*
     PRELOAD EVERYTHING FIRST.

     The current gallery remains visible
     while the next images download.
  */

  await preloadShowcase(nextShowcase);

  /*
     User may have changed modes while
     images were loading.
  */

  if (!showcaseMode) {
    isTransitioning = false;

    return;
  }

  /*
     Fade current gallery out.
  */

  grid.classList.add("design-grid-fading");

  await new Promise((resolve) => {
    setTimeout(resolve, FADE_DURATION);
  });

  /*
     Replace images while invisible.
  */

  grid.innerHTML = "";

  nextShowcase.forEach((file, index) => {
    grid.appendChild(createDesignCard(file, index));
  });

  currentShowcase = nextShowcase;

  /*
     Force a browser layout frame
     before starting fade-in.
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
    if (!showcaseMode) {
      return;
    }

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

  isTransitioning = false;

  grid.classList.add("design-grid-fading");

  await new Promise((resolve) => {
    setTimeout(resolve, FADE_DURATION);
  });

  grid.innerHTML = "";

  DESIGN_IMAGES.forEach((file, index) => {
    grid.appendChild(createDesignCard(file, index));
  });

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

  const nextShowcase = getRandomShowcase();

  /*
     Preload before hiding the
     100-image gallery.
  */

  await preloadShowcase(nextShowcase);

  grid.classList.add("design-grid-fading");

  await new Promise((resolve) => {
    setTimeout(resolve, FADE_DURATION);
  });

  grid.innerHTML = "";

  nextShowcase.forEach((file, index) => {
    grid.appendChild(createDesignCard(file, index));
  });

  currentShowcase = nextShowcase;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      grid.classList.remove("design-grid-fading");
    });
  });

  viewAll.textContent = "View all 100 works";

  startShowcase();
}

/* =========================================================
   VIEW ALL BUTTON
   ========================================================= */

viewAll.addEventListener("click", () => {
  if (isTransitioning) {
    return;
  }

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
  if (!modal || !modalImg) {
    return;
  }

  modalImg.src = src;

  modalImg.alt = alt;

  modal.classList.add("open");

  modal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");
}

function closeModal() {
  if (!modal || !modalImg) {
    return;
  }

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
   START GRAPHIC DESIGN
   ========================================================= */

if (DESIGN_IMAGES.length > 0 && grid) {
  if (empty) {
    empty.style.display = "none";
  }

  renderInitialShowcase();

  startShowcase();
}

/* =========================================================
   BROADCAST VIDEO SYSTEM
   ========================================================= */

const broadcastVideos = Array.from(
  document.querySelectorAll(".broadcast-video"),
);

/*
   Tracks whether each broadcast video
   is currently visible.
*/

const broadcastVisibility = new Map();

/*
   Force mobile-friendly playback
   properties through JavaScript too.
*/

broadcastVideos.forEach((video) => {
  video.muted = true;

  video.defaultMuted = true;

  video.playsInline = true;

  video.setAttribute("muted", "");

  video.setAttribute("playsinline", "");

  video.setAttribute("webkit-playsinline", "");

  broadcastVisibility.set(video, false);
});

/*
   Try to play a broadcast video.

   Browsers may still reject autoplay,
   so the promise rejection is intentionally
   ignored.
*/

function playBroadcastVideo(video) {
  if (!video) return;

  video.muted = true;

  video.defaultMuted = true;

  const playPromise = video.play();

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      /*
           Mobile browsers may block
           autoplay under certain conditions.
        */
    });
  }
}

/*
   Pause when no longer visible.
*/

function pauseBroadcastVideo(video) {
  if (!video) return;

  try {
    video.pause();
  } catch (error) {}
}

/*
   Intersection Observer for broadcast.

   rootMargin starts playback slightly
   before the video reaches the center
   of the screen.
*/

const broadcastObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;

      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;

      broadcastVisibility.set(video, visible);

      if (visible) {
        playBroadcastVideo(video);
      } else {
        pauseBroadcastVideo(video);
      }
    });
  },
  {
    root: null,

    rootMargin: "150px 0px 150px 0px",

    threshold: [0, 0.25, 0.5, 0.75, 1],
  },
);

broadcastVideos.forEach((video) => {
  broadcastObserver.observe(video);

  /*
       If the browser has loaded enough
       metadata already, attempt playback
       immediately if appropriate.
    */

  video.addEventListener("loadedmetadata", () => {
    if (broadcastVisibility.get(video)) {
      playBroadcastVideo(video);
    }
  });
});

/*
   Additional safety check when the page
   becomes visible again.

   This helps Safari/iOS after returning
   from another tab or app.
*/

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    broadcastVideos.forEach(pauseBroadcastVideo);

    return;
  }

  broadcastVideos.forEach((video) => {
    if (broadcastVisibility.get(video)) {
      playBroadcastVideo(video);
    }
  });
});

/* =========================================================
   YOUTUBE AUTOPLAY SYSTEM
   ========================================================= */

const youtubeFrames = Array.from(
  document.querySelectorAll(".video-frame iframe"),
);

const youtubePlayers = new Map();

const youtubeVisibility = new Map();

let youtubeReady = false;

/*
   Initialize visibility state.
*/

youtubeFrames.forEach((iframe) => {
  youtubeVisibility.set(iframe, false);
});

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
    /*
         Avoid creating the same player twice.
      */

    if (youtubePlayers.has(iframe)) {
      return;
    }

    const player = new YT.Player(iframe, {
      events: {
        onReady: (event) => {
          const currentPlayer = event.target;

          /*
                     Always mute first.

                     Muted playback is required
                     for reliable autoplay.
                  */

          currentPlayer.mute();

          youtubePlayers.set(iframe, currentPlayer);

          /*
                     If the iframe is already
                     visible when the player
                     finishes loading, play it.
                  */

          if (youtubeVisibility.get(iframe)) {
            try {
              currentPlayer.playVideo();
            } catch (error) {}
          }
        },

        onStateChange: (event) => {
          /*
                     Only one YouTube video
                     should actively play.
                  */

          if (event.data === YT.PlayerState.PLAYING) {
            youtubePlayers.forEach((otherPlayer, otherIframe) => {
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
   YOUTUBE PLAY
   ========================================================= */

function playYouTubeVideo(iframe) {
  const player = youtubePlayers.get(iframe);

  if (!player) {
    return;
  }

  try {
    player.mute();

    player.playVideo();
  } catch (error) {}
}

/* =========================================================
   YOUTUBE PAUSE
   ========================================================= */

function pauseYouTubeVideo(iframe) {
  const player = youtubePlayers.get(iframe);

  if (!player) {
    return;
  }

  try {
    player.pauseVideo();
  } catch (error) {}
}

/* =========================================================
   YOUTUBE INTERSECTION OBSERVER
   ========================================================= */

const youtubeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const iframe = entry.target;

      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.55;

      youtubeVisibility.set(iframe, visible);

      if (!youtubeReady) {
        return;
      }

      if (visible) {
        playYouTubeVideo(iframe);
      } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
        pauseYouTubeVideo(iframe);
      }
    });
  },
  {
    threshold: [0, 0.2, 0.55, 0.8],
  },
);

youtubeFrames.forEach((iframe) => {
  youtubeObserver.observe(iframe);
});

/* =========================================================
   PAGE VISIBILITY — YOUTUBE
   ========================================================= */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    youtubePlayers.forEach((player) => {
      try {
        player.pauseVideo();
      } catch (error) {}
    });

    return;
  }

  /*
       Resume only the YouTube video
       currently visible.
    */

  youtubeVisibility.forEach((visible, iframe) => {
    if (visible) {
      playYouTubeVideo(iframe);
    }
  });
});
