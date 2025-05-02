import { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import Layout from '../components/Layout';
import { fetchDrugsIndex } from '../utils/api';

export default function DrugsSupplements() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDrugs();
  }, []);

  const loadDrugs = async () => {
    try {
      const data = await fetchDrugsIndex();
      setDrugs(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading drugs data');
      setLoading(false);
    }
  };

  const filteredDrugs = drugs.filter(drug => 
    drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (drug.generic_name && drug.generic_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout>
      <NextSeo
        title="Drugs & Supplements Database - HealthInfo"
        description="Browse our comprehensive database of medications and supplements. Get detailed information about usage, dosage, and side effects."
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Drugs & Supplements Database</h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search drugs and supplements..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrugs.map((drug) => (
              <div key={drug.slug} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {drug.name}
                </h2>
                {drug.generic_name && (
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Generic Name:</span> {drug.generic_name}
                  </p>
                )}
                {drug.type && (
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Type:</span> {drug.type}
                  </p>
                )}
                <a
                  href={`/drugs/${drug.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}