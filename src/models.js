export class Message{
    constructor (sender, message, time){
        this.sender = sender;
        this.message = message;
        this.time = time;
    }
}

export class User{
    constructor (username){
        this.username = username;
        this.generalMessages = []
        this.wordleMessages = []
    }
}