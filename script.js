// ======================================================
// LẤY ELEMENT
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


// ======================================================
// DANH SÁCH THUẬT TOÁN
// ======================================================

const algorithmList = {

    classical: [
        {
            value: "caesar",
            text: "Dịch vòng"
        },
        {
            value: "substitution",
            text: "Mã thay thế"
        },
        {
            value: "vigenere",
            text: "Vigenere"
        },
        {
            value: "affine",
            text: "Affine"
        },
        {
            value: "hill",
            text: "Hill"
        }
    ],

    modern: [
        {
            value: "aes",
            text: "AES"
        },
        {
            value: "des",
            text: "DES"
        }
    ],

    public: [
        {
            value: "rsa",
            text: "RSA"
        }
    ],

    hash: [
        {
            value: "md5",
            text: "MD5"
        },
        {
            value: "sha256",
            text: "SHA-256"
        }
    ]

};


// ======================================================
// HƯỚNG DẪN
// ======================================================

const guide = {

    caesar: [
        "Dịch vòng",
        "Khóa là một số nguyên. Ví dụ: 3"
    ],

    substitution: [
        "Mã thay thế",
        "Nhập bảng thay thế. Ví dụ ZYXWVUTSRQPONMLKJIHGFEDCBA"
    ],

    vigenere: [
        "Vigenere",
        "Nhập khóa dạng chữ. Ví dụ: CRYPTO"
    ],

    affine: [
        "Affine",
        "Nhập khóa theo dạng a,b. Ví dụ: 5,8"
    ],

    hill: [
        "Hill",
        "Nhập ma trận 2x2 theo dạng: 3,3,2,5"
    ],

    aes: [
        "AES",
        "AES yêu cầu khóa phù hợp với độ dài chuẩn của thuật toán."
    ],

    des: [
        "DES",
        "DES sử dụng khóa 8 byte."
    ],

    rsa: [
        "RSA",
        "RSA sử dụng cặp khóa công khai và bí mật."
    ],

    md5: [
        "MD5",
        "MD5 là hàm băm một chiều và không hỗ trợ giải mã."
    ],

    sha256: [
        "SHA-256",
        "SHA-256 là hàm băm một chiều và không hỗ trợ giải mã."
    ]

};


// ======================================================
// BẢNG CHỮ CÁI
// ======================================================

const alphabet29 =
    "aăâbcdđeêghiklmnoôơpqrstưvxy";

const alphabet26 =
    "abcdefghijklmnopqrstuvwxyz";


// ======================================================
// CẬP NHẬT DANH SÁCH THUẬT TOÁN
// ======================================================

