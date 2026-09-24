const alphabet26 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabet29 = "AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY";

function getAlphabet(number) {
    return number === 26 ? alphabet26 : alphabet29;
}

function updateAlgorithmUI() {
    const algorithm = document.getElementById("algorithm").value;
    const alphabetGroup = document.getElementById("alphabetGroup");
    const key = document.getElementById("key");
    const plaintext = document.getElementById("plaintext");

    if (algorithm === "des") {
        alphabetGroup.style.display = "none";

        key.placeholder = "16 ký tự Hex";
        plaintext.placeholder = "16 ký tự Hex";

        if (
            key.value === "" ||
            key.value === "3" ||
            key.value === "5" ||
            key.value === "AABB09182736CCDD"
        ) {
            key.value = "AABB09182736CCDD";
        }

        if (plaintext.value === "") {
            plaintext.value = "123456ABCD132536";
        }

        updateGuide();
    } else {
        alphabetGroup.style.display = "block";
        key.placeholder = "Nhập khóa...";
        plaintext.placeholder = "Nhập bản rõ...";
        updateGuide();
    }
}

function updateGuide() {
    const algorithm = document.getElementById("algorithm").value;
    const guideTitle = document.getElementById("guideTitle");
    const guideText = document.getElementById("guideText");

    if (algorithm === "caesar") {
        guideTitle.textContent = "Dịch vòng";
        guideText.textContent = "Khóa phải là số nguyên. Ví dụ: 3";
    }

    if (algorithm === "substitution") {
        guideTitle.textContent = "Mã thay thế";
        guideText.textContent = "Khóa phải có đúng số ký tự bằng bảng chữ cái";
    }

    if (algorithm === "vigenere") {
        guideTitle.textContent = "Vigenere";
        guideText.textContent = "Khóa là một chuỗi ký tự trong bảng chữ cái";
    }

    if (algorithm === "affine") {
        guideTitle.textContent = "Affine";
        guideText.textContent = "Nhập khóa theo dạng a,b. Ví dụ: 5,8";
    }

    if (algorithm === "hill") {
        guideTitle.textContent = "Hill";
        guideText.textContent = "Nhập khóa theo dạng a,b,c,d. Ví dụ: 3,3,2,5";
    }

    if (algorithm === "des") {
        guideTitle.textContent = "DES";
        guideText.textContent = "Bản rõ và khóa phải là 16 ký tự Hex. Ví dụ: 123456ABCD132536";
    }
}

function encrypt() {
    const text = document.getElementById("plaintext").value;
    const key = document.getElementById("key").value.trim();
    const algorithm = document.getElementById("algorithm").value;
    const alphabetNumber = parseInt(
        document.getElementById("alphabet").value
    );

    if (text === "") {
        alert("Vui lòng nhập bản rõ!");
        return;
    }

    if (key === "") {
        alert("Vui lòng nhập khóa!");
        return;
    }

    if (algorithm === "des") {
        const result = desEncrypt(text, key);

        if (result !== null) {
            document.getElementById("ciphertext").value = result;
        }

        return;
    }

    if (algorithm === "caesar") {
        const number = parseInt(key);

        if (isNaN(number)) {
            alert("Khóa Dịch vòng phải là số!");
            return;
        }

        document.getElementById("ciphertext").value =
            caesarEncrypt(text, number, alphabetNumber);
    }

    if (algorithm === "substitution") {
        document.getElementById("ciphertext").value =
            substitutionEncrypt(text, key, alphabetNumber);
    }

    if (algorithm === "vigenere") {
        document.getElementById("ciphertext").value =
            vigenereEncrypt(text, key, alphabetNumber);
    }

    if (algorithm === "affine") {
        const numbers = key.split(",");

        if (numbers.length !== 2) {
            alert("Khóa Affine nhập dạng a,b. Ví dụ: 5,8");
            return;
        }

        const a = parseInt(numbers[0]);
        const b = parseInt(numbers[1]);

        if (isNaN(a) || isNaN(b)) {
            alert("Khóa Affine phải là số!");
            return;
        }

        document.getElementById("ciphertext").value =
            affineEncrypt(text, a, b, alphabetNumber);
    }

    if (algorithm === "hill") {
        document.getElementById("ciphertext").value =
            hillEncrypt(text, key, alphabetNumber);
    }
}

