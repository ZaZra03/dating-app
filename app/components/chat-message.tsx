/**
 * Chat message item component for displaying individual chat messages.
 * Renders messages with user information and timestamps.
 */

import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'

/**
 * Props for the ChatMessageItem component.
 */
interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
}

/**
 * Component for rendering a single chat message.
 * 
 * @param props - Component props
 * @param props.message - The chat message object to display
 * @param props.isOwnMessage - Whether this message belongs to the current user
 * @param props.showHeader - Whether to show the message header (username and timestamp)
 * 
 * Features:
 * - Different styling for own messages vs. received messages
 * - Conditional header display (shows username and timestamp)
 * - Responsive layout based on message ownership
 * - Formatted timestamp display
 */
export const ChatMessageItem = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
  return (
    <div className={`flex mt-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn('max-w-[75%] w-fit flex flex-col gap-1', {
          'items-end': isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn('flex items-center gap-2 text-xs px-3', {
              'justify-end flex-row-reverse': isOwnMessage,
            })}
          >
            <span className={'font-medium'}>{message.user.name}</span>
            <span className="text-foreground/50 text-xs">
              {new Date(message.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        )}
        <div
          className={cn(
            'py-2 px-3 rounded-xl text-sm w-fit',
            isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  )
}
