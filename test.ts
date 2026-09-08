const gamesList: (() => void)[] = [Emanwels.rps, Emanwels.radioRps, Emanwels.memory];
let gameShadow: number = 0;
let gameBool: boolean = true;

input.onButtonPressed(Button.A, (): void => {
    if (gameBool) {
        gameShadow = (gameShadow + 1) % 3;
    }
});

input.onButtonPressed(Button.B, (): void => {
    if (gameBool) {
        gameBool = false;
        gamesList[gameShadow]();
    }
});

basic.forever(() => {
    if (gameBool) {
        basic.showNumber(gameShadow);
    }
});