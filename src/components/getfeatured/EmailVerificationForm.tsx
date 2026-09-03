"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { NextPage } from 'next';
import Image from "next/image";
import { countries } from 'countries-list';
import styles from './form.module.css';
import { requestOtpAction, verifyOtpAction, submitApplicationAction } from '@/app/actions/auth';

const countryOptions = Object.entries(countries)
  .map(([code, data]) => ({
    code,
    name: data.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

interface Props {
  onVerified?: (email: string, user?: any, explorerCard?: any) => void;
  initialSessionUser?: any;
  source?: string;
}

const EmailVerificationForm = ({ onVerified, initialSessionUser, source }: Props = {}) => {
  const [email, setEmail] = useState(initialSessionUser?.email || '');
  const [step, setStep] = useState<'email' | 'otp' | 'application'>(initialSessionUser ? 'application' : 'email');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(initialSessionUser?.country || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [links, setLinks] = useState<string[]>(initialSessionUser?.links || []);
  const [firstName, setFirstName] = useState(initialSessionUser?.first_name || '');
  const [lastName, setLastName] = useState(initialSessionUser?.last_name || '');
  const [visitedCount, setVisitedCount] = useState(initialSessionUser?.visited_count?.toString() || '');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSessionUser) {
      if (onVerified) {
        onVerified(initialSessionUser.email, initialSessionUser);
      }
    }
  }, [initialSessionUser, onVerified]);

  // Basic email validation regex
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const filteredCountries = countryOptions.filter(c => c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()));

  const isLinkInputValid = linkInput.trim().length === 0 || (linkInput.trim().includes('.') && !linkInput.trim().includes(' '));

  const isAppValid = firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    selectedCountry !== null &&
    visitedCount !== '' &&
    links.length > 0;

  const handleSendCode = async () => {
    if (isValidEmail) {
      setIsLoading(true);
      setError(null);
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const res = await requestOtpAction(email, ua);
      setIsLoading(false);
      
      if (res.error) {
        alert(res.error);
        return;
      }
      
      setStep('otp');
    }
  };

  const handleResendCode = async () => {
    if (isValidEmail) {
      setIsLoading(true);
      setError(null);
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const res = await requestOtpAction(email, ua);
      setIsLoading(false);
      
      if (res.error) {
        alert(res.error);
        return;
      }
      
      alert('Code resent successfully!');
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError(null);
    const otpString = otp.join('');
    const res = await verifyOtpAction(email, otpString, source);
    setIsLoading(false);
    
    if (res.error) {
      setError(res.error);
      return;
    }
    
    if (onVerified) {
      onVerified(email, res.user, res.explorerCard);
    } else {
      setStep('application');
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

  const handleOtpChange = (index: number, value: string) => {
    setError(null);
    const digits = value.replace(/\D/g, '');
    if (!digits && value) return; // ignore non-digits

    const newOtp = [...otp];
    // Take the last character in case they type over an existing digit without selecting it
    const lastChar = digits.slice(-1);
    newOtp[index] = lastChar;
    setOtp(newOtp);

    // Auto-focus next input
    if (lastChar && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Submit OTP on enter
    if (e.key === 'Enter') {
      handleVerifyOtp();
    }
  };

  if (step === 'otp') {
    return (
      <div className="bg-[#111] flex flex-col h-[563px] items-center justify-center overflow-hidden pb-[32px] px-[32px] relative rounded-[20px] shrink-0 w-full max-w-[420px] mx-auto box-border">
        <div className="flex flex-col gap-[24px] items-center p-[32px] relative shrink-0 w-full">
          {/* OTP field group */}
          <div className="flex flex-col gap-[16px] items-center relative shrink-0 w-full">
            <div className="relative rounded-[16.81px] shrink-0 w-[100px] h-[100px]">
              <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-[152.625px] h-[121.557px] shrink-0" style={{ aspectRatio: '113/90' }}>
                <Image 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none" 
                  width={153} 
                  height={122} 
                  alt="Email Icon" 
                  src="/icons/img.png" 
                />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-[4px] min-w-full">
              <p className="ds-font-display font-medium text-[24px] leading-[32px] tracking-[-0.5px] text-center text-white">
                Verify your email
              </p>
              <p className="font-sans font-normal text-[14px] leading-[20px] tracking-[-0.084px] text-center text-[#989898]">
                {email}
              </p>
            </div>

            <div className="flex items-center justify-center gap-[10px] w-full pt-[8px]">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  name={`otp-input-${index}`}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-[62px] h-[60px] bg-[#000] border border-[#252525] rounded-[10px] text-center ds-font-display font-normal text-[24px] leading-[32px] tracking-[-0.5px] text-white outline-none focus:border-white transition-colors box-border"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[24px] items-center relative shrink-0 w-full">
            <button
              className={`flex items-center justify-center px-[16px] py-[10px] rounded-[999px] w-full font-sans font-medium text-[14px] leading-[20px] tracking-[-0.154px] transition-all ${
                !isLoading && otp.every((digit) => digit.trim() !== '') ? 'bg-[#5a45f9] text-white hover:opacity-90 cursor-pointer' : 'bg-[#c0caff] text-[#ecf0ff] cursor-not-allowed'
              }`}
              disabled={isLoading || !otp.every((digit) => digit.trim() !== '')}
              onClick={handleVerifyOtp}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            {error && (
              <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', marginTop: '-12px' }}>
                {error}
              </div>
            )}
            <button 
              onClick={handleResendCode} 
              disabled={isLoading}
              className="ds-font-body font-normal text-[14px] leading-[20px] tracking-[-0.084px] text-center text-[#7c7c7c] hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend code
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (step === 'application') {
    return (
      <div className={styles.appFormParent}>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}>Full name</div>
          <div className={styles.inputRow}>
            <input type="text" placeholder="First name" className={styles.textInput} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="Last name" className={styles.textInput} value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>

        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}>Email</div>
          <div className={styles.inputRow}>
            <input type="email" value={email} disabled className={styles.textInput} />
          </div>
        </div>

        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}>Where are you from?</div>
          <div className={styles.inputRow}>
            <div className={styles.selectWrapper}>
              {!isDropdownOpen ? (
                <>
                  <div
                    className={styles.selectInput}
                    onClick={() => setIsDropdownOpen(true)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {selectedCountry ? (
                      <>
                        <span className={`fi fi-${selectedCountry.toLowerCase()}`} />
                        {countryOptions.find(c => c.code === selectedCountry)?.name}
                      </>
                    ) : (
                      <span style={{ color: '#525252' }}>Select country</span>
                    )}
                  </div>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_LANDING_ASSETS_CDN_BASE}/get-featured/dropdown-icon.svg`}
                    alt="Toggle Dropdown"
                    width={24}
                    height={24}
                    className={`${styles.selectIcon} ${isDropdownOpen ? styles.selectIconOpen : ''}`}
                  />
                </>
              ) : (
                <div style={{width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, position: 'relative', background: 'black', borderRadius: 10, outline: '1px #989898 solid', outlineOffset: '-1px', display: 'flex', alignItems: 'center', gap: 12}}>
                    <div style={{width: 24, height: 24, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z" fill="#7C7C7C"/>
                        </svg>
                    </div>
                    <div style={{width: 1, height: 24, background: 'white', opacity: 0.2}}></div>
                    <input 
                        autoFocus
                        type="text"
                        placeholder="Search country"
                        value={countrySearchQuery}
                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                        style={{background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 16, fontFamily: 'Inter', fontWeight: '400', lineHeight: '24px', width: '100%'}}
                    />
                </div>
              )}

              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {filteredCountries.map(country => (
                    <div
                      key={country.code}
                      className={`${styles.dropdownItem} ${selectedCountry === country.code ? styles.dropdownItemSelected : ''}`}
                      onClick={() => {
                        setSelectedCountry(country.code);
                        setIsDropdownOpen(false);
                        setCountrySearchQuery('');
                      }}
                    >
                      <span className={`fi fi-${country.code.toLowerCase()}`} />
                      {country.name}
                    </div>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div style={{ padding: '10px 16px', color: '#7C7C7C' }}>No countries found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}>How many countries have you visited?</div>
          <div className={styles.inputRow}>
            <input
              type="number"
              placeholder="e.g. 10"
              className={styles.textInput}
              min={0}
              max={countryOptions.length}
              value={visitedCount}
              onChange={(e) => setVisitedCount(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}>Share links to your travel photos</div>
          <div className={styles.inputRow}>
            <div className={styles.inputWithButtonWrapper}>
              <input
                type="text"
                placeholder={links.length >= 3 ? "Maximum 3 links reached" : "e.g. instagram.com/username"}
                className={styles.textInputNoBorder}
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (linkInput.trim() && isLinkInputValid && links.length < 3 && !links.includes(linkInput.trim())) {
                      setLinks([...links, linkInput.trim()]);
                      setLinkInput('');
                    }
                  }
                }}
                disabled={links.length >= 3}
              />
              <button
                className={`${styles.addLinkBtn} ${linkInput.trim().length > 0 && isLinkInputValid && links.length < 3 && !links.includes(linkInput.trim()) ? styles.addLinkBtnActive : ''}`}
                disabled={!isLinkInputValid || linkInput.trim().length === 0 || links.length >= 3 || links.includes(linkInput.trim())}
                onClick={() => {
                  if (linkInput.trim() && isLinkInputValid && links.length < 3 && !links.includes(linkInput.trim())) {
                    setLinks([...links, linkInput.trim()]);
                    setLinkInput('');
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
          {!isLinkInputValid && (
            <div style={{width: '100%', color: '#989898', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word', marginTop: '4px'}}>
              Enter a full link, e.g. instagram.com/username or flickr.com/photos/username
            </div>
          )}

          {links.map((link, index) => (
            <div key={index} className={styles.addedLinkBadge}>
              <div className={styles.addedLinkText}>{link}</div>
              <div
                className={styles.addedLinkRemoveBtn}
                onClick={() => setLinks(links.filter((_, i) => i !== index))}
              >
                <Image src={`${process.env.NEXT_PUBLIC_LANDING_ASSETS_CDN_BASE}/get-featured/close.svg`} alt="Remove link" width={8} height={8} />
              </div>
            </div>
          ))}
        </div>

        <button
          className={`${styles.submitAppBtn} ${isAppValid && !isLoading ? styles.submitAppBtnActive : ''}`}
          disabled={!isAppValid || isLoading}
          onClick={async () => {
            setIsLoading(true);
            const res = await submitApplicationAction(email, {
              firstName,
              lastName,
              country: selectedCountry || '',
              visitedCount: parseInt(visitedCount) || 0,
              links
            });
            setIsLoading(false);
            
            if (res.error) {
              alert(res.error);
              return;
            }
            
            alert('Your application has been submitted successfully!');
            // Reset form state to return to home page view
            setStep('email');
            setEmail('');
            setOtp(['', '', '', '']);
            setFirstName('');
            setLastName('');
            setVisitedCount('');
            setLinks([]);
            setSelectedCountry(null);
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>

        <div className={styles.appFooterText}>
          Applications are reviewed manually. If selected, we&apos;ll email you a private upload link to create your travel profile before launch.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111] flex flex-col h-[563px] items-center justify-center overflow-hidden pb-[32px] px-[32px] relative rounded-[20px] shrink-0 w-full max-w-[420px] mx-auto box-border">
      <div className="flex flex-col gap-[24px] items-center p-[32px] relative shrink-0 w-full">
        {/* Email field group */}
        <div className="flex flex-col gap-[16px] items-center relative shrink-0 w-full">
          <div className="relative rounded-[16.81px] shrink-0 w-[100px] h-[100px]">
            <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-[152.625px] h-[121.557px] shrink-0" style={{ aspectRatio: '113/90' }}>
              <Image 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none" 
                width={153} 
                height={122} 
                alt="Email Icon" 
                src="/icons/img.png" 
              />
            </div>
          </div>
          <p className="ds-font-display font-medium text-[24px] leading-[32px] tracking-[-0.5px] text-center text-white min-w-full">
            Enter your email
          </p>
          <div className="flex flex-col items-start relative shrink-0 w-full">
            <div className="flex items-center justify-center px-[16px] py-[12px] relative rounded-[10px] shrink-0 w-full">
              <input
                id="email-input"
                name="email"
                type="email"
                placeholder="e.g. james@email.com"
                className="ds-font-display font-normal text-[24px] leading-[32px] tracking-[-0.5px] text-center text-white placeholder-[#2a2a2a] bg-transparent outline-none w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isValidEmail) {
                    e.preventDefault();
                    handleSendCode();
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Button + text group */}
        <div className="flex flex-col gap-[24px] items-center relative shrink-0 w-full">
          <button
            className={`flex items-center justify-center px-[16px] py-[10px] rounded-[999px] w-full font-sans font-medium text-[14px] leading-[20px] tracking-[-0.154px] transition-all ${
              isValidEmail && !isLoading ? 'bg-[#5a45f9] text-white hover:opacity-90 cursor-pointer' : 'bg-[#c0caff] text-[#ecf0ff] cursor-not-allowed'
            }`}
            disabled={!isValidEmail || isLoading}
            onClick={handleSendCode}
          >
            {isLoading ? 'Sending...' : 'Send code'}
          </button>
          <p className="ds-font-body font-normal text-[14px] leading-[20px] tracking-[-0.084px] text-center text-[#7c7c7c] w-full">
            We&apos;ll verify your email before creating your<br/>explorer card
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
