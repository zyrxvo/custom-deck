## Example Markdown

The `Custom-Deck` theme implements a very basic version of Markdown for speed and convenience. However, because it is basic, use of Markdown syntax that is nested or complex may result in errors or unintended behaviour. `HTML` used within the Markdown will remain unchanged and render as `HTML`. The Markdown engine is implemented with basic regular expressions. The following are some examples of the what is rendered.

### Headings

Headings from `<``h1``>` to `<``h6``>` are made by using the hashtag `#` . Simply use as many as you need to get from  `<``h1``>` to `<``h6``>`.

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

### Emphasis

Basic emphasis is available using asterisks or underscores around words or phrases. _One_ is *emphasized*, **two** is __bold__, and ***three*** is **_both_**. Basic `code` emphasis is made using single, surrounding `backticks`. Combinations of these emphasizers may not render as expected.

### Links

With markdown you can easily make links using closing square brackets `[]` followed immediately by closing round parentheses `()`. For example, `[this is a link]``(README.md)` and links to an image or file and renders as: [this is a link](README.md) , `[another page]``(blog)` renders as a link to [another page](blog) on the site, and `[an external URL]``(https://www.example.com)` is [an external URL](https://www.example.com).

**The most important consideration with relative links is that the link will be make with respect to where the markdown page will be rendered *not* where it is saved!**

With an exclamation point at the start, you can `![Embed an image]``(homepage/images/landscape.jpeg)` to embed an image with alt-text "Embed an image":
![Embed image](homepage/images/landscape.jpeg)

By adding a vertical bar after the link, but before closing the parentheses, you can `![embed an image with width 200px]``(homepage/images/landscape.jpeg|200)`, to embed an image and specify the width:
![Embeded image with width 200px](homepage/images/landscape.jpeg|200)

And by using the inverted exclamation mark '¡' (Option+1 on a Mac), this `¡[Button Link]``(/podcast/5/#t=0:47)` renders as a button link: ¡[Button Link](podcast/5/#t=0:47)

### Text, Lists, and Quotes

**Text** is just text. Paragraphs and new lines are wrapped in the `HTML` paragraph tags `<``p``>`. 
**Lists** are made if a line begins with a hyphen followed by a space, '`- `', then the text on those lines will be converted into an **unordered list**. Successive lines will be included in the same list. For example,
- This is a list with only one line.
And
- This is
- a list
- with multiple lines.
This is also true for an **ordered list**, except you must begin the line with a whole number followed by a period followed by a space, '`1. `'. However, it doesn't matter what number you start with because the ordered list will always begin with `1.`. For example, 
1. This is a single element in an ordered list.
And
9812. <— This number is 9812.
4. <— This number is 4.
0. <— And this number is 0.

**Quotes** are made if a line begins with `>` then it will be wrapped in `<``blockquote``>` tags. It should work work lists too.
> This is a single line quote.

See how fancy it is with its automatic indentation!
> This is a multi-line quote that also contains two different kinds of lists, some *emphasis* **and** some `code`.
> Each new line is also wrapped in paragraph tags.
> - See! This is
> - a multi-line list!
> 1. Another List
> 2. Within the quote!
> Finally this quote is attributed to no one.

***Again, the Markdown rendering engine uses basic regular expressions. So if something isn't working like you expected it to, then maybe you expected too much of it.*** I didn't want to load a third-party library because I wanted to learn.