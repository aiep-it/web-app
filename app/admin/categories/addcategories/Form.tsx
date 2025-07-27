import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { CategoryCreateForm } from '../../roadmaps/categories/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { categorySchema } from '../../roadmaps/categories/schema';
import CTextField from '@/components/FormProvider/Fields/CTextField';
import FormProvider from '@/components/FormProvider';
import { addNewCategory } from '@/services/category';
import { Category } from '@/services/types/category';

export interface FormAddCategoryRef {
  submit: () => void | Promise<void>;
}
interface FormAddCategoryProps {
  onSuccess?: () => void;
}
const FormAddCategory = forwardRef<FormAddCategoryRef, FormAddCategoryProps>(
  ({ onSuccess }, ref) => {
    const defaultValues = {
      name: '',
      description: '',
    };

    const methods = useForm<CategoryCreateForm>({
      resolver: yupResolver(categorySchema),
      defaultValues,
    });

    const { handleSubmit } = methods;

    const onSubmit = async (data: CategoryCreateForm) => {
      const res = await addNewCategory(data);
      if (res && res?.id && onSuccess) {
        onSuccess();
      }
    };

    // Expose submit method to parent
    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(onSubmit)();
      },
    }));

    return (
      <Card>
        <CardHeader>Thông tin cho Loại</CardHeader>
        <CardBody>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <CTextField
                className="my-5"
                name="name"
                placeholder="Name"
                isRequired
                label="Tên"
              />
              <CTextField
                name="description"
                label="Mô Tả"
                placeholder="description"
              />
            </div>
          </FormProvider>
        </CardBody>
      </Card>
    );
  },
);

export default FormAddCategory;
