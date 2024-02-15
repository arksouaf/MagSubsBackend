import { Controller, Get, Post, Body, Param, Put, Delete,ParseIntPipe } from '@nestjs/common';
import { Magazine } from './magazine.entity';
import { MagazineService } from './magazine.service';

@Controller('magazines')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Get()
  async findAll(): Promise<Magazine[]> {
    return this.magazineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Magazine> {
    return this.magazineService.findOne(+id);
  }

  @Post()
  async create(@Body() magazineData: Partial<Magazine>): Promise<Magazine> {
    return this.magazineService.create(magazineData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() magazineData: Partial<Magazine>): Promise<Magazine> {
    return this.magazineService.update(+id, magazineData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.magazineService.remove(+id);
  }

}
