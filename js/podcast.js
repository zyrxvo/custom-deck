/*
	Garett Brown 30 May 2023
	JS File for Podcast Features.
*/

const INTIAL_STATS = {time_listened: 0, percent_completed: 0, playhead: 0, acomplete: false, gcomplete: false, scomplete: false, softcomplete: false, duration: 1};
function initialize_stats(name, duration) {
    var obj = INTIAL_STATS;
    obj.duration = duration;
    localStorage.setItem(name, JSON.stringify(obj));
}

// https://stackoverflow.com/a/9565178
function setTime(id) {
    var audio = document.getElementById(id);
    var obj = JSON.parse(localStorage.getItem(id));
    if (obj == null) { initialize_stats(id, audio.duration); }
    if (obj.duration != audio.duration) { obj.duration = audio.duration; }
    if (audio.currentTime != obj.playhead) { audio.currentTime = obj.playhead; }
    obj.playhead = audio.currentTime;
    localStorage.setItem(id, JSON.stringify(obj));
}

function gotoChapter(id, playhead, name) {
    var audio = document.getElementById(id);
    var obj = JSON.parse(localStorage.getItem(id));
    if (obj == null) { initialize_stats(id, audio.duration); }
    if (obj.duration != audio.duration) { obj.duration = audio.duration; }
    audio.currentTime = parseFloat(playhead);
    try {audio.play();} catch (error) {console.error(error);}
    obj.playhead = audio.currentTime;
    obj.percent_played = Math.round(100*audio.currentTime/audio.duration);
    localStorage.setItem(id, JSON.stringify(obj));
    // _paq.push(['trackEvent', 'Audio', 'Chapter', name]);
    // _paq.push(['trackEvent', 'Audio', 'Play Rate', name, obj.percent_played]);
    pressedPlay(id, name);
}

// https://stackoverflow.com/questions/4993097/html5-display-audio-currenttime
// https://stackoverflow.com/questions/23039635/html5-how-to-get-currenttime-and-duration-of-audio-tag-in-milliseconds
function trackTime(id, name) {
    var audio = document.getElementById(id);
    var obj = JSON.parse(localStorage.getItem(id));
    if (obj == null) { initialize_stats(id, audio.duration); }
    if (obj.duration != audio.duration) { obj.duration = audio.duration; }
    var playhead = audio.currentTime;
    if (Math.abs(playhead - obj.playhead) < 1) {
        obj.time_listened = parseFloat(obj.time_listened) + parseFloat(playhead - obj.playhead);
    }
    obj.playhead = playhead
    obj.percent_completed = (100*obj.time_listened/obj.duration).toFixed(2);

    if (Math.round(obj.time_listened) >= 5 && obj.gcomplete == false) {
        obj.gcomplete = true;
        // _paq.push(['trackEvent', 'Audio', 'Google Finish', name]);
    }

    if (Math.round(obj.time_listened) >= 60 && obj.scomplete == false) {
        obj.scomplete = true;
        // _paq.push(['trackEvent', 'Audio', 'Spotify Finish', name]);
    }

    if ((Math.round(obj.time_listened) >= 1200 || Math.round(100*obj.time_listened/obj.duration) >= 40) && obj.acomplete == false){
        obj.acomplete = true;
        // _paq.push(['trackEvent', 'Audio', 'Apple Finish', name]);
    }

    if (obj.percent_completed >= 95 && obj.softcomplete == false) {
        obj.softcomplete = true;
        // _paq.push(['trackEvent', 'Audio', 'SoftFinish', name]);
        // _paq.push(['trackGoal', 2]);
    }

    localStorage.setItem(id, JSON.stringify(obj));
}

function completed(id, name) {
    var audio = document.getElementById(id);
    var obj = JSON.parse(localStorage.getItem(id));
    if (obj == null) { initialize_stats(id, audio.duration); }
    if (obj.duration != audio.duration) { obj.duration = audio.duration; }
    obj.playhead = 0;
    // _paq.push(['trackEvent', 'Audio', 'Finish', name, obj.percent_completed]);
    // _paq.push(['trackGoal', 1]);
    localStorage.setItem(id, JSON.stringify(obj));
}

function pressedPlay(id, name) {
    var audio = document.getElementById(id);
    var obj = JSON.parse(localStorage.getItem(id));
    if (obj == null) { initialize_stats(id, audio.duration); }
    if (obj.duration != audio.duration) { obj.duration = audio.duration; }
    audio.currentTime = obj.playhead;
    if (obj.playhead < 1) {
        // _paq.push(['trackEvent', 'Audio', 'Play', name]);
    }
    else {
        var percent_played = Math.round(100*audio.currentTime/obj.duration);
        // _paq.push(['trackEvent', 'Audio', 'Resume', name, percent_played]);
    }
    localStorage.setItem(id, JSON.stringify(obj));
}

