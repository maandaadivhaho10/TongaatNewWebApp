import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Warehouse, ArrowLeft, ArrowRight } from 'lucide-react';
import GrowerOptionCard from './Groweroptioncard ';

const NAVY = '#201E64';
const NAVY_HOVER = '#2B2889';

const options = [
  {
    id: 'agri-grower',
    icon: Sprout,
    title: 'Agri Growers',
    description: 'I grow sugarcane on my own land and supply a mill directly.',
    route: '/register/farmer',
  },
  {
    id: 'supplier',
    icon: Warehouse,
    title: 'Supplier',
    description: 'I run a business providing services or supply-chain support.',
    route: '/register/smme',
  },
];

export default function GrowerTypeSelector() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    const choice = options.find((o) => o.id === selected);
    if (choice) navigate(choice.route);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-neutral-50">
      <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-3xl">

          {/* Heading */}
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: NAVY }}
            >
              How would you like to get started?
            </h1>

            <p className="text-sm sm:text-base text-neutral-600">
              Choose the option that best describes you.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {options.map((o) => (
              <GrowerOptionCard
                key={o.id}
                option={o}
                isSelected={selected === o.id}
                onClick={() => setSelected(o.id)}
              />
            ))}
          </div>

          {/* Back / Next */}
          <div className="mt-8 sm:mt-10 flex items-center justify-between gap-3">

            {/* Back */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white hover:bg-neutral-50 text-neutral-900 text-sm font-medium border border-neutral-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                '--tw-ring-color': NAVY,
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!selected}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-white text-sm font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed disabled:shadow-none"
              style={{
                backgroundColor: selected ? NAVY : undefined,
                '--tw-ring-color': NAVY,
              }}
              onMouseEnter={(e) => {
                if (selected) {
                  e.currentTarget.style.backgroundColor = NAVY_HOVER;
                }
              }}
              onMouseLeave={(e) => {
                if (selected) {
                  e.currentTarget.style.backgroundColor = NAVY;
                }
              }}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
