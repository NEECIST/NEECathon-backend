import { supabase } from '../settings.js'
import * as functions from '../functions/functions.js'
import * as hash from '../security/hash/hash.js'

export async function addUser(token){
    const salt=hash.generate_salt();
    let { user, error } = await supabase.auth.signUp({
        email: 'someone@email.com',
        password: 'lMevrehqTuqcqAiqGibx'
    })
    console.log(user,"user");
    
    const { usergoogle, session, errorgoogle } = await supabase.auth.signIn({
        provider: 'google'
    })

    console.log(usergoogle,"usergoogle");
    console.log(session,"session");
    console.log(errorgoogle,"errorgoogle");

    const output=hash.create_salted_hash(token,salt);
}

export async function verifyUser(token){
    
}