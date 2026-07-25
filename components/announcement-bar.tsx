/* Only the bundle price is advertised up front. Pickup and church delivery
   are offered at checkout as delivery choices, not broadcast sitewide. */
export function AnnouncementBar() {
  return (
    <div className="bg-[#344e41] text-white">
      <div className="mx-auto max-w-6xl px-4 py-2 text-center text-sm">
        <strong className="font-bold">4 bars for $20</strong>
        <span className="opacity-90"> — the discount applies itself</span>
      </div>
    </div>
  );
}
