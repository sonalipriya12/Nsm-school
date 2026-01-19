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

    // Initialize sliders when home page is shown
    if (pageKey === 'home') {
      setTimeout(() => {
        initImageSliders();
      }, 100);
    }
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
            
            // Handle gallery subpages - activate the correct tab
            const subpage = link.dataset.subpage;
            if (pageKey === 'gallery' && subpage) {
              setTimeout(() => {
                // Map subpage to gallery type
                let galleryType = '';
                if (subpage === 'photo-gallery') galleryType = 'photo';
                else if (subpage === 'video-gallery') galleryType = 'video';
                else if (subpage === 'chapter-gallery') galleryType = 'chapter';
                else if (subpage === 'nostalgia-gallery') galleryType = 'nostalgia';
                else if (subpage === 'shop-gallery') galleryType = 'shop';
                
                if (galleryType) {
                  const galleryTabs = document.querySelectorAll<HTMLButtonElement>('.gallery-tab');
                  const gallerySections = document.querySelectorAll<HTMLElement>('.gallery-section');
                  
                  // Update active tab
                  galleryTabs.forEach((tab) => {
                    if (tab.dataset.galleryType === galleryType) {
                      tab.classList.add('active');
                    } else {
                      tab.classList.remove('active');
                    }
                  });
                  
                  // Update active section
                  gallerySections.forEach((section) => section.classList.remove('active'));
                  const targetSection = document.getElementById(`${galleryType}-gallery-section`);
                  if (targetSection) {
                    targetSection.classList.add('active');
                    
                    // If video gallery, populate videos
                    if (galleryType === 'video') {
                      setTimeout(() => {
                        populateVideoGallery();
                      }, 100);
                    }
                  }
                }
              }, 100);
            }

            // Handle reunion subpages - activate the correct tab
            if (pageKey === 'reunion' && subpage) {
              setTimeout(() => {
                let reunionType = '';
                if (subpage === 'about-reunion') reunionType = 'about';
                else if (subpage === 'reunion-gallery') reunionType = 'gallery';
                
                if (reunionType) {
                  const reunionTabs = document.querySelectorAll<HTMLButtonElement>('.gallery-tab[data-reunion-type]');
                  const reunionSections = document.querySelectorAll<HTMLElement>('.reunion-section');
                  
                  // Update active tab
                  reunionTabs.forEach((tab) => {
                    if (tab.dataset.reunionType === reunionType) {
                      tab.classList.add('active');
                    } else {
                      tab.classList.remove('active');
                    }
                  });
                  
                  // Update active section
                  reunionSections.forEach((section) => section.classList.remove('active'));
                  let targetSectionId = '';
                  if (reunionType === 'about') {
                    targetSectionId = 'about-reunion-section';
                  } else if (reunionType === 'gallery') {
                    targetSectionId = 'reunion-gallery-section';
                  }
                  const targetSection = document.getElementById(targetSectionId);
                  if (targetSection) {
                    targetSection.classList.add('active');
                  }
                }
              }, 100);
            }
          }
        }
      }
    });
  });

  // Initialize with 'about' page
  setActivePage('about');
}

// Slider state
let sliderInterval: number | null = null;
let currentSlideIndex = 0;
let homeSliderInterval: number | null = null;
let homeSlideIndex = 0;

