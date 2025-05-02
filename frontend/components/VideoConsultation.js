
import { useState } from 'react';

export default function VideoConsultation({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Video Consultation</h1>
        <p className="text-neutral-600 mb-8">
          Connect with our healthcare professionals through secure video consultations. Book
          your appointment by filling out the form below.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Book Video Consultation</h2>
          <p className="text-neutral-600 mb-6">Consultation Fee: ₹499</p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full border-neutral-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full border-neutral-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  className="w-full border-neutral-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-neutral-700 mb-1">Preferred Time</label>
                <input
                  type="time"
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                  className="w-full border-neutral-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-neutral-700 mb-1">Reason for Consultation</label>
                <textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  required
                  rows={4}
                  className="w-full border-neutral-300 rounded-md shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
