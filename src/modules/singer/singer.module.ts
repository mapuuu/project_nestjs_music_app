import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingerRepository } from './singer.repository';
import { SingerController } from './singer.controller';
import { SingersService } from './singers.service';

@Module({
    imports: [TypeOrmModule.forFeature([SingerRepository])],
    controllers: [SingerController],
    providers: [SingersService],
})
export class SingerModule { }
