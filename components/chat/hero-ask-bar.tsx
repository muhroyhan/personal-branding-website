"use client";

/**
 * Task 7 of the "Tanya tentang Royhan" RAG chatbot: the eager, lightweight
 * ask-bar that lives in Hero. No AI SDK dependency here on purpose — that
 * chunk (ChatConversation, Task 8) is only fetched via `next/dynamic` once
 * the user actually interacts, so the collapsed state costs nothing extra
 * on first paint.
 *
 * State machine:
 *   - `chatMounted`: false until first activation, then true forever — once
 *     true, ChatConversationLazy stays mounted permanently (even while
 *     visually collapsed) so conversation history survives a close/reopen.
 *   - `activated`: purely visual expand/collapse of the panel; independent
 *     of `chatMounted` so collapsing never unmounts the chat.
 *   - `chatReady`: true once ChatConversation has mounted and taken over —
 *     until then, this component renders its own interim textarea so
 *     typing feels instant even while the chat chunk is still downloading.
 *   - `draft`/`queuedSubmit`: survive the handoff to ChatConversation so a
 *     slow connection never drops a keystroke or a premature Enter.
 */
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ChatIcon } from "@/components/chat/chat-icons";
import type { Dictionary, Locale } from "@/lib/i18n";

const ChatConversationLazy = dynamic(
  () => import("@/components/chat/chat-conversation").then((m) => m.ChatConversation),
  { ssr: false, loading: () => null },
);

export function HeroAskBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.askRoyhan;

  const [chatMounted, setChatMounted] = useState(false);
  const [activated, setActivated] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  const [draft, setDraft] = useState("");
  const [queuedSubmit, setQueuedSubmit] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  function activate() {
    setChatMounted(true);
    setActivated(true);
  }

  function handleInterimKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey || isComposing) return;
    e.preventDefault();
    if (draft.trim().length === 0) return;
    // Can't actually submit yet — no useChat instance exists until
    // ChatConversation mounts. Queue it; the real submit happens there
    // once `onReady` fires (see ChatConversation's onSubmitQueued handling
    // in Task 8).
    setQueuedSubmit(true);
  }

  return (
    // Matches the fade+rise timing of its Hero siblings (lead paragraph at
    // delay 0.75, CTA row at 0.85) — this sits between them in the mount
    // sequence. Without its own entrance animation this rendered instantly
    // while everything around it staggered in, which (measured via
    // Lighthouse) was enough to shift the page's LCP element from the <h1>
    // to the lead paragraph: an inconsistent render/paint rhythm across
    // Hero's animated children changed which one Chrome recorded as the
    // largest late paint. Matching the rhythm restored <h1> as LCP.
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="w-full max-w-md"
    >
      {!activated && (
        <button
          type="button"
          onClick={activate}
          onFocus={activate}
          className="flex w-full items-center gap-2 rounded-full border border-border-strong bg-card px-5 py-3 text-left text-body text-muted-foreground transition-colors hover:border-accent"
        >
          <ChatIcon className="h-5 w-5 text-accent" />
          {t.askBar.placeholder}
        </button>
      )}

      {chatMounted && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
            activated ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            {!chatReady && (
              <div className="rounded-lg border border-border-strong bg-card p-3">
                <textarea
                  autoFocus={activated}
                  rows={1}
                  maxLength={500}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleInterimKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder={t.placeholder}
                  aria-label={t.askBar.heading}
                  className="w-full resize-none bg-transparent text-body text-fg outline-none"
                />
              </div>
            )}

            <ChatConversationLazy
              draft={draft}
              isOpen={activated}
              onReady={() => setChatReady(true)}
              onSubmitQueued={queuedSubmit}
              onCollapse={() => setActivated(false)}
              locale={locale}
              dict={dict}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
