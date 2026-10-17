
"use strict";

// ======================================================
// 1. DOM
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
const statusBox = document.getElementById("status");

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const crackBtn = document.getElementById("crackBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

const guideTitle = document.getElementById("guideTitle");
const guideText = document.getElementById("guideText");

const rsaGroup = document.getElementById("rsaGroup");
const publicKey = document.getElementById("publicKey");
const privateKey = document.getElementById("privateKey");
const generateRSA = document.getElementById("generateRSA");

// ======================================================
// 2. BẢNG CHỮ CÁI
// ======================================================

const ALPHABET26 = "abcdefghijklmnopqrstuvwxyz";
const ALPHABET29 = "aăâbcdđeêghiklmnoôơpqrstuưvxy";

function getAlphabet() {
    return alphabet.value === "29" ? ALPHABET29 : ALPHABET26;
}

// ======================================================
// 3. DANH SÁCH THUẬT TOÁN
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

const guides = {
    caesar: {
        title: "Dịch vòng / Caesar",
        text: "Nhập khóa số nguyên, ví dụ 3. Khi chưa biết khóa, dùng Thám mã tự động."
    },
    substitution: {
        title: "Mã thay thế",
        text: "Khóa là hoán vị của toàn bộ bảng chữ cái."
    },
    vigenere: {
        title: "Vigenere",
        text: "Nhập khóa dạng chữ, ví dụ CRYPTO."
    },
    affine: {
        title: "Affine",
        text: "Nhập khóa dạng a,b. Ví dụ Z26: 5,8."
    },
    hill: {
        title: "Hill",
        text: "Nhập ma trận 2×2 dạng a,b,c,d. Ví dụ: 3,3,2,5."
    },
    aes: {
        title: "AES-128",
        text: "Nhập mật khẩu. Khóa AES-128 được tạo bằng PBKDF2-SHA256."
    },
    des: {
        title: "DES",
        text: "Nhập mật khẩu để mã hóa hoặc giải mã."
    },
    rsa: {
        title: "RSA",
        text: "Tạo cặp khóa trước. Public Key dùng mã hóa, Private Key dùng giải mã."
    },
    md5: {
        title: "MD5",
        text: "Hàm băm một chiều, không hỗ trợ giải mã."
    },
    sha256: {
        title: "SHA-256",
        text: "Hàm băm một chiều, không hỗ trợ giải mã."
    }
};

// ======================================================
// 4. GIAO DIỆN
// ======================================================

function setStatus(message, isError = false) {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.style.color = isError ? "#ff7070" : "#45f3c2";
}

function updateAlgorithms() {
    algorithm.innerHTML = "";

    algorithms[category.value].forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        algorithm.appendChild(option);
    });

    updateInterface();
}

function updateInterface() {
    const type = category.value;
    const algo = algorithm.value;

    alphabetGroup.style.display = type === "classical" ? "block" : "none";
    keyGroup.style.display = type === "classical" || type === "modern" ? "block" : "none";
    rsaGroup.classList.toggle("hidden", type !== "public");

    encryptBtn.style.display = "block";
    decryptBtn.style.display = type === "hash" ? "none" : "block";
    crackBtn.style.display = algo === "caesar" ? "block" : "none";

    if (guides[algo]) {
        guideTitle.textContent = guides[algo].title;
        guideText.textContent = guides[algo].text;
    }

    const placeholders = {
        caesar: "Ví dụ: 3",
        substitution: "Nhập hoán vị bảng chữ cái",
        vigenere: "Ví dụ: CRYPTO",
        affine: "Ví dụ: 5,8",
        hill: "Ví dụ: 3,3,2,5",
        aes: "Nhập mật khẩu AES",
        des: "Nhập mật khẩu DES"
    };

    keyInput.placeholder = placeholders[algo] || "Nhập khóa...";
}

// ======================================================
// 5. HÀM TIỆN ÍCH
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
        if (mod(a * x, m) === 1) return x;
    }

    return null;
}

function preserveCase(original, result) {
    return original === original.toUpperCase()
        ? result.toUpperCase()
        : result;
}

function showResult(result) {
    ciphertext.value = result;
    bitInfo.value = textToBits(result);
}

