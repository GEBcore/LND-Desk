import logo from '@/assets/header/logo.svg'
import question from '@/assets/header/question.svg'

export const Header = () => {
  return <div className="flex flex-row items-center justify-between px-[32px] py-[8px] bg-[#FAFAFA] shadow-[1px_0px_0px_0px_rgba(0,0,0,0.04)]">
    <img src={logo} alt=""/>
    <div className="flex flex-row items-center justify-start gap-[8px]">
      <img src={question} alt=""/>
      <span>F&Q</span>
    </div>
  </div>
}