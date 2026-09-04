"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { domToPng } from "modern-screenshot";
import { compressImageClient } from "@/lib/client-image-compress";
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
  const searchParams = useSearchParams();
  const isEditMode = searchParams?.get('edit') === 'true' || !!initialExplorerCard;
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

  const [initialForm] = useState({
    firstName: initialExplorerCard?.name?.split(' ')[0] || initialSessionUser?.first_name || "",
    lastName: initialExplorerCard?.name?.split(' ').slice(1).join(' ') || initialSessionUser?.last_name || "",
    email: initialSessionUser?.email || "",
    country: initialExplorerCard?.country || initialSessionUser?.country || "",
    coverImage: initialExplorerCard?.cover_image_url || initialSessionUser?.cover_image_url || "",
    profileImage: initialExplorerCard?.profile_image_url || initialSessionUser?.profile_image_url || "",
  });
  const [initialVisited] = useState<string[]>(initVisited);

  const [visited, setVisited] = useState<string[]>(initVisited);
  const [countryQuery, setCountryQuery] = useState("");
  const [visitedOpen, setVisitedOpen] = useState(false);
  const isSuccessPageRoute = pathname === "/explorercard";
  const [isCreated, setIsCreated] = useState(isSuccessPageRoute);
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

  const hasChanged = 
    form.firstName !== initialForm.firstName ||
    form.lastName !== initialForm.lastName ||
    form.country !== initialForm.country ||
    form.coverImage !== initialForm.coverImage ||
    form.profileImage !== initialForm.profileImage ||
    profileFile !== null ||
    coverFile !== null ||
    JSON.stringify(visited) !== JSON.stringify(initialVisited);

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
      return await domToPng(node, { 
        scale: 2,
        quality: 0.9,
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

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>, key: "coverImage" | "profileImage") {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    if (originalFile.size > 20 * 1024 * 1024) {
      alert("Only an image under 20 MB can be uploaded.");
      e.target.value = "";
      return;
    }

    try {
      const { blob, contentType } = await compressImageClient(originalFile, 2560, 0.80);
      
      // Ensure unique filenames to prevent S3 overwrites if the user uploads files with the same name
      const ext = contentType === "image/webp" ? "webp" : "jpg";
      const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
      const file = new File([blob], `${key}-${Date.now()}-${baseName}.${ext}`, { type: contentType });

      if (key === "profileImage") setProfileFile(file);
      if (key === "coverImage") setCoverFile(file);
      
      const reader = new FileReader();
      reader.onload = () => setForm((s) => ({ ...s, [key]: String(reader.result) }));
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Image compression failed", err);
      alert("Failed to compress image. Please try again.");
      e.target.value = "";
    }
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
      router.push('/explorercard');

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

  async function handleCrossClick() {
    if (isEditMode && !hasChanged) {
      router.push('/explorercard');
    } else if (!isEditMode && !hasChanged) {
      try {
        await fetch('/api/auth/logout-user', { method: 'POST' });
      } catch (e) {}
      window.location.href = '/join/explorercard';
    } else {
      // If there are unsaved changes, or user specifically clicks save and logout
      handleSaveAndLogout();
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

  async function handleCreatedCrossClick() {
    try {
      await fetch('/api/auth/logout-user', { method: 'POST' });
    } catch (e) {}
    window.location.href = '/join/explorercard';
  }

  if (isCreated) {
    return (
      <div className="flex flex-col min-h-[100dvh] w-full bg-black relative">
        <header className="flex w-full justify-center pt-[40px] pb-4 bg-black shrink-0 relative z-[100]">
          <div className="flex w-full px-4 lg:px-[64px] items-center justify-between">
            <div className="flex-1 flex items-center">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.9955 15.3319L17.1236 17.0972L15.3583 16.9692L15.2289 15.2026L16.9955 15.3319Z" fill="white"/>
                <path d="M13.2539 15.7839C13.5075 15.5304 13.9212 15.5323 14.178 15.7889C14.4348 16.0458 14.4367 16.4606 14.183 16.7143C13.9293 16.9675 13.5156 16.9647 13.2589 16.708C13.0023 16.4512 13.0003 16.0375 13.2539 15.7839Z" fill="white"/>
                <path d="M15.7801 13.2577C16.0338 13.004 16.4474 13.0061 16.7042 13.2627C16.9609 13.5193 16.9637 13.9331 16.7105 14.1868C16.4568 14.4405 16.042 14.4386 15.7852 14.1818C15.5286 13.925 15.5266 13.5113 15.7801 13.2577Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18 0C25.2229 0 28.8341 0.000501037 31.4284 1.73396C32.5515 2.48438 33.5156 3.44849 34.266 4.57157C35.9995 7.16587 36 10.7771 36 18C36 25.2229 35.9995 28.8341 34.266 31.4284C33.5156 32.5515 32.5515 33.5156 31.4284 34.266C28.8341 35.9995 25.2229 36 18 36C10.7771 36 7.16587 35.9995 4.57157 34.266C3.44849 33.5156 2.48438 32.5515 1.73396 31.4284C0.000501037 28.8341 0 25.2229 0 18C0 10.7771 0.000501037 7.16587 1.73396 4.57157C2.48438 3.44849 3.44849 2.48438 4.57157 1.73396C7.16587 0.000501037 10.7771 0 18 0ZM17.0445 12.2256C15.6962 10.8772 13.5236 10.8636 12.1917 12.1955C10.8598 13.5273 10.8735 15.6999 12.2218 17.0483L24.3118 29.1395C25.6602 30.4879 27.8327 30.5003 29.1646 29.1684C30.4965 27.8365 30.4841 25.6639 29.1357 24.3156L17.0445 12.2256ZM16.7645 22.9696C16.1225 22.3276 15.0872 22.3204 14.453 22.9545L9.40053 28.0082C12.0973 30.7045 16.4425 30.7309 19.1062 28.0672L20.4848 26.6886L16.7645 22.9696ZM12.9727 19.1777C12.37 18.575 11.3984 18.5686 10.803 19.1639L5.56473 24.4022C4.74033 25.2267 4.74891 26.5721 5.58357 27.4068C6.41827 28.2413 7.76372 28.2488 8.58817 27.4244L14.9037 21.1088L12.9727 19.1777ZM22.9508 14.4568C22.3167 15.091 22.3238 16.1262 22.9658 16.7683L26.6848 20.4886L28.0635 19.1099C30.7271 16.4463 30.7007 12.101 28.0045 9.4043L22.9508 14.4568ZM27.403 5.58733C26.5684 4.75267 25.223 4.7441 24.3984 5.5685L19.1602 10.8068C18.5649 11.4022 18.5713 12.3737 19.174 12.9764L21.105 14.9075L27.4206 8.59194C28.2451 7.76749 28.2376 6.42204 27.403 5.58733Z" fill="white"/>
              </svg>
            </div>
            <div className="flex-[2] flex flex-col items-center justify-center gap-[4px]">
              <h2 className="text-center font-display text-[28px] font-medium leading-[36px] tracking-[-0.5px] text-white">
                Your explorer card is ready
              </h2>
              <p className="hidden lg:block text-center font-sans text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#989898]">We've emailed you a private edit link if you ever need to update your card.</p>
              <p className="lg:hidden text-center font-sans text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#989898]">Your edit link is in your email</p>
            </div>
            <div className="flex-1 flex justify-end">
              <button onClick={handleCreatedCrossClick} className="w-[36px] h-[36px] flex items-center justify-center rounded-[8px] bg-[#111] border border-[#212121] hover:bg-[#222] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center px-0 lg:px-6 pb-[100px] lg:pb-12 w-full pt-[24px]">

        {/* Content Container */}
        <div className="w-full max-w-[1062px] lg:bg-[#111] bg-transparent lg:rounded-[20px] lg:p-[24px] lg:px-[32px] flex flex-col items-center gap-[17px] lg:gap-[20px]">
          {/* Container Header */}
          <div className="hidden lg:flex w-full items-center justify-between">
            <h3 className="font-display text-[24px] font-normal leading-[32px] tracking-[-0.5px] text-white">Explorer card</h3>
            <div className="flex items-center gap-[24px]">
              <div className="flex items-center gap-[16px]">
                <button onClick={() => router.push('/edit/explorercard')} className="text-[14px] font-medium text-white hover:text-white/80">Edit</button>
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
                      <p className="text-[16px] font-medium text-[#ecf0ff] underline decoration-wavy underline-offset-4 decoration-white/50 text-center break-all">
                        travingat.com/ec/{createdUserId?.split("-")[0]}-{shareStyle === "Classic" ? "a" : shareStyle === "Minimal" ? "b" : "c"}
                      </p>
                    )}

                    <div className="w-full flex flex-col gap-[16px]">
                      <button
                        onClick={() => {
                          if (createdUserId && shareStyle) {
                            const shortId = createdUserId.split("-")[0];
                            const styleSuffix = shareStyle === "Classic" ? "a" : shareStyle === "Minimal" ? "b" : "c";
                            navigator.clipboard.writeText(`https://travingat.com/ec/${shortId}-${styleSuffix}`);
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

          {/* Tab Bar and Cards Group */}
          <div className="flex flex-col gap-[24px] items-center w-full">
            {/* Tab Bar */}
            <div className="relative w-[360px] bg-[#111] border border-[#2a2a2a] rounded-[999px] p-[4px] flex items-center">
              <div 
                className="absolute top-[4px] bottom-[4px] w-[calc((100%-8px)/3)] bg-[#1e1e1e] rounded-[999px] transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(${tab === 'Classic' ? 0 : tab === 'Minimal' ? '100%' : '200%'})` }}
              />
              {(["Classic", "Minimal", "Adventure"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative z-10 flex-1 rounded-[999px] py-[8px] text-[14px] transition-colors duration-300 ${
                    tab === t ? "text-white" : "text-[#7c7c7c] hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="relative flex items-center justify-center shrink-0 overflow-hidden pb-[16px]">
              <div ref={classicRef} className={tab === "Classic" ? "relative" : "absolute top-[-9999px] left-[-9999px] pointer-events-none"}>
                <ClassicCard form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
              </div>
              <div ref={minimalRef} className={tab === "Minimal" ? "relative" : "absolute top-[-9999px] left-[-9999px] pointer-events-none"}>
                <MinimalCard form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
              </div>
              <div ref={adventureRef} className={tab === "Adventure" ? "relative" : "absolute top-[-9999px] left-[-9999px] pointer-events-none"}>
                <AdventureCard form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
              </div>
            </div>
          </div>
        </div>

        <div className="fixed lg:hidden bottom-0 left-0 right-0 pt-[24px] pb-[40px] px-[16px] bg-gradient-to-b from-transparent to-black/60 backdrop-blur-[2px] flex justify-center z-50">
          <div className="w-full max-w-[337px] flex gap-[6px] items-center justify-end relative">
            <button onClick={() => router.push('/edit/explorercard')} className="bg-[#1a1a1a] border border-[#353535] px-[18px] py-[10px] rounded-full text-white text-[16px] font-medium tracking-[-0.096px] shrink-0">
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
                      travingat.com/ec/{createdUserId?.split("-")[0]}-{shareStyle === "Classic" ? "a" : shareStyle === "Minimal" ? "b" : "c"}
                    </p>
                  )}
                  <div className="w-full flex flex-col gap-[16px]">
                    <button
                      onClick={() => {
                        if (createdUserId && shareStyle) {
                          const shortId = createdUserId.split("-")[0];
                          const styleSuffix = shareStyle === "Classic" ? "a" : shareStyle === "Minimal" ? "b" : "c";
                          navigator.clipboard.writeText(`https://travingat.com/ec/${shortId}-${styleSuffix}`);
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
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col min-h-[100dvh] w-full bg-black relative">
        <header className="flex w-full justify-center pt-[40px] pb-4 bg-black shrink-0 relative z-[100]">
          <div className="flex w-full px-4 lg:px-[64px] items-center justify-between">
            <div className="flex-1 flex items-center">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.9955 15.3319L17.1236 17.0972L15.3583 16.9692L15.2289 15.2026L16.9955 15.3319Z" fill="white"/>
                <path d="M13.2539 15.7839C13.5075 15.5304 13.9212 15.5323 14.178 15.7889C14.4348 16.0458 14.4367 16.4606 14.183 16.7143C13.9293 16.9675 13.5156 16.9647 13.2589 16.708C13.0023 16.4512 13.0003 16.0375 13.2539 15.7839Z" fill="white"/>
                <path d="M15.7801 13.2577C16.0338 13.004 16.4474 13.0061 16.7042 13.2627C16.9609 13.5193 16.9637 13.9331 16.7105 14.1868C16.4568 14.4405 16.042 14.4386 15.7852 14.1818C15.5286 13.925 15.5266 13.5113 15.7801 13.2577Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18 0C25.2229 0 28.8341 0.000501037 31.4284 1.73396C32.5515 2.48438 33.5156 3.44849 34.266 4.57157C35.9995 7.16587 36 10.7771 36 18C36 25.2229 35.9995 28.8341 34.266 31.4284C33.5156 32.5515 32.5515 33.5156 31.4284 34.266C28.8341 35.9995 25.2229 36 18 36C10.7771 36 7.16587 35.9995 4.57157 34.266C3.44849 33.5156 2.48438 32.5515 1.73396 31.4284C0.000501037 28.8341 0 25.2229 0 18C0 10.7771 0.000501037 7.16587 1.73396 4.57157C2.48438 3.44849 3.44849 2.48438 4.57157 1.73396C7.16587 0.000501037 10.7771 0 18 0ZM17.0445 12.2256C15.6962 10.8772 13.5236 10.8636 12.1917 12.1955C10.8598 13.5273 10.8735 15.6999 12.2218 17.0483L24.3118 29.1395C25.6602 30.4879 27.8327 30.5003 29.1646 29.1684C30.4965 27.8365 30.4841 25.6639 29.1357 24.3156L17.0445 12.2256ZM16.7645 22.9696C16.1225 22.3276 15.0872 22.3204 14.453 22.9545L9.40053 28.0082C12.0973 30.7045 16.4425 30.7309 19.1062 28.0672L20.4848 26.6886L16.7645 22.9696ZM12.9727 19.1777C12.37 18.575 11.3984 18.5686 10.803 19.1639L5.56473 24.4022C4.74033 25.2267 4.74891 26.5721 5.58357 27.4068C6.41827 28.2413 7.76372 28.2488 8.58817 27.4244L14.9037 21.1088L12.9727 19.1777ZM22.9508 14.4568C22.3167 15.091 22.3238 16.1262 22.9658 16.7683L26.6848 20.4886L28.0635 19.1099C30.7271 16.4463 30.7007 12.101 28.0045 9.4043L22.9508 14.4568ZM27.403 5.58733C26.5684 4.75267 25.223 4.7441 24.3984 5.5685L19.1602 10.8068C18.5649 11.4022 18.5713 12.3737 19.174 12.9764L21.105 14.9075L27.4206 8.59194C28.2451 7.76749 28.2376 6.42204 27.403 5.58733Z" fill="white"/>
              </svg>
            </div>
            <div className="flex-[2] flex justify-center">
              <h2 className="text-center font-display text-[28px] font-medium leading-[36px] tracking-[-0.5px] text-white">
                Create explorer card
              </h2>
            </div>
            <div className="flex-1 flex justify-end">
              <button onClick={() => window.location.href = '/'} className="w-[36px] h-[36px] flex items-center justify-center rounded-[8px] bg-[#111] border border-[#212121] hover:bg-[#222] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center bg-black font-sans px-4 sm:px-8 pt-[40px] lg:pt-[48px]">
          <div className="w-full max-w-[420px]">
            <EmailVerificationForm 
              source="Explorer Card"
              initialSessionUser={sessionUser}
              onVerified={(email, user, explorerCard) => {
                if (explorerCard) {
                  window.location.href = '/explorercard';
                } else {
                  window.location.href = '/edit/explorercard';
                }
              }} 
            />
          </div>
        </main>
      </div>
    );
  }

return (
    <div className="flex flex-col min-h-[100dvh] lg:h-[100dvh] lg:overflow-hidden w-full bg-black relative">
      {pathname?.startsWith("/edit/explorercard") && (
        <header className="flex w-full justify-center pt-[40px] pb-4 bg-black shrink-0 relative z-[100]">
          <div className="flex w-full px-4 lg:px-[64px] items-center justify-between">
            <div className="flex-1 flex items-center">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.9955 15.3319L17.1236 17.0972L15.3583 16.9692L15.2289 15.2026L16.9955 15.3319Z" fill="white"/>
                <path d="M13.2539 15.7839C13.5075 15.5304 13.9212 15.5323 14.178 15.7889C14.4348 16.0458 14.4367 16.4606 14.183 16.7143C13.9293 16.9675 13.5156 16.9647 13.2589 16.708C13.0023 16.4512 13.0003 16.0375 13.2539 15.7839Z" fill="white"/>
                <path d="M15.7801 13.2577C16.0338 13.004 16.4474 13.0061 16.7042 13.2627C16.9609 13.5193 16.9637 13.9331 16.7105 14.1868C16.4568 14.4405 16.042 14.4386 15.7852 14.1818C15.5286 13.925 15.5266 13.5113 15.7801 13.2577Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18 0C25.2229 0 28.8341 0.000501037 31.4284 1.73396C32.5515 2.48438 33.5156 3.44849 34.266 4.57157C35.9995 7.16587 36 10.7771 36 18C36 25.2229 35.9995 28.8341 34.266 31.4284C33.5156 32.5515 32.5515 33.5156 31.4284 34.266C28.8341 35.9995 25.2229 36 18 36C10.7771 36 7.16587 35.9995 4.57157 34.266C3.44849 33.5156 2.48438 32.5515 1.73396 31.4284C0.000501037 28.8341 0 25.2229 0 18C0 10.7771 0.000501037 7.16587 1.73396 4.57157C2.48438 3.44849 3.44849 2.48438 4.57157 1.73396C7.16587 0.000501037 10.7771 0 18 0ZM17.0445 12.2256C15.6962 10.8772 13.5236 10.8636 12.1917 12.1955C10.8598 13.5273 10.8735 15.6999 12.2218 17.0483L24.3118 29.1395C25.6602 30.4879 27.8327 30.5003 29.1646 29.1684C30.4965 27.8365 30.4841 25.6639 29.1357 24.3156L17.0445 12.2256ZM16.7645 22.9696C16.1225 22.3276 15.0872 22.3204 14.453 22.9545L9.40053 28.0082C12.0973 30.7045 16.4425 30.7309 19.1062 28.0672L20.4848 26.6886L16.7645 22.9696ZM12.9727 19.1777C12.37 18.575 11.3984 18.5686 10.803 19.1639L5.56473 24.4022C4.74033 25.2267 4.74891 26.5721 5.58357 27.4068C6.41827 28.2413 7.76372 28.2488 8.58817 27.4244L14.9037 21.1088L12.9727 19.1777ZM22.9508 14.4568C22.3167 15.091 22.3238 16.1262 22.9658 16.7683L26.6848 20.4886L28.0635 19.1099C30.7271 16.4463 30.7007 12.101 28.0045 9.4043L22.9508 14.4568ZM27.403 5.58733C26.5684 4.75267 25.223 4.7441 24.3984 5.5685L19.1602 10.8068C18.5649 11.4022 18.5713 12.3737 19.174 12.9764L21.105 14.9075L27.4206 8.59194C28.2451 7.76749 28.2376 6.42204 27.403 5.58733Z" fill="white"/>
              </svg>
            </div>
            <div className="flex-[2] flex justify-center">
              <h2 className="text-center font-display text-[28px] font-medium leading-[36px] tracking-[-0.5px] text-white">
                {isEditMode ? "Edit Your Explorer Card" : "Create Your Explorer Card"}
              </h2>
            </div>
            <div className="flex-1 flex justify-end">
              <button onClick={handleCrossClick} disabled={isSubmitting} className="w-[36px] h-[36px] flex items-center justify-center rounded-[8px] bg-[#111] border border-[#212121] hover:bg-[#222] transition-colors disabled:opacity-50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </header>
      )}

      <div className="flex flex-1 flex-col relative w-full lg:h-[calc(100vh-73px)] lg:overflow-hidden">
        <div className="hidden lg:flex flex-1 w-full bg-black justify-center items-center pt-[24px] pb-[40px] lg:overflow-hidden">
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
            isEditMode={isEditMode}
            hasChanged={hasChanged}
          />
          <div className="flex flex-col items-center w-full max-w-[1116px] h-[calc(100vh-160px)] max-h-[860px] overflow-y-auto lg:bg-[#111] lg:rounded-[20px] lg:pt-[40px] lg:pb-[24px] lg:px-[32px] lg:gap-[20px] custom-scrollbar">
            <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar { display: none; }`}} />
            <div className="hidden lg:flex w-full items-center justify-between shrink-0">
              <h3 className="font-display text-[24px] font-normal leading-[32px] tracking-[-0.5px] text-white">Preview</h3>
            </div>

            <div className="flex flex-col gap-[24px] items-center w-full">
              <div className="relative w-[360px] bg-[#111] border border-[#2a2a2a] rounded-[999px] p-[4px] flex items-center shrink-0">
                <div 
                  className="absolute top-[4px] bottom-[4px] w-[calc((100%-8px)/3)] bg-[#1e1e1e] rounded-[999px] transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(${tab === 'Classic' ? 0 : tab === 'Minimal' ? '100%' : '200%'})` }}
                />
                {(["Classic", "Minimal", "Adventure"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`relative z-10 flex-1 rounded-[999px] py-[8px] text-[14px] transition-colors duration-300 ${
                      tab === t ? "text-white" : "text-[#7c7c7c] hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="relative flex items-center justify-center shrink-0 pb-[16px]">
                <div className={tab === "Classic" ? "relative" : "absolute opacity-0 pointer-events-none z-[-1]"}>
                  <ClassicCard isPreview={true} form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
                </div>
                <div className={tab === "Minimal" ? "relative" : "absolute opacity-0 pointer-events-none z-[-1]"}>
                  <MinimalCard isPreview={true} form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
                </div>
                <div className={tab === "Adventure" ? "relative" : "absolute opacity-0 pointer-events-none z-[-1]"}>
                  <AdventureCard isPreview={true} form={{...form, fullName: `${form.firstName} ${form.lastName}`.trim()}} sampleFlags={sampleFlags} visitedArray={visitedArray} />
                </div>
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
          isEditMode={isEditMode}
          hasChanged={hasChanged}
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