function textToBits(text) {
    return Array.from(new TextEncoder().encode(text))
        .map(byte => byte.toString(2).padStart(8, "0"))
        .join(" ");
}

// ======================================================
// 6. CAESAR
// ======================================================

function caesar(text, key, decrypt = false) {
    const chars = getAlphabet();
    const number = Number(key);

    if (!Number.isInteger(number)) {
        throw new Error("Khóa Caesar phải là số nguyên.");
    }

    const shift = decrypt ? -number : number;

    return [...text].map(char => {
        const index = chars.indexOf(char.toLowerCase());

        if (index === -1) return char;

        const result = chars[mod(index + shift, chars.length)];
        return preserveCase(char, result);
    }).join("");
}

// ======================================================
// 7. THÁM MÃ CAESAR TỰ ĐỘNG
// ======================================================

// Điểm tham khảo tần suất chữ cái tiếng Anh.
// Đây là cách xếp hạng tham khảo, không bảo đảm đúng
// với mọi ngôn ngữ hoặc bản mã quá ngắn.

const ENGLISH_FREQUENCY = {
    a: 0.08167, b: 0.01492, c: 0.02782,
    d: 0.04253, e: 0.12702, f: 0.02228,
    g: 0.02015, h: 0.06094, i: 0.06966,
    j: 0.00153, k: 0.00772, l: 0.04025,
    m: 0.02406, n: 0.06749, o: 0.07507,
    p: 0.01929, q: 0.00095, r: 0.05987,
    s: 0.06327, t: 0.09056, u: 0.02758,
    v: 0.00978, w: 0.02360, x: 0.00150,
    y: 0.01974, z: 0.00074
};

function scoreEnglish(text) {
    const clean = text.toLowerCase().replace(/[^a-z]/g, "");

    if (!clean.length) return -Infinity;

    let score = 0;

    for (const char of clean) {
        score += Math.log(ENGLISH_FREQUENCY[char] || 0.001);
    }

    const commonPatterns = [
        "the", "and", "ing", "ion", "ent", "her",
        "for", "tha", "ere", "ate", "hello", "you",
        "is", "to", "of", "in", "it", "he", "an"
    ];

    for (const pattern of commonPatterns) {
        let position = 0;

        while ((position = clean.indexOf(pattern, position)) !== -1) {
            score += pattern.length >= 3 ? 4 : 1;
            position++;
        }
    }

    return score / clean.length;
}

function crackCaesar() {
    const text = plaintext.value.trim();

    if (!text) {
        setStatus("Hãy nhập bản mã trước khi thám mã.", true);
        return;
    }

    if (algorithm.value !== "caesar") {
        setStatus("Hãy chọn thuật toán Caesar.", true);
        return;
    }

    const chars = getAlphabet();
    const candidates = [];

    for (let key = 0; key < chars.length; key++) {
        const result = caesar(text, key, true);

        candidates.push({
            key,
            result,
            score: alphabet.value === "26"
                ? scoreEnglish(result)
                : 0
        });
    }

    // Z26: xếp hạng theo tần suất tiếng Anh.
    // Z29: liệt kê tất cả khóa, không giả vờ rằng
    // điểm tần suất tiếng Anh có thể đánh giá tiếng Việt.
    if (alphabet.value === "26") {
        candidates.sort((a, b) => b.score - a.score);
    }

    const output = candidates.map((item, index) => {
        const marker = index === 0 ? " [ỨNG VIÊN ĐẦU]" : "";

        return `Khóa K = ${item.key}${marker}\n${item.result}`;
    }).join("\n\n");

    showResult(output);

    setStatus(
        alphabet.value === "26"
            ? "Đã thử toàn bộ 26 khóa và xếp hạng ứng viên theo tần suất tiếng Anh."
            : "Đã thử toàn bộ 29 khóa. Hãy đọc các kết quả để xác định bản rõ tiếng Việt."
    );
}

// ======================================================
// 8. SUBSTITUTION
// ======================================================