function updateAlgorithms() {

    const type = category.value;

    algorithm.innerHTML = "";

    algorithmList[type].forEach(item => {

        const option = document.createElement("option");

        option.value = item.value;
        option.textContent = item.text;

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

    // HASH
    if (type === "hash") {

        keyGroup.style.display = "none";

        alphabetGroup.style.display = "none";

        decryptBtn.style.display = "none";

    }

    // MODERN
    else if (type === "modern") {

        keyGroup.style.display = "block";

        alphabetGroup.style.display = "none";

        decryptBtn.style.display = "block";

    }

    // PUBLIC KEY
    else if (type === "public") {

        keyGroup.style.display = "block";

        alphabetGroup.style.display = "none";

        decryptBtn.style.display = "block";

    }

    // CLASSICAL
    else {

        keyGroup.style.display = "block";

        alphabetGroup.style.display = "block";

        decryptBtn.style.display = "block";

    }


    // HƯỚNG DẪN

    if (guide[algo]) {

        guideTitle.textContent =
            guide[algo][0];

        guideText.textContent =
            guide[algo][1];

    }


    // PLACEHOLDER KHÓA

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

        default:

            keyInput.placeholder =
                "Nhập khóa...";

    }

}


// ======================================================
// XỬ LÝ CHỮ CÁI
// ======================================================

function getAlphabet() {

    return alphabet.value === "29"
        ? alphabet29
        : alphabet26;

}


function normalizeChar(char) {

    return char.toLowerCase();

}


// ======================================================
// CAESAR
// ======================================================

function caesarEncrypt(text, key) {

    const chars = getAlphabet();

    key = Number(key);

    return [...text].map(char => {

        const lower = char.toLowerCase();

        const index = chars.indexOf(lower);

        if (index === -1) {
            return char;
        }

        let newIndex =
            (index + key) % chars.length;

        if (newIndex < 0) {
            newIndex += chars.length;
        }

        const result = chars[newIndex];

        return char === char.toUpperCase()
            ? result.toUpperCase()
            : result;

    }).join("");

}


function caesarDecrypt(text, key) {

    return caesarEncrypt(text, -Number(key));

}


// ======================================================
// VIGENERE
// ======================================================

function vigenere(text, key, decrypt = false) {

    const chars = getAlphabet();

    key = key.toLowerCase();

    let keyIndex = 0;

    return [...text].map(char => {

        const lower = char.toLowerCase();

        const index =
            chars.indexOf(lower);

        if (index === -1) {
            return char;
        }

        const keyChar =
            key[keyIndex % key.length];

        const keyValue =
            chars.indexOf(keyChar);

        if (keyValue === -1) {
            return char;
        }

        let shift = decrypt
            ? -keyValue
            : keyValue;

        let newIndex =
            (index + shift) % chars.length;

        if (newIndex < 0) {
            newIndex += chars.length;
        }

        keyIndex++;

        const result =
            chars[newIndex];

        return char === char.toUpperCase()
            ? result.toUpperCase()
            : result;

    }).join("");

}


// ======================================================
// SUBSTITUTION
// ======================================================

function substitution(text, key, decrypt = false) {

    const chars = getAlphabet();

    key = key.toLowerCase();

    if (key.length !== chars.length) {

        throw new Error(
            `Khóa phải có ${chars.length} ký tự.`
        );

    }


    const unique =
        new Set(key).size;

    if (unique !== chars.length) {

        throw new Error(
            "Bảng thay thế không được chứa ký tự trùng."
        );

    }


    let from = chars;
    let to = key;

    if (decrypt) {

        from = key;
        to = chars;

    }


    return [...text].map(char => {

        const lower =
            char.toLowerCase();

        const index =
            from.indexOf(lower);

        if (index === -1) {
            return char;
        }

        const result =
            to[index];

        return char === char.toUpperCase()
            ? result.toUpperCase()
            : result;

    }).join("");

}


// ======================================================
// AFFINE
// ======================================================

function gcd(a, b) {

    while (b !== 0) {

        const temp = b;

        b = a % b;

        a = temp;

    }

    return Math.abs(a);

}


function modInverse(a, m) {

    a = ((a % m) + m) % m;

    for (let x = 1; x < m; x++) {

        if ((a * x) % m === 1) {
            return x;
        }

    }

    return null;

}


function affine(text, key, decrypt = false) {

    const chars = getAlphabet();

    const parts =
        key.split(",").map(Number);

    if (parts.length !== 2 ||
        parts.some(Number.isNaN)) {

        throw new Error(
            "Khóa Affine phải có dạng a,b. Ví dụ: 5,8"
        );

    }


    let [a, b] = parts;

    const m = chars.length;


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
                (a * x + b) % m;

        } else {

            y =
                inverse * (x - b);

            y =
                ((y % m) + m) % m;

        }


        const result =
            chars[y];

        return char === char.toUpperCase()
            ? result.toUpperCase()
            : result;

    }).join("");

}


// ======================================================
// HILL 2x2
// ======================================================

function hill(text, key, decrypt = false) {

    const chars = getAlphabet();

    const m = chars.length;

    const nums =
        key.split(",").map(Number);


    if (
        nums.length !== 4 ||
        nums.some(Number.isNaN)
    ) {

        throw new Error(
            "Khóa Hill phải có dạng: 3,3,2,5"
        );

    }


    let [a, b, c, d] = nums;


    let det =
        a * d - b * c;

    det =
        ((det % m) + m) % m;


    const invDet =
        modInverse(det, m);


    if (invDet === null) {

        throw new Error(
            "Ma trận Hill không khả nghịch."
        );

    }


    if (decrypt) {

        const tempA = d;
        const tempD = a;

        a = tempA;
        d = tempD;

        b = -b;
        c = -c;

        a = a * invDet;
        b = b * invDet;
        c = c * invDet;
        d = d * invDet;

    }


    let cleanText = text;


    // giữ ký tự không thuộc alphabet
    // nhưng Hill xử lý từng cặp ký tự

    const charsOnly =
        [...cleanText].filter(char =>
            chars.includes(char.toLowerCase())
        );


    if (charsOnly.length % 2 !== 0) {
        charsOnly.push(
            charsOnly[charsOnly.length - 1] || "x"
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
            ((a * x1 + b * x2) % m + m) % m;

        const y2 =
            ((c * x1 + d * x2) % m + m) % m;


        result +=
            chars[y1] +
            chars[y2];

    }


    return result;

}


// ======================================================
// SHA-256
// ======================================================

async function sha256(text) {

    const encoder =
        new TextEncoder();

    const data =
        encoder.encode(text);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );

    return hashArray
        .map(byte =>
            byte.toString(16).padStart(2, "0")
        )
        .join("");

}


