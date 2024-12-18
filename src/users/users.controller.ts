import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  create(
    @Body(ValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get('/verify-email')
  async verifyEmail(@Query('token') token: string): Promise<string> {
    return this.usersService.verifyEmail(token);
  }

  @Post('/login')
  loginUser(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('/all-users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
