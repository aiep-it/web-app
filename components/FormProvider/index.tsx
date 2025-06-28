'use client'
import { FormProps } from '@heroui/react';
import React from 'react'
import { FormProvider as RHFProvider, UseFormReturn } from 'react-hook-form';

type IProps = {
	// children: React.ReactNode;
	methods: UseFormReturn<any>;
	// onSubmit?: VoidFunction;
	loading?: boolean;
};

interface FormProviderProps extends IProps, FormProps  {}
const FormProvider = ({ children, onSubmit, methods }: FormProviderProps) => {
  return (
    <RHFProvider {...methods}>
		<form onSubmit={onSubmit} noValidate>{children}</form>
	</RHFProvider>
  )
}

export default FormProvider