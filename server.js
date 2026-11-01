/**
 * Haris Travel Agency - Native Node.js Server
 * Zero external dependencies required.
 * Run with: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const SITE_DATA_PATH = path.join(DATA_DIR, 'site-data.json');
const INQUIRIES_PATH = path.join(DATA_DIR, 'inquiries.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=UTF-8'
};

// In-memory active session tokens
const activeSessions = new Set();

// Helpers to read / write data safely
function getSiteData() {
  try {
    if (!fs.existsSync(SITE_DATA_PATH)) return null;
    return JSON.parse(fs.readFileSync(SITE_DATA_PATH, 'utf8'));
  } catch (err) {
    console.error('Error reading site data:', err);
    return null;
  }
}

function saveSiteData(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(SITE_DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving site data:', err);
    return false;
  }
}

function getInquiries() {
  try {
    if (!fs.existsSync(INQUIRIES_PATH)) return [];
    return JSON.parse(fs.readFileSync(INQUIRIES_PATH, 'utf8'));
  } catch (err) {
    console.error('Error reading inquiries:', err);
    return [];
  }
}

function saveInquiries(list) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(INQUIRIES_PATH, JSON.stringify(list, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving inquiries:', err);
    return false;
  }
}

// Request Body Parser Helper
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Body payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// JSON response helper
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Token Verification
function isAuthenticated(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  return activeSessions.has(token);
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  // Global CORS handling
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // ==========================================
  // API ROUTES
  // ==========================================

  // 1. GET /api/content - Public site content
  if (req.method === 'GET' && pathname === '/api/content') {
    const data = getSiteData();
    if (!data) return sendJSON(res, 500, { error: 'Failed to load content' });
    
    // Return sanitized public content (hide admin password/tokens)
    const publicData = {
      agency: data.agency,
      social: data.social,
      services: (data.services || []).filter(s => s.active !== false),
      destinations: (data.destinations || []).filter(d => d.active !== false)
    };
    return sendJSON(res, 200, publicData);
  }

  // 2. POST /api/inquiries - Submit quote request
  if (req.method === 'POST' && pathname === '/api/inquiries') {
    try {
      const body = await parseBody(req);
      const { name, phone, email, destination, date, service, message } = body;

      if (!name || !phone) {
        return sendJSON(res, 400, { error: 'Name and Phone are required' });
      }

      const inquiries = getInquiries();
      const newInquiry = {
        id: 'inq-' + Date.now(),
        name: String(name).trim(),
        phone: String(phone).trim(),
        email: String(email || '').trim(),
        destination: String(destination || '').trim(),
        date: String(date || '').trim(),
        service: String(service || '').trim(),
        message: String(message || '').trim(),
        createdAt: new Date().toISOString(),
        status: 'new'
      };

      inquiries.unshift(newInquiry);
      saveInquiries(inquiries);

      // Construct WhatsApp URL
      const siteData = getSiteData();
      const waNumber = (siteData && siteData.social && siteData.social.whatsapp) || '923142554547';
      const waMsg = `*New Travel Inquiry - Haris Travel Agency*\n\n` +
        `👤 *Name:* ${newInquiry.name}\n` +
        `📞 *Phone:* ${newInquiry.phone}\n` +
        (newInquiry.email ? `📧 *Email:* ${newInquiry.email}\n` : '') +
        (newInquiry.destination ? `📍 *Destination:* ${newInquiry.destination}\n` : '') +
        (newInquiry.date ? `📅 *Date:* ${newInquiry.date}\n` : '') +
        (newInquiry.service ? `🏷️ *Service:* ${newInquiry.service}\n` : '') +
        (newInquiry.message ? `💬 *Message:* ${newInquiry.message}\n` : '');

      const waUrl = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`;

      return sendJSON(res, 201, {
        success: true,
        message: 'Inquiry received successfully',
        inquiryId: newInquiry.id,
        whatsappUrl: waUrl
      });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to process inquiry' });
    }
  }

  // 3. POST /api/admin/login
  if (req.method === 'POST' && pathname === '/api/admin/login') {
    try {
      const { username, password } = await parseBody(req);
      const data = getSiteData();
      if (!data || !data.admin) return sendJSON(res, 500, { error: 'Admin configuration error' });

      if (username === data.admin.username && password === data.admin.passwordHash) {
        const token = crypto.randomBytes(32).toString('hex');
        activeSessions.add(token);
        return sendJSON(res, 200, {
          success: true,
          token,
          username: data.admin.username
        });
      } else {
        return sendJSON(res, 401, { error: 'Invalid username or password' });
      }
    } catch (err) {
      return sendJSON(res, 500, { error: 'Login error' });
    }
  }

  // 4. POST /api/admin/logout
  if (req.method === 'POST' && pathname === '/api/admin/logout') {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      activeSessions.delete(token);
    }
    return sendJSON(res, 200, { success: true });
  }

  // 5. GET /api/admin/data - Full admin dashboard data
  if (req.method === 'GET' && pathname === '/api/admin/data') {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    const data = getSiteData();
    const inquiries = getInquiries();
    return sendJSON(res, 200, {
      agency: data.agency,
      social: data.social,
      services: data.services || [],
      destinations: data.destinations || [],
      inquiriesCount: inquiries.length,
      newInquiriesCount: inquiries.filter(i => i.status === 'new').length
    });
  }

  // 6. PUT /api/admin/social - Update Social Media (Facebook, Instagram, WhatsApp)
  if (req.method === 'PUT' && pathname === '/api/admin/social') {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    try {
      const { facebook, instagram, whatsapp } = await parseBody(req);
      const data = getSiteData();

      data.social = {
        facebook: (facebook || '').trim(),
        instagram: (instagram || '').trim(),
        whatsapp: (whatsapp || '').replace(/[^0-9+]/g, '').trim()
      };

      // Also update agency.whatsapp if changed
      if (whatsapp) {
        data.agency.whatsapp = data.social.whatsapp.replace(/[^0-9]/g, '');
      }

      saveSiteData(data);
      return sendJSON(res, 200, { success: true, social: data.social });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to update social links' });
    }
  }

  // 7. PUT /api/admin/agency - Update Agency Information
  if (req.method === 'PUT' && pathname === '/api/admin/agency') {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    try {
      const update = await parseBody(req);
      const data = getSiteData();

      data.agency = Object.assign({}, data.agency, update);
      // keep clean phone synced
      if (update.phone) {
        data.agency.phoneClean = update.phone.replace(/[^0-9+]/g, '');
      }
      if (update.whatsapp) {
        data.social.whatsapp = update.whatsapp.replace(/[^0-9]/g, '');
      }

      saveSiteData(data);
      return sendJSON(res, 200, { success: true, agency: data.agency });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to update agency info' });
    }
  }

  // 8. Services API: POST /api/admin/services (Create new service)
  if (req.method === 'POST' && pathname === '/api/admin/services') {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    try {
      const newService = await parseBody(req);
      if (!newService.title) return sendJSON(res, 400, { error: 'Title is required' });

      const data = getSiteData();
      if (!data.services) data.services = [];

      const id = 'srv-' + Date.now();
      const service = {
        id,
        title: String(newService.title).trim(),
        category: String(newService.category || 'General').trim(),
        icon: String(newService.icon || '✈️').trim(),
        image: String(newService.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80').trim(),
        shortDesc: String(newService.shortDesc || '').trim(),
        priceBadge: String(newService.priceBadge || 'Price on request').trim(),
        header: String(newService.header || 'What we offer').trim(),
        meta: Array.isArray(newService.meta) ? newService.meta : [],
        itinerary: Array.isArray(newService.itinerary) ? newService.itinerary : [],
        inclusions: Array.isArray(newService.inclusions) ? newService.inclusions : (newService.inclusionsText ? newService.inclusionsText.split('\n').map(s => s.trim()).filter(Boolean) : []),
        active: newService.active !== false,
        featured: Boolean(newService.featured)
      };

      data.services.push(service);
      saveSiteData(data);
      return sendJSON(res, 201, { success: true, service });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to create service' });
    }
  }

  // 9. Services API: PUT /api/admin/services/:id (Update service)
  if (req.method === 'PUT' && pathname.startsWith('/api/admin/services/')) {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    try {
      const id = pathname.replace('/api/admin/services/', '').trim();
      const updates = await parseBody(req);
      const data = getSiteData();

      const index = (data.services || []).findIndex(s => s.id === id);
      if (index === -1) return sendJSON(res, 404, { error: 'Service not found' });

      if (updates.inclusionsText) {
        updates.inclusions = updates.inclusionsText.split('\n').map(s => s.trim()).filter(Boolean);
        delete updates.inclusionsText;
      }

      data.services[index] = Object.assign({}, data.services[index], updates);
      saveSiteData(data);
      return sendJSON(res, 200, { success: true, service: data.services[index] });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to update service' });
    }
  }

  // 10. Services API: DELETE /api/admin/services/:id (Delete service)
  if (req.method === 'DELETE' && pathname.startsWith('/api/admin/services/')) {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    try {
      const id = pathname.replace('/api/admin/services/', '').trim();
      const data = getSiteData();

      const initialLength = (data.services || []).length;
      data.services = (data.services || []).filter(s => s.id !== id);

      if (data.services.length === initialLength) {
        return sendJSON(res, 404, { error: 'Service not found' });
      }

      saveSiteData(data);
      return sendJSON(res, 200, { success: true, message: 'Service deleted' });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to delete service' });
    }
  }

  // 10b. Destinations API: POST /api/admin/destinations (Create new destination)
  if (req.method === 'POST' && pathname === '/api/admin/destinations') {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    try {
      const newDest = await parseBody(req);
      if (!newDest.name) return sendJSON(res, 400, { error: 'Destination name is required' });

      const data = getSiteData();
      if (!data.destinations) data.destinations = [];

      const id = 'dest-' + Date.now();
      const meta = Array.isArray(newDest.meta) ? newDest.meta : (newDest.metaText ? newDest.metaText.split(',').map(s => s.trim()).filter(Boolean) : []);
      const itinerary = Array.isArray(newDest.itinerary) ? newDest.itinerary : (newDest.itineraryText ? newDest.itineraryText.split('\n').map(s => s.trim()).filter(Boolean) : []);
      const inclusions = Array.isArray(newDest.inclusions) ? newDest.inclusions : (newDest.inclusionsText ? newDest.inclusionsText.split('\n').map(s => s.trim()).filter(Boolean) : []);

      const destination = {
        id,
        name: String(newDest.name).trim(),
        title: String(newDest.title || newDest.name).trim(),
        shortDesc: String(newDest.shortDesc || '').trim(),
        meta,
        itinerary,
        inclusions,
        priceText: String(newDest.priceText || 'Price on request').trim(),
        image: String(newDest.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80').trim(),
        active: newDest.active !== false
      };

      data.destinations.push(destination);
      saveSiteData(data);
      return sendJSON(res, 201, { success: true, destination });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to create destination' });
    }
  }

  // 10c. Destinations API: PUT /api/admin/destinations/:id (Update destination)
  if (req.method === 'PUT' && pathname.startsWith('/api/admin/destinations/')) {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    try {
      const id = pathname.replace('/api/admin/destinations/', '').trim();
      const updates = await parseBody(req);
      const data = getSiteData();

      const index = (data.destinations || []).findIndex(d => d.id === id);
      if (index === -1) return sendJSON(res, 404, { error: 'Destination not found' });

      if (updates.metaText) {
        updates.meta = updates.metaText.split(',').map(s => s.trim()).filter(Boolean);
        delete updates.metaText;
      }
      if (updates.itineraryText) {
        updates.itinerary = updates.itineraryText.split('\n').map(s => s.trim()).filter(Boolean);
        delete updates.itineraryText;
      }
      if (updates.inclusionsText) {
        updates.inclusions = updates.inclusionsText.split('\n').map(s => s.trim()).filter(Boolean);
        delete updates.inclusionsText;
      }

      data.destinations[index] = Object.assign({}, data.destinations[index], updates);
      saveSiteData(data);
      return sendJSON(res, 200, { success: true, destination: data.destinations[index] });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to update destination' });
    }
  }

  // 10d. Destinations API: DELETE /api/admin/destinations/:id (Delete destination)
  if (req.method === 'DELETE' && pathname.startsWith('/api/admin/destinations/')) {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    try {
      const id = pathname.replace('/api/admin/destinations/', '').trim();
      const data = getSiteData();

      const initialLength = (data.destinations || []).length;
      data.destinations = (data.destinations || []).filter(d => d.id !== id);

      if (data.destinations.length === initialLength) {
        return sendJSON(res, 404, { error: 'Destination not found' });
      }

      saveSiteData(data);
      return sendJSON(res, 200, { success: true, message: 'Destination deleted' });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to delete destination' });
    }
  }

  // 11. Inquiries API: GET /api/admin/inquiries
  if (req.method === 'GET' && pathname === '/api/admin/inquiries') {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    const inquiries = getInquiries();
    return sendJSON(res, 200, inquiries);
  }

  // 12. Inquiries API: DELETE /api/admin/inquiries/:id
  if (req.method === 'DELETE' && pathname.startsWith('/api/admin/inquiries/')) {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    const id = pathname.replace('/api/admin/inquiries/', '').trim();
    let inquiries = getInquiries();
    const beforeCount = inquiries.length;
    inquiries = inquiries.filter(i => i.id !== id);
    if (inquiries.length === beforeCount) return sendJSON(res, 404, { error: 'Inquiry not found' });
    saveInquiries(inquiries);
    return sendJSON(res, 200, { success: true, message: 'Inquiry deleted' });
  }

  // 13. POST /api/admin/change-password
  if (req.method === 'POST' && pathname === '/api/admin/change-password') {
    if (!isAuthenticated(req)) return sendJSON(res, 401, { error: 'Unauthorized' });
    try {
      const { oldPassword, newPassword } = await parseBody(req);
      if (!newPassword || newPassword.length < 4) {
        return sendJSON(res, 400, { error: 'New password must be at least 4 characters long' });
      }

      const data = getSiteData();
      if (data.admin.passwordHash !== oldPassword) {
        return sendJSON(res, 400, { error: 'Current password does not match' });
      }

      data.admin.passwordHash = newPassword;
      saveSiteData(data);
      return sendJSON(res, 200, { success: true, message: 'Password updated successfully' });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to change password' });
    }
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  let filePath;
  if (pathname === '/' || pathname === '/index.html') {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  } else if (pathname === '/admin' || pathname === '/admin.html') {
    filePath = path.join(PUBLIC_DIR, 'admin.html');
  } else {
    // Normal static asset
    filePath = path.join(PUBLIC_DIR, pathname);
  }

  // Prevent path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Access denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isAsset = /\.(css|js|woff2|woff|svg|png|jpg|jpeg|webp|ico)$/i.test(ext);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isAsset ? 'public, max-age=3600' : 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`✈️  Haris Travel Agency Website & Admin Panel Running!`);
  console.log(`🌐 Website URL:     http://localhost:${PORT}`);
  console.log(`⚙️  Admin Panel (Hidden): http://localhost:${PORT}/admin`);
  console.log(`🔑 Admin Login:     Username: admin | Password: 569646`);
  console.log(`=======================================================`);
});
