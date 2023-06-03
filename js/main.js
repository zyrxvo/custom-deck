/*
	Garett Brown 19 January 2019
	JS File for Personal Website.
*/

/*
    Config replacements
*/

const CUSTOM_DECK = "__customdeck__";
const SITE_DEPTH = 1;

const PLACEHOLDER_ID_KEY = 'customdeck-placeholder';
const CONFIG_KEY = CUSTOM_DECK + 'config';
const EXPIRATION_TIME = 10 * 1000; // 1 hour in milliseconds
function loadConfig() {
  getConfig()
  .then(config => {
    const placeholders = document.querySelectorAll(`[${PLACEHOLDER_ID_KEY}]`);
    placeholders.forEach(placeholder => {
      const placeholderKey = placeholder.getAttribute(PLACEHOLDER_ID_KEY);
      const placeholderValue = getValueFromKey(config, placeholderKey);

      if (placeholderValue) {
        if (placeholder.tagName === 'IMG') {
          placeholder.src = placeholderValue;
        }
        else if (placeholder.tagName === 'A') {
          placeholder.href = placeholderValue;
        } 
        else if (placeholder.id == "email") {
          placeholder.innerHTML = `<a href="mailto:${placeholderValue}">${placeholderValue}</a>`;
        }
        else {
          placeholder.innerHTML = placeholderValue; 
        }
      }
      placeholder.removeAttribute(PLACEHOLDER_ID_KEY);
    });
  });
}

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
      const configWithTimestamp = {
        "config": config,
        "timestamp": Date.now()
      };
      sessionStorage.setItem(CONFIG_KEY, JSON.stringify(configWithTimestamp));
      return Promise.resolve(config);
    });
}
  
// JavaScript code to retrieve config from sessionStorage or fetch if not available
function getConfig() {
  const savedConfig = sessionStorage.getItem(CONFIG_KEY);
  if (savedConfig) { 
    const { config, timestamp } = JSON.parse(savedConfig);
    const currentTime = Date.now();

    // Check if the config is still valid.
    if (currentTime - timestamp < EXPIRATION_TIME) { return Promise.resolve(config); }
    else { return fetchConfig(); }
  }
  else { return fetchConfig(); }
}

/*
    NavBar Navigation
*/

/* When the user clicks on the button, toggle between hiding and showing the dropdown content */
function dropMenuClick() { document.getElementById("myDropdown").classList.toggle("show"); }
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

const SCENE_KEY =  CUSTOM_DECK + 'scene'
// Set the scene image for the Light/Dark mode toggle.
function setSceneImg(mode) {
  let relativePathPrefix = getRelativePathPrefix();
  var scene_img = document.getElementById("scene");
  if (scene_img != null) {
      if (mode == "light") { scene_img.src = relativePathPrefix + "images/moon.svg"; }
      else { scene_img.src = relativePathPrefix + "images/sun.svg"; }
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
            var scene = localStorage.getItem(SCENE_KEY); // User Setting
            if (scene != null){
                if (scene == "dark" && systemIsDark.matches) { mode = "dark"; }
                else if (scene == "light" && systemIsDark.matches) { mode = "dark"; }
                else if (scene == "dark" && !systemIsDark.matches) { mode = "light"; }
                else if (scene == "light" && !systemIsDark.matches) { mode = "light"; }
                else {}
            }
            localStorage.setItem(SCENE_KEY,mode);
            setSceneImg(mode);
        })

      }

    let scene = localStorage.getItem(SCENE_KEY);
    if (scene != null && mode != scene){
        changeScene();
        mode = scene;
    }
    localStorage.setItem(SCENE_KEY,mode);
    setSceneImg(mode);
}

