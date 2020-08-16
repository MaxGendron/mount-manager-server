import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ServerDto } from './models/dtos/server.dto';
import { Server } from './models/schemas/server.schema';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<Server>,
  ) {}

  //Create a mew server
  createServer(serverDto: ServerDto): Promise<Server> {
    const newServer = new this.serverModel(serverDto);
    return newServer.save();
  }

  //Update a existing server
  updateServer(id: string, serverDto: ServerDto): Promise<Server> {
    return this.serverModel.findByIdAndUpdate(id, serverDto, {new: true});
  }

  //Delete a existing server
  deleteServer(id: string): void {
    this.serverModel.findByIdAndRemove(id).exec();
  }

  //Get a server by is name
  getServerByName(serverName: string): Promise<Server> {
    return this.serverModel.findOne({ serverName: serverName }).exec();
  }

  //Get a server by is id
  getServerById(id: string): Promise<Server> {
    return this.serverModel.findById(id).exec();
  }

  //Get all the servers
  getServers(): Promise<Server[]> {
    return this.serverModel.find().exec();
  }
}
