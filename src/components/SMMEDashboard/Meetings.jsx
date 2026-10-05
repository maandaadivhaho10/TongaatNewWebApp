import React, { useState } from "react";

const NAVY = "#201E64";

// ======================================================
// DUMMY MEETINGS
// ======================================================

const DUMMY_MEETINGS = [
  {
    meeting_id: 1,
    title: "Supplier Development Progress Meeting",
    description:
      "Monthly progress meeting to discuss supplier development activities, business performance, challenges, and upcoming opportunities.",
    meeting_date: "2026-10-08",
    meeting_time: "10:00",
    location: "Microsoft Teams",
    response_status: "PENDING",
  },
  {
    meeting_id: 2,
    title: "SMME Business Review Meeting",
    description:
      "A business review session focused on current performance, development requirements, and areas where additional support may be required.",
    meeting_date: "2026-10-14",
    meeting_time: "13:30",
    location: "Tongaat Hulett Offices",
    response_status: "PENDING",
  },
  {
    meeting_id: 3,
    title: "Enterprise Development Check-in",
    description:
      "A short check-in session with the Enterprise Development team to discuss progress and upcoming programme activities.",
    meeting_date: "2026-10-21",
    meeting_time: "09:00",
    location: "Online",
    response_status: "ACCEPTED",
  },
];

// ======================================================
// DUMMY WORKSHOPS
// ======================================================

