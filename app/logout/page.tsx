"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("smart-farm-token");
    router.push("/login");
  }, []);

  return (
    <div>
      <h1>You are logged out.</h1>
    </div>
  );
}
export default LogoutPage;
