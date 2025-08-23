'use client';

import React, { useState } from 'react';
import {
  Input, Button, Card, CardBody, CardHeader, Table, TableHeader,
  TableColumn, TableBody, TableRow, TableCell, useDisclosure,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Spinner, Tabs, Tab
} from "@heroui/react";
import { Icon } from '@iconify/react';
import * as XLSX from 'xlsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { studentSchema } from '../schema/studentSchema';
import { StudentPayload } from '@/services/types/student';
import { createStudent, importStudentsExcel } from '@/services/student';

interface Props {
  refetchStudents?: () => void;
}

const StudentManagementForm: React.FC<Props> = ({ refetchStudents }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentPayload>({
    resolver: yupResolver(studentSchema),
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newCredentials, setNewCredentials] = useState<{ username: string; password: string; fullName?: string } | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importedStudents, setImportedStudents] = useState<{ username: string; password: string }[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmitForm = async (data: StudentPayload) => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const result = await createStudent(data);
      if (result) {
        setSuccessMessage(' Tạo học sinh thành công!');
        setNewCredentials({ ...result, fullName: data.fullName });
        reset();
        onOpen();
        refetchStudents?.();
      } else {
        setErrorMessage('❌ Có lỗi xảy ra');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || '❌ Lỗi khi tạo học sinh';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setPreviewData([]);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setPreviewData(json);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('❌ Vui lòng chọn một file Excel.');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    setImportedStudents([]);

    try {
      const result = await importStudentsExcel(file);
      if (!result?.students || !Array.isArray(result.students) || result.students.length === 0) {
        setErrorMessage('❌ File không hợp lệ hoặc không có học sinh nào được tạo.');
      } else {
        setSuccessMessage(`✅ Đã tạo ${result.count} học sinh thành công.`);
        setImportedStudents(result.students);
        setFile(null);
        setPreviewData([]);
        refetchStudents?.();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || '❌ Lỗi khi gửi yêu cầu import file.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto  max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold ">Thêm Học Sinh</h2>
        </CardHeader>
        <CardBody>
          <Tabs aria-label="Student Management Options">
            <Tab key="create" title="Tạo Học sinh Mới">
              <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-2 ">
                <Input
                  label="Họ tên học sinh"
                  placeholder="Nguyễn Văn A"
                  labelPlacement="outside-top"
                  {...register('fullName')}
                  isInvalid={!!errors.fullName}
                  errorMessage={errors.fullName?.message}
                />
                <Input
                  label="Tên phụ huynh"
                  placeholder="Nguyễn Thị B"
                  labelPlacement="outside-top"
                  {...register('parentName')}
                  isInvalid={!!errors.parentName}
                  errorMessage={errors.parentName?.message}
                />
                <Input
                  label="SĐT phụ huynh"
                  placeholder="09xx xxx xxx"
                  labelPlacement="outside-top"
                  {...register('parentPhone')}
                  isInvalid={!!errors.parentPhone}
                  errorMessage={errors.parentPhone?.message}
                />
                 <Input
                  label="Email phụ huynh (Tài khoản đăng nhập)"
                  placeholder="09xx xxx xxx"
                  labelPlacement="outside-top"
                  {...register('parentEmail')}
                  isInvalid={!!errors.parentEmail}
                  errorMessage={errors.parentEmail?.message}
                />
                <Input
                  label="Địa chỉ"
                  placeholder="123 Đường ABC, Quận XYZ"
                  labelPlacement="outside-top"
                  {...register('address')}
                  isInvalid={!!errors.address}
                  errorMessage={errors.address?.message}
                />
                <Button color="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Tạo học sinh'}
                </Button>
              </form>
            </Tab>
            <Tab key="import" title="Import từ Excel">
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold">Tải lên danh sách học sinh từ Excel</h3>
                <p className="text-sm text-gray-600">
                  Vui lòng đảm bảo file Excel của bạn có các cột: `fullName`, `parentName`, `parentPhone`, `address`.
                </p>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label
                    htmlFor="excel-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 border border-green-400 text-green-800 font-medium text-sm rounded-lg cursor-pointer transition-colors duration-200"
                  >
                    <Icon icon="mdi:upload" className="text-lg" />
                    {file ? file.name : 'Chọn file Excel'}
                  </label>
                  {file && (
                    <Button color="danger" size="sm" onPress={() => { setFile(null); setPreviewData([]); }}>
                      Xóa file
                    </Button>
                  )}
                </div>
                <Button
                  color="secondary"
                  onPress={handleUpload}
                  disabled={!file || loading}
                >
                  {loading ? <Spinner size="sm" /> : 'Upload Excel'}
                </Button>

                {previewData.length > 0 && (
                  <div className="mt-6 border rounded-lg overflow-hidden">
                    <h4 className="text-md font-semibold p-3 bg-gray-50 border-b">Xem trước dữ liệu từ Excel:</h4>
                    <Table aria-label="Excel preview" removeWrapper>
                      <TableHeader>
                        {Object.keys(previewData[0]).map((key) => (
                          <TableColumn key={key}>{key}</TableColumn>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {previewData.map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((val, idx) => (
                              <TableCell key={idx}>{String(val)}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>

          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
              <Icon icon="mdi:check-circle" className="text-xl mr-2" /> {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
              <Icon icon="mdi:alert-circle" className="text-xl mr-2" /> {errorMessage}
            </div>
          )}

          {importedStudents.length > 0 && (
            <div className="mt-4 p-4 border border-green-200 bg-green-50 rounded-lg">
              <h3 className="text-md font-semibold text-green-800 mb-2 flex items-center">
                <Icon icon="mdi:account-multiple-plus" className="text-lg mr-2" /> Danh sách tài khoản đã tạo:
              </h3>
              <ul className="text-sm list-disc list-inside text-gray-700 space-y-1">
                {importedStudents.map((s, idx) => (
                  <li key={idx}>
                    Username: <b className="font-mono">{s.username}</b>, Password: <b className="font-mono">{s.password}</b>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">🆕 Thông tin tài khoản mới</ModalHeader>
              <ModalBody>
                {newCredentials && (
                  <div className="space-y-2">
                    {newCredentials.fullName && <p className="text-gray-700">Tên học sinh: <b>{newCredentials.fullName}</b></p>}
                    <p className="text-gray-700">Tên đăng nhập: <b className="font-mono text-lg">{newCredentials.username}</b></p>
                    <p className="text-gray-700">Mật khẩu: <b className="font-mono text-lg">{newCredentials.password}</b></p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>Đóng</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StudentManagementForm;
