import { Module } from '@nestjs/common';
import { MountsController } from './mounts.controller';
import { MountsService } from './mounts.service';

@Module({
  controllers: [MountsController],
  providers: [MountsService]
})
export class MountsModule {}
