-- Enable Row Level Security
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone
CREATE POLICY "Allow public read"
ON buses
FOR SELECT
USING (true);

-- Allow insert/update/delete only for authenticated users
CREATE POLICY "Allow authenticated insert"
ON buses
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update"
ON buses
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete"
ON buses
FOR DELETE
USING (auth.role() = 'authenticated');
