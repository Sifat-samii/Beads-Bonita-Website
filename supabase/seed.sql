insert into public.categories (name, slug, sort_order)
values
  ('Necklace', 'necklace', 1),
  ('Bracelets', 'bracelets', 2),
  ('Phone Charms', 'phone-charms', 3),
  ('Earrings', 'earrings', 4),
  ('Ring', 'ring', 5),
  ('Waist Chain', 'waist-chain', 6),
  ('Arm Cuff', 'arm-cuff', 7),
  ('Anklet', 'anklet', 8)
on conflict (slug) do nothing;
