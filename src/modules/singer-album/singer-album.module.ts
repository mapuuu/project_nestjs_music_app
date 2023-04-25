import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingerAlbums } from './singer-album.entity';
import { SingerAlbummController } from './singer-album.controller';
import { SingerAlbumService } from './singer-album.service';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([SingerAlbums]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategies
        }),
    ],
    controllers: [SingerAlbummController],
    providers: [SingerAlbumService]
})
export class SingerAlbumModule { }
