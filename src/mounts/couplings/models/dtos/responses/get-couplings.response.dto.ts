import { Coupling } from "../../schemas/coupling.schema";

export class GetCouplingsReponseDto {
  count: number;
  couplings: Coupling[];
}