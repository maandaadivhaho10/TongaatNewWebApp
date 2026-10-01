import { Check } from 'lucide-react';

const NAVY = '#201E64';

export default function GrowerOptionCard({ option, isSelected, onClick }) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={[
        // Center the card horizontally and vertically
        'group w-full max-w-xl mx-auto h-full flex items-center justify-center text-left',

        // Responsive spacing and size
        'gap-3 sm:gap-4 lg:gap-5 rounded-2xl sm:rounded-[18px] p-4 sm:p-5 lg:p-6 border',

        'transition-all duration-150 ease-out',

        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',

        isSelected
          ? 'border-[#201E64] ring-1 ring-[#201E64] bg-[#201E64]/5 shadow-lg shadow-[#201E64]/15'
          : 'border-neutral-200 bg-white hover:border-[#201E64]/30 hover:bg-[#201E64]/5 hover:shadow-sm',
      ].join(' ')}
      style={{
        '--tw-ring-color': NAVY,
      }}
    >
      {/* Icon circle */}
      <span
        className={[
          'shrink-0 flex items-center justify-center rounded-full transition-colors duration-150',
          'w-10 h-10 sm:w-[46px] sm:h-[46px] lg:w-12 lg:h-12',
          isSelected
            ? 'bg-[#201E64] text-white'
            : 'bg-[#201E64]/5 text-[#201E64]',
        ].join(' ')}
      >
        <Icon
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] lg:w-6 lg:h-6"
          aria-hidden="true"
        />
      </span>

      {/* Title & description */}
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] sm:text-base lg:text-[17px] font-semibold text-neutral-900">
          {option.title}
        </span>

        <span className="block mt-[3px] text-[12.5px] sm:text-sm leading-[17px] sm:leading-5 text-neutral-500">
          {option.description}
        </span>
      </span>

      {/* Selection indicator */}
      <span
        className={[
          'shrink-0 flex items-center justify-center rounded-full w-[22px] h-[22px] transition-colors duration-150',
          isSelected
            ? 'bg-[#201E64]'
            : 'bg-transparent border-[1.5px] border-neutral-300',
        ].join(' ')}
        aria-hidden="true"
      >
        {isSelected && (
          <Check
            className="w-[13px] h-[13px] text-white"
            strokeWidth={3}
          />
        )}
      </span>
    </button>
  );
}
