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
      <form onSubmit={()=>comparePwd(pwd, confirmPwd)}>
        Create a password for your wallet
        <Stack gap="4" align="flex-start" width="500px">

          <Field label="Input wallet Password:">
            <Input
              placeholder="is required."
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </Field>
          <Field label="Confirm wallet Password:">
            <Input
              placeholder="is required."
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
          </Field>
          <Button type="submit" onClick={()=>comparePwd(pwd, confirmPwd)}>Submit</Button>
        </Stack>
      </form>
    </>
  )
}

export default Pwd
