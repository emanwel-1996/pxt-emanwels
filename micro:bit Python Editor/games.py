from microbit import *
import random
import radio
import music


def show_hand(hand: int) -> None:
    if hand == 0:
        display.show(Image('00000:''09990:''09990:''09990:''00000:'))
    elif hand == 1:
        display.show(Image('09990:''09990:''09990:''09990:''09990:'))
    else:
        display.show(Image.SCISSORS)
        
def rps(rounds: int = 5, forever: bool = True) -> None:
    hand: int = 0
    turn: bool = True
    wins: int = 0
    losses: int = 0
    draws: int = 0
    while True:
        if wins + losses + draws >= rounds:
            turn = False
            display.scroll('GAME OVER!')
            sleep(200)
            if wins > losses:
                display.scroll('YOU WIN!')
            elif wins < losses:
                display.scroll('YOU LOSE!')
            else:
                display.scroll('DRAW!')
            sleep(700)
            display.scroll(str(wins) + 'vs.' + str(losses))
            if forever:
                wins = 0
                losses = 0
                draws = 0
                turn = True
            else:
                return
        if turn:
            show_hand(hand)
        else:
            ohand: int = random.randint(0, 2)
            show_hand(ohand)
            sleep(400)
            if hand == ohand:
                display.show(Image.ASLEEP)
                draws += 1
            elif (hand + 2) % 3 == ohand:
                display.show(Image.HAPPY)
                wins += 1
            else:
                display.show(Image.SAD)
                losses += 1
            sleep(700)
            turn = True
        if button_a.was_pressed():
            if turn:
                hand = (hand + 1) % 3
                music.pitch(494, 500)
        if button_b.was_pressed():
            if turn:
                music.play(['e', 'b', 'c5', 'a4', 'b', 'g', 'a', 'f'])
                turn = False

def radio_rps() -> None:
    hand: int = 0
    turn: bool = True
    while True:
        if turn:
            show_hand(hand)
        else:
            ohand = radio.receive()
            if ohand:
                show_hand(int(ohand))
                sleep(800)
                if hand == int(ohand):
                    display.show(Image.ASLEEP)
                elif (hand + 2) % 3 == int(ohand):
                    display.show(Image.HAPPY)
                else:
                    display.show(Image.SAD)
                sleep(700)
                turn = True
        if button_a.was_pressed():
            if turn:
                music.pitch(494, 500)
                hand = (hand + 1) % 3
        if button_b.was_pressed():
            if turn:
                turn = False
                radio.send(str(hand))
                music.play(['e', 'b', 'c5', 'a4', 'b', 'g', 'a', 'f'])
