"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const galleryImages = [
 { src: "/images/IP_Camera_blog.png", title: "CP Plus IP CCTV Camera Installation" },
{ src: "/images/Cp_analog_cctv.mp4", title: "CP Plus Analog CCTV Camera Installation" },
{ src: "/images/Networking_blog.png", title: "Network Cabling & NVR Installation" },
{ src: "/images/service-cctv.png", title: "Outdoor Wireless CCTV Surveillance" },
{ src: "/images/Wireless_CCTV_Imou.mp4", title: "Advanced Wireless CCTV Installation" },
{ src: "/images/service-biometric.jpg", title: "Biometric Access Control System" },
{ src: "/images/Networking_Gallery.png", title: "High-Speed Structured Network Cabling" },
{ src: "/images/service-automation.jpg", title: "Smart Home Automation Solutions" },
{ src: "/images/Hikvision_CCTV.mp4", title: "Hikvision IP CCTV Camera Installation with Built-in Microphone" },
{ src: "/images/service-access.jpg", title: "Access Control & Secure Entry Systems" },
{ src: "/images/Wireless_Wifi_CCTV_Imou.mp4", title: "Imou Wireless Wi-Fi CCTV Camera Installation with Two-Way Audio" },
]

export function GalleryPageContent() {
  const [selectedItem, setSelectedItem] = useState<{ src: string; title: string } | null>(null)

  
  const isVideo = (src: string) => {
    return src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".ogg")
  }

  return (
    <section className="py-24 lg:py-32 bg-zinc-950 text-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* HEADING SECTION */}
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent lg:text-6xl"
          >
            Our Installation Gallery
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400"
          >
            Explore our premium security system installations and smart technology projects.
          </motion.p>
        </div>

        {/* IMAGE & VIDEO GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              onClick={() => setSelectedItem(item)} 
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 cursor-pointer shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300"
            >
              <div className="relative h-[300px] w-full overflow-hidden flex items-center justify-center bg-black">
                
                {isVideo(item.src) ? (
                  <video
                    src={item.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                )}

                {/* Video Indicator Icon */}
                {isVideo(item.src) && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white p-2 rounded-full z-10 text-xs font-semibold uppercase tracking-wider border border-white/10">
                    ▶ Video
                  </div>
                )}

                {/* Hover Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Text Details on Hover */}
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 z-20">
                  <p className="text-sm font-semibold tracking-wider text-amber-400 uppercase mb-1">Project</p>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-200 z-50 text-xl font-bold"
              aria-label="Close Lightbox"
            >
              ✕
            </button>

            {/* Large Content Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 150 }}
              onClick={(e) => e.stopPropagation()} 
              className="relative max-w-5xl w-full h-[70vh] md:h-[80vh] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl cursor-default flex items-center justify-center"
            >
              {isVideo(selectedItem.src) ? (
                <video
                  key={selectedItem.src}
                  src={selectedItem.src}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-full object-contain p-2 md:p-4 z-20"
                />
              ) : (
                <Image
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  fill
                  priority
                  className="object-contain p-2 md:p-4"
                />
              )}
              
              {/* Bottom Caption in Lightbox */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-center z-10 pointer-events-none">
                <h3 className="text-lg md:text-2xl font-semibold text-white tracking-wide">
                  {selectedItem.title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}