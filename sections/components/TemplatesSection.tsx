import Image from "next/image";

export default function TemplatesSection() {
  return (
    <section id="templates" className="px-3 py-12 md:px-8 md:py-16 xl:px-12 xl:py-20">
      <div className="mx-auto w-full max-w-480">
        <h2 className="ds-font-display mx-auto mb-8 max-w-84 text-center text-[32px] font-semibold leading-10 tracking-[-0.5px] text-white md:mb-10 md:max-w-none md:text-[52px] md:leading-15 md:tracking-[-1px] xl:max-w-200 xl:mb-16 xl:text-[64px] xl:leading-18 xl:tracking-[-1px]">
          Premium templates to elevate your profile
        </h2>

        <div className="space-y-4 md:space-y-6 xl:space-y-8">
          <div className="overflow-hidden rounded-3xl">
            <Image
              src={encodeURI("/images/template card 1.png")}
              alt="Template card layout preview"
              width={2400}
              height={1350}
              className="h-auto w-full"
              priority
            />
          </div>

          <div className="overflow-hidden rounded-3xl">
            <Image
              src={encodeURI("/images/Card Container.png")}
              alt="Card container layout preview"
              width={2400}
              height={1350}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
