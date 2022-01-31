import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false }) // { versionKey: false } to remove the _v field
export class Order {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  adress: string;

  @Prop({ required: true })
  state: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
