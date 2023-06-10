import re
from markdown.extensions import Extension
from markdown.preprocessors import Preprocessor
from markdown.treeprocessors import Treeprocessor
from markdown.postprocessors import Postprocessor

class LB(Preprocessor):
    """ Custom Lists and Buttons """
    def run(self, lines):
        lines = '\n'.join(lines)
        lines = re.sub(r'^-\ (.*)$', r'<ul><li>\1</li></ul>', lines, flags=re.MULTILINE)
        lines = re.sub(r'<\/ul>\n<ul>', r'', lines, flags=re.MULTILINE)
        lines = re.sub(r'^(\d+)\.\ (.*)$', r'<ol><li>\2</li></ol>', lines, flags=re.MULTILINE)
        lines = re.sub(r'<\/ol>\n<ol>', r'', lines, flags=re.MULTILINE) 
        lines = re.sub(r'¡\[([^\]]+)\]\(([^)]+)\)', r"<div class='centre-button'><a href='\2'><button class='button'>\1</button></a></div>", lines)
        lines = re.sub(r'!\[([^\]]+)\]\(([^)]+)\|(\d+)\)', r"<div><img src='\2' alt='\1' style='width: \3px;' decoding='async' loading='lazy'></div>", lines)
        return lines.split('\n')

class Y(Treeprocessor):
    """ Add Anchors to Headers """
    def run(self, root):
        for element in root.iter():
            if element.tag.startswith('h') and len(element.tag) == 2 and element.text:
                header_text = element.text
                anchor_id = header_text.lower().replace(' ', '-').replace(',','')
                element.set('id', anchor_id)

class QL(Preprocessor):
    """ Custom Lists Within BlockQuotes """
    def run(self, text):
        text = re.sub(r'^-\ (.*)$', r'<ul><li>\1</li></ul>', text, flags=re.MULTILINE)
        text = re.sub(r'<\/ul>\n<ul>', r'', text, flags=re.MULTILINE)
        text = re.sub(r'^(\d+)\.\ (.*)$', r'<ol><li>\2</li></ol>', text, flags=re.MULTILINE)
        text = re.sub(r'<\/ol>\n<ol>', r'', text, flags=re.MULTILINE) 
        return text

class X(Extension):
    def extendMarkdown(self, md):
        md.preprocessors.register(LB(), 'button_listings', 0)
        md.treeprocessors.register(Y(md), 'header_anchor', 15)
        md.postprocessors.register(QL(), 'quote_lists', 160)