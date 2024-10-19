import CustomMap from "./components/CustomMap"
import Image from 'next/image'; // Ensure this is imported

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col  row-start-2 items-center ">
    
      <CustomMap></CustomMap>
       
      </main>
    </div>
  );
}
