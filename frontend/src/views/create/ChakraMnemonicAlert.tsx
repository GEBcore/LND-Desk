import React from 'react';
import {
  Button,
  Text,
} from '@chakra-ui/react';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import Warning from '@/assets/fonts/warning.svg'
import { useCreateStore } from '@/store/create';
import Loading from '@/components/Loading';
import { ConfirmButton } from '@/components/ConfirmButton';


export const ChakraMnemonicAlert = ({onSubmit}:{onSubmit:any}) => {
  const { showMnemonicDialog, setShowMnemonicDialog, confirmLoading } = useCreateStore()

  const btcTheme = {
    orange: {
      50: '#FCF0EB',
      100: '#FFE4CC',
      500: '#F7931A',
      600: '#E58719',
      800: '#BE4D15',
    }
  };

  return (
    <Dialog open={showMnemonicDialog} onOpenChange={()=>setShowMnemonicDialog(false)}>
      <DialogContent className="p-[18px] rounded-lg shadow-lg flex flex-col items-center justify-center w-[436px]">
        <DialogHeader>
          <Text fontSize="18px" fontWeight="semibold" color="#2D3748" className="mb-[15px]">
            Important Security Notice
          </Text>
          <div className="flex flex-row justify-center items-center gap-2">
            <img src={Warning} alt=""/>
            <Text fontSize="16px" color="#2D3748" className="leading-[24px]">
              Please ensure you have safely backed up your mnemonic phrase.
            </Text>
          </div>
        </DialogHeader>
        <div className="flex flex-col px-[15px] py-[12px]" style={{ border: '1px solid #E67137',background: `${[btcTheme.orange[50]]}`, borderRadius:'6px', color:`${[btcTheme.orange[800]]}`, gap:'10px'}}>
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
        <Text color={btcTheme.orange[500]} fontSize="sm" fontWeight="medium" className="flex flex-row justify-start text-start w-full">
          Once confirmed, you will not see these words again
        </Text>
        <DialogFooter>
          <Button
            variant="outline"
            size="md"
            w={{ base: 'full', sm: 'auto' }}
            onClick={()=>setShowMnemonicDialog(false)}
            style={{border:'1px solid rgb(200, 200, 200)', padding: '4px 8px', fontSize:'16px'}}
          >
            Go Back
          </Button>
          {/*<Button*/}
          {/*  bg={btcTheme.orange[500]}*/}
          {/*  _hover={{ bg: btcTheme.orange[600] }}*/}
          {/*  color="white"*/}
          {/*  size="md"*/}
          {/*  w={{ base: 'full', sm: 'auto' }}*/}
          {/*  onClick={onSubmit}*/}
          {/*  style={{padding: '4px 8px', fontSize:'16px'}}*/}
          {/*>*/}
          {/*  I've Backed Up My Mnemonic*/}
          {/*</Button>*/}

          <ConfirmButton type="submit" onClick={onSubmit} content="I've Backed Up My Mnemonic"/>

        </DialogFooter>
        {confirmLoading && <Loading/>}
      </DialogContent>
    </Dialog>
  );
};