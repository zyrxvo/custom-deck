/*
	Garett Brown 30 May 2023
	JS File for Podcast Features.
*/


function setBlogPostStructure(blogPosts) {
    let main_element = document.getElementById("main");
    for (i=0; i < blogPosts.length; i++) {
        var entry = document.createElement("section");
        entry.setAttribute("id", blogPosts[i].date);
        var twothirds = `<div id="${blogPosts[i].date}-text" class="twothirds">${blogPosts[i].entry}</div>`;

        const image = `${blogPosts[i].date}.jpeg`;
        const fullImage = `${blogPosts[i].date}_full.jpeg`;
        var onethird = `<div id="${blogPosts[i].date}-image" class="onethird centred"><a href="images/${fullImage}"><img src=images/${image} decoding="async" loading="lazy"></a></div>`;

        const numberOfColors = 5; // Number of Card Colors defined in CSS file.
        const thisColor = Math.abs(parseInt(i%(2*numberOfColors) - (numberOfColors-1)));
        console.log(thisColor);
        const classDescription = `card color${thisColor} padded margins`;
        // Alternate which side the image is on.
        if (i%2) {
            entry.setAttribute("class", classDescription);
            entry.innerHTML = twothirds + onethird;
        }
        else {
            entry.setAttribute("class", classDescription);
            entry.innerHTML = onethird + twothirds;
        }
        main_element.appendChild(entry);
    }
}

function loadPosts() {
    // Check if AJAX request was previously made.
    // Check if the dynamic content exists in localStorage
    var storedContent = localStorage.getItem("__customdeck__blogPosts");
    // console.log("storedContent (blogPosts): " + String(storedContent));

    if (storedContent != null) {
        // Rebuild the page using the stored data
        loadAllPosts();
    } else {
        // Make an AJAX request to the server to get the directory listing
        const xhr = new XMLHttpRequest();
        const folder = "/blog/posts/"
        xhr.open('GET', folder, true);

        xhr.onload = function() {
            // Parse the response as HTML using a DOMParser
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(xhr.responseText, 'text/html');

            // Get the list of filenames from the directory listing
            const filenames = htmlDoc.querySelectorAll('ul li a');

            // Filter the filenames to include only those with the .md extension
            var blogPosts = [];
            for (const filename of filenames) {
                if (filename.href.endsWith('.md')) {
                    blogPosts.push({date: (filename.innerText).split(".")[0], entry: ''});
                }
            }

            // Sort the JSON array by the 'date' parameter in reverse chronological order.
            blogPosts.sort(function(a, b) {
                var dateA = new Date(a.date);
                var dateB = new Date(b.date);
                return dateA - dateB;
            });
            blogPosts.sort().reverse();

            localStorage.setItem("__customdeck__blogPosts", JSON.stringify(blogPosts));
            loadAllPosts();
        };

        xhr.send();
    }
}

function loadAllPosts() {
    var blogPosts = JSON.parse(localStorage.getItem("__customdeck__blogPosts"));
    var files = []
    for (i=0; i < blogPosts.length; i++) {
        files.push(`/blog/posts/${blogPosts[i].date}.md`);
    }

    // Create an array of promises for each file
    const promises = files.map((filename, index) => {
    return parseMD(filename)
        .then(html => {
            blogPosts[index].entry = html; // Store the HTML in the object
        })
        .catch(error => {
            blogPosts[index].entry = null; // Store null if there was an error
            console.error(`Error parsing ${filename}:`, error);
        });
    });

    // Wait for all promises to resolve
    Promise.all(promises)
    .then(() => {
        // Access the universal JSON object containing all the HTML data
        localStorage.setItem("__customdeck__blogPosts", JSON.stringify(blogPosts));
        setBlogPostStructure(blogPosts);
    });

}

