import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import { fetchCondition, fetchConditionPaths } from '../../utils/api';

export default function ConditionDetail({ condition }) {
  const router = useRouter();

  // If fallback is true and the page is being generated
  if (router.isFallback) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8"></div>
          <div className="h-48 bg-neutral-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!condition) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">Condition Not Found</h1>
        <p className="text-neutral-600 mb-6">The condition you are looking for does not exist or has been moved.</p>
        <Link href="/conditions" className="btn-primary">
          Browse All Conditions
        </Link>
      </div>
    );
  }

  const {
    name,
    subtitle,
    overview,
    symptoms,
    causes,
    diagnosis,
    treatments,
    prevention,
    complications,
    related_conditions,
    image,
  } = condition;

  return (
    <>
      <NextSeo
        title={`${name} - Symptoms, Causes and Treatment - HealthInfo`}
        description={subtitle || `Learn about ${name}, including symptoms, causes, treatment options, and prevention.`}
        canonical={`https://healthinfo.com/conditions/${router.query.slug}`}
      />
    
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{name}</h1>
          {subtitle && <p className="text-lg text-neutral-600">{subtitle}</p>}
          
          {/* Breadcrumbs */}
          <nav className="text-sm text-neutral-500 mt-4">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <svg className="w-3 h-3 mx-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="flex items-center">
                <Link href="/conditions" className="hover:text-primary transition-colors">
                  Conditions
                </Link>
                <svg className="w-3 h-3 mx-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-neutral-600">{name}</span>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              {image && (
                <div className="relative h-64 w-full">
                  <Image 
                    src={image} 
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                {/* Table of contents */}
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">On this page</h2>
                  <ul className="space-y-1">
                    <li>
                      <a href="#overview" className="text-primary hover:text-primary-light transition-colors">Overview</a>
                    </li>
                    <li>
                      <a href="#symptoms" className="text-primary hover:text-primary-light transition-colors">Symptoms</a>
                    </li>
                    <li>
                      <a href="#causes" className="text-primary hover:text-primary-light transition-colors">Causes</a>
                    </li>
                    <li>
                      <a href="#diagnosis" className="text-primary hover:text-primary-light transition-colors">Diagnosis</a>
                    </li>
                    <li>
                      <a href="#treatments" className="text-primary hover:text-primary-light transition-colors">Treatments</a>
                    </li>
                    <li>
                      <a href="#prevention" className="text-primary hover:text-primary-light transition-colors">Prevention</a>
                    </li>
                    {complications && (
                      <li>
                        <a href="#complications" className="text-primary hover:text-primary-light transition-colors">Complications</a>
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Overview */}
                <section id="overview" className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4">Overview</h2>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: overview }} />
                </section>
                
                {/* Symptoms */}
                <section id="symptoms" className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4">Symptoms</h2>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: symptoms }} />
                </section>
                
                {/* Causes */}
                <section id="causes" className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4">Causes</h2>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: causes }} />
                </section>
                
                {/* Diagnosis */}
                <section id="diagnosis" className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4">Diagnosis</h2>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: diagnosis }} />
                </section>
                
                {/* Treatments */}
                <section id="treatments" className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4">Treatments</h2>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: treatments }} />
                </section>
                
                {/* Prevention */}
                <section id="prevention" className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4">Prevention</h2>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: prevention }} />
                </section>
                
                {/* Complications */}
                {complications && (
                  <section id="complications" className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">Complications</h2>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: complications }} />
                  </section>
                )}
                
                {/* Medical disclaimer */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Medical Disclaimer</h3>
                  <p className="text-blue-700 text-sm">
                    The content on this page is intended for informational purposes only and does not constitute medical advice. 
                    Always consult with qualified healthcare providers for diagnosis and treatment information and decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            {/* Quick facts */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Quick Facts</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Also known as</dt>
                  <dd className="mt-1 text-neutral-700">{condition.also_known_as || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Specialties</dt>
                  <dd className="mt-1 text-neutral-700">{condition.specialties || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Prevalence</dt>
                  <dd className="mt-1 text-neutral-700">{condition.prevalence || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Risk Factors</dt>
                  <dd className="mt-1 text-neutral-700">{condition.risk_factors || '-'}</dd>
                </div>
              </dl>
            </div>
            
            {/* Related conditions */}
            {related_conditions && related_conditions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Related Conditions</h3>
                <ul className="space-y-2">
                  {related_conditions.map((condition) => (
                    <li key={condition.slug}>
                      <Link
                        href={`/conditions/${condition.slug}`}
                        className="text-primary hover:text-primary-light transition-colors"
                      >
                        {condition.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Find a doctor */}
            <div className="bg-primary rounded-lg shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Find a Doctor</h3>
              <p className="mb-4 text-white/90">
                Connect with healthcare providers specializing in the treatment of {name}.
              </p>
              <Link
                href="/doctors"
                className="block w-full py-2 px-4 bg-white text-primary text-center font-medium rounded hover:bg-neutral-100 transition-colors"
              >
                Search Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
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
