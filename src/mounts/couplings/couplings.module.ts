import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MountsModule } from '../mounts.module';
import { CouplingsController } from './couplings.controller';
import { CouplingsService } from './couplings.service';
import { Coupling, CouplingSchema } from './models/schemas/coupling.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Coupling.name, schema: CouplingSchema }]), MountsModule],
  controllers: [CouplingsController],
  providers: [CouplingsService],
})
export class CouplingsModule {}
