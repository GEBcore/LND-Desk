import { Button, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import React, { useState } from "react";
import { useCreateStore } from '@/store/create';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { ChakraMnemonicAlert } from '@/views/create/ChakraMnemonicAlert';
import { ConfirmButton } from '@/components/ConfirmButton';

function Import() {
  const [mnemonic, setMnemonic] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(""); // 错误提示信息
  const navigate = useNavigate();
  const { initWallet, pwd, setShowMnemonicDialog, setConfirmLoading } = useCreateStore()
  const validateMnemonic = (mnemonic: string) => {
    const words = mnemonic.trim().split(/\s+/); // 通过空格分割单词
    return words.length === 24;
  };

  const onSubmit = async () => {
    if (!validateMnemonic(mnemonic)) {
      setError("The mnemonic must consist of exactly 24 words.");
      toast({
        variant: "default",
        title: "The mnemonic must consist of exactly 24 words.",
      })
      return;
    }
    const {status, error} = await initWallet(pwd, mnemonic, passphrase ? passphrase : 'aezeed', '')
    if (status === "success") {
      setTimeout(() => {
        // setShowMnemonicDialog(false)
        setConfirmLoading(false)
        navigate("/lndState");
      }, 1000);
    }
    if(status === 'fail'){
      // setConfirmLoading(false)
      toast({
        variant: "destructive",
        title: "Create ERROR",
        description: String(error),
      })
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mx-w-full">
      <Toaster />
      <div className="flex flex-col justify-center items-center">
        <Stack gap="24px" align="flex-start" width="480px" className="font-family-medium">
          <Field label="" errorText={error}>
            <Textarea
              className="font-family-regular"
              placeholder="Please enter the 24-word mnemonic, separated by spaces."
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              color={'#1A202C'}
              _hover={{ borderColor: '#E67137' }}
              _active={{ borderColor: '#E67137' }}
              // _hover={{border:'1px solid #E67137', outline:'none'}}
              style={{height:'120px', padding:'12px',  border:'1px solid #e4e4e7', outline:'none', fontSize:'14px'}}
            />
          </Field>
          <Field label="Input your cipher seed passphrase" className="font-family-medium">
            <Input
              className="font-family-regular"
              placeholder="If not, no input is required."
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
          </Field>
        </Stack>
        <ConfirmButton type="submit" onClick={onSubmit} content="Submit" style={{marginTop:'40px'}}/>
      </div>
    </div>
  );
}

export default Import;
