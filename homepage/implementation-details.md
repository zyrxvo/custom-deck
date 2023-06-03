# Implementation Details

Here are some of the details regarding how the site is implemented so that if you go digging around it might be easier for you to customize it to your liking.

## Session Storage
The `config` details are stored in `sessionStorage` to reduce the number of server requests in an attempt to improved the loading times. The details are saved with an 'expiration' time so that in the event that a user does not close their browsing session, any changes made to the cached config details will be included. The default expiration time is 1 hour, but this can be changed at the top of the `js/main.js` file.

The rendered markdown from the blog posts are also saved in `sessionStorage`. This is to help reduce the number of server requests and speed up loading times over slower internet connections when visitors go between pages and come back to your blog. Changing this to be stored in `localStorage` would also be straight forward. The content of the blog posts are also saved with the same 'expiration' time  (1 hour default initialized at the top of `js/main.js`). This allows visitors to get new posts within at most the expiration time of being published.

The biggest issue with this approach is that there is typically a limit of `5 MB` of storage available per website in `sessionStorage`. So if you many and/or long posts you may not want to save them in `sessionStorage` and alter the code to always `fetchPosts()` whenever `loadPosts()` is called (be sure to also remove the line from `fetchPosts()` that saves the content to `sessionStorage`).


## Local Storage

There are two main pieces of data that are stored in `localStorage`: the current `scene` and the current playback information for podcast episodes. The current `scene` flag determines whether the site should be displayed in `light` or `dark` mode. Saving this setting here allows the preference to persist across browsing sessions.

The podcast episode playback information is also saved so that visitors can resume listening to an episode when the come back (assuming they return using the same browser they originally visited with). Data identifying how much of each episode each visitor has listened to is also saved to `localStorage`. This allows for the ability to collect statistics on how much of each episode visitors listen to. However, this data is kept local in each visitor's browser unless it is captured somewhere else. I personally use [Matomo](https://matomo.org) to do this and host a Matomo server myself.


## Network Usage

All of the images are given the `loading="lazy"` flag to reduce network usage, especially when loading the blog posts. This flag helps to load pages more quickly by waiting until the images come close to or above the 'fold' of the page.

# Possible Issues

Here are some of the biggest quality of life issues with this theme that are a result of how I dynamically load all of the content.
- The page location is not saved between refreshes.
- While anchor links (#header) work when clicked on within a page, they do not scroll to the correct location when the page is refreshed (or when landing on the page initially with the anchor). This could be because I also use [TimeJump](https://github.com/davatron5000/TimeJump).

Other issues are not limited to the following.
- If a visitor loads an episode page using a TimeJump hash, it will overwrite their previously saved progress for the episode. This is because it is equivalent to them manually seeking through the episode themselves. This is intended behaviour but may be surprising.


# TimeJump

This theme uses a slightly customized version of [TimeJump](https://github.com/davatron5000/TimeJump) which adds deep-linking to HTML5 `audio` and `video` podcasts. TimeJump works behind-the-scenes to create a standardized API for seeking, based off the YouTube deep-linking syntax.

**How it works.** It auto-detects the `t` (time) parameter in your URL and attempt to fast-forward listeners to that timestamp. It usually works, *but doesn't not work on iOS.*

**Supported URL formats include:**
Media Fragments w/ hash:
- `http://mypodca.st/first-episode/#t=1:23:45`
- `http://mypodca.st/first-episode/#t=23:45`
- `http://mypodca.st/first-episode/#t=234`

Media Fragments w/ query:
- `http://mypodca.st/first-episode/?t=1:23:45`
- `http://mypodca.st/first-episode/?t=23:45`
- `http://mypodca.st/first-episode/?t=234`

Quirks Mode (YouTube-style) w/ hash or query:
- `http://mypodca.st/first-episode/?t=1h23m45s`
- `http://mypodca.st/first-episode/#t=1m23s`   