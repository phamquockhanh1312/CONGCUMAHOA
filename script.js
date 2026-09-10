const alphabet26 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabet29 = "AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY";

function getAlphabet(number) {
    if (number === 26) {
        return alphabet26;
    }

    return alphabet29;
}

function encrypt() {
    let text = document.getElementById("plaintext").value;
    let key = document.getElementById("key").value;
    let algorithm = document.getElementById("algorithm").value;
    let alphabetNumber = parseInt(document.getElementById("alphabet").value);

    if (text === "") {
        alert("Vui lòng nhập bản rõ!");
        return;
    }

    if (key === "") {
        alert("Vui lòng nhập khóa!");
        return;
    }

    if (algorithm === "caesar") {
        let number = parseInt(key);

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
        let numbers = key.split(",");

        if (numbers.length !== 2) {
            alert("Khóa Affine nhập dạng a,b. Ví dụ: 5,8");
            return;
        }

        let a = parseInt(numbers[0]);
        let b = parseInt(numbers[1]);

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
    let text = document.getElementById("ciphertext").value;
    let key = document.getElementById("key").value;
    let algorithm = document.getElementById("algorithm").value;
    let alphabetNumber = parseInt(document.getElementById("alphabet").value);

    if (text === "") {
        alert("Vui lòng nhập bản mã!");
        return;
    }

    if (key === "") {
        alert("Vui lòng nhập khóa!");
        return;
    }

    if (algorithm === "caesar") {
        let number = parseInt(key);

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
        let numbers = key.split(",");

        if (numbers.length !== 2) {
            alert("Khóa Affine nhập dạng a,b. Ví dụ: 5,8");
            return;
        }

        let a = parseInt(numbers[0]);
        let b = parseInt(numbers[1]);

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
    let alphabet = getAlphabet(alphabetNumber);
    let result = "";

    key = ((key % alphabet.length) + alphabet.length) % alphabet.length;

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let upperChar = char.toUpperCase();
        let position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
        } else {
            let newPosition = (position + key) % alphabet.length;
            let newChar = alphabet[newPosition];

            if (char === char.toLowerCase()) {
                newChar = newChar.toLowerCase();
            }

            result += newChar;
        }
    }

    return result;
}

function caesarDecrypt(text, key, alphabetNumber) {
    return caesarEncrypt(text, -key, alphabetNumber);
}

function substitutionEncrypt(text, key, alphabetNumber) {
    let alphabet = getAlphabet(alphabetNumber);
    let result = "";

    key = key.toUpperCase();

    if (key.length !== alphabet.length) {
        alert("Khóa Mã thay thế phải có " + alphabet.length + " ký tự!");
        return "";
    }

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let upperChar = char.toUpperCase();
        let position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
        } else {
            let newChar = key[position];

            if (char === char.toLowerCase()) {
                newChar = newChar.toLowerCase();
            }

            result += newChar;
        }
    }

    return result;
}

function substitutionDecrypt(text, key, alphabetNumber) {
    let alphabet = getAlphabet(alphabetNumber);
    let result = "";

    key = key.toUpperCase();

    if (key.length !== alphabet.length) {
        alert("Khóa Mã thay thế phải có " + alphabet.length + " ký tự!");
        return "";
    }

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let upperChar = char.toUpperCase();
        let position = key.indexOf(upperChar);

        if (position === -1) {
            result += char;
        } else {
            let newChar = alphabet[position];

            if (char === char.toLowerCase()) {
                newChar = newChar.toLowerCase();
            }

            result += newChar;
        }
    }

    return result;
}

function vigenereEncrypt(text, key, alphabetNumber) {
    let alphabet = getAlphabet(alphabetNumber);
    let result = "";
    let keyText = key.toUpperCase();
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let upperChar = char.toUpperCase();
        let position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
            continue;
        }

        let keyPosition = alphabet.indexOf(keyText[keyIndex]);

        if (keyPosition === -1) {
            alert("Khóa Vigenere chỉ được chứa ký tự trong bảng chữ cái!");
            return "";
        }

        let newPosition =
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
    let alphabet = getAlphabet(alphabetNumber);
    let result = "";
    let keyText = key.toUpperCase();
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let upperChar = char.toUpperCase();
        let position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
            continue;
        }

        let keyPosition = alphabet.indexOf(keyText[keyIndex]);

        if (keyPosition === -1) {
            alert("Khóa Vigenere chỉ được chứa ký tự trong bảng chữ cái!");
            return "";
        }

        let newPosition =
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
    while (b !== 0) {
        let temp = a % b;
        a = b;
        b = temp;
    }

    return Math.abs(a);
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
    let alphabet = getAlphabet(alphabetNumber);
    let result = "";

    if (gcd(a, alphabet.length) !== 1) {
        alert("Giá trị a không hợp lệ!");
        return "";
    }

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let upperChar = char.toUpperCase();
        let position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
        } else {
            let newPosition =
                (a * position + b) % alphabet.length;

            let newChar = alphabet[newPosition];

            if (char === char.toLowerCase()) {
                newChar = newChar.toLowerCase();
            }

            result += newChar;
        }
    }

    return result;
}

