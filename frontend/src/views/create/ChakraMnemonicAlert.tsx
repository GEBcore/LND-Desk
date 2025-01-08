import React, { useState } from 'react';
import {
  Button,
  VStack,
  Text,
  Box,
  Circle,
  List,
  ListItem,
  useDisclosure
} from '@chakra-ui/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


const ChakraMnemonicAlert = () => {
  const [isOpen, onClose] = useState(false)
  // 比特币主题色
  const btcTheme = {
    orange: {
      50: '#FFF7ED',
      100: '#FFE4CC',
      500: '#F7931A',
      600: '#E58719',
      800: '#9C4221',
    }
  };

  return (
  <Dialog open={!isOpen}>
    <DialogContent className="p-6 rounded-lg shadow-lg">
        <DialogHeader>

          <Text fontSize="xl" fontWeight="semibold">
            Important Security Notice
          </Text>
          <DialogTitle className="text-lg font-semibold">Input Your Wallet Password</DialogTitle>
        </DialogHeader>
        <div>
          <Text color="gray.600">
            Please ensure you have safely backed up your mnemonic phrase.
          </Text>

          <Box
            w="full"
            bg={btcTheme.orange[50]}
            p={4}
            borderRadius="lg"
            border="1px"
            borderColor={btcTheme.orange[100]}
          >
            {/*<List*/}
            {/*  spacing={2}*/}
            {/*  styleType="none"*/}
            {/*  listStylePosition="inside"*/}
            {/*  color={btcTheme.orange[800]}*/}
            {/*  textAlign="left"*/}
            {/*  m={0}*/}
            {/*>*/}
            {/*  */}
            {/*</List>*/}
            <div>
              <ListItem display="flex" alignItems="start">
                <Text as="span" fontWeight="bold" mr={2}>•</Text>
                <Text as="span">This is your ONLY chance to backup these words</Text>
              </ListItem>
              <ListItem display="flex" alignItems="start">
                <Text as="span" fontWeight="bold" mr={2}>•</Text>
                <Text as="span">Without this backup, you will not be able to recover your wallet if lost</Text>
              </ListItem>
              <ListItem display="flex" alignItems="start">
                <Text as="span" fontWeight="bold" mr={2}>•</Text>
                <Text as="span">Store this backup in a secure location, never share it with anyone</Text>
              </ListItem>
            </div>
          </Box>

          <Text color={btcTheme.orange[500]} fontSize="sm" fontWeight="medium">
            Once confirmed, you will not see these words again
          </Text>
        </div>
    </DialogContent>
  </Dialog>
  );
};

export default ChakraMnemonicAlert;