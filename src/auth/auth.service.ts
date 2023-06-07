import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createPassword(
    token: string,
    data: { confirmationPassword: string; password: string },
  ) {
    const decoded = this.jwtService.decode(token) as { email: string };

    const user = await this.prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) return;

    await this.prisma.user.update({
      where: { id: user.id },
      data: { status: UserStatus.ACTIVE, password: data.password },
    });
  }

  async logIn(data: { email: string; password: string }) {
    const { password, email } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return;
    }

    if (user.status === UserStatus.NOT_COMPLETED) {
      return;
    }

    const isPasswordCorrect = user.password === password;

    if (!isPasswordCorrect) {
      return;
    }

    const accessToken = this.jwtService.sign(user, { expiresIn: '1m' });
    const refreshToken = this.jwtService.sign(user, { expiresIn: '1d' });

    await this.prisma.token.update({
      where: { userId: user.id },
      data: { refreshToken },
    });

    const tokens = { accessToken, refreshToken };

    return {
      user,
      tokens,
    };
  }

  async logOut() {
    return;
  }

  async refresh(refreshToken: string) {
    return refreshToken;
  }
}
