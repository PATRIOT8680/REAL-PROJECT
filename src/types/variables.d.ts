declare namespace RageMP {
    interface Player {
        setVariable(key: string, value: any): void;
        setVariable<T>(key: string, value: T): void;
    }
}

interface PlayerMp extends RageMP.Player {}