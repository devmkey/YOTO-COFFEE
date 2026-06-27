export default function Loading() {
  return (
    <div className="min-h-screen bg-coffeeDark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="font-serif italic text-4xl text-tan animate-pulse">yoto coffee</div>
        <div className="w-8 h-8 border-2 border-tan border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
