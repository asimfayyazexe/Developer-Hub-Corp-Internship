import React, { useEffect, useRef, useState } from 'react';
import {
  MonitorUp,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Radio,
  ScreenShareOff,
  Video,
  VideoOff,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { investors, entrepreneurs } from '../../data/users';

type CallState = 'idle' | 'connecting' | 'live' | 'mock';

export const VideoCallPage: React.FC = () => {
  const { user } = useAuth();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<CallState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready to start a secure deal room call.');

  const counterpart = user?.role === 'investor' ? entrepreneurs[0] : investors[0];

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  if (!user) return null;

  const startCall = async () => {
    setCallState('connecting');
    setStatusMessage('Connecting secure media session...');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Media devices are not available in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      setCallState('live');
      setIsMuted(false);
      setIsCameraOff(false);
      setStatusMessage('Call is live. Media controls are connected to your local stream.');
    } catch (error) {
      setCallState('mock');
      setStatusMessage((error as Error).message);
    }
  };

  const endCall = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    screenStreamRef.current = null;
    setLocalStream(null);
    setCallState('idle');
    setIsMuted(false);
    setIsCameraOff(false);
    setIsScreenSharing(false);
    setStatusMessage('Call ended.');
  };

  const toggleAudio = () => {
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = isMuted;
    });
    setIsMuted((currentValue) => !currentValue);
  };

  const toggleVideo = () => {
    localStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = isCameraOff;
    });
    setIsCameraOff((currentValue) => !currentValue);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setIsScreenSharing(false);
      return;
    }

    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        throw new Error('Screen sharing is not available.');
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const [screenTrack] = stream.getVideoTracks();
      screenTrack?.addEventListener('ended', () => setIsScreenSharing(false));
      screenStreamRef.current = stream;
      setIsScreenSharing(true);
    } catch {
      setIsScreenSharing(true);
      setStatusMessage('Screen share is mocked in this environment.');
    }
  };

  const isCallActive = callState === 'live' || callState === 'mock';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Call Room</h1>
          <p className="text-gray-600">Investor and entrepreneur deal discussions</p>
        </div>
        <Badge
          variant={callState === 'live' ? 'success' : callState === 'connecting' ? 'warning' : 'gray'}
          rounded
          className="w-fit"
        >
          {callState === 'live'
            ? 'Live'
            : callState === 'connecting'
              ? 'Connecting'
              : callState === 'mock'
                ? 'Demo mode'
                : 'Idle'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <Card className="xl:col-span-3">
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="relative min-h-96 overflow-hidden rounded-md bg-gray-950 lg:col-span-2">
                {localStream && !isCameraOff ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full min-h-96 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-96 flex-col items-center justify-center text-white">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-600">
                      <Video size={32} />
                    </div>
                    <p className="text-lg font-semibold">
                      {isCameraOff ? 'Camera paused' : 'Local preview'}
                    </p>
                    <p className="mt-1 text-sm text-gray-300">
                      {isCallActive ? 'Audio/video controls remain active' : 'Start call to enable media'}
                    </p>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 rounded bg-black/50 px-3 py-1 text-sm font-medium text-white">
                  {user.name}
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative min-h-44 overflow-hidden rounded-md bg-gradient-to-br from-primary-900 to-secondary-900 p-4 text-white">
                  <div className="flex h-full min-h-36 flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar src={counterpart.avatarUrl} alt={counterpart.name} size="md" />
                      <div>
                        <p className="font-semibold">{counterpart.name}</p>
                        <p className="text-sm text-primary-100">
                          {counterpart.role === 'investor' ? 'Investor' : counterpart.startupName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary-100">
                      <Radio size={16} />
                      {isCallActive ? 'Connected to call room' : 'Waiting in lobby'}
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-gray-200 p-4">
                  <h2 className="text-sm font-semibold text-gray-900">Call agenda</h2>
                  <div className="mt-3 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Pitch review</span>
                      <Badge variant="primary" size="sm">15 min</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Due diligence Q&A</span>
                      <Badge variant="secondary" size="sm">20 min</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Next steps</span>
                      <Badge variant="accent" size="sm">10 min</Badge>
                    </div>
                  </div>
                </div>

                {isScreenSharing && (
                  <div className="rounded-md border border-secondary-200 bg-secondary-50 p-4 text-sm text-secondary-800">
                    Screen sharing is active for the deal room.
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">{statusMessage}</p>
              <div className="flex flex-wrap gap-2">
                {!isCallActive && (
                  <Button
                    leftIcon={<Phone size={18} />}
                    isLoading={callState === 'connecting'}
                    onClick={startCall}
                  >
                    Start call
                  </Button>
                )}
                {isCallActive && (
                  <>
                    <Button
                      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                      className="p-2"
                      variant={isMuted ? 'warning' : 'outline'}
                      onClick={toggleAudio}
                    >
                      {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                    </Button>
                    <Button
                      aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
                      className="p-2"
                      variant={isCameraOff ? 'warning' : 'outline'}
                      onClick={toggleVideo}
                    >
                      {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
                    </Button>
                    <Button
                      aria-label={isScreenSharing ? 'Stop screen share' : 'Start screen share'}
                      className="p-2"
                      variant={isScreenSharing ? 'secondary' : 'outline'}
                      onClick={toggleScreenShare}
                    >
                      {isScreenSharing ? <ScreenShareOff size={18} /> : <MonitorUp size={18} />}
                    </Button>
                    <Button leftIcon={<PhoneOff size={18} />} variant="error" onClick={endCall}>
                      End call
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Room details</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Deal</p>
              <p className="font-medium text-gray-900">TechWave AI Seed Round</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Participants</p>
              <div className="mt-3 space-y-3">
                {[user, counterpart].map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <Avatar
                      src={participant.avatarUrl}
                      alt={participant.name}
                      size="sm"
                      status={participant.isOnline ? 'online' : 'offline'}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                      <p className="text-xs capitalize text-gray-500">{participant.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md bg-primary-50 p-4">
              <p className="text-sm font-medium text-primary-900">WebRTC mock</p>
              <p className="mt-1 text-sm text-primary-700">
                Local media uses browser APIs when available and falls back to demo mode.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
