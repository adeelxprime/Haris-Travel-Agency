/**
 * Haris Travel Agency - Blazing Fast Main Website JavaScript
 * Optimized for 0ms First Paint, Cache-First SWR, and Direct Cloud Sync.
 */

(function () {
  'use strict';

  // Fallback default state with complete 10 services & 8 destinations
  const DEFAULT_DATA = {
    agency: {
      name: "Haris Travel Agency",
      tagline: "Your Journey, Our Responsibility",
      owner: "Haris Khan",
      role: "Proprietor",
      phone: "+92 314 2554547",
      phoneClean: "+923142554547",
      whatsapp: "923142554547",
      email: "hariskhan070@gmail.com",
      address: "Gulshan-e-Iqbal, Karachi, Pakistan",
      googleReviewLink: "https://www.google.com/maps/search/Haris+Travel+Agency+Gulshan-e-Iqbal+Karachi"
    },
    social: {
      facebook: "https://facebook.com/HarisTravelAgency",
      instagram: "https://instagram.com/HarisTravelAgency",
      whatsapp: "923142554547"
    },
    services: [
      {
        id: "srv-1",
        title: "Air Tickets",
        category: "Flights",
        icon: "✈️",
        shortDesc: "Domestic and international tickets on all major airlines at competitive fares.",
        priceBadge: "Best Fare Quote on Request",
        header: "What we offer",
        inclusions: [
          "Emirates, PIA, Turkish Airlines, Qatar Airways, Etihad, Saudia and more",
          "One-way, return and multi-city bookings",
          "Group and family fares",
          "Date changes and cancellation help"
        ],
        active: true,
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=75"
      },
      {
        id: "srv-2",
        title: "Holiday & Tour Packages",
        category: "Tours",
        icon: "🧳",
        shortDesc: "Ready and customised packages with hotels, transfers and sightseeing.",
        priceBadge: "Full Itinerary in Destinations",
        header: "Popular destinations",
        inclusions: [
          "Dubai – 7 days packages",
          "Malaysia – 7 days beach & hill tours",
          "Turkey – 8 days Istanbul & Cappadocia",
          "UK, Canada, USA & Australia on request"
        ],
        active: true,
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=75"
      },
      {
        id: "srv-3",
        title: "Hotel Reservations",
        category: "Hotels",
        icon: "🏨",
        shortDesc: "Hotels matched to your budget, location and travel dates worldwide.",
        priceBadge: "Confirmed Vouchers",
        header: "What we offer",
        inclusions: [
          "3, 4 and 5 star hotels worldwide",
          "Close-to-Haram hotels for Umrah",
          "Family rooms and long-stay options",
          "Confirmed vouchers before travel"
        ],
        active: true,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=75"
      },
      {
        id: "srv-4",
        title: "Visa Assistance",
        category: "Visa",
        icon: "🛂",
        shortDesc: "Complete guidance and file preparation for your visa applications.",
        priceBadge: "Canada / Italy from PKR 185,000",
        header: "Countries we assist with",
        inclusions: [
          "Canada and Italy – complete file process",
          "UAE, Turkey, Malaysia, UK and USA visas",
          "Document checklist and appointment guidance",
          "Expert application file checking"
        ],
        active: true,
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=75"
      },
      {
        id: "srv-5",
        title: "Umrah Package – Makkah & Madinah (15 Days)",
        category: "Umrah",
        icon: "🕋",
        shortDesc: "A complete spiritual Umrah journey with comfortable stays and guided ziyarat.",
        priceBadge: "PKR 175,000 per person (15 days)",
        header: "Package includes",
        inclusions: [
          "Hotels in Madinah and Makkah near Haram",
          "AC transport between cities and ziyarat points",
          "Guided Umrah rituals and ziyarat tour",
          "Visa and flight assistance"
        ],
        active: true,
        image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=75"
      },
      {
        id: "srv-6",
        title: "Honeymoon Packages",
        category: "Tours",
        icon: "💞",
        shortDesc: "Romantic escapes designed for newlyweds with candlelight dinners and private tours.",
        priceBadge: "Special Couple Deals",
        header: "What we offer",
        inclusions: [
          "Luxury resorts in Maldives, Bali, Turkey and Dubai",
          "Candlelight dinners and flower bed arrangements",
          "Private airport and island transfers",
          "Flexible pace with private tours"
        ],
        active: true,
        image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=75"
      },
      {
        id: "srv-7",
        title: "Family Vacations",
        category: "Tours",
        icon: "👨‍👩‍👧",
        shortDesc: "Comfortable travel plans for all ages with kid-friendly activities.",
        priceBadge: "Family Savings Deals",
        header: "What we offer",
        inclusions: [
          "Family suites and connecting rooms",
          "Theme park passes and kid attractions",
          "Relaxed itineraries without rushing",
          "Halal dining options included"
        ],
        active: true,
        image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=75"
      },
      {
        id: "srv-8",
        title: "Corporate Travel",
        category: "Corporate",
        icon: "💼",
        shortDesc: "Business trip management, flexible bookings and corporate billing.",
        priceBadge: "Corporate Desk",
        header: "What we offer",
        inclusions: [
          "Flight and hotel bookings for company staff",
          "Annual conference and delegation travel",
          "Flexible date changes and refund tracking",
          "Official invoices and payment records"
        ],
        active: true,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=75"
      },
      {
        id: "srv-9",
        title: "Airport Transfers",
        category: "Transport",
        icon: "🚐",
        shortDesc: "Reliable airport pickup and drop-off in clean, comfortable AC vehicles.",
        priceBadge: "Fixed Transparent Rates",
        header: "What we offer",
        inclusions: [
          "Private sedans, SUVs, and passenger vans",
          "Karachi airport pickup & drop services",
          "Meet and greet at international terminals",
          "Flight delay tracking included"
        ],
        active: true,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=75"
      },
      {
        id: "srv-10",
        title: "Customized Packages",
        category: "Custom",
        icon: "🧭",
        shortDesc: "Tell us your plan, travel dates and budget; we build your ideal itinerary.",
        priceBadge: "100% Tailored to You",
        header: "How it works",
        inclusions: [
          "Choose any city or country worldwide",
          "Set your own departure date and trip duration",
          "Select hotels matching your exact budget",
          "Direct WhatsApp coordination with our trip planner"
        ],
        active: true,
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=75"
      }
    ],
    destinations: [
      {
        id: "dest-1",
        name: "Dubai",
        title: "Dubai – 7 Days Luxury Tour",
        shortDesc: "City of skyscrapers, desert adventure and shopping, ideal for families and couples.",
        meta: ["7 days / 6 nights", "Best: Nov – Mar", "Dubai + Abu Dhabi"],
        itinerary: [
          "Day 1: Arrival, hotel check-in, Dubai Marina & JBR evening walk",
          "Day 2: Old Dubai – Al Fahidi, Gold & Spice Souk, abra ride on Creek",
          "Day 3: Burj Khalifa, Dubai Mall & Fountain show",
          "Day 4: Desert safari with BBQ dinner & dune bashing",
          "Day 5: Abu Dhabi day trip – Sheikh Zayed Mosque, Corniche",
          "Day 6: Museum of the Future / Global Village & shopping",
          "Day 7: Free morning, airport drop-off"
        ],
        inclusions: [
          "4-Star hotel stay with daily breakfast",
          "Airport transfers & local transport",
          "Desert Safari with BBQ dinner & show",
          "Abu Dhabi guided tour with tickets"
        ],
        priceText: "Price on request (Season dependent)",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=75",
        active: true
      },
      {
        id: "dest-australia",
        name: "Australia",
        title: "Australia – 8 Days Sydney, Melbourne & Gold Coast",
        shortDesc: "Experience iconic Sydney landmarks, Melbourne culture, and Gold Coast theme parks and beaches.",
        meta: ["8 days / 7 nights", "Best: Sep – Nov, Mar – May", "Sydney + Melbourne + Gold Coast"],
        itinerary: [
          "Day 1: Arrival at Sydney International Airport, private hotel transfer, Darling Harbour walk",
          "Day 2: Sydney City Tour – Sydney Opera House, Harbour Bridge climb & Bondi Beach",
          "Day 3: Full-day Blue Mountains tour, Scenic World cable car & wildlife park",
          "Day 4: Domestic flight to Melbourne, check-in, Federation Square & Yarra cruise",
          "Day 5: Great Ocean Road full-day tour – 12 Apostles & Loch Ard Gorge",
          "Day 6: Flight to Gold Coast, Surfers Paradise beach & sunset dining",
          "Day 7: Warner Bros. Movie World or Sea World Marine Park tour",
          "Day 8: Souvenir shopping, transfer to airport & departure flight"
        ],
        inclusions: [
          "4-Star hotel accommodation with daily buffet breakfast",
          "Domestic flights in Australia (Sydney - Melbourne - Gold Coast)",
          "Blue Mountains & Great Ocean Road guided day tours",
          "Gold Coast theme park admission passes",
          "Complete Australian tourist visa file guidance"
        ],
        priceText: "PKR 385,000 per person (8 Days)",
        image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=600&q=75",
        active: true
      },
      {
        id: "dest-america",
        name: "America (USA)",
        title: "America (USA) – 9 Days New York, Washington DC & Orlando",
        shortDesc: "Iconic metropolitan cities, historic national monuments, and world-class theme parks.",
        meta: ["9 days / 8 nights", "Best: Apr – Jun, Sep – Oct", "New York, Washington DC, Orlando"],
        itinerary: [
          "Day 1: Arrival at New York JFK, transfer to hotel, Times Square evening walk",
          "Day 2: Statue of Liberty ferry, Wall Street, 9/11 Memorial & Empire State Building",
          "Day 3: Brooklyn Bridge walk, 5th Avenue shopping & Central Park",
          "Day 4: Scenic Amtrak train to Washington DC, hotel check-in & National Mall",
          "Day 5: White House photo stop, US Capitol, Lincoln Memorial & Smithsonian museums",
          "Day 6: Domestic flight to Orlando Florida, resort check-in & Disney Springs walk",
          "Day 7: Full day at Universal Studios Florida or Walt Disney World Magic Kingdom",
          "Day 8: Premium outlet shopping, lakefront dining & leisure",
          "Day 9: Hotel check-out, transfer to Orlando International Airport & departure"
        ],
        inclusions: [
          "Centrally located hotels with breakfast",
          "Domestic flight NYC to Orlando & Amtrak train ticket",
          "Statue of Liberty cruise & theme park entry passes",
          "US tourist visa appointment & documentation guidance"
        ],
        priceText: "Price on request",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=75",
        active: true
      },
      {
        id: "dest-2",
        name: "Malaysia",
        title: "Malaysia – 7 Days Kuala Lumpur & Langkawi",
        shortDesc: "Modern vibrant city, hill resorts, and tropical island beaches in a single trip.",
        meta: ["7 days / 6 nights", "Best: Mar – Oct", "Kuala Lumpur + Langkawi"],
        itinerary: [
          "Day 1: Arrival in Kuala Lumpur, hotel check-in",
          "Day 2: KL city tour – Petronas Towers, Batu Caves, Merdeka Square",
          "Day 3: Putrajaya & Bukit Bintang shopping",
          "Day 4: Genting Highlands cable car & indoor theme park",
          "Day 5: Flight to Langkawi island, beach check-in & sunset",
          "Day 6: Langkawi island hopping & Sky Bridge cable car",
          "Day 7: Return flight to KL / departure"
        ],
        inclusions: [
          "Hotels in KL & Langkawi with breakfast",
          "Domestic flight KL-Langkawi",
          "Genting cable car tickets",
          "Airport transfers & tours"
        ],
        priceText: "Price on request",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=75",
        active: true
      },
      {
        id: "dest-3",
        name: "Turkey",
        title: "Turkey – 8 Days Istanbul & Cappadocia",
        shortDesc: "History, culture, and fairy-tale landscapes across two unforgettable regions.",
        meta: ["8 days / 7 nights", "Best: Apr – Jun, Sep – Nov", "Istanbul + Cappadocia"],
        itinerary: [
          "Day 1: Arrival in Istanbul, hotel check-in",
          "Day 2: Old City – Hagia Sophia, Blue Mosque, Topkapi Palace, Grand Bazaar",
          "Day 3: Bosphorus cruise, Taksim & Istiklal Street",
          "Day 4: Bursa or Sapanca day trip",
          "Day 5: Domestic flight to Cappadocia, Goreme Open Air Museum",
          "Day 6: Cappadocia valleys & optional hot air balloon",
          "Day 7: Return flight to Istanbul, leisure shopping",
          "Day 8: Departure flight"
        ],
        inclusions: [
          "4-Star hotels in Istanbul & cave hotel in Cappadocia",
          "Domestic flights within Turkey",
          "Bosphorus private cruise",
          "Historical tours with English speaking guide"
        ],
        priceText: "Price on request",
        image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=75",
        active: true
      },
      {
        id: "dest-4",
        name: "United Kingdom",
        title: "United Kingdom – 7 Days London & Countryside",
        shortDesc: "London landmarks plus classic English countryside. UK visa required.",
        meta: ["7 days / 6 nights", "Best: May – Sep", "London + day trips"],
        itinerary: [
          "Day 1: Arrival in London Heathrow, hotel check-in",
          "Day 2: Big Ben, Westminster Abbey, London Eye, Buckingham Palace",
          "Day 3: Tower of London, Tower Bridge, Borough Market",
          "Day 4: Windsor Castle & Oxford University day trip",
          "Day 5: Stonehenge & Bath guided day excursion",
          "Day 6: Madame Tussauds & Oxford Street shopping",
          "Day 7: Heathrow Airport transfer & departure"
        ],
        inclusions: [
          "Centrally located London hotel with breakfast",
          "Airport pickup & drop-off",
          "London Eye & Castle tickets",
          "UK visa file checking guidance"
        ],
        priceText: "Price on request",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=75",
        active: true
      },
      {
        id: "dest-5",
        name: "Canada",
        title: "Canada – 8 Days Toronto, Niagara & Ottawa",
        shortDesc: "Big cities, Canadian culture, and the thunderous Niagara Falls.",
        meta: ["8 days / 7 nights", "Best: Jun – Sep", "Toronto, Niagara, Ottawa"],
        itinerary: [
          "Day 1: Arrival in Toronto Pearson Airport, hotel check-in",
          "Day 2: Toronto – CN Tower observation deck, Harbourfront",
          "Day 3: Niagara Falls full-day trip with boat cruise",
          "Day 4: Drive to Ottawa via 1000 Islands cruise",
          "Day 5: Ottawa – Parliament Hill, Rideau Canal tour",
          "Day 6: Montreal – Old Montreal & Notre-Dame Basilica",
          "Day 7: Free day for shopping and leisure",
          "Day 8: Airport transfer & departure flight"
        ],
        inclusions: [
          "Hotel stays in Toronto & Montreal with breakfast",
          "Niagara Falls boat cruise tickets",
          "Inter-city AC transportation",
          "Canada visa assistance"
        ],
        priceText: "Price on request",
        image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=600&q=75",
        active: true
      },
      {
        id: "dest-7",
        name: "Saudi Arabia",
        title: "Umrah Package – Makkah & Madinah (15 Days)",
        shortDesc: "A complete Umrah spiritual journey with comfortable stays and guided ziyarat.",
        meta: ["15 days", "Madinah + Makkah", "Per person"],
        itinerary: [
          "Day 1: Flight to Saudi Arabia, transfer and check-in at Madinah hotel",
          "Days 2 – 6: Madinah – Masjid an-Nabawi, Rawdah visit, Uhud, Quba & Qiblatain ziyarat",
          "Day 7: Travel to Makkah, wear Ihram at Miqat and perform Umrah",
          "Days 8 – 13: Makkah – Prayers at Masjid al-Haram, Jabal al-Noor, Mina & Muzdalifah",
          "Day 14: Farewell Tawaf",
          "Day 15: Transfer to Jeddah airport, return flight"
        ],
        inclusions: [
          "Hotels in Madinah and Makkah near Haram",
          "AC bus transfer between cities and ziyarat",
          "Complete guidance for Umrah rituals",
          "Visa and flight assistance"
        ],
        priceText: "PKR 175,000 per person (15 days)",
        image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=75",
        active: true
      }
    ]
  };

  let siteData = null;

  // Escape HTML helper
  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Image URL optimizer: forces WebP, exact thumbnail dimensions, and compressed quality
  function optimizeImageUrl(url, width = 600) {
    if (!url) return '';
    if (url.includes('images.unsplash.com')) {
      const base = url.split('?')[0];
      return `${base}?auto=format&fit=crop&w=${width}&q=75`;
    }
    return url;
  }

  // Generate WhatsApp link helper
  function getWhatsAppUrl(text) {
    const waNumber = (siteData && siteData.social && siteData.social.whatsapp) || '923142554547';
    const cleanNum = waNumber.replace(/[^0-9]/g, '');
    const defaultText = text || 'Hello Haris Travel Agency, I would like to inquire about your travel services.';
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(defaultText)}`;
  }

  // Ultra-fast SWR (Stale-While-Revalidate): Render from cache/defaults instantly, then revalidate in background
  function initSiteContent() {
    // 1. Instant Render from Cache or Defaults (0ms latency!)
    try {
      const cached = localStorage.getItem('haris_travel_cached_data');
      if (cached) {
        siteData = JSON.parse(cached);
      }
    } catch (e) {}

    if (!siteData) {
      siteData = DEFAULT_DATA;
    }

    // Render immediately so user sees complete page in 0ms!
    renderPage();

    // 2. Background Revalidation (Non-blocking)
    refreshFromCloud();
  }

  async function refreshFromCloud() {
    try {
      let freshData = null;
      if (window.DB && window.DB.isSupabase()) {
        freshData = await window.DB.getContent();
      } else {
        const response = await fetch('/api/content');
        if (response.ok) freshData = await response.json();
      }

      if (freshData && freshData.services && freshData.services.length > 0) {
        siteData = freshData;
        try {
          localStorage.setItem('haris_travel_cached_data', JSON.stringify(freshData));
        } catch (e) {}
        renderPage();
      }
    } catch (err) {
      console.warn('Background sync note (using cached data):', err);
    }
  }

  // Render all dynamic elements on the page
  function renderPage() {
    if (!siteData) return;

    const { agency, social, services, destinations } = siteData;

    // 1. Update Contact Info & Agency Info in DOM
    const waUrlGeneral = getWhatsAppUrl('Hello Haris Travel Agency, I would like to plan a trip.');
    
    // Floating WhatsApp Button
    const floatingWa = document.getElementById('floating-wa-btn');
    if (floatingWa) {
      floatingWa.href = waUrlGeneral;
    }

    // Header & Hero CTA WhatsApp buttons
    const heroWaBtn = document.getElementById('hero-wa-btn');
    if (heroWaBtn) heroWaBtn.href = waUrlGeneral;

    const contactWaBtn = document.getElementById('contact-wa-btn');
    if (contactWaBtn) contactWaBtn.href = waUrlGeneral;

    // Phone & Email links
    document.querySelectorAll('[data-agency-phone]').forEach(el => {
      el.textContent = agency.phone || '+92 314 2554547';
      if (el.tagName === 'A') el.href = `tel:${agency.phoneClean || '+923142554547'}`;
    });

    document.querySelectorAll('[data-agency-whatsapp]').forEach(el => {
      el.textContent = agency.phone || agency.whatsapp || '+92 314 2554547';
      if (el.tagName === 'A') el.href = waUrlGeneral;
    });

    document.querySelectorAll('[data-agency-email]').forEach(el => {
      el.textContent = agency.email || 'hariskhan070@gmail.com';
      if (el.tagName === 'A') el.href = `mailto:${agency.email}?subject=Travel%20Inquiry`;
    });

    document.querySelectorAll('[data-agency-address]').forEach(el => {
      el.textContent = agency.address || 'Gulshan-e-Iqbal, Karachi, Pakistan';
    });

    document.querySelectorAll('[data-agency-name]').forEach(el => {
      el.textContent = agency.name || 'Haris Travel Agency';
    });

    // 2. Render Social Media Section (EXACTLY 3: Instagram, Facebook, WhatsApp)
    renderSocialMedia(social);

    // 3. Render Services Grid
    renderServices(services || []);

    // 4. Render Destinations Grid
    renderDestinations(destinations || []);
  }

  // Render Social Media (Instagram, Facebook, WhatsApp)
  function renderSocialMedia(social) {
    const fbUrl = (social && social.facebook) ? social.facebook.trim() : '';
    const igUrl = (social && social.instagram) ? social.instagram.trim() : '';
    const waNum = (social && social.whatsapp) ? social.whatsapp.trim() : '';
    const waUrl = getWhatsAppUrl('Hello Haris Travel Agency, I reached out via your website!');

    // Update Social Cards in #social section
    const fbBtn = document.getElementById('social-fb-btn');
    if (fbBtn) {
      if (fbUrl) {
        fbBtn.href = fbUrl;
        fbBtn.closest('.social-card').style.display = 'flex';
      } else {
        fbBtn.closest('.social-card').style.display = 'none';
      }
    }

    const igBtn = document.getElementById('social-ig-btn');
    if (igBtn) {
      if (igUrl) {
        igBtn.href = igUrl;
        igBtn.closest('.social-card').style.display = 'flex';
      } else {
        igBtn.closest('.social-card').style.display = 'none';
      }
    }

    const waBtn = document.getElementById('social-wa-btn');
    if (waBtn) {
      waBtn.href = waUrl;
      const waDisplay = document.getElementById('social-wa-number');
      if (waDisplay) waDisplay.textContent = waNum || '+92 314 2554547';
    }

    // Update Footer Social Buttons (3 links only)
    const footerFb = document.getElementById('footer-fb');
    if (footerFb) {
      if (fbUrl) { footerFb.href = fbUrl; footerFb.style.display = 'grid'; }
      else { footerFb.style.display = 'none'; }
    }

    const footerIg = document.getElementById('footer-ig');
    if (footerIg) {
      if (igUrl) { footerIg.href = igUrl; footerIg.style.display = 'grid'; }
      else { footerIg.style.display = 'none'; }
    }

    const footerWa = document.getElementById('footer-wa');
    if (footerWa) {
      footerWa.href = waUrl;
    }
  }

  // Render Services Grid
  function renderServices(services) {
    const container = document.getElementById('services-grid-container');
    if (!container) return;

    if (!services || services.length === 0) {
      container.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No services listed yet.</p>';
      return;
    }

    container.innerHTML = services.map((srv, idx) => {
      const icon = srv.icon || '✈️';
      const title = escapeHTML(srv.title);
      const category = escapeHTML(srv.category || 'Travel Service');
      const desc = escapeHTML(srv.shortDesc || '');
      const rawImg = srv.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828';
      const imgUrl = optimizeImageUrl(rawImg, 600);
      const badge = srv.priceBadge ? `<div class="service-badge-floating">${escapeHTML(srv.priceBadge)}</div>` : '';

      return `
        <div class="service-card" data-service-idx="${idx}" tabindex="0" role="button" aria-label="${title}">
          <div class="service-img-wrap">
            <img src="${imgUrl}" alt="${title}" class="service-card-img" loading="lazy" decoding="async">
            <div class="service-img-overlay"></div>
            <span class="service-category-floating">${category}</span>
            ${badge}
          </div>
          <div class="service-body">
            <h3>${icon} ${title}</h3>
            <p>${desc}</p>
            <div class="service-action-link">
              <span>View details &amp; itinerary</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events for modal
    container.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = card.getAttribute('data-service-idx');
        openServiceModal(services[idx]);
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = card.getAttribute('data-service-idx');
          openServiceModal(services[idx]);
        }
      });
    });

    // Populate service options in the quote form select
    const serviceSelect = document.getElementById('quote-service-select');
    if (serviceSelect) {
      const currentVal = serviceSelect.value;
      serviceSelect.innerHTML = '<option value="">Select a Service (Optional)</option>' +
        services.map(s => `<option value="${escapeHTML(s.title)}">${escapeHTML(s.title)}</option>`).join('');
      if (currentVal) serviceSelect.value = currentVal;
    }
  }

  // Open Service Modal
  function openServiceModal(srv) {
    if (!srv) return;
    const modal = document.getElementById('detail-modal');
    if (!modal) return;

    const title = escapeHTML(srv.title);
    const desc = escapeHTML(srv.shortDesc || '');
    const priceText = srv.priceBadge ? escapeHTML(srv.priceBadge) : 'Customized Quote on Request';
    const header = escapeHTML(srv.header || 'Package Highlights & Inclusions');

    let inclusionsHtml = '';
    if (srv.inclusions && srv.inclusions.length > 0) {
      inclusionsHtml = `
        <h4 style="margin: 20px 0 10px; font-size: 1.1rem; color: var(--navy);">${header}</h4>
        <ul class="modal-itinerary-list">
          ${srv.inclusions.map(inc => `<li>✓ ${escapeHTML(inc)}</li>`).join('')}
        </ul>
      `;
    }

    let itineraryHtml = '';
    if (srv.itinerary && srv.itinerary.length > 0) {
      itineraryHtml = `
        <h4 style="margin: 20px 0 10px; font-size: 1.1rem; color: var(--navy);">Tour Plan / Daily Itinerary</h4>
        <ul class="modal-itinerary-list">
          ${srv.itinerary.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
        </ul>
      `;
    }

    const waInquiryUrl = getWhatsAppUrl(`Hello Haris Travel Agency, I am interested in your service: *${srv.title}*. Please share complete pricing and details.`);
    const imgHtml = srv.image ? `<img src="${optimizeImageUrl(srv.image, 800)}" alt="${title}" class="modal-cover-img" loading="lazy">` : '';

    modal.innerHTML = `
      <div class="modal-header">
        <div>
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--teal); text-transform: uppercase;">${escapeHTML(srv.category || 'Service')}</span>
          <h3 style="font-size: 1.6rem; color: var(--navy); margin-top: 4px;">${srv.icon || '✈️'} ${title}</h3>
        </div>
        <button class="modal-close-btn" type="button" aria-label="Close modal">&times;</button>
      </div>

      ${imgHtml}
      <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.6;">${desc}</p>

      ${inclusionsHtml}
      ${itineraryHtml}

      <div class="modal-price-box">
        <span>Pricing / Package Fare:</span>
        <span style="font-size: 1.1rem; color: #fff;">${priceText}</span>
      </div>

      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px;">
        <a href="${waInquiryUrl}" target="_blank" rel="noopener" class="btn btn-wa" style="flex: 1;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
          Inquire for this Service on WhatsApp
        </a>
        <button type="button" class="btn btn-outline-navy modal-dismiss-btn">Close</button>
      </div>
    `;

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }

    modal.querySelector('.modal-close-btn').onclick = () => modal.close();
    modal.querySelector('.modal-dismiss-btn').onclick = () => modal.close();
  }

  // Render Destinations
  function renderDestinations(destinations) {
    const container = document.getElementById('destinations-grid-container');
    if (!container) return;

    if (!destinations || destinations.length === 0) {
      container.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No destinations listed.</p>';
      return;
    }

    container.innerHTML = destinations.map((d, idx) => {
      const isWide = idx === 0 || idx === 3;
      const cardClass = `dest-card ${isWide ? 'wide' : ''}`;
      const imgUrl = optimizeImageUrl(d.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828', 600);
      const imgHtml = d.image ? `<img src="${imgUrl}" alt="${escapeHTML(d.name)}" class="dest-bg-img" loading="lazy" decoding="async">` : '';
      const meta = (d.meta && d.meta.length > 0) ? d.meta.join(' • ') : 'Custom Package';

      return `
        <div class="${cardClass}" data-dest-idx="${idx}" role="button" tabindex="0">
          ${imgHtml}
          <div class="dest-overlay"></div>
          <span class="dest-tag">View Itinerary →</span>
          <div class="dest-content">
            <h3 class="dest-name">${escapeHTML(d.name)}</h3>
            <span class="dest-meta">${escapeHTML(meta)}</span>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.dest-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = card.getAttribute('data-dest-idx');
        openDestinationModal(destinations[idx]);
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = card.getAttribute('data-dest-idx');
          openDestinationModal(destinations[idx]);
        }
      });
    });
  }

  // Open Destination Modal
  function openDestinationModal(dest) {
    if (!dest) return;
    const modal = document.getElementById('detail-modal');
    if (!modal) return;

    const title = escapeHTML(dest.title || dest.name);
    const desc = escapeHTML(dest.shortDesc || '');
    const priceText = escapeHTML(dest.priceText || 'Price on request');
    const imgHtml = dest.image ? `<img src="${optimizeImageUrl(dest.image, 800)}" alt="${title}" class="modal-cover-img" loading="lazy">` : '';
    const metaHtml = (dest.meta && dest.meta.length > 0) ? `<div style="margin: 8px 0 16px; font-size: 0.88rem; color: var(--teal); font-weight: 600;">📍 ${escapeHTML(dest.meta.join(' • '))}</div>` : '';

    let itineraryHtml = '';
    if (dest.itinerary && dest.itinerary.length > 0) {
      itineraryHtml = `
        <h4 style="margin: 22px 0 14px; font-size: 1.15rem; color: var(--navy); display: flex; align-items: center; gap: 8px;">
          <span>📅</span> <span>Day-by-Day Tour Plan (Har Din Ka Schedule)</span>
        </h4>
        <div class="modal-day-timeline">
          ${dest.itinerary.map((item, idx) => {
            const match = String(item).match(/^Day\s*(\d+)[\s:]+(.*)$/i);
            const dayNum = match ? match[1] : (idx + 1);
            const dayContent = match ? match[2] : item;
            return `
              <div class="modal-day-item">
                <span class="modal-day-pill">Day ${dayNum}</span>
                <span class="modal-day-text">${escapeHTML(dayContent)}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    let inclusionsHtml = '';
    if (dest.inclusions && dest.inclusions.length > 0) {
      inclusionsHtml = `
        <h4 style="margin: 22px 0 12px; font-size: 1.15rem; color: var(--navy); display: flex; align-items: center; gap: 8px;">
          <span>✨</span> <span>Package Inclusions & Benefits</span>
        </h4>
        <ul class="modal-itinerary-list">
          ${dest.inclusions.map(inc => `<li>✓ ${escapeHTML(inc)}</li>`).join('')}
        </ul>
      `;
    }

    const waInquiryUrl = getWhatsAppUrl(`Hello Haris Travel Agency, I want to book/plan a trip for: *${dest.name}* (${title}). Please send available dates and package fare.`);

    modal.innerHTML = `
      <div class="modal-header">
        <div>
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--teal); text-transform: uppercase;">Featured Destination</span>
          <h3 style="font-size: 1.6rem; color: var(--navy); margin-top: 4px;">🌍 ${title}</h3>
        </div>
        <button class="modal-close-btn" type="button" aria-label="Close modal">&times;</button>
      </div>

      ${imgHtml}
      ${metaHtml}
      <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.6;">${desc}</p>
      
      ${itineraryHtml}
      ${inclusionsHtml}

      <div class="modal-price-box">
        <span>Package Pricing:</span>
        <span style="font-size: 1.05rem; color: #fff;">${priceText}</span>
      </div>

      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px;">
        <a href="${waInquiryUrl}" target="_blank" rel="noopener" class="btn btn-wa" style="flex: 1;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
          Inquire for ${escapeHTML(dest.name)} on WhatsApp
        </a>
        <button type="button" class="btn btn-outline-navy modal-dismiss-btn">Close</button>
      </div>
    `;

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }

    modal.querySelector('.modal-close-btn').onclick = () => modal.close();
    modal.querySelector('.modal-dismiss-btn').onclick = () => modal.close();
  }

  // Quote Form Handler
  function initQuoteForm() {
    const form = document.getElementById('quote-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const statusMsg = document.getElementById('form-status-msg');
      const submitBtn = form.querySelector('button[type="submit"]');

      const formData = new FormData(form);
      const data = {
        name: formData.get('name') || '',
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        destination: formData.get('destination') || '',
        date: formData.get('date') || '',
        service: formData.get('service') || '',
        message: formData.get('message') || ''
      };

      if (!data.name || !data.phone) {
        if (statusMsg) {
          statusMsg.style.color = '#EF4444';
          statusMsg.textContent = 'Please enter your Name and Phone / WhatsApp number.';
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (statusMsg) {
        statusMsg.style.color = 'var(--teal)';
        statusMsg.textContent = 'Sending request and preparing WhatsApp...';
      }

      let whatsappUrl = '';

      // 1. Try sending to Supabase if configured
      if (window.DB && window.DB.isSupabase()) {
        try {
          await window.DB.submitInquiry(data);
          console.log('✅ Quote request saved to Supabase!');
        } catch (err) {
          console.warn('Supabase inquiry save error:', err);
        }
      } else {
        // 2. Try sending to backend API
        try {
          const res = await fetch('/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (result.whatsappUrl) {
            whatsappUrl = result.whatsappUrl;
          }
        } catch (err) {
          console.warn('API submission failed, generating direct WhatsApp link...', err);
        }
      }

      // If backend didn't return URL, build client-side
      if (!whatsappUrl) {
        const waText = `*Travel Quote Request*\n\n` +
          `👤 *Name:* ${data.name}\n` +
          `📞 *Phone:* ${data.phone}\n` +
          (data.email ? `📧 *Email:* ${data.email}\n` : '') +
          (data.destination ? `📍 *Destination:* ${data.destination}\n` : '') +
          (data.date ? `📅 *Date:* ${data.date}\n` : '') +
          (data.service ? `🏷️ *Service:* ${data.service}\n` : '') +
          (data.message ? `💬 *Message:* ${data.message}\n` : '');

        whatsappUrl = getWhatsAppUrl(waText);
      }

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      if (statusMsg) {
        statusMsg.style.color = '#10B981';
        statusMsg.textContent = 'Opening WhatsApp with your request details. Press Send to chat with our agent!';
      }

      form.reset();
      if (submitBtn) submitBtn.disabled = false;
    });
  }

  // Mobile menu toggle
  function initMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
      }
    });
  }

  // Initialize immediately on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initSiteContent();
    initQuoteForm();
    initMobileMenu();

    // Secret discrete admin shortcut (double click on copyright symbol)
    const secretTrigger = document.getElementById('secret-admin-trigger');
    if (secretTrigger) {
      let clicks = 0;
      secretTrigger.addEventListener('click', () => {
        clicks++;
        if (clicks >= 2) {
          window.location.href = 'admin.html';
        }
        setTimeout(() => { clicks = 0; }, 1500);
      });
    }
  });

})();