// Initialize automatic image sliders
function initImageSliders(): void {
  // Home page slider
  const homeSlides = document.querySelectorAll<HTMLElement>('.home-slide');
  const homeDots = document.querySelectorAll<HTMLElement>('.home-dot');
  
  if (homeSlides.length > 0) {
    // Clear any existing interval
    if (homeSliderInterval !== null) {
      clearInterval(homeSliderInterval);
    }

    const totalHomeSlides = homeSlides.length;
    homeSlideIndex = 0;

    function showHomeSlide(index: number): void {
      homeSlides.forEach((slide) => slide.classList.remove('active'));
      homeDots.forEach((dot) => dot.classList.remove('active'));

      if (homeSlides[index]) {
        homeSlides[index].classList.add('active');
      }
      if (homeDots[index]) {
        homeDots[index].classList.add('active');
      }
    }

    function nextHomeSlide(): void {
      homeSlideIndex = (homeSlideIndex + 1) % totalHomeSlides;
      showHomeSlide(homeSlideIndex);
    }

    // Show first slide
    showHomeSlide(0);

    // Auto-advance slider every 3 seconds (faster)
    homeSliderInterval = window.setInterval(nextHomeSlide, 3000);

    // Add click handlers for dots
    homeDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        homeSlideIndex = index;
        showHomeSlide(homeSlideIndex);
        if (homeSliderInterval !== null) {
          clearInterval(homeSliderInterval);
        }
        homeSliderInterval = window.setInterval(nextHomeSlide, 3000);
      });
    });
  }

  // Center slider (middle box)
  const centerSlides = document.querySelectorAll<HTMLElement>('.center-slide');
  const centerDots = document.querySelectorAll<HTMLElement>('.center-dot');
  const prevCenter = document.querySelector<HTMLElement>('.prev-center');
  const nextCenter = document.querySelector<HTMLElement>('.next-center');
  
  if (centerSlides.length > 0) {
    let centerSliderInterval: number | null = null;
    let centerSlideIndex = 0;

    // Clear any existing interval
    if (centerSliderInterval !== null) {
      clearInterval(centerSliderInterval);
    }

    const totalCenterSlides = centerSlides.length;

    function showCenterSlide(index: number): void {
      centerSlides.forEach((slide) => slide.classList.remove('active'));
      centerDots.forEach((dot) => dot.classList.remove('active'));

      if (centerSlides[index]) {
        centerSlides[index].classList.add('active');
      }
      if (centerDots[index]) {
        centerDots[index].classList.add('active');
      }
    }

    function nextCenterSlide(): void {
      centerSlideIndex = (centerSlideIndex + 1) % totalCenterSlides;
      showCenterSlide(centerSlideIndex);
    }

    function prevCenterSlide(): void {
      centerSlideIndex = (centerSlideIndex - 1 + totalCenterSlides) % totalCenterSlides;
      showCenterSlide(centerSlideIndex);
    }

    // Show first slide
    showCenterSlide(0);

    // Auto-advance slider every 4 seconds
    centerSliderInterval = window.setInterval(nextCenterSlide, 4000);

    // Add click handlers for dots
    centerDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        centerSlideIndex = index;
        showCenterSlide(centerSlideIndex);
        if (centerSliderInterval !== null) {
          clearInterval(centerSliderInterval);
        }
        centerSliderInterval = window.setInterval(nextCenterSlide, 4000);
      });
    });

    // Add click handlers for navigation arrows
    if (nextCenter) {
      nextCenter.addEventListener('click', () => {
        nextCenterSlide();
        if (centerSliderInterval !== null) {
          clearInterval(centerSliderInterval);
        }
        centerSliderInterval = window.setInterval(nextCenterSlide, 4000);
      });
    }

    if (prevCenter) {
      prevCenter.addEventListener('click', () => {
        prevCenterSlide();
        if (centerSliderInterval !== null) {
          clearInterval(centerSliderInterval);
        }
        centerSliderInterval = window.setInterval(nextCenterSlide, 4000);
      });
    }
  }

  // Modern slider
  const sliderContainerModern = document.querySelector('.slider-container-modern');
  const slidesModern = document.querySelectorAll<HTMLElement>('.slide-modern');
  const indicators = document.querySelectorAll<HTMLElement>('.indicator');
  const prevArrow = document.querySelector<HTMLElement>('.prev-arrow');
  const nextArrow = document.querySelector<HTMLElement>('.next-arrow');
  
  if (sliderContainerModern && slidesModern.length > 0) {
    // Clear any existing interval
    if (sliderInterval !== null) {
      clearInterval(sliderInterval);
    }

    const totalSlides = slidesModern.length;
    currentSlideIndex = 0;

    const progressFill = document.querySelector<HTMLElement>('.progress-fill');
    let progressInterval: number | null = null;

    function resetProgress(): void {
      if (progressFill) {
        progressFill.style.width = '0%';
      }
      if (progressInterval !== null) {
        clearInterval(progressInterval);
      }
      let progress = 0;
      progressInterval = window.setInterval(() => {
        progress += 0.2;
        if (progressFill) {
          progressFill.style.width = progress + '%';
        }
        if (progress >= 100) {
          if (progressInterval !== null) {
            clearInterval(progressInterval);
          }
        }
      }, 10);
    }

    function showSlide(index: number): void {
      // Remove active class from all slides and indicators
      slidesModern.forEach((slide) => slide.classList.remove('active'));
      indicators.forEach((indicator) => indicator.classList.remove('active'));

      // Add active class to current slide and indicator
      if (slidesModern[index]) {
        slidesModern[index].classList.add('active');
      }
      if (indicators[index]) {
        indicators[index].classList.add('active');
      }

      // Reset progress bar
      resetProgress();
    }

    function nextSlide(): void {
      currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
      showSlide(currentSlideIndex);
    }

    function prevSlide(): void {
      currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
      showSlide(currentSlideIndex);
    }

    // Show first slide
    showSlide(0);

    // Auto-advance slider every 5 seconds
    sliderInterval = window.setInterval(nextSlide, 5000);

    // Add click handlers for indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        currentSlideIndex = index;
        showSlide(currentSlideIndex);
        // Reset interval
        if (sliderInterval !== null) {
          clearInterval(sliderInterval);
        }
        sliderInterval = window.setInterval(nextSlide, 5000);
        resetProgress();
      });
    });

    // Add click handlers for navigation arrows
    if (nextArrow) {
      nextArrow.addEventListener('click', () => {
        nextSlide();
        if (sliderInterval !== null) {
          clearInterval(sliderInterval);
        }
        sliderInterval = window.setInterval(nextSlide, 5000);
        resetProgress();
      });
    }

    if (prevArrow) {
      prevArrow.addEventListener('click', () => {
        prevSlide();
        if (sliderInterval !== null) {
          clearInterval(sliderInterval);
        }
        sliderInterval = window.setInterval(nextSlide, 5000);
        resetProgress();
      });
    }
  }

  // Legacy slider support (if exists)
  const sliderContainer = document.querySelector('.slider-container');
  const slides = document.querySelectorAll<HTMLElement>('.slide');
  const dots = document.querySelectorAll<HTMLElement>('.dot');
  
  if (sliderContainer && slides.length > 0 && slidesModern.length === 0) {
    // Clear any existing interval
    if (sliderInterval !== null) {
      clearInterval(sliderInterval);
    }

    const totalSlides = slides.length;
    currentSlideIndex = 0;

    function showSlide(index: number): void {
      slides.forEach((slide) => slide.classList.remove('active'));
      dots.forEach((dot) => dot.classList.remove('active'));

      if (slides[index]) {
        slides[index].classList.add('active');
      }
      if (dots[index]) {
        dots[index].classList.add('active');
      }
    }

    function nextSlide(): void {
      currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
      showSlide(currentSlideIndex);
    }

    showSlide(0);
    sliderInterval = window.setInterval(nextSlide, 4000);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlideIndex = index;
        showSlide(currentSlideIndex);
        if (sliderInterval !== null) {
          clearInterval(sliderInterval);
        }
        sliderInterval = window.setInterval(nextSlide, 4000);
      });
    });
  }

  // Duplicate thumbnails for seamless loop
  const thumbnailContainer = document.querySelector('.thumbnail-container');
  if (thumbnailContainer) {
    const existingSlides = thumbnailContainer.querySelectorAll('.thumbnail-slide');
    if (existingSlides.length <= 7) {
      existingSlides.forEach((slide) => {
        const clone = slide.cloneNode(true) as HTMLElement;
        thumbnailContainer.appendChild(clone);
      });
    }
  }
}

