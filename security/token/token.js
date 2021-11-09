import jwt_decode from "jwt-decode";
import jwt from "jsonwebtoken"

export function decode_token(token){
    if(validate_token(token)===1){
        try{
            var decoded = jwt_decode(token)
        }catch(e){
            decoded=null;
            console.log(e);
        }finally{
            return decoded
        }
    }else{
        return null
    }
}

export function decode_header(token){
    if(validate_token(token)===1){        
        try{
            var decoded = jwt_decode(token,{header: true})
        }catch(e){
            decoded=null;
            console.log(e);
        }finally{
            return decoded
        }
    }else{
        return null
    }
}

export function decode_uuid(token){
    if(validate_token(token)===1){  
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
    }else{
        return null
    }
}

export function decode_role(token){
    if(validate_token(token)===1){
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
    }else{
        return null
    }
}

export function decode_email(token){
    if(validate_token(token)===1){
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
    }else{
        return null
    }
}

export function validate_token(token){  //NOTE chamar esta função no inicio de cada uma das outras funcoes acima
    var privateKey=process.env.JWT_SECRET;
    var validity=0;
    try {
        var decoded = jwt.verify(token, privateKey);
        validity=1;
        console.log(decoded,"jwt validate token")
    }catch(e) {
        console.log(e);
    }finally{
        return validity;
    }
}