function affineDecrypt(text, a, b, alphabetNumber) {
    let alphabet = getAlphabet(alphabetNumber);
    let result = "";
    let inverse = modInverse(a, alphabet.length);

    if (inverse === -1) {
        alert("Không tìm được nghịch đảo của a!");
        return "";
    }

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let upperChar = char.toUpperCase();
        let position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
        } else {
            let newPosition =
                (inverse * (position - b + alphabet.length)) %
                alphabet.length;

            let newChar = alphabet[newPosition];

            if (char === char.toLowerCase()) {
                newChar = newChar.toLowerCase();
            }

            result += newChar;
        }
    }

    return result;
}

function hillEncrypt(text, key, alphabetNumber) {
    let alphabet = getAlphabet(alphabetNumber);
    let numbers = key.split(",").map(Number);

    if (numbers.length !== 4 || numbers.some(isNaN)) {
        alert("Khóa Hill nhập dạng a,b,c,d. Ví dụ: 3,3,2,5");
        return "";
    }

    let a = numbers[0];
    let b = numbers[1];
    let c = numbers[2];
    let d = numbers[3];

    let determinant = a * d - b * c;

    if (gcd(determinant, alphabet.length) !== 1) {
        alert("Ma trận khóa Hill không khả nghịch!");
        return "";
    }

    let cleanText = "";

    for (let i = 0; i < text.length; i++) {
        let position = alphabet.indexOf(text[i].toUpperCase());

        if (position !== -1) {
            cleanText += text[i].toUpperCase();
        }
    }

    if (cleanText.length % 2 !== 0) {
        cleanText += alphabet[0];
    }

    let result = "";

    for (let i = 0; i < cleanText.length; i += 2) {
        let x1 = alphabet.indexOf(cleanText[i]);
        let x2 = alphabet.indexOf(cleanText[i + 1]);

        let y1 = (a * x1 + b * x2) % alphabet.length;
        let y2 = (c * x1 + d * x2) % alphabet.length;

        result += alphabet[y1];
        result += alphabet[y2];
    }

    return result;
}

function hillDecrypt(text, key, alphabetNumber) {
    let alphabet = getAlphabet(alphabetNumber);
    let numbers = key.split(",").map(Number);

    if (numbers.length !== 4 || numbers.some(isNaN)) {
        alert("Khóa Hill nhập dạng a,b,c,d. Ví dụ: 3,3,2,5");
        return "";
    }

    let a = numbers[0];
    let b = numbers[1];
    let c = numbers[2];
    let d = numbers[3];

    let determinant = a * d - b * c;
    let inverseDeterminant =
        modInverse(determinant, alphabet.length);

    if (inverseDeterminant === -1) {
        alert("Ma trận khóa Hill không khả nghịch!");
        return "";
    }

    let newA = d * inverseDeterminant;
    let newB = -b * inverseDeterminant;
    let newC = -c * inverseDeterminant;
    let newD = a * inverseDeterminant;

    let cleanText = "";

    for (let i = 0; i < text.length; i++) {
        let position = alphabet.indexOf(text[i].toUpperCase());

        if (position !== -1) {
            cleanText += text[i].toUpperCase();
        }
    }

    if (cleanText.length % 2 !== 0) {
        cleanText += alphabet[0];
    }

    let result = "";

    for (let i = 0; i < cleanText.length; i += 2) {
        let x1 = alphabet.indexOf(cleanText[i]);
        let x2 = alphabet.indexOf(cleanText[i + 1]);

        let y1 =
            (newA * x1 + newB * x2) % alphabet.length;

        let y2 =
            (newC * x1 + newD * x2) % alphabet.length;

        y1 = (y1 + alphabet.length) % alphabet.length;
        y2 = (y2 + alphabet.length) % alphabet.length;

        result += alphabet[y1];
        result += alphabet[y2];
    }

    return result;
}
