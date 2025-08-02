// schemas/studentSchema.ts
import * as yup from 'yup';

export const studentSchema = yup.object({
  fullName: yup.string().required('Họ tên là bắt buộc'),
  parentName: yup.string().required('Tên phụ huynh là bắt buộc'),
  parentPhone: yup
    .string()
    .matches(/^(0|\+84)[0-9]{9}$/, 'SĐT không hợp lệ')
    .required('SĐT là bắt buộc'),
  address: yup.string().min(5, 'Địa chỉ quá ngắn').required('Địa chỉ là bắt buộc'),
});
