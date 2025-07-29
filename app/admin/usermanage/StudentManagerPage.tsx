'use client';

import UserManageForm from '../usermanage/components/UserManageForm';
import StudentTable from '../usermanage/components/StudentTable';

export default function StudentManagerPage() {
  return (
    <div className="">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
      
        <div className="lg:w-2/5 container mx-auto  max-w-4xl">
          <UserManageForm />
        </div>


        <div className="lg:w-3/5 w-full border p-6 rounded shadow-sm bg-white overflow-auto">
          <StudentTable />
        </div>
      </div>
    </div>
  );
}
