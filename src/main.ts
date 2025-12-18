import './styles.css';
import type { PageKey } from './types';

// Type guard to check if a string is a valid PageKey
function isValidPageKey(key: string | undefined): key is PageKey {
  const validKeys: PageKey[] = [
    'about',
    'connect',
    'gallery',
    'alumni-day',
    'events',
    'reunion',
    'faq',
    'contact',
    'home',
  ];
  return key !== undefined && validKeys.includes(key as PageKey);
}

// Initialize the application
function initApp(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(
    '.nav-item > a[data-page]',
  );
  const heroTitle = document.getElementById('hero-title') as HTMLHeadingElement | null;
  const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>('.sidebar-link');

  const pageSections: Record<PageKey, HTMLElement | null> = {
    home: document.getElementById('page-home'),
    about: document.getElementById('page-about'),
    connect: document.getElementById('page-connect'),
    gallery: document.getElementById('page-gallery'),
    'alumni-day': document.getElementById('page-alumni-day'),
    events: document.getElementById('page-events'),
    reunion: document.getElementById('page-reunion'),
    faq: document.getElementById('page-faq'),
    contact: document.getElementById('page-contact'),
  };

  const heroTitles: Record<PageKey, string> = {
    about: 'ABOUT NSM',
    connect: 'NSM ALUMNI CONNECT',
    gallery: 'PHOTO GALLERY',
    'alumni-day': 'NSM ALUMNI DAY',
    events: 'NSM ALUMNI EVENTS',
    reunion: 'RE-UNION',
    faq: "FAQ'S",
    contact: 'CONTACT US',
    home: 'NSM ALUMNI ASSOCIATION',
  };

  function setActivePage(pageKey: PageKey): void {
    // Update navigation links
    navLinks.forEach((link) => {
      const parent = link.closest<HTMLElement>('.nav-item');
      if (!parent) return;
      if (link.dataset.page === pageKey) {
        parent.classList.add('active');
      } else {
        parent.classList.remove('active');
      }
    });

    // Update sidebar links
    sidebarLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.textContent?.trim() === 'About NSM' && pageKey === 'about') {
        link.classList.add('active');
      }
    });

    // Update hero title
    if (heroTitle && heroTitles[pageKey]) {
      heroTitle.textContent = heroTitles[pageKey];
    }

    // Show/hide page sections
    (Object.entries(pageSections) as [PageKey, HTMLElement | null][]).forEach(
      ([key, el]) => {
        if (!el) return;
        el.classList.toggle('visible', key === pageKey);
      },
    );
  }

  // Handle navigation link clicks
  navLinks.forEach((link) => {
    link.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      const pageKey = link.dataset.page;
      if (isValidPageKey(pageKey)) {
        setActivePage(pageKey);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Handle sidebar link clicks
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      // Map sidebar links to page keys
      const linkText = link.textContent?.trim();
      let targetPage: PageKey | null = null;

      if (linkText === 'About NSM') targetPage = 'about';
      // Add more mappings as needed

      if (targetPage) {
        setActivePage(targetPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Handle dropdown subpage links
  const dropdownLinks = document.querySelectorAll<HTMLAnchorElement>(
    '.dropdown-item[data-subpage]',
  );
  dropdownLinks.forEach((link) => {
    link.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      const parentNav = link.closest<HTMLElement>('.nav-item');
      if (parentNav) {
        const mainLink = parentNav.querySelector<HTMLAnchorElement>('a[data-page]');
        if (mainLink) {
          const pageKey = mainLink.dataset.page;
          if (isValidPageKey(pageKey)) {
            setActivePage(pageKey);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    });
  });

  // Initialize with 'about' page
  setActivePage('about');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}


