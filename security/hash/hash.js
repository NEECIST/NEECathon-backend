

export async function hash_string(input){
    const { createHmac } = await import('crypto');
    const { randomBytes } = await import('crypto');
    
    const secret = randomBytes(20).toString('hex');
    const hash = createHmac('sha256', secret)
                .update(input)
                .digest('hex');
    return hash;
}

export async function generate_salt(){
    const { createHmac } = await import('crypto');
    const { randomBytes } = await import('crypto');
    
    const secret = randomBytes(20).toString('hex');
    const hash = createHmac('sha256', secret)
                .update(secret)
                .digest('hex');
    console.log(secret,"Secret")
    console.log(hash,"Hash")
    return hash;
}

export async function check_password(input,salt,output){
    const { createHmac } = await import('crypto');
    
    const hash = createHmac('sha256', input+salt)
                .update(input+salt)
                .digest('hex');
    console.log(hash,"Salted input")
    if(hash===output){
        return true
    }else{
        return false
    }
}

export async function create_salted_hash(input,salt){
    const { createHmac } = await import('crypto');
    
    const hash = createHmac('sha256', input+salt)
                .update(input+salt)
                .digest('hex');
    console.log(hash,"Salted input")
    return hash;
}