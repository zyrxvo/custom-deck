/*
	Garett Brown 19 January 2019
	JS File for Personal Website.
*/

/*
    Config replacements
*/

// document.addEventListener('DOMContentLoaded', () => {
function loadConfig() {
    getConfig()
        .then(config => {
        const placeholders = document.querySelectorAll('[customdeck-placeholder]');
        placeholders.forEach(placeholder => {
                const placeholderKey = placeholder.getAttribute('customdeck-placeholder');
                const placeholderValue = getValueFromKey(config, placeholderKey);

                if (placeholderValue) {
                    if (placeholder.tagName === 'IMG') {
                        placeholder.src = placeholderValue;
                    } 
                    else if (placeholder.id == "email") {
                        placeholder.innerHTML = `<a href="mailto:${placeholderValue}">${placeholderValue}</a>`;
                    }
                    else {
                        placeholder.innerHTML = placeholderValue; 
                    }
                }
                placeholder.removeAttribute('customdeck-placeholder');
            });
        });
}
// });

// Helper function to retrieve nested values from config.json based on dot notation key
function getValueFromKey(object, key) {
    const keys = key.split('.');
    let value = object;
    for (const k of keys) {
    if (value.hasOwnProperty(k)) {
        value = value[k];
    } else {
        return null;
    }
    }
    return value;
}

// JavaScript code to fetch config.json and store it in sessionStorage
function fetchConfig() {
  let relativePathPrefix = getRelativePathPrefix();
  return fetch(relativePathPrefix + 'config.json')
    .then(response => response.json())
    .then(config => {
      sessionStorage.setItem('__customdeck__config', JSON.stringify(config));
      return config;
    });
}
  
// JavaScript code to retrieve config from sessionStorage or fetch if not available
function getConfig() {
  const config = sessionStorage.getItem('__customdeck__config');
  if (config) {
    return Promise.resolve(JSON.parse(config));
  } else {
    return fetchConfig();
  }
}
  

/*
    NavBar Navigation
*/

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropMenuClick() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user taps outside of it
document.addEventListener("click", function(event) {
    var dropdown = document.getElementById("myDropdown");
    var dropbtn = document.querySelector(".dropbtn");
    if (!dropdown.contains(event.target) && !dropbtn.contains(event.target)) {
      dropdown.classList.remove("show");
    }
  });

/*
    Light/Dark Mode
*/

// Set the scene image for the Light/Dark mode toggle.
function setSceneImg(mode) {
    var scene_img = document.getElementById("scene");
    if (scene_img != null) {
        if (mode == "light") { scene_img.src = "/images/moon.svg"; }
        else { scene_img.src = "/images/sun.svg"; }
    }
}

// Make sure that the correct scene is set given the choice of Light/Dark mode.
function setScene() {
    var mode = "light";

    // https://www.hanselman.com/blog/how-to-detect-if-the-users-os-prefers-dark-mode-and-change-your-site-with-css-and-js
    if (window.matchMedia) {
        var match = window.matchMedia('(prefers-color-scheme: dark)')
        if (match.matches) { mode = "dark"; }

        match.addEventListener('change', e => {
            var systemIsDark = window.matchMedia('(prefers-color-scheme: dark)') // System Setting
            var scene = sessionStorage.getItem("scene"); // User Setting
            if (scene != null){
                if (scene == "dark" && systemIsDark.matches) { mode = "dark"; }
                else if (scene == "light" && systemIsDark.matches) { mode = "dark"; }
                else if (scene == "dark" && !systemIsDark.matches) { mode = "light"; }
                else if (scene == "light" && !systemIsDark.matches) { mode = "light"; }
                else {}
            }
            sessionStorage.setItem("scene",mode);
            setSceneImg(mode);
        })

      }

    let scene = sessionStorage.getItem("scene");
    if (scene != null && mode != scene){
        changeScene();
        mode = scene;
    }
    sessionStorage.setItem("scene",mode);
    setSceneImg(mode);
}

// https://stackoverflow.com/questions/56300132/how-to-override-css-prefers-color-scheme-setting
// toggle to switch classes between .light and .dark
// if no class is present (initial state), then assume current state based on system color scheme
// if system color scheme is not supported, then assume current state is light
function changeScene() {
    var mode = "light";
    let scene = sessionStorage.getItem("scene");
    if (scene != null) {mode = scene;}

    if (document.documentElement.classList.contains("light")) {
      document.documentElement.classList.remove("light")
      document.documentElement.classList.add("dark")
      mode = "dark";
      githubImg = document.getElementById("github");
      githubImgDark = document.getElementById("github-dark");
      if (githubImg != null) { githubImg.src = "/images/github-white.png"; }
      if (githubImgDark != null) {githubImgDark.srcset = "/images/github-white.png";}
    } 
    else if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      mode = "light";
      githubImg = document.getElementById("github");
      githubImgDark = document.getElementById("github-dark");
      if (githubImg != null) { githubImg.src = "/images/github.png"; }
      if (githubImgDark != null) {githubImgDark.srcset = "/images/github.png"; }
    } 
    else {
      if (window?.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("light")
        mode = "light";
        githubImg = document.getElementById("github");
        githubImgDark = document.getElementById("github-dark");
        if (githubImg != null) { githubImg.src = "/images/github.png"; }
        if (githubImgDark != null) {githubImgDark.srcset = "/images/github.png"; }
      } 
      else {
        document.documentElement.classList.add("dark")
        mode = "dark";
        githubImg = document.getElementById("github");
        githubImgDark = document.getElementById("github-dark");
        if (githubImg != null) { githubImg.src = "/images/github-white.png"; }
        if (githubImgDark != null) {githubImgDark.srcset = "/images/github-white.png";}
      }
    }
    setSceneImg(mode);
    sessionStorage.setItem("scene",mode);
}


