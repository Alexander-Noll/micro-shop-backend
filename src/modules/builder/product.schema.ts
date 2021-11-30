import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class MSProduct {
  @Prop({ required: true })
  product: string;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Prop({ required: true })
  amount: number = 0;

  @Prop({ required: true })
  amountTime: string;

  price: string;
}

export const ProductSchema = SchemaFactory.createForClass(MSProduct);
