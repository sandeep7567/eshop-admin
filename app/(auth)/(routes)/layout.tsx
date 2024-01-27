import { ModalProvider } from '@/providers/modal-provider';
import { FC } from 'react'

interface AuthLayoutProps {
  children: React.ReactNode;
};

const AuthLayout: FC<AuthLayoutProps> = ({children}:AuthLayoutProps) => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      {children}
    </div>
  )
};

export default AuthLayout;