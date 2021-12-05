import jwt_decode from "jwt-decode";
import jwt from "jsonwebtoken"

/**
 * Decodes a JWT token and validates it
 * 
 * @param {JWT} token Target token
 * @return {Object} Decoded JWT (or not)
 */
export function decode_token(token){
    if(validate_token(token)===1){
        try{
            var decoded = jwt_decode(token)
        }catch(e){
            decoded=null;
            throw e;
        }finally{
            return decoded
        }
    }else{
        return null
    }
}

/**
 * Decodes the header of a JWT token and validates it
 * 
 * @param {JWT} token Target token
 * @return {Object} Decoded JWT (or not)
 */
export function decode_header(token){
    if(validate_token(token)===1){        
        try{
            var decoded = jwt_decode(token,{header: true})
        }catch(e){
            decoded=null;
            throw e;
        }finally{
            return decoded
        }
    }else{
        return null
    }
}

/**
 * Decodes the uuid of a JWT token and validates it
 * 
 * @param {JWT} token Target token
 * @return {Object} Decoded JWT (or not)
 */
export function decode_uuid(token){
    if(validate_token(token)===1){  
        try{
            var decoded = jwt_decode(token)
        }catch(e){
            decoded=null;
            throw e;
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

/**
 * Decodes the role of a JWT token and validates it
 * 
 * @param {JWT} token Target token
 * @return {Object} Decoded JWT (or not)
 */
export function decode_role(token){
    if(validate_token(token)===1){
        try{
            var decoded = jwt_decode(token)
        }catch(e){
            decoded=null;
            throw e;
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

/**
 * Decodes the email of a JWT token and validates it
 * 
 * @param {JWT} token Target token
 * @return {Object} Decoded JWT (or not)
 */
export function decode_email(token){
    if(validate_token(token)===1){
        try{
            var decoded = jwt_decode(token)
        }catch(e){
            decoded=null;
            throw e;
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

/**
 * Validates a JWT token
 * 
 * @param {JWT} token Target token
 * @return {number} 1- valid, 0-not valid
 */
export function validate_token(token){
    var privateKey=process.env.JWT_SECRET;
    var validity=0;
    try {
        jwt.verify(token, privateKey);
        validity=1;
    }catch(e) {
        throw e;
    }finally{
        return validity;
    }
}
