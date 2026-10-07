import fs from 'fs';

let content = fs.readFileSync('src/features/explorercard/MobileExplorerForm.tsx', 'utf-8');

// 1. Add isClosingActionSheet state
content = content.replace(
  `const [actionSheetTarget, setActionSheetTarget] = useState<"profileImage" | "coverImage" | null>(null);`,
  `const [actionSheetTarget, setActionSheetTarget] = useState<"profileImage" | "coverImage" | null>(null);\n  const [isClosingActionSheet, setIsClosingActionSheet] = useState(false);\n  const closeActionSheet = () => {\n    setIsClosingActionSheet(true);\n    setTimeout(() => {\n      setActionSheetTarget(null);\n      setIsClosingActionSheet(false);\n    }, 300);\n  };`
);

// 2. Replace the modal logic
const oldModalStr = `      {/* Bottom Sheet Modal */}
      {actionSheetTarget && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 transition-opacity animate-fade-in" onClick={() => setActionSheetTarget(null)}>
          <style dangerouslySetInnerHTML={{__html: \`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-slide-up { animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .animate-fade-in { animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          \`}} />
          <div 
            className="w-full bg-[#1c1c1e] rounded-t-[20px] p-4 flex flex-col gap-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >`;

const newModalStr = `      {/* Bottom Sheet Modal */}
      {actionSheetTarget && (
        <div className={\`fixed inset-0 z-[200] flex items-end justify-center bg-black/60 \${isClosingActionSheet ? 'animate-fade-out' : 'animate-fade-in'}\`} onClick={() => closeActionSheet()}>
          <style dangerouslySetInnerHTML={{__html: \`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            @keyframes slideDown {
              from { transform: translateY(0); }
              to { transform: translateY(100%); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
            .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards; }
            .animate-slide-down { animation: slideDown 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards; }
            .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
            .animate-fade-out { animation: fadeOut 0.3s ease-in forwards; }
          \`}} />
          <div 
            className={\`w-full bg-[#1c1c1e] rounded-t-[20px] p-4 flex flex-col gap-4 \${isClosingActionSheet ? 'animate-slide-down' : 'animate-slide-up'}\`}
            onClick={(e) => e.stopPropagation()}
          >`;

content = content.replace(oldModalStr, newModalStr);

// Also need to replace all instances of setActionSheetTarget(null) inside the buttons to use closeActionSheet()

content = content.replace(
  `                  if (actionSheetTarget === "profileImage") fileInputRefProfile.current?.click();
                  if (actionSheetTarget === "coverImage") fileInputRefCover.current?.click();
                  setActionSheetTarget(null);`,
  `                  if (actionSheetTarget === "profileImage") fileInputRefProfile.current?.click();
                  if (actionSheetTarget === "coverImage") fileInputRefCover.current?.click();
                  closeActionSheet();`
);

content = content.replace(
  `                  if (actionSheetTarget) handleEditCrop(actionSheetTarget);
                  setActionSheetTarget(null);`,
  `                  if (actionSheetTarget) handleEditCrop(actionSheetTarget);
                  closeActionSheet();`
);

content = content.replace(
  `                  if (actionSheetTarget) handleRemoveImage(actionSheetTarget);
                  setActionSheetTarget(null);`,
  `                  if (actionSheetTarget) handleRemoveImage(actionSheetTarget);
                  closeActionSheet();`
);


fs.writeFileSync('src/features/explorercard/MobileExplorerForm.tsx', content);
