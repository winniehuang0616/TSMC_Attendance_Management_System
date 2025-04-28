import LoginForm from "./components/loginForm";

export type loginProps = {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

function LoginPage({setIsLoggedIn}: loginProps) {
  return (
   
      <main className="flex flex-row mx-auto w-full px-20">
        <div className="w-[45%] flex flex-col justify-center pl-12">
          <h2 className="mb-2 text-5xl">
            Attendance <br />
            <span className="text-darkBlue">for your business</span>
          </h2>
          <p className="text-gray  mt-6 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            itaque accusantium odio, soluta, corrupti aliquam quibusdam tempora
            at cupiditate quis eum maiores libero veritatis? Dicta facilis sint
            aliquid ipsum atque?
          </p>
        </div>
          <div className="w-[55%] flex items-center justify-center">
          <LoginForm setIsLoggedIn={setIsLoggedIn}/>
        </div>
      </main>
  );
}

export default LoginPage;
