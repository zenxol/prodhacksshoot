export interface SavedPhoto {
  id: string;
  poseName: string;
  photoDataUrl: string;
  score: number;
  createdAt: string;
}

export interface GalleryPhoto {
  id: string;
  poseName: string;
  photoDataUrl: string;
  score: number;
  captureType: 'auto' | 'manual';
  createdAt: string;
}

const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('sb_')
);

async function getSupabaseClient() {
  const { createClient } = await import('./supabase');
  return createClient();
}

async function requireUserId() {
  const supabase = await getSupabaseClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) throw new Error('Not authenticated');
  return { supabase, userId: userData.user.id } as const;
}

export async function fetchPhotos(): Promise<SavedPhoto[]> {
  if (!hasSupabase) throw new Error('Supabase env vars missing');
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from('saved_photos')
    .select('id, photo_data, pose_name, match_score, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    poseName: row.pose_name,
    photoDataUrl: row.photo_data,
    score: row.match_score ?? 0,
    createdAt: row.created_at,
  }));
}

export async function fetchSavedPhotoById(id: string): Promise<SavedPhoto | null> {
  if (!hasSupabase) throw new Error('Supabase env vars missing');
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from('saved_photos')
    .select('id, photo_data, pose_name, match_score, created_at')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    poseName: data.pose_name,
    photoDataUrl: data.photo_data,
    score: data.match_score ?? 0,
    createdAt: data.created_at,
  };
}

export async function savePhotoRemote(photo: { poseName: string; photoDataUrl: string; score: number; }): Promise<SavedPhoto> {
  if (!hasSupabase) throw new Error('Supabase env vars missing');
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from('saved_photos')
    .insert({
      user_id: userId,
      photo_data: photo.photoDataUrl,
      pose_name: photo.poseName,
      match_score: photo.score,
    })
    .select()
    .single();
  if (error || !data) throw error || new Error('Save failed');
  return {
    id: data.id,
    poseName: data.pose_name,
    photoDataUrl: data.photo_data,
    score: data.match_score ?? 0,
    createdAt: data.created_at,
  };
}

export async function deletePhotoRemote(id: string): Promise<void> {
  if (!hasSupabase) throw new Error('Supabase env vars missing');
  const { supabase, userId } = await requireUserId();
  const { error } = await supabase
    .from('saved_photos')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

// ---------- Gallery (captured photos) ----------

export async function fetchGalleryPhotos(): Promise<GalleryPhoto[]> {
  if (!hasSupabase) throw new Error('Supabase env vars missing');
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('id, photo_data, pose_name, match_score, capture_type, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    poseName: row.pose_name,
    photoDataUrl: row.photo_data,
    score: row.match_score ?? 0,
    captureType: row.capture_type === 'manual' ? 'manual' : 'auto',
    createdAt: row.created_at,
  }));
}

export async function saveGalleryPhoto(photo: { poseName: string; photoDataUrl: string; score: number; captureType: 'auto' | 'manual'; }): Promise<GalleryPhoto> {
  if (!hasSupabase) throw new Error('Supabase env vars missing');
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from('gallery_photos')
    .insert({
      user_id: userId,
      photo_data: photo.photoDataUrl,
      pose_name: photo.poseName,
      match_score: photo.score,
      capture_type: photo.captureType,
    })
    .select()
    .single();
  if (error || !data) throw error || new Error('Save failed');
  return {
    id: data.id,
    poseName: data.pose_name,
    photoDataUrl: data.photo_data,
    score: data.match_score ?? 0,
    captureType: data.capture_type === 'manual' ? 'manual' : 'auto',
    createdAt: data.created_at,
  };
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  if (!hasSupabase) throw new Error('Supabase env vars missing');
  const { supabase, userId } = await requireUserId();
  const { error } = await supabase
    .from('gallery_photos')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export const supabaseConfigured = hasSupabase;
