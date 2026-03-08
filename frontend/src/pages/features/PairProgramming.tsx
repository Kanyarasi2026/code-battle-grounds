import { Users } from 'lucide-react';
import FeatureComingSoon from './FeatureComingSoon';

const PairProgramming = () => {
  return (
    <FeatureComingSoon
      icon={Users}
      title="Pair Programming"
      description="Real-time collaborative coding with live cursor presence and synchronized editing"
      badge="Collaborative"
      features={[
        'Live cursor tracking for all participants',
        'Synchronized code editing in real-time',
        'Voice and text chat integration',
        'Screen sharing capabilities',
        'Code annotation and commenting',
        'Session recording and playback',
      ]}
    />
  );
};

export default PairProgramming;
