import { Injectable } from '@nestjs/common';
import Subscription from './modules/builder/subscription';
import { PlaceOrderDto } from './common/PlaceOrderDto';
import { SetPriceDto } from './common/SetPriceDto';
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
    } else if (key === 'products') {
      return await this.modelBuilderService.getProducts();
    } else if (key.startsWith('product-')) {
      const name = key.substring('product-'.length);
      return await this.modelBuilderService.getProduct(name);
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
      event.eventType === 'placeOrder' ||
      event.eventType === 'orderPicked'
    ) {
      return await this.modelBuilderService.handlePlaceOrder(event);
    }

    return {
      error: `MicroShop backend does not know how to handle: ${event.eventType}`,
    };
  }

  async setPrice(params: SetPriceDto) {
    await this.modelBuilderService.setPrice(params);
    return 200;
  }

  async placeOrder(params: PlaceOrderDto) {
    await this.modelBuilderService.placeOrder(params);
    return 200;
  }

  async handleSubscription(subscription: Subscription) {
    return await this.modelBuilderService.handleSubscription(subscription);
  }
}
