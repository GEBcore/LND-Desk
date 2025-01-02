import { useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateStore } from '@/store/create';

function Pwd() {

  const {pwd, setPwd, setStatus} = useCreateStore()
  const [confirmPwd, setConfirmPwd] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast()

  function comparePwd(pwd: string, confirmPwd: string){
    console.log(pwd, confirmPwd)
    if(pwd === confirmPwd) {
      setStatus('create')
    }
  }
  return (
    <>
      <Toaster />
      <div className='flex w-full max-w-3xl items-center space-x-3'>
        <Label className="w-[15%] max-w-xs">Create a password for your wallet</Label>
      </div>
      <div className='flex w-full max-w-3xl items-center space-x-3'>
        <Label className="w-[15%] max-w-xs">Input wallet Password:</Label>
        <Input className="w-full" id="pwd" type="pwd" value={pwd} onChange={(e) => setPwd(e.target.value)} />
      </div>
      <div className='flex w-full max-w-3xl items-center space-x-3'>
        <Label className="w-[15%] max-w-xs">Confirm wallet Password:</Label>
        <Input className="w-full" id="conformPwd" type="pwd" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
      </div>
      <Button onClick={()=>comparePwd(pwd, confirmPwd)} className="dark">Confirm</Button>
    </>
  )
}

export default Pwd
