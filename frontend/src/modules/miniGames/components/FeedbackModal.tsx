import React from 'react';

interface FeedbackModalProps {
  open: boolean;
  title: string;
  message: string;
  type: 'success' | 'error';
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  title,
  message,
  type,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}) => {
  if (!open) return null;

  const borderClass = type === 'success'
    ? 'border-[var(--color-ui)]'
    : 'border-[var(--color-fox)]';
  const bgClass = type === 'success'
    ? 'bg-[rgba(47,168,204,0.08)]'
    : 'bg-[rgba(244,124,32,0.12)]';
  const emoji = type === 'success' ? '🎉' : '🤔';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,26,0.4)] p-4">
      <div className={`w-full max-w-md rounded-[32px] border-2 ${borderClass} ${bgClass} p-8 shadow-2xl`}>
        <div className="text-center">
          <div className="mb-4 text-5xl">{emoji}</div>
          <h2 className="text-3xl font-extrabold text-[var(--color-black)] mb-3">{title}</h2>
          <p className="text-[var(--color-fox-dark)] text-base leading-7">{message}</p>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onPrimary}
            className="rounded-3xl bg-[var(--color-yellow-button)] px-6 py-4 text-lg font-semibold text-[var(--color-black)] shadow-lg shadow-[rgba(255,213,0,0.2)] transition hover:bg-[#e6c500]"
          >
            {primaryLabel}
          </button>
          {secondaryLabel && onSecondary && (
            <button
              type="button"
              onClick={onSecondary}
              className="rounded-3xl border border-panel bg-white px-6 py-4 text-lg font-semibold text-[var(--color-fox-dark)] transition hover:bg-[var(--color-bg-shape)]"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
