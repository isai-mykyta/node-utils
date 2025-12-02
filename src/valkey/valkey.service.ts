import { 
  GlideClient, 
  GlideClientConfiguration, 
  GlideClusterClient, 
  GlideClusterClientConfiguration, 
  TimeUnit
} from "@valkey/valkey-glide";

import { logger } from "../logger";
import { ValkeyInitOptions, ValkeyServiceOptions } from "./types";

export class ValkeyService {
  private _isConnected: boolean = false;
  private client!: GlideClient | GlideClusterClient;

  private readonly clientId: string;

  constructor (options: ValkeyServiceOptions) {
    this.clientId = options.clientId;
  }

  public async destroy(): Promise<void> {
    this.client.close();
    this._isConnected = false;
    logger.info(`[Valkey-${this.clientId}] client disconnected.`);
  }

  public async init(options: ValkeyInitOptions): Promise<void> {
    const config = {
      addresses: [{ host: options.host, port: options.port }],
      clientName: options.clientName,
      requestTimeout: options.timeout,
      useTLS: options.useTls,
    };

    if (options.isClusterMode) {
      const clusterConfig: GlideClusterClientConfiguration = { ...config };
      this.client = await GlideClusterClient.createClient(clusterConfig);
    } else {
      const standaloneConfig: GlideClientConfiguration = { ...config };
      this.client = await GlideClient.createClient(standaloneConfig);
    }

    this._isConnected = true;
    logger.info(`[Valkey-${this.clientId}] client connected. Cluster mode - ${options.isClusterMode}.`);
  }

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public async set<V>(key: string, value: V, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      const expiry = { type: TimeUnit.Seconds, count: ttlSeconds };
      await this.client.set(key, JSON.stringify(value), { expiry });
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  public async get<V>(key: string): Promise<V | null> {
    const value = await this.client.get(key);
    if (!value) return null;

    const stringValue = typeof value === "string" ? value : value.toString();
    return JSON.parse(stringValue);
  }

  public async del(keys: string[]): Promise<void> {
    this.client.del(keys);
  }

  public async exists(keys: string[]): Promise<number> {
    const result = await this.client.exists(keys);
    return Number(result);
  }
}
