
import { NextSeo } from 'next-seo';
import Layout from '../components/Layout';
import VideoConsultation from '../components/VideoConsultation';

export default function VideoConsultationPage() {
  return (
    <Layout>
      <NextSeo
        title="Video Consultation - HealthInfo"
        description="Book a video consultation with our healthcare professionals"
      />
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6">Video Consultation</h1>
          <p className="text-gray-600 mb-8">
            Connect with our healthcare professionals through secure video consultations. 
            Book your appointment by filling out the form below.
          </p>
          <VideoConsultation />
        </div>
      </div>
    </Layout>
  );
}
