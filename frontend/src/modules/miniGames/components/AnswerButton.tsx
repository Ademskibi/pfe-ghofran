import React from 'react';

interface AnswerButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  status?: 'correct' | 'wrong' | 'idle';
}

const AnswerButton: React.FC<AnswerButtonProps> = ({ label, onClick, disabled = false, active = false, status = 'idle' }) => {
  const baseClasses = 'w-full rounded-3xl border-2 py-5 px-4 text-xl font-bold transition-all duration-200 focus:outline-none focus:ring-4';
  const statusClasses = status === 'correct'
    ? 'border-[var(--color-fox)] bg-[var(--color-fox)] text-white shadow-2xl shadow-[rgba(244,124,32,0.3)]'
    : status === 'wrong'
    ? 'border-[var(--color-fox-dark)] bg-[var(--color-yellow-button)] text-[var(--color-fox-dark)] shadow-[rgba(122,63,20,0.25)]'
    : 'border-panel bg-[var(--color-bg)] text-[var(--color-black)] hover:border-[var(--color-ui)] hover:bg-[rgba(47,168,204,0.08)] hover:text-[var(--color-black)]';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${statusClasses} ${active ? 'scale-[1.01]' : ''} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      {label}
    </button>
  );
};

export default AnswerButton;
