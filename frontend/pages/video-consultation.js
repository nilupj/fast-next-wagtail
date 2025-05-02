
import { useState } from 'react';
import Layout from '../components/Layout';
import PaymentForm from '../components/PaymentForm';
import VideoConsultation from '../components/VideoConsultation';

export default function VideoConsultationPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [consultationData, setConsultationData] = useState(null);

  const handleConsultationSubmit = (data) => {
    setConsultationData(data);
    setShowPayment(true);
  };

  return (
    <Layout title="Video Consultation - HealthInfo">
      {!showPayment ? (
        <VideoConsultation onSubmit={handleConsultationSubmit} />
      ) : (
        <PaymentForm consultationData={consultationData} />
      )}
    </Layout>
  );
}
