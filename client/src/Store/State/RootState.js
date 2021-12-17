import { makeAutoObservable, autorun } from "mobx";
import UserState from "./UserState";

// ADD ENTRY OF YOUR STATE HERE
class RootState {
    
    UserState;

    constructor() {
        // makeAutoObservable(this);
        this.UserState = new UserState();
    }
}

export default RootState;
