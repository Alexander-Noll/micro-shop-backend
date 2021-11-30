import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildEventSchema } from './build-event.schema';
import { BuilderService } from './builder.service';
import { ProductSchema } from './product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'eventStore', schema: BuildEventSchema },
      { name: 'products', schema: ProductSchema },
    ]),
  ],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
