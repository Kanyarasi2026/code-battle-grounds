import { BookMarked } from 'lucide-react';
import FeatureComingSoon from './FeatureComingSoon';

const PracticeSets = () => {
  return (
    <FeatureComingSoon
      icon={BookMarked}
      title="Curated Practice Sets"
      description="Topic-based problem collections for focused learning and skill development"
      features={[
        'Expertly curated problem collections',
        'Topic-specific learning paths',
        'Difficulty progression tracks',
        'Company-tagged problem sets',
        'Contest preparation bundles',
        'Custom set creation tools',
      ]}
    />
  );
};

export default PracticeSets;
