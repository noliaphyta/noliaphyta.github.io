function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Restore dark mode preference on load
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

const container = document.getElementById("content-before-loading");
const loadingIndicator = document.getElementById("loading-indicator");

let isLoading = false;
let batchCount = 0;
const MAX_BATCHES = 30; // prevent infinite memory growth

function showLoader() {
  loadingIndicator.style.opacity = '1';
}

function hideLoader() {
  loadingIndicator.style.opacity = '0';
}

function getInformation() {
  if (isLoading || batchCount >= MAX_BATCHES) return;
  isLoading = true;
  showLoader();

  setTimeout(() => {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 10; i++) {
      const row = document.createElement("div");
      row.className = "sub-block fade-in";

      // First bee in the row
      const width1 = Math.floor(Math.random() * 90) + 10;
      const rotateClass1 = Math.random() < 0.5 ? 'rotate' : 'rotateleft';
      row.innerHTML = `
        <a class="${rotateClass1} imgtxt" href="/jardin">
          <img src="./public/apis.png" alt="bee" style="width:${width1}px">
        </a>
      `;

      // Additional bees — cap at 12 to avoid runaway loops
      let extras = 0;
      while (Math.random() < 0.85 && extras < 12) {
        const width2 = Math.floor(Math.random() * 90) + 10;
        const rotateClass2 = Math.random() < 0.5 ? 'rotate' : 'rotateleft';
        row.innerHTML += `
          <a class="${rotateClass2} imgtxt" href="/jardin">
            <img src="./public/apis.png" alt="bee" style="width:${width2}px">
          </a>
        `;
        extras++;
      }

      fragment.appendChild(row);
    }

    container.appendChild(fragment);

    // Trigger fade-in on newly added rows
    requestAnimationFrame(() => {
      const newRows = container.querySelectorAll('.fade-in');
      newRows.forEach(row => {
        row.classList.add('visible');
        row.classList.remove('fade-in'); // clean up so selector stays fast
      });
    });

    batchCount++;
    isLoading = false;
    hideLoader();

    // After appending, check immediately if we're still close to the bottom
    // (handles slow connections where one batch wasn't enough to push content down)
    if (isNearBottom()) getInformation();
  }, 600);
}

function isNearBottom() {
  return (
    document.documentElement.scrollTop + document.documentElement.clientHeight >=
    document.documentElement.scrollHeight - 600 // load when 600px from bottom
  );
}

// Throttle scroll so we don't fire on every pixel
let scrollTimeout = null;
window.addEventListener("scroll", () => {
  if (scrollTimeout) return;
  scrollTimeout = setTimeout(() => {
    scrollTimeout = null;
    if (isNearBottom()) getInformation();
  }, 150);
});

// Initial load
getInformation();
