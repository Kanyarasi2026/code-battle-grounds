import { FileVideo } from 'lucide-react';
import FeatureComingSoon from './FeatureComingSoon';

const SessionReplay = () => {
  return (
    <FeatureComingSoon
      icon={FileVideo}
      title="Session Replay"
      description="Review any coding session keystroke-by-keystroke with timeline controls and annotations"
      badge="Analytics"
      features={[
        'Full keystroke-by-keystroke replay',
        'Timeline navigation and scrubbing',
        'Playback speed controls',
        'Code evolution visualization',
        'Annotation and commenting on replays',
        'Export replay highlights',
      ]}
    />
  );
};

export default SessionReplay;
