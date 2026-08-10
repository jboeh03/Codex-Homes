-- Studio v2 seed: default room applicability by category. Zach can curate
-- per-material later now that the column exists.
update public.materials set room_types = '{kitchen}'
  where category = 'backsplash';

update public.materials set room_types = '{bathroom}'
  where category = 'wall-tile';

update public.materials set room_types = '{kitchen,bathroom}'
  where category in ('cabinet', 'countertop', 'floor', 'fixture', 'lighting');
