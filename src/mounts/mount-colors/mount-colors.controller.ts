import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
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
import { Roles } from 'src/common/models/decorator/roles.decorator';
import { MongoIdDto } from 'src/common/models/dtos/mongo-id.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { UserRoleEnum } from 'src/users/models/enum/user-role.enum';
import { MountColorDto } from './models/dtos/mount-color.dto';
import { MountColorGroupedByResponseDto } from './models/dtos/responses/mount-color-grouped-by.response.dto';
import { MountColor } from './models/schemas/mount-color.schema';
import { MountColorsService } from './mount-colors.service';

@ApiTags('Mounts')
@ApiUnexpectedErrorResponse()
@CustomApiUnauthorizedResponse()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mounts/colors')
export class MountColorsController {
  constructor(private mountColorsService: MountColorsService) {}

  @Roles(UserRoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({
    summary: 'Create mount color - Admin',
    description: 'Create a new mount color.',
  })
  @ApiCreatedResponse({
    description: 'The mount color has been created',
    type: MountColor,
  })
  @CustomApiBadRequestResponse()
  @CustomApiForbiddenResponse()
  createMountColor(@Body() mountColorDto: MountColorDto): Promise<MountColor> {
    return this.mountColorsService.createMountColor(mountColorDto);
  }

  @Roles(UserRoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Update mount color - Admin',
    description: 'Update a existing mount color.',
  })
  @ApiOkResponse({
    description: 'The mount color has been updated',
    type: MountColor,
  })
  @CustomApiBadRequestResponse()
  @CustomApiNotFoundResponse('No mount color found.')
  @CustomApiForbiddenResponse()
  updateMountColor(@Param() mongoIdDto: MongoIdDto, @Body() mountColorDto: MountColorDto): Promise<MountColor> {
    return this.mountColorsService.updateMountColor(mongoIdDto.id, mountColorDto);
  }

  @Roles(UserRoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete mount color - Admin',
    description: 'Delete a existing mount color.',
  })
  @ApiNoContentResponse({
    description: 'The mount color has been deleted',
  })
  @CustomApiBadRequestResponse()
  @CustomApiNotFoundResponse('No mount color found.')
  @CustomApiForbiddenResponse()
  async deleteMountColor(@Param() mongoIdDto: MongoIdDto): Promise<void> {
    await this.mountColorsService.deleteMountColor(mongoIdDto.id);
  }

  @Get('group/type')
  @ApiOperation({
    summary: 'Get mount colors grouped by mountType',
    description: 'Get all the mount colors grouped by each mountType.',
  })
  @ApiOkResponse({
    description: 'The mount colors have been returned',
    type: MountColorGroupedByResponseDto,
    isArray: true,
  })
  @CustomApiBadRequestResponse()
  getMountColorsGroupedByMountType(): Promise<MountColorGroupedByResponseDto[]> {
    return this.mountColorsService.getMountColorsGroupedByMountType();
  }
}
