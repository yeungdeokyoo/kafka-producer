import { Controller, Get } from '@nestjs/common';
import { Client, ClientKafka, Transport } from "@nestjs/microservices";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'haea-kafka',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'grp-haea-kafka-consumer' // Should be the same thing we give in consumer
      }
    }
  })
  client: ClientKafka;

  async onModuleInit() {
    // Need to subscribe to topic 
    // so that we can get the response from kafka microservice
    this.client.subscribeToResponseOf('ecu-ota-vin-scheduling-topic');
    await this.client.connect();
  }

  @Get()
  getHello() {
    return this.client.send('ecu-ota-vin-scheduling-topic', 'VIN:KMTG74LE5KU008391;DATE:20210825 183545'); // args - topic, message
  }
} 
