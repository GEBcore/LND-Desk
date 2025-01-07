import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Unlock, GetState, StopLnd, GetLndPath, GetLndRest, GetLndAdminMacaroonPath, GetLndChainInfo } from "../../../wailsjs/go/main/App";
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Lock, Unlock as UnlockIcn } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useCreateStore } from '@/store/create';

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
  const {isWalletUnlocked, setIsWalletUnlocked, isWalletRpcReady, setIsWalletRpcReady} = useCreateStore()
  const [password, setPassword] = useState('');
  const [progress, setProgress] = useState(0)
  const [progressRef, setProgressRef] = useState<NodeJS.Timeout | null>(null)

  async function StopNode() {
    await StopLnd()
    setTimeout(() => { navigate('/'); }, 1000)
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
      await InitState()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Incorrect Password",
        description: String(error),
      })
    }
  }

  async function GetChainInfo() {
    if (!isWalletRpcReady) {
      return;
    }

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

  async function InitState() {
    try {
      const resp = await GetState()
      switch (resp.state ?? WalletState.WalletState_NON_EXISTING) {
        case WalletState.WalletState_NON_EXISTING:
          navigate('/create')
          break
        case WalletState.WalletState_LOCKED:
          setIsWalletRpcReady(true)
          setIsWalletUnlocked(false)
          break
        case WalletState.WalletState_UNLOCKED:
          setIsWalletRpcReady(true)
          setIsWalletUnlocked(true)
          await InitState()
          break
        case WalletState.WalletState_RPC_ACTIVE:
        case WalletState.WalletState_SERVER_ACTIVE:
          setIsWalletRpcReady(true)
          GetChainInfo()
          break
        case WalletState.WalletState_WAITING_TO_START:
          setIsWalletRpcReady(false)
          await InitState()
          break
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lnd RPC ERROR",
        description: String(error),
      })
      InitState()
    }
  }

  useEffect(() => {
    GetLndInfo()
    if (!progressRef) {
      const timer = setInterval(async () => {
        await GetChainInfo()
      }, 5000)
      setProgressRef(timer)
    }
    InitState()

    return () => {
      if (progressRef) {
        clearInterval(progressRef);
      }
    };
  }, [isWalletRpcReady, isWalletUnlocked, progress])

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
          <Label className='w-[10%] text-center'>{(progress / 100 * 100).toFixed(2) + '%'}</Label>
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
          <Button onClick={() => copyToClipboard(LndInfo.admMacaroon)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 flex items-center justify-center" variant="outline" size="icon"> <ClipboardCopy /></Button>
        </div>
        <Button variant="destructive" onClick={StopNode}>Stop</Button>
      </div>
    </div>
  )
}

export default LndState
