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
  InitWallet,
  GetDefaultLndDir, OpenFileSelector
} from '../../../wailsjs/go/main/App';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Folder, Lock, Unlock as UnlockIcn } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useCreateStore } from '@/store/create';
import { frontend } from '../../../wailsjs/go/models';

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
  const { isWalletUnlocked, setIsWalletUnlocked, isWalletRpcReady, setIsWalletRpcReady } = useCreateStore()
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
      const { MempoolBlock, LndInfo } = await GetLndChainInfo("https://mempool.space/signet");
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
    try {
      const chooseedLndDir = await OpenFileSelector(frontend.OpenDialogOptions.createFrom({
        'DefaultDirectory': LndInfo.path,
        'DefaultFilename': 'admin',
        'Title': 'Select Lnd Data Directory',
        'ShowHiddenFiles': true,
        'CanCreateDirectories': true,
        'ResolvesAliases': true,
        'TreatPackagesAsDirectories': false,
      }))
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lnd Data File Error",
        description: String(error),
      })
    }
  }

  return (
    <div id="state" className="flex flex-col justify-center items-center space-y-4 h-screen relative">
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
            <Button
              type="submit"
              onClick={UnlockWallet}
              size="sm"
              className="px-3"
            >
              Unlock
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
      <div className="flex flex-col justify-center items-center flex-wrap gap-5 w-full">
        <Label className='w-full max-w-md'>Block Sync Process</Label>
        <div className="relative flex items-center justify-center w-full max-w-md gap-3">
          <Progress value={progress} className="w-[90%]" />
          <Label className='w-[15%] text-center'>{(progress / 100 * 100).toFixed(2) + '%'}</Label>
        </div>
        <Label className='w-full max-w-md'>Lnd Dir</Label>
        <div className="relative flex w-full max-w-md">
          <Input className="pr-10" type="text" value={LndInfo.path} disabled />
          <Button onClick={() => copyToClipboard(LndInfo.path)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 flex items-center justify-center" variant="outline" size="icon"> <ClipboardCopy /></Button>
        </div>
        <Label className='w-full max-w-md'>Lnd REST</Label>
        <div className="relative flex w-full max-w-md">
          <Input className="pr-10" type="text" value={LndInfo.rest} disabled />
          <Button onClick={() => copyToClipboard(LndInfo.rest)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 flex items-center justify-center" variant="outline" size="icon"> <ClipboardCopy /></Button>
        </div>
        <Label className='w-full max-w-md'>Lnd Admin Macaroon</Label>
        <div className="relative flex w-full max-w-md">
          <Input className="pr-10" type="text" value={LndInfo.admMacaroon} disabled />
          <Button onClick={ChooseLndDir} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 flex items-center justify-center" variant="outline" size="icon"> <Folder/></Button>
        </div>
        <Button variant="destructive" onClick={StopNode}>Stop</Button>
      </div>
    </div>
  )
}

export default LndState
