
"use strict";

const ciphertext = "vybircuravxnn";

function caesarDecrypt(text, key) {
    return text.replace(/[a-z]/gi, (char) => {
        const base = char === char.toUpperCase() ? 65 : 97;
        return String.fromCharCode(
            ((char.charCodeAt(0) - base - key + 26) % 26) + base
        );
    });
}

console.log("BAN MA:", ciphertext);
console.log("KET QUA THAM MA CAESAR");
console.log("======================");

for (let key = 0; key < 26; key++) {
    console.log(
        `Khoa ${String(key).padStart(2, "0")}: ${caesarDecrypt(ciphertext, key)}`
    );
}
