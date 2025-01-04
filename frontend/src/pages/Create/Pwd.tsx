import { useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateStore } from '@/store/create';
import { Stack } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';

function Pwd() {

  const {pwd, setPwd, setStatus} = useCreateStore()
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('')
  const navigate = useNavigate();
  const { toast } = useToast()

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // 阻止默认表单提交行为
    console.log(pwd, confirmPwd)
    if(pwd.length < 8) {
      setError('The password must be at least eight digits！')
    } else if(pwd === confirmPwd) {
      setStatus('create')
    }else{
      setError('Check whether the entered password is consistent')
    }
  }
  return (
    <>
      <Toaster />
      <form className="flex flex-col items-center justify-center" onSubmit={onSubmit}>
        <div style={{textAlign:'center', padding:'12px 0 24px 0'}}>Create a password for your wallet</div>
        <Stack gap="4" align="flex-start" width="500px">

          <Field label="Input wallet Password:" helperText="The password must be at least eight digits！" errorText={error}>
            <Input
              placeholder="is required."
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </Field>
          <Field label="Confirm wallet Password:" errorText={error}>
            <Input
              placeholder="is required."
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
          </Field>
        </Stack>
        <Button type="submit" className="m-4">Confirm</Button>
      </form>
    </>
  )
}

export default Pwd
