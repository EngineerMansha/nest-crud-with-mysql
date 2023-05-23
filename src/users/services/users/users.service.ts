import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwt: JwtService,
  ) {}
  findUser() {
    return this.userRepository.find();
  }
  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    this.userRepository.save(newUser);
    return this.userRepository.save(newUser);
  }
  updateUserById(id: number, updateUserDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }
  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }
  async loginUser(email: any): Promise<User | undefined> {
    console.log('email', email);
    return this.userRepository.findOne({ where: { email } });
  }
  async findOne(id: any) {
    return this.userRepository.findOne({ where: { id } });
  }
}
