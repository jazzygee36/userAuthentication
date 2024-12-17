import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    const findUser = await this.userModel.findById(id).exec();
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    return findUser;
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
    const findUser = await this.userModel.findById(id).exec();
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    // Update the fields
    Object.assign(findUser, updateData);

    // Save the updated user
    return await findUser.save();
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const findUser = await this.userModel.findById(id).exec();
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    await findUser.deleteOne(); // Deletes the found user
    return { message: 'User successfully deleted' };
  }
}
