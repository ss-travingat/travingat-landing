export default function CTA() {
    return (
        <section className="py-12 md:py-16 bg-black">
            <div className="relative rounded-none md:rounded-3xl overflow-hidden md:mx-8 lg:mx-16" style={{ minHeight: '500px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/image.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

            <div className="absolute inset-0 z-10 flex items-center justify-center py-16 md:py-24 px-5 md:px-4">
                <div className="max-w-4xl mx-auto text-center w-full">
                <div className="flex justify-center -space-x-3 mb-8">
                    <img alt="User" className="w-16 h-16 rounded-2xl border-2 border-black object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0YJd4NIF9HkxnX-vnOsZaU-QdFWkT9m6XAUY2sIApJ6Wyp8-pdfWGsNu7lM_B5k0pxVh_nooO0ZqjHpyY7cg22I0o9mNcFK8MbQVJH5F7YS03UE34rjG3JQdxtU6bRyiBoVXMhDm_LdJNZMWBpToAlA1AfYFSnwW76DoAGiKNgl7n6O1BMTGtvy6eHbevwR7pHqs0TO__JX5g4sSzOPN7a1rk5Th2kMwowkm0W9ci3-hIpxahohfz_7Ka26bF5fZ3cAGtm_asWRpc" />
                    <img alt="User" className="w-16 h-16 rounded-2xl border-2 border-black object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoGr0sy0A1f7jLOWH-u1y1AGgKL9bDCn3uMNDa3hfbWcbwebmLVGBX1ougO-RCRK190lWhqcntZh2TYi06GNEQzNVfyuanZblzLlOOas1T2oswWDDOb1An8kcVpLdDrSpARKhNHJr1Jq0uUORA-DvmEFvonGXkGvHVwFLZDiOXhtCdaoyFi-HrGIrkEGX5ZqlNERpTsRRDqatNZx2TSWmlpBdY_q0yi6GWCezua0NU7ecz_jpaBTx5T4MKukfEC-uNbFvAMOxM0ek4" />
                    <img alt="User" className="w-16 h-16 rounded-2xl border-2 border-black object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAs1KkHFWhElng-xn-i6rKUb0NVQm20LLq5Elsg24QjT4HDG0ggnDTEKgs7O-Psl9Eptf3SyVDbdzZ_HZIMdyd-3eU_Vit5VVNJt1UCThvuxBwWDakmD7ZP2EFVToNQ1A7BrCcOwYGF4pq1PfH1CTTXwcOLWMYcGdDA-wRENDpWWZwkGGrEilxIlLMdfin1ZbwkiWbRvumW_sFTQ1XWmjNjDz2HbkIc8bX4E54vuR-chbAWm3dIAollA4Zy79Inxs7sC4pxlzeYVul" />
                    <img alt="User" className="w-16 h-16 rounded-2xl border-2 border-black object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMV0whpO6f1kXyN6qZwYFnLamLd40qAoAIM5eQl9Kjc2fdrUPbDF4EQpbB6FXTQj5kKUPY0mVJ_ZaRpVDUJmFA0wevCKS9t4PERBR1nybivPTnxCygPsvQ1rhqgC-cfwXqJp40CHPuMlyPNLeYj5on6j9wSswrcu3MlQByI8YoqK1u7sLb9kNk3JjzumQSl19mGb5yOZjeeoerMcKfA5aI6xJ1kJt5ttbQXYZ4bhXcwsIJaVniygYUKBTBfApUHfDt-uT30py2rZ1V" />
                </div>
                <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Join travelers from around<br />the world.
                </h2>
                <p className="text-white text-sm md:text-base mb-8 md:mb-10">Be first to build and share your travel profile.</p>
                <div className="flex flex-col items-center justify-center gap-3 md:gap-4 max-w-md mx-auto">
                    <input className="w-full bg-transparent border border-gray-700 text-white rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500 text-sm md:text-base" placeholder="Enter your email" type="email" />
                    <button className="btn btn-light btn-lg w-full">
                        Get early access
                    </button>
                </div>
                </div>
            </div>
            </div>
        </section>
    );
}
