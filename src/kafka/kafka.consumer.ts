import { Consumer, EachMessagePayload, Kafka } from "kafkajs";

import { KafkaConsumerOptions } from "./types";
import { logger } from "../logger";

export class KafkaConsumer {
  private readonly kafka: Kafka;
  private readonly topics: string[];
  private readonly consumer: Consumer;
  private readonly clientId: string;

  private _isConnected: boolean = false;
  
  public readonly readFromBeginning: boolean;

  constructor (options: KafkaConsumerOptions) {
    this.kafka = new Kafka({ 
      clientId: options.clientId, 
      brokers: options.brokers
    });

    this.clientId = options.clientId;
    this.topics = options.topics;
    this.readFromBeginning = options.readFromBeginning;
    this.consumer = this.kafka.consumer({ groupId: options.groupId });
  }

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public async connect(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.consumer.connect();
    logger.info(`[Kafka-${this.clientId}] Consumer connected.`);

    await Promise.all(
      this.topics.map((topic) =>
        this.consumer.subscribe({
          topic,
          fromBeginning: this.readFromBeginning
        })
      )
    );

    await this.consumer.run({ eachMessage: handler });

    this._isConnected = true;
    logger.info(`[Kafka-${this.clientId}] Subscribed to topic "${this.topics.join(",")}"`);
  }

  public async disconnect(): Promise<void> {
    await this.consumer.disconnect();
    this._isConnected = false;
    logger.info(`[Kafka-${this.clientId}] Consumer disconnected.`);
  }
}
