import { useCallback, useRef, useState } from 'react';
import {
  type EvaluationResult,
  type InterviewConfig,
  type TranscriptEntry,
  evaluateInterview,
  generateQuestions,
  saveInterviewSession,
  speakText,
  transcribeAudio,
} from './interviewService';

export type InterviewState =
  | 'setup'
  | 'loading'
  | 'active'
  | 'speaking'
  | 'recording'
  | 'processing'
  | 'results';

export interface UseInterviewReturn {
  state: InterviewState;
  questions: string[];
  currentIndex: number;
  transcript: TranscriptEntry[];
  evaluation: EvaluationResult | null;
  isSpeaking: boolean;
  isRecording: boolean;
  error: string | null;
  startInterview: (config: InterviewConfig) => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  nextQuestion: () => Promise<void>;
  resetInterview: () => void;
}

export function useInterview(): UseInterviewReturn {
  const [state, setState] = useState<InterviewState>('setup');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs to avoid stale closures
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const questionsRef = useRef<string[]>([]);
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const currentIndexRef = useRef(0);
  const configRef = useRef<InterviewConfig | null>(null);

  const addToTranscript = useCallback((entry: TranscriptEntry) => {
    setTranscript((prev) => {
      const next = [...prev, entry];
      transcriptRef.current = next;
      return next;
    });
  }, []);

  const askQuestion = useCallback(
    async (question: string) => {
      addToTranscript({ role: 'interviewer', text: question, timestamp: new Date() });
      setState('speaking');
      setIsSpeaking(true);

      const audio = await speakText(
        question,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false);
          setState('active');
        }
      );
      audioRef.current = audio;
    },
    [addToTranscript]
  );

  const finishInterview = useCallback(async (finalTranscript: TranscriptEntry[]) => {
    setState('processing');
    let result: EvaluationResult | null = null;
    try {
      result = await evaluateInterview(finalTranscript);
      setEvaluation(result);
    } catch (evalErr) {
      console.error('evaluateInterview error:', evalErr);
      setError('Failed to evaluate interview. Showing transcript only.');
    } finally {
      // Save session regardless of whether evaluation succeeded
      if (configRef.current) {
        saveInterviewSession(
          configRef.current,
          questionsRef.current,
          finalTranscript,
          result
        );
      }
      setState('results');
    }
  }, []);

  const startInterview = useCallback(
    async (config: InterviewConfig) => {
      setError(null);
      setState('loading');
      setTranscript([]);
      transcriptRef.current = [];
      setEvaluation(null);
      setCurrentIndex(0);
      currentIndexRef.current = 0;

      try {
        configRef.current = config;
        const qs = await generateQuestions(config);
        questionsRef.current = qs;
        setQuestions(qs);
        setState('active');
        await askQuestion(qs[0]);
      } catch (err) {
        console.error('startInterview error:', err);
        setError('Failed to start interview. Please try again.');
        setState('setup');
      }
    },
    [askQuestion]
  );

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType =
        MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' :
        MediaRecorder.isTypeSupported('audio/ogg;codecs=opus') ? 'audio/ogg;codecs=opus' :
        MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' :
        'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      // timeslice=250ms forces periodic ondataavailable so onstop always has complete data
      mediaRecorder.start(250);
      setIsRecording(true);
      setState('recording');
    } catch (err) {
      console.error('startRecording error:', err);
      setError('Microphone access denied. Please enable mic permissions and try again.');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;

    return new Promise<void>((resolve) => {
      recorder.onstop = async () => {
        setIsRecording(false);

        // Stop mic tracks here, after all chunks are flushed
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const ext = recorder.mimeType.includes('mp4') ? 'mp4'
          : recorder.mimeType.includes('ogg') ? 'ogg'
          : 'webm';

        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType });

        if (audioBlob.size < 1000) {
          setError('Recording was too short or failed. Please try again.');
          setState('active');
          resolve();
          return;
        }

        setState('processing');
        try {
          const text = await transcribeAudio(audioBlob, ext);

          const candidateEntry: TranscriptEntry = {
            role: 'candidate',
            text,
            timestamp: new Date(),
          };
          addToTranscript(candidateEntry);

          const nextIdx = currentIndexRef.current + 1;
          currentIndexRef.current = nextIdx;
          setCurrentIndex(nextIdx);

          const qs = questionsRef.current;

          if (nextIdx < qs.length) {
            await askQuestion(qs[nextIdx]);
          } else {
            await finishInterview([...transcriptRef.current]);
          }
        } catch (err) {
          console.error('transcribeAudio error:', err);
          setError('Failed to transcribe your answer. Please try again.');
          setState('active');
        }
        resolve();
      };

      recorder.stop();
    });
  }, [addToTranscript, askQuestion, finishInterview]);

  const nextQuestion = useCallback(async () => {
    const idx = currentIndexRef.current;
    const qs = questionsRef.current;
    if (idx < qs.length) {
      await askQuestion(qs[idx]);
    }
  }, [askQuestion]);

  const resetInterview = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    questionsRef.current = [];
    transcriptRef.current = [];
    currentIndexRef.current = 0;
    configRef.current = null;

    setState('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setTranscript([]);
    setEvaluation(null);
    setIsSpeaking(false);
    setIsRecording(false);
    setError(null);
  }, []);

  return {
    state,
    questions,
    currentIndex,
    transcript,
    evaluation,
    isSpeaking,
    isRecording,
    error,
    startInterview,
    startRecording,
    stopRecording,
    nextQuestion,
    resetInterview,
  };
}
