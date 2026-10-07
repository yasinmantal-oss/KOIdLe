import { type ReactNode, useEffect, useId, useRef, useState } from 'react';

/**
 * Açıklamalı etiket. Masaüstünde üstüne gelince `title`; dokunmatikte (ve klavyede) dokununca
 * küçük bir açıklama kutusu açılır. Erişilebilir: aria-expanded'lı gerçek bir düğme.
 */
export function Info({
  text,
  className = '',
  children,
}: {
  text: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span className={`info ${className}`} ref={ref}>
      <button
        type="button"
        className="info__btn"
        title={text}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {children}
      </button>
      {open && (
        <span id={id} role="note" className="info__pop">
          {text}
        </span>
      )}
    </span>
  );
}
