import { useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import LoginPage  from "@/LoginPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  return (
    <>
      <div className="flex h-screen flex-col">
        <Header userName="Praful" isLoggedIn={isLoggedIn}/>
        <div className="flex flex-1">
        {isLoggedIn&&
          <div className="w-[18%]">
            <Sidebar role="manager"/>
          </div>}
          <div className={`flex flex-1 overflow-hidden bg-background pt-20 ${
    isLoggedIn ? "pb-12 pl-20"  : ""
  }`}>
            {!isLoggedIn&&<LoginPage setIsLoggedIn={setIsLoggedIn}/>}
            <Toaster />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
