export function Modal({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
  danger,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  onClose: () => void;
  danger?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-dashed border-muted/40 bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-mono text-lg text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-muted hover:text-foreground"
          >
            {onConfirm ? "Cancelar" : "Entendido"}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`rounded-md px-3 py-1.5 text-sm font-medium text-foreground ${
                danger ? "bg-danger" : "bg-accent"
              }`}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
