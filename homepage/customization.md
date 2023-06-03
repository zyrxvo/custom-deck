# Customizing `Custom-Deck`

## Site Details

### config.json
In the top-level folder there is a `config.json` file that provides some customization options for the theme. They don't change very much of the site, but it does allow some of the major components of the site to be altered without digging into the `HTML`, `CSS`, or `JavaScript`.

### Content
Changing the main layout and content of the site is done by editing the `HTML` files themselves. The basic `card` class can be used as full-width, half-width, two-thirds-width, and one-third-width cards with nested combinations, in case you wanted quarter-width, etc. The content itself can be added directly into the `HTML`. *This will be the enable the fastest and most accessible experience for visitors.* However, if you want to more quickly create content then you can write in markdown and simply insert the markdown using the markdown rendering engine, see the [Example Markdown](#example-markdown) below. I have not done extensive accessibility testing with my implementation, so if this is a concern then let me know how I can improve the implementation, or simply convert your markdown to `HTML` preemptively using something like [pandoc](https://pandoc.org) and then put the content directly into the `HTML`, or use a server side implementation like [jekyll](https://jekyllrb.com).

### CSS
Some of the other components of the `CSS` that can be easily customized are located at the top of the `main.css` file. These include font-size and white space adjustments. The site colours for both light and dark schemes are also located at the top of the file. There is only one set of light mode colours, but make sure that when you edit the dark mode colours that you have the same colour defined for both `:root.dark` and `@media (prefers-color-scheme: dark)`.

### JavaScript
There are some customizations that can be easily made to the JavaScript that change how the site looks and feels. I suspect that most of these elements will be located in the `blog.js` and `podcast.js` files where the layout of these pages are rendered dynamically. Additionally, for the light and dark schemes, the GitHub logo in the footer is dynamically changed between black and white because a single image doesn't work with both schemes. Any additional images like this can be added in a similar way to the `scene` logic. Or the logic can be entirely removed if it is unnecessary. 

## Home
This homepage is an example of a normal page in this theme. As mentioned before, the content can either be inserted directly into the `HTML` or it can be written in markdown and dynamically loaded. See the [markdown example](#example-markdown) below for the features and quirks of the markdown engine.

## Blog
Blog posts are written in markdown. The location of the posts and associated images are defined in the `config.json` file along with the list of files to load (remember to define the location to the posts folder and list of files relatively with respect to the `blog` page). The scripts in `js/blog.js` use the config information to dynamically build a display the blog posts. It checks for images with the same file name as the blog post (one image per post). It also checks for a full resolution image to link to. The current format is to label each blog post file as the date of the post. Multiple posts on the same day can have appended alphabetical indicators, (`2023-03-30a.md`, `2023-03-30b.md`, etc.). You can easily change the filenames after it's already been published if need be. The images would then be labelled `2023-03-30a.jpeg`, `2023-03-30b.jpeg`, etc. If there is not an associated image it will just render the post without it.

## Podcast
Almost all of the podcast customization is contained within the RSS file. If you're unfamiliar with how RSS feeds work, I suggest [this guide from Apple](https://podcasters.apple.com/support/823-podcast-requirements) as a starting point and use the `rss.rss` file as a template. As far as the RSS feed goes, I believe that an email address is optional now, in case you would like to have less spam in your inbox because you ***will*** get spam to that email address.

On the `podcast` landing page, the badges/logos to different podcast players can be customized to link to your specific show using the config file. If you want to link to a different player or list you should be able to easily customize the `HTML` and config file to suit your needs. 

MP3 chapters are a common feature of modern podcast players. In order to indicate chapters in your MP3 simply include a file named `chapters.md` in the same folder as your podcast episode page. A simple markdown rendering engine takes a list of chapter titles (with timestamps) and dynamically generates a set up buttons that will automatically seek to the timestamp given. This means that you don't need to embed chapters within your MP3 for this feature to work. You just need to list the times in a `chapters.md` file and `js/podcast.js` does the rest. If you don't include a `chapters.md` file then nothing happens.