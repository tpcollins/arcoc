import Form from "./Components/Form";
import Footer from "./R Components/Footer";
import { shareKeyFormData } from "./Data/Data";
import { mainPageFooterData } from "./Data/Data";
import { ApiKeyProvider } from '@/Contexts/ApiKeyContext';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ApiKeyProvider>
          <Form data={shareKeyFormData}/>
        </ApiKeyProvider>
      </main>
      
      <Footer data={mainPageFooterData}/>
    </div>
  );
}
