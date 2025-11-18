export function SectionOffersSkeleton() {
  return (
    <section className="mb-12 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="h-5 bg-gray-300 rounded w-2/3 mb-4" />
            <div className="h-3 bg-gray-300 rounded w-full mb-2" />
            <div className="h-3 bg-gray-300 rounded w-5/6 mb-2" />
            <div className="h-3 bg-gray-300 rounded w-4/6" />
          </div>
        ))}
      </div>
    </section>
  );
}