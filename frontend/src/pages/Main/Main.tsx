import { useState, useEffect } from 'react';
import './Main.css';
import INIEditor from '../../components/editor';
import { useNavigate } from 'react-router-dom';
import { RunLnd, VerifyConfig, GetDefaultLndDir, OpenFileSelector } from "@/../wailsjs/go/main/App";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast';
import { Folder, Power, PowerOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { frontend } from '@/../wailsjs/go/models';

function Main() {
  const [config, setConfig] = useState(`[Application Options]
debuglevel=trace
maxpendingchannels=10
alias=Bevm_client_test
no-macaroons=false
coin-selection-strategy=largest
rpclisten=localhost:10009
restlisten=localhost:8080
no-rest-tls=true
restcors=https://bevmhub.bevm.io

[Bitcoin]
bitcoin.mainnet=false
bitcoin.testnet=false
bitcoin.simnet=false
bitcoin.regtest=false
bitcoin.signet=true
bitcoin.node=neutrino

[neutrino]
neutrino.addpeer=x49.seed.signet.bitcoin.sprovoost.nl
neutrino.addpeer=v7ajjeirttkbnt32wpy3c6w3emwnfr3fkla7hpxcfokr3ysd3kqtzmqd.onion:38333

[protocol]
protocol.simple-taproot-chans=true`);
  const [isReady, setIsReady] = useState(true);
  const [lndDir, setLndDir] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast()

  async function RunNode() {
    await CheckConfig()
    if (!isReady) {
      toast({
        variant: "destructive",
        title: "Lnd Error",
        description: "Node is not ready to run",
      })
      navigate('/create');
      return;
    }
    try {
      await RunLnd()
      navigate('/lndState');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lnd Error",
        description: String(error),
      })
      navigate('/create');
    }
  }

  async function CheckConfig() {
    try {
      await VerifyConfig(lndDir, config);
      setIsReady(true)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lnd Config Error",
        description: String(error),
      })
      navigate('/create');
      setIsReady(false)
    }
  }

  function SaveConfig(value: string) {
    setConfig(value);
    localStorage.setItem('config', value);
    CheckConfig()
  }

  function SaveLndDir(value: string) {
    setLndDir(value);
    localStorage.setItem('lndDir', value);
  }

  async function SetDefaultLndDir() {
    const defaultLndDir = await GetDefaultLndDir()
    setLndDir(defaultLndDir)
  }

  async function ChooseLndDir() {
    try {
      const defaultLndDir = await GetDefaultLndDir()
      const chooseedLndDir = await OpenFileSelector(frontend.OpenDialogOptions.createFrom({
        'DefaultDirectory': defaultLndDir,
        'DefaultFilename': 'lnd',
        'Title': 'Select Lnd Data Directory',
        'ShowHiddenFiles': true,
        'CanCreateDirectories': true,
        'ResolvesAliases': true,
        'TreatPackagesAsDirectories': false,
      }))
      SaveLndDir(chooseedLndDir);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lnd Data File Error",
        description: String(error),
      })
    }
  }

  useEffect(() => {
    const savedConfig = localStorage.getItem('config');
    if (savedConfig && savedConfig !== '') {
      setConfig(savedConfig);
    }
    const savedLndDir = localStorage.getItem('lndDir');
    if (savedLndDir && savedLndDir !== '') {
      setLndDir(savedLndDir);
    } else {
      SetDefaultLndDir()
    }
  }, []);

  return (
    <div className='dark flex flex-col items-center justify-center h-screen mx-w-full'>
      <Toaster />
      <div className='flex w-full max-w-3xl items-center space-x-3'>
        <Label className="w-[15%] max-w-xs">Lnd Data Dir</Label>
        <Input className="w-full" id="lndDir" type="text" value={lndDir} onChange={(e) => SaveLndDir(e.target.value)} />
        <Button onClick={ChooseLndDir} className="dark" > <Folder/></Button>
      </div>
      <div id="input-box" className='w-[80%] mx-auto'>
        <div id="editor-container" className='w-full'>
          <INIEditor config={config} onChange={SaveConfig} />
        </div>

        <div className="power-button-container">
          <div className={`power-button off ${!isReady ? "disabled" : ""
            }`} onClick={RunNode}>
            <div className="power-indicator flex flex-col justify-center items-center">
              <Power />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
