
import { useState } from 'react';
import Layout from '../../components/Layout';
import BMICalculator from '../../components/calculators/BMICalculator';
import CalorieCalculator from '../../components/calculators/CalorieCalculator';
import WaterIntakeCalculator from '../../components/calculators/WaterIntakeCalculator';
import StressAssessment from '../../components/calculators/StressAssessment';
import SleepCalculator from '../../components/calculators/SleepCalculator';

export default function Tools() {
  const [activeTool, setActiveTool] = useState('bmi');

  const tools = {
    bmi: { name: 'BMI Calculator', component: BMICalculator },
    calories: { name: 'Calorie Calculator', component: CalorieCalculator },
    water: { name: 'Water Intake Calculator', component: WaterIntakeCalculator },
    stress: { name: 'Stress Assessment', component: StressAssessment },
    sleep: { name: 'Sleep Calculator', component: SleepCalculator }
  };

  const ActiveComponent = tools[activeTool].component;

  return (
    <Layout>
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Health Tools & Calculators</h1>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(tools).map(([key, tool]) => (
            <button
              key={key}
              onClick={() => setActiveTool(key)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTool === key
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tool.name}
            </button>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <ActiveComponent />
        </div>
      </div>
    </Layout>
  );
}
