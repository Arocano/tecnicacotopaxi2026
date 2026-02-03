
import LoginForm from "@/components/loginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex w-screen h-screen items-center justify-center bg-neutral-100">
      <div className="w-3/4 h-4/5 bg-white rounded-xl shadow-lg flex flex-row">
        <div className="flex w-2/5 h-full rounded-s-xl relative items-center justify-center">
          <Image
            src="/images/logo-gad.png"
            width={250}
            height={300}
            quality={100}
            alt={"logo"}
            className="w-full h-auto object-contain items-center justify-center"
          />
        </div>

        <div className="w-3/5 h-full flex flex-col items-center justify-center rounded-r-xl">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}