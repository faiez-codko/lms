import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@myquantumacademy.com' },
    update: {},
    create: {
      email: 'admin@myquantumacademy.com',
      password: adminPassword,
      name: 'Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);






  console.log('🎉 Database seeding completed!');
  console.log('\n📧 Admin credentials:');
  console.log('Email: admin@myquantumacademy.com');


  console.log('\n🌐 You can now access:');
  console.log('- Home page with dynamic content: http://localhost:3000');
  console.log('- Admin panel: http://localhost:3000/admin');

  console.log('- Prisma Studio: http://localhost:5555');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });