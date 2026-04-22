import { createContext, useContext } from 'react';
import type { HubConnection } from '@microsoft/signalr';

export interface MessageHubContextValue {
  connection: HubConnection | null;
  isConnected: boolean;
  connectionId: string | null;
}

export const MessageHubContext = createContext<MessageHubContextValue>({
  connection: null,
  isConnected: false,
  connectionId: null,
});

export function useMessageHubContext() {
  return useContext(MessageHubContext);
}
