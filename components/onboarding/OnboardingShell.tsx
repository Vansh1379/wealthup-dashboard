'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ONBOARDING_SIDEBAR_ITEMS, TRUST_ITEMS } from '@/lib/constants/onboarding';
import type { OnboardingStepContent } from '@/lib/types/onboarding';

type OnboardingShellProps = {
  step: OnboardingStepContent;
};

function getSidebarTitleClass(itemId: number) {
  if (itemId === 1) return '-translate-x-1/2 left-[calc(50%-19.5px)] text-center';
  if (itemId === 2) return '-translate-x-1/2 left-[calc(50%+3px)] text-center';
  return 'left-[calc(50%-70px)]';
}

function getDesktopCardHeight(stepId: number) {
  if (stepId === 2) return 599;
  if (stepId === 1) return 389;
  if (stepId === 5 || stepId === 6) return 701;
  if (stepId === 7) return 663;
  if (stepId === 8) return 481;
  if (stepId === 9) return 749;
  if (stepId === 10) return 532;
  if (stepId === 11) return 430;
  if (stepId === 12) return 420;
  return 462;
}

function getDesktopCardWidth(stepId: number) {
  if (stepId === 10 || stepId === 11) return 428;
  if (stepId === 12) return 515;
  return 600;
}

function getMobileCardWidth(stepId: number) {
  if (stepId === 12) return 360;
  return 370;
}

