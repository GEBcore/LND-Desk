import { Button, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState } from "react";
import { useCreateStore } from '@/store/create';

function Import() {
  // 定义状态存储两个文本框的值
  const [mnemonic, setMnemonic] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(""); // 错误提示信息

  const { initWallet, pwd } = useCreateStore()
  // 验证方法：检查是否为24个单词
  const validateMnemonic = (mnemonic: string) => {
    const words = mnemonic.trim().split(/\s+/); // 通过空格分割单词
    return words.length === 2;
  };

  // 表单提交逻辑
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // 阻止默认表单提交行为
    // 检查第一个文本框内容
    if (!validateMnemonic(mnemonic)) {
      setError("The mnemonic must consist of exactly 24 words.");
      return;
    }

    // 清除错误信息
    setError("");

    // 检查通过，输出成功
    console.log("Mnemonic:", mnemonic);
    console.log("Passphrase:", passphrase || "No passphrase provided.");
    const result = initWallet(pwd, mnemonic, passphrase, '')
  };

  return (
    <div className="dark flex flex-col items-center justify-center mx-w-full">
      <form onSubmit={onSubmit} className="flex flex-col justify-center items-center">
        <Stack gap="4" align="flex-start" width="500px">
          <Field label="Your Own Mnemonic" errorText={error}>
            <Textarea
              placeholder="Please enter the 24-word mnemonic, separated by spaces."
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              style={{height:'200px'}}
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
        <Button type="submit" onClick={onSubmit}>Submit</Button>
      </form>
    </div>
  );
}

export default Import;
