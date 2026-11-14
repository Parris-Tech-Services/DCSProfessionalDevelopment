import DueTodayClient from './DueTodayClient';

// Next 15: searchParams is a Promise. Await it here and hand the client component a plain object.
export default async function DueTodayPage(props: { searchParams?: Promise<{ mode?: string | string[] }> }) {
  const searchParams = await props.searchParams;
  return <DueTodayClient searchParams={searchParams} />;
}
