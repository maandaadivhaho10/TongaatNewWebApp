import React from "react";
import { NAVY, TYPE_LABEL } from "./opportunitiesService";

export default function DocumentViewerModal({ opportunity, onClose }) {

  if (!opportunity) return null;



  return (

    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3">

      <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-3 border-b border-neutral-200 px-4 py-3">

          <div className="min-w-0">

            <p

              className="text-[10px] font-bold uppercase tracking-wide"

              style={{ color: NAVY }}

            >

              {TYPE_LABEL[opportunity.type]} Document

            </p>



            <h2

              className="mt-1 truncate text-lg font-bold"

              style={{ color: NAVY }}

            >

              {opportunity.title}

            </h2>

          </div>



          <button

            type="button"

            onClick={onClose}

            className="flex h-8 w-8 shrink-0 items-center justify-center text-xl text-neutral-500 hover:bg-neutral-100"

          >

            ×

          </button>

        </div>



        {/* DOCUMENT */}

        <div className="min-h-0 flex-1 bg-neutral-100">

          {opportunity.document_url ? (

            <iframe

              src={opportunity.document_url}

              title={`${opportunity.title} document`}

              className="h-full w-full border-0"

            />

          ) : (

            <div className="flex h-full items-center justify-center">

              <p className="text-sm text-neutral-500">Document unavailable.</p>

            </div>

          )}

        </div>



        {/* FOOTER */}

        <div className="flex justify-end border-t border-neutral-200 p-3">

          <button

            type="button"

            onClick={onClose}

            className="border border-neutral-300 px-4 py-2 text-xs font-semibold hover:bg-neutral-50"

          >

            Close

          </button>

        </div>

      </div>

    </div>

  );

}



// ======================================================

// RFQ APPLICATION MODAL

// ======================================================
