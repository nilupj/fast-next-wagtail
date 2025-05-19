
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import HeartHealthQuiz from '../../components/quizzes/HeartHealthQuiz';
import MentalHealthQuiz from '../../components/quizzes/MentalHealthQuiz';
import NutritionQuiz from '../../components/quizzes/NutritionQuiz';

export default function QuizPage() {
  const router = useRouter();
  const { slug } = router.query;

  const renderQuiz = () => {
    switch (slug) {
      case 'heart-health-quiz':
        return <HeartHealthQuiz />;
      case 'mental-health-quiz':
        return <MentalHealthQuiz />;
      case 'nutrition-quiz':
        return <NutritionQuiz />;
      default:
        return <div>Quiz not found</div>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {renderQuiz()}
      </div>
    </Layout>
  );
}
