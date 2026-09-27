export type ItPodcastEpisode = {
  id: string;
  title: string;
  show: string;
  tags: string[];
  audio?: string;
};

export const itPodcastEpisodes: ItPodcastEpisode[] = [
  { id: '7vhbck9c1xMES9C5EOwkir', audio: "https://anchor.fm/s/e76e1544/podcast/play/99027987/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-1-25%2F90511e26-c6c8-ff59-856b-86a2d80bfa8a.mp3", title: 'IT Support vs Help Desk', show: 'Protek IT Insights', tags: ['support'] },
  { id: '2Ph4l9QuJJpQ4WaI5BjXsS', audio: "https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/72947388/0b5046e6_95f9_4e5e_8a00_d30995ca4768.mp3", title: 'Building a Secure Microsoft-First MSP', show: 'M365.FM', tags: ['m365', 'security', 'msp'] },
  { id: '7M2qm2siWBeoUr84gc3979', audio: "https://anchor.fm/s/fe2e11e4/podcast/play/101677179/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-3-23%2F8bb1eff5-1151-a7d3-f04d-79aaadbdf6e0.mp3", title: 'IT Helpdesk Best Practices That Actually Work', show: 'Crescent Tek Connections', tags: ['helpdesk', 'support'] },
  { id: '1jdb2F0Z8OzpccBDgARbtW', audio: "https://www.buzzsprout.com/1564682/episodes/18002660-news-roundup-episode-19-kaseya-s-ai-workforce-cyberfox-dns-filtering-rsa-threat-data.mp3", title: 'Kaseya AI Workforce, CyberFOX DNS & RSA Threat Data', show: 'MSP Success', tags: ['msp', 'dns', 'security'] },
  { id: '4Nh1gsH7YSmzDgjJhKloHE', audio: "https://anchor.fm/s/10ee4a2c8/podcast/play/117479319/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2026-2-25%2F420770844-44100-2-55a92b5e80aca.mp3", title: 'Most Businesses Get Microsoft 365 Completely Wrong', show: 'Why IT Matters', tags: ['m365'] },
  { id: '185AyNHP1CVdAqr73Uy2Ce', audio: "https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/72050508/ai_meets_security_a_conversation_with_danilo_nogueira_microsoft.mp3", title: 'AI Meets Security', show: 'M365.FM', tags: ['security', 'ai', 'm365'] },
  { id: '3AL1oz0YHZy56ICxuSH41T', audio: "https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/73025621/sccm_vs_intune_simply_explained.mp3", title: 'SCCM vs Intune — Simply Explained', show: 'M365.FM', tags: ['intune', 'endpoint'] },
  { id: '5PEmrm2Bfv6XQYn4IjhC18', audio: "https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/71886524/the_invisible_employee_is_your_next_hire_actually_an_ai_agent.mp3", title: 'The Invisible Employee: Is Your Next Hire an AI Agent?', show: 'M365.FM', tags: ['ai', 'm365'] },
  { id: '2Gc2yYimaZFe0gLuTp4XwC', audio: "https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/73025384/microsoft_intune_simply_explained.mp3", title: 'Microsoft Intune — Simply Explained', show: 'M365.FM', tags: ['intune', 'endpoint'] },
  { id: '62D8ZV1AH8GtnrMQg4nNuA', title: 'Kaseya Connect 2026: Jim Lippie', show: 'MSP Radio', tags: ['kaseya', 'msp'] },
  { id: '6lnN5M2bDXQ9YnjIWrGVcm', audio: "https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/73193068/entra_pim_explained_securing_privileged_access_with_mark_orr_mvp.mp3", title: 'Entra PIM Explained', show: 'M365.FM', tags: ['entra', 'security', 'm365'] },
  { id: '4sI1gTDgc6r49pcciZTEnc', audio: "https://feeds.packetpushers.net/link/24045/17026059/N4N025.mp3", title: 'DHCP — Someone Get Me an Address!', show: 'N Is For Networking', tags: ['dhcp', 'networking'] },
  { id: '32eyxQu1f7XMoEGzBrBAQK', title: 'Microsoft 365 Architecture', show: 'M365.FM', tags: ['m365', 'architecture'] },
  { id: '0XHOZZLfahnnDihjZWtXVT', audio: "https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/69543668/beyond_itsm.mp3", title: 'Power Platform vs ServiceNow ITSM', show: 'M365.FM', tags: ['itsm', 'support'] },
  { id: '70kBvj9fUPSBNMuXAtP5p5', title: 'Windows 365 Updates for Admins', show: 'PortalFuse', tags: ['windows', 'intune'] },
  { id: '1l1TOs2sXfgP5CiOOh0196', title: 'Microsoft Entra and Microsoft Intune', show: 'IT Training', tags: ['entra', 'intune'] },
  { id: '6mPARqBJXEX6DpIJQsaeUc', audio: "https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/68759162/why_your_intune_deployment_is_a_security_risk.mp3", title: 'Intune Security Misconfigurations', show: 'M365.FM', tags: ['intune', 'security'] },
  { id: '20dh505Cn0b8YAwfCDyxha', title: 'Modern Endpoint Management with Intune', show: 'IT Podcast', tags: ['intune', 'endpoint'] },
  { id: '7mijfkmvVElQVLyz5UYeHI', title: 'MSP Success Story: Long-Term Datto Partner', show: "Uncle Marv's IT Business Podcast", tags: ['datto', 'msp', 'backup'] },
  { id: '3hyKyjFBFLoEKIbx8X1arY', audio: "https://app.fusebox.fm/data/show/Zngr68ygkz/episode/160/audio.mp3", title: 'The Truth About Ticket Counts and RMM Necessity', show: 'All Things MSP', tags: ['rmm', 'tickets', 'msp'] },
  { id: '0PM1SM6u0GjPfr6lhrRuaO', title: 'Should You Migrate Your Email to Office 365?', show: 'IT Podcast', tags: ['m365', 'email'] },
  { id: '1bY6WIeHGCoMIEmWy8AroP', title: 'How Spotto Helps MSPs Scale Azure', show: 'MSP Podcast', tags: ['azure', 'msp'] },
  { id: '1EIcQVCJfsrIHRoNuGtF6v', audio: "https://anchor.fm/s/c5fefcc/podcast/play/119872331/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2026-4-12%2Ff6c78410-e236-381b-e77e-8263c1781dcb.mp3", title: 'Securing AI Agents with Standards You Already Have', show: 'Identity at the Center', tags: ['security', 'ai', 'identity'] },
  { id: '6eerklzBTVHQFJ21gNAmj8', title: 'Microsoft 365 Secure Operations', show: 'IT Podcast', tags: ['m365', 'security'] },
  { id: '4clUvRNOWBDuf9gnSRzJnt', audio: "https://mcdn.podbean.com/mf/web/n3kqraxbcc4aq8fd/Before_You_Add_Another_AI_Tool_Clean_Up_Your_Business_Software_Stack76cis.mp3", title: 'Why Your Business Software Stack Needs a Cleanup', show: 'Managed & Secured', tags: ['msp', 'software'] }
];
