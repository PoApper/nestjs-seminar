import { Injectable } from '@nestjs/common';
import { User, UserType } from './user';

@Injectable()
export class UserService {
  private readonly users = Array<User>();
  
  constructor() {
    this.users.push(new User('admin1', 'root', 'name1', 21, UserType.admin));
    this.users.push(new User('user1', 'password', 'name2', 22, UserType.user));
    this.users.push(new User('user2', 'password', 'name3', 23, UserType.user));
  }

  async findOneById(id: string) {
    return this.users.find(user => user.id === id);
  }
}
