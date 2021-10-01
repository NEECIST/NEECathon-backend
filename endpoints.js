import { supabase } from './settings.js'
import * as functions from './functions.js'

var potID = 0;

async function addCoins(teamID,cash){
  if(teamID < 0 || cash<0){
    return false;
  }
  let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').eq('IDTEAM', teamID)
  if(Teams.length && error==null){
    Teams[0].CASH+=cash;
    console.log(Teams[0].CASH)
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ CASH: Teams[0].CASH })
    .eq('IDTEAM', teamID)
  }else{
    //REVIEW gerar log file
    if(error!=null){

    }else{
        //NOTE equipa não encontrada
    }
  }
  return true
}

async function subtractCoins(teamID,cash){
  if(teamID < 0 || cash<0){
    return false;
  }
  let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').eq('IDTEAM', teamID)

  if(Teams.length && error==null){
    Teams[0].CASH=(Teams[0].CASH-=cash) <0 ? 0: Teams[0].CASH;  //REVIEW impedir ação se não tiver dinheiro suficiente
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ CASH: Teams[0].CASH })
    .eq('IDTEAM', teamID)
    //NOTE Checkar resposta?
  }else{
    //REVIEW gerar log file
    if(error!=null){

    }else{
      //NOTE equipa não encontrada
    }
  }
  return true
}

async function setCoins(teamID,cash){
  if(teamID < 0 || cash<0){
    return false;
  }
  let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').eq('IDTEAM', teamID)
  if(Teams.length && error==null){
    Teams[0].CASH=cash;
    console.log(Teams[0].CASH)
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ CASH: Teams[0].CASH })
    .eq('IDTEAM', teamID)
  }else{
    //REVIEW gerar log file
    if(error!=null){

    }else{
        //NOTE equipa não encontrada
    }
  }
  return true
}

async function move_team(teamID){
  if(teamID < 0){
    return;
  }
  let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').eq('IDTEAM', teamID)

  if(Teams.length && error==null){
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

async function increasePot(teamID,cash){
  if(subtractCoins(teamID, cash))
    addCoins(potID, cash)
  //TODO se não tiver dinheiro
}

async function receivePot(teamID){
  let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').eq('IDTEAM', potID)

  if(Teams.length && error==null){
    if(addCoins(teamID, Teams[0].CASH))
      setCoins(potID, 0)
    //TODO se não tiver dinheiro
  }
}

/*addCoins(1,99);
addCoins(12,99);
addCoins(12,-99);
subtractCoins(1,5);*/
console.log(functions.logTime());