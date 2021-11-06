import { supabase } from './settings.js'

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function logTime(){
    var dt = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString()
    return dt
}

export async function getTeam (teamID) {
    let { data: Team, error } = await supabase  //NOTE verificar se da erro
      .from('Teams')
      .select('*').eq('IDTEAM', teamID)
    return Team[0]
}

export async function getTeams (teamsID) {
    let { data: Teams, error } = await supabase //NOTE verificar se da erro
      .from('Teams')
      .select('*').in('IDTEAM', teamsID)
    return Teams
}

export async function getPerson (personID) {
    let { data: Person, error } = await supabase    //NOTE verificar se da erro
      .from('Persons')
      .select('*').eq('IDPERSON', personID)
    return Person[0]
}

export async function getHouse (houseID) {
    let { data: House, error } = await supabase    //NOTE verificar se da erro
    .from('Houses')
    .select('*').eq('IDHOUSE', houseID)
    return House[0]
}

export async function getComponent (componentID) {
    let { data: Component, error } = await supabase    //NOTE verificar se da erro
    .from('Components')
    .select('*').eq('IDCOMPONENT', componentID)
    return Component[0]
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
    if(Team.CASH-cash>0){
        Team.CASH=(Team.CASH-=cash) <0 ? 0: Team.CASH;  //REVIEW impedir ação se não for possível subtrair
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