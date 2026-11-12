import StrictQuizPageClient from '../../src/components/assessment/StrictQuizPageClient';

export default async function StrictQuizPage(
  props: {
    searchParams?: Promise<{ topic?: string | string[] }>;
  }
) {
  const searchParams = await props.searchParams;
  const topic = Array.isArray(searchParams?.topic) ? searchParams?.topic[0] : searchParams?.topic;

  return <StrictQuizPageClient weakTopic={topic || null} />;
}
