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


function caesarEncrypt(text, key, alphabet) {

    let result = "";

    if (alphabet === 26) {

        for (let i = 0; i < text.length; i++) {

            let char = text[i];

            if (char >= 'A' && char <= 'Z') {

                let code = char.charCodeAt(0) - 65;

                let newCode = (code + key) % 26;

                result += String.fromCharCode(newCode + 65);

            }
            else if (char >= 'a' && char <= 'z') {

                let code = char.charCodeAt(0) - 97;

                let newCode = (code + key) % 26;

                result += String.fromCharCode(newCode + 97);

            }
            else {
                result += char;
            }
        }
    }

    return result;
}


function caesarDecrypt(text, key, alphabet) {

    let result = "";

    if (alphabet === 26) {

        for (let i = 0; i < text.length; i++) {

            let char = text[i];

            if (char >= 'A' && char <= 'Z') {

                let code = char.charCodeAt(0) - 65;

                let newCode = (code - key + 26) % 26;

                result += String.fromCharCode(newCode + 65);

            }
            else if (char >= 'a' && char <= 'z') {

                let code = char.charCodeAt(0) - 97;

                let newCode = (code - key + 26) % 26;

                result += String.fromCharCode(newCode + 97);

            }
            else {
                result += char;
            }
        }
    }

    return result;
}
