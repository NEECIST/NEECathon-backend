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

    let { error } = await supabase.rpc("updatestock", {
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

  if (typeof Team !== "undefined" && Team !== null) {
    try {
      let quantity = [];
      let id = [];

      for (var i = 0; i < cart.length; i++) {
        Component.push(await functions.getComponent(cart[i].id));
        if (Component[i] === undefined || Component[i].STOCK < cart[i].quantity) {
          throw "Component not found or overstock!";
        }
        quantity.push(cart[i].quantity);
        id.push(cart[i].id);
        cost += Component[i].PRICE * cart[i].quantity;
      }
      if (cost > Team.CASH) {
        throw "Overbudget";
      }
      const { data, error } = await supabase.rpc("purchase_transaction2", { id_team: teamID, id_component: id, quantity: quantity, cart_price: cost });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  } else {
    throw "Team Undefined (buyCart)";
  }
}

/**
 * Request Component for buy
 *
 * @param {number} teamID id of the team
 * @param component Component Informations
 * @return void
 */
export async function requestComponent(teamID, component) {
  if (typeof teamID !== "undefined" && teamID !== null) {
    try {
      var componentName = component.name;
      var componentLink = component.link;
      var componentQuantity = component.quantity;

      const { data, error } = await supabase
        .from("ComponentsRequest")
        .insert([{ NAME: componentName, LINK: componentLink, QUANTITY: componentQuantity, IDTEAM: teamID, created_at: functions.logTime() }]);
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  } else {
    throw "Team Undefined (requestComponent)";
  }
}
