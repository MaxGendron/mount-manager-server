import {
  Controller,
  Body,
  Post,
  Put,
  Param,
  Delete,
  Get,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import {
  ApiUnexpectedErrorResponse,
  CustomApiBadRequestResponse,
  CustomApiNotFoundResponse,
} from 'src/models/api-response';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ServerDto } from './models/dtos/server.dto';
import { Server } from './models/schemas/server.schema';
import { MongoIdDto } from 'src/models/dtos/mongo-id.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { UserRoleEnum } from 'src/users/models/enum/user-role.enum';
import { Roles } from 'src/models/decorator/roles.decorator';

@ApiTags('Servers')
@ApiUnexpectedErrorResponse()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Roles(UserRoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({
    summary: 'Create server - Admin',
    description: 'Create a new server.',
  })
  @ApiCreatedResponse({
    description: 'The server has been created',
    type: Server,
  })
  @CustomApiBadRequestResponse(
    'Cannot Insert the requested item, duplicate key error on a attribute.',
  )
  createServer(@Body() serverDto: ServerDto): Promise<Server> {
    return this.serversService.createServer(serverDto);
  }

  @Roles(UserRoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Update server - Admin',
    description: 'Update a existing server.',
  })
  @ApiOkResponse({
    description: 'The server has been updated',
    type: Server,
  })
  @CustomApiBadRequestResponse()
  @CustomApiNotFoundResponse('No server setting found.')
  updateServer(
    @Param() mongoIdDto: MongoIdDto,
    @Body() serverDto: ServerDto,
  ): Promise<Server> {
    return this.serversService.updateServer(mongoIdDto.id, serverDto);
  }

  @Roles(UserRoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete server - Admin',
    description: 'Delete a existing server.',
  })
  @ApiNoContentResponse({
    description: 'The server has been deleted',
  })
  @CustomApiBadRequestResponse()
  @CustomApiNotFoundResponse('No server setting found.')
  async deleteServer(@Param() mongoIdDto: MongoIdDto): Promise<void> {
    await this.serversService.deleteServer(mongoIdDto.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get server by id',
    description: 'Get a server by is id.',
  })
  @ApiOkResponse({
    description: 'The server has been found and returned',
    type: Server,
  })
  @CustomApiBadRequestResponse()
  @CustomApiNotFoundResponse('No server setting found.')
  getServerById(@Param() mongoIdDto: MongoIdDto): Promise<Server> {
    return this.serversService.getServerById(mongoIdDto.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get servers', description: 'Get all the servers.' })
  @ApiOkResponse({
    description: 'The servers have been found and returned',
    type: Server,
  })
  getServers(): Promise<Server[]> {
    return this.serversService.getServers();
  }
}
