import { Mount } from '../../schemas/mount.schema';

export class GetMountsResponseDto {
  totalCount: number;
  mounts: Mount[];
}
