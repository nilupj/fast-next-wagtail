import { useState, useEffect } from 'react';
import Link from 'next/link';
import FeaturedArticle from '../components/FeaturedArticle';
import ArticleCard from '../components/ArticleCard';
import { fetchTopStories, fetchHealthTopics } from '../utils/api';

export default function Home({ initialTopStories, healthTopics }) {
  const [topStories, setTopStories] = useState(initialTopStories);
  
  useEffect(() => {
    // If initial data wasn't provided, fetch it client-side
    if (!initialTopStories) {
      const fetchData = async () => {
        try {
          const stories = await fetchTopStories();
          setTopStories(stories);
        } catch (error) {
          console.error('Error fetching top stories:', error);
        }
      };
      
      fetchData();
    }
  }, [initialTopStories]);

  return (
    <div className="container-custom py-8">
      {/* Top stories section */}
      <div className="mb-12">
        <h2 className="section-title">TODAY'S TOP STORIES</h2>
        
        {topStories && topStories.length > 0 ? (
          <>
            <div className="mb-8">
              <FeaturedArticle article={topStories[0]} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topStories.slice(1, 4).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="animate-pulse">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-neutral-200"></div>
              <div className="mx-auto w-48 h-4 mb-4 rounded bg-neutral-200"></div>
              <div className="mx-auto w-36 h-3 rounded bg-neutral-200"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Health topics section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title mb-0">LIVING HEALTHY</h2>
          <Link href="/health-topics" className="text-primary hover:text-primary-dark font-medium text-sm transition-colors">
            View All
          </Link>
        </div>
        
        {healthTopics && healthTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {healthTopics.map((topic) => (
              <ArticleCard key={topic.id} article={topic} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="animate-pulse">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-neutral-200"></div>
              <div className="mx-auto w-48 h-4 mb-4 rounded bg-neutral-200"></div>
              <div className="mx-auto w-36 h-3 rounded bg-neutral-200"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Popular health categories */}
      <div>
        <h2 className="section-title">EXPLORE HEALTH CATEGORIES</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: 'Heart Disease', icon: 'heart', url: '/conditions/heart-disease' },
            { name: 'Diabetes', icon: 'activity', url: '/conditions/diabetes' },
            { name: 'Cancer', icon: 'thermometer', url: '/conditions/cancer' },
            { name: 'Mental Health', icon: 'brain', url: '/conditions/mental-health' },
            { name: 'Skin Conditions', icon: 'sun', url: '/conditions/skin-conditions' },
            { name: 'Digestive Health', icon: 'stomach', url: '/conditions/digestive-health' },
            { name: 'Women\'s Health', icon: 'female', url: '/conditions/womens-health' },
            { name: 'Men\'s Health', icon: 'male', url: '/conditions/mens-health' },
          ].map((category) => (
            <Link
              key={category.name}
              href={category.url}
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="rounded-full bg-primary/10 p-3 mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Server-side data fetching
export async function getStaticProps() {
  try {
    const [topStories, healthTopics] = await Promise.all([
      fetchTopStories(),
      fetchHealthTopics()
    ]);

    return {
      props: {
        initialTopStories: topStories,
        healthTopics,
      },
      // Revalidate every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialTopStories: [],
        healthTopics: [],
      },
      revalidate: 60, // Try again more quickly if there was an error
    };
  }
}
