'use client'
import React from 'react'
import { FormProvider as RHFProvider, UseFormReturn } from 'react-hook-form';

type IProps = {
	children: React.ReactNode;
	methods: UseFormReturn<any>;
	onSubmit?: VoidFunction;
	loading?: boolean;
};

const FormProvider = ({ children, onSubmit, methods }: IProps) => {
  return (
    <RHFProvider {...methods}>
		<form onSubmit={onSubmit}>{children}</form>
	</RHFProvider>
  )
}

export default FormProvider