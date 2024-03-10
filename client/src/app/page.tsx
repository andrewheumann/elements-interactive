import dynamic from 'next/dynamic';

const Model = dynamic(() => import('../components/Model'), {
  ssr: false,
});
export default function Home() {
  return (
    <main className='w-screen h-screen'>
      <Model />
    </main>
  );
}
