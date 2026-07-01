import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WordBookModule } from './word-book/word-book.module';
import { SharedModule } from '@libs/shared';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [UserModule, WordBookModule, SharedModule, AuthModule, CourseModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
