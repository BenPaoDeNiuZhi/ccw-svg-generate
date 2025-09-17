import {tokenType,token_function,token_keyword,token_number,token_string} from './tokenizer';

export function exec(current_token: tokenType, ctx:any) {
    if(current_token instanceof token_function){
        current_token as token_function
        switch(current_token.funcName){
            case 'equ':
            case '==':
                if(current_token.args.length < 2){
                    throw new Error('arg num less than 2',
                        JSON.stringify(current_token.args))
                }
                if(current_token.args[0]==current_token.args[1]){
                    return "true"
                }else{
                    return "false"
                }
                break;
            case 'cct':
            case 'concat':
                let ret=''
                for(let argToken of current_token.args){
                    argToken as tokenType
                    ret += (exec(argToken,ctx))
                }
                return ret
            case '?':
            case 'if-else':
            case 'if'://if(statement,value when true,value when false)
                if(current_token.args.length < 2){
                    throw new Error('arg num less than 2',
                        JSON.stringify(current_token.args)
                    )
                }
                let statement = current_token.args[0]
                if(exec(statement)=='true'){
                    return exec(current_token.args[1])
                }
                if(current_token.args[2]){
                    return exec(current_token.args[2])
                }
                return ""
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
