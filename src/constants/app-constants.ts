export const AppConstant = {    
    DEFAULT: {
        SIZE: 10,
    },
    USER:{
        DEFAULT:{
            PROJECTION: {
                'name':1, 'email':1, 'createdAt':1
            }
        }
    },
    PRODUCT:{
        WARNING:{
            QUANTITY: 'The inventory of this product is 0',
            FREE: 'The product will be sold for free',
        },
        DEFAULT:{
            PROJECTION: {
                'name':1, 'price':1, 'createdAt':1, 'quantity':1
            }
        }
    },
    ERROR_MESSAGE:{
        MISSING: {
            EMAIL: 'Email missing or not valid',
            PASSWORD: 'Password should be atleast 4 characters',
            NAME: 'Name missing',
        },
        USER:{
            ALREADY_EXISTS: 'User already exists. Please sign in',
            DOESNT_EXISTS: 'User doesn\'t exists. Please sign up'
        },
        PRODUCT:{
            MISSING_EMPTY: 'Product doesn\'t exists or is already empty',
            ALREADY_DELETED: 'Product doesn\`t exists or has already been deleted'
        }
    }
};

