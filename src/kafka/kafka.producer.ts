import { Kafka, Producer } from "kafkajs";

import { logger } from "../logger";
import { KafkaProducerOptions } from "./types";

export class KafkaProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly clientId: string;
  
  private _isConnected: boolean = false;

  constructor (options: KafkaProducerOptions) {
    this.kafka = new Kafka({ 
      clientId: options.clientId, 
      brokers: options.brokers
    });

    this.clientId = options.clientId;
    this.producer = this.kafka.producer();
  }

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public async connect(): Promise<void> {
    await this.producer.connect();
    this._isConnected = true;
    logger.info(`[Kafka-${this.clientId}]: Producer connected.`);
  }

  public async disconnect(): Promise<void> {
    await this.producer.disconnect();
    this._isConnected = false;
    logger.info(`[Kafka-${this.clientId}]: Producer disconnected.`);
  }

  public async publish(topic: string, message: string, key?: string, headers?: Record<string, string>): Promise<void> {
    if (!this._isConnected) {
      throw new Error(`[Kafka-${this.clientId}]: Failed to publish message. Kafka client is not connected.`);
    }

    await this.producer.send({
      topic,
      messages: [{ key, value: message, headers }]
    });
  }
}
