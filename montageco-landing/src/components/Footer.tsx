export function Footer() {
  return (
    <footer className="bg-ink px-4 sm:px-8 py-10 text-center text-xs sm:text-sm text-[#888]">
      <p className="uppercase tracking-widest">
        Montage Co™ — Be Kind, Please Rewind
      </p>
      <p className="mt-2">
        © 1987–{new Date().getFullYear()} Montage Co. All montages performed by professionals.
        Do not attempt life changes in under 4 minutes without supervision.
      </p>
    </footer>
  );
}
