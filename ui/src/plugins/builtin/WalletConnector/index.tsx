/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { memo, FC, useEffect } from 'react';
import { Button } from 'react-bootstrap';

// eslint-disable-next-line import/no-extraneous-dependencies
import '@rainbow-me/rainbowkit/styles.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
} from '@rainbow-me/rainbowkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { WagmiProvider, useAccount, useSignMessage } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';

import classnames from 'classnames';

import { getTransNs, getTransKeyPrefix } from '@/utils/pluginKit/utils';
import { SvgIcon } from '@/components';

import info from './info.yaml';
// import { useGetStartUseOauthConnector } from './services';
import './i18n';

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  // ssr: true, // If your dApp uses server side rendering (SSR)
});

const pluginInfo = {
  slug_name: info.slug_name,
  type: info.type,
  icon: info.icon,
};
interface Props {
  className?: string;
}
const Index: FC<Props> = ({ className }) => {
  const queryClient = new QueryClient();
  const { t } = useTranslation(getTransNs(), {
    keyPrefix: getTransKeyPrefix(pluginInfo),
  });
  // const { address1, isConnected } = useAccount(config);
  // console.log('🚀 ~ address1:', address1);
  // const { signMessage } = useSignMessage({
  //   // onSuccess(data) {
  //   //   // Handle success, e.g., send the signed message to your server
  //   //   console.log('Message signed successfully:', data);
  //   // },
  //   // onError(error) {
  //   //   // Handle error
  //   //   console.error('Error signing message:', error);
  //   // },
  // });

  // useEffect(() => {
  //   if (isConnected && address) {
  //     const requestAuthorization = async () => {
  //       const message = `Please authorize this message to login: ${new Date().toISOString()}`;
  //       try {
  //         await signMessage({ message });
  //       } catch (error) {
  //         console.error('Authorization request failed:', error);
  //       }
  //     };

  //     requestAuthorization();
  //   }
  // }, [isConnected, address, signMessage]);

  // const { data } = useGetStartUseOauthConnector();
  // if (!data?.length) return null;
  // const item = data.filter((it) => it.name === pluginInfo.slug_name)[0];
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className={classnames('d-grid gap-2')}>
            <ConnectButton.Custom>
              {({
                // chain,
                openAccountModal,
                // openChainModal,
                openConnectModal,
                // authenticationStatus,
                // mounted,
              }) => {
                // const address = account?.address;
                const { address, isConnected } = useAccount();
                const { signMessageAsync } = useSignMessage();
                useEffect(() => {
                  if (address && isConnected) {
                    const requestAuthorization = async () => {
                      const message = `Please authorize this message to login: ${new Date().toISOString()}`;
                      try {
                        const signature = await signMessageAsync({ message });
                        console.log('Message signed successfully:', signature);
                      } catch (error) {
                        console.error('Authorization request failed:', error);
                      }
                    };

                    requestAuthorization();
                  }
                }, [address]);
                return (
                  <Button
                    className={classnames(className)}
                    variant="outline-secondary"
                    onClick={openConnectModal}>
                    {isConnected ? (
                      <div onClick={openAccountModal}>{address}</div>
                    ) : (
                      <>
                        <SvgIcon
                          base64={pluginInfo.icon}
                          svgClassName="btnSvg me-2"
                        />
                        <span>
                          {t('connect', {
                            auth_name: 'wallet',
                          })}
                        </span>
                      </>
                    )}
                  </Button>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default {
  info: pluginInfo,
  component: memo(Index),
};
