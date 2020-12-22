import { Coupling } from "../../schemas/coupling.schema";

export class GetCouplingsReponseDto {
  totalCount: number;
  couplings: Coupling[];
}