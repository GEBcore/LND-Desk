import React from 'react';
import Import from '@/views/create/Import';
import New from '@/views/create/New';
import { Tabs } from "@chakra-ui/react"
import Private from '@/views/create/Private';
function Tab() {
  return (
    <div className="flex flex-col justify-center items-center flex-wrap w-full">
      <div className="text-[24px] text-[#1A202C] leading-[31px] text-center max-w-[380px] mb-[40px] font-family-medium">
        Your LND Node Operation Information
      </div>
      <Tabs.Root defaultValue="new" variant="outline" justify="center">
        <Tabs.List rounded="4px" className="flex flex-row justify-between font-family-medium" style={{border:'2px solid #E2E8F0'}}>
          <Tabs.Trigger value="new" className="px-[12px]">
            New Wallet
          </Tabs.Trigger>
          <Tabs.Trigger value="import" className="px-[12px]">
            Your Own Mnemonic
          </Tabs.Trigger>
          <Tabs.Trigger value="private" className="px-[12px]">
            Your own private key
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" style={{border:'2px solid #E67137', color:'#E67137'}} />
        </Tabs.List>
        <Tabs.Content value="import" className="pt-[24px]"><Import/></Tabs.Content>
        <Tabs.Content value="new" className="pt-[24px]"><New/></Tabs.Content>
        <Tabs.Content value="private" className="pt-[24px]"><Private/></Tabs.Content>
      </Tabs.Root>
    </div>

  )
}

export default Tab
