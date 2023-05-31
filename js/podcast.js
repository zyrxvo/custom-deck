/*
	Garett Brown 30 May 2023
	JS File for Podcast Features.
*/


/*
    RSS Feed Parsing
*/

const CUSTOMDECK = "__customdeck__";

const INTIAL_STATS = {time_listened: 0, percent_completed: 0, playhead: 0, acomplete: false, gcomplete: false, scomplete: false, softcomplete: false, duration: 1};
function initialize_stats(name, duration) {
    var obj = INTIAL_STATS;
    obj.duration = duration;
    localStorage.setItem(name, JSON.stringify(obj));
}

async function parseRSS(feed) {
    try {
        const RSS_URL = String(feed);
        const response = await fetch(RSS_URL);
        const xmlStr = await response.text();
        const parser = new DOMParser();
        const data = parser.parseFromString(xmlStr, "text/xml");
        
        const channel = data.querySelector("channel");
        const podcastTitle = channel.querySelector("title").innerHTML;
        const podcast = normalizeString(podcastTitle);
        const items = data.querySelectorAll("item");
        
        const mainElement = document.getElementById("main");
        let html = `<h2 class="centred-text">All Episodes</h2><hr style="width:75%">`;
        
        items.forEach((item, index) => {
            const title = item.querySelector("title").innerHTML;
            const pubDate = item.querySelector("pubDate").innerHTML.substring(5, 16);
            const subtitle = item.querySelector("subtitle").innerHTML;
            const duration = item.querySelector("duration").innerHTML;
            const episode = item.querySelector("episode").innerHTML;
            let enclosureURL = "";
            const enclosure = item.querySelector("enclosure");
            if (enclosure) {
                enclosureURL = enclosure.getAttribute("url");
            }
            const mp3 = `${episode}/${podcast}${episode}.mp3`;
            
            // Check if visitor has stored playback values and generate defaults if null.
            const id = `${CUSTOMDECK}${podcast}${episode}`;
            const storedPlaybackValues = JSON.parse(localStorage.getItem(id));
            if (storedPlaybackValues === null) {
                initialize_stats(id, calculateDurationInSeconds(duration));
            }
            
            // It's good practice to load the most recent episode on the main page of the podcast.
            let audioHTML = "";
            if (index === 0) {
                audioHTML = `
                    <audio id="${id}" style="width: 85%" controls preload="auto" oncanplay="setTime('${id}')" onplay="pressedPlay('${id}', '')" ontimeupdate="trackTime('${id}', '')" onended="completed('${id}', '')">
                        <source src="${mp3}" type="audio/mpeg">
                        <source src="${enclosureURL}" type="audio/mpeg">
                    </audio>
                `;
            }

            html += `
                <section class="card-rss">
                    <a href="${episode}/">
                        <div>
                            <h3>${title}</h3>
                            <p><i>${pubDate} - ${calculateDurationInMinutes(duration)} minutes</i></p>
                            <p>${subtitle}</p>
                        </div>
                    </a>
                    ${audioHTML}
                </section>
                <hr style="width:75%">
            `;
        });
        
        mainElement.insertAdjacentHTML("beforeend", html);
    } catch (error) {
        console.error(error);
    }
}

/**
 * parseTime(str)
 * @param str A timecode
 * @returns the time in seconds
 * from timeJump.js, https://github.com/davatron5000/TimeJump
 */
var parseTime = function(str) {
    var plain = /^\d+(\.\d+)?$/g,
        npt = /^(?:npt:)?(?:(?:(\d+):)?(\d\d?):)?(\d\d?)(\.\d+)?$/,
        quirks = /^(?:(\d\d?)[hH])?(?:(\d\d?)[mM])?(\d\d?)[sS]$/,
        match;
    if (plain.test(str)) {
        return parseFloat(str);
    }
    match = npt.exec(str) || quirks.exec(str);
    if (match) {
        return (3600 * (parseInt(match[1],10) || 0) + 60 * (parseInt(match[2],10) || 0) + parseInt(match[3],10) + (parseFloat(match[4]) || 0));
    }
    return 0;
};


function calculateDurationInSeconds(duration) {
    const [hours, minutes, seconds] = duration.split(":");
    return (3600 * parseInt(hours)) + (60 * parseInt(minutes)) + parseInt(seconds);
}


function calculateDurationInMinutes(duration) {
    const [hours, minutes, seconds] = duration.split(":");
    return (60 * parseInt(hours)) + parseInt(minutes) + Math.round((parseInt(seconds) / 60));
}

function normalizeString(str) {
    // Convert to lowercase
    str = str.toLowerCase();

    // Remove spaces and special characters
    str = str.replace(/\s+/g, ''); // Remove spaces
    str = str.replace(/[^\w\s]/gi, ''); // Remove special characters

    return str;
}  


