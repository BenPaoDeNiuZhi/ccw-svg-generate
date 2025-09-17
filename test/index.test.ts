import { fillParam } from "../src/index";
import { describe, it, expect } from 'vitest';
it("fill param [\"bbb\"] to tempate \"aaa%sccc\"",()=>{
    expect(fillParam("aaa%sccc",["bbb"])).toEqual("aaabbbccc")
})