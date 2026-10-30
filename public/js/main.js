/**
 * Haris Travel Agency - Main Website JavaScript
 * Handles dynamic content, services modal, social media links, and quote submissions.
 */

(function () {
  'use strict';

  // Fallback default state in case API server is offline or opened via file://
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
    services: [],
    destinations: []
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

  // Generate WhatsApp link helper
  function getWhatsAppUrl(text) {
    const waNumber = (siteData && siteData.social && siteData.social.whatsapp) || '923142554547';
    const cleanNum = waNumber.replace(/[^0-9]/g, '');
    const defaultText = text || 'Hello Haris Travel Agency, I would like to inquire about your travel services.';
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(defaultText)}`;
  }

  // Load content from Supabase, API, or localStorage
  async function loadSiteContent() {
    // 1. Try Supabase first if configured
    if (window.DB && window.DB.isSupabase()) {
      try {
        const sbData = await window.DB.getContent();
        if (sbData) {
          siteData = sbData;
          console.log('✅ Loaded content directly from Supabase!');
          renderPage();
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, trying local fallback...', err);
      }
    }

    // 2. Try Node.js Backend API
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        siteData = await response.json();
        try {
          localStorage.setItem('haris_travel_cached_data', JSON.stringify(siteData));
        } catch (e) {}
      } else {
        throw new Error('API returned ' + response.status);
      }
    } catch (err) {
      console.warn('Could not fetch from /api/content, checking cached or default data...', err);
      try {
        const cached = localStorage.getItem('haris_travel_cached_data');
        if (cached) siteData = JSON.parse(cached);
      } catch (e) {}

      if (!siteData) {
        siteData = DEFAULT_DATA;
      }
    }

    renderPage();
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
      const imgUrl = srv.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
      const badge = srv.priceBadge ? `<div class="service-badge-floating">${escapeHTML(srv.priceBadge)}</div>` : '';

      return `
        <div class="service-card" data-service-idx="${idx}" tabindex="0" role="button" aria-label="${title}">
          <div class="service-img-wrap">
            <img src="${imgUrl}" alt="${title}" class="service-card-img" loading="lazy">
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

    const imgHtml = srv.image ? `<img src="${srv.image}" alt="${title}" class="modal-cover-img" loading="lazy">` : '';

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
      const imgHtml = d.image ? `<img src="${d.image}" alt="${escapeHTML(d.name)}" class="dest-bg-img" loading="lazy">` : '';
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
    const imgHtml = dest.image ? `<img src="${dest.image}" alt="${title}" class="modal-cover-img" loading="lazy">` : '';
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

  // Initialize everything on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    loadSiteContent();
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
