-- ========================================================
-- HARIS TRAVEL AGENCY - SUPABASE DATABASE SCHEMA
-- Copy and paste this complete SQL in Supabase SQL Editor and click 'Run'.
-- ========================================================

-- 1. SITE SETTINGS TABLE (Social Media Links & Agency Info)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  -- 3 Social Media Links
  facebook TEXT DEFAULT 'https://facebook.com/HarisTravelAgency',
  instagram TEXT DEFAULT 'https://instagram.com/HarisTravelAgency',
  whatsapp TEXT DEFAULT '923142554547',
  -- Agency Contact Info
  agency_name TEXT DEFAULT 'Haris Travel Agency',
  tagline TEXT DEFAULT 'Your Journey, Our Responsibility',
  phone TEXT DEFAULT '+92 314 2554547',
  email TEXT DEFAULT 'hariskhan070@gmail.com',
  address TEXT DEFAULT 'Gulshan-e-Iqbal, Karachi, Pakistan',
  owner TEXT DEFAULT 'Haris Khan',
  owner_quote TEXT DEFAULT 'Every traveler deserves honest advice and a team that stays reachable. I am committed to your satisfaction, professional travel assistance, and transparent pricing.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. SERVICES TABLE (Managed dynamically by Admin)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Tours',
  icon TEXT DEFAULT '✈️',
  image_url TEXT,
  short_desc TEXT,
  price_badge TEXT,
  header TEXT DEFAULT 'What we offer',
  inclusions JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. DESTINATIONS TABLE
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  short_desc TEXT,
  meta JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  inclusions JSONB DEFAULT '[]'::jsonb,
  price_text TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. INQUIRIES & QUOTES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  destination TEXT,
  date TEXT,
  service TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. ADMIN AUTH CONFIG TABLE (Password: 569646)
