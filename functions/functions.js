import { supabase } from "../settings.js";
export var NEEC_TEAM_ID = 1;

/**
 * Generates a random number between min(including) and max(excluding)
 * 
 * @param {number} min minimum number
 * @param {number} max maximum number
 * @return {number} random number
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Creates a time for the entry logs
 * 
 * @return {Date} current date
 */
export function logTime() {
  var dt = new Date(new Date().toString().split("GMT")[0] + " UTC").toISOString();
  return dt;
}

/**
 * Converts a time difference to days,hours,minutes and seconds
 * 
 * @param {number} time_difference timing difference between two points in time in miliseconds
 * @return {Object} days, hours, minutes, seconds
 */
export function convertTime(time_difference) {
  var msec = time_difference;
  var days = Math.floor(msec / 1000 / 60 / (60 * 24));
  msec -= days * 1000 * 60 * 60 * 24;
  var hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  var mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  var ss = Math.floor(msec / 1000);
  msec -= ss * 1000;

  return { days: days, hh: hh, mm: mm, ss: ss };
}

/**
 * Gets the team corresponding to the ID
 * 
 * @param {number} teamID Id of the team searched for
 * @return {Object} Team found (or not)
 */
export async function getTeam(teamID) {
  try{
    let { data: Team, error } = await supabase //NOTE verificar se da erro
    .from("Teams")
    .select("*")
    .eq("IDTEAM", teamID);
    if(error) throw "Team select failed"
    if (Team) return Team[0];
    else return null;
  }catch(e){
    throw e;
  }
}

/**
 * Gets a list of teams
 * 
 * @param {array} teamsID Array containing the ID of the teams
 * @return {Object} Teams found (or not)
 */
export async function getTeams(teamsID) {
  try{
    let { data: Teams, error } = await supabase //NOTE verificar se da erro
    .from("Teams")
    .select("*")
    .in("IDTEAM", teamsID);
    if(error) throw "Team select failed"
    return Teams;
  }catch(e){
    throw e;
  }
}

/**
 * Gets a Person based on a ID
 * 
 * @param {number} personID Id of the Person searched for
 * @return {Object} Person found (or not)
 */
export async function getPerson(personID) {
  try {
    let { data: Person, error } = await supabase //NOTE verificar se da erro
      .from("Persons")
      .select("*")
      .eq("user_id", personID);

    if (error) throw error;
    if (Person) return Person[0];
    else return null;
  } catch (error) {
    throw "Error retriving person from DB";
  }
}

/**
 * Gets a House based on a ID
 * 
 * @param {number} houseID Id of the House searched for
 * @return {Object} House found (or not)
 */
export async function getHouse(houseID) {
  try{
    let { data: House, error } = await supabase //NOTE verificar se da erro
    .from("Houses")
    .select("*")
    .eq("IDHOUSE", houseID);
    if (error) throw error;
    if (House) return House[0];
    else return null;
  }catch(e){
    throw e;
  }
  
}

/**
 * Gets a Component based on a ID
 * 
 * @param {number} componentID Id of the Component searched for
 * @return {Object} Component found (or not)
 */
export async function getComponent(componentID) {
  try {
    let { data: Component, error } = await supabase //NOTE verificar se da erro
    .from("Components")
    .select("*")
    .eq("IDCOMPONENT", componentID);
    if (error) throw error;
    if (Component) return Component[0];
    else return null;
  } catch (e) {
    throw e;
  }
}

/**
 * Adds coins to a Team
 * 
 * @param {Object} Team Target team
 * @param {number} cash Amount to add
 * @return void
 */
export async function addCoins(Team, cash) {
  try{
    if (typeof cash === "undefined" || typeof Team === "undefined" || cash < 0) {
      throw "Parameters Undefined (addCoins)"
    }

    Team.CASH += cash;
    const { updated, update_error } = await supabase.from("Teams").update({ CASH: Team.CASH }).eq("IDTEAM", Team.IDTEAM);
    if(update_error) throw update_error
  }catch(e){
    throw e;
  }
}

/**
 * Subtracts coins to a Team
 * 
 * @param {Object} Team Target team
 * @param {number} cash Amount to add
 * @return void
 */
export async function subtractCoins(Team, cash) {
  try {
    if (Team === null || cash === null || typeof Team === "undefined" || typeof cash === "undefined" || cash < 0) {
      throw "Parameters Undefined (subtractCoins)";
    }
    if (Team.CASH - cash >= 0) {
      Team.CASH = (Team.CASH -= cash) < 0 ? 0 : Team.CASH; //REVIEW impedir ação se não for possível subtrair
      const { updated, update_error } = await supabase.from("Teams").update({ CASH: Team.CASH }).eq("IDTEAM", Team.IDTEAM);
      if(update_error) throw "Error: Updating team cash (subtractCoins)"
    } else {
      throw "Team doesn't have enough money (subtractCoins)";
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Sets coins of a Team
 * 
 * @param {Object} Team Target team
 * @param {number} cash Amount to add
 * @return void
 */
export async function setCoins(Team, cash) {
  try{
    if (Team === null || cash === null || typeof Team === "undefined" || typeof cash === "undefined" || cash < 0) {
      throw "Parameters Undefined (setCoins)";
    }
    const { updated, update_error } = await supabase.from("Teams").update({ CASH: cash }).eq("IDTEAM", Team.IDTEAM);
    if(update_error) throw update_error
  }catch(e){
    throw e;
  }
}

export async function hash_string(input) {
  const { createHmac } = await import("crypto");

  const secret = "abcdefg";
  const hash = createHmac("sha256", secret).update(input).digest("hex");
  console.log(hash);
}
