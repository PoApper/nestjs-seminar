export class User {
  id: string;
  password: string;
  name: string;
  age: number;
  type: UserType;
  
  constructor(id: string, pw: string, name: string, age: number, type: UserType) {
    this.id = id;
    this.password = pw;
    this.name = name;
    this.age = age;
    this.type = type;
  }
}

export enum UserType {
  admin = 'ADMIN',
  user = 'USER',
}