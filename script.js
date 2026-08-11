/* =========================================================
   YANYAN PORTFOLIO — GRAPHIC DESIGN GALLERY
   =========================================================
   Put images in:
   assets/images/graphic-design/

   Then add their filenames below.
   ========================================================= */

const DESIGN_IMAGES = Array.from(
  { length: 100 },
  (_, i) => `design-${String(i + 1).padStart(3, "0")} Large.jpeg`,
);

const INITIAL_COUNT = 25;
const LOAD_COUNT = 25;

const grid = document.getElementById("design-grid");
const more = document.getElementById("load-more");
const empty = document.getElementById("design-empty");
let visible = INITIAL_COUNT;

function renderDesigns() {
  grid.innerHTML = "";

  if (!DESIGN_IMAGES.length) {
    empty.style.display = "block";
    more.style.display = "none";
    return;
  }

  empty.style.display = "none";

  DESIGN_IMAGES.slice(0, visible).forEach((file, i) => {
    const item = document.createElement("button");
    item.className = "design-item";
    item.type = "button";
    item.setAttribute("aria-label", `Open graphic design ${i + 1}`);

    const img = document.createElement("img");
    img.src = `assets/images/graphic-design/${file}`;
    img.alt = `Graphic design work ${i + 1}`;
    img.loading = i < 10 ? "eager" : "lazy";
    img.decoding = "async";

    img.onerror = () => item.remove();

    item.appendChild(img);
    item.addEventListener("click", () => openModal(img.src, img.alt));
    grid.appendChild(item);
  });

  if (visible >= DESIGN_IMAGES.length) {
    more.style.display = "none";
  } else {
    more.style.display = "block";
    more.textContent = `Show more · ${DESIGN_IMAGES.length - visible} remaining`;
  }
}

more.addEventListener("click", () => {
  visible += LOAD_COUNT;
  renderDesigns();
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
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

renderDesigns();

/* =========================================================
   YOUTUBE AUTOPLAY / LOOP
   =========================================================
   - Videos are muted so browsers permit autoplay.
   - A video starts when ~55% visible.
   - It pauses when it leaves the viewport.
   - Only one video plays at a time.
   - The iframe URL includes loop=1 + playlist=<same ID>.
   ========================================================= */

const youtubeFrames = Array.from(
  document.querySelectorAll(".video-frame iframe"),
);

const youtubePlayers = new Map();
let youtubeReady = false;

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
                } catch (_) {}
              }
            });
          }
        },
      },
    });
  });
}

window.onYouTubeIframeAPIReady = () => {
  youtubeReady = true;
  createYouTubePlayers();
};

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
      } catch (_) {}
    });
  },
  {
    threshold: [0, 0.2, 0.55, 0.8],
  },
);

youtubeFrames.forEach((iframe) => videoObserver.observe(iframe));
