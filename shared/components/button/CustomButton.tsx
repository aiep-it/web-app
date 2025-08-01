import React from 'react';
import { Button, ButtonProps } from '@heroui/button';
import { Icon } from '@iconify/react';

export interface CustomButtonProps extends Omit<ButtonProps, 'startContent' | 'endContent'> {
  icon?: string;
  iconPosition?: 'start' | 'end';
  iconSize?: number;
  children: React.ReactNode;
  preset?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline';
  iconClassName?: string;
  loading?: boolean;
  loadingText?: string;
}

const PRESET_STYLES = {
  primary: {
    color: 'primary' as const,
    variant: 'solid' as const,
    className: 'bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-sm'
  },
  secondary: {
    color: 'default' as const,
    variant: 'solid' as const,
    className: 'bg-gray-500 hover:bg-gray-600 text-white font-medium shadow-sm'
  },
  success: {
    color: 'success' as const,
    variant: 'solid' as const,
    className: 'bg-green-500 hover:bg-green-600 text-white font-medium shadow-sm'
  },
  warning: {
    color: 'warning' as const,
    variant: 'solid' as const,
    className: 'bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-sm'
  },
  danger: {
    color: 'danger' as const,
    variant: 'solid' as const,
    className: 'bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm'
  },
  ghost: {
    color: 'default' as const,
    variant: 'light' as const,
    className: 'text-gray-600 hover:bg-gray-100 font-medium'
  },
  outline: {
    color: 'primary' as const,
    variant: 'bordered' as const,
    className: 'border-blue-500 text-blue-500 hover:bg-blue-50 font-medium'
  }
};

export const CustomButton: React.FC<CustomButtonProps> = ({
  icon,
  iconPosition = 'start',
  iconSize = 20,
  children,
  preset = 'primary',
  iconClassName = '',
  loading = false,
  loadingText = 'Loading...',
  className = '',
  disabled,
  ...props
}) => {
  const presetStyle = PRESET_STYLES[preset];
  // Combine preset className with custom className
  const combinedClassName = `${presetStyle.className} ${className}`.trim();
  const iconElement = icon ? (
    <Icon 
      icon={loading ? 'lucide:loader-2' : icon} 
      width={iconSize} 
      className={`${iconClassName} ${loading ? 'animate-spin' : ''}`.trim()}
    />
  ) : null;
  const buttonContent = loading ? loadingText : children;
  const startContent = iconPosition === 'start' ? iconElement : undefined;
  const endContent = iconPosition === 'end' ? iconElement : undefined;
  
  return (
    <Button
      {...presetStyle}
      {...props}
      startContent={startContent}
      endContent={endContent}
      className={combinedClassName}
      disabled={disabled || loading}
    >
      {buttonContent}
    </Button>
  );
};

export default CustomButton;
