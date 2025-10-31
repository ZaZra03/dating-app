"use client";

import { RealtimeChat } from '@/components/realtime-chat';
import { useEffect, useState, useCallback } from 'react';
import { storeMessages } from '@/lib/store-messages';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const [username, setUsername] = useState<string>("");
  const [matchId, setMatchId] = useState<number | null>(null);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [lastSavedCreatedAt, setLastSavedCreatedAt] = useState<string | null>(null);
  const [openedViaMatches, setOpenedViaMatches] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("data") : null;
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const name = typeof parsed?.name === "string" ? parsed.name.trim() : "";
      if (name) setUsername(name);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("currentMatchId") : null;
      if (!raw) return;
      const id = Number(raw);
      if (Number.isFinite(id)) setMatchId(id);
    } catch {}
  }, []);

  // Also support matchId from query string (?matchId=123)
  useEffect(() => {
    const param = searchParams?.get('matchId');
    if (!param) return;
    const id = Number(param);
    if (Number.isFinite(id)) {
      setMatchId(id);
      try { localStorage.setItem('currentMatchId', String(id)); } catch {}
    }
  }, [searchParams]);

  // Require navigation from Matches page
  useEffect(() => {
    try {
      const openedFrom = typeof window !== 'undefined' ? sessionStorage.getItem('openedFrom') : null;
      setOpenedViaMatches(openedFrom === 'matches');
    } catch {
      setOpenedViaMatches(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!matchId) return;
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`/api/chat/messages?matchId=${matchId}&limit=200`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          try { console.error('Fetch messages failed', res.status, await res.json()); } catch {}
          return;
        }
        const data = await res.json();
        if (Array.isArray(data?.messages)) {
          setInitialMessages(data.messages);
          const last = data.messages[data.messages.length - 1];
          if (last?.createdAt && typeof last.createdAt === 'string') {
            setLastSavedCreatedAt(last.createdAt);
          }
        }
      } catch {}
    };
    load();
  }, [matchId]);

  const handleMessage = useCallback(async (messages: any[]) => {
    if (!matchId) return;
    try {
      const baseline = lastSavedCreatedAt ?? '';
      const newOnes = Array.isArray(messages)
        ? messages.filter((m) => typeof m?.createdAt === 'string' && m.createdAt > baseline)
        : [];
      if (newOnes.length === 0) return;
      await storeMessages(matchId, newOnes);
      const newest = newOnes[newOnes.length - 1];
      if (newest?.createdAt) setLastSavedCreatedAt(newest.createdAt);
    } catch (e) {
      console.error('Store messages failed', e);
    }
  }, [matchId, lastSavedCreatedAt]);

  if (!openedViaMatches || !matchId) {
    return (
      <div className="flex items-center justify-center h-full w-full p-6">
        <div className="max-w-lg text-center space-y-4">
          <h2 className="text-2xl font-semibold">No chat selected</h2>
          <p className="text-muted-foreground">
            Open your matches and click the Chat button to start a conversation. Once you select a match, the chat will appear here with any previous messages.
          </p>
          <div>
            <Button onClick={() => router.push('/matches')}>Go to Matches</Button>
          </div>
        </div>
      </div>
    );
  }

  return <RealtimeChat roomName={`match-${matchId}`} username={username || "Guest"} onMessage={handleMessage} messages={initialMessages} />
}

