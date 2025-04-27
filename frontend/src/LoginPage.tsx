import LoginForm from "./components/loginForm";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="fixed left-0 right-0 z-10 h-[11%] bg-white shadow-header">
        <div className="flex h-full items-center px-8 py-4">
          <h1 className="text-blue-900 text-xl font-bold">
            TSMC Attendance System
          </h1>
        </div>
      </div>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-8 pt-32 md:flex-row">
        <div className="flex flex-1 flex-col justify-center p-8">
          <h2 className="text-gray-800 mb-2 text-5xl">
            Attendance <br />
            <span className="text-blue-900">for your business</span>
          </h2>
          <p className="text-gray-600 mt-6 max-w-xl leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            itaque accusantium odio, soluta, corrupti aliquam quibusdam tempora
            at cupiditate quis eum maiores libero veritatis? Dicta facilis sint
            aliquid ipsum atque?
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}

export default App;
