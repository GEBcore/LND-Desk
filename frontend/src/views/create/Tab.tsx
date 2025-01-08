import React from 'react';
import Import from '@/views/create/Import';
import New from '@/views/create/New';
import { Tabs } from "@chakra-ui/react"
function Tab() {
  return (
    <Tabs.Root defaultValue="import" variant="plain">
      <Tabs.List bg="bg.muted" rounded="l3" p="1">
        <Tabs.Trigger value="import" className="px-6">
          Your Own Mnemonic
        </Tabs.Trigger>
        <Tabs.Trigger value="new" className="px-6">
          New Wallet
        </Tabs.Trigger>
        <Tabs.Indicator rounded="l2" />
      </Tabs.List>
      <Tabs.Content value="import" style={{width:'600px',height: '400px'}}><Import/></Tabs.Content>
      <Tabs.Content value="new" style={{width:'600px',height: '500px'}}><New/></Tabs.Content>
    </Tabs.Root>
  )
}

export default Tab
