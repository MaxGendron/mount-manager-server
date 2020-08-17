import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ServerDto } from './models/dtos/server.dto';
import { Server } from './models/schemas/server.schema';
import { ThrowExceptionUtils } from 'src/utils/throw-exception.utils';

@Injectable()
export class ServersService {
  private readonly entityType = 'Server';

  constructor(@InjectModel(Server.name) private serverModel: Model<Server>) {}

  //Create a new server
  createServer(serverDto: ServerDto): Promise<Server> {
    const newServer = new this.serverModel(serverDto);
    return newServer.save();
  }

  //Update a existing server
  async updateServer(id: string, serverDto: ServerDto): Promise<Server> {
    const server = await this.serverModel
      .findByIdAndUpdate(id, serverDto, { new: true })
      .exec();
    if (!server) {
      ThrowExceptionUtils.notFoundException(this.entityType, id);
    }
    return server;
  }

  //Delete a existing server
  async deleteServer(id: string): Promise<void> {
    const server = await this.serverModel.findByIdAndRemove(id).exec();
    if (!server) {
      ThrowExceptionUtils.notFoundException(this.entityType, id);
    }
    return server;
  }

  //Get a server by is name
  getServerByName(serverName: string): Promise<Server> {
    return this.serverModel
      .findOne({ serverName: serverName })
      .exec();
  }

  //Get a server by is id
  async getServerById(id: string): Promise<Server> {
    const server = await this.serverModel.findById(id).exec();
    if (!server) {
      ThrowExceptionUtils.notFoundException(this.entityType, id);
    }
    return server;
  }

  //Get all the servers
  getServers(): Promise<Server[]> {
    return this.serverModel.find().exec();
  }
}
