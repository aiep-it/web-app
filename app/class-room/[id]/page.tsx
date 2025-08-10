import React from 'react'
import ClassRoomPage from './ClassRoomPage';

export default function Page({ params }: { params: { id: string } }) {
  return <ClassRoomPage classId={params.id} />;
}