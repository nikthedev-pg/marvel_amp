import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async signup(body: User) {
    const { password, mobileNumber } = body;

    const users = await this.find(mobileNumber);

    if (users.length) {
      throw new BadRequestException('User already exit');
    }

    const salt = randomBytes(5).toString('hex');
    const hash = (await scrypt(password, salt, 31)) as Buffer;

    const storePassword = salt + '.' + hash.toString('hex');

    const user = await this.create({ ...body, password: storePassword });

    return user;
  }

  async login(phone: number, password: string) {
    const users = await this.find(phone);

    if (!users.length) {
      throw new BadRequestException('Invalid Credentials!');
    }

    const [salt, hashedValue] = users[0].password.split('.');

    const currentHash = (await scrypt(password, salt, 31)) as Buffer;

    if (hashedValue !== currentHash.toString('hex')) {
      throw new UnauthorizedException('Incorrect Credentials !');
    }

    return users[0];
  }

  find(mobileNumber: number) {
    return this.repo.find({ where: { mobileNumber } });
  }

  create(user: User) {
    const createdUser = this.repo.create(user);

    return this.repo.save(createdUser);
  }
}
