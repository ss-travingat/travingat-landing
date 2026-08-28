"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import * as htmlToImage from "html-to-image";
import { ClassicCard, MinimalCard, AdventureCard, ImagePlaceholderIcon, AvatarPlaceholderIcon } from "./cards";
import EmailVerificationForm from "@/components/getfeatured/EmailVerificationForm";

import countryData from "./countries.json";
import { DesktopExplorerForm } from "./DesktopExplorerForm";
import { MobileExplorerForm } from "./MobileExplorerForm";

const sampleFlags: Record<string, string> = {};
const sortedEntries = Object.entries(countryData)
  .filter(([code]) => code.length === 2)
  .sort((a, b) => a[1].localeCompare(b[1]));

for (const [code, name] of sortedEntries) {
  sampleFlags[name] = code.toUpperCase();
}

type Tab = "Classic" | "Minimal" | "Adventure";

export default function Home({ initialSessionUser, initialExplorerCard }: { initialSessionUser?: any, initialExplorerCard?: any } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sessionUser, setSessionUser] = useState<any>(initialSessionUser);
  const [form, setForm] = useState({
    firstName: initialExplorerCard?.name?.split(' ')[0] || initialSessionUser?.first_name || "",
    lastName: initialExplorerCard?.name?.split(' ').slice(1).join(' ') || initialSessionUser?.last_name || "",
    email: initialSessionUser?.email || "",
    country: initialExplorerCard?.country || initialSessionUser?.country || "",
    coverImage: initialExplorerCard?.cover_image_url || initialSessionUser?.cover_image_url || "",
    profileImage: initialExplorerCard?.profile_image_url || initialSessionUser?.profile_image_url || "",
  });

  let initVisited: string[] = [];
  const visitedCountriesSrc = (initialExplorerCard?.visited_countries && initialExplorerCard.visited_countries.length > 0) 
    ? initialExplorerCard.visited_countries 
    : initialSessionUser?.visited_countries;

  if (visitedCountriesSrc) {
    if (Array.isArray(visitedCountriesSrc)) {
      initVisited = [...visitedCountriesSrc];
    } else if (typeof visitedCountriesSrc === 'string') {
      try {
        initVisited = JSON.parse(visitedCountriesSrc);
      } catch {}
    } else {
      try {
        initVisited = Array.from(visitedCountriesSrc);
      } catch {}
    }
  }

  // Ensure initVisited is truly an array of strings before passing to state
  if (!Array.isArray(initVisited)) {
    initVisited = [];
  }

  const [visited, setVisited] = useState<string[]>(initVisited);
  const [countryQuery, setCountryQuery] = useState("");
  const [visitedOpen, setVisitedOpen] = useState(false);
  const [isCreated, setIsCreated] = useState(!!initialExplorerCard?.card_created);
  const [createdUserId, setCreatedUserId] = useState<string | null>(initialSessionUser?.id || null);
  const initialStyle = initialExplorerCard?.card_style;
  const isValidTab = ["Classic", "Minimal", "Adventure"].includes(initialStyle);
  const defaultTab = isValidTab ? initialStyle : "Classic";
  const [tab, setTab] = useState<Tab>(defaultTab as Tab);
  const [fromOpen, setFromOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareStyle, setShareStyle] = useState<Tab | null>(null);
  
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Verification State
  const [isVerified, setIsVerified] = useState(!!initialSessionUser);

  const classicRef = useRef<HTMLDivElement>(null);
  const minimalRef = useRef<HTMLDivElement>(null);
  const adventureRef = useRef<HTMLDivElement>(null);

  const downloadRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const mobileDownloadRef = useRef<HTMLDivElement>(null);
  const mobileShareRef = useRef<HTMLDivElement>(null);



  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isDownloadModalOpen) {
        if (
          (!downloadRef.current || !downloadRef.current.contains(event.target as Node)) &&
          (!mobileDownloadRef.current || !mobileDownloadRef.current.contains(event.target as Node))
        ) {
          setIsDownloadModalOpen(false);
        }
      }
      if (isShareModalOpen) {
        if (
          (!shareRef.current || !shareRef.current.contains(event.target as Node)) &&
          (!mobileShareRef.current || !mobileShareRef.current.contains(event.target as Node))
        ) {
          setIsShareModalOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDownloadModalOpen, isShareModalOpen]);

  const getStyleDataUrl = useCallback(async (style: Tab) => {
    const ref = style === "Classic" ? classicRef : style === "Minimal" ? minimalRef : adventureRef;
    if (ref.current === null || !ref.current.firstElementChild) {
      return null;
    }
    
    const node = ref.current.firstElementChild as HTMLElement;

    try {
      return await htmlToImage.toPng(node, { 
        pixelRatio: 2,
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    } catch (err) {
      console.error("Oops, something went wrong!", err);
      return null;
    }
  }, []);

  const handleDownloadStyle = useCallback(async (style: Tab) => {
    const dataUrl = await getStyleDataUrl(style);
    if (!dataUrl) {
      alert("Failed to download image.");
      return;
    }
    const link = document.createElement("a");
    link.download = `explorer-card-${style.toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  }, [getStyleDataUrl]);

  const downloadAllStyles = useCallback(async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    let hasFiles = false;

    for (const style of ["Classic", "Minimal", "Adventure"] as Tab[]) {
      const dataUrl = await getStyleDataUrl(style);
      if (dataUrl) {
        const base64Data = dataUrl.split(",")[1];
        zip.file(`explorer-card-${style.toLowerCase()}.png`, base64Data, { base64: true });
        hasFiles = true;
      }
    }

    if (hasFiles) {
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "explorer-cards.zip";
      link.click();
      URL.revokeObjectURL(link.href);
    } else {
      alert("Failed to generate zip file.");
    }
  }, [getStyleDataUrl]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target as HTMLInputElement;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, key: "coverImage" | "profileImage") {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("Only an image under 20 MB can be uploaded.");
      e.target.value = "";
      return;
    }
    
    if (key === "profileImage") setProfileFile(file);
    if (key === "coverImage") setCoverFile(file);
    
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, [key]: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  async function handleCreate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    // --- Validation ---
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Fill this field to continue";
    if (!form.lastName.trim()) newErrors.lastName = "Fill this field to continue";
    if (!form.country.trim()) newErrors.country = "Fill this field to continue";
    if (!form.profileImage && !profileFile) newErrors.profileImage = "Fill this field to continue";
    if (!form.coverImage && !coverFile) newErrors.coverImage = "Fill this field to continue";
    if (visited.length < 5) newErrors.visited = `Please select at least 5 countries you have visited. You have selected ${visited.length}.`;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      let finalProfileUrl = form.profileImage;
      if (profileFile) {
        const presignRes = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: profileFile.name, fileType: profileFile.type, prefix: "explorercard/users" }),
        });
        const presignData = await presignRes.json();
        if (presignData.error) throw new Error(presignData.error);
        await fetch(presignData.uploadUrl, { method: "PUT", headers: { "Content-Type": profileFile.type }, body: profileFile });
        finalProfileUrl = presignData.publicUrl;
      }
      
      let finalCoverUrl = form.coverImage;
      if (coverFile) {
        const presignRes = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: coverFile.name, fileType: coverFile.type, prefix: "explorercard/users" }),
        });
        const presignData = await presignRes.json();
        if (presignData.error) throw new Error(presignData.error);
        await fetch(presignData.uploadUrl, { method: "PUT", headers: { "Content-Type": coverFile.type }, body: coverFile });
        finalCoverUrl = presignData.publicUrl;
      }

      // 1. Hit API to create user
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("country", form.country);
      formData.append("visitedCountries", JSON.stringify(visited));
      if (finalProfileUrl && !finalProfileUrl.startsWith('data:')) {
        formData.append("existingProfileImage", finalProfileUrl);
      }
      if (finalCoverUrl && !finalCoverUrl.startsWith('data:')) {
        formData.append("existingCoverImage", finalCoverUrl);
      }
      formData.append("cardStyle", tab);

      const res = await fetch("/api/explorercard", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (!data.success) {
        alert("Failed to create explorer card: " + (data.error || "Unknown error"));
        setIsSubmitting(false);
        return;
      }

      setForm((s) => ({
        ...s,
        profileImage: finalProfileUrl,
        coverImage: finalCoverUrl,
      }));

      setCreatedUserId(data.userId);
      setIsCreated(true);

    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating the card.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveAndLogout() {
    setIsSubmitting(true);
    try {
      let finalProfileUrl = form.profileImage;
      if (profileFile) {
        const presignRes = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: profileFile.name, fileType: profileFile.type, prefix: "explorercard/users" }),
        });
        const presignData = await presignRes.json();
        if (presignData.error) throw new Error(presignData.error);
        await fetch(presignData.uploadUrl, { method: "PUT", headers: { "Content-Type": profileFile.type }, body: profileFile });
        finalProfileUrl = presignData.publicUrl;
      }
      
      let finalCoverUrl = form.coverImage;
      if (coverFile) {
        const presignRes = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: coverFile.name, fileType: coverFile.type, prefix: "explorercard/users" }),
        });
        const presignData = await presignRes.json();
        if (presignData.error) throw new Error(presignData.error);
        await fetch(presignData.uploadUrl, { method: "PUT", headers: { "Content-Type": coverFile.type }, body: coverFile });
        finalCoverUrl = presignData.publicUrl;
      }

      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("country", form.country);
      formData.append("visitedCountries", JSON.stringify(visited));
      if (finalProfileUrl && !finalProfileUrl.startsWith('data:')) {
        formData.append("existingProfileImage", finalProfileUrl);
      }
      if (finalCoverUrl && !finalCoverUrl.startsWith('data:')) {
        formData.append("existingCoverImage", finalCoverUrl);
      }
      formData.append("cardStyle", tab);

      await fetch("/api/explorercard", {
        method: "POST",
        body: formData,
      });

    } catch (err) {
      console.error("Failed to save progress", err);
    } finally {
      setIsSubmitting(false);
      try {
        await fetch('/api/auth/logout-user', { method: 'POST' });
      } catch (e) {}
      window.location.href = '/join/explorercard';
    }
  }

  const countryMatches = Object.keys(sampleFlags).filter(
    (c) => c.toLowerCase().includes(countryQuery.toLowerCase())
  );

  function addCountry(c: string) {
    if (!visited.includes(c)) {
      setVisited((v) => [...v, c]);
    }
  }

  function removeCountry(c: string) {
    setVisited((v) => v.filter((x) => x !== c));
  }

  const visitedArray = visited;

  if (isCreated) {
    return (
      <main className="bg-background text-white min-h-screen flex flex-col items-center px-0 lg:px-6 pb-[100px] lg:pb-12 w-full pt-[16px] lg:pt-0">
        {/* Header */}
        <div className="w-full flex lg:flex-row flex-col items-center lg:items-center justify-center lg:py-[40px] max-w-[1062px]">
          <div className="flex flex-col items-center gap-[6px] lg:gap-[12px] text-center w-full lg:w-[482px] mb-[20px] lg:mb-0">
            <h2 className="hidden lg:block text-[32px] font-medium leading-[40px] tracking-[-0.5px] ds-font-display">Your explorer card is ready</h2>
            <h2 className="lg:hidden text-[24px] font-medium tracking-[-0.5px] ds-font-display">Your explorer card</h2>
            <p className="hidden lg:block text-[14px] text-[#989898]">We've emailed you a private edit link if you ever need to update your card.</p>
            <p className="lg:hidden text-[14px] text-[#7c7c7c]">Your edit link is in your email</p>
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-[1062px] lg:bg-[#111] bg-transparent lg:rounded-[20px] lg:p-[24px] lg:px-[32px] flex flex-col items-center gap-[17px] lg:gap-[20px]">
          {/* Container Header */}
          <div className="hidden lg:flex w-full items-center justify-between">
            <h3 className="text-[24px] text-white tracking-[-0.5px]">Explorer card</h3>
            <div className="flex items-center gap-[24px]">
              <div className="flex items-center gap-[16px]">
                <button onClick={() => setIsCreated(false)} className="text-[14px] font-medium text-white hover:text-white/80">Edit</button>
                <div className="w-[1px] h-[12px] bg-[#333]" />
                <div className="relative" ref={downloadRef}>
                  <button onClick={() => setIsDownloadModalOpen(!isDownloadModalOpen)} className="text-[14px] font-medium text-white hover:text-white/80">Download</button>
                  
                  {isDownloadModalOpen && (
                    <div className="absolute right-0 top-[100%] mt-2 w-[240px] bg-[#161616] border border-[#1e1e1e] rounded-[16px] p-[20px] pr-[32px] shadow-[20px_20px_10px_rgba(0,0,0,0.25)] flex flex-col gap-[20px] z-50">
                      <p className="text-[20px] font-medium text-center text-white tracking-[-0.5px]">Download</p>
                      
                      <button onClick={() => { handleDownloadStyle("Classic"); setIsDownloadModalOpen(false); }} className="flex items-center gap-[12px] w-full text-left group">
                        <div className="w-[40px] h-[40px] rounded-[8px] bg-[#1e1e1e] flex items-center justify-center shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] text-white">Classic</span>
                          <span className="text-[12px] text-[#656565]">PNG</span>
                        </div>
                      </button>
                      
                      <button onClick={() => { handleDownloadStyle("Minimal"); setIsDownloadModalOpen(false); }} className="flex items-center gap-[12px] w-full text-left group">
                        <div className="w-[40px] h-[40px] rounded-[8px] bg-[#1e1e1e] flex items-center justify-center shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] text-white">Minimal</span>
                          <span className="text-[12px] text-[#656565]">PNG</span>
                        </div>
                      </button>
                      
                      <button onClick={() => { handleDownloadStyle("Adventure"); setIsDownloadModalOpen(false); }} className="flex items-center gap-[12px] w-full text-left group">
                        <div className="w-[40px] h-[40px] rounded-[8px] bg-[#1e1e1e] flex items-center justify-center shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] text-white">Adventure</span>
                          <span className="text-[12px] text-[#656565]">PNG</span>
                        </div>
                      </button>
                      
                      <div className="w-full h-[1px] bg-[#1e1e1e]"></div>
                      
                      <button onClick={() => { downloadAllStyles(); setIsDownloadModalOpen(false); }} className="flex items-center gap-[12px] w-full text-left group">
                        <div className="w-[40px] h-[40px] rounded-[8px] bg-[#1e1e1e] flex items-center justify-center shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] text-white">All 3 styles</span>
                          <span className="text-[12px] text-[#656565]">Classic, Minimal, & Adventure</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative" ref={shareRef}>
                <button 
                  onClick={() => setIsShareModalOpen(!isShareModalOpen)}
                  className="bg-[#5952ff] rounded-[999px] px-[20px] py-[10px] text-[14px] font-medium text-white flex items-center gap-[6px] hover:opacity-90"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Share link
                </button>

                {isShareModalOpen && (
                  <div className="absolute right-0 top-[100%] mt-2 w-[320px] bg-[#161616] border border-[#1e1e1e] rounded-[24px] p-[32px] shadow-[20px_20px_10px_rgba(0,0,0,0.25)] flex flex-col items-center gap-[32px] z-50">
                    <div className="flex flex-col items-center text-center gap-[7px]">
                      <h4 className="text-[24px] font-medium text-white tracking-[-0.5px]">Share your card</h4>
                      <p className="text-[14px] text-white font-normal">Choose the style on your public link.</p>
                    </div>

                    <div className="flex flex-col gap-[16px] w-full">
                      {(["Classic", "Minimal", "Adventure"] as Tab[]).map((styleOption) => (
                        <button
                          key={styleOption}
                          onClick={() => setShareStyle(styleOption)}
                          className={`flex items-center gap-[8px] p-[16px] rounded-[12px] w-full transition ${shareStyle === styleOption ? "bg-[#1e1e1e] border border-white" : "bg-[#1e1e1e] border border-transparent"}`}
                        >
                          <div className={`w-[20px] h-[20px] rounded-full border-[2px] flex items-center justify-center shrink-0 ${shareStyle === styleOption ? "border-white" : "border-[#666]"}`}>
                            {shareStyle === styleOption && <div className="w-[10px] h-[10px] bg-white rounded-full" />}
                          </div>
                          <span className="text-[16px] text-white">{styleOption}</span>
                        </button>
                      ))}
                    </div>

                    {shareStyle && (
                      <p className="text-[16px] font-medium text-[#ecf0ff] underline decoration-wavy underline-offset-4 decoration-white/50">
                        travingat.com/ec/{createdUserId?.split("-")[0] || "123"}
                      </p>
                    )}

                    <div className="w-full flex flex-col gap-[16px]">
                      <button
                        onClick={() => {
                          if (createdUserId && shareStyle) {
                            navigator.clipboard.writeText(`${window.location.origin}/view/explorercard/${createdUserId}?style=${shareStyle.toLowerCase()}`);
                            alert(`Link to your ${shareStyle} card copied to clipboard!`);
                          }
                          setIsShareModalOpen(false);
                        }}
                        disabled={!shareStyle}
                        className={`text-[16px] font-medium py-[10px] px-[18px] rounded-[999px] w-full transition ${shareStyle ? 'bg-[#5a45f9] text-white hover:opacity-90' : 'bg-[#c0caff] text-[#ecf0ff] cursor-not-allowed'}`}
                      >
                        Copy link
                      </button>
                      <p className="text-[14px] text-[#989898] text-center w-full">You can change this anytime.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="w-full max-w-[321px] lg:max-w-none bg-[#111] border border-[#2a2a2a] rounded-[999px] p-[4px] flex items-center">
            {(["Classic", "Minimal", "Adventure"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-[999px] py-[8px] text-[14px] transition ${
                  tab === t ? "bg-[#1e1e1e] text-white" : "text-[#7c7c7c] hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Card Rendering */}
          <div className="relative flex items-center justify-center shrink-0 mt-[12px] overflow-hidden pb-[16px]">
            <div ref={classicRef} className={tab === "Classic" ? "relative" : "absolute opacity-0 pointer-events-none z-[-1]"}>
              <ClassicCard form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
            </div>
            <div ref={minimalRef} className={tab === "Minimal" ? "relative" : "absolute opacity-0 pointer-events-none z-[-1]"}>
              <MinimalCard form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
            </div>
            <div ref={adventureRef} className={tab === "Adventure" ? "relative" : "absolute opacity-0 pointer-events-none z-[-1]"}>
              <AdventureCard form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
            </div>
          </div>
        </div>

        {/* Mobile Bottom Actions */}
        <div className="fixed lg:hidden bottom-0 left-0 right-0 pt-[24px] pb-[40px] px-[16px] bg-gradient-to-b from-transparent to-black/60 backdrop-blur-[2px] flex justify-center z-50">
          <div className="w-full max-w-[337px] flex gap-[6px] items-center justify-end relative">
            <button onClick={() => setIsCreated(false)} className="bg-[#1a1a1a] border border-[#353535] px-[18px] py-[10px] rounded-full text-white text-[16px] font-medium tracking-[-0.096px] shrink-0">
              Edit
            </button>
            
            <div className="relative shrink-0" ref={mobileDownloadRef}>
              <button onClick={() => {
                setIsDownloadModalOpen(!isDownloadModalOpen);
                setIsShareModalOpen(false);
              }} className="bg-[#1a1a1a] border border-[#353535] px-[18px] py-[10px] rounded-full text-white text-[16px] font-medium tracking-[-0.096px]">
                Download
              </button>
              {/* Download Modal */}
              {isDownloadModalOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[240px] bg-[#161616] border border-[#1e1e1e] rounded-[16px] p-[20px] shadow-lg flex flex-col gap-[20px] z-50">
                  <p className="text-[20px] font-medium text-center text-white">Download</p>
                  <button onClick={() => { handleDownloadStyle("Classic"); setIsDownloadModalOpen(false); }} className="flex items-center gap-[12px] w-full text-left">
                    <div className="w-[40px] h-[40px] rounded-[8px] bg-[#1e1e1e] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-white">Classic</span>
                      <span className="text-[12px] text-[#656565]">PNG</span>
                    </div>
                  </button>
                  <button onClick={() => { handleDownloadStyle("Minimal"); setIsDownloadModalOpen(false); }} className="flex items-center gap-[12px] w-full text-left">
                    <div className="w-[40px] h-[40px] rounded-[8px] bg-[#1e1e1e] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-white">Minimal</span>
                      <span className="text-[12px] text-[#656565]">PNG</span>
                    </div>
                  </button>
                  <button onClick={() => { handleDownloadStyle("Adventure"); setIsDownloadModalOpen(false); }} className="flex items-center gap-[12px] w-full text-left">
                    <div className="w-[40px] h-[40px] rounded-[8px] bg-[#1e1e1e] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-white">Adventure</span>
                      <span className="text-[12px] text-[#656565]">PNG</span>
                    </div>
                  </button>
                  <div className="w-full h-[1px] bg-[#1e1e1e]"/>
                  <button onClick={() => { downloadAllStyles(); setIsDownloadModalOpen(false); }} className="flex items-center gap-[12px] w-full text-left">
                    <div className="w-[40px] h-[40px] rounded-[8px] bg-[#1e1e1e] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-white">All 3 styles</span>
                      <span className="text-[12px] text-[#656565]">Classic, Minimal & Adventure</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <div className="relative flex-1" ref={mobileShareRef}>
              <button onClick={() => {
                setIsShareModalOpen(!isShareModalOpen);
                setIsDownloadModalOpen(false);
              }} className="bg-[#5a45f9] flex w-full gap-[4px] items-center justify-center px-[18px] py-[10px] rounded-full text-white text-[16px] font-medium tracking-[-0.096px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Share link
              </button>
              {/* Share Modal */}
              {isShareModalOpen && (
                <div className="absolute bottom-full right-0 mb-4 w-[280px] sm:w-[320px] bg-[#161616] border border-[#1e1e1e] rounded-[24px] p-[24px] sm:p-[32px] shadow-lg flex flex-col items-center gap-[24px] sm:gap-[32px] z-50">
                  <div className="flex flex-col items-center text-center gap-[7px]">
                    <h4 className="text-[20px] sm:text-[24px] font-medium text-white">Share your card</h4>
                    <p className="text-[14px] text-white">Choose the style on your public link.</p>
                  </div>
                  <div className="flex flex-col gap-[16px] w-full">
                    {(["Classic", "Minimal", "Adventure"] as Tab[]).map((styleOption) => (
                      <button
                        key={styleOption}
                        onClick={() => setShareStyle(styleOption)}
                        className={`flex items-center gap-[8px] p-[16px] rounded-[12px] w-full transition ${shareStyle === styleOption ? "bg-[#1e1e1e] border border-white" : "bg-[#1e1e1e] border border-transparent"}`}
                      >
                        <div className={`w-[20px] h-[20px] rounded-full border-[2px] flex items-center justify-center shrink-0 ${shareStyle === styleOption ? "border-white" : "border-[#666]"}`}>
                          {shareStyle === styleOption && <div className="w-[10px] h-[10px] bg-white rounded-full" />}
                        </div>
                        <span className="text-[16px] text-white">{styleOption}</span>
                      </button>
                    ))}
                  </div>
                  {shareStyle && (
                    <p className="text-[14px] sm:text-[16px] font-medium text-[#ecf0ff] underline decoration-wavy underline-offset-4 decoration-white/50 text-center break-all w-full">
                      travingat.com/ec/{createdUserId?.split("-")[0] || "123"}
                    </p>
                  )}
                  <div className="w-full flex flex-col gap-[16px]">
                    <button
                      onClick={() => {
                        if (createdUserId && shareStyle) {
                          navigator.clipboard.writeText(`${window.location.origin}/view/explorercard/${createdUserId}?style=${shareStyle.toLowerCase()}`);
                          alert(`Link to your ${shareStyle} card copied to clipboard!`);
                        }
                        setIsShareModalOpen(false);
                      }}
                      disabled={!shareStyle}
                      className={`text-[16px] font-medium py-[10px] px-[18px] rounded-[999px] w-full transition ${shareStyle ? 'bg-[#5a45f9] text-white hover:opacity-90' : 'bg-[#c0caff] text-[#ecf0ff] cursor-not-allowed'}`}
                    >
                      Copy link
                    </button>
                    <p className="text-[14px] text-[#989898] text-center w-full">You can change this anytime.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isVerified) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black font-sans p-4 sm:p-8">
        <div className="w-full max-w-md">
          <EmailVerificationForm 
            source="Explorer Card"
            initialSessionUser={sessionUser}
            onVerified={(email, user, explorerCard) => {
              window.location.href = '/edit/explorercard';
            }} 
          />
        </div>
      </main>
    );
  }

return (
    <div className="flex flex-col min-h-[100dvh] lg:h-[100dvh] lg:overflow-hidden w-full bg-black relative">
      {pathname?.startsWith("/edit/explorercard") && (
        <header className="flex w-full items-center justify-between px-4 lg:px-10 py-4 border-b border-[#1e1e1e] bg-black shrink-0 sticky top-0 z-[100]">
          <div className="flex-1 flex items-center">
            <img src="/icons/travingat-logo.svg?v=newlogo" alt="Travingat" className="h-[24px] w-auto brightness-0 invert" />
          </div>
          <div className="flex-[2] flex justify-center">
            <h2 className="text-center font-display text-[28px] font-medium leading-[36px] tracking-[-0.5px] text-white">Create explorer card</h2>
          </div>
          <div className="flex-1 flex justify-end">
            <button onClick={handleSaveAndLogout} disabled={isSubmitting} className="w-10 h-10 flex items-center justify-center rounded-[12px] bg-[#1a1a1a] border border-[#2a2a2a] hover:bg-[#222] transition-colors disabled:opacity-50">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </header>
      )}

      <div className="flex flex-1 flex-col relative w-full lg:h-[calc(100vh-73px)] lg:overflow-hidden">
        <div className="hidden lg:flex flex-1 w-full bg-black justify-center items-center py-[40px] lg:overflow-hidden">
          <div className="flex w-full max-w-[1600px] h-full items-center justify-center gap-[32px] px-[40px]">
            <DesktopExplorerForm
            form={form}
            setForm={setForm}
            visited={visited}
            setVisited={setVisited}
            countryQuery={countryQuery}
            setCountryQuery={setCountryQuery}
            visitedOpen={visitedOpen}
            setVisitedOpen={setVisitedOpen}
            fromOpen={fromOpen}
            setFromOpen={setFromOpen}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handleFile={handleFile}
            handleCreate={handleCreate}
            sampleFlags={sampleFlags}
            countryMatches={countryMatches}
            addCountry={addCountry}
            removeCountry={removeCountry}
            errors={errors}
            setErrors={setErrors}
          />
          <div className="flex flex-col items-center w-full max-w-[1148px] h-[calc(100vh-160px)] max-h-[860px] overflow-y-auto lg:bg-[#111] lg:rounded-[20px] lg:p-[24px] lg:px-[32px] custom-scrollbar">
            <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar { display: none; }`}} />
            <div className="hidden lg:flex w-full items-center justify-between shrink-0 mb-[8px]">
              <h3 className="text-[24px] text-white tracking-[-0.5px]">Preview</h3>
            </div>

            <div className="w-full max-w-[321px] bg-[#111] border border-[#2a2a2a] rounded-[999px] p-[4px] flex items-center shrink-0 mb-[40px]">
              {(["Classic", "Minimal", "Adventure"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`flex-1 rounded-[999px] py-[8px] text-[14px] transition ${
                    tab === t ? "bg-[#1e1e1e] text-white" : "text-[#7c7c7c] hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative flex items-center justify-center shrink-0 pb-[16px]">
              <div className={tab === "Classic" ? "relative" : "absolute opacity-0 pointer-events-none z-[-1]"}>
                <ClassicCard form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
              </div>
              <div className={tab === "Minimal" ? "relative" : "absolute opacity-0 pointer-events-none z-[-1]"}>
                <MinimalCard form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
              </div>
              <div className={tab === "Adventure" ? "relative" : "absolute opacity-0 pointer-events-none z-[-1]"}>
                <AdventureCard form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block lg:hidden">
        <MobileExplorerForm
          form={form}
          setForm={setForm}
          visited={visited}
          setVisited={setVisited}
          countryQuery={countryQuery}
          setCountryQuery={setCountryQuery}
          visitedOpen={visitedOpen}
          setVisitedOpen={setVisitedOpen}
          fromOpen={fromOpen}
          setFromOpen={setFromOpen}
          isSubmitting={isSubmitting}
          handleChange={handleChange}
          handleFile={handleFile}
          handleCreate={handleCreate}
          sampleFlags={sampleFlags}
          countryMatches={countryMatches}
          addCountry={addCountry}
          removeCountry={removeCountry}
        />
      </div>
      </div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex w-full flex-col gap-[10px] text-[14px] font-sans font-normal leading-[20px] tracking-[-0.084px] text-white">
      <span className="w-full">{label}</span>
      {children}
      {hint && <span className="text-[12px] text-[#7c7c7c]">{hint}</span>}
    </label>
  );
}
