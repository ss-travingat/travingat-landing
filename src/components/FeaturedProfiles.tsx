export default function FeaturedProfiles() {
    return (
        <section className="py-12 md:py-24 px-5 md:px-4 bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-5xl font-bold text-white leading-tight">
                        Featured travel profiles —<br className="hidden md:inline" />{' '}
                        a look at what&apos;s coming
                    </h2>
                </div>
                <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 hide-scrollbar snap-x snap-mandatory">
                    <div className="min-w-65 md:min-w-87.5 bg-card-dark rounded-3xl overflow-hidden snap-center border border-gray-800">
                        <div className="h-32 relative">
                            <img alt="Cover" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKYCo6ak8bmT7cBTahfceAsw1FzPjPppfCwUIGv7Ar4_ENqLukfbEL4r3TRjdK3Z72OVkg6NYiPvMFXTdTd4j7mtsmbY-3jZl3-rziuCojnPPDT1IyEa5jvOcf2luwSE7RD33EX4HhVqZ-oTRndOBQ-EDlE98N6dfFgA_US2xA9yXUijYFJryG4DILYEydTHkX6GjLxWK1xGx4xWgztwriG7Tiuc8G7nq1OiEOuo-1ZFOPPT0oOYGS3IYP-Mj1VHUSfgwA86EA-LSL" />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-card-dark overflow-hidden bg-black">
                                <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbgCeb8ZNmqcakKY4shZ_CLU8IfEuIJtyoAe15u05_0DR4N0isLfn1kSxGiNFUOElfNheCk3jvUmCXkGF2ZSCxctF29z4cZ6YEO8ZhqXZ2faE-NRwO-_8kxpgWmfyHPOHrLmBMZKiQAIWWEhqCtci1HTl6p2FG0psin1mj7tEVXflgrog-zz6ajVd8YPpbLkHlVvG4ISMWyvObEnwMUn_PajXuHrw7dv8rRTDt2uypbB6oPzMDykyBIqbeX1HYwDyyuQhHSdIecvGV" />
                            </div>
                        </div>
                        <div className="pt-10 pb-6 px-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <span className="text-xs">🇨🇴</span>
                                <span className="text-xs text-gray-500">Colombia</span>
                            </div>
                            <h3 className="text-white font-bold text-lg">Michael Thompson</h3>
                            <p className="text-gray-500 text-sm mb-6">@micheal.th99</p>
                            <div className="flex justify-between border-t border-gray-800 pt-4 mb-6">
                                <div className="text-center w-1/3">
                                    <div className="text-white font-bold">12</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Countries</div>
                                </div>
                                <div className="text-center w-1/3 border-l border-r border-gray-800">
                                    <div className="text-white font-bold">96</div>
                                    <div className="text-[10px] text-gray-500 uppercase">All media</div>
                                </div>
                                <div className="text-center w-1/3">
                                    <div className="text-white font-bold">34</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Collections</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-light btn-sm flex-1">Follow</button>
                                <button className="btn btn-ghost btn-sm flex-1">Connect</button>
                            </div>
                        </div>
                    </div>
                    <div className="min-w-65 md:min-w-87.5 bg-card-dark rounded-3xl overflow-hidden snap-center border border-gray-700 shadow-2xl shadow-primary/10 transform md:scale-105">
                        <div className="h-32 relative">
                            <img alt="Cover" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqz9pflq2cei5MdNOrtI7CT_Q0crZ-PPg3bmd6988mCvIZYB5GHwP3bTbbpWJ4neqiVXwCuIMS42z53paNoVnA1kYxb4DNlcEz91CRgN5qRR4RJpAbEf7wVwjngiQ91GpNP6uhAtT0uchwbZZCVlY1vacNGLo7PY3iWQA_k4zAJ8aupnufn7p1nnwABZUJpMPMvk4RvGt-2tR_OZVT87uIjepVdSF3CtO8AeMTu3EoiWSYbt26QnMzmGizT9aFQd3NtKdou9bX8Erx" />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-card-dark overflow-hidden bg-black">
                                <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvWuPueMWJeUeIHyEjsSmXBBquBRkpInh2upT4uIsbeB5pZCbpxS4lc7HT--N6GUv6JXG3Yh-gLajnuBWwOMauVV7QmXO5rOzSGIzCZqaYzfc2ilF_uR30ujgXVGXCGdsK75x_S8TBNchtFizNwGGj-7bP8ZTStRY7No1sLoUfg-K7ouHflMAYR-TDEWhScwPtNfMQWceKV7TV4faBEA4jhJ99WV3hl8B0N7xkC8FSTi5VFTSTRmZrKktWBmsE3_mKi8Xko6olINSh" />
                            </div>
                        </div>
                        <div className="pt-10 pb-6 px-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <span className="text-xs">🇺🇸</span>
                                <span className="text-xs text-gray-500">United States</span>
                            </div>
                            <h3 className="text-white font-bold text-lg">Robert Williamson</h3>
                            <p className="text-gray-500 text-sm mb-6">@robert.wando</p>
                            <div className="flex justify-between border-t border-gray-800 pt-4 mb-6">
                                <div className="text-center w-1/3">
                                    <div className="text-white font-bold">28</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Countries</div>
                                </div>
                                <div className="text-center w-1/3 border-l border-r border-gray-800">
                                    <div className="text-white font-bold">245</div>
                                    <div className="text-[10px] text-gray-500 uppercase">All media</div>
                                </div>
                                <div className="text-center w-1/3">
                                    <div className="text-white font-bold">16</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Collections</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-light btn-sm flex-1">Follow</button>
                                <button className="btn btn-ghost btn-sm flex-1">Connect</button>
                            </div>
                        </div>
                    </div>
                    <div className="min-w-65 md:min-w-87.5 bg-card-dark rounded-3xl overflow-hidden snap-center border border-gray-800">
                        <div className="h-32 relative">
                            <img alt="Cover" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt66XP5YhJPYmdWS8VJYaPkAh-gVqp31TfYIWTkSvX6Yg-U41p_swcCjWmenatnH8jKJ6Or8SPf7Y_BiYIQkiccfoVxWtod7s99IAZsorANdmOQKGsJjLKdvzx4DYqdd2VaPjHzEqcailZa8AzArnlYZXglQrEeEXsZr_YisZJf1_l32Ds_oqzv8RI1anq8zLOydVokAIUAohNpeL4p9AClXCvzVU_AfcnnT3ryJLGoXw1MTISYLd-TvEyGJyEBnsWFBO7kegaPfEw" />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-card-dark overflow-hidden bg-black">
                                <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD0fHdHNIlXNewTmgutTADfohe94oBTr2tKVuLRS52BTkLMh9TSst0vB1C5l34ZPLrfoYD7iIN_DDneNaL7V-y9E_YREDOVvTtNxLDZ8efNkd87qkHwMPS9TZkxVvElTieztshFdaZUacqiz3SVxJaQekkfpLmisV-yHkBA4QRSWH83081rQubjdC8SLXsIecF3ERyesGTKbfMtd3VKw6aoJFrQBkIp3CiqD9hiNVdc0odFE4gvp1HrPofmChUqvhGYLjflUJ5Zr9v" />
                            </div>
                        </div>
                        <div className="pt-10 pb-6 px-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <span className="text-xs">🇲🇽</span>
                                <span className="text-xs text-gray-500">Mexico</span>
                            </div>
                            <h3 className="text-white font-bold text-lg">Daniel Harris</h3>
                            <p className="text-gray-500 text-sm mb-6">@dh_88</p>
                            <div className="flex justify-between border-t border-gray-800 pt-4 mb-6">
                                <div className="text-center w-1/3">
                                    <div className="text-white font-bold">8</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Countries</div>
                                </div>
                                <div className="text-center w-1/3 border-l border-r border-gray-800">
                                    <div className="text-white font-bold">102</div>
                                    <div className="text-[10px] text-gray-500 uppercase">All media</div>
                                </div>
                                <div className="text-center w-1/3">
                                    <div className="text-white font-bold">19</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Collections</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-light btn-sm flex-1">Follow</button>
                                <button className="btn btn-ghost btn-sm flex-1">Connect</button>
                            </div>
                        </div>
                    </div>
                    <div className="min-w-65 md:min-w-87.5 bg-card-dark rounded-3xl overflow-hidden snap-center border border-gray-800">
                        <div className="h-32 relative">
                            <img alt="Cover" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaW0DNx-YotQFGxEa0lKG6ERDT0NzI4693I9aYBs5W6oiObBz05Z0Q63NAypfJ5ThKtwcSXn9gtYgxbE02mSrHP_IcP3y4sMvGle90afkvESY2_OMJfJCXuAmuPfSU1lsYCITlXQFgsCxDxHWII6_FKKzRpBpWvr9-_Zgbnqyu0Oek6bOGol4IvD0kK3NkLcCCPaKb9myA9ZbP03-pdyf7MP72YZWR0ivY0vj7g39CvumbS6rwTicnOYD2vpYArwV_0gH1XoWNPLh3" />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-card-dark overflow-hidden bg-black">
                                <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyItEDaizbStvrLThvowHU5R8HdNjNIZedYkJ9HwkSIq2fU_fZYaonNjOKmS4TsOeWjtwyeNwTPQTCg5E5Je7qWMxpqWkTzv9XCopAP2v3d2pPH9F0kVtoGpQrUIIqtne7hrHgL6Z58Y8nag2xVDq4iFAi2eJ2nfPLYmaZErmkTjhmI_e8SsrfFHcYYBJMmgMzTMj670BlDQu9rjvd8RSWVDsDWHDTQBM2NTH7_iL63STl2pwDkxqTQ4UuxC-YqrEYlg8f2bGzCM0A" />
                            </div>
                        </div>
                        <div className="pt-10 pb-6 px-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <span className="text-xs">🇹🇭</span>
                                <span className="text-xs text-gray-500">Thailand</span>
                            </div>
                            <h3 className="text-white font-bold text-lg">Sarah Mitchell</h3>
                            <p className="text-gray-500 text-sm mb-6">@sarah.mitchell</p>
                            <div className="flex justify-between border-t border-gray-800 pt-4 mb-6">
                                <div className="text-center w-1/3">
                                    <div className="text-white font-bold">12</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Countries</div>
                                </div>
                                <div className="text-center w-1/3 border-l border-r border-gray-800">
                                    <div className="text-white font-bold">56</div>
                                    <div className="text-[10px] text-gray-500 uppercase">All media</div>
                                </div>
                                <div className="text-center w-1/3">
                                    <div className="text-white font-bold">5</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Collections</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-light btn-sm flex-1">Follow</button>
                                <button className="btn btn-ghost btn-sm flex-1">Connect</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
