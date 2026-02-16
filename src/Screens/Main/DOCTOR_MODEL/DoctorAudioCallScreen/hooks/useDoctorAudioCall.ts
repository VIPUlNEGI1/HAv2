import { useState, useEffect, useCallback } from 'react';

export interface CallUser {
  id: string;
  name: string;
  avatar: string;
}

export const useDoctorAudioCall = (user: CallUser | undefined, onEndCall: () => void) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleEndCall = useCallback(() => {
    setIsCallActive(false);
    setTimeout(onEndCall, 500);
  }, [onEndCall]);

  const toggleMute = useCallback(() => setIsMuted((p) => !p), []);

  return {
    user: user ?? { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
    isMuted,
    isCallActive,
    callDuration,
    formatDuration,
    handleEndCall,
    toggleMute,
  };
};
