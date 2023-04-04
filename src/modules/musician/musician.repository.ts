import { EntityRepository, Repository } from "typeorm";
import { ArtistType } from "src/commons/enums/artist-type.enum";
import { Gender } from "src/commons/enums/gender.enum";
import { Musician } from "./musician.entity";

@EntityRepository(Musician)
export class MusicianRepository extends Repository<Musician> {
    async getLimitedMusicians(limit: number): Promise<Musician[]> {
        const query = this.createQueryBuilder('musician').select();
        if (limit) {
            query.limit(limit);
        }
        const musicians = await query.leftJoinAndSelect('musician.musicianAlbums', 'musician-albums').getMany();
        return musicians;
    }

    async getFilteredMusicians(limit: number, nationality: string, type: ArtistType, gender: Gender): Promise<Musician[]> {
        const query = this.createQueryBuilder('musician').select();
        if (limit) {
            query.limit(limit);
        }
        if (nationality) {
            query.where('musician.nationality LIKE: nationality', { nationality });
        }
        if (type) {
            query.andWhere('musician.type LIKE: type', { type });
        }
        if (gender) {
            query.andWhere('musician.gender LIKE: gender', { gender });
        }
        const musicians = await query.leftJoinAndSelect('musician.musicianAlbums', 'musician-album').getMany();
        return musicians;
    }
}    