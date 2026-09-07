music.setVolume(255);

/**
 * Any function Emanwel can think of will be here
 */
//% block="Emanwel's" color=#6f00ff icon="\u732b" weight=0 groups="['Games', 'Morse']"
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
     * Plays Rock Paper Scissors for the specified number of round
     * @param rounds number of rounds to play
     * @param forever whether to restart the game after it ends
     */
    //% block="play rock paper scissors for %rounds rounds" group="Games" weight=2
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
                basic.pause(200);
                if (wins > losses) {
                    music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.InBackground);
                    basic.showString("YOU WIN!");
                } else if (wins < losses) {
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone);
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone);
                    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.InBackground);
                    basic.showString("YOU LOSE!");
                } else {
                    music.play(music.builtinPlayableSoundEffect(soundExpression.yawn), music.PlaybackMode.InBackground);
                    basic.showString("DRAW!");
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
                    music.play(music.builtinPlayableSoundEffect(soundExpression.yawn), music.PlaybackMode.InBackground);
                    basic.showIcon(IconNames.Asleep);
                    draws++;
                } else if ((hand + 2) % 3 === ohand) {
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
     * Plays Rock Paper Scissors against another micro:bit using radio.
     * The radio group must be configured before calling this function
     */
    //% block="play radio rock paper scissors" group="Games" weight=1
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
     * Plays a reflexes game.
     * Press the button shown in screen ("+" means A+B and "O" means no button)
     * @param difficulty the difficulty of the game
     */
    //% block="play a $difficulty reflexes game" group="Games" weight=1
    export function reflexes(difficulty: Difficulty): void {
        let button: number = 0;
        let turn: boolean = false;
        let won: boolean = false;
        let time: number = difficulty;
        let score: number = 0;
        input.onButtonPressed(Button.A, (): void => {
            if (turn && button == 0) {
                won = true;
                turn = false;
            } else if (turn && button != 0) {
                won = false;
                turn = false;
            }
        });
        input.onButtonPressed(Button.B, (): void => {
            if (turn && button == 1) {
                won = true;
                turn = false;
            } else if (turn && button != 1) {
                won = false;
                turn = false;
            }
        });
        input.onButtonPressed(Button.AB, (): void => {
            if (turn && button == 2) {
                won = true;
                turn = false;
            } else if (turn && button != 2) {
                won = false;
                turn = false;
            }
        });
        basic.forever((): void => {
            button = randint(0, 3);
            time = difficulty;
            won = false;
            turn = false;
            basic.pause(randint(300, 1500));
            if (button == 0) {
                basic.showString("A");
            } else if (button == 1) {
                basic.showString("B");
            } else if (button == 2) {
                basic.showString("+");
            } else {
                basic.showString("O");
            }
            turn = true;
            while (turn && time > 0) {
                if (button == 3) {
                    if (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
                        won = false;
                        turn = false;
                    }
                }
                basic.pause(1);
                time--;
            }
            if (button == 3 && turn) {
                won = true;
                turn = false;
            }
            if (won) {
                music.play(music.tonePlayable(Note.C5, music.beat(BeatFraction.Half)), music.PlaybackMode.InBackground);
                score++;
                basic.showIcon(IconNames.Happy);
                basic.pause(100);
            } else {
                music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.InBackground);
                basic.showIcon(IconNames.Sad);
                basic.pause(100);
                basic.clearScreen();
                basic.showString("SCORE:");
                basic.showNumber(score);
                score = 0;
            }
        });
    }

    // MORSE

    const l: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "?", " "];
    const m: string[] = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", "-----", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", ".-.-.-", "..--..", "/"];

    /**
     * Converts Latin characters to Morse code
     * @param object the text to convert
     */
    //% block="convert %object to Morse" group="Morse" weight=1
    export function Morse(object: string): string {
        let result: string = "";
        for (const letter of object.toUpperCase()) {
            if (l.indexOf(letter) >= 0) {
                result += m[l.indexOf(letter)] + " ";
            }
        }
        return result.trim();
    }

    /**
     * Converts Morse code to Latin characters
     * @param object the code to convert
     */
    //% block="convert %object to Latin" group="Morse" weight=0
    export function Latin(object: string): string {
        let result: string = "";
        for (const code of object.split(" ")) {
            if (m.indexOf(code) >= 0) {
                result += l[m.indexOf(code)];
            }
        }
        return result;
    }

}
