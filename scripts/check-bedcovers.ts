import { prisma } from '@/lib/db'

async function checkBedcovers() {
  const bedcovers = await prisma.product.findMany({
    where: {
      title: { contains: 'Bedcover', mode: 'insensitive' }
    },
    select: { title: true, category: true },
    take: 15
  })
  
  console.log('Bedcover Products:\n')
  bedcovers.forEach(p => console.log(`${p.category}: ${p.title}`))
}

checkBedcovers().catch(console.error).finally(() => prisma.$disconnect())
