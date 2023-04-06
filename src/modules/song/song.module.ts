import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongRepository } from './song.repository';
import { SongController } from './song.controller';
import { SongService } from './song.service';

@Module({
    imports: [TypeOrmModule.forFeature([SongRepository])],
    controllers: [SongController],
    providers: [SongService]
})
export class SongModule { }
