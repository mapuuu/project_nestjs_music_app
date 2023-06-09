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
import { NodemailerModule, NodemailerDrivers, NodemailerOptions } from '@crowdlinker/nestjs-mailer';
import { ChatModule } from './shared/chat/chat.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(config.db as TypeOrmModuleOptions),
    MulterModule.register({
      dest: '../uploads'
    }),
    NodemailerModule.forRoot(
      {
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'phutoannguyen2271@gmail.com',
            pass: process.env.PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      } as NodemailerOptions<NodemailerDrivers.SMTP>),
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
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
