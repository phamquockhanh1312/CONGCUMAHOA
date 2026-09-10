const alphabet26 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabet29 = "AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY";

function getAlphabet(number) {
    return number === 26 ? alphabet26 : alphabet29;
}

function encrypt() {
    const text = document.getElementById("plaintext").value;
    const key = document.getElementById("key").value.trim();
    const algorithm = document.getElementById("algorithm").value;
    const alphabetNumber = parseInt(document.getElementById("alphabet").value);

    if (text === "") {
        alert("Vui lòng nhập bản rõ!");
        return;
    }

    if (key === "") {
        alert("Vui lòng nhập khóa!");
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
    const alphabetNumber = parseInt(document.getElementById("alphabet").value);

    if (text === "") {
        alert("Vui lòng nhập bản mã!");
        return;
    }

    if (key === "") {
        alert("Vui lòng nhập khóa!");
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
