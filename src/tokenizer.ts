class token{
    public type:string;
    constructor(type:string){
        this.type = type
    }
}

class token_function extends token{
    public funcName:string
    public args:any[]
    constructor(funcName:string,args:any[]){
        super('func')
        this.funcName = funcName
        this.args = args
    }
}
class token_keyword extends token{
    public name:string
    constructor(name:string){
        super('keyword')
        this.name = name
    }
}

class token_string extends token{
    public dat:string
    constructor(dat:string){
        super('string')
        this.dat = dat
    }
}

export function tokenize(script:string){
    const trimScript:string = script.trim()
    if(trimScript.includes('(') && trimScript.endsWith(')')){// aaa(...)
        const funcName:string = trimScript.match(/.+(?=\()/)?.[0] || ''
        const argExps = (trimScript.match(/(?<=\S\().+(?=\))/)?.[0] || '').split(',')
        if(argExps.length==1 && argExp[0].trim().length==0){
            return new token_function(funcName,[])
        }
        const argTokens = argExps.map((e)=>{
            return tokenize(e)
        })
        return new token_function(funcName,argTokens)
    }else if((trimScript.startsWith('\"') && trimScript.endsWith('\"')) || 
            (trimScript.startsWith('\'') && trimScript.endsWith('\''))){
        const data:string = trimScript.match(/(?<=['"]).*(?=['"])/)?.[0] || ''
        return new token_string(data)
    }
}