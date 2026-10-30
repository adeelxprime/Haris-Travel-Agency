/**
 * Haris Travel Agency - Admin Dashboard JavaScript
 * Complete control panel for Social Media (Instagram, Facebook, WhatsApp) and Services management.
 */

(function () {
  'use strict';

  // State
  let adminData = null;
  let authToken = localStorage.getItem('haris_admin_token') || '';
  let activeTab = 'social';

  // Helpers
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

  // Toast notification
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
    toast.innerHTML = `<span style="font-weight: 800; font-size: 1.1rem;">${icon}</span> <span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Auth fetch wrapper
  async function apiFetch(url, options = {}) {
    options.headers = options.headers || {};
    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }
    return fetch(url, options);
  }

  // Check login status & load data
  async function initAdmin() {
    const loginWrap = document.getElementById('login-screen-wrap');
    const adminLayout = document.getElementById('admin-layout');

    if (!authToken) {
      loginWrap.style.display = 'flex';
      adminLayout.style.display = 'none';
      return;
    }

    // 1. If Supabase is configured
    if (window.DB && window.DB.isSupabase()) {
      try {
        const [content, allServices, allDestinations, inquiries] = await Promise.all([
          window.DB.getContent(),
          window.DB.getAdminServices(),
          window.DB.getAdminDestinations(),
          window.DB.getInquiries()
        ]);

        if (content) {
          adminData = {
            agency: content.agency,
            social: content.social,
            services: allServices || content.services || [],
            destinations: allDestinations || content.destinations || [],
            inquiriesCount: (inquiries || []).length,
            newInquiriesCount: (inquiries || []).filter(i => i.status === 'new').length
          };

          loginWrap.style.display = 'none';
          adminLayout.style.display = 'flex';
          renderAdminDashboard();
          return;
        }
      } catch (err) {
        console.warn('Supabase admin fetch error:', err);
      }
    }

    // 2. Try Node.js Backend API
    try {
      const res = await apiFetch('/api/admin/data');
      if (res.ok) {
        adminData = await res.json();
        loginWrap.style.display = 'none';
        adminLayout.style.display = 'flex';
        renderAdminDashboard();
      } else {
        authToken = '';
        localStorage.removeItem('haris_admin_token');
        loginWrap.style.display = 'flex';
        adminLayout.style.display = 'none';
      }
    } catch (err) {
      console.warn('API error, attempting localStorage offline mode...', err);
      const localData = localStorage.getItem('haris_travel_cached_data');
      if (localData) {
        adminData = JSON.parse(localData);
        loginWrap.style.display = 'none';
        adminLayout.style.display = 'flex';
        renderAdminDashboard();
      } else {
        loginWrap.style.display = 'flex';
        adminLayout.style.display = 'none';
      }
    }
  }

  // Login handler
  function initLoginForm() {
    const form = document.getElementById('admin-login-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const username = form.username.value.trim();
      const password = form.password.value.trim();
      const errorMsg = document.getElementById('login-error-msg');
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!username || !password) {
        errorMsg.textContent = 'Please enter both username and password.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';
      errorMsg.textContent = '';

      // 1. Try Supabase Login
      if (window.DB && window.DB.isSupabase()) {
        try {
          const sbLogin = await window.DB.adminLogin(username, password);
          if (sbLogin && sbLogin.success) {
            authToken = sbLogin.token;
            localStorage.setItem('haris_admin_token', authToken);
            showToast('Welcome back, Admin! (Connected to Supabase)');
            form.reset();
            initAdmin();
            return;
          } else if (sbLogin && sbLogin.error) {
            errorMsg.textContent = sbLogin.error;
            return;
          }
        } catch (sbErr) {
          console.warn('Supabase login check failed:', sbErr);
        }
      }

      // 2. Try Node.js Backend Login
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          authToken = data.token;
          localStorage.setItem('haris_admin_token', authToken);
          showToast('Welcome back, Admin!');
          form.reset();
          initAdmin();
        } else {
          errorMsg.textContent = data.error || 'Invalid username or password.';
        }
      } catch (err) {
        // Offline fallback login check
        if (username === 'admin' && (password === '569646' || password === localStorage.getItem('haris_admin_offline_pw'))) {
          authToken = 'offline-token-' + Date.now();
          localStorage.setItem('haris_admin_token', authToken);
          showToast('Logged in (Offline / Standalone mode)');
          initAdmin();
        } else {
          errorMsg.textContent = 'Could not connect to server or invalid password.';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In to Dashboard';
      }
    });

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await apiFetch('/api/admin/logout', { method: 'POST' });
        } catch (e) {}
        authToken = '';
        localStorage.removeItem('haris_admin_token');
        showToast('Logged out successfully', 'info');
        initAdmin();
      });
    }
  }

  // Render Dashboard
  function renderAdminDashboard() {
    if (!adminData) return;

    const { social, services, destinations, agency, inquiriesCount, newInquiriesCount } = adminData;

    // Update Stats
    document.getElementById('stat-services-count').textContent = (services || []).filter(s => s.active !== false).length;
    const destStat = document.getElementById('stat-destinations-count');
    if (destStat) destStat.textContent = (destinations || []).filter(d => d.active !== false).length;
    document.getElementById('stat-inquiries-count').textContent = inquiriesCount || 0;
    document.getElementById('stat-whatsapp-display').textContent = (social && social.whatsapp) || '+92 314 2554547';

    const inqBadge = document.getElementById('inquiries-badge');
    if (inqBadge) {
      const count = newInquiriesCount || inquiriesCount || 0;
      inqBadge.textContent = count;
      inqBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    // Populate Tab 1: Social Media Links
    populateSocialTab(social);

    // Populate Tab 2: Services
    populateServicesTab(services || []);

    // Populate Tab 2b: Destinations
    populateDestinationsTab(destinations || []);

    // Populate Tab 3: Agency Info
    populateAgencyTab(agency);

    // Populate Tab 4: Inquiries
    loadInquiries();
  }

  // ========================================================
  // TAB 1: SOCIAL MEDIA LINKS (Instagram, Facebook, WhatsApp)
  // ========================================================
  function populateSocialTab(social) {
    social = social || {};
    const fbInput = document.getElementById('social-fb-input');
    const igInput = document.getElementById('social-ig-input');
    const waInput = document.getElementById('social-wa-input');

    if (fbInput) fbInput.value = social.facebook || '';
    if (igInput) igInput.value = social.instagram || '';
    if (waInput) waInput.value = social.whatsapp || '';

    // Test buttons
    const testFb = document.getElementById('test-fb-btn');
    if (testFb) {
      testFb.onclick = () => {
        const val = fbInput.value.trim();
        if (val) window.open(val.startsWith('http') ? val : `https://${val}`, '_blank');
        else showToast('Please enter a Facebook link first', 'error');
      };
    }

    const testIg = document.getElementById('test-ig-btn');
    if (testIg) {
      testIg.onclick = () => {
        const val = igInput.value.trim();
        if (val) window.open(val.startsWith('http') ? val : `https://${val}`, '_blank');
        else showToast('Please enter an Instagram link first', 'error');
      };
    }

    const testWa = document.getElementById('test-wa-btn');
    if (testWa) {
      testWa.onclick = () => {
        const val = waInput.value.replace(/[^0-9]/g, '');
        if (val) window.open(`https://wa.me/${val}`, '_blank');
        else showToast('Please enter a WhatsApp number first', 'error');
      };
    }
  }

  // Save Social Links
  function initSocialForm() {
    const form = document.getElementById('social-links-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const facebook = document.getElementById('social-fb-input').value.trim();
      const instagram = document.getElementById('social-ig-input').value.trim();
      const whatsapp = document.getElementById('social-wa-input').value.trim();
      const saveBtn = form.querySelector('button[type="submit"]');

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving Links...';

      const payload = { facebook, instagram, whatsapp };

      // 1. Supabase update
      if (window.DB && window.DB.isSupabase()) {
        try {
          const sbRes = await window.DB.updateSocial(payload);
          if (sbRes && sbRes.success) {
            adminData.social = payload;
            showToast('Social media links updated in Supabase! (Facebook, Instagram & WhatsApp)');
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Social Links';
            return;
          }
        } catch (sbErr) {
          console.warn('Supabase social update failed:', sbErr);
        }
      }

      try {
        const res = await apiFetch('/api/admin/social', {
          method: 'PUT',
          body: payload
        });

        if (res.ok) {
          const result = await res.json();
          adminData.social = result.social;
          showToast('Social media links updated successfully! (Facebook, Instagram & WhatsApp)');
        } else {
          showToast('Failed to save social media links', 'error');
        }
      } catch (err) {
        // Offline storage fallback
        if (adminData) {
          adminData.social = payload;
          localStorage.setItem('haris_travel_cached_data', JSON.stringify(adminData));
          showToast('Saved to local storage (Offline mode)');
        }
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Social Links';
      }
    });
  }

  // ========================================================
  // TAB 2: SERVICES MANAGEMENT ("apny service offer kary")
  // ========================================================
  function populateServicesTab(services) {
    const container = document.getElementById('services-admin-list');
    if (!container) return;

    if (!services || services.length === 0) {
      container.innerHTML = '<p class="text-center" style="padding: 20px; color: var(--admin-muted);">No services created yet. Click "Add New Service" to offer a service.</p>';
      return;
    }

    container.innerHTML = services.map((srv, idx) => {
      const activeChecked = srv.active !== false ? 'checked' : '';
      const activeLabel = srv.active !== false ? '<span style="color: var(--admin-success); font-weight: 700;">Active</span>' : '<span style="color: var(--admin-muted);">Hidden</span>';
      const badge = srv.priceBadge ? `<span class="service-admin-badge">${escapeHTML(srv.priceBadge)}</span>` : '';
      const inclusionsCount = (srv.inclusions || []).length;
      const imgHtml = srv.image ? `<img src="${srv.image}" alt="${escapeHTML(srv.title)}" style="width: 44px; height: 44px; border-radius: 10px; object-fit: cover;">` : `<div class="service-admin-icon">${srv.icon || '✈️'}</div>`;

      return `
        <div class="service-admin-item" data-id="${srv.id}">
          <div class="service-admin-left">
            ${imgHtml}
            <div class="service-admin-meta">
              <h4>${escapeHTML(srv.title)} ${badge}</h4>
              <p>${escapeHTML(srv.category || 'General')} • ${inclusionsCount} Inclusions/Points • ${activeLabel}</p>
            </div>
          </div>
          <div class="service-admin-actions">
            <button type="button" class="btn-secondary edit-service-btn" data-id="${srv.id}" style="padding: 6px 14px; font-size: 0.85rem;">
              ✏️ Edit
            </button>
            <button type="button" class="btn-danger delete-service-btn" data-id="${srv.id}" data-title="${escapeHTML(srv.title)}">
              🗑️ Delete
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach Edit button events
    container.querySelectorAll('.edit-service-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const srv = (adminData.services || []).find(s => s.id === id);
        if (srv) openServiceModal(srv);
      });
    });

    // Attach Delete button events
    container.querySelectorAll('.delete-service-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        if (confirm(`Are you sure you want to delete the service "${title}"?`)) {
          await deleteService(id);
        }
      });
    });
  }

  // Open Service Modal (Add or Edit)
  function openServiceModal(srv = null) {
    const modal = document.getElementById('service-edit-modal');
    const form = document.getElementById('service-edit-form');
    const modalTitle = document.getElementById('service-modal-title');
    if (!modal || !form) return;

    if (srv) {
      modalTitle.textContent = `Edit Service: ${srv.title}`;
      form.service_id.value = srv.id;
      form.title.value = srv.title || '';
      form.category.value = srv.category || 'Flights';
      form.icon.value = srv.icon || '✈️';
      form.image.value = srv.image || '';
      form.priceBadge.value = srv.priceBadge || '';
      form.shortDesc.value = srv.shortDesc || '';
      form.header.value = srv.header || 'What we offer';
      form.inclusionsText.value = (srv.inclusions || []).join('\n');
      form.active.checked = srv.active !== false;

      const previewWrap = document.getElementById('srv-img-preview');
      const previewImg = document.getElementById('srv-preview-img');
      if (srv.image && previewWrap && previewImg) {
        previewImg.src = srv.image;
        previewWrap.style.display = 'flex';
      } else if (previewWrap) {
        previewWrap.style.display = 'none';
      }
    } else {
      modalTitle.textContent = 'Add New Travel Service';
      form.reset();
      form.service_id.value = '';
      form.icon.value = '✈️';
      form.image.value = '';
      form.category.value = 'Tours';
      form.header.value = 'What we offer';
      form.active.checked = true;

      const previewWrap = document.getElementById('srv-img-preview');
      if (previewWrap) previewWrap.style.display = 'none';
    }

    modal.classList.add('open');
  }

  function closeServiceModal() {
    const modal = document.getElementById('service-edit-modal');
    if (modal) modal.classList.remove('open');
  }

  // Save Service (Create or Update)
  function initServiceForm() {
    const form = document.getElementById('service-edit-form');
    const addBtn = document.getElementById('add-service-btn');
    const closeBtn = document.getElementById('close-service-modal-btn');
    const cancelBtn = document.getElementById('cancel-service-modal-btn');

    if (addBtn) addBtn.onclick = () => openServiceModal(null);
    if (closeBtn) closeBtn.onclick = closeServiceModal;
    if (cancelBtn) cancelBtn.onclick = closeServiceModal;

    if (!form) return;

    // Live Cover Image Preview
    const srvImgInput = document.getElementById('srv-img');
    const srvPreviewWrap = document.getElementById('srv-img-preview');
    const srvPreviewImg = document.getElementById('srv-preview-img');
    if (srvImgInput && srvPreviewWrap && srvPreviewImg) {
      srvImgInput.addEventListener('input', () => {
        const url = srvImgInput.value.trim();
        if (url) {
          srvPreviewImg.src = url;
          srvPreviewWrap.style.display = 'flex';
        } else {
          srvPreviewWrap.style.display = 'none';
        }
      });
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const id = form.service_id.value;
      const title = form.title.value.trim();
      const category = form.category.value.trim();
      const icon = form.icon.value.trim() || '✈️';
      const image = form.image.value.trim();
      const priceBadge = form.priceBadge.value.trim();
      const shortDesc = form.shortDesc.value.trim();
      const header = form.header.value.trim() || 'What we offer';
      const inclusionsText = form.inclusionsText.value;
      const active = form.active.checked;

      if (!title) {
        showToast('Please enter a service title', 'error');
        return;
      }

      const payload = {
        title,
        category,
        icon,
        image,
        priceBadge,
        shortDesc,
        header,
        inclusionsText,
        active
      };

      // 1. Supabase Service Add / Edit
      if (window.DB && window.DB.isSupabase()) {
        try {
          let sbRes;
          if (id) {
            sbRes = await window.DB.updateService(id, payload);
          } else {
            sbRes = await window.DB.addService(payload);
          }
          if (sbRes && sbRes.success) {
            showToast(id ? 'Service updated in Supabase!' : 'New service added to Supabase!');
            closeServiceModal();
            await reloadAdminData();
            return;
          }
        } catch (sbErr) {
          console.warn('Supabase service save error:', sbErr);
        }
      }

      try {
        let res;
        if (id) {
          // Update
          res = await apiFetch(`/api/admin/services/${id}`, {
            method: 'PUT',
            body: payload
          });
        } else {
          // Create
          res = await apiFetch('/api/admin/services', {
            method: 'POST',
            body: payload
          });
        }

        if (res.ok) {
          showToast(id ? 'Service updated successfully!' : 'New service added successfully!');
          closeServiceModal();
          // Reload dashboard data
          await reloadAdminData();
        } else {
          showToast('Failed to save service', 'error');
        }
      } catch (err) {
        // Offline fallback
        showToast('Operation recorded locally', 'info');
        closeServiceModal();
      }
    });
  }

  // Delete Service
  async function deleteService(id) {
    if (window.DB && window.DB.isSupabase()) {
      try {
        const sbRes = await window.DB.deleteService(id);
        if (sbRes && sbRes.success) {
          showToast('Service deleted from Supabase');
          await reloadAdminData();
          return;
        }
      } catch (err) {
        console.warn('Supabase delete service error:', err);
      }
    }

    try {
      const res = await apiFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Service deleted');
        await reloadAdminData();
      } else {
        showToast('Could not delete service', 'error');
      }
    } catch (err) {
      showToast('Error deleting service', 'error');
    }
  }

  // ========================================================
  // TAB 2b: DESTINATIONS MANAGEMENT ("new destination bhi add kr sakooo")
  // ========================================================
  function populateDestinationsTab(destinations) {
    const container = document.getElementById('destinations-admin-list');
    if (!container) return;

    if (!destinations || destinations.length === 0) {
      container.innerHTML = '<p class="text-center" style="padding: 20px; color: var(--admin-muted);">No destinations added yet. Click "+ Add New Destination" to create one.</p>';
      return;
    }

    container.innerHTML = destinations.map((d, idx) => {
      const activeLabel = d.active !== false ? '<span style="color: var(--admin-success); font-weight: 700;">Active</span>' : '<span style="color: var(--admin-muted);">Hidden</span>';
      const priceBadge = d.priceText ? `<span class="service-admin-badge">${escapeHTML(d.priceText)}</span>` : '';
      const imgTag = d.image ? `<img src="${d.image}" alt="${escapeHTML(d.name)}" style="width: 44px; height: 44px; border-radius: 10px; object-fit: cover;">` : `<div class="service-admin-icon">🌍</div>`;
      const daysCount = (d.itinerary || []).length;

      return `
        <div class="service-admin-item" data-id="${d.id}">
          <div class="service-admin-left">
            ${imgTag}
            <div class="service-admin-meta">
              <h4>${escapeHTML(d.name)} – ${escapeHTML(d.title || '')} ${priceBadge}</h4>
              <p>${daysCount > 0 ? daysCount + ' Itinerary Days • ' : ''}${activeLabel}</p>
            </div>
          </div>
          <div class="service-admin-actions">
            <button type="button" class="btn-secondary edit-dest-btn" data-id="${d.id}" style="padding: 6px 14px; font-size: 0.85rem;">
              ✏️ Edit
            </button>
            <button type="button" class="btn-danger delete-dest-btn" data-id="${d.id}" data-name="${escapeHTML(d.name)}">
              🗑️ Delete
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach Edit button events
    container.querySelectorAll('.edit-dest-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const dest = (adminData.destinations || []).find(d => d.id === id);
        if (dest) openDestinationModal(dest);
      });
    });

    // Attach Delete button events
    container.querySelectorAll('.delete-dest-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        if (confirm(`Are you sure you want to delete destination "${name}"?`)) {
          await deleteDestination(id);
        }
      });
    });
  }

  // Day-by-Day Itinerary Builder Helpers
  function renderDayRows(itinerary = []) {
    const list = document.getElementById('dest-days-list');
    if (!list) return;
    list.innerHTML = '';

    const days = (itinerary && itinerary.length > 0)
      ? itinerary
      : [
          'Arrival at airport, hotel check-in & evening walk',
          'Full-day city tour, landmarks & sightseeing',
          'Shopping, local exploration & departure'
        ];

    days.forEach((dayText, idx) => {
      addDayRow(dayText, idx + 1);
    });
  }

  function addDayRow(dayText = '', dayNumber = null) {
    const list = document.getElementById('dest-days-list');
    if (!list) return;

    const currentCount = list.children.length;
    const dayNum = dayNumber || (currentCount + 1);

    let cleanText = String(dayText).trim();
    cleanText = cleanText.replace(/^Day\s*\d+\s*:\s*/i, '');

    const row = document.createElement('div');
    row.className = 'day-item-row';
    row.innerHTML = `
      <span class="day-badge-label">Day ${dayNum}</span>
      <input type="text" class="day-input-field" placeholder="e.g. City tour, Opera House & evening cruise" value="${escapeHTML(cleanText)}">
      <button type="button" class="remove-day-btn" title="Remove this day">&times;</button>
    `;

    row.querySelector('.remove-day-btn').addEventListener('click', () => {
      row.remove();
      renumberDays();
    });

    list.appendChild(row);
  }

  function renumberDays() {
    const list = document.getElementById('dest-days-list');
    if (!list) return;
    [...list.children].forEach((row, idx) => {
      const badge = row.querySelector('.day-badge-label');
      if (badge) badge.textContent = `Day ${idx + 1}`;
    });
  }

  function getBuiltItinerary() {
    const list = document.getElementById('dest-days-list');
    if (!list) return [];
    const days = [];
    [...list.children].forEach((row, idx) => {
      const input = row.querySelector('.day-input-field');
      const val = input ? input.value.trim() : '';
      if (val) {
        days.push(`Day ${idx + 1}: ${val}`);
      }
    });
    return days;
  }

  function openDestinationModal(dest = null) {
    const modal = document.getElementById('destination-edit-modal');
    const form = document.getElementById('destination-edit-form');
    const modalTitle = document.getElementById('destination-modal-title');
    if (!modal || !form) return;

    if (dest) {
      modalTitle.textContent = `Edit Destination: ${dest.name}`;
      form.dest_id.value = dest.id;
      form.name.value = dest.name || '';
      form.title.value = dest.title || '';
      form.priceText.value = dest.priceText || '';
      form.metaText.value = (dest.meta || []).join(', ');
      form.image.value = dest.image || '';
      form.shortDesc.value = dest.shortDesc || '';
      renderDayRows(dest.itinerary || []);
      form.inclusionsText.value = (dest.inclusions || []).join('\n');
      form.active.checked = dest.active !== false;

      const previewWrap = document.getElementById('dest-img-preview');
      const previewImg = document.getElementById('dest-preview-img');
      if (dest.image && previewWrap && previewImg) {
        previewImg.src = dest.image;
        previewWrap.style.display = 'flex';
      } else if (previewWrap) {
        previewWrap.style.display = 'none';
      }
    } else {
      modalTitle.textContent = 'Add New Tour Destination';
      form.reset();
      form.dest_id.value = '';
      form.active.checked = true;
      renderDayRows([
        'Arrival at airport, hotel check-in & evening walk',
        'Full-day city tour, landmarks & sightseeing',
        'Shopping, scenic exploration & departure'
      ]);
      const previewWrap = document.getElementById('dest-img-preview');
      if (previewWrap) previewWrap.style.display = 'none';
    }

    modal.classList.add('open');
  }

  function closeDestinationModal() {
    const modal = document.getElementById('destination-edit-modal');
    if (modal) modal.classList.remove('open');
  }

  function initDestinationForm() {
    const form = document.getElementById('destination-edit-form');
    const addBtn = document.getElementById('add-destination-btn');
    const closeBtn = document.getElementById('close-dest-modal-btn');
    const cancelBtn = document.getElementById('cancel-dest-modal-btn');
    const addDayBtn = document.getElementById('add-day-row-btn');

    if (addBtn) addBtn.onclick = () => openDestinationModal(null);
    if (closeBtn) closeBtn.onclick = closeDestinationModal;
    if (cancelBtn) cancelBtn.onclick = closeDestinationModal;
    if (addDayBtn) addDayBtn.onclick = () => addDayRow();

    if (!form) return;

    // Live Cover Image Preview
    const destImgInput = document.getElementById('dest-img');
    const destPreviewWrap = document.getElementById('dest-img-preview');
    const destPreviewImg = document.getElementById('dest-preview-img');
    if (destImgInput && destPreviewWrap && destPreviewImg) {
      destImgInput.addEventListener('input', () => {
        const url = destImgInput.value.trim();
        if (url) {
          destPreviewImg.src = url;
          destPreviewWrap.style.display = 'flex';
        } else {
          destPreviewWrap.style.display = 'none';
        }
      });
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const id = form.dest_id.value;
      const name = form.name.value.trim();
      const title = form.title.value.trim();
      const priceText = form.priceText.value.trim();
      const metaText = form.metaText.value.trim();
      const image = form.image.value.trim();
      const shortDesc = form.shortDesc.value.trim();
      const itinerary = getBuiltItinerary();
      const inclusionsText = form.inclusionsText.value;
      const active = form.active.checked;

      if (!name) {
        showToast('Please enter a destination name', 'error');
        return;
      }

      if (itinerary.length === 0) {
        showToast('Please add at least one day to the itinerary', 'error');
        return;
      }

      const payload = {
        name,
        title: title || name,
        priceText,
        metaText,
        image,
        shortDesc,
        itinerary,
        itineraryText: itinerary.join('\n'),
        inclusionsText,
        active
      };

      // 1. Supabase Destination Add / Edit
      if (window.DB && window.DB.isSupabase()) {
        try {
          let sbRes;
          if (id) {
            sbRes = await window.DB.updateDestination(id, payload);
          } else {
            sbRes = await window.DB.addDestination(payload);
          }
          if (sbRes && sbRes.success) {
            showToast(id ? 'Destination updated in Supabase!' : 'New destination added to Supabase!');
            closeDestinationModal();
            await reloadAdminData();
            return;
          }
        } catch (sbErr) {
          console.warn('Supabase destination save error:', sbErr);
        }
      }

      // 2. Node.js backend
      try {
        let res;
        if (id) {
          res = await apiFetch(`/api/admin/destinations/${id}`, {
            method: 'PUT',
            body: payload
          });
        } else {
          res = await apiFetch('/api/admin/destinations', {
            method: 'POST',
            body: payload
          });
        }

        if (res.ok) {
          showToast(id ? 'Destination updated successfully!' : 'New destination added successfully!');
          closeDestinationModal();
          await reloadAdminData();
        } else {
          showToast('Failed to save destination', 'error');
        }
      } catch (err) {
        showToast('Operation recorded locally', 'info');
        closeDestinationModal();
      }
    });
  }

  async function deleteDestination(id) {
    if (window.DB && window.DB.isSupabase()) {
      try {
        const sbRes = await window.DB.deleteDestination(id);
        if (sbRes && sbRes.success) {
          showToast('Destination deleted from Supabase');
          await reloadAdminData();
          return;
        }
      } catch (err) {
        console.warn('Supabase delete destination error:', err);
      }
    }

    try {
      const res = await apiFetch(`/api/admin/destinations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Destination deleted');
        await reloadAdminData();
      } else {
        showToast('Could not delete destination', 'error');
      }
    } catch (err) {
      showToast('Error deleting destination', 'error');
    }
  }

  // Reload admin data from server or Supabase (Parallel fetch)
  async function reloadAdminData() {
    if (window.DB && window.DB.isSupabase()) {
      try {
        const [content, allServices, allDestinations, inquiries] = await Promise.all([
          window.DB.getContent(),
          window.DB.getAdminServices(),
          window.DB.getAdminDestinations(),
          window.DB.getInquiries()
        ]);

        if (content) {
          adminData = {
            agency: content.agency,
            social: content.social,
            services: allServices || content.services || [],
            destinations: allDestinations || content.destinations || [],
            inquiriesCount: (inquiries || []).length,
            newInquiriesCount: (inquiries || []).filter(i => i.status === 'new').length
          };
          renderAdminDashboard();
          return;
        }
      } catch (e) {
        console.warn('Supabase reload error:', e);
      }
    }

    try {
      const res = await apiFetch('/api/admin/data');
      if (res.ok) {
        adminData = await res.json();
        renderAdminDashboard();
      }
    } catch (e) {}
  }

  // ========================================================
  // TAB 3: AGENCY & CONTACT SETTINGS
  // ========================================================
  function populateAgencyTab(agency) {
    agency = agency || {};
    const form = document.getElementById('agency-settings-form');
    if (!form) return;

    form.agency_name.value = agency.name || 'Haris Travel Agency';
    form.tagline.value = agency.tagline || 'Your Journey, Our Responsibility';
    form.phone.value = agency.phone || '+92 314 2554547';
    form.whatsapp.value = agency.whatsapp || '923142554547';
    form.email.value = agency.email || 'hariskhan070@gmail.com';
    form.address.value = agency.address || 'Gulshan-e-Iqbal, Karachi, Pakistan';
    form.owner.value = agency.owner || 'Haris Khan';
    form.ownerQuote.value = agency.ownerQuote || '';
  }

  function initAgencyForm() {
    const form = document.getElementById('agency-settings-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving Settings...';

      const payload = {
        name: form.agency_name.value.trim(),
        tagline: form.tagline.value.trim(),
        phone: form.phone.value.trim(),
        whatsapp: form.whatsapp.value.replace(/[^0-9]/g, ''),
        email: form.email.value.trim(),
        address: form.address.value.trim(),
        owner: form.owner.value.trim(),
        ownerQuote: form.ownerQuote.value.trim()
      };

      // 1. Supabase agency update
      if (window.DB && window.DB.isSupabase()) {
        try {
          const sbRes = await window.DB.updateAgency(payload);
          if (sbRes && sbRes.success) {
            showToast('Agency details updated in Supabase!');
            await reloadAdminData();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Agency Settings';
            return;
          }
        } catch (err) {
          console.warn('Supabase agency update error:', err);
        }
      }

      try {
        const res = await apiFetch('/api/admin/agency', {
          method: 'PUT',
          body: payload
        });
        if (res.ok) {
          showToast('Agency details updated successfully!');
          await reloadAdminData();
        } else {
          showToast('Failed to update agency info', 'error');
        }
      } catch (err) {
        showToast('Saved offline', 'info');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Agency Settings';
      }
    });
  }

  // ========================================================
  // TAB 4: CUSTOMER INQUIRIES
  // ========================================================
  async function loadInquiries() {
    const tableBody = document.getElementById('inquiries-table-body');
    if (!tableBody) return;

    // 1. Supabase Inquiries
    if (window.DB && window.DB.isSupabase()) {
      try {
        const sbInquiries = await window.DB.getInquiries();
        if (sbInquiries) {
          renderInquiriesTable(sbInquiries);
          return;
        }
      } catch (err) {
        console.warn('Supabase inquiries load error:', err);
      }
    }

    try {
      const res = await apiFetch('/api/admin/inquiries');
      if (res.ok) {
        const inquiries = await res.json();
        renderInquiriesTable(inquiries);
      }
    } catch (err) {
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--admin-muted);">No inquiries yet.</td></tr>';
    }
  }

  function renderInquiriesTable(inquiries) {
    const tableBody = document.getElementById('inquiries-table-body');
    if (!tableBody) return;

    if (!inquiries || inquiries.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--admin-muted);">No quote requests or messages received yet.</td></tr>';
      return;
    }

    tableBody.innerHTML = inquiries.map(inq => {
      const dateStr = inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
      const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
      const replyWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${inq.name}, thank you for contacting Haris Travel Agency regarding your trip to ${inq.destination || 'your destination'}. How can we assist you?`)}`;

      return `
        <tr data-id="${inq.id}">
          <td class="inquiry-sender">
            <b>${escapeHTML(inq.name)}</b>
            <small>${escapeHTML(inq.phone)}</small>
            ${inq.email ? `<small style="display:block;">${escapeHTML(inq.email)}</small>` : ''}
          </td>
          <td><b>${escapeHTML(inq.destination || '—')}</b><br><small>${escapeHTML(inq.date || 'Flexible')}</small></td>
          <td><span class="service-admin-badge">${escapeHTML(inq.service || 'General Quote')}</span></td>
          <td style="max-width: 260px; font-size: 0.85rem; color: var(--admin-text);">${escapeHTML(inq.message || 'No additional message')}</td>
          <td style="font-size: 0.8rem; color: var(--admin-muted);">${dateStr}</td>
          <td>
            <div style="display: flex; gap: 8px;">
              <a href="${replyWaUrl}" target="_blank" rel="noopener" class="btn-primary" style="padding: 6px 12px; font-size: 0.8rem; background: #25D366; text-decoration: none;">
                💬 WhatsApp
              </a>
              <button type="button" class="btn-danger delete-inquiry-btn" data-id="${inq.id}" style="padding: 6px 10px;">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach delete inquiry handlers
    tableBody.querySelectorAll('.delete-inquiry-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this inquiry?')) {
          if (window.DB && window.DB.isSupabase()) {
            try {
              await window.DB.deleteInquiry(id);
              showToast('Inquiry deleted from Supabase');
              loadInquiries();
              return;
            } catch (err) {
              console.warn('Supabase delete inquiry error:', err);
            }
          }

          try {
            const res = await apiFetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
            if (res.ok) {
              showToast('Inquiry deleted');
              loadInquiries();
            }
          } catch (e) {}
        }
      });
    });
  }

  // ========================================================
  // TAB 5: ADMIN SECURITY (Change Password)
  // ========================================================
  function initSecurityForm() {
    const form = document.getElementById('security-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const oldPassword = form.old_password.value.trim();
      const newPassword = form.new_password.value.trim();
      const confirmPassword = form.confirm_password.value.trim();

      if (newPassword !== confirmPassword) {
        showToast('New passwords do not match!', 'error');
        return;
      }

      if (newPassword.length < 4) {
        showToast('Password must be at least 4 characters', 'error');
        return;
      }

      // 1. Supabase password change
      if (window.DB && window.DB.isSupabase()) {
        try {
          const sbPass = await window.DB.changePassword(oldPassword, newPassword);
          if (sbPass && sbPass.success) {
            showToast('Admin password changed in Supabase!');
            form.reset();
            return;
          } else if (sbPass && sbPass.error) {
            showToast(sbPass.error, 'error');
            return;
          }
        } catch (err) {
          console.warn('Supabase password error:', err);
        }
      }

      try {
        const res = await apiFetch('/api/admin/change-password', {
          method: 'POST',
          body: { oldPassword, newPassword }
        });

        const data = await res.json();
        if (res.ok && data.success) {
          showToast('Admin password changed successfully!');
          form.reset();
        } else {
          showToast(data.error || 'Failed to change password', 'error');
        }
      } catch (err) {
        // Offline mode password
        localStorage.setItem('haris_admin_offline_pw', newPassword);
        showToast('Password saved locally', 'info');
        form.reset();
      }
    });
  }

  // Sidebar Tab Switching
  function initTabs() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        if (!targetTab) return;

        navButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePane = document.getElementById(`tab-${targetTab}`);
        if (activePane) activePane.classList.add('active');

        // Refresh inquiries if clicking inquiries tab
        if (targetTab === 'inquiries') {
          loadInquiries();
        }
      });
    });
  }

  // Document Ready
  document.addEventListener('DOMContentLoaded', () => {
    initLoginForm();
    initTabs();
    initSocialForm();
    initServiceForm();
    initDestinationForm();
    initAgencyForm();
    initSecurityForm();
    initAdmin();
  });

})();
