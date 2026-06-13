// components/gallery-page-content.tsx

"use client"

import Image from "next/image"

import { motion } from "framer-motion"

const galleryImages = [
  "/images/project-1.jpg",
  "/images/project-2.jpg",
  "/images/project-3.jpg",
  "/images/project-4.jpg",
  "/images/service-cctv.jpg",
  "/images/service-biometric.jpg",
  "/images/service-networking.jpg",
  "/images/service-automation.jpg",
  "/images/service-access.jpg",
]

export function GalleryPageContent() {
  return (
    <section className="py-24 lg:py-32">

      <div className="container mx-auto px-4 lg:px-8">

        {/* HEADING */}
        <div className="mb-16 text-center">

          <h2 className="text-3xl font-bold text-white lg:text-5xl">

            Our Installation Gallery

          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">

            Explore our premium security system installations and smart technology projects.

          </p>

        </div>

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            >
              <div className="relative h-[300px] w-full overflow-hidden">

                <Image
                  src={image}
                  alt="Gallery Image"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  )
}