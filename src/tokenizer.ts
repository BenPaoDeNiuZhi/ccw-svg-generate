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
    public funcName:string
    public args:any[]
    constructor(funcName:string,args:any[]){
        super('keyword')
        this.funcName = funcName
        this.args = args
    }
}

export function tokenize(script:string){
    const trimScript:string = script.trim()
    if(trimScript.includes('(') && trimScript.endsWith(')')){// aaa(...)
        const funcName:string = trimScript.match(/.+(?=\()/)?.[0] || ''
        return new token_function(funcName,(trimScript.match(/(?<=\S\().+(?=\))/)?.[0] || '').split(','))
    }
}