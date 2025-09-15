import { describe, it, expect } from 'vitest';
import { tokenize } from '../src/tokenizer';
describe('tokenize',()=>{
    it('tokenize a function: \"a()\"',()=>{
        const res = tokenize('a()')
        console.log(res)
        expect(res).toMatchObject({type:'func',funcName:'a',args:[]})
    })
    it('tokenize a function with args: \"b(\"a)\",1,   1.5 ,ip)\"',()=>{
        const res = tokenize('b(\"a)\",1,   1.5 ,ip)')
        console.log(res)
        expect(res).toMatchObject({type:'func',funcName:'b'})
        expect(res.args[0].dat).toBe('a)')
        expect(res.args[1].dat).toBe(1)
        expect(res.args[2].dat).toBe(1.5)
        expect(res.args[3].type).toBe("keyword")
        expect(res.args[3].name).toBe("ip")
    })
    it('tokenize a string: \"a\"',()=>{
        const res = tokenize('\"a\"')
        console.log(res)
        expect(res).toMatchObject({type:'string',dat:'a'})
    })
})