import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { defaultConfig, useCreateStore } from '@/store/create';
import { createListCollection } from "@chakra-ui/react"
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select"
interface Config {
  [section: string]: {
    [key: string]: string;
  };
}


const parseConfig = (config: string): Config => {
  const lines = config.split('\n');
  const result: Config = {};
  let currentSection: string | null = null;

  lines.forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;

    if (line.startsWith('[') && line.endsWith(']')) {
      currentSection = line.slice(1, -1);
      result[currentSection] = {};
    } else if (currentSection) {
      const [key, value] = line.split('=').map((str) => str.trim());
      result[currentSection][key] = value || '';
    }
  });

  return result;
};

const stringifyConfig = (configObj: Config): string => {
  let result = '';
  for (const [section, options] of Object.entries(configObj)) {
    result += `[${section}]\n`;
    for (const [key, value] of Object.entries(options)) {
      result += `${key}=${value}\n`;
    }
    result += '\n';
  }
  return result.trim();
};

const ConfigForm = () => {
  const { config, setConfig, aliasName, setAliasName } = useCreateStore()
  const [currentnetwork, setCurrentnetwork] = useState('signet')
  const [configObj, setConfigObj] = useState<Config>(parseConfig(defaultConfig));
  const [isTouched, setIsTouched] = useState(false);

  const handleChange = (section: string, key: string, value: string) => {
    const updatedConfig = { ...configObj };
    updatedConfig[section][key] = value;
    setConfigObj(updatedConfig);
    setConfig(stringifyConfig(updatedConfig));
  };

  const handleBitcoinNetworkChange = (network: string) => {
    const updatedConfig = { ...configObj };
    setCurrentnetwork(network)

    Object.keys(updatedConfig['Bitcoin']).forEach((key) => {
      if (key.startsWith('bitcoin.') && key !== 'bitcoin.node') {
        updatedConfig['Bitcoin'][key] = 'false';
      }
    });

    updatedConfig['Bitcoin'][`bitcoin.${network}`] = 'true';
    setConfigObj(updatedConfig);
    setConfig(stringifyConfig(updatedConfig));
  };

  const changeAliasName = (e: { target: { value: string; }; }) => {
    handleChange('Application Options', 'alias', e.target.value)
    setAliasName(e.target.value)
  }

  const handleBlur = () => {
    setIsTouched(true);
  };
  const frameworks = createListCollection({
    items: [
      { label: "mainnet", value: "mainnet" },
      { label: "testnet", value: "testnet" },
      { label: "simnet", value: "simnet" },
      { label: "regtest", value: "regtest" },
      { label: "signet", value: "signet" },
    ],
  })
  // @ts-ignore
  return (
    <>
      <div className="flex flex-col items-start w-full gap-[8px]">
        <div className="font-normal text-base text-black leading-5 text-left uppercase:none">Your LND Alias</div>
        {/*<Input className="w-full" id="lndDir" type="text" required placeholder={'Input your name'}  value={configObj['Application Options']['alias']}/>*/}
        <Input
          className={`w-full border ${isTouched && ! aliasName? 'border-red-500' : 'border-gray-300'} focus:border-[#E67137] focus:ring-2 focus:ring-[#E67137]`}
          id="lndDir"
          type="text"
          required
          placeholder="Input your name"
          value={aliasName}
          onChange={(e)=>changeAliasName(e)} // 更新输入值
          onBlur={handleBlur} // 失焦时触发
        />
      </div>
      <div className="flex flex-col items-start w-full gap-[8px]">
        <div className="font-normal text-base text-black leading-5 text-left uppercase:none mb-[12px]">Special node configuration</div>
        <div className="flex flex-col items-start w-full gap-[8px]">
          <div className="flex flex-row w-full items-center justify-between">
            <div className="font-normal text-sm text-black leading-4 text-left w-[170px]">BTC Network:</div>
            <div className="rounded-md border border-[1px] border-[#E2E8F0] w-[297px] h-[32px] pl-[12px] leading-[18px] text-[14px] flex flex-row items-center justify-center">
              <SelectRoot collection={frameworks}>
                <SelectTrigger className="flex flex-row items-center justify-center">
                  {/*<SelectValueText placeholder={'signet'} className="leading-[18px] text-[14px]" />*/}
                  <div>{currentnetwork}</div>
                </SelectTrigger>
                <SelectContent>
                  {frameworks.items.map((item: { value: string; label: string; }) => (
                    <SelectItem item={item} key={item.value} onClick={() => handleBitcoinNetworkChange(item.value)}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </div>
          </div>
          <div className="flex flex-row w-full items-center justify-between">
            <div className="font-normal text-sm text-black leading-4 text-left w-[170px]">REST cors:</div>
            <Input className="w-[295px] h-[32px]" id="restcors" type="text"  value={configObj['Application Options']['restcors']} onChange={(e) =>
              handleChange('Application Options', 'restcors', e.target.value)
            } />
          </div>
          <div className="flex flex-row w-full items-center justify-between">
            <div className="font-normal text-sm text-black leading-4 text-left w-[170px]">RPC Listen Endpoint:</div>
            <Input className="w-[295px] h-[32px]" id="rpclisten" type="text"  value={configObj['Application Options']['rpclisten']} onChange={(e) =>
              handleChange('Application Options', 'rpclisten', e.target.value)
            } />
          </div>
          <div className="flex flex-row w-full items-center justify-between flex-nowrap">
            <div className="font-normal text-sm text-black leading-4 text-left w-[170px]">REST Listen Endpoint:</div>
            <Input className="w-[295px] h-[32px]" id="restlisten" type="text" value={configObj['Application Options']['restlisten']}
                   onChange={(e) =>
                     handleChange('Application Options', 'restlisten', e.target.value)
                   } />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfigForm;
