const { Kafka } = require('kafkajs');

class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'nodejs-backend',
      brokers: ['194.62.251.112:9092'],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'nodejs-consumer-group' });
    this.isConnected = false;
  }

  async connect() {
    try {
      await this.consumer.connect();
      this.isConnected = true;
      console.log('Successfully connected to Kafka');
    } catch (error) {
      console.error('Error connecting to Kafka:', error);
      this.isConnected = false;
    }
  }

  async consume(topic, callback) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      await this.consumer.subscribe({ 
        topic, 
        fromBeginning: true 
      });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log('Raw message received:', message.value.toString());
          try {
            const value = JSON.parse(message.value.toString());
            console.log('Parsed message:', value);
            callback(value);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        },
      });

      console.log(`Successfully subscribed to topic: ${topic}`);
    } catch (error) {
      console.error('Error in consume method:', error);
    }
  }
}

module.exports = new KafkaService();