import React, { useState } from 'react';
import {
  Button,
  Text,
} from '@chakra-ui/react';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import Warning from '@/assets/fonts/warning.svg'
import { useCreateStore } from '@/store/create';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';


export const ChakraMnemonicAlert = ({onSubmit}:{onSubmit:any}) => {
  const { showMnemonicDialog, setShowMnemonicDialog, confirmLoading } = useCreateStore()

  const btcTheme = {
    orange: {
      50: '#FFF7ED',
      100: '#FFE4CC',
      500: '#F7931A',
      600: '#E58719',
      800: '#9C4221',
    }
  };

  return (
    <Dialog open={showMnemonicDialog}>
      <DialogContent className="p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <DialogHeader>
          <div className="flex flex-col justify-center items-center gap-2">
            <img src={Warning} alt=""/>
            <Text fontSize="xl" fontWeight="semibold">
              Important Security Notice
            </Text>
          </div>
          <Text color="gray.600">
            Please ensure you have safely backed up your mnemonic phrase.
          </Text>
        </DialogHeader>
        <div className="flex flex-col p-6" style={{background: `${[btcTheme.orange[50]]}`, borderRadius:'10px', color:`${[btcTheme.orange[800]]}`, gap:'10px'}}>
          <div className="flex flex-row items-start">
            <Text as="span" fontWeight="bold" mr={2}>•</Text>
            <Text as="span">This is your ONLY chance to backup these words</Text>
          </div>
          <div className="flex flex-row items-start">
            <Text as="span" fontWeight="bold" mr={2}>•</Text>
            <Text as="span">Without this backup, you will not be able to recover your wallet if lost</Text>
          </div>
          <div className="flex flex-row items-start">
            <Text as="span" fontWeight="bold" mr={2}>•</Text>
            <Text as="span">Store this backup in a secure location, never share it with anyone</Text>
          </div>
        </div>
        <Text color={btcTheme.orange[500]} fontSize="sm" fontWeight="medium">
          Once confirmed, you will not see these words again
        </Text>
        <DialogFooter>
          <Button
            variant="outline"
            size="md"
            w={{ base: 'full', sm: 'auto' }}
            onClick={()=>setShowMnemonicDialog(false)}
            style={{border:'1px solid rgb(200, 200, 200)', padding: '4px 8px'}}
          >
            Go Back
          </Button>
          <Button
            bg={btcTheme.orange[500]}
            _hover={{ bg: btcTheme.orange[600] }}
            color="white"
            size="md"
            w={{ base: 'full', sm: 'auto' }}
            onClick={onSubmit}
            style={{padding: '4px 8px'}}
          >
            I've Backed Up My Mnemonic
          </Button>
        </DialogFooter>
        {confirmLoading && <Loading/>}
      </DialogContent>
    </Dialog>
  );
};