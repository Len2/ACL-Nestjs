/* eslint-disable @typescript-eslint/ban-types */
import { TokenPayload } from './interfaces/TokenPayload';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JWTProvider } from './Providers/JWTProvider';

@Injectable()
export class AuthServiceGeneral {
  private provider: any;

  public constructor() {
    this.setProvider('jwt');
  }

  public setProvider(provider: string): this {
    switch (provider) {
      case 'jwt':
        this.provider = new JWTProvider();

      default:
        break;
    }

    return this;
  }

  public sign(payload: any, dataReturn: any): any {
    return this.provider.sign(payload, dataReturn);
  }

  public signTokenForEvent(payload: any, dataReturn: any): any {
    return this.provider.signTokenForEvent(payload, dataReturn);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public signForForgotPassword(
    payload: object,
    dataToReturn: object,
  ): TokenPayload {
    return this.provider.signTokenForEmail(payload, dataToReturn);
  }

  public verifyToken(token: string) {
    return this.provider.verifyToken(token);
  }

  public async getDesiredDataFromToken(token, field) {
    try {
      const decodedToken = await this.verifyToken(token);

      if (typeof decodedToken != 'object') {
        throw new BadRequestException();
      }

      return decodedToken[field];
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Set password token expired');
      }
      throw new BadRequestException('Bad Set password token');
    }
  }
}
