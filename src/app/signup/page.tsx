"use client";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface SignupForm {
  type: "individual" | "company";
  fullName: string;
  companyName?: string;
  email: string;
  password: string;
  mobileNumber: string;
  phoneNumber?: string;
  businessTaxNumber?: string;
  address?: string;
}

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    defaultValues: {
      type: "individual",
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const entityType = searchParams.get("entityType") as
    | "user"
    | "provider"
    | null;
  const { setAuth } = useAuth();
  const type = watch("type"); // Watch type to toggle field visibility and validation

  const onSubmit = async (data: SignupForm) => {
    if (!entityType) {
      alert("Please select a role (User or Provider) from the home page.");
      return;
    }
    try {
      await api.post("/auth/signup", { ...data, entityType });
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      setAuth(response.data.access_token, entityType);
      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(
        "Signup failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Signup as {entityType || "Unknown"}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              {...register("type", { required: "Type is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="individual">Individual</option>
              <option value="company">Company</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              {...register("fullName", { required: "Full Name is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="First Name Last Name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>
          {type === "company" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                {...register("companyName", {
                  required: "Company Name is required",
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Company Name"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm">
                  {errors.companyName.message}
                </p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              {...register("mobileNumber", {
                required: "Mobile Number is required",
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Mobile Number"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm">
                {errors.mobileNumber.message}
              </p>
            )}
          </div>
          {type === "company" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                {...register("phoneNumber", {
                  required: "Phone Number is required",
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Phone Number"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          )}
          {type === "company" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Tax Number
              </label>
              <input
                {...register("businessTaxNumber", {
                  required: "Business Tax Number is required",
                  pattern: {
                    value: /^[A-Z0-9]{10}$/,
                    message:
                      "Business Tax Number must be a 10-character string with capital letters and digits",
                  },
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Business Tax Number"
              />
              {errors.businessTaxNumber && (
                <p className="text-red-500 text-sm">
                  {errors.businessTaxNumber.message}
                </p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              {...register("address", {
                required: type === "individual" ? "Address is required" : false,
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder={
                type === "individual"
                  ? "Street number, street name, City/Suburb, State, post code"
                  : "Address (optional)"
              }
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Signup
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <button
            onClick={() => router.push(`/login?entityType=${entityType}`)}
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
