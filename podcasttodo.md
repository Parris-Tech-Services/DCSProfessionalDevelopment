# Podcast Integration

**Decision:** Add — high priority.  
**Status:** ✅ Independent local player implemented 16 September 2026.  
**Topic bank:** IT support, Microsoft 365, Intune, networking, cybersecurity, helpdesk/MSP careers.

## Current implementation
- [x] 25 Spotify episodes are stored locally in `src/data/itPodcastEpisodes.ts`.
- [x] The UI is a local React client component at `src/components/podcast/IndependentPodcastPlayer.tsx`.
- [x] No JoshHub launcher, jsDelivr script, shared runtime catalogue or remote JSON fetch is required.
- [x] The collapsed **🎧 Podcasts** button opens the local player immediately.
- [x] **🎲 Different podcast** avoids the currently selected episode.
- [x] The selected episode is remembered in `localStorage` when available.
- [x] Spotify embed and direct episode links are generated locally; autoplay is not assumed.
- [x] The dock is responsive, keyboard focusable and screen-reader labelled.

## Future improvements
- [ ] Use current training-module tags to bias episode selection toward DNS/networking/M365/security topics.
- [ ] Add focused component tests for persistence, invalid saved indexes and mobile interaction.

## Isolation rule
DCS Professional Development intentionally owns its podcast catalogue and player. A JoshHub or CDN outage must not stop this app's podcast button from opening.
