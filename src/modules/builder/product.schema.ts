import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false }) // { versionKey: false } to remove the _v field
export class MSProduct {
  @Prop({ required: true })
  product: string;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Prop({ required: true })
  amount: number = 0;

  @Prop({ required: true })
  amountTime: string;

  @Prop()
  price: string;
}

export const ProductSchema = SchemaFactory.createForClass(MSProduct);
