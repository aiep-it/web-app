// web-app/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn, useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function SignInPage() {
    return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
}