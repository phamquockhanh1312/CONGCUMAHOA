
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Nhap mat khau: ", (password) => {
    if (!password) {
        console.log("Mat khau khong duoc de trong.");
        rl.close();
        return;
    }

    const plaintext = "IlovePhenikaa";
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(16);

    const key = crypto.pbkdf2Sync(
        password,
        salt,
        100000,
        16,
        "sha256"
    );

    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);

    const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final()
    ]);

    const result = {
        algorithm: "AES-128-CBC",
        plaintext: plaintext,
        kdf: "PBKDF2-SHA256",
        iterations: 100000,
        salt: salt.toString("hex"),
        iv: iv.toString("hex"),
        ciphertext: encrypted.toString("base64")
    };

    fs.writeFileSync(
        "aes-encrypt.dat",
        JSON.stringify(result, null, 2),
        "utf8"
    );

    console.log("Ma hoa thanh cong!");
    console.log("Ban ma:", result.ciphertext);
    console.log("Da ghi ket qua vao aes-encrypt.dat");

    rl.close();
});

