import { supabase } from "../settings.js";
import * as functions from "../functions/functions.js";

/**
 * Updates the stock of a given component
 *
 * @param {number} component_id id of the component
 * @param {number} ammount the ammount of the stock
 * @return void
 */
export async function updateStock(component_id, ammount) {
  try {
    var stock = ammount;

    let { error } = await supabase //NOTE precisa de ser transaction
      .rpc("updatestock", {
        stock,
        component_id,
      });

    if (error) throw "Error: Updating item stock (updateStock)";
  } catch (error) {
    throw error;
  }
}

/**
 * Buy all the components in a given cart
 *
 * @param {number} teamID id of the team
 * @param cart list of components to buy
 * @return void
 */
export async function buyCart(teamID, cart) {
  console.log(teamID, cart);
  var Team = await functions.getTeam(teamID);
  var Component = [];
  var cost = 0;

  if (Team !== undefined) {
    //NOTE usar locks ou transaction
    try {
      for (var i = 0; i < cart.length; i++) {
        Component.push(await functions.getComponent(cart[i].id));
        if (Component[i] === undefined || Component[i].STOCK < cart[i].quantity) {
          console.log("Component not found or overstock!");
          throw "Component not found or overstock! (buyCart)";
        }
        cost += Component[i].PRICE * cart[i].quantity;
      }
      if (cost > Team.CASH) {
        console.log("Overbudget!");
        throw "Overbuget (buyCart)";
      }

      var dataInsert = [];
      for (var i = 0; i < cart.length; i++) {
        updateStock(Component[i].IDCOMPONENT, Component[i].STOCK - cart[i].quantity);
        dataInsert.push({ IDCOMPONENT: Component[i].IDCOMPONENT, IDTEAM: teamID, QUANTITY: cart[i].quantity, LogTime: functions.logTime() });
      }
      const { insert, insert_error } = await supabase //NOTE verificar se da erro
        .from("Components|Team")
        .insert(dataInsert);
      if (insert_error) throw "Error: Inserting items to team (buyCart)";

      functions.subtractCoins(Team, cost);
    } catch (error) {
      throw error;
    }
  }
}
