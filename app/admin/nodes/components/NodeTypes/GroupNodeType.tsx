import { GroupNode } from '@/components/GroupNode';
import { NodeProps } from '@xyflow/react';
import React, { memo } from 'react'

const GroupNodeType =memo(({ selected }: NodeProps) => {
    return <GroupNode selected={selected} label="Label" />;
  });
  

export default GroupNodeType