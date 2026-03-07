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
