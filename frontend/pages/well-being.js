import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import ArticleCard from '../components/ArticleCard';
import BMICalculator from '../components/calculators/BMICalculator';
import CalorieCalculator from '../components/calculators/CalorieCalculator';
import WaterIntakeCalculator from '../components/calculators/WaterIntakeCalculator';
import StressAssessment from '../components/calculators/StressAssessment';
import SleepCalculator from '../components/calculators/SleepCalculator';
import { fetchWellBeingArticles } from '../utils/api';

export default function WellBeing({ featuredArticles, categories, articlesMap }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTool, setActiveTool] = useState(null);

  const displayArticles = activeCategory === 'all' 
    ? Object.values(articlesMap).flat().slice(0, 9) 
    : articlesMap[activeCategory] || [];

  const tools = {
    bmi: { name: 'BMI Calculator', component: BMICalculator },
    calories: { name: 'Calorie Calculator', component: CalorieCalculator },
    water: { name: 'Water Intake Calculator', component: WaterIntakeCalculator },
    stress: { name: 'Stress Assessment', component: StressAssessment },
    sleep: { name: 'Sleep Calculator', component: SleepCalculator }
  };

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

        {/* Health Tools & Calculators */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Health Tools & Calculators</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(tools).map(([key, tool]) => (
              <button
                key={key}
                onClick={() => setActiveTool(key)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTool === key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tool.name}
              </button>
            ))}
          </div>
          {activeTool && (
            <div className="max-w-2xl mx-auto mb-8">
              {tools[activeTool].component && React.createElement(tools[activeTool].component)}
            </div>
          )}
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

        {/* Article categories */}
        <div className="mb-12">
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

        {/* Articles grid */}
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