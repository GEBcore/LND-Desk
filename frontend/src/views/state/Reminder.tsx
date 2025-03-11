import { useState } from 'react';
import warning from '@/assets/lndstate/warning.svg';
function Reminder() {

  return (
    <div className="w-[480px] bg-[#F0F8FF] border-[1px] rounded-[6px] border-[#C7E9FF] flex flex-row gap-[11px] items-start justify-center px-[23px] py-[15px] mt-[40px] mb-[37px]">
      <img src={warning} alt=""/>
      <div className="flex flex-col justify-between items-start gap-[8px]">
        <div className="color-[#000000] text-[16px]">Reminder</div>
        <div className="color-[#595959] text-[14px]">All your channel assets are tied to the LND folder. Please ensure the safekeeping of your folder and back it up regularly. Avoid using the same mnemonic across multiple terminals.</div>
      </div>
    </div>
  )
}

export default Reminder
