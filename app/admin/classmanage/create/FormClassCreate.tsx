'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Textarea, Button, Select, SelectItem } from '@heroui/react';
import toast from 'react-hot-toast';

import { getAllTeachers } from '@/services/user';
import { getRoadmap } from '@/services/roadmap';
import { createClass } from '@/services/class';
import { ClassLevel } from '@/services/types/class';
import { classSchema } from '@/app/admin/classmanage/schema/classSchema';
import { useRouter } from 'next/navigation';
interface FormData {
  name: string;
  description?: string;
  level: ClassLevel;
  teacherIds: string[];
  roadmapIds: string[];
}
const FormClassCreate = () => {
  const [teachers, setTeachers] = useState<{ id: string; fullName: string }[]>(
    [],
  );
  const [roadmaps, setRoadmaps] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      level: ClassLevel.STARTERS,
      teacherIds: [],
      roadmapIds: [],
    },

    resolver: async (data, context, options) => {
      try {
        await classSchema.validate(data, { abortEarly: false });
        return { values: data, errors: {} };
      } catch (yupError: any) {
        const formErrors: any = {};
        if (yupError.inner) {
          yupError.inner.forEach((err: any) => {
            if (err.path) formErrors[err.path] = { message: err.message };
          });
        }
        return { values: {}, errors: formErrors };
      }
    },
  });

  const values = watch();

  const onSubmit = async (data: FormData) => {
    try {
      await createClass(data);
      toast.success('Class created successfully!');
      reset();
      router.push('/admin/classmanage');
    } catch (error) {
      toast.error('An error occurred while creating the class');
    }
  };

  useEffect(() => {
    async function fetchData() {
      const teacherList = await getAllTeachers();
      const roadmapList = await getRoadmap();
      setTeachers(
        teacherList.map((teacher) => ({
          id: teacher.id,
          fullName: teacher.fullName || '', // Provide a default value if fullName is undefined
        })),
      );
      setRoadmaps(roadmapList);
    }
    fetchData();
  }, []);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-3xl mx-auto p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold">Create New Class</h2>

      <Input
        label="Class Name"
        {...register('name')}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />
      <Textarea label="Description" {...register('description')} />

      <Select
        name="level"
        selectedKeys={[values.level]}
        onSelectionChange={(keys) =>
          setValue('level', Array.from(keys)[0] as ClassLevel)
        }
        isInvalid={!!errors.level}
        errorMessage={errors.level?.message}
      >
        <SelectItem key={ClassLevel.STARTERS}>Starters</SelectItem>
        <SelectItem key={ClassLevel.MOVERS}>Movers</SelectItem>
        <SelectItem key={ClassLevel.FLYERS}>Flyers</SelectItem>
      </Select>

      <Select
        label="Select Teacher"
        name="teacherIds"
        selectionMode="multiple"
        selectedKeys={values.teacherIds}
        onSelectionChange={(keys) =>
          setValue('teacherIds', Array.from(keys) as string[])
        }
        isInvalid={!!errors.teacherIds}
        errorMessage={errors.teacherIds?.message}
      >
        {teachers.map((t) => (
          <SelectItem key={t.id}>{`${t.fullName} `}</SelectItem>
        ))}
      </Select>

      <Select
        label="Select Roadmap"
        name="roadmapIds"
        selectionMode="multiple"
        selectedKeys={values.roadmapIds}
        onSelectionChange={(keys) =>
          setValue('roadmapIds', Array.from(keys) as string[])
        }
        isInvalid={!!errors.roadmapIds}
        errorMessage={errors.roadmapIds?.message}
      >
        {roadmaps.map((r) => (
          <SelectItem key={r.id}>{r.name}</SelectItem>
        ))}
      </Select>

      <div className="text-right">
        <Button color="primary" type="submit">
          Create Class
        </Button>
      </div>
    </form>
  );
};

export default FormClassCreate;
