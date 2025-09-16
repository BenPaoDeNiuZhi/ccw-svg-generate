export class token{
    public type:string;
    constructor(type:string){
        this.type = type
    }
}

export class token_function extends token{
    public funcName:string
    public args:any[]
    constructor(funcName:string,args:any[]){
        super('func')
        this.funcName = funcName
        this.args = args
    }
}
export class token_keyword extends token{
    public name:string
    constructor(name:string){
        super('keyword')
        this.name = name
    }
}

export class token_string extends token{
    public dat:string
    constructor(dat:string){
        super('string')
        this.dat = dat
    }
}

export class token_number extends token{
    public dat:number
    constructor(dat:number){
        super('number')
        this.dat = dat
    }
}

export function parseArgs(argRaw:string):string[]{
    let argDatas = []
    let tmp = ''
    let stack = []
    for(let i of argRaw){
        if(i === '(' && stack.at(-1) !== '\"' && stack.at(-1) !== '\''){
            stack.push('(')
        }else if(i === ')' && stack.at(-1) !== '\"' && stack.at(-1) !== '\''){
            if(stack.at(-1) == '('){
                stack.pop()
            }
        }else if(i === '\"' && stack.at(-1) !== '\'' && stack.at(-1) !== '\\'){
            if(stack.at(-1) == '\"'){
                stack.pop()
            }else{
                stack.push('\"')
            }
        }else if(i === '\'' && stack.at(-1) !== '\"'&& stack.at(-1) !== '\\'){
            if(stack.at(-1) == '\''){
                stack.pop()
            }else{
                stack.push('\'')
            }
        }
        if(i === ',' && stack.length === 0){
            argDatas.push(tmp)
            tmp = ''
        }else if(i === '\\' && (stack.at(-1) === '\"' || stack.at(-1) === '\'')){
            stack.push('\\')
        }
        else{
            tmp += i
            if(stack.at(-1) == '\\'){
                stack.pop()
            }
        }
    }
    if(tmp){
        argDatas.push(tmp)
    }
    if(stack.length !== 0){
        throw new Error(`error while parsing args ${JSON.stringify(stack)}`)
    }
    return argDatas
}

export function tokenize(script:string):token{
    const trimScript:string = script.trim()
    if(trimScript.includes('(') && trimScript.endsWith(')')){// aaa(...)
        const funcName:string = trimScript.match(/.+(?=\()/)?.[0] || ''
        const argExpressions = parseArgs(trimScript.match(/(?<=\S\().+(?=\))/)?.[0] || '')
        if(argExpressions.length==1 && argExpressions[0].trim().length==0){
            return new token_function(funcName,[])
        }
        const argTokens = argExpressions.map((e:string)=>{
            return tokenize(e)
        })
        return new token_function(funcName,argTokens)
    }else if((trimScript.startsWith('\"') && trimScript.endsWith('\"')) || 
            (trimScript.startsWith('\'') && trimScript.endsWith('\''))){
        const data:string = trimScript.match(/(?<=['"]).*(?=['"])/)?.[0] || ''
        return new token_string(data)
    }else if(/^\d*\.?\d+$/.test(trimScript)){
        const data:number = parseFloat(trimScript.match(/^\d*\.?\d+$/)?.[0] as string) || 0
        return new token_number(data)
    }else{
        return new token_keyword(trimScript)
    }
}