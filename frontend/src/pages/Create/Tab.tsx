import { Tabs, Root, TabsList, TabsTrigger, Content } from '@radix-ui/react-tabs';
import React from 'react';
import Import from '@/pages/Create/Import';
import New from '@/pages/Create/New';

function Tab() {
  return (
    <Tabs>
      <Root defaultValue="account">
        <TabsList className="gap-3 flex flex-row">
          <TabsTrigger value="import" className={"flex"}>Our Own Mnemonic</TabsTrigger>
          <TabsTrigger value="new" className={"flex"}>New Wallet</TabsTrigger>
        </TabsList>
        <div className="pt-3">
          <Content value="import">
            <Import/>
          </Content>
          <Content value="new">
            <New/>
          </Content>
        </div>
      </Root>
    </Tabs>
  )
}

export default Tab
