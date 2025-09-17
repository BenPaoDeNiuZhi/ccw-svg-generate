import { exec } from "../src/execute";
import { token_string, token_keyword, token_function} from "../src/tokenizer";
import { describe, it, expect } from 'vitest';
it('execute a string: \"abcd\"',async ()=>{
    expect(await exec(new token_string('abcd'),{})).toBe('abcd')
})
it('execute builtin keywords: true false null undefined',async ()=>{
    expect(await exec(new token_keyword('true'),{})).toBe(true)
    expect(await exec(new token_keyword('false'),{})).toBe(false)
    expect(await exec(new token_keyword('null'),{})).toBe(null)
    expect(await exec(new token_keyword('undefined'),{})).toBe(undefined)
})
it('execute a keyword: ip',async ()=>{
    expect(await exec(new token_keyword('ip'),{ip:'127.0.0.1'})).toBe('127.0.0.1')
})
it('execute an undefined keyword: xxx',async ()=>{
    expect(await exec(new token_keyword('xxx'),{ip:'127.0.0.1'})).toBe(undefined)
})
it('execute concat: concat(ip,\" hello\")',async ()=>{
    expect(await exec(new token_function('concat',[
        new token_keyword("ip"),
        new token_string(" hello")
    ]),{ip:'127.0.0.1'})).toBe('127.0.0.1 hello')
})
it('execute if(else): ?(true,"1","2")',async ()=>{
    expect(await exec(new token_function('?',[
        new token_string("true"),
        new token_string("1"),
        new token_string("2")]),{})).toBe('1')
})