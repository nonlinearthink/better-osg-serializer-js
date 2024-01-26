const StreamOperator = require('./StreamOperator');
const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const GLEnum = require('../Enum/GLEnum');
const Log = require('../Common/Log');

const separatorChars = "\0\t\r\n\f ";
const separatorCharsObject = {};
for (let i = 0; i < separatorChars.length; i++) {
    separatorCharsObject[separatorChars.charCodeAt(i)] = true;
}

function lookAtChar(that, position) {
    return that._buffer.toString("ASCII", position, position + 1)
}

function isSeparatorChar(buffer, index) {
    index = index || 0;
    if (typeof buffer === 'string') {
        return !!separatorCharsObject[buffer.charCodeAt(index)]
    }
    return !!separatorCharsObject[buffer[index]]
}

function skipGaps(that) {
    while (that._position <= that._buffer.length && isSeparatorChar(that._buffer, that._position)) {
        that._position++;
    }
}

function readIntNumber(that){
    let word = that.readString();
    return parseInt(word);
}

function readFloatNumber(that){
    let word = that.readString();
    return parseFloat(word);
}

function isEndlChar(buffer, index) {
    index = index || 0;
    let charCode;
    if (typeof buffer === 'string') {
        charCode = buffer.charCodeAt(index)
    } else {
        charCode = buffer[index]
    }
    return charCode === 10 || charCode === 13
}

class AsciiStreamOperator extends StreamOperator {
    constructor(buffer, initPosition) {
        super("AsciiStreamOperator");
        this._buffer = buffer;
        this._position = initPosition;
        this.version = -1;
    }

    isBinary() {
        return false;
    }

    advanceToCurrentEndBracket() {
        let passString, blocks = 0;
        while (this._position < this._buffer.length) {
            passString = this.readString();

            if (passString === "}") {
                if (blocks <= 0) return;
                else blocks--;
            }
            else if (passString === "{")
                blocks++;
        }
    }

    readBool() {
        let boolString = this.readString();
        return (boolString === "TRUE");
    }

    readUInt() {
        return readIntNumber(this);
    }

    readInt() {
        return readIntNumber(this);
    }

    readUShort() {
        return readIntNumber(this);
    }

    readShort() {
        return readIntNumber(this);
    }

    readUByte() {
        return readIntNumber(this);
    }

    readByte() {
        return readIntNumber(this);
    }

    readFloat() {
        return readFloatNumber(this);
    }

    readDouble() {
        return readFloatNumber(this);
    }

    readHex() {
        let word = this.readString();
        word = word.reaplace("0x", "");
        return parseInt(word, 16);
    }

    matchString(str) {
        let currentPosition = this._position;
        let word = this.readString();
        if (str === word) {
            return true;
        } else {
            this._position = currentPosition;
            return false;
        }
    }

    lookForward() {
        let currentPosition = this._position;
        let word = this.readString();
        this._position = currentPosition;
        return word;
    }

    goToNextRow() {
        while (this._position <= this._buffer.length && !isEndlChar(this._buffer, this._position)) {
            this._position++;
        }
    }

    readChar() {
        skipGaps(this);
        this._position += 1;
        return this._buffer.toString("ASCII", this._position - 1, this._position);
    }
    readString() {
        skipGaps(this);
        let endPosition = this._position;
        while (endPosition <= this._buffer.length && !isSeparatorChar(this._buffer, endPosition)) {
            endPosition++;
        }
        let word = this._buffer.toString('ASCII', this._position, endPosition);
        this._position = endPosition;

        return word;
    }
    readWrappedString() {
        skipGaps(this);

        let ch = lookAtChar(this, this._position);
        if (ch === '"') {
            let endPosition = this._position;
            while (endPosition <= this._buffer.length && lookAtChar(this, endPosition) !== '"') {
                endPosition++;
            }
            let word = this._buffer.toString('ASCII', this._position, endPosition);
            this._position = endPosition + 1;
            return word;
        } else {
            this.readString();
        }
    }
    readGLEnum(objectGLEnum) {
        let enumString = this.readString();
        if (!Object.prototype.hasOwnProperty.call(objectGLEnum, enumString))
            Log.warn("readGLEnum: " + enumString + " enum not found");
        objectGLEnum.value = GLEnum[enumString];
    }
    readObjectMark(mark) {
        let word = this.readString();
        if (mark.name !== word) {
            Log.warn("AsciiStreamOperator.readObjectMark mismatch: expecting " + mark.name + ", actual: " + word)
        }
    }

    readObjectProperty(prop) {
        let value = 0, enumString = this.readString();
        if (prop.mapProperty) {
            value = ObjectWrapperManager.getValue(prop.name,enumString);
        } else {
            if (prop.name !== enumString)
                throw `Unmatched property: Expected '${prop.name}' Found ${enumString}`;
        }
        prop.set(value)
    }
}

module.exports = AsciiStreamOperator;