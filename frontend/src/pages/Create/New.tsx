import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useCreateStore } from '@/store/create';
import { Box, Button, Input, Stack, Textarea } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';

function New() {

  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [newStatus, setNewStatus] = useState<'phrase' | 'word'>('phrase')
  const { initWallet, pwd, createPassphrase, setCreatePassphrase } = useCreateStore()
  const [error, setError] = useState(""); // 错误提示信息

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // 阻止默认表单提交行为
    if(confirmPassphrase === createPassphrase){
      console.log('下一步')
      setNewStatus('word')
    }
  };

  const words: string[] = [
    'absorb', 'loan', 'name', 'shop',
    'rice', 'hundred', 'elbow', 'solid',
    'marble', 'task', 'daughter', 'middle',
    'flower', 'bulk', 'coil', 'female',
    'soap', 'guide', 'armor', 'adapt',
    'replace', 'month', 'muffin', 'wet'
  ];

  function formatWords(words: string[]): string {
    let result = '';
    for (let i = 0; i < words.length; i += 4) {
      const line = words.slice(i, i + 4).map((word, index) => `${i + index + 1}. ${word}`).join('  ');
      result += line + '\n';
    }
    return result;
  }

  return (
    <div className="dark flex flex-col items-center justify-center h-screen mx-w-full">
      {newStatus === 'phrase' && <form onSubmit={onSubmit}>
        Set cipher seed passphrase(optional)
        <Stack gap="4" align="flex-start" width="500px">

          <Field label="Input your cipher seed passphrase">
            <Input
              placeholder="If not, no input is required."
              value={createPassphrase}
              onChange={(e) => setCreatePassphrase(e.target.value)}
            />
          </Field>
          <Field label="Confirm your cipher seed passphrase">
            <Input
              placeholder="If not, no input is required."
              value={confirmPassphrase}
              onChange={(e) => setConfirmPassphrase(e.target.value)}
            />
          </Field>
          <Button type="submit" onClick={onSubmit}>Submit</Button>
        </Stack>
      </form>}
      {newStatus === 'word' && <div style={{width:'400px', padding:'12px', border:'1px solid white', display:'flex', flexDirection:'column', alignItems: 'center', justifyItems:'center'}}>
        <div style={{fontSize:'18px',fontWeight: '600', margin:'8px 0'}}>New mnemonic</div>
        <div style={{maxWidth:'280px'}}>{formatWords(words)}</div>
        <div style={{maxWidth:'280px',marginTop:'24px', fontSize:'12px'}}>
          1 Please take a moment to write down this mnemonic phrase on a piece of paper.
        </div>
        <div style={{maxWidth:'280px', fontSize:'12px'}}>
          2 It's your backup and you can use it to recover the wallet.
        </div>
        <Button type="submit" onClick={onSubmit}>Submit</Button>
      </div>}
    </div>
  );
}

export default New
