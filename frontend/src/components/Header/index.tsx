import logo from '@/assets/header/logo.svg'
import question from '@/assets/header/question.svg'
import { useCreateStore } from '@/store/create';
import { BrowserOpenURL } from '../../../wailsjs/runtime';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const Header = () => {
  const {setShowQADialog, getVersion, fetchVersionInfo} = useCreateStore()
  const navigate = useNavigate();

  useEffect(() => {
    // getVersion()
    fetchVersionInfo()
  }, []);

  const QA_LINK = 'https://github.com/btclayer2/LND-Desk/wiki/Frequently-Asked-Questions'
  return <div className="flex flex-row items-center justify-between px-[32px] py-[8px] bg-[#FAFAFA] shadow-[1px_0px_0px_0px_rgba(0,0,0,0.04)]">
    <img src={logo} alt="" />
    <div className="flex flex-row items-center justify-start gap-[8px] cursor-pointer" onClick={()=>BrowserOpenURL(QA_LINK)} >
      <img src={question} alt=""/>
      <span>F&Q</span>
    </div>
  </div>
}