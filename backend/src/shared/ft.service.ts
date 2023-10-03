import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs';
import * as _ from 'lodash';
import { FtUser } from '@backend/interfaces/ft-user.interface';

@Injectable()
export class FtService {
  static readonly baseUrl = 'https://api.intra.42.fr';
  static readonly version = 'v2';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  oauthToken(code: string) {
    const uri = `${FtService.baseUrl}/oauth/token`;
    const body = {
      code,
      grant_type: code ? 'authorization_code' : 'client_credentials',
      redirect_uri: 'http://localhost',
      client_id: this.configService.get('42_CLIENT_ID'),
      client_secret: this.configService.get('42_SECRET_ID'),
    };
    return this.httpService.post(uri, body).pipe(
      map((res) => res.data),
      catchError((e) => {
        console.log(e);
        throw new HttpException(e.response.statusText, e.response.status);
      }),
    );
  }

  oauthTokenInfo(token: string) {
    const uri = `${FtService.baseUrl}/oauth/token/info`;
    return this.httpService
      .get(uri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((res) => res.data),
        catchError((e) => {
          console.error(e.response.data);
          throw new HttpException(e.response.statusText, e.response.status);
        }),
      );
  }

  me(token: string) {
    const uri = `${FtService.baseUrl}/${FtService.version}/me`;
    return this.httpService
      .get(uri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((res) => this.mapMeFields(res.data)),
        catchError((e) => {
          throw new HttpException(e.response.statusText, e.response.status);
        }),
      );
  }

  private mapMeFields(data: any): FtUser {
    const fields = [
      'id',
      'email',
      'login',
      'first_name',
      'last_name',
      'url',
      'displayName',
      'kind',
      'image',
      'titles',
    ];
    return _.pick(data, fields);
  }
}
