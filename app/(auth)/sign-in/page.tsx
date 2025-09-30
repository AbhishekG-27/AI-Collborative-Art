import AuthForm from "@/components/AuthForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await getServerSession();
  if (session) {
    // Redirect to home page if user is already logged in
    return redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthForm type="sign-in" />
    </div>
  );
}
