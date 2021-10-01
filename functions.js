export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function logTime(){
    return Date().toLocaleString('en-GB', { hour: "numeric", 
    minute: "numeric"});
}

export function addCoins(Teams,cash){
    if(cash<0){
        return;
    }

    Teams.CASH+=cash;
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ CASH: Teams.CASH })
    .eq('IDTEAM', Teams.IDTEAM)
    //NOTE checkar resposta

}

export function subtractCoins(Teams,cash){
    if(cash<0){
        return;
    }

    Teams.CASH=(Teams.CASH-=cash) <0 ? 0: Teams.CASH;  //REVIEW impedir ação se não for possível subtrair
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ CASH: Teams.CASH })
    .eq('IDTEAM', Teams.IDTEAM)
    //NOTE checkar resposta
    
}

export function setCoins(Teams,cash){
    
    const { updated, update_error } = await supabase
    .from('Teams')
    .update({ CASH: cash })
    .eq('IDTEAM', Teams.IDTEAM)
    //NOTE checkar resposta
    
}