import React, { useState } from "react";
import { NAVY, TYPE_LABEL, daysUntil, formatDate } from "./opportunitiesService";

export default function OpportunityCard({

  item,

  applied,

  applying,

  error,

  onView,

  onApplyRfq,

  onApplyTender,

}) {

  const [showFullDescription, setShowFullDescription] = useState(false);



  const daysLeft = daysUntil(item.closing);



  const closingSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 14;



  const isTender = item.type === "tender";



  const description = item.description || "No description provided.";



  const DESCRIPTION_LIMIT = 90;



  const isLongDescription = description.length > DESCRIPTION_LIMIT;



  const displayedDescription =

    showFullDescription || !isLongDescription

      ? description

      : `${description.substring(0, DESCRIPTION_LIMIT).trim()}...`;



  return (

    <article className="flex h-full min-w-0 flex-col overflow-hidden border border-neutral-200 bg-white shadow-sm transition duration-200 hover:shadow-md">

      <div className="flex h-full flex-1 flex-col p-4">

        {/* BADGES */}

        <div className="mb-2 flex flex-wrap items-center gap-2">

          <span

            className="inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white"

            style={{ backgroundColor: isTender ? "#0F766E" : NAVY }}

          >

            {TYPE_LABEL[item.type]}

          </span>



          {closingSoon && (

            <span className="inline-flex items-center bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800">

              Closes in {daysLeft} {daysLeft === 1 ? "day" : "days"}

            </span>

          )}

        </div>



        {/* TITLE */}

        <h3

          className="break-words text-base font-bold leading-5"

          style={{ color: NAVY }}

        >

          {item.title}

        </h3>



        {/* DESCRIPTION */}

        <div className="mt-2">

          <p className="break-words text-xs leading-5 text-neutral-500">

            {displayedDescription}

          </p>



          {isLongDescription && (

            <button

              type="button"

              onClick={() => setShowFullDescription((previous) => !previous)}

              className="mt-1 text-xs font-semibold hover:underline"

              style={{ color: NAVY }}

            >

              {showFullDescription ? "See less" : "See more"}

            </button>

          )}

        </div>



        {/* DETAILS */}

        <dl className="mt-3 space-y-2 border-t border-neutral-100 pt-3">

          {/* LOCATION */}

          <div className="flex items-start gap-3">

            <dt className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-wide text-neutral-400">

              Location

            </dt>

            <dd className="min-w-0 break-words text-xs font-medium text-neutral-700">

              {item.location || "Not specified"}

            </dd>

          </div>



          {/* CLOSING */}

          <div className="flex items-start gap-3">

            <dt className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-wide text-neutral-400">

              Closes

            </dt>

            <dd className="text-xs font-medium text-neutral-700">

              {formatDate(item.closing)}

            </dd>

          </div>

        </dl>



        {/* ERROR */}

        {error && (

          <div className="mt-3 border border-red-200 bg-red-50 px-3 py-2">

            <p className="break-words text-xs text-red-700" role="alert">

              {error}

            </p>

          </div>

        )}



        {/* ACTIONS */}

        <div className="mt-auto flex gap-2 pt-4">

          {/* VIEW DOCUMENT */}

          <button

            type="button"

            onClick={() => onView(item)}

            disabled={!item.document_url}

            className="flex flex-1 items-center justify-center border px-2 py-2 text-center text-xs font-bold transition hover:bg-[#201E64]/5 disabled:cursor-not-allowed disabled:opacity-40"

            style={{ borderColor: NAVY, color: NAVY }}

          >

            View Document

          </button>



          {/* APPLY */}

          {isTender ? (

            <button

              type="button"

              disabled={applied || applying}

              onClick={() => onApplyTender(item)}

              className="flex flex-1 items-center justify-center px-3 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"

              style={{ backgroundColor: applied ? "#0F766E" : NAVY }}

            >

              {applied ? "Applied" : applying ? "Applying..." : "Apply"}

            </button>

          ) : (

            <button

              type="button"

              disabled={applied}

              onClick={() => onApplyRfq(item)}

              className="flex flex-1 items-center justify-center px-3 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"

              style={{ backgroundColor: applied ? "#0F766E" : NAVY }}

            >

              {applied ? "Applied" : "Apply"}

            </button>

          )}

        </div>

      </div>

    </article>

  );

}



// ======================================================

// APPLICATION CARD (MY APPLICATIONS TAB)

// ======================================================
