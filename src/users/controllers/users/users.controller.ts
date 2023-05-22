import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  Delete,
  Post,
  Put,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
// import { ApiResponse } from '@nestjs/swagger';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private userServices: UsersService) {}
  @Get()
  getUsers() {
    return this.userServices.findUser();
  }
  @Post('create')
  // @ApiResponse({
  //   status: 201,
  //   description: 'The record has been successfully created.',
  // })
  // @ApiCreatedResponse({
  //   description: 'The record has been successfully created.',
  // })
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    this.userServices.createUser(createUserDto);
    return { data: createUserDto };
  }
  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    await this.userServices.updateUserById(id, UpdateUserDto);
  }
  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.userServices.deleteUser(id);
  }
}
