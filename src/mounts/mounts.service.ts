import { Injectable } from '@nestjs/common';

@Injectable()
export class MountsService {
  createMount(): void {
    //Check if mountType in list of user mountTypes (in account-settings) 
    //Check if color match (same mountType and colorName exist)
    //Create mount
  }
}
