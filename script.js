function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

const container = document.getElementById("content-before-loading");
const sentinel = document.getElementById("sentinel");

// Guard: sentinel must be inside container for insertBefore to work
if (!sentinel || !container.contains(sentinel)) {
  console.error("Fix your HTML: #sentinel must be a child of #content-before-loading");
}

let isLoading = false;
let batchCount = 0;
const MAX_BATCHES = 30;

function buildBatch() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 10; i++) {
    const row = document.createElement("div");
    row.className = "sub-block fade-in";
    const width1 = Math.floor(Math.random() * 90) + 10;
    const rotateClass1 = Math.random() < 0.5 ? 'rotate' : 'rotateleft';
    row.innerHTML = `
      <a class="${rotateClass1} imgtxt" href="/jardin">
        <img src="./public/apis.png" alt="bee" style="width:${width1}px">
      </a>
    `;
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

  container.insertBefore(fragment, sentinel);

  requestAnimationFrame(() => {
    container.querySelectorAll('.fade-in').forEach(row => {
      row.classList.add('visible');
      row.classList.remove('fade-in');
    });
    batchCount++;
    isLoading = false;
  });
}

function getInformation() {
  if (isLoading || batchCount >= MAX_BATCHES) return;
  isLoading = true;
  // Small delay so isLoading state settles before fillUntilScrollable re-checks
  setTimeout(buildBatch, 60);
}

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) getInformation();
  },
  { rootMargin: "0px 0px 800px 0px" }
);
observer.observe(sentinel);

// Fill until page is scrollable, waiting for each batch to finish before checking again
function fillUntilScrollable() {
  if (batchCount >= MAX_BATCHES) return;
  if (document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
    if (!isLoading) getInformation();
    // Wait longer than the setTimeout in getInformation before re-checking
    setTimeout(fillUntilScrollable, 200);
  }
}
fillUntilScrollable();