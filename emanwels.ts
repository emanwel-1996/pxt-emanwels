/**
 * Any function Emanwel can think of will be here.
 */
//% block="Emanwel's" color=#6f00ff icon="\u732b" weight=0 groups="['Games', 'Morse']"
namespace Emanwels {}

// GAMES

namespace games {
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
     * Plays Rock Paper Scissors for the specified number of rounds.
     * @param rounds Number of rounds to play.
     * @param forever Whether to restart the game after it ends.
     */
    //% blockNamespace=Emanwels block="play rock paper scissors for %rounds rounds" group="Games" weight=1
    export function rps(rounds: number = 5, forever: boolean = true): void {
        let hand: number = 0;
        let ohand: number;
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
            if (wins + losses + draws >= rounds) {
                basic.showString("GAME OVER!");
                basic.pause(200)
                if (wins > losses) {
                    basic.showString("YOU WIN!");
                } else if (wins < losses) {
                    basic.showString("YOU LOSE!");
                } else {
                    basic.showString("DRAW!")
                }
                basic.pause(700);
                basic.showString(`${wins} vs. ${losses}`);
                if (forever) {
                    wins = 0;
                    losses = 0;
                    draws = 0;
                    turn = true;
                } else {
                    return;
                }
            }
            if (turn) {
                showHand(hand);
            } else {
                ohand = randint(0, 2);
                showHand(ohand);
                basic.pause(400);
                if (hand === ohand) {
                    basic.showIcon(IconNames.Asleep);
                    draws++;
                } else if ((hand + 2) % 3 === ohand) {
                    basic.showIcon(IconNames.Happy);
                    wins++;
                } else {
                    basic.showIcon(IconNames.Sad);
                    losses++;
                }
                basic.pause(700);
                turn = true;
            }
        });
    }
    /**
     * Plays Rock Paper Scissors against another micro:bit using radio.
     * The radio group must be configured before calling this function.
     */
    //% blockNamespace=Emanwels block="play radio rock paper scissors" group="Games" weight=0
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
                    basic.showIcon(IconNames.Asleep);
                } else if ((hand + 2) % 3 === receivedNumber) {
                    basic.showIcon(IconNames.Happy);
                } else {
                    basic.showIcon(IconNames.Sad);
                }
                basic.pause(700)
                turn = true;
            }
        });
        basic.forever((): void => {
            if (turn) {
                showHand(hand);
            }
        });
    }
}

// MORSE

const l: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "?", " "];
const m: string[] = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", "-----", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", ".-.-.-", "..--..", "/"];

/**
 * Converts Latin characters to Morse code.
 * @param object The Latin text to convert.
 * @returns The Morse code representation of the text.
 */
//% blockNamespace=Emanwels block="convert %Latin to Morse" group="Morse" weight=1
function Morse(object: string): string {
    let result: string = "";
    for (const letter of object.toUpperCase()) {
        if (l.indexOf(letter) >= 0) {
            result += m[l.indexOf(letter)] + " ";
        }
    }
    return result.trim();
}

/**
 * Converts Morse code to Latin characters.
 * @param object The Morse code to convert.
 * @returns The Latin text represented by the Morse code.
 */
//% blockNamespace=Emanwels block="convert %Morse to Latin" color=#000000 group="Morse" weight=0
function Latin(object: string): string {
    let result: string = "";
    for (const code of object.split(" ")) {
        if (m.indexOf(code) >= 0) {
            result += l[m.indexOf(code)];
        }
    }
    return result;
}
