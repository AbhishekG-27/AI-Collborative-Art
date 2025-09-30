"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthFormtypes } from "@/types";

// Zod validation schemas
const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

const AuthForm = ({ type }: AuthFormtypes) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    try {
      if (type === "sign-in") {
        const data: SignInFormData = {
          email: formData.email,
          password: formData.password,
        };
        signInSchema.parse(data);
      } else {
        const data: SignUpFormData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };
        signUpSchema.parse(data);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const isValid = validateForm();
    if (!isValid) {
      setLoading(false);
      return;
    }

    // Form submission logic would go here
    if (type === "sign-in") {
      // Handle sign-in
      try {
        const user = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
        });
        if (user?.error) {
          setErrors((prev) => ({
            ...prev,
            email: "Invalid email or password",
          }));
          throw new Error(user.error);
        }
      } catch (error) {
        console.error("An unexpected error occurred during sign-in:", error);
      } finally {
        setLoading(false);
      }
    } else {
      // Handle sign-up
      try {
        const response = await fetch("/api/user/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          setErrors((prev) => ({
            ...prev,
            email: errorData.message,
          }));
          throw new Error(errorData.message);
        }

        router.push("/sign-in");
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      } finally {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      switch (error) {
        case "UserNotFound":
          setAuthError(
            "No user found. Please check your credentials and try again."
          );
          break;
        case "InvalidPassword":
          setAuthError("Invalid password. Please try again later.");
          break;
        case "InvalidCredentials":
          setAuthError("Invalid credentials. Please try again later.");
          break;
        default:
          setAuthError("An error occurred during sign in. Please try again.");
      }
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-8">
        {/* Display authentication error */}
        {authError && (
          <div className="mb-6 p-4 border border-red-300 rounded-md bg-red-50">
            <p className="text-sm text-red-600 text-center">{authError}</p>
          </div>
        )}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 text-center">
            {type === "sign-in" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm text-gray-600 text-center mt-2">
            {type === "sign-in"
              ? "Please sign in to your account"
              : "Please fill in the details to create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "sign-up" && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 ${
                  errors.username
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 ${
                errors.email
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 ${
                errors.password
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            disabled={loading === true}
            type="submit"
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 font-medium cursor-pointer"
          >
            {loading
              ? "Loading..."
              : type === "sign-in"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="border-t border-gray-300 my-4"></div>
        <div className="">
          <button
            onClick={() => signIn("google")}
            className="w-full bg-white border border-gray-300 text-gray-900 py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 font-medium cursor-pointer"
          >
            Sign in with Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {type === "sign-in" ? (
              <>
                Don't have an account?{" "}
                <span
                  onClick={() => router.push("/sign-up")}
                  className="text-gray-900 hover:underline cursor-pointer font-medium"
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => router.push("/sign-in")}
                  className="text-gray-900 hover:underline cursor-pointer font-medium"
                >
                  Sign in
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
