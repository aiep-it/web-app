"use client";
import { Input, InputProps } from "@heroui/react";
import { forwardRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IProps = {
  name: string;
};
type Props = IProps & InputProps;
const CTextField = forwardRef<HTMLInputElement, Props>(
  ({ name, ...other }: Props, ref) => {
    const { control } = useFormContext();

    console.log("control", control);
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          console.log("field", field, error);
          return (
            <Input
              {...field}
              fullWidth
              value={
                typeof field.value === "number" && field.value === 0
                  ? ""
                  : field.value
              }
              isInvalid={!!error}
              helperText={error?.message}
              inputRef={ref}
              errorMessage={error?.message}
              {...other}
            />
          );
        }}
      />
    );
  }
);

export default CTextField;
