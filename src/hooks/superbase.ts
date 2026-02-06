import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zuqebwemrqrzidgrufhj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Tlp1wq1DDJEvN3MYUJZhGw_nhpD09jg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
