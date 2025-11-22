import { PrismaClient, ReviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Dapatkan user dan produk pertama sebagai contoh
  const firstUser = await prisma.user.findFirst();
  const firstProduct = await prisma.product.findFirst();

  if (!firstUser || !firstProduct) {
    console.log('Please create at least one user and one product before seeding reviews.');
    return;
  }

  console.log(`Using user ID: ${firstUser.id} and product ID: ${firstProduct.id}`);

  // 2. Buat beberapa data review
  const reviewsToCreate = [
    {
      rating: 5,
      comment: 'Produknya luar biasa! Sangat segar dan berkualitas tinggi. Pengiriman juga cepat. Pasti akan pesan lagi.',
      userId: firstUser.id,
      productId: firstProduct.id,
      status: ReviewStatus.APPROVED,
    },
    {
      rating: 4,
      comment: 'Cukup bagus, sayurannya segar. Hanya saja ukurannya sedikit lebih kecil dari yang saya harapkan. Tapi secara keseluruhan puas.',
      userId: firstUser.id,
      productId: firstProduct.id,
      status: ReviewStatus.APPROVED,
    },
    {
      rating: 5,
      comment: 'Pelayanan terbaik! Admin ramah dan sangat membantu. Produk tiba dalam kondisi sempurna. Recommended seller!',
      userId: firstUser.id,
      productId: firstProduct.id,
      status: ReviewStatus.APPROVED,
    },
     {
      rating: 3,
      comment: 'Ini adalah review yang masih PENDING dan tidak seharusnya muncul di landing page.',
      userId: firstUser.id,
      productId: firstProduct.id,
      status: ReviewStatus.PENDING,
    }
  ];

  // 3. Masukkan data review ke database
  for (const reviewData of reviewsToCreate) {
    await prisma.review.create({
      data: reviewData,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
