import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import Layout from '../../components/Layout';
import { fetchCondition, fetchConditionPaths } from '../../utils/api';

export default function ConditionDetail({ condition }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <div className="animate-pulse p-8">
          <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8"></div>
        </div>
      </Layout>
    );
  }

  if (!condition) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Condition Not Found</h1>
          <Link href="/conditions" className="text-primary hover:underline">
            Browse All Conditions
          </Link>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'newly-diagnosed', label: 'Newly Diagnosed' },
    { id: 'treatments', label: 'Treatments' },
    { id: 'symptoms', label: 'Symptoms & Causes' },
    { id: 'mental-wellbeing', label: 'Mental Well-being' },
    { id: 'living-with', label: 'Living Well' },
  ];

  return (
    <Layout>
      <NextSeo
        title={`${condition.name} - Symptoms, Causes and Treatment`}
        description={condition.subtitle || `Learn about ${condition.name}, including symptoms, causes, treatment options, and prevention.`}
      />

      {/* Hero Section */}
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary mb-3">{condition.name}</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Supporting your health & well-being at every stage of your {condition.name.toLowerCase()} journey
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-3 mt-8">
            {tabs.map(tab => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className="px-6 py-3 bg-white rounded-full text-primary hover:bg-primary hover:text-white transition duration-300"
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Newly Diagnosed Section */}
        <section id="newly-diagnosed" className="mb-16">
          <h2 className="text-2xl font-bold mb-8">NEWLY DIAGNOSED</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                {condition.image && (
                  <Image
                    src={condition.image}
                    alt={condition.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">
                  A Comprehensive Guide to {condition.name}
                </h3>
                <div className="prose" dangerouslySetInnerHTML={{ __html: condition.overview }} />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <div className="bg-teal-700 text-white rounded-lg p-8 mb-16">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-3">Get Our Weekly {condition.name} Newsletter</h3>
            <p className="mb-6">Stay up to date with the latest research on managing your condition.</p>
            <form className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded text-gray-800"
              />
              <button className="bg-white text-teal-700 px-6 py-2 rounded font-medium">
                SIGN UP
              </button>
            </form>
          </div>
        </div>

        {/* Treatments Section */}
        <section id="treatments" className="mb-16">
          <h2 className="text-2xl font-bold mb-8">TREATMENTS</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: condition.treatments }} />
        </section>

        {/* Additional Sections */}
        <section id="symptoms" className="mb-16">
          <h2 className="text-2xl font-bold mb-8">SYMPTOMS & CAUSES</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: condition.symptoms }} />
          <div className="mt-8 prose max-w-none" dangerouslySetInnerHTML={{ __html: condition.causes }} />
        </section>

        <section id="living-with" className="mb-16">
          <h2 className="text-2xl font-bold mb-8">LIVING WITH {condition.name.toUpperCase()}</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: condition.prevention }} />
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const paths = await fetchConditionPaths();
    
    return {
      paths: paths.map(slug => ({ params: { slug } })),
      fallback: true, // Show a loading state while generating pages on-demand
    };
  } catch (error) {
    console.error('Error fetching condition paths:', error);
    return {
      paths: [],
      fallback: true,
    };
  }
}

export async function getStaticProps({ params, locale }) {
  try {
    const condition = await fetchCondition(params.slug, locale || 'en');
    
    if (!condition) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        condition,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error(`Error fetching condition ${params.slug}:`, error);
    return {
      notFound: true,
    };
  }
}