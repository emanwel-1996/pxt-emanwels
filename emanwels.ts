music.setVolume(255);

/**
 * Any function Emanwel can think of will be here
 */
//% block="Emanwel's" color=#6f00ff icon="\u732b" weight=0 groups="['Games', 'Tools']"
namespace Emanwels {
    // GAMES

    function showHand(hand: number): void {
        if (hand === 0) {
            basic.showLeds(`
                . . . . .
                . # # # .
                . # # # .
                . # # # .
                . . . . .
            `);
        } else if (hand === 1) {
            basic.showLeds(`
                . # # # .
                . # # # .
                . # # # .
                . # # # .
                . # # # .
            `);
        } else {
            basic.showIcon(IconNames.Scissors);
        }
    }
    /**
     * Runs a rock paper scissors game for the specified number of round
     * @param rounds number of rounds to play
     */
    //% block="play rock paper scissors" group="Games" weight=3
    //% rounds.shadow="math_number"
    //% rounds.defl=5
    export function rps(): void {
        let hand: number = 0;
        let opponentsHand: number;
        let turn: boolean = true;
        let wins: number = 0;
        let losses: number = 0;
        let draws: number = 0;
        input.onButtonPressed(Button.A, (): void => {
            if (turn) {
                music.play(music.tonePlayable(494, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground);
                hand = (hand + 1) % 3;
            }
        });
        input.onButtonPressed(Button.B, (): void => {
            if (turn) {
                music.play(music.stringPlayable("E B C5 A B G A F ", 300), music.PlaybackMode.UntilDone);
                turn = false;
            }
        });
        basic.forever((): void => {
            if (wins + losses + draws >= 5) {
                basic.showString("GAME OVER!", 80);
                basic.pause(200);
                if (wins > losses) {
                    music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.InBackground);
                    basic.showString("YOU WIN!", 80);
                } else if (wins < losses) {
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone);
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone);
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.InBackground);
                    basic.showString("YOU LOSE!", 80);
                } else {
                    music.play(music.builtinPlayableSoundEffect(soundExpression.yawn), music.PlaybackMode.InBackground);
                    basic.showString("DRAW!", 80);
                }
                basic.pause(700);
                basic.showString(`${wins} vs. ${losses}`, 80);
                wins = 0;
                losses = 0;
                draws = 0;
                turn = true;
            }
            if (turn) {
                showHand(hand);
            } else {
                opponentsHand = randint(0, 2);
                showHand(opponentsHand);
                basic.pause(400);
                if (hand === opponentsHand) {
                    music.play(music.builtinPlayableSoundEffect(soundExpression.yawn), music.PlaybackMode.InBackground);
                    basic.showIcon(IconNames.Asleep);
                    draws++;
                } else if ((hand + 2) % 3 === opponentsHand) {
                    music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.InBackground);
                    basic.showIcon(IconNames.Happy);
                    wins++;
                } else {
                    basic.showIcon(IconNames.Sad);
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone);
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone);
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.InBackground);
                    losses++;
                }
                basic.pause(700);
                turn = true;
            }
        });
    }
    /**
     * Runs a rock paper scissors game against another micro:bit using radio
     */
    //% block="play radio rock paper scissors" group="Games" weight=2
    export function radioRps(): void {
        let hand: number = 0;
        let turn: boolean = true;
        input.onButtonPressed(Button.A, (): void => {
            if (turn) {
                music.play(music.tonePlayable(494, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground);
                hand = (hand + 1) % 3;
            }
        });
        input.onButtonPressed(Button.B, (): void => {
            if (turn) {
                turn = false;
                radio.sendNumber(hand);
                music.play(music.stringPlayable("E B C5 A B G A F ", 300), music.PlaybackMode.UntilDone);
            }
        });
        radio.onReceivedNumber((receivedNumber: number): void => {
            if (!turn) {
                if (hand === receivedNumber) {
                    music.play(music.builtinPlayableSoundEffect(soundExpression.yawn), music.PlaybackMode.InBackground);
                    basic.showIcon(IconNames.Asleep);
                } else if ((hand + 2) % 3 === receivedNumber) {
                    music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.InBackground);
                    basic.showIcon(IconNames.Happy);
                } else {
                    basic.showIcon(IconNames.Sad);
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone);
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone);
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.InBackground);
                }
                basic.pause(700);
                turn = true;
            }
        });
        basic.forever((): void => {
            if (turn) {
                showHand(hand);
            }
        });
    }

    /**
     * Runs a memory game
     */
    //% block="play memory" group="Games" weight=1
    export function memory(): void {
        let turn: boolean = false;
        const original: string[] = [];
        const inputted: string[] = [];
        pins.touchSetMode(TouchTarget.P0, TouchTargetMode.Capacitive);
        pins.touchSetMode(TouchTarget.P1, TouchTargetMode.Capacitive);
        pins.touchSetMode(TouchTarget.P2, TouchTargetMode.Capacitive);
        pins.touchSetMode(TouchTarget.LOGO, TouchTargetMode.Capacitive);
        input.onButtonPressed(Button.A, (): void => {
            if (turn) {
                music.play(music.tonePlayable(Note.C5, music.beat(BeatFraction.Half)), music.PlaybackMode.InBackground);
                inputted.push("A");
            }
        });
        input.onButtonPressed(Button.B, (): void => {
            if (turn) {
                music.play(music.tonePlayable(Note.C5, music.beat(BeatFraction.Half)), music.PlaybackMode.InBackground);
                inputted.push("B");
            }
        });
        input.onButtonPressed(Button.AB, (): void => {
            if (turn) {
                music.play(music.tonePlayable(Note.C5, music.beat(BeatFraction.Half)), music.PlaybackMode.InBackground);
                inputted.push("+");
            }
        });
        input.onPinReleased(TouchPin.P0, (): void => {
            if (turn) {
                music.play(music.tonePlayable(Note.C5, music.beat(BeatFraction.Half)), music.PlaybackMode.InBackground);
                inputted.push("0");
            }
        });
        input.onPinReleased(TouchPin.P1, (): void => {
            if (turn) {
                music.play(music.tonePlayable(Note.C5, music.beat(BeatFraction.Half)), music.PlaybackMode.InBackground);
                inputted.push("1");
            }
        });
        input.onPinReleased(TouchPin.P2, (): void => {
            if (turn) {
                music.play(music.tonePlayable(Note.C5, music.beat(BeatFraction.Half)), music.PlaybackMode.InBackground);
                inputted.push("2");
            }
        });
        input.onLogoUp((): void => {
            if (turn) {
                music.play(music.tonePlayable(Note.C5, music.beat(BeatFraction.Half)), music.PlaybackMode.InBackground);
                inputted.push("L");
            }
        });
        basic.forever((): void => {
            basic.clearScreen();
            basic.pause(100);
            turn = false;
            inputted.length = 0;
            original.push(Emanwels.randomValue(["A", "B", "+", "0", "1", "2", "L"]));
            for (const input of original) {
                basic.showString(input);
                basic.pause(300);
                basic.clearScreen();
                basic.pause(200);
            }
            turn = true;
            while (!(inputted.length >= original.length)) {}
            turn = false;
            if (inputted != original) {
                music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.UntilDone);
                basic.showIcon(IconNames.Sad);
                for (let i: number = 0; 1 > original.length; i++) {
                    original.pop();
                }
            } else {
                basic.showIcon(IconNames.Happy);
                music.play(music.tonePlayable(Note.C5, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone);
            }
            basic.pause(500);
        });
    }

    // TOOLS

    const l: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", "?", " "];
    const m: string[] = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", "-----", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", ".-.-.-", "--..--", "..--..", "/"];

    /**
     * Converts Latin characters to Morse code
     * @param latin the text to convert
     */
    //% block="convert %latin to Morse" group="Tools" weight=2
    export function latinToMorse(latin: string): string {
        let result: string = "";
        for (const letter of latin.toUpperCase()) {
            if (l.indexOf(letter) >= 0) {
                result += m[l.indexOf(letter)] + " ";
            }
        }
        return result.trim();
    }

    /**
     * Converts Morse code to Latin characters
     * @param morse the code to convert
     */
    //% block="convert %morse to Latin" group="Tools" weight=1
    export function morseToLatin(morse: string): string {
        let result: string = "";
        for (const code of morse.split(" ")) {
            if (m.indexOf(code) >= 0) {
                result += l[m.indexOf(code)];
            }
        }
        return result;
    }

    /**
     * Gets a random value from an array
     * @ param array the array to get the value from
     */
    //% block="pick a random value from %array" group="Tools" weight=0
    //% array.shadow="lists_create_with"
    export function randomValue(array: any[]): string {
        return array[randint(0, array.length)];
    }
}
