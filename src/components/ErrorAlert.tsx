interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
      <div className="flex-1">
        <h3 className="text-red-800 font-semibold mb-1">오류 발생</h3>
        <p className="text-red-700 text-sm">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-red-600 hover:text-red-800"
          aria-label="닫기"
        >
          ×
        </button>
      )}
    </div>
  );
}

