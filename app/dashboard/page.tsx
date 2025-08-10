'use client';
import React from 'react';
import { Spinner } from '@heroui/react';
import { useRoleRedirect } from '../../hooks/useRoleRedirect';

export default function DashboardRedirectPage() {
  useRoleRedirect();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
      <span className="ml-4 text-lg">Redirecting...</span>
    </div>
  );
}
