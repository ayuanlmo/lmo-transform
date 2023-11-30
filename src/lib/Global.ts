namespace Global {
    export const __G = global || window;

    export const requireNodeModule = <T>(moduleName: string): T => {
        return __G.require(moduleName);
    };
}

export default Global;