// Gallery Tab Switching
function initGalleryTabs(): void {
  const galleryTabs = document.querySelectorAll<HTMLButtonElement>('.gallery-tab[data-gallery-type]');
  const gallerySections = document.querySelectorAll<HTMLElement>('.gallery-section');

  galleryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const galleryType = tab.dataset.galleryType;

      // Update active tab
      galleryTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active section
      gallerySections.forEach((section) => section.classList.remove('active'));
      const targetSection = document.getElementById(`${galleryType}-gallery-section`);
      if (targetSection) {
        targetSection.classList.add('active');
        
        // If video gallery is activated, populate videos
        if (galleryType === 'video') {
          setTimeout(() => {
            populateVideoGallery();
          }, 100);
        }
      }
    });
  });
}

// Reunion Tab Switching
function initReunionTabs(): void {
  const reunionTabs = document.querySelectorAll<HTMLButtonElement>('.gallery-tab[data-reunion-type]');
  const reunionSections = document.querySelectorAll<HTMLElement>('.reunion-section');

  reunionTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const reunionType = tab.dataset.reunionType;

      // Update active tab
      reunionTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active section
      reunionSections.forEach((section) => section.classList.remove('active'));
      let targetSectionId = '';
      if (reunionType === 'about') {
        targetSectionId = 'about-reunion-section';
      } else if (reunionType === 'gallery') {
        targetSectionId = 'reunion-gallery-section';
      }
      const targetSection = document.getElementById(targetSectionId);
      if (targetSection) {
        targetSection.classList.add('active');
        
        // Force images to load when gallery section is shown
        if (reunionType === 'gallery') {
          setTimeout(() => {
            const images = targetSection.querySelectorAll<HTMLImageElement>('.reunion-year-image');
            images.forEach((img) => {
              if (img.dataset.src) {
                img.src = img.dataset.src;
              }
              // Force image reload
              const src = img.src;
              img.src = '';
              img.src = src;
            });
          }, 100);
        }
      }
    });
  });
}

function initConnectTabs(): void {
  const connectTabs = document.querySelectorAll<HTMLButtonElement>('.gallery-tab[data-connect-type]');
  const connectSections = document.querySelectorAll<HTMLElement>('.connect-section');

  connectTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const connectType = tab.dataset.connectType;

      // Update active tab
      connectTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active section
      connectSections.forEach((section) => section.classList.remove('active'));
      const targetSectionId = connectType + '-connect-section';
      const targetSection = document.getElementById(targetSectionId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });
}

