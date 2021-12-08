import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildEventSchema } from './build-event.schema';
import { BuilderService } from './builder.service';
import { ProductSchema } from './product.schema';
import { OrderSchema } from './order.schema';
import { CustomerSchema } from './customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'eventStore', schema: BuildEventSchema },
      { name: 'products', schema: ProductSchema },
      { name: 'orders', schema: OrderSchema },
      { name: 'customers', schema: CustomerSchema },
    ]),
  ],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
