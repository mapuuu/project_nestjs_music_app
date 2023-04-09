import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicianRepository } from './musician.repository';
import { MusicianController } from './musician.controller';
import { MusicianService } from './musician.service';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([MusicianRepository]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategies
        }),
    ],
    controllers: [MusicianController],
    providers: [MusicianService],
})
export class MusicianModule { }
