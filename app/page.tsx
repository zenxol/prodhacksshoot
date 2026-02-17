'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { savePhotoRemote } from '@/lib/storage';
import { POSE_TEMPLATES, type PoseTemplate } from '@/lib/poses';

type DetailState = { open: boolean; pose: PoseTemplate | null };

export default function BrowsePage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [detail, setDetail] = useState<DetailState>({ open: false, pose: null });
  const [saving, startSaving] = useTransition();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(POSE_TEMPLATES.map((p) => p.category)))],
    []
  );

  const filteredPoses = useMemo(
    () =>
      activeCategory === 'All'
        ? POSE_TEMPLATES
        : POSE_TEMPLATES.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const recommended = POSE_TEMPLATES.slice(0, 6);

  const handleSave = (pose: PoseTemplate) => {
    setSaveMessage(null);
    startSaving(async () => {
      try {
        await savePhotoRemote({
          poseName: pose.name,
          photoDataUrl: pose.imageUrl,
          score: 0,
        });
        setSaveMessage('Saved to gallery');
      } catch {
        setSaveMessage('Save failed — log in?');
      }
      setTimeout(() => setSaveMessage(null), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Hero */}
      <header className="sticky top-0 z-20 bg-black/95 backdrop-blur-md border-b border-white/10 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">Shoot</p>
            <h1 className="text-2xl font-bold leading-tight">Pose ideas that just work.</h1>
            <p className="text-sm text-white/60 mt-1">Pick a template → guidance in camera → auto-save.</p>
          </div>
          <Link
            href="/saved"
            className="text-xs px-3 py-1.5 rounded-full bg-white text-black font-semibold"
          >
            Saved
          </Link>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-none px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat
                  ? 'bg-white text-black border-white'
                  : 'bg-white/10 text-white/70 border-white/10 hover:bg-white/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Recommended row */}
      <section className="px-4 pb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Recommended</h2>
          <span className="text-xs text-white/40">Based on popular matches</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {recommended.map((pose) => (
            <button
              key={`rec-${pose.id}`}
              onClick={() => setDetail({ open: true, pose })}
              className="flex-none w-36 rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 transition-colors"
            >
              <div className="aspect-[2/3] overflow-hidden">
                <img src={pose.imageUrl} alt={pose.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs text-white/70 leading-tight">{pose.name}</p>
                <p className="text-[11px] text-white/40">{pose.category}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured vertical cards (mobile first) */}
      <section className="px-4 py-3 grid grid-cols-2 gap-3">
        {filteredPoses.map((pose) => (
          <button
            key={pose.id}
            onClick={() => setDetail({ open: true, pose })}
            className="text-left rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-colors shadow-lg"
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              <div className="w-full h-full">
                <div className="relative w-full h-full" style={{ aspectRatio: '2 / 3' }}>
                  <div className="absolute inset-0">
                    <img
                      src={pose.imageUrl}
                      alt={pose.name}
                      className="w-full h-full object-cover object-center"
                      style={{ aspectRatio: '2 / 3' }}
                    />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-xs text-white/60">{pose.category}</p>
                <p className="text-sm font-semibold">{pose.name}</p>
                <span
                  className={`mt-1 inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    pose.difficulty === 'easy'
                      ? 'bg-green-500/30 text-green-100'
                      : pose.difficulty === 'medium'
                      ? 'bg-amber-500/30 text-amber-100'
                      : 'bg-red-500/30 text-red-100'
                  }`}
                >
                  {pose.difficulty}
                </span>
              </div>
            </div>
          </button>
        ))}
      </section>

      {/* Detail sheet */}
      {detail.open && detail.pose && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center px-4" onClick={() => setDetail({ open: false, pose: null })}>
          <div
            className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-4 pb-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-24 rounded-xl overflow-hidden">
                <img src={detail.pose.imageUrl} alt={detail.pose.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/50">{detail.pose.category}</p>
                <h3 className="text-lg font-semibold">{detail.pose.name}</h3>
                <p className="text-xs text-white/50 mt-1">Match score guidance, distance cues.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleSave(detail.pose!)}
                disabled={saving}
                className="w-full text-center py-3 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <Link
                href={`/camera?poseId=${detail.pose.id}`}
                className="w-full text-center py-3 rounded-xl bg-white text-black font-semibold text-sm"
              >
                Shoot
              </Link>
            </div>
            {saveMessage && (
              <p className="mt-2 text-center text-sm text-green-400">{saveMessage}</p>
            )}
            <button
              onClick={() => setDetail({ open: false, pose: null })}
              className="mt-3 w-full py-2 text-sm text-white/50 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
