"use strict";

/*
========================================================
ỨNG DỤNG MÃ HÓA
--------------------------------------------------------
Cổ điển:
    - Caesar
    - Substitution
    - Vigenere
    - Affine
    - Hill

Hiện đại:
    - AES
    - DES

Công khai:
    - RSA

Hash:
    - MD5
    - SHA-256

Thư viện:
    CryptoJS
    JSEncrypt
========================================================
*/


// ======================================================
// DOM
// ======================================================

const category = document.getElementById("category");
const algorithm = document.getElementById("algorithm");

const alphabet = document.getElementById("alphabet");
const alphabetGroup = document.getElementById("alphabetGroup");

const keyGroup = document.getElementById("keyGroup");
const keyInput = document.getElementById("key");

const plaintext = document.getElementById("plaintext");
const ciphertext = document.getElementById("ciphertext");
const bitInfo = document.getElementById("bitInfo");

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const clearBtn = document.getElementById("clearBtn");

const guideTitle = document.getElementById("guideTitle");
const guideText = document.getElementById("guideText");

const rsaGroup = document.getElementById("rsaGroup");
const publicKey = document.getElementById("publicKey");
const privateKey = document.getElementById("privateKey");
const generateRSA = document.getElementById("generateRSA");


// ======================================================
// BẢNG CHỮ CÁI
// ======================================================

const ALPHABET26 =
    "abcdefghijklmnopqrstuvwxyz";


/*
Z29 dùng bộ ký tự:
a ă â b c d đ e ê g h i k l m n o ô ơ p q r s t u ư v x y

Tổng cộng 29 ký tự.
*/

const ALPHABET29 =
    "aăâbcdđeêghiklmnoôơpqrstưvxy";


function getAlphabet() {

    return alphabet.value === "29"
        ? ALPHABET29
        : ALPHABET26;

}


// ======================================================
// DANH SÁCH THUẬT TOÁN
// ======================================================

const algorithms = {

    classical: [
        ["caesar", "Dịch vòng / Caesar"],
        ["substitution", "Mã thay thế"],
        ["vigenere", "Vigenere"],
        ["affine", "Affine"],
        ["hill", "Hill"]
    ],

    modern: [
        ["aes", "AES"],
        ["des", "DES"]
    ],

    public: [
        ["rsa", "RSA"]
    ],

    hash: [
        ["md5", "MD5"],
        ["sha256", "SHA-256"]
    ]

};


// ======================================================
// HƯỚNG DẪN
// ======================================================

const guides = {

    caesar: {
        title: "Dịch vòng / Caesar",
        text: "Nhập khóa là số nguyên. Ví dụ: 3"
    },

    substitution: {
        title: "Mã thay thế",
        text: "Khóa phải là một hoán vị của toàn bộ bảng chữ cái."
    },

    vigenere: {
        title: "Vigenere",
        text: "Nhập khóa dạng chữ. Ví dụ: CRYPTO"
    },

    affine: {
        title: "Affine",
        text: "Nhập khóa theo dạng a,b. Ví dụ Z26: 5,8"
    },

    hill: {
        title: "Hill",
        text: "Nhập ma trận 2×2 theo dạng a,b,c,d. Ví dụ: 3,3,2,5"
    },

    aes: {
        title: "AES",
        text: "Nhập một mật khẩu bất kỳ. CryptoJS sẽ tạo khóa từ mật khẩu."
    },

    des: {
        title: "DES",
        text: "Nhập một mật khẩu bất kỳ để sử dụng làm khóa DES."
    },

    rsa: {
        title: "RSA",
        text: "Hãy tạo cặp khóa RSA trước. Public Key dùng để mã hóa, Private Key dùng để giải mã."
    },

    md5: {
        title: "MD5",
        text: "MD5 là hàm băm một chiều, không có giải mã."
    },

    sha256: {
        title: "SHA-256",
        text: "SHA-256 là hàm băm một chiều, không có giải mã."
    }

};


// ======================================================
// HIỂN THỊ DANH SÁCH THUẬT TOÁN
// ======================================================

function updateAlgorithms() {

    algorithm.innerHTML = "";

    const list =
        algorithms[category.value];

    list.forEach(item => {

        const option =
            document.createElement("option");

        option.value = item[0];
        option.textContent = item[1];

        algorithm.appendChild(option);

    });

    updateInterface();

}


// ======================================================
// CẬP NHẬT GIAO DIỆN
// ======================================================

