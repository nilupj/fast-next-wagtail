
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { fetchLatestNews } from '../../utils/api';

export default function NewsIndex() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await fetch('http://0.0.0.0:8001/api/v2/pages/?type=news.NewsPage&fields=title,summary,publish_date,category,image,slug&order=-publish_date');
        const data = await response.json();
        setNews(data.items || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading news:', error);
        setLoading(false);
      }
    };
    getNews();
  }, []);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Latest Health News</h1>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <Link 
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                    <p className="text-gray-600 text-sm mb-3">{article.summary}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <time>{new Date(article.publish_date).toLocaleDateString()}</time>
                      {article.category && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{article.category.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
