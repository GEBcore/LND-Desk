import { useState, useEffect } from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';
import { RunLnd, VerifyConfig, GetDefaultLndDir, OpenDirectorySelector } from "@/../wailsjs/go/main/App";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { frontend } from '@/../wailsjs/go/models';
import { useCreateStore } from '@/store/create';
import { ConfirmButton } from '@/components/ConfirmButton';
import ConfigForm from '@/views/Main/ConfigForm';
import { QA } from '@/views/Main/QA';
import folder from '@/assets/lndstate/folderOpen.svg'
import { UpdateAlert } from '@/views/Main/Update';

function Main() {
  const { config, setConfig, aliasName } = useCreateStore()
  const [lndDir, setLndDir] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast()
  const {getVersion, fetchVersionInfo, currentVersion, updateVersion} = useCreateStore()

  useEffect(() => {
    getVersion()
    fetchVersionInfo()
  }, []);

  useEffect(() => {
    console.log('config', config)
  }, [config]);

  async function RunNode() {
    const isVerify = await CheckConfig()
    if (!isVerify) {
      return
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
    }
  }

  async function CheckConfig(): Promise<boolean> {
    try {
      if(!aliasName){
        toast({
          variant: "destructive",
          title: "Error",
          description: String('Your LND Alias Empty!'),
        })
        return false
      }
      console.log(lndDir)
      console.log(config)
      const updatedText = config.replace(/rpclisten=([^ ]*)/, "rpclisten=localhost:$1").replace(/restlisten=([^ ]*)/, "restlisten=localhost:$1");
      console.log(updatedText)
      await VerifyConfig(lndDir, updatedText);
      return true
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lnd Config Error",
        description: String(error),
      })
      return false
    }
  }

  function SaveLndDir(value: string) {
    setLndDir(value);
    localStorage.setItem('lndDir', value);
  }

  async function SetDefaultLndDir() {
    const defaultLndDir = await GetDefaultLndDir()
    SaveLndDir(defaultLndDir)
  }

  async function ChooseLndDir() {
    try {
      const defaultLndDir = await GetDefaultLndDir()
      const chooseedLndDir = await OpenDirectorySelector(frontend.OpenDialogOptions.createFrom({
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
    // const savedConfig = localStorage.getItem('config');
    // if (savedConfig && savedConfig !== '') {
    //   setConfig(savedConfig);
    // }
    const savedLndDir = localStorage.getItem('lndDir');
    if (savedLndDir && savedLndDir !== '') {
      setLndDir(savedLndDir);
    } else {
      SetDefaultLndDir()
    }
  }, []);

  return (
    <div className='flex flex-col items-center justify-center mt-[48px] mx-w-full'>
      <div className="text-[24px] text-[#1A202C] leading-[31px] text-center max-w-[380px] mb-[40px] font-family-medium">
        Your LND Node Operation Information
      </div>
      <Toaster />
      <div className="w-[480px] flex flex-col items-start gap-[24px] mb-[40px]">
        <div className="flex flex-col w-full items-start justify-between gap-[8px]">
          <div className="text-base text-black leading-5 text-left uppercase:none font-family-medium">Data Storage Directory</div>
          <div className='flex w-full items-center relative'>
            <Input placeholder={'Choose your LND Directory'} className="w-[480px]" disabled={true} id="lndDir" type="text" />
            <div className="bg-[#EDF2F7] absolute p-[8px] right-[0px] cursor-pointer border border-[#E2E8F0] rounded-tr-md rounded-br-md" onClick={ChooseLndDir}><img src={folder} alt=""/></div>
          </div>
          {/*<div className="bg-[#EDF2F7] p-[8px] cursor-pointer border border-[#E2E8F0] rounded" onClick={ChooseLndDir}><img src={folder} alt=""/></div>*/}
        </div>
        <ConfigForm/>
      </div>
      <ConfirmButton content={'Confirm to Run'} onClick={RunNode} />
      <UpdateAlert/>
      {/*<QA/>*/}
    </div>
  )
}

export default Main
