import React, { useCallback, useEffect, useState } from "react";
import api from "../../../API/axiosInstance";
import { useAuth } from "../../../context/AuthContext";

import OpportunityCard from "./OpportunityCard";
import ApplicationCard from "./ApplicationCard";
import RfqApplyModal from "./RfqApplyModal";
import DocumentViewerModal from "./DocumentViewerModal";

import {
  NAVY,
  TABS,
  TYPE_LABEL,
  RFQ_ENDPOINT,
  TENDER_ENDPOINT,
  RFQ_APPLICATIONS_ENDPOINT,
  TENDER_APPLICATIONS_ENDPOINT,
  loadList,
  loadApplications,
  apiError,
} from "./opportunitiesService";

export default function Opportunities() {

  const { user, isAuthenticated, loading: authLoading } = useAuth();



  const userId = user?.user_id;



  const [opportunities, setOpportunities] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadErrors, setLoadErrors] = useState([]);



  const [applications, setApplications] = useState([]);

  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const [applicationErrors, setApplicationErrors] = useState([]);



  const [activeTab, setActiveTab] = useState("all");



  const [rfqModalItem, setRfqModalItem] = useState(null);

  const [documentItem, setDocumentItem] = useState(null);



  const [appliedKeys, setAppliedKeys] = useState({});

  const [applyingKey, setApplyingKey] = useState(null);

  const [errors, setErrors] = useState({});



  const keyOf = (item) => `${item.type}-${item.id}`;



  // ======================================================

  // LOAD OPPORTUNITIES

  // ======================================================



  useEffect(() => {

    let cancelled = false;



    async function load() {

      setLoading(true);



      const [rfqs, tenders] = await Promise.allSettled([

        loadList(RFQ_ENDPOINT, "rfq"),

        loadList(TENDER_ENDPOINT, "tender"),

      ]);



      if (cancelled) return;



      const merged = [

        ...(rfqs.status === "fulfilled" ? rfqs.value : []),

        ...(tenders.status === "fulfilled" ? tenders.value : []),

      ].sort((a, b) => new Date(a.closing) - new Date(b.closing));



      setOpportunities(merged);



      setLoadErrors(

        [rfqs, tenders]

          .filter((result) => result.status === "rejected")

          .map(

            (result) => result.reason?.message || "Failed to load opportunities."

          )

      );



      setLoading(false);

    }



    load();



    return () => {

      cancelled = true;

    };

  }, []);



  // ======================================================

  // LOAD MY APPLICATIONS

  // ======================================================



  const fetchApplications = useCallback(async () => {

    if (!isAuthenticated || !userId) return;



    setApplicationsLoading(true);



    const [rfqs, tenders] = await Promise.allSettled([

      loadApplications(`${RFQ_APPLICATIONS_ENDPOINT}/${userId}`, "rfq"),

      loadApplications(`${TENDER_APPLICATIONS_ENDPOINT}/${userId}`, "tender", {

        ignoreNotFound: true,

      }),

    ]);



    const merged = [

      ...(rfqs.status === "fulfilled" ? rfqs.value : []),

      ...(tenders.status === "fulfilled" ? tenders.value : []),

    ].sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0));



    setApplications(merged);



    setApplicationErrors(

      [rfqs, tenders]

        .filter((result) => result.status === "rejected")

        .map(

          (result) => result.reason?.message || "Failed to load applications."

        )

    );



    setApplicationsLoading(false);

  }, [isAuthenticated, userId]);



  useEffect(() => {

    if (authLoading) return;

    fetchApplications();

  }, [authLoading, fetchApplications]);



  // Anything already applied shows "Applied" on the opportunity cards.

  const appliedFromServer = applications.reduce((acc, application) => {

    if (application.opportunityId != null) {

      acc[`${application.type}-${application.opportunityId}`] = true;

    }

    return acc;

  }, {});



  // ======================================================

  // COUNTS

  // ======================================================



  const counts = {

    all: opportunities.length,

    rfq: opportunities.filter((item) => item.type === "rfq").length,

    tender: opportunities.filter((item) => item.type === "tender").length,

    applications: applications.length,

  };



  // ======================================================

  // FILTER

  // ======================================================



  const showingApplications = activeTab === "applications";



  const visible =

    activeTab === "all" || showingApplications

      ? opportunities

      : opportunities.filter((item) => item.type === activeTab);



  // ======================================================

  // MARK APPLIED

  // ======================================================



  const markApplied = (item) => {

    setAppliedKeys((prev) => ({

      ...prev,

      [keyOf(item)]: true,

    }));



    // Pull the new application into the My Applications tab.

    fetchApplications();

  };



  // ======================================================

  // TENDER APPLY

  // ======================================================



  const handleTenderApply = async (item) => {

    const key = keyOf(item);



    if (!window.confirm(`Apply for "${item.title}"?`)) {

      return;

    }



    setErrors((prev) => ({ ...prev, [key]: "" }));

    setApplyingKey(key);



    try {

      try {

        if (!item.id) {

          throw new Error("Tender ID is missing.");

        }



        await api.post("/tender-responses/apply", {

          tender_id: item.id,

        });

      } catch (error) {

        throw new Error(

          apiError(error, "Failed to submit tender application.")

        );

      }



      markApplied(item);

    } catch (err) {

      console.error(err);



      setErrors((prev) => ({

        ...prev,

        [key]: err.message || "Something went wrong. Please try again.",

      }));

    } finally {

      setApplyingKey(null);

    }

  };



  // ======================================================

  // UI

  // ======================================================



  return (

    <>

      <section

        id="opportunities"

        className="w-full overflow-x-hidden bg-[#F5F6FA] pb-10 text-neutral-900"

      >

        <div className="mx-auto w-full max-w-7xl">

          {/* HEADER */}

          <div>

            <h2

              className="text-2xl font-extrabold tracking-tight sm:text-3xl"

              style={{ color: NAVY }}

            >

              Business Opportunities

            </h2>



            <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-500">

              Browse current RFQs and tenders open to registered suppliers.

              RFQs require a quotation, while tenders allow you to apply

              directly. Track everything you have applied for under My

              Applications.

            </p>

          </div>



          {/* TABS */}

          <div

            role="tablist"

            aria-label="Opportunity type"

            className="mt-5 flex max-w-full gap-1 overflow-x-auto border-b border-neutral-200"

          >

            {TABS.map((tab) => {

              const active = activeTab === tab.key;



              return (

                <button

                  key={tab.key}

                  role="tab"

                  type="button"

                  aria-selected={active}

                  onClick={() => {

                    setActiveTab(tab.key);



                    if (tab.key === "applications") fetchApplications();

                  }}

                  className={`-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold ${

                    active

                      ? ""

                      : "border-transparent text-neutral-500 hover:text-neutral-900"

                  }`}

                  style={

                    active ? { borderColor: NAVY, color: NAVY } : undefined

                  }

                >

                  {tab.label}



                  <span className="ml-2 text-xs font-medium text-neutral-500">

                    {counts[tab.key]}

                  </span>

                </button>

              );

            })}

          </div>



          {/* ERRORS */}

          {(showingApplications ? applicationErrors : loadErrors).map(

            (message) => (

              <div

                key={message}

                className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"

              >

                {message}

              </div>

            )

          )}



          {/* ==================================================

              MY APPLICATIONS TAB

          ================================================== */}

          {showingApplications ? (

            !authLoading && !isAuthenticated ? (

              <div className="mt-5 border border-neutral-200 bg-white p-8 text-center">

                <p className="font-semibold text-neutral-900">

                  Log in to see your applications

                </p>

              </div>

            ) : applicationsLoading && applications.length === 0 ? (

              <div className="mt-5">

                <p className="text-sm text-neutral-500">

                  Loading your applications...

                </p>

              </div>

            ) : applications.length > 0 ? (

              <div className="mt-5 grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">

                {applications.map((item, index) => (

                  <ApplicationCard

                    key={`${item.type}-${item.applicationId ?? item.opportunityId ?? index}`}

                    item={item}

                    onView={setDocumentItem}

                  />

                ))}

              </div>

            ) : (

              <div className="mt-5 border border-neutral-200 bg-white p-8 text-center">

                <p className="font-semibold text-neutral-900">

                  You haven't applied for anything yet

                </p>



                <p className="mt-1 text-sm text-neutral-500">

                  RFQs and tenders you apply for will appear here.

                </p>



                <button

                  type="button"

                  onClick={() => setActiveTab("all")}

                  className="mt-4 px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"

                  style={{ backgroundColor: NAVY }}

                >

                  Browse opportunities

                </button>

              </div>

            )

          ) : /* ==================================================

              OPPORTUNITY CARDS

          ================================================== */

          loading ? (

            <div className="mt-5">

              <p className="text-sm text-neutral-500">

                Loading opportunities...

              </p>

            </div>

          ) : visible.length > 0 ? (

            <div className="mt-5 grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">

              {visible.map((item) => (

                <OpportunityCard

                  key={keyOf(item)}

                  item={item}

                  applied={

                    !!appliedKeys[keyOf(item)] ||

                    !!appliedFromServer[keyOf(item)] ||

                    !!item.applied

                  }

                  applying={applyingKey === keyOf(item)}

                  error={errors[keyOf(item)]}

                  onView={setDocumentItem}

                  onApplyRfq={setRfqModalItem}

                  onApplyTender={handleTenderApply}

                />

              ))}

            </div>

          ) : (

            <div className="a">

              <p className="font-semibold text-neutral-900">

                {activeTab === "all"

                  ? "There are no opportunities open right now"

                  : `There are no ${TYPE_LABEL[activeTab]}s open right now`}

              </p>



              <p className="mt-1 text-sm text-neutral-500">

                Check back soon for new opportunities.

              </p>

            </div>

          )}

        </div>

      </section>



      {/* DOCUMENT */}

      {documentItem && (

        <DocumentViewerModal

          opportunity={documentItem}

          onClose={() => setDocumentItem(null)}

        />

      )}



      {/* RFQ APPLICATION */}

      {rfqModalItem && (

        <RfqApplyModal

          opportunity={rfqModalItem}

          onClose={() => setRfqModalItem(null)}

          onApplied={markApplied}

        />

      )}

    </>

  );

}
