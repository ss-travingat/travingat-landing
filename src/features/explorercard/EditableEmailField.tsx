import React, { useState, useRef } from 'react';
import { Field } from './expcard-page';
import { requestOtpAction, verifyOtpAction } from '@/app/actions/auth';

interface EditableEmailFieldProps {
  email: string;
  onVerified: (newEmail: string) => void;
}

export function EditableEmailField({ email, onVerified }: EditableEmailFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [draftEmail, setDraftEmail] = useState(email);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draftEmail);

  const handleSaveClick = async () => {
    if (!draftEmail || draftEmail === email) {
      setIsEditing(false);
      return;
    }
    
    if (!isValidEmail) return;


    setIsLoading(true);
    setError(null);
    const res = await requestOtpAction(draftEmail);
    setIsLoading(false);
    
    if (res?.error) {
      setError(res.error);
      return;
    }
    
    setIsVerifying(true);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError(null);
    const otpString = otp.join('');
    const res = await verifyOtpAction(draftEmail, otpString, 'Explorer Card');
    setIsLoading(false);
    
    if (res?.error) {
      setError(res.error);
      return;
    }
    
    onVerified(draftEmail);
    setIsEditing(false);
    setIsVerifying(false);
    setOtp(['', '', '', '']);
  };

  const handleOtpChange = (index: number, value: string) => {
    setError(null);
    const digits = value.replace(/\D/g, '');
    if (!digits && value) return;

    const newOtp = [...otp];
    const lastChar = digits.slice(-1);
    newOtp[index] = lastChar;
    setOtp(newOtp);

    if (lastChar && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleVerifyOtp();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const focusIndex = Math.min(pastedData.length, 3);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <Field label="Email" hint="Verified via OTP">
      <div className="flex flex-col gap-[8px]">
        <div className={`flex w-full items-center gap-[8px] rounded-[10px] border border-[#1e1e1e] bg-black px-[16px] py-[12px] transition-opacity ${!isEditing ? 'opacity-70' : 'opacity-100'}`}>
          <input
            type="email"
            value={isEditing ? draftEmail : email}
            onChange={(e) => setDraftEmail(e.target.value)}
            disabled={!isEditing || isVerifying || isLoading}
            className="w-full bg-transparent text-[16px] text-white outline-none disabled:cursor-not-allowed"
          />
          {!isEditing ? (
            <button type="button" onClick={() => { setIsEditing(true); setDraftEmail(email); }} className="text-[#525252] hover:text-white transition-colors cursor-pointer shrink-0">
              <svg className="h-[20px] w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-[8px] shrink-0">
              <button 
                type="button" 
                onClick={() => { 
                  if (isVerifying) setIsVerifying(false);
                  else { setIsEditing(false); setDraftEmail(email); }
                }} 
                disabled={isLoading} 
                className="text-[#525252] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <svg className="h-[20px] w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {!isVerifying && (
                <button type="button" onClick={handleSaveClick} disabled={isLoading || !isValidEmail} className="text-white transition-colors cursor-pointer disabled:opacity-50">
                  {isLoading ? (
                     <svg className="h-[20px] w-[20px] animate-spin" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                  ) : (
                    <svg className="h-[20px] w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {isVerifying && (
          <div className="flex flex-col gap-[12px] rounded-[10px] border border-[#1e1e1e] bg-[#111] p-[16px]">
            <p className="text-[14px] text-white">Enter the 4-digit code sent to {draftEmail}</p>
            <div className="flex items-center gap-[8px]">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  className="h-[48px] w-[48px] rounded-[8px] border border-[#1e1e1e] bg-black text-center text-[18px] text-white outline-none focus:border-[#525252] disabled:opacity-50"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.some(d => !d)}
              className="w-full rounded-[8px] bg-white px-[16px] py-[10px] text-[14px] font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50 mt-[4px]"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            {error && (
              <p className="text-[14px] text-red-500 text-center mt-2">{error}</p>
            )}
          </div>
        )}
      </div>
    </Field>
  );
}
