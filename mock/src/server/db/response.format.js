module.exports = class ResponseFormat {
    constructor(code, success, data, message) {
        this.code = code;
        this.success = success;
        this.data = data;
        this.message = message;
    }

    stringify() {
        return { code: this.code, success: this.success, data: this.data, message: this.message };
    }
}