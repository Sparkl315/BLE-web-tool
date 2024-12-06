
var bluetoothDevice;

let txPreviousNumeral = "txAscii";
let rxPreviousNumeral = "rxAscii";

let connectButton = document.querySelector('#connect')
let disconnectButton = document.querySelector('#disconnect')
let scanButton = document.querySelector('#scan')
let previewWindow = document.querySelector("#previewWindow")
let eolSelect = document.querySelector("#eolSelect")

function connect() {
    return bluetoothDevice.gatt.connect()
}

function scan() {
    let options = {};
    if (document.querySelector('#allDevices').checked) {
        options.acceptAllDevices = true;
    }

    navigator.bluetooth.requestDevice(options)
}

function disconnect() {
    if (!bluetoothDevice) {
        return;
    }

    if (bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
    }
}

function updatePreview() {
    let str = document.getElementById("txTerminal").value;
    // Add End Of Line if eolSelect is not None
    if (!(eolSelect.value === '')) {str += eolSelect.value}
    previewWindow.value = str;
}

function updateCheckbox(obj) {
    let checkBoxes = document.getElementsByClassName(obj.className)
    for (let box of checkBoxes) {
        box.checked = false; 
    };
    document.getElementById(obj.id).checked = true;

    updateContent(obj.id);
}

function updateContent(id) {
    let terminal = null;
    let prev = null;
    let trimmed_id = null;
    if (/^tx.+/.test(id)) { //If checkbox id is tx
        if (id === txPreviousNumeral) {return;}
        // checkbox is different than previous, then (else return)
        terminal = document.getElementById("txTerminal")
        prev = txPreviousNumeral.replace(/^tx/, '')
        trimmed_id = id.replace(/^tx/, '')
        txPreviousNumeral = id;
    }
        
    if (/^rx.+/.test(id)) { //If checkbox id is rx
        if (id === rxPreviousNumeral) {return;}
        // checkbox is different than previous, then (else return)
        terminal = document.getElementById("rxTerminal")
        prev = rxPreviousNumeral.replace(/^rx/, '')
        trimmed_id = id.replace(/^rx/, '')
        rxPreviousNumeral = id;
    }

    updateTerminal(trimmed_id, prev, terminal);
    updatePreview();
}

function updateTerminal(id, prev, terminal) {
    if (!terminal) {return;}
    if (prev === "Ascii" && id === "Hex"  ) {ascii2hex(terminal);}
    if (prev === "Ascii" && id === "Bin"  ) {ascii2bin(terminal);}
    if (prev === "Hex"   && id === "Ascii") {hex2ascii(terminal);}
    if (prev === "Hex"   && id === "Bin"  ) {hex2bin(terminal);  }
    if (prev === "Bin"   && id === "Ascii") {bin2ascii(terminal);}
    if (prev === "Bin"   && id === "Hex"  ) {bin2hex(terminal);  }
}

function ascii2hex(terminal) {
    let str = terminal.value;
    let newValue = [];
	for (let n = 0, l = str.length; n < l; n ++) {
        let hex = Number(str.charCodeAt(n)).toString(16).padStart(2, '0');
        newValue.push(hex);
        newValue.push(" ");
	}
	terminal.value = newValue.join('').trimEnd();
}

function ascii2bin(terminal) {
    let str = terminal.value;
    let newValue = [];
	for (let n = 0, l = str.length; n < l; n ++) {
        let bin = Number(str.charCodeAt(n)).toString(2).padStart(8, '0');
        newValue.push(bin);
        newValue.push(" ");
	}
	terminal.value = newValue.join('').trimEnd();
}

function hex2ascii(terminal) {
    let hex = terminal.value.replaceAll(" ",'');
	let str = '';
	for (let n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	terminal.value = str;
}

function hex2bin(terminal) {
    let hex = terminal.value.replaceAll(" ",'');
    let newValue = [];
    for (let n = 0; n < hex.length; n += 2) {
        let bin = parseInt(hex.substr(n, 2), 16).toString(2).padStart(8, '0');
        newValue.push(bin);
        newValue.push(" ");
    }
    terminal.value = newValue.join('').trimEnd();
}

function bin2ascii(terminal) {
    let bin = terminal.value.replaceAll(" ",'');
	let str = '';
	for (let n = 0; n < bin.length; n += 8) {
		str += String.fromCharCode(parseInt(bin.substr(n, 8), 2));
	}
    terminal.value = str;
}

function bin2hex(terminal) {
    let bin = terminal.value.replaceAll(" ",'');
    let newValue = [];
    for (let n = 0; n < bin.length; n += 8) {
        let hex = parseInt(bin.substr(n, 8), 2).toString(16).padStart(2, '0');
        newValue.push(hex);
        newValue.push(" ");
    }
    terminal.value = newValue.join('').trimEnd();
}

connectButton.onclick = () => {
    connect();
};

scanButton.onclick = () => {
    scan();
}

disconnectButton.onclick = () => {
    disconnect();
}

