import { supabase } from './settings.js'
import * as functions from './functions.js'

var potID = 0;

async function throwDices(teamID){

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
    if(dices[0]===dices[1]){
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
          return; //NOTE vai para a prisão
        }
      }
    }
    var house = (Teams[0].HOUSE + dices.reduce((a,b) => a+b, 0)) >= 40 ? (Teams[0].HOUSE + dices.reduce((a,b) => a+b, 0))-40 : Teams[0].HOUSE + dices.reduce((a,b) => a+b, 0)
    console.log(house)
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ HOUSE: house })
    .eq('IDTEAM', teamID)
    //FIXME tamanho do tabuleiro e os updates saem undefined?
  }
}


async function transferCoins(minusTeam,plusTeam,cash){
  if(typeof minusTeam==='undefined' || typeof plusTeam==='undefined' || typeof cash==='undefined' || minusTeam < 0 || plusTeam < 0 || cash < 0){
    return;
  }

  let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').in('IDTEAM', [minusTeam,plusTeam])

  if(typeof Teams!=='undefined' && Teams.length){
    functions.subtractCoins(Teams[0],cash);
    functions.addCoins(Teams[1],cash);
  }
}

async function buyPatent(teamID,houseID){
  if(typeof teamID==='undefined' || typeof houseID==='undefined' || teamID < 0 || houseID < 0){
    return;
  }
  let { data: Teams, error_team } = await supabase
  .from('Teams')
  .select('*').eq('IDTEAM', houseID)
  let { data: Houses, error_house } = await supabase
  .from('Houses')
  .select('*').eq('IDHOUSE', houseID)
  if(typeof Houses!=='undefined' && typeof Teams!=='undefined' && Houses[0].TYPE==="house" && Teams.length){
    functions.subtractCoins(Teams[0],Houses[0].PRICE);
    const { updated, update_error } = await supabase
    .from('Houses')
    .update({ IDTEAM: house })
    .eq('IDTEAM', teamID)
  }
}

async function increasePot(teamID,cash){
  if(functions.subtractCoins(teamID, cash))
    functions.addCoins(potID, cash)
    //TODO se não tiver dinheiro
}

async function receivePot(teamID){
  let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').eq('IDTEAM', potID)

  if(typeof Teams!=='undefined' && Teams.length && error===null){
    if(functions.addCoins(teamID, Teams[0].CASH))
      functions.setCoins(potID, 0)
      //TODO se não tiver dinheiro

  }
}



/*addCoins(1,99);
addCoins(12,99);
addCoins(12,-99);
subtractCoins(1,5);
throwDices(1);
transferCoins(1,2);*/
buyPatent(1,1)
console.log(functions.logTime());