function updateInterface() {

    const type = category.value;
    const algo = algorithm.value;


    /*
    CLASSICAL
    */

    if (type === "classical") {

        alphabetGroup.style.display =
            "block";

        keyGroup.style.display =
            "block";

        rsaGroup.classList.add("hidden");

        encryptBtn.style.display =
            "block";

        decryptBtn.style.display =
            "block";

    }


    /*
    MODERN
    */

    else if (type === "modern") {

        alphabetGroup.style.display =
            "none";

        keyGroup.style.display =
            "block";

        rsaGroup.classList.add("hidden");

        encryptBtn.style.display =
            "block";

        decryptBtn.style.display =
            "block";

    }


    /*
    RSA
    */

    else if (type === "public") {

        alphabetGroup.style.display =
            "none";

        keyGroup.style.display =
            "none";

        rsaGroup.classList.remove("hidden");

        encryptBtn.style.display =
            "block";

        decryptBtn.style.display =
            "block";

    }


    /*
    HASH
    */

    else if (type === "hash") {

        alphabetGroup.style.display =
            "none";

        keyGroup.style.display =
            "none";

        rsaGroup.classList.add("hidden");

        encryptBtn.style.display =
            "block";

        decryptBtn.style.display =
            "none";

    }


    /*
    GUIDE
    */

    if (guides[algo]) {

        guideTitle.textContent =
            guides[algo].title;

        guideText.textContent =
            guides[algo].text;

    }


    /*
    PLACEHOLDER
    */

    switch (algo) {

        case "caesar":

            keyInput.placeholder =
                "Ví dụ: 3";

            break;

        case "substitution":

            keyInput.placeholder =
                "Ví dụ: zyxwvutsrqponmlkjihgfedcba";

            break;

        case "vigenere":

            keyInput.placeholder =
                "Ví dụ: CRYPTO";

            break;

        case "affine":

            keyInput.placeholder =
                "Ví dụ: 5,8";

            break;

        case "hill":

            keyInput.placeholder =
                "Ví dụ: 3,3,2,5";

            break;

        case "aes":

            keyInput.placeholder =
                "Ví dụ: my-secret-password";

            break;

        case "des":

            keyInput.placeholder =
                "Ví dụ: my-secret-password";

            break;

        default:

            keyInput.placeholder =
                "Nhập khóa...";

    }

}


// ======================================================
// TIỆN ÍCH
// ======================================================

function mod(n, m) {

    return ((n % m) + m) % m;

}


function gcd(a, b) {

    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {

        const temp = b;

        b = a % b;

        a = temp;

    }

    return a;

}


function modInverse(a, m) {

    a = mod(a, m);

    for (let x = 1; x < m; x++) {

        if (mod(a * x, m) === 1) {
            return x;
        }

    }

    return null;

}


function preserveCase(original, result) {

    if (original === original.toUpperCase()) {
        return result.toUpperCase();
    }

    return result;

}


// ======================================================
// CAESAR
// ======================================================

function caesar(text, key, decrypt = false) {

    const chars = getAlphabet();

    const shift =
        decrypt
            ? -Number(key)
            : Number(key);


    if (Number.isNaN(shift)) {

        throw new Error(
            "Khóa Caesar phải là số."
        );

    }


    return [...text].map(char => {

        const lower =
            char.toLowerCase();

        const index =
            chars.indexOf(lower);

        if (index === -1) {
            return char;
        }

        const newIndex =
            mod(
                index + shift,
                chars.length
            );

        return preserveCase(
            char,
            chars[newIndex]
        );

    }).join("");

}


// ======================================================
// SUBSTITUTION
// ======================================================

function substitution(
    text,
    key,
    decrypt = false
) {

    const chars =
        getAlphabet();

    const cleanKey =
        key.toLowerCase();


    if (cleanKey.length !== chars.length) {

        throw new Error(
            `Khóa phải có đúng ${chars.length} ký tự.`
        );

    }


    if (
        new Set(cleanKey).size !==
        chars.length
    ) {

        throw new Error(
            "Khóa phải chứa mỗi ký tự đúng một lần."
        );

    }


    for (const c of cleanKey) {

        if (!chars.includes(c)) {

            throw new Error(
                "Khóa chứa ký tự không thuộc bảng chữ cái."
            );

        }

    }


    const from =
        decrypt ? cleanKey : chars;

    const to =
        decrypt ? chars : cleanKey;


    return [...text].map(char => {

        const lower =
            char.toLowerCase();

        const index =
            from.indexOf(lower);

        if (index === -1) {
            return char;
        }

        return preserveCase(
            char,
            to[index]
        );

    }).join("");

}


