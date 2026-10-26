import type { SiteCopy } from "@/lib/copy";

type Props = {
  name: string;
  voice: string;
  copy: SiteCopy;
};

function isArrowOnly(value: string) {
  return /^[\s\-–—_.>→←]+$/.test(value.trim());
}

export function HeroCopy({ name, voice, copy }: Props) {
  const steps = [copy.heroStep1, copy.heroStep2, copy.heroStep3, copy.heroStep4]
    .map((step) => step.trim())
    .filter((step) => step && !isArrowOnly(step));
  const join = copy.heroStepJoin.trim();
  const showJoin = Boolean(join) && !isArrowOnly(join);

  return (
    <div className="relative z-10 flex flex-col justify-center bg-transparent text-[#f4ead4]">
      <h1 className="sr-only">{name}</h1>

      <div className="max-w-[38rem] lg:max-w-[42rem]">
        <p className="font-display folio-display">{copy.heroLine1}</p>
        <p className="font-display folio-display mt-1">{copy.heroLine2}</p>
        <p className="font-display folio-display mt-1">{copy.heroLine3}</p>

        {steps.length > 0 ? (
          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] sm:mt-6 sm:text-[17px]">
            {steps.map((step, index) => (
              <span key={`${step}-${index}`} className="contents">
                {index > 0 ? (
                  showJoin ? (
                    <span className="text-[15px] text-[#8a8070]">{join}</span>
                  ) : (
                    <span
                      className="hero-step-dot inline-block h-3.5 w-3.5 shrink-0 rounded-full bg-[#e8c56b] shadow-[0_0_12px_rgba(232,197,107,0.5)] sm:h-4 sm:w-4"
                      aria-hidden
                    />
                  )
                ) : null}
                <span className="font-heading text-[16px] font-bold tracking-[0.04em] text-[#f4b942] sm:text-[20px]">
                  {step}
                </span>
              </span>
            ))}
          </p>
        ) : null}
      </div>

      <p className="folio-body mt-6 max-w-[36rem]">{voice}</p>
    </div>
  );
}
