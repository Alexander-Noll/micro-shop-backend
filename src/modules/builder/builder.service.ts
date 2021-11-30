import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildEvent } from './build-event.schema';
import { MSProduct } from './product.schema';

@Injectable()
export class BuilderService implements OnModuleInit {
  constructor(
    @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
    @InjectModel('products') private productsModel: Model<MSProduct>,
  ) {}
  async onModuleInit() {
    await this.reset();
  }

  async clear() {
    await this.productsModel.deleteMany();
    await this.buildEventModel.deleteMany();
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
  }

  async storeEvent(event: BuildEvent) {
    let previosEvent = await this.buildEventModel
      .findOne({ blockId: event.blockId })
      .exec();

    if (previosEvent == null) {
      previosEvent = await this.buildEventModel.create(event);
      console.log(
        'BuilderService.storeEvent create: \n' +
          JSON.stringify(previosEvent, null, 3),
      );
      return true;
    } else if (previosEvent.time < event.time) {
      previosEvent = await this.buildEventModel
        .findOneAndUpdate({ blockId: event.blockId }, event, { new: true })
        .exec();
      console.log(
        'BuilderService.storeEvent update: \n' +
          JSON.stringify(previosEvent, null, 3),
      );
      return true;
    }
    return false;
  }

  async storeProduct(product: any) {
    try {
      const newProduct = await this.productsModel
        .findOneAndUpdate(
          { product: product.product },
          {
            $inc: { amount: product.amount },
            $set: { amountTime: product.amountTime },
          },
          { upsert: true, new: true },
        )
        .exec();
      console.log(
        'BuilderService.storeProduct findOneAndUpdate: \n' +
          JSON.stringify(newProduct, null, 3),
      );
      return newProduct;
    } catch (error) {
      console.log(
        'Error in BUilderService.storeProduct: \n' +
          JSON.stringify(error, null, 3),
      );
    }
  }
  async handleProductStored(event: BuildEvent) {
    //start transaction
    const session = await this.buildEventModel.startSession();
    let newProduct = null;
    await session.withTransaction(async () => {
      //store a build event
      const storeSuccess = await this.storeEvent(event);

      if (storeSuccess) {
        //store a product pbject
        const productPatch = {
          product: event.blockId,
          amount: event.payload.amount,
          amountTime: event.payload.amountTime,
        };
        newProduct = await this.storeProduct(productPatch);
      } else {
        newProduct = await this.productsModel.findOne({
          product: event.blockId,
        });
      }
    });

    session.endSession();
    return newProduct;
  }
}
