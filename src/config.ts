import { User } from "./modules/auth/entities/user.entity";
import { Favorite } from "./modules/favorite/favorite.entity";
import { Music } from "./modules/music/music.entity";
import { MusicianAlbums } from "./modules/musician-album/musician-album.entity";
import { Musician } from "./modules/musician/musician.entity";
import { Playlist } from "./modules/playlist/playlist.entity";
import { Profile } from "./modules/profile/profile.entity";
import { SingerAlbums } from "./modules/singer-album/singer-album.entity";
import { Singer } from "./modules/singer/singer.entity";
import { Song } from "./modules/song/song.entity";
import { Track } from "./modules/track/track.entity";
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  db: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'project_nestjs_music_app',
    username: 'postgres',
    password: 'root',
    entities: [
      User,
      Profile,
      Singer,
      Musician,
      MusicianAlbums,
      SingerAlbums,
      Music,
      Song,
      Favorite,
      Playlist,
      Track,
    ],
    synchronize: true,
    autoLoadEntities: true,
  },

  frontEndKeys: {
    url: 'localhost',
    port: 4200,
    endpoints: ['auth/reset-password', 'auth/verify-email'],
  },
}