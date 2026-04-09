import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Plan {
  isPro: boolean;
  deckCount: number;
  loading: boolean;
}

// Free tier limits
export const FREE_DECK_LIMIT = 3;
export const FREE_SLIDE_LIMIT = 8;
export const PRO_SLIDE_LIMIT = 15;

export function usePlan(): Plan {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [deckCount, setDeckCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPro(false);
      setDeckCount(0);
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      setLoading(true);
      try {
        // Get pro status from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_pro')
          .eq('id', user.id)
          .single();

        // Get deck count for this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count } = await supabase
          .from('slide_decks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString());

        setIsPro(profile?.is_pro ?? false);
        setDeckCount(count ?? 0);
      } catch {
        // On error, default to free tier
        setIsPro(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [user]);

  return { isPro, deckCount, loading };
}
