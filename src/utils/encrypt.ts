import CryptoJS from 'crypto-js'

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY as any;

export const encrypt = (text: string): string =>
    CryptoJS.AES.encrypt(text, SECRET_KEY).toString();

export const decrypt = (text: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(text, SECRET_KEY);
        
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption failed:', error);

        return "";
    }
};
