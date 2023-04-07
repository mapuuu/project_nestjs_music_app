import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicianAlbums } from './musician-album.entity';
import { MusicianAlbummController } from './musician-album.controller';
import { MusicianAlbumService } from './musician-album.service';

@Module({
    imports: [TypeOrmModule.forFeature([MusicianAlbums])],
    controllers: [MusicianAlbummController],
    providers: [MusicianAlbumService]
})
export class MusicianAlbumModule { }
