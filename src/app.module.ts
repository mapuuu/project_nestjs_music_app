import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { MusicModule } from './modules/music/music.module';
import { MusicianModule } from './modules/musician/musician.module';
import { MusicianAlbumModule } from './modules/musician-album/musician-album.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { SingerModule } from './modules/singer/singer.module';
import { SingerAlbumModule } from './modules/singer-album/singer-album.module';
import { SongModule } from './modules/song/song.module';
import { TrackModule } from './modules/track/track.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.db as TypeOrmModuleOptions),
    // ConfigModule.forRoot({
    //   validationSchema: Joi.object({
    //     POSTGRES_HOST: Joi.string().required(),
    //     POSTGRES_PORT: Joi.number().required(),
    //     POSTGRES_USER: Joi.string().required(),
    //     POSTGRES_PASSWORD: Joi.string().required(),
    //     POSTGRES_DB: Joi.string().required(),
    //     // PORT: Joi.number(),
    //   }),
    // }),
    AuthModule,
    ProfileModule,
    FavoriteModule,
    MusicModule,
    MusicianModule,
    MusicianAlbumModule,
    NotificationModule,
    PlaylistModule,
    SingerModule,
    SingerAlbumModule,
    SongModule,
    TrackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
