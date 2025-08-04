import React from 'react';
import { Icon } from '@iconify/react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <Icon icon="lucide:loader-2" className="animate-spin text-primary-500 text-4xl" />
      <span className="ml-3 text-lg text-default-600">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
