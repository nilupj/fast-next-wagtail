import { useState } from 'react';

export default function SymptomChecker() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const commonSymptoms = [
    'Headache', 
    'Fever', 
    'Cough', 
    'Fatigue', 
    'Shortness of breath',
    'Nausea', 
    'Dizziness', 
    'Abdominal pain', 
    'Chest pain', 
    'Sore throat',
    'Muscle aches', 
    'Joint pain', 
    'Rash', 
    'Diarrhea', 
    'Vomiting',
    'Bloating', 
    'Back pain', 
    'Anxiety', 
    'Depression', 
    'Weight loss'
  ];

  const filteredSymptoms = searchTerm 
    ? commonSymptoms.filter(symptom => 
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : commonSymptoms;

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!age || !gender || selectedSymptoms.length === 0) {
      setError('Please complete all fields and select at least one symptom');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://0.0.0.0:8000/api/symptom-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          age: parseInt(age),
          gender,
          symptoms: selectedSymptoms,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error checking symptoms');
      }
      
      setResults(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Symptom Checker</h2>
      <p className="text-neutral-600 mb-4">
        This tool helps identify possible conditions based on your symptoms. It's not a diagnosis, but it can guide you on next steps.
      </p>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-neutral-700 mb-1">
              Age
            </label>
            <input
              id="age"
              type="number"
              min="1"
              max="120"
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-neutral-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Select your symptoms
          </label>
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search symptoms..."
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto border border-neutral-200 rounded-md p-2">
            {filteredSymptoms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredSymptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center">
                    <input
                      id={`symptom-${symptom.replace(/\s+/g, '-').toLowerCase()}`}
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary rounded"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                    />
                    <label
                      htmlFor={`symptom-${symptom.replace(/\s+/g, '-').toLowerCase()}`}
                      className="ml-2 block text-sm text-neutral-700"
                    >
                      {symptom}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm p-2">No symptoms found. Try a different search term.</p>
            )}
          </div>
          
          <div className="mt-2 text-sm text-neutral-500">
            Selected: {selectedSymptoms.length} {selectedSymptoms.length === 1 ? 'symptom' : 'symptoms'}
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary-light focus:ring-4 focus:ring-primary/50 text-white font-medium rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Check Symptoms'
            )}
          </button>
        </div>
      </form>
      
      {results && (
        <div className="mt-8 border-t border-neutral-200 pt-6">
          <h3 className="text-xl font-bold text-primary mb-4">Possible Conditions</h3>
          {results.conditions.length > 0 ? (
            <div className="space-y-4">
              {results.conditions.map((condition, index) => (
                <div key={index} className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-neutral-800 mb-1">{condition.name}</h4>
                  <p className="text-neutral-600 text-sm mb-2">{condition.description}</p>
                  <div className="flex items-center text-sm text-neutral-500">
                    <span className="font-medium mr-1">Likelihood:</span>
                    <div className="w-full max-w-xs bg-neutral-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${condition.probability}%` }}
                      ></div>
                    </div>
                    <span className="ml-2">{condition.probability}%</span>
                  </div>
                </div>
              ))}
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Important Disclaimer
                    </h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>This assessment is for informational purposes only and does not constitute medical advice. Please consult with a healthcare professional for proper diagnosis and treatment.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-neutral-600">
              No specific conditions identified based on your symptoms. Please consult a healthcare professional for proper evaluation.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