CREATE TABLE IF NOT EXISTS public.admin_config (
  id TEXT PRIMARY KEY DEFAULT 'admin',
  password_hash TEXT DEFAULT '569646',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- Allow Public to Read settings, services, destinations
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Read Destinations" ON public.destinations FOR SELECT USING (true);

-- Allow Public to Insert customer inquiries from the website form
CREATE POLICY "Public Insert Inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Allow Admin operations (with anon key for ease of configuration or authenticated)
CREATE POLICY "Allow All Site Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Destinations" ON public.destinations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Admin Config" ON public.admin_config FOR ALL USING (true) WITH CHECK (true);

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================

-- Insert Initial Site Settings (Instagram, Facebook, WhatsApp & Agency Info)
INSERT INTO public.site_settings (id, facebook, instagram, whatsapp, agency_name, tagline, phone, email, address, owner)
VALUES (
  'main',
  'https://facebook.com/HarisTravelAgency',
  'https://instagram.com/HarisTravelAgency',
  '923142554547',
  'Haris Travel Agency',
  'Your Journey, Our Responsibility',
  '+92 314 2554547',
  'hariskhan070@gmail.com',
  'Gulshan-e-Iqbal, Karachi, Pakistan',
  'Haris Khan'
)
ON CONFLICT (id) DO UPDATE SET
  facebook = EXCLUDED.facebook,
  instagram = EXCLUDED.instagram,
  whatsapp = EXCLUDED.whatsapp;

-- Insert Initial Admin Password (569646)
INSERT INTO public.admin_config (id, password_hash)
VALUES ('admin', '569646')
ON CONFLICT (id) DO UPDATE SET password_hash = '569646';

-- Insert Initial 10 Travel Services With Real Pictures
INSERT INTO public.services (title, category, icon, image_url, short_desc, price_badge, header, inclusions, active)
VALUES
  (
    'Air Tickets',
    'Flights',
    '✈️',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    'Domestic and international flights at competitive fares on all major airlines.',
    'Send route and dates for best fare',
    'What we offer',
    '["Emirates, PIA, Turkish Airlines, Qatar Airways, Etihad, Saudia and more", "One-way, return and multi-city bookings", "Group and family fares", "Date changes and cancellation support"]'::jsonb,
    true
  ),
  (
    'Holiday & Tour Packages',
    'Tours',
    '🧳',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    'Ready and customized packages with hotels, transfers and guided sightseeing.',
    'Dubai, Turkey, Malaysia & worldwide',
    'Popular destinations',
    '["Dubai – 7 days packages", "Malaysia – 7 days beach & hill tours", "Turkey – 8 days Istanbul & Cappadocia", "UK, Canada and USA on request"]'::jsonb,
    true
  ),
  (
    'Hotel Reservations',
    'Hotels',
    '🏨',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'Hotels matched to your budget, location, and travel dates with confirmed vouchers.',
    'Best Rate Guarantee',
    'What we offer',
    '["3, 4 and 5 star luxury hotels worldwide", "Close-to-Haram hotels for Umrah pilgrims", "Family suites and connecting rooms", "Instant confirmation before travel"]'::jsonb,
    true
  ),
  (
    'Visa Assistance',
    'Visa',
    '🛂',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    'Complete guidance and file preparation for your visa applications.',
    'Canada / Italy from PKR 185,000',
    'Countries we assist with',
    '["Canada and Italy – complete file process", "UAE, Turkey, Malaysia and Schengen visas", "Document checklist and bank statement guidance", "Appointment scheduling and submission support"]'::jsonb,
    true
  ),
  (
    'Umrah Packages',
    'Umrah',
    '🕋',
    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    'Comfortable Makkah and Madinah spiritual journeys with guided ziyarat.',
    'PKR 175,000 per person (15 Days)',
    'Package includes',
    '["Confirmed hotels near Masjid an-Nabawi and Masjid al-Haram", "AC transport between cities and holy sites", "Complete guidance for Umrah rituals", "Flight bookings and visa processing"]'::jsonb,
    true
  ),
  (
    'Honeymoon Packages',
    'Tours',
    '💞',
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',
    'Private, romantic trips specially designed for newlywed couples.',
    'Private transfers & candle-light dinners',
    'Popular choices',
    '["Island escapes such as Langkawi (Malaysia)", "Dubai city luxury and desert resorts", "Candlelight beach dinners and private transport", "Complimentary flowers and celebration arrangements"]'::jsonb,
    true
  ),
  (
    'Family Vacations',
    'Tours',
    '👨‍👩‍👧',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
    'Comfortable plans for all ages, kids and grandparents included.',
    'Family-friendly hotels & theme parks',
    'What we offer',
    '["Family suites and connecting rooms", "Kid-friendly attractions and theme park passes", "Relaxed travel itineraries without rushing", "Halal food friendly planning"]'::jsonb,
    true
  ),
  (
    'Corporate Travel',
    'Corporate',
    '💼',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    'Business trip management, flexible bookings, and corporate billing support.',
    'Priority corporate WhatsApp desk',
    'What we offer',
    '["Flight and hotel bookings for company staff", "Group and annual conference packages", "Official invoices and billing support", "24/7 emergency rescheduling assistance"]'::jsonb,
    true
  ),
  (
    'Airport Transfers',
    'Transport',
    '🚐',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    'Reliable pickup and drop-off at departure and arrival airports.',
    'Private AC cars and vans',
    'What we offer',
    '["Private luxury sedans, SUVs, and passenger vans", "Karachi airport pickup & drop services", "Meet & greet assistance at international terminals", "Reliable chauffeurs with flight tracking"]'::jsonb,
    true
  ),
  (
    'Customized Packages',
    'Custom',
    '🧭',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    'Tell us your plan, travel dates and budget; we build the perfect trip for you.',
    '100% tailor-made to your budget',
    'How it works',
    '["Share your desired destinations, dates, and group size", "Receive customized quotation and itinerary options", "Adjust dates or hotels until you are completely satisfied", "Instant confirmation through WhatsApp"]'::jsonb,
    true
  );

-- Insert Initial Destinations With Real Pictures
INSERT INTO public.destinations (name, title, short_desc, meta, itinerary, inclusions, price_text, image_url, active)
VALUES
  (
    'Dubai',
    'Dubai – 7 Days Tour',
    'City of skyscrapers, desert adventure and shopping, ideal for families and couples.',
    '["7 days / 6 nights", "Best: Nov – Mar", "Dubai + Abu Dhabi"]'::jsonb,
    '["Day 1: Arrival, hotel check-in, Dubai Marina & JBR walk", "Day 2: Old Dubai – Gold & Spice Souk, Abra ride", "Day 3: Burj Khalifa, Dubai Mall & Fountain show", "Day 4: Desert safari with BBQ dinner & dune bashing", "Day 5: Abu Dhabi day trip – Sheikh Zayed Mosque", "Day 6: Museum of the Future & shopping", "Day 7: Airport drop-off"]'::jsonb,
    '["Hotel stay with breakfast", "Airport pickup & drop", "Desert Safari with dinner", "Abu Dhabi tour with guide"]'::jsonb,
    'Price on request (Season dependent)',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Malaysia',
    'Malaysia – 7 Days Tour',
    'Modern city, hill resorts and tropical islands in a single memorable trip.',
    '["7 days / 6 nights", "Best: Mar – Oct", "Kuala Lumpur + Langkawi"]'::jsonb,
    '["Day 1: Arrival in Kuala Lumpur, hotel check-in", "Day 2: KL city tour – Petronas Towers, Batu Caves", "Day 3: Putrajaya & Bukit Bintang shopping", "Day 4: Genting Highlands cable car & theme park", "Day 5: Flight to Langkawi beach", "Day 6: Island hopping & Sky Bridge", "Day 7: Return flight to KL / departure"]'::jsonb,
    '["Hotels in KL & Langkawi", "Domestic flight KL-Langkawi", "Cable car tickets", "Airport transfers"]'::jsonb,
    'Price on request',
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Turkey',
    'Turkey – 8 Days Tour',
    'History, culture and fairy-tale landscapes across Istanbul & Cappadocia.',
    '["8 days / 7 nights", "Best: Apr – Jun, Sep – Nov", "Istanbul + Cappadocia"]'::jsonb,
    '["Day 1: Arrival in Istanbul", "Day 2: Hagia Sophia, Blue Mosque, Grand Bazaar", "Day 3: Bosphorus cruise & Taksim Square", "Day 4: Bursa day trip", "Day 5: Flight to Cappadocia", "Day 6: Cappadocia valleys & hot air balloon", "Day 7: Return to Istanbul", "Day 8: Departure"]'::jsonb,
    '["Hotels in Istanbul & Cappadocia", "Domestic flights", "Bosphorus cruise", "Historical tours with guide"]'::jsonb,
    'Price on request',
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Saudi Arabia',
    'Umrah Package – Makkah & Madinah (15 Days)',
    'A complete spiritual journey with comfortable stays and guided ziyarat.',
    '["15 days", "Madinah + Makkah", "Per person"]'::jsonb,
    '["Day 1: Flight to Saudi Arabia, transfer to Madinah hotel", "Days 2-6: Madinah – Masjid an-Nabawi & Ziyarat", "Day 7: Travel to Makkah, perform Umrah", "Days 8-13: Makkah – Prayers at Masjid al-Haram & Ziyarat", "Day 14: Farewell Tawaf", "Day 15: Airport transfer & return flight"]'::jsonb,
    '["Hotels in Madinah & Makkah near Haram", "AC transport between cities & ziyarat", "Umrah ritual guidance", "Visa & flights assistance"]'::jsonb,
    'PKR 175,000 per person (15 days)',
    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Australia',
    'Australia – 8 Days Sydney, Melbourne & Gold Coast',
    'Experience iconic Sydney landmarks, Melbourne culture, and Gold Coast theme parks and beaches.',
    '["8 days / 7 nights", "Best: Sep – Nov, Mar – May", "Sydney + Melbourne + Gold Coast"]'::jsonb,
    '["Day 1: Arrival at Sydney Airport, private hotel transfer, Darling Harbour walk", "Day 2: Sydney City Tour – Opera House, Harbour Bridge climb & Bondi Beach", "Day 3: Blue Mountains full day tour, Scenic World & Three Sisters", "Day 4: Domestic flight to Melbourne, Federation Square & Yarra cruise", "Day 5: Great Ocean Road tour – 12 Apostles & Loch Ard Gorge", "Day 6: Flight to Gold Coast, Surfers Paradise beach & sunset dining", "Day 7: Warner Bros. Movie World or Sea World Marine Park", "Day 8: Souvenir shopping, transfer to airport & departure"]'::jsonb,
    '["4-Star hotels with daily breakfast", "Domestic flights in Australia", "All airport transfers & tours with guide", "Theme park tickets at Gold Coast", "Complete Australian visa guidance"]'::jsonb,
    'PKR 385,000 per person (8 Days)',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'America (USA)',
    'America (USA) – 9 Days New York, Washington DC & Orlando',
    'Iconic metropolitan cities, historic national monuments, and world-class theme parks.',
    '["9 days / 8 nights", "Best: Apr – Jun, Sep – Oct", "New York, Washington DC, Orlando"]'::jsonb,
    '["Day 1: Arrival in New York JFK, Times Square evening walk", "Day 2: Statue of Liberty, Wall Street & Empire State Building", "Day 3: Brooklyn Bridge, 5th Avenue & Central Park", "Day 4: Scenic Amtrak train to Washington DC, National Mall", "Day 5: White House, US Capitol & Smithsonian Museums", "Day 6: Flight to Orlando Florida, resort check-in", "Day 7: Universal Studios or Walt Disney World Theme Park", "Day 8: Premium outlet shopping & Orlando lakefront dining", "Day 9: Airport transfer & departure flight"]'::jsonb,
    '["Luxury hotel accommodation with breakfast", "Domestic flight NYC to Orlando & train ticket", "Statue of Liberty & theme park admissions", "US visa appointment & file preparation guidance"]'::jsonb,
    'Price on request',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'United Kingdom',
    'United Kingdom – 7 Days London & Countryside',
    'London landmarks, historic castles and classic English countryside.',
    '["7 days / 6 nights", "Best: May – Sep", "London + day trips"]'::jsonb,
    '["Day 1: Arrival in London Heathrow, hotel check-in", "Day 2: Big Ben, Westminster Abbey, London Eye, Buckingham Palace", "Day 3: Tower of London, Tower Bridge, Borough Market", "Day 4: Windsor Castle & Oxford University day trip", "Day 5: Stonehenge & Bath guided day excursion", "Day 6: Madame Tussauds & Oxford Street shopping", "Day 7: Heathrow Airport transfer & departure"]'::jsonb,
    '["Centrally located 4-star London hotel", "Airport pickup & drop-off", "London Eye & Castle entry tickets", "UK visa guidance & document checking"]'::jsonb,
    'Price on request',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'Canada',
    'Canada – 8 Days Toronto, Niagara Falls & Ottawa',
    'Modern metropolitan skylines, thunderous waterfalls, and charming Canadian culture.',
    '["8 days / 7 nights", "Best: Jun – Sep", "Toronto, Niagara, Ottawa"]'::jsonb,
    '["Day 1: Arrival in Toronto Pearson Airport, hotel check-in", "Day 2: Toronto – CN Tower observation deck, Harbourfront", "Day 3: Niagara Falls full-day trip with boat cruise", "Day 4: Drive to Ottawa via 1000 Islands cruise", "Day 5: Ottawa – Parliament Hill, Rideau Canal tour", "Day 6: Montreal – Old Montreal & Notre-Dame Basilica", "Day 7: Free day for shopping and relaxation", "Day 8: Airport transfer & departure flight"]'::jsonb,
    '["Hotel stays in Toronto & Montreal with breakfast", "Niagara Falls cruise & CN Tower tickets", "Inter-city AC transportation", "Canada visa processing assistance"]'::jsonb,
    'Price on request',
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
    true
  );
