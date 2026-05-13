"use client";

import { useState, useRef, useEffect, useMemo } from "react";

interface Option {
  label: string;
  value: string;
  subLabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  required = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.subLabel?.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between cursor-pointer transition-all ${
          isOpen ? "ring-2 ring-zinc-900 border-transparent bg-white shadow-sm" : "hover:border-zinc-300"
        }`}
      >
        <span className={selectedOption ? "text-zinc-900 font-medium" : "text-zinc-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <i className={`ri-arrow-down-s-line transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}></i>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top">
          <div className="p-3 border-b border-zinc-100 bg-zinc-50/50">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"></i>
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-lg border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-900 transition-all"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`px-4 py-2.5 hover:bg-zinc-50 cursor-pointer transition-colors ${
                    value === option.value ? "bg-zinc-50 text-zinc-900" : "text-zinc-600"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-sm ${value === option.value ? "font-bold" : "font-medium"}`}>
                      {option.label}
                    </span>
                    {option.subLabel && (
                      <span className="text-xs text-zinc-400 mt-0.5">
                        {option.subLabel}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-zinc-400 text-sm italic">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
