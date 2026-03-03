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
  if (stepId === 5 || stepId === 6) return 760;
  if (stepId === 7) return 700;
  if (stepId === 8) return 560;
  if (stepId === 9) return 820;
  if (stepId === 10) return 560;
  if (stepId === 11) return 500;
  if (stepId === 12) return 430;
  return 462;
}

function StepField({
  label,
  value,
  initialValue,
  rounded = 'pill',
  onChange,
}: {
  label: string;
  value: string;
  initialValue?: string;
  rounded?: 'pill' | 'soft';
  onChange: (value: string) => void;
}) {
  const inputType = label.toLowerCase().includes('email') ? 'email' : 'text';

  return (
    <div>
      <p className="mb-[3px] pl-[15px] text-sm font-extralight italic tracking-[0.7px] text-[#294F7C]">{label}</p>
      <input
        type={inputType}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={initialValue ?? ''}
        className={`h-10 w-full border border-[#294F7C] bg-[rgba(248,250,252,0.7)] ${rounded === 'pill' ? 'rounded-[70px]' : 'rounded-[20px]'} px-[15px] py-[9px] text-sm font-normal not-italic tracking-normal text-[#294F7C] outline-none placeholder:font-extralight placeholder:italic placeholder:tracking-[1.4px] placeholder:text-[#5E5E5E]`}
      />
    </div>
  );
}

function StepCard({ step, mobile = false }: { step: OnboardingStepContent; mobile?: boolean }) {
  const cardHeight = mobile ? getMobileCardHeight(step.id) : getDesktopCardHeight(step.id);
  const cardWidth = mobile ? getMobileCardWidth(step.id) : getDesktopCardWidth(step.id);
  const useStepOneLayout = step.id === 1 && !step.showSelfieUpload && !step.showSendOtp && !step.resendText;
  const isPersonalDetailsDesktop = !mobile && (step.id === 5 || step.id === 6);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(step.fields.map((field) => [field.label, ''])),
  );
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFieldValues(Object.fromEntries(step.fields.map((field) => [field.label, ''])));
    setSelectedFileName('');
  }, [step.id, step.fields]);

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
              <span className="inline-flex size-[15px] items-center justify-center rounded-full border border-[#294F7C]">
                <span className={`${step.selectedTaxResident === 'yes' ? 'size-[9px] rounded-full bg-[#4A90E2]' : 'hidden'}`} />
              </span>
              Yes
            </label>
            <label className="inline-flex items-center gap-2 text-[#294F7C]">
              <span className="inline-flex size-[15px] items-center justify-center rounded-full border border-[#294F7C]">
                <span className={`${step.selectedTaxResident === 'no' ? 'size-[9px] rounded-full bg-[#4A90E2]' : 'hidden'}`} />
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
              <input
                type={item.label.toLowerCase().includes('email') ? 'email' : 'text'}
                value={fieldValues[item.label] ?? ''}
                onChange={(event) => setFieldValues((prev) => ({ ...prev, [item.label]: event.target.value }))}
                className="absolute left-0 top-[19.5px] h-10 w-[250px] rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[15px] py-[9px] text-sm font-normal not-italic text-[#294F7C] outline-none"
              />
              {item.isSelect ? <span className="pointer-events-none absolute right-[10px] top-[28px] text-[#294F7C]">⌄</span> : null}
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
                <input
                  type="text"
                  value={fieldValues['Enter OTP'] ?? ''}
                  onChange={(event) => setFieldValues((prev) => ({ ...prev, 'Enter OTP': event.target.value }))}
                  className="absolute left-0 top-[19.5px] h-10 w-[250px] rounded-[20px] border border-[#294F7C] bg-[rgba(248,250,252,0.7)] px-[15px] py-[9px] text-sm font-normal not-italic text-[#294F7C] outline-none"
                />
              </div>
              <p className="absolute left-[461px] top-[345px] text-[10px] font-extralight text-black">Resend OTP in 30 seconds</p>
            </>
          )}
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
                onChange={(value) => setFieldValues((prev) => ({ ...prev, [field.label]: value }))}
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

      {step.resendText ? <p className={`absolute w-[250px] text-right text-[10px] font-extralight text-black ${mobile ? 'left-[56px] top-[363px]' : 'left-[175px] top-[345px]'}`}>{step.resendText}</p> : null}

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
    </div>
  );
}

