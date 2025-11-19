export function SectionTeamSkeleton() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Qui sommes-nous ?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-4" />
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-2" />
            <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    </section>
  );
}
