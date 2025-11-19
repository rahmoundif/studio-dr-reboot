export function SectionPricingSkeleton() {
  return (
    <section className="mb-12 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="h-5 bg-gray-300 rounded w-2/3 mb-4" />
            <div className="h-3 bg-gray-300 rounded w-5/6 mb-3" />
            <div className="h-3 bg-gray-300 rounded w-3/4 mb-6" />

            <div className="border-t pt-4 mt-4">
              <div className="h-6 bg-gray-400 rounded w-1/3 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
