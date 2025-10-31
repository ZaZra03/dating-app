"use client";

import { RealtimeChat } from '@/components/realtime-chat';
import { useEffect, useState, useCallback } from 'react';
import { storeMessages } from '@/lib/store-messages';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { withAuth } from '@/lib/withAuth';
import { useToast } from '@/hooks/use-toast';

function ChatPage() {
  const [username, setUsername] = useState<string>("");
  const [matchId, setMatchId] = useState<number | null>(null);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [lastSavedCreatedAt, setLastSavedCreatedAt] = useState<string | null>(null);
  const [openedViaMatches, setOpenedViaMatches] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

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
      // Validate the match still exists; if it doesn't, clear state and URL
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const resMatches = await fetch(`/api/matches`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (resMatches.ok) {
          const list = await resMatches.json();
          const stillExists = Array.isArray(list) && list.some((m: any) => Number(m.id) === Number(matchId));
          if (!stillExists) {
            setOpenedViaMatches(false);
            setMatchId(null);
            try { localStorage.removeItem('currentMatchId'); sessionStorage.removeItem('openedFrom'); } catch {}
            router.replace('/chat');
            return;
          }
        }
      } catch {}
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
    } catch (e: any) {
      const msg = typeof e?.message === 'string' ? e.message : '';
      if (msg === 'MATCH_NOT_FOUND' || msg === 'Match not found') {
        toast({
          title: 'Chat ended',
          description: 'The other user has unmatched. This chat is no longer available.',
          variant: 'destructive',
        });
        try { localStorage.removeItem('currentMatchId'); sessionStorage.removeItem('openedFrom'); } catch {}
        setOpenedViaMatches(false);
        setMatchId(null);
        router.replace('/chat');
      } else {
        console.error('Store messages failed', e);
      }
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

export default withAuth(ChatPage);
