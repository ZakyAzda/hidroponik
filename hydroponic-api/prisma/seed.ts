import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Products & Categories...');

  // 1. BUAT KATEGORI (Gunakan upsert agar tidak error jika sudah ada)
  const catAlat = await prisma.productCategory.upsert({
    where: { name: 'Alat Hidroponik' },
    update: {},
    create: { name: 'Alat Hidroponik' },
  });

  const catSayur = await prisma.productCategory.upsert({
    where: { name: 'Sayuran & Melon' },
    update: {},
    create: { name: 'Sayuran & Melon' },
  });

  console.log(`✅ Kategori Siap: ID Alat=${catAlat.id}, ID Sayur=${catSayur.id}`);

  // 2. DATA PRODUK DUMMY
  const products = [
    // --- KATEGORI: ALAT HIDROPONIK ---
    {
      name: 'Starter Kit Hidroponik Wick System',
      description: 'Paket lengkap untuk pemula. Berisi bak nutrisi, impraboard 9 lubang, netpot, sumbu flanel, rockwool, dan benih mix.',
      price: 65000,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop',
      categoryId: catAlat.id,
    },
    {
      name: 'Nutrisi AB Mix Sayuran Daun (500ml)',
      description: 'Pupuk cair pekatan A dan B khusus sayuran daun. Mempercepat pertumbuhan dan menjaga warna daun tetap hijau segar.',
      price: 25000,
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?q=80&w=1000&auto=format&fit=crop',
      categoryId: catAlat.id,
    },
    {
      name: 'Rockwool Cultilene (1 Slab)',
      description: 'Media tanam terbaik untuk semai. Menyerap air dengan baik dan porositas tinggi. Ukuran 100x15x7.5 cm.',
      price: 60000,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1635935626182-27b041008044?q=80&w=1000&auto=format&fit=crop',
      categoryId: catAlat.id,
    },
    {
      name: 'TDS Meter Digital & Temperature',
      description: 'Alat ukur kepekatan nutrisi (PPM) air baku dan larutan pupuk. Wajib dimiliki petani hidroponik.',
      price: 45000,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1615486511263-78cb457e5025?q=80&w=1000&auto=format&fit=crop',
      categoryId: catAlat.id,
    },
    {
      name: 'Netpot Hitam 5cm + Flanel',
      description: 'Netpot kuat tahan panas matahari, sudah termasuk sumbu kain flanel potong.',
      price: 1500,
      stock: 500,
      imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000&auto=format&fit=crop',
      categoryId: catAlat.id,
    },

    // --- KATEGORI: SAYURAN & MELON ---
    {
      name: 'Selada Romaine Hidroponik (250g)',
      description: 'Selada segar, renyah, dan bebas pestisida. Dipanen langsung saat ada pesanan.',
      price: 15000,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=1000&auto=format&fit=crop',
      categoryId: catSayur.id,
    },
    {
      name: 'Pakcoy Hijau Segar (500g)',
      description: 'Sayur sawi sendok (Pakcoy) hasil kebun hidroponik. Batang putih renyah, daun hijau segar.',
      price: 12000,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1627309378282-b78e3d4943c4?q=80&w=1000&auto=format&fit=crop',
      categoryId: catSayur.id,
    },
    {
      name: 'Melon Golden Aroma (Per Buah)',
      description: 'Melon hidroponik kualitas premium. Daging buah oranye, manis (Brix > 13), dan wangi.',
      price: 85000,
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1595124268370-48647a2a7119?q=80&w=1000&auto=format&fit=crop',
      categoryId: catSayur.id,
    },
    {
      name: 'Kangkung Hidroponik (Ikat Besar)',
      description: 'Kangkung bersih tanpa lumpur, akar putih bersih. Lebih empuk saat ditumis.',
      price: 8000,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1642691012297-84c622679b29?q=80&w=1000&auto=format&fit=crop',
      categoryId: catSayur.id,
    },
    {
      name: 'Tomat Cherry Merah (250g)',
      description: 'Tomat mungil manis, cocok untuk salad atau camilan sehat. Kaya likopen.',
      price: 20000,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1598312972241-731963f91791?q=80&w=1000&auto=format&fit=crop',
      categoryId: catSayur.id,
    },
  ];

  // 3. MASUKKAN KE DATABASE
  console.log('📦 Inserting products...');
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`✅ Seeding selesai! Ditambahkan ${products.length} produk.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });