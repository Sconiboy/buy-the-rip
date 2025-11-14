// Yahoo Finance News Integration
// Free news API for stock-related news

class YahooNewsAPI {
    constructor() {
        this.baseURL = 'https://query1.finance.yahoo.com/v10/finance/quoteSummary';
        this.newsEndpoint = 'https://query1.finance.yahoo.com/v1/finance/search';
    }

    // Get news for a stock symbol
    async getStockNews(symbol, limit = 5) {
        try {
            // Using YahooQuery for news (free, no API key required)
            const response = await fetch(
                `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=news`,
                {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    }
                }
            );

            if (!response.ok) {
                console.warn(`Yahoo News API error for ${symbol}:`, response.statusText);
                return [];
            }

            const data = await response.json();
            
            if (data.quoteSummary && data.quoteSummary.result && data.quoteSummary.result[0].news) {
                return data.quoteSummary.result[0].news.slice(0, limit).map(item => ({
                    title: item.title,
                    link: item.link,
                    source: item.source,
                    pubDate: new Date(item.pubDate * 1000).toLocaleDateString(),
                    summary: item.summary || ''
                }));
            }

            return [];
        } catch (error) {
            console.error('Error fetching Yahoo news:', error);
            return [];
        }
    }

    // Get trending stocks
    async getTrendingStocks() {
        try {
            const response = await fetch(
                'https://query1.finance.yahoo.com/v1/finance/trending/us',
                {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    }
                }
            );

            if (!response.ok) {
                return [];
            }

            const data = await response.json();
            return data.finance?.result?.[0]?.quotes?.slice(0, 10) || [];
        } catch (error) {
            console.error('Error fetching trending stocks:', error);
            return [];
        }
    }

    // Format news for display
    formatNewsForDisplay(news) {
        return `
            <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
                <h4 style="color: var(--accent-cyan); margin-bottom: 0.5rem;">${news.title}</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;">
                    <strong>${news.source}</strong> • ${news.pubDate}
                </p>
                <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">${news.summary}</p>
                <a href="${news.link}" target="_blank" style="color: var(--accent-cyan); text-decoration: none;">Read more →</a>
            </div>
        `;
    }
}

// Initialize Yahoo News API
const yahooNews = new YahooNewsAPI();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { YahooNewsAPI, yahooNews };
}
