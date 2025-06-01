function toggleDarkMode() {
      document.body.classList.toggle('dark-mode');
    }

const before_loading = document.getElementById("content-before-loading");

let c = 0;

function getInformation() {
    setTimeout(() => {
        for (let i = 0; i < 10; i++) {
            // Create a container div for each set of HTML items
            const new_div = document.createElement("div");
            new_div.className = "sub-block";
            
            // Randomly vary width between 10px and 100px
            const width1 = Math.floor(Math.random() * 100) + 1; // Random width between 10 and 100
            
            // Randomly assign 'rotate' or 'rotateleft' class
            const rotateClass1 = Math.random() < 0.5 ? 'rotate' : 'rotateleft';  // 50% chance to be 'rotateleft'
            
            // Append your specified HTML content with random width and class
            new_div.innerHTML = `
                <a class="${rotateClass1}" class="imgtxt">
                    <img src="./public/apis.png" alt="bee" style="width:${width1}px">
                </a>
            `;
            
            while (Math.random() < 0.9) {
                let width2 = Math.floor(Math.random() * 100) + 10;
                let rotateClass2 = Math.random() < 0.5 ? 'rotate' : 'rotateleft';
                new_div.innerHTML += `
                <a class="${rotateClass2}" class="imgtxt" href="/jardin">
                    <img src="./public/apis.png" alt="bee" style="width:${width2}px">
                </a>
            `;
            }
            
            // Append the newly created div to the container
            before_loading.appendChild(new_div);
        }
        c++;
    }, 1000);
}

window.addEventListener("scroll", () => {
    if (
        document.documentElement.scrollTop +
        document.documentElement.clientHeight >=
        document.documentElement.scrollHeight
    ) {
        getInformation();
    }
});

// Initial load
getInformation();
