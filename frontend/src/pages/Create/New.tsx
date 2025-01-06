import { useNavigate } from 'react-router-dom';
import { toast, useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import { useCreateStore } from '@/store/create';
import { Box, Button, Input, Stack, Textarea } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';

function New() {

  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [newStatus, setNewStatus] = useState<'phrase' | 'word'>('phrase')
  const { initWallet, pwd, createPassphrase, setCreatePassphrase, genSeed, createMnemonic, showCreateMnemonic } = useCreateStore()
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent) => {
    debugger
    event.preventDefault(); // 阻止默认表单提交行为
    if (confirmPassphrase === createPassphrase) {
      const {status, error} = await  genSeed(createPassphrase)
      status === 'success' && setNewStatus('word')
      status !== 'success' && toast({
        variant: "destructive",
        title: "ERROR",
        description: String(error),
      })

    }
  };

  const finishCreate = async() => {
    const {status, error} = await initWallet(pwd, createMnemonic, createPassphrase ? createPassphrase : 'aezeed', '')
    status === 'success' && navigate('/lndState')
    status !== 'success' && toast({
      variant: "destructive",
      title: "Create ERROR",
      description: String(error),
    })
  };

  return (
    <div className="flex flex-col items-center justify-center mx-w-full">
      {newStatus === 'phrase' && <form onSubmit={onSubmit} className="flex flex-col justify-center items-center">
        <div style={{textAlign:'center', padding:'12px 0 24px 0'}}> Set cipher seed passphrase(optional)</div>
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
        </Stack>
        <Button type="submit" onClick={onSubmit}>Submit</Button>
      </form>}
      {newStatus === 'word' && <div style={{width:'400px', padding:'12px', display:'flex', flexDirection:'column', alignItems: 'center', justifyItems:'center'}}>
        <div  style={{fontSize:'18px',fontWeight: '600', margin:'8px 0'}}>New mnemonic</div>
        {/*<div style={{maxWidth:'280px'}}>{showCreateMnemonic}</div>*/}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {showCreateMnemonic.map((word, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">{index + 1}.</span>
              <span className="text-gray-900">{word}</span>
            </div>
          ))}
        </div>
        <div style={{width:'380px',marginTop:'24px', fontSize:'12px', textAlign:'left'}}>
          1 Please take a moment to write down this mnemonic phrase on a piece of paper.
        </div>
        <div style={{width:'380px', fontSize:'12px', textAlign:'left', marginBottom:'12px'}}>
          2 It's your backup and you can use it to recover the wallet.
        </div>
        <Button type="submit" onClick={finishCreate}>Confirm</Button>
      </div>}
    </div>
  );
}

export default New
