import LoginForm from './components/loginForm';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="fixed left-0 right-0 z-10 h-[11%] bg-white shadow-header">
        <div className="px-8 py-4 h-full flex items-center">
          <h1 className="text-blue-900 text-xl font-bold">TSMC Attendance System</h1>
        </div>
      </div>
      <main className="flex flex-1 p-8 max-w-7xl mx-auto w-full md:flex-row flex-col pt-32">
        <div className="flex-1 flex flex-col justify-center p-8">
          <h2 className="text-5xl mb-2 text-gray-800">
            Attendance <br />
            <span className="text-blue-900">for your business</span>
          </h2>
          <p className="text-gray-600 mt-6 max-w-xl leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, itaque accusantium 
            odio, soluta, corrupti aliquam quibusdam tempora at cupiditate quis eum maiores libero 
            veritatis? Dicta facilis sint aliquid ipsum atque?
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}

export default App;