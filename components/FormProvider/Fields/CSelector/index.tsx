"use client";

import { Select, SelectProps } from "@heroui/react";
import React, { forwardRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IProps = {
  name: string;
};
type Props = IProps & SelectProps;

const CSelector = forwardRef<HTMLInputElement, Props>(
  ({ name, selectionMode = "single", ...other }: Props, ref) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        shouldUnregister
        render={({ field, fieldState: { error } }) => {
          const value = field.value ?? (selectionMode === "multiple" ? [] : "");

          return (
            <Select
              {...other}
              selectionMode={selectionMode}
              selectedKeys={
                selectionMode === "multiple"
                  ? new Set(value)
                  : new Set([value])
              }
              onSelectionChange={(keys) => {
                const selected = Array.from(keys);
                const result =
                  selectionMode === "multiple" ? selected : selected[0] || "";
                field.onChange(result);
              }}
              isInvalid={!!error}
              errorMessage={error?.message}
              
            />
          );
        }}
      />
    );
  }
);

CSelector.displayName = "CSelector";
export default CSelector;
