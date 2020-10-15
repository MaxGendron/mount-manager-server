import { Body, Controller, HttpCode, Param, Query, UseGuards } from '@nestjs/common';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiUnexpectedErrorResponse,
  CustomApiBadRequestResponse,
  CustomApiForbiddenResponse,
  CustomApiNotFoundResponse,
  CustomApiUnauthorizedResponse,
} from 'src/common/models/api-response';
import { User } from 'src/common/models/decorator/user.decorator';
import { MongoIdDto } from 'src/common/models/dtos/mongo-id.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { CreateMountDto } from './models/dtos/create-mount.dto';
import { MountGenderCountResponseDto } from './models/dtos/responses/mount-gender-count.response.dto';
import { SearchMountDto } from './models/dtos/search-mount.dto';
import { UpdateMountDto } from './models/dtos/update-mount.dto';
import { Mount } from './models/schemas/mount.schema';
import { MountsService } from './mounts.service';

@ApiTags('Mounts')
@ApiUnexpectedErrorResponse()
@CustomApiUnauthorizedResponse()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mounts')
export class MountsController {
  constructor(private mountsService: MountsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create mount',
    description: 'Create a new mount.',
  })
  @ApiCreatedResponse({
    description: 'The mount has been created',
    type: Mount,
  })
  @CustomApiBadRequestResponse()
  @CustomApiNotFoundResponse('No mount color found for the colorId.')
  createMount(@Body() createMountDto: CreateMountDto, @User('_id') userId: string): Promise<Mount> {
    return this.mountsService.createMount(createMountDto, userId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update mount',
    description: 'Update a existing mount. - Partial Update',
  })
  @ApiOkResponse({
    description: 'The mount has been updated',
    type: Mount,
  })
  @CustomApiBadRequestResponse()
  @CustomApiForbiddenResponse()
  @CustomApiNotFoundResponse('No mount found. / No mount color found for the colorId.')
  updateMount(
    @Body() updateMountDto: UpdateMountDto,
    @Param() mongoIdDto: MongoIdDto,
    @User('_id') userId: string,
  ): Promise<Mount> {
    return this.mountsService.updateMount(updateMountDto, mongoIdDto.id, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete mount',
    description: 'Delete a existing mount.',
  })
  @ApiNoContentResponse({
    description: 'The mount has been deleted',
  })
  @CustomApiBadRequestResponse()
  @CustomApiForbiddenResponse()
  @CustomApiNotFoundResponse('No mount found.')
  async deleteMount(@Param() mongoIdDto: MongoIdDto, @User('_id') userId: string): Promise<void> {
    await this.mountsService.deleteMount(mongoIdDto.id, userId);
  }

  @Get('find/user-id')
  @ApiOperation({
    summary: 'Get mounts for userId',
    description: 'Get all the mounts for the userId in the Auth Token. Can sort & filter if needed.',
  })
  @ApiOkResponse({
    description: 'The mounts have been returned',
    type: Mount,
    isArray: true,
  })
  getMountsForUserId(@Query() searchMountDto: SearchMountDto, @User('_id') userId: string): Promise<Mount[]> {
    return this.mountsService.getMountsForUserId(searchMountDto, userId);
  }

  @Get('stats/gender-count')
  @ApiOperation({
    summary: 'Get gender count of mounts by type for userId',
    description: 'Get the count of each gender of mounts, by type, for the userId in the Auth Token.',
  })
  @ApiOkResponse({
    description: 'The counts have been returned',
    type: MountGenderCountResponseDto,
    isArray: true,
  })
  genderCountByTypeForUserId(@User('_id') userId: string): Promise<MountGenderCountResponseDto[]> {
    return this.mountsService.genderCountByTypeForUserId(userId);
  }
}
