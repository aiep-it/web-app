// app/token-display.tsx
"use client"; // BẮT BUỘC: Đánh dấu đây là Client Component

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function TokenDisplay() {
  const { getToken, isLoaded, isSignedIn, userId, sessionId } = useAuth();
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      if (isLoaded && isSignedIn && sessionId) { // Chỉ chạy khi Clerk đã tải, người dùng đăng nhập và có session
        try {
          const token = await getToken(); // Lấy JWT token
          setJwtToken(token);
          setLoading(false);
        } catch (err: any) {
          console.error("Failed to get Clerk JWT Token:", err);
          setError(`Failed to get token: ${err.message || 'Unknown error'}`);
          setLoading(false);
        }
      } else if (isLoaded && !isSignedIn) {
        setLoading(false);
        setError("User not signed in.");
      } else {
        setLoading(true); // Vẫn đang tải nếu chưa isLoaded
      }
    }

    fetchToken();
  }, [isLoaded, isSignedIn, sessionId, getToken]); // Dependencies để useEffect chạy lại khi các giá trị này thay đổi

  if (loading) {
    return <div style={{ color: 'white', padding: '10px', backgroundColor: 'gray' }}>Loading Clerk token...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', padding: '10px', backgroundColor: 'lightgray' }}>Error: {error}</div>;
  }

  return (
    <div style={{
      backgroundColor: '#333',
      color: '#0f0',
      padding: '15px',
      margin: '20px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      wordBreak: 'break-all'
    }}>
      <h3>Clerk JWT Token (Frontend):</h3>
      <p>User ID: {userId}</p>
      <p>Session ID: {sessionId}</p>
      <p style={{ fontSize: '0.8em', lineHeight: '1.2' }}>{jwtToken}</p>
      <button
        onClick={() => {
          if (jwtToken) {
            navigator.clipboard.writeText(jwtToken)
              .then(() => alert('Token copied to clipboard!'))
              .catch(() => {
                // Fallback for document.execCommand('copy')
                const el = document.createElement('textarea');
                el.value = jwtToken;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                alert('Token copied to clipboard (fallback)!');
              });
          }
        }}
        style={{
          marginTop: '10px',
          padding: '8px 12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Copy Token
      </button>
    </div>
  );
}
