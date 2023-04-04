import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistRepository } from './playlist.repository';

@Module({
    imports: [TypeOrmModule.forFeature([PlaylistRepository])]
})
export class PlaylistModule { }
