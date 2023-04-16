import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Favorite]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategies
        }),
    ],
    controllers: [FavoriteController],
    providers: [FavoriteService],
    exports: [FavoriteService],
})
export class FavoriteModule { }
