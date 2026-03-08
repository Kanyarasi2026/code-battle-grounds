import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import FeatureComingSoon from './FeatureComingSoon';

const AssessmentMode = () => {
  const navigate = useNavigate();
  const { roleData, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      console.log('[AssessmentMode] Auth still loading...');
      return;
    }

    console.log('[AssessmentMode] Role data:', roleData);

    // If user has a role, redirect to appropriate assessment page
    if (roleData.requested === 'faculty') {
      console.log('[AssessmentMode] Redirecting to faculty assessment...');
      navigate('/assessment/faculty', { replace: true });
    } else if (roleData.requested === 'student') {
      console.log('[AssessmentMode] Redirecting to student assessment...');
      navigate('/assessment/student', { replace: true });
    } else {
      console.log('[AssessmentMode] No role selected, redirecting to role selection...');
      // No role selected - redirect to role selection
      navigate('/role', { 
        state: { 
          academicOnly: true, 
          returnTo: '/assess' 
        }, 
        replace: true 
      });
    }
  }, [roleData, loading, navigate]);

  // Show coming soon page while redirecting or if no role selected
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
