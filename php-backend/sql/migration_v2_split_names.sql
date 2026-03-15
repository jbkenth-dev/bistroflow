USE bistroflow_db;

-- Add new columns
ALTER TABLE users 
ADD COLUMN first_name VARCHAR(50) NOT NULL AFTER id,
ADD COLUMN middle_name VARCHAR(50) AFTER first_name,
ADD COLUMN last_name VARCHAR(50) NOT NULL AFTER middle_name;

-- Migrate existing data (Best effort split)
-- Assumes "First Last" or "First Middle Last"
-- If only one name, it goes to first_name
UPDATE users 
SET 
    first_name = SUBSTRING_INDEX(full_name, ' ', 1),
    last_name = CASE 
        WHEN LOCATE(' ', full_name) = 0 THEN '' -- No space, lastname empty (or should be placeholder?)
        ELSE SUBSTRING(full_name, LOCATE(' ', full_name) + 1)
    END
WHERE full_name IS NOT NULL;

-- Try to handle middle names (simple heuristic: if last_name has spaces, take first part as middle)
-- This is imperfect but a start. 
-- Better approach: "First" is first word. "Last" is last word. Everything in between is "Middle".

UPDATE users
SET 
    first_name = SUBSTRING_INDEX(full_name, ' ', 1),
    last_name = SUBSTRING_INDEX(full_name, ' ', -1),
    middle_name = TRIM(BOTH ' ' FROM REPLACE(REPLACE(full_name, SUBSTRING_INDEX(full_name, ' ', 1), ''), SUBSTRING_INDEX(full_name, ' ', -1), ''))
WHERE LENGTH(full_name) - LENGTH(REPLACE(full_name, ' ', '')) >= 2; -- At least 2 spaces (3 words)

-- Handle 2 words (First Last)
UPDATE users
SET
    first_name = SUBSTRING_INDEX(full_name, ' ', 1),
    last_name = SUBSTRING_INDEX(full_name, ' ', -1),
    middle_name = NULL
WHERE LENGTH(full_name) - LENGTH(REPLACE(full_name, ' ', '')) = 1;

-- Drop old column
ALTER TABLE users DROP COLUMN full_name;
