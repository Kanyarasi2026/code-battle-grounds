import { BarChart3 } from 'lucide-react';
import FeatureComingSoon from './FeatureComingSoon';

const ProgressTracking = () => {
  return (
    <FeatureComingSoon
      icon={BarChart3}
      title="Progress Tracking"
      description="Monitor your improvement with detailed analytics and personalized insights"
      features={[
        'Personal performance dashboard',
        'Skill level progression charts',
        'Time spent analytics',
        'Problem-solving patterns',
        'Streak and consistency tracking',
        'Goal setting and achievement badges',
      ]}
    />
  );
};

export default ProgressTracking;
