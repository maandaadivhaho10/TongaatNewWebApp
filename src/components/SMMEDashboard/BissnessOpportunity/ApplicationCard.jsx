import React, { useState } from "react";
import { NAVY, TYPE_LABEL, STATUS_STYLES, formatDate, formatPrice, formatStatus } from "./opportunitiesService";

export default function ApplicationCard({ item, onView }) {

  const [showFull, setShowFull] = useState(false);



  const isTender = item.type === "tender";



  const statusKey = String(item.status || "submitted")

    .toLowerCase()

    .replace(/\s+/g, "_");



  const statusClass =

    STATUS_STYLES[statusKey] || "bg-neutral-200 text-neutral-700";



  const proposal = item.proposal || "";

  const PROPOSAL_LIMIT = 110;

  const isLongProposal = proposal.length > PROPOSAL_LIMIT;



  const shownProposal =

    showFull || !isLongProposal

      ? proposal

      : `${proposal.substring(0, PROPOSAL_LIMIT).trim()}...`;



  return (

    <article className="flex h-full min-w-0 flex-col overflow-hidden border border-neutral-200 bg-white shadow-sm transition duration-200 hover:shadow-md">

      <div className="flex h-full flex-1 flex-col p-4">

        {/* BADGES */}

        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">

          <span

            className="inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white"

            style={{ backgroundColor: isTender ? "#0F766E" : NAVY }}

          >

            {TYPE_LABEL[item.type]}

          </span>



          <span

            className={`inline-flex items-center px-2 py-1 text-[10px] font-semibold ${statusClass}`}

          >

            {formatStatus(item.status)}

          </span>

        </div>



        {/* TITLE */}

        <h3

          className="break-words text-base font-bold leading-5"

          style={{ color: NAVY }}

        >

          {item.title}

        </h3>



        {/* PROPOSAL */}

        {proposal && (

          <div className="mt-2">

            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">

              Your proposal

            </p>



            <p className="mt-0.5 break-words text-xs leading-5 text-neutral-500">

              {shownProposal}

            </p>



            {isLongProposal && (

              <button

                type="button"

                onClick={() => setShowFull((previous) => !previous)}

                className="mt-1 text-xs font-semibold hover:underline"

                style={{ color: NAVY }}

              >

                {showFull ? "See less" : "See more"}

              </button>

            )}

          </div>

        )}



        {/* DETAILS */}

        <dl className="mt-3 space-y-2 border-t border-neutral-100 pt-3">

          <div className="flex items-start gap-3">

            <dt className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-wide text-neutral-400">

              Applied

            </dt>

            <dd className="text-xs font-medium text-neutral-700">

              {formatDate(item.appliedAt)}

            </dd>

          </div>



          {!isTender && (

            <div className="flex items-start gap-3">

              <dt className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-wide text-neutral-400">

                Quote

              </dt>

              <dd className="text-xs font-medium text-neutral-700">

                {formatPrice(item.quoted_price)}

              </dd>

            </div>

          )}



          <div className="flex items-start gap-3">

            <dt className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-wide text-neutral-400">

              Closes

            </dt>

            <dd className="text-xs font-medium text-neutral-700">

              {formatDate(item.closing)}

            </dd>

          </div>



          {item.location && (

            <div className="flex items-start gap-3">

              <dt className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-wide text-neutral-400">

                Location

              </dt>

              <dd className="min-w-0 break-words text-xs font-medium text-neutral-700">

                {item.location}

              </dd>

            </div>

          )}

        </dl>



        {/* ACTIONS */}

        <div className="mt-auto flex gap-2 pt-4">

          <button

            type="button"

            onClick={() => onView(item)}

            disabled={!item.document_url}

            className="flex flex-1 items-center justify-center border px-2 py-2 text-center text-xs font-bold transition hover:bg-[#201E64]/5 disabled:cursor-not-allowed disabled:opacity-40"

            style={{ borderColor: NAVY, color: NAVY }}

          >

            View Document

          </button>



          {item.quotation_link && (

            <a

              href={item.quotation_link}

              target="_blank"

              rel="noopener noreferrer"

              className="flex flex-1 items-center justify-center px-3 py-2 text-center text-xs font-bold text-white transition hover:opacity-90"

              style={{ backgroundColor: NAVY }}

            >

              My Quotation

            </a>

          )}

        </div>

      </div>

    </article>

  );

}



// ======================================================

// OPPORTUNITIES PAGE

// ======================================================
