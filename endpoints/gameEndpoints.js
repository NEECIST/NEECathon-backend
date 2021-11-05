import { supabase } from '../settings.js'
import * as functions from '../functions.js'

var potID = 0;
var BOARD_SIZE = 24;
var Deck = [];

export async function teamAddCoins(teamID, cash) {
  var Team = await functions.getTeam(teamID);

  functions.addCoins(Team, cash)
}

export async function teamSubtractCoins(teamID, cash) {
  var Team = await functions.getTeam(teamID);

  functions.subtractCoins(Team, cash)
}

export async function setCoinsTeam(teamID, cash) {
  var Team = await functions.getTeam(teamID);

  functions.setCoins(Team, cash)
}

export async function throwDices(teamID){

  if(typeof teamID==='undefined' ||teamID < 0){
    return;
  }
  var Teams = await functions.getTeam(teamID);

  if(typeof Teams!=='undefined'){
    var dices=[];
    dices.push(functions.getRandomInt(1,7))
    dices.push(functions.getRandomInt(1,7))
    /*if(dices[0]===dices[1]){
      dices.push(functions.getRandomInt(1,7))
      dices.push(functions.getRandomInt(1,7))
      if(dices[2]===dices[3]){
        dices.push(functions.getRandomInt(1,7))
        dices.push(functions.getRandomInt(1,7))
        if(dices[4]===dices[5]){
          var house = 10;
          const { updated, update_error } = await supabase
          .from('Teams')
          .update({ HOUSE: house })
          .eq('IDTEAM', teamID)
          return; //NOTE DEPRECATED doubles
        }
      }
    }*/
    var house = (Teams.HOUSE + dices.reduce((a,b) => a+b, 0)) >= BOARD_SIZE ? (Teams.HOUSE + dices.reduce((a,b) => a+b, 0))-BOARD_SIZE : Teams.HOUSE + dices.reduce((a,b) => a+b, 0)
    console.log('throwDices:'+house)
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ HOUSE: house })
    .eq('IDTEAM', teamID)
    //FIXME tamanho do tabuleiro e os updates saem undefined?
  }
}


export async function transferCoins(minusTeam,plusTeam,cash){
  if(typeof minusTeam==='undefined' || typeof plusTeam==='undefined' || typeof cash==='undefined' || minusTeam < 0 || plusTeam < 0 || cash < 0){
    return;
  }

  var Teams = await functions.getTeams([minusTeam, plusTeam]);

  if(typeof Teams!=='undefined' && Teams.length){
    var MTeam = (Teams[0].IDTEAM===minusTeam) ? Teams[0] : Teams[1];
    var PTeam = (Teams[0].IDTEAM===plusTeam) ? Teams[0] : Teams[1];

    if(functions.subtractCoins(MTeam, cash)){
      functions.addCoins(PTeam, cash);
    }
  }
}

export async function buyPatent(teamID,houseID){
  if(typeof teamID==='undefined' || typeof houseID==='undefined' || teamID < 0 || houseID < 0){
    return;
  }
  var Teams = await functions.getTeam(teamID);
  var House = await functions.getHouse(houseID);

  if(House.IDTEAM===null){
    if(typeof House!=='undefined' && typeof Teams!=='undefined' && House.TYPE==="house"){
      functions.subtractCoins(Teams,House.PRICE);
      const { updated, update_error } = await supabase  //NOTE verificar se da erro
      .from('Houses')
      .update({ IDTEAM: teamID })
      .eq('IDHOUSE', houseID)
    }
  }else{
    console.log("Patent already bought");
  }
}

export async function increasePot(teamID,cash){
  var Teams = await functions.getTeams([teamID, potID]);

  if(typeof Teams!=='undefined' && Teams.length){
    var Team = (Teams[0].IDTEAM===teamID) ? Teams[0] : Teams[1];
    var Pot = (Teams[0].IDTEAM===potID) ? Teams[0] : Teams[1];

    if(functions.subtractCoins(Team, cash)){
      functions.addCoins(Pot, cash)
    }else{
      //TODO se não tiver dinheiro  
    }
  }
}

export async function receivePot(teamID){
  var Teams = await functions.getTeams([teamID, potID]);

  if(typeof Teams!=='undefined' && Teams.length){
    var Team = (Teams[0].IDTEAM===teamID) ? Teams[0] : Teams[1];
    var Pot = (Teams[0].IDTEAM===potID) ? Teams[0] : Teams[1];

    if(functions.addCoins(Team, Pot.CASH)){
      functions.setCoins(Pot, 0)
    }else{
      //TODO se não tiver dinheiro  
    }
  }
}

export async function addPlayer2Team(personID, teamID){
  if(typeof personID==='undefined' || typeof teamID==='undefined' || personID < 0 || teamID < 0){
    return;
  }

  var Person = await functions.getPerson(personID);
  var Team = await functions.getTeam(teamID)

  if(typeof Person!=='undefined' && typeof Team!=='undefined') {
    if(Person.IDTEAM ===null) {
      const { updated, update_error } = await supabase  //NOTE verificar se da erro
      .from('Persons')
      .update({ IDTEAM: teamID })
      .eq('IDPERSON', personID)
    }
  }
}

export async function removePlayerFromTeam(personID){
  if(typeof personID==='undefined' || personID < 0){
    return;
  }

  var Person = await functions.getPerson(personID);

  if(typeof Person!=='undefined') {
    if(Person.IDTEAM !==null) {
      console.log("Removing...")
      const { updated, update_error } = await supabase  //NOTE verificar se da erro
      .from('Persons')
      .update({ IDTEAM: null })
      .eq('IDPERSON', personID)
    }
  }
}

export async function transferPlayerFromTeam(personID, finalTeamID){
  if(typeof personID==='undefined' || typeof finalTeamID==='undefined' || personID < 0 || finalTeamID < 0){
    return;
  }

  var Person = await functions.getPerson(personID);
  var Team = await functions.getTeam(finalTeamID);

  if(typeof Person!=='undefined' && typeof Team!=='undefined') {
    if(Person.IDTEAM !==null) {
      const { updated, update_error } = await supabase  //NOTE verificar se da erro
      .from('Persons')
      .update({ IDTEAM: finalTeamID })
      .eq('IDPERSON', personID)
    }
  }
}

export async function tradeHouse(houseID, finalTeamID){
  if(typeof houseID==='undefined' || typeof finalTeamID==='undefined' || houseID < 0 || finalTeamID < 0){
    return;
  }

  var Team = await functions.getTeam(finalTeamID);
  var House = await functions.getHouse(houseID);

  if (typeof House!=='undefined' && typeof Team!=='undefined' && House.TYPE==="house") {
    if (House.IDTEAM !== null) {
      const { updated, update_error } = await supabase  //NOTE verificar se da erro
      .from('Houses')
      .update({ IDTEAM: finalTeamID })
      .eq('IDHOUSE', houseID)
    }
  }

}

export async function shuffleCards(){
  let { data: Cards, error } = await supabase    //NOTE verificar se da erro
  .from('SpecialCards')
  .select('*')

  while (Cards.length > 0) {
    var random = functions.getRandomInt(0, Cards.length);
    Deck.push(Cards.splice(random, 1));
  }
}



shuffleCards();
console.log(functions.logTime());
functions.hash_string("oi");