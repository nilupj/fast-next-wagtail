
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { fetchNewsBySlug } from '../../utils/api';
import { NextSeo } from 'next-seo';

export default function NewsArticle() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchNewsBySlug(slug)
        .then(data => {
          setArticle(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching article:', err);
          setError(err.message);
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

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Article not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <NextSeo
        title={`${article.title} - Latest Health News - HealthInfo`}
        description={article.summary}
      />
      
      <article className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          {article.subtitle && (
            <p className="text-xl text-gray-600 mb-4">{article.subtitle}</p>
          )}
          <div className="text-gray-500">
            {new Date(article.publish_date).toLocaleDateString()}
            {article.source && ` | Source: ${article.source}`}
          </div>
        </header>
        
        {article.image && (
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full rounded-lg mb-8 object-cover h-[400px]"
          />
        )}
        
        <div className="prose max-w-none" 
             dangerouslySetInnerHTML={{ __html: article.body }} 
        />
      </article>
    </Layout>
  );
}