// ======================================================
// MD5
// ======================================================

function md5(text) {

    // MD5 đơn giản dùng thư viện nội bộ.
    // Không dùng cho bảo mật thực tế.

    function rotateLeft(lValue, iShiftBits) {

        return (
            lValue << iShiftBits
        ) |
        (
            lValue >>> (32 - iShiftBits)
        );

    }


    function addUnsigned(lX, lY) {

        const lX4 =
            lX & 0x40000000;

        const lY4 =
            lY & 0x40000000;

        const lX8 =
            lX & 0x80000000;

        const lY8 =
            lY & 0x80000000;

        const lResult =
            (lX & 0x3fffffff)
            +
            (lY & 0x3fffffff);

        if (lX4 & lY4) {

            return lResult ^ 0x80000000 ^
                lX8 ^ lY8;

        }

        if (lX4 | lY4) {

            if (lResult & 0x40000000) {

                return lResult ^
                    0xc0000000 ^
                    lX8 ^
                    lY8;

            }

            return lResult ^
                0x40000000 ^
                lX8 ^
                lY8;

        }

        return lResult ^
            lX8 ^
            lY8;

    }


    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }

    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }

    function H(x, y, z) {
        return x ^ y ^ z;
    }

    function I(x, y, z) {
        return y ^ (x | (~z));
    }


    function FF(a,b,c,d,x,s,ac) {

        a = addUnsigned(
            a,
            addUnsigned(
                addUnsigned(
                    F(b,c,d),
                    x
                ),
                ac
            )
        );

        return addUnsigned(
            rotateLeft(a,s),
            b
        );

    }


    function GG(a,b,c,d,x,s,ac) {

        a = addUnsigned(
            a,
            addUnsigned(
                addUnsigned(
                    G(b,c,d),
                    x
                ),
                ac
            )
        );

        return addUnsigned(
            rotateLeft(a,s),
            b
        );

    }


    function HH(a,b,c,d,x,s,ac) {

        a = addUnsigned(
            a,
            addUnsigned(
                addUnsigned(
                    H(b,c,d),
                    x
                ),
                ac
            )
        );

        return addUnsigned(
            rotateLeft(a,s),
            b
        );

    }


    function II(a,b,c,d,x,s,ac) {

        a = addUnsigned(
            a,
            addUnsigned(
                addUnsigned(
                    I(b,c,d),
                    x
                ),
                ac
            )
        );

        return addUnsigned(
            rotateLeft(a,s),
            b
        );

    }


    function convertToWordArray(string) {

        const msg =
            unescape(
                encodeURIComponent(string)
            );

        const msgLength =
            msg.length;

        const numberOfWords =
            (((msgLength + 8) >>> 6) + 1)
            * 16;

        const wordArray =
            new Array(numberOfWords - 1);

        let byteCount = 0;

        while (byteCount < msgLength) {

            wordArray[byteCount >> 2] |=
                (
                    msg.charCodeAt(byteCount)
                    &
                    0xff
                )
                <<
                (
                    (byteCount % 4) * 8
                );

            byteCount++;

        }


        wordArray[byteCount >> 2] |=
            0x80 <<
            (
                (byteCount % 4) * 8
            );


        wordArray[numberOfWords - 2] =
            msgLength << 3;

        wordArray[numberOfWords - 1] =
            msgLength >>> 29;


        return wordArray;

    }


    function wordToHex(lValue) {

        let wordToHexValue = "";

        for (let i = 0; i <= 3; i++) {

            const byte =
                (lValue >> (i * 8)) & 255;

            wordToHexValue +=
                ("0" +
                    byte.toString(16)
                ).slice(-2);

        }

        return wordToHexValue;

    }


    let x =
        convertToWordArray(text);

    let a = 0x67452301;
    let b = 0xefcdab89;
    let c = 0x98badcfe;
    let d = 0x10325476;


    for (
        let k = 0;
        k < x.length;
        k += 16
    ) {

        const AA = a;
        const BB = b;
        const CC = c;
        const DD = d;


        a = FF(a,b,c,d,x[k+0],7,0xd76aa478);
        d = FF(d,a,b,c,x[k+1],12,0xe8c7b756);
        c = FF(c,d,a,b,x[k+2],17,0x242070db);
        b = FF(b,c,d,a,x[k+3],22,0xc1bdceee);

        a = FF(a,b,c,d,x[k+4],7,0xf57c0faf);
        d = FF(d,a,b,c,x[k+5],12,0x4787c62a);
        c = FF(c,d,a,b,x[k+6],17,0xa8304613);
        b = FF(b,c,d,a,x[k+7],22,0xfd469501);

        a = FF(a,b,c,d,x[k+8],7,0x698098d8);
        d = FF(d,a,b,c,x[k+9],12,0x8b44f7af);
        c = FF(c,d,a,b,x[k+10],17,0xffff5bb1);
        b = FF(b,c,d,a,x[k+11],22,0x895cd7be);

        a = FF(a,b,c,d,x[k+12],7,0x6b901122);
        d = FF(d,a,b,c,x[k+13],12,0xfd987193);
        c = FF(c,d,a,b,x[k+14],17,0xa679438e);
        b = FF(b,c,d,a,x[k+15],22,0x49b40821);


        a = GG(a,b,c,d,x[k+1],5,0xf61e2562);
        d = GG(d,a,b,c,x[k+6],9,0xc040b340);
        c = GG(c,d,a,b,x[k+11],14,0x265e5a51);
        b = GG(b,c,d,a,x[k+0],20,0xe9b6c7aa);

        a = GG(a,b,c,d,x[k+5],5,0xd62f105d);
        d = GG(d,a,b,c,x[k+10],9,0x02441453);
        c = GG(c,d,a,b,x[k+15],14,0xd8a1e681);
        b = GG(b,c,d,a,x[k+4],20,0xe7d3fbc8);

        a = GG(a,b,c,d,x[k+9],5,0x21e1cde6);
        d = GG(d,a,b,c,x[k+14],9,0xc33707d6);
        c = GG(c,d,a,b,x[k+3],14,0xf4d50d87);
        b = GG(b,c,d,a,x[k+8],20,0x455a14ed);

        a = GG(a,b,c,d,x[k+13],5,0xa9e3e905);
        d = GG(d,a,b,c,x[k+2],9,0xfcefa3f8);
        c = GG(c,d,a,b,x[k+7],14,0x676f02d9);
        b = GG(b,c,d,a,x[k+12],20,0x8d2a4c8a);


        a = HH(a,b,c,d,x[k+5],4,0xfffa3942);
        d = HH(d,a,b,c,x[k+8],11,0x8771f681);
        c = HH(c,d,a,b,x[k+11],16,0x6d9d6122);
        b = HH(b,c,d,a,x[k+14],23,0xfde5380c);

        a = HH(a,b,c,d,x[k+1],4,0xa4beea44);
        d = HH(d,a,b,c,x[k+4],11,0x4bdecfa9);
        c = HH(c,d,a,b,x[k+7],16,0xf6bb4b60);
        b = HH(b,c,d,a,x[k+10],23,0xbebfbc70);

        a = HH(a,b,c,d,x[k+13],4,0x289b7ec6);
        d = HH(d,a,b,c,x[k+0],11,0xeaa127fa);
        c = HH(c,d,a,b,x[k+3],16,0xd4ef3085);
        b = HH(b,c,d,a,x[k+6],23,0x04881d05);

        a = HH(a,b,c,d,x[k+9],4,0xd9d4d039);
        d = HH(d,a,b,c,x[k+12],11,0xe6db99e5);
        c = HH(c,d,a,b,x[k+15],16,0x1fa27cf8);
        b = HH(b,c,d,a,x[k+2],23,0xc4ac5665);


        a = II(a,b,c,d,x[k+0],6,0xf4292244);
        d = II(d,a,b,c,x[k+7],10,0x432aff97);
        c = II(c,d,a,b,x[k+14],15,0xab9423a7);
        b = II(b,c,d,a,x[k+5],21,0xfc93a039);

        a = II(a,b,c,d,x[k+12],6,0x655b59c3);
        d = II(d,a,b,c,x[k+3],10,0x8f0ccc92);
        c = II(c,d,a,b,x[k+10],15,0xffeff47d);
        b = II(b,c,d,a,x[k+1],21,0x85845dd1);

        a = II(a,b,c,d,x[k+8],6,0x6fa87e4f);
        d = II(d,a,b,c,x[k+15],10,0xfe2ce6e0);
        c = II(c,d,a,b,x[k+6],15,0xa3014314);
        b = II(b,c,d,a,x[k+13],21,0x4e0811a1);

        a = II(a,b,c,d,x[k+4],6,0xf7537e82);
        d = II(d,a,b,c,x[k+11],10,0xbd3af235);
        c = II(c,d,a,b,x[k+2],15,0x2ad7d2bb);
        b = II(b,c,d,a,x[k+9],21,0xeb86d391);


        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);

    }


    return (
        wordToHex(a) +
        wordToHex(b) +
        wordToHex(c) +
        wordToHex(d)
    ).toLowerCase();

}


