import { AbstractMusic } from "src/commons/classes/abstract-music";
import { MusicType } from "src/commons/enums/music-type.enum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { MusicianAlbums } from "../musician-album/musician-album.entity";
import { Track } from "../track/track.entity";

@Entity('musics')
export class Music extends AbstractMusic {
    @Column({
        type: 'enum',
        enum: MusicType,
        array: false
    })
    type: MusicType;

    @ManyToOne(type => MusicianAlbums, musicianAlbums => musicianAlbums.musics, {
        eager: false,
    })
    musicianAlbums: MusicianAlbums;

    @OneToMany(type => Track, track => track.playlists, {
        eager: true,
    })
    tracks: Track[];

    // //Foreign Key
    // @Column()
    // musicianAlbumId: number;
}