function decrypt() {
    const text = document.getElementById("ciphertext").value;
    const key = document.getElementById("key").value.trim();
    const algorithm = document.getElementById("algorithm").value;
    const alphabetNumber = parseInt(
        document.getElementById("alphabet").value
    );

    if (text === "") {
        alert("Vui lòng nhập bản mã!");
        return;
    }

    if (key === "") {
        alert("Vui lòng nhập khóa!");
        return;
    }

    if (algorithm === "des") {
        const result = desDecrypt(text, key);

        if (result !== null) {
            document.getElementById("plaintext").value = result;
        }

        return;
    }

    if (algorithm === "caesar") {
        const number = parseInt(key);

        if (isNaN(number)) {
            alert("Khóa Dịch vòng phải là số!");
            return;
        }

        document.getElementById("plaintext").value =
            caesarDecrypt(text, number, alphabetNumber);
    }

    if (algorithm === "substitution") {
        document.getElementById("plaintext").value =
            substitutionDecrypt(text, key, alphabetNumber);
    }

    if (algorithm === "vigenere") {
        document.getElementById("plaintext").value =
            vigenereDecrypt(text, key, alphabetNumber);
    }

    if (algorithm === "affine") {
        const numbers = key.split(",");

        if (numbers.length !== 2) {
            alert("Khóa Affine nhập dạng a,b. Ví dụ: 5,8");
            return;
        }

        const a = parseInt(numbers[0]);
        const b = parseInt(numbers[1]);

        if (isNaN(a) || isNaN(b)) {
            alert("Khóa Affine phải là số!");
            return;
        }

        document.getElementById("plaintext").value =
            affineDecrypt(text, a, b, alphabetNumber);
    }

    if (algorithm === "hill") {
        document.getElementById("plaintext").value =
            hillDecrypt(text, key, alphabetNumber);
    }
}

function clearData() {
    document.getElementById("plaintext").value = "";
    document.getElementById("ciphertext").value = "";
}

function caesarEncrypt(text, key, alphabetNumber) {
    const alphabet = getAlphabet(alphabetNumber);
    let result = "";

    key = ((key % alphabet.length) + alphabet.length) % alphabet.length;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const upperChar = char.toUpperCase();
        const position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
            continue;
        }

        const newPosition = (position + key) % alphabet.length;
        let newChar = alphabet[newPosition];

        if (char === char.toLowerCase()) {
            newChar = newChar.toLowerCase();
        }

        result += newChar;
    }

    return result;
}

function caesarDecrypt(text, key, alphabetNumber) {
    return caesarEncrypt(text, -key, alphabetNumber);
}

function substitutionEncrypt(text, key, alphabetNumber) {
    const alphabet = getAlphabet(alphabetNumber);
    const substitutionKey = key.toUpperCase();
    let result = "";

    if (substitutionKey.length !== alphabet.length) {
        alert(
            "Khóa Mã thay thế phải có đúng " +
            alphabet.length +
            " ký tự!"
        );
        return "";
    }

    if (new Set(substitutionKey).size !== alphabet.length) {
        alert("Khóa Mã thay thế không được có ký tự trùng nhau!");
        return "";
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const upperChar = char.toUpperCase();
        const position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
            continue;
        }

        let newChar = substitutionKey[position];

        if (char === char.toLowerCase()) {
            newChar = newChar.toLowerCase();
        }

        result += newChar;
    }

    return result;
}

function substitutionDecrypt(text, key, alphabetNumber) {
    const alphabet = getAlphabet(alphabetNumber);
    const substitutionKey = key.toUpperCase();
    let result = "";

    if (substitutionKey.length !== alphabet.length) {
        alert(
            "Khóa Mã thay thế phải có đúng " +
            alphabet.length +
            " ký tự!"
        );
        return "";
    }

    if (new Set(substitutionKey).size !== alphabet.length) {
        alert("Khóa Mã thay thế không được có ký tự trùng nhau!");
        return "";
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const upperChar = char.toUpperCase();
        const position = substitutionKey.indexOf(upperChar);

        if (position === -1) {
            result += char;
            continue;
        }

        let newChar = alphabet[position];

        if (char === char.toLowerCase()) {
            newChar = newChar.toLowerCase();
        }

        result += newChar;
    }

    return result;
}

