"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative py-12 lg:py-24 px-4 md:px-8 lg:px-24 bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="max-w-[1800px] mx-auto">
        {/* Big logo */}
        <div className="mb-10 lg:mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold tracking-[-0.04em] uppercase">
            Fashion
            <span className="text-[#ff3d00]">360</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-8 mb-10 lg:mb-16">
          <div>
            <h4 className="text-xs lg:text-sm uppercase tracking-widest text-[#a3a3a3] mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Designers", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "Stories", href: "#" },
                { label: "About", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm lg:text-lg hover:text-[#ff3d00] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs lg:text-sm uppercase tracking-widest text-[#a3a3a3] mb-4">
              Connect
            </h4>
            <ul className="space-y-3">
              {["Instagram", "Facebook", "TikTok", "LinkedIn"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm lg:text-lg hover:text-[#ff3d00] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs lg:text-sm uppercase tracking-widest text-[#a3a3a3] mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm lg:text-lg text-[#666] hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs lg:text-sm uppercase tracking-widest text-[#a3a3a3] mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-[#a3a3a3] mb-4">
              Stay updated with the latest in Israeli fashion.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 bg-[#1a1a1a] border border-[#333] px-3 lg:px-4 py-3 text-sm focus:outline-none focus:border-[#ff3d00] transition-colors"
              />
              <button className="bg-[#ff3d00] px-4 lg:px-6 py-3 text-sm uppercase tracking-widest hover:bg-[#ff5722] transition-colors flex-shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 lg:pt-8 border-t border-[#1a1a1a] gap-4">
          <p className="text-xs lg:text-sm text-[#666] text-center md:text-left">
            © 2024 Fashion 360. All rights reserved.
          </p>
          <p className="text-xs lg:text-sm text-[#666]">
            A project by Tel Aviv Fashion Week
          </p>
        </div>
      </div>
    </footer>
  );
}
