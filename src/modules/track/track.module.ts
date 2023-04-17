import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './track.entity';
import { TrackService } from './track.service';

@Module({
    imports: [TypeOrmModule.forFeature([Track])],
    providers: [TrackService],
    exports: [TrackService]
})
export class TrackModule { }
