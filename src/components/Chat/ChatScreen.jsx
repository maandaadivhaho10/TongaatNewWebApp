import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MessageCircle, Send, Search, ArrowLeft, Loader2, X, Inbox,
  RefreshCw, CheckCheck, ShieldCheck, MessagesSquare,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getChatConversations, getChatMessages, sendChatMessage,
  getDirectChat, sendDirectChatMessage,
} from "../../API/chatApi";
import { chatSocket } from "../../API/chatSocket";

const NAVY = "#201E64";
const errorText = (error, fallback) => error?.response?.data?.message || error?.message || fallback;
const timeText = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
};
const dateText = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return timeText(value);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
};
const dayLabel = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
};
const mergeMessages = (previous, incoming) => {
  const merged = new Map();
  [...previous, ...incoming].forEach((message) => {
    if (message?.message_id != null) merged.set(Number(message.message_id), message);
  });
  return [...merged.values()].sort((a, b) => Number(a.message_id) - Number(b.message_id));
};
const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "S";

function Avatar({ name, support = false, size = "md" }) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full font-bold ${size === "lg" ? "h-12 w-12 text-sm" : "h-11 w-11 text-xs"} ${support ? "bg-[#201E64] text-white" : "bg-indigo-100 text-[#201E64]"}`}
      aria-hidden="true"
    >
      {support ? <MessagesSquare size={22} strokeWidth={1.8} /> : initials(name)}
    </div>
  );
}

export default function ChatScreen({ initialConversationId = null }) {
  const { user } = useAuth();
  const roleId = Number(user?.role_id);
  const userId = Number(user?.user_id);
  const isSupplier = roleId === 1;
  const isED = roleId === 2;

  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const selectedIdRef = useRef(null);
  const requestRef = useRef(0);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const selectedConversation = conversations.find((item) => Number(item.conversation_id) === selectedId);

  const loadEDConversations = useCallback(async () => {
    try {
      const response = await getChatConversations();
      setConversations(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(errorText(err, "Failed to load supplier conversations"));
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadSupplierChat = useCallback(async () => {
    const requestId = ++requestRef.current;
    try {
      setLoadingMessages(true);
      const response = await getDirectChat();
      if (requestId !== requestRef.current) return;
      const chat = response.data || {};
      const id = chat.conversation?.conversation_id ? Number(chat.conversation.conversation_id) : null;
      selectedIdRef.current = id;
      setSelectedId(id);
      setMessages((previous) => mergeMessages(Array.isArray(chat.messages) ? chat.messages : [], previous.filter((m) => id && Number(m.conversation_id) === id)));
    } catch (err) {
      if (requestId === requestRef.current) setError(errorText(err, "Failed to load support messages"));
    } finally {
      if (requestId === requestRef.current) setLoadingMessages(false);
    }
  }, []);

  const loadEDMessages = useCallback(async (id) => {
    const requestId = ++requestRef.current;
    try {
      setLoadingMessages(true);
      const response = await getChatMessages(id);
      if (requestId !== requestRef.current || selectedIdRef.current !== id) return;
      const fetched = Array.isArray(response.data?.messages) ? response.data.messages : [];
      setMessages((previous) => mergeMessages(fetched, previous.filter((item) => Number(item.conversation_id) === id)));
    } catch (err) {
      if (requestId === requestRef.current) setError(errorText(err, "Failed to load messages"));
    } finally {
      if (requestId === requestRef.current) setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    if (isSupplier) {
      loadSupplierChat();
      setLoadingList(false);
    } else if (isED) {
      loadEDConversations();
      setLoadingMessages(false);
    }
  }, [userId, isSupplier, isED, loadSupplierChat, loadEDConversations]);

  // Open the exact supplier conversation passed by the ED dashboard.
  useEffect(() => {
    const id = Number(initialConversationId);
    if (!isED || !Number.isSafeInteger(id) || id <= 0 || loadingList) return;
    if (selectedIdRef.current === id) return;
    selectedIdRef.current = id;
    setSelectedId(id);
    setMessages([]);
    setError("");
    setMobileChatOpen(true);
    loadEDMessages(id);
  }, [initialConversationId, isED, loadingList, loadEDMessages]);

  const openConversation = (idValue) => {
    const id = Number(idValue);
    if (!Number.isSafeInteger(id) || id <= 0) return;
    selectedIdRef.current = id;
    setSelectedId(id);
    setMessages([]);
    setError("");
    setMobileChatOpen(true);
    loadEDMessages(id);
  };

  useEffect(() => {
    if (!userId || (!isSupplier && !isED)) return;
    const onNewConversation = () => {
      if (isED) loadEDConversations();
      else loadSupplierChat();
    };
    const onNewMessage = (event) => {
      const id = Number(event?.conversation_id);
      const incoming = event?.message;
      if (!id || !incoming) return;
      if (isED) loadEDConversations();
      if (isSupplier && !selectedIdRef.current) {
        loadSupplierChat();
        return;
      }
      if (selectedIdRef.current === id) setMessages((previous) => mergeMessages(previous, [incoming]));
    };
    const onReconnect = () => {
      if (isSupplier) loadSupplierChat();
      else {
        loadEDConversations();
        if (selectedIdRef.current) loadEDMessages(selectedIdRef.current);
      }
    };
    chatSocket.on("chat:new_conversation", onNewConversation);
    chatSocket.on("chat:new_message", onNewMessage);
    chatSocket.on("connect", onReconnect);
    return () => {
      chatSocket.off("chat:new_conversation", onNewConversation);
      chatSocket.off("chat:new_message", onNewMessage);
      chatSocket.off("connect", onReconnect);
    };
  }, [userId, isSupplier, isED, loadSupplierChat, loadEDConversations, loadEDMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    const text = messageInput.trim();
    if (!text || sending || (isED && !selectedId)) return;
    try {
      setSending(true);
      setError("");
      if (isSupplier) {
        const response = await sendDirectChatMessage(text);
        const result = response.data || {};
        const id = Number(result.conversation?.conversation_id);
        if (id) {
          selectedIdRef.current = id;
          setSelectedId(id);
        }
        if (result.message) setMessages((previous) => mergeMessages(previous, [result.message]));
      } else {
        const conversationId = selectedId;
        const response = await sendChatMessage(conversationId, text);
        if (selectedIdRef.current === conversationId && response.data) {
          const result = response.data.message || response.data;
          if (result?.message_id) setMessages((previous) => mergeMessages(previous, [result]));
        }
        loadEDConversations();
      }
      setMessageInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (err) {
      setError(errorText(err, "Failed to send message"));
    } finally {
      setSending(false);
    }
  };

  const filtered = conversations.filter((item) =>
    [item.first_name, item.last_name, item.email, item.subject, item.last_message]
      .filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const showChat = isSupplier || Boolean(selectedId);
  const isClosed = isED && selectedConversation?.status !== "OPEN";
  const supplierLabel = selectedConversation
    ? [selectedConversation.first_name, selectedConversation.last_name].filter(Boolean).join(" ") || `Supplier #${selectedConversation.smme_user_id}`
    : "Supplier";
  const headerName = isSupplier ? "ED Team Support" : supplierLabel;

  if (!isSupplier && !isED) {
    return <div className="rounded-2xl bg-white p-8 text-center text-gray-500">You do not have permission to access chat.</div>;
  }

  return (
    <div className="w-full min-w-0 bg-[#f8f9fc] px-2 py-3 sm:px-5 sm:py-4 lg:px-7">
      <div className="mx-auto max-w-[1500px]">
        {error && (
          <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="rounded-lg p-1 hover:bg-red-100" aria-label="Dismiss error"><X size={17} /></button>
          </div>
        )}

        <div className="flex h-[min(76vh,790px)] min-h-[500px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_14px_50px_-22px_rgba(25,35,80,0.26)] sm:rounded-3xl">
          {isED && (
            <aside className={`w-full shrink-0 flex-col border-r border-slate-100 bg-white md:w-[315px] lg:w-[355px] xl:w-[390px] ${mobileChatOpen ? "hidden md:flex" : "flex"}`}>
              <div className="border-b border-slate-100 px-4 pb-4 pt-5 sm:px-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Messages</h2>
                    <p className="text-xs text-slate-400">{conversations.length} supplier conversation{conversations.length === 1 ? "" : "s"}</p>
                  </div>
                  <button type="button" onClick={loadEDConversations} title="Refresh conversations" aria-label="Refresh conversations" className="rounded-xl border border-slate-100 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-[#201E64]"><RefreshCw size={17} /></button>
                </div>
                <div className="relative">
                  <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations" className="w-full rounded-xl border border-slate-100 bg-[#f6f7fb] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-2 focus:ring-indigo-50" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {loadingList ? (
                  <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#201E64]" /></div>
                ) : filtered.length === 0 ? (
                  <div className="px-6 py-16 text-center text-sm text-slate-400"><Inbox size={38} className="mx-auto mb-3 text-slate-300" />{search ? "No matching conversations" : "No supplier messages yet"}</div>
                ) : filtered.map((conversation) => {
                  const id = Number(conversation.conversation_id);
                  const name = [conversation.first_name, conversation.last_name].filter(Boolean).join(" ") || `Supplier #${conversation.smme_user_id}`;
                  const active = selectedId === id;
                  return (
                    <button key={id} type="button" onClick={() => openConversation(id)} className={`group flex w-full items-center gap-3 border-b border-slate-50 px-4 py-4 text-left transition sm:px-5 ${active ? "bg-[#f0effb]" : "hover:bg-slate-50"}`}>
                      <Avatar name={name} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className={`truncate text-sm font-bold ${active ? "text-[#201E64]" : "text-slate-800"}`}>{name}</p>
                          <span className="shrink-0 text-[10px] text-slate-400">{dateText(conversation.last_message_at || conversation.updated_at)}</span>
                        </div>
                        <p className="mt-1 truncate text-xs leading-5 text-slate-500">{conversation.last_message || conversation.subject || "Start a conversation"}</p>

                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-slate-100 px-5 py-3 text-center text-[11px] text-slate-400">Enterprise Development · Supplier Support</div>
            </aside>
          )}

          <section className={`min-w-0 flex-1 flex-col bg-[#f7f8fc] ${isSupplier || mobileChatOpen ? "flex" : "hidden md:flex"}`}>
            {!showChat ? (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-100 text-[#201E64]"><MessageCircle size={38} strokeWidth={1.6} /></div>
                <h3 className="text-xl font-bold text-slate-800">Your conversations, all in one place</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">Select a supplier from the left to view messages and reply in real time.</p>
                <div className="mt-7 flex items-center gap-2 text-xs text-slate-400"><ShieldCheck size={15} /> Secure supplier support</div>
              </div>
            ) : (
              <>
                <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 bg-white px-4 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] sm:px-6">
                  {isED && <button type="button" onClick={() => setMobileChatOpen(false)} className="-ml-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Back to suppliers"><ArrowLeft size={20} /></button>}
                  <Avatar name={headerName} support={isSupplier} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-extrabold text-slate-900 sm:text-base">{headerName}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500">
                      {isSupplier ? "Enterprise Development Team" : selectedConversation?.email || "Supplier conversation"}
                    </p>
                  </div>
                  {isSupplier && <ShieldCheck size={20} className="text-slate-400" aria-label="Support chat" />}
                </div>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-5 sm:px-7 sm:py-6" style={{ backgroundImage: "radial-gradient(#dce0ed 0.7px, transparent 0.7px)", backgroundSize: "20px 20px" }}>
                  {loadingMessages && messages.length === 0 ? (
                    <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#201E64]" /></div>
                  ) : messages.length === 0 ? (
                    <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-slate-100 bg-white/90 px-6 py-8 text-center shadow-sm">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-[#201E64]"><MessageCircle size={26} /></div>
                      <p className="text-sm font-bold text-slate-800">{isSupplier ? "Welcome to ED Team Support" : "No messages yet"}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-500">{isSupplier ? "Have a question? Send your first message below and our team can respond here." : "Messages for this supplier will appear here."}</p>
                    </div>
                  ) : messages.map((message, index) => {
                    const mine = Number(message.sender_id) === userId;
                    const currentDay = dayLabel(message.created_at);
                    const previousDay = index > 0 ? dayLabel(messages[index - 1].created_at) : null;
                    const showDate = currentDay && currentDay !== previousDay;
                    return (
                      <React.Fragment key={message.message_id}>
                        {showDate && <div className="flex justify-center py-3"><span className="rounded-full border border-slate-100 bg-white/95 px-4 py-1.5 text-[11px] font-semibold text-slate-500 shadow-sm">{currentDay}</span></div>}
                        <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[87%] rounded-2xl px-4 py-2.5 shadow-[0_2px_8px_rgba(28,36,78,0.07)] sm:max-w-[72%] ${mine ? "rounded-br-md bg-[#201E64] text-white" : "rounded-bl-md border border-slate-100 bg-white text-slate-800"}`}>
                            {!mine && <p className="mb-1 text-[11px] font-bold text-indigo-600">{Number(message.role_id) === 2 ? "ED Team" : [message.first_name, message.last_name].filter(Boolean).join(" ") || "Supplier"}</p>}
                            <p className="whitespace-pre-wrap break-words text-[13px] leading-[1.65] sm:text-sm">{message.message}</p>
                            <div className={`mt-1 flex items-center justify-end gap-1.5 text-[10px] ${mine ? "text-indigo-200" : "text-slate-400"}`}>
                              <span>{timeText(message.created_at)}</span>
                              {mine && <CheckCheck size={13} aria-label="Message sent" />}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} className="shrink-0 border-t border-slate-100 bg-white px-3 py-3 sm:px-5 sm:py-4">
                  <div className="flex items-end gap-2 rounded-[22px] border border-slate-200 bg-[#f7f8fb] p-1.5 pl-4 transition focus-within:border-indigo-200 focus-within:ring-2 focus-within:ring-indigo-50 sm:gap-3">
                    <textarea
                      ref={textareaRef}
                      value={messageInput}
                      onChange={(event) => {
                        setMessageInput(event.target.value);
                        event.target.style.height = "auto";
                        event.target.style.height = `${Math.min(event.target.scrollHeight, 144)}px`;
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          if (!sending && messageInput.trim() && !isClosed) event.currentTarget.form?.requestSubmit();
                        }
                      }}
                      rows={1}
                      maxLength={5000}
                      disabled={sending || isClosed || (isSupplier && loadingMessages)}
                      placeholder={isClosed ? "This conversation is closed" : "Type a message..."}
                      className="max-h-36 min-h-[40px] min-w-0 flex-1 resize-none bg-transparent py-2.5 text-sm leading-5 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                      aria-label="Message"
                    />
                    <button type="submit" disabled={sending || !messageInput.trim() || isClosed || (isSupplier && loadingMessages)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#201E64] text-white shadow-sm transition hover:bg-[#302c88] disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11" aria-label="Send message">
                      {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 px-2 text-[10px] text-slate-400">
                    <span>Press Enter to send · Shift + Enter for a new line</span>
                    <span className="hidden sm:inline">{messageInput.length}/5000</span>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
