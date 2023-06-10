/*
	Garett Brown May 2023
	JS File for Custom-Deck.
*/

const CUSTOM_DECK = "__customdeck__";
const SITE_DEPTH = 1;

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
      if (mode == "light") { scene_img.src = relativePathPrefix + "images/moon.png"; }
      else { scene_img.src = relativePathPrefix + "images/sun.png"; }
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
