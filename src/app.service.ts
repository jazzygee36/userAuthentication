import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './users/dto/update-user.dto';
import { CreateUserDto } from './users/dto/create-user.dto';

@Injectable()
export class AppService {
  private users = [
    {
      id: 1,
      username: 'Samson',
      password: 'samson',
    },
    {
      id: 2,
      username: 'yemsion',
      password: 'yemson',
    },
    {
      id: 3,
      username: 'shola',
      password: 'shola',
    },
    {
      id: 4,
      username: 'tunde',
      password: 'tunde',
    },
  ];

  create(createUserDto: CreateUserDto) {
    const userByHighestId = [...this.users].sort((a, b) => b.id - a.id);
    const newUser = {
      id: userByHighestId[0].id + 1,
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updateUserDto };
      }
      return user;
    });

    return this.findOne(id);
  }

  findAll() {
    return this.users;
  }
  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      return 'User id not found';
    }
    return user;
  }

  delete(id: number) {
    const removeUser = this.findOne(id);
    this.users = this.users.filter((user) => user.id === id);
    return removeUser;
  }
}
