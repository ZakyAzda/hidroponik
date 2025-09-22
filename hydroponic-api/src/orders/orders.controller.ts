import { Controller, Post, Body, UseGuards, Req, Get, Param, ParseIntPipe, Patch, Delete} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req, @Body() createOrderDto: CreateOrderDto) { 
  const userId = req.user.sub;
  return this.ordersService.create(userId, createOrderDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req) {
    const userId = req.user.sub; // Ambil ID user dari token
    return this.ordersService.findAllForUser(userId);
  }
   @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub;
    return this.ordersService.findOneForUser(id, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const userId = req.user.sub;
    return this.ordersService.update(id, userId, updateOrderDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub;
    return this.ordersService.remove(id, userId);
  }
}