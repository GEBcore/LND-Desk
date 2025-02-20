import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { defaultConfig, useCreateStore } from '@/store/create';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select"
import { frameworks, lndChainScanMap } from '@/commons/lndChainInfo';
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
  const { config, setConfig, aliasName, setAliasName, setLndChainScan, currentNetwork, setCurrentNetwork } = useCreateStore()
  const [configObj, setConfigObj] = useState<Config>(() => {
    const savedConfig = localStorage.getItem('config');
    return savedConfig ? parseConfig(savedConfig) : parseConfig(defaultConfig);
  });
  const [isTouched, setIsTouched] = useState(false);

  // 组件加载时初始化所有配置
  useEffect(() => {
    if (!configObj['Application Options']) return;

    // 设置 alias
    if (configObj['Application Options']['alias']) {
      setAliasName(configObj['Application Options']['alias']);
    }

    // 设置网络类型
    if (configObj['Bitcoin']) {
      const network = Object.keys(configObj['Bitcoin']).find(key => 
        key.startsWith('bitcoin.') && 
        key !== 'bitcoin.node' && 
        configObj['Bitcoin'][key] === 'true'
      );
      if (network) {
        const networkType = network.replace('bitcoin.', '');
        setCurrentNetwork(networkType);
        setLndChainScan(lndChainScanMap[networkType]);
      }
    }
    if (configObj['Application Options']['rpclisten']) {
      const value = configObj['Application Options']['rpclisten']?.replace('localhost:', '')
      configObj['Application Options']['rpclisten'] = value
    }

    if (configObj['Application Options']['restlisten']) {
      const value = configObj['Application Options']['restlisten']?.replace('localhost:', '')
      configObj['Application Options']['restlisten'] = value
    }
  }, []);

  const handleChange = (section: string, key: string, value: string) => {
    const updatedConfig = { ...configObj };
    console.log(key, value)
    updatedConfig[section][key] = value;
    setConfigObj(updatedConfig);
    setConfig(stringifyConfig(updatedConfig));
  };

  const handleBitcoinNetworkChange = (network: string) => {
    const updatedConfig = { ...configObj };
    setCurrentNetwork(network)
    setLndChainScan(lndChainScanMap[network])

    Object.keys(updatedConfig['Bitcoin']).forEach((key) => {
      if (key.startsWith('bitcoin.') && key !== 'bitcoin.node') {
        updatedConfig['Bitcoin'][key] = 'false';
      }
    });

    updatedConfig['Bitcoin'][`bitcoin.${network}`] = 'true';

    if (network === 'mainnet') {
      updatedConfig['fee'] = {'fee.url':'https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json'};
    }else{
      updatedConfig['fee'] = {}
    }

    setConfigObj(updatedConfig);
    setConfig(stringifyConfig(updatedConfig));
  };

  useEffect(() => {
    handleBitcoinNetworkChange(currentNetwork)
  }, [currentNetwork]);

  const changeAliasName = (e: { target: { value: string; }; }) => {
    handleChange('Application Options', 'alias', e.target.value)
    setAliasName(e.target.value)
  }

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <>
      <div className="flex flex-col items-start w-full gap-[8px]">
        <div className="font-normal text-base text-black leading-5 text-left uppercase:none font-family-medium">Your LND Alias</div>
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
      <div className="flex flex-col items-start w-full gap-[12px]">
        <div className="font-normal text-base text-black leading-5 text-left uppercase:none font-family-medium">Special node configuration</div>
        <div className="flex flex-col items-start w-full gap-[12px]">
          <div className="flex flex-row w-full items-center justify-between">
            <div className="font-normal text-sm text-black leading-4 text-left w-[170px] font-family-medium">BTC Network:</div>
            <div className="rounded-md border border-[1px] border-[#E2E8F0] w-[297px] h-[32px] pl-[12px] leading-[18px] text-[14px] flex flex-row items-center justify-center">
              <SelectRoot collection={frameworks}>
                <SelectTrigger className="flex flex-row items-center justify-center">
                  <div>{currentNetwork}</div>
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
            <div className="font-normal text-sm text-black leading-4 text-left w-[170px] font-family-medium">REST cors:</div>
            <Input 
              className="w-[295px] h-[32px]" 
              id="restcors" 
              type="text"  
              value={configObj['Application Options']['restcors'] || ''} 
              onChange={(e) => handleChange('Application Options', 'restcors', e.target.value)}
            />
          </div>
          <div className="flex flex-row w-full items-center justify-between">
            <div className="font-normal text-sm text-black leading-4 text-left w-[170px] font-family-medium">RPC Listen Endpoint:</div>
            <Input 
              className="w-[295px] h-[32px]" 
              id="rpclisten" 
              type="text"  
              value={configObj['Application Options']['rpclisten']}
              onChange={(e) => handleChange('Application Options', 'rpclisten', e.target.value)}
            />
          </div>
          <div className="flex flex-row w-full items-center justify-between flex-nowrap">
            <div className="font-normal text-sm text-black leading-4 text-left w-[170px] font-family-medium">REST Listen Endpoint:</div>
            <Input 
              className="w-[295px] h-[32px]" 
              id="restlisten" 
              type="text" 
              value={configObj['Application Options']['restlisten']}
              onChange={(e) => handleChange('Application Options', 'restlisten', e.target.value)}
            />
          </div>
        </div>
    </div>
    </>
  );
};

export default ConfigForm;
