import { supabase } from "../settings.js";

export async function productsList() {
  let { data: List, error } = await supabase.from("Components").select("*");

  console.log(List, "Endpoint");

  var data = { result: "Sucess", data: List };
  return data;
}

async function buyCart(teamID, cash, cart) {
  if (teamID < 0 || cash < 0 || cart < 0) {
    return false;
  }
  let { data: Teams, error } = await supabase
    .from('Teams')
    .select("*").eq('IDTEAM', teamID)
  if(Teams.length && error === NULL) {
    let { data: Components, error } = await supabase
      .from('Components')
      .select("*").in('IDCOMPONENT', cart)
    Components.forEach(component => {
      if(--component.STOCK > 0) {
        Teams[0].CASH -= component.PRICE
      } else {
        // TODO não há stock de componentes
      }
    });
    if (Teams[0].CASH > 0) {
      const { updated, update_error } = await supabase
        .from('Teams')
        .update({ CASH: Teams[0].CASH })
        .eq('IDTEAM', teamID)
    } else {
      // TODO equipa não tem dinheiro suficiente
    }
    const { data, error } = await supabase
      .from('Components')
      .update({ STOCK: Components[0].STOCK }) // NOTE como dar update de um valor diferente para cada row ?
  } else {
    // REVIEW log file
    if (error != NULL) {
      
    } else {
      // NOTE equipa não encontrada
    }
  }
}
