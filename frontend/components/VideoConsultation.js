
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function VideoConsultation({ onSubmit }) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    reason: ''
  });
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef();
  const socketRef = useRef();

  useEffect(() => {
    if (isCallActive) {
      initializeCall();
    }
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isCallActive]);

  const initializeCall = async () => {
    try {
      // Initialize WebSocket connection
      socketRef.current = io('https://' + window.location.hostname);
      
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };
      peerConnection.current = new RTCPeerConnection(configuration);

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      // Handle incoming remote stream
      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
    } catch (error) {
      console.error('Error initializing call:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="container-custom py-8">
      {!isCallActive ? (
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
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg"
              />
              <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">You</p>
            </div>
            <div className="relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">Doctor</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => setIsCallActive(false)}>
              End Call
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md">
              Mute
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md">
              Turn Off Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
