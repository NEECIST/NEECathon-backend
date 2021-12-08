import { supabase } from "../settings.js";
import * as functions from "../functions/functions.js";

var potID = 0;
var BOARD_SIZE = 24;
var START_CASH = 20;
var Deck = [];
var TIME_LAST_DICE_ROLL = null;

/**
 * Check countdown timer for new roll
 *
 * @return minutes and seconds until next roll
 */
export function rollTimer() {
  var current = new Date().getTime();
  var diff = current - TIME_LAST_DICE_ROLL;
  var timer = functions.convertTime(diff);
  if (diff > 3600000) return { mm: 0, ss: 0 };
  return { mm: 59 - timer.mm, ss: 59 - timer.ss };
}
/**
 * Sets finish time of round
 *
 * @return none
 */
export function lastRoundTime() {
  TIME_LAST_DICE_ROLL = new Date().getTime();
}

/**
 * Add coins to a Team
 *
 * @param {number} teamID id of the team
 * @param {number} cash ammount of cash to add
 * @return void
 */
export async function teamAddCoins(teamID, cash) {
  try {
    var Team = await functions.getTeam(teamID);

    await functions.addCoins(Team, cash);
  } catch (e) {
    throw e;
  }
}

/**
 * Remove coins from a Team
 *
 * @param {number} teamID id of the team
 * @param {number} cash ammount of cash to remove
 * @return {boolean} true if succesfull
 */
export async function teamSubtractCoins(teamID, cash) {
  try {
    var Team = await functions.getTeam(teamID);

    await functions.subtractCoins(Team, cash);
  } catch (e) {
    throw e;
  }
}

/**
 * Set coins of a Team
 *
 * @param {number} teamID id of the giver team
 * @param {number} cash ammount of cash to set
 * @return void
 */
export async function setCoinsTeam(teamID, cash) {
  try {
    var Team = await functions.getTeam(teamID);

    await functions.setCoins(Team, cash);
  } catch (e) {
    throw e;
  }
}

/**
 * Throw dices and move Team
 *
 * @param {number} teamID id of the team
 * @return {number} dices value rolled by the dices
 * @return {object} SPBhouse object of the team playing
 */
