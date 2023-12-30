import { FtService } from '@backend/shared/ft.service';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('ft')
@UseGuards(XKeyGuard)
@ApiSecurity('x-api-key')
@ApiTags('FT')
export class FtController {
  constructor(private readonly ftService: FtService) {}

  @Get('oauth/token')
  @ApiOperation({summary: 'Request an access_token from 42API', description: 'if code param is existed, it will request as webflow type'})
  @ApiQuery({name: 'code', type: String, required: false})
  oauthToken(@Query() query: any) {
    return this.ftService.oauthToken(query.code);
  }

  @Get('oauth/token/info')
  @ApiOperation({summary: 'Get server-to-server token infomation'})
  @ApiQuery({name: 'access_token', type: String, required: true})
  oauthTokenInfo(@Query() query: any) {
    return this.ftService.oauthTokenInfo(query.access_token);
  }

  @Get('oauth/token/my')
  @ApiOperation({summary: 'Get Webflow token infomation'})
  @ApiQuery({name: 'access_token', type: String, required: true})
  oauthTokenMy(@Query() query: any) {
    return this.ftService.me(query.access_token);
  }
}
