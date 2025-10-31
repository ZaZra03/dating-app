/**
 * Custom hook for real-time chat functionality using Supabase channels.
 * Handles subscription to chat rooms, message sending/receiving, and connection status.
 */

'use client'

import { createClient } from '@/lib/client'
import { useCallback, useEffect, useState } from 'react'

/**
 * Props for the useRealtimeChat hook.
 */
interface UseRealtimeChatProps {
  roomName: string
  username: string
}

/**
 * Chat message structure for real-time communication.
 */
export interface ChatMessage {
  id: string
  content: string
  user: {
    name: string
  }
  createdAt: string
}

const EVENT_MESSAGE_TYPE = 'message'

/**
 * Hook for managing real-time chat via Supabase channels.
 * 
 * @param props - Configuration object with roomName and username
 * @param props.roomName - The name of the chat room to join
 * @param props.username - The username of the current user
 * @returns Object containing messages array, sendMessage function, and connection status
 * 
 * @returns { messages: ChatMessage[] } - Array of received messages
 * @returns { sendMessage: (content: string) => Promise<void> } - Function to send a message
 * @returns { isConnected: boolean } - Whether the channel is connected
 * 
 * Side effects:
 * - Subscribes to Supabase channel on mount
 * - Stores latest message timestamp in localStorage for notifications
 * - Unsubscribes from channel on unmount
 */
export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const newChannel = supabase.channel(roomName)

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const incoming = payload.payload as ChatMessage
        setMessages((current) => [...current, incoming])
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('latestChatMessageAt', incoming.createdAt || new Date().toISOString())
            localStorage.setItem('latestChatFrom', incoming?.user?.name || 'Unknown')
          }
        } catch {}
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        } else {
          setIsConnected(false)
        }
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
  }, [roomName, username, supabase])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        user: {
          name: username,
        },
        createdAt: new Date().toISOString(),
      }

      setMessages((current) => [...current, message])

      await channel.send({
        type: 'broadcast',
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      })
    },
    [channel, isConnected, username]
  )

  return { messages, sendMessage, isConnected }
}
