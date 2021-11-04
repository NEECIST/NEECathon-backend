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

export async function addCoins(Team,cash){
    if(typeof cash==='undefined' || typeof Team==='undefined' || cash<0){
        return false;
    }

    Team.CASH+=cash;
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ CASH: Team.CASH })
    .eq('IDTEAM', Team.IDTEAM)
    //NOTE checkar resposta

    return true;
}

export async function subtractCoins(Team,cash){
    if(typeof Team==='undefined' || typeof cash==='undefined' || cash<0){
        return false;
    }
    console.log('Antes: '+Team.CASH)
    if(Team.CASH-cash>0){
        Team.CASH=(Team.CASH-=cash) <0 ? 0: Team.CASH;  //REVIEW impedir ação se não for possível subtrair
        console.log('Depois: '+Team.CASH)
        const { updated, update_error } = await supabase
        .from('Teams')
        .update({ CASH: Team.CASH })
        .eq('IDTEAM', Team.IDTEAM)
        //NOTE checkar resposta
        
        return true;
    }else{
        console.log("Team doesn´t have enough money");
        return false;
    }
}

export async function setCoins(Team,cash){
    if(typeof Team==='undefined' || typeof cash==='undefined'){    //NOTE verificar se Teams.cash é undefined?
        return false;
    }
    
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ CASH: cash })
    .eq('IDTEAM', Team.IDTEAM)
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