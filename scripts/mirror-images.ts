/*
  Mirror external (Shopify CDN) product images to local /public/products/<slug>/ directory.
  - For full independence from Shopify CDN.
  - Updates DB image src to local relative paths.
  - Requires images already imported referencing cdn.shopify.com.
*/
import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '@/lib/db'

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'products')

async function ensureDir(dir: string) {
  await fs.promises.mkdir(dir, { recursive: true })
}

function fileNameFromUrl(url: string) {
  const base = url.split('?')[0]
  return base.substring(base.lastIndexOf('/') + 1) || 'image.jpg'
}

async function downloadImage(url: string, dest: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const buffer = await res.arrayBuffer()
  await fs.promises.writeFile(dest, Buffer.from(buffer))
}

async function mirror() {
  const products = await prisma.product.findMany({ include: { images: true } })
  console.log(`Starting mirror for ${products.length} products...`)
  let downloaded = 0
  let skipped = 0
  for (const product of products) {
    const dir = path.join(PUBLIC_DIR, product.slug)
    await ensureDir(dir)
    for (const img of product.images) {
      if (!img.src.startsWith('https://cdn.shopify.com/')) {
        skipped++
        continue
      }
      const filename = fileNameFromUrl(img.src)
      const localPath = `/products/${product.slug}/${filename}`
      const diskPath = path.join(dir, filename)
      try {
        await downloadImage(img.src, diskPath)
        await prisma.image.update({ where: { id: img.id }, data: { src: localPath } })
        downloaded++
        if (downloaded % 50 === 0) console.log(`Progress: ${downloaded} images downloaded...`)
      } catch (e) {
        console.error('Image mirror failed', img.src, e)
      }
    }
  }
  console.log(`Mirrored ${downloaded} images to local public directory. Skipped ${skipped} non-Shopify images.`)
}

mirror().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
