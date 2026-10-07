import fs from 'fs';

let content = fs.readFileSync('src/features/explorercard/MobileExplorerForm.tsx', 'utf-8');

// 1. Add state variable for the action sheet
content = content.replace(
  `const [step, setStep] = useState(1);`,
  `const [step, setStep] = useState(1);\n  const [actionSheetTarget, setActionSheetTarget] = useState<"profileImage" | "coverImage" | null>(null);\n  const fileInputRefProfile = useRef<HTMLInputElement>(null);\n  const fileInputRefCover = useRef<HTMLInputElement>(null);`
);

// 2. Add the modal at the end of the form
const modalCode = `
      {/* Bottom Sheet Modal */}
      {actionSheetTarget && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 transition-opacity" onClick={() => setActionSheetTarget(null)}>
          <div 
            className="w-full bg-[#1c1c1e] rounded-t-[20px] p-4 flex flex-col gap-4 animate-in slide-in-from-bottom-full duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-2 px-2 pt-2">
              <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-black shrink-0">
                {form[actionSheetTarget] && (
                  <img src={form[actionSheetTarget]} alt="preview" className="w-full h-full object-cover" />
                )}
              </div>
              <h2 className="text-white text-[20px] font-semibold">
                Edit {actionSheetTarget === "profileImage" ? "profile" : "cover"} picture
              </h2>
            </div>
            
            <div className="flex flex-col bg-[#2c2c2e] rounded-[14px] overflow-hidden">
              <button 
                type="button"
                className="flex items-center gap-4 p-4 text-white hover:bg-[#3c3c3e] transition-colors border-b border-[#3a3a3c]"
                onClick={() => {
                  if (actionSheetTarget === "profileImage") fileInputRefProfile.current?.click();
                  if (actionSheetTarget === "coverImage") fileInputRefCover.current?.click();
                  setActionSheetTarget(null);
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-[17px] font-medium tracking-tight">Choose photo</span>
              </button>
              
              <button 
                type="button"
                className="flex items-center gap-4 p-4 text-white hover:bg-[#3c3c3e] transition-colors border-b border-[#3a3a3c]"
                onClick={() => {
                  handleEditCrop(actionSheetTarget);
                  setActionSheetTarget(null);
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                <span className="text-[17px] font-medium tracking-tight">Edit photo</span>
              </button>
              
              <button 
                type="button"
                className="flex items-center gap-4 p-4 text-[#ff453a] hover:bg-[#3c3c3e] transition-colors"
                onClick={() => {
                  handleRemoveImage(actionSheetTarget);
                  setActionSheetTarget(null);
                }}
              >
                <svg className="w-6 h-6 text-[#ff453a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                <span className="text-[17px] font-medium tracking-tight">Delete photo</span>
              </button>
            </div>
          </div>
          <input ref={fileInputRefProfile} type="file" accept="image/*" onChange={(e) => { handleFile(e, "profileImage"); setErrors(prev => ({ ...prev, profileImage: '' })); }} className="hidden" />
          <input ref={fileInputRefCover} type="file" accept="image/*" onChange={(e) => { handleFile(e, "coverImage"); setErrors(prev => ({ ...prev, coverImage: '' })); }} className="hidden" />
        </div>
      )}
`;
content = content.replace(
  `    </div>\n  );\n}`,
  `${modalCode}    </div>\n  );\n}`
);

// 3. Update the Profile Image and Cover Image rendering to use the edit icon on top right
// For Profile Image:
content = content.replace(
  `                      {form.profileImage ? (
                        <>
                          <img src={form.profileImage} alt="profile" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => { e.preventDefault(); handleEditCrop("profileImage"); }}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </div>
                        </>
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
                  {form.profileImage && (
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveImage("profileImage"); }} className="absolute -top-1.5 -right-1.5 z-30 flex h-4 w-4 items-center justify-center rounded-full bg-[#8b0000] text-white shadow-md hover:bg-[#6b0000] opacity-0 transition-opacity group-hover:opacity-100">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}`,
  `                      {form.profileImage ? (
                        <>
                          <img src={form.profileImage} alt="profile" className="h-full w-full object-cover" />
                        </>
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
                    {!form.profileImage && (
                      <input type="file" accept="image/*" onChange={(e) => { handleFile(e, "profileImage"); setErrors(prev => ({ ...prev, profileImage: '' })); }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    )}
                  </div>
                  {form.profileImage && (
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActionSheetTarget("profileImage"); }} className="absolute -top-2 -right-2 z-30 flex h-[28px] w-[28px] items-center justify-center rounded-full bg-black/80 text-white shadow-md border border-[#333]">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  )}`
);

// For Cover Image:
content = content.replace(
  `                      {form.coverImage ? (
                        <>
                          <img src={form.coverImage} alt="cover" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => { e.preventDefault(); handleEditCrop("coverImage"); }}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </div>
                        </>
                      ) : (
                      <ImagePlaceholderIcon />
                    )}
                    <input type="file" accept="image/*" onChange={(e) => { handleFile(e, "coverImage"); setErrors(prev => ({ ...prev, coverImage: '' })); }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  </div>
                  {form.coverImage && (
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveImage("coverImage"); }} className="absolute -top-1.5 -right-1.5 z-30 flex h-4 w-4 items-center justify-center rounded-full bg-[#8b0000] text-white shadow-md hover:bg-[#6b0000] opacity-0 transition-opacity group-hover:opacity-100">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}`,
  `                      {form.coverImage ? (
                        <>
                          <img src={form.coverImage} alt="cover" className="h-full w-full object-cover" />
                        </>
                      ) : (
                      <ImagePlaceholderIcon />
                    )}
                    {!form.coverImage && (
                      <input type="file" accept="image/*" onChange={(e) => { handleFile(e, "coverImage"); setErrors(prev => ({ ...prev, coverImage: '' })); }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    )}
                  </div>
                  {form.coverImage && (
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActionSheetTarget("coverImage"); }} className="absolute top-3 right-3 z-30 flex h-[32px] w-[32px] items-center justify-center rounded-full bg-black/80 text-white shadow-md border border-[#333]">
                      <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  )}`
);

fs.writeFileSync('src/features/explorercard/MobileExplorerForm.tsx', content);
