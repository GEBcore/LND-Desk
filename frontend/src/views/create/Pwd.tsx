import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useCreateStore } from '@/store/create';
import { Stack } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { ConfirmButton } from '@/components/ConfirmButton';

function Pwd() {

  const {pwd, setPwd, setStatus} = useCreateStore()
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('')
  const { toast } = useToast()

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if(pwd.length < 8) {
      setError('The password must be at least eight digits！')
      toast({
        variant: "destructive",
        title: "Password Error",
        description: String('The password must be at least eight digits！'),
      })
    } else if(pwd === confirmPwd) {
      setStatus('create')
    }else{
      setError('Check whether the entered password is consistent!')
      toast({
        variant: "destructive",
        title: "Password Error",
        description: String('Check whether the entered password is consistent!'),
      })
    }
  }
  return (
    <>
      <div className="font-normal text-[24px] text-[#1A202C] leading-[31px] text-center not-italic max-w-[380px] mb-[40px] font-family-medium">
        Create a password for your wallet
      </div>
      <Toaster />
      <form className="flex flex-col items-center justify-center" onSubmit={onSubmit}>
        <Stack gap="4" align="flex-start" width="480px" className="font-family-medium">
          <Field label="Input wallet Password:" helperText="The password must be at least eight digits！"  errorText={error}>
            <Input
              className="font-family-regular"
              height={'32px'}
              placeholder="Please Enter Your Password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </Field>
          <Field label="Confirm wallet Password:" errorText={error}>
            <Input
              height={'32px'}
              className="font-family-regular"
              placeholder="Please Confirm Your Password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
          </Field>
        </Stack>
        <ConfirmButton type="submit" content={'Confirm'} onClick={()=>{}} style={{marginTop: '40px'}}/>
      </form>
    </>
  )
}

export default Pwd
