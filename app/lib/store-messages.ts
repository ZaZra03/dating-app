/**
 * Utility functions for storing chat messages to the backend.
 */

/**
 * Chat message data transfer object format.
 */
export interface ChatMessageDTO {
  id?: string;
  content: string;
  createdAt?: string;
  user?: { name?: string };
}

/**
 * Stores chat messages to the backend database.
 * 
 * @param matchId - The match ID associated with the chat session
 * @param messages - Array of chat messages to store
 * @returns Promise resolving to the API response
 * @throws Error if the request fails or messages array is required
 * 
 * Side effects:
 * - Sends POST request to /api/chat/messages
 * - Uses JWT token from localStorage for authentication
 * 
 * @example
 * await storeMessages(123, [
 *   { content: "Hello!", user: { name: "Alice" }, createdAt: "2024-01-01T00:00:00Z" }
 * ]);
 */
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
    let msg = res.status === 404 ? "MATCH_NOT_FOUND" : "Failed to store messages";
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


