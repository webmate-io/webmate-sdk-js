import {SeleniumSession} from "./selenium-session";
import {Observable} from "rxjs";

export interface SeleniumSessionProxy {
    getSession(): Observable<SeleniumSession>;
}
