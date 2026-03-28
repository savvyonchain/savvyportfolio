-- INITIAL SCHEMA FOR SAVVY PORTFOLIO

-- 1. Create table for Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    angle TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    outcomes TEXT[] NOT NULL DEFAULT '{}',
    screenshot_url TEXT,
    video_url TEXT,
    icon_name TEXT DEFAULT 'zap',
    gradient_start TEXT DEFAULT '#6c3b89',
    gradient_end TEXT DEFAULT '#bf55ec',
    status TEXT DEFAULT 'Live',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table for Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 4. Set access rules

-- Anyone can READ projects
CREATE POLICY "Allow public read-only access to projects" 
ON projects FOR SELECT 
USING (true);

-- Only authenticated users (YOU) can CREATE, UPDATE, DELETE projects
CREATE POLICY "Allow authenticated users to manage projects" 
ON projects FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Anyone can CREATE a contact message (the contact form)
CREATE POLICY "Allow anyone to send messages" 
ON contact_messages FOR INSERT 
WITH CHECK (true);

-- Only authenticated users (YOU) can READ/MANAGE contact messages
CREATE POLICY "Allow authenticated users to read messages" 
ON contact_messages FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Seed some initial data
INSERT INTO projects (title, angle, category, description, problem, solution, outcomes, icon_name, gradient_start, gradient_end, status, order_index)
VALUES 
(
    'Client Portal Dashboard', 
    'Marketing Agency', 
    'Softr / Airtable', 
    'A complete end-to-end client portal for a marketing agency to securely manage deliverables, invoices, and communication.',
    'Clients were constantly emailing for status updates consuming 15+ hours of agency time per week.',
    'Built a secure Softr frontend synced bidirectionally with an Airtable CRM.',
    ARRAY['15 hours saved weekly', '100% invoice visibility'],
    'globe', 
    '#6c3b89', 
    '#bf55ec', 
    'Live', 
    0
),
(
    'Order Fulfillment Sync', 
    'E-Commerce', 
    'Shopify / Make.com', 
    'A real-time synchronization layer connecting Shopify orders to 3PL logistics and inventory tracking systems.',
    'Manual data-entry lead to delays and severe shipping errors.',
    'Configured Make.com workflows to map Shopify webhooks directly into vendor APIs.',
    ARRAY['0 data-entry errors', 'Same-day shipping unlocked'],
    'database', 
    '#11998e', 
    '#38ef7d', 
    'Live', 
    1
);

-- 6. Create table for Skills
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT DEFAULT 'code',
    accent_color TEXT DEFAULT '#9f66c2',
    hex_code TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create table for Tools
CREATE TABLE IF NOT EXISTS tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create table for Services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public READ
CREATE POLICY "Allow public read-only access to skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to tools" ON tools FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to services" ON services FOR SELECT USING (true);

-- Authenticated MANAGE
CREATE POLICY "Allow authenticated users to manage skills" ON skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage tools" ON tools FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. Storage Setup (Bucket for Portfolio Media)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- 1. Allow public to READ media
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio-media');

-- 2. Allow admins to MANAGE media
CREATE POLICY "Admin Manages Media" 
ON storage.objects FOR ALL 
TO authenticated 
USING (bucket_id = 'portfolio-media')
WITH CHECK (bucket_id = 'portfolio-media');
