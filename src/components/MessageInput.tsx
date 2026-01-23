/**
 * MessageInput Component
 * Text input for entering king's message with 30 character limit
 * Displays character counter and validation feedback
 */

'use client';

import { LIMITS, TEXTS } from '@/lib/constants';
import type { ChangeEvent } from 'react';

/**
 * MessageInput Props
 */
export interface MessageInputProps {
  /** Current message value */
  value: string;
  /** Callback when message changes */
  onChange: (value: string) => void;
  /** Optional placeholder text (defaults to TEXTS.messagePlaceholder) */
  placeholder?: string;
  /** Optional disabled state */
  disabled?: boolean;
  /** Optional custom className */
  className?: string;
}

/**
 * MessageInput Component
 * Controlled input component for king's message with character limit
 *
 * Features:
 * - 30 character maximum length
 * - Real-time character counter
 * - Visual warning when approaching limit
 * - Pixel-art styling with neon effects
 *
 * @example
 * ```tsx
 * const [message, setMessage] = useState('');
 *
 * <MessageInput
 *   value={message}
 *   onChange={setMessage}
 * />
 * ```
 */
export function MessageInput({
  value,
  onChange,
  placeholder = TEXTS.messagePlaceholder,
  disabled = false,
  className = '',
}: MessageInputProps) {
  // Calculate remaining characters
  const currentLength = value.length;
  const maxLength = LIMITS.messageMaxLength;
  const remainingChars = maxLength - currentLength;
  const isNearLimit = remainingChars <= 10;
  const isAtLimit = remainingChars === 0;

  /**
   * Handle input change
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Only update if within character limit
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {/* Input field */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3
            font-['Press_Start_2P'] text-xs
            bg-black/80
            border-3
            ${isNearLimit ? 'border-accent-red' : 'border-accent-neon'}
            text-white
            placeholder:text-gray-500
            focus:outline-none
            focus:border-accent-neon
            focus:shadow-[0_0_20px_var(--accent-neon)]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${isNearLimit ? 'shadow-[0_0_10px_var(--accent-red)]' : 'shadow-[0_0_10px_var(--accent-neon)]'}
          `}
          style={{
            imageRendering: 'pixelated',
          }}
        />
      </div>

      {/* Character counter */}
      <div className="flex items-center justify-between px-2">
        <div className={`
          text-xs font-['Press_Start_2P']
          ${isAtLimit ? 'pixel-text-glow-red' : isNearLimit ? 'text-yellow-400' : 'text-gray-400'}
          transition-colors duration-200
        `}>
          {currentLength}/{maxLength}
        </div>

        {/* Warning message when near limit */}
        {isNearLimit && (
          <div className={`
            text-xs
            ${isAtLimit ? 'pixel-text-glow-red' : 'text-yellow-400'}
            animate-pulse
          `}>
            {isAtLimit ? '⚠️ Max length' : `${remainingChars} chars left`}
          </div>
        )}
      </div>
    </div>
  );
}