// ======================================================
// VIGENERE
// ======================================================

function vigenere(
    text,
    key,
    decrypt = false
) {

    const chars =
        getAlphabet();

    const normalizedKey =
        key.toLowerCase();


    if (!normalizedKey) {

        throw new Error(
            "Vui lòng nhập khóa Vigenere."
        );

    }


    for (const c of normalizedKey) {

        if (!chars.includes(c)) {

            throw new Error(
                "Khóa Vigenere chứa ký tự không hợp lệ."
            );

        }

    }


    let keyIndex = 0;


    return [...text].map(char => {

        const lower =
            char.toLowerCase();

        const index =
            chars.indexOf(lower);

        if (index === -1) {
            return char;
        }


        const keyChar =
            normalizedKey[
                keyIndex %
                normalizedKey.length
            ];


        const keyValue =
            chars.indexOf(keyChar);


        let shift =
            decrypt
                ? -keyValue
                : keyValue;


        const result =
            chars[
                mod(
                    index + shift,
                    chars.length
                )
            ];


        keyIndex++;


        return preserveCase(
            char,
            result
        );

    }).join("");

}


// ======================================================
// AFFINE
// ======================================================

function affine(
    text,
    key,
    decrypt = false
) {

    const chars =
        getAlphabet();

    const m =
        chars.length;


    const parts =
        key.split(",")
           .map(v => Number(v.trim()));


    if (
        parts.length !== 2 ||
        parts.some(Number.isNaN)
    ) {

        throw new Error(
            "Khóa Affine phải có dạng a,b. Ví dụ: 5,8"
        );

    }


    const a =
        parts[0];

    const b =
        parts[1];


    if (gcd(a, m) !== 1) {

        throw new Error(
            `a phải nguyên tố cùng nhau với ${m}.`
        );

    }


    const inverse =
        modInverse(a, m);


    return [...text].map(char => {

        const lower =
            char.toLowerCase();

        const x =
            chars.indexOf(lower);

        if (x === -1) {
            return char;
        }


        let y;


        if (!decrypt) {

            y =
                mod(
                    a * x + b,
                    m
                );

        }

        else {

            y =
                mod(
                    inverse * (x - b),
                    m
                );

        }


        return preserveCase(
            char,
            chars[y]
        );

    }).join("");

}


// ======================================================
// HILL 2x2
// ======================================================

function hill(
    text,
    key,
    decrypt = false
) {

    const chars =
        getAlphabet();

    const m =
        chars.length;


    const nums =
        key.split(",")
           .map(v => Number(v.trim()));


    if (
        nums.length !== 4 ||
        nums.some(Number.isNaN)
    ) {

        throw new Error(
            "Khóa Hill phải có dạng a,b,c,d. Ví dụ: 3,3,2,5"
        );

    }


    let [a, b, c, d] = nums;


    const determinant =
        mod(
            a * d - b * c,
            m
        );


    const inverseDet =
        modInverse(
            determinant,
            m
        );


    if (inverseDet === null) {

        throw new Error(
            "Ma trận Hill không khả nghịch với bảng chữ cái hiện tại."
        );

    }


    if (decrypt) {

        const newA =
            d * inverseDet;

        const newB =
            -b * inverseDet;

        const newC =
            -c * inverseDet;

        const newD =
            a * inverseDet;


        a = newA;
        b = newB;
        c = newC;
        d = newD;

    }


    /*
    Chỉ lấy ký tự thuộc alphabet.
    */

    const charsOnly =
        [...text].filter(char =>
            chars.includes(
                char.toLowerCase()
            )
        );


    if (charsOnly.length === 0) {

        return "";

    }


    if (charsOnly.length % 2 !== 0) {

        charsOnly.push(
            "x"
        );

    }


    let result = "";


    for (
        let i = 0;
        i < charsOnly.length;
        i += 2
    ) {

        const x1 =
            chars.indexOf(
                charsOnly[i].toLowerCase()
            );

        const x2 =
            chars.indexOf(
                charsOnly[i + 1].toLowerCase()
            );


        const y1 =
            mod(
                a * x1 + b * x2,
                m
            );


        const y2 =
            mod(
                c * x1 + d * x2,
                m
            );


        result +=
            chars[y1] +
            chars[y2];

    }


    return result;

}


