function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

const container = document.getElementById("content-before-loading");
const sentinel = document.getElementById("sentinel");

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

  container.appendChild(fragment);

  // Animate new rows in on next frame
  requestAnimationFrame(() => {
    container.querySelectorAll('.fade-in').forEach(row => {
      row.classList.add('visible');
      row.classList.remove('fade-in');
    });
  });

  batchCount++;
  isLoading = false;
}

function getInformation() {
  if (isLoading || batchCount >= MAX_BATCHES) return;
  isLoading = true;
  buildBatch();
}

// Watch a sentinel element placed at the bottom of the content.
// rootMargin "800px" means the observer fires when the sentinel
// is still 800px below the visible viewport — well before arrival.
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) getInformation();
  },
  { rootMargin: "0px 0px 800px 0px" }
);

observer.observe(sentinel);

// Initial fill — keep loading until the page is taller than the viewport
// so there's always something to scroll into
function fillUntilScrollable() {
  if (document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
    getInformation();
    requestAnimationFrame(fillUntilScrollable);
  }
}
fillUntilScrollable();
