import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import ArticleCard from '../components/ArticleCard';
import { fetchWellBeingArticles } from '../utils/api';

export default function WellBeing({ featuredArticles, categories, articlesMap }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const displayArticles = activeCategory === 'all' 
    ? Object.values(articlesMap).flat().slice(0, 9) 
    : articlesMap[activeCategory] || [];

  return (
    <>
      <NextSeo
        title="Well-Being - HealthInfo"
        description="Discover resources for healthy living, fitness, nutrition, mental health, and overall wellness to improve your well-being."
        canonical="https://healthinfo.com/well-being"
      />
    
      <div className="container-custom py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Well-Being</h1>
          <p className="text-neutral-600">
            Resources for healthy living, fitness, nutrition, mental health, stress management, and overall wellness.
          </p>
        </div>
        
        {/* Featured articles */}
        {featuredArticles && featuredArticles.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <div key={article.id} className="relative rounded-lg overflow-hidden shadow-md group h-60 md:h-80">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-200"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                    <div className="absolute bottom-0 p-4 text-white">
                      <span className="text-xs font-medium bg-primary px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold mt-2 mb-1">
                        <Link href={`/articles/${article.slug}`} className="hover:underline">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-white/90 line-clamp-2">{article.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Category tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-neutral-200">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
              onClick={() => setActiveCategory('all')}
            >
              All Topics
            </button>
            
            {categories.map((category) => (
              <button
                key={category.slug}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeCategory === category.slug
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Articles by category */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.length > 0 ? (
              displayArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <p className="text-neutral-500">No articles found in this category.</p>
              </div>
            )}
          </div>
          
          {displayArticles.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href={activeCategory === 'all' ? '/well-being/all' : `/well-being/${activeCategory}`}
                className="btn-primary inline-block"
              >
                View More
              </Link>
            </div>
          )}
        </div>
        
        {/* Wellness resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Wellness Tools</h2>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/tools/bmi-calculator" 
                  className="flex items-center text-neutral-700 hover:text-primary transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <span>BMI Calculator</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/tools/calorie-calculator" 
                  className="flex items-center text-neutral-700 hover:text-primary transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span>Calorie Calculator</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/tools/water-intake-calculator" 
                  className="flex items-center text-neutral-700 hover:text-primary transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                  </div>
                  <span>Water Intake Calculator</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/tools/stress-assessment" 
                  className="flex items-center text-neutral-700 hover:text-primary transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <span>Stress Assessment</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/tools/sleep-calculator" 
                  className="flex items-center text-neutral-700 hover:text-primary transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                  </div>
                  <span>Sleep Calculator</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Healthy Living Tips</h2>
            <ul className="space-y-4">
              <li className="flex">
                <div className="flex-shrink-0 text-primary font-bold text-lg mr-3">01.</div>
                <div>
                  <h3 className="font-semibold">Stay Physically Active</h3>
                  <p className="text-sm text-neutral-600">
                    Aim for at least 150 minutes of moderate activity or 75 minutes of vigorous activity each week.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 text-primary font-bold text-lg mr-3">02.</div>
                <div>
                  <h3 className="font-semibold">Eat a Balanced Diet</h3>
                  <p className="text-sm text-neutral-600">
                    Focus on fruits, vegetables, whole grains, lean proteins, and healthy fats.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 text-primary font-bold text-lg mr-3">03.</div>
                <div>
                  <h3 className="font-semibold">Get Enough Sleep</h3>
                  <p className="text-sm text-neutral-600">
                    Adults should aim for 7-9 hours of quality sleep each night.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 text-primary font-bold text-lg mr-3">04.</div>
                <div>
                  <h3 className="font-semibold">Manage Stress</h3>
                  <p className="text-sm text-neutral-600">
                    Practice stress-reduction techniques like mindfulness, meditation, or deep breathing.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 text-primary font-bold text-lg mr-3">05.</div>
                <div>
                  <h3 className="font-semibold">Stay Hydrated</h3>
                  <p className="text-sm text-neutral-600">
                    Drink enough water throughout the day. The recommended amount varies by individual needs.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const data = await fetchWellBeingArticles();
    
    const categories = [
      { name: 'Nutrition', slug: 'nutrition' },
      { name: 'Fitness', slug: 'fitness' },
      { name: 'Mental Health', slug: 'mental-health' },
      { name: 'Sleep', slug: 'sleep' },
      { name: 'Stress Management', slug: 'stress-management' },
      { name: 'Healthy Aging', slug: 'healthy-aging' },
    ];
    
    // Organize articles by category
    const articlesMap = {};
    categories.forEach(category => {
      articlesMap[category.slug] = data.articles.filter(
        article => article.category?.toLowerCase() === category.name.toLowerCase()
      );
    });
    
    return {
      props: {
        featuredArticles: data.featured || [],
        categories,
        articlesMap,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching well-being data:', error);
    return {
      props: {
        featuredArticles: [],
        categories: [],
        articlesMap: {},
      },
      revalidate: 60,
    };
  }
}
