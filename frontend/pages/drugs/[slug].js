
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getDrugBySlug } from '../../utils/api';
import { NextSeo } from 'next-seo';

export default function DrugPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [drug, setDrug] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getDrugBySlug(slug)
        .then(data => {
          setDrug(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching drug:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [slug]);

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

  if (!drug) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Drug not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <NextSeo
        title={`${drug.title} - Drug Information - HealthInfo`}
        description={drug.overview?.substring(0, 160)}
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{drug.title}</h1>
        {drug.generic_name && (
          <p className="text-gray-600 mb-4">Generic name: {drug.generic_name}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <div dangerouslySetInnerHTML={{ __html: drug.overview }} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Uses</h2>
              <div dangerouslySetInnerHTML={{ __html: drug.uses }} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Dosage</h2>
              <div dangerouslySetInnerHTML={{ __html: drug.dosage }} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Side Effects</h2>
              <div dangerouslySetInnerHTML={{ __html: drug.side_effects }} />
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Quick Facts</h2>
              {drug.drug_class && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Drug Class</h3>
                  <p>{drug.drug_class}</p>
                </div>
              )}
              {drug.brand_names && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Brand Names</h3>
                  <p>{drug.brand_names}</p>
                </div>
              )}
              {drug.pregnancy_category && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Pregnancy Category</h3>
                  <p>{drug.pregnancy_category}</p>
                </div>
              )}
            </div>

            {drug.warnings && (
              <div className="bg-red-50 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-red-700">Warnings</h2>
                <div className="text-red-600" dangerouslySetInnerHTML={{ __html: drug.warnings }} />
              </div>
            )}

            {drug.interactions && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Drug Interactions</h2>
                <div dangerouslySetInnerHTML={{ __html: drug.interactions }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
