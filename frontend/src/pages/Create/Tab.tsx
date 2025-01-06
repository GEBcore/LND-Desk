import React from 'react';
import Import from '@/pages/Create/Import';
import New from '@/pages/Create/New';
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
      <Tabs.Content value="import"><Import/></Tabs.Content>
      <Tabs.Content value="new"><New/></Tabs.Content>
    </Tabs.Root>
  )
}

export default Tab
