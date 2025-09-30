import AuthForm from "@/components/AuthForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SignUp = async () => {
  const session = await getServerSession();
  if (session) {
    // Redirect to home page if user is already logged in
    return redirect("/");
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthForm type="sign-up" />
    </div>
  );
};

export default SignUp;
