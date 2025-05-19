The code integrates fetching of latest news articles from Wagtail CMS and displays them in the component.
```
```replit_final_file
import { useState, useEffect } from 'react';
import Link from 'next/link';
import FeaturedArticle from '../components/FeaturedArticle';
import ArticleCard from '../components/ArticleCard';
import { fetchTopStories, fetchHealthTopics } from '../utils/api';

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

import { fetchLatestNews } from '../utils/api';
export default function Home({ initialTopStories, healthTopics }) {
  const [topStories, setTopStories] = useState(
    initialTopStories && initialTopStories.length > 0 ? initialTopStories : fallbackTopStories
  );

  const displayHealthTopics = healthTopics && healthTopics.length > 0 ? healthTopics : fallbackHealthTopics;
    const [latestNews, setLatestNews] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialTopStories || initialTopStories.length === 0) {
      const fetchData = async () => {
        try {
          const stories = await fetchTopStories();
          if (stories && stories.length > 0) {
            setTopStories(stories);
          }
        } catch (error) {
          console.error('Error fetching top stories:', error);
        }
      };

      fetchData();
    }

    fetchLatestNews()
      .then(data => {
        setLatestNews(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading news:', error);
        setLoading(false);
      });
  }, [initialTopStories]);

  const QuizCard = ({ quiz }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img className="w-full h-48 object-cover" src={quiz.image} alt={quiz.title} />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
        <p className="text-sm text-neutral-500">{quiz.description}</p>
        <Link href={`/quiz/${quiz.slug}`} className="mt-4 inline-block text-primary hover:text-primary-dark font-medium text-sm transition-colors">
          Take Quiz
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container-custom py-8">
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

      {/* Latest Health News */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title mb-0">LATEST HEALTH NEWS</h2>
          <Link href="/health-news" className="text-primary hover:text-primary-dark font-medium text-sm transition-colors">
            View All News
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading news...</p>
          ) : (
            latestNews.map(article => (
              <ArticleCard
                key={article.id}
                article={{
                  id: article.id,
                  title: article.title,
                  slug: article.slug,
                  image: article.image,
                  summary: article.summary,
                  category: { name: article.category }
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Health Quizzes */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title mb-0">TEST YOUR HEALTH KNOWLEDGE</h2>
          <Link href="/quizzes" className="text-primary hover:text-primary-dark font-medium text-sm transition-colors">
            View All Quizzes
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuizCard
            quiz={{
              title: 'How Much Do You Know About Heart Health?',
              slug: 'heart-health-quiz',
              image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&h=500',
              description: 'Test your knowledge about cardiovascular health and learn important facts about your heart.'
            }}
          />
          <QuizCard
            quiz={{
              title: 'Mental Health Myths vs Facts',
              slug: 'mental-health-quiz',
              image: 'https://images.unsplash.com/photo-1547561091-3d985041d42f?auto=format&fit=crop&w=800&h=500',
              description: 'Can you separate fact from fiction when it comes to mental health?'
            }}
          />
          <QuizCard
            quiz={{
              title: 'Nutrition IQ Quiz',
              slug: 'nutrition-quiz',
              image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&h=500',
              description: 'Challenge yourself with this comprehensive quiz about nutrition and healthy eating habits.'
            }}
          />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="section-title">TRENDING TOPICS</h2>
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
            { name: "Women's Health", icon: 'female', url: '/conditions/womens-health' },
            { name: "Men's Health", icon: 'male', url: '/conditions/mens-health' },
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
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialTopStories: [],
        healthTopics: [],
      },
      revalidate: 60,
    };
  }
}