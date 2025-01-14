import React from 'react';

type Props = {
  content: string
  onClick: () => void
  type?:'submit' | 'reset' | 'button'
  style?: React.CSSProperties
  disable?: boolean
};
export const ConfirmButton: React.FC<Props> = ({content, onClick, type = 'button', style, disable = false}: Props) => {
  return <button type={type} className="bg-[#E67137] rounded-[6px] px-[40px] py-[10px] font-normal text-[16px] text-[#FFFFFF] leading-[21px] cursor-pointer" style={style} onClick={onClick} disabled={disable}>
    {content}
  </button>
}