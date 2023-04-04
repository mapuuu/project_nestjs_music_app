import { AbstractMusic } from "src/commons/classes/abstract-music";
import { SongLanguage } from "src/commons/enums/song-language.enum";
import { SongType } from "src/commons/enums/song-type.enum";
import { Column, Entity, ManyToOne, OneToMany, Unique } from "typeorm";
import { SingerAlbums } from "../singer-album/singer-album.entity";
import { Track } from "../track/track.entity";

@Entity('songs')
@Unique(['name', 'source'])
export class Song extends AbstractMusic {
    @Column({
        type: 'enum',
        enum: SongType,
        array: false
    })
    type: SongType;

    @Column({
        type: 'enum',
        enum: SongLanguage,
        array: false
    })
    language: SongLanguage;

    @ManyToOne(type => SingerAlbums, singerAlbums => singerAlbums.songs, {
        eager: false,
    })
    singerAlbums: SingerAlbums;

    @OneToMany(type => Track, track => track.playlists, {
        eager: true,
    })
    tracks: Track[];

    //Foreign Key
    @Column()
    singerAlbumId: number;
}