import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class SuperHerosService {
  constructor(private readonly httpService: HttpService) {}

  async getSuperHeros(nameStartsWith: string) {
    const ts = Date.now();
    const privateKey = process.env.Marvel_PRIVATE_KEY;
    const publicKey = process.env.Marvel_PUBLIC_KEY;
    const digest = ts + privateKey + publicKey;

    const hash = createHash('md5').update(digest).digest('hex');

    const res = await this.httpService
      .get(
        `${process.env.MARVEL_BASE_URL}/v1/public/characters?nameStartsWith=${nameStartsWith}&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=20`,
      )
      .toPromise();

    const data = res.data.data.results;

    return data;
  }
}
