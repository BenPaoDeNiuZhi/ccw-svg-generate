import { exec } from "../src/execute";
import { tokenize } from "../src/tokenizer";
import { describe, it, expect } from 'vitest';
it("run str \"hello world\"",()=>{
    const t = tokenize("\"hello world\"")
    expect(exec(t,{})).toEqual("hello world")
})
it("run keyword ip",()=>{
    const t = tokenize("ip")
    expect(exec(t,{ip:"127.0.0.1"})).toEqual("127.0.0.1")
})
it("run if-else ?(true,\"t\",0)",()=>{
    let t = tokenize("?(true,\"t\",0)")
    expect(exec(t,{})).toEqual("t")
    t = tokenize("?(false,\"t\",0)")
    expect(exec(t,{})).toEqual(0)
})
it("run concat cct(\"a\",\"b\", \"c\")",()=>{
    const t = tokenize("cct(\"a\",\"b\", \"c\")")
    expect(exec(t,{})).toEqual("abc")
})
it("run equal ==(\"a\",\"b\") ==(\"a\",\"a\")",()=>{
    let t = tokenize("==(\"a\",\"b\")")
    expect(exec(t,{})).toEqual(false)
    t = tokenize("==(\"a\",\"a\")")
    expect(exec(t,{})).toEqual(true)
})