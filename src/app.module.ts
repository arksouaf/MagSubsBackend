import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // If you're using @nestjs/config
import { Subscription } from './subscription.entity';
import { Magazine } from './magazine.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql8003.site4now.net',
      port: 3306,
      username: 'a92383_magsubs',
      password: 'abd123456',
      database: 'db_a92383_magsubs',
      entities: [Magazine,Subscription],
      synchronize: true,
    }), // If you're using @nestjs/config
    // Other modules and providers...
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
