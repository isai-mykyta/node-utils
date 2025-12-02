export type KafkaProducerOptions = {
  clientId: string;
  brokers: string[];
}

export type KafkaConsumerOptions = {
  topics: string[];
  clientId: string;
  groupId: string;
  brokers: string[];
  readFromBeginning: boolean;
}
