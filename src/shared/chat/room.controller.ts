import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { GetAuthenticatedUser } from "src/commons/decorators/get-authenticated-user.decorator";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";
import { UserAuthGuard } from "src/commons/guards/user-auth.guard";
import { User } from "src/modules/auth/entities/user.entity";
import { RoomDto } from "./dto/room.dto";
import { ChatService } from "./chat.service";

@UseGuards(AuthGuard(), UserAuthGuard)
@Roles([Role.USER])
@Controller('rooms')
@ApiTags("Rooms")
export class RoomController {

    constructor(private chatService: ChatService) {
    }

    @Get()
    getAllRooms() {
        return this.chatService.getAllRooms();
    }

    @Get(':id')
    getRoomById(@Param('id', ParseIntPipe) id: number) {
        return this.chatService.getRoomById(id);
    }

    @Get('user-rooms')
    getUserRooms(@GetAuthenticatedUser() user: User) {
        return this.chatService.getUserRooms(user);
    }

    @Post()
    createNewRoom(
        @GetAuthenticatedUser() user: User,
        @Body() createRoomDto: RoomDto
    ) {
        return this.chatService.createNewRoom(user, createRoomDto);
    }

    @Put(':id/edit-room')
    updateRoom(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRoomDto: RoomDto
    ) {
        return this.chatService.updateRoom(id, updateRoomDto);
    }

    @Delete(':id/delete-room')
    deleteRoom(@Param('id', ParseIntPipe) id: number) {
        return this.chatService.deleteRoom(id);
    }
}
