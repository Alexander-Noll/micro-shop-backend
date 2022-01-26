import {IsNotEmpty,IsString} from "class-validator"

export class PlaceOrderDto{
    @IsNotEmpty()
    @IsString()
    order: string;

    @IsNotEmpty()
    @IsString()
    product: string;

    @IsNotEmpty()
    @IsString()
    customer: string;

    @IsNotEmpty()
    @IsString()
    address: string;
}