// Chapter Type Tab Switching
function initChapterTabs(): void {
  const chapterTabs = document.querySelectorAll<HTMLButtonElement>('.chapter-tab');
  const chapterSections = document.querySelectorAll<HTMLElement>('.chapter-section');

  chapterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const chapterType = tab.dataset.chapterType;
      const nostalgiaType = tab.dataset.nostalgiaType;
      const shopType = tab.dataset.shopType;

      // Update active tab
      chapterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active section based on which gallery we're in
      if (chapterType) {
        chapterSections.forEach((section) => section.classList.remove('active'));
        const targetSection = document.getElementById(`${chapterType}-chapters-section`);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      } else if (nostalgiaType) {
        chapterSections.forEach((section) => section.classList.remove('active'));
        const targetSection = document.getElementById(`${nostalgiaType}-nostalgia-section`);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      } else if (shopType) {
        chapterSections.forEach((section) => section.classList.remove('active'));
        const targetSection = document.getElementById(`${shopType}-shop-section`);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      }
    });
  });
}

// Year Photo Gallery Functionality
function initYearPhotoGallery(): void {
  const viewLinks = document.querySelectorAll<HTMLAnchorElement>('.view-link[data-year][data-type="photo"]');
  const modal = document.getElementById('year-photo-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOverlay = modal?.querySelector<HTMLElement>('.modal-overlay');
  const modalYear = document.getElementById('modal-year');
  const photosGrid = document.getElementById('year-photos-grid');
  const prevYearBtn = document.getElementById('prev-year-btn');
  const nextYearBtn = document.getElementById('next-year-btn');

  let currentYear = 2025;

  // Photo URLs for different years (using different Unsplash images for variety)
  const yearPhotos: Record<number, string[]> = {
    2025: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=95&auto=format&fit=crop',
    ],
    2024: [
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=95&auto=format&fit=crop',
    ],
    2023: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=95&auto=format&fit=crop',
    ],
  };

  // Generate photos for all years (1993-2025)
  function generateYearPhotos(year: number): string[] {
    // If specific photos exist, use them
    if (yearPhotos[year]) {
      return yearPhotos[year];
    }
    
    // Otherwise, generate different photos based on year
    // Using different image IDs to ensure variety
    const baseImages = [
      '1523050854058-8df90110c9f1',
      '1516321318423-f06f85e504b3',
      '1522202176988-66273c2fd55f',
      '1529390079861-591de354faf5',
      '1541339907198-e08756dedf3f',
      '1509062522246-3755977927d7',
      '1517486808906-6ca8b3f04846',
      '1497633762265-9d179a990aa6',
      '1503676260728-1c00da094a0b',
      '1517245386807-bb43f82c33c4',
      '1524178232363-1fb2b075b655',
      '1511578314322-379afb476865',
    ];
    
    // Use year to determine which images to show (ensures different photos per year)
    const yearOffset = year % baseImages.length;
    return baseImages.map((_imgId, index) => {
      const selectedIndex = (index + yearOffset) % baseImages.length;
      return `https://images.unsplash.com/photo-${baseImages[selectedIndex]}?w=800&q=95&auto=format&fit=crop`;
    });
  }

  function openYearModal(year: number): void {
    currentYear = year;
    if (!modal || !modalYear || !photosGrid) return;

    // Update year title
    modalYear.textContent = year.toString();

    // Clear existing photos
    photosGrid.innerHTML = '';

    // Get photos for this year
    const photos = generateYearPhotos(year);

    // Add photos to grid
    photos.forEach((photoUrl, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'year-photo-item';
      photoItem.innerHTML = `<img src="${photoUrl}" alt="NSM ${year} Photo ${index + 1}" loading="lazy">`;
      photosGrid.appendChild(photoItem);
    });

    // Update navigation buttons
    if (prevYearBtn) {
      (prevYearBtn as HTMLButtonElement).disabled = year <= 1993;
    }
    if (nextYearBtn) {
      (nextYearBtn as HTMLButtonElement).disabled = year >= 2025;
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeYearModal(): void {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateYear(direction: 'prev' | 'next'): void {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
    if (newYear >= 1993 && newYear <= 2025) {
      openYearModal(newYear);
    }
  }

  // Add event listeners
  viewLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const year = parseInt(link.dataset.year || '2025', 10);
      openYearModal(year);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeYearModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeYearModal);
  }

  if (prevYearBtn) {
    prevYearBtn.addEventListener('click', () => navigateYear('prev'));
  }

  if (nextYearBtn) {
    nextYearBtn.addEventListener('click', () => navigateYear('next'));
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeYearModal();
    }
  });
}