function getValidKeyPositions(key, alphabet) {
    const positions = [];

    for (let i = 0; i < key.length; i++) {
        const position = alphabet.indexOf(key[i].toUpperCase());

        if (position !== -1) {
            positions.push(position);
        }
    }

    return positions;
}

function vigenereEncrypt(text, key, alphabetNumber) {
    const alphabet = getAlphabet(alphabetNumber);
    const keyPositions = getValidKeyPositions(key, alphabet);
    let result = "";
    let keyIndex = 0;

    if (keyPositions.length === 0) {
        alert("Khóa Vigenere không hợp lệ!");
        return "";
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const upperChar = char.toUpperCase();
        const position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
            continue;
        }

        const keyPosition =
            keyPositions[keyIndex % keyPositions.length];

        const newPosition =
            (position + keyPosition) % alphabet.length;

        let newChar = alphabet[newPosition];

        if (char === char.toLowerCase()) {
            newChar = newChar.toLowerCase();
        }

        result += newChar;
        keyIndex++;
    }

    return result;
}

function vigenereDecrypt(text, key, alphabetNumber) {
    const alphabet = getAlphabet(alphabetNumber);
    const keyPositions = getValidKeyPositions(key, alphabet);
    let result = "";
    let keyIndex = 0;

    if (keyPositions.length === 0) {
        alert("Khóa Vigenere không hợp lệ!");
        return "";
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const upperChar = char.toUpperCase();
        const position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
            continue;
        }

        const keyPosition =
            keyPositions[keyIndex % keyPositions.length];

        const newPosition =
            (position - keyPosition + alphabet.length) %
            alphabet.length;

        let newChar = alphabet[newPosition];

        if (char === char.toLowerCase()) {
            newChar = newChar.toLowerCase();
        }

        result += newChar;
        keyIndex++;
    }

    return result;
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {
        const temp = a % b;
        a = b;
        b = temp;
    }

    return a;
}

function modInverse(a, m) {
    a = ((a % m) + m) % m;

    for (let i = 1; i < m; i++) {
        if ((a * i) % m === 1) {
            return i;
        }
    }

    return -1;
}

function affineEncrypt(text, a, b, alphabetNumber) {
    const alphabet = getAlphabet(alphabetNumber);
    let result = "";

    if (gcd(a, alphabet.length) !== 1) {
        alert(
            "Giá trị a không hợp lệ. a phải nguyên tố cùng nhau với " +
            alphabet.length
        );
        return "";
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const upperChar = char.toUpperCase();
        const position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
            continue;
        }

        const newPosition =
            ((a * position + b) % alphabet.length +
                alphabet.length) %
            alphabet.length;

        let newChar = alphabet[newPosition];

        if (char === char.toLowerCase()) {
            newChar = newChar.toLowerCase();
        }

        result += newChar;
    }

    return result;
}

function affineDecrypt(text, a, b, alphabetNumber) {
    const alphabet = getAlphabet(alphabetNumber);
    const inverse = modInverse(a, alphabet.length);
    let result = "";

    if (inverse === -1) {
        alert("Không tìm được nghịch đảo của a!");
        return "";
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const upperChar = char.toUpperCase();
        const position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
            continue;
        }

        const newPosition =
            ((inverse * (position - b)) % alphabet.length +
                alphabet.length) %
            alphabet.length;

        let newChar = alphabet[newPosition];

        if (char === char.toLowerCase()) {
            newChar = newChar.toLowerCase();
        }

        result += newChar;
    }

    return result;
}

