import re
from markdown.extensions import Extension
from markdown.preprocessors import Preprocessor
from markdown.treeprocessors import Treeprocessor

class CB(Preprocessor):
    """ Custom Buttons and Embeded Images """
    def run(self, lines):
        lines = '\n'.join(lines)
        lines = re.sub(r'¡\[([^\]]+)\]\(([^)]+)\)', r"<div class='centre-button'><a href='\2'><button class='button'>\1</button></a></div>", lines)
        lines = re.sub(r'!\[(.*?)\]\((.*?)\|(.*?)\)', r"<figure><a class='padded centred' href='\2'><img class='imglink \3' decoding='async' loading='lazy' src='\2' alt='\1' /></a> <figcaption class='centred'><p>\1</p></figcaption></figure>", lines)
        lines = re.sub(r'\?\[(.*?)\]\((.*?)\)', r'<div class="centred"><a class="infobox" data-content-name="InfoBox" data-content-piece="\2" data-content-target="\2" data-track-content="" href="\2" ><div class="centred vertical">\1</div></a></div>', lines)
        return lines.split('\n')

class Y(Treeprocessor):
    """ Add Anchors to Headers """
    def run(self, root):
        for element in root.iter():
            if element.tag.startswith('h') and len(element.tag) == 2 and element.text:
                header_text = element.text
                anchor_id = header_text.lower().replace(' ', '-').replace(',','')
                element.set('id', anchor_id)

class X(Extension):
    def extendMarkdown(self, md):
        md.preprocessors.register(CB(), 'button_listings', 0)
        md.treeprocessors.register(Y(md), 'header_anchor', 15)