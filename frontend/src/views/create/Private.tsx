import { Button, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import React, { useState } from "react";
import { useCreateStore } from '@/store/create';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { ConfirmButton } from '@/components/ConfirmButton';

function Private() {
  // 定义状态存储两个文本框的值
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState(""); // 错误提示信息
  const navigate = useNavigate();
  const { initWallet, pwd, setShowMnemonicDialog, setConfirmLoading } = useCreateStore()
  const validateMnemonic = (mnemonic: string) => {
    const words = mnemonic.trim().split(/\s+/); // 通过空格分割单词
    return words.length === 24;
  };

  const onSubmit = async () => {
    const {status, error} = await initWallet(pwd, "", 'aezeed', privateKey)
    if (status === "success") {
      setTimeout(() => {
        setConfirmLoading(false)
        navigate("/lndState");
      }, 1000);
    }
    if(status === 'fail'){
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
        <Stack gap="4" align="flex-start" width="480px">
          <Field label="" errorText={error}>
            <Textarea
              placeholder="Please enter your own private key."
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              _hover={{border:'1px solid #E67137', outline:'none'}}
              style={{height:'120px', padding:'12px',  border:'1px solid #e4e4e7', outline:'none'}}
            />
          </Field>
        </Stack>
        <ConfirmButton type="submit" onClick={onSubmit} content="Submit" style={{marginTop:'40px'}}/>
      </div>
    </div>
  );
}

export default Private;
