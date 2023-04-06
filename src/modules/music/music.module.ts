import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicicRepository } from './music.repository';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';

@Module({
    imports: [TypeOrmModule.forFeature([MusicicRepository])],
    controllers: [MusicController],
    providers: [MusicService]
})
export class MusicModule { }
