export type ValkeyServiceOptions = {
  clientId: string;
}

export type ValkeyInitOptions = {
  host: string;
  useTls: boolean;
  isClusterMode: boolean;
  clientName: string;
  port: number;
  timeout: number;
}
