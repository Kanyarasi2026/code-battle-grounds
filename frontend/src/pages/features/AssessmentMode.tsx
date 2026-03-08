import { ClipboardCheck } from 'lucide-react';
import FeatureComingSoon from './FeatureComingSoon';

const AssessmentMode = () => {
  return (
    <FeatureComingSoon
      icon={ClipboardCheck}
      title="Assessment Mode"
      description="Timed coding assessments with transparent integrity tracking and automated evaluation"
      badge="Faculty"
      features={[
        'Timed assessment creation and management',
        'Automatic code plagiarism detection',
        'Real-time proctoring with activity logs',
        'Custom test case creation',
        'Immediate feedback and grading',
        'Comprehensive assessment analytics',
      ]}
    />
  );
};

export default AssessmentMode;
