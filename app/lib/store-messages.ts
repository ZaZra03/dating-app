export interface ChatMessageDTO {
  id?: string;
  content: string;
  createdAt?: string;
  user?: { name?: string };
}

export async function storeMessages(matchId: number, messages: ChatMessageDTO[]) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch("/api/chat/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ matchId, messages }),
  });
  if (!res.ok) {
    let msg = "Failed to store messages";
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    if (msg === "messages array is required") {
      // Special handling if the messages array is missing/empty
      throw new Error("messages array is required");
    }
    throw new Error(msg);
  }
  return res.json();
}


