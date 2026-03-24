type SmallPostProps = {
    name: string,
    manual: string;
    picture: string;
    description: string;
    availability: string;
};

export const SmallPostType = ({
    name,
    manual,
    picture,
    description,
    availability,
}: SmallPostProps) => (
    <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 class="text-lg font-bold text-[#003865] mb-2">{name}</h3>
        <p class="text-sm text-gray-600 mb-4">{description}</p>
        <div class="space-y-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <div class="flex justify-between">
                <span>Availability:</span>
                <span class="text-emerald-600">{availability}</span>
            </div>
            <a href={manual} target="_blank" class="block py-2 text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-blue-700">
                View Manual
            </a>
        </div>
    </div>
);