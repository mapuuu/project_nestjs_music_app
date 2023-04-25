import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingerRepository } from './singer.repository';
import { SingerController } from './singer.controller';
import { SingersService } from './singers.service';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([SingerRepository]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategies
        }),
    ],
    controllers: [SingerController],
    providers: [SingersService],
})
export class SingerModule { }