function getMobileCardHeight(stepId: number) {
  if (stepId === 2) return 616;
  if (stepId === 1) return 389;
  if (stepId === 5) return 1200;
  if (stepId === 6) return 1201;
  if (stepId === 7) return 700;
  if (stepId === 8) return 725;
  if (stepId === 9) return 1185;
  if (stepId === 10) return 560;
  if (stepId === 11) return 500;
  if (stepId === 12) return 430;
  return 462;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const SELECT_OPTIONS: Record<string, string[]> = {
  gender: ['Male', 'Female'],
  'marital status': ['Single', 'Married', 'Separated', 'Divorced', 'Widowed'],
  'type of account': ['Current', 'Saving'],
  'relationship with investor': ['Spouse', 'Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter', 'Other'],
  'country of birth': ['India', 'Other'],
  'mode of holding': ['Single', 'Joint', 'Either or Survivor'],
};

function normalizeLabel(label: string) {
  return label.toLowerCase().replace(/[’']/g, '').trim();
}

function isPanLabel(label: string) {
  return normalizeLabel(label).includes('pan number');
}

function isEmailLabel(label: string) {
  return normalizeLabel(label).includes('email');
}

function isMobileLabel(label: string) {
  return normalizeLabel(label).includes('mobile number');
}

function isNameLabel(label: string) {
  const normalized = normalizeLabel(label);
  return normalized.includes('name');
}

function isPincodeLabel(label: string) {
  return normalizeLabel(label).includes('pincode');
}

function isDateLabel(label: string) {
  return normalizeLabel(label).includes('date of birth');
}

function getSelectOptions(label: string) {
  return SELECT_OPTIONS[normalizeLabel(label)];
}

function sanitizePan(rawValue: string) {
  const alnum = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let result = '';
  for (const char of alnum) {
    if (result.length < 5) {
      if (/[A-Z]/.test(char)) result += char;
      continue;
    }
    if (result.length < 9) {
      if (/[0-9]/.test(char)) result += char;
      continue;
    }
    if (result.length === 9) {
      if (/[A-Z]/.test(char)) result += char;
      break;
    }
  }
  return result.slice(0, 10);
}

function sanitizeFieldValue(label: string, rawValue: string) {
  if (isPanLabel(label)) return sanitizePan(rawValue);
  if (isMobileLabel(label)) return rawValue.replace(/\D/g, '').slice(0, 10);
  if (isPincodeLabel(label)) return rawValue.replace(/\D/g, '').slice(0, 6);
  if (isNameLabel(label)) return rawValue.replace(/[^A-Za-z\s]/g, '');
  if (isEmailLabel(label)) return rawValue.replace(/\s/g, '').toLowerCase();
  return rawValue;
}

function getFieldError(label: string, value: string) {
  if (!value) return '';
  if (isPanLabel(label) && !PAN_REGEX.test(value)) return 'PAN format must be ABCDE1234F';
  if (isEmailLabel(label) && !EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
  if (isMobileLabel(label) && value.length !== 10) return 'Mobile number must be 10 digits';
  if (isPincodeLabel(label) && value.length !== 6) return 'Pincode must be 6 digits';
  if (isNameLabel(label) && !/^[A-Za-z\s]+$/.test(value)) return 'Only letters are allowed';
  return '';
}

function getInputType(label: string): 'text' | 'email' | 'tel' | 'date' {
  if (isDateLabel(label)) return 'date';
  if (isEmailLabel(label)) return 'email';
  if (isMobileLabel(label) || isPincodeLabel(label)) return 'tel';
  return 'text';
}

function getInputMode(label: string): 'text' | 'email' | 'numeric' {
  if (isMobileLabel(label) || isPincodeLabel(label)) return 'numeric';
  if (isEmailLabel(label)) return 'email';
  return 'text';
}

function StepField({
  label,
  value,
  initialValue,
  rounded = 'pill',
  onChange,
  error,
}: {
  label: string;
  value: string;
  initialValue?: string;
  rounded?: 'pill' | 'soft';
  onChange: (value: string) => void;
  error?: string;
}) {
  const selectOptions = getSelectOptions(label);
  const inputType = getInputType(label);

  return (
    <div>
      <p className="mb-[3px] pl-[15px] text-sm font-extralight italic tracking-[0.7px] text-[#294F7C]">{label}</p>
      {selectOptions ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-10 w-full appearance-none border border-[#294F7C] bg-[rgba(248,250,252,0.7)] ${rounded === 'pill' ? 'rounded-[70px]' : 'rounded-[20px]'} px-[15px] py-[9px] pr-8 text-sm font-normal not-italic tracking-normal text-[#294F7C] outline-none`}
          aria-invalid={error ? true : undefined}
        >
          <option value="">Select</option>
          {selectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={inputType}
          inputMode={getInputMode(label)}
          maxLength={isPanLabel(label) ? 10 : isMobileLabel(label) ? 10 : isPincodeLabel(label) ? 6 : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={initialValue ?? ''}
          className={`h-10 w-full border border-[#294F7C] bg-[rgba(248,250,252,0.7)] ${rounded === 'pill' ? 'rounded-[70px]' : 'rounded-[20px]'} px-[15px] py-[9px] text-sm font-normal not-italic tracking-normal text-[#294F7C] outline-none placeholder:font-extralight placeholder:italic placeholder:tracking-[1.4px] placeholder:text-[#5E5E5E]`}
          aria-invalid={error ? true : undefined}
        />
      )}
    </div>
  );
}

function StepCard({ step, mobile = false }: { step: OnboardingStepContent; mobile?: boolean }) {
  const cardHeight = mobile ? getMobileCardHeight(step.id) : getDesktopCardHeight(step.id);
  const cardWidth = mobile ? getMobileCardWidth(step.id) : getDesktopCardWidth(step.id);
  const useStepOneLayout = step.id === 1 && !step.showSelfieUpload && !step.showSendOtp && !step.resendText;
  const isPersonalDetailsDesktop = !mobile && (step.id === 5 || step.id === 6);
  const isPersonalDetailsMobile = mobile && step.id === 5;
  const isPersonalDetailsMobileOtp = mobile && step.id === 6;
  const isBankDetailsDesktop = !mobile && step.id === 8;
  const isNomineeDetailsDesktop = !mobile && step.id === 9;
  const isBankDetailsMobile = mobile && step.id === 8;
  const isNomineeDetailsMobile = mobile && step.id === 9;
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(step.fields.map((field) => [field.label, ''])),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedTaxResident, setSelectedTaxResident] = useState<'yes' | 'no'>(step.selectedTaxResident ?? 'no');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [sameAsYours, setSameAsYours] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFieldValues(Object.fromEntries(step.fields.map((field) => [field.label, ''])));
    setFieldErrors({});
    setSelectedTaxResident(step.selectedTaxResident ?? 'no');
    setSelectedFileName('');
    setAgreedTerms(false);
    setSameAsYours(false);
  }, [step.id, step.fields, step.selectedTaxResident]);

  const handleFieldChange = (label: string, rawValue: string) => {
    const sanitized = sanitizeFieldValue(label, rawValue);
    setFieldValues((prev) => ({ ...prev, [label]: sanitized }));
    setFieldErrors((prev) => ({ ...prev, [label]: getFieldError(label, sanitized) }));
  };

  const renderControl = (label: string, className: string, placeholder?: string) => {
    const selectOptions = getSelectOptions(label);
    const value = fieldValues[label] ?? '';
    const error = fieldErrors[label];

    if (selectOptions) {
      return (
        <select
          value={value}
          onChange={(event) => handleFieldChange(label, event.target.value)}
          className={`${className} appearance-none pr-8`}
          aria-invalid={error ? true : undefined}
        >
          <option value="">Select</option>
          {selectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={getInputType(label)}
        inputMode={getInputMode(label)}
        maxLength={isPanLabel(label) ? 10 : isMobileLabel(label) ? 10 : isPincodeLabel(label) ? 6 : undefined}
        value={value}
        onChange={(event) => handleFieldChange(label, event.target.value)}
        placeholder={placeholder ?? ''}
        className={className}
        aria-invalid={error ? true : undefined}
      />
    );
  };

  return (
    <div className="relative flex-none rounded-[20px] border border-[#4A90E2] bg-[#EAF4FB]" style={{ width: cardWidth, height: cardHeight }}>
      <h2 className="absolute left-1/2 top-[31px] w-full -translate-x-1/2 text-center text-xl font-semibold leading-none tracking-[1px] text-[#294F7C]">
        {step.title}
      </h2>
      <p className={`absolute left-1/2 -translate-x-1/2 text-center text-sm font-normal text-[#294F7C] ${mobile ? 'top-[63px] w-[338px]' : 'top-[63px] w-[446px]'}`}>
        {step.subtitle}
      </p>

      {step.question ? (
        <>
          <p className={`font-inter absolute left-1/2 -translate-x-1/2 text-center text-sm font-normal text-[#294F7C] ${mobile ? 'top-[129px] w-[338px]' : 'top-[112px] w-[364px]'}`}>
            {step.question}
          </p>
          <div className={`font-inter absolute flex items-center gap-8 text-sm ${mobile ? 'left-1/2 top-[176px] -translate-x-1/2' : 'left-1/2 top-[142px] -translate-x-1/2'}`}>
            <label className="inline-flex items-center gap-2 text-[#294F7C]">
              <span
                onClick={() => setSelectedTaxResident('yes')}
                className="inline-flex size-[15px] cursor-pointer items-center justify-center rounded-full border border-[#294F7C]"
              >
                <span className={`${selectedTaxResident === 'yes' ? 'size-[9px] rounded-full bg-[#4A90E2]' : 'hidden'}`} />
              </span>
              Yes
            </label>
            <label className="inline-flex items-center gap-2 text-[#294F7C]">
              <span
                onClick={() => setSelectedTaxResident('no')}
                className="inline-flex size-[15px] cursor-pointer items-center justify-center rounded-full border border-[#294F7C]"
              >
                <span className={`${selectedTaxResident === 'no' ? 'size-[9px] rounded-full bg-[#4A90E2]' : 'hidden'}`} />
              </span>
              No
            </label>
          </div>
        </>
      ) : null}

      {isPersonalDetailsDesktop ? (
        <>
          <p className="absolute left-6 top-[178px] w-[250px] text-[10px] font-light italic tracking-[0.5px] text-[#FF0000]">Enter name same as on Pan card.</p>
          <p className="absolute left-[326px] top-[178px] w-[250px] text-[10px] font-light italic tracking-[0.5px] text-[#FF0000]">Enter Date of Birth same as on Pan card.</p>

          {[
            { label: 'Name', left: 24, top: 113 },
            { label: 'Date of Birth', left: 326, top: 113 },
            { label: 'Gender', left: 24, top: 197, isSelect: true },
            { label: 'Marital Status', left: 326, top: 197, isSelect: true },
            { label: 'Email', left: 24, top: 281 },
            { label: 'Address Line 1', left: 24, top: 365 },
            { label: 'Address Line 2', left: 326, top: 365 },
            { label: 'City', left: 24, top: 449 },
            { label: 'State', left: 326, top: 449 },
            { label: 'Pincode', left: 24, top: 533 },
            { label: 'Country of Birth', left: 326, top: 533, isSelect: true },
          ].map((item) => (
            <div key={item.label} className="absolute" style={{ left: item.left, top: item.top, width: 250, height: 60 }}>
              <p className="absolute left-[15px] top-0 text-sm font-light italic tracking-[0.7px] text-[#294F7C]">{item.label}</p>
              {renderControl(item.label, 'absolute left-0 top-[19.5px] h-10 w-[250px] rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[15px] py-[9px] text-sm font-normal not-italic text-[#294F7C] outline-none')}
              {(item.isSelect || getSelectOptions(item.label)) ? <span className="pointer-events-none absolute right-[10px] top-[28px] text-[#294F7C]">⌄</span> : null}
            </div>
          ))}

          {step.id === 5 ? (
            <Link
              href={step.nextStepHref || '/onboarding/4'}
              className="absolute left-[326px] top-[301px] block h-10 w-[250px] rounded-[30px] bg-[#294F7C] text-center text-xl font-normal leading-[40px] text-[#F8FAFC]"
            >
              Send OTP
            </Link>
          ) : (
            <>
              <div className="absolute" style={{ left: 326, top: 281, width: 250, height: 60 }}>
                <p className="absolute left-[15px] top-0 text-sm font-light italic tracking-[0.7px] text-[#294F7C]">Enter OTP</p>
                {renderControl('Enter OTP', 'absolute left-0 top-[19.5px] h-10 w-[250px] rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[15px] py-[9px] text-sm font-normal not-italic text-[#294F7C] outline-none')}
              </div>
              <p className="absolute left-[461px] top-[345px] text-[10px] font-extralight text-black">Resend OTP in 30 seconds</p>
            </>
          )}
        </>
      ) : isPersonalDetailsMobile ? (
        <>
          {[
            { label: 'Name', top: 113 },
            { label: 'Date of Birth', top: 197 },
            { label: 'Gender', top: 281, isSelect: true },
            { label: 'Marital Status', top: 365, isSelect: true },
            { label: 'Email', top: 449 },
            { label: 'Address Line 1', top: 617 },
            { label: 'Address Line 2', top: 701 },
            { label: 'City', top: 785 },
            { label: 'State', top: 869 },
            { label: 'Pincode', top: 953 },
            { label: 'Country of Birth', top: 1037, isSelect: true },
          ].map((item) => (
            <div key={item.label} className="absolute left-[56px]" style={{ top: item.top, width: 250, height: 60 }}>
              <p className="absolute left-[15px] top-0 text-sm font-light italic tracking-[0.7px] text-[#294F7C]">{item.label}</p>
              {renderControl(item.label, 'absolute left-0 top-5 h-10 w-[250px] rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[15px] py-[9px] text-sm font-normal not-italic text-[#294F7C] outline-none')}
              {(item.isSelect || getSelectOptions(item.label)) ? <span className="pointer-events-none absolute right-[14px] top-[28px] text-lg leading-none text-[#294F7C]">⌄</span> : null}
            </div>
          ))}

          <Link
            href={step.nextStepHref || '/onboarding/6'}
            className="absolute left-[56px] top-[553px] block h-10 w-[250px] rounded-[30px] bg-[#294F7C] text-center text-[20px] font-normal leading-[40px] text-[#F8FAFC]"
            style={{ fontSize: 20 }}
          >
            Send OTP
          </Link>

          <Link href={step.prevStepHref || '/onboarding/4'} className="absolute left-[31px] top-[1138px] inline-flex items-center gap-[5px] text-[#294F7C]">
            <img src="/assets/onboarding/icons/back-arrow.svg" alt="" className="size-6" />
            <span className="text-[20px] font-medium leading-none">Back</span>
          </Link>
          <Link href={step.nextStepHref || '/onboarding/6'} className="absolute left-[237px] top-[1128px] h-10 w-[100px] rounded-[30px] bg-[#294F7C] text-center text-[20px] font-normal leading-[40px] text-[#F8FAFC]">
            Next
          </Link>
        </>
      ) : isPersonalDetailsMobileOtp ? (
        <>
          {[
            { label: 'Name', top: 113 },
            { label: 'Date of Birth', top: 197 },
            { label: 'Gender', top: 281, isSelect: true },
            { label: 'Marital Status', top: 365, isSelect: true },
            { label: 'Email', top: 449 },
            { label: 'Enter OTP', top: 533 },
            { label: 'Address Line 1', top: 617 },
            { label: 'Address Line 2', top: 701 },
            { label: 'City', top: 785 },
            { label: 'State', top: 869 },
            { label: 'Pincode', top: 953 },
            { label: 'Country of Birth', top: 1037, isSelect: true },
          ].map((item) => (
            <div key={item.label} className="absolute left-[56px]" style={{ top: item.top, width: 250, height: 60 }}>
              <p className="absolute left-[15px] top-0 text-sm font-light italic tracking-[0.7px] text-[#294F7C]">{item.label}</p>
              {renderControl(item.label, 'absolute left-0 top-5 h-10 w-[250px] rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[15px] py-[9px] text-sm font-normal not-italic text-[#294F7C] outline-none')}
              {(item.isSelect || getSelectOptions(item.label)) ? <span className="pointer-events-none absolute right-[14px] top-[28px] text-lg leading-none text-[#294F7C]">⌄</span> : null}
            </div>
          ))}

          <p className="absolute left-[56px] top-[597px] w-[250px] text-right text-[10px] font-extralight text-black">Resend OTP in 30 seconds</p>

          <Link href={step.prevStepHref || '/onboarding/5'} className="absolute left-[31px] top-[1138px] inline-flex items-center gap-[5px] text-[#294F7C]">
            <img src="/assets/onboarding/icons/back-arrow.svg" alt="" className="size-6" />
            <span className="text-[20px] font-medium leading-none">Back</span>
          </Link>
          <Link href={step.nextStepHref || '/onboarding/7'} className="absolute left-[237px] top-[1128px] h-10 w-[100px] rounded-[30px] bg-[#294F7C] text-center text-[20px] font-normal leading-[40px] text-[#F8FAFC]">
            Next
          </Link>
        </>
      ) : isBankDetailsMobile ? (
        <>
          {[
            { label: 'Account Holder Name', top: 113 },
            { label: 'IFSC Code', top: 197 },
            { label: 'Account Number', top: 317 },
            { label: 'Re-enter Account Number', top: 401 },
            { label: 'Type of Account', top: 477, isSelect: true },
            { label: 'Mode of Holding', top: 561, isSelect: true },
          ].map((item) => (
            <div key={item.label} className="absolute left-[60px]" style={{ top: item.top, width: 250, height: 60 }}>
              <p className="absolute left-[15px] top-0 text-sm font-light italic tracking-[0.7px] text-[#294F7C]">{item.label}</p>
              {renderControl(item.label, 'absolute left-0 top-5 h-10 w-[250px] rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[15px] py-[9px] text-sm font-normal not-italic text-[#294F7C] outline-none')}
              {(item.isSelect || getSelectOptions(item.label)) ? <span className="pointer-events-none absolute right-[14px] top-[28px] text-lg leading-none text-[#294F7C]">⌄</span> : null}
            </div>
          ))}

          <p className="absolute left-[59px] top-[261px] w-[250px] text-[10px] font-light italic tracking-[0.5px] text-[#294F7C]">Branch:</p>
          <p className="absolute left-[59px] top-[283px] w-[250px] text-[10px] font-light italic tracking-[0.5px] text-[#294F7C]">Address:</p>

          <Link href={step.prevStepHref || '/onboarding/7'} className="absolute left-[31px] top-[662px] inline-flex items-center gap-[5px] text-[#294F7C]">
            <img src="/assets/onboarding/icons/back-arrow.svg" alt="" className="size-6" />
            <span className="text-[20px] font-medium leading-none">Back</span>
          </Link>
          <Link href={step.nextStepHref || '/onboarding/9'} className="absolute left-[237px] top-[652px] h-10 w-[100px] rounded-[30px] bg-[#294F7C] text-center text-[20px] font-normal leading-[40px] text-[#F8FAFC]">
            Next
          </Link>
        </>
      ) : isNomineeDetailsMobile ? (
        <>
          <p className="font-inter absolute left-0 top-[-33px] w-[126px] text-xs font-normal text-[#294F7C]">
            You can add this later
          </p>
          <button
            type="button"
            className="font-inter absolute left-[170px] top-[-45px] h-10 w-[200px] rounded-[30px] border border-[#294F7C] bg-[#4A90E2] text-base font-semibold text-[#F8FAFC]"
          >
            Skip for now
          </button>

          {[
            { label: 'Nominee’s Mobile Number', top: 113 },
            { label: 'Nominee’s Name', top: 197 },
            { label: 'Relationship with Investor', top: 281, isSelect: true },
            { label: 'Nominee’s Date of Birth', top: 365 },
            { label: 'Nominee’s Pan Number', top: 449 },
            { label: 'Nominee’s Email', top: 533 },
            { label: 'Address Line 1', top: 685 },
            { label: 'Address Line 2', top: 769 },
            { label: 'City', top: 853 },
            { label: 'State', top: 937 },
            { label: 'Pincode', top: 1021 },
          ].map((item) => (
            <div key={item.label} className="absolute left-[56px]" style={{ top: item.top, width: 250, height: 60 }}>
              <p className="absolute left-[15px] top-0 text-sm font-light italic tracking-[0.7px] text-[#294F7C]">{item.label}</p>
              {renderControl(item.label, 'absolute left-0 top-5 h-10 w-[250px] rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[15px] py-[9px] text-sm font-normal not-italic text-[#294F7C] outline-none')}
              {(item.isSelect || getSelectOptions(item.label)) ? <span className="pointer-events-none absolute right-[14px] top-[28px] text-lg leading-none text-[#294F7C]">⌄</span> : null}
            </div>
          ))}

          <p className="absolute left-[87px] top-[617px] text-base font-semibold tracking-[0.8px] text-[#294F7C]">Nominee Address Details</p>
          <label className="absolute left-[240px] top-[658px] inline-flex cursor-pointer items-center gap-3 text-xs font-normal text-[#294F7C]">
            <span
              onClick={() => setSameAsYours((prev) => !prev)}
              className="relative inline-flex size-[15px] items-center justify-center rounded-[2px] border border-[#294F7C]"
            >
              {sameAsYours ? <span className="size-[9px] rounded-[1px] bg-[#294F7C]" /> : null}
            </span>
            Same as yours
          </label>

          <Link href={step.prevStepHref || '/onboarding/8'} className="absolute left-[31px] top-[1122px] inline-flex items-center gap-[5px] text-[#294F7C]">
            <img src="/assets/onboarding/icons/back-arrow.svg" alt="" className="size-6" />
            <span className="text-[20px] font-medium leading-none">Back</span>
          </Link>
          <Link href={step.nextStepHref || '/'} className="absolute left-[188px] top-[1110px] h-10 w-[150px] rounded-[30px] bg-[#294F7C] text-center text-[20px] font-normal leading-[40px] text-[#F8FAFC]">
            Submit
          </Link>
        </>
      ) : isBankDetailsDesktop ? (
        <>
          {[
            { label: 'Account Holder Name', left: 24, top: 113 },
            { label: 'IFSC Code', left: 326, top: 113 },
            { label: 'Account Number', left: 24, top: 233 },
            { label: 'Re-enter Account Number', left: 326, top: 233 },
            { label: 'Type of Account', left: 24, top: 317, isSelect: true },
            { label: 'Mode of Holding', left: 326, top: 317, isSelect: true },
          ].map((item) => (
            <div key={item.label} className="absolute" style={{ left: item.left, top: item.top, width: 250, height: 60 }}>
              <p className="absolute left-[15px] top-0 text-sm font-light italic tracking-[0.7px] text-[#294F7C]">{item.label}</p>
              {renderControl(item.label, 'absolute left-0 top-5 h-10 w-[250px] rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[15px] py-[9px] text-sm font-normal not-italic text-[#294F7C] outline-none')}
              {(item.isSelect || getSelectOptions(item.label)) ? <span className="pointer-events-none absolute right-[14px] top-[28px] text-lg leading-none text-[#294F7C]">⌄</span> : null}
            </div>
          ))}

          <p className="absolute left-[325px] top-[177px] w-[250px] text-[10px] font-light italic tracking-[0.5px] text-[#294F7C]">Branch:</p>
          <p className="absolute left-[325px] top-[199px] w-[250px] text-[10px] font-light italic tracking-[0.5px] text-[#294F7C]">Address:</p>
          <p className="absolute left-[325px] top-[297px] w-[250px] text-[10px] font-light italic tracking-[0.5px] text-[#FF0000]">Account numbers don&apos;t match</p>
        </>
      ) : isNomineeDetailsDesktop ? (
        <>
          <p className="font-inter absolute left-6 top-[-32px] text-xs font-normal text-[#294F7C] whitespace-nowrap">
            You can skip this step for now and add these details later
          </p>
          <button
            type="button"
            className="font-inter absolute left-[376px] top-[-45px] h-10 w-[200px] rounded-[30px] border border-[#294F7C] bg-[#4A90E2] text-base font-semibold text-[#F8FAFC]"
          >
            Skip for now
          </button>

          {[
            { label: 'Nominee’s Mobile Number', left: 24, top: 113 },
            { label: 'Nominee’s Name', left: 326, top: 113 },
            { label: 'Relationship with Investor', left: 24, top: 197, isSelect: true },
            { label: 'Nominee’s Date of Birth', left: 326, top: 197 },
            { label: 'Nominee’s Pan Number', left: 24, top: 281 },
            { label: 'Nominee’s Email', left: 326, top: 281 },
            { label: 'Address Line 1', left: 24, top: 417 },
            { label: 'Address Line 2', left: 326, top: 417 },
            { label: 'City', left: 24, top: 501 },
            { label: 'State', left: 326, top: 501 },
            { label: 'Pincode', left: 24, top: 585 },
          ].map((item) => (
            <div key={item.label} className="absolute" style={{ left: item.left, top: item.top, width: 250, height: 60 }}>
              <p className="absolute left-[15px] top-0 text-sm font-light italic tracking-[0.7px] text-[#294F7C]">{item.label}</p>
              {renderControl(item.label, 'absolute left-0 top-5 h-10 w-[250px] rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[15px] py-[9px] text-sm font-normal not-italic text-[#294F7C] outline-none')}
              {(item.isSelect || getSelectOptions(item.label)) ? <span className="pointer-events-none absolute right-[14px] top-[28px] text-lg leading-none text-[#294F7C]">⌄</span> : null}
            </div>
          ))}

          <p className="absolute left-[23px] top-[371px] text-base font-semibold tracking-[0.8px] text-[#294F7C]">Nominee Address Details</p>
          <label className="absolute left-[463px] top-[371px] inline-flex cursor-pointer items-center gap-3 text-xs font-normal text-[#294F7C]">
            <span
              onClick={() => setSameAsYours((prev) => !prev)}
              className="relative inline-flex size-[15px] items-center justify-center rounded-[2px] border border-[#294F7C]"
            >
              {sameAsYours ? <span className="size-[9px] rounded-[1px] bg-[#294F7C]" /> : null}
            </span>
            Same as yours
          </label>

          <Link href={step.prevStepHref || '/onboarding/8'} className="absolute left-[31px] top-[686px] inline-flex items-center gap-[5px] text-[#294F7C]">
            <img src="/assets/onboarding/icons/back-arrow.svg" alt="" className="size-6" />
            <span className="text-[20px] font-medium leading-none">Back</span>
          </Link>
          <Link href={step.nextStepHref || '/'} className="absolute left-[418px] top-[677px] h-10 w-[150px] rounded-[30px] bg-[#294F7C] text-center text-[20px] font-normal leading-[40px] text-[#F8FAFC]">
            Submit
          </Link>
        </>
      ) : (
        <div className={`absolute left-1/2 flex w-[250px] -translate-x-1/2 flex-col gap-6 ${step.question ? (mobile ? 'top-[217px]' : 'top-[183px]') : 'top-[113px]'}`}>
          {step.fields
            .filter((field) => !field.label.toLowerCase().includes('upload selfie'))
            .map((field) => (
              <StepField
                key={field.label}
                label={field.label}
                value={fieldValues[field.label] ?? ''}
                initialValue={field.value}
                rounded={field.rounded}
                onChange={(value) => handleFieldChange(field.label, value)}
                error={fieldErrors[field.label]}
              />
            ))}
        </div>
      )}

      {step.showSelfieUpload ? (
        <div className={`absolute left-1/2 w-[250px] -translate-x-1/2 rounded-[30px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] py-3 text-center ${mobile ? 'top-[402px]' : 'top-[385px]'}`}>
          <p className="absolute -top-5 left-[15px] text-sm font-extralight italic tracking-[0.7px] text-[#294F7C]">Upload Selfie</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setSelectedFileName(file?.name ?? '');
            }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setSelectedFileName(file?.name ?? '');
            }}
          />
          <img src="/assets/onboarding/icons/camera.svg" alt="" className="mx-auto size-10" />
          <div className="mt-1 text-xs font-normal tracking-[0.6px]">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="font-normal text-[#4A90E2]">
              Choose File
            </button>
            <span className="px-2 text-[#294F7C]">or</span>
            <button type="button" onClick={() => cameraInputRef.current?.click()} className="font-normal text-[#4A90E2]">
              Take Photo
            </button>
          </div>
          <p className="mt-1 text-[10px] font-light italic text-[#294F7C]">Max file size: 5MB</p>
          {selectedFileName ? <p className="mt-1 truncate px-3 text-[10px] text-[#294F7C]">{selectedFileName}</p> : null}
        </div>
      ) : null}

      {step.showSendOtp ? (
        <Link
          href={step.nextStepHref || '/onboarding/4'}
          className={`absolute left-1/2 block h-10 w-[250px] -translate-x-1/2 rounded-[30px] bg-[#294F7C] text-center text-xl font-normal leading-[40px] text-[#F8FAFC] ${mobile ? 'top-[318px]' : 'top-[301px]'}`}
        >
          Send OTP
        </Link>
      ) : null}

      {step.resendText && !(isPersonalDetailsDesktop && step.id === 6) && !isPersonalDetailsMobileOtp ? (
        <p
          className={`absolute left-[310px] top-[355px] text-[10px] font-extralight text-black 
            ${mobile
              ? step.id === 4
                ? 'left-1/2 top-[363px] w-[250px] -translate-x-1/2 text-left'
                : 'left-[56px] top-[363px]'
              : 'left-[175px] top-[345px]'}`}
        >
          {step.resendText}
        </p>
      ) : null}

      {step.id === 7 ? (
        <label
          onClick={() => setAgreedTerms((prev) => !prev)}
          className={`absolute flex cursor-pointer items-center gap-3 pt-1 text-xs font-normal text-[#294F7C] ${mobile ? 'bottom-[96px] left-1/2 w-[250px] -translate-x-1/2' : 'left-[174px] top-[542px]'
            }`}
        >
          <span className="relative inline-flex size-[15px] items-center justify-center rounded-[2px] border border-[#294F7C]">
            {agreedTerms ? <span className="size-[9px] rounded-[1px] bg-[#294F7C]" /> : null}
          </span>
          <span>
            I agree to the{' '}
            <span className="text-[#4A90E2] underline underline-offset-2">Terms & Conditions*</span>
          </span>
        </label>
      ) : null}

      {!isNomineeDetailsDesktop && !isPersonalDetailsMobile && !isPersonalDetailsMobileOtp && !isBankDetailsMobile && !isNomineeDetailsMobile ? (
        <div
          className={`absolute flex items-center justify-between ${useStepOneLayout ? 'left-[31px] right-[33px] top-[316px]' : 'bottom-8 left-8 right-8'
            }`}
        >
          <Link href={step.prevStepHref || '/onboarding/1'} className="inline-flex items-center gap-[5px] text-[#294F7C]">
            <img src="/assets/onboarding/icons/back-arrow.svg" alt="" className="size-6 " />
            <span className="text-[20px] font-medium leading-none">Back</span>
          </Link>

          {step.showSkip ? (
            <button type="button" className="text-base font-normal text-[#294F7C] underline underline-offset-2">
              Skip this step
            </button>
          ) : (
            <Link href={step.nextStepHref || '/'} className="h-10 w-[100px] rounded-[30px] bg-[#294F7C] text-center text-xl font-normal leading-[40px] text-[#F8FAFC]">
              Next
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}

function StepTenPage({ step }: { step: OnboardingStepContent }) {
  const isOtpStep = step.id === 11;
  const mobileFrameRef = useRef<HTMLDivElement>(null);
  const [mobileFrameWidth, setMobileFrameWidth] = useState(402);

  useEffect(() => {
    const element = mobileFrameRef.current;
    if (!element) return;

    const updateWidth = () => setMobileFrameWidth(element.clientWidth || 402);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const mobileScale =
    mobileFrameWidth < 402
      ? mobileFrameWidth / 402
      : mobileFrameWidth >= 768
        ? Math.min(1.45, mobileFrameWidth / 402)
        : 1;
  const mobileBaseHeight = isOtpStep ? 874 : 954;
  const mobileScaledHeight = mobileBaseHeight * mobileScale;

  return (
    <main className="min-h-screen overflow-y-auto overflow-x-hidden bg-white font-urbanist font-normal text-[#294F7C]">
      <div className="hidden min-h-[1024px] w-full min-[1200px]:block">
        <div className="mx-auto flex min-h-[1024px] w-full max-w-[1440px] overflow-hidden bg-white">
          <aside className="relative w-[490px] flex-none bg-[linear-gradient(122.67deg,#F8FAFC_0%,#EAF4FB_100%)]">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-[170px] bg-gradient-to-r from-transparent to-[rgba(207,230,247,0.55)]" />
            {!isOtpStep ? (
              <img
                src="/assets/onboarding/step-10/success-illustration.gif"
                alt=""
                className="absolute left-1/2 top-[193px] size-[440px] -translate-x-1/2 object-contain"
              />
            ) : null}
            <div className="absolute left-[64px] top-[400px] h-[224px] w-[350px] overflow-hidden rounded-[30px] border border-[rgba(255,255,255,0.72)] bg-[rgba(207,230,247,0.2)] text-center shadow-[0_0_0_1px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-12px_22px_rgba(183,210,231,0.16)]">
              <div className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-[rgba(255,255,255,0.24)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_18px_28px_rgba(255,255,255,0.08),inset_-26px_0_30px_rgba(255,255,255,0.14)]" />
              <div className="pointer-events-none absolute left-[18px] right-[18px] top-0 h-px bg-[rgba(255,255,255,0.74)]" />
              <div className="pointer-events-none absolute left-[18px] right-[18px] bottom-0 h-px bg-[rgba(255,255,255,0.28)]" />
              <div className="pointer-events-none absolute inset-y-[12px] left-0 w-px bg-[rgba(255,255,255,0.24)]" />
              <div className="pointer-events-none absolute inset-y-[10px] right-0 w-[2px] rounded-full bg-[rgba(255,255,255,0.98)] shadow-[-2px_0_8px_rgba(255,255,255,0.22)]" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-[126px] bg-gradient-to-l from-[rgba(255,255,255,0.22)] via-[rgba(255,255,255,0.08)] to-transparent" />
              <div className="pointer-events-none absolute left-0 top-0 h-[92px] w-full bg-gradient-to-b from-[rgba(255,255,255,0.1)] to-transparent" />
              <div className="relative z-10">
                <div className="relative mx-auto mt-[24px] size-10">
                  <img src="/assets/onboarding/step-10/success-ring.svg" alt="" className="absolute inset-0 size-10" />
                  <img src="/assets/onboarding/step-10/success-check.svg" alt="" className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-[24px] text-[20px] font-semibold tracking-[1px] text-[#00BA00]">Congratulations!</p>
                <p className="mx-auto mt-[17px] w-[253px] text-base leading-[1.25] tracking-[0.8px] text-[#294F7C]">
                  Your financial journey just got smarter. We&apos;ve built your plan, now let&apos;s grow your wealth step by step
                </p>
              </div>
            </div>
          </aside>

          <section className="relative w-[950px] flex-none bg-[radial-gradient(ellipse_50%_69.47%_at_50%_50%,#F8FAFC_0%,#EAF4FB_100%)] px-[60px] shadow-[4px_4px_250px_190px_rgba(207,230,247,1)]">
            <img src="/assets/logos/wealthup-logo.png" alt="Wealthup" className="absolute left-8 top-8 h-10 w-[126px]" />
            <div className="pt-[100px] text-center">
              <h1 className="text-[20px] font-semibold tracking-[0.2px] text-[#294F7C]">Your journey to wealth just got real.</h1>
              <p className="mt-1 text-sm text-[#294F7C]">Let&apos;s get your money working for you</p>
            </div>

            <div className="mx-auto mt-[40px] flex w-full max-w-[860px] items-start gap-12">
              <div className="w-[428px]">
                <p className="mb-2 pl-[26px] text-base font-semibold tracking-[0.8px] text-[#294F7C]">How much would you like to invest?</p>
                <div className={`relative rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB] p-[30px] ${isOtpStep ? 'h-[532px]' : 'h-[518px]'}`}>
                  <div className="relative flex items-center">
                    <div className="relative mr-[14px] size-[50px]">
                      <img src="/assets/onboarding/step-10/fund-logo-bg.svg" alt="" className="absolute inset-0 size-[50px]" />
                      <img src="/assets/onboarding/step-10/axis-bank-logo.png" alt="Axis Bank" className="absolute left-[9px] top-[9px] size-8 object-contain" />
                    </div>
                    <div>
                      <p className="text-base font-semibold tracking-[0.8px] text-[#294F7C]">
                        Axis Bluechip Fund <span className="font-normal">- Direct</span>
                      </p>
                      <p className="text-sm tracking-[0.7px] text-[#294F7C]">Plan - Growth</p>
                    </div>
                    <button type="button" className="ml-auto text-[10px] tracking-[0.5px] text-[#294F7C]">
                      Change Fund
                    </button>
                  </div>

                  <div className="mt-[25px] h-10 rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[20px]">
                    <input
                      type="text"
                      placeholder="Enter amount"
                      className="h-full w-full bg-transparent text-sm italic text-[#294F7C] outline-none placeholder:text-[#294F7C]"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-[14px]">
                    {['₹ 500', '₹ 1000', '₹ 2500', '₹ 5000'].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className={`h-[30px] w-20 rounded-[20px] text-base shadow-[0px_0px_5px_0px_#4A90E2] ${amount === '₹ 1000' ? 'bg-[#4A90E2] text-[#F8FAFC]' : 'bg-[rgba(248,250,252,0.1)] text-[#294F7C]'
                          }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>

                  <p className="mt-[26px] text-sm font-light text-black">Investment Type</p>
                  <label className="mt-[6px] inline-flex items-center gap-2 text-sm text-[#294F7C]">
                    <span className="relative inline-flex size-[15px] items-center justify-center">
                      <img src="/assets/onboarding/step-10/radio-outer.svg" alt="" className="absolute inset-0 size-[15px]" />
                      <img src="/assets/onboarding/step-10/radio-inner.svg" alt="" className="absolute left-[3px] top-[3px] size-[9px]" />
                    </span>
                    One Time (Lump sum)
                  </label>

                  <p className="mt-[22px] text-sm font-light text-black">Link this to a goal</p>
                  <button
                    type="button"
                    className="mt-[9px] flex h-10 w-full items-center rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[18px] text-base font-medium text-[#294F7C]"
                  >
                    Emergency Fund
                    <span className="ml-auto inline-flex size-[10px] items-center justify-center rotate-90">
                      <img src="/assets/onboarding/step-10/chevron.svg" alt="" className="size-full opacity-75" />
                    </span>
                  </button>

                  {isOtpStep ? (
                    <>
                      <div className="mt-[31px] h-10 w-full rounded-[20px] border border-[#4A90E2] bg-[rgba(255,255,255,0.4)]">
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          className="h-full w-full bg-transparent px-[19px] text-sm italic text-[rgba(94,94,94,0.9)] outline-none placeholder:text-[rgba(94,94,94,0.9)]"
                        />
                      </div>
                      <p className="mt-[3px] text-right text-[10px] font-extralight text-black">Resend OTP in 30 seconds</p>
                    </>
                  ) : (
                    <Link
                      href={step.nextStepHref || '/'}
                      className="mx-auto mt-[30px] flex h-10 w-[250px] items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white"
                    >
                      Verify with OTP
                      <img src="/assets/onboarding/step-10/arrow-right.svg" alt="" className="ml-4 size-4" />
                    </Link>
                  )}

                  <div className={`absolute left-[30px] inline-flex items-center gap-[5px] ${isOtpStep ? 'bottom-[9px]' : 'bottom-[21px]'}`}>
                    <img src="/assets/onboarding/step-10/info-icon.svg" alt="" className="size-[15px]" />
                    <p className="text-xs italic text-[#294F7C]">This is not the final step</p>
                  </div>
                </div>
              </div>

              <div className="w-[342px] pt-[2px]">
                <p className="mb-2 text-base font-semibold tracking-[0.8px] text-[#294F7C]">Select Fund</p>
                <div className="h-10 rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-5 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)]">
                  <input
                    type="text"
                    placeholder="Enter name of fund"
                    className="h-full w-full bg-transparent text-sm italic text-[#294F7C] outline-none placeholder:text-[#294F7C]"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="hidden min-h-screen w-full overflow-x-hidden bg-[linear-gradient(153.34deg,#EAF4FB_0%,#F8FAFC_100%)] min-[768px]:block min-[1200px]:hidden">
        <div className="mx-auto min-h-screen w-full max-w-[1180px] px-8 py-8 min-[1024px]:px-10 min-[1024px]:py-10">
          <img src="/assets/logos/wealthup-logo.png" alt="Wealthup" className="h-10 w-[126px]" />

          <div className="mt-8 grid gap-10 min-[1024px]:mt-10 min-[1120px]:grid-cols-[300px_minmax(0,1fr)] min-[1180px]:grid-cols-[334px_minmax(0,1fr)] min-[1180px]:gap-12">
            <aside className="relative hidden min-[1120px]:block">
              <div className="pointer-events-none absolute right-0 top-0 h-full w-[96px] bg-gradient-to-r from-transparent to-[rgba(207,230,247,0.45)]" />
              {!isOtpStep ? (
                <img
                  src="/assets/onboarding/step-10/success-illustration.gif"
                  alt=""
                  className="pointer-events-none mx-auto mt-10 size-[280px] object-contain"
                />
              ) : (
                <div className="h-[240px]" />
              )}
              <div className={`relative z-10 mx-auto w-full max-w-[320px] overflow-hidden rounded-[30px] border border-[rgba(255,255,255,0.72)] bg-[rgba(207,230,247,0.2)] text-center shadow-[0_0_0_1px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-12px_22px_rgba(183,210,231,0.16)] ${isOtpStep ? 'mt-8' : '-mt-4'}`}>
                <div className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-[rgba(255,255,255,0.24)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_18px_28px_rgba(255,255,255,0.08),inset_-26px_0_30px_rgba(255,255,255,0.14)]" />
                <div className="pointer-events-none absolute left-[18px] right-[18px] top-0 h-px bg-[rgba(255,255,255,0.74)]" />
                <div className="pointer-events-none absolute left-[18px] right-[18px] bottom-0 h-px bg-[rgba(255,255,255,0.28)]" />
                <div className="pointer-events-none absolute inset-y-[12px] left-0 w-px bg-[rgba(255,255,255,0.24)]" />
                <div className="pointer-events-none absolute inset-y-[10px] right-0 w-[2px] rounded-full bg-[rgba(255,255,255,0.98)] shadow-[-2px_0_8px_rgba(255,255,255,0.22)]" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-[126px] bg-gradient-to-l from-[rgba(255,255,255,0.22)] via-[rgba(255,255,255,0.08)] to-transparent" />
                <div className="pointer-events-none absolute left-0 top-0 h-[92px] w-full bg-gradient-to-b from-[rgba(255,255,255,0.1)] to-transparent" />
                <div className="relative z-10 px-8 py-6">
                  <div className="relative mx-auto size-10">
                    <img src="/assets/onboarding/step-10/success-ring.svg" alt="" className="absolute inset-0 size-10" />
                    <img src="/assets/onboarding/step-10/success-check.svg" alt="" className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="mt-6 text-[20px] font-semibold tracking-[1px] text-[#00BA00]">Congratulations!</p>
                  <p className="mx-auto mt-4 max-w-[253px] text-base leading-[1.25] tracking-[0.8px] text-[#294F7C]">
                    Your financial journey just got smarter. We&apos;ve built your plan, now let&apos;s grow your wealth step by step
                  </p>
                </div>
              </div>
            </aside>

            <section className="bg-[radial-gradient(ellipse_50%_69.47%_at_50%_50%,#F8FAFC_0%,#EAF4FB_100%)] min-[1120px]:min-h-[760px] min-[1120px]:px-2">
              {!isOtpStep ? (
                <div className="mb-8 block min-[1120px]:hidden">
                  <img
                    src="/assets/onboarding/step-10/success-illustration.gif"
                    alt=""
                    className="pointer-events-none mx-auto h-[170px] w-[170px] object-contain"
                  />
                  <div className="relative mx-auto -mt-2 w-full max-w-[540px] overflow-hidden rounded-[30px] border border-[rgba(255,255,255,0.72)] bg-[rgba(207,230,247,0.2)] shadow-[0_0_0_1px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.5)]">
                    <div className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-[rgba(255,255,255,0.24)]" />
                    <div className="relative flex items-center justify-center gap-5 px-6 py-6">
                      <div className="relative size-10 flex-none">
                        <img src="/assets/onboarding/step-10/success-ring.svg" alt="" className="absolute inset-0 size-10" />
                        <img src="/assets/onboarding/step-10/success-check.svg" alt="" className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="text-left">
                        <p className="text-[20px] font-semibold tracking-[1px] text-[#00BA00]">Congratulations!</p>
                        <p className="mt-2 max-w-[330px] text-[15px] leading-[1.24] tracking-[0.7px] text-[#294F7C]">
                          Your financial journey just got smarter. We&apos;ve built your plan, now let&apos;s grow your wealth step by step
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mx-auto max-w-[760px] text-center min-[1120px]:pt-12">
                <h1 className="text-[24px] font-semibold leading-[1.15] tracking-[0.2px] text-[#294F7C] min-[900px]:text-[28px] min-[1120px]:text-[30px]">
                  Your journey to wealth just got real.
                </h1>
                <p className="mt-2 text-sm text-[#294F7C] min-[900px]:text-[15px]">Let&apos;s get your money working for you</p>
              </div>

              <div className="mx-auto mt-8 max-w-[820px] min-[1120px]:mt-10">
                <div className="grid gap-8 min-[1120px]:grid-cols-[428px_342px] min-[1120px]:items-start min-[1120px]:justify-center">
                  <div className="order-2 mx-auto w-full max-w-[428px] min-[1120px]:order-1">
                    <p className="mb-2 pl-[18px] text-base font-semibold tracking-[0.8px] text-[#294F7C]">How much would you like to invest?</p>
                    <div className={`relative rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB] p-[30px] ${isOtpStep ? 'h-[532px]' : 'h-[518px]'}`}>
                      <div className="relative flex items-center">
                        <div className="relative mr-[14px] size-[50px]">
                          <img src="/assets/onboarding/step-10/fund-logo-bg.svg" alt="" className="absolute inset-0 size-[50px]" />
                          <img src="/assets/onboarding/step-10/axis-bank-logo.png" alt="Axis Bank" className="absolute left-[9px] top-[9px] size-8 object-contain" />
                        </div>
                        <div>
                          <p className="text-base font-semibold tracking-[0.8px] text-[#294F7C]">
                            Axis Bluechip Fund <span className="font-normal">- Direct</span>
                          </p>
                          <p className="text-sm tracking-[0.7px] text-[#294F7C]">Plan - Growth</p>
                        </div>
                        <button type="button" className="ml-auto text-[10px] tracking-[0.5px] text-[#294F7C]">
                          Change Fund
                        </button>
                      </div>

                      <div className="mt-[25px] h-10 rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[20px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)]">
                        <input
                          type="text"
                          placeholder="Enter amount"
                          className="h-full w-full bg-transparent text-sm italic text-[#294F7C] outline-none placeholder:text-[#294F7C]"
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-[14px]">
                        {['₹ 500', '₹ 1000', '₹ 2500', '₹ 5000'].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            className={`h-[30px] w-20 rounded-[20px] text-base shadow-[0px_0px_5px_0px_#4A90E2] ${amount === '₹ 1000' ? 'bg-[#4A90E2] text-[#F8FAFC]' : 'bg-[rgba(248,250,252,0.1)] text-[#294F7C]'
                              }`}
                          >
                            {amount}
                          </button>
                        ))}
                      </div>

                      <p className="mt-[26px] text-sm font-light text-black">Investment Type</p>
                      <label className="mt-[6px] inline-flex items-center gap-2 text-sm text-[#294F7C]">
                        <span className="relative inline-flex size-[15px] items-center justify-center">
                          <img src="/assets/onboarding/step-10/radio-outer.svg" alt="" className="absolute inset-0 size-[15px]" />
                          <img src="/assets/onboarding/step-10/radio-inner.svg" alt="" className="absolute left-[3px] top-[3px] size-[9px]" />
                        </span>
                        One Time (Lump sum)
                      </label>

                      <p className="mt-[22px] text-sm font-light text-black">Link this to a goal</p>
                      <button
                        type="button"
                        className="mt-[9px] flex h-10 w-full items-center rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[18px] text-base font-medium text-[#294F7C]"
                      >
                        Emergency Fund
                        <span className="ml-auto inline-flex size-[10px] items-center justify-center rotate-90">
                          <img src="/assets/onboarding/step-10/chevron.svg" alt="" className="size-full opacity-75" />
                        </span>
                      </button>

                      {isOtpStep ? (
                        <>
                          <div className="mt-[31px] h-10 w-full rounded-[20px] border border-[#4A90E2] bg-[rgba(255,255,255,0.4)]">
                            <input
                              type="text"
                              placeholder="Enter OTP"
                              className="h-full w-full bg-transparent px-[19px] text-sm italic text-[rgba(94,94,94,0.9)] outline-none placeholder:text-[rgba(94,94,94,0.9)]"
                            />
                          </div>
                          <p className="mt-[3px] text-right text-[10px] font-extralight text-black">Resend OTP in 30 seconds</p>
                        </>
                      ) : (
                        <Link
                          href={step.nextStepHref || '/'}
                          className="mx-auto mt-[30px] flex h-10 w-[250px] items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white"
                        >
                          Verify with OTP
                          <img src="/assets/onboarding/step-10/arrow-right.svg" alt="" className="ml-4 size-4" />
                        </Link>
                      )}

                      <div className={`absolute left-[30px] inline-flex items-center gap-[5px] ${isOtpStep ? 'bottom-[9px]' : 'bottom-[21px]'}`}>
                        <img src="/assets/onboarding/step-10/info-icon.svg" alt="" className="size-[15px]" />
                        <p className="text-xs italic text-[#294F7C]">This is not the final step</p>
                      </div>
                    </div>
                  </div>

                  <div className="order-1 mx-auto w-full max-w-[342px] min-[1120px]:order-2 min-[1120px]:pt-[2px]">
                    <p className="mb-2 text-base font-semibold tracking-[0.8px] text-[#294F7C]">Select Fund</p>
                    <div className="h-10 rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-5 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)]">
                      <input
                        type="text"
                        placeholder="Enter name of fund"
                        className="h-full w-full bg-transparent text-sm italic text-[#294F7C] outline-none placeholder:text-[#294F7C]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="min-h-screen w-full bg-[linear-gradient(153.34deg,#EAF4FB_0%,#F8FAFC_100%)] px-4 py-4 min-[768px]:hidden sm:px-5 sm:py-5 md:px-6 md:py-8">
        <div ref={mobileFrameRef} className="mx-auto w-full max-w-[583px]">
          <div className="mx-auto" style={{ width: 402 * mobileScale, height: mobileScaledHeight }}>
            <div
              className="relative overflow-hidden bg-[linear-gradient(153.34deg,#EAF4FB_0%,#F8FAFC_100%)]"
              style={{ width: 402, height: mobileBaseHeight, transform: `scale(${mobileScale})`, transformOrigin: 'top left' }}
            >
              <img src="/assets/logos/wealthup-logo.png" alt="Wealthup" className="absolute left-4 top-4 h-10 w-[126px]" />

              {!isOtpStep ? (
                <>
                  <img
                    src="/assets/onboarding/step-10/mobile/success-illustration.gif"
                    alt=""
                    className="absolute left-[91px] top-[-8px] size-[221px] object-contain"
                  />

                  <div className="absolute left-[26px] top-[88px] h-[88px] w-[350px] overflow-hidden rounded-[30px] border border-[rgba(255,255,255,0.4)] bg-[rgba(207,230,247,0.2)]">
                    <div className="absolute left-[59px] top-6 size-10">
                      <img src="/assets/onboarding/step-10/mobile/success-ring.svg" alt="" className="size-10" />
                    </div>
                    <div className="absolute left-[69px] top-[34px] size-5">
                      <img src="/assets/onboarding/step-10/mobile/success-check.svg" alt="" className="size-5" />
                    </div>
                    <p className="absolute left-[129px] top-8 text-[20px] font-semibold tracking-[1px] text-[#00BA00]">Congratulations!</p>
                  </div>
                </>
              ) : null}

              <h1 className={`absolute left-4 w-[370px] text-center text-[32px] font-bold leading-[1.1875] text-[#294F7C] ${isOtpStep ? 'top-[88px]' : 'top-[208px]'}`}>
                Your Journey to Wealth just got real
              </h1>
              <p className={`absolute left-[89px] text-sm text-[#294F7C] ${isOtpStep ? 'top-[172px]' : 'top-[292px]'}`}>Let&apos;s get your money working for you</p>

              <p className={`absolute left-[60px] w-[282px] text-center text-base font-semibold tracking-[0.8px] text-[#294F7C] ${isOtpStep ? 'top-[221px]' : 'top-[341px]'}`}>
                How much would you like to invest?
              </p>

              <div className={`absolute left-4 h-[518px] w-[370px] rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB] ${isOtpStep ? 'top-[252px]' : 'top-[372px]'}`}>
                <div className="absolute left-6 top-8 size-[50px]">
                  <img src="/assets/onboarding/step-10/mobile/fund-logo-bg.svg" alt="" className="size-[50px]" />
                </div>
                <div className="absolute left-[33px] top-[41px] size-8">
                  <img src="/assets/onboarding/step-10/mobile/axis-bank-logo.png" alt="Axis Bank" className="size-8 object-contain" />
                </div>
                <p className="absolute left-[86px] top-9 text-base font-semibold tracking-[0.8px] text-[#294F7C]">
                  Axis Bluechip Fund <span className="font-normal">- Direct</span>
                </p>
                <p className="absolute left-[86px] top-[60px] text-sm tracking-[0.7px] text-[#294F7C]">Plan - Growth</p>
                <p className="absolute left-[283px] top-[65px] text-[10px] font-extralight tracking-[0.5px] text-[#294F7C]">Change Fund</p>

                <div className="absolute left-6 top-[114px] h-10 w-[322px] rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)]">
                  <input
                    type="text"
                    placeholder="Enter amount"
                    className="h-full w-full bg-transparent px-[19.5px] text-sm italic text-[#294F7C] outline-none placeholder:text-[#294F7C]"
                  />
                </div>

                <div className="absolute left-6 top-[178px] flex gap-10">
                  {[
                    { label: '₹ 500', selected: false },
                    { label: '₹ 1000', selected: true },
                    { label: '₹ 2500', selected: false },
                  ].map((amount) => (
                    <button
                      key={amount.label}
                      type="button"
                      className={`h-[30px] w-20 rounded-[20px] text-base shadow-[0px_0px_5px_0px_#4A90E2] ${amount.selected ? 'bg-[#4A90E2] text-[#F8FAFC]' : 'bg-[rgba(248,250,252,0.1)] text-[#294F7C]'
                        }`}
                    >
                      {amount.label}
                    </button>
                  ))}
                </div>

                <p className="absolute left-6 top-60 text-sm font-light text-black">Investment Type</p>
                <label className="absolute left-6 top-[269px] inline-flex items-center gap-[10px] text-sm text-[#294F7C]">
                  <span className="relative inline-flex size-[15px] items-center justify-center">
                    <img src="/assets/onboarding/step-10/mobile/radio-outer.svg" alt="" className="absolute inset-0 size-[15px]" />
                    <img src="/assets/onboarding/step-10/mobile/radio-inner.svg" alt="" className="absolute left-[3px] top-[3px] size-[9px]" />
                  </span>
                  One Time (Lump sum)
                </label>

                <p className="absolute left-6 top-[318px] text-sm font-light text-black">Link this to a goal</p>
                <button
                  type="button"
                  className="absolute left-6 top-[347px] flex h-10 w-[322px] items-center rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-6 text-base font-medium text-[#294F7C]"
                >
                  Emergency Fund
                  <span className="ml-auto inline-flex size-[10px] items-center justify-center rotate-90">
                    <img src="/assets/onboarding/step-10/mobile/chevron.svg" alt="" className="size-full opacity-75" />
                  </span>
                </button>

                {isOtpStep ? (
                  <>
                    <div className="absolute left-6 top-[419px] h-10 w-[322px] rounded-[20px] border border-[#4A90E2] bg-[rgba(255,255,255,0.4)]">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        className="h-full w-full bg-transparent px-[19px] text-sm italic text-[rgba(94,94,94,0.9)] outline-none placeholder:text-[rgba(94,94,94,0.9)]"
                      />
                    </div>
                    <p className="absolute left-[232px] top-[461px] text-[10px] font-extralight text-black">Resend OTP in 30 seconds</p>
                  </>
                ) : (
                  <Link
                    href={step.nextStepHref || '/'}
                    className="absolute left-[60px] top-[419px] flex h-10 w-[250px] items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white"
                  >
                    Verify with OTP
                    <img src="/assets/onboarding/step-10/mobile/arrow-right.svg" alt="" className="ml-4 size-4" />
                  </Link>
                )}

                <div className="absolute left-6 top-[491px] inline-flex items-center gap-[5px]">
                  <img src="/assets/onboarding/step-10/mobile/info-icon.svg" alt="" className="size-[15px]" />
                  <p className="text-xs italic text-[#294F7C]">This is not the final step</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StepTwelvePage({ step }: { step: OnboardingStepContent }) {
  const mobileFrameRef = useRef<HTMLDivElement>(null);
  const [mobileFrameWidth, setMobileFrameWidth] = useState(402);

  useEffect(() => {
    const element = mobileFrameRef.current;
    if (!element) return;

    const updateWidth = () => setMobileFrameWidth(element.clientWidth || 402);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const mobileScale =
    mobileFrameWidth < 402
      ? mobileFrameWidth / 402
      : mobileFrameWidth >= 768
        ? Math.min(1.45, mobileFrameWidth / 402)
        : 1;
  const mobileBaseHeight = 874;
  const mobileScaledHeight = mobileBaseHeight * mobileScale;

  return (
    <main className="min-h-screen overflow-y-auto overflow-x-hidden bg-white font-urbanist font-normal text-[#294F7C]">
      <div className="hidden min-h-[1024px] w-full min-[1200px]:block">
        <div className="mx-auto flex min-h-[1024px] w-full max-w-[1440px] overflow-hidden bg-white">
          <aside className="relative w-[490px] flex-none bg-[linear-gradient(122.67deg,#F8FAFC_0%,#EAF4FB_100%)]">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-[170px] bg-gradient-to-r from-transparent to-[rgba(207,230,247,0.55)]" />
            <div className="absolute left-[44px] top-[400px] h-[224px] w-[350px] overflow-hidden rounded-[30px] border border-[rgba(255,255,255,0.72)] bg-[rgba(207,230,247,0.2)] text-center shadow-[0_0_0_1px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-12px_22px_rgba(183,210,231,0.16)]">
              <div className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-[rgba(255,255,255,0.24)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_18px_28px_rgba(255,255,255,0.08),inset_-26px_0_30px_rgba(255,255,255,0.14)]" />
              <div className="pointer-events-none absolute left-[18px] right-[18px] top-0 h-px bg-[rgba(255,255,255,0.74)]" />
              <div className="pointer-events-none absolute left-[18px] right-[18px] bottom-0 h-px bg-[rgba(255,255,255,0.28)]" />
              <div className="pointer-events-none absolute inset-y-[12px] left-0 w-px bg-[rgba(255,255,255,0.24)]" />
              <div className="pointer-events-none absolute inset-y-[10px] right-0 w-[2px] rounded-full bg-[rgba(255,255,255,0.98)] shadow-[-2px_0_8px_rgba(255,255,255,0.22)]" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-[126px] bg-gradient-to-l from-[rgba(255,255,255,0.22)] via-[rgba(255,255,255,0.08)] to-transparent" />
              <div className="pointer-events-none absolute left-0 top-0 h-[92px] w-full bg-gradient-to-b from-[rgba(255,255,255,0.1)] to-transparent" />
              <div className="relative z-10">
                <div className="relative mx-auto mt-[24px] size-10">
                  <img src="/assets/onboarding/step-12/desktop/success-ring.svg" alt="" className="size-10" />
                </div>
                <p className="mt-[24px] text-[20px] font-semibold tracking-[1px] text-[#00BA00]">Congratulations!</p>
                <p className="mx-auto mt-[17px] w-[253px] text-base leading-[1.25] tracking-[0.8px] text-[#294F7C]">
                  Your financial journey just got smarter. We&apos;ve built your plan, now let&apos;s grow your wealth step by step
                </p>
              </div>
            </div>
          </aside>

          <section className="relative w-[950px] flex-none bg-[radial-gradient(ellipse_50%_69.47%_at_50%_50%,#F8FAFC_0%,#EAF4FB_100%)] px-[60px] shadow-[4px_4px_250px_190px_rgba(207,230,247,1)]">
            <img src="/assets/logos/wealthup-logo.png" alt="Wealthup" className="absolute left-8 top-8 h-10 w-[126px]" />
            <p className="absolute left-1/2 top-[100px] -translate-x-1/2 text-[20px] font-semibold text-[#294F7C]">Your journey to wealth just got real.</p>
            <p className="absolute left-1/2 top-[132px] -translate-x-1/2 text-sm text-[#294F7C]">Let&apos;s get your money working for you</p>

            <p className="absolute left-1/2 top-[181px] -translate-x-1/2 text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">Investment Summary</p>
            <div className="absolute left-[261px] top-[212px] h-[139px] w-[428px] rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB] text-sm text-[#294F7C]">
              <p className="absolute left-[31px] top-[31px] font-light text-black">Investment amount:</p>
              <p className="absolute left-[31px] top-[60px] font-light text-black">Fund:</p>
              <p className="absolute left-[31px] top-[89px] font-light text-black">Investment Type:</p>
              <p className="absolute right-[31px] top-[31px] font-semibold">₹ 1000</p>
              <p className="absolute right-[31px] top-[60px] font-semibold">Axis Bluechip Fund</p>
              <p className="absolute right-[31px] top-[89px] font-semibold">One Time (Lump sum)</p>
            </div>

            <p className="absolute left-1/2 top-[383px] -translate-x-1/2 text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">Select Payment Method</p>
            <div className="absolute left-[261px] top-[414px] h-[336px] w-[428px] rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB]">
              <label className="absolute left-[32px] top-[32px] inline-flex items-center gap-[10px] text-sm text-[#294F7C]">
                <span className="relative inline-flex size-[15px] items-center justify-center">
                  <img src="/assets/onboarding/step-10/radio-outer.svg" alt="" className="absolute inset-0 size-[15px]" />
                  <img src="/assets/onboarding/step-10/radio-inner.svg" alt="" className="absolute left-[3px] top-[3px] size-[9px]" />
                </span>
                UPI
              </label>
              <label className="absolute left-[142px] top-[32px] inline-flex items-center gap-[10px] text-sm text-[#294F7C]">
                <span className="inline-flex size-[15px] rounded-full border border-[#294F7C]" />
                Internet Banking
              </label>

              <p className="absolute left-[32px] top-[81px] text-sm font-light text-black">Bank:</p>
              <div className="absolute left-[32px] top-[110px] h-[60px] w-[150px] rounded-[10px] border border-[#4A90E2] bg-[#CFE6F7]">
                <img src="/assets/onboarding/step-12/desktop/hdfc-bank-logo.png" alt="HDFC Bank" className="absolute left-5 top-[15px] size-[29px] object-contain" />
                <p className="absolute left-[59px] top-[10px] text-sm font-semibold leading-[1.1] text-[#294F7C]">HDFC Bank</p>
                <p className="absolute left-[59px] top-[31px] text-sm font-semibold leading-[1.1] text-[#294F7C]">12341234</p>
              </div>

              <span className="absolute left-[31px] top-[202px] inline-flex size-[15px] rounded-[2px] border border-[#294F7C]" />
              <p className="absolute left-[58px] top-[201px] w-[337px] text-xs leading-[1.25] text-[#294F7C]">
                You will need to add your UPI ID from from HDFC Bank on the next page to proceed.
              </p>

              <Link
                href={step.nextStepHref || '/'}
                className="absolute left-[90px] top-[263px] flex h-10 w-[250px] items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white"
              >
                Confirm
                <img src="/assets/onboarding/step-12/desktop/arrow-right.svg" alt="" className="ml-4 size-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <div className="hidden min-h-screen w-full overflow-x-hidden bg-[linear-gradient(155.3deg,#EAF4FB_0%,#F8FAFC_100%)] min-[640px]:block min-[1200px]:hidden">
        <div className="mx-auto min-h-screen w-full max-w-[1180px] px-8 py-8 min-[1024px]:px-10 min-[1024px]:py-10">
          <img src="/assets/logos/wealthup-logo.png" alt="Wealthup" className="h-10 w-[126px]" />

          <div className="mt-8 grid gap-10 min-[1024px]:mt-10 min-[1120px]:grid-cols-[300px_minmax(0,1fr)] min-[1180px]:grid-cols-[334px_minmax(0,1fr)] min-[1180px]:gap-12">
            <aside className="relative hidden min-[1120px]:block">
              <div className="pointer-events-none absolute right-0 top-0 h-full w-[96px] bg-gradient-to-r from-transparent to-[rgba(207,230,247,0.45)]" />
              <div className="mx-auto mt-[260px] w-full max-w-[320px] overflow-hidden rounded-[30px] border border-[rgba(255,255,255,0.72)] bg-[rgba(207,230,247,0.2)] text-center shadow-[0_0_0_1px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-12px_22px_rgba(183,210,231,0.16)]">
                <div className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-[rgba(255,255,255,0.24)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_18px_28px_rgba(255,255,255,0.08),inset_-26px_0_30px_rgba(255,255,255,0.14)]" />
                <div className="pointer-events-none absolute left-[18px] right-[18px] top-0 h-px bg-[rgba(255,255,255,0.74)]" />
                <div className="pointer-events-none absolute left-[18px] right-[18px] bottom-0 h-px bg-[rgba(255,255,255,0.28)]" />
                <div className="pointer-events-none absolute inset-y-[12px] left-0 w-px bg-[rgba(255,255,255,0.24)]" />
                <div className="pointer-events-none absolute inset-y-[10px] right-0 w-[2px] rounded-full bg-[rgba(255,255,255,0.98)] shadow-[-2px_0_8px_rgba(255,255,255,0.22)]" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-[126px] bg-gradient-to-l from-[rgba(255,255,255,0.22)] via-[rgba(255,255,255,0.08)] to-transparent" />
                <div className="pointer-events-none absolute left-0 top-0 h-[92px] w-full bg-gradient-to-b from-[rgba(255,255,255,0.1)] to-transparent" />
                <div className="relative z-10 px-8 py-6">
                  <div className="relative mx-auto size-10">
                    <img src="/assets/onboarding/step-12/desktop/success-ring.svg" alt="" className="size-10" />
                  </div>
                  <p className="mt-6 text-[20px] font-semibold tracking-[1px] text-[#00BA00]">Congratulations!</p>
                  <p className="mx-auto mt-4 max-w-[253px] text-base leading-[1.25] tracking-[0.8px] text-[#294F7C]">
                    Your financial journey just got smarter. We&apos;ve built your plan, now let&apos;s grow your wealth step by step
                  </p>
                </div>
              </div>
            </aside>

            <section className="bg-[radial-gradient(ellipse_50%_69.47%_at_50%_50%,#F8FAFC_0%,#EAF4FB_100%)] min-[1120px]:min-h-[760px] min-[1120px]:px-2">
              <div className="mb-8 block min-[1120px]:hidden">
                <div className="relative mx-auto w-full max-w-[540px] overflow-hidden rounded-[30px] border border-[rgba(255,255,255,0.72)] bg-[rgba(207,230,247,0.2)] shadow-[0_0_0_1px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.5)]">
                  <div className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-[rgba(255,255,255,0.24)]" />
                  <div className="relative flex items-center justify-center gap-5 px-6 py-6">
                    <div className="relative size-10 flex-none">
                      <img src="/assets/onboarding/step-12/desktop/success-ring.svg" alt="" className="absolute inset-0 size-10" />
                    </div>
                    <div className="text-left">
                      <p className="text-[20px] font-semibold tracking-[1px] text-[#00BA00]">Congratulations!</p>
                      <p className="mt-2 max-w-[330px] text-[15px] leading-[1.24] tracking-[0.7px] text-[#294F7C]">
                        Your financial journey just got smarter. We&apos;ve built your plan, now let&apos;s grow your wealth step by step
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto max-w-[760px] text-center min-[1120px]:pt-12">
                <h1 className="text-[24px] font-semibold leading-[1.15] tracking-[0.2px] text-[#294F7C] min-[900px]:text-[28px] min-[1120px]:text-[30px]">
                  Your journey to wealth just got real.
                </h1>
                <p className="mt-2 text-sm text-[#294F7C] min-[900px]:text-[15px]">Let&apos;s get your money working for you</p>
              </div>

              <div className="mx-auto mt-8 flex max-w-[520px] flex-col gap-8 min-[1120px]:mt-10 min-[1120px]:max-w-[428px]">
                <div>
                  <p className="mb-2 text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">Investment Summary</p>
                  <div className="rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB] px-[31px] py-[28px] text-sm text-[#294F7C]">
                    <div className="grid grid-cols-[1fr_auto] gap-y-3">
                      <p className="font-light text-black">Investment amount:</p>
                      <p className="font-semibold">₹ 1000</p>
                      <p className="font-light text-black">Fund:</p>
                      <p className="font-semibold">Axis Bluechip Fund</p>
                      <p className="font-light text-black">Investment Type:</p>
                      <p className="font-semibold">One Time (Lump sum)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">Select Payment Method</p>
                  <div className="rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB] px-8 py-8">
                    <div className="flex flex-wrap gap-8 text-sm text-[#294F7C]">
                      <label className="inline-flex items-center gap-[10px]">
                        <span className="relative inline-flex size-[15px] items-center justify-center">
                          <img src="/assets/onboarding/step-10/radio-outer.svg" alt="" className="absolute inset-0 size-[15px]" />
                          <img src="/assets/onboarding/step-10/radio-inner.svg" alt="" className="absolute left-[3px] top-[3px] size-[9px]" />
                        </span>
                        UPI
                      </label>
                      <label className="inline-flex items-center gap-[10px]">
                        <span className="inline-flex size-[15px] rounded-full border border-[#294F7C]" />
                        Internet Banking
                      </label>
                    </div>

                    <p className="mt-8 text-sm font-light text-black">Bank:</p>
                    <div className="relative mt-[13px] h-[60px] w-[150px] rounded-[10px] border border-[#4A90E2] bg-[#CFE6F7]">
                      <img src="/assets/onboarding/step-12/desktop/hdfc-bank-logo.png" alt="HDFC Bank" className="absolute ml-5 mt-[15px] size-[29px] object-contain" />
                      <p className="ml-[59px] mt-[10px] text-sm font-semibold leading-[1.1] text-[#294F7C]">HDFC Bank</p>
                      <p className="ml-[59px] mt-[3px] text-sm font-semibold leading-[1.1] text-[#294F7C]">12341234</p>
                    </div>

                    <div className="mt-8 flex items-start gap-3">
                      <span className="mt-px inline-flex size-[15px] flex-none rounded-[2px] border border-[#294F7C]" />
                      <p className="text-xs leading-[1.25] text-[#294F7C]">
                        You will need to add your UPI ID from from HDFC Bank on the next page to proceed.
                      </p>
                    </div>

                    <Link
                      href={step.nextStepHref || '/'}
                      className="mx-auto mt-10 flex h-10 w-[250px] items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white"
                    >
                      Confirm
                      <img src="/assets/onboarding/step-12/desktop/arrow-right.svg" alt="" className="ml-4 size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="min-h-screen w-full bg-[linear-gradient(155.3deg,#EAF4FB_0%,#F8FAFC_100%)] px-4 py-4 min-[768px]:hidden sm:px-5 sm:py-5 md:px-6 md:py-8">
        <div ref={mobileFrameRef} className="mx-auto w-full max-w-[583px]">
          <div className="mx-auto" style={{ width: 402 * mobileScale, height: mobileScaledHeight }}>
            <div
              className="relative overflow-hidden bg-[linear-gradient(155.3deg,#EAF4FB_0%,#F8FAFC_100%)]"
              style={{ width: 402, height: 874, transform: `scale(${mobileScale})`, transformOrigin: 'top left' }}
            >
              <img src="/assets/logos/wealthup-logo.png" alt="Wealthup" className="absolute left-4 top-4 h-10 w-[126px]" />
              <h1 className="absolute left-4 top-[88px] w-[370px] text-center text-[32px] font-bold leading-[1.1875] text-[#294F7C]">
                Your Journey to Wealth just got real
              </h1>
              <p className="absolute left-[89px] top-[172px] text-sm text-[#294F7C]">Let&apos;s get your money working for you</p>

              <p className="absolute left-[60px] top-[221px] w-[282px] text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">
                Investment Summary
              </p>
              <div className="absolute left-4 top-[252px] h-[139px] w-[370px] rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB]">
                <p className="absolute left-[31px] top-[31px] text-sm font-light text-[#294F7C]">Investment amount:</p>
                <p className="absolute left-[31px] top-[60px] text-sm font-light text-[#294F7C]">Fund:</p>
                <p className="absolute left-[31px] top-[89px] text-sm font-light text-[#294F7C]">Investment Type:</p>
                <p className="absolute right-[31px] top-[31px] text-sm font-semibold text-[#294F7C]">₹ 1000</p>
                <p className="absolute right-[31px] top-[60px] text-sm font-semibold text-[#294F7C]">Axis Bluechip Fund</p>
                <p className="absolute right-[31px] top-[89px] text-sm font-semibold text-[#294F7C]">One Time (Lump sum)</p>
              </div>

              <p className="absolute left-[78px] top-[423px] w-[245px] text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">
                Select Payment Method
              </p>
              <div className="absolute left-4 top-[454px] h-[336px] w-[370px] rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB]">
                <label className="absolute left-8 top-8 inline-flex items-center gap-[12px] text-sm text-[#294F7C]">
                  <span className="relative inline-flex size-[15px] items-center justify-center">
                    <img src="/assets/onboarding/step-10/mobile/radio-outer.svg" alt="" className="absolute inset-0 size-[15px]" />
                    <img src="/assets/onboarding/step-10/mobile/radio-inner.svg" alt="" className="absolute left-[3px] top-[3px] size-[9px]" />
                  </span>
                  UPI
                </label>
                <label className="absolute left-[142px] top-8 inline-flex items-center gap-[12px] text-sm text-[#294F7C]">
                  <span className="inline-flex size-[15px] rounded-full border border-[#294F7C]" />
                  Internet Banking
                </label>

                <p className="absolute left-8 top-[81px] text-sm font-light text-black">Bank:</p>
                <div className="absolute left-8 top-[110px] h-[60px] w-[150px] rounded-[10px] border border-[#4A90E2] bg-[#CFE6F7]">
                  <img src="/assets/onboarding/step-12/mobile/hdfc-bank-logo.png" alt="HDFC Bank" className="absolute left-[20px] top-[15px] size-[29px] object-contain" />
                  <p className="absolute left-[57px] top-[10px] text-sm font-semibold leading-[1.1] text-[#294F7C]">HDFC Bank</p>
                  <p className="absolute left-[57px] top-[31px] text-sm font-semibold leading-[1.1] text-[#294F7C]">12341234</p>
                </div>

                <span className="absolute left-[31px] top-[202px] inline-flex size-[15px] rounded-[2px] border border-[#294F7C]" />
                <p className="absolute left-[58px] top-[201px] w-[281px] text-center text-xs leading-[1.25] text-[#294F7C]">
                  You will need to add your UPI ID from from HDFC Bank on the next page to proceed.
                </p>

                <Link
                  href={step.nextStepHref || '/'}
                  className="absolute left-[76px] top-[263px] flex h-10 w-[250px] items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white"
                >
                  Confirm
                  <img src="/assets/onboarding/step-12/mobile/arrow-right.svg" alt="" className="ml-4 size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StepThirteenPage({ step }: { step: OnboardingStepContent }) {
  const mobileFrameRef = useRef<HTMLDivElement>(null);
  const [mobileFrameWidth, setMobileFrameWidth] = useState(402);

  useEffect(() => {
    const element = mobileFrameRef.current;
    if (!element) return;

    const updateWidth = () => setMobileFrameWidth(element.clientWidth || 402);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const mobileScale = mobileFrameWidth / 402;
  const mobileBaseHeight = 874;
  const mobileScaledHeight = mobileBaseHeight * mobileScale;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(155.3deg,#EAF4FB_0%,#F8FAFC_100%)] font-urbanist font-normal text-[#294F7C]">
      <div className="hidden min-h-[1024px] w-full min-[1200px]:block">
        <div className="relative mx-auto min-h-[1024px] w-full max-w-[1440px] overflow-hidden bg-[linear-gradient(122.67deg,#F8FAFC_0%,#EAF4FB_100%)]">
          <div className="absolute inset-y-0 left-0 w-[490px] bg-[linear-gradient(122.67deg,#F8FAFC_0%,#EAF4FB_100%)]" />
          <div className="absolute inset-y-0 left-[490px] w-[950px] bg-[radial-gradient(ellipse_50%_69.47%_at_50%_50%,#F8FAFC_71.154%,#EAF4FB_100%)] shadow-[4px_4px_250px_190px_rgba(207,230,247,1)]" />

          <div className="absolute left-[522px] top-8 h-10 w-[126px]">
            <img src="/assets/onboarding/step-13/desktop/wealthup-logo.png" alt="Wealthup" className="size-full object-contain" />
          </div>
          <p className="absolute left-[965px] top-[100px] -translate-x-1/2 text-center text-[20px] font-semibold text-[#294F7C]">
            Your journey to wealth just got real.
          </p>
          <p className="absolute left-[965px] top-[132px] -translate-x-1/2 text-center text-sm text-[#294F7C]">
            Let&apos;s get your money working for you
          </p>

          <p className="absolute left-[596px] top-[181px] w-[282px] text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">
            Investment Summary
          </p>
          <div className="absolute left-[523px] top-[212px] h-[139px] w-[428px] rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB]">
            <p className="absolute left-[31px] top-[31px] text-sm font-light text-black">Investment amount:</p>
            <p className="absolute left-[31px] top-[60px] text-sm font-light text-black">Fund:</p>
            <p className="absolute left-[31px] top-[89px] text-sm font-light text-black">Investment Type:</p>
            <p className="absolute right-[31px] top-[31px] text-sm font-semibold text-[#294F7C]">₹ 1000</p>
            <p className="absolute right-[31px] top-[60px] text-sm font-semibold text-[#294F7C]">Axis Bluechip Fund</p>
            <p className="absolute right-[31px] top-[89px] text-sm font-semibold text-[#294F7C]">One Time (Lump sum)</p>
          </div>

          <p className="absolute left-[596px] top-[383px] w-[282px] text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">
            Select Payment Method
          </p>
          <div className="absolute left-[523px] top-[414px] h-[336px] w-[428px] rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB]">
            <label className="absolute left-[32px] top-[32px] inline-flex items-center gap-[10px] text-sm text-[#294F7C]">
              <span className="relative inline-flex size-[15px] items-center justify-center">
                <img src="/assets/onboarding/step-13/desktop/radio-outer.svg" alt="" className="absolute inset-0 size-[15px]" />
                <img src="/assets/onboarding/step-13/desktop/radio-inner.svg" alt="" className="absolute left-[3px] top-[3px] size-[9px]" />
              </span>
              UPI
            </label>
            <label className="absolute left-[142px] top-[32px] inline-flex items-center gap-[10px] text-sm text-[#294F7C]">
              <span className="inline-flex size-[15px] rounded-full border border-[#294F7C]" />
              Internet Banking
            </label>

            <p className="absolute left-[32px] top-[81px] text-sm font-light text-black">Bank:</p>
            <div className="absolute left-[32px] top-[110px] h-[60px] w-[150px] rounded-[10px] border border-[#4A90E2] bg-[#CFE6F7]">
              <img src="/assets/onboarding/step-13/desktop/hdfc-bank-logo.png" alt="HDFC Bank" className="absolute left-5 top-[15px] size-[29px] object-contain" />
              <p className="absolute left-[59px] top-[10px] text-sm font-semibold leading-[1.1] text-[#294F7C]">HDFC Bank</p>
              <p className="absolute left-[59px] top-[31px] text-sm font-semibold leading-[1.1] text-[#294F7C]">12341234</p>
            </div>

            <span className="absolute left-[31px] top-[202px] inline-flex size-[15px] rounded-[2px] border border-[#294F7C]" />
            <p className="absolute left-[58px] top-[201px] w-[337px] text-xs leading-[1.25] text-[#294F7C]">
              You will need to add your UPI ID from from HDFC Bank on the next page to proceed.
            </p>

            <div className="absolute left-[90px] top-[263px] flex h-10 w-[250px] items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white">
              Confirm
              <img src="/assets/onboarding/step-13/desktop/arrow-right.svg" alt="" className="ml-4 size-4" />
            </div>
          </div>

          <p className="absolute left-[1111px] top-[181px] w-[282px] text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">
            Recommended Fund for you
          </p>
          <div className="absolute left-[1038px] top-[212px] h-[123px] w-[342px] rounded-[10px] border border-[#294F7C] bg-[#EAF4FB]">
            <div className="absolute left-6 top-6 size-[50px]">
              <img src="/assets/onboarding/step-13/desktop/fund-logo-bg.svg" alt="" className="size-full" />
            </div>
            <img
              src="/assets/onboarding/step-13/desktop/axis-bank-logo.svg"
              alt="Axis Bank"
              className="absolute left-[33px] top-[33px] h-[32px] w-[32px] object-contain"
            />
            <p className="absolute left-[101px] top-[28px] text-base font-semibold tracking-[0.8px] text-[#294F7C]">Axis Bluechip Fund</p>
            <p className="absolute left-[257px] top-[30px] text-sm text-[#294F7C]">- Direct</p>
            <p className="absolute left-[101px] top-[52px] text-sm text-[#294F7C]">Plan - Growth</p>
            <div className="absolute left-[86px] top-[81px] h-[18px] w-[100px] rounded-[10px] border border-[#00BA00] bg-[rgba(126,255,126,0.2)]" />
            <p className="absolute left-[106px] top-[84px] text-[10px] font-extralight tracking-[0.5px] text-[#00BA00]">Risk: Moderate</p>
            <div className="absolute left-[198px] top-[81px] h-[18px] w-[120px] rounded-[10px] border border-[#294F7C] bg-[#CFE6F7]" />
            <p className="absolute left-[214px] top-[84px] text-[10px] font-extralight tracking-[0.5px] text-[#294F7C]">5 Year Return: 14.5%</p>
          </div>

          <p className="absolute left-[1080px] top-[359px] text-sm font-extralight tracking-[0.7px] text-[#294F7C]">Change Fund</p>
          <div className="absolute left-[1038px] top-[384px] h-10 w-[342px] rounded-[10px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] shadow-[2px_2px_4px_rgba(0,0,0,0.25)]">
            <p className="absolute left-[19px] top-[11px] text-sm italic text-[#294F7C]">Enter name of fund</p>
          </div>

          <div className="absolute left-[1292px] top-[58px]">
            <p className="text-xs text-[#294F7C]">Go to Dashboard</p>
            <img src="/assets/onboarding/step-13/desktop/link-underline.svg" alt="" className="mt-[1px] h-px w-[91px]" />
          </div>

          <div className="absolute inset-0 z-10 bg-[rgba(74,144,226,0.2)] backdrop-blur-[7px]" />
          <img src="/assets/onboarding/step-13/desktop/success-burst.gif" alt="" className="absolute left-[-22px] top-[-140px] z-20 size-[1024px]" />
          <img src="/assets/onboarding/step-13/desktop/success-burst.gif" alt="" className="absolute left-[448px] top-[-140px] z-20 size-[1024px]" />

          <div className="absolute left-1/2 top-1/2 z-30 h-[527px] w-[515px] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-[#4A90E2] bg-[rgba(248,250,252,0.9)]">
            <div className="absolute left-1/2 top-8 size-10 -translate-x-1/2">
              <img src="/assets/onboarding/step-13/desktop/success-ring.svg" alt="" className="size-full" />
              <img src="/assets/onboarding/step-13/desktop/success-check.svg" alt="" className="absolute left-[10px] top-[10px] size-5" />
            </div>
            <p className="absolute left-1/2 top-[84px] -translate-x-1/2 text-center text-2xl font-semibold tracking-[1.2px] text-[#00BA00]">
              Congratulations!
            </p>
            <p className="absolute left-1/2 top-[137px] -translate-x-1/2 text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">
              ₹1000 Successfully Invested
            </p>
            <p className="absolute left-[27px] top-[188px] text-base font-semibold tracking-[0.8px] text-[#294F7C]">Details</p>

            <div className="absolute left-8 top-[219px] h-24 w-[451px] rounded-[10px] bg-[#CFE6F7]">
              <img src="/assets/onboarding/step-13/desktop/detail-divider-horizontal.svg" alt="" className="absolute left-0 top-[41px] h-px w-[451px]" />
              <img
                src="/assets/onboarding/step-13/desktop/detail-divider-vertical.svg"
                alt=""
                className="absolute left-[282px] top-[48px] h-px w-24 origin-center rotate-90"
              />
              <p className="absolute left-[48px] top-[14px] text-center text-sm font-semibold tracking-[0.7px] text-[#294F7C]">Fund</p>
              <p className="absolute right-[38px] top-[14px] w-[88px] text-center text-sm font-semibold tracking-[0.7px] text-[#294F7C]">Amount</p>
              <p className="absolute left-[32px] top-[53px] text-base tracking-[0.8px] text-[#294F7C]">Axis Bluechip Fund</p>
              <p className="absolute right-[38px] top-[53px] w-[88px] text-center text-base tracking-[0.8px] text-[#294F7C]">₹1000</p>
            </div>

            <p className="absolute left-1/2 top-[375px] w-[451px] -translate-x-1/2 text-center text-[20px] leading-[1.15] tracking-[1px] text-[#294F7C]">
              Funds will be reflected by 24 Feb 2026 (in 3-4 Business Days)
            </p>
            <Link
              href={step.nextStepHref || '/'}
              className="absolute left-1/2 top-[455px] flex h-10 w-[250px] -translate-x-1/2 items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden min-h-screen w-full overflow-x-hidden bg-[linear-gradient(155.3deg,#EAF4FB_0%,#F8FAFC_100%)] min-[640px]:block min-[1200px]:hidden">
        <div className="relative mx-auto min-h-screen w-full max-w-[1180px] overflow-hidden px-8 py-8 min-[1024px]:px-10 min-[1024px]:py-10">
          <div className="absolute inset-0 z-10 bg-[rgba(74,144,226,0.3)] backdrop-blur-[14px]" />

          <div className="relative z-0 mx-auto max-w-[980px]">
            <img src="/assets/onboarding/step-13/desktop/wealthup-logo.png" alt="Wealthup" className="h-10 w-[126px] object-contain" />

            <div className="mx-auto mt-10 max-w-[760px] text-center">
              <h1 className="text-[24px] font-semibold leading-[1.15] tracking-[0.2px] text-[#294F7C] min-[900px]:text-[28px] min-[1120px]:text-[30px]">
                Your journey to wealth just got real.
              </h1>
              <p className="mt-2 text-sm text-[#294F7C] min-[900px]:text-[15px]">Let&apos;s get your money working for you</p>
            </div>

            <div className="mt-10 grid gap-8 min-[1040px]:grid-cols-[428px_342px] min-[1040px]:justify-center">
              <div className="flex flex-col gap-8">
                <div>
                  <p className="mb-2 text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">Investment Summary</p>
                  <div className="rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB] px-[31px] py-[28px] text-sm text-[#294F7C]">
                    <div className="grid grid-cols-[1fr_auto] gap-y-3">
                      <p className="font-light text-black">Investment amount:</p>
                      <p className="font-semibold">₹ 1000</p>
                      <p className="font-light text-black">Fund:</p>
                      <p className="font-semibold">Axis Bluechip Fund</p>
                      <p className="font-light text-black">Investment Type:</p>
                      <p className="font-semibold">One Time (Lump sum)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">Select Payment Method</p>
                  <div className="rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB] px-8 py-8">
                    <div className="flex flex-wrap gap-8 text-sm text-[#294F7C]">
                      <label className="inline-flex items-center gap-[10px]">
                        <span className="relative inline-flex size-[15px] items-center justify-center">
                          <img src="/assets/onboarding/step-13/desktop/radio-outer.svg" alt="" className="absolute inset-0 size-[15px]" />
                          <img src="/assets/onboarding/step-13/desktop/radio-inner.svg" alt="" className="absolute left-[3px] top-[3px] size-[9px]" />
                        </span>
                        UPI
                      </label>
                      <label className="inline-flex items-center gap-[10px]">
                        <span className="inline-flex size-[15px] rounded-full border border-[#294F7C]" />
                        Internet Banking
                      </label>
                    </div>

                    <p className="mt-8 text-sm font-light text-black">Bank:</p>
                    <div className="relative mt-[13px] h-[60px] w-[150px] rounded-[10px] border border-[#4A90E2] bg-[#CFE6F7]">
                      <img src="/assets/onboarding/step-13/desktop/hdfc-bank-logo.png" alt="HDFC Bank" className="absolute ml-5 mt-[15px] size-[29px] object-contain" />
                      <p className="ml-[59px] mt-[10px] text-sm font-semibold leading-[1.1] text-[#294F7C]">HDFC Bank</p>
                      <p className="ml-[59px] mt-[3px] text-sm font-semibold leading-[1.1] text-[#294F7C]">12341234</p>
                    </div>

                    <div className="mt-8 flex items-start gap-3">
                      <span className="mt-px inline-flex size-[15px] flex-none rounded-[2px] border border-[#294F7C]" />
                      <p className="text-xs leading-[1.25] text-[#294F7C]">
                        You will need to add your UPI ID from from HDFC Bank on the next page to proceed.
                      </p>
                    </div>

                    <div className="mx-auto mt-10 flex h-10 w-[250px] items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white">
                      Confirm
                      <img src="/assets/onboarding/step-13/desktop/arrow-right.svg" alt="" className="ml-4 size-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto w-full max-w-[342px] min-[1040px]:mx-0">
                <p className="mb-2 text-center text-base font-semibold tracking-[0.8px] text-[#294F7C] min-[1040px]:text-left">Recommended Fund for you</p>
                <div className="rounded-[10px] border border-[#294F7C] bg-[#EAF4FB] px-6 py-6">
                  <div className="relative flex items-start">
                    <div className="relative size-[50px] flex-none">
                      <img src="/assets/onboarding/step-13/desktop/fund-logo-bg.svg" alt="" className="size-full" />
                      <img
                        src="/assets/onboarding/step-13/desktop/axis-bank-logo.svg"
                        alt="Axis Bank"
                        className="absolute left-[9px] top-[9px] h-[32px] w-[32px] object-contain"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-semibold tracking-[0.8px] text-[#294F7C]">Axis Bluechip Fund</p>
                      <p className="mt-1 text-sm text-[#294F7C]">- Direct</p>
                      <p className="text-sm text-[#294F7C]">Plan - Growth</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <div className="rounded-[10px] border border-[#00BA00] bg-[rgba(126,255,126,0.2)] px-4 py-[2px]">
                          <p className="text-[10px] font-extralight tracking-[0.5px] text-[#00BA00]">Risk: Moderate</p>
                        </div>
                        <div className="rounded-[10px] border border-[#294F7C] bg-[#CFE6F7] px-4 py-[2px]">
                          <p className="text-[10px] font-extralight tracking-[0.5px] text-[#294F7C]">5 Year Return: 14.5%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-sm font-extralight tracking-[0.7px] text-[#294F7C]">Change Fund</p>
                <div className="mt-[6px] h-10 rounded-[10px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[19px] shadow-[2px_2px_4px_rgba(0,0,0,0.25)]">
                  <p className="pt-[11px] text-sm italic text-[#294F7C]">Enter name of fund</p>
                </div>

                <div className="mt-10 text-right">
                  <Link href={step.nextStepHref || '/'} className="inline-flex text-xs text-[#294F7C]">
                    <span className="border-b border-[rgba(41,79,124,0.4)] pb-px">Go to Dashboard</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <img src="/assets/onboarding/step-13/desktop/success-burst.gif" alt="" className="pointer-events-none absolute left-1/2 top-0 z-20 h-[540px] w-[540px] -translate-x-[64%] opacity-34" />
          <img src="/assets/onboarding/step-13/desktop/success-burst.gif" alt="" className="pointer-events-none absolute right-[-80px] top-[-40px] z-20 h-[520px] w-[520px] opacity-24" />

          <div className="absolute inset-0 z-30 flex items-center justify-center px-6 py-10">
            <div className="relative w-full max-w-[515px] rounded-[30px] border border-[#4A90E2] bg-[#F8FAFC] px-8 pb-10 pt-8 shadow-[0_18px_60px_rgba(41,79,124,0.14)]">
              <div className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-[rgba(255,255,255,0.45)]" />
              <div className="absolute left-1/2 top-8 size-10 -translate-x-1/2">
                <img src="/assets/onboarding/step-13/desktop/success-ring.svg" alt="" className="size-full" />
                <img src="/assets/onboarding/step-13/desktop/success-check.svg" alt="" className="absolute left-[10px] top-[10px] size-5" />
              </div>
              <p className="relative mt-[52px] text-center text-2xl font-semibold tracking-[1.2px] text-[#00BA00]">Congratulations!</p>
              <p className="relative mt-[29px] text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">₹1000 Successfully Invested</p>
              <p className="relative mt-10 ml-2 text-base font-semibold tracking-[0.8px] text-[#294F7C]">Details</p>

              <div className="relative mt-6 rounded-[10px] bg-[#CFE6F7]">
                <div className="grid grid-cols-[1fr_140px]">
                  <div className="border-r border-[rgba(248,250,252,0.9)] px-8 py-4">
                    <p className="text-sm font-semibold tracking-[0.7px] text-[#294F7C]">Fund</p>
                  </div>
                  <div className="px-8 py-4 text-right">
                    <p className="text-sm font-semibold tracking-[0.7px] text-[#294F7C]">Amount</p>
                  </div>
                  <div className="border-r border-t border-[rgba(248,250,252,0.9)] px-8 py-5">
                    <p className="text-base tracking-[0.8px] text-[#294F7C]">Axis Bluechip Fund</p>
                  </div>
                  <div className="border-t border-[rgba(248,250,252,0.9)] px-8 py-5 text-right">
                    <p className="text-base tracking-[0.8px] text-[#294F7C]">₹1000</p>
                  </div>
                </div>
              </div>

              <p className="relative mx-auto mt-10 max-w-[451px] text-center text-[20px] leading-[1.15] tracking-[1px] text-[#294F7C]">
                Funds will be reflected by 24 Feb 2026 (in 3-4 Business Days)
              </p>
              <Link
                href={step.nextStepHref || '/'}
                className="relative mx-auto mt-10 flex h-10 w-[250px] items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen w-full bg-[linear-gradient(155.3deg,#EAF4FB_0%,#F8FAFC_100%)] min-[640px]:hidden">
        <div ref={mobileFrameRef} className="mx-auto w-full max-w-none">
          <div className="mx-auto" style={{ width: 402 * mobileScale, height: mobileScaledHeight }}>
            <div
              className="relative overflow-hidden bg-[linear-gradient(155.3deg,#EAF4FB_0%,#F8FAFC_100%)]"
              style={{ width: 402, height: 874, transform: `scale(${mobileScale})`, transformOrigin: 'top left' }}
            >
              <img src="/assets/onboarding/step-13/mobile/wealthup-logo.png" alt="Wealthup" className="absolute left-4 top-4 h-10 w-[126px]" />
              <h1 className="absolute left-4 top-[88px] w-[370px] text-center text-[32px] font-bold leading-[1.1875] text-[#294F7C]">
                Your Journey to Wealth just got real
              </h1>
              <p className="absolute left-[89px] top-[172px] text-sm text-[#294F7C]">Let&apos;s get your money working for you</p>

              <p className="absolute left-[60px] top-[221px] w-[282px] text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">
                Investment Summary
              </p>
              <div className="absolute left-4 top-[252px] h-[139px] w-[370px] rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB]">
                <p className="absolute left-[31px] top-[31px] text-sm font-light text-[#294F7C]">Investment amount:</p>
                <p className="absolute left-[31px] top-[60px] text-sm font-light text-[#294F7C]">Fund:</p>
                <p className="absolute left-[31px] top-[89px] text-sm font-light text-[#294F7C]">Investment Type:</p>
                <p className="absolute right-[31px] top-[31px] text-sm font-semibold text-[#294F7C]">₹ 1000</p>
                <p className="absolute right-[31px] top-[60px] text-sm font-semibold text-[#294F7C]">Axis Bluechip Fund</p>
                <p className="absolute right-[31px] top-[89px] text-sm font-semibold text-[#294F7C]">One Time (Lump sum)</p>
              </div>

              <p className="absolute left-[78px] top-[423px] w-[245px] text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">
                Select Payment Method
              </p>
              <div className="absolute left-4 top-[454px] h-[336px] w-[370px] rounded-[10px] border border-[#4A90E2] bg-[#EAF4FB]">
                <label className="absolute left-8 top-8 inline-flex items-center gap-[12px] text-sm text-[#294F7C]">
                  <span className="relative inline-flex size-[15px] items-center justify-center">
                    <img src="/assets/onboarding/step-13/mobile/radio-outer.svg" alt="" className="absolute inset-0 size-[15px]" />
                    <img src="/assets/onboarding/step-13/mobile/radio-inner.svg" alt="" className="absolute left-[3px] top-[3px] size-[9px]" />
                  </span>
                  UPI
                </label>
                <label className="absolute left-[142px] top-8 inline-flex items-center gap-[12px] text-sm text-[#294F7C]">
                  <span className="inline-flex size-[15px] rounded-full border border-[#294F7C]" />
                  Internet Banking
                </label>

                <p className="absolute left-8 top-[81px] text-sm font-light text-black">Bank:</p>
                <div className="absolute left-8 top-[110px] h-[60px] w-[150px] rounded-[10px] border border-[#4A90E2] bg-[#CFE6F7]">
                  <img src="/assets/onboarding/step-13/mobile/hdfc-bank-logo.png" alt="HDFC Bank" className="absolute left-[20px] top-[15px] size-[29px] object-contain" />
                  <p className="absolute left-[57px] top-[10px] text-sm font-semibold leading-[1.1] text-[#294F7C]">HDFC Bank</p>
                  <p className="absolute left-[57px] top-[31px] text-sm font-semibold leading-[1.1] text-[#294F7C]">12341234</p>
                </div>

                <span className="absolute left-[31px] top-[202px] inline-flex size-[15px] rounded-[2px] border border-[#294F7C]" />
                <p className="absolute left-[58px] top-[201px] w-[281px] text-center text-xs leading-[1.25] text-[#294F7C]">
                  You will need to add your UPI ID from from HDFC Bank on the next page to proceed.
                </p>

                <div className="absolute left-[76px] top-[263px] flex h-10 w-[250px] items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white">
                  Confirm
                  <img src="/assets/onboarding/step-13/mobile/arrow-right.svg" alt="" className="ml-4 size-4" />
                </div>
              </div>

              <div className="absolute inset-0 z-10 bg-[rgba(74,144,226,0.2)] backdrop-blur-[7.5px]" />
              <img
                src="/assets/onboarding/step-13/mobile/success-burst.gif"
                alt=""
                className="absolute left-[18px] top-[124px] z-20 size-[366px] opacity-45"
              />

              <div className="absolute left-1/2 top-[437px] z-30 h-[527px] w-[370px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[30px] border border-[#4A90E2] bg-[rgba(248,250,252,0.9)]">
                <div className="absolute left-1/2 top-8 size-10 -translate-x-1/2">
                  <img src="/assets/onboarding/step-13/mobile/success-ring.svg" alt="" className="size-full" />
                  <img src="/assets/onboarding/step-13/mobile/success-check.svg" alt="" className="absolute left-[10px] top-[10px] size-5" />
                </div>
                <p className="absolute left-1/2 top-[84px] -translate-x-1/2 text-center text-2xl font-semibold tracking-[1.2px] text-[#00BA00]">
                  Congratulations!
                </p>
                <p className="absolute left-1/2 top-[137px] -translate-x-1/2 whitespace-nowrap text-center text-base font-semibold tracking-[0.8px] text-[#294F7C]">
                  ₹1000 Successfully Invested
                </p>
                <p className="absolute left-7 top-[188px] text-base font-semibold tracking-[0.8px] text-[#294F7C]">Details</p>

                <div className="absolute left-1/2 top-[219px] h-24 w-[338px] -translate-x-1/2 overflow-hidden rounded-[10px] bg-[#CFE6F7]">
                  <div className="grid h-full grid-cols-[1fr_110px] grid-rows-[41px_1fr]">
                    <div className="border-b border-r border-[rgba(248,250,252,0.9)] px-[33px] pt-[14px]">
                      <p className="text-sm font-semibold tracking-[0.7px] text-[#294F7C]">Fund</p>
                    </div>
                    <div className="border-b border-[rgba(248,250,252,0.9)] px-5 pt-[14px] text-right">
                      <p className="text-sm font-semibold tracking-[0.7px] text-[#294F7C]">Amount</p>
                    </div>
                    <div className="border-r border-[rgba(248,250,252,0.9)] px-8 pt-[12px]">
                      <p className="text-base tracking-[0.8px] text-[#294F7C]">Axis Bluechip Fund</p>
                    </div>
                    <div className="px-5 pt-[12px] text-right">
                      <p className="text-base tracking-[0.8px] text-[#294F7C]">₹1000</p>
                    </div>
                  </div>
                </div>

                <p className="absolute left-1/2 top-[343px] w-[338px] -translate-x-1/2 text-center text-[20px] leading-[1.15] tracking-[1px] text-[#294F7C]">
                  Funds will be reflected by 24 Feb 2026 (in 3-4 Business Days)
                </p>
                <Link
                  href={step.nextStepHref || '/'}
                  className="absolute left-1/2 top-[453px] flex h-10 w-[250px] -translate-x-1/2 items-center justify-center rounded-[30px] bg-gradient-to-r from-[#4A90E2] to-[#294F7C] text-base font-semibold text-white"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function OnboardingShell({ step }: OnboardingShellProps) {
  const activeSegments = Math.max(1, Math.min(6, Math.ceil((step.progress / 100) * 6)));
  const progressPercent = Math.max(0, Math.min(100, step.progress));
  const tabletCardContainerRef = useRef<HTMLDivElement>(null);
  const [tabletCardContainerWidth, setTabletCardContainerWidth] = useState(402);

  useEffect(() => {
    const element = tabletCardContainerRef.current;
    if (!element) return;

    const updateWidth = () => setTabletCardContainerWidth(element.clientWidth || 402);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const mobileCardWidth = getMobileCardWidth(step.id);
  const mobileScale = Math.max(0.76, Math.min(1.08, tabletCardContainerWidth / mobileCardWidth));
  const mobileCardScaledHeight = getMobileCardHeight(step.id) * mobileScale;

  if (step.id === 10 || step.id === 11) {
    return <StepTenPage step={step} />;
  }

  if (step.id === 12) {
    return <StepTwelvePage step={step} />;
  }

  if (step.id === 13) {
    return <StepThirteenPage step={step} />;
  }

  return (
    <main className="min-h-screen overflow-y-auto overflow-x-hidden bg-white font-urbanist font-normal text-[#294F7C]">
      <div className="hidden min-h-[1024px] w-full bg-white backdrop-blur-[50px] min-[1070px]:flex">
        <aside className="relative h-[1024px] min-h-[1024px] w-[34%] min-w-[420px] max-w-[520px]">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(122.67deg,#F8FAFC_0%,#EAF4FB_100%)]" />
          <img src="/assets/logos/wealthup-logo.png" alt="Wealthup" className="absolute left-8 top-8 z-10 h-10 w-[126px]" />
          <div className="absolute left-1/2 top-[100px] z-10 -translate-x-1/2 text-center">
            <span className="block text-[32px] font-bold leading-[0.95] text-[#294F7C]">Complete your</span>
            <span className="block text-[32px] font-bold leading-[0.95] text-[#4A90E2]">onboarding</span>
          </div>
          <p className="absolute left-1/2 top-[184px] z-10 w-[316px] -translate-x-1/2 text-base font-normal text-[#294F7C] min-[1070px]:max-[1246px]:top-[214px] min-[1070px]:max-[1246px]:w-[300px]">
            Let&apos;s set up your account in a few quick steps.
          </p>

          <div className="absolute left-1/2 top-[235px] z-10 w-[300px] -translate-x-1/2 min-[1070px]:max-[1246px]:top-[270px]">
            <p className="text-sm font-normal text-[#294F7C]">Progress: {step.progress}%</p>
            <div className="mt-[11px] h-2 w-[300px] rounded-[10px] border-[0.5px] border-[#294F7C] bg-[#CFE6F7]">
              <div className="h-full rounded-[10px] bg-[#294F7C]" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-[5px] text-right text-xs font-light text-[#294F7C]">Estimated Time: 90 sec</p>
          </div>

          <div className="absolute left-1/2 top-[319px] z-10 flex w-[300px] -translate-x-1/2 flex-col gap-8 min-[1070px]:max-[1246px]:top-[354px]">
            {ONBOARDING_SIDEBAR_ITEMS.map((item) => {
              const isCurrent = item.id === step.currentSidebarStage;
              const isCompleted = item.id < step.currentSidebarStage;

              return (
                <div
                  key={item.id}
                  className={`relative h-[60px] w-[300px] overflow-hidden rounded-[10px]
    ${isCurrent
                      ? `
        bg-[#CFE6F7]/80
        backdrop-blur-xl
        border border-[#4A90E2]/60
        shadow-[0_8px_20px_rgba(74,144,226,0.25)]
      `
                      : `
        bg-gradient-to-b from-white/15 to-white/5
        backdrop-blur-lg
        border border-white/20
      `
                    }`}
                >

                  {/* <div
                    key={item.id}
                    className={`relative h-[60px] w-[300px] overflow-hidden rounded-[10px]
  transition-all duration-300
  ${isCurrent
                        ? `
      bg-[rgba(207,230,247,0.65)]
      backdrop-blur-[18px]
      border border-white/40
      shadow-[0_10px_40px_rgba(74,144,226,0.25)]
    `
                        : `
      bg-[rgba(255,255,255,0.35)]
      backdrop-blur-[18px]
      border border-white/30
      shadow-[0_8px_30px_rgba(0,0,0,0.08)]
    `
                      }`}
                  ><div className="absolute inset-0 rounded-[10px] 
  bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0)_100%)] 
  pointer-events-none" /> */}
                  {/* Title */}
                  <p
                    className={`absolute top-[10px] text-sm font-bold text-[#294F7C] 
      ${!isCurrent && 'opacity-60'}
      ${isCompleted ? 'line-through decoration-[1.5px] decoration-[#294F7C]' : ''}
      ${getSidebarTitleClass(item.id)}`}
                  >
                    {item.title}
                  </p>

                  {/* ETA */}
                  <p
                    className={`absolute left-[186px] top-[38px] text-[10px] font-normal text-[#294F7C]
      ${!isCurrent && 'opacity-60'}`}
                  >
                    {item.eta}
                  </p>

                  {/* Circle */}
                  <div
                    className={`absolute left-6 top-1/2 size-10 -translate-y-1/2 rounded-full 
      border border-[#294F7C]
      ${!isCurrent && 'opacity-50'}`}
                  />

                  {/* Icon */}
                  <div
                    className={`absolute size-5 overflow-hidden 
      ${item.id === 1 ? 'left-[33px] top-[19px]' : 'left-[34px] top-5'}
      ${!isCurrent && 'opacity-50'}`}
                  >
                    <img src={item.icon} alt="" className="size-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="relative min-h-[1024px] flex-1 overflow-visible bg-[radial-gradient(ellipse_50%_69.47%_at_50%_50%,#F8FAFC_0%,#EAF4FB_100%)] shadow-[4px_4px_250px_190px_rgba(207,230,247,1)]">
          <div className="mx-auto mt-[150px] flex w-full justify-center px-6">
            <StepCard step={step} />
          </div>

          <div className="mx-auto mt-8 mb-8 flex w-full flex-wrap items-center justify-center gap-8 px-6 text-xs text-[#294F7C]">
            {TRUST_ITEMS.map((item, idx) => (
              <div key={item.text} className="inline-flex items-center gap-2 whitespace-nowrap">
                <span className={`inline-flex size-[30px] items-center justify-center rounded-[20px] ${idx < 2 ? 'bg-[rgba(255,255,255,0.3)]' : ''}`}>
                  <img src={item.icon} alt="" className="size-5" />
                </span>
                {item.text}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden bg-[linear-gradient(155.3deg,#EAF4FB_0%,#F8FAFC_100%)] pb-8 pt-4 min-[1070px]:hidden">
        <div className="mx-auto w-full max-w-[900px] px-4 md:px-8">
          <img src="/assets/logos/wealthup-logo.png" alt="Wealthup" className="h-10 w-[126px]" />
          <h1 className="mt-8 text-center text-[32px] font-bold leading-[0.95] text-[#294F7C] md:text-[40px]">
            Complete your
            <br />
            <span className="text-[#4A90E2]">onboarding</span>
          </h1>
          <p className="mt-3 text-center text-base text-[#294F7C] md:mx-auto md:max-w-[480px]">Let&apos;s set up your account in a few quick steps.</p>

          <div className="mt-6 md:mx-auto md:max-w-[720px]">
            <div className="grid grid-cols-6 gap-[4.6px] md:gap-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className={`h-[10px] w-full rounded-[10px] ${step.id === 1 ? 'bg-[#CFE6F7]' : idx < activeSegments ? 'bg-[#294F7C]' : 'bg-[#CFE6F7]'}`} />
              ))}
            </div>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-sm font-bold text-[#294F7C]">{step.mobileStepLabel}</p>
              <p className="text-[10px] text-[#294F7C]">Estimated Time: 20 sec</p>
            </div>
          </div>

          <div className={step.id === 9 ? 'mt-14' : 'mt-8 md:mt-10'}>
            <div ref={tabletCardContainerRef} className="mx-auto w-full md:max-w-[720px]">
              <div className="mx-auto" style={{ width: mobileCardWidth * mobileScale, height: mobileCardScaledHeight }}>
                <div
                  style={{
                    width: mobileCardWidth,
                    transform: `scale(${mobileScale})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <StepCard step={step} mobile />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-[#294F7C] md:mx-auto md:max-w-[760px]">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex size-[30px] items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.3)]">
                  <img src={TRUST_ITEMS[0].icon} alt="" className="size-5" />
                </span>
                {TRUST_ITEMS[0].text}
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex size-[30px] items-center justify-center rounded-[20px]">
                  <img src={TRUST_ITEMS[2].icon} alt="" className="size-5" />
                </span>
                {TRUST_ITEMS[2].text}
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-2">
              <span className="inline-flex size-[30px] items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.3)]">
                <img src={TRUST_ITEMS[1].icon} alt="" className="size-5" />
              </span>
              {TRUST_ITEMS[1].text}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
