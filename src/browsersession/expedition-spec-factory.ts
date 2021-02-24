/**
 * Helpers for creating Expedition specifications.
 */
import {Browser} from "../browser";
import {ExpeditionSpec} from "./expedition-spec";
import {LiveExpeditionSpec} from "./live-expedition-spec";
import {URLListDriverSpecification} from "./url-list-driver-specification";
import {BrowserSpecification} from "./browser-specification";

export class ExpeditionSpecFactory {

    /**
     * Create a live expedition spec that visits a list of URLs in the given browser.
     */
    static makeUrlListExpeditionSpec(urls: string[], browser: Browser): ExpeditionSpec {
        return new LiveExpeditionSpec(new URLListDriverSpecification(urls), new BrowserSpecification(browser));
    }
}
