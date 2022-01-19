import {IsNotEmpty,IsNumber, IsPositive,IsString} from "class-validator"

export class SetPriceDto{
    @IsNotEmpty()
    @IsString()
    product: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;
}