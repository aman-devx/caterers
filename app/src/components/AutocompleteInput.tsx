"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/images";

export interface SuggestionItem {
  label: string;
  sublabel?: string;
  type?: string;
  value: string;
  image?: string;
  rating?: number;
  cuisine?: string;
}

interface AutocompleteInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  richSuggestions?: SuggestionItem[];
  placeholder?: string;
  icon?: React.ReactNode;
  onSelect?: (value: string) => void;
  loading?: boolean;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const lower = text.toLowerCase();
  const qLower = q.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-amber-200/90 px-0.5 font-semibold text-inherit">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function SuggestionThumbnail({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const url = !src || failed ? FALLBACK_IMAGE : src;

  return (
    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-stone-100 ring-1 ring-stone-200/80">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

const typeColors: Record<string, string> = {
  caterer: "bg-amber-100 text-amber-800",
  cuisine: "bg-emerald-100 text-emerald-800",
  service: "bg-sky-100 text-sky-800",
  menu: "bg-violet-100 text-violet-800",
  location: "bg-stone-100 text-stone-700",
  category: "bg-orange-100 text-orange-800",
};

export default function AutocompleteInput({
  id,
  label,
  value,
  onChange,
  suggestions = [],
  richSuggestions,
  placeholder,
  icon,
  onSelect,
  loading = false,
}: AutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [openUpward, setOpenUpward] = useState(false);
  const [maxHeight, setMaxHeight] = useState(280);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const items: SuggestionItem[] = richSuggestions?.length
    ? richSuggestions
    : suggestions
        .filter((s) => !value || s.toLowerCase().includes(value.toLowerCase()))
        .map((s) => ({ label: s, value: s }));

  const filtered = items.filter(
    (s) =>
      !value ||
      s.label.toLowerCase().includes(value.toLowerCase()) ||
      s.sublabel?.toLowerCase().includes(value.toLowerCase()) ||
      s.cuisine?.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) {
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    }
    setVisible(false);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !inputRef.current) return;

    function updatePosition() {
      const rect = inputRef.current!.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 12;
      const spaceAbove = rect.top - 12;
      const preferUp = spaceBelow < 180 && spaceAbove > spaceBelow;
      setOpenUpward(preferUp);
      setMaxHeight(Math.max(120, Math.min(280, preferUp ? spaceAbove : spaceBelow)));
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, filtered.length]);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  function pick(item: SuggestionItem) {
    onChange(item.value);
    onSelect?.(item.value);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      if (filtered.length === 0) return;
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length === 0) return;
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && filtered[activeIndex]) {
        e.preventDefault();
        pick(filtered[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = open && (loading || filtered.length > 0 || value.trim().length > 0);
  const activeId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-stone-400">
            {icon}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`relative w-full rounded-xl border border-stone-200 bg-white py-3 text-sm text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 ${icon ? "pl-10 pr-10" : "px-4 pr-10"}`}
        />
        {loading && (
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          </span>
        )}
      </div>

      {showDropdown && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={`${label} suggestions`}
          style={{ maxHeight }}
          className={`absolute left-0 right-0 z-[200] overflow-y-auto overscroll-contain rounded-xl border border-stone-200 bg-white py-1 shadow-2xl ring-1 ring-black/5 transition-all duration-200 ease-out ${
            openUpward ? "bottom-full mb-1.5 origin-bottom" : "top-full mt-1.5 origin-top"
          } ${visible ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"}`}
        >
          {loading && filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-stone-500" role="presentation">
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                Searching…
              </span>
            </li>
          )}

          {!loading && filtered.length === 0 && (
            <li className="px-4 py-6 text-center" role="presentation">
              <p className="text-sm font-medium text-stone-700">No results found</p>
              <p className="mt-1 text-xs text-stone-500">Try a different search term</p>
            </li>
          )}

          {filtered.map((item, i) => (
            <li
              key={`${item.type}-${item.value}-${i}`}
              id={`${listboxId}-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
            >
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => pick(item)}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors sm:px-4 ${
                  i === activeIndex ? "bg-amber-50 text-amber-900" : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                {item.type === "caterer" && (
                  <SuggestionThumbnail src={item.image} alt={item.label} />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.type && item.type !== "caterer" && (
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${typeColors[item.type] || typeColors.location}`}
                      >
                        {item.type}
                      </span>
                    )}
                    <p className="truncate font-medium">
                      <HighlightMatch text={item.label} query={value} />
                    </p>
                    {item.rating != null && (
                      <span className="shrink-0 text-xs font-semibold text-amber-600">
                        ★ {item.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {item.sublabel && (
                    <p className="mt-0.5 truncate text-xs text-stone-500">
                      <HighlightMatch text={item.sublabel} query={value} />
                    </p>
                  )}
                  {item.cuisine && !item.sublabel && (
                    <p className="mt-0.5 truncate text-xs text-stone-500">
                      <HighlightMatch text={item.cuisine} query={value} />
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
