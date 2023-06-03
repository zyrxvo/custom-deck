/*
	Garett Brown 30 May 2023
	JS File for Podcast Features.
*/

// Number of Card Colors defined in CSS file.
const NUMBER_OF_COLORS = 5; 

function setBlogPostStructure(blogPosts, imageFolder) {
    let main_element = document.getElementById("main");
    blogPosts.forEach((blogPost, index) => {
        const thisColor = index % NUMBER_OF_COLORS;
        const classDescription = `card color${thisColor} padded margins`;

        var entry = document.createElement("section");
        entry.setAttribute("id", blogPost.date);
        entry.setAttribute("class", classDescription);

        const imageURL = `${imageFolder}${blogPost.date}.jpeg`;
        const fullImageURL = `${imageFolder}${blogPost.date}_full.jpeg`;

        checkImageExists(imageURL, function(imageExists) {
            if (imageExists) {
                var post = `<div id="${blogPost.date}-text" class="twothirds">${blogPost.entry}</div>`;
                checkImageExists(fullImageURL, function(fullImageExists) {
                    if (fullImageExists) {
                        var image = `<div id="${blogPost.date}-image" class="onethird centred"><a href="${fullImageURL}"><img src=${imageURL} decoding="async" loading="lazy"></a></div>`;
                        // Alternate which side the image is on.
                        if (index%2) { entry.innerHTML = post + image; }
                        else { entry.innerHTML = image + post; }
                    } else {
                      // The full resolution of the image doesn't exist
                        var image = `<div id="${blogPost.date}-image" class="onethird horizontal"><img src=${imageURL} decoding="async" loading="lazy"></div>`;
                        // Alternate which side the image is on.
                        if (index%2) { entry.innerHTML = post + image; }
                        else { entry.innerHTML = image + post; }
                    }
                  });

            } else {
                // No image exists for this blog post.
                entry.innerHTML = `<div id="${blogPost.date}-text">${blogPost.entry}</div>`;
            }
          });
        main_element.appendChild(entry);
    });
}

function checkImageExists(url, callback) {
    fetch(url, { method: 'HEAD' })
        .then(function(response) {
            callback(response.ok);
        })
        .catch(function() {
            console.log('Error');
            callback(false);
        });
}


async function fetchCSVFile(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        const lines = data.split('\n');
        return lines;
    } catch (error) {
        console.error('Error fetching CSV file:', error);
        return null;
    }
}


async function loadPosts() {
    // Check if AJAX request was previously made.
    // Check if the dynamic content exists in sessionStorage
    var storedContent = sessionStorage.getItem("__customdeck__blogPosts");
    if (storedContent != null) {
        const { blogPosts, timestamp } = JSON.parse(storedContent);
        const currentTime = Date.now();

        // Check if the blog post cache is still valid and rebuild the page using the stored data
        if (currentTime - timestamp < EXPIRATION_TIME) { 
            const config = await getConfig();
            setBlogPostStructure(blogPosts, config.blog.images); 
        }
        else { return fetchPosts(); }
      }
      else { return fetchPosts(); }
}

async function fetchPosts() {
    // Get the list of filenames from the directory listing
    const config = await getConfig();
    const filenames = await fetchCSVFile(config.blog.blogPostList);

    // Convert list of filenames into an array of JSON objects
    var blogPosts = [];
    for (const filename of filenames) {
        blogPosts.push({date: filename.split('.')[0], entry: ''});
    }

    // Sort the JSON array by the 'date' parameter in reverse chronological order.
    blogPosts.sort(function(a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return dateA - dateB;
    });
    blogPosts.sort().reverse();

    var files = []
    blogPosts.forEach(blogPost => {
        files.push(`${config.blog.posts}${blogPost.date}.md`);
    });

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
    Promise.all(promises).then(() => {
        const postsWithTimestamp = {
            "blogPosts": blogPosts,
            "timestamp": Date.now()
        };
        sessionStorage.setItem("__customdeck__blogPosts", JSON.stringify(postsWithTimestamp));
        setBlogPostStructure(blogPosts, config.blog.images);
    });
}
