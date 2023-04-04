import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicianAlbums } from './musician-album.entity';
import { MusicianAlbummController } from './musician-album.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MusicianAlbums])],
    controllers: [MusicianAlbummController]
})
export class MusicianAlbumModule { }