// Video Gallery - Direct Display Functionality
function populateVideoGallery(): void {
  const videosGrid = document.getElementById('videos-direct-grid');
  if (!videosGrid) return;

  // Don't populate if already populated
  if (videosGrid.children.length > 0) return;

  // Different YouTube video IDs for variety
  const allVideos = [
    'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
    'jNQXAC9IVRw', // Me at the zoo
    'kJQP7kiw5Fk', // PSY - GANGNAM STYLE
    '9bZkp7q19f0', // PSY - GENTLEMAN
    'L_jWHffIx5E', // Smosh - Food Battle 2010
    'fJ9rUzIMcZQ', // Evolution of Dance
    'ZbZSe6N_BXs', // Charlie bit my finger
    'a1Y73sPHKxw', // The Gummy Bear Song
    'OPf0YbXqDm0', // Mark Ronson - Uptown Funk
    'kXYiU_JCYtU', // Linkin Park - Numb
    'YQHsXMglC9A', // Adele - Hello
    '9bZkp7q19f0', // PSY - GENTLEMAN
    'dQw4w9WgXcQ', // Rick Astley
    'jNQXAC9IVRw', // Me at the zoo
    'kJQP7kiw5Fk', // PSY - GANGNAM STYLE
    'L_jWHffIx5E', // Smosh
    'fJ9rUzIMcZQ', // Evolution of Dance
    'ZbZSe6N_BXs', // Charlie bit my finger
  ];

  // Add all videos to grid
  allVideos.forEach((videoId, index) => {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-direct-item';
    videoItem.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${videoId}" 
        title="NSM Video ${index + 1}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
        loading="lazy">
      </iframe>
    `;
    videosGrid.appendChild(videoItem);
  });
}

// Legacy function name for compatibility
function initYearVideoGallery(): void {
  populateVideoGallery();
}

// Year Chapter Gallery Functionality
function initYearChapterGallery(): void {
  const viewLinks = document.querySelectorAll<HTMLAnchorElement>('.view-link[data-year][data-type="chapter"]');
  const modal = document.getElementById('year-chapter-modal');
  const modalCloseBtn = document.getElementById('modal-chapter-close-btn');
  const modalOverlay = modal?.querySelector<HTMLElement>('.modal-overlay');
  const modalYear = document.getElementById('modal-chapter-year');
  const modalChapterType = document.getElementById('modal-chapter-type');
  const photosGrid = document.getElementById('year-chapter-photos-grid');
  const prevYearBtn = document.getElementById('prev-chapter-year-btn');
  const nextYearBtn = document.getElementById('next-chapter-year-btn');

  let currentYear = 2025;
  let currentChapterType = 'all';

  // Different photos for India vs International chapters
  // India: summits, awards, events, seating arrangements
  const indiaChapterPhotos: Record<number, string[]> = {
    2025: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=95&auto=format&fit=crop', // Award ceremony
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=95&auto=format&fit=crop', // Group meeting
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=95&auto=format&fit=crop', // Conference
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=95&auto=format&fit=crop', // Seminar
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=95&auto=format&fit=crop', // Event
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=95&auto=format&fit=crop', // Summit
    ],
    2024: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=95&auto=format&fit=crop',
    ],
  };

  // International: similar but different photos
  const internationalChapterPhotos: Record<number, string[]> = {
    2025: [
      'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=95&auto=format&fit=crop', // Graduation
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=95&auto=format&fit=crop', // Award
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=95&auto=format&fit=crop', // Meeting
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=95&auto=format&fit=crop', // Conference
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=95&auto=format&fit=crop', // Seminar
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=95&auto=format&fit=crop', // Event
    ],
    2024: [
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=95&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=95&auto=format&fit=crop',
    ],
  };

  // Generate photos for all years (2016-2025)
  function generateChapterPhotos(year: number, chapterType: string): string[] {
    const baseImages = [
      '1516321318423-f06f85e504b3',
      '1522202176988-66273c2fd55f',
      '1523050854058-8df90110c9f1',
      '1541339907198-e08756dedf3f',
      '1509062522246-3755977927d7',
      '1517486808906-6ca8b3f04846',
      '1497633762265-9d179a990aa6',
      '1503676260728-1c00da094a0b',
      '1517245386807-bb43f82c33c4',
      '1524178232363-1fb2b075b655',
      '1511578314322-379afb476865',
      '1529390079861-591de354faf5',
    ];

    if (chapterType === 'india') {
      if (indiaChapterPhotos[year]) {
        return indiaChapterPhotos[year];
      }
      // Generate India-specific photos
      const yearOffset = year % baseImages.length;
      return baseImages.map((_imgId, index) => {
        const selectedIndex = (index + yearOffset) % baseImages.length;
        return `https://images.unsplash.com/photo-${baseImages[selectedIndex]}?w=800&q=95&auto=format&fit=crop`;
      });
    } else if (chapterType === 'international') {
      if (internationalChapterPhotos[year]) {
        return internationalChapterPhotos[year];
      }
      // Generate International-specific photos (different order)
      const yearOffset = (year + 5) % baseImages.length;
      return baseImages.map((_imgId, index) => {
        const selectedIndex = (index + yearOffset + 3) % baseImages.length;
        return `https://images.unsplash.com/photo-${baseImages[selectedIndex]}?w=800&q=95&auto=format&fit=crop`;
      });
    } else {
      // All chapters - mix of both
      const yearOffset = year % baseImages.length;
      return baseImages.map((_imgId, index) => {
        const selectedIndex = (index + yearOffset) % baseImages.length;
        return `https://images.unsplash.com/photo-${baseImages[selectedIndex]}?w=800&q=95&auto=format&fit=crop`;
      });
    }
  }

  function openYearModal(year: number, chapterType: string): void {
    currentYear = year;
    currentChapterType = chapterType;
    if (!modal || !modalYear || !modalChapterType || !photosGrid) return;

    // Update year and chapter type title
    modalYear.textContent = year.toString();
    const chapterTypeName = chapterType === 'india' ? 'India' : chapterType === 'international' ? 'International' : 'All Chapters';
    modalChapterType.textContent = chapterTypeName;

    // Clear existing photos
    photosGrid.innerHTML = '';

    // Get photos for this year and chapter type
    const photos = generateChapterPhotos(year, chapterType);

    // Add photos to grid
    photos.forEach((photoUrl, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'year-photo-item';
      photoItem.innerHTML = `<img src="${photoUrl}" alt="NSM ${chapterTypeName} ${year} Photo ${index + 1}" loading="lazy">`;
      photosGrid.appendChild(photoItem);
    });

    // Update navigation buttons
    if (prevYearBtn) {
      (prevYearBtn as HTMLButtonElement).disabled = year <= 2016;
    }
    if (nextYearBtn) {
      (nextYearBtn as HTMLButtonElement).disabled = year >= 2025;
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeYearModal(): void {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateYear(direction: 'prev' | 'next'): void {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
    if (newYear >= 2016 && newYear <= 2025) {
      openYearModal(newYear, currentChapterType);
    }
  }

  // Add event listeners
  viewLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const year = parseInt(link.dataset.year || '2025', 10);
      const chapterType = link.dataset.chapter || 'all';
      openYearModal(year, chapterType);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeYearModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeYearModal);
  }

  if (prevYearBtn) {
    prevYearBtn.addEventListener('click', () => navigateYear('prev'));
  }

  if (nextYearBtn) {
    nextYearBtn.addEventListener('click', () => navigateYear('next'));
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeYearModal();
    }
  });
}

