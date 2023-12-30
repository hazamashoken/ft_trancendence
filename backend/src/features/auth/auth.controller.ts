import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@UseGuards(XKeyGuard)
@ApiTags('Auth')
@ApiSecurity('x-api-key')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify')
  @ApiOperation({summary: 'verify access token is valid'})
  @ApiQuery({name: 'access_token', type: String, required: true})
  oauthToken(@Query() query: any) {
    if (!query.access_token) {
      throw new BadRequestException('access_token is required');
    }
    return this.authService.verify(query.access_token);
  }
}
