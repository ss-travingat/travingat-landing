import React from 'react';
import { Field } from './expcard-page';
import { ImagePlaceholderIcon, AvatarPlaceholderIcon } from './cards';


interface DesktopExplorerFormProps {
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
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function DesktopExplorerForm({
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
  errors,
  setErrors,
}: DesktopExplorerFormProps) {
  const [isVisitedExpanded, setIsVisitedExpanded] = React.useState(false);
  const ErrorMsg = ({ field }: { field: string }) => errors[field] ? <p className="mt-1 text-[12px] text-red-500 font-medium">{errors[field]}</p> : null;
  return (
    <aside className="hidden lg:block relative w-full lg:w-[420px] shrink-0 h-[calc(100vh-160px)] max-h-[860px] overflow-hidden rounded-[20px] bg-black-900 border border-transparent">
      <form onSubmit={handleCreate} className="flex h-full flex-col w-full relative bg-[#111]">
        <div className="flex-1 overflow-y-auto p-8 pb-4 flex flex-col items-start gap-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
        
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

        <div className="flex flex-col">
          <Field label="Upload profile photo">
            <div className={`flex h-[80px] w-[80px] cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border bg-black relative ${errors.profileImage ? 'border-red-500' : 'border-[#2a2a2a]'}`}>
              {form.profileImage ? (
                <img src={form.profileImage} alt="profile" className="h-full w-full object-cover" />
              ) : (
                <AvatarPlaceholderIcon />
              )}
              <input type="file" accept="image/*" onChange={(e) => { handleFile(e, "profileImage"); setErrors(s => ({ ...s, profileImage: '' })); }} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </Field>
          <ErrorMsg field="profileImage" />
        </div>

        <div className="flex flex-col">
          <Field label="Upload cover photo">
            <div className={`flex h-[131px] w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border bg-black relative ${errors.coverImage ? 'border-red-500' : 'border-[#2a2a2a]'}`}>
              {form.coverImage ? (
                <img src={form.coverImage} alt="cover" className="h-full w-full object-cover" />
              ) : (
                <ImagePlaceholderIcon />
              )}
              <input type="file" accept="image/*" onChange={(e) => { handleFile(e, "coverImage"); setErrors(s => ({ ...s, coverImage: '' })); }} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </Field>
          <ErrorMsg field="coverImage" />
        </div>

        <Field label="Full name">
          <div className="flex w-full items-center gap-[8px]">
            <div className="flex flex-col w-full">
              <div className={`w-full rounded-[10px] bg-black border px-[16px] py-[12px] ${errors.firstName ? 'border-red-500' : 'border-[#1e1e1e]'}`}>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={(e) => { handleChange(e); setErrors(s => ({ ...s, firstName: '' })); }}
                  placeholder="First name"
                  className="w-full bg-transparent font-sans font-normal text-[16px] leading-[24px] tracking-[-0.096px] text-white outline-none placeholder:text-[#525252]"
                />
              </div>
              <ErrorMsg field="firstName" />
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full rounded-[10px] bg-black border px-[16px] py-[12px] ${errors.lastName ? 'border-red-500' : 'border-[#1e1e1e]'}`}>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={(e) => { handleChange(e); setErrors(s => ({ ...s, lastName: '' })); }}
                  placeholder="Last name"
                  className="w-full bg-transparent font-sans font-normal text-[16px] leading-[24px] tracking-[-0.096px] text-white outline-none placeholder:text-[#525252]"
                />
              </div>
              <ErrorMsg field="lastName" />
            </div>
          </div>
        </Field>

        <Field label="Where are you from?">
          <div className="relative w-full flex flex-col">
            <div className={`flex w-full items-center gap-[8px] rounded-[10px] bg-black border px-[16px] py-[12px] ${errors.country ? 'border-red-500' : 'border-[#1e1e1e]'}`}>
              {sampleFlags[form.country] && (
                 <span className={`fi fi-${sampleFlags[form.country].toLowerCase()} h-[13.333px] w-[20px] aspect-[3/2] shrink-0 rounded-[2px] inline-block bg-cover bg-center`} />
              )}
              <input
                value={form.country}
                onChange={(e) => {
                  setForm((s: any) => ({ ...s, country: e.target.value }));
                  setFromOpen(true);
                  setErrors(s => ({ ...s, country: '' }));
                }}
                onFocus={() => setFromOpen(true)}
                onBlur={() => setTimeout(() => setFromOpen(false), 200)}
                placeholder="Select country"
                className="w-full bg-transparent font-sans font-normal text-[16px] leading-[24px] tracking-[-0.096px] text-white outline-none placeholder:text-[#525252]"
              />
              <svg className="h-[24px] w-[24px] shrink-0 text-[#525252] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            <ErrorMsg field="country" />
            {fromOpen && (
              <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-[8px] border border-[#2a2a2a] bg-[#111] shadow-lg">
                {Object.keys(sampleFlags)
                  .filter((c) => Object.keys(sampleFlags).includes(form.country) || c.toLowerCase().includes(form.country.toLowerCase()))
                  .map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setForm((s: any) => ({ ...s, country: c }));
                      setFromOpen(false);
                      setErrors(s => ({ ...s, country: '' }));
                    }}
                    className="flex w-full items-center gap-[8px] px-[12px] py-[8px] text-left text-[14px] text-white hover:bg-[#1e1e1e]"
                  >
                    <span className={`fi fi-${sampleFlags[c].toLowerCase()} h-[13.333px] w-[20px] aspect-[3/2] shrink-0 rounded-[2px] inline-block bg-cover bg-center`} title={c} />
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Field>

        <div className="flex w-full flex-col gap-[10px]">
          <div className="flex w-full items-center justify-between">
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
            <div className="flex items-center gap-[4px]">
              {visited.slice(0, 5).map((c) => (
                <div
                  key={c}
                  className="flex items-center justify-center rounded-[4px] bg-[#1e1e1e] px-[4px] py-[2px]"
                >
                  <span className={`fi fi-${sampleFlags[c].toLowerCase()} h-[13.333px] w-[20px] aspect-[3/2] shrink-0 overflow-clip rounded-[1px] bg-cover bg-center`} title={c} />
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
            <div className="flex flex-wrap items-center gap-[4px]">
              {visited.map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-[4px] rounded-[6px] bg-[#1e1e1e] px-[6px] py-[2px]"
                >
                  <span className={`fi fi-${sampleFlags[c].toLowerCase()} h-[13.333px] w-[20px] aspect-[3/2] shrink-0 overflow-clip rounded-[1px] bg-cover bg-center`} title={c} />
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

          <ErrorMsg field="visited" />

          <div className="relative w-full">
            <div className={`relative flex items-center w-full rounded-[10px] border bg-black ${errors.visited ? 'border-red-500' : 'border-[#1e1e1e]'}`}>
              <svg className="absolute left-[16px] top-1/2 -translate-y-1/2 h-[24px] w-[24px] text-[#e3e3e3] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                value={countryQuery}
                onChange={(e) => setCountryQuery(e.target.value)}
                onFocus={() => setVisitedOpen(true)}
                onBlur={() => setTimeout(() => setVisitedOpen(false), 200)}
                placeholder="Search countries"
                className="w-full bg-transparent py-[12px] pl-[56px] pr-4 font-sans font-normal text-[16px] leading-[24px] tracking-[-0.096px] text-white outline-none placeholder:text-[#525252]"
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
                      onClick={() => { isSelected ? removeCountry(c) : addCountry(c); setErrors(s => ({ ...s, visited: '' })); }}
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
                        <span className={`fi fi-${sampleFlags[c].toLowerCase()} h-[13.333px] w-[20px] aspect-[3/2] shrink-0 rounded-[2px] inline-block bg-cover bg-center`} title={c} />
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
        </div>

        <div className="p-8 pt-4 bg-[#111] shrink-0 w-full mt-auto border-t border-[#1e1e1e]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-[100px] bg-[#533df6] px-[24px] py-[12px] font-sans text-[16px] font-medium leading-[24px] tracking-[-0.176px] text-[#ecf0ff] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create explorer card"}
          </button>
        </div>
      </form>
    </aside>
  );
}
