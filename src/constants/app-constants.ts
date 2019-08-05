export const AppConstant = {    
    DEFAULT: {
        SIZE: 10,
        DATE_DIFF: 30,
        CURRENCY: 'usd'
    },
    USER:{
        DEFAULT:{
            PROJECTION: {
                'name':1, 'email':1, 'createdAt':1
            }
        }
    },
    ERROR_MESSAGE:{
        MISSING: {
            EMAIL: 'Email missing or not valid',
            PASSWORD: 'Password should be atleast 4 characters',
            NAME: 'Name missing'
        },
        USER:{
            ALREADY_EXISTS: 'User already exists. Please sign in',
            DOESNT_EXISTS: 'User doesn\'t exists. Please sign up'
        }
    }
};

