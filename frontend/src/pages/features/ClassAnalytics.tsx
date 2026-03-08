import { BarChart3 } from 'lucide-react';
import FeatureComingSoon from './FeatureComingSoon';

const ClassAnalytics = () => {
  return (
    <FeatureComingSoon
      icon={BarChart3}
      title="Class Analytics"
      description="Track student progress and identify common error patterns with comprehensive analytics"
      badge="Faculty"
      features={[
        'Class-wide performance dashboards',
        'Individual student progress tracking',
        'Common error pattern identification',
        'Submission timeline visualization',
        'Comparative analysis tools',
        'Export detailed reports',
      ]}
    />
  );
};

export default ClassAnalytics;
