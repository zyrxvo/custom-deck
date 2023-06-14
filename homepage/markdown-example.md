## Example Markdown

[Markdown](https://daringfireball.net/projects/markdown/) is designed to "write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML)." The `Custom-Deck` theme uses a customized version of the [Python-Markdown](https://python-markdown.github.io) engine by implementing a couple custom features using regular expressions for convenience. The official syntax for the rendering engine is based off of the [original markdown syntax](https://daringfireball.net/projects/markdown/syntax). However, I added a couple customizations. As such, it is unlikely to, but it may result in errors or unintended behaviour. `HTML` used within the Markdown will remain unchanged and render as `HTML` unless it is placed within `<code>` blocks using ``` `backticks` ```. The most notable exceptions to this are when non-standard syntax is used. The following are some examples of the what is rendered.

### Headings

Headings from `<h1>` to `<h6>` are made by using the hashtag `#` . Simply use as many as you need to get from  `<h1>` to `<h6>`. 

# [Heading 1] [heading-1]
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

#### Non-standard Customization
I've added an additional rendering effect where headers are given anchor IDs with the same name, except where spaces are replaced with dashes and commas are removed.

### Emphasis

Basic emphasis is available using asterisks or underscores around words or phrases. _One_ is *emphasized*, **two** is __bold__, and ***three*** is **_both_**. Basic `code` emphasis is made using single, surrounding ``` `backticks` ```. Combinations of these emphasizers may not render as expected.

### Links

With markdown you can easily make links using closing square brackets `[]` followed immediately by closing round parentheses `()`. For example, `[this is a link](README.md)` and links to an image or file and renders as: [this is a link](README.md) , `[another page](blog)` renders as a link to [another page](blog) on the site, and `[an external URL](https://www.example.com)` is [an external URL](https://www.example.com).

**The most important consideration with relative links is that the link will be make with respect to where the markdown page will be rendered *not* where it is saved!**

With an exclamation point at the start, you can `![Embed an image](homepage/images/landscape.jpeg "With an optional title")` to embed an image with alt-text "Embed an image":
![Embed image](homepage/images/landscape.jpeg "With an optional title")

#### Non-standard Customizations
By adding a vertical bar after the link, but before closing the parentheses, you can `![embed an image with a caption and specify the class]` `(homepage/images/landscape.jpeg|onethird)`, to embed an image with a caption and specify the width (by using a `CSS` class):
![Embeded image with width defined by class="onethird"](homepage/images/landscape.jpeg|onethird) 

And by using the inverted exclamation mark '¡' (Option+1 on a Mac), this `¡[Button Link] (/podcast/5/#t=0:47)` renders as a button link: ¡[Button Link](podcast/5/#t=0:47)

***Again, the customizations to the Markdown rendering engine uses basic regular expressions. So if something isn't working like you expected it to, then maybe you expected too much of it.***

### Text, Lists, and Quotes

**Text** is just text. Paragraphs and new lines are wrapped in the `HTML` paragraph tags `<p>`. 
**Quotes** are made if a line begins with `>` then it will be wrapped in `<blockquote>` tags. 
> This is a single line/paragraph quote.
Additional lines that are not separated by an empty line will appear on the previous line, even if they don't begin with an angle bracket `>`.

But, see how fancy it is with its automatic indentation! The style of the quote can be customized using `CSS`.

**Lists** are rendered if a line begins with a hyphen followed by a space, '`-`&nbsp;&nbsp;', then the text on those lines will be converted into an **unordered list**. Successive lines will be included in the same list. For example,
- This is a list with only one line.
And

- This is
- a list
- with multiple lines.

Depending on where additional whitespace is used you can change how the list renders.

- This is a list
  
- with multiple lines

- where each line is wrapped in `<p>` tags.

Also, if you have 4 spaces before the list identifier, then you can get nested lists.

- Item 1
- Item 2
    - Subitem 2.1
    - Subitem 2.2
- Item 3
    - Subitem 3.1
    - Subitem 3.2
- Item 4
- Item 5
    - Subitem 5.1
    - Subitem 5.2

This is also true for an **ordered list**, except you must begin the line with a whole number followed by a period followed by a space, '`1. `'. However, it doesn't matter what number you start with because the ordered list will always begin with `1.`. For example, 
1. This is a single element in an ordered list.
And

9812. <— This number is 9812.
4. <— This number is 4.
0. <— And this number is 0.

This is a nested, ordered list

1. Item 1
    2. Subitem 1.1
        3. Subsubitem 1.1.1

Lists should work with block quotes too.
> This is a multi-line quote that also contains two different kinds of lists, some *emphasis* **and** some `code`.
> Note again that each new line is kept within the same paragraph tag.
>
> Paragraph breaks can be maintained so long as there is a newline gap that begins with a right angle bracket, `>`.
>
> My added customization is that the custom list rendering also works inside block quotes.
> 
> - See! This is
> - a multi-line list!
>
> So long as you don't have two different kinds of lists back to back, you can have ordered or unordered lists.
> 
> 1. Another List
> 2. Within the quote!
> 
> Finally this quote is attributed to no one.
