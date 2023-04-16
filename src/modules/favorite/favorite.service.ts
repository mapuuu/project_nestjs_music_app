import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favorite } from "./favorite.entity";
import { Repository } from "typeorm";
import { Profile } from "../profile/profile.entity";

@Injectable()
export class FavoriteService {
    constructor(
        @InjectRepository(Favorite) private readonly favoriteRepository: Repository<Favorite>) {
    }

    async getUserFavoriteList(id: number, profile?: Profile): Promise<Favorite> {
        let favoriteList = null;
        if (id) {
            favoriteList = await this.favoriteRepository.findOne({
                where: {
                    id,
                },
            });
        } else if (profile) {
            favoriteList = await this.favoriteRepository.findOne({ profile });
        } else {
            throw new NotFoundException('Favorite list does not found');
        }
        return favoriteList;
    }


}
