import { useEffect, useCallback } from "react";
import { useMessageHubContext } from "@/contexts/messageHub/MessageHubContext";

/**
 * SignalR hub'ına event listener bağlar.
 *
 * @example
 * useSignalR('ReceiveNotification', (data) => {
 *   console.log('Yeni bildirim:', data);
 * });
 */
export function useSignalR<T = unknown>(
  eventName: string,
  handler: (data: T) => void,
) {
  const { connection } = useMessageHubContext();

  const stableHandler = useCallback(handler, []);

  useEffect(() => {
    if (!connection) return;

    connection.on(eventName, stableHandler);

    return () => {
      connection.off(eventName, stableHandler);
    };
  }, [connection, eventName, stableHandler]);
}
