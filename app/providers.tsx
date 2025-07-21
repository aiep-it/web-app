// web-app/app/providers.tsx
"use client";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@heroui/toast";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { VocabularyProvider } from "@/components/vocabulary/VocabularyContext";


export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const AuthTokenSync = () => {
    useAxiosAuth();
    return null;
  };

  return (
    <ClerkProvider>
      {isMounted && <AuthTokenSync />}
      <HeroUIProvider navigate={router.push}>
         <ToastProvider placement='top-right'/>
        <NextThemesProvider {...themeProps}>
          <VocabularyProvider>
            {children}
          </VocabularyProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </ClerkProvider>
  );
}