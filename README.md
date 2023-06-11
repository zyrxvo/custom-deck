# Welcome to Custom-Deck!

This is a public version of the custom theme I built myself for my own website, [zyrxvo.github.io](https://zyrxvo.github.io). A demo of this theme can be explored at [zyrxvo.github.io/custom-deck](https://zyrxvo.github.io/custom-deck).

I created it because I wanted to explore how to do front-end web development but I didn't want to load large libraries just to present a static site. Thus, the theme can be used to create very lightweight sites that are almost exclusively `HTML` and `CSS`. This theme could easily be modified to remove all `JavaScript`. However, with `JavaScript` it has a few additional features.
1. The ability to dismiss the dropdown navigation menu on touch screens.
2. An optional light and dark mode button for those who love dark mode.
3. A basic podcast player that keeps track of where you are in each episode.

The name `Custom-Deck` come from the design of the site. Everything is predominantly divided into separate cards to display information. These cards can be arranged however you like them to build a site that works for you.

Much of what I learned in order to build this site I received from [W3 Schools](https://www.w3schools.com), [Stack Overflow](https://stackoverflow.com), [MDN](https://developer.mozilla.org/en-US/) and more recently [ChatGPT](https://chat.openai.com) because sometimes I don't even know how to ask the questions I have. However, this theme does include the small and fantastic work of [TimeJump](https://davatron5000.github.io/TimeJump/).

Almost all of the images on this demo-site were generated using [DiffusionBee](https://diffusionbee.com). If you have any questions or concerns, feel free to reach out to me.

## Using Custom-Deck
You are free to use and customize this theme provided you follow the [licensing agreement](LICENSE) and the licensing agreement of TimeJump. See the [Customization and Implementation](#customization-and-implementation) below for more details regarding customization, but the template requires running a `Python` script `website.py` in order to build and 'dynamically pre-load' the site's content into the site's structure. The script requires a couple libraries ([Python-Markdown](https://python-markdown.github.io/), [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/), and [FeedParser](https://feedparser.readthedocs.io/en/latest/)) all given in `requirements.txt`. I suggest making a `Python` virtual environment and `pip` installing them.

I made this repo and demo site as a working example of how to use the theme. Feel free to [reach out](#contact-me) to me if you have any questions or issues.