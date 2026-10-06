import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Users,
  Plus,
  MapPin,
  Clock,
  Search,
  BriefcaseBusiness,
  FileText,
  CheckCircle2,
  CalendarPlus,
} from "lucide-react";

const NAVY = "#201E64";

// ======================================================
// DUMMY DATA
// Replace with API data later
// ======================================================

const INITIAL_MEETINGS = [
  {
    id: 1,
    title: "Supplier Development Progress Meeting",
    description:
      "Quarterly progress meeting with registered suppliers to discuss business performance, challenges and support requirements.",
    date: "2026-10-12",
    time: "10:00",
    location: "Tongaat Hulett Offices",
    targetAudience: "Registered Suppliers",
    status: "SCHEDULED",
  },
  {
    id: 2,
    title: "SMME Funding Discussion",
    description:
      "Meeting to discuss available funding opportunities and the application process for qualifying businesses.",
    date: "2026-10-16",
    time: "13:30",
    location: "Microsoft Teams",
    targetAudience: "SMMEs",
    status: "SCHEDULED",
  },
  {
    id: 3,
    title: "Supplier Performance Review",
    description:
      "Review meeting to discuss supplier performance, procurement opportunities and development targets.",
    date: "2026-09-28",
    time: "09:00",
    location: "Boardroom A",
    targetAudience: "Registered Suppliers",
    status: "COMPLETED",
  },
];

const INITIAL_WORKSHOPS = [
  {
    id: 1,
    title: "Tender Readiness Workshop",
    description:
      "Workshop helping suppliers understand tender requirements, compliance documents and submission processes.",
    date: "2026-10-20",
    time: "09:00",
    location: "Training Centre",
    targetAudience: "Registered Suppliers",
    status: "SCHEDULED",
  },
  {
    id: 2,
    title: "Financial Management Workshop",
    description:
      "Business financial management training covering budgeting, cash flow and basic financial reporting.",
    date: "2026-10-25",
    time: "10:00",
    location: "Microsoft Teams",
    targetAudience: "SMMEs",
    status: "SCHEDULED",
  },
  {
    id: 3,
    title: "Business Compliance Workshop",
    description:
      "Workshop covering CIPC, SARS, B-BBEE and other important business compliance requirements.",
    date: "2026-09-18",
    time: "11:00",
    location: "Training Centre",
    targetAudience: "Registered Suppliers",
    status: "COMPLETED",
  },
];

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }) {
  const classes =
    status === "COMPLETED"
      ? "border-green-200 bg-green-50 text-green-700"
      : status === "CANCELLED"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <span
      className={`
        inline-flex
        border
        px-2
        py-1
        text-[9px]
        font-bold
        uppercase
        tracking-wide
        ${classes}
      `}
    >
      {status}
    </span>
  );
}

// ======================================================
// DATE FORMATTER
// ======================================================

