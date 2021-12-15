import { Injectable } from '@nestjs/common';
import { BuildEvent } from './modules/builder/build-event.schema';
import { BuilderService } from './modules/builder/builder.service';

@Injectable()
export class AppService {
  constructor(private readonly modelBuilderService: BuilderService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getQuerry(key: string): Promise<any> {
    if (key === 'customers') {
      return await this.modelBuilderService.getCustomers();
    }
    return {
      error: `MicroShop backend does not know how to handle query key: ${key}`,
    };
  }

  async getReset() {
    await this.modelBuilderService.reset();
    return 'the shop database is clear';
  }
  async handleEvent(event: BuildEvent) {
    if (event.eventType === 'productStored') {
      return await this.modelBuilderService.handleProductStored(event);
    } else if (event.eventType === 'addOffer') {
      return await this.modelBuilderService.handleAddOffer(event);
    } else if (
      event.eventType === 'placeOrder' || event.eventType === 'orderPicked') {
      return await this.modelBuilderService.handlePlaceOrder(event);
    }

    return {
      error: `MicroShop backend does not know how to handle: ${event.eventType}`,
    };
  }
}
