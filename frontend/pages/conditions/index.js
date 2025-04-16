import { useState } from 'react';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { fetchConditionsIndex } from '../../utils/api';

export default function ConditionsIndex({ conditionsByLetter }) {
  const [activeTab, setActiveTab] = useState('A');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <>
      <NextSeo
        title="Health Conditions A-Z - HealthInfo"
        description="Browse all health conditions alphabetically. Find symptoms, treatments, and prevention for hundreds of medical conditions."
        canonical="https://healthinfo.com/conditions"
      />
    
      <div className="container-custom py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Health Conditions A-Z</h1>
          <p className="text-neutral-600">
            Browse our comprehensive directory of health conditions and diseases, complete with detailed information on symptoms, causes, treatments, and prevention.
          </p>
        </div>
        
        {/* Alphabet navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {alphabet.map((letter) => (
              <button
                key={letter}
                className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === letter
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
                onClick={() => setActiveTab(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="h-1 bg-primary"></div>
        </div>
        
        {/* Conditions list */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {alphabet.map((letter) => (
            <div
              key={letter}
              className={`${activeTab === letter ? 'block' : 'hidden'}`}
            >
              <h2 className="text-2xl font-bold text-primary mb-4">{letter}</h2>
              
              {conditionsByLetter[letter] && conditionsByLetter[letter].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                  {conditionsByLetter[letter].map((condition) => (
                    <Link
                      key={condition.slug}
                      href={`/conditions/${condition.slug}`}
                      className="py-2 text-primary hover:text-primary-light transition-colors border-b border-neutral-100"
                    >
                      {condition.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 italic">No conditions found starting with this letter.</p>
              )}
            </div>
          ))}
        </div>
        
        {/* Common health concerns section */}
        <div className="mt-12">
          <h2 className="section-title">COMMON HEALTH CONCERNS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Allergies', description: 'Symptoms, treatments and prevention', url: '/conditions/allergies' },
              { name: 'Anxiety', description: 'Causes, symptoms and coping strategies', url: '/conditions/anxiety' },
              { name: 'Arthritis', description: 'Types, symptoms and management', url: '/conditions/arthritis' },
              { name: 'Asthma', description: 'Triggers, treatments and control', url: '/conditions/asthma' },
              { name: 'Depression', description: 'Symptoms, diagnosis and treatment', url: '/conditions/depression' },
              { name: 'Diabetes', description: 'Types, symptoms and management', url: '/conditions/diabetes' },
              { name: 'High Blood Pressure', description: 'Risks, prevention and treatment', url: '/conditions/high-blood-pressure' },
              { name: 'Migraine', description: 'Triggers, symptoms and relief', url: '/conditions/migraine' },
            ].map((condition) => (
              <Link
                key={condition.name}
                href={condition.url}
                className="card hover:shadow-md transition-shadow p-4"
              >
                <h3 className="font-semibold text-lg mb-1">{condition.name}</h3>
                <p className="text-sm text-neutral-600">{condition.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const conditionsData = await fetchConditionsIndex();
    
    // Organize conditions by first letter
    const conditionsByLetter = {};
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
      conditionsByLetter[letter] = conditionsData.filter(condition => 
        condition.name.toUpperCase().startsWith(letter)
      );
    });

    return {
      props: {
        conditionsByLetter,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return {
      props: {
        conditionsByLetter: {},
      },
      revalidate: 60,
    };
  }
}