function formatDate(date) {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-ZA",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

// ======================================================
// EVENT CARD
// ======================================================

function EventCard({ item, type }) {
  const isMeeting = type === "meeting";

  return (
    <div
      className="
        flex
        h-full
        flex-col
        border
        border-neutral-200
        bg-white
        p-4
        shadow-sm
        transition
        hover:border-[#201E64]/30
      "
    >
      {/* TOP */}

      <div className="flex items-start justify-between gap-3">
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            bg-[#201E64]/10
          "
        >
          {isMeeting ? (
            <CalendarDays
              className="h-4 w-4"
              style={{ color: NAVY }}
            />
          ) : (
            <Users
              className="h-4 w-4"
              style={{ color: NAVY }}
            />
          )}
        </div>

        <StatusBadge status={item.status} />
      </div>

      {/* TITLE */}

      <div className="mt-3">
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-wide
            text-neutral-400
          "
        >
          {isMeeting ? "Meeting" : "Workshop"}
        </p>

        <h3
          className="
            mt-1
            text-sm
            font-bold
            leading-5
          "
          style={{ color: NAVY }}
        >
          {item.title}
        </h3>

        <p
          className="
            mt-2
            line-clamp-2
            text-xs
            leading-5
            text-neutral-500
          "
        >
          {item.description}
        </p>
      </div>

      {/* DETAILS */}

      <div
        className="
          mt-4
          space-y-2
          border-t
          border-neutral-100
          pt-3
        "
      >
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-neutral-400" />

          <span className="text-xs text-neutral-600">
            {formatDate(item.date)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0 text-neutral-400" />

          <span className="text-xs text-neutral-600">
            {item.time}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />

          <span className="truncate text-xs text-neutral-600">
            {item.location}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 shrink-0 text-neutral-400" />

          <span className="truncate text-xs text-neutral-600">
            {item.targetAudience}
          </span>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// EVENT LIST
// ======================================================

function EventList({
  items,
  type,
  search,
  setSearch,
  onCreate,
}) {
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.targetAudience.toLowerCase().includes(query)
      );
    });
  }, [items, search]);

  const label =
    type === "meeting" ? "Meetings" : "Workshops";

  return (
    <div>
      {/* SEARCH / CREATE */}

      <div
        className="
          flex
          flex-col
          gap-3
          border
          border-neutral-200
          bg-white
          p-3
          shadow-sm
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:p-4
        "
      >
        <div className="relative w-full sm:max-w-md">
          <Search
            className="
              absolute
              left-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-neutral-400
            "
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={`Search ${label.toLowerCase()}...`}
            className="
              h-10
              w-full
              border
              border-neutral-300
              bg-white
              pl-9
              pr-3
              text-xs
              outline-none
              transition
              placeholder:text-neutral-400
              focus:border-[#201E64]
              focus:ring-1
              focus:ring-[#201E64]/10
              sm:text-sm
            "
          />
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="
            inline-flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            bg-[#201E64]
            px-4
            text-xs
            font-bold
            text-white
            transition
            hover:bg-[#2B2889]
            sm:w-auto
          "
        >
          <Plus className="h-4 w-4" />

          Create {type === "meeting" ? "Meeting" : "Workshop"}
        </button>
      </div>

      {/* COUNT */}

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
        "
      >
        <h2
          className="text-sm font-bold sm:text-base"
          style={{ color: NAVY }}
        >
          Created {label}
        </h2>

        <span className="text-xs text-neutral-500">
          {filteredItems.length}{" "}
          {filteredItems.length === 1 ? "result" : "results"}
        </span>
      </div>

      {/* CARDS */}

      {filteredItems.length > 0 ? (
        <div
          className="
            mt-3
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          {filteredItems.map((item) => (
            <EventCard
              key={item.id}
              item={item}
              type={type}
            />
          ))}
        </div>
      ) : (
        <div
          className="
            mt-3
            border
            border-neutral-200
            bg-white
            px-4
            py-10
            text-center
          "
        >
          <Search className="mx-auto h-6 w-6 text-neutral-300" />

          <p className="mt-3 text-sm font-bold text-neutral-700">
            No {label.toLowerCase()} found
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            Try using a different search.
          </p>
        </div>
      )}
    </div>
  );
}

// ======================================================
// CREATE EVENT FORM
// ======================================================

function CreateEventForm({
  onCreateMeeting,
  onCreateWorkshop,
}) {
  const [eventType, setEventType] =
    useState("meeting");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    targetAudience: "Registered Suppliers",
  });

  const [successMessage, setSuccessMessage] =
    useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccessMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.date ||
      !form.time ||
      !form.location.trim()
    ) {
      return;
    }

    const newItem = {
      ...form,
      status: "SCHEDULED",
    };

    if (eventType === "meeting") {
      onCreateMeeting(newItem);

      setSuccessMessage(
        "Meeting created successfully."
      );
    } else {
      onCreateWorkshop(newItem);

      setSuccessMessage(
        "Workshop created successfully."
      );
    }

    setForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      targetAudience: "Registered Suppliers",
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* TITLE */}

      <div className="mb-4">
        <h2
          className="text-base font-bold sm:text-lg"
          style={{ color: NAVY }}
        >
          Create Meeting or Workshop
        </h2>

        <p className="mt-1 text-xs text-neutral-500">
          Schedule a new activity for registered suppliers.
        </p>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="
          border
          border-neutral-200
          bg-white
          p-4
          shadow-sm
          sm:p-5
        "
      >
        {/* EVENT TYPE */}

        <div>
          <label
            className="
              mb-2
              block
              text-xs
              font-semibold
              text-neutral-700
            "
          >
            Activity Type
          </label>

          <div
            className="
              grid
              grid-cols-1
              gap-2
              sm:grid-cols-2
            "
          >
            <button
              type="button"
              onClick={() =>
                setEventType("meeting")
              }
              className={`
                flex
                items-center
                gap-3
                border
                p-3
                text-left
                transition

                ${
                  eventType === "meeting"
                    ? "border-[#201E64] bg-[#201E64]/5"
                    : "border-neutral-200 bg-white hover:border-[#201E64]/30"
                }
              `}
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  bg-[#201E64]/10
                "
              >
                <CalendarDays
                  className="h-4 w-4"
                  style={{ color: NAVY }}
                />
              </div>

              <div>
                <p
                  className="text-xs font-bold"
                  style={{ color: NAVY }}
                >
                  Meeting
                </p>

                <p className="mt-0.5 text-[10px] text-neutral-500">
                  Schedule a supplier meeting
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setEventType("workshop")
              }
              className={`
                flex
                items-center
                gap-3
                border
                p-3
                text-left
                transition

                ${
                  eventType === "workshop"
                    ? "border-[#201E64] bg-[#201E64]/5"
                    : "border-neutral-200 bg-white hover:border-[#201E64]/30"
                }
              `}
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  bg-[#201E64]/10
                "
              >
                <Users
                  className="h-4 w-4"
                  style={{ color: NAVY }}
                />
              </div>

              <div>
                <p
                  className="text-xs font-bold"
                  style={{ color: NAVY }}
                >
                  Workshop
                </p>

                <p className="mt-0.5 text-[10px] text-neutral-500">
                  Schedule a supplier workshop
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* TITLE */}

        <div className="mt-5">
          <label
            htmlFor="event-title"
            className="
              mb-1.5
              block
              text-xs
              font-semibold
              text-neutral-700
            "
          >
            {eventType === "meeting"
              ? "Meeting Title"
              : "Workshop Title"}
          </label>

          <input
            id="event-title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder={
              eventType === "meeting"
                ? "Enter meeting title"
                : "Enter workshop title"
            }
            className="
              h-10
              w-full
              border
              border-neutral-300
              bg-white
              px-3
              text-xs
              outline-none
              transition
              placeholder:text-neutral-400
              focus:border-[#201E64]
              focus:ring-1
              focus:ring-[#201E64]/10
              sm:text-sm
            "
          />
        </div>

        {/* DESCRIPTION */}

        <div className="mt-4">
          <label
            htmlFor="event-description"
            className="
              mb-1.5
              block
              text-xs
              font-semibold
              text-neutral-700
            "
          >
            Description
          </label>

          <textarea
            id="event-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe the purpose of this activity..."
            className="
              min-h-[100px]
              w-full
              resize-y
              border
              border-neutral-300
              bg-white
              px-3
              py-2.5
              text-xs
              outline-none
              transition
              placeholder:text-neutral-400
              focus:border-[#201E64]
              focus:ring-1
              focus:ring-[#201E64]/10
              sm:text-sm
            "
          />
        </div>

        {/* DATE + TIME */}

        <div
          className="
            mt-4
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
          "
        >
          <div>
            <label
              htmlFor="event-date"
              className="
                mb-1.5
                block
                text-xs
                font-semibold
                text-neutral-700
              "
            >
              Date
            </label>

            <input
              id="event-date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="
                h-10
                w-full
                border
                border-neutral-300
                bg-white
                px-3
                text-xs
                outline-none
                focus:border-[#201E64]
                sm:text-sm
              "
            />
          </div>

          <div>
            <label
              htmlFor="event-time"
              className="
                mb-1.5
                block
                text-xs
                font-semibold
                text-neutral-700
              "
            >
              Time
            </label>

            <input
              id="event-time"
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="
                h-10
                w-full
                border
                border-neutral-300
                bg-white
                px-3
                text-xs
                outline-none
                focus:border-[#201E64]
                sm:text-sm
              "
            />
          </div>
        </div>

        {/* LOCATION */}

        <div className="mt-4">
          <label
            htmlFor="event-location"
            className="
              mb-1.5
              block
              text-xs
              font-semibold
              text-neutral-700
            "
          >
            Location
          </label>

          <input
            id="event-location"
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            placeholder="e.g. Training Centre or Microsoft Teams"
            className="
              h-10
              w-full
              border
              border-neutral-300
              bg-white
              px-3
              text-xs
              outline-none
              placeholder:text-neutral-400
              focus:border-[#201E64]
              sm:text-sm
            "
          />
        </div>

        {/* TARGET AUDIENCE */}

        <div className="mt-4">
          <label
            htmlFor="target-audience"
            className="
              mb-1.5
              block
              text-xs
              font-semibold
              text-neutral-700
            "
          >
            Target Audience
          </label>

          <select
            id="target-audience"
            name="targetAudience"
            value={form.targetAudience}
            onChange={handleChange}
            className="
              h-10
              w-full
              border
              border-neutral-300
              bg-white
              px-3
              text-xs
              outline-none
              focus:border-[#201E64]
              sm:text-sm
            "
          >
            <option value="Registered Suppliers">
              Registered Suppliers
            </option>

            <option value="SMMEs">
              SMMEs
            </option>

            <option value="All Businesses">
              All Businesses
            </option>
          </select>
        </div>

        {/* SUCCESS */}

        {successMessage && (
          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              border
              border-green-200
              bg-green-50
              p-3
              text-xs
              font-medium
              text-green-700
            "
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />

            {successMessage}
          </div>
        )}

        {/* SUBMIT */}

        <div
          className="
            mt-5
            flex
            justify-end
            border-t
            border-neutral-100
            pt-4
          "
        >
          <button
            type="submit"
            className="
              inline-flex
              h-10
              w-full
              items-center
              justify-center
              gap-2
              bg-[#201E64]
              px-5
              text-xs
              font-bold
              text-white
              transition
              hover:bg-[#2B2889]
              sm:w-auto
            "
          >
            <CalendarPlus className="h-4 w-4" />

            Create{" "}
            {eventType === "meeting"
              ? "Meeting"
              : "Workshop"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ======================================================
// MAIN SCREEN
// ======================================================

export default function MeetingsWorkshopsScreen() {
  const [activeTab, setActiveTab] =
    useState("meetings");

  const [meetings, setMeetings] =
    useState(INITIAL_MEETINGS);

  const [workshops, setWorkshops] =
    useState(INITIAL_WORKSHOPS);

  const [meetingSearch, setMeetingSearch] =
    useState("");

  const [workshopSearch, setWorkshopSearch] =
    useState("");

  // ======================================================
  // CREATE MEETING
  // ======================================================

  const handleCreateMeeting = (meeting) => {
    const newMeeting = {
      ...meeting,
      id: Date.now(),
    };

    setMeetings((current) => [
      newMeeting,
      ...current,
    ]);

    // Later connect your API here:
    //
    // await axios.post(
    //   "http://localhost:5000/api/meeting",
    //   meeting
    // );
  };

  // ======================================================
  // CREATE WORKSHOP
  // ======================================================

  const handleCreateWorkshop = (workshop) => {
    const newWorkshop = {
      ...workshop,
      id: Date.now(),
    };

    setWorkshops((current) => [
      newWorkshop,
      ...current,
    ]);

    // Later connect your API here:
    //
    // await axios.post(
    //   "http://localhost:5000/api/workshop",
    //   workshop
    // );
  };

  return (
    <div className="w-full">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div
        className="
          mb-5
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <h1
            className="
              text-2xl
              font-extrabold
              tracking-tight
              sm:text-3xl
            "
            style={{ color: NAVY }}
          >
            Meetings & Workshops
          </h1>

          <p
            className="
              mt-1
              max-w-2xl
              text-xs
              leading-5
              text-neutral-500
              sm:text-sm
            "
          >
            View created meetings and workshops or schedule a
            new activity for suppliers.
          </p>
        </div>
      </div>

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div
        className="
          mb-5
          grid
          grid-cols-1
          gap-3
          min-[420px]:grid-cols-2
        "
      >
        <button
          type="button"
          onClick={() =>
            setActiveTab("meetings")
          }
          className="
            flex
            items-center
            justify-between
            border
            border-neutral-200
            bg-white
            p-4
            text-left
            shadow-sm
            transition
            hover:border-[#201E64]/30
          "
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
              Meetings Created
            </p>

            <p
              className="mt-1 text-2xl font-extrabold"
              style={{ color: NAVY }}
            >
              {meetings.length}
            </p>
          </div>

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              bg-[#201E64]/10
            "
          >
            <CalendarDays
              className="h-5 w-5"
              style={{ color: NAVY }}
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("workshops")
          }
          className="
            flex
            items-center
            justify-between
            border
            border-neutral-200
            bg-white
            p-4
            text-left
            shadow-sm
            transition
            hover:border-[#201E64]/30
          "
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
              Workshops Created
            </p>

            <p
              className="mt-1 text-2xl font-extrabold"
              style={{ color: NAVY }}
            >
              {workshops.length}
            </p>
          </div>

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              bg-[#201E64]/10
            "
          >
            <Users
              className="h-5 w-5"
              style={{ color: NAVY }}
            />
          </div>
        </button>
      </div>

      {/* ==================================================
          TABS
      ================================================== */}

      <div
        className="
          overflow-x-auto
          border-b
          border-neutral-200
        "
      >
        <div
          className="
            flex
            min-w-max
            items-center
            gap-1
          "
        >
          {/* MEETINGS */}

          <button
            type="button"
            onClick={() =>
              setActiveTab("meetings")
            }
            className={`
              flex
              h-11
              items-center
              gap-2
              border-b-2
              px-4
              text-xs
              font-bold
              transition

              ${
                activeTab === "meetings"
                  ? "border-[#201E64] text-[#201E64]"
                  : "border-transparent text-neutral-500 hover:text-[#201E64]"
              }
            `}
          >
            <CalendarDays className="h-4 w-4" />

            Meetings

            <span
              className="
                bg-neutral-100
                px-2
                py-0.5
                text-[10px]
              "
            >
              {meetings.length}
            </span>
          </button>

          {/* WORKSHOPS */}

          <button
            type="button"
            onClick={() =>
              setActiveTab("workshops")
            }
            className={`
              flex
              h-11
              items-center
              gap-2
              border-b-2
              px-4
              text-xs
              font-bold
              transition

              ${
                activeTab === "workshops"
                  ? "border-[#201E64] text-[#201E64]"
                  : "border-transparent text-neutral-500 hover:text-[#201E64]"
              }
            `}
          >
            <Users className="h-4 w-4" />

            Workshops

            <span
              className="
                bg-neutral-100
                px-2
                py-0.5
                text-[10px]
              "
            >
              {workshops.length}
            </span>
          </button>

          {/* CREATE */}

          <button
            type="button"
            onClick={() =>
              setActiveTab("create")
            }
            className={`
              flex
              h-11
              items-center
              gap-2
              border-b-2
              px-4
              text-xs
              font-bold
              transition

              ${
                activeTab === "create"
                  ? "border-[#201E64] text-[#201E64]"
                  : "border-transparent text-neutral-500 hover:text-[#201E64]"
              }
            `}
          >
            <Plus className="h-4 w-4" />

            Create
          </button>
        </div>
      </div>

      {/* ==================================================
          TAB CONTENT
      ================================================== */}

      <div className="mt-5">
        {/* MEETINGS TAB */}

        {activeTab === "meetings" && (
          <EventList
            items={meetings}
            type="meeting"
            search={meetingSearch}
            setSearch={setMeetingSearch}
            onCreate={() =>
              setActiveTab("create")
            }
          />
        )}

        {/* WORKSHOPS TAB */}

        {activeTab === "workshops" && (
          <EventList
            items={workshops}
            type="workshop"
            search={workshopSearch}
            setSearch={setWorkshopSearch}
            onCreate={() =>
              setActiveTab("create")
            }
          />
        )}

        {/* CREATE TAB */}

        {activeTab === "create" && (
          <CreateEventForm
            onCreateMeeting={
              handleCreateMeeting
            }
            onCreateWorkshop={
              handleCreateWorkshop
            }
          />
        )}
      </div>
    </div>
  );
}