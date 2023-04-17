import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { FavoriteService } from "./favorite.service";
import { AuthGuard } from "@nestjs/passport";
import { UserAuthGuard } from "src/commons/guards/user-auth.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";
import { ApiTags } from "@nestjs/swagger";

@UseGuards(AuthGuard(), UserAuthGuard)
@Roles([Role.USER])
@Controller('favorite-lists')
@ApiTags("Favorite-lists")
export class FavoriteController {

    constructor(private favoriteListService: FavoriteService) {
    }

    @Get(':id')
    getUserFavoriteList(@Param('id', ParseIntPipe) id: number) {
        return this.favoriteListService.getUserFavoriteList(id);
    }

    @Delete(':id/clear-favorite-list')
    clearFavoriteList(@Param('id', ParseIntPipe) id: number) {
        return this.favoriteListService.clearFavoriteListContent(id);
    }

    @Delete(':favoriteId/remove-track-from-favorite-list/:trackId')
    removeTrackFromFavoriteList(
        @Param('favoriteId', ParseIntPipe) favoriteId: number,
        @Param('trackId', ParseIntPipe) trackId: number
    ) {
        return this.favoriteListService.removeTrackFromFavouriteList(favoriteId, trackId);
    }
}