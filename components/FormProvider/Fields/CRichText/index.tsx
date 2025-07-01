"use client";
import React, { forwardRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";

type IProps = {
  name: string;
  label: string;
};
type Props = IProps;

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});
const CRichText = forwardRef<HTMLInputElement, Props>(
  ({ name, label, ...other }: Props, ref) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        render={({
          field: { value, onChange, ...restField },
          fieldState: { error },
        }) => {
            console.log("CRichText value:", value, error);
          return (
            <div className="h-full">
              <label className="block text-small font-medium mb-1.5">
                {label}
              </label>

              <RichTextEditor value={value} onChange={onChange} />
            </div>
          );
        }}
      />
    );
  }
);

export default CRichText;
