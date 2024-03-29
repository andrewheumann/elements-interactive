import dynamic from 'next/dynamic';

const Model = dynamic(() => import('../components/ThreeDView'), {
  ssr: false,
});
export default function Home() {
  return (
    <main className='w-screen h-screen'>
      <Model />
    </main>
  );
}
