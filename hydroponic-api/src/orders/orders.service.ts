import {
  Injectable,
  BadRequestException,
  NotFoundException, // <-- 3. Impor yang kurang
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Product } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable() // <-- 1. Pastikan hanya ada satu
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // 2. Gunakan CreateOrderDto di sini
  async create(userId: number, createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order items tidak boleh kosong.');
    }

    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const productDetails: (Product & { quantity: number })[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(
            `Stok untuk produk ${product?.name || 'ID ' + item.productId} tidak mencukupi.`,
          );
        }

        totalAmount += product.price * item.quantity;
        productDetails.push({ ...product, quantity: item.quantity });
      }

      const order = await tx.order.create({
        data: {
          userId: userId,
          totalAmount: totalAmount,
          items: {
            createMany: {
              data: items.map((item) => {
                const detail = productDetails.find((p) => p.id === item.productId);
                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  price: detail!.price,
                };
              }),
            },
          },
        },
        include: {
          items: true,
        },
      });

      for (const product of productDetails) {
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: product.quantity,
            },
          },
        });
      }

      return order;
    });
  }

  findAllForUser(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneForUser(id: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan.');
    }
    return order;
  }

  async update(id: number, userId: number, updateOrderDto: UpdateOrderDto) {
    await this.findOneForUser(id, userId);
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOneForUser(id, userId);
    return this.prisma.order.delete({ where: { id } });
  }
}