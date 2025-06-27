"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "@/lib/api";

export default function Dashboard() {
  const { isAuthenticated, entityType, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else {
      api.get("/auth/protected").catch(() => {
        signOut();
      });
    }
  }, [isAuthenticated, router, signOut]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Welcome, {entityType === "user" ? "User" : "Provider"}!
        </h1>
        <p className="text-gray-700 mb-6">This is your dashboard.</p>
        <button
          onClick={signOut}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
