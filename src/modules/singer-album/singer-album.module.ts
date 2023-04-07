import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingerAlbums } from './singer-album.entity';
import { SingerAlbummController } from './singer-album.controller';
import { SingerAlbumService } from './singer-album.service';

@Module({
    imports: [TypeOrmModule.forFeature([SingerAlbums])],
    controllers: [SingerAlbummController],
    providers: [SingerAlbumService]
})
export class SingerAlbumModule { }
