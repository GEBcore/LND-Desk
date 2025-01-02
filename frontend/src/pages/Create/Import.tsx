import { useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateStore } from '@/store/create';

function Import() {

  const {pwd, setPwd} = useCreateStore()
  const [confirmPwd, setConfirmPwd] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast()

  function SavePwd(value: string) {
    setPwd(value);
    localStorage.setItem('pwd', value);
  }

  function SaveConfirmPwd(value: string) {
    setConfirmPwd(value);
    localStorage.setItem('pwd', value);
  }

  function comparePwd(pwd: string, confirmPwd: string){
    if(pwd === confirmPwd) {

    }
  }
  return (
    <div className='dark flex flex-col items-center justify-center h-screen mx-w-full'>

    </div>
  )
}

export default Import
