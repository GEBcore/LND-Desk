import React from 'react';
import {
  Button,
  Text,
} from '@chakra-ui/react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import updateIcon from '@/assets/header/update.svg'
import { useCreateStore } from '@/store/create';
import { ConfirmButton } from '@/components/ConfirmButton';
import { BrowserOpenURL } from '../../../wailsjs/runtime';


export const UpdateAlert = () => {
  const { showUpdateDialog, setShowUpdateDialog, updateVersion } = useCreateStore()

  return (
    <Dialog open={showUpdateDialog} onOpenChange={()=> setShowUpdateDialog(false)}>
      <DialogContent className="p-[18px] rounded-lg shadow-lg flex flex-col items-end justify-end w-[436px]">
        <Text fontSize="18px" fontWeight="semibold" color="#2D3748" className="w-full">
          Software Update
        </Text>
        <div className="flex flex-row">
          <img src={updateIcon} alt="" className="mr-[12px]"/>
          <Text color="#2D3748" fontSize="16px" className="flex flex-row justify-start text-start w-full leading-[24px]">
            A new version ({updateVersion}) is available for your app. This update includes important security updates and bug fixes.
          </Text>
        </div>
        <DialogFooter>
          <Button
            onClick={()=>setShowUpdateDialog(false)}
            style={{border:'1px solid rgb(200, 200, 200)', padding: '4px 40px', fontSize:'16px', outline:'none'}}
          >
            Later
          </Button>
          <ConfirmButton type="submit" onClick={()=>{BrowserOpenURL(`https://github.com/btclayer2/LND-Desk/releases/tag/${updateVersion}`)}} content="Update Now"/>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};