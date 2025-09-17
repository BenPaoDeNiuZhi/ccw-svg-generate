import { exec } from "../src/execute";
import { tokenize } from "../src/tokenizer";
import { describe, it, expect } from 'vitest';
it("run \"hello world\"",()=>{
    const t = tokenize("\"hello world\"")
    expect(exec(t,{})).toEqual("hello world")
})