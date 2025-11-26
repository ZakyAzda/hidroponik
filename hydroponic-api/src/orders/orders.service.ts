import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Product, PaymentStatus, PaymentMethod } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

// 1. Import Midtrans Client
const midtransClient = require('midtrans-client');

@Injectable()
export class OrdersService {
  private snap;

  constructor(private prisma: PrismaService) {
    // 2. Setup Midtrans Snap Client
    this.snap = new midtransClient.Snap({
      isProduction: false, // Ubah true jika sudah live
      serverKey: process.env.MIDTRANS_SERVER_KEY, 
      clientKey: process.env.MIDTRANS_CLIENT_KEY // GANTI DENGAN CLIENT KEY KAMU
    });
  }

  // =================================================================
  // 1. CREATE ORDER (INTI TRANSAKSI + MIDTRANS)
  // =================================================================
  async create(userId: number, createOrderDto: CreateOrderDto) {
    const { items, paymentMethod, addressId } = createOrderDto;

    // 1. Validasi User
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    if (!items || items.length === 0) {
      throw new BadRequestException('Order items tidak boleh kosong.');
    }

    // 2. Validasi Alamat
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId: userId },
    });

    if (!address) {
      throw new BadRequestException('Alamat pengiriman tidak valid atau tidak ditemukan.');
    }

    // 3. Tentukan Status Awal
    let initialOrderStatus = 'PENDING';
    if (paymentMethod === 'COD' as any) {
      initialOrderStatus = 'PROCESSING';
    }

    // 4. Mulai Transaksi Database
    // Kita simpan hasil transaksi ke variabel transactionResult
    const transactionResult = await this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const productDetails: (Product & { quantity: number })[] = [];

      // A. Cek Stok & Hitung Total
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

      // B. Simpan Order Header
      const order = await tx.order.create({
        data: {
          userId: userId,
          totalAmount: totalAmount,
          status: initialOrderStatus,
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
        include: { items: true },
      });

      // C. Simpan Data Payment
      let paymentMethodEnum: PaymentMethod;
      if (paymentMethod === 'COD' as any) paymentMethodEnum = 'COD' as any;
      else if (paymentMethod === 'GOPAY' as any) paymentMethodEnum = PaymentMethod.GOPAY;
      else if (paymentMethod === 'OVO' as any) paymentMethodEnum = PaymentMethod.OVO;
      else paymentMethodEnum = PaymentMethod.BANK_TRANSFER;

      await tx.payment.create({
        data: {
          amount: totalAmount,
          status: PaymentStatus.PENDING,
          method: paymentMethodEnum,
          orderId: order.id,
        },
      });

      // D. Kurangi Stok
      for (const product of productDetails) {
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: { decrement: product.quantity },
          },
        });
      }

      // Kembalikan data order lengkap dari transaksi
      return order;
    });

    // 5. INTEGRASI MIDTRANS (Jika bukan COD)
    if (paymentMethod !== 'COD' as any) {
      try {
        const parameter = {
          transaction_details: {
            order_id: `ORDER-${transactionResult.id}-${Date.now()}`, // ID Unik Midtrans
            gross_amount: transactionResult.totalAmount,
          },
          credit_card: { secure: true },
          customer_details: {
            first_name: user.name,
            email: user.email,
            phone: address.phoneNumber,
            billing_address: { address: address.fullAddress },
            shipping_address: {
              first_name: address.recipientName,
              phone: address.phoneNumber,
              address: address.fullAddress
            }
          },
        };

        // Minta Token ke Midtrans
        const snapTransaction = await this.snap.createTransaction(parameter);
        
        // Kembalikan Token ke Frontend bersama data order
        return {
          ...transactionResult,
          midtransToken: snapTransaction.token,
          midtransRedirectUrl: snapTransaction.redirect_url
        };

      } catch (error) {
        console.error("Midtrans Error:", error);
        // Jangan throw error, kembalikan order saja (user bisa coba bayar lagi nanti)
        return transactionResult;
      }
    }

    return transactionResult;
  }

  // =================================================================
  // 2. GET ALL ORDERS (USER)
  // =================================================================
  findAllForUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // =================================================================
  // 3. GET ONE ORDER (DETAIL)
  // =================================================================
  async findOneForUser(id: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { 
        items: { include: { product: true } },
        payment: true 
      },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan.');
    }
    return order;
  }

  // =================================================================
  // 4. UPDATE & DELETE (USER)
  // =================================================================
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

  // =================================================================
  // 5. ADMIN FEATURES
  // =================================================================
  findAllForAdmin(categoryName?: string) {
    return this.prisma.order.findMany({
      where: categoryName ? {
        items: {
          some: {
            product: {
              category: {
                name: categoryName
              }
            }
          }
        }
      } : {},
      include: {
        user: true,
        payment: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan.');
    }

    // You might want to add validation for the status string here
    // For example, using an enum or a predefined list of valid statuses

    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async handleNotification(notification: any) {
    const status = notification.transaction_status;
    const orderIdStr = notification.order_id;
    const fraud = notification.fraud_status;

    console.log(`🔔 Midtrans Notification: ${orderIdStr} | Status: ${status}`);

    // 1. Pecah Order ID (Format: ORDER-15-123456789) -> Ambil angka 15
    const parts = orderIdStr.split('-');
    const dbOrderId = parseInt(parts[1]);

    if (isNaN(dbOrderId)) {
      console.error("Invalid Order ID format from Midtrans");
      return;
    }

    // 2. Tentukan Status Baru
    let orderStatus = '';
    let paymentStatus = '';

    if (status === 'capture') {
      if (fraud === 'challenge') {
        orderStatus = 'PENDING'; // Perlu tinjauan manual
        paymentStatus = 'PENDING';
      } else if (fraud === 'accept') {
        orderStatus = 'PROCESSING'; // Lunas -> Siap Dikemas
        paymentStatus = 'SUCCESS';
      }
    } else if (status === 'settlement') {
      orderStatus = 'PROCESSING'; // Lunas -> Siap Dikemas
      paymentStatus = 'SUCCESS';
    } else if (status === 'cancel' || status === 'deny' || status === 'expire') {
      orderStatus = 'CANCELLED';
      paymentStatus = 'FAILED';
    } else if (status === 'pending') {
      orderStatus = 'PENDING';
      paymentStatus = 'PENDING';
    }

    // 3. Update Database jika status berubah
    if (orderStatus) {
      await this.prisma.$transaction(async (tx) => {
        // Update Order
        await tx.order.update({
          where: { id: dbOrderId },
          data: { status: orderStatus },
        });

        // Update Payment
        // Karena relasi One-to-Many (walau biasanya 1 order 1 payment), kita pakai updateMany biar aman
        await tx.payment.updateMany({
          where: { orderId: dbOrderId },
          data: { status: paymentStatus as any },
        });
      });
      console.log(`✅ Order #${dbOrderId} updated to ${orderStatus}`);
    }
  }
}