type SmallPostItemProps = {
  itemID: number;
  name: string;
  status: string;
  imageDir?: string;
  showEdit?: boolean;
  showHistory?: boolean; // admin-only
};

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  available:   { bg: 'bg-green-50',   text: 'text-green-700',   dot: 'bg-green-500' },
  'on loan':   { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-400' },
  pending:     { bg: 'bg-amber-50',   text: 'text-amber-800',   dot: 'bg-amber-700' },
  rejected:    { bg: 'bg-gray-200',   text: 'text-gray-500',    dot: 'bg-gray-400' },
  returned:    { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400' },
  default:     { bg: 'bg-gray-100',   text: 'text-gray-500',    dot: 'bg-gray-400' },
};

export const SmallPostItem = ({
  itemID,
  name,
  status,
  imageDir,
  showEdit,
  showHistory
}: SmallPostItemProps) => {
  const imageSrc = imageDir
    ? (imageDir.startsWith('upload_') ? `/images/${imageDir}` : `/statics/${imageDir}`)
    : '/statics/scale.jpeg';

  const key = status.toLowerCase();
  const badge = statusStyles[key] ?? statusStyles.default;

  // Paths for navigation
  const bookingUrl = `/dashboard/items/${itemID}`;
  const editUrl = `/dashboard/items/${itemID}/edit`;
  const historyUrl = `/dashboard/items/${itemID}/history`;

  return (
    <div class="group relative flex flex-col w-40 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5">
      
      <a href={bookingUrl} class="no-underline flex flex-col h-full">
        {/* Uniform image box */}
        <div class="flex items-center justify-center bg-gray-50 p-3 shrink-0">
          <div class="w-36 h-36 rounded-xl overflow-hidden ring-1 ring-gray-200 shrink-0">
            <img
              src={imageSrc}
              alt={name}
              class="block w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
        {/* Content Section */}
        <div class="flex flex-col flex-1 p-3 gap-1">
          <span class="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
            #{itemID}
          </span>
          <span class="text-[13.5px] font-semibold text-gray-900 leading-snug line-clamp-2">
            {name}
          </span>
          {/* Status badge */}
          <div class="mt-auto pt-2">
            <span
              class={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wide ${badge.bg} ${badge.text}`}
            >
              <span class={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
              {status}
            </span>
          </div>
          {/* Interaction hint */}
          <div class="text-[11px] mt-2 font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Book Item 
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </a>

      {/* Admin-Only Edit Button Overlay */}
      {showEdit && (
        <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <a 
            href={editUrl} 
            class="flex items-center justify-center w-8 h-8 bg-[#003865] text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors"
            title="Edit Item"
            onClick={e => e.stopPropagation()}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </a>
        </div>
      )}

      {/* Admin-Only History Button Overlay */}
      {showHistory && (
        <div class="absolute bottom-3 left-3 z-10">
          <a
            href={historyUrl}
            class="bg-[#003865] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors shadow-sm block text-center"
            style={{marginTop:8}}
            title="View History"
            onClick={e => e.stopPropagation()}
          >
            History
          </a>
        </div>
      )}
    </div>
  );
};