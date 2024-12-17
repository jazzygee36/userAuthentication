import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://jazzygee36:nQEko3gl2OeiXbuH@cluster0.5z6co.mongodb.net/',
    ),
    UsersModule,
  ],
  // imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// nQEko3gl2OeiXbuH
// jazzygee36
// (102.88.109.190)
