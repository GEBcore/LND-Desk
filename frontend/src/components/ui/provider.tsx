"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"


export function Provider() {
  return (
    <ChakraProvider value={defaultSystem}>
      {/*<ColorModeProvider {...props} />*/}
    </ChakraProvider>
  )
}
