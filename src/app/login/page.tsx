"use client";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const entityType = searchParams.get("entityType") as
    | "user"
    | "provider"
    | null;
  const { setAuth } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    if (!entityType) {
      alert("Please select a role (User or Provider) from the home page.");
      return;
    }
    try {
      const response = await api.post("/auth/login", data);
      setAuth(response.data.access_token, entityType);
      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login as {entityType || "Unknown"}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push(`/signup?entityType=${entityType}`)}
            className="text-blue-500 hover:underline"
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
}
