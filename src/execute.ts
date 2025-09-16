import {tokenType,token_function,token_keyword,token_number,token_string} from './tokenizer';

export function exec(current_token: tokenType, ctx:any) {
    if(current_token instanceof token_function){
        current_token as token_function
        switch(current_token.funcName){
            case 'cct':
            case 'concat':
                let ret=''
                for(let argToken of current_token.args){
                    argToken as tokenType
                    ret += (exec(argToken,ctx))
                }
                return ret
        }
    }else if(current_token instanceof token_string){
        current_token as token_string
        return current_token.dat
    }else if(current_token instanceof token_number){
        current_token as token_number
        return current_token.dat
    }else if(current_token instanceof token_keyword){
        current_token as token_keyword
        return ctx?.[current_token.name] || 'undefined'
    }
}
