import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicRepository } from './music.repository';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';

@Module({
    imports: [TypeOrmModule.forFeature([MusicRepository])],
    controllers: [MusicController],
    providers: [MusicService]
})
export class MusicModule { }
