import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gayfaxpdbccwtoojelek.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdheWZheHBkYmNjd3Rvb2plbGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTU5NDEsImV4cCI6MjA5NjE3MTk0MX0.YSIPUPCgzx-lZguTnPH1gXTx846xsd06rGHKeNccm_c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