function hillEncrypt(text, key, alphabetNumber) {
    const alphabet = getAlphabet(alphabetNumber);
    const numbers = key.split(",").map(Number);

    if (numbers.length !== 4 || numbers.some(isNaN)) {
        alert("Khóa Hill nhập dạng a,b,c,d. Ví dụ: 3,3,2,5");
        return "";
    }

    const a = numbers[0];
    const b = numbers[1];
    const c = numbers[2];
    const d = numbers[3];

    const determinant = a * d - b * c;

    if (gcd(determinant, alphabet.length) !== 1) {
        alert("Ma trận khóa Hill không khả nghịch!");
        return "";
    }

    let cleanText = "";

    for (let i = 0; i < text.length; i++) {
        const char = text[i].toUpperCase();

        if (alphabet.indexOf(char) !== -1) {
            cleanText += char;
        }
    }

    if (cleanText.length % 2 !== 0) {
        cleanText += alphabet[0];
    }

    let result = "";

    for (let i = 0; i < cleanText.length; i += 2) {
        const x1 = alphabet.indexOf(cleanText[i]);
        const x2 = alphabet.indexOf(cleanText[i + 1]);

        const y1 =
            ((a * x1 + b * x2) % alphabet.length +
                alphabet.length) %
            alphabet.length;

        const y2 =
            ((c * x1 + d * x2) % alphabet.length +
                alphabet.length) %
            alphabet.length;

        result += alphabet[y1];
        result += alphabet[y2];
    }

    return result;
}

function hillDecrypt(text, key, alphabetNumber) {
    const alphabet = getAlphabet(alphabetNumber);
    const numbers = key.split(",").map(Number);

    if (numbers.length !== 4 || numbers.some(isNaN)) {
        alert("Khóa Hill nhập dạng a,b,c,d. Ví dụ: 3,3,2,5");
        return "";
    }

    const a = numbers[0];
    const b = numbers[1];
    const c = numbers[2];
    const d = numbers[3];

    const determinant = a * d - b * c;
    const inverseDeterminant =
        modInverse(determinant, alphabet.length);

    if (inverseDeterminant === -1) {
        alert("Ma trận khóa Hill không khả nghịch!");
        return "";
    }

    const newA = d * inverseDeterminant;
    const newB = -b * inverseDeterminant;
    const newC = -c * inverseDeterminant;
    const newD = a * inverseDeterminant;

    let cleanText = "";

    for (let i = 0; i < text.length; i++) {
        const char = text[i].toUpperCase();

        if (alphabet.indexOf(char) !== -1) {
            cleanText += char;
        }
    }

    if (cleanText.length % 2 !== 0) {
        cleanText += alphabet[0];
    }

    let result = "";

    for (let i = 0; i < cleanText.length; i += 2) {
        const x1 = alphabet.indexOf(cleanText[i]);
        const x2 = alphabet.indexOf(cleanText[i + 1]);

        const y1 =
            ((newA * x1 + newB * x2) % alphabet.length +
                alphabet.length) %
            alphabet.length;

        const y2 =
            ((newC * x1 + newD * x2) % alphabet.length +
                alphabet.length) %
            alphabet.length;

        result += alphabet[y1];
        result += alphabet[y2];
    }

    return result;
}

const DES_IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
];

const DES_FP = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
];

const DES_E = [
    32, 1, 2, 3, 4, 5,
    4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29,
    28, 29, 30, 31, 32, 1
];

const DES_P = [
    16, 7, 20, 21,
    29, 12, 28, 17,
    1, 15, 23, 26,
    5, 18, 31, 10,
    2, 8, 24, 14,
    32, 27, 3, 9,
    19, 13, 30, 6,
    22, 11, 4, 25
];

const DES_PC1 = [
    57, 49, 41, 33, 25, 17, 9,
    1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27,
    19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4
];

const DES_PC2 = [
    14, 17, 11, 24, 1, 5,
    3, 28, 15, 6, 21, 10,
    23, 19, 12, 4, 26, 8,
    16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55,
    30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53,
    46, 42, 50, 36, 29, 32
];

const DES_SHIFTS = [
    1, 1, 2, 2, 2, 2, 2, 2,
    1, 2, 2, 2, 2, 2, 2, 1
];

