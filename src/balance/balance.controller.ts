import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger'; // Import Swagger decorators
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@ApiTags('Balance') // Group API under "Balance" tag in Swagger
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created successfully',
  })
  @ApiBody({ type: CreateBalanceDto }) // Specify input DTO for Swagger
  async create(@Body() createBalanceDto: CreateBalanceDto) {
    // Convert the date string to a Date instance if necessary
    createBalanceDto.date = new Date(createBalanceDto.date);

    return this.balanceService.create(createBalanceDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all balances',
  })
  async findAll() {
    return this.balanceService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Returns a single balance',
  })
  @ApiParam({ name: 'id', type: 'number' }) // Specify parameter type for Swagger
  async findOne(@Param('id') id: string) {
    return this.balanceService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Updated successfully',
  })
  @ApiParam({ name: 'id', type: 'number' }) // Specify parameter type for Swagger
  @ApiBody({ type: UpdateBalanceDto }) // Specify input DTO for Swagger
  async update(
    @Param('id') id: string,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    return this.balanceService.update(+id, updateBalanceDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'number' }) // Specify parameter type for Swagger
  async remove(@Param('id') id: string) {
    return this.balanceService.remove(+id);
  }
}
