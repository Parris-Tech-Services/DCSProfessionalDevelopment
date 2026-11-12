'use client';

import dynamic from 'next/dynamic';

// next/dynamic with ssr:false must live in a Client Component (Next 15).
const AcademicSubjectAssessmentLazy = dynamic(() => import('./AcademicSubjectAssessment'), {
  ssr: false
});

export default AcademicSubjectAssessmentLazy;
