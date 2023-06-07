import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userServise: UserService) {}

  @Get()
  async getAll() {
    return this.userServise.getAll();
  }

  @Post()
  async create(@Body() data: Prisma.UserCreateInput) {
    return this.userServise.create(data);
  }

  @Get(':userId')
  async getById(@Param('userId') userId: string) {
    return this.userServise.getById(userId);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: string) {
    return this.userServise.delete(userId);
  }
}
