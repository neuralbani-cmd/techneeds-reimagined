import React, { useState } from 'react';
import { LearningResource } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: LearningResource | null;
  onCompleted?: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  resource,
  onCompleted,
}) => {
  const [completed, setCompleted] = useState(false);

  if (!isOpen || !resource) return null;

  // Extract embeddable YouTube ID if applicable
  const getEmbedUrl = (url?: string) => {
    if (!url) return 'https://www.youtube.com/embed/8aGhZQkoFbQ';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
    return url;
  };

  const handleMarkComplete = () => {
    setCompleted(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#6366f1'],
    });
    if (onCompleted) {
      onCompleted();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950/70 hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player Container */}
        <div className="aspect-video w-full bg-slate-950 relative border-b border-slate-800">
          <iframe
            src={getEmbedUrl(resource.videoUrl)}
            title={resource.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Details */}
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider flex items-center gap-1">
                <Play className="w-2.5 h-2.5 fill-current" /> Video Masterclass
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {resource.durationMinutes || 40} mins
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300">
                {resource.topic}
              </span>
            </div>

            <a
              href={resource.videoUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
            >
              <span>Watch in YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight">{resource.title}</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">{resource.description}</p>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Reward for completion:{' '}
              <span className="text-cyan-300 font-semibold font-mono">+50 points</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={handleMarkComplete}
                disabled={completed}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  completed
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20'
                }`}
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Module Completed (+50 pts)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mark as Watched & Complete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
