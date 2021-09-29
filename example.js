import { supabase } from './settings.js'
// Create a random user login email and password.
let { error, data } = await supabase.auth.signUp({
    email: 'example@email.com',
    password: 'example-password',
})

let { data: Persons, error2 } = await supabase
  .from('Persons')
  .select('*')

console.log(Persons);

let { data3, error3 } = await supabase
  .from('Persons')
  .insert([
    { Name: 'someValue', Email: 'otherValue' },
  ])