import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

export interface SignalRConfig {
  hubUrl: string;
  /** Bağlantı öncesi çağrılır; güncel token döndürür */
  getAccessToken?: () => string | null;
  onReconnecting?: (error?: Error) => void;
  onReconnected?: (connectionId?: string) => void;
  onClose?: (error?: Error) => void;
}

/**
 * Yeni bir SignalR HubConnection oluşturur.
 * Otomatik reconnect ve token desteğiyle gelir.
 */
export function createHubConnection(config: SignalRConfig): HubConnection {
  const builder = new HubConnectionBuilder()
    .withUrl(config.hubUrl, {
      accessTokenFactory: config.getAccessToken
        ? () => config.getAccessToken!() ?? ""
        : undefined,
    })
    .withAutomaticReconnect()
    .configureLogging(
      import.meta.env.DEV ? LogLevel.Information : LogLevel.Warning,
    );

  const connection = builder.build();

  if (config.onReconnecting) connection.onreconnecting(config.onReconnecting);
  if (config.onReconnected) connection.onreconnected(config.onReconnected);
  if (config.onClose) connection.onclose(config.onClose);

  return connection;
}

export async function startConnection(
  connection: HubConnection,
): Promise<void> {
  if (connection.state === HubConnectionState.Disconnected) {
    await connection.start();
  }
}

export async function stopConnection(connection: HubConnection): Promise<void> {
  if (connection.state !== HubConnectionState.Disconnected) {
    await connection.stop();
  }
}

export { HubConnectionState };
