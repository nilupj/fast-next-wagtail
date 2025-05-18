
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { fetchNewsBySlug, fetchRelatedNews } from '../../utils/api';

export default function NewsArticle() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      Promise.all([
        fetchNewsBySlug(slug),
        fetchRelatedNews(slug)
      ]).then(([articleData, relatedData]) => {
        setArticle(articleData);
        setRelatedArticles(relatedData);
        setLoading(false);
      }).catch(err => {
        console.error('Error loading article:', err);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link href="/news" className="text-blue-600 hover:underline">
            Return to News
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <nav className="text-sm mb-4">
                <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
                <span className="mx-2 text-gray-500">/</span>
                <Link href="/news" className="text-gray-500 hover:text-gray-700">News</Link>
                <span className="mx-2 text-gray-500">/</span>
                <span className="text-gray-700">{article.category?.name}</span>
              </nav>

              <article className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                {article.subtitle && (
                  <p className="text-xl text-gray-600 mb-4">{article.subtitle}</p>
                )}
                
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span>By {article.author?.name}</span>
                  <span className="mx-2">•</span>
                  <time>{new Date(article.publish_date).toLocaleDateString()}</time>
                  {article.category && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{article.category.name}</span>
                    </>
                  )}
                </div>

                {article.image && (
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="w-full rounded-lg mb-6"
                  />
                )}

                <div className="prose max-w-none"
                     dangerouslySetInnerHTML={{ __html: article.body }}
                />
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-bold mb-4">Related Articles</h2>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <Link 
                      key={related.id} 
                      href={`/news/${related.slug}`}
                      className="block hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-1">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(related.publish_date).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">Popular Topics</h2>
                <div className="grid grid-cols-2 gap-2">
                  {['Heart Disease', 'Diabetes', 'COVID-19', 'Cancer', 
                    'Mental Health', 'Nutrition'].map((topic) => (
                    <Link
                      key={topic}
                      href={`/search?topic=${topic}`}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      {topic}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