// ======================================================
// AES
// ======================================================

function aesEncrypt(text, key) {

    if (!key) {

        throw new Error(
            "Vui lòng nhập khóa AES."
        );

    }


    return CryptoJS.AES.encrypt(
        text,
        key
    ).toString();

}


function aesDecrypt(cipher, key) {

    if (!key) {

        throw new Error(
            "Vui lòng nhập khóa AES."
        );

    }


    const bytes =
        CryptoJS.AES.decrypt(
            cipher,
            key
        );


    const result =
        bytes.toString(
            CryptoJS.enc.Utf8
        );


    if (!result) {

        throw new Error(
            "Không thể giải mã AES. Kiểm tra khóa hoặc bản mã."
        );

    }


    return result;

}


// ======================================================
// DES
// ======================================================

function desEncrypt(text, key) {

    if (!key) {

        throw new Error(
            "Vui lòng nhập khóa DES."
        );

    }


    return CryptoJS.DES.encrypt(
        text,
        key
    ).toString();

}


function desDecrypt(cipher, key) {

    if (!key) {

        throw new Error(
            "Vui lòng nhập khóa DES."
        );

    }


    const bytes =
        CryptoJS.DES.decrypt(
            cipher,
            key
        );


    const result =
        bytes.toString(
            CryptoJS.enc.Utf8
        );


    if (!result) {

        throw new Error(
            "Không thể giải mã DES. Kiểm tra khóa hoặc bản mã."
        );

    }


    return result;

}


// ======================================================
// HASH
// ======================================================

function md5(text) {

    return CryptoJS.MD5(text)
        .toString();

}


function sha256(text) {

    return CryptoJS.SHA256(text)
        .toString();

}


// ======================================================
// RSA
// ======================================================

function generateRSAKeys() {

    try {

        const crypt =
            new JSEncrypt({
                default_key_size: 2048
            });


        crypt.getKey();


        publicKey.value =
            crypt.getPublicKey();


        privateKey.value =
            crypt.getPrivateKey();


        alert(
            "Đã tạo cặp khóa RSA 2048-bit."
        );

    }

    catch (error) {

        alert(
            "Không thể tạo khóa RSA."
        );

    }

}


function rsaEncrypt(text) {

    const key =
        publicKey.value.trim();


    if (!key) {

        throw new Error(
            "Vui lòng nhập hoặc tạo Public Key RSA."
        );

    }


    const crypt =
        new JSEncrypt();


    crypt.setPublicKey(key);


    const result =
        crypt.encrypt(text);


    if (!result) {

        throw new Error(
            "RSA không thể mã hóa dữ liệu. Với RSA 2048-bit, dữ liệu đầu vào quá dài cũng có thể gây lỗi."
        );

    }


    return result;

}


function rsaDecrypt(cipher) {

    const key =
        privateKey.value.trim();


    if (!key) {

        throw new Error(
            "Vui lòng nhập hoặc tạo Private Key RSA."
        );

    }


    const crypt =
        new JSEncrypt();


    crypt.setPrivateKey(key);


    const result =
        crypt.decrypt(cipher);


    if (!result) {

        throw new Error(
            "Không thể giải mã RSA. Kiểm tra Private Key hoặc bản mã."
        );

    }


    return result;

}


// ======================================================
// BIT
// ======================================================

function textToBits(text) {

    const bytes =
        new TextEncoder().encode(text);


    if (bytes.length === 0) {
        return "";
    }


    return Array.from(bytes)
        .map(byte =>
            byte
                .toString(2)
                .padStart(8, "0")
        )
        .join(" ");

}


// ======================================================
// HIỂN THỊ OUTPUT
// ======================================================

function showResult(result) {

    ciphertext.value =
        result;

    bitInfo.value =
        textToBits(result);

}


// ======================================================
// MÃ HÓA
// ======================================================

