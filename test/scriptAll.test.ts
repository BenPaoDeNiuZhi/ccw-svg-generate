import { exec } from "../src/execute";
import { tokenize } from "../src/tokenizer";
import { describe, it, expect } from 'vitest';
it("run str \"hello world\"",async ()=>{
    const t = tokenize("\"hello world\"")
    expect(await exec(t,{})).toEqual("hello world")
})
it("run keyword ip",async ()=>{
    const t = tokenize("ip")
    expect(await exec(t,{ip:"127.0.0.1"})).toEqual("127.0.0.1")
})
it("run if-else ?(true,\"t\",0)",async ()=>{
    let t = tokenize("?(true,\"t\",0)")
    expect(await exec(t,{})).toEqual("t")
    t = tokenize("?(false,\"t\",0)")
    expect(await exec(t,{})).toEqual(0)
    t = tokenize("?(false,\"t\")")
    expect(await exec(t,{})).toEqual(undefined)
})
it("run concat cct(\"a\",\"b\", \"c\")",async ()=>{
    const t = tokenize("cct(\"a\",\"b\", \"c\")")
    expect(await exec(t,{})).toEqual("abc")
})
it("run equal ==(\"a\",\"b\") ==(\"a\",\"a\")",async ()=>{
    let t = tokenize("==(\"a\",\"b\")")
    expect(await exec(t,{})).toEqual(false)
    t = tokenize("==(\"a\",\"a\")")
    expect(await exec(t,{})).toEqual(true)
})