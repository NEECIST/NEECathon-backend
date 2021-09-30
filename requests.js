import { supabase } from './settings.js'

async function addCoins(teamID,cash){
    if(teamID < 0 || cash<0){
        return;
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
}

async function subtractCoins(teamID,cash){
    if(teamID < 0 || cash<0){
        return;
    }
    let { data: Teams, error } = await supabase
  .from('Teams')
  .select('*').eq('IDTEAM', teamID)

  if(Teams.length && error==null){
    Teams[0].CASH=(Teams[0].CASH-=cash) <0 ? 0: Teams[0].CASH;
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
}

addCoins(1,99);
addCoins(12,99);
addCoins(12,-99);
subtractCoins(1,5);