// ======================================================
// CHUYỂN SANG BIT
// ======================================================

function textToBits(text) {

    return [...new TextEncoder().encode(text)]
        .map(byte =>
            byte
                .toString(2)
                .padStart(8, "0")
        )
        .join(" ");

}


// ======================================================
// XỬ LÝ MÃ HÓA
// ======================================================

async function encrypt() {

    const text = plaintext.value;

    const algo = algorithm.value;

    if (!text) {

        alert("Vui lòng nhập dữ liệu.");

        return;

    }


    try {

        let result;


        switch (algo) {

            case "caesar":

                if (
                    keyInput.value.trim() === "" ||
                    isNaN(Number(keyInput.value))
                ) {

                    throw new Error(
                        "Khóa Caesar phải là số."
                    );

                }

                result =
                    caesarEncrypt(
                        text,
                        Number(keyInput.value)
                    );

                break;


            case "substitution":

                result =
                    substitution(
                        text,
                        keyInput.value,
                        false
                    );

                break;


            case "vigenere":

                if (!keyInput.value) {

                    throw new Error(
                        "Vui lòng nhập khóa Vigenere."
                    );

                }

                result =
                    vigenere(
                        text,
                        keyInput.value,
                        false
                    );

                break;


            case "affine":

                result =
                    affine(
                        text,
                        keyInput.value,
                        false
                    );

                break;


            case "hill":

                result =
                    hill(
                        text,
                        keyInput.value,
                        false
                    );

                break;


            case "sha256":

                result =
                    await sha256(text);

                break;


            case "md5":

                result =
                    md5(text);

                break;


            case "aes":

                throw new Error(
                    "AES chưa được triển khai trong phiên bản này."
                );


            case "des":

                throw new Error(
                    "DES chưa được triển khai trong phiên bản này."
                );


            case "rsa":

                throw new Error(
                    "RSA chưa được triển khai trong phiên bản này."
                );


            default:

                throw new Error(
                    "Thuật toán không hợp lệ."
                );

        }


        ciphertext.value = result;

        bitInfo.value =
            textToBits(result);

    }
    catch (error) {

        alert(error.message);

    }

}


