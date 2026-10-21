"""Playwright helpers: route CDN KaTeX and Google Fonts to local copies so pages render offline."""
import re, pathlib
import os
KATEX=pathlib.Path(os.environ.get("KATEX_DIST","/home/claude/work/node_modules/katex/dist"))
FONTCSS=pathlib.Path(os.environ.get("FONT_CSS","/home/claude/work/fonts.css")).read_text() if pathlib.Path(os.environ.get("FONT_CSS","/home/claude/work/fonts.css")).exists() else ""
def route(page):
    def handler(route):
        url=route.request.url
        if "fonts.googleapis.com" in url:
            return route.fulfill(status=200, content_type="text/css", body=FONTCSS)
        if "fonts.gstatic.com" in url:
            return route.fulfill(status=404, body="")
        m=re.search(r"KaTeX/0\.16\.9/(.*)$", url) or re.search(r"katex@0\.16\.9/dist/(.*)$", url)
        if m:
            p=KATEX/m.group(1)
            if p.exists():
                ct="text/css" if p.suffix==".css" else "application/javascript" if p.suffix==".js" else "font/woff2"
                return route.fulfill(status=200, content_type=ct, body=p.read_bytes())
            return route.fulfill(status=404, body="")
        if url.startswith("https://api.anthropic.com"):
            return route.fulfill(status=401, body="{}")
        return route.continue_()
    page.route("**/*", handler)
