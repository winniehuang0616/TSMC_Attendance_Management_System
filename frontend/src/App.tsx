import { Toaster } from "@/components/ui/toaster";
import { EditCard } from "./components/editCard";
import { ApplyForm } from "./components/applyForm";
import { DetailCard } from "./components/detailCard";

function App() {
  return (
    <>
      <div className="flex h-screen flex-col">
        <div className="fixed left-0 right-0 z-10 h-[11%] bg-white shadow-header" />
        <div className="flex flex-1">
          <div className="w-[18%] bg-white shadow-sidebar" />
          <div className="flex flex-1 overflow-auto bg-background pb-12 pl-20 pt-32">
            <DetailCard />
            <Toaster />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
