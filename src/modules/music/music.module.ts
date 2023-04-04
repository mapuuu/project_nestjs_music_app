import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicicRepository } from './music.repository';
import { MusicController } from './music.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MusicicRepository])],
    controllers: [MusicController],
})
export class MusicModule { }
