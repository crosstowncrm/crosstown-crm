class Auth{
    constructor(){
        this.auth = false;
    }

    login(){
        this.auth = true;
        // cb();
        console.log('it is true');
    }

    logout(){
        this.auth = false;
        // cb();
    }

    isAuth(){
        return this.auth
    }
}

export default new Auth()