import scrapy
import json
from typing import List

class ContentExtractorSpider(scrapy.Spider):
    name = "content_extractor"
    custom_settings = {
        'DOWNLOAD_DELAY': 1,
        'ROBOTSTXT_OBEY': False,
        'RETRY_TIMES': 2,
        'LOG_LEVEL': 'DEBUG',
        'DUPEFILTER_CLASS': 'scrapy.dupefilters.BaseDupeFilter',

    }

    # def __init__(self, urls_file,output_file, *args, **kwargs):
    def __init__(self, urls=None, *args, **kwargs):
        super(ContentExtractorSpider, self).__init__(*args, **kwargs)
        if urls:
            self.start_urls = urls.split(',') 
        else:
            self.start_urls = []  
            # if isinstance(data, list) and all('url' in item for item in data):
            #     self.start_urls = [item['url'] for item in data]
            # elif isinstance(data, list) and all(isinstance(item, str) for item in data):
            #     self.start_urls = data
            # else:
            #     raise ValueError("urls_file must contain a list of URLs or a list of dictionaries with 'url' keys")
            

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url=url, callback=self.parse, errback=self.errback)

    def parse(self, response):
        unwanted_tags = {'script', 'style', 'noscript', 'nav', 'aside'}
    
        texts = response.xpath(
            '//body//text()[normalize-space() and not(ancestor::script or ancestor::style or ancestor::noscript or ancestor::header or ancestor::footer or ancestor::nav or ancestor::aside)]'
        ).getall()
        
        cleaned_text = [text.strip() for text in texts if text.strip()]
        combined_text = ' '.join(cleaned_text)

        yield {
            'url': response.url,
            'content': combined_text
        }

    def errback(self, failure):
        self.logger.error(f'Request failed: {failure.request.url}')
        yield {
            'url': failure.request.url,
            'content': f'Error: Failed to fetch content - {str(failure.value)}'
        }
