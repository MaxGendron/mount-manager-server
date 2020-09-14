import { Module } from '@nestjs/common';
import { MountsColorController } from './mounts-colors.controller';
import { MountsColorService } from './mounts-colors.service';

@Module({
  controllers: [MountsColorController],
  providers: [MountsColorService]
})
export class MountsColorModule {}
