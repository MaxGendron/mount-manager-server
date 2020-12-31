import { Coupling } from '../../schemas/coupling.schema';

export class GetCouplingsResponseDto {
  totalCount: number;
  couplings: Coupling[];
}
