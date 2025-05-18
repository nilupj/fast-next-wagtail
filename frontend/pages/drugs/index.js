import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getDrugs } from '../../utils/api';
import { NextSeo } from 'next-seo';

export default function DrugListingPage() {
  const [activeTab, setActiveTab] = useState('P');
  const [drugs, setDrugs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    getDrugs()
      .then(data => {
        // Group drugs by first letter
        const grouped = {};
        alphabet.forEach(letter => {
          grouped[letter] = data.filter(drug => {
            const title = drug.title || '';
            const genericName = drug.generic_name || '';
            const brandNames = drug.brand_names || '';
            return (
              title.toUpperCase().startsWith(letter) ||
              genericName.toUpperCase().startsWith(letter) ||
              brandNames.toUpperCase().split(',').some(name => name.trim().startsWith(letter))
            );
          });
        });
        setDrugs(grouped);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading drugs:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
        <div className="flex flex-wrap gap-2 mb-8">
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => setActiveTab(letter)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === letter
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {letter}
            </button>
          ))}
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
                    {drug.generic_name || drug.title}
                  </h3>
                  {drug.brand_names && (
                    <p className="text-sm text-gray-600 mt-1">({drug.brand_names})</p>
                  )}
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
      </div>
    </Layout>
  );
}