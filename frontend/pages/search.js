import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { searchContent } from '../utils/api';
import Layout from '../components/Layout';

export default function Search() {
  const router = useRouter();
  const { q: query } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState({
    articles: [],
    conditions: [],
    drugs: []
  });

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setLoading(false);
      setResults({
        articles: [],
        conditions: [],
        drugs: []
      });
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await searchContent(query);
        if (data.error) {
          throw new Error(data.error);
        }
        setResults(data);
      } catch (err) {
        setError('Error fetching search results. Please try again.');
        console.error('Search error:', err);
        setResults({
          articles: [],
          conditions: [],
          drugs: []
        });
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const totalResults = 
    results.articles.length + 
    results.conditions.length + 
    results.drugs.length;

  return (
    <Layout>
      <NextSeo title={`Search results for "${query || ''}" | Health Info`} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Search Results {query && `for "${query}"`}
        </h1>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !query ? (
          <div>Please enter a search term</div>
        ) : totalResults === 0 ? (
          <div>No results found for "{query}"</div>
        ) : (
          <div className="space-y-8">
            {results.articles.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Articles</h2>
                <div className="grid gap-6">
                  {results.articles.map(article => (
                    <Link 
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="block p-4 border rounded hover:shadow-lg transition"
                    >
                      <h3 className="font-medium">{article.title}</h3>
                      {article.summary && (
                        <p className="text-gray-600 mt-2">{article.summary}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.conditions.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Conditions</h2>
                <div className="grid gap-6">
                  {results.conditions.map(condition => (
                    <Link
                      key={condition.id}
                      href={`/conditions/${condition.slug}`}
                      className="block p-4 border rounded hover:shadow-lg transition"
                    >
                      <h3 className="font-medium">{condition.name}</h3>
                      {condition.subtitle && (
                        <p className="text-gray-600 mt-2">{condition.subtitle}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.drugs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Drugs</h2>
                <div className="grid gap-6">
                  {results.drugs.map(drug => (
                    <Link
                      key={drug.id}
                      href={`/drugs/${drug.slug}`}
                      className="block p-4 border rounded hover:shadow-lg transition"
                    >
                      <h3 className="font-medium">{drug.name}</h3>
                      {drug.type && (
                        <p className="text-gray-600 mt-2">Type: {drug.type}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}