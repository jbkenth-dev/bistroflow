 "use client";
import Image from "next/image";
import { foods } from "@/data/foods";
import ContentLoader from "react-content-loader";
import { useState } from "react";

function Skeleton() {
  return (
    <ContentLoader speed={2} width={400} height={300} viewBox="0 0 400 300" backgroundColor="#ecebeb" foregroundColor="#d6d6d6">
      <rect x="0" y="0" rx="12" ry="12" width="400" height="300" />
    </ContentLoader>
  );
}

export function GalleryClient() {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  return (
    <div className="mt-6 columns-1 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
      {foods.map((f) => (
        <div key={`g-${f.id}`} className="break-inside-avoid mb-4">
          <div className="relative overflow-hidden rounded-2xl glass">
            {!loaded[f.id] && <Skeleton />}
            <div className={`${!loaded[f.id] ? "hidden" : "block"} relative`}>
              <Image
                src={f.image}
                alt={f.name}
                width={800}
                height={600}
                className="object-cover w-full h-auto transition-transform hover:scale-105"
                onLoadingComplete={() => setLoaded((l) => ({ ...l, [f.id]: true }))}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzY2JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nNjYnIGZpbGw9JyNlZWUnIC8+PC9zdmc+"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
