import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { searchContent } from '../utils/api';

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
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    
    const fetchResults = async () => {
      setLoading(true);
      setError('');
      
      try {
        const data = await searchContent(query);
        setResults(data);
      } catch (err) {
        setError('Error fetching search results. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query]);
  
  const totalResults = 
    results.articles.length + 
    results.conditions.length + 
    results.drugs.length;
  
  // Filter results based on active tab
  const displayResults = () => {
    if (activeTab === 'all') {
      return (
        <>
          {results.articles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Articles</h3>
              <ul className="space-y-4">
                {results.articles.map(item => renderArticleItem(item))}
              </ul>
              {results.articles.length > 5 && (
                <div className="mt-3">
                  <button 
                    className="text-primary hover:underline text-sm font-medium"
                    onClick={() => setActiveTab('articles')}
                  >
                    View all article results
                  </button>
                </div>
              )}
            </div>
          )}
          
          {results.conditions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Health Conditions</h3>
              <ul className="space-y-4">
                {results.conditions.slice(0, 5).map(item => renderConditionItem(item))}
              </ul>
              {results.conditions.length > 5 && (
                <div className="mt-3">
                  <button 
                    className="text-primary hover:underline text-sm font-medium"
                    onClick={() => setActiveTab('conditions')}
                  >
                    View all condition results
                  </button>
                </div>
              )}
            </div>
          )}
          
          {results.drugs.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Drugs & Supplements</h3>
              <ul className="space-y-4">
                {results.drugs.slice(0, 5).map(item => renderDrugItem(item))}
              </ul>
              {results.drugs.length > 5 && (
                <div className="mt-3">
                  <button 
                    className="text-primary hover:underline text-sm font-medium"
                    onClick={() => setActiveTab('drugs')}
                  >
                    View all drug results
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      );
    } else if (activeTab === 'articles') {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-4">Articles</h3>
          {results.articles.length > 0 ? (
            <ul className="space-y-4">
              {results.articles.map(item => renderArticleItem(item))}
            </ul>
          ) : (
            <p className="text-neutral-500">No article results found.</p>
          )}
        </div>
      );
    } else if (activeTab === 'conditions') {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-4">Health Conditions</h3>
          {results.conditions.length > 0 ? (
            <ul className="space-y-4">
              {results.conditions.map(item => renderConditionItem(item))}
            </ul>
          ) : (
            <p className="text-neutral-500">No condition results found.</p>
          )}
        </div>
      );
    } else if (activeTab === 'drugs') {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-4">Drugs & Supplements</h3>
          {results.drugs.length > 0 ? (
            <ul className="space-y-4">
              {results.drugs.map(item => renderDrugItem(item))}
            </ul>
          ) : (
            <p className="text-neutral-500">No drug results found.</p>
          )}
        </div>
      );
    }
  };
  
  const renderArticleItem = (item) => (
    <li key={item.id || item.slug} className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-medium mb-1">
        <Link href={`/articles/${item.slug}`} className="text-primary hover:text-primary-light transition-colors">
          {item.title}
        </Link>
      </h4>
      <p className="text-sm text-neutral-600 mb-2 line-clamp-2">{item.summary || item.subtitle}</p>
      <div className="flex items-center text-xs text-neutral-500">
        {item.category && <span className="mr-3">{item.category}</span>}
        {item.created_at && (
          <time dateTime={item.created_at}>
            {new Date(item.created_at).toLocaleDateString()}
          </time>
        )}
      </div>
    </li>
  );
  
  const renderConditionItem = (item) => (
    <li key={item.id || item.slug} className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-medium mb-1">
        <Link href={`/conditions/${item.slug}`} className="text-primary hover:text-primary-light transition-colors">
          {item.name}
        </Link>
      </h4>
      <p className="text-sm text-neutral-600 line-clamp-2">{item.subtitle}</p>
    </li>
  );
  
  const renderDrugItem = (item) => (
    <li key={item.id || item.slug} className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-medium mb-1">
        <Link href={`/drugs/${item.slug}`} className="text-primary hover:text-primary-light transition-colors">
          {item.name}
        </Link>
      </h4>
      {item.type && <p className="text-sm text-neutral-600">{item.type}</p>}
    </li>
  );
  
  return (
    <>
      <NextSeo
        title={query ? `Search results for "${query}" - HealthInfo` : 'Search - HealthInfo'}
        noindex={true}
      />
      
      <div className="container-custom py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {query ? `Search results for "${query}"` : 'Search'}
          </h1>
          {!loading && query && (
            <p className="text-neutral-600">
              Found {totalResults} {totalResults === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>
        
        {/* Search form */}
        <div className="mb-8">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const searchQuery = formData.get('search');
              router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            }}
            className="flex max-w-2xl"
          >
            <div className="relative flex-grow">
              <input
                type="text"
                name="search"
                placeholder="Search for health information..."
                defaultValue={query || ''}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-light text-white font-medium py-3 px-6 rounded-r-md transition-colors"
            >
              Search
            </button>
          </form>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-3 text-neutral-600">Searching...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* No results state */}
        {!loading && !error && query && totalResults === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-lg font-medium text-neutral-800">No results found</h2>
            <p className="mt-2 text-neutral-600">
              We couldn't find any content matching your search. Please try a different search term or browse our topics below.
            </p>
            <div className="mt-6">
              <Link href="/conditions" className="text-primary hover:text-primary-light font-medium transition-colors">
                Browse Health Conditions
              </Link>
            </div>
          </div>
        )}
        
        {/* Results */}
        {!loading && !error && query && totalResults > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-medium mb-3">Filter Results</h3>
                <div className="space-y-2">
                  <button
                    className={`block w-full text-left px-3 py-2 rounded ${activeTab === 'all' ? 'bg-primary text-white' : 'hover:bg-neutral-100'}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All Results ({totalResults})
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 rounded ${activeTab === 'articles' ? 'bg-primary text-white' : 'hover:bg-neutral-100'}`}
                    onClick={() => setActiveTab('articles')}
                  >
                    Articles ({results.articles.length})
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 rounded ${activeTab === 'conditions' ? 'bg-primary text-white' : 'hover:bg-neutral-100'}`}
                    onClick={() => setActiveTab('conditions')}
                  >
                    Health Conditions ({results.conditions.length})
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 rounded ${activeTab === 'drugs' ? 'bg-primary text-white' : 'hover:bg-neutral-100'}`}
                    onClick={() => setActiveTab('drugs')}
                  >
                    Drugs & Supplements ({results.drugs.length})
                  </button>
                </div>
              </div>
            </div>
            
            {/* Results list */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                {displayResults()}
              </div>
            </div>
          </div>
        )}
        
        {/* Popular searches */}
        {!query && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Popular Searches</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {['COVID-19', 'Diabetes', 'Heart Disease', 'High Blood Pressure', 
                'Anxiety', 'Depression', 'Weight Loss', 'Vitamin D',
                'Thyroid', 'Cholesterol', 'ADHD', 'Arthritis'].map(term => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition-colors rounded-md px-3 py-2 text-center"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
