"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { CategoryCreateForm } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../schema";
import FormProvider from "@/components/FormProvider";
import CTextField from "@/components/FormProvider/Fields/CTextField";
import { Button } from "@heroui/button";

const FormCreate = () => {
  const defaultValues = {
    name: "",
    description: "",
  };
  const methods = useForm<CategoryCreateForm>({
    resolver: yupResolver(categorySchema),
    defaultValues,
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = async (data: CategoryCreateForm) => {
    console.log("data", data);

    //TODO call api create
  };

  return (
    <Card>
      <CardHeader>Create</CardHeader>
      <CardBody>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <CTextField name="name" placeholder="Name" isRequired  label="Name"/>
          <CTextField name="description" placeholder="description" />
          
          <Button type="submit">submit</Button>
        </FormProvider>
      </CardBody>
    </Card>
  );
};

export default FormCreate;
