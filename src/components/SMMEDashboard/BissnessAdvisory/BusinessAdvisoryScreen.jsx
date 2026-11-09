import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import AdvisoryRequestForm from "./AdvisoryRequestForm";
import MyAdvisoryRequests from "./MyAdvisoryRequests";
import { getMyAdvisoryRequests, submitAdvisoryRequest, getAdvisoryError } from "./advisoryService";

const NAVY = "#201E64";
const TABS = { NEW: "new", MINE: "mine" };

export default function BusinessAdvisoryScreen() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(TABS.NEW);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const submittingRef = useRef(false);

  const fetchMyRequests = useCallback(async () => {
    if (!isAuthenticated) return;
    setRequestsLoading(true);
    setRequestsError("");
    try {
      setRequests(await getMyAdvisoryRequests());
    } catch (err) {
      console.error("Fetch my advisory requests error:", err);
      setRequestsError(getAdvisoryError(err, "fetch"));
    } finally {
      setRequestsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !user?.user_id) return;
    fetchMyRequests();
  }, [authLoading, isAuthenticated, user?.user_id, fetchMyRequests]);

  const openTab = (tab) => {
    setActiveTab(tab);
    if (tab === TABS.MINE && !authLoading && isAuthenticated) fetchMyRequests();
  };

  const handleSubmit = async (formData) => {
    if (submittingRef.current) return false;
    setError("");
    setSuccess("");
    if (!formData.support_area || !formData.description.trim()) {
      setError("Please complete all required fields.");
      return false;
    }
    if (authLoading) {
      setError("Please wait while your session is being restored.");
      return false;
    }
    if (!isAuthenticated || !user?.user_id) {
      setError("Please log in to submit a business advisory request.");
      return false;
    }
    submittingRef.current = true;
    setLoading(true);
    try {
      const data = await submitAdvisoryRequest(formData);
      setSuccess(data?.message || "Your business advisory request has been submitted successfully.");
      fetchMyRequests();
      return true;
    } catch (err) {
      console.error("Business advisory request error:", err);
      setError(getAdvisoryError(err, "submit"));
      return false;
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const tabClass = (tab) => `relative -mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] ${activeTab === tab ? "border-[#201E64] text-[#201E64]" : "border-transparent text-neutral-500 hover:text-neutral-700"}`;

  return (
    <div className="w-full">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl" style={{ color: NAVY }}>Business Advisory</h1>
        <p className="mt-1 max-w-2xl text-sm leading-5 text-neutral-500">Request support for your business and track the requests you have already sent.</p>
      </div>
      <div role="tablist" aria-label="Business advisory" className="mb-5 flex max-w-3xl border-b border-neutral-200">
        <button type="button" role="tab" id="tab-new" aria-selected={activeTab === TABS.NEW} aria-controls="panel-new" onClick={() => openTab(TABS.NEW)} className={tabClass(TABS.NEW)}>New Request</button>
        <button type="button" role="tab" id="tab-mine" aria-selected={activeTab === TABS.MINE} aria-controls="panel-mine" onClick={() => openTab(TABS.MINE)} className={tabClass(TABS.MINE)}>
          My Requests
          {requests.length > 0 && <span className="min-w-[20px] px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white" style={{ backgroundColor: NAVY }}>{requests.length}</span>}
        </button>
      </div>
      {activeTab === TABS.NEW ? (
        <AdvisoryRequestForm loading={loading} authLoading={authLoading} error={error} success={success}
          onSubmit={handleSubmit} onEdit={() => { setError(""); setSuccess(""); }} onViewRequests={() => openTab(TABS.MINE)} />
      ) : (
        <MyAdvisoryRequests requests={requests} requestsLoading={requestsLoading} requestsError={requestsError}
          authLoading={authLoading} isAuthenticated={isAuthenticated} onRefresh={fetchMyRequests} onNewRequest={() => openTab(TABS.NEW)} />
      )}
    </div>
  );
}
