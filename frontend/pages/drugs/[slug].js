
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import Layout from '../../components/Layout';
import { fetchDrugDetails } from '../../utils/api';

export default function DrugDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [drug, setDrug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      loadDrugDetails();
    }
  }, [slug]);

  const loadDrugDetails = async () => {
    try {
      const data = await fetchDrugDetails(slug);
      setDrug(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading drug details');
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="text-center py-8">Loading...</div></Layout>;
  if (error) return <Layout><div className="text-center text-red-600 py-8">{error}</div></Layout>;
  if (!drug) return <Layout><div className="text-center py-8">Drug not found</div></Layout>;

  return (
    <Layout>
      <NextSeo
        title={`${drug.title} - Drug Information - HealthInfo`}
        description={drug.overview?.substring(0, 160)}
      />

      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{drug.title}</h1>
          
          {drug.generic_name && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Generic Name</h2>
              <p className="text-gray-700">{drug.generic_name}</p>
            </div>
          )}

          {drug.brand_names && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Brand Names</h2>
              <p className="text-gray-700">{drug.brand_names}</p>
            </div>
          )}

          <div className="prose max-w-none">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <div dangerouslySetInnerHTML={{ __html: drug.overview }} />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Uses</h2>
              <div dangerouslySetInnerHTML={{ __html: drug.uses }} />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Dosage</h2>
              <div dangerouslySetInnerHTML={{ __html: drug.dosage }} />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Side Effects</h2>
              <div dangerouslySetInnerHTML={{ __html: drug.side_effects }} />
            </div>

            {drug.warnings && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Warnings</h2>
                <div dangerouslySetInnerHTML={{ __html: drug.warnings }} />
              </div>
            )}
          </div>
        </article>
      </div>
    </Layout>
  );
}
