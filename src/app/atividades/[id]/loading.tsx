export default function Loading() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-40 rounded bg-gray-200" />
        <div className="h-96 w-full rounded-xl bg-gray-200" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-6 w-1/2 rounded bg-gray-200" />
          <div className="h-6 w-1/3 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
