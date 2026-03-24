type SmallPostUserProps = {
  uid: string;
  name: string;
  email: string;
};

export const SmallPostUser = ({ uid, name, email }: SmallPostUserProps) => {
  const initials =
    (name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";

  return (
    <a
      href={`/dashboard/users/${uid}`}
      class="block w-[170px] rounded-lg border bg-white p-4 shadow-xs hover:shadow-md transition font-sans no-underline text-inherit"
    >
      {/* avatar block same size as item image */}
      <div class="h-20 w-20 rounded-md border-2 border-[#003865] shadow-xs bg-[#003865]/10 flex items-center justify-center font-bold text-[#003865] text-xl">
        {initials}
      </div>

      <div class="text-lg text-gray-500">{uid}</div>
      <div class="font-semibold text-gray-900">{name}</div>
      <div class="text-sm text-gray-600 break-all">{email}</div>
    </a>
  );
};