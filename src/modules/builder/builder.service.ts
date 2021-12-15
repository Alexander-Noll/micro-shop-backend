import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildEvent } from './build-event.schema';
import { Customer } from './customer.schema';
import { Order } from './order.schema';
import { MSProduct } from './product.schema';

@Injectable()
export class BuilderService implements OnModuleInit {
  constructor(
    @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
    @InjectModel('products') private productsModel: Model<MSProduct>,
    @InjectModel('orders') private ordersModel: Model<Order>,
    @InjectModel('customers') private customersModel: Model<Customer>,
  ) {}
  async onModuleInit() {
    await this.reset();
  }

  async clear() {
    // extended to clear all tables
    await this.productsModel.deleteMany();
    await this.buildEventModel.deleteMany();
    await this.ordersModel.deleteMany();
    await this.customersModel.deleteMany();
  }

  async getCustomers(): Promise<any> {
    return await this.customersModel.find({}).exec();
  }

  async reset() {
    await this.clear();
    await this.handleProductStored({
      blockId: 'rubber_boots',
      time: '11:00:00',
      eventType: 'ProductStored',
      tags: ['product', 'rubber_boots'],
      payload: {
        product: 'rubber_boots',
        amount: 23,
        location: 'entry_door',
      },
    });
    await this.handleProductStored({
      blockId: 'rubber_gloves',
      time: '12:00:00',
      eventType: 'ProductStored',
      tags: ['product', 'rubber_gloves'],
      payload: {
        product: 'rubber_gloves',
        amount: 12,
        location: 'back_door',
      },
    });
  }

  async storeEvent(event: BuildEvent) {
    // ensure at least a placeholder
    const placeholder = await this.buildEventModel
      .findOneAndUpdate(
        { blockId: event.blockId },
        { blockId: event.blockId, $setOnInsert: { time: '' } },
        { upsert: true, new: true },
      )
      .exec();

    console.log(
      'builder service storeEvent placeholder: \n' +
        JSON.stringify(placeholder, null, 3),
    );

    const newEvent = await this.buildEventModel
      .findOneAndUpdate(
        { blockId: event.blockId, time: { $lt: event.time } },
        {
          tags: event.tags,
          time: event.time,
          eventType: event.eventType,
          payload: event.payload,
        },
        { new: true },
      )
      .exec();

    console.log(
      'builder service storeEvent newEvent: \n' +
        JSON.stringify(newEvent, null, 3),
    );

    return newEvent != null;
  }

  async storeProduct(newProductData: any) {
    try {
      const newProduct = await this.productsModel
        .findOneAndUpdate(
          { product: newProductData.product },
           newProductData,
          {upsert: true,new: true,}
          ).exec();
      console.log(
        'BuilderService.storeProduct storeProduct: \n' +
          JSON.stringify(newProduct, null, 3),
      );
      return newProduct;
    } catch (error) {
      console.log(
        'Error in BuilderService.storeProduct: \n' +
          JSON.stringify(error, null, 3),
      );
    }
  }
  async handleProductStored(event: BuildEvent) {
    // store a build event
    const storeSuccess = await this.storeEvent(event);
    let newProduct = null;

    if (storeSuccess) {
      //store a product object
      const newAmount = await this.computeNewProductAmount(event.blockId);
      const productPatch = {
        product: event.blockId,
        amount: newAmount,
        amountTime: event.time,
      };
      newProduct = await this.storeProduct(productPatch);
    } else {
      newProduct = await this.productsModel.findOne({
        product: event.blockId,
      });
    }
    return newProduct;
  }

  async handleAddOffer(event: BuildEvent) {
    // store a build event
    const storeSuccess = await this.storeEvent(event);
    let newProduct = null;
    if (storeSuccess) {
      //store a product object
      const productPatch = {
        product: event.payload.product,
        price: event.payload.price,
      };
      console.log(
        'BilderService.handleAddOffer storeSuccess: \n' +
          JSON.stringify(productPatch, null, 3),
      );
      try {
        newProduct = await this.productsModel
          .findOneAndUpdate({ product: productPatch.product }, productPatch, {
            upsert: true,
            new: true,
          })
          .exec();
        console.log(
          'BilderService.handleAddOffer ProductUpdated: \n' +
            JSON.stringify(newProduct, null, 3),
        );
        return newProduct;
      } catch (error) {
        console.log(
          'Error in BilderService.handleAddOffer \n' +
            JSON.stringify(error, null, 3),
        );
      }
    }
  }

  async handlePlaceOrder(event: BuildEvent) {
    // store a build event
    const storeSuccess = await this.storeEvent(event);
    if (storeSuccess) {
      // sotre an order object
      try {
        const newOrder = await this.ordersModel
          .findOneAndUpdate(
            {
              code: event.payload.code,
            },
            event.payload,
            { upsert: true, new: true },
          )
          .exec();

        // and upsert customer
        const newCustomer = await this.customersModel
          .findOneAndUpdate(
            {
              name: event.payload.customer,
            },
            {
              name: event.payload.customer,
              lastAddress: event.payload.address,
            },
            { upsert: true, new: true },
          )
          .exec();

        const newAmount = await this.computeNewProductAmount(
          event.payload.product,
        );
        await this.productsModel.findOneAndUpdate(
          { product: event.payload.product },
          { amount: newAmount },
        );

        return newOrder;
      } catch (error) {
        console.log(
          'Error in BilderService.handlePlaceOrder \n' +
            JSON.stringify(error, null, 3),
        );
      }
    }
  }

  async computeNewProductAmount(productName) {
    // last productStored amount
    const lastStoreEvent = await this.buildEventModel
      .findOne({ blockId: productName })
      .exec();
    const lastAmount = lastStoreEvent.payload.amount;

    //minus new orders
    const newOrdersList: any[] = await this.buildEventModel
      .find({
        eventType: 'placeOrder',
        'payload.product': productName,
      })
      .exec();

    return lastAmount;
  }
}