/*
    Include HTML files with JS
*/

function fetchHTML(file) {
  return fetch(file)
    .then(response => {
      if (!response.ok) {
        throw new Error('Page not found.');
      }
      return response.text();
    });
}
  
function insertHTMLIntoElement(element, html) {
  element.innerHTML = html;
}
  
function includeHTML(page) {
  const elements = document.querySelectorAll('[customdeck-include-html]');
  const promises = [];

  elements.forEach(element => {
    const file = element.getAttribute('customdeck-include-html');
    const isNavFile = file.includes('nav');

    const promise = fetchHTML(file)
      .then(html => {
        insertHTMLIntoElement(element, html);

        if (isNavFile) {
          setActivePage(page);
          updateNavLinks();
          setScene();
        }
      })
      .catch(error => {
        insertHTMLIntoElement(element, 'Page not found.');
        console.error('Error fetching HTML:', error);
      });

    promises.push(promise);
    element.removeAttribute('customdeck-include-html');
  });

  return Promise.all(promises);
}

function getRelativePathPrefix(){
  const INITIALDEPTH = 1;
  var currentPagePath = window.location.pathname;
  console.log(currentPagePath);
  var relativePathPrefix = "";
  
  // Calculate relative path prefix based on the current page's location
  var pathSegments = currentPagePath.split("/");
  for (var i = 1; i < pathSegments.length - 1 - INITIALDEPTH; i++) {
    relativePathPrefix += "../";
  }
  console.log(relativePathPrefix);
  return relativePathPrefix;
}

function updateNavLinks() {
  var navLinks = document.querySelectorAll("#navbar a");
  let relativePathPrefix = getRelativePathPrefix();
  // Update href attributes of navigation links
  for (var i = 0; i < navLinks.length; i++) {
    var href = navLinks[i].getAttribute("href");
    navLinks[i].setAttribute("href", relativePathPrefix + href);
  }
}

// https://www.w3schools.com/howto/howto_js_add_class.asp
function setActivePage(page) {
    if (page != "") {
        var elmnt = document.getElementById(page);
        if (elmnt != null) {
            elmnt.classList.add("active");
        }

        var elmnt = document.getElementById(page + "-drop");
        if (elmnt != null) {
            elmnt.classList.add("active");
        }
    }
}


/*

    Include Markdown files

*/
async function parseMD(filename) {
    // First, fetch the markdown file
    const response = await fetch(filename);
    const markdown = await response.text();
    
    // Convert the Markdown to HTML using regular expressions
    const html = markdown
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/^- (.*)$/gm, "<ul><li>$1</li></ul>")
        .replace(/<\/ul>\n<ul>/g, "") // Remove consecutive ul tags
        .replace(/^(\d+)\. (.*)$/gm, "<ol><li>$2</li></ol>")
        .replace(/<\/ol>\n<ol>/g, "") // Remove consecutive ol tags
        .replace(/^(?![#]+ )(.*)(?<!\n)$/gm, '<p>$1</p>')
        .replace(/^(#+)\s*([\d:]+)?\s*-?\s*(.*)/gm, (match, level, time, title) => {
            const headingLevel = level.length;
            const anchorText = (time ? `${time} - ${title}` : title);
            return `<h${headingLevel} id="#${title.toLowerCase().replace(/\s+/g, "-")}">${anchorText}</h${headingLevel}>`;
          })
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\_\_(.*?)\_\_/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\_(.*?)\_/g, "<em>$1</em>")
        .replace(/¡\[([^\]]+)\]\(([^)]+)\)/g, "<div class='centre-button'><a href='$2'><button class='button'>$1</button></a></div>")
        .replace(/!\[([^\]]+)\]\(([^)]+)\|(\d+)\)/g, "<div><img src='$2' alt='$1' style='width: $3px;' decoding='async' loading='lazy'></div>")
        .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, "<img src='$2' alt='$1' decoding='async' loading='lazy'>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2'>$1</a>");

    return html;
}

async function insertMD(filename, id) {
    // Retrieve the target element by ID
    const targetElement = document.getElementById(id);
  
    try {
      // Call parseMD to convert Markdown to HTML
      const html = await parseMD(filename);

      // Insert the parsed HTML into the target element
      targetElement.innerHTML = html;
    } catch (error) {
      // Handle any errors that occur during parsing or insertion
      console.error('Error inserting Markdown:', error);
    }
  }
  
