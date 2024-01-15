"use client";

import { FC } from 'react'
import { BillboardColumn } from '@/components/columns/billboards-columns';

interface CellActionProps {
  data: BillboardColumn;
};

const CellAction: FC<CellActionProps> = ({
  data,
}) => {
  return (
    <div>...</div>
  )
}

export default CellAction;