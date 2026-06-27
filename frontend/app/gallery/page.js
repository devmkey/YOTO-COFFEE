import Image from "next/image";

export const metadata = {
  title: "Gallery",
  description: "A look around Yoto Coffee House — warm interiors, rustic charm.",
};

const PHOTOS = [
  { src: "/images/interior-hero.jpg", alt: "Bar counter and seating with grass-tiled floor" },
  { src: "/images/interior-2.jpg", alt: "Entrance hallway with brick walls and banana leaves" },
  { src: "/images/interior-3.jpg", alt: "Seating area with hanging bulbs and wood ceiling" },
];

export default function GalleryPage() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs uppercase tracking-[2px] text-terracotta font-semibold block mb-2">
          Inside yoto
        </span>
        <h2 className="text-2xl md:text-3xl mb-8">A look around the house</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className="relative h-64 rounded-2xl overflow-hidden border border-coffeeMid"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
