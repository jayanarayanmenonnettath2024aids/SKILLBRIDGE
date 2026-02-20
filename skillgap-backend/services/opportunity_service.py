import os
import requests
import json
from models import Opportunity
from datetime import datetime

class OpportunityService:
    GOOGLE_SEARCH_URL = "https://www.googleapis.com/customsearch/v1"

    @staticmethod
    def search_opportunities(query, interest_keywords=[]):
        api_key = os.environ.get('GOOGLE_SEARCH_API_KEY')
        cx = os.environ.get('GOOGLE_SEARCH_ENGINE_ID')

        if not api_key or not cx:
            print("Warning: Google Search API keys not set.")
            return []

        params = {
            'q': query,
            'key': api_key,
            'cx': cx,
            'num': 10  # Number of results
        }

        try:
            response = requests.get(OpportunityService.GOOGLE_SEARCH_URL, params=params)
            response.raise_for_status()
            results = response.json().get('items', [])
            
            opportunities = []
            for item in results:
                opp_data = {
                    'id': item.get('cacheId', item.get('link')), # Use link as ID if cacheId missing
                    'title': item.get('title'),
                    'link': item.get('link'),
                    'source': item.get('displayLink'),
                    'snippet': item.get('snippet'),
                    # Simple deadline extraction placeholder
                    'deadline': OpportunityService._extract_deadline(item.get('snippet')),
                }
                
                opp = Opportunity(opp_data)
                opp.relevance_score = OpportunityService._calculate_relevance(opp, interest_keywords)
                opportunities.append(opp)
            
            # Sort by relevance
            opportunities.sort(key=lambda x: x.relevance_score, reverse=True)
            return opportunities

        except Exception as e:
            print(f"Error searching opportunities: {e}")
            return []

    @staticmethod
    def _extract_deadline(text):
        # Placeholder for deadline extraction logic using regex or NLP
        # For now, return None or a dummy date if found
        if 'deadline' in text.lower():
            # Very basic extraction
            import re
            match = re.search(r'deadline[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})', text, re.IGNORECASE)
            if match:
                return match.group(1)
        return "Open"

    @staticmethod
    def _calculate_relevance(opportunity, keywords):
        score = 50 # Base score
        text = (opportunity.title + " " + opportunity.snippet).lower()
        
        for keyword in keywords:
            if keyword.lower() in text:
                score += 10
        
        return min(score, 100)
