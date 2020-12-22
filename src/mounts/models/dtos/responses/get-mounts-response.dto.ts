import { Mount } from "../../schemas/mount.schema";

export class GetMountsResponseDto {
  count: number;
  mounts: Mount[]
}