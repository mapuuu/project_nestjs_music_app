import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './track.entity';
import { Repository } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

@Controller('tracks')
@ApiTags('Tracks')
export class TrackController {

    constructor(@InjectRepository(Track) private trackRepository: Repository<Track>) {
    }

    @Get()
    async getTracks() {
        return await this.trackRepository.find();
    }
}
