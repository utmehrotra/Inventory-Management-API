import crypto from 'crypto';

export const getValue = (obj, key) => {
    return key.split('.').reduce((o, x) => {
      return typeof o === 'undefined' || o === null ? o : o[x];
    }, obj);
};

export const isValidEmail = (email) => {
    if (!email) return false;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(
        String(email)
            .trim()
            .toLowerCase()
    );
};

export const isValidPassword = (password) => {
    if(password.length < 4)
        return false;
    return true;
};

export const md5 = (string) => {
    return crypto.createHash('md5').update(string).digest('hex');
}
