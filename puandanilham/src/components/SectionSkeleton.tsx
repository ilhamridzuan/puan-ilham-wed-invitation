export function SectionSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} w-full animate-pulse bg-primary/5 rounded-lg`} />
  )
}

export function WishesSkeleton() {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-4 px-4 py-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 rounded-xl border border-primary/10 bg-white/50 backdrop-blur-sm shadow-sm animate-pulse">
          <div className="w-12 h-12 rounded-full bg-primary/10 shrink-0" />
          <div className="flex-1 flex flex-col gap-2 pt-1">
            <div className="h-4 w-32 bg-primary/10 rounded" />
            <div className="h-3 w-full max-w-[200px] bg-primary/5 rounded" />
            <div className="h-3 w-2/3 bg-primary/5 rounded mt-1" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function GallerySkeleton() {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="aspect-[3/4] w-full animate-pulse bg-primary/5 rounded-xl border border-primary/10" />
      ))}
    </div>
  )
}
