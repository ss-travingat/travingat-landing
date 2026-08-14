"use client";

import React, { useState, useRef, useCallback } from "react";
import * as htmlToImage from "html-to-image";
import { ClassicCard, MinimalCard, AdventureCard, ImagePlaceholderIcon, AvatarPlaceholderIcon } from "./cards";
import EmailVerificationForm from "@/components/getfeatured/EmailVerificationForm";

import countryData from "./countries.json";

const sampleFlags: Record<string, string> = {};
for (const [code, name] of Object.entries(countryData)) {
  if (code.length === 2) {
    sampleFlags[name] = code.toUpperCase();
  }
}

type Tab = "Classic" | "Minimal" | "Adventure";

export default function Home({ initialSessionUser }: { initialSessionUser?: any } = {}) {
  const [form, setForm] = useState({
    firstName: initialSessionUser?.first_name || "",
    lastName: initialSessionUser?.last_name || "",
    email: initialSessionUser?.email || "",
    country: "United States",
    coverImage: "",
    profileImage: "",
  });
  const [visited, setVisited] = useState<string[]>([]);
  const [countryQuery, setCountryQuery] = useState("");
  const [visitedOpen, setVisitedOpen] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("Classic");
  const [fromOpen, setFromOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareStyle, setShareStyle] = useState<Tab>("Classic");
  
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verification State
  const [isVerified, setIsVerified] = useState(false);

  const classicRef = useRef<HTMLDivElement>(null);
  const minimalRef = useRef<HTMLDivElement>(null);
  const adventureRef = useRef<HTMLDivElement>(null);

  const handleDownloadStyle = useCallback(async (style: Tab) => {
    const ref = style === "Classic" ? classicRef : style === "Minimal" ? minimalRef : adventureRef;
    if (ref.current === null || !ref.current.firstElementChild) {
      return;
    }
    
    const node = ref.current.firstElementChild as HTMLElement;

    try {
      const dataUrl = await htmlToImage.toPng(node, { 
        cacheBust: true, 
        pixelRatio: 2,
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
      const link = document.createElement("a");
      link.download = `explorer-card-${style.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Oops, something went wrong!", err);
      alert("Failed to download image.");
    }
  }, []);

  const downloadAllStyles = useCallback(async () => {
    await handleDownloadStyle("Classic");
    // Delay ensures browser allows multiple downloads
    await new Promise(r => setTimeout(r, 300));
    await handleDownloadStyle("Minimal");
    await new Promise(r => setTimeout(r, 300));
    await handleDownloadStyle("Adventure");
  }, [handleDownloadStyle]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target as HTMLInputElement;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, key: "coverImage" | "profileImage") {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    if (key === "profileImage") setProfileFile(file);
    if (key === "coverImage") setCoverFile(file);
    
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, [key]: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  async function handleCreate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Hit API to create user & get presigned URLs
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("country", form.country);
      formData.append("visitedCountries", JSON.stringify(visited));
      if (profileFile) formData.append("profileImage", profileFile);
      if (coverFile) formData.append("coverImage", coverFile);
      if (form.profileImage) formData.append("existingProfileImage", form.profileImage);
      if (form.coverImage) formData.append("existingCoverImage", form.coverImage);
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
        profileImage: data.profilePublicUrl || s.profileImage,
        coverImage: data.coverPublicUrl || s.coverImage,
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
      <main className="bg-background text-white min-h-screen flex flex-col items-center px-6 pb-12 w-full">
        {/* Header */}
        <div className="w-full flex items-start justify-between py-[40px] max-w-[1062px]">
          <div className="w-[36px] h-[36px] bg-[#111] border border-[#212121] rounded-[8px] flex items-center justify-center shrink-0">
            {/* Logo placeholder */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 22h20L12 2z" fill="currentColor"/></svg>
          </div>
          <div className="flex flex-col items-center gap-[12px] text-center w-[482px]">
            <h2 className="text-[32px] font-medium leading-[40px] tracking-[-0.5px]">Your explorer card is ready</h2>
            <p className="text-[14px] text-[#989898]">We've emailed you a private edit link if you ever need to update your card.</p>
          </div>
          <div className="w-[36px] h-[36px] rounded-[8px] bg-[#111] border border-[#212121] flex items-center justify-center shrink-0">
            {/* Menu icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-[1062px] bg-[#111] rounded-[20px] p-[24px] px-[32px] flex flex-col items-center gap-[20px]">
          {/* Container Header */}
          <div className="w-full flex items-center justify-between">
            <h3 className="text-[24px] text-white tracking-[-0.5px]">Explorer card</h3>
            <div className="flex items-center gap-[24px]">
              <div className="flex items-center gap-[16px]">
                <button onClick={() => setIsCreated(false)} className="text-[14px] font-medium text-white hover:text-white/80">Edit</button>
                <div className="w-[1px] h-[12px] bg-[#333]" />
                <div className="relative">
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
              
              <div className="relative">
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

                    <p className="text-[16px] font-medium text-[#ecf0ff] underline decoration-wavy underline-offset-4 decoration-white/50">
                      travingat.com/ec/{createdUserId?.split("-")[0] || "123"}
                    </p>

                    <div className="w-full flex flex-col gap-[16px]">
                      <button
                        onClick={() => {
                          if (createdUserId) {
                            navigator.clipboard.writeText(`${window.location.origin}/explorercard/${createdUserId}?style=${shareStyle.toLowerCase()}`);
                            alert(`Link to your ${shareStyle} card copied to clipboard!`);
                          }
                          setIsShareModalOpen(false);
                        }}
                        className="bg-[#5a45f9] text-white text-[16px] font-medium py-[10px] px-[18px] rounded-[999px] w-full transition hover:opacity-90"
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
          <div className="w-full bg-[#111] border border-[#2a2a2a] rounded-[999px] p-[4px] flex items-center">
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
          <div className="relative flex items-center justify-center shrink-0 mt-[12px] pb-[16px]">
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
      </main>
    );
  }

  if (!isVerified) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black font-sans p-4 sm:p-8">
        <div className="w-full max-w-md">
          <EmailVerificationForm 
            source="Explorer Card"
            initialSessionUser={initialSessionUser}
            onVerified={(email, user) => {
              let isCompleted = false;
              let loadedVisited: string[] = [];

              if (user?.first_name && user?.country) {
                isCompleted = true;
              }

              if (user?.visited_countries) {
                if (Array.isArray(user.visited_countries)) {
                  loadedVisited = user.visited_countries;
                } else if (typeof user.visited_countries === 'string') {
                  try {
                    loadedVisited = JSON.parse(user.visited_countries);
                  } catch {
                    loadedVisited = [];
                  }
                }
              }

              setForm((s) => ({
                ...s,
                email,
                firstName: user?.first_name || s.firstName,
                lastName: user?.last_name || s.lastName,
                country: user?.country || s.country,
                profileImage: user?.profile_image_url || s.profileImage,
                coverImage: user?.cover_image_url || s.coverImage,
              }));

              if (loadedVisited.length > 0) {
                setVisited(loadedVisited);
              }

              if (user?.id) {
                setCreatedUserId(user.id);
              }

              setIsVerified(true);
              
              // If they already created their card previously, jump straight to the preview
              if (isCompleted) {
                setIsCreated(true);
              }
            }} 
          />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background text-white py-12 lg:viewport-height">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-6 text-2xl font-semibold">Create explorer card</h1>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="relative w-full lg:w-[420px] shrink-0 h-[860px] overflow-hidden rounded-[20px] bg-black-900 border border-transparent">
            <form onSubmit={handleCreate} className="flex h-full flex-col items-start gap-6 p-8 pb-[100px] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style dangerouslySetInnerHTML={{__html: `form::-webkit-scrollbar { display: none; }`}} />
              
              <Field label="Full name">
                <div className="flex w-full items-center gap-[8px]">
                  <div className="w-full rounded-[8px] bg-black px-[12px] py-[10px]">
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-[#525252]"
                    />
                  </div>
                  <div className="w-full rounded-[8px] bg-black px-[12px] py-[10px]">
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-[#525252]"
                    />
                  </div>
                </div>
              </Field>

              <Field label="Where are you from?">
                <div className="relative w-full">
                  <div className="flex w-full items-center gap-[8px] rounded-[8px] bg-black px-[12px] py-[10px]">
                    {sampleFlags[form.country] && (
                       <span className={`fi fi-${sampleFlags[form.country].toLowerCase()} h-[12px] w-[18px] shrink-0 rounded-[2px] inline-block`} />
                    )}
                    <input
                      value={form.country}
                      onChange={(e) => {
                        setForm((s) => ({ ...s, country: e.target.value }));
                        setFromOpen(true);
                      }}
                      onFocus={() => setFromOpen(true)}
                      onBlur={() => setTimeout(() => setFromOpen(false), 200)}
                      placeholder="Select country"
                      className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-[#525252]"
                    />
                    <svg className="h-[16px] w-[16px] shrink-0 text-[#525252] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {fromOpen && (
                    <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-[8px] border border-[#2a2a2a] bg-[#111] shadow-lg">
                      {Object.keys(sampleFlags)
                        .filter((c) => c.toLowerCase().includes(form.country.toLowerCase()))
                        .map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setForm((s) => ({ ...s, country: c }));
                            setFromOpen(false);
                          }}
                          className="flex w-full items-center gap-[8px] px-[12px] py-[8px] text-left text-[14px] text-white hover:bg-[#1e1e1e]"
                        >
                          <span className={`fi fi-${sampleFlags[c].toLowerCase()} h-[12px] w-[18px] rounded-[2px] inline-block`} title={c} />
                          <span>{c}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Field>

              <div className="flex w-full flex-col gap-[10px]">
                <p className="text-[14px] text-white">Visited countries <span className="text-[#7c7c7c]">({visited.length} Selected)</span></p>

                {visited.length > 0 && (
                  <div className="flex flex-wrap items-center gap-[4px]">
                    {visited.map((c) => (
                      <div
                        key={c}
                        className="flex items-center gap-[4px] rounded-[6px] bg-[#1e1e1e] px-[6px] py-[2px]"
                      >
                        <span className={`fi fi-${sampleFlags[c].toLowerCase()} h-[9.333px] w-[14px] overflow-clip rounded-[1px]`} title={c} />
                        <span className="text-[12px] text-white">{sampleFlags[c]}</span>
                        <button
                          type="button"
                          onClick={() => removeCountry(c)}
                          className="ml-1 text-[#7c7c7c] hover:text-white text-[14px] leading-[1]"
                          aria-label={`Remove ${c}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative w-full">
                  <div className="relative flex items-center w-full rounded-[10px] border border-[#989898] bg-black">
                    <svg className="absolute left-[16px] top-1/2 -translate-y-1/2 h-[24px] w-[24px] text-[#e3e3e3] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <div className="absolute left-[42px] top-[10px] h-[24px] w-[1px] bg-[#2a2a2a]"></div>
                    <input
                      value={countryQuery}
                      onChange={(e) => setCountryQuery(e.target.value)}
                      onFocus={() => setVisitedOpen(true)}
                      onBlur={() => setTimeout(() => setVisitedOpen(false), 200)}
                      placeholder="Search countries"
                      className="w-full bg-transparent py-[12px] pl-[56px] pr-4 text-[16px] text-white outline-none placeholder:text-[#525252]"
                    />
                  </div>
                  {visitedOpen && countryMatches.length > 0 && (
                    <div className="absolute z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-[8px] bg-[#111] shadow-lg flex flex-col border border-[#2a2a2a]">
                      {countryMatches.map((c) => {
                        const isSelected = visited.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => isSelected ? removeCountry(c) : addCountry(c)}
                            className="flex w-full items-center justify-between p-[12px] text-left hover:bg-[#1e1e1e] transition-colors"
                          >
                            <div className="flex items-center gap-[8px]">
                              {isSelected ? (
                                <div className="flex h-[24px] w-[24px] items-center justify-center rounded-[8px] border border-[#2a2a2a] bg-white">
                                  <svg className="h-[16px] w-[16px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                              ) : (
                                <div className="h-[24px] w-[24px] rounded-[8px] border border-[#464646] bg-[#161616]" />
                              )}
                              <span className={`fi fi-${sampleFlags[c].toLowerCase()} h-[13.333px] w-[20px] rounded-[2px] inline-block`} title={c} />
                              <span className="text-[16px] text-white tracking-[-0.096px]">{c}</span>
                            </div>
                            <span className="text-[16px] text-[#656565] tracking-[-0.096px]">{sampleFlags[c]}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <Field label="Email address" hint="Verified via OTP">
                <div className="flex w-full items-center gap-[8px] rounded-[8px] bg-black px-[12px] py-[10px] opacity-50 cursor-not-allowed">
                  <svg className="h-[20px] w-[20px] text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full bg-transparent text-[14px] text-white outline-none cursor-not-allowed"
                  />
                  <svg className="h-[16px] w-[16px] text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
              </Field>

              <Field label="Upload profile photo">
                <div className="flex h-[80px] w-[80px] cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-[#2a2a2a] bg-black relative">
                  {form.profileImage ? (
                    <img src={form.profileImage} alt="profile" className="h-full w-full object-cover" />
                  ) : (
                    <AvatarPlaceholderIcon />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleFile(e, "profileImage")} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </Field>

              <Field label="Upload cover photo">
                <div className="flex h-[131px] w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-[#2a2a2a] bg-black relative">
                  {form.coverImage ? (
                    <img src={form.coverImage} alt="cover" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlaceholderIcon />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleFile(e, "coverImage")} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-auto w-full rounded-[100px] bg-[#533df6] px-[24px] py-[12px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create explorer card"}
              </button>
            </form>
          </aside>

          <section className="flex flex-1 flex-col items-center px-8 py-6 bg-black-900 rounded-[20px] border border-white/6">
            <div className="mb-6 flex w-full items-center justify-between text-sm text-white-400">
              <div>Preview</div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDownloadModalOpen(!isDownloadModalOpen)}
                  className="flex items-center gap-2 rounded-full border border-white/6 bg-black-800 px-4 py-2 hover:bg-black-700 transition relative"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download</span>
                </button>
                
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

            {/* tabs */}
            <div className="mb-5 flex gap-1 rounded-full border border-white/6 bg-black-800 p-1">
              {(["Classic", "Minimal", "Adventure"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-1.5 text-sm transition ${tab === t ? "bg-white text-black-950" : "text-white-500 hover:text-white"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* card container */}
            <div className="relative flex items-center justify-center shrink-0">
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
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex w-full flex-col gap-[8px] text-[14px] text-white tracking-[-0.084px]">
      <span>{label}</span>
      {children}
      {hint && <span className="text-[12px] text-[#7c7c7c]">{hint}</span>}
    </label>
  );
}