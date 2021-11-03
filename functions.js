import { supabase } from './settings.js'

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function logTime(){
    return Date().toLocaleString('en-GB', { hour: "numeric", 
    minute: "numeric"});
}

export async function addCoins(teamID,cash){

    let { data: Team, error } = await supabase
    .from('Teams')
    .select('*').eq('IDTEAM', teamID)

    var Teams = Team[0];

    if(typeof cash==='undefined' || typeof Teams==='undefined' || cash<0){
        return false;
    }

    Teams.CASH+=cash;
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ CASH: Teams.CASH })
    .eq('IDTEAM', Teams.IDTEAM)
    //NOTE checkar resposta

    return true;
}

export async function subtractCoins(teamID,cash){

    let { data: Team, error } = await supabase
    .from('Teams')
    .select('*').eq('IDTEAM', teamID)

    var Teams = Team[0];

    if(typeof Teams==='undefined' || typeof cash==='undefined' || cash<0){
        return false;
    }
    console.log('Antes: '+Teams.CASH)
    if(Teams.CASH-cash>0){
        Teams.CASH=(Teams.CASH-=cash) <0 ? 0: Teams.CASH;  //REVIEW impedir ação se não for possível subtrair
        console.log('Depois:'+Teams.CASH)
        const { updated, update_error } = await supabase
        .from('Teams')
        .update({ CASH: Teams.CASH })
        .eq('IDTEAM', Teams.IDTEAM)
        //NOTE checkar resposta
        
        return true;
    }else{
        console.log("Team doesn´t have enough money");
        return false;
    }
}

export async function setCoins(teamID,cash){

    let { data: Team, error } = await supabase
    .from('Teams')
    .select('*').eq('IDTEAM', teamID)

    var Teams = Team[0];

    if(typeof Teams==='undefined' || typeof cash==='undefined'){    //NOTE verificar se Teams.cash é undefined?
        return false;
    }
    
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ CASH: cash })
    .eq('IDTEAM', Teams.IDTEAM)
    //NOTE checkar resposta
    return true;
}

export async function hash_string(input){
    const { createHmac } = await import('crypto');

    const secret = 'abcdefg';
    const hash = createHmac('sha256', secret)
                .update(input)
                .digest('hex');
    console.log(hash);
}