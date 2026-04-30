import Image from "next/image";

export default function TemplatesSection() {
  const mobileCards = [
    {
      src: encodeURI("/images/countries.png"),
      alt: "Countries template preview",
    },
    {
      src: encodeURI("/images/template card 1.png"),
      alt: "Template card layout preview",
    },
    {
      src: encodeURI("/images/Card Container.png"),
      alt: "Card container layout preview",
    },
  ];

  return (
    <section id="templates" className="px-3 py-12 xl:px-12 xl:py-20">
      <div className="mx-auto w-full max-w-372 xl:max-w-480">
        <h2 className="ds-font-display mx-auto mb-8 max-w-84 text-center text-[32px] font-semibold leading-10 tracking-[-0.5px] text-white xl:max-w-200 xl:mb-16 xl:text-[64px] xl:leading-18 xl:tracking-[-1px]">
          Premium templates to elevate your profile
        </h2>

        <div className="xl:hidden px-3">
          <div className="overflow-hidden rounded-3xl">
            <Image
              src={encodeURI("/images/vertical card container.png")}
              alt="Vertical card container"
              width={900}
              height={1400}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        <div className="hidden space-y-4 xl:block xl:space-y-8">
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
