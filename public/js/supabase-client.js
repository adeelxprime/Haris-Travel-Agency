/**
 * ========================================================
 * SUPABASE CLIENT ADAPTER - HARIS TRAVEL AGENCY
 * ========================================================
 * Provides unified database operations for both Supabase Cloud
 * and Local / Standalone mode.
 */

(function () {
  'use strict';

  let client = null;

  function isSupabaseConfigured() {
    const cfg = window.SUPABASE_CONFIG;
    return Boolean(
      cfg &&
      cfg.url &&
      cfg.url.startsWith('http') &&
      cfg.anonKey &&
      cfg.anonKey.length > 20 &&
      !cfg.url.includes('your-project-id')
    );
  }

  function getClient() {
    if (client) return client;
    if (isSupabaseConfigured() && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        client = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
        console.log('⚡ Connected to Supabase Cloud Database!');
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
      }
    }
    return client;
  }

  // Database Service API
  window.DB = {
    isSupabase: () => Boolean(getClient()),

    // 1. Fetch all public site content (Settings, Services, Destinations)
    async getContent() {
      const sb = getClient();
      if (!sb) return null; // Use fallback if not connected

      try {
        // Fetch Settings
        const { data: settingsData, error: sErr } = await sb
          .from('site_settings')
          .select('*')
          .eq('id', 'main')
          .single();

        if (sErr) throw sErr;

        // Fetch Services (Active only)
        const { data: servicesData, error: srvErr } = await sb
          .from('services')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: true });

        if (srvErr) throw srvErr;

        // Fetch Destinations
        const { data: destsData, error: dErr } = await sb
          .from('destinations')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: true });

        if (dErr) throw dErr;

        return {
          agency: {
            name: settingsData.agency_name || 'Haris Travel Agency',
            tagline: settingsData.tagline || 'Your Journey, Our Responsibility',
            phone: settingsData.phone || '+92 314 2554547',
            phoneClean: (settingsData.phone || '+923142554547').replace(/[^0-9+]/g, ''),
            whatsapp: settingsData.whatsapp || '923142554547',
            email: settingsData.email || 'hariskhan070@gmail.com',
            address: settingsData.address || 'Gulshan-e-Iqbal, Karachi, Pakistan',
            owner: settingsData.owner || 'Haris Khan',
            ownerQuote: settingsData.owner_quote || ''
          },
          social: {
            facebook: settingsData.facebook || '',
            instagram: settingsData.instagram || '',
            whatsapp: settingsData.whatsapp || ''
          },
          services: (servicesData || []).map(s => ({
            id: s.id,
            title: s.title,
            category: s.category,
            icon: s.icon,
            image: s.image_url || s.image || '',
            shortDesc: s.short_desc,
            priceBadge: s.price_badge,
            header: s.header,
            inclusions: Array.isArray(s.inclusions) ? s.inclusions : [],
            active: s.active
          })),
          destinations: (destsData || []).map(d => ({
            id: d.id,
            name: d.name,
            title: d.title,
            shortDesc: d.short_desc,
            meta: Array.isArray(d.meta) ? d.meta : [],
            itinerary: Array.isArray(d.itinerary) ? d.itinerary : [],
            inclusions: Array.isArray(d.inclusions) ? d.inclusions : [],
            priceText: d.price_text,
            image: d.image_url,
            active: d.active
          }))
        };
      } catch (err) {
        console.error('Supabase getContent error:', err);
        return null;
      }
    },

    // 2. Submit Inquiry
    async submitInquiry(inquiry) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const { data, error } = await sb
          .from('inquiries')
          .insert([{
            name: inquiry.name,
            phone: inquiry.phone,
            email: inquiry.email || '',
            destination: inquiry.destination || '',
            date: inquiry.date || '',
            service: inquiry.service || '',
            message: inquiry.message || '',
            status: 'new'
          }])
          .select();

        if (error) throw error;
        return { success: true, id: data && data[0] && data[0].id };
      } catch (err) {
        console.error('Supabase submitInquiry error:', err);
        return null;
      }
    },

    // 3. Admin Login
    async adminLogin(username, password) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const { data, error } = await sb
          .from('admin_config')
          .select('*')
          .eq('id', 'admin')
          .single();

        if (error) throw error;

        if (username === 'admin' && data && data.password_hash === password) {
          return { success: true, token: 'sb-token-' + Date.now() };
        } else {
          return { success: false, error: 'Invalid username or password' };
        }
      } catch (err) {
        console.error('Supabase login error:', err);
        return null;
      }
    },

    // 4. Update Social Links (Instagram, Facebook, WhatsApp)
    async updateSocial(social) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const { data, error } = await sb
          .from('site_settings')
          .update({
            facebook: (social.facebook || '').trim(),
            instagram: (social.instagram || '').trim(),
            whatsapp: (social.whatsapp || '').replace(/[^0-9]/g, '').trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', 'main')
          .select();

        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        console.error('Supabase updateSocial error:', err);
        return null;
      }
    },

    // 5. Update Agency Information
    async updateAgency(agency) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const { data, error } = await sb
          .from('site_settings')
          .update({
            agency_name: agency.name,
            tagline: agency.tagline,
            phone: agency.phone,
            whatsapp: agency.whatsapp,
            email: agency.email,
            address: agency.address,
            owner: agency.owner,
            owner_quote: agency.ownerQuote,
            updated_at: new Date().toISOString()
          })
          .eq('id', 'main')
          .select();

        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        console.error('Supabase updateAgency error:', err);
        return null;
      }
    },

    // 6. Fetch All Services for Admin (including inactive)
    async getAdminServices() {
      const sb = getClient();
      if (!sb) return null;

      try {
        const { data, error } = await sb
          .from('services')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        return data.map(s => ({
          id: s.id,
          title: s.title,
          category: s.category,
          icon: s.icon,
          image: s.image_url || s.image || '',
          shortDesc: s.short_desc,
          priceBadge: s.price_badge,
          header: s.header,
          inclusions: Array.isArray(s.inclusions) ? s.inclusions : [],
          active: s.active
        }));
      } catch (err) {
        console.error('Supabase getAdminServices error:', err);
        return null;
      }
    },

    // 7. Add Service
    async addService(srv) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const inclusions = Array.isArray(srv.inclusions)
          ? srv.inclusions
          : (srv.inclusionsText ? srv.inclusionsText.split('\n').map(x => x.trim()).filter(Boolean) : []);

        const { data, error } = await sb
          .from('services')
          .insert([{
            title: srv.title,
            category: srv.category || 'Tours',
            icon: srv.icon || '✈️',
            image_url: srv.image || '',
            short_desc: srv.shortDesc || '',
            price_badge: srv.priceBadge || '',
            header: srv.header || 'What we offer',
            inclusions: inclusions,
            active: srv.active !== false
          }])
          .select();

        if (error) throw error;
        return { success: true, service: data[0] };
      } catch (err) {
        console.error('Supabase addService error:', err);
        return null;
      }
    },

    // 8. Update Service
    async updateService(id, srv) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const inclusions = Array.isArray(srv.inclusions)
          ? srv.inclusions
          : (srv.inclusionsText ? srv.inclusionsText.split('\n').map(x => x.trim()).filter(Boolean) : []);

        const { data, error } = await sb
          .from('services')
          .update({
            title: srv.title,
            category: srv.category,
            icon: srv.icon,
            image_url: srv.image || '',
            short_desc: srv.shortDesc,
            price_badge: srv.priceBadge,
            header: srv.header,
            inclusions: inclusions,
            active: srv.active !== false
          })
          .eq('id', id)
          .select();

        if (error) throw error;
        return { success: true, service: data[0] };
      } catch (err) {
        console.error('Supabase updateService error:', err);
        return null;
      }
    },

    // 9. Delete Service
    async deleteService(id) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const { error } = await sb.from('services').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.error('Supabase deleteService error:', err);
        return null;
      }
    },

    // 9b. Fetch All Destinations for Admin
    async getAdminDestinations() {
      const sb = getClient();
      if (!sb) return null;

      try {
        const { data, error } = await sb
          .from('destinations')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        return data.map(d => ({
          id: d.id,
          name: d.name,
          title: d.title,
          shortDesc: d.short_desc,
          meta: Array.isArray(d.meta) ? d.meta : [],
          itinerary: Array.isArray(d.itinerary) ? d.itinerary : [],
          inclusions: Array.isArray(d.inclusions) ? d.inclusions : [],
          priceText: d.price_text,
          image: d.image_url,
          active: d.active
        }));
      } catch (err) {
        console.error('Supabase getAdminDestinations error:', err);
        return null;
      }
    },

    // 9c. Add Destination ("new destination bhi add kr sakooo")
    async addDestination(dest) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const meta = Array.isArray(dest.meta)
          ? dest.meta
          : (dest.metaText ? dest.metaText.split(',').map(x => x.trim()).filter(Boolean) : []);
        const itinerary = Array.isArray(dest.itinerary)
          ? dest.itinerary
          : (dest.itineraryText ? dest.itineraryText.split('\n').map(x => x.trim()).filter(Boolean) : []);
        const inclusions = Array.isArray(dest.inclusions)
          ? dest.inclusions
          : (dest.inclusionsText ? dest.inclusionsText.split('\n').map(x => x.trim()).filter(Boolean) : []);

        const { data, error } = await sb
          .from('destinations')
          .insert([{
            name: dest.name,
            title: dest.title || dest.name,
            short_desc: dest.shortDesc || '',
            meta: meta,
            itinerary: itinerary,
            inclusions: inclusions,
            price_text: dest.priceText || 'Price on request',
            image_url: dest.image || '',
            active: dest.active !== false
          }])
          .select();

        if (error) throw error;
        return { success: true, destination: data[0] };
      } catch (err) {
        console.error('Supabase addDestination error:', err);
        return null;
      }
    },

    // 9d. Update Destination
    async updateDestination(id, dest) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const meta = Array.isArray(dest.meta)
          ? dest.meta
          : (dest.metaText ? dest.metaText.split(',').map(x => x.trim()).filter(Boolean) : []);
        const itinerary = Array.isArray(dest.itinerary)
          ? dest.itinerary
          : (dest.itineraryText ? dest.itineraryText.split('\n').map(x => x.trim()).filter(Boolean) : []);
        const inclusions = Array.isArray(dest.inclusions)
          ? dest.inclusions
          : (dest.inclusionsText ? dest.inclusionsText.split('\n').map(x => x.trim()).filter(Boolean) : []);

        const { data, error } = await sb
          .from('destinations')
          .update({
            name: dest.name,
            title: dest.title,
            short_desc: dest.shortDesc,
            meta: meta,
            itinerary: itinerary,
            inclusions: inclusions,
            price_text: dest.priceText,
            image_url: dest.image,
            active: dest.active !== false
          })
          .eq('id', id)
          .select();

        if (error) throw error;
        return { success: true, destination: data[0] };
      } catch (err) {
        console.error('Supabase updateDestination error:', err);
        return null;
      }
    },

    // 9e. Delete Destination
    async deleteDestination(id) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const { error } = await sb.from('destinations').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.error('Supabase deleteDestination error:', err);
        return null;
      }
    },

    // 10. Fetch Customer Inquiries
    async getInquiries() {
      const sb = getClient();
      if (!sb) return null;

      try {
        const { data, error } = await sb
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map(i => ({
          id: i.id,
          name: i.name,
          phone: i.phone,
          email: i.email,
          destination: i.destination,
          date: i.date,
          service: i.service,
          message: i.message,
          status: i.status,
          createdAt: i.created_at
        }));
      } catch (err) {
        console.error('Supabase getInquiries error:', err);
        return null;
      }
    },

    // 11. Delete Inquiry
    async deleteInquiry(id) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const { error } = await sb.from('inquiries').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.error('Supabase deleteInquiry error:', err);
        return null;
      }
    },

    // 12. Change Password
    async changePassword(oldPassword, newPassword) {
      const sb = getClient();
      if (!sb) return null;

      try {
        const { data, error: checkErr } = await sb
          .from('admin_config')
          .select('*')
          .eq('id', 'admin')
          .single();

        if (checkErr) throw checkErr;

        if (data.password_hash !== oldPassword) {
          return { success: false, error: 'Current password does not match' };
        }

        const { error } = await sb
          .from('admin_config')
          .update({
            password_hash: newPassword,
            updated_at: new Date().toISOString()
          })
          .eq('id', 'admin');

        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.error('Supabase changePassword error:', err);
        return null;
      }
    }
  };
})();
