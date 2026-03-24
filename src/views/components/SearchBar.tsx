type SearchBarProps = {
    action: string;          // form action URL (e.g. "/dashboard/items")
    q: string;               // current query value
    placeholder?: string;    // input placeholder
    clearHref?: string;      // where "Clear" should go (defaults to action)
    inputName?: string;      // defaults to "q"
    buttonLabel?: string;    // defaults to "Search"
  };
  
  export const SearchBar = ({
    action,
    q,
    placeholder = 'Search…',
    clearHref,
    inputName = 'q',
    buttonLabel = 'Search',
  }: SearchBarProps) => {
    const clearTo = clearHref ?? action;
  
    return (
      <form
        method="get"
        action={action}
        class="flex gap-2.5 items-center mb-3.5"
      >
        <input
          type="search"
          name={inputName}
          value={q}
          placeholder={placeholder}
          class="flex-1 max-w-[420px] px-3 py-2.5 border border-gray-300 rounded-[10px] outline-none focus:border-[#003865] transition-colors"
        />
        <button
          type="submit"
          class="px-3.5 py-2.5 rounded-[10px] border border-gray-300 bg-white font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {buttonLabel}
        </button>

        {q ? (
          <a href={clearTo} class="text-sm no-underline opacity-80 hover:opacity-100 transition-opacity">
            Clear
          </a>
        ) : null}
      </form>
    );
  };