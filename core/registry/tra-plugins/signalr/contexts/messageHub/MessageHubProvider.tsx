import { useEffect, useRef, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { MessageHubContext } from "./MessageHubContext";
import { createHubConnection, startConnection, stopConnection } from "@/lib/signalr";

interface MessageHubProviderProps {
  children: React.ReactNode;
  /** Hub URL — örn. import.meta.env.VITE_HUB_URL */
  hubUrl: string;
  /** Opsiyonel: güncel access token döndüren fonksiyon */
  getAccessToken?: () => string | null;
  /** false ise bağlantı başlatılmaz (kullanıcı giriş yapmamış vb.) */
  enabled?: boolean;
}

export function MessageHubProvider({
  children,
  hubUrl,
  getAccessToken,
  enabled = true,
}: MessageHubProviderProps) {
  const connectionRef = useRef(createHubConnection({ hubUrl, getAccessToken }));
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const conn = connectionRef.current;

    conn.onreconnected((id) => {
      setIsConnected(true);
      setConnectionId(id ?? null);
    });

    conn.onreconnecting(() => {
      setIsConnected(false);
    });

    conn.onclose(() => {
      setIsConnected(false);
      setConnectionId(null);
    });

    startConnection(conn).then(() => {
      setIsConnected(conn.state === HubConnectionState.Connected);
      setConnectionId(conn.connectionId);
    });

    return () => {
      stopConnection(conn);
    };
  }, [enabled, hubUrl]);

  return (
    <MessageHubContext.Provider
      value={{ connection: connectionRef.current, isConnected, connectionId }}
    >
      {children}
    </MessageHubContext.Provider>
  );
}
