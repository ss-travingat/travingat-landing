import React, { useRef, useState } from 'react';
import { Field } from './expcard-page';
import { ImagePlaceholderIcon, AvatarPlaceholderIcon } from './cards';


interface MobileExplorerFormProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  visited: string[];
  setVisited: React.Dispatch<React.SetStateAction<string[]>>;
  countryQuery: string;
  setCountryQuery: React.Dispatch<React.SetStateAction<string>>;
  visitedOpen: boolean;
  setVisitedOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fromOpen: boolean;
  setFromOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  handleChange: (e: any) => void;
  handleFile: (e: any, key: "coverImage" | "profileImage") => void;
  handleCreate: (e: any) => void;
  sampleFlags: Record<string, string>;
  countryMatches: string[];
  addCountry: (c: string) => void;
  removeCountry: (c: string) => void;
  isEditMode: boolean;
  hasChanged: boolean;
  isCreated?: boolean;
  hasChanges?: boolean;
}

export function MobileExplorerForm({
  form,
  setForm,
  visited,
  countryQuery,
  setCountryQuery,
  visitedOpen,
  setVisitedOpen,
  fromOpen,
  setFromOpen,
  isSubmitting,
  handleChange,
  handleFile,
  handleCreate,
  sampleFlags,
  countryMatches,
  addCountry,
  removeCountry,
  isEditMode,
  hasChanged,
  isCreated,
  hasChanges,
}: MobileExplorerFormProps) {
  const [isVisitedExpanded, setIsVisitedExpanded] = React.useState(false);
  const [step, setStep] = useState(1);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Per-field error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for auto-scroll to errored fields
  const profileImageRef = useRef<HTMLDivElement>(null);
  const coverImageRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLDivElement>(null);
  const lastNameRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const visitedRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    // Clear errors when changing steps
    setErrors({});
  }, [step]);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!form.profileImage) newErrors.profileImage = "Fill this field to continue";
      if (!form.coverImage) newErrors.coverImage = "Fill this field to continue";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        // Scroll to first error
        if (newErrors.profileImage) scrollToRef(profileImageRef);
        else if (newErrors.coverImage) scrollToRef(coverImageRef);
        return;
      }
    }

    if (step === 2) {
      if (!form.firstName.trim()) newErrors.firstName = "Fill this field to continue";
      if (!form.lastName.trim()) newErrors.lastName = "Fill this field to continue";
      if (!form.country.trim()) newErrors.country = "Fill this field to continue";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        // Scroll to first error
        if (newErrors.firstName) scrollToRef(firstNameRef);
        else if (newErrors.lastName) scrollToRef(lastNameRef);
        else if (newErrors.country) scrollToRef(countryRef);
        return;
      }
    }

    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (visited.length < 5) newErrors.visited = `Select at least 5 countries. You've selected ${visited.length}.`;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      scrollToRef(visitedRef);
      return;
    }

    handleCreate(e);
  };

  const ErrorMsg = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="mt-1 text-[12px] text-red-500 font-medium">{errors[field]}</p>
    ) : null;

  return (
    <div className="flex lg:hidden flex-col w-full min-h-screen bg-black text-white relative">
      <div className="flex flex-col items-center pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-1 mt-[14px]">
          <div className={`h-1 w-5 rounded-full ${step === 1 ? 'bg-white' : 'bg-[#404040]'}`} />
          <div className={`h-1 w-5 rounded-full ${step === 2 ? 'bg-white' : 'bg-[#404040]'}`} />
          <div className={`h-1 w-5 rounded-full ${step === 3 ? 'bg-white' : 'bg-[#404040]'}`} />
        </div>
      </div>

      <form onSubmit={step === 3 ? handleSubmit : handleNext} className="flex-1 flex flex-col relative">
        <div ref={scrollContainerRef} className="flex-1 p-4 pb-[100px] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `form::-webkit-scrollbar { display: none; }`}} />
          
          {step === 1 && (
            <div className="flex flex-col gap-6 bg-[#111] p-4 rounded-xl border border-transparent">
              <Field label="Email">
                <div className="flex w-full items-center gap-[8px]">
                  <div className="w-full rounded-[10px] bg-black border border-[#1e1e1e] px-[16px] py-[12px]">
                    <input
                      name="email"
                      value={form.email}
                      disabled
                      placeholder="Email"
                      className="w-full bg-transparent font-sans font-normal text-[16px] leading-[24px] tracking-[-0.096px] text-[#525252] outline-none"
                    />
                  </div>
                </div>
              </Field>

              <div ref={profileImageRef}>
                <Field label="Profile photo">
                  <div className={`flex h-[80px] w-[80px] cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border bg-black relative ${errors.profileImage ? 'border-red-500' : 'border-[#1e1e1e]'}`}>
                    {form.profileImage ? (
                      <img src={form.profileImage} alt="profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="relative w-[48px] h-[48px]">
                        <AvatarPlaceholderIcon className="w-full h-full object-cover" />
                        <div className="absolute left-[30px] w-[11px] h-[11px] top-[31.7px] pointer-events-none z-0">
                          <div className="absolute inset-[0_-16.67%_-33.33%_-16.67%]">
                            <img alt="" className="block max-w-none w-full h-full" src="/icons/Add user button.png" />
                          </div>
                        </div>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => { handleFile(e, "profileImage"); setErrors(prev => ({ ...prev, profileImage: '' })); }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  </div>
                  <ErrorMsg field="profileImage" />
                </Field>
              </div>

              <div ref={coverImageRef}>
                <Field label="Cover photo">
                  <div className={`flex aspect-[344/226] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border bg-black relative ${errors.coverImage ? 'border-red-500' : 'border-[#1e1e1e]'}`}>
                    {form.coverImage ? (
                      <img src={form.coverImage} alt="cover" className="h-full w-full object-cover" />
                    ) : (
                      <ImagePlaceholderIcon />
                    )}
                    <input type="file" accept="image/*" onChange={(e) => { handleFile(e, "coverImage"); setErrors(prev => ({ ...prev, coverImage: '' })); }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <ErrorMsg field="coverImage" />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6 bg-[#111] p-4 rounded-xl border border-transparent">
              <Field label="Full name">
                <div className="flex w-full items-center gap-[8px]">
                  <div ref={firstNameRef} className="w-full flex flex-col">
                    <div className={`w-full rounded-[10px] border bg-black px-[16px] py-[12px] ${errors.firstName ? 'border-red-500' : 'border-[#1e1e1e]'}`}>
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={(e) => { handleChange(e); setErrors(prev => ({ ...prev, firstName: '' })); }}
                        placeholder="First name"
                        className="w-full bg-transparent font-sans font-normal text-[16px] leading-[24px] tracking-[-0.096px] text-white outline-none placeholder:text-[#525252]"
                      />
                    </div>
                    <ErrorMsg field="firstName" />
                  </div>
                  <div ref={lastNameRef} className="w-full flex flex-col">
                    <div className={`w-full rounded-[10px] border bg-black px-[16px] py-[12px] ${errors.lastName ? 'border-red-500' : 'border-[#1e1e1e]'}`}>
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={(e) => { handleChange(e); setErrors(prev => ({ ...prev, lastName: '' })); }}
                        placeholder="Last name"
                        className="w-full bg-transparent font-sans font-normal text-[16px] leading-[24px] tracking-[-0.096px] text-white outline-none placeholder:text-[#525252]"
                      />
                    </div>
                    <ErrorMsg field="lastName" />
                  </div>
                </div>
              </Field>

              <div ref={countryRef}>
                <Field label="Where are you from?">
                  <div className="relative w-full">
                    <div className={`flex w-full items-center gap-[8px] rounded-[10px] border bg-black px-[16px] py-[12px] ${errors.country ? 'border-red-500' : 'border-[#1e1e1e]'}`}>
                      {sampleFlags[form.country] && (
                        <span className={`fi fi-${sampleFlags[form.country].toLowerCase()} h-[13.333px] w-[20px] aspect-[3/2] shrink-0 rounded-[2px] inline-block bg-cover bg-center`} />
                      )}
                      <input
                        value={form.country}
                        onChange={(e) => {
                          setForm((s: any) => ({ ...s, country: e.target.value }));
                          setFromOpen(true);
                          setErrors(prev => ({ ...prev, country: '' }));
                        }}
                        onFocus={() => setFromOpen(true)}
                        onBlur={() => setTimeout(() => setFromOpen(false), 200)}
                        placeholder="Select country"
                        className="w-full bg-transparent font-sans font-normal text-[16px] leading-[24px] tracking-[-0.096px] text-white outline-none placeholder:text-[#525252]"
                      />
                      <svg className="h-[20px] w-[20px] shrink-0 text-[#525252] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    {fromOpen && (
                      <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-[10px] border border-[#2a2a2a] bg-[#111] shadow-lg">
                        {Object.keys(sampleFlags)
                          .filter((c) => Object.keys(sampleFlags).includes(form.country) || c.toLowerCase().includes(form.country.toLowerCase()))
                          .map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setForm((s: any) => ({ ...s, country: c }));
                              setFromOpen(false);
                              setErrors(prev => ({ ...prev, country: '' }));
                            }}
                            className="flex w-full items-center gap-[8px] px-[16px] py-[12px] text-left text-[16px] text-white hover:bg-[#1e1e1e]"
                          >
                            <span className={`fi fi-${sampleFlags[c].toLowerCase()} h-[13.333px] w-[20px] aspect-[3/2] rounded-[2px] inline-block bg-cover bg-center`} title={c} />
                            <span>{c}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <ErrorMsg field="country" />
                  </div>
                </Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <div ref={visitedRef} className="flex flex-col bg-[#111] rounded-xl border border-transparent overflow-hidden">
              <div className="p-4 border-b border-[#1e1e1e]">
                <div className="flex w-full items-center justify-between mb-3">
                  <p className="text-[14px] text-white">Visited countries <span className="text-[#7c7c7c]">({visited.length} Selected)</span></p>
                  {visited.length > 0 && (
                    <button type="button" onClick={() => setIsVisitedExpanded(!isVisitedExpanded)} className="text-[#7c7c7c] hover:text-white transition-colors p-[2px]">
                      {isVisitedExpanded ? (
                        <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      ) : (
                        <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      )}
                    </button>
                  )}
                </div>
                {visited.length > 0 && !isVisitedExpanded && (
                  <div className="flex items-center gap-[4px] mb-[12px]">
                    {visited.slice(0, 5).map((c) => (
                      <div
                        key={c}
                        className="flex items-center justify-center rounded-[4px] bg-[#1e1e1e] px-[4px] py-[2px]"
                      >
                        <span className={`fi fi-${sampleFlags[c]?.toLowerCase()} h-[13.333px] w-[20px] aspect-[3/2] overflow-clip rounded-[1px] bg-cover bg-center`} title={c} />
                      </div>
                    ))}
                    {visited.length > 5 && (
                      <button type="button" onClick={() => setIsVisitedExpanded(true)} className="flex items-center justify-center rounded-[4px] bg-[#1e1e1e] px-[6px] py-[2px] cursor-pointer hover:bg-[#2a2a2a] transition-colors">
                        <span className="text-[10px] font-medium text-white">+{visited.length - 5}</span>
                      </button>
                    )}
                  </div>
                )}
                {visited.length > 0 && isVisitedExpanded && (
                  <div className="flex flex-wrap items-center gap-[4px] mb-[12px]">
                    {visited.map((c) => (
                      <div
                        key={c}
                        className="flex items-center gap-[4px] rounded-[6px] bg-[#1e1e1e] px-[6px] py-[4px]"
                      >
                        <span className={`fi fi-${sampleFlags[c]?.toLowerCase()} h-[13.333px] w-[20px] aspect-[3/2] overflow-clip rounded-[1px] bg-cover bg-center`} title={c} />
                        <span className="text-[12px] text-white font-medium">{sampleFlags[c]}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Minimum countries progress indicator */}
                {visited.length < 5 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-[#7c7c7c]">Minimum 5 countries required</span>
                      <span className={`text-[12px] font-medium ${visited.length >= 5 ? 'text-green-400' : 'text-[#7c7c7c]'}`}>{visited.length}/5</span>
                    </div>
                    <div className="w-full h-[3px] bg-[#1e1e1e] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((visited.length / 5) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {errors.visited && (
                  <p className="text-[12px] text-red-500 font-medium mb-3">{errors.visited}</p>
                )}

                <div className="relative flex items-center w-full rounded-[10px] border border-[#1e1e1e] bg-black">
                  <svg className="absolute left-[16px] top-1/2 -translate-y-1/2 h-[20px] w-[20px] text-[#7c7c7c] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    placeholder="Search countries"
                    className="w-full bg-transparent py-[12px] pl-[44px] pr-4 font-sans font-normal text-[16px] leading-[24px] tracking-[-0.096px] text-white outline-none placeholder:text-[#525252]"
                  />
                </div>
              </div>
              <div className="flex flex-col p-2 max-h-[400px] overflow-y-auto">
                {Object.keys(sampleFlags)
                  .filter((c) => c.toLowerCase().includes(countryQuery.toLowerCase()))
                  .map((c) => {
                  const isSelected = visited.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { isSelected ? removeCountry(c) : addCountry(c); setErrors(prev => ({ ...prev, visited: '' })); }}
                      className="flex w-full items-center justify-between p-[12px] text-left hover:bg-[#1e1e1e] transition-colors rounded-lg"
                    >
                      <div className="flex items-center gap-[12px]">
                        {isSelected ? (
                          <div className="flex h-[24px] w-[24px] items-center justify-center rounded-[8px] bg-white">
                            <svg className="h-[16px] w-[16px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <div className="h-[24px] w-[24px] rounded-[8px] border border-[#404040] bg-transparent" />
                        )}
                        <span className={`fi fi-${sampleFlags[c].toLowerCase()} h-[13.333px] w-[20px] aspect-[3/2] rounded-[2px] inline-block bg-cover bg-center`} title={c} />
                        <span className="text-[16px] text-white">{c}</span>
                      </div>
                      <span className="text-[14px] text-[#525252]">{sampleFlags[c]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center z-10">
          <div className="w-full max-w-[361px] flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-shrink-0 flex items-center justify-center h-[48px] w-[48px] rounded-full border border-white/20 bg-black text-white transition hover:bg-[#1a1a1a]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || (step === 3 && (isCreated ? !hasChanges : (isEditMode && !hasChanged)))}
              className="mt-6 flex h-[48px] w-[184px] items-center justify-center rounded-[99px] bg-white text-[16px] font-medium text-black hover:bg-white/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Processing..." : step === 3 ? (isCreated ? "Update" : (isEditMode ? "Update" : "Create")) : "Next"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