function substitution(text, key, decrypt = false) {
    const chars = getAlphabet();
    const cleanKey = [...key.toLowerCase()];

    if (cleanKey.length !== chars.length) {
        throw new Error(`Khóa phải có đúng ${chars.length} ký tự.`);
    }

    if (new Set(cleanKey).size !== chars.length ||
        cleanKey.some(char => !chars.includes(char))) {
        throw new Error("Khóa phải là hoán vị hợp lệ của bảng chữ cái.");
    }

    const from = decrypt ? cleanKey : [...chars];
    const to = decrypt ? [...chars] : cleanKey;

    return [...text].map(char => {
        const index = from.indexOf(char.toLowerCase());

        if (index === -1) return char;

        return preserveCase(char, to[index]);
    }).join("");
}

// ======================================================
// 9. VIGENERE
// ======================================================

function vigenere(text, key, decrypt = false) {
    const chars = getAlphabet();
    const normalizedKey = [...key.toLowerCase()];

    if (!normalizedKey.length) {
        throw new Error("Vui lòng nhập khóa Vigenere.");
    }

    if (normalizedKey.some(char => !chars.includes(char))) {
        throw new Error("Khóa Vigenere chứa ký tự không hợp lệ.");
    }

    let keyIndex = 0;

    return [...text].map(char => {
        const index = chars.indexOf(char.toLowerCase());

        if (index === -1) return char;

        const keyValue = chars.indexOf(
            normalizedKey[keyIndex % normalizedKey.length]
        );

        const shift = decrypt ? -keyValue : keyValue;
        keyIndex++;

        return preserveCase(
            char,
            chars[mod(index + shift, chars.length)]
        );
    }).join("");
}

// ======================================================
// 10. AFFINE
// ======================================================

function affine(text, key, decrypt = false) {
    const chars = getAlphabet();
    const m = chars.length;
    const parts = key.split(",").map(value => Number(value.trim()));

    if (parts.length !== 2 || parts.some(value => !Number.isInteger(value))) {
        throw new Error("Khóa Affine có dạng a,b. Ví dụ: 5,8");
    }

    const [a, b] = parts;

    if (gcd(a, m) !== 1) {
        throw new Error(`a phải nguyên tố cùng nhau với ${m}.`);
    }

    const inverse = modInverse(a, m);

    return [...text].map(char => {
        const x = chars.indexOf(char.toLowerCase());

        if (x === -1) return char;

        const y = decrypt
            ? mod(inverse * (x - b), m)
            : mod(a * x + b, m);

        return preserveCase(char, chars[y]);
    }).join("");
}

// ======================================================
// 11. HILL 2x2
// ======================================================

function hill(text, key, decrypt = false) {
    const chars = getAlphabet();
    const m = chars.length;
    const nums = key.split(",").map(value => Number(value.trim()));

    if (nums.length !== 4 || nums.some(value => !Number.isInteger(value))) {
        throw new Error("Khóa Hill có dạng a,b,c,d. Ví dụ: 3,3,2,5");
    }

    let [a, b, c, d] = nums;
    const determinant = mod(a * d - b * c, m);
    const inverseDet = modInverse(determinant, m);

    if (inverseDet === null) {
        throw new Error("Ma trận Hill không khả nghịch với bảng chữ cái này.");
    }

    if (decrypt) {
        [a, b, c, d] = [
            d * inverseDet,
            -b * inverseDet,
            -c * inverseDet,
            a * inverseDet
        ];
    }

    const originalChars = [...text];
    const letters = originalChars.filter(char =>
        chars.includes(char.toLowerCase())
    );

    if (letters.length === 0) return "";

    if (letters.length % 2 !== 0) letters.push("x");

    let result = "";

    for (let i = 0; i < letters.length; i += 2) {
        const x1 = chars.indexOf(letters[i].toLowerCase());
        const x2 = chars.indexOf(letters[i + 1].toLowerCase());

        const y1 = mod(a * x1 + b * x2, m);
        const y2 = mod(c * x1 + d * x2, m);

        result += chars[y1] + chars[y2];
    }

    return result;
}

// ======================================================
// 12. AES-128
// ======================================================

// PBKDF2 tạo khóa 128 bit từ mật khẩu.
// File JSON gồm salt, IV và ciphertext để giải mã lại.

function deriveAESKey(password, salt) {
    if (!password) {
        throw new Error("Vui lòng nhập mật khẩu AES.");
    }

    return CryptoJS.PBKDF2(
        password,
        salt,
        {
            keySize: 128 / 32,
            iterations: 100000,
            hasher: CryptoJS.algo.SHA256
        }
    );
}

