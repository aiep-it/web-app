import * as yup from 'yup';
import { ClassLevel } from '@/services/types/class';

export const classSchema = yup.object().shape({
  name: yup.string().min(3, 'Tên lớp quá ngắn').required('Tên lớp là bắt buộc'),
  code: yup.string().min(2, 'Mã lớp quá ngắn').required('Mã lớp là bắt buộc'),
  description: yup.string().optional(),
  level: yup
    .mixed<ClassLevel>()
    .oneOf(Object.values(ClassLevel), 'Cấp độ không hợp lệ')
    .required('Cấp độ là bắt buộc'),
  teacherIds: yup
    .array()
    .of(yup.string())
    .min(1, 'Phải chọn ít nhất 1 giáo viên')
    .required('Danh sách giáo viên là bắt buộc'),
  roadmapIds: yup
    .array()
    .of(yup.string())
    .min(1, 'Phải chọn ít nhất 1 roadmap')
    .required('Danh sách roadmap là bắt buộc'),
});
