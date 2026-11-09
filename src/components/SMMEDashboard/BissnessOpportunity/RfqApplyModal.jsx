import React, { useState } from "react";
import api from "../../../API/axiosInstance";
import { useAuth } from "../../../context/AuthContext";
import { NAVY, apiError } from "./opportunitiesService";

export default function RfqApplyModal({ opportunity, onClose, onApplied }) {

  const { user, isAuthenticated } = useAuth();



  const [proposal, setProposal] = useState("");

  const [quotedPrice, setQuotedPrice] = useState("");

  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");



    if (!proposal.trim()) {

      setError("Please enter your proposal.");

      return;

    }



    if (!quotedPrice) {

      setError("Please enter your quoted price.");

      return;

    }



    if (!file) {

      setError("Please upload your quotation document.");

      return;

    }



    try {

      setSubmitting(true);



      // Match rfqResponseController: JSON.parse(req.body.data)

      // Use the current authenticated user from React Context.

      if (!isAuthenticated || !user?.user_id) {

        throw new Error("Please log in to apply for this RFQ.");

      }



      const price = Number(quotedPrice);



      if (!Number.isFinite(price) || price <= 0) {

        throw new Error("Please enter a valid quoted price greater than zero.");

      }



      const formData = new FormData();



      formData.append(

        "data",

        JSON.stringify({

          user_id: user.user_id,

          proposal: proposal.trim(),

          quoted_price: price,

        })

      );



      formData.append("quotation_document", file);



      try {

        await api.post(`/rfq/${opportunity.id}/apply`, formData);

      } catch (error) {

        throw new Error(apiError(error, "Failed to submit RFQ application."));

      }



      onApplied(opportunity);

      onClose();

    } catch (err) {

      console.error(err);

      setError(err.message || "Something went wrong while submitting.");

    } finally {

      setSubmitting(false);

    }

  };



  return (

    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3">

      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-3 border-b border-neutral-200 p-4">

          <div>

            <p className="text-xs text-neutral-500">Apply for RFQ</p>



            <h2 className="mt-1 text-lg font-bold" style={{ color: NAVY }}>

              {opportunity.title}

            </h2>

          </div>



          <button

            type="button"

            onClick={onClose}

            className="text-xl text-neutral-500"

          >

            ×

          </button>

        </div>



        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-4 p-4">

          {/* PROPOSAL */}

          <div>

            <label className="mb-1.5 block text-xs font-semibold">

              Proposal

            </label>



            <textarea

              value={proposal}

              onChange={(e) => setProposal(e.target.value)}

              rows={4}

              placeholder="Describe your proposal..."

              className="w-full resize-y border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#201E64]"

            />

          </div>



          {/* PRICE */}

          <div>

            <label className="mb-1.5 block text-xs font-semibold">

              Quoted Price (R)

            </label>



            <input

              type="number"

              min="0"

              step="0.01"

              value={quotedPrice}

              onChange={(e) => setQuotedPrice(e.target.value)}

              placeholder="Example: 250000.00"

              className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#201E64]"

            />

          </div>



          {/* DOCUMENT */}

          <div>

            <label className="mb-1.5 block text-xs font-semibold">

              Quotation Document

            </label>



            <input

              type="file"

              accept=".pdf,.doc,.docx"

              onChange={(e) => setFile(e.target.files?.[0] || null)}

              className="w-full border border-neutral-300 p-2 text-xs"

            />



            <p className="mt-1 text-[11px] text-neutral-500">

              PDF or Word format.

            </p>



            {file && (

              <p className="mt-1 break-all text-xs font-medium">

                Selected: {file.name}

              </p>

            )}

          </div>



          {/* ERROR */}

          {error && (

            <div className="border border-red-200 bg-red-50 p-2">

              <p className="text-xs text-red-700">{error}</p>

            </div>

          )}



          {/* BUTTONS */}

          <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">

            <button

              type="button"

              onClick={onClose}

              className="border border-neutral-300 px-4 py-2 text-xs font-semibold hover:bg-neutral-50"

            >

              Cancel

            </button>



            <button

              type="submit"

              disabled={submitting}

              className="px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"

              style={{ backgroundColor: NAVY }}

            >

              {submitting ? "Submitting..." : "Submit Application"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}



// ======================================================

// OPPORTUNITY CARD

// COMPACT VERSION

// ======================================================
