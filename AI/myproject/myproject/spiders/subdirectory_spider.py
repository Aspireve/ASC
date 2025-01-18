import scrapy
import re
from urllib.parse import urlparse, urljoin

class SubdirectorySpider(scrapy.Spider):
    name = "subdir_spider"
    custom_settings = {
        'DOWNLOAD_DELAY': 1,
        'DEPTH_LIMIT': 5,
        'ROBOTSTXT_OBEY': False,
        'USER_AGENT': (
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/91.0.4472.124 Safari/537.36'
        ),
        'RETRY_TIMES': 3,
    }

    # def __init__(self, start_url, output_file, *args, **kwargs):
    def __init__(self, start_url, *args, **kwargs):
        super(SubdirectorySpider, self).__init__(*args, **kwargs)
        self.start_urls = [start_url]
        self.visited_urls = set()

    def parse(self, response):
        try:
            content_type = response.headers.get('Content-Type', b'').decode('utf-8')
            
            if 'text/html' in content_type:
                links = response.css('a::attr(href)').getall()
                
                if self.should_follow_url(response.url):
                    if response.url not in self.visited_urls:
                        self.visited_urls.add(response.url)
                        yield {'url': response.url}
                
                for link in links:
                    full_url = urljoin(response.url, link)
                    parsed_url = urlparse(full_url)
                    
                    if (parsed_url.scheme in ('http', 'https') and 
                        full_url not in self.visited_urls and 
                        self.should_follow_url(full_url)):
                        yield scrapy.Request(
                            full_url, 
                            callback=self.parse,
                            errback=self.handle_error
                        )
        except Exception as e:
            self.logger.error(f"Error parsing {response.url}: {str(e)}")

    def should_follow_url(self, url: str) -> bool:
        try:
            parsed_url = urlparse(url)
            
            # Check if URL is from the same domain as start_url
            start_domain = urlparse(self.start_urls[0]).netloc
            if parsed_url.netloc and parsed_url.netloc != start_domain:
                return False
            
            # Skip non-http(s) URLs
            if parsed_url.scheme not in ('http', 'https'):
                return False
            
            # Skip common file extensions
            if re.search(
                r'\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|zip|rar)$',
                parsed_url.path,
                re.IGNORECASE
            ):
                return False
            
            # Skip pagination and taxonomy pages
            if re.search(r'/(?:page|category|tag)/\d+/?$', parsed_url.path):
                return False
                
            return True
        except Exception as e:
            self.logger.error(f"Error in should_follow_url: {str(e)}")
            return False

    def handle_error(self, failure):
        self.logger.error(f"Request failed: {failure.value}")

    def closed(self, reason):
        self.logger.info(f"Spider closed: {reason}")
        self.logger.info(f"Total valid URLs found: {len(self.visited_urls)}")
