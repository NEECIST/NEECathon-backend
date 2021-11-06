import { supabase } from '../../settings.js'
import * as functions from '../../functions/functions.js'

export async function check_permission(token){
    let { data: Admins, error_admin } = await supabase
    .from('Admins')
    .select('*').eq('TOKEN', token)

    if(typeof Admin!=='undefined' && Admins.length){
        console.log("1")
        return 1
    }else{
        /*let { data: Players, error_player } = await supabase
        .from('Players')
        .select('*').eq('TOKEN', token)
        if(typeof Players!=='undefined' && Players.length){
            return 2
        }else{
            return 0
        }*/
        console.log(Admins)
    }
}

/*console.log(check_permission(123))
console.log(check_permission(78))
console.log(check_permission(321))*/