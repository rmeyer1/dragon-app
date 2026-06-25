import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/yb.jpg';

const Navbar = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  if (isLanding) {
    return null;
  }

  return (
    <header
      className="fixed left-0 top-0 z-50 w-full border-b border-slate-200/70 bg-[#f2f2ed]/86 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <img src={logo} alt="Rob Meyer logo" className="h-9 w-9 rounded-md object-cover" />
          <span className="hidden text-sm font-black uppercase tracking-[0.2em] text-slate-950 sm:inline">
            Rob Meyer
          </span>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