// ======================================================
// GIẢI MÃ
// ======================================================

async function decrypt() {

    const text = plaintext.value;

    const algo = algorithm.value;

    if (!text) {

        alert("Vui lòng nhập dữ liệu.");

        return;

    }


    try {

        let result;


        switch (algo) {

            case "caesar":

                result =
                    caesarDecrypt(
                        text,
                        Number(keyInput.value)
                    );

                break;


            case "substitution":

                result =
                    substitution(
                        text,
                        keyInput.value,
                        true
                    );

                break;


            case "vigenere":

                result =
                    vigenere(
                        text,
                        keyInput.value,
                        true
                    );

                break;


            case "affine":

                result =
                    affine(
                        text,
                        keyInput.value,
                        true
                    );

                break;


            case "hill":

                result =
                    hill(
                        text,
                        keyInput.value,
                        true
                    );

                break;


            case "sha256":
            case "md5":

                throw new Error(
                    "Hàm băm không hỗ trợ giải mã."
                );


            case "aes":
            case "des":
            case "rsa":

                throw new Error(
                    "Thuật toán này chưa được triển khai."
                );


            default:

                throw new Error(
                    "Thuật toán không hợp lệ."
                );

        }


        ciphertext.value = result;

        bitInfo.value =
            textToBits(result);

    }
    catch (error) {

        alert(error.message);

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


// ======================================================
// KHỞI TẠO
// ======================================================

updateAlgorithms();
