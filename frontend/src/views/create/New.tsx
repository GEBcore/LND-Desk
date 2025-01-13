import { useNavigate } from 'react-router-dom';
import { toast, useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import { useCreateStore } from '@/store/create';
import { Box, Button, Stack, Textarea } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { Toaster } from '@/components/ui/toaster';
import { Input } from '@/components/ui/input';
import { ChakraMnemonicAlert } from '@/views/create/ChakraMnemonicAlert';
import { ConfirmButton } from '@/components/ConfirmButton';

function New() {

  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [newStatus, setNewStatus] = useState<'phrase' | 'word'>('phrase')
  const { createPassphrase, setCreatePassphrase, genSeed,  initWallet, pwd, createMnemonic, showCreateMnemonic, setShowMnemonicDialog, setConfirmLoading } = useCreateStore()
  const navigate = useNavigate();

  const onSubmit = async () => {
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
    setConfirmLoading(true)
    const {status, error} = await initWallet(pwd, createMnemonic, createPassphrase ? createPassphrase : 'aezeed', '')
    if (status === "success") {
      setTimeout(() => {
        setShowMnemonicDialog(false)
        setConfirmLoading(false)
        navigate("/lndState");
      }, 1000);
    }
    if(status !== 'success'){
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
      {newStatus === 'phrase' && <div className="flex flex-col justify-center items-center">
        <div className="font-normal text-[20px] text-[#1A202C] leading-[26px] text-right not-italic my-[24px]">
          Set cipher seed passphrase(optional)
        </div>
        <Stack gap={'24px'} align="flex-start" width="480px">
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
        <ConfirmButton type="submit" onClick={onSubmit} content="Generate new wallet" style={{marginTop:'40px'}}/>
      </div>}
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
        <Button background={'black'} color={'white'} padding={'8px'} margin={'12px 0px'} type="submit" onClick={()=>setShowMnemonicDialog(true)}>Confirm</Button>
      </div>}
      <ChakraMnemonicAlert onSubmit={finishCreate}/>
    </div>
  );
}

export default New
