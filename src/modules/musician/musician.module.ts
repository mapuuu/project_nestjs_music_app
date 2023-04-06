import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicianRepository } from './musician.repository';
import { MusicianController } from './musician.controller';
import { MusicianService } from './musician.service';

@Module({
    imports: [TypeOrmModule.forFeature([MusicianRepository])],
    controllers: [MusicianController],
    providers: [MusicianService],
})
export class MusicianModule { }
