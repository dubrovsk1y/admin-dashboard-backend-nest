import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-password/:token')
  async createPassword(
    @Param('token') token: string,
    @Body() data: { confirmationPassword: string; password: string },
  ) {
    return this.authService.createPassword(token, data);
  }

  @Post('log-in')
  async logIn(
    @Body() data: { email: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.logIn(data);

    res.cookie('refreshToken', user.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.send(user);
  }

  @Post('log-out')
  async logOut() {
    return this.authService.logOut();
  }

  @Post('refresh')
  async refresh() {
    const refreshToken = 'dsfsdf123j1h23j13b12j34';
    return this.authService.refresh(refreshToken);
  }
}
