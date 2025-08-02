import { getFullPathFile } from "@/utils/expections";
import { Button, Image, Input, InputProps } from "@heroui/react";
import { Icon } from "@iconify/react";
import { on } from "events";
import React, { forwardRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IProps = {
  name: string;
};
type Props = IProps & InputProps;

function isBlobUrl(url: string): boolean {
  return typeof url === "string" && url.startsWith("blob:");
}


const CImageUpload = forwardRef<HTMLInputElement, Props>(
  ({ name, ...other }: Props, ref) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        render={({
          field: { value, onChange, ...restField },
          fieldState: { error },
        }) => {
          return (
            <div
              className={`relative ${Boolean(value) === false ? "h-48" : ""} w-full flex content-center justify-center rounded-md border-2 border-dashed border-default-200 bg-default-50`}
            >
              {error && (<p>{error?.message}</p>)}
              {value ? (
                <Image
                  src={
                    value instanceof File ? URL.createObjectURL(value) : (isBlobUrl(value) ? value : getFullPathFile(value))
                  }
                  width={240}
                  alt="Background"
                  className="m-5"
                  onLoad={() => {
                    return () =>
                      value instanceof File &&
                      URL.revokeObjectURL(URL.createObjectURL(value));
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-default-500">
                    {other.placeholder || "No image selected"}
                  </p>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6"></div>
                </div>
              )}

              <div className="absolute bottom-4 right-4">
                <label htmlFor="background-upload">
                  <Button
                    as="span"
                    color="primary"
                    variant="flat"
                    startContent={<Icon icon="lucide:image" />}
                    className="cursor-pointer"
                  >
                    Change Image
                  </Button>
                </label>
                <Input
                  id="background-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e: any) => {
                    const file = e.target.files?.[0] || null;
                    onChange(file);
                  }}
                  className="hidden"
                  {...restField}
                />
              </div>
            </div>
          );
        }}
      />
    );
  }
);

export default CImageUpload;
