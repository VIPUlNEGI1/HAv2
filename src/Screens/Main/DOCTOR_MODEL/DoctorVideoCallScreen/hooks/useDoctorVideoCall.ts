import { useState, useCallback } from 'react';

export interface CallUser {
  id: string;
  name: string;
  avatar: string;
}

export const useDoctorVideoCall = (user: CallUser | undefined, onEndCall: () => void) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);

  const handleEndCall = useCallback(() => {
    setIsCallActive(false);
    setTimeout(onEndCall, 500);
  }, [onEndCall]);

  const toggleMute = useCallback(() => setIsMuted((p) => !p), []);
  const toggleVideo = useCallback(() => setIsVideoOff((p) => !p), []);

  return {
    user: user ?? { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
    isMuted,
    isVideoOff,
    isCallActive,
    handleEndCall,
    toggleMute,
    toggleVideo,
  };
};
