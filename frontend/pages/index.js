import { useState, useEffect } from 'react';
import Link from 'next/link';
import FeaturedArticle from '../components/FeaturedArticle';
import ArticleCard from '../components/ArticleCard';
import { fetchTopStories, fetchHealthTopics } from '../utils/api';

// Fallback data for development until backend is ready
const fallbackTopStories = [
  {
    id: 1,
    title: 'COVID-19 Updates: What You Need to Know',
    slug: 'covid-19-updates',
    summary: 'Latest information on COVID-19 variants, vaccines, and prevention measures.',
    image: 'https://images.unsplash.com/photo-1584118624012-df056829fbd0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
    published_date: '2025-03-15T08:00:00Z',
    author: { name: 'Dr. Sarah Johnson', credentials: 'MD, MPH' },
    category: { name: 'Infectious Disease', slug: 'infectious-disease' }
  },
  {
    id: 2,
    title: 'Understanding Heart Health: Risk Factors and Prevention',
    slug: 'understanding-heart-health',
    summary: 'Learn about the key risk factors for heart disease and effective prevention strategies.',
    image: 'https://images.unsplash.com/photo-1559757175-7b21671c7e96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    published_date: '2025-03-14T10:30:00Z',
    author: { name: 'Dr. Robert Chen', credentials: 'MD, FACC' },
    category: { name: 'Cardiology', slug: 'cardiology' }
  },
  {
    id: 3,
    title: 'Mental Health Awareness: Breaking the Stigma',
    slug: 'mental-health-awareness',
    summary: 'Why it\'s important to discuss mental health openly and seek help when needed.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    published_date: '2025-03-13T09:45:00Z',
    author: { name: 'Dr. Emily Watson', credentials: 'Ph.D, Clinical Psychology' },
    category: { name: 'Mental Health', slug: 'mental-health' }
  },
  {
    id: 4,
    title: 'Nutrition Myths: Separating Fact from Fiction',
    slug: 'nutrition-myths',
    summary: 'Debunking common misconceptions about diet and nutrition for better health.',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    published_date: '2025-03-12T14:20:00Z',
    author: { name: 'Lisa Martinez', credentials: 'RD, LDN' },
    category: { name: 'Nutrition', slug: 'nutrition' }
  }
];

const fallbackHealthTopics = [
  {
    id: 5,
    title: 'Sleep Hygiene: Tips for Better Rest',
    slug: 'sleep-hygiene-tips',
    summary: 'Simple changes to improve your sleep quality and overall health.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    published_date: '2025-03-10T16:15:00Z',
    category: { name: 'Wellness', slug: 'wellness' }
  },
  {
    id: 6,
    title: 'Exercise for Beginners: Starting a Sustainable Routine',
    slug: 'exercise-for-beginners',
    summary: 'How to build an exercise habit that lasts without getting overwhelmed.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    published_date: '2025-03-09T11:30:00Z',
    category: { name: 'Fitness', slug: 'fitness' }
  },
  {
    id: 7,
    title: 'Stress Management Techniques That Actually Work',
    slug: 'stress-management-techniques',
    summary: 'Practical approaches to reduce stress and improve your mental wellbeing.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    published_date: '2025-03-08T09:45:00Z',
    category: { name: 'Mental Health', slug: 'mental-health' }
  },
  {
    id: 8,
    title: 'Healthy Eating on a Budget: Smart Shopping Guide',
    slug: 'healthy-eating-budget',
    summary: 'Tips for nutritious meals without breaking the bank.',
    image: 'https://images.unsplash.com/photo-1543168256-418811576931?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    published_date: '2025-03-07T10:20:00Z',
    category: { name: 'Nutrition', slug: 'nutrition' }
  }
];

export default function Home({ initialTopStories, healthTopics }) {
  // Use provided data or fallback to development data
  const [topStories, setTopStories] = useState(
    initialTopStories && initialTopStories.length > 0 ? initialTopStories : fallbackTopStories
  );

  // Use provided health topics or fallback
  const displayHealthTopics = healthTopics && healthTopics.length > 0 ? healthTopics : fallbackHealthTopics;

  useEffect(() => {
    // If no data was provided and we're not using fallback, try fetching client-side
    if (!initialTopStories || initialTopStories.length === 0) {
      const fetchData = async () => {
        try {
          const stories = await fetchTopStories();
          if (stories && stories.length > 0) {
            setTopStories(stories);
          }
        } catch (error) {
          console.error('Error fetching top stories:', error);
          // Keep using fallback data if fetch fails
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

        {displayHealthTopics && displayHealthTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayHealthTopics.map((topic) => (
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

      {/* Tools & Calculators */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title mb-0">TOOLS & CALCULATORS</h2>
          <Link href="/tools" className="text-primary hover:text-primary-dark font-medium text-sm transition-colors">
            View All Tools
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'BMI Calculator', icon: 'scale', url: '/tools/bmi-calculator' },
            { name: 'Calorie Calculator', icon: 'fire', url: '/tools/calorie-calculator' },
            { name: 'Water Intake', icon: 'droplet', url: '/tools/water-intake-calculator' },
            { name: 'Sleep Calculator', icon: 'moon', url: '/tools/sleep-calculator' },
            { name: 'Stress Assessment', icon: 'activity', url: '/tools/stress-assessment' },
          ].map((tool) => (
            <Link
              key={tool.name}
              href={tool.url}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium">{tool.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mb-12">
        <h2 className="section-title mb-6">TRENDING TOPICS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'COVID-19 Updates', count: '2.5K discussions' },
            { title: 'Mental Health Awareness', count: '1.8K discussions' },
            { title: 'Nutrition & Diet', count: '1.2K discussions' },
            { title: 'Exercise & Fitness', count: '950 discussions' },
            { title: 'Sleep Health', count: '820 discussions' },
            { title: 'Stress Management', count: '780 discussions' },
          ].map((topic, index) => (
            <Link
              key={index}
              href={`/search?q=${encodeURIComponent(topic.title)}`}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="rounded-full bg-primary/10 p-2 mr-3">
                  <span className="text-primary font-semibold">{index + 1}</span>
                </div>
                <span className="font-medium">{topic.title}</span>
              </div>
              <span className="text-sm text-neutral-500">{topic.count}</span>
            </Link>
          ))}
        </div>
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