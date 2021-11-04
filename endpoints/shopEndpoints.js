import { supabase } from "../settings.js";

export async function productsList() {
  let { data: List, error } = await supabase.from("Components").select("*");

  console.log(List, "Endpoint");
  return List;
}
