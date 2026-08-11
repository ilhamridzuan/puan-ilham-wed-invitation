-- Admin needs full access to wishes to manage them and to insert if they test the form while logged in
create policy "admin_manage_wishes"
  on public.wishes for all to authenticated using (true) with check (true);
