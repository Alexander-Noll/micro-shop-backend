import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false }) // { versionKey: false } to remove the _v field
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  adress: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
