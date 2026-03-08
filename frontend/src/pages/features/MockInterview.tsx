import { Lightbulb } from 'lucide-react';
import FeatureComingSoon from './FeatureComingSoon';

const MockInterview = () => {
  return (
    <FeatureComingSoon
      icon={Lightbulb}
      title="Mock Interviews"
      description="Prepare for technical interviews with realistic scenarios and comprehensive feedback"
      features={[
        'Company-specific interview formats',
        'Timed problem-solving sessions',
        'Video interview simulation',
        'Behavioral question practice',
        'Live feedback and hints',
        'Interview performance analytics',
      ]}
    />
  );
};

export default MockInterview;