// Year Nostalgia Gallery Functionality
function initYearNostalgiaGallery(): void {
  const viewLinks = document.querySelectorAll<HTMLAnchorElement>('.view-link[data-year][data-type="nostalgia"]');
  const modal = document.getElementById('year-nostalgia-modal');
  const modalCloseBtn = document.getElementById('modal-nostalgia-close-btn');
  const modalOverlay = modal?.querySelector<HTMLElement>('.modal-overlay');
  const modalYear = document.getElementById('modal-nostalgia-year');
  const modalNostalgiaType = document.getElementById('modal-nostalgia-type');
  const photosGrid = document.getElementById('year-nostalgia-photos-grid');
  const prevYearBtn = document.getElementById('prev-nostalgia-year-btn');
  const nextYearBtn = document.getElementById('next-nostalgia-year-btn');

  let currentYear = 2025;
  let currentNostalgiaType = 'all';

  function generateNostalgiaPhotos(year: number, nostalgiaType: string): string[] {
    const baseImages = [
      '1516321318423-f06f85e504b3',
      '1522202176988-66273c2fd55f',
      '1523050854058-8df90110c9f1',
      '1541339907198-e08756dedf3f',
      '1509062522246-3755977927d7',
      '1517486808906-6ca8b3f04846',
      '1497633762265-9d179a990aa6',
      '1503676260728-1c00da094a0b',
      '1517245386807-bb43f82c33c4',
      '1524178232363-1fb2b075b655',
      '1511578314322-379afb476865',
      '1529390079861-591de354faf5',
    ];

    const yearOffset = nostalgiaType === 'india' ? year % baseImages.length : (year + 7) % baseImages.length;
    return baseImages.map((_imgId, index) => {
      const selectedIndex = (index + yearOffset) % baseImages.length;
      return `https://images.unsplash.com/photo-${baseImages[selectedIndex]}?w=800&q=95&auto=format&fit=crop`;
    });
  }

  function openYearModal(year: number, nostalgiaType: string): void {
    currentYear = year;
    currentNostalgiaType = nostalgiaType;
    if (!modal || !modalYear || !modalNostalgiaType || !photosGrid) return;

    modalYear.textContent = year.toString();
    const typeName = nostalgiaType === 'india' ? 'India' : nostalgiaType === 'international' ? 'International' : 'All';
    modalNostalgiaType.textContent = typeName;

    photosGrid.innerHTML = '';
    const photos = generateNostalgiaPhotos(year, nostalgiaType);

    photos.forEach((photoUrl, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'year-photo-item';
      photoItem.innerHTML = `<img src="${photoUrl}" alt="NSM Nostalgia ${typeName} ${year} Photo ${index + 1}" loading="lazy">`;
      photosGrid.appendChild(photoItem);
    });

    if (prevYearBtn) (prevYearBtn as HTMLButtonElement).disabled = year <= 1993;
    if (nextYearBtn) (nextYearBtn as HTMLButtonElement).disabled = year >= 2025;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeYearModal(): void {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateYear(direction: 'prev' | 'next'): void {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
    if (newYear >= 1993 && newYear <= 2025) {
      openYearModal(newYear, currentNostalgiaType);
    }
  }

  viewLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const year = parseInt(link.dataset.year || '2025', 10);
      const nostalgiaType = link.dataset.nostalgia || 'all';
      openYearModal(year, nostalgiaType);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeYearModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeYearModal);
  if (prevYearBtn) prevYearBtn.addEventListener('click', () => navigateYear('prev'));
  if (nextYearBtn) nextYearBtn.addEventListener('click', () => navigateYear('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeYearModal();
    }
  });
}

