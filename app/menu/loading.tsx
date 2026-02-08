export default function Loading() {
  const cards = Array.from({ length: 12 });
  return (
    <main className="pt-24 container-edge">
      <div className="mt-2 h-8 w-48 rounded-xl bg-muted animate-pulse" />
      <div className="mt-6 columns-1 md:columns-2 lg:columns-5 gap-6 [column-fill:_balance]">
        {cards.map((_, i) => (
          <div key={i} className="break-inside-avoid mb-6">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/3]">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted to-white/40" />
                <div className="absolute top-3 left-3 rounded-xl px-3 py-1 text-xs bg-white/20 w-16 h-6" />
                <div className="absolute bottom-3 left-3 rounded-xl px-3 py-1 text-xs bg-white/20 w-20 h-6" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-40 bg-muted/70 rounded animate-pulse" />
                    <div className="mt-2 flex gap-2">
                      <div className="h-5 w-14 bg-muted rounded animate-pulse" />
                      <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                      <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                </div>
                <div className="mt-3 h-9 w-full bg-muted rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
