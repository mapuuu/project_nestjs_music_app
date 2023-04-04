import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicianRepository } from './musician.repository';
import { MusicianController } from './musician.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MusicianRepository])],
    controllers: [MusicianController]
})
export class MusicianModule { }
