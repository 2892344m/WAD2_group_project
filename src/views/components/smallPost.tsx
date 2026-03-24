type SmallPostProps = {
  bookingID: number;
  itemID: string;
  uid: string;
  bookingDate: string;
  returnDate: string;
  status: string;
};

const StatusPill = ({ status }: { status: string }) => {
  const s = status?.toLowerCase() ?? '';
  let cls = 'bg-gray-100 text-gray-600 border-gray-200'; 

  if (s.includes('loan') || s.includes('borrow')) {
    cls = 'bg-red-50 text-red-700 border-red-100';
  } else if (s.includes('avail')) {
    cls = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  } else if (s.includes('return')) {
    cls = 'bg-blue-50 text-blue-700 border border-blue-200';
  } else if (s.includes('pending')) {
    cls = 'bg-amber-50 text-amber-700 border border-amber-200';
  } else if (s.includes('reject')) {
    cls = 'bg-red-50 text-red-700 border border-red-200';
  }

  return (
    <span class={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wide border ${cls}`}>
      {status}
    </span>
  );
};

export const SmallPost = ({
  bookingID,
  itemID,
  uid,
  bookingDate,
  returnDate,
  status,
}: SmallPostProps) => (
  <a
    href={`/dashboard/bookings/${bookingID}`}
    class="block no-underline text-inherit group"
  >
    <div class="w-full max-w-[420px] bg-white border border-gray-100 rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 cursor-pointer">
      {/* top row */}
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <div class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Booking #{bookingID}
          </div>
          <div class="text-[15px] font-bold text-[#003865] leading-tight">
            Item ID: {itemID}
          </div>
        </div>

        <StatusPill status={status} />
      </div>

      {/* details grid */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px] border-t border-gray-50 pt-4">
        <div class="flex flex-col gap-0.5">
          <span class="font-bold text-gray-400 uppercase text-[9px] tracking-wider">User</span>
          <span class="text-gray-700 font-medium truncate">{uid}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="font-bold text-gray-400 uppercase text-[9px] tracking-wider">Booked</span>
          <span class="text-gray-700 font-medium">{bookingDate}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="font-bold text-gray-400 uppercase text-[9px] tracking-wider">Return</span>
          <span class="text-gray-700 font-medium">{returnDate}</span>
        </div>
      </div>

      {/* interaction hint */}
      <div class="text-[11px] mt-4 font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        View details 
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </div>
  </a>
);