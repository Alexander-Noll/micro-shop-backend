import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuilderModule } from './modules/builder/builder.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://pascal:ptE0t5Tr2qaOagnd@microservicescluster.wos3s.mongodb.net/pascal-shop?retryWrites=true&w=majority',
    ),
    BuilderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
