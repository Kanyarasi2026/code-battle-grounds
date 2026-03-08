import { Code2 } from 'lucide-react';
import FeatureComingSoon from './FeatureComingSoon';

const SoloPractice = () => {
  return (
    <FeatureComingSoon
      icon={Code2}
      title="Solo Practice"
      description="Solve DSA problems with tiered AI hints that guide without spoiling your learning journey"
      badge="Student"
      features={[
        'Curated DSA problem sets from easy to expert',
        'AI-powered three-tier hint system',
        'Real-time code execution and testing',
        'Progress tracking and streak management',
        'Topic-wise problem categorization',
        'Personalized difficulty recommendations',
      ]}
    />
  );
};

export default SoloPractice;
