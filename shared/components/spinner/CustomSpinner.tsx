import React from 'react';
import { Spinner } from '@heroui/react';
import { cn } from '@/utils';

export interface CustomSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Color theme of the spinner */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** Label text to display below spinner */
  label?: string;
  /** Color of the label text */
  labelColor?: 'foreground' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** Additional CSS classes for the wrapper */
  className?: string;
  /** Additional CSS classes for the spinner */
  spinnerClassName?: string;
  /** Additional CSS classes for the label */
  labelClassName?: string;
  /** Whether to show a centered layout */
  centered?: boolean;
  /** Whether to show fullscreen overlay */
  fullscreen?: boolean;
  /** Custom loading text variants */
  variant?: 'default' | 'dots' | 'wave' | 'pulse';
}

const CustomSpinner: React.FC<CustomSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label,
  labelColor = 'foreground',
  className,
  spinnerClassName,
  labelClassName,
  centered = false,
  fullscreen = false,
  variant = 'default',
}) => {
  // Loading text animations for different variants
  const renderLoadingText = () => {
    if (!label) return null;

    switch (variant) {
      case 'dots':
        return (
          <div className={cn('flex items-center gap-1', labelClassName)}>
            <span className={`text-${labelColor}`}>{label}</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        );
      
      case 'wave':
        return (
          <div className={cn('text-center', labelClassName)}>
            <div className={`text-${labelColor} animate-pulse`}>
              {label}
            </div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={cn('text-center', labelClassName)}>
            <div className={`text-${labelColor} animate-pulse`}>
              {label}
            </div>
          </div>
        );
      
      default:
        return (
          <div className={cn('text-center', labelClassName)}>
            <span className={`text-${labelColor}`}>{label}</span>
          </div>
        );
    }
  };

  // Spinner content
  const spinnerContent = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3',
      centered && 'min-h-[200px]',
      className
    )}>
      <Spinner
        size={size}
        color={color}
        className={spinnerClassName}
      />
      {renderLoadingText()}
    </div>
  );

  // Fullscreen overlay
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  // Centered layout
  if (centered) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  // Default layout
  return spinnerContent;
};

// Pre-configured spinner variants for common use cases
export const LoadingSpinner = {
  // Page loading
  Page: (props?: Partial<CustomSpinnerProps>) => (
    <CustomSpinner
      size="lg"
      label="Loading..."
      labelColor="primary"
      centered
      {...props}
    />
  ),

  // Content loading
  Content: (props?: Partial<CustomSpinnerProps>) => (
    <CustomSpinner
      size="md"
      label="Loading content..."
      centered
      {...props}
    />
  ),

  // Button loading
  Button: (props?: Partial<CustomSpinnerProps>) => (
    <CustomSpinner
      size="sm"
      className="py-1"
      {...props}
    />
  ),

  // Inline loading
  Inline: (props?: Partial<CustomSpinnerProps>) => (
    <CustomSpinner
      size="sm"
      className="inline-flex"
      {...props}
    />
  ),

  // Fullscreen loading
  Fullscreen: (props?: Partial<CustomSpinnerProps>) => (
    <CustomSpinner
      size="lg"
      label="Loading..."
      fullscreen
      {...props}
    />
  ),

  // Topic loading
  Topic: (props?: Partial<CustomSpinnerProps>) => (
    <CustomSpinner
      size="md"
      color="primary"
      label="Loading topic..."
      labelColor="primary"
      centered
      {...props}
    />
  ),

  // Vocabulary loading
  Vocabulary: (props?: Partial<CustomSpinnerProps>) => (
    <CustomSpinner
      size="md"
      color="primary"
      label="Loading vocabulary..."
      labelColor="primary"
      centered
      variant="dots"
      {...props}
    />
  ),

  // Processing/Updating
  Processing: (props?: Partial<CustomSpinnerProps>) => (
    <CustomSpinner
      size="sm"
      color="warning"
      label="Processing..."
      variant="pulse"
      {...props}
    />
  ),

  // Saving
  Saving: (props?: Partial<CustomSpinnerProps>) => (
    <CustomSpinner
      size="sm"
      color="success"
      label="Saving..."
      variant="dots"
      {...props}
    />
  ),
};

export default CustomSpinner;
