import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Unlock,
  GetState,
  StopLnd,
  GetLndPath,
  GetLndRest,
  GetLndAdminMacaroonPath,
  GetLndChainInfo,
  OpenFileSelector
} from '../../../wailsjs/go/main/App';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useCreateStore } from '@/store/create';
import { frontend } from '../../../wailsjs/go/models';
import { ConfirmButton } from '@/components/ConfirmButton';
import copyIcon from '@/assets/lndstate/copy.svg'
import { UpdateAlert } from '@/views/Main/Update';
import folder from '@/assets/lndstate/folderOpen.svg'


enum WalletState {
  WalletState_NON_EXISTING,
  WalletState_LOCKED,
  WalletState_UNLOCKED,
  WalletState_RPC_ACTIVE,
  WalletState_SERVER_ACTIVE,
  WalletState_WAITING_TO_START = 255,
}


function LndState() {
  const navigate = useNavigate();
  const [LndInfo, setLndInfo] = useState({
    path: '',
    rest: '',
    admMacaroon: ''
  });
  const { toast } = useToast()
  const { isWalletUnlocked, setIsWalletUnlocked, isWalletRpcReady, setIsWalletRpcReady, lndChainScan } = useCreateStore()
  const [password, setPassword] = useState('');
  const [progress, setProgress] = useState(0)
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const initState = useRef<NodeJS.Timeout | null>(null);

  async function StopNode() {
    await StopLnd()
    setTimeout(() => {
      setIsWalletRpcReady(false)
      setIsWalletUnlocked(false)
      navigate('/');
    }, 1000)
  }

  async function GetLndInfo() {
    try {
      const path = await GetLndPath();
      const rest = await GetLndRest();
      const admMacaroonPath = await GetLndAdminMacaroonPath();
      setLndInfo({ path, rest, admMacaroon: admMacaroonPath });
    } catch (error) {
      console.error('Error getting LND path:', error);
    }
  }

  useEffect(() => {
    console.log('lndChainScan', lndChainScan)
  }, [lndChainScan]);

  function copyToClipboard(value: string) {
    navigator.clipboard.writeText(value).then(
      () => {
        toast({
          variant: "default",
          title: 'Copied to clipboard: ',
          description: value
        })
      },
      (err) => {
        toast({
          variant: "destructive",
          title: 'Failed to copy: ',
          description: err.message,
        })
      }
    );
  }

  async function UnlockWallet() {
    try {
      await Unlock(password)
      setIsWalletUnlocked(true)
      toast({
        variant: "default",
        title: "Wallet Unlocked Successfully!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Incorrect Password",
        description: String(error),
      })
    }
  }

  async function GetChainInfo() {
    try {
      const { MempoolBlock, LndInfo } = await GetLndChainInfo(lndChainScan);
      let lndBlock = 0
      if (LndInfo?.block_height) {
        lndBlock = LndInfo.block_height
      }
      setProgress((lndBlock / MempoolBlock) * 100)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lnd RPC ERROR",
        description: String(error),
      })
    }
  }

  async function InitState(t: NodeJS.Timeout) {
    try {
      const resp = await GetState()
      switch (resp.state ?? WalletState.WalletState_NON_EXISTING) {
        case WalletState.WalletState_NON_EXISTING:
          navigate('/create')
          break
        case WalletState.WalletState_LOCKED:
          setIsWalletUnlocked(false)
          break
        case WalletState.WalletState_UNLOCKED:
          setIsWalletUnlocked(true)
          break
        case WalletState.WalletState_RPC_ACTIVE:
        case WalletState.WalletState_SERVER_ACTIVE:
          setIsWalletRpcReady(true)
          GetChainInfo()
          clearInterval(t)
          break
        case WalletState.WalletState_WAITING_TO_START:
          setIsWalletRpcReady(false)
          break
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lnd RPC ERROR",
        description: String(error),
      })
      clearInterval(t)
    }
  }

  useEffect(() => {
    if (isWalletRpcReady && !progressRef.current) {
      progressRef.current = setInterval(() => {
        GetChainInfo()
      }, 5000)
    }

    return () => {
      if (!isWalletRpcReady && progressRef.current) {
        clearInterval(progressRef.current)
        progressRef.current = null
      }
    }
  }, [isWalletRpcReady])

  useEffect(() => {
    if (!initState.current) {
      const timer = setInterval(() => {
        InitState(timer)
      }, 100)
      initState.current = timer
    }

    return () => {
      if (initState.current) {
        clearInterval(initState.current)
        initState.current = null
      }
    }
  }, [])


  useEffect(() => {
    GetLndInfo()
  }, [])

  async function ChooseLndDir() {
    const lastSlashIndex = LndInfo.admMacaroon.lastIndexOf('/');
    const folderPath = LndInfo.admMacaroon.substring(0, lastSlashIndex);
    const fileName = LndInfo.admMacaroon.substring(lastSlashIndex + 1);
    await OpenFileSelector(frontend.OpenDialogOptions.createFrom({
      'DefaultDirectory': folderPath,
      'DefaultFilename': fileName,
      'Title': 'Select Lnd Data Directory',
      'ShowHiddenFiles': true,
      'CanCreateDirectories': false,
      'ResolvesAliases': true,
      'TreatPackagesAsDirectories': false,
      'Filters': [
        frontend.FileFilter.createFrom(
          {
            'DisplayName': fileName,
            'Pattern': '*.macaroon'
          }
        )
      ]
    }))
  }

  return (
    <div id="state" className="flex flex-col justify-center items-center relative mt-[48px]">
      <Dialog open={!isWalletUnlocked}>
        <DialogContent className="p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Input Your Wallet Password</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              To use lnd, please unlock wallet first.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                value={password}
                className="border-gray-300"
              />
            </div>
            <ConfirmButton type="submit" content={'Unlock'} onClick={UnlockWallet} style={{padding: '6px 12px'}}/>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
      <div className="text-[24px] text-[#1A202C] leading-[31px] text-center max-w-[380px] mb-[40px] font-family-medium">
        Your LND Node Operation Information
      </div>
      <div className="flex flex-col justify-center items-center flex-wrap gap-[24px] w-full mb-[40px]">
        <div className="flex flex-col gap-[8px] justify-center items-center w-full">
          <Label className='w-full max-w-md font-family-medium'>Block Sync Process</Label>
          <div className="relative flex items-center justify-center w-full max-w-md gap-3">
            <Progress value={progress} className="w-[90%]" />
            <Label className='w-[15%] text-center'>{(progress / 100 * 100).toFixed(2) + '%'}</Label>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] justify-center items-center w-full">
          <Label className='w-full max-w-md font-family-medium'>Lnd Dir</Label>
          <div className="flex w-full max-w-md relative">
            <Input className="pr-10" type="text" value={LndInfo.path} disabled />
            <div className="bg-[#EDF2F7] absolute p-[8px] right-[-1px] cursor-pointer border border-[#E2E8F0] rounded-tr-md rounded-br-md" onClick={() => copyToClipboard(LndInfo.path)}><img src={copyIcon} alt=""/></div>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] justify-center items-center w-full">
          <Label className='w-full max-w-md font-family-medium'>Lnd REST</Label>
          <div className="relative flex w-full max-w-md">
            <Input className="pr-10" type="text" value={LndInfo.rest} disabled />
            <div className="bg-[#EDF2F7] absolute p-[8px] right-[-1px] cursor-pointer border border-[#E2E8F0] rounded-tr-md rounded-br-md" onClick={() => copyToClipboard(LndInfo.rest)}><img src={copyIcon} alt=""/></div>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] justify-center items-center w-full">
          <Label className='w-full max-w-md font-family-medium'>Lnd Admin Macaroon</Label>
          <div className="relative flex w-full max-w-md">
            <Input className="pr-10" type="text" value={LndInfo.admMacaroon} disabled />
            <div className="bg-[#EDF2F7] absolute p-[8px] right-[-1px] cursor-pointer border border-[#E2E8F0] rounded-tr-md rounded-br-md" onClick={ChooseLndDir}><img src={folder} alt=""/></div>
          </div>
        </div>
      </div>
      <ConfirmButton onClick={StopNode} content={'Stop'}/>
      <UpdateAlert/>
    </div>
  )
}

export default LndState
