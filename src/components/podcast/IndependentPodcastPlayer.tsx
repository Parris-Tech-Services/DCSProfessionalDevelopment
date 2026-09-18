'use client';

import { useEffect, useState } from 'react';
import { itPodcastEpisodes } from '../../data/itPodcastEpisodes';
import styles from './IndependentPodcastPlayer.module.css';

const STORAGE_KEY = 'dcs-pd-independent-podcast-v1';

export default function IndependentPodcastPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as { currentIndex?: number };
      if (
        Number.isInteger(saved.currentIndex) &&
        typeof saved.currentIndex === 'number' &&
        saved.currentIndex >= 0 &&
        saved.currentIndex < itPodcastEpisodes.length
      ) {
        setCurrentIndex(saved.currentIndex);
        setHasSelection(true);
      }
    } catch {
      // localStorage is optional; the player still works without it.
    }
  }, []);

  const persist = (index: number) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentIndex: index }));
    } catch {
      // Ignore storage failures so playback remains available.
    }
  };

  const chooseDifferent = (fromIndex: number) => {
    if (itPodcastEpisodes.length <= 1) return 0;
    let next = Math.floor(Math.random() * itPodcastEpisodes.length);
    while (next === fromIndex) next = Math.floor(Math.random() * itPodcastEpisodes.length);
    return next;
  };

  const openPlayer = () => {
    if (!hasSelection) {
      const first = Math.floor(Math.random() * itPodcastEpisodes.length);
      setCurrentIndex(first);
      setHasSelection(true);
      persist(first);
    }
    setIsOpen(true);
  };

  const nextPodcast = () => {
    const next = chooseDifferent(currentIndex);
    setCurrentIndex(next);
    setHasSelection(true);
    persist(next);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        className={styles.launcher}
        onClick={openPlayer}
        aria-label="Open IT support podcasts"
      >
        🎧 Podcasts
      </button>
    );
  }

  const current = itPodcastEpisodes[currentIndex];
  const tags = current.tags.join(' · ');

  return (
    <aside className={styles.panel} aria-label="SupportOps Career Lab podcast player">
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>SupportOps Career Lab · IT listening</p>
          <h2 className={styles.title}>{current.title}</h2>
          <p className={styles.meta}>{[current.show, tags].filter(Boolean).join(' · ')}</p>
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={() => setIsOpen(false)}
          aria-label="Close podcast player"
        >
          ×
        </button>
      </div>

      <iframe
        className={styles.frame}
        src={`https://open.spotify.com/embed/episode/${encodeURIComponent(current.id)}?theme=0`}
        title={`Spotify episode: ${current.title}`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />

      <div className={styles.actions}>
        <button type="button" className={styles.action} onClick={nextPodcast}>
          🎲 Different podcast
        </button>
        <a
          className={styles.link}
          href={`https://open.spotify.com/episode/${encodeURIComponent(current.id)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Spotify ↗
        </a>
      </div>

      <p className={styles.note}>
        This 25-episode IT bank lives inside DCS Professional Development and does not depend on JoshHub.
      </p>
    </aside>
  );
}
