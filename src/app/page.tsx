"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [entityType, setEntityType] = useState<"user" | "provider" | null>(
    null
  );

  const handleSelectRole = (type: "user" | "provider") => {
    setEntityType(type);
  };

  const handleNavigate = (path: "login" | "signup") => {
    if (entityType) {
      router.push(`/${path}?entityType=${entityType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Welcome to My Skill Share App
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Choose Your Role
        </h2>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => handleSelectRole("user")}
            className={`px-4 py-2 rounded-lg font-medium ${
              entityType === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            User
          </button>
          <button
            onClick={() => handleSelectRole("provider")}
            className={`px-4 py-2 rounded-lg font-medium ${
              entityType === "provider"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Provider
          </button>
        </div>
        {entityType && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleNavigate("login")}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Login
            </button>
            <button
              onClick={() => handleNavigate("signup")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Signup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
