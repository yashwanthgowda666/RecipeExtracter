import httpx
from bs4 import BeautifulSoup
import urllib.request
import asyncio

def get_html_fallback(url: str) -> str:
    # i use this if the first scraping method fails
    # it uses the built-in urllib library
    req = urllib.request.Request(
        url, 
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=15.0) as response:
            return response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        raise Exception(f"Urllib fallback failed: {str(e)}")

async def scrape_my_page(url: str) -> str:
    # here we try to get the html text from a url
    raw_html = ""
    my_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    }
    
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            res = await client.get(url, headers=my_headers)
            res.raise_for_status()
            raw_html = res.text
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 403:
            # if we get blocked, try the fallback
            try:
                raw_html = await asyncio.to_thread(get_html_fallback, url)
            except Exception:
                raise Exception("This website is blocking our scraper. Please try a different URL.")
        else:
            raise Exception(f"Failed to fetch the page. Status code: {e.response.status_code}")
    except Exception as e:
        # any other connection errors, try fallback one more time
        try:
            raw_html = await asyncio.to_thread(get_html_fallback, url)
        except Exception:
            raise Exception("Could not get the page content. The site might be down or blocking us.")

    # use beautifulsoup to clean up the mess
    soup = BeautifulSoup(raw_html, 'html.parser')

    # get rid of scripts, styles, and other junk we don't need
    scripts_to_remove = ["script", "style", "nav", "header", "footer", "aside"]
    for junk in scripts_to_remove:
        for element in soup.find_all(junk):
            element.decompose()

    # we try to find the main part of the recipe
    main_body = soup.find('main')
    if not main_body:
        # fallback to the whole body if 'main' isn't used
        main_body = soup.find('body')
    
    if not main_body:
        # last resort, just use everything
        main_body = soup

    # pull out the text and clean up whitespace
    final_text = main_body.get_text(separator='\n', strip=True)
    
    # limit the text so we don't go over the AI's token limit
    return final_text[:25000]
