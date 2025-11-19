export function SectionWorkSkeleton() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-300 rounded w-full mb-2" />
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-2/3" />
    </div>
  );
}
