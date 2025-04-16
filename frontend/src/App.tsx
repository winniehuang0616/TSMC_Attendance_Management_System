function App() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="h-[14%] bg-white shadow-header relative z-10"></div> 
        <div className="flex flex-1">
          <div className="w-[18%] bg-white shadow-sidebar"></div>
          <div className="flex-1 bg-background flex items-center justify-center">
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
