import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicRepository } from './music.repository';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { FavoriteModule } from '../favorite/favorite.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { PlaylistModule } from '../playlist/playlist.module';
import { TrackModule } from '../track/track.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([MusicRepository]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategies
        }),
        FavoriteModule,
        TrackModule,
        forwardRef(() => PlaylistModule),
    ],
    controllers: [MusicController],
    providers: [MusicService]
})
export class MusicModule { }