function downloadTextFile(filename, content) {
    const blob = new Blob([content], {
        type: "application/octet-stream"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function aesEncrypt(text, password) {
    if (!password) {
        throw new Error("Vui lòng nhập mật khẩu AES.");
    }

    const salt = CryptoJS.lib.WordArray.random(16);
    const iv = CryptoJS.lib.WordArray.random(16);
    const key = deriveAESKey(password, salt);

    const encrypted = CryptoJS.AES.encrypt(
        text,
        key,
        {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    const ciphertextBase64 = encrypted.ciphertext.toString(
        CryptoJS.enc.Base64
    );

    const fileData = {
        algorithm: "AES-128-CBC",
        kdf: "PBKDF2-SHA256",
        iterations: 100000,
        salt: salt.toString(CryptoJS.enc.Hex),
        iv: iv.toString(CryptoJS.enc.Hex),
        ciphertext: ciphertextBase64
    };

    // Xuất tệp đúng tên yêu cầu.
    downloadTextFile(
        "aes-encrypt.dat",
        JSON.stringify(fileData, null, 2)
    );

    return ciphertextBase64;
}

function aesDecrypt(input, password) {
    if (!password) {
        throw new Error("Vui lòng nhập mật khẩu AES.");
    }

    let fileData;

    try {
        fileData = JSON.parse(input);
    } catch {
        throw new Error(
            "Để giải mã AES, hãy dán toàn bộ nội dung JSON từ aes-encrypt.dat vào ô dữ liệu đầu vào."
        );
    }

    if (!fileData.salt || !fileData.iv || !fileData.ciphertext) {
        throw new Error("Tệp AES thiếu salt, IV hoặc ciphertext.");
    }

    const salt = CryptoJS.enc.Hex.parse(fileData.salt);
    const iv = CryptoJS.enc.Hex.parse(fileData.iv);
    const key = deriveAESKey(password, salt);

    const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(fileData.ciphertext)
    });

    const decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        key,
        {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    const result = decrypted.toString(CryptoJS.enc.Utf8);

    if (!result) {
        throw new Error("Giải mã thất bại. Hãy kiểm tra mật khẩu hoặc tệp.");
    }

    return result;
}

// ======================================================
// 13. DES
// ======================================================

function desEncrypt(text, password) {
    if (!password) throw new Error("Vui lòng nhập mật khẩu DES.");
    return CryptoJS.DES.encrypt(text, password).toString();
}

function desDecrypt(text, password) {
    if (!password) throw new Error("Vui lòng nhập mật khẩu DES.");

    const bytes = CryptoJS.DES.decrypt(text, password);
    const result = bytes.toString(CryptoJS.enc.Utf8);

    if (!result) {
        throw new Error("Giải mã DES thất bại. Kiểm tra khóa hoặc bản mã.");
    }

    return result;
}

// ======================================================
// 14. HASH
// ======================================================

function md5(text) {
    return CryptoJS.MD5(text).toString();
}

function sha256(text) {
    return CryptoJS.SHA256(text).toString();
}

// ======================================================
// 15. RSA
// ======================================================

function generateRSAKeys() {
    try {
        setStatus("Đang tạo khóa RSA 2048-bit...");

        const crypt = new JSEncrypt({
            default_key_size: 2048
        });

        crypt.getKey();

        publicKey.value = crypt.getPublicKey();
        privateKey.value = crypt.getPrivateKey();

        setStatus("Đã tạo cặp khóa RSA 2048-bit.");
    } catch (error) {
        setStatus("Không thể tạo khóa RSA: " + error.message, true);
    }
}

function rsaEncrypt(text) {
    if (!publicKey.value.trim()) {
        throw new Error("Hãy nhập hoặc tạo Public Key RSA.");
    }

    const crypt = new JSEncrypt();
    crypt.setPublicKey(publicKey.value.trim());

    const result = crypt.encrypt(text);

    if (!result) {
        throw new Error("RSA không mã hóa được dữ liệu này.");
    }

    return result;
}

function rsaDecrypt(text) {
    if (!privateKey.value.trim()) {
        throw new Error("Hãy nhập hoặc tạo Private Key RSA.");
    }

    const crypt = new JSEncrypt();
    crypt.setPrivateKey(privateKey.value.trim());

    const result = crypt.decrypt(text);

    if (result === false || result === null) {
        throw new Error("RSA giải mã thất bại.");
    }

    return result;
}

// ======================================================
// 16. MÃ HÓA
// ======================================================

function encrypt() {
    const text = plaintext.value;
    const algo = algorithm.value;

    if (!text) {
        setStatus("Vui lòng nhập dữ liệu.", true);
        return;
    }

    try {
        let result;

        switch (algo) {
            case "caesar":
                result = caesar(text, keyInput.value, false);
                break;

            case "substitution":
                result = substitution(text, keyInput.value, false);
                break;

            case "vigenere":
                result = vigenere(text, keyInput.value, false);
                break;

            case "affine":
                result = affine(text, keyInput.value, false);
                break;

            case "hill":
                result = hill(text, keyInput.value, false);
                break;

            case "aes":
                if (text !== "IlovePhenikaa") {
                    setStatus("Đang mã hóa dữ liệu bằng AES-128...");
                }

                result = aesEncrypt(text, keyInput.value);

                showResult(result);
                setStatus("Mã hóa AES thành công. Đã tải tệp aes-encrypt.dat.");
                return;

            case "des":
                result = desEncrypt(text, keyInput.value);
                break;

            case "rsa":
                result = rsaEncrypt(text);
                break;

            case "md5":
                result = md5(text);
                break;

            case "sha256":
                result = sha256(text);
                break;

            default:
                throw new Error("Thuật toán không hợp lệ.");
        }

        showResult(result);
        setStatus("Đã xử lý thành công.");
    } catch (error) {
        setStatus(error.message, true);
    }
}

// ======================================================
// 17. GIẢI MÃ
// ======================================================

function decrypt() {
    const text = plaintext.value;
    const algo = algorithm.value;

    if (!text) {
        setStatus("Vui lòng nhập bản mã.", true);
        return;
    }

    try {
        let result;

        switch (algo) {
            case "caesar":
                result = caesar(text, keyInput.value, true);
                break;

            case "substitution":
                result = substitution(text, keyInput.value, true);
                break;

            case "vigenere":
                result = vigenere(text, keyInput.value, true);
                break;

            case "affine":
                result = affine(text, keyInput.value, true);
                break;

            case "hill":
                result = hill(text, keyInput.value, true);
                break;

            case "aes":
                result = aesDecrypt(text, keyInput.value);
                break;

            case "des":
                result = desDecrypt(text, keyInput.value);
                break;

            case "rsa":
                result = rsaDecrypt(text);
                break;

            case "md5":
            case "sha256":
                throw new Error("Hàm băm không hỗ trợ giải mã.");

            default:
                throw new Error("Thuật toán không hợp lệ.");
        }

        showResult(result);
        setStatus("Giải mã thành công.");
    } catch (error) {
        setStatus(error.message, true);
    }
}

// ======================================================
// 18. XÓA, SAO CHÉP VÀ SỰ KIỆN
// ======================================================

function clearData() {
    plaintext.value = "";
    ciphertext.value = "";
    bitInfo.value = "";
    keyInput.value = "";

    setStatus("Đã xóa dữ liệu.");
}

async function copyResult() {
    if (!ciphertext.value) {
        setStatus("Chưa có kết quả để sao chép.", true);
        return;
    }

    try {
        await navigator.clipboard.writeText(ciphertext.value);
        setStatus("Đã sao chép kết quả.");
    } catch {
        ciphertext.focus();
        ciphertext.select();

        const success = document.execCommand("copy");
        setStatus(
            success ? "Đã sao chép kết quả." : "Không thể sao chép tự động.",
            !success
        );
    }
}

category.addEventListener("change", updateAlgorithms);
algorithm.addEventListener("change", updateInterface);
alphabet.addEventListener("change", updateInterface);

encryptBtn.addEventListener("click", encrypt);
decryptBtn.addEventListener("click", decrypt);
crackBtn.addEventListener("click", crackCaesar);
clearBtn.addEventListener("click", clearData);
copyBtn.addEventListener("click", copyResult);
generateRSA.addEventListener("click", generateRSAKeys);

// ======================================================
// 19. KHỞI TẠO
// ======================================================

updateAlgorithms();
setStatus("CRYPTONEX sẵn sàng.");
