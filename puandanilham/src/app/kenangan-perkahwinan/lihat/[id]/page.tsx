import { Metadata } from 'next';
import ClientPage from './ClientPage';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return {};
    }

    // Use fetch to get data without initializing full supabase server client
    const res = await fetch(`${supabaseUrl}/rest/v1/photobooth_entries?id=eq.${id}&select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      next: { revalidate: 60 }
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const entry = data[0];
        return {
          title: `Kenangan ${entry.sender_name} | Puan & Ilham`,
          openGraph: {
            images: [
              {
                url: entry.photo_url,
                width: 800,
                height: 1200,
              }
            ]
          }
        };
      }
    }
  } catch (error) {
    console.error('Failed to generate metadata:', error);
  }

  return {};
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ClientPage params={params} />;
}
