import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicRepository } from './music.repository';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { FavoriteModule } from '../favorite/favorite.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([MusicRepository]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategies
        }),
        FavoriteModule,
    ],
    controllers: [MusicController],
    providers: [MusicService]
})
export class MusicModule { }
