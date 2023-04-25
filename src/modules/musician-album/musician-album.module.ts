import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicianAlbums } from './musician-album.entity';
import { MusicianAlbummController } from './musician-album.controller';
import { MusicianAlbumService } from './musician-album.service';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([MusicianAlbums]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategies
        }),
    ],
    controllers: [MusicianAlbummController],
    providers: [MusicianAlbumService]
})
export class MusicianAlbumModule { }
