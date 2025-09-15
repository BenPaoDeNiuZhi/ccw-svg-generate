import { describe, it, expect } from 'vitest';
import { tokenize } from '../src/tokenizer';
describe('tokenize',()=>{
    it('tokenize a function: \"a()\"',()=>{
        const res = tokenize('a()')
        console.log(res)
        expect(res).toMatchObject({type:'func',funcName:'a',args:[]})
    })
    it('tokenize a function with args: \"a(\"a\",1, 1.5)\"',()=>{
        const res = tokenize('a(\"a\",1)')
        console.log(res)
        expect(res).toMatchObject({type:'func',funcName:'a'})
        expect(res.args[0].dat).toBe('a')
        expect(res.args[1].dat).toBe(1)
        expect(res.args[2].dat).toBe(1.5)
    })
    it('tokenize a string: \"a\"',()=>{
        const res = tokenize('\"a\"')
        console.log(res)
        expect(res).toMatchObject({type:'string',dat:'a'})
    })
})