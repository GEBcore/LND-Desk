import { Button, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import React, { useState } from "react";
import { useCreateStore } from '@/store/create';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { ChakraMnemonicAlert } from '@/views/create/ChakraMnemonicAlert';

function Import() {
  // 定义状态存储两个文本框的值
  const [mnemonic, setMnemonic] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(""); // 错误提示信息
  const navigate = useNavigate();
  const { initWallet, pwd, setShowMnemonicDialog, setConfirmLoading } = useCreateStore()
  // 验证方法：检查是否为24个单词
  const validateMnemonic = (mnemonic: string) => {
    const words = mnemonic.trim().split(/\s+/); // 通过空格分割单词
    return words.length === 24;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 阻止默认表单提交行为
    // 检查第一个文本框内容
    if (!validateMnemonic(mnemonic)) {
      setError("The mnemonic must consist of exactly 24 words.");
      toast({
        variant: "default",
        title: "The mnemonic must consist of exactly 24 words.",
      })
      return;
    }
    setShowMnemonicDialog(true)
  };
  const onFinish = async () => {
    setConfirmLoading(true)
    const {status, error} = await initWallet(pwd, mnemonic, passphrase ? passphrase : 'aezeed', '')
    if (status === "success") {
      setTimeout(() => {
        setShowMnemonicDialog(false)
        setConfirmLoading(false)
        navigate("/lndState");
      }, 1000);
    }
    if(status === 'fail'){
      setConfirmLoading(false)
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
      <form onSubmit={onSubmit} className="flex flex-col justify-center items-center">
        <Stack gap="4" align="flex-start" width="500px">
          <Field label="Your Own Mnemonic" errorText={error}>
            <Textarea
              placeholder="Please enter the 24-word mnemonic, separated by spaces."
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              style={{height:'200px', padding:'12px', border:'1px solid #e4e4e7'}}
            />
          </Field>
          <Field label="Input your cipher seed passphrase">
            <Input
              placeholder="If not, no input is required."
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
          </Field>
        </Stack>
        <Button background={'black'} color={'white'} padding={'8px'} margin={'12px 0px'} type="submit" onClick={onSubmit}>Submit</Button>
      </form>
      <ChakraMnemonicAlert onSubmit={onFinish}/>
    </div>
  );
}

export default Import;
