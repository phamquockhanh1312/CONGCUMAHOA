function encrypt() {
    let text = document.getElementById("plaintext").value;

    if (text === "") {
        alert("Vui lòng nhập bản rõ!");
        return;
    }

    document.getElementById("ciphertext").value =
        "Chức năng mã hóa sẽ được lập trình ở bước tiếp theo.";
}

function decrypt() {
    let text = document.getElementById("ciphertext").value;

    if (text === "") {
        alert("Vui lòng nhập bản mã!");
        return;
    }

    document.getElementById("plaintext").value =
        "Chức năng giải mã sẽ được lập trình ở bước tiếp theo.";
}
