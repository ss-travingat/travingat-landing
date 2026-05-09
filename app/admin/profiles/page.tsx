"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { toLandingAssetUrl } from "@/lib/landing-assets";

interface CountryImage {
  countryCode: string;
  images: string[];
}

interface CollectionImage {
  title: string;
  images: string[];
}

interface Profile {
  id: string;
  name: string;
  handle: string;
  country: string;
  flag: string;
  flagCode: string;
  homelandFlagCode: string;
  currentlyInFlagCode: string;
  countries: number;
  media: number;
  collections: number;
  images: {
    cover: string;
    avatar: string;
    gallery: string[];
  };
  align: "start" | "end";
  bio: string;
  interests: string[];
  languages: string[];
  homeland: string;
  currentlyIn: string;
  socials: {
    x: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  aboutImages: string[];
  visitedCountryCodes: string[];
  countryImages: CountryImage[];
  collectionImages: CollectionImage[];
}

const COUNTRY_LIST: { code: string; name: string; flag: string }[] = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
];

function getCountryByCode(code: string) {
  return COUNTRY_LIST.find((c) => c.code === code);
}

const emptyForm: Omit<Profile, "id"> = {
  name: "",
  handle: "",
  country: "",
  flag: "",
  flagCode: "",
  homelandFlagCode: "",
  currentlyInFlagCode: "",
  countries: 0,
  media: 0,
  collections: 0,
  images: { cover: "", avatar: "", gallery: [] },
  align: "end",
  bio: "",
  interests: [],
  languages: [],
  homeland: "",
  currentlyIn: "",
  socials: { x: "", instagram: "", linkedin: "", youtube: "" },
  aboutImages: [],
  visitedCountryCodes: [],
  countryImages: [],
  collectionImages: [],
};

function CountrySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (code: string, name: string, flag: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COUNTRY_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const selected = getCountryByCode(value);

  return (
    <div ref={ref} className="relative">
      <label className="text-sm text-white/60 block mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-left flex items-center gap-2 hover:border-white/20 transition-colors cursor-pointer"
      >
        {selected ? (
          <>
            <img
              src={`/flags/${selected.code}.svg`}
              alt={selected.name}
              className="w-5 h-3.5 rounded-sm object-cover"
            />
            <span className="text-white">{selected.name}</span>
            <span className="text-white/30 ml-auto">{selected.code}</span>
          </>
        ) : (
          <span className="text-white/25">Select country...</span>
        )}
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-black-700 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9]"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-white/30">
                No countries found
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c.code, c.name, c.flag);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer ${
                    value === c.code ? "bg-[#5A45F9]/20 text-white" : "text-white/70"
                  }`}
                >
                  <img
                    src={`/flags/${c.code}.svg`}
                    alt={c.name}
                    className="w-5 h-3.5 rounded-sm object-cover"
                  />
                  <span>{c.name}</span>
                  <span className="text-white/30 ml-auto text-xs">{c.code}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MultiCountrySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (codes: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COUNTRY_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (code: string) => {
    if (value.includes(code)) {
      onChange(value.filter((c) => c !== code));
    } else {
      onChange([...value, code]);
    }
  };

  return (
    <div ref={ref} className="relative">
      <label className="text-sm text-white/60 block mb-1.5">
        {label} <span className="text-white/30">({value.length} selected)</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-left hover:border-white/20 transition-colors cursor-pointer"
      >
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 10).map((code) => (
              <span
                key={code}
                className="inline-flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-xs"
              >
                <img
                  src={`/flags/${code}.svg`}
                  alt={code}
                  className="w-3.5 h-2.5 rounded-sm object-cover"
                />
                {code}
              </span>
            ))}
            {value.length > 10 && (
              <span className="text-white/30 text-xs py-0.5">
                +{value.length - 10} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-white/25">Select visited countries...</span>
        )}
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-black-700 border border-white/10 rounded-lg shadow-xl max-h-72 overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9]"
              autoFocus
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => toggle(c.code)}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer ${
                  value.includes(c.code)
                    ? "bg-[#5A45F9]/20 text-white"
                    : "text-white/70"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    value.includes(c.code)
                      ? "bg-[#5A45F9] border-[#5A45F9]"
                      : "border-white/20"
                  }`}
                >
                  {value.includes(c.code) && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <img
                  src={`/flags/${c.code}.svg`}
                  alt={c.name}
                  className="w-5 h-3.5 rounded-sm object-cover"
                />
                <span>{c.name}</span>
                <span className="text-white/30 ml-auto text-xs">{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TagInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  const appendUniqueTags = (nextTags: string[]) => {
    if (nextTags.length === 0) return;
    const existing = new Set(value);
    const unique = nextTags.filter((tag) => !existing.has(tag));
    if (unique.length === 0) return;
    onChange([...value, ...unique]);
  };

  const parseTags = (raw: string) =>
    raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

  const addTag = () => {
    const tags = parseTags(input);
    appendUniqueTags(tags);
    if (tags.length > 0) setInput("");
  };

  const handleInputChange = (nextValue: string) => {
    if (!nextValue.includes(",")) {
      setInput(nextValue);
      return;
    }

    const pieces = nextValue.split(",");
    const completed = pieces.slice(0, -1);
    const remaining = pieces[pieces.length - 1] ?? "";
    appendUniqueTags(
      completed
        .map((tag) => tag.trim())
        .filter(Boolean)
    );
    setInput(remaining.trimStart());
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = event.clipboardData.getData("text");
    if (!pastedText) return;
    if (!pastedText.includes(",")) return;

    event.preventDefault();
    const tags = parseTags(pastedText);
    appendUniqueTags(tags);
    setInput("");
  };

  return (
    <div>
      <label className="text-sm text-white/60 block mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-[#5A45F9]/20 text-[#5A45F9] px-2 py-1 rounded-md text-xs"
          >
            {tag}
            <button
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9] transition-colors"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [form, setForm] = useState<Omit<Profile, "id">>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const [uploading, setUploading] = useState<{ field: "cover" | "avatar" | "gallery" | "about" | "country" | "collection"; idx?: number } | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const aboutInputRef = useRef<HTMLInputElement>(null);
  const [pendingCountryCode, setPendingCountryCode] = useState<string>("");
  const [pendingCollectionTitle, setPendingCollectionTitle] = useState<string>("");
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{ type: "country" | "collection" | "about"; idx?: number } | null>(null);

  const showToast = (msg: string, error = false) => {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profiles");
      const data = await res.json();
      const normalizedProfiles = (Array.isArray(data) ? data : []).map((profile) => ({
        ...profile,
        aboutImages: Array.isArray(profile.aboutImages) ? profile.aboutImages : [],
        countryImages: Array.isArray(profile.countryImages) ? profile.countryImages : [],
        collectionImages: Array.isArray(profile.collectionImages) ? profile.collectionImages : [],
      })) as Profile[];
      setProfiles([...normalizedProfiles].reverse());
    } catch {
      showToast("Failed to load profiles");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleVideoUpload = async (
    file: File,
    type: "country" | "collection" | "gallery" | "about",
    idx?: number
  ) => {
    if (file.size > 50 * 1024 * 1024) {
      showToast("Video too large. Max 50MB.", true);
      return null;
    }
    if (!file.type.startsWith("video/")) {
      showToast("Please upload a video file", true);
      return null;
    }

    // Check duration client-side via a temporary object URL
    const duration = await new Promise<number>((resolve) => {
      const vid = document.createElement("video");
      vid.preload = "metadata";
      const objUrl = URL.createObjectURL(file);
      vid.src = objUrl;
      vid.onloadedmetadata = () => {
        URL.revokeObjectURL(objUrl);
        resolve(vid.duration);
      };
      vid.onerror = () => {
        URL.revokeObjectURL(objUrl);
        resolve(0);
      };
    });

    if (duration > 30) {
      showToast("Video must be 30 seconds or less.", true);
      return null;
    }

    setUploading({ field: type, idx });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/profiles/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Upload failed", true);
        return null;
      }
      showToast("Video uploaded");
      return data.url as string;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      showToast(`Upload failed: ${msg}`, true);
      return null;
    } finally {
      setUploading(null);
    }
  };

  const handleImageUpload = async (
    file: File,
    type: "avatar" | "cover" | "gallery" | "about" | "country" | "collection",
    idx?: number
  ) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast("File too large. Max 5MB.", true);
      return null;
    }
    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file", true);
      return null;
    }

    setUploading({ field: type, idx });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/profiles/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Upload failed", true);
        return null;
      }
      showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded`);
      return data.url as string;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      showToast(`Upload failed: ${msg}`, true);
      return null;
    } finally {
      setUploading(null);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleImageUpload(file, "cover");
    if (url) {
      setForm((prev) => ({
        ...prev,
        images: { ...prev.images, cover: url },
      }));
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleImageUpload(file, "avatar");
    if (url) {
      setForm((prev) => ({
        ...prev,
        images: { ...prev.images, avatar: url },
      }));
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    // Reset input so the same files can be re-selected if needed
    e.target.value = "";
    for (const file of files) {
      const url = await handleImageUpload(file, "gallery");
      if (url) {
        setForm((prev) => ({
          ...prev,
          images: { ...prev.images, gallery: [...prev.images.gallery, url] },
        }));
      }
    }
  };

  const handleGalleryVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    e.target.value = "";
    for (const file of files) {
      const url = await handleVideoUpload(file, "gallery");
      if (url) {
        setForm((prev) => ({
          ...prev,
          images: { ...prev.images, gallery: [...prev.images.gallery, url] },
        }));
      }
    }
  };

  const handleAboutUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    e.target.value = "";

    const availableSlots = Math.max(0, 4 - form.aboutImages.length);
    if (availableSlots === 0) {
      showToast("About section supports up to 4 photos.", true);
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      const url = await handleImageUpload(file, "about");
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      setForm((prev) => ({
        ...prev,
        aboutImages: [...prev.aboutImages, ...uploadedUrls].slice(0, 4),
      }));
    }

    if (files.length > filesToUpload.length) {
      showToast("Only the first 4 About photos are kept.");
    }
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        gallery: prev.images.gallery.filter((_, i) => i !== index),
      },
    }));
  };

  const removeAboutImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      aboutImages: prev.aboutImages.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.handle.trim()) {
      showToast("Name and handle are required", true);
      return;
    }

    setSaving(true);
    try {
      const computedMedia =
        form.countryImages.reduce((sum, c) => sum + c.images.length, 0) +
        form.collectionImages.reduce((sum, c) => sum + c.images.length, 0);
      const payload = { ...form, media: computedMedia };
      let res: Response;
      if (editing) {
        res = await fetch(`/api/profiles/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/profiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        showToast(errData?.error || `Save failed (${res.status})`, true);
        setSaving(false);
        return;
      }
      showToast(editing ? "Profile updated" : "Profile added");
      setForm(emptyForm);
      setEditing(null);
      await fetchProfiles();
    } catch (err) {
      showToast(`Failed to save: ${err instanceof Error ? err.message : "Network error"}`, true);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this profile?")) return;
    try {
      await fetch(`/api/profiles/${id}`, { method: "DELETE" });
      showToast("Profile deleted");
      if (editing?.id === id) {
        setEditing(null);
        setForm(emptyForm);
      }
      await fetchProfiles();
    } catch {
      showToast("Failed to delete");
    }
  };

  const startEdit = (p: Profile) => {
    setEditing(p);
    setForm({
      name: p.name,
      handle: p.handle,
      country: p.country,
      flag: p.flag,
      flagCode: p.flagCode,
      homelandFlagCode: p.homelandFlagCode || "",
      currentlyInFlagCode: p.currentlyInFlagCode || "",
      countries: p.countries,
      media: p.media,
      collections: p.collections,
      images: { ...p.images, gallery: [...p.images.gallery] },
      align: p.align,
      bio: p.bio,
      interests: [...p.interests],
      languages: [...p.languages],
      homeland: p.homeland,
      currentlyIn: p.currentlyIn,
      socials: { ...p.socials, x: p.socials.x || "", instagram: p.socials.instagram || "", linkedin: p.socials.linkedin || "", youtube: p.socials.youtube || "" },
      aboutImages: p.aboutImages ? [...p.aboutImages] : [],
      visitedCountryCodes: [...p.visitedCountryCodes],
      countryImages: p.countryImages ? [...p.countryImages] : [],
      collectionImages: p.collectionImages ? [...p.collectionImages] : [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const selectableMediaUrls = Array.from(
    new Set([
      ...form.countryImages.flatMap((c) => c.images),
      ...form.collectionImages.flatMap((c) => c.images),
    ])
  );
  const canPickFromMedia = selectableMediaUrls.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl text-sm font-medium shadow-lg animate-[fadeIn_0.2s_ease-out] ${toast.error ? "bg-red-500" : "bg-[#5A45F9]"}`}>
          {toast.msg}
        </div>
      )}

      {/* Media Picker Modal */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setMediaPickerTarget(null)}>
          <div className="bg-black-700 border border-white/10 rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Select from your media</h3>
              <button onClick={() => setMediaPickerTarget(null)} className="text-white/40 hover:text-white text-lg cursor-pointer">✕</button>
            </div>
            <p className="text-xs text-white/40 mb-3">
              {mediaPickerTarget.type === "about"
                ? `Tap photos to add them to About (${form.aboutImages.length}/4 selected).`
                : "Tap items to add them. Already added items are dimmed."}
            </p>
            <div className="overflow-y-auto flex-1 -mx-1">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 px-1">
                {selectableMediaUrls.map((url, i) => {
                  const existing = mediaPickerTarget.type === "country"
                    ? form.countryImages[mediaPickerTarget.idx ?? -1]?.images ?? []
                    : mediaPickerTarget.type === "collection"
                      ? form.collectionImages[mediaPickerTarget.idx ?? -1]?.images ?? []
                      : form.aboutImages;
                  const isAlreadyAdded = existing.includes(url);
                  const isVid = /\.(mp4|mov|webm|m4v)$/i.test(url);
                  const aboutLimitReached = mediaPickerTarget.type === "about" && form.aboutImages.length >= 4;
                  const videoBlockedForAbout = mediaPickerTarget.type === "about" && isVid;
                  const disabled = isAlreadyAdded || aboutLimitReached || videoBlockedForAbout;

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        const { type, idx } = mediaPickerTarget;
                        if (type === "country" && typeof idx === "number") {
                          setForm((prev) => ({
                            ...prev,
                            countryImages: prev.countryImages.map((c, ci) =>
                              ci === idx ? { ...c, images: [...c.images, url] } : c
                            ),
                          }));
                          return;
                        }

                        if (type === "collection" && typeof idx === "number") {
                          setForm((prev) => ({
                            ...prev,
                            collectionImages: prev.collectionImages.map((c, ci) =>
                              ci === idx ? { ...c, images: [...c.images, url] } : c
                            ),
                          }));
                          return;
                        }

                        setForm((prev) => ({
                          ...prev,
                          aboutImages: [...prev.aboutImages, url].slice(0, 4),
                        }));
                      }}
                      className={`group relative aspect-square rounded-xl overflow-hidden bg-white/5 transition-all ${disabled ? "opacity-30 cursor-not-allowed" : "hover:ring-2 hover:ring-[#5A45F9] cursor-pointer"}`}
                    >
                      {isVid ? (
                        <>
                          <video
                            src={toLandingAssetUrl(url)}
                            muted
                            playsInline
                            loop
                            preload="metadata"
                            className="w-full h-full object-cover"
                            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                            onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                            <span className="text-white text-[14px] drop-shadow">▶</span>
                          </div>
                        </>
                      ) : (
                        <Image src={toLandingAssetUrl(url)} alt={`Media ${i + 1}`} fill className="object-cover" />
                      )}
                      {isAlreadyAdded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={() => setMediaPickerTarget(null)} className="mt-4 w-full py-2.5 bg-[#5A45F9] hover:bg-[#4a35e9] rounded-lg text-sm font-medium transition-colors cursor-pointer">
              Done
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-40">
        <div className="flex items-center gap-3">
          <a
            href="/admin"
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            ← Dashboard
          </a>
          <span className="text-white/20">|</span>
          <h1 className="text-lg font-semibold">Featured Profiles CMS</h1>
        </div>
        <span className="text-white/40 text-sm">
          {profiles.length} profile{profiles.length !== 1 && "s"}
        </span>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col xl:flex-row gap-8">
        {/* Form Panel */}
        <div className="xl:w-120 shrink-0">
          <div className="bg-[#141414] rounded-2xl border border-white/10 p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-6">
              {editing ? "Edit Profile" : "Add New Profile"}
            </h2>

            <div className="space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
              {/* Images Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">
                  Images
                </h3>

                {/* Cover Image */}
                <div>
                  <label className="text-sm text-white/60 block mb-2">
                    Cover Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-20 rounded-lg overflow-hidden bg-white/5 shrink-0 relative">
                      {form.images.cover ? (
                        <Image
                          src={toLandingAssetUrl(form.images.cover)}
                          alt="Cover"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                          No cover
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploading !== null}
                        className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading?.field === "cover" ? "Uploading…" : "Upload Cover"}
                      </button>
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-white/30 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Avatar Image */}
                <div>
                  <label className="text-sm text-white/60 block mb-2">
                    Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0 relative">
                      {form.images.avatar ? (
                        <Image
                          src={toLandingAssetUrl(form.images.avatar)}
                          alt="Avatar"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                          No avatar
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploading !== null}
                        className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading?.field === "avatar" ? "Uploading…" : "Upload Avatar"}
                      </button>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>


                {/* About Photos */}
                <div>
                  <label className="text-sm text-white/60 block mb-2">
                    About Photos ({form.aboutImages.length}/4)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.aboutImages.map((url, i) => (
                      <div
                        key={i}
                        className="relative w-20 h-16 rounded-lg overflow-hidden bg-white/5 group"
                      >
                        <Image
                          src={toLandingAssetUrl(url)}
                          alt={`About ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => removeAboutImage(i)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - form.aboutImages.length) }).map((_, i) => (
                      <div
                        key={`about-placeholder-${i}`}
                        className="w-20 h-16 rounded-lg border border-dashed border-white/15 bg-white/5 flex items-center justify-center text-[10px] text-white/30"
                      >
                        Slot {form.aboutImages.length + i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => aboutInputRef.current?.click()}
                      disabled={uploading !== null || form.aboutImages.length >= 4}
                      className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading?.field === "about" ? "Uploading…" : "+ Add Media"}
                    </button>
                    <input
                      ref={aboutInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length === 0) return;
                        e.target.value = "";

                        const availableSlots = Math.max(0, 4 - form.aboutImages.length);
                        if (availableSlots === 0) {
                          showToast("About section supports up to 4 media items.", true);
                          return;
                        }

                        const filesToUpload = files.slice(0, availableSlots);
                        const uploadedUrls: string[] = [];

                        for (const file of filesToUpload) {
                          if (file.type.startsWith("video/")) {
                            const url = await handleVideoUpload(file, "about");
                            if (url) uploadedUrls.push(url);
                          } else {
                            const url = await handleImageUpload(file, "about");
                            if (url) uploadedUrls.push(url);
                          }
                        }

                        if (uploadedUrls.length > 0) {
                          setForm((prev) => ({
                            ...prev,
                            aboutImages: [...prev.aboutImages, ...uploadedUrls].slice(0, 4),
                          }));
                        }

                        if (files.length > filesToUpload.length) {
                          showToast("Only the first 4 About media items are kept.");
                        }
                      }}
                      className="hidden"
                    />
                    {uploading?.field === "about" && (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    )}
                    {canPickFromMedia && (
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget({ type: "about" })}
                        disabled={form.aboutImages.length >= 4}
                        className="px-4 py-2 bg-[#5A45F9]/20 hover:bg-[#5A45F9]/30 text-[#8B7BFF] rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Select from media
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-white/30 mt-1">
                    Only displayed in the About tab. Max 4 photos.
                  </p>
                </div>

                {/* Country Images */}
                <div>
                  <label className="text-sm text-white/60 block mb-2">
                    Country Images
                  </label>
                  <div className="space-y-2 mb-2">
                    {form.countryImages.map((ci, idx) => {
                      const country = getCountryByCode(ci.countryCode);
                      return (
                        <div key={idx} className="bg-white/5 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {country && (
                                <img
                                  src={`/flags/${ci.countryCode}.svg`}
                                  alt={country.name}
                                  className="w-4 h-3 rounded-sm object-cover"
                                />
                              )}
                              <span className="text-sm text-white font-medium">{country?.name || ci.countryCode}</span>
                              <span className="text-xs text-white/40 ml-1">({ci.images.filter(u => !u.match(/\.(mp4|mov|webm|m4v)$/i)).length} photos · {ci.images.filter(u => u.match(/\.(mp4|mov|webm|m4v)$/i)).length} videos)</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <label className="px-2 py-1 bg-white/10 hover:bg-white/15 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2">
                                + Add Media
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  multiple
                                  className="hidden"
                                  onChange={async (e) => {
                                    const files = Array.from(e.target.files ?? []);
                                    if (files.length === 0) return;
                                    e.target.value = "";
                                    const urls: string[] = [];
                                    for (const file of files) {
                                      if (file.type.startsWith("video/")) {
                                        const url = await handleVideoUpload(file, "country", idx);
                                        if (url) urls.push(url);
                                      } else {
                                        const url = await handleImageUpload(file, "country", idx);
                                        if (url) urls.push(url);
                                      }
                                    }
                                    if (urls.length > 0) {
                                      setForm((prev) => ({
                                        ...prev,
                                        countryImages: prev.countryImages.map((c, i) =>
                                          i === idx ? { ...c, images: [...c.images, ...urls] } : c
                                        ),
                                      }));
                                    }
                                  }}
                                />
                                {uploading?.field === "country" && uploading?.idx === idx && (
                                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                )}
                              </label>
                              {canPickFromMedia && (
                                <button
                                  type="button"
                                  onClick={() => setMediaPickerTarget({ type: "country", idx })}
                                  className="px-2 py-1 bg-[#5A45F9]/20 hover:bg-[#5A45F9]/30 text-[#8B7BFF] rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  Select from media
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    countryImages: prev.countryImages.filter((_, i) => i !== idx),
                                  }))
                                }
                                className="p-1 hover:bg-red-500/20 rounded-md text-white/40 hover:text-red-400 transition-colors cursor-pointer text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {ci.images.map((imgUrl, imgIdx) => {
                              const isVid = /\.(mp4|mov|webm|m4v)$/i.test(imgUrl);
                              return (
                                <div key={imgIdx} className="relative group w-16 h-12 rounded-md overflow-hidden bg-white/5 shrink-0">
                                  {isVid ? (
                                    <>
                                      <video
                                        src={toLandingAssetUrl(imgUrl)}
                                        muted
                                        playsInline
                                        loop
                                        preload="metadata"
                                        className="w-full h-full object-cover"
                                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                                        onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                        onClick={(e) => { const v = e.currentTarget; if (v.paused) v.play().catch(() => {}); else { v.pause(); v.currentTime = 0; } }}
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                        <span className="text-white text-[16px] drop-shadow">▶</span>
                                      </div>
                                    </>
                                  ) : (
                                    <Image
                                      src={toLandingAssetUrl(imgUrl)}
                                      alt={`${country?.name || ci.countryCode} ${imgIdx + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  )}
                                  <button
                                    onClick={() =>
                                      setForm((prev) => ({
                                        ...prev,
                                        countryImages: prev.countryImages.map((c, i) =>
                                          i === idx ? { ...c, images: c.images.filter((_, j) => j !== imgIdx) } : c
                                        ).filter((c) => c.images.length > 0),
                                      }))
                                    }
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-red-400 text-xs"
                                  >
                                    ✕
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <CountrySelect
                        label=""
                        value={pendingCountryCode}
                        onChange={(code) => setPendingCountryCode(code)}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!pendingCountryCode}
                      onClick={() => {
                        if (!pendingCountryCode) return;
                        const alreadyExists = form.countryImages.some(
                          (c) => c.countryCode === pendingCountryCode
                        );
                        if (!alreadyExists) {
                          setForm((prev) => ({
                            ...prev,
                            countryImages: [
                              ...prev.countryImages,
                              { countryCode: pendingCountryCode, images: [] },
                            ],
                          }));
                        }
                        setPendingCountryCode("");
                      }}
                      className="px-3 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      + Add Country
                    </button>
                  </div>
                </div>

                {/* Collection Images */}
                <div>
                  <label className="text-sm text-white/60 block mb-2">
                    Collection Images
                  </label>
                  <div className="space-y-2 mb-2">
                    {form.collectionImages.map((ci, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm text-white font-medium">{ci.title}</span>
                            <span className="text-xs text-white/40 ml-1">({ci.images.filter(u => !u.match(/\.(mp4|mov|webm|m4v)$/i)).length} photos · {ci.images.filter(u => u.match(/\.(mp4|mov|webm|m4v)$/i)).length} videos)</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <label className="px-2 py-1 bg-white/10 hover:bg-white/15 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2">
                              + Add Media
                              <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                className="hidden"
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files ?? []);
                                  if (files.length === 0) return;
                                  e.target.value = "";
                                  const urls: string[] = [];
                                  for (const file of files) {
                                    if (file.type.startsWith("video/")) {
                                      const url = await handleVideoUpload(file, "collection", idx);
                                      if (url) urls.push(url);
                                    } else {
                                      const url = await handleImageUpload(file, "collection", idx);
                                      if (url) urls.push(url);
                                    }
                                  }
                                  if (urls.length > 0) {
                                    setForm((prev) => ({
                                      ...prev,
                                      collectionImages: prev.collectionImages.map((c, i) =>
                                        i === idx ? { ...c, images: [...c.images, ...urls] } : c
                                      ),
                                    }));
                                  }
                                }}
                              />
                              {uploading?.field === "collection" && uploading?.idx === idx && (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              )}
                            </label>
                            {canPickFromMedia && (
                              <button
                                type="button"
                                onClick={() => setMediaPickerTarget({ type: "collection", idx })}
                                className="px-2 py-1 bg-[#5A45F9]/20 hover:bg-[#5A45F9]/30 text-[#8B7BFF] rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                              >
                                Select from media
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  collectionImages: prev.collectionImages.filter((_, i) => i !== idx),
                                }))
                              }
                              className="p-1 hover:bg-red-500/20 rounded-md text-white/40 hover:text-red-400 transition-colors cursor-pointer text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ci.images.map((imgUrl, imgIdx) => {
                            const isVid = /\.(mp4|mov|webm|m4v)$/i.test(imgUrl);
                            return (
                              <div key={imgIdx} className="relative group w-16 h-12 rounded-md overflow-hidden bg-white/5 shrink-0">
                                {isVid ? (
                                  <>
                                    <video
                                      src={toLandingAssetUrl(imgUrl)}
                                      muted
                                      playsInline
                                      loop
                                      preload="metadata"
                                      className="w-full h-full object-cover"
                                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                                      onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                      onClick={(e) => { const v = e.currentTarget; if (v.paused) v.play().catch(() => {}); else { v.pause(); v.currentTime = 0; } }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                      <span className="text-white text-[16px] drop-shadow">▶</span>
                                    </div>
                                  </>
                                ) : (
                                  <Image
                                    src={toLandingAssetUrl(imgUrl)}
                                    alt={`${ci.title} ${imgIdx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                                <button
                                  onClick={() =>
                                    setForm((prev) => ({
                                      ...prev,
                                      collectionImages: prev.collectionImages.map((c, i) =>
                                        i === idx ? { ...c, images: c.images.filter((_, j) => j !== imgIdx) } : c
                                      ).filter((c) => c.images.length > 0),
                                    }))
                                  }
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-red-400 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={pendingCollectionTitle}
                        onChange={(e) => setPendingCollectionTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const title = pendingCollectionTitle.trim();
                            if (!title) return;
                            setForm((prev) => ({
                              ...prev,
                              collectionImages: [
                                ...prev.collectionImages,
                                { title, images: [] },
                              ],
                            }));
                            setPendingCollectionTitle("");
                          }
                        }}
                        placeholder="Collection title..."
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9] transition-colors"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!pendingCollectionTitle.trim()}
                      onClick={() => {
                        const title = pendingCollectionTitle.trim();
                        if (!title) return;
                        setForm((prev) => ({
                          ...prev,
                          collectionImages: [
                            ...prev.collectionImages,
                            { title, images: [] },
                          ],
                        }));
                        setPendingCollectionTitle("");
                      }}
                      className="px-3 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      + Add Collection
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">
                  Basic Info
                </h3>

                {/* Name */}
                <div>
                  <label className="text-sm text-white/60 block mb-1.5">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Michael Thompson"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9] transition-colors"
                  />
                </div>

                {/* Handle */}
                <div>
                  <label className="text-sm text-white/60 block mb-1.5">
                    Handle <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.handle}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, handle: e.target.value }))
                    }
                    placeholder="e.g. @micheal.th99"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9] transition-colors"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="text-sm text-white/60 block mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Short bio about this traveler..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9] transition-colors resize-none"
                  />
                </div>

                {/* Align */}
                <div>
                  <label className="text-sm text-white/60 block mb-1.5">
                    Card Alignment
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, align: "start" }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        form.align === "start"
                          ? "bg-[#5A45F9] text-white"
                          : "bg-white/10 text-white/60 hover:bg-white/15"
                      }`}
                    >
                      Start
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, align: "end" }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        form.align === "end"
                          ? "bg-[#5A45F9] text-white"
                          : "bg-white/10 text-white/60 hover:bg-white/15"
                      }`}
                    >
                      End
                    </button>
                  </div>
                </div>
              </div>

              {/* Country & Location */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">
                  Country & Location
                </h3>

                {/* Primary Country */}
                <CountrySelect
                  label="Primary Country"
                  value={form.flagCode}
                  onChange={(code, name, flag) =>
                    setForm((prev) => ({
                      ...prev,
                      flagCode: code,
                      country: name,
                      flag,
                    }))
                  }
                />

                {/* Homeland */}
                <div className="space-y-2">
                  <CountrySelect
                    label="Homeland Country"
                    value={form.homelandFlagCode}
                    onChange={(code, name) =>
                      setForm((prev) => ({
                        ...prev,
                        homelandFlagCode: code,
                        // Pre-fill city text if empty, otherwise keep what admin typed
                        homeland: prev.homeland || name,
                      }))
                    }
                  />
                  <input
                    type="text"
                    value={form.homeland}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, homeland: e.target.value }))
                    }
                    placeholder="City, e.g. Bogota"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9] transition-colors"
                  />
                </div>

                {/* Currently In */}
                <div className="space-y-2">
                  <CountrySelect
                    label="Currently In Country"
                    value={form.currentlyInFlagCode}
                    onChange={(code, name) =>
                      setForm((prev) => ({
                        ...prev,
                        currentlyInFlagCode: code,
                        currentlyIn: prev.currentlyIn || name,
                      }))
                    }
                  />
                  <input
                    type="text"
                    value={form.currentlyIn}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, currentlyIn: e.target.value }))
                    }
                    placeholder="City, e.g. Medellin"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9] transition-colors"
                  />
                </div>

                {/* Visited Countries */}
                <MultiCountrySelect
                  label="Visited Countries"
                  value={form.visitedCountryCodes}
                  onChange={(codes) =>
                    setForm((prev) => ({
                      ...prev,
                      visitedCountryCodes: codes,
                      countries: codes.length,
                    }))
                  }
                />
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">
                  Stats
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm text-white/60 block mb-1.5">
                      Countries
                    </label>
                    <input
                      type="number"
                      value={form.countries}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          countries: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#5A45F9] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 block mb-1.5">
                      Media
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={
                        form.images.gallery.length +
                        form.countryImages.reduce((sum, c) => sum + c.images.length, 0) +
                        form.collectionImages.reduce((sum, c) => sum + c.images.length, 0)
                      }
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 block mb-1.5">
                      Collections
                    </label>
                    <input
                      type="number"
                      value={form.collections}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          collections: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#5A45F9] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">
                  Interests & Languages
                </h3>
                <TagInput
                  label="Interests"
                  value={form.interests}
                  onChange={(v) =>
                    setForm((prev) => ({ ...prev, interests: v }))
                  }
                  placeholder="e.g. Photography, Hiking"
                />
                <TagInput
                  label="Languages"
                  value={form.languages}
                  onChange={(v) =>
                    setForm((prev) => ({ ...prev, languages: v }))
                  }
                  placeholder="e.g. English, Spanish"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">
                  Social Links
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-xs w-16">
                      Instagram
                    </span>
                    <input
                      type="text"
                      value={form.socials.instagram}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          socials: {
                            ...prev.socials,
                            instagram: e.target.value,
                          },
                        }))
                      }
                      placeholder="username"
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9] transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-xs w-16">X</span>
                    <input
                      type="text"
                      value={form.socials.x}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          socials: { ...prev.socials, x: e.target.value },
                        }))
                      }
                      placeholder="username"
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9] transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-xs w-16">LinkedIn</span>
                    <input
                      type="text"
                      value={form.socials.linkedin}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          socials: {
                            ...prev.socials,
                            linkedin: e.target.value,
                          },
                        }))
                      }
                      placeholder="username"
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9] transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-xs w-16">YouTube</span>
                    <input
                      type="text"
                      value={form.socials.youtube}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          socials: {
                            ...prev.socials,
                            youtube: e.target.value,
                          },
                        }))
                      }
                      placeholder="channel"
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#5A45F9] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#5A45F9] hover:bg-[#4935e0] rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Update Profile"
                      : "Add Profile"}
                </button>
                {editing && (
                  <button
                    onClick={cancelEdit}
                    className="py-2.5 px-4 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List Panel */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold mb-4">All Profiles</h2>

          {loading ? (
            <div className="text-white/40 text-sm py-12 text-center">
              Loading...
            </div>
          ) : profiles.length === 0 ? (
            <div className="bg-[#141414] rounded-2xl border border-white/10 p-12 text-center">
              <p className="text-white/40 text-sm">No profiles yet</p>
              <p className="text-white/20 text-xs mt-1">
                Add your first one using the form
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {profiles.map((p) => (
                <div
                  key={p.id}
                  className={`bg-[#141414] rounded-xl border p-4 transition-colors ${
                    editing?.id === p.id
                      ? "border-[#5A45F9]"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0 relative">
                      {p.images.avatar ? (
                        <Image
                          src={toLandingAssetUrl(p.images.avatar)}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-lg">
                          👤
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {p.flagCode && (
                          <img
                            src={`/flags/${p.flagCode}.svg`}
                            alt={p.country}
                            className="w-4 h-3 rounded-sm object-cover"
                          />
                        )}
                        <span className="font-medium text-sm">{p.name}</span>
                        <span className="text-white/40 text-xs">
                          {p.handle}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-2">
                        {p.bio}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <span>{p.countries} countries</span>
                        <span>•</span>
                        <span>{p.media} media</span>
                        <span>•</span>
                        <span>{p.collections} collections</span>
                      </div>
                      {/* Visited flags preview */}
                      {p.visitedCountryCodes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.visitedCountryCodes.slice(0, 15).map((code) => (
                            <img
                              key={code}
                              src={`/flags/${code}.svg`}
                              alt={code}
                              className="w-4 h-3 rounded-sm object-cover"
                            />
                          ))}
                          {p.visitedCountryCodes.length > 15 && (
                            <span className="text-white/20 text-[10px] self-center">
                              +{p.visitedCountryCodes.length - 15}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/profiles/${p.id}`}
                        target="_blank"
                        className="p-2 hover:bg-white/10 rounded-lg text-xs text-white/60 hover:text-white transition-colors"
                        title="View profile"
                      >
                        🔗
                      </Link>
                      <button
                        onClick={() => startEdit(p)}
                        className="p-2 hover:bg-white/10 rounded-lg text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-xs text-white/60 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Cover preview */}
                  {p.images.cover && (
                    <div className="mt-3 h-20 rounded-lg overflow-hidden relative">
                      <Image
                        src={toLandingAssetUrl(p.images.cover)}
                        alt="Cover"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
