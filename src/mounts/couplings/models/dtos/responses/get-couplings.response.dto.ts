import { Coupling } from "../../schemas/coupling.schema";

export class GetCouplingsReponseDto {
  count: number;
  mounts: Coupling[];
}