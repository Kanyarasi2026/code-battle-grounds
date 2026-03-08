import { Shield } from 'lucide-react';
import FeatureComingSoon from './FeatureComingSoon';

const IntegrityTimeline = () => {
  return (
    <FeatureComingSoon
      icon={Shield}
      title="Integrity Timeline"
      description="Factual event logs without automated accusations - transparent integrity tracking"
      badge="Transparency"
      features={[
        'Chronological activity logging',
        'Tab switching and window focus tracking',
        'Copy-paste event detection',
        'External resource access logs',
        'Fact-based reporting only',
        'Privacy-preserving analytics',
      ]}
    />
  );
};

export default IntegrityTimeline;
