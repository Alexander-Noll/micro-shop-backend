import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuilderModule } from './modules/builder/builder.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb+srv://Alex:1234@alexcluster.lfqa1.mongodb.net/Shop?retryWrites=true&w=majority",
 
    ),
    BuilderModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
