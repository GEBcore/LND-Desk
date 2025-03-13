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
  const { setConfig, aliasName, setAliasName, setLndChainScan, currentNetwork, setCurrentNetwork } = useCreateStore()
  const [configObj, setConfigObj] = useState<Config>(() => parseConfig(defaultConfig));
  const [isTouched, setIsTouched] = useState(false);

  // 从 localStorage 加载配置
  useEffect(() => {
    // 加载 alias
    const savedAlias = localStorage.getItem('lnd_alias');
    if (savedAlias) {
      setAliasName(savedAlias);
      const updatedConfig = { ...configObj };
      updatedConfig['Application Options']['alias'] = savedAlias;
      setConfigObj(updatedConfig);
    }

    // 加载 network
    const savedNetwork = localStorage.getItem('btc_network');
    if (savedNetwork) {
      setCurrentNetwork(savedNetwork);
      setLndChainScan(lndChainScanMap[savedNetwork]);
    }

    // 加载其他配置
    const savedRestCors = localStorage.getItem('rest_cors');
    const savedRpcListen = localStorage.getItem('rpc_listen');
    const savedRestListen = localStorage.getItem('rest_listen');
    const updatedConfig = { ...configObj };
    if (savedRestCors) {
      if (savedRestCors === 'https://bevmhub.bevm.io'){
        updatedConfig['Application Options']['restcors'] = 'https://gebhub.geb.network'
      }else{
        updatedConfig['Application Options']['restcors'] = savedRestCors
      }
    }
    if (savedRpcListen) updatedConfig['Application Options']['rpclisten'] = savedRpcListen;
    if (savedRestListen) updatedConfig['Application Options']['restlisten'] = savedRestListen;
    setConfigObj(updatedConfig);
    setConfig(stringifyConfig(updatedConfig));
  }, []);


  const handleChange = (section: string, key: string, value: string) => {
    const updatedConfig = { ...configObj };
    updatedConfig[section][key] = value;
    setConfigObj(updatedConfig);
    setConfig(stringifyConfig(updatedConfig));

    // 只保存独立配置项到 localStorage
    switch (key) {
      case 'restcors':
        localStorage.setItem('rest_cors', value);
        break;
      case 'rpclisten':
        localStorage.setItem('rpc_listen', value);
        break;
      case 'restlisten':
        localStorage.setItem('rest_listen', value);
        break;
    }
  };

  const handleBitcoinNetworkChange = (network: string, refreshLocal?:boolean) => {
    setCurrentNetwork(network);
    setLndChainScan(lndChainScanMap[network]);
    refreshLocal && localStorage.setItem('btc_network', network);

    const updatedConfig = { ...configObj };
    Object.keys(updatedConfig['Bitcoin']).forEach((key) => {
      if (key.startsWith('bitcoin.') && key !== 'bitcoin.node') {
        updatedConfig['Bitcoin'][key] = 'false';
      }
    });

    updatedConfig['Bitcoin'][`bitcoin.${network}`] = 'true';

    if (network === 'mainnet') {
      updatedConfig['fee'] = {'fee.url':'https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json'};
    } else {
      updatedConfig['fee'] = {};
    }

    setConfigObj(updatedConfig);
    setConfig(stringifyConfig(updatedConfig));
  };


  useEffect(() => {
    handleBitcoinNetworkChange(currentNetwork, false)
  }, [currentNetwork]);
  const changeAliasName = (e: { target: { value: string; }; }) => {
    const value = e.target.value;
    setAliasName(value);
    localStorage.setItem('lnd_alias', value);
    
    const updatedConfig = { ...configObj };
    updatedConfig['Application Options']['alias'] = value;
    setConfigObj(updatedConfig);
    setConfig(stringifyConfig(updatedConfig));
  };

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
                    <SelectItem item={item} key={item.value} onClick={() => handleBitcoinNetworkChange(item.value, true)}>
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