const DES_SBOX = [
    [
        [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],
        [0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],
        [4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],
        [15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]
    ],
    [
        [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],
        [3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],
        [0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],
        [13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]
    ],
    [
        [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],
        [13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],
        [13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],
        [1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]
    ],
    [
        [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],
        [13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],
        [10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],
        [3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]
    ],
    [
        [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],
        [14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],
        [4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],
        [11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]
    ],
    [
        [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],
        [10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],
        [9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],
        [4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]
    ],
    [
        [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],
        [13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],
        [1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],
        [6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]
    ],
    [
        [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],
        [1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],
        [7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],
        [2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]
    ]
];

function hexToBinary(hex) {
    let result = "";

    for (let i = 0; i < hex.length; i++) {
        const value = parseInt(hex[i], 16);
        result += value.toString(2).padStart(4, "0");
    }

    return result;
}

function binaryToHex(binary) {
    let result = "";

    for (let i = 0; i < binary.length; i += 4) {
        result += parseInt(binary.slice(i, i + 4), 2)
            .toString(16)
            .toUpperCase();
    }

    return result;
}

function permute(bits, table) {
    let result = "";

    for (let i = 0; i < table.length; i++) {
        result += bits[table[i] - 1];
    }

    return result;
}

function xorBits(a, b) {
    let result = "";

    for (let i = 0; i < a.length; i++) {
        result += a[i] === b[i] ? "0" : "1";
    }

    return result;
}

function leftShift(bits, count) {
    return bits.slice(count) + bits.slice(0, count);
}

function generateDESKeys(keyHex) {
    const keyBits = hexToBinary(keyHex);
    const permutedKey = permute(keyBits, DES_PC1);

    let c = permutedKey.slice(0, 28);
    let d = permutedKey.slice(28);

    const keys = [];

    for (let i = 0; i < 16; i++) {
        c = leftShift(c, DES_SHIFTS[i]);
        d = leftShift(d, DES_SHIFTS[i]);

        keys.push(
            permute(c + d, DES_PC2)
        );
    }

    return keys;
}

function desFunction(right, key) {
    const expanded = permute(right, DES_E);
    const xored = xorBits(expanded, key);

    let sboxResult = "";

    for (let i = 0; i < 8; i++) {
        const block = xored.slice(i * 6, i * 6 + 6);

        const row =
            parseInt(block[0] + block[5], 2);

        const column =
            parseInt(block.slice(1, 5), 2);

        const value = DES_SBOX[i][row][column];

        sboxResult += value.toString(2).padStart(4, "0");
    }

    return permute(sboxResult, DES_P);
}

function desBlock(textHex, keyHex, decryptMode) {
    const textBits = hexToBinary(textHex);
    let block = permute(textBits, DES_IP);

    let left = block.slice(0, 32);
    let right = block.slice(32);

    let keys = generateDESKeys(keyHex);

    if (decryptMode) {
        keys = keys.reverse();
    }

    for (let i = 0; i < 16; i++) {
        const newRight =
            xorBits(left, desFunction(right, keys[i]));

        left = right;
        right = newRight;
    }

    block = right + left;

    return binaryToHex(
        permute(block, DES_FP)
    );
}

function isValidHex(text) {
    return /^[0-9A-Fa-f]{16}$/.test(text);
}

function desEncrypt(text, key) {
    text = text.trim().toUpperCase();
    key = key.trim().toUpperCase();

    if (!isValidHex(text)) {
        alert("Bản rõ DES phải gồm đúng 16 ký tự Hex!");
        return null;
    }

    if (!isValidHex(key)) {
        alert("Khóa DES phải gồm đúng 16 ký tự Hex!");
        return null;
    }

    return desBlock(text, key, false);
}

function desDecrypt(text, key) {
    text = text.trim().toUpperCase();
    key = key.trim().toUpperCase();

    if (!isValidHex(text)) {
        alert("Bản mã DES phải gồm đúng 16 ký tự Hex!");
        return null;
    }

    if (!isValidHex(key)) {
        alert("Khóa DES phải gồm đúng 16 ký tự Hex!");
        return null;
    }

    return desBlock(text, key, true);
}

document
    .getElementById("algorithm")
    .addEventListener("change", updateAlgorithmUI);

window.addEventListener("load", updateAlgorithmUI);
