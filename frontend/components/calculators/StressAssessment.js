
import { useState } from 'react';

export default function StressAssessment() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const questions = [
    { id: 1, text: "How often do you feel overwhelmed?" },
    { id: 2, text: "How often do you have difficulty sleeping?" },
    { id: 3, text: "How often do you feel irritable or angry?" },
    { id: 4, text: "How often do you have difficulty concentrating?" },
    { id: 5, text: "How often do you experience physical tension?" }
  ];

  const calculateScore = (e) => {
    e.preventDefault();
    const total = Object.values(answers).reduce((sum, val) => sum + parseInt(val), 0);
    setScore(Math.round((total / (questions.length * 4)) * 100));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-4">Stress Assessment</h2>
      <form onSubmit={calculateScore} className="space-y-6">
        {questions.map((q) => (
          <div key={q.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{q.text}</label>
            <select
              value={answers[q.id] || ''}
              onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            >
              <option value="">Select an option</option>
              <option value="0">Never</option>
              <option value="1">Rarely</option>
              <option value="2">Sometimes</option>
              <option value="3">Often</option>
              <option value="4">Very Often</option>
            </select>
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          Calculate Stress Level
        </button>
      </form>
      {score !== null && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-lg">Stress Level: <span className="font-bold">{score}%</span></p>
          <p className="mt-2 text-sm text-gray-600">
            {score < 30 ? 'Your stress levels appear to be manageable.' :
             score < 60 ? 'You are experiencing moderate stress. Consider stress management techniques.' :
             'You are experiencing high stress. Consider consulting a healthcare professional.'}
          </p>
        </div>
      )}
    </div>
  );
}
