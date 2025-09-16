import { describe, it, expect } from 'vitest';
import * as tokenizer from '../src/tokenizer';
describe('tokenize',()=>{
    const test1 = `a()`
    it(`tokenize a function: ${test1}`,()=>{
        const res = tokenizer.tokenize(test1)
        // console.log(res)
        expect(res).toMatchObject(new tokenizer.token_function('a',[]))
    })
    const test2 = `func("str",1,   1.5 ,keyword,  "arg with strange chr ,a \\"")`
    it(`tokenize a function with args: ${test2}`,()=>{
        const res = tokenizer.tokenize(test2) as any
        expect(res).toEqual(new tokenizer.token_function('func',[
            new tokenizer.token_string('str'),
            new tokenizer.token_number(1),
            new tokenizer.token_number(1.5),
            new tokenizer.token_keyword('keyword'),
            new tokenizer.token_string('arg with strange chr ,a \"')
        ]))
    })
    const test3 = 'a,b,\",\",c(a,b)'
    it(`parse some args: (${test3})`,()=>{
        const res = tokenizer.parseArgs(test3)
        // console.log(res)
        expect(res).toEqual(['a','b','\",\"','c(a,b)'])
    })
    const test4 = [`"\\`,`"`]
    it(`parse wrong args: ${JSON.stringify(test4)}`,()=>{
        expect(()=>{tokenizer.parseArgs(test4[0])}).toThrowError(`error while parsing args ${JSON.stringify(['\"',"\\"])}`)
        expect(()=>{tokenizer.parseArgs(test4[1])}).toThrowError(`error while parsing args ${JSON.stringify(['\"'])}`)
    })
})