const DUMMY_WORKSHOPS = [
  {
    workshop_id: 1,
    title: "Financial Management for SMMEs",
    description:
      "Learn practical financial management skills including budgeting, cash flow management, record keeping, and financial planning.",
    workshop_date: "2026-10-10",
    workshop_time: "09:00",
    location: "Training Centre",
    response_status: "PENDING",
  },
  {
    workshop_id: 2,
    title: "Tender Readiness Workshop",
    description:
      "This workshop will help SMMEs understand tender requirements, prepare compliant documentation, and improve their tender submissions.",
    workshop_date: "2026-10-17",
    workshop_time: "10:30",
    location: "Johannesburg Business Centre",
    response_status: "PENDING",
  },
  {
    workshop_id: 3,
    title: "Digital Skills and Business Growth",
    description:
      "A practical workshop focused on using digital tools, technology, and online platforms to improve business operations and reach new customers.",
    workshop_date: "2026-10-24",
    workshop_time: "11:00",
    location: "Microsoft Teams",
    response_status: "DECLINED",
  },
];

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function MeetingsScreen() {
  const [activeTab, setActiveTab] = useState("meetings");

  const [meetings, setMeetings] = useState(DUMMY_MEETINGS);
  const [workshops, setWorkshops] = useState(DUMMY_WORKSHOPS);

  // ======================================================
  // RESPOND TO MEETING
  // ======================================================

  const respondToMeeting = (meetingId, status) => {
    setMeetings((currentMeetings) =>
      currentMeetings.map((meeting) =>
        meeting.meeting_id === meetingId
          ? {
              ...meeting,
              response_status: status,
            }
          : meeting
      )
    );
  };

  // ======================================================
  // RESPOND TO WORKSHOP
  // ======================================================

  const respondToWorkshop = (workshopId, status) => {
    setWorkshops((currentWorkshops) =>
      currentWorkshops.map((workshop) =>
        workshop.workshop_id === workshopId
          ? {
              ...workshop,
              response_status: status,
            }
          : workshop
      )
    );
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-6">
        <h1
          className="text-2xl sm:text-3xl font-extrabold"
          style={{ color: NAVY }}
        >
          Meetings & Workshops
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          View upcoming meetings and workshops and confirm whether you will
          attend.
        </p>
      </div>

      {/* ==================================================
          TABS
      ================================================== */}

      <div className="mb-5 border-b border-neutral-200">
        <div className="flex gap-1 overflow-x-auto">

          {/* MEETINGS TAB */}

          <button
            type="button"
            onClick={() => setActiveTab("meetings")}
            className={`
              whitespace-nowrap
              px-4
              py-2.5
              text-sm
              font-semibold
              border-b-2
              transition-colors
              ${
                activeTab === "meetings"
                  ? "border-[#201E64] text-[#201E64]"
                  : "border-transparent text-neutral-500 hover:text-[#201E64]"
              }
            `}
          >
            Meetings ({meetings.length})
          </button>

          {/* WORKSHOPS TAB */}

          <button
            type="button"
            onClick={() => setActiveTab("workshops")}
            className={`
              whitespace-nowrap
              px-4
              py-2.5
              text-sm
              font-semibold
              border-b-2
              transition-colors
              ${
                activeTab === "workshops"
                  ? "border-[#201E64] text-[#201E64]"
                  : "border-transparent text-neutral-500 hover:text-[#201E64]"
              }
            `}
          >
            Workshops ({workshops.length})
          </button>

        </div>
      </div>

      {/* ==================================================
          MEETINGS
      ================================================== */}

      {activeTab === "meetings" && (
        <>
          {meetings.length === 0 ? (
            <EmptyState
              title="No meetings available"
              description="There are currently no meetings scheduled."
            />
          ) : (
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-4
              "
            >
              {meetings.map((meeting) => (
                <EventCard
                  key={meeting.meeting_id}
                  type="Meeting"
                  title={meeting.title}
                  description={meeting.description}
                  date={formatDate(meeting.meeting_date)}
                  time={meeting.meeting_time}
                  location={meeting.location}
                  status={meeting.response_status}
                  onAccept={() =>
                    respondToMeeting(
                      meeting.meeting_id,
                      "ACCEPTED"
                    )
                  }
                  onDecline={() =>
                    respondToMeeting(
                      meeting.meeting_id,
                      "DECLINED"
                    )
                  }
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ==================================================
          WORKSHOPS
      ================================================== */}

      {activeTab === "workshops" && (
        <>
          {workshops.length === 0 ? (
            <EmptyState
              title="No workshops available"
              description="There are currently no workshops scheduled."
            />
          ) : (
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-4
              "
            >
              {workshops.map((workshop) => (
                <EventCard
                  key={workshop.workshop_id}
                  type="Workshop"
                  title={workshop.title}
                  description={workshop.description}
                  date={formatDate(workshop.workshop_date)}
                  time={workshop.workshop_time}
                  location={workshop.location}
                  status={workshop.response_status}
                  onAccept={() =>
                    respondToWorkshop(
                      workshop.workshop_id,
                      "ACCEPTED"
                    )
                  }
                  onDecline={() =>
                    respondToWorkshop(
                      workshop.workshop_id,
                      "DECLINED"
                    )
                  }
                />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}

// ======================================================
// EVENT CARD
// ======================================================

function EventCard({
  type,
  title,
  description,
  date,
  time,
  location,
  status,
  onAccept,
  onDecline,
}) {
  const currentStatus = status?.toUpperCase() || "PENDING";

  return (
    <div
      className="
        flex
        flex-col
        bg-white
        border
        border-neutral-200
        p-4
        shadow-sm
        transition
        hover:shadow-md
      "
    >

      {/* ==================================================
          CARD HEADER
      ================================================== */}

      <div className="flex items-start justify-between gap-2">

        <div className="min-w-0">

          {/* TYPE */}

          <span
            className="
              inline-block
              mb-2
              px-2
              py-1
              bg-[#201E64]/10
              text-[#201E64]
              text-[10px]
              font-bold
              uppercase
              tracking-wide
            "
          >
            {type}
          </span>

          {/* TITLE */}

          <h2 className="text-base font-bold leading-5 text-neutral-900">
            {title}
          </h2>

        </div>

        {/* STATUS */}

        {currentStatus !== "PENDING" && (
          <ResponseBadge status={currentStatus} />
        )}

      </div>

      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      {description && (
        <p
          className="
            mt-2
            text-xs
            leading-5
            text-neutral-500
            line-clamp-2
          "
        >
          {description}
        </p>
      )}

      {/* ==================================================
          DETAILS
      ================================================== */}

      <div
        className="
          mt-4
          border-t
          border-neutral-100
          pt-3
          space-y-2
        "
      >
        <Detail
          label="Date"
          value={date}
        />

        <Detail
          label="Time"
          value={time || "Not specified"}
        />

        <Detail
          label="Location"
          value={location || "Not specified"}
        />
      </div>

      {/* ==================================================
          BUTTONS
      ================================================== */}

      <div className="mt-4">
        <ResponseButtons
          status={currentStatus}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      </div>

    </div>
  );
}

// ======================================================
// RESPONSE BUTTONS
// ======================================================

function ResponseButtons({
  status,
  onAccept,
  onDecline,
}) {
  const currentStatus = status?.toUpperCase() || "PENDING";

  return (
    <div className="flex gap-2">

      {/* ACCEPT */}

      <button
        type="button"
        onClick={onAccept}
        className={`
          flex-1
          px-3
          py-2
          border
          text-xs
          font-bold
          transition-colors

          ${
            currentStatus === "ACCEPTED"
              ? "bg-[#201E64] border-[#201E64] text-white"
              : "bg-white border-[#201E64] text-[#201E64] hover:bg-[#201E64] hover:text-white"
          }
        `}
      >
        {currentStatus === "ACCEPTED"
          ? "Accepted"
          : "Accept"}
      </button>

      {/* DECLINE */}

      <button
        type="button"
        onClick={onDecline}
        className={`
          flex-1
          px-3
          py-2
          border
          text-xs
          font-bold
          transition-colors

          ${
            currentStatus === "DECLINED"
              ? "bg-red-600 border-red-600 text-white"
              : "bg-white border-red-200 text-red-600 hover:bg-red-50"
          }
        `}
      >
        {currentStatus === "DECLINED"
          ? "Declined"
          : "Decline"}
      </button>

    </div>
  );
}

// ======================================================
// RESPONSE BADGE
// ======================================================

function ResponseBadge({ status }) {
  const currentStatus = status?.toUpperCase();

  if (
    currentStatus !== "ACCEPTED" &&
    currentStatus !== "DECLINED"
  ) {
    return null;
  }

  const styles = {
    ACCEPTED:
      "bg-green-50 text-green-700 border-green-200",

    DECLINED:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`
        shrink-0
        px-2
        py-1
        border
        text-[10px]
        font-bold
        ${styles[currentStatus]}
      `}
    >
      {currentStatus}
    </span>
  );
}

// ======================================================
// DETAILS
// ======================================================

function Detail({ label, value }) {
  return (
    <div className="flex items-start gap-3">

      <span
        className="
          w-16
          shrink-0
          text-[10px]
          font-bold
          uppercase
          tracking-wide
          text-neutral-400
        "
      >
        {label}
      </span>

      <span
        className="
          min-w-0
          break-words
          text-xs
          font-medium
          text-neutral-700
        "
      >
        {value}
      </span>

    </div>
  );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState({
  title,
  description,
}) {
  return (
    <div
      className="
        bg-white
        border
        border-neutral-200
        p-8
        text-center
      "
    >
      <h3 className="text-lg font-bold text-[#201E64]">
        {title}
      </h3>

      <p className="mt-1 text-sm text-neutral-500">
        {description}
      </p>
    </div>
  );
}