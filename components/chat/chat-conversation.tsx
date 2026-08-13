"use client";

/**
 * Task 8 of the "Tanya tentang Royhan" RAG chatbot: the real chat panel —
 * message list, streaming, citations, retry. Lazy-loaded by HeroAskBar
 * (Task 7), which keeps this mounted permanently once first activated so
 * collapsing the panel never drops conversation history.
 *
 * [Performance] This file and everything it imports must never pull in
 * @huggingface/transformers or any other server-only module — that's
 * exclusively for app/api/chat/route.ts and scripts/rag/*.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart, type UIMessage } from "ai";
import { motion } from "motion/react";
import { CloseIcon, SendIcon, StopIcon } from "@/components/chat/chat-icons";
import type { Dictionary, Locale } from "@/lib/i18n";

export type ChatConversationProps = {
  /** Seed text the user already typed into HeroAskBar's interim textarea before this mounted. */
  draft: string;
  /** Whether the panel is currently visually expanded (vs. collapsed-but-mounted) — for refocus-on-reopen. */
  isOpen: boolean;
  /** Called once, after mount, so HeroAskBar can stop rendering its own interim textarea. */
  onReady: () => void;
  /** True if the user pressed Enter in HeroAskBar before this component was ready. */
  onSubmitQueued: boolean;
  /** Collapses the panel back to the ask-bar button — history stays mounted, not reset. */
  onCollapse: () => void;
  locale: Locale;
  dict: Dictionary;
};

type Citation = { title: string; url: string };

const MAX_LENGTH = 500;
const NEAR_LIMIT_WARNING = 450;
const AUTO_SCROLL_THRESHOLD_PX = 48;
const MAX_TEXTAREA_HEIGHT_PX = 160;

function getMessageText(message: UIMessage): string {
  return message.parts.filter(isTextUIPart).map((part) => part.text).join("");
}

function getMessageCitations(message: UIMessage): Citation[] {
  const part = message.parts.find(
    (p): p is { type: "data-citations"; data: Citation[] } => p.type === "data-citations",
  );
  return part?.data ?? [];
}

export function ChatConversation({
  draft,
  isOpen,
  onReady,
  onSubmitQueued,
  onCollapse,
  locale,
  dict,
}: ChatConversationProps) {
  const t = dict.askRoyhan;

  const [text, setText] = useState(draft);
  const [isComposing, setIsComposing] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  // [Security] Set only from the response's real HTTP status via the
  // transport's fetch hook below — never inferred from message text, so
  // there's no way for model output to spoof the rate-limit UI.
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { locale },
        fetch: async (input, init) => {
          const response = await fetch(input, init);
          if (response.status === 429) {
            const retryAfterSeconds = Number(response.headers.get("Retry-After") ?? "60");
            setRateLimitedUntil(Date.now() + retryAfterSeconds * 1000);
          } else if (response.ok) {
            setRateLimitedUntil(null);
          }
          return response;
        },
      }),
  );

  const { messages, sendMessage, status, regenerate, stop } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";
  const inCooldown = rateLimitedUntil !== null && Date.now() < rateLimitedUntil;

  // useLayoutEffect (not useEffect) deliberately: fires before the browser
  // paints, so HeroAskBar's interim textarea is already gone by the time
  // anything is visible — otherwise there'd be a one-frame flash of both
  // the interim textarea and this panel stacked on top of each other. Safe
  // here specifically because this component is always ssr:false
  // (dynamic-imported in HeroAskBar), so it never runs server-side.
  useLayoutEffect(() => {
    onReadyRef.current();
  }, []);

  // Refocus every time the panel becomes visible again — this component
  // never unmounts on collapse (HeroAskBar keeps history alive), so a
  // plain on-mount effect wouldn't refire on reopen.
  useEffect(() => {
    if (isOpen) textareaRef.current?.focus();
  }, [isOpen]);

  // Auto-grow the textarea to fit its content (capped, then scrolls
  // internally) — recalculated on every value change, which also covers
  // shrinking back to one row after a submit clears the text.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
  }, [text]);

  // Enter pressed in HeroAskBar's interim textarea before this mounted —
  // fire the queued submit exactly once, using whatever draft text made it
  // through the handoff.
  const queuedSubmitHandled = useRef(false);
  useEffect(() => {
    if (queuedSubmitHandled.current) return;
    queuedSubmitHandled.current = true;
    if (onSubmitQueued && draft.trim()) {
      sendMessage({ text: draft.trim() });
      setText("");
    }
  }, [onSubmitQueued, draft, sendMessage]);

  // Auto-scroll to the latest message while streaming, unless the user has
  // scrolled up to read something earlier.
  useEffect(() => {
    if (!autoScroll) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, autoScroll]);

  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAutoScroll(distanceFromBottom < AUTO_SCROLL_THRESHOLD_PX);
  }

  function scrollToBottom() {
    setAutoScroll(true);
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || isLoading || inCooldown) return;
    sendMessage({ text: trimmed });
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey || isComposing || isLoading) return;
    e.preventDefault();
    submit();
  }

  function handleChipClick(prompt: string) {
    if (isLoading || inCooldown) return;
    sendMessage({ text: prompt });
  }

  const canSend = !isLoading && !inCooldown && text.trim().length > 0;

  return (
    <div className="w-full max-w-md rounded-lg border border-border-strong bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-caption text-muted-foreground">{t.askBar.heading}</span>
        <button type="button" onClick={onCollapse} aria-label={t.askBar.close}>
          <CloseIcon className="h-4 w-4 text-muted-foreground transition-colors hover:text-fg" />
        </button>
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 border-b border-border p-3">
          {t.suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleChipClick(prompt)}
              disabled={isLoading || inCooldown}
              className="rounded-full border border-border px-3 py-1.5 text-caption transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="relative flex flex-col gap-4 overflow-y-auto p-4"
        style={{ maxHeight: "50vh" }}
      >
        {messages.length === 0 && <p className="text-body text-muted-foreground">{t.greeting}</p>}

        {messages.map((message, i) => {
          const messageText = getMessageText(message);
          const citations = getMessageCitations(message);
          const isLastMessage = i === messages.length - 1;
          const isStreamingThis = isLastMessage && message.role === "assistant" && status === "streaming";
          // An assistant message can exist with citations but no text yet
          // (citations are written before the model's text stream starts) —
          // skip the empty bubble rather than show an ownerless blank box.
          const showBubble = messageText.length > 0 || isStreamingThis;

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col gap-1 ${message.role === "user" ? "items-end" : "items-start"}`}
            >
              {showBubble && (
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-body whitespace-pre-wrap ${
                    message.role === "user" ? "bg-accent/10 text-fg" : "bg-bg text-fg"
                  }`}
                >
                  {messageText}
                  {isStreamingThis && (
                    <span
                      aria-hidden
                      className="ml-0.5 inline-block h-[1em] w-1.5 translate-y-[2px] animate-pulse bg-accent/70 align-middle"
                    />
                  )}
                </div>
              )}

              {citations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {citations.map((citation) => (
                    <a
                      key={citation.url}
                      href={citation.url}
                      className="text-caption text-accent underline underline-offset-2 hover:no-underline"
                    >
                      {citation.title}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Standalone, not attached to a specific message: an assistant
            message can already exist (e.g. carrying citations written
            before the model's text stream) by the time an error arrives,
            so gating this on "last message has no assistant reply yet"
            would miss it. */}
        {status === "error" && (
          <div className="flex flex-col items-start gap-2 self-start rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-body text-fg">
            <p>{inCooldown ? t.errorRateLimit : t.errorGeneric}</p>
            <button
              type="button"
              onClick={() => regenerate()}
              disabled={inCooldown}
              className="text-caption text-accent underline underline-offset-2 disabled:opacity-50"
            >
              {t.retry}
            </button>
          </div>
        )}

        {status === "submitted" && (
          <div
            aria-live="polite"
            aria-label={t.greeting}
            className="flex items-center gap-1 self-start rounded-lg bg-bg px-3 py-2.5"
          >
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
          </div>
        )}

        {!autoScroll && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="sticky bottom-0 self-center rounded-full border border-border-strong bg-card px-3 py-1 text-caption text-muted-foreground shadow-sm transition-colors hover:border-accent hover:text-accent"
          >
            ↓ {t.askBar.heading}
          </button>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-end gap-2 border-t border-border p-3"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          maxLength={MAX_LENGTH}
          disabled={inCooldown}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={t.placeholder}
          aria-label={t.askBar.heading}
          className="max-h-40 flex-1 resize-none overflow-y-auto bg-transparent text-body text-fg outline-none disabled:opacity-50"
        />
        {text.length > NEAR_LIMIT_WARNING && (
          <span className="pb-2 font-mono text-caption text-muted-foreground">
            {text.length}/{MAX_LENGTH}
          </span>
        )}
        <button
          type={isLoading ? "button" : "submit"}
          onClick={isLoading ? () => stop() : undefined}
          disabled={!isLoading && !canSend}
          aria-label={isLoading ? t.stop : t.send}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-fg transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
        >
          {isLoading ? <StopIcon className="h-4 w-4" /> : <SendIcon className="h-4 w-4" />}
        </button>
      </form>
      <p className="px-3 pb-2 text-caption text-muted-foreground">{t.disclaimer}</p>
    </div>
  );
}

export default ChatConversation;
