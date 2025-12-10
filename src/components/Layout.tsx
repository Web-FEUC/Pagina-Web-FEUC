import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks, socialLinks, offices } from '../data/constants'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [isCSDropdownOpen, setIsCSDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCSDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isCSDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCSDropdownOpen, isMobileMenuOpen])

  return (
    <div className="min-h-screen text-ink">
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[-5%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-[-10%] top-1/3 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
        </div>

        <header className="relative z-20 mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 md:gap-3" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/assets/logo_feuc.svg" alt="Logo FEUC" className="h-9 w-auto md:h-12" />
              <p className="text-xs md:text-sm font-medium text-ink hidden sm:block">Federación de Estudiantes UC</p>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`transition hover:text-primary ${location.pathname === item.path ? 'text-primary' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setIsCSDropdownOpen(true)}
                onMouseLeave={() => setIsCSDropdownOpen(false)}
              >
                <Link
                  to="/consejeria-superior"
                  className={`transition hover:text-primary ${location.pathname === '/consejeria-superior' ? 'text-primary' : ''}`}
                  onClick={() => setIsCSDropdownOpen(false)}
                >
                  CS
                </Link>
                {isCSDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg border border-slate-200 py-2 z-50">
                    <Link
                      to="/consejeria-superior"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition"
                      onClick={() => setIsCSDropdownOpen(false)}
                    >
                      Consejería Superior
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop Social Links */}
            <div className="hidden items-center gap-4 md:flex">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 transition hover:text-primary"
                  aria-label={social.name}
                >
                  {social.icon === 'instagram' && (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  {social.icon === 'twitter' && (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  {social.icon === 'facebook' && (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-primary transition"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4"
            >
              <nav className="flex flex-col gap-4">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`text-base font-semibold py-2 transition ${
                      location.pathname === item.path
                        ? 'text-primary'
                        : 'text-slate-700 hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/consejeria-superior"
                  className={`text-base font-semibold py-2 transition ${
                    location.pathname === '/consejeria-superior'
                      ? 'text-primary'
                      : 'text-slate-700 hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Consejería Superior (CS)
                </Link>
              </nav>
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-600 transition hover:text-primary"
                    aria-label={social.name}
                  >
                    {social.icon === 'instagram' && (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                    {social.icon === 'twitter' && (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )}
                    {social.icon === 'facebook' && (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </header>

        <main className="relative mx-auto max-w-6xl px-4 md:px-6 pb-12 md:pb-16">
          {children}
        </main>

        <footer className="border-t border-slate-100 bg-white/90">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-8">
            <div className="mb-6 md:mb-8 grid gap-6 md:gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    FE
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">FEUC</p>
                    <p className="text-sm text-slate-600">Construimos comunidad UC</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-ink">Nuestras Oficinas</p>
                  {offices.map((office) => (
                    <p key={office.campus} className="text-xs md:text-sm text-slate-600">
                      <strong>{office.campus}:</strong> {office.location}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-4 text-sm font-semibold text-ink">Enlaces</p>
                <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-slate-600">
                  <Link to="/directiva" className="font-semibold text-primary hover:underline">Directiva</Link>
                  <Link to="/quienes-somos" className="font-semibold text-primary hover:underline">Quiénes Somos</Link>
                  <Link to="/representacion" className="font-semibold text-primary hover:underline">Representación</Link>
                  <Link to="/contacto" className="font-semibold text-primary hover:underline">Contacto</Link>
                  <Link to="/privacidad" className="font-semibold text-primary hover:underline">Política de Privacidad</Link>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 transition hover:text-primary"
                      aria-label={social.name}
                    >
                      {social.icon === 'instagram' && (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      )}
                      {social.icon === 'twitter' && (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      )}
                      {social.icon === 'facebook' && (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
              <p>© 2025 Federación de Estudiantes Universidad Católica de Chile</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

