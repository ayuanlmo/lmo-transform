import {ToString} from "../utils";
import AppConfig from "../conf/AppConfig";

export default class Storage {
    private static store = AppConfig.storageOptions.storage === 'local' ? localStorage : sessionStorage;
    private static namespace: string = AppConfig.storageOptions.namespace;

    public static Get(key: string): string | null {
        return this.store.getItem(this.namespace + key);
    }

    public static Set<T>(key: string, value: T): void {
        this.store.setItem(this.namespace + key, ToString(value));
    }

    public static Remove(key: string): void {
        this.store.removeItem(this.namespace + key);
    }

    public static Clear(): void {
        this.store.clear();
    }
}
