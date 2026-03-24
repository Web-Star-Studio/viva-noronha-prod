export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-pulse">
        <div className="mb-6 h-8 w-1/3 rounded bg-gray-200" />
        <div className="mb-8 h-96 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-4 h-8 w-1/2 rounded bg-gray-200" />
            <div className="mb-2 h-4 w-full rounded bg-gray-200" />
            <div className="mb-2 h-4 w-full rounded bg-gray-200" />
            <div className="mb-8 h-4 w-3/4 rounded bg-gray-200" />
          </div>
          <div className="h-64 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
