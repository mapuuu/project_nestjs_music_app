import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongRepository } from './song.repository';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { FavoriteModule } from '../favorite/favorite.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { PlaylistModule } from '../playlist/playlist.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SongRepository]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategies
        }),
        FavoriteModule,
        PlaylistModule,
    ],
    controllers: [SongController],
    providers: [SongService]
})
export class SongModule { }
