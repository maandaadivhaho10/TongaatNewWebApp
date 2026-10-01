import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";

const mills = [
  "Amatikulu Mill",
  "Maidstone Mill",
  "Felixton Mill",
  "Darnall Mill",
  "Komati Mill",
  "Malelane Mill",
  "Other",
];

export default function FarmDetails({ onNext }) {
  const [farmName, setFarmName] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [closestMill, setClosestMill] = useState("");
  const [showMills, setShowMills] = useState(false);

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setFarmLocation(`${latitude}, ${longitude}`);
      },
      (error) => {
        console.error("Location error:", error);
        alert("Unable to get your current location.");
      }
    );
  };

  const handleNext = () => {
    const farmData = {
      farm_name: farmName,
      farm_size: farmSize ? Number(farmSize) : null,
      farm_size_unit: "hectares",
      location: farmLocation || null,
      closest_milling: closestMill || null,
    };

    console.log("========== FARM REGISTRATION DATA ==========");
    console.log("Farm:", farmData);
    console.log("============================================");

    if (onNext) {
      onNext(farmData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Progress / Step Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#0A1A74] text-sm font-bold text-white">
              2
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Registration Step 2
              </p>

              <h1 className="text-2xl font-bold text-[#0A1A74]">
                Farm Details & Location
              </h1>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full bg-gray-200">
            <div className="h-1 w-2/3 bg-[#0A1A74]" />
          </div>
        </div>

        {/* Main Card */}
        <div className="border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Section title */}
          <div className="mb-7">
            <h2 className="text-xl font-bold text-gray-900">
              Farm Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Provide the details and location of your farm.
            </p>
          </div>

          <div className="space-y-6">

            {/* Farm Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Farm Name
              </label>

              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="Enter farm name"
                className="
                  h-12
                  w-full
                  rounded-none
                  border
                  border-gray-300
                  bg-white
                  px-4
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#0A1A74]
                  focus:ring-1
                  focus:ring-[#0A1A74]
                "
              />
            </div>

            {/* Farm Size */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Farm Size (Hectares)
              </label>

              <input
                type="number"
                min="0"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                placeholder="Enter farm size"
                className="
                  h-12
                  w-full
                  rounded-none
                  border
                  border-gray-300
                  bg-white
                  px-4
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#0A1A74]
                  focus:ring-1
                  focus:ring-[#0A1A74]
                "
              />
            </div>

            {/* Farm Location */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Farm Location
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  placeholder="Enter farm location"
                  className="
                    h-12
                    w-full
                    rounded-none
                    border
                    border-gray-300
                    bg-white
                    px-4
                    pr-12
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-[#0A1A74]
                    focus:ring-1
                    focus:ring-[#0A1A74]
                  "
                />

                <button
                  type="button"
                  onClick={handleLocation}
                  className="
                    absolute
                    right-0
                    top-0
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    text-[#0A1A74]
                    hover:bg-gray-100
                  "
                  title="Use current location"
                >
                  <MapPin size={20} />
                </button>
              </div>
            </div>

            {/* Current Location Button */}
            <button
              type="button"
              onClick={handleLocation}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-none
                border
                border-[#0A1A74]
                bg-white
                px-4
                text-sm
                font-semibold
                text-[#0A1A74]
                transition
                hover:bg-[#0A1A74]
                hover:text-white
              "
            >
              <MapPin size={19} />

              <span>
                Use Current Location
              </span>
            </button>

            {/* Closest Mill */}
            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Closest Milling Operation
              </label>

              <button
                type="button"
                onClick={() => setShowMills(!showMills)}
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-between
                  rounded-none
                  border
                  border-gray-300
                  bg-white
                  px-4
                  text-left
                  text-sm
                  outline-none
                  transition
                  hover:border-gray-400
                  focus:border-[#0A1A74]
                "
              >
                <span
                  className={
                    closestMill
                      ? "text-gray-900"
                      : "text-gray-400"
                  }
                >
                  {closestMill || "Select closest milling operation"}
                </span>

                <ChevronDown
                  size={19}
                  className={`transition ${
                    showMills ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showMills && (
                <div className="absolute z-20 mt-1 w-full border border-gray-200 bg-white shadow-lg">

                  {mills.map((mill) => (
                    <button
                      key={mill}
                      type="button"
                      onClick={() => {
                        setClosestMill(mill);
                        setShowMills(false);
                      }}
                      className="
                        block
                        w-full
                        px-4
                        py-3
                        text-left
                        text-sm
                        text-gray-700
                        hover:bg-gray-50
                        hover:text-[#0A1A74]
                      "
                    >
                      {mill}
                    </button>
                  ))}

                </div>
              )}
            </div>

            {/* Next */}
            <div className="pt-5">

              <button
                type="button"
                onClick={handleNext}
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  rounded-none
                  bg-[#0A1A74]
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#08145c]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#0A1A74]
                  focus:ring-offset-2
                "
              >
                Next
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}