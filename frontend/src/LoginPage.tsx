import LoginForm from "./components/loginForm";

export type loginProps = {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

function LoginPage({ setIsLoggedIn }: loginProps) {
  return (
    <main className="mx-auto flex w-full flex-row px-20">
      <div className="flex w-[45%] flex-col justify-center pl-12">
        <h2 className="mb-2 text-5xl">
          Attendance <br />
          <span className="text-darkBlue">for your business</span>
        </h2>
        <p className="mt-6  leading-relaxed text-gray">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
          itaque accusantium odio, soluta, corrupti aliquam quibusdam tempora at
          cupiditate quis eum maiores libero veritatis? Dicta facilis sint
          aliquid ipsum atque?
        </p>
      </div>
      <div className="flex w-[55%] items-center justify-center">
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      </div>
    </main>
  );
}

export default LoginPage;
