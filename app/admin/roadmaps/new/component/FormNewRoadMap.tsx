"use client";
import { RoadmapPayload } from "@/services/types/roadmap";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { roadmapSchema } from "../../schema";
import FormProvider from "@/components/FormProvider";
import CTextField from "@/components/FormProvider/Fields/CTextField";
import { addToast, Button, SelectItem } from "@heroui/react";
import CSelector from "@/components/FormProvider/Fields/CSelector";
import { Category } from "@/services/types/category";
import { getAllCategories } from "@/services/category";
import ButtonConfirm from "@/components/ButtonConfirm";
import { createRoadmap } from "@/services/roadmap";
import { useRouter } from "next/navigation";

const defaultValues = {
  name: "",
  description: "",
};
const FormNewRoadMap = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const methods = useForm<RoadmapPayload>({
    resolver: yupResolver(roadmapSchema),
    defaultValues,
  });

  const router = useRouter();
  const onSubmit = async (data: RoadmapPayload) => {
    const payload = { ...data };

    const res = await createRoadmap(payload);

    if (res) {
      addToast({
        title: "Roadmap created successfully",
        color: "success",
        description: "Roadmap has been created successfully",
      });
      const {id} = res
      methods.reset();
      router.push(`/admin/roadmaps/${id}/nodes/new`);
    }
  };

  const getCategories = async () => {
    const res = await getAllCategories();
    if (res) {
      setCategories(res);
    } else {
      setCategories([]);
    }
  };

  const { handleSubmit } = methods;

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <FormProvider
      className="w-full max-w-xs flex flex-col gap-4"
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col sm:flex-row gap-4 w-full pt-3">
        <div className="flex-1">
          <CTextField
            name="name"
            isRequired
            label="name"
            labelPlacement="outside"
            placeholder="Enter your name of road map"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full pt-3">
        <div className="flex-1">
          <CSelector
            name="categoryId"
            label="Category"
            selectionMode="single"
            placeholder="Select a role"
            labelPlacement="outside"
          >
            {categories.map((category) => {
              return <SelectItem key={category.id}>{category.name}</SelectItem>;
            })}
          </CSelector>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full pt-3">
        <div className="flex-1">
          <CTextField
            name="description"
            placeholder="Description"
            label="Description"
            labelPlacement="outside"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-3 justify-end">
        <ButtonConfirm
          color="primary"
          previousValidate={ async () => {
            const isValid = await methods.trigger();
            return isValid;
          }}
          onSave={handleSubmit(onSubmit)}
        />
      </div>
    </FormProvider>
  );
};

export default FormNewRoadMap;