export function OnboardingShell({ step }: OnboardingShellProps) {
  const activeSegments = Math.max(1, Math.min(6, Math.ceil((step.progress / 100) * 6)));
  const progressPercent = Math.max(0, Math.min(100, step.progress));

  return (
    <main className="min-h-screen overflow-y-auto overflow-x-hidden bg-white font-urbanist font-normal text-[#294F7C]">
      <div className="hidden min-h-[1024px] w-full bg-white backdrop-blur-[50px] lg:flex">
        <aside className="relative h-[1024px] min-h-[1024px] w-[34%] min-w-[420px] max-w-[520px]">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(122.67deg,#F8FAFC_0%,#EAF4FB_100%)]" />
          <img src="/assets/logos/wealthup-logo.png" alt="Wealthup" className="absolute left-8 top-8 z-10 h-10 w-[126px]" />
          <div className="absolute left-1/2 top-[100px] z-10 -translate-x-1/2 text-center">
            <span className="block text-[32px] font-bold leading-[0.95] text-[#294F7C]">Complete your</span>
            <span className="block text-[32px] font-bold leading-[0.95] text-[#4A90E2]">onboarding</span>
          </div>
          <p className="absolute left-1/2 top-[184px] z-10 w-[316px] -translate-x-1/2 text-base font-normal text-[#294F7C]">Let&apos;s set up your account in a few quick steps.</p>

          <div className="absolute left-1/2 top-[235px] z-10 w-[300px] -translate-x-1/2">
            <p className="text-sm font-normal text-[#294F7C]">Progress: {step.progress}%</p>
            <div className="mt-[11px] h-2 w-[300px] rounded-[10px] border-[0.5px] border-[#294F7C] bg-[#CFE6F7]">
              <div className="h-full rounded-[10px] bg-[#294F7C]" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-[5px] text-right text-xs font-light text-[#294F7C]">Estimated Time: 90 sec</p>
          </div>

          <div className="absolute left-1/2 top-[319px] z-10 flex w-[300px] -translate-x-1/2 flex-col gap-8">
            {ONBOARDING_SIDEBAR_ITEMS.map((item) => {
              const isCurrent = item.id === step.currentSidebarStage;

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

      <div className="mx-auto min-h-screen max-w-[402px] overflow-y-auto overflow-x-hidden bg-[linear-gradient(155.3deg,#EAF4FB_0%,#F8FAFC_100%)] px-4 pb-8 pt-4 lg:hidden">
        <img src="/assets/logos/wealthup-logo.png" alt="Wealthup" className="h-10 w-[126px]" />
        <h1 className="mt-8 text-center text-[32px] font-bold leading-[0.95] text-[#294F7C]">
          Complete your
          <br />
          <span className="text-[#4A90E2]">onboarding</span>
        </h1>
        <p className="mt-3 text-center text-base text-[#294F7C]">Let&apos;s set up your account in a few quick steps.</p>

        <div className="mt-6">
          <div className="flex gap-[4.6px]">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className={`h-[10px] w-[57.64px] rounded-[10px] ${step.id === 1 ? 'bg-[#CFE6F7]' : idx < activeSegments ? 'bg-[#294F7C]' : 'bg-[#CFE6F7]'}`} />
            ))}
          </div>
          <div className="mt-3 flex items-end justify-between">
            <p className="text-sm font-bold text-[#294F7C]">{step.mobileStepLabel}</p>
            <p className="text-[10px] text-[#294F7C]">Estimated Time: 20 sec</p>
          </div>
        </div>

        <div className="mt-8">
          <StepCard step={step} mobile />
        </div>

        <div className="mt-6 text-xs text-[#294F7C]">
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
    </main>
  );
}
