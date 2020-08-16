import { Controller, Body, Post, Put, Param, Delete, Get, HttpCode } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ApiUnexpectedErrorResponse, CustomApiBadRequestResponse } from 'src/models/api-response';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { ServerDto } from './models/dtos/server.dto';
import { Server } from './models/schemas/server.schema';
import { MongoIdDto } from 'src/models/dtos/mongo-id.dto';

@ApiTags('Servers')
@ApiUnexpectedErrorResponse()
@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) {}
  
  @Post()
  @ApiOperation({ summary: 'Create server', description: 'Create a new Server.' })
  @ApiCreatedResponse({
    description: 'The server has been created',
    type: Server,
  })
  @CustomApiBadRequestResponse()
  createServer(@Body() serverDto: ServerDto): Promise<Server> {
    return this.serversService.createServer(serverDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update server', description: 'Update a existing Server.' })
  @ApiOkResponse({
    description: 'The server has been updated',
    type: Server,
  })
  @CustomApiBadRequestResponse()
  updateServer(@Param() mongoIdDto: MongoIdDto, @Body() serverDto: ServerDto): Promise<Server> {
    return this.serversService.updateServer(mongoIdDto.id, serverDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete server', description: 'Delete a existing Server.' })
  @ApiNoContentResponse({
    description: 'The server has been deleted'
  })
  @CustomApiBadRequestResponse()
  deleteServer(@Param() mongoIdDto: MongoIdDto): void {
    this.serversService.deleteServer(mongoIdDto.id);
  }

  @Get('/findbyname/:serverName')
  @ApiOperation({ summary: 'Get server by name', description: 'Get a Server by is name.' })
  @ApiOkResponse({
    description: 'The server has been found and returned',
    type: Server,
  })
  getServerByName(@Param() serverDto: ServerDto): Promise<Server> {
    return this.serversService.getServerByName(serverDto.serverName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get server by id', description: 'Get a Server by is id.' })
  @ApiOkResponse({
    description: 'The server has been found and returned',
    type: Server,
  })
  @CustomApiBadRequestResponse()
  getServerById(@Param() mongoIdDto: MongoIdDto): Promise<Server> {
    console.log('id');
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
