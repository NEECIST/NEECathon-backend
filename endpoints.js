import { supabase } from './settings.js'
import * as functions from './functions.js'

var potID = 0;
var BOARD_SIZE = 24;

export async function throwDices(teamID){

  if(typeof teamID==='undefined' ||teamID < 0){
    return;
  }
  let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').eq('IDTEAM', teamID)

  if(typeof Teams!=='undefined' && Teams.length && error===null){
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
    var house = (Teams[0].HOUSE + dices.reduce((a,b) => a+b, 0)) >= BOARD_SIZE ? (Teams[0].HOUSE + dices.reduce((a,b) => a+b, 0))-BOARD_SIZE : Teams[0].HOUSE + dices.reduce((a,b) => a+b, 0)
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

  let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').in('IDTEAM', [minusTeam,plusTeam])

  if(typeof Teams!=='undefined' && Teams.length){
    if(functions.subtractCoins(Teams[0],cash) === true){
      functions.addCoins(Teams[1],cash);
    }
  }
}

export async function buyPatent(teamID,houseID){
  if(typeof teamID==='undefined' || typeof houseID==='undefined' || teamID < 0 || houseID < 0){
    return;
  }
  let { data: Teams, error_team } = await supabase
  .from('Teams')
  .select('*').eq('IDTEAM', teamID)
  let { data: Houses, error_house } = await supabase
  .from('Houses')
  .select('*').eq('IDHOUSE', houseID)
  if(Houses[0].IDTEAM===null){
    if(typeof Houses!=='undefined' && typeof Teams!=='undefined' && Houses[0].TYPE==="house" && Teams.length){
      functions.subtractCoins(Teams[0],Houses[0].PRICE);
      console.log(Houses)
      const { updated, update_error } = await supabase
      .from('Houses')
      .update({ IDTEAM: teamID })
      .eq('IDHOUSE', houseID)
    }
  }else{
    console.log("Patent already bought");
  }
}

export async function increasePot(teamID,cash){
  let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').in('IDTEAM', [teamID, potID])

  if(typeof Teams!=='undefined' && Teams.length && error===null){
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
  let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').in('IDTEAM', [teamID, potID])

  if(typeof Teams!=='undefined' && Teams.length && error===null){
    var Team = (Teams[0].IDTEAM===teamID) ? Teams[0] : Teams[1];
    var Pot = (Teams[0].IDTEAM===potID) ? Teams[0] : Teams[1];

    if(functions.addCoins(Team, Pot.CASH)){
      functions.setCoins(Pot, 0)
    }else{
      //TODO se não tiver dinheiro  
    }
  }
}

receivePot(2);

console.log(functions.logTime());
functions.hash_string("oi");