export async function throwDices(teamID) {
  let house = 0;
  try {
    if (typeof teamID === "undefined" || teamID < 0 || teamID === null) {
      throw "Parameters Undefined (throwDices)";
    }
    var Teams = await functions.getTeam(teamID);
    if (Teams !== null && typeof Teams !== "undefined") {
      var dices = 0;
      dices = functions.getRandomInt(1, 7);

      if(Teams.HOUSE + dices >= BOARD_SIZE){
        teamAddCoins(teamID, START_CASH);
        house = Teams.HOUSE + dices - BOARD_SIZE;
      }else{
        house = Teams.HOUSE + dices;
      }

      const { data : SPBhouse, error, status } = await supabase.from("Teams").update({ HOUSE: house }).eq("IDTEAM", teamID);
      if (error) throw error;
      return [dices,house];
    } else {
      throw "Invalid Team";
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Analizes the possible interactions for a play on the board
 *
 * @param {number} house position of the team in the board
 * @param {number} team target team
 * @return {boolean} interactable Is the house purchasable
 * @return {string} description action description
 */
 export async function playAnalize(house,team) {
  let interactable = false
  let description = ""
  //console.log("Entra", house, team)
  try {
    const { data: SPBhouse, error } = await supabase.from("Houses").select("*").eq("POSITION", house);
    if (error) throw error;

    console.log(SPBhouse,"Target house");

    //console.log("Checking type:house");
    if(SPBhouse.TYPE==='house' && SPBhouse.IDTEAM ===null){
      interactable = true;
      description = "This patent is available for purchase!";
    }else if(SPBhouse.TYPE==='house' && SPBhouse.IDTEAM !==null && team !== SPBhouse.IDTEAM){
      await transferCoins(team, SPBhouse.IDTEAM, SPBhouse.PRICE);
      description = "Payed " + SPBhouse.PRICE + " to the owners of the patent.";
    }else{
      description = "You already own this patent!";
    }

    //console.log("Checking type:start");
    if(SPBhouse.TYPE==='start'){
      description = "Sitting confortably at the start. Lucky you!";
    }

    //console.log("Checking type:tax");
    if(SPBhouse.TYPE==='tax'){
      description = "Taxed " + SPBhouse.PRICE + " coins.";
    }

    //console.log("Checking type:prison");
    if(SPBhouse.TYPE==='prison'){
      description = "You seem to hear Andy´s voice in your head. Red, it isn´t the time to visit the tree yet!";
    }

    //console.log("Checking type:bank");
    if(SPBhouse.TYPE==='bank'){
      await receivePot(team);
      description = "Money Money Money!";
    }

    //console.log("Checking type:community");
    if(SPBhouse.TYPE==='community'){
      description = await cardLC(team);
    }

    //console.log("Play result",interactable,description);
    return [interactable,description];
  } catch (e) {
    throw e;
  }
}

/**
 * Transfer coins between Teams
 *
 * @param {number} minusTeam id of the giver team
 * @param {number} plusTeam id of the reciever team
 * @param {number} cash ammount of cash to be transfered
 * @return void
 */
export async function transferCoins(minusTeam, plusTeam, cash) {
  try {
    if (
      minusTeam === null ||
      plusTeam === null ||
      cash === null ||
      typeof minusTeam === "undefined" ||
      typeof plusTeam === "undefined" ||
      typeof cash === "undefined" ||
      minusTeam < 0 ||
      plusTeam < 0 ||
      cash < 0
    ) {
      throw "Parameters Undefined (transferCoins)";
    }

    var Teams = await functions.getTeams([minusTeam, plusTeam]);

    if (typeof Teams !== "undefined" && Teams !== null && Teams.length) {
      var MTeam = Teams[0].IDTEAM === minusTeam ? Teams[0] : Teams[1];
      var PTeam = Teams[0].IDTEAM === plusTeam ? Teams[0] : Teams[1];

      await functions.subtractCoins(MTeam, cash);
      await functions.addCoins(PTeam, cash);
      const { data, error } = await supabase
        .from("Team|Team")
        .insert([{ IDTEAM1: minusTeam, IDTEAM2: plusTeam, CASH: cash, LogTime: functions.logTime() }]);
      if (error) throw error;
    } else {
      throw "Invalid Teams";
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Buy a Patent
 *
 * @param {number} teamID id of the team
 * @param {number} houseID id of the house
 * @return void
 */
export async function buyPatent(teamID, houseID) {
  try {
    if (teamID === null || houseID === null || typeof teamID === "undefined" || typeof houseID === "undefined" || teamID < 0 || houseID < 0) {
      throw "Parameters Undefined (buyPatent)";
    }
    var Teams = await functions.getTeam(teamID);
    var House = await functions.getHouse(houseID);
    if (House.IDTEAM === null) {
      if (typeof House !== null && typeof Teams !== null && typeof House !== "undefined" && typeof Teams !== "undefined" && House.TYPE === "house") {
        await functions.subtractCoins(Teams, House.PRICE);
        const { data: SPBhouse, error: house_error } = await supabase
          .from("Houses")
          .update({ IDTEAM: teamID })
          .eq("IDHOUSE", houseID);
        if (house_error) throw house_error;

        const { data: SPBhouseteam, error: teamhouse_error } = await supabase
          .from("Houses|Team")
          .insert([{ IDHOUSE: houseID, IDTEAM: teamID, LogTime: functions.logTime() }]);
        if (teamhouse_error) throw teamhouse_error;
      } else {
        throw "This house isn´t purchasable";
      }
    } else {
      throw "Patent already bought";
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Transfer money from a Team to the Pot
 *
 * @param {number} teamID id of the team
 * @param {number} cash ammount of cash to be transfered
 * @return void
 */
export async function increasePot(teamID, cash) {
  try {
    var Teams = await functions.getTeams([teamID, potID]);

    if (Teams !== null && typeof Teams !== "undefined" && Teams.length) {
      var Team = Teams[0].IDTEAM === teamID ? Teams[0] : Teams[1];
      var Pot = Teams[0].IDTEAM === potID ? Teams[0] : Teams[1];

      await functions.subtractCoins(Team, cash);
      await functions.addCoins(Pot, cash);
    } else {
      throw "Invalid Teams";
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Recieve all the money in the pot
 *
 * @param {number} teamID id of the team
 * @return void
 */
export async function receivePot(teamID) {
  try {
    var Teams = await functions.getTeams([teamID, potID]);

    if (Teams !== null && typeof Teams !== "undefined" && Teams.length) {
      var Team = Teams[0].IDTEAM === teamID ? Teams[0] : Teams[1];
      var Pot = Teams[0].IDTEAM === potID ? Teams[0] : Teams[1];

      await functions.addCoins(Team, Pot.CASH);
      await functions.setCoins(Pot, 0);
    } else {
      throw "Invalid Teams";
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Removes a player from a team
 *
 * @param {number} personID id of the person to be removed
 * @return void
 */
export async function removePlayerFromTeam(personID) {
  try {
    if (personID === null || typeof personID === "undefined" || personID < 0) {
      throw "Parameters Undefined (removePlayerFromTeam)";
    }

    var Person = await functions.getPerson(personID);

    if (typeof Person !== "undefined" && Person !== null) {
      if (Person.IDTEAM !== null) {
        console.log("Removing...");
        const { data, error } = await supabase
          .from("Persons")
          .update({ IDTEAM: null })
          .eq("IDPERSON", personID);
        if (error) throw error;
      } else {
        throw "Invalid Team of the person";
      }
    } else {
      throw "Invalid Person";
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Updates the team of a Player
 *
 * @param {number} personID id of the person
 * @param {number} teamID id of the new owner of the house
 * @return void
 */
export async function setPlayerTeam(personID, teamID) {
  try {
    if (personID === null || teamID === null || typeof personID === "undefined" || typeof teamID === "undefined" || personID < 0 || teamID < 0) {
      throw "Parameters Undefined (setPlayerTeam)";
    }

    var Person = await functions.getPerson(personID);
    var Team = await functions.getTeam(teamID);

    if (typeof Person !== "undefined" && typeof Team !== "undefined" && Person !== null && Team !== null) {
      if (Person.IDTEAM !== null) {
        const { data, error } = await supabase
          .from("Persons")
          .update({ IDTEAM: teamID })
          .eq("IDPERSON", personID);
        if (error) throw error;
      } else {
        throw "Invalid Team of the person";
      }
    } else {
      throw "Invalid Person/Team";
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Updates the owner of a given house
 *
 * @param {number} oldTeamID id of the current owner of the house
 * @param {number} houseID id of the house
 * @param {number} newTeamID id of the new owner of the house
 * @return void
 */
export async function transferHouse(oldTeamID, houseID, finalTeamID) {
  try {
    if (
      oldTeamID === null ||
      houseID === null ||
      finalTeamID === null ||
      typeof oldTeamID === "undefined" ||
      typeof houseID === "undefined" ||
      typeof finalTeamID === "undefined" ||
      oldTeamID < 0 ||
      houseID < 0 ||
      finalTeamID < 0
    ) {
      throw "Parameters Undefined (transferHouse)";
    }

    var OldTeam = await functions.getTeam(oldTeamID);
    var NewTeam = await functions.getTeam(finalTeamID);
    var House = await functions.getHouse(houseID);

    if (OldTeam !== null && House !== null && NewTeam !== null && typeof OldTeam !== "undefined" && typeof House !== "undefined" && typeof NewTeam !== "undefined" && House.TYPE === "house") {
      if (House.IDTEAM !== null) {
        if (House.IDTEAM === oldTeamID) {
          const { data, error } = await supabase
            .from("Houses")
            .update({ IDTEAM: finalTeamID })
            .eq("IDHOUSE", houseID);
          if (error) throw error;
        } else {
          throw "Team doesn´t own the house";
        }
      } else {
        throw "Invalid House";
      }
    } else {
      throw "Invalid House/Teams";
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Get all the cards and shuffles them
 *
 * @return void
 */
export async function shuffleCards() {
  try {
    let { data: Cards, error } = await supabase.from("SpecialCards").select("*");
    if (error) throw error;
    while (Cards.length > 0) {
      var random = functions.getRandomInt(0, Cards.length);
      Deck.push(Cards.splice(random, 1));
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Take a card from the deck
 *
 * @param {number} teamID id of the team
 * @return {string} description of the card
 */
export async function cardLC(teamID) {
  try {
    if (typeof teamID === "undefined" || teamID === null || teamID < 0) {
      throw "Parameters Undefined (cardLC)";
    }

    let Team = await functions.getTeam(teamID);
    let card;

    if (!Deck.length) {
      await shuffleCards();
    }

    card = Deck.pop()[0];

    if (Team !== null && card !== null && typeof Team !== "undefined" && typeof card !== "undefined") {
      switch (card.TYPE) {
        case 0: // Special cards (challenges)
          break; // Do nothing

        case 1: // Give money to Pot
          if (card.AMMOUNT) {
            await increasePot(teamID, card.AMMOUNT);
          } else {
            throw "Card ammount error";
          }
          break;

        case 2: // Recieve money from bank
          if (card.AMMOUNT) {
            await teamAddCoins(teamID, card.AMMOUNT);
          } else {
            throw "Card ammount error";
          }
          break;

        case 3: // Give/recieve money to/from teams
          // Select all valid teams that are not the playing team
          let { data: Teams, error: error3 } = await supabase.from("Teams").select("*").gt("IDTEAM", 1).neq("IDTEAM", teamID);
          if (error3) throw error3;
          // Negative ammount -> team gives money
          if (card.AMMOUNT < 0) {
            Teams.forEach(async (team) => {
              if (typeof team !== "undefined" && team !== null) {
                await transferCoins(team.IDTEAM, teamID, 0 - card.AMMOUNT);
              } else {
                console.log("\n\n TEAM CORRUPTION \n\n");
              }
            });
            // Positive ammount -> team recieves money
          } else {
            Teams.forEach(async (team) => {
              if (typeof team !== "undefined" && team !== null) {
                await transferCoins(teamID, team.IDTEAM, card.AMMOUNT);
              } else {
                console.log("\n\n TEAM CORRUPTION \n\n");
              }
            });
          }
          break;

        case 4: // Move to relative house
          Team.HOUSE += card.AMMOUNT;
          // Team finishes a lap
          if (Team.HOUSE >= BOARD_SIZE) {
            Team.HOUSE -= BOARD_SIZE;
            Team.CASH += START_CASH;
          }
          const { data : data4, error: error4 } = await supabase.from("Teams").update({ HOUSE: Team.HOUSE, CASH: Team.CASH }).eq("IDTEAM", teamID);
          if (error4) throw error4;
          break;

        case 5: // Move to specific house
          var current_house = Team.HOUSE;

          Team.HOUSE = card.AMMOUNT;

          // Team passes the starting house and is not going to jail
          if (Team.HOUSE < current_house && Team.HOUSE != 6) {
            Team.CASH += START_CASH;
          }
          const { data: data5, error: error5 } = await supabase.from("Teams").update({ HOUSE: Team.HOUSE, CASH: Team.CASH }).eq("IDTEAM", teamID);
          if (error5) throw error5;
          break;

        default:
          throw "Invalid card type";
      }
      return card.DESCRIPTION;
    } else {
      throw "Invalid Card/Team";
    }
  } catch (e) {
    throw e;
  }
}
