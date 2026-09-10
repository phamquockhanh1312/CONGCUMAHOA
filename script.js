const alphabet26 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabet29 = "AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY";

function encrypt() {
    let text = document.getElementById("plaintext").value;
    let key = Number(document.getElementById("key").value);
    let algorithm = document.getElementById("algorithm").value;
    let alphabet = Number(document.getElementById("alphabet").value);

    if (text === "") {
        alert("Vui lòng nhập bản rõ!");
        return;
    }

    if (algorithm === "caesar") {
        let result = caesarEncrypt(text, key, alphabet);
        document.getElementById("ciphertext").value = result;
    }
}

function decrypt() {
    let text = document.getElementById("ciphertext").value;
    let key = Number(document.getElementById("key").value);
    let algorithm = document.getElementById("algorithm").value;
    let alphabet = Number(document.getElementById("alphabet").value);

    if (text === "") {
        alert("Vui lòng nhập bản mã!");
        return;
    }

    if (algorithm === "caesar") {
        let result = caesarDecrypt(text, key, alphabet);
        document.getElementById("plaintext").value = result;
    }
}

function getAlphabet(number) {
    if (number === 26) {
        return alphabet26;
    }

    return alphabet29;
}

function caesarEncrypt(text, key, alphabetNumber) {
    let alphabet = getAlphabet(alphabetNumber);
    let result = "";

    key = key % alphabet.length;

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
    let alphabet = getAlphabet(alphabetNumber);
    let result = "";

    key = key % alphabet.length;

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let upperChar = char.toUpperCase();
        let position = alphabet.indexOf(upperChar);

        if (position === -1) {
            result += char;
        } else {
            let newPosition = (position - key + alphabet.length) % alphabet.length;
            let newChar = alphabet[newPosition];

            if (char === char.toLowerCase()) {
                newChar = newChar.toLowerCase();
            }

            result += newChar;
        }
    }

    return result;
}
