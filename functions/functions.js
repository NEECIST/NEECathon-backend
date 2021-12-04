import { supabase } from "../settings.js";
export var NEEC_TEAM_ID = 1;

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function logTime() {
  var dt = new Date(new Date().toString().split("GMT")[0] + " UTC").toISOString();
  return dt;
}

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

export async function subtractCoins(Team, cash) {
  try {
    if (typeof Team === "undefined" || typeof cash === "undefined" || cash < 0) {
      throw "Parameters Undefined (subtractCoins)";
    }
    if (Team.CASH - cash >= 0) {
      Team.CASH -= cash;
    } else {
      Team.CASH -= 0;
    }
    const { updated, update_error } = await supabase.from("Teams").update({ CASH: Team.CASH }).eq("IDTEAM", Team.IDTEAM);
    if(update_error) throw update_error
  } catch (e) {
    throw e;
  }
}

export async function setCoins(Team, cash) {
  try{
    if (typeof Team === "undefined" || typeof cash === "undefined") {
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
