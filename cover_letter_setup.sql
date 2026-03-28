-- Migration: Add Cover Letter table
CREATE TABLE IF NOT EXISTS cover_letter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'To My Next Team,',
    content TEXT NOT NULL,
    closing_text TEXT NOT NULL DEFAULT 'Warmly,',
    signature_name TEXT NOT NULL DEFAULT 'Savvy',
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE cover_letter ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read-only access to cover_letter" 
ON cover_letter FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to manage cover_letter" 
ON cover_letter FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Seed initial data
INSERT INTO cover_letter (title, content, closing_text, signature_name)
VALUES (
    'To My Next Team,',
    'I believe that great design isn’t just about how things look, but how they feel and function in the hands of a user. My journey as a designer has been driven by a singular obsession: bridging the gap between technical complexity and human intuition.

In my work at Elewachi, I’ve focused on creating "Curated Canvases"—spaces where whitespace is intentional and typography carries the weight of the brand’s voice. I don’t just build interfaces; I craft digital experiences that respect the user’s focus and elevate the product’s purpose.

I am looking to join a team that values intentionality as much as I do. A team that isn’t afraid to challenge the status quo of "standard" grids and is willing to embrace the beauty of sophisticated minimalism. I bring with me a deep understanding of Material Design principles, a passion for editorial aesthetics, and a commitment to high-performance frontend execution.

Thank you for considering my work. I look forward to the possibility of building something extraordinary together.',
    'Warmly,',
    'Savvy'
);