// Year Reunion Gallery Functionality
function initYearReunionGallery(): void {
  const viewLinks = document.querySelectorAll<HTMLAnchorElement>('.view-link[data-year][data-type="reunion"]');
  const modal = document.getElementById('year-reunion-modal');
  const modalCloseBtn = document.getElementById('modal-reunion-close-btn');
  const modalOverlay = modal?.querySelector<HTMLElement>('.modal-overlay');
  const modalYear = document.getElementById('modal-reunion-year');
  const photosGrid = document.getElementById('year-reunion-photos-grid');
  const prevYearBtn = document.getElementById('prev-reunion-year-btn');
  const nextYearBtn = document.getElementById('next-reunion-year-btn');

  let currentYear = 2025;
  const availableYears = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993];

  function generateReunionPhotos(year: number): string[] {
    // Reunion-specific photos - people gathering, celebrations, group photos
    const baseImages = [
      '1522202176988-66273c2fd55f', // Group meeting
      '1516321318423-f06f85e504b3', // Award ceremony
      '1523050854058-8df90110c9f1', // Conference
      '1529390079861-591de354faf5', // Graduation
      '1541339907198-e08756dedf3f', // Seminar
      '1509062522246-3755977927d7', // Event
      '1517486808906-6ca8b3f04846', // Campus
      '1497633762265-9d179a990aa6', // Library
      '1503676260728-1c00da094a0b', // Meeting
      '1517245386807-bb43f82c33c4', // Discussion
      '1524178232363-1fb2b075b655', // Group
      '1511578314322-379afb476865', // Collaboration
    ];

    const yearOffset = year % baseImages.length;
    return baseImages.map((_imgId, index) => {
      const selectedIndex = (index + yearOffset) % baseImages.length;
      return `https://images.unsplash.com/photo-${baseImages[selectedIndex]}?w=800&q=95&auto=format&fit=crop`;
    });
  }

  function openYearModal(year: number): void {
    currentYear = year;
    if (!modal || !modalYear || !photosGrid) return;

    modalYear.textContent = year.toString();
    photosGrid.innerHTML = '';
    const photos = generateReunionPhotos(year);

    photos.forEach((photoUrl, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'year-photo-item';
      photoItem.innerHTML = `<img src="${photoUrl}" alt="NSM Reunion ${year} Photo ${index + 1}" loading="lazy">`;
      photosGrid.appendChild(photoItem);
    });

    const currentIndex = availableYears.indexOf(year);
    if (prevYearBtn) (prevYearBtn as HTMLButtonElement).disabled = currentIndex <= 0;
    if (nextYearBtn) (nextYearBtn as HTMLButtonElement).disabled = currentIndex >= availableYears.length - 1;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeYearModal(): void {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateYear(direction: 'prev' | 'next'): void {
    const currentIndex = availableYears.indexOf(currentYear);
    if (currentIndex === -1) return;

    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < availableYears.length) {
      openYearModal(availableYears[newIndex]);
    }
  }

  viewLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const year = parseInt(link.dataset.year || '2025', 10);
      openYearModal(year);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeYearModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeYearModal);
  if (prevYearBtn) prevYearBtn.addEventListener('click', () => navigateYear('prev'));
  if (nextYearBtn) nextYearBtn.addEventListener('click', () => navigateYear('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeYearModal();
    }
  });
}