// https://stackoverflow.com/questions/56300132/how-to-override-css-prefers-color-scheme-setting
// toggle to switch classes between .light and .dark
// if no class is present (initial state), then assume current state based on system color scheme
// if system color scheme is not supported, then assume current state is light
function changeScene() {
  let relativePathPrefix = getRelativePathPrefix();
  var mode = "light";
  let scene = localStorage.getItem(SCENE_KEY);
  if (scene != null) {mode = scene;}

  if (document.documentElement.classList.contains("light")) {
    document.documentElement.classList.remove("light")
    document.documentElement.classList.add("dark")
    mode = "dark";
    githubImg = document.getElementById("github");
    githubImgDark = document.getElementById("github-dark");
    if (githubImg != null) { githubImg.src = relativePathPrefix + "images/github-white.png"; }
    if (githubImgDark != null) {githubImgDark.srcset = relativePathPrefix + "images/github-white.png";}
  } 
  else if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark")
    document.documentElement.classList.add("light")
    mode = "light";
    githubImg = document.getElementById("github");
    githubImgDark = document.getElementById("github-dark");
    if (githubImg != null) { githubImg.src = relativePathPrefix + "images/github.png"; }
    if (githubImgDark != null) {githubImgDark.srcset = relativePathPrefix + "images/github.png"; }
  } 
  else {
    if (window?.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add("light")
      mode = "light";
      githubImg = document.getElementById("github");
      githubImgDark = document.getElementById("github-dark");
      if (githubImg != null) { githubImg.src = relativePathPrefix + "images/github.png"; }
      if (githubImgDark != null) {githubImgDark.srcset = relativePathPrefix + "images/github.png"; }
    } 
    else {
      document.documentElement.classList.add("dark")
      mode = "dark";
      githubImg = document.getElementById("github");
      githubImgDark = document.getElementById("github-dark");
      if (githubImg != null) { githubImg.src = relativePathPrefix + "images/github-white.png"; }
      if (githubImgDark != null) {githubImgDark.srcset = relativePathPrefix + "images/github-white.png";}
    }
  }
  setSceneImg(mode);
  localStorage.setItem(SCENE_KEY,mode);
}


/*
    Include HTML files with JS
*/

function fetchHTML(file) {
  return fetch(file)
    .then(response => {
      if (!response.ok) { throw new Error('Page not found.'); }
      return response.text();
    });
}
  
function includeHTML(page) {
  const elements = document.querySelectorAll('[customdeck-include-html]');
  const promises = [];

  elements.forEach(element => {
    const file = element.getAttribute('customdeck-include-html');
    const isNavFile = file.includes('nav');
    const promise = fetchHTML(file)
      .then(html => {
        element.innerHTML = html;
        if (isNavFile) {
          setActivePage(page);
        }
      })
      .catch(error => {
        element.innerHTML = 'Page not found.';
        console.error('Error fetching HTML:', error);
      });

    promises.push(promise);
    element.removeAttribute('customdeck-include-html');
  });

  return Promise.all(promises);
}

function getRelativePathPrefix(){
  var currentPagePath = window.location.pathname;
  var relativePathPrefix = "";
  
  // Calculate relative path prefix based on the current page's location
  var pathSegments = currentPagePath.split("/");
  for (var i = 1; i < pathSegments.length - 1 - SITE_DEPTH; i++) {
    relativePathPrefix += "../";
  }
  return relativePathPrefix;
}

function updateNavLinks() {
  let relativePathPrefix = getRelativePathPrefix();
  // Update href attributes of navigation links
  var elements = document.querySelectorAll('[customdeck-update-relpath]');
  elements.forEach(element => {
    if (element.tagName === 'A') {
      var href = element.getAttribute("href");
      element.setAttribute("href", relativePathPrefix + href);
    }
    else if (element.tagName === 'IMG') {
      var href = element.getAttribute("src");
      element.setAttribute("src", relativePathPrefix + href);
    }
    else if (element.tagName === 'SOURCE') {
      var href = element.getAttribute("srcset");
      element.setAttribute("srcset", relativePathPrefix + href);
    }
  });
}

// https://www.w3schools.com/howto/howto_js_add_class.asp
function setActivePage(page) {
    if (page != "") {
        var elmnt = document.getElementById(page);
        if (elmnt != null) { elmnt.classList.add("active"); }
        var elmnt = document.getElementById(page + "-drop");
        if (elmnt != null) { elmnt.classList.add("active"); }
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
        .replace(/^(>[\s*]?)(.*)/gm, "<blockquote>\n$2</blockquote>")
        .replace(/<\/blockquote>\n<blockquote>/g, "") // Remove consecutive blockquote tags
        .replace(/^(<blockquote>)?- (.*)$/gm, "<ul><li>$2</li></ul>")
        .replace(/<\/ul>\n<ul>/g, "") // Remove consecutive ul tags
        .replace(/^(\d+)\. (.*)$/gm, "<ol><li>$2</li></ol>")
        .replace(/<\/ol>\n<ol>/g, "") // Remove consecutive ol tags
        .replace(/^(?![#]+ )(.*)(?<!\n)$/gm, '<p>$1</p>')
        .replace(/^(#+)\s*([\d:]+)?\s*-?\s*(.*)/gm, (match, level, time, title) => {
            const headingLevel = level.length;
            const anchorText = (time ? `${time} - ${title}` : title);
            return `<h${headingLevel} id="${title.toLowerCase().replace(/\s+/g, "-")}">${anchorText}</h${headingLevel}>`;
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
