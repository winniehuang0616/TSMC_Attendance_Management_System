function App() {
  return (
    <>
      <div className="flex h-screen flex-col">
        <div className="relative z-10 h-[14%] bg-white shadow-header"></div>
        <div className="flex flex-1">
          <div className="w-[18%] bg-white shadow-sidebar"></div>
          <div className="flex flex-1 items-center justify-center bg-background"></div>
        </div>
      </div>
    </>
  );
}

export default App;