async function encrypt() {

    const text =
        plaintext.value;

    const algo =
        algorithm.value;


    if (!text) {

        alert(
            "Vui lòng nhập dữ liệu."
        );

        return;

    }


    try {

        let result;


        switch (algo) {

            // ----------------------------
            // CAESAR
            // ----------------------------

            case "caesar":

                result =
                    caesar(
                        text,
                        keyInput.value,
                        false
                    );

                break;


            // ----------------------------
            // SUBSTITUTION
            // ----------------------------

            case "substitution":

                result =
                    substitution(
                        text,
                        keyInput.value,
                        false
                    );

                break;


            // ----------------------------
            // VIGENERE
            // ----------------------------

            case "vigenere":

                result =
                    vigenere(
                        text,
                        keyInput.value,
                        false
                    );

                break;


            // ----------------------------
            // AFFINE
            // ----------------------------

            case "affine":

                result =
                    affine(
                        text,
                        keyInput.value,
                        false
                    );

                break;


            // ----------------------------
            // HILL
            // ----------------------------

            case "hill":

                result =
                    hill(
                        text,
                        keyInput.value,
                        false
                    );

                break;


            // ----------------------------
            // AES
            // ----------------------------

            case "aes":

                result =
                    aesEncrypt(
                        text,
                        keyInput.value
                    );

                break;


            // ----------------------------
            // DES
            // ----------------------------

            case "des":

                result =
                    desEncrypt(
                        text,
                        keyInput.value
                    );

                break;


            // ----------------------------
            // RSA
            // ----------------------------

            case "rsa":

                result =
                    rsaEncrypt(
                        text
                    );

                break;


            // ----------------------------
            // MD5
            // ----------------------------

            case "md5":

                result =
                    md5(text);

                break;


            // ----------------------------
            // SHA256
            // ----------------------------

            case "sha256":

                result =
                    sha256(text);

                break;


            default:

                throw new Error(
                    "Thuật toán không hợp lệ."
                );

        }


        showResult(result);

    }

    catch (error) {

        alert(
            error.message
        );

    }

}


// ======================================================
// GIẢI MÃ
// ======================================================

async function decrypt() {

    const text =
        plaintext.value;

    const algo =
        algorithm.value;


    if (!text) {

        alert(
            "Vui lòng nhập bản mã."
        );

        return;

    }


    try {

        let result;


        switch (algo) {

            // ----------------------------
            // CAESAR
            // ----------------------------

            case "caesar":

                result =
                    caesar(
                        text,
                        keyInput.value,
                        true
                    );

                break;


            // ----------------------------
            // SUBSTITUTION
            // ----------------------------

            case "substitution":

                result =
                    substitution(
                        text,
                        keyInput.value,
                        true
                    );

                break;


            // ----------------------------
            // VIGENERE
            // ----------------------------

            case "vigenere":

                result =
                    vigenere(
                        text,
                        keyInput.value,
                        true
                    );

                break;


            // ----------------------------
            // AFFINE
            // ----------------------------

            case "affine":

                result =
                    affine(
                        text,
                        keyInput.value,
                        true
                    );

                break;


            // ----------------------------
            // HILL
            // ----------------------------

            case "hill":

                result =
                    hill(
                        text,
                        keyInput.value,
                        true
                    );

                break;


            // ----------------------------
            // AES
            // ----------------------------

            case "aes":

                result =
                    aesDecrypt(
                        text,
                        keyInput.value
                    );

                break;


            // ----------------------------
            // DES
            // ----------------------------

            case "des":

                result =
                    desDecrypt(
                        text,
                        keyInput.value
                    );

                break;


            // ----------------------------
            // RSA
            // ----------------------------

            case "rsa":

                result =
                    rsaDecrypt(
                        text
                    );

                break;


            // ----------------------------
            // HASH
            // ----------------------------

            case "md5":
            case "sha256":

                throw new Error(
                    "MD5 và SHA-256 là hàm băm một chiều, không hỗ trợ giải mã."
                );


            default:

                throw new Error(
                    "Thuật toán không hợp lệ."
                );

        }


        showResult(result);

    }

    catch (error) {

        alert(
            error.message
        );

    }

}


// ======================================================
// XÓA
// ======================================================

function clearData() {

    plaintext.value = "";

    ciphertext.value = "";

    bitInfo.value = "";

    keyInput.value = "";

}


// ======================================================
// EVENTS
// ======================================================

category.addEventListener(
    "change",
    updateAlgorithms
);


algorithm.addEventListener(
    "change",
    updateInterface
);


alphabet.addEventListener(
    "change",
    updateInterface
);


encryptBtn.addEventListener(
    "click",
    encrypt
);


decryptBtn.addEventListener(
    "click",
    decrypt
);


clearBtn.addEventListener(
    "click",
    clearData
);


generateRSA.addEventListener(
    "click",
    generateRSAKeys
);


// ======================================================
// KHỞI TẠO
// ======================================================

updateAlgorithms();
