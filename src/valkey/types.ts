import { PubSubMsg } from "@valkey/valkey-glide";

export type ValkeyServiceOptions = {
  clientId: string;
}

export type ValkeyPubSubServiceOptions = {
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

export type ValkeyPubSubInitOptions = {
  host: string;
  useTls: boolean;
  clientName: string;
  port: number;
  timeout: number;
  patterns: string[];
  callback: (msg: PubSubMsg) => void | Promise<void>
}

export type KeyEventCallback = (key: string, event: string) => void | Promise<void>
