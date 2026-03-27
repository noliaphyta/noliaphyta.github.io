// DARK MODE TOGGLE
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// ELEMENTS
const container = document.getElementById("content-before-loading");
const sentinel = document.getElementById("sentinel");

// CHECK HTML STRUCTURE
if (!sentinel || !container.contains(sentinel)) {
  console.error("Fix your HTML: #sentinel must be a child of #content-before-loading");
}

// SCROLL CONTROL
let isLoading = false;
let batchCount = 0;
const MAX_BATCHES = 9999;
const BATCH_SIZE = 10;           // rows per batch
const PRELOAD_THRESHOLD = 1500;  // px from bottom to preload

// FADE-IN OBSERVER
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// BUILD IMAGE BATCH
function buildBatch() {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < BATCH_SIZE; i++) {
    const row = document.createElement("div");
    row.className = "sub-block";

    // MAIN IMAGE
    const mainLink = document.createElement("a");
    mainLink.href = "/public/jardin.png";
    mainLink.className = Math.random() < 0.5 ? 'rotate imgtxt' : 'rotateleft imgtxt';
    const mainImg = document.createElement("img");
    mainImg.src = "/public/apis.png";
    mainImg.alt = "bee";
    mainImg.style.width = Math.floor(Math.random() * 90 + 10) + "px";
    mainImg.className = "fade-img";
    fadeObserver.observe(mainImg);
    mainLink.appendChild(mainImg);
    row.appendChild(mainLink);

    // EXTRA IMAGES
    let extras = 0;
    while (Math.random() < 0.85 && extras < 12) {
      const extraLink = document.createElement("a");
      extraLink.href = "/public/jardin.png";
      extraLink.className = Math.random() < 0.5 ? 'rotate imgtxt' : 'rotateleft imgtxt';
      const extraImg = document.createElement("img");
      extraImg.src = "/public/apis.png";
      extraImg.alt = "bee";
      extraImg.style.width = Math.floor(Math.random() * 90 + 10) + "px";
      extraImg.className = "fade-img";
      fadeObserver.observe(extraImg);
      extraLink.appendChild(extraImg);
      row.appendChild(extraLink);
      extras++;
    }

    fragment.appendChild(row);
  }

  container.insertBefore(fragment, sentinel);
  batchCount++;
  isLoading = false;
}

// CHECK IF NEXT BATCH SHOULD LOAD
function checkLoad() {
  if (isLoading || batchCount >= MAX_BATCHES) return;

  const sentinelRect = sentinel.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  if (sentinelRect.top - viewportHeight < PRELOAD_THRESHOLD) {
    isLoading = true;
    setTimeout(buildBatch, 50); // slight delay to prevent blocking
  }
}

// INITIAL FILL UNTIL SCROLLABLE
function fillUntilScrollable() {
  if (document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
    checkLoad();
    setTimeout(fillUntilScrollable, 100);
  }
}

// SCROLL & RESIZE LISTENERS
window.addEventListener('scroll', checkLoad);
window.addEventListener('resize', checkLoad);

// START INITIAL PRELOAD
fillUntilScrollable();