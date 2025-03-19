'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export default function SignIn2() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return <div>載入中...</div>;
  }

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">已登入</h1>
        <div className="mb-4">
          <p>歡迎，{session.user.name}</p>
          <p>Email: {session.user.email}</p>
          <p>
            {session.user.image && (
              <img src={session.user.image} alt="Profile" className="w-10 h-10 rounded-full" />
            )}
          </p>
        </div>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-w-full">
          {JSON.stringify(session, null, 2)}
        </pre>
        <button
          onClick={() => signOut()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          登出
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">未登入</h1>
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        使用 Google 登入
      </button>
    </div>
  );
}