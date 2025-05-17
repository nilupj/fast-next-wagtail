
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getDrugs } from '../../utils/api';
import { NextSeo } from 'next-seo';

export default function DrugListingPage() {
  const [drugs, setDrugs] = useState([]);
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
      grouped[letter] = [];
    });

    drugList.forEach(drug => {
      const firstLetter = drug.title.charAt(0).toUpperCase();
      if (grouped[firstLetter]) {
        grouped[firstLetter].push(drug);
      }
    });

    return grouped;
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
        title="Drug Index - HealthInfo"
        description="Complete index of drugs and medications"
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Drug Index</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(drugs).map(letter => (
              <a
                key={letter}
                href={`#${letter}`}
                className="px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>

          {Object.entries(drugs).map(([letter, drugList]) => (
            <div key={letter} id={letter} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary">{letter}</h2>
              {drugList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drugList.map(drug => (
                    <Link
                      key={drug.id}
                      href={`/drugs/${drug.slug}`}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-medium">{drug.title}</h3>
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
          ))}
        </div>
      </div>
    </Layout>
  );
}
