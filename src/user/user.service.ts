import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async getAll() {
    return this.prisma.user.findMany();
  }

  async create(data: Prisma.UserCreateInput) {
    const { email } = data;
    const candidate = await this.prisma.user.findUnique({ where: { email } });

    // handle error
    if (candidate) return;

    const token = await this.jwtService.sign({ email }, { expiresIn: '1h' });

    const link = `${process.env.CLIENT_URL}/create-password/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: `Account activation on ${process.env.CLIENT_URL}`,
      text: '',
      html: `
          <div>
            <h1>Follow the link to activate your account and set a password</h1>
            <a href="${link}">${link}</a>
          </div>
        `,
    });

    const user = await this.prisma.user.create({
      data: { ...data, token: { create: {} } },
    });

    return user;
  }

  async getById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: Number(userId) } });
  }

  async delete(userId: string) {
    return this.prisma.user.delete({ where: { id: Number(userId) } });
  }
}
