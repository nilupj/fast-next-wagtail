import SymptomChecker from '../components/SymptomChecker';
import { NextSeo } from 'next-seo';

export default function SymptomCheckerPage() {
  return (
    <>
      <NextSeo
        title="Symptom Checker - HealthInfo"
        description="Use our symptom checker to help identify possible conditions and treatments for your health concerns."
        canonical="https://healthinfo.com/symptom-checker"
      />
    
      <div className="container-custom py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Symptom Checker</h1>
          <p className="text-neutral-600">
            Use our symptom checker to help identify possible conditions and treatments for your health concerns.
          </p>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                This tool does not provide medical advice. It is intended for informational purposes only and is not a substitute for professional medical consultation, diagnosis or treatment.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <SymptomChecker />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-primary mb-4">When to See a Doctor</h2>
          <p className="text-neutral-600 mb-4">
            While our symptom checker can help identify potential causes for your symptoms, it's important to know when to seek professional medical help.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Seek immediate medical attention if you experience:</h3>
          <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-1">
            <li>Chest pain or pressure</li>
            <li>Difficulty breathing</li>
            <li>Severe abdominal pain</li>
            <li>Sudden severe headache</li>
            <li>Sudden confusion or trouble speaking</li>
            <li>Sudden weakness or numbness, especially on one side of the body</li>
            <li>Severe or persistent vomiting</li>
            <li>Uncontrolled bleeding</li>
            <li>Loss of consciousness</li>
          </ul>
          
          <div className="mt-4">
            <a href="/doctors" className="btn-primary inline-block">
              Find a Doctor
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
