-- Bucket para comprobantes (público para que getPublicUrl funcione)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'comprobantes',
  'comprobantes',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

-- Políticas en storage.objects: permitir subir (INSERT) y leer (SELECT) para el bucket comprobantes
-- Así los usuarios anónimos pueden subir el comprobante desde el formulario

create policy "Allow anon upload comprobantes"
on storage.objects for insert
to public
with check (bucket_id = 'comprobantes');

create policy "Allow public read comprobantes"
on storage.objects for select
to public
using (bucket_id = 'comprobantes');
