import { sha256 } from "@noble/hashes/sha256";
import { utf8Encoder } from "nostr-tools/utils";
import { secp256k1 } from "@noble/curves/secp256k1";
import { hexToBytes, bytesToHex } from "@noble/hashes/utils";
import { nip19 } from "nostr-tools";

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signButton").addEventListener("click", handleSignButtonClick);
    document.getElementById("copyButton").addEventListener("click", handleCopyButtonClick);
});

function handleSignButtonClick() {
    const delegationKeyRequest = document.getElementById("delegation").value;
    const nsecSecretKey = document.getElementById("secretKey").value;
    const resultContainer = document.getElementById("resultContainer");
    const tokenResult = document.getElementById("tokenResult");

    const { type, data } = nip19.decode(nsecSecretKey);
    if (type !== "nsec") {
        alert("Invalid nsec secret key");
        return;
    }

    const secretKeyHex = bytesToHex(data);
    const hashedDelegationRequest = sha256(utf8Encoder.encode(delegationKeyRequest));
    const signature = secp256k1.sign(hashedDelegationRequest, hexToBytes(secretKeyHex)).toCompactHex();

    tokenResult.value = `${signature}`;
    resultContainer.style.display = "block";
}

function handleCopyButtonClick() {
    const tokenResult = document.getElementById("tokenResult");
    tokenResult.select();
    navigator.clipboard.writeText(tokenResult.value);
}
