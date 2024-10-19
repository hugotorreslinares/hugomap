import dynamic from 'next/dynamic';

const CustomMap = dynamic(() => import('./components/CustomMap'), {
    ssr: false, // This will disable server-side rendering for this component
});

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col row-start-2 items-center">

                <CustomMap />
            </main>
        </div>
    );
}