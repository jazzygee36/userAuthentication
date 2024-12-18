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
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

import { v4 as uuidv4 } from 'uuid'; // To generate a unique verification token
import { EmailService } from './email-service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    // Generate a unique verification token
    const verificationToken = uuidv4();

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashPassword,
      isVerified: false, // Initially the user is not verified
      verificationToken: verificationToken,
    });

    await createdUser.save();

    // Send the verification email
    const verificationLink = `http://your-frontend-url/verify-email?token=${verificationToken}`;
    await this.emailService.sendVerificationEmail(
      createUserDto.email,
      verificationLink,
    );

    return createdUser;
  }

  async verifyEmail(token: string): Promise<string> {
    const user = await this.userModel.findOne({ verificationToken: token });

    if (!user) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    user.isVerified = true;
    await user.save();

    return 'Email successfully verified!';
  }
  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const comparePwd = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!comparePwd) {
      throw new NotFoundException('Password not correct');
    }
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { message: 'Login successfully', token };
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
