"use client"

import { Button, Stack, Text } from '@chakra-ui/react';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion"
import React, { SetStateAction, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { useCreateStore } from '@/store/create';

export const QA = () => {
  const {showQADialog, setShowQADialog} = useCreateStore()
  const [value, setValue] = useState(['second-item']);
  return (
    <Dialog open={showQADialog} onOpenChange={()=>setShowQADialog(false)}>
      <DialogContent className="p-[18px] rounded-lg shadow-lg flex flex-col items-center justify-center w-[436px]">
        {/*<DialogHeader>*/}
        {/*  <Text fontSize="18px" fontWeight="semibold" color="#2D3748" className="mb-[15px]">*/}
        {/*    Frequently Asked Questions*/}
        {/*  </Text>*/}

        {/*</DialogHeader>*/}
        <Stack gap="4">
          <Text fontWeight="medium">Expanded: {value.join(', ')}</Text>
          <AccordionRoot value={value} onValueChange={(e: { value: SetStateAction<string[]> }) => setValue(e.value)}>
            {items.map((item, index) => (
              <AccordionItem key={index} value={item.value}>
                <AccordionItemTrigger>{item.title}</AccordionItemTrigger>
                <AccordionItemContent>{item.text}</AccordionItemContent>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

const items = [
  { value: "first-item", title: "First Item", text: "Some value 1..." },
  { value: "second-item", title: "Second Item", text: "Some value 2..." },
  { value: "third-item", title: "Third Item", text: "Some value 3..." },
]
