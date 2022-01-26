import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildEventSchema } from './build-event.schema';
import { BuilderService } from './builder.service';
import { ProductSchema } from './product.schema';
import { OrderSchema } from './order.schema';
import { CustomerSchema } from './customer.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'eventStore', schema: BuildEventSchema },
      { name: 'products', schema: ProductSchema },
      { name: 'orders', schema: OrderSchema },
      { name: 'customers', schema: CustomerSchema },
    ]),HttpModule
  ],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
