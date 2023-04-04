import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongRepository } from './song.repository';
import { SongController } from './song.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SongRepository])],
    controllers: [SongController]
})
export class SongModule { }
