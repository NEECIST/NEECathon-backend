import { supabase } from '../settings.js'
import * as functions from '../functions/functions.js'

var potID = 0;
var BOARD_SIZE = 24;
var START_CASH = 20;
var Deck = [];
var TIME_FIRST_DICE_ROLL = null;


/**
 * Check countdown timer for new roll
 * 
 * @return minutes and seconds until next roll
 */
export function rollTimer(){
  if(TIME_FIRST_DICE_ROLL===null){
    TIME_FIRST_DICE_ROLL = new Date().getTime(); 
  }
  var diff = new Date().getTime() - TIME_FIRST_DICE_ROLL;
  var timer = functions.convertTime(diff);
  return {mm: 59 - timer.mm , ss: 59 - timer.ss}
}

/**
 * Add coins to a Team
 * 
 * @param {number} teamID id of the team
 * @param {number} cash ammount of cash to add
 * @return void
 */
export async function teamAddCoins(teamID, cash) {
  try{
    var Team = await functions.getTeam(teamID);

    await functions.addCoins(Team, cash);
  }catch(e){
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
  try{
    var Team = await functions.getTeam(teamID);

    await functions.subtractCoins(Team, cash);
  }catch(e){
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
  try{
    var Team = await functions.getTeam(teamID);

    await functions.setCoins(Team, cash);
  }catch(e){
    throw e;
  }
}


/**
 * Throw dices and move Team
 * 
 * @param {number} teamID id of the team
 * @return void
 */
export async function throwDices(teamID){
  try{
    if(typeof teamID==='undefined' ||teamID < 0 || teamID===null){
      throw "Parameters Undefined (throwDices)";
    }
    var Teams = await functions.getTeam(teamID);
    if(Teams!==null && typeof Teams!=='undefined'){
      var dices=[];
      dices.push(functions.getRandomInt(1,7))
      dices.push(functions.getRandomInt(1,7))
      var house = (Teams.HOUSE + dices.reduce((a,b) => a+b, 0)) >= BOARD_SIZE ? (Teams.HOUSE + dices.reduce((a,b) => a+b, 0))-BOARD_SIZE : Teams.HOUSE + dices.reduce((a,b) => a+b, 0)
      const { updated, update_error } = await supabase
      .from('Teams')
      .update({ HOUSE: house })
      .eq('IDTEAM', teamID)
      if(update_error) throw update_error
    }else{
      throw "Invalid Team"
    }
  }catch(e){
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
export async function transferCoins(minusTeam,plusTeam,cash){
  try{
    if(minusTeam===null || plusTeam===null || cash===null || typeof minusTeam==='undefined' || typeof plusTeam==='undefined' || typeof cash==='undefined' || minusTeam < 0 || plusTeam < 0 || cash < 0){
      throw "Parameters Undefined (transferCoins)";
    }
  
    var Teams = await functions.getTeams([minusTeam, plusTeam]);
  
    if(typeof Teams!=='undefined' && Teams!==null && Teams.length){
      var MTeam = (Teams[0].IDTEAM===minusTeam) ? Teams[0] : Teams[1];
      var PTeam = (Teams[0].IDTEAM===plusTeam) ? Teams[0] : Teams[1];
  
      await functions.subtractCoins(MTeam, cash);
      await functions.addCoins(PTeam, cash);
      const { insert, insert_error } = await supabase  //NOTE verificar se da erro
      .from('Team|Team')
      .insert([
        { IDTEAM1: minusTeam, IDTEAM2: plusTeam, CASH: cash, LogTime: functions.logTime() },
      ])
      if(insert_error) throw insert_error
    }else{
      throw "Invalid Teams"
    }
  }catch(e){
    throw e
  }
  
}


/**
 * Buy a Patent
 * 
 * @param {number} teamID id of the team
 * @param {number} houseID id of the house
 * @return void
 */
export async function buyPatent(teamID,houseID){
  try{
    if(teamID===null || houseID===null || typeof teamID==='undefined' || typeof houseID==='undefined' || teamID < 0 || houseID < 0){
      throw "Parameters Undefined (buyPatent)";
    }
    var Teams = await functions.getTeam(teamID);
    var House = await functions.getHouse(houseID);
    if(House.IDTEAM===null){
      if(typeof House!==null && typeof Teams!==null && typeof House!=='undefined' && typeof Teams!=='undefined' && House.TYPE==="house"){
        await functions.subtractCoins(Teams,House.PRICE)
        const { updated, update_error } = await supabase  //NOTE verificar se da erro
        .from('Houses')
        .update({ IDTEAM: teamID })
        .eq('IDHOUSE', houseID)
        if(update_error) throw update_error
        
        const { insert, insert_error } = await supabase  //NOTE verificar se da erro
        .from('Houses|Team')
        .insert([
          { IDHOUSE: houseID, IDTEAM: teamID, LogTime: functions.logTime() },
        ])
        if(insert_error) throw insert_error
      }else{
        throw "This house isn´t purchasable";
      }
    }else{
      throw "Patent already bought";
    }
  }catch(e){
    throw e
  }
}


/**
 * Transfer money from a Team to the Pot
 * 
 * @param {number} teamID id of the team
 * @param {number} cash ammount of cash to be transfered
 * @return void
 */
export async function increasePot(teamID,cash){
  try{
    var Teams = await functions.getTeams([teamID, potID]);
  
    if(Teams!==null && typeof Teams!=='undefined' && Teams.length){
      var Team = (Teams[0].IDTEAM===teamID) ? Teams[0] : Teams[1];
      var Pot = (Teams[0].IDTEAM===potID) ? Teams[0] : Teams[1];
  
      await functions.subtractCoins(Team, cash)
      await functions.addCoins(Pot, cash)
    }else{
      throw "Invalid Teams"
    }
  }catch(e){
    throw e;
  }
}


/**
 * Recieve all the money in the pot
 * 
 * @param {number} teamID id of the team
 * @return void
 */
export async function receivePot(teamID){
  try{
    var Teams = await functions.getTeams([teamID, potID]);
  
    if(Teams!==null && typeof Teams!=='undefined' && Teams.length){
      var Team = (Teams[0].IDTEAM===teamID) ? Teams[0] : Teams[1];
      var Pot = (Teams[0].IDTEAM===potID) ? Teams[0] : Teams[1];
  
      await functions.addCoins(Team, Pot.CASH)
      await functions.setCoins(Pot, 0)
    }else{
      throw "Invalid Teams"
    }
  }catch(e){
    throw e;
  }
}


/**
 * Removes a player from a team
 * 
 * @param {number} personID id of the person to be removed
 * @return void
 */
export async function removePlayerFromTeam(personID){
  try{
    if(personID===null || typeof personID==='undefined' || personID < 0){
      throw "Parameters Undefined (removePlayerFromTeam)";
    }
  
    var Person = await functions.getPerson(personID);
  
    if(typeof Person!=='undefined' && Person!==null){
      if(Person.IDTEAM !==null) {
        console.log("Removing...")
        const { updated, update_error } = await supabase  //NOTE verificar se da erro
        .from('Persons')
        .update({ IDTEAM: null })
        .eq('IDPERSON', personID)
        if(update_error) throw update_error
      }else{
        throw "Invalid Team of the person"
      }
    }else{
      throw "Invalid Person"
    }
  }catch(e){
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
export async function setPlayerTeam(personID, teamID){
  try{
    if(personID===null || teamID===null || typeof personID==='undefined' || typeof teamID==='undefined' || personID < 0 || teamID < 0){
      throw "Parameters Undefined (setPlayerTeam)";
    }
  
    var Person = await functions.getPerson(personID);
    var Team = await functions.getTeam(teamID);
  
    if(typeof Person!=='undefined' && typeof Team!=='undefined' && Person!==null && Team!==null) {
      if(Person.IDTEAM !==null) {
        const { updated, update_error } = await supabase  //NOTE verificar se da erro
        .from('Persons')
        .update({ IDTEAM: teamID })
        .eq('IDPERSON', personID)
        if(update_error) throw update_error
      }else{
        throw "Invalid Team of the person"
      }
    }else{
      throw "Invalid Person/Team"
    }
  }catch(e){
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
export async function transferHouse(oldTeamID, houseID, finalTeamID){
  try{
    if(oldTeamID===null || houseID===null || finalTeamID===null || typeof oldTeamID==='undefined' || typeof houseID==='undefined' || typeof finalTeamID==='undefined' || oldTeamID < 0 || houseID < 0 || finalTeamID < 0){
      throw "Parameters Undefined (transferHouse)";
    }
  
    var OldTeam = await functions.getTeam(oldTeamID);
    var NewTeam = await functions.getTeam(finalTeamID);
    var House = await functions.getHouse(houseID);
  
    if (OldTeam!==null && House!==null && NewTeam!==null && typeof OldTeam!=='undefined' && typeof House!=='undefined' && typeof NewTeam!=='undefined' && House.TYPE==="house") {
      if (House.IDTEAM !== null) {
        if (House.IDTEAM === oldTeamID) {
          const { updated, update_error } = await supabase  //NOTE verificar se da erro
          .from('Houses')
          .update({ IDTEAM: finalTeamID })
          .eq('IDHOUSE', houseID)
          if(update_error) throw update_error
        }else{
          throw "Team doesn´t own the house"
        }
      }else{
        throw "Invalid House"
      }
    }else{
      throw "Invalid House/Teams"
    }
  }catch(e){
    throw e;
  }
}


/**
 * Get all the cards and shuffles them
 * 
 * @return void
 */
export async function shuffleCards(){
  try{
    let { data: Cards, error } = await supabase
    .from('SpecialCards')
    .select('*')
    if(error) throw error
    while (Cards.length > 0) {
      var random = functions.getRandomInt(0, Cards.length);
      Deck.push(Cards.splice(random, 1));
    }
  }catch(e){
    throw e;
  }
}



/**
 * Take a card from the deck
 * 
 * @param {number} teamID id of the team 
 * @return description of the card
 */
export async function cardLC(teamID) {
  try{
    if (typeof teamID === 'undefined' || teamID === null){
      throw "Parameters Undefined (cardLC)";
    }
  
    var Team = await functions.getTeam(teamID);
    var card;
  
    if (!Deck.length) {
      await shuffleCards();
    }
  
    card = (Deck.pop())[0];
  
    if (Team !== null && card !== null && typeof Team !== 'undefined' && typeof card !== 'undefined') {
      switch (card.TYPE) {
        case 0: // Special cards (challenges)
          break; // Do nothing
  
        case 1: // Give money to Pot
          if (card.AMMOUNT) {
            await increasePot(teamID, card.AMMOUNT);
          }else{
            throw "Card ammount error"
          }
          break;
  
        case 2: // Recieve money from bank
          if (card.AMMOUNT){
            await teamAddCoins(teamID, card.AMMOUNT);
          }else{
            throw "Card ammount error"
          }
          break;
  
        case 3: // Give/recieve money to/from teams
          // Select all valid teams that are not the playing team
          let { data: Teams, error1 } = await supabase
          .from('Teams')
          .select('*').gt('IDTEAM', 1).neq('IDTEAM', teamID) 
          if(error1) throw error1
          // Negative ammount -> team gives money
          if (card.AMMOUNT < 0) {
            Teams.forEach(team => {
              if (typeof team !== 'undefined' && team!==null) {
                await transferCoins(team.IDTEAM, teamID, 0 - card.AMMOUNT);
              }else{
                console.log("\n\n TEAM CORRUPTION \n\n");
              }
            });
          // Positive ammount -> team recieves money
          } else {
            Teams.forEach(team => {
              if (typeof team !== 'undefined' && team!==null) {
                await transferCoins(teamID, team.IDTEAM, card.AMMOUNT);
              }else{
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
          const { data2, error2 } = await supabase
          .from('Teams')
          .update({ HOUSE: Team.HOUSE, CASH: Team.CASH})
          .eq('IDTEAM', teamID)
          if(error2) throw error2
          break;
  
        case 5: // Move to specific house
          var current_house = Team.HOUSE;
  
          Team.HOUSE = card.AMMOUNT;
  
          // Team passes the starting house and is not going to jail
          if (Team.HOUSE < current_house && Team.HOUSE != 6) {
            Team.CASH += START_CASH;
          }
          const { data3, error3 } = await supabase
          .from('Teams')
          .update({ HOUSE: Team.HOUSE, CASH: Team.CASH})
          .eq('IDTEAM', teamID)
          if(error3) throw error3  
          break;
  
        default:
          throw "Invalid card type"
      }
      return card.DESCRIPTION;
    }else{
      throw "Invalid Card/Team"
    }
  }catch(e){
    throw e;
  }
}