async function getEpisode(feed, episodeNumber, chapters){
    // https://css-tricks.com/how-to-fetch-and-parse-rss-feeds-in-javascript/
    try {
        const response = await fetch(feed);
        const xmlStr = await response.text();
        const data = new DOMParser().parseFromString(xmlStr, "text/xml");

        const channel = data.querySelector("channel");
        var podcastTitle = channel.querySelector("title").innerHTML;
        const podcast = normalizeString(podcastTitle);

        const id = `${CUSTOMDECK}${podcast}${episodeNumber}`;

        let chapter_html = await loadChapters(chapters, podcast, episodeNumber);

        const items = data.querySelectorAll("item");
        main_element = document.getElementById("main");

        let html = ``;
        var N = items.length - 1;
        var episode = parseInt(episodeNumber);


        var thisEpisode = null;
        items.forEach((item, index) => {
            let epNum = parseInt(item.querySelector("episode").innerHTML);
            if (epNum == episode) { thisEpisode = item; }
        });

        const title = thisEpisode.querySelector("title").innerHTML;
        const subtitle = thisEpisode.querySelector("subtitle").innerHTML;
        const pubDate = thisEpisode.querySelector("pubDate").innerHTML.substring(5,16);

        let enclosureURL = "";
        const enclosure = thisEpisode.querySelector("enclosure");
        if (enclosure) {
            enclosureURL = enclosure.getAttribute("url");
        }
        const mp3 = `${podcast}${episode}.mp3`;

        let name = podcastTitle + ' - ' + thisEpisode.querySelector("title").innerHTML;
        const duration = thisEpisode.querySelector("duration").innerHTML;
        var fileSize = Math.round(parseInt(thisEpisode.querySelector("enclosure").getAttribute("length"))/1000000.0)

        var description = String(thisEpisode.querySelector("description").innerHTML);
        const regex = /(<p>Show Notes<\/p>.*?)]]>/;
        const matches = description.match(regex);
        if (matches && matches.length > 1) { description = matches[1]; } 
        else { console.log("No Show Notes content found."); }

        html += `<h2>${title}</h2>
                    <p><i>${pubDate} - ${calculateDurationInMinutes(duration)} minutes</i></p>
                    <p>${subtitle}</p>
                    <h3>Play or <a href="/${podcast}/${episode}/${mp3}" download>download</a> this episode (${fileSize} MB)</h3>
                    <audio id="${id}" controls preload="auto" class="centred" oncanplay=setTime("${id}") onplay="pressedPlay('${id}', '${name}')" ontimeupdate="trackTime('${id}', '${name}')" onended="completed('${id}', '${name}')">
                        <source src="${mp3}" type="audio/mpeg">
                        <source src="${enclosureURL}" type="audio/mpeg">
                    </audio>
                ${chapter_html}
                <p>${description}</p><br>`;
        main_element.insertAdjacentHTML("afterbegin", html);

        // Check if visitor has stored playback values and generate defaults if null.
        var obj = JSON.parse(localStorage.getItem(id));
        if (obj == null) { initialize_stats(id, calculateDurationInSeconds(duration)); }
    }
    catch (error) {
        console.error(error);
    }
}

function escapeQuotes(str) {
    return str.replace(/'/g, "\\'");
}  

async function loadChapters(url, podcast, episodeNumber) {
    try {
        const id = `${CUSTOMDECK}${podcast}${episodeNumber}`;
        const response = await fetch(url);
        const markdown = await response.text();
        const html = markdown
            .replace(/^(#+)(.*)/gm, (match, level, title) => {
                const headingLevel = level.length;
                return `<h${headingLevel} id="#${title.toLowerCase().replace(/\s+/g, "-")}">${title}</h${headingLevel}>`;
            }) // Make header.
            .replace(/^-\s*([\d:]+)\s*-?\s*(.*)$/gm, (match, time, title) => {
                const anchorText = (time ? `${time} - ${title}` : title);
                return `<div class="card-chapter" onclick="gotoChapter('${id}', '${parseTime(time)}', '${escapeQuotes(title)}')">${anchorText}</div>`;
            }) // Make chapters.
            .replace(/(<div\b[^>]*>[\s\S]*?<\/div>\s*)+/gi, `<div class="card-chapters">$&</div><br>`); // Wrap chapters in a card.

        return html;
    } catch (error) {
        console.error(error);
    }
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
    // // Get the current URL
    // var url = window.location.href;

    // // Check if the URL contains a query string
    // if (url.indexOf('#') !== -1) {
    //     // Remove the query string from the URL
    //     var cleanUrl = url.split('#')[0];

    //     // Update the URL without the query string
    //     window.history.replaceState(null, null, cleanUrl);
    // }
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

