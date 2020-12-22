import { GetCouplingsReponseDto } from './models/dtos/responses/get-couplings.response.dto';
import { SearchCouplingDto } from './models/dtos/search-coupling.dto';
import { CouplingsService } from './couplings.service';
import { Body, Controller, HttpCode, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Delete, Get, Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  ApiUnexpectedErrorResponse,
  CustomApiBadRequestResponse,
  CustomApiForbiddenResponse,
  CustomApiNotFoundResponse,
  CustomApiUnauthorizedResponse,
} from 'src/common/models/api-response';
import { Coupling } from './models/schemas/coupling.schema';
import { User } from 'src/common/models/decorator/user.decorator';
import { MongoIdDto } from 'src/common/models/dtos/mongo-id.dto';
import { CreateCouplingDto } from './models/dtos/create-coupling.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';

@ApiTags('Mounts')
@ApiUnexpectedErrorResponse()
@CustomApiUnauthorizedResponse()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mounts/couplings')
export class CouplingsController {
  constructor(private couplingsService: CouplingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create coupling',
    description: 'Create a new coupling.',
  })
  @ApiCreatedResponse({
    description: 'The coupling has been created',
    type: Coupling,
  })
  @CustomApiBadRequestResponse()
  @CustomApiNotFoundResponse('No mounts found for the given mountIds.')
  createCoupling(@Body() createCouplingDto: CreateCouplingDto, @User('_id') userId: string): Promise<Coupling> {
    return this.couplingsService.createCoupling(createCouplingDto, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete coupling',
    description: 'Delete a existing coupling.',
  })
  @ApiNoContentResponse({
    description: 'The coupling has been deleted',
  })
  @CustomApiBadRequestResponse()
  @CustomApiForbiddenResponse()
  @CustomApiNotFoundResponse('No coupling found.')
  async deleteCoupling(@Param() mongoIdDto: MongoIdDto, @User('_id') userId: string): Promise<void> {
    await this.couplingsService.deleteCoupling(mongoIdDto.id, userId);
  }

  @Get('find/user-id')
  @ApiOperation({
    summary: 'Get couplings for userId',
    description: 'Get all the couplings for the userId in the Auth Token. Filter if requested.',
  })
  @ApiOkResponse({
    description: 'The couplings have been returned',
    type: Coupling,
    isArray: true,
  })
  getCouplingsForUserId(
    @Query() searchCouplingDto: SearchCouplingDto,
    @User('_id') userId: string,
  ): Promise<GetCouplingsReponseDto> {
    return this.couplingsService.getCouplingsForUserId(searchCouplingDto, userId);
  }
}
