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
import GuideNewRoadMap from '../../roadmaps/new/component/GuideNewRoadMap';
import FormClassCreate from './FormClassCreate';
import GuideNewClass from './GuideNewCreate';

interface FormData {
  name: string;
  code: string;
  description?: string;
  level: ClassLevel;
  teacherIds: string[];
  roadmapIds: string[];
}

export default function CreateClassForm() {
  const [teachers, setTeachers] = useState<{ id: string; fullName: string }[]>([]);
  const [roadmaps, setRoadmaps] = useState<{ id: string; name: string }[]>([]);

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
      code: '',
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
    } catch (error) {
      toast.error('An error occurred while creating the class');
    }
  };

  useEffect(() => {
    async function fetchData() {
      const teacherList = await getAllTeachers();
      const roadmapList = await getRoadmap();
      setTeachers(teacherList.map(teacher => ({
        id: teacher.id,
        fullName: teacher.fullName || '', // Provide a default value if fullName is undefined
      })));
      setRoadmaps(roadmapList);
    }
    fetchData();
  }, []);

  return (
 
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
    <div className="py-4">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        Create New Class
      </h1>
      <p className="text-default-500 mt-2">
        Create a new class to manage your students and resources. Fill in the details below to get started.
      </p>
    </div>

    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:flex-1">
        <GuideNewClass />
      </div>

      <div className="lg:flex-1">
    
        <FormClassCreate/>
      </div>
    </div>
  </div>
  );
}