// Year Shop@1925 Gallery Functionality
function initYearShopGallery(): void {
  const viewLinks = document.querySelectorAll<HTMLAnchorElement>('.view-link[data-year][data-type="shop"]');
  const modal = document.getElementById('year-shop-modal');
  const modalCloseBtn = document.getElementById('modal-shop-close-btn');
  const modalOverlay = modal?.querySelector<HTMLElement>('.modal-overlay');
  const modalYear = document.getElementById('modal-shop-year');
  const modalShopType = document.getElementById('modal-shop-type');
  const photosGrid = document.getElementById('year-shop-photos-grid');
  const prevYearBtn = document.getElementById('prev-shop-year-btn');
  const nextYearBtn = document.getElementById('next-shop-year-btn');

  let currentYear = 2025;
  let currentShopType = 'all';

  function generateShopPhotos(year: number, shopType: string): string[] {
    const baseImages = [
      '1516321318423-f06f85e504b3',
      '1522202176988-66273c2fd55f',
      '1523050854058-8df90110c9f1',
      '1541339907198-e08756dedf3f',
      '1509062522246-3755977927d7',
      '1517486808906-6ca8b3f04846',
      '1497633762265-9d179a990aa6',
      '1503676260728-1c00da094a0b',
      '1517245386807-bb43f82c33c4',
      '1524178232363-1fb2b075b655',
      '1511578314322-379afb476865',
      '1529390079861-591de354faf5',
    ];

    const yearOffset = shopType === 'india' ? (year + 3) % baseImages.length : (year + 9) % baseImages.length;
    return baseImages.map((_imgId, index) => {
      const selectedIndex = (index + yearOffset) % baseImages.length;
      return `https://images.unsplash.com/photo-${baseImages[selectedIndex]}?w=800&q=95&auto=format&fit=crop`;
    });
  }

  function openYearModal(year: number, shopType: string): void {
    currentYear = year;
    currentShopType = shopType;
    if (!modal || !modalYear || !modalShopType || !photosGrid) return;

    modalYear.textContent = year.toString();
    const typeName = shopType === 'india' ? 'India' : shopType === 'international' ? 'International' : 'All';
    modalShopType.textContent = typeName;

    photosGrid.innerHTML = '';
    const photos = generateShopPhotos(year, shopType);

    photos.forEach((photoUrl, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'year-photo-item';
      photoItem.innerHTML = `<img src="${photoUrl}" alt="NSM Shop@1925 ${typeName} ${year} Photo ${index + 1}" loading="lazy">`;
      photosGrid.appendChild(photoItem);
    });

    if (prevYearBtn) (prevYearBtn as HTMLButtonElement).disabled = year <= 1993;
    if (nextYearBtn) (nextYearBtn as HTMLButtonElement).disabled = year >= 2025;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeYearModal(): void {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateYear(direction: 'prev' | 'next'): void {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
    if (newYear >= 1993 && newYear <= 2025) {
      openYearModal(newYear, currentShopType);
    }
  }

  viewLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const year = parseInt(link.dataset.year || '2025', 10);
      const shopType = link.dataset.shop || 'all';
      openYearModal(year, shopType);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeYearModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeYearModal);
  if (prevYearBtn) prevYearBtn.addEventListener('click', () => navigateYear('prev'));
  if (nextYearBtn) nextYearBtn.addEventListener('click', () => navigateYear('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeYearModal();
    }
  });
}

// Contact Form Functionality
function initContactForm(): void {
  const contactForm = document.getElementById('contact-form') as HTMLFormElement;
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject: Record<string, string> = {};
    formData.forEach((value, key) => {
      formObject[key] = value.toString();
    });

    // Show success message (in a real app, this would send to a server)
    const submitBtn = contactForm.querySelector('.submit-btn') as HTMLButtonElement;
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
    submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    submitBtn.disabled = true;

    // Reset form after 2 seconds
    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      
      // Show alert (in production, this would be a proper notification)
      alert('Thank you for your message! We will get back to you soon.');
    }, 2000);

    // In a real application, you would send the data to a server:
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formObject)
    // })
    // .then(response => response.json())
    // .then(data => {
    //   // Handle success
    // })
    // .catch(error => {
    //   // Handle error
    // });
  });
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initGalleryTabs();
    initReunionTabs();
    initConnectTabs();
    initChapterTabs();
    initYearPhotoGallery();
    initYearVideoGallery();
    initYearChapterGallery();
    initYearNostalgiaGallery();
    initYearShopGallery();
    initYearReunionGallery();
    initContactForm();
  });
} else {
  initApp();
  initGalleryTabs();
  initReunionTabs();
  initConnectTabs();
  initChapterTabs();
  initYearPhotoGallery();
  initYearVideoGallery();
  initYearChapterGallery();
  initYearNostalgiaGallery();
  initYearShopGallery();
  initYearReunionGallery();
  initContactForm();
}


