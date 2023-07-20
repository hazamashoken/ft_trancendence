import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    console.log('DB_USERNAME: ', this.configService.get('DB_USERNAME'));
    console.log('NESTJS_PORT: ', this.configService.get('NESTJS_PORT'));
    return this.appService.getHello();
  }
}
