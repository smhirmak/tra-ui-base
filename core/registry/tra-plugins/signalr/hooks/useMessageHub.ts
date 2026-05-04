import { useMessageHubContext } from "@/contexts/messageHub/MessageHubContext";

/**
 * Hub bağlantı durumunu ve invoke metodunu döner.
 *
 * @example
 * const { isConnected, invoke } = useMessageHub();
 * await invoke('SendMessage', { text: 'Merhaba' });
 */
export function useMessageHub() {
  const { connection, isConnected, connectionId } = useMessageHubContext();

  const invoke = async <T = void>(methodName: string, ...args: unknown[]): Promise<T> => {
    if (!connection) throw new Error("SignalR bağlantısı mevcut değil.");
    return connection.invoke<T>(methodName, ...args);
  };

  return { isConnected, connectionId, invoke };
}
