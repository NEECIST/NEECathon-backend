import jwt_decode from "jwt-decode";
import jwt from "jsonwebtoken"

export function decode_token(token){
    try{
        var decoded = jwt_decode(token)
    }catch(e){
        decoded=null;
        console.log(e);
    }finally{
        return decoded
    }
}

export function decode_header(token){
    try{
        var decoded = jwt_decode(token,{header: true})
    }catch(e){
        decoded=null;
        console.log(e);
    }finally{
        return decoded
    }
}

export function decode_uuid(token){
    try{
        var decoded = jwt_decode(token)
    }catch(e){
        decoded=null;
        console.log(e);
    }finally{
        if(decoded!==null){
            return decoded.sub
        }else{
            return null
        }
    }
}

export function decode_role(token){
    try{
        var decoded = jwt_decode(token)
    }catch(e){
        decoded=null;
        console.log(e);
    }finally{
        if(decoded!==null){
            return decoded.aud
        }else{
            return null
        }
    }
}

export function decode_email(token){
    try{
        var decoded = jwt_decode(token)
    }catch(e){
        decoded=null;
        console.log(e);
    }finally{
        if(decoded!==null){
            return decoded.email
        }else{
            return null
        }
    }
}

export function validate_token(token){  //NOTE chamar esta função no inicio de cada uma das outras funcoes acima
    var publicKey = process.env.SUPABASE_KEY;
    try {
        var decoded = jwt.verify(token, publicKey);
        console.log(decoded,"jwt validate token")
    }catch(e) {
        console.log(e);
    }
}
