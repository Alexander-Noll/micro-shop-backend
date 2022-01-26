import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import Subscription from './modules/builder/subscription';
import { AppService } from './app.service';
import { PlaceOrderDto } from './common/PlaceOrderDto';
import { SetPriceDto } from './common/SetPriceDto';
import { BuildEvent } from './modules/builder/build-event.schema';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    private readonly appService: AppService,
  ) {}

  publishers: any[]=[]

  onModuleInit() {
    // subscribe at warehouse
    this.subscribeAtWarehouse();
  }
  subscribeAtWarehouse() {
    if (this.publishers.length > 0) {
      return;
    }

    
    this.httpService
      .post('http://localhost:3000/subscribe', {
        subscriberUrl: 'http://localhost:3100/event',
        lastEventTime: '0',
      })
      .subscribe(
        async (response) => {
          this.publishers.push('http://localhost:3000');
          try {
            const eventList: any[] = response.data;
            console.log(
              `AppController onModuleInit subscribe list \n ${JSON.stringify(
                eventList,
                null,
                3,
              )}`,
            );
            for (const event of eventList) {
              await this.appService.handleEvent(event);
            }
          } catch (error) {
            console.log(
              `AppController onModuleInit subscribe handleEvent error \n ${JSON.stringify(
                error,
                null,
                3,
              )}`,
            );
          }
        },
        (error) => {
          console.log(
            `AppController onModuleInit error \n ${JSON.stringify(
              error,
              null,
              3,
            )}`,
          );
        },
      );
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('query/:key')
  async getQuerry(@Param('key') key: string): Promise<string> {
    const result: Promise<any> = await this.appService.getQuerry(key);
    return result;
  }

  @Get('reset')
  async getReset() {
    return await this.appService.getReset();
  }

  @Post('event')
  async postEvent(@Body() event: BuildEvent) {
    try {
      return await this.appService.handleEvent(event);
    } catch (error) {
      return error;
    }
  }

  @Post('cmd/setPrice')
  async postSetPrice(@Body() params: SetPriceDto) {
    try {
      const c = await this.appService.setPrice(params);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Post('cmd/placeOrder')
  async postPlaceOrder(@Body() params: PlaceOrderDto) {
    try {
      const c = await this.appService.placeOrder(params);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Post("subscribe")
  async postSubscribe(@Body() subscription: Subscription){
    try{
      console.log(`postSubscribe got subscription \n ${JSON.stringify(subscription,null,3)}`)
      const c = await this.appService.handleSubscription(subscription);
      this.subscribeAtWarehouse();
      return c;
    } catch (error){
      return error;
    }
  }
}
