# Customization and Implementation

## Site Details

The philosophy behind this theme is to make it as lightweight and fast as possible. To do this there is a focus on using only `HTML` and `CSS`. `JavaScript` is used sparingly to provide functionality for a few key features:
- Dropdown menu on mobile
- Light/dark mode
- Saving podcast playback position
`Python` is used to dynamically pre-load content into the `index.html` files of your site as `HMTL`. You can do this by running `python3 website.py build` from the root directory of your site. If you want to remove the content from the `HTML` of your site you can do this running `python3 website.py clean`.

### config.json
In the top-level folder there is a `config.json` file that provides some customization options for the theme. They don't change very much of the site, but it does allow some of the components of the site to be altered without digging into the `HTML`, `CSS`, `JavaScript`, or `Python`.

### Content
Changing the main layout and content of the site is done by editing the `HTML` files themselves. The basic `card` class can be used as full-width, half-width, two-thirds-width, and one-third-width cards with nested combinations, in case you wanted quarter-width, etc. 
The content can then be dynamically pre-loaded into the `HTML` before publication. Using the following `HTML` attributes you can customize how what content is loaded and how it is loaded: 
- `customdeck-include-markdown`
- `customdeck-include-html`
- `customdeck-include-blog`
- `customdeck-include-rss`
- `customdeck-include-rss-episode`
You can more quickly create content by writing in [markdown](https://daringfireball.net/projects/markdown/) and simply inserting the markdown using the markdown rendering engine, see the [Example Markdown](#example-markdown) below.

### CSS
Some of the other components of the `CSS` that can be easily customized are located at the top of the `main.css` file. These include font-size and white space adjustments. The site colours for both light and dark schemes are also located at the top of the file. There is only one set of light mode colours, but make sure that when you edit the dark mode colours that you have the same colour defined for both `:root.dark` and `@media (prefers-color-scheme: dark)`.

### JavaScript
The fundamental use of JavaScript for this theme are to be able to dismiss the dropdown menu on mobile, toggle between light and dark themes, and enable podcast playback. Some customizations can be easily made to the JavaScript files located in the `js/main.js` and `js/podcast.js`. Additionally, for the light and dark schemes, the GitHub logo in the footer is dynamically changed between black and white because a single image doesn't work with both schemes. Any additional images like this can be added in a similar way to the `scene` logic. Or the logic can be entirely removed if it is unnecessary. Also see below how [TimeJump](#TimeJump) is used to start playback at a particular time stamp.

## Home
This homepage is an example of a normal page in this theme. As mentioned before, the content can either be inserted directly into the `HTML` or it can be written in markdown and dynamically pre-loaded. See the [markdown example](#example-markdown) below for the features and quirks of the markdown engine.

## Blog
Blog posts are written in markdown. The location of the posts and associated images are defined in the `config.json` file along with the list of files to load (remember to define the location to the posts folder and list of files relatively with respect to the `blog` page). The python script `website.py` uses the config information to dynamically build and insert the blog posts into the `HTML` of the main blog page. It checks for images with the same file name as the blog post (one image per post). It also checks for a full resolution image to link to. The current format is to label each blog post file as the date of the post (`YEAR-MONTH-DAY.md`) to sort the posts reverse chronologically. Multiple posts on the same day can have appended alphabetical indicators, (`2023-03-30.md`, `2023-03-30a.md`, etc.). You can easily change the filenames after it's already been published if need be. The images would then be labelled `2023-03-30.jpeg`, `2023-03-30a.jpeg`, etc. If there is not an associated image it will just render the post without it.

## Podcast
Almost all of the podcast customization is contained within the RSS file. If you're unfamiliar with how RSS feeds work, I suggest [this guide from Apple](https://podcasters.apple.com/support/823-podcast-requirements) as a starting point and use the `podcast/rss.rss` file as a template. As far as the RSS feed goes, I believe that an email address is optional now, in case you would like to have less spam in your inbox because you ***will*** get spam to that email address.

On the `podcast` landing page, the badges/logos to different podcast players can be customized to link to your specific show using the `config.json` file. If you want to link to a different player or list you should be able to easily customize the `HTML` and config file to suit your needs. 

MP3 chapters are a common feature of modern podcast players. In order to indicate chapters in your MP3 simply include a file named `chapters.md` in the same folder as your podcast episode page. A custom markdown rendering engine takes a list of chapter titles (with timestamps) and dynamically generates a set up buttons that will automatically seek to the timestamp given. This means that you don't even need to embed chapters within your MP3 for this feature to work. You just need to list the times in a `chapters.md` file and `js/podcast.js` does the rest. If you don't include a `chapters.md` file then nothing happens.

# Implementation Details

Here are some of the details regarding how the site is implemented so that if you go digging around, it might be easier for you to customize it to your liking.

## Local Storage

There are two main pieces of data that are stored in `localStorage`: the current `scene` and the current playback information for podcast episodes. The current `scene` flag determines whether the site should be displayed in `light` or `dark` mode. Saving this setting here allows the preference to persist across browsing sessions.

The podcast episode playback information is also saved so that visitors can resume listening to an episode when the come back (assuming they return using the same browser they originally visited with). Data identifying how much of each episode each visitor has listened to is also saved to `localStorage`. This allows for the ability to collect statistics on how much of each episode visitors listen to. However, this data is kept local in each visitor's browser unless it is captured somewhere else. I personally use [Matomo](https://matomo.org) to do this and host a Matomo server myself.


## Network Usage

Building the site 'dynamically' and pre-loading the content before publishing not makes managing your content easier, but serving everything as `HTML` and `CSS` with minimal `JavaScript` will make your site more accessible and load more quickly (provided everything isn't massive media files).

Almost all of the images are given the `loading="lazy"` flag to reduce network usage, especially when loading the blog posts. This flag helps to initially load pages more quickly by waiting until the images come close to or above the 'fold' of the page. The 'hero images' are given the `loading="eager"` flag in an attempt to reduce the content from jumping around while fetch requests are being made.

## Possible Issues
- If a visitor loads an episode page using a TimeJump hash, it will overwrite their previously saved progress for the episode. This is because it is equivalent to them manually seeking through the episode themselves. This is intended behaviour but may be surprising, especially if the visitor refreshes the page with an old TimeJump has still in the URL.


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