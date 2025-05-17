
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getDrugs } from '../../utils/api';
import { NextSeo } from 'next-seo';

export default function DrugListingPage() {
  const [activeTab, setActiveTab] = useState('A');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const { drugs, loading, error } = useDrugs();

  useEffect(() => {
    if (drugs) {
      console.log('Loaded drugs:', drugs);
    }
  }, [drugs]);

  const getDrugTitle = (drug) => {
    if (drug.generic_name && drug.brand_names) {
      return `${drug.generic_name} (${drug.brand_names})`;
    }
    return drug.title || drug.generic_name || drug.brand_names;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <NextSeo
        title="Drug Index A-Z - HealthInfo"
        description="Browse our comprehensive directory of drugs and medications, complete with detailed information on uses, dosage, side effects, and precautions."
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Drug Index A-Z</h1>
        <p className="text-gray-600 mb-8">
          Browse our comprehensive directory of drugs and medications, complete with detailed information on uses, dosage, side effects, and precautions.
        </p>

        {/* Alphabet navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-1 min-w-max border-b border-primary">
            {alphabet.map((letter) => (
              <button
                key={letter}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === letter
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Drug listings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">{activeTab}</h2>
          
          {drugs[activeTab] && drugs[activeTab].length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drugs[activeTab].map((drug) => (
                <Link
                  key={drug.id}
                  href={`/drugs/${drug.slug}`}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-primary">
                    {drug.title || (drug.generic_name && `${drug.generic_name} ${drug.brand_names ? `(${drug.brand_names})` : ''}`)}
                  </h3>
                  {drug.drug_class && (
                    <p className="text-sm text-gray-600 mt-1">{drug.drug_class}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No drugs found for this letter.</p>
          )}
        </div>

        {/* Common drug categories */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Common Drug Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commonCategories.map((category) => (
              <div key={category.title} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-medium text-primary mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

const commonCategories = [
  {
    title: "Antibiotics",
    description: "Medications that fight bacterial infections"
  },
  {
    title: "Pain Relievers",
    description: "Drugs that help reduce pain and inflammation"
  },
  {
    title: "Antidepressants",
    description: "Medications for treating depression and anxiety"
  },
  {
    title: "Blood Pressure Medications",
    description: "Drugs that help control blood pressure"
  }
];

function useDrugs() {
  const [drugs, setDrugs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDrugs()
      .then(data => {
        const groupedDrugs = groupDrugsByFirstLetter(data);
        setDrugs(groupedDrugs);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching drugs:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const groupDrugsByFirstLetter = (drugList) => {
    const grouped = {};
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
      grouped[letter] = drugList.filter(drug => 
        drug.title.toUpperCase().startsWith(letter)
      );
    });
    return grouped;
  };

  return { drugs, loading, error };
}
