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

    return (
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, ...restField },
          fieldState: { error },
        }) => {
          return (
            <Input
              {...restField}
              fullWidth
              onChange={onChange}
              value={
                typeof restField.value === "number" && restField.value === 0
                  ? ""
                  : restField.value ?? ""
              }
              errorMessage={error?.message}
              isInvalid={Boolean(error?.message)}
              inputRef={ref}
              {...other}
            />
          );
        }}
      />
    );
  }
);

export default CTextField;
