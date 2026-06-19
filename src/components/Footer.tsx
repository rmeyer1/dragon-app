import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-[#f2f2ed] px-5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; 2026 Rob Meyer
        </p>
        <p>
          Built for QR scans, quick context, and useful follow-up.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
