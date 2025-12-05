import { 
  GlideClient,
  GlideClientConfiguration,
  GlideClusterClient,
} from "@valkey/valkey-glide";

import { 
  ValkeyPubSubInitOptions, 
  ValkeyPubSubServiceOptions 
} from "./types";
import { logger } from "../logger";

export class ValkeyPubSubService {
  private _isConnected: boolean = false;
  private client!: GlideClient | GlideClusterClient; 
  private readonly clientId: string;

  constructor (options: ValkeyPubSubServiceOptions) {
    this.clientId = options.clientId;
  }

  public async init(options: ValkeyPubSubInitOptions): Promise<void> {
    const config: GlideClientConfiguration = {
      addresses: [{ host: options.host, port: options.port }],
      clientName: `${options.clientName}-pubsub`,
      requestTimeout: options.timeout,
      useTLS: options.useTls,
      pubsubSubscriptions: {
        channelsAndPatterns: {
          [GlideClientConfiguration.PubSubChannelModes.Pattern]: new Set(options.patterns) // ex: __keyspace@0__:user:*
        },
        callback: options.callback
      }
    };

    this.client = await GlideClient.createClient(config);
    this._isConnected = true;
    logger.info(`[Valkey-${this.clientId}-PubSub] client connected.`);
  }

  public async destroy(): Promise<void> {
    if (this.client) {
      this.client.close();
      this._isConnected = false;
      logger.info(`[Valkey-${this.clientId}-PubSub] client disconnected.`);
    }
  }

  public get isConnected(): boolean {
    return this._isConnected;
  }
}
