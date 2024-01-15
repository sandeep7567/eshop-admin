"use client";

import { FC, useEffect, useState } from 'react'
import { Button } from './button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';

import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  values: string[];
};

export const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  values = []
}) => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  };

  const onUpload = (results: any) => {
    onChange(results?.info.secure_url);
  };

  const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {values?.map((url) => {
          return (
            <div key={url} className=' relative w-[200px] h-[200px] rounded-md overflow-hidden'>
              <div className='z-10 absolute top-2 right-2'>
                <Button size={"icon"} variant={"destructive"} type='button' onClick={() => onRemove(url)}>
                  <Trash className='w-4 h-4' />
                </Button>
              </div>
              <Image src={url} alt='img' className='object-cover' fill />
            </div>
          )
        })}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset={uploadPreset}>
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type='button'
              variant={"secondary"}
              disabled={disabled}
              onClick={onClick}
            >
              <ImagePlus className='h-4 w-4 mr-2'/>
              Upload a Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
};