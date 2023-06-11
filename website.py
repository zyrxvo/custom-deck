import os
import re
import json
from sys import argv
from enum import Enum
import feedparser
from bs4 import BeautifulSoup
import markdown
from python.mdX import X

#############################################################
##################### Site Constants ########################
#############################################################

__CUSTOM_DECK__ = '__custom_deck__'
__CONFIG_FILE__ = 'config.json'
__NUMBER_OF_COLORS__ = 5

class Mode(Enum):
    BUILD = 'build'
    CLEAN = 'clean'

__MODE__ = argv[1]
if __MODE__ == Mode.BUILD.value: __MODE__ = Mode.BUILD
elif __MODE__ == Mode.CLEAN.value: __MODE__ = Mode.CLEAN
else: pass


#############################################################
#################### Utility Functions ######################
#############################################################

def parseMD(filename):
    with open(filename, 'r') as f:
        markdown_text = f.read()
        f.close()
    md = markdown.Markdown(extensions=['full_yaml_metadata', X()])
    html = md.convert(markdown_text)
    return html, md.Meta

def updateRelPaths(soup, path):
    relative_path_prefix = ''.join(['../' for p in path.split('/') if p != ''])
    elements = soup.find_all(attrs={"customdeck-update-relpath": True})
    for element in elements:
        if element.name == 'a': element['href'] = relative_path_prefix + element['href']
        elif element.name == 'img': element['src'] = relative_path_prefix + element['src']
        elif element.name == 'source': element['srcset'] = relative_path_prefix + element['srcset']
        else: pass
    return soup

def innerHTML(string, element, replace=True):
    if replace: element.clear()
    html_text = '>\n<'.join(string.split('><'))
    html_soup = BeautifulSoup(html_text, 'html.parser')
    nodes_to_insert = html_soup.children
    for i, node in enumerate(nodes_to_insert):
        element.insert(i, node)
    return element

def getValueFromKey(data, key):
    keys = key.split('.')
    value = data
    for k in keys:
        if isinstance(value, dict) and k in value: value = value[k]
        else: return None
    return value

def lazyImages(soup):
    elements = soup.find_all('img')
    for element in elements:
        element.attrs['decoding'] = 'async'
        if not (element.get('id') and ('scene' in element.get('id') or 'hero-image' in element.get('id'))):
            element.attrs['loading'] = 'lazy'
        else:
            element.attrs['fetchpriority'] = 'high'
            element.attrs['loading'] = 'eager'
    return soup

#############################################################
################### Peripheral Content ######################
#############################################################

def loadConfig(soup, config_file):
    with open(config_file, 'r') as f:
        config = json.load(f)
        f.close()
    elements = soup.find_all(attrs={'customdeck-placeholder': True})
    for element in elements:
        placeholderKey = element['customdeck-placeholder']
        placeholderValue = getValueFromKey(config, placeholderKey)
        if (placeholderValue):
            if (element.name == 'img'): element['src'] = placeholderValue
            elif (element.get('id') == 'email'): element = innerHTML(f'<a href="mailto:{placeholderValue}">{placeholderValue}</a>', element)
            elif (element.name == 'a'): element['href'] = placeholderValue
            else: element = innerHTML(placeholderValue, element)
    return soup

def setActivePage(soup, page):
    element = soup.find(id=page)
    if 'class' in element.attrs: element['class'].append('active')
    else: element['class'] = ['active']
    return soup


#############################################################
####################### Blog Posts #########################
#############################################################

def loadPosts(element, blog, path, config_file):
    element.clear()
    with open(config_file, 'r') as f:
        config = json.load(f)
        f.close()
    posts = os.path.join(path, config[blog]['posts'])
    filenames = [file for root, dirs, files in os.walk(posts) if '.md' for file in files if '.md' in file]
    filenames.sort()
    images = config[blog]['images']
    for index, markdown_file in enumerate(filenames):
        markdown_html, details = parseMD(os.path.join(posts, markdown_file))
        date = details.date if details != None else markdown_file
        thisColor = index % __NUMBER_OF_COLORS__
        entry = f'<section class="card color{thisColor} padded margins" id="{date}">'
        post,image = '',''
        imageURL = os.path.join(images, markdown_file.split('.')[0] + '.jpeg')
        fullImageURL = os.path.join(images, markdown_file.split('.')[0] + '_full.jpeg')
        if os.path.exists(os.path.join(path, imageURL)):
            post = f'<div id="{date}-text" class="twothirds">{markdown_html}</div>'
            if os.path.exists(os.path.join(path, fullImageURL)): image = f'<div id="{date}-image" class="onethird centred"><a href="{fullImageURL}"><img src={imageURL} decoding="async" loading="lazy"></a></div>'
            else: image = f'<div id="{date}-image" class="onethird horizontal"><img src={imageURL} decoding="async" loading="lazy"></div>'
            # Alternate which side the image is on.
            if (index%2): entry = f'{entry}{post}{image}</section>'
            else: entry = f'{entry}{image}{post}</section>'
        else:
            post = f'<div id="{date}-text" class="full">{markdown_html}</div>' 
            entry = f'{entry}{post}</section>'
        element = innerHTML(entry, element, replace=False)
    return element

def insertBlog(soup, path):
    element = soup.find(attrs={"customdeck-include-blog": True})
    if element: element = loadPosts(element, element['customdeck-include-blog'], path, __CONFIG_FILE__)
    return soup



#############################################################
#################### RSS Functions ######################
#############################################################

def parse_time(str):
    plain = r'^\d+(\.\d+)?$'
    npt = r'^(?:npt:)?(?:(?:(\d+):)?(\d\d?):)?(\d\d?)(\.\d+)?$'
    quirks = r'^(?:(\d\d?)[hH])?(?:(\d\d?)[mM])?(\d\d?)[sS]$'
    
    if re.match(plain, str):
        return float(str)
    
    match = re.match(npt, str) or re.match(quirks, str)
    if match:
        hours = int(match.group(1) or 0)
        minutes = int(match.group(2) or 0)
        seconds = int(match.group(3))
        milliseconds = float(match.group(4) or 0)
        return 3600 * hours + 60 * minutes + seconds + milliseconds
    
    return 0

def get_description(desc, subtitle):
    if subtitle in desc: return desc.replace(subtitle, '')
    else: return desc

def escape_quotes(str):
    return str.replace("'", "\\'")

def load_chapters(chapter_file, id):
    if os.path.exists(chapter_file):
        with open(chapter_file, 'r') as f:
            markdown_text = f.read()
            f.close()
        
        html = re.sub(r'^(#+)(.*)', lambda match: f'<h{len(match.group(1))} id="#{match.group(2).lower().replace(" ", "-")}">{match.group(2)}</h{len(match.group(1))}>', markdown_text, flags=re.MULTILINE)
        html = re.sub(r'^-\s*([\d:]+)\s*-?\s*(.*)$', lambda match: f'''<div class="card-chapter" onclick="gotoChapter('{id}', '{parse_time(match.group(1))}', '{escape_quotes(match.group(2))}')">{match.group(1)} - {match.group(2)}</div>''', html, flags=re.MULTILINE)
        html = re.sub(r'(<div\b[^>]*>[\s\S]*?<\/div>\s*)+', r'<div class="card-chapters">\g<0></div><br>', html, flags=re.IGNORECASE)
        
        return html
    else: return ''


def calculateDurationInMinutes(duration):
    hours, minutes, seconds = duration.split(":")
    return (60 * int(hours)) + int(minutes) + round((int(seconds) / 60))

def audioHTML(id, enclosureURL, mp3):
    return f'''<audio id="{id}" style="width: 85%" controls preload="metadata" oncanplay="setTime('{id}')" onplay="pressedPlay('{id}', '')" ontimeupdate="trackTime('{id}', '')" onended="completed('{id}', '')"><source src="{enclosureURL}" type="audio/mpeg"><source src="{mp3}" type="audio/mpeg"></audio>'''

def insertRSSFeed(soup, path):
    element = soup.find(attrs={"customdeck-include-rss": True})
    if not element: return soup
    rss = element['customdeck-include-rss']
    element.clear()
    with open(__CONFIG_FILE__, 'r') as f:
        config = json.load(f)
        f.close()
    feed = os.path.join(path, config[rss]['rss'])
    data = feedparser.parse(feed)
    podcast = data.feed.title
    html = f'<h2 class="centred-text">All Episodes</h2><hr>'
    for i,episode in enumerate(data.entries):
        episode_number = episode.itunes_episode
        episodeID = f'{__CUSTOM_DECK__}{podcast}{episode_number}'
        mp3 = f'{episode_number}/{podcast}{episode_number}.mp3'.lower()
        audio = audioHTML(episodeID, episode.enclosures[0]['url'], mp3) if i == 0 else ''
        html += f'''<section class="card-rss"><a href="{episode_number}/"><div><h3>{episode.title}</h3><p><i>{(episode.published)[5:16]} - {calculateDurationInMinutes(episode.itunes_duration)} minutes</i></p><p>{episode.subtitle}</p></div></a>{audio}</section><hr>'''
    element = innerHTML(html, element)
    return soup

def insertRSSEpisode(soup, path):
    element = soup.find(attrs={'customdeck-include-rss-episode': True})
    if not element: return soup
    rss = element['customdeck-include-rss-episode']
    element.clear()
    with open(__CONFIG_FILE__, 'r') as f:
        config = json.load(f)
        f.close()
    feed = os.path.join(path[:-1], config[rss]['rss'])
    data = feedparser.parse(feed)
    podcast = data.feed.title
    n = int(re.search(r'\d+', path).group())
    episode = None
    for ep in data.entries:
        if int(ep.itunes_episode) == n: episode = ep
    episode_number = episode.itunes_episode
    episodeID = f'{__CUSTOM_DECK__}{podcast}{episode_number}'
    mp3 = f'{podcast}{episode_number}.mp3'.lower()
    audio = audioHTML(episodeID, episode.enclosures[0]['url'], mp3)
    html = f'''<h1>{podcast}</h1><h2>{episode.title}</h2><p><i>{(episode.published)[5:16]} - {calculateDurationInMinutes(episode.itunes_duration)} minutes</i></p><p>{episode.subtitle}</p><h3>Play or <a href="{mp3}" download>download</a> this episode ({round(float(episode.enclosures[0]['length'])/1e6, 1)} MB)</h3>{audio}{load_chapters(os.path.join(path, 'chapters.md'), episodeID)}<p>{get_description(episode.description, episode.subtitle)}</p><br>'''
    element = innerHTML(html, element)
    return soup

#############################################################
###################### Main Content #########################
#############################################################

def insertMD(soup, path):
    elements = soup.find_all(attrs={"customdeck-include-markdown": True})
    for element in elements:
        element.clear()
        markdown_path = element['customdeck-include-markdown']
        markdown_file = os.path.join(path, markdown_path)
        markdown_html, yaml = parseMD(markdown_file)
        element = innerHTML(markdown_html, element)
    return soup

def insertHTML(soup, path):
    elements = soup.find_all(attrs={"customdeck-include-html": True})
    for element in elements:
        element.clear()
        html_path = element['customdeck-include-html']
        html_file = os.path.join(path, html_path)
        with open(html_file, 'r') as f:
                html_text = f.read()
                f.close()
        html_soup = BeautifulSoup(html_text, 'html.parser')
        html_soup = updateRelPaths(html_soup, path)
        if 'nav' in html_file: 
            page_tag = soup.find(attrs={"customdeck-active-page": True})
            if page_tag: 
                page = page_tag["customdeck-active-page"]
                html_soup = setActivePage(html_soup, page)
        nodes_to_insert = html_soup.children
        for i, node in enumerate(nodes_to_insert):
            element.insert(i, node)
    return soup


#############################################################
###################### Site Builder #########################
#############################################################

def clean(soup):
    for attribute in ['customdeck-include-markdown', 'customdeck-include-html', 'customdeck-include-blog', 'customdeck-include-rss', 'customdeck-include-rss-episode']:
        elements = soup.find_all(attrs={attribute: True})
        for element in elements: element.clear()
    return BeautifulSoup(str(soup), 'html.parser')

def process(html_file):
    path = html_file.split('/')
    path = f"{'/'.join(path[:-1])}" if len(path) > 0 else ""
    with open(html_file, 'r') as file:
        soup = BeautifulSoup(file, 'html.parser')
        if __MODE__ == Mode.BUILD:
            soup = insertMD(soup, path)
            soup = insertHTML(soup, path)
            soup = insertBlog(soup, path)
            soup = insertRSSFeed(soup, path)
            soup = insertRSSEpisode(soup, path)
            soup = loadConfig(soup, __CONFIG_FILE__)
            soup = lazyImages(soup)
        elif __MODE__ == Mode.CLEAN: soup = clean(soup)
        else: pass

    # Save the modified HTML back to the file
    with open(html_file, 'w') as file:
        file.write(str(soup))

def buildSite(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file == 'index.html':
                html_file = os.path.relpath(os.path.join(root, file), root_dir)
                process(html_file)

# Build the Site
buildSite(os.getcwd())