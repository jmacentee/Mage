# **Mage**: A Scorecard Web App for the Card Game Wizard
A Blazor WASM scorekeeper for the card game Wizard.  Static website hostable.


.NET 9 Blazor WebAssembly (WASM) only project. It will be hosted as a static website. All data will be kept in local storage on the client only. The UI will be formatted for easy use on a phone, but should be responsive and useable on a tablet or PC. The name of the project will be Mage because it is a scorekeeping app for the card game Wizard.

Mage will keep the history of all games played, but older games can be cleared out to save on local storage. Games can be interrupted and resumed over multiple days, and multiple active games can be in progress at the same time. Only one game can be open and contributed to at once.

The overall application should be polished and attractive like a professional mobile application. All user entry and game progress will be committed to local storage as soon as it is entered by the user without the need for any “save” buttons. Overall the biggest font will be used that allows the application to be easily seen on a phone screen. Vertical scrolling is allowed but should be avoided whenever possible. Horizontal Scrolling is not allowed. Use adaptive font sizes based on screen width.

The application will be structured using components to avoid any duplication of code wherever possible.

If there are browser restrictions to how much local storage an application is allowed, older games can be automatically removed to make space available for newer games without prompting the user.

**1\. Home Screen AKA Game History screen:**

This is a simple grid of games played. The most recent games at the top.

For each game, the grid will show the start date, the number of players, the player initials (comma separated list), a completed/in progress indicator icon, and the next round number (for in progress games only). The grid rows of the incomplete games should be tall and easy to press with a finger, the completed rows can be smaller to save on screen space. Pressing an incomplete game row navigates to the “**game in progress screen”** for the current round of that game. Pressing a complete game row navigates to the “**scoresheet** **view**” of that game.

On this screen will be a button to “clear history” which will empty all local storage and reset the screen. Also, there will be a “new game” button which will open “**the new game screen**”.

**2\. the new game screen:**

On this screen, users will see a prompt “please enter your player names and initials in player order and select the first dealer” followed by a grid of 6 rows. Label the rows:

- Player 1
- Player 2
- Player 3
- (Optional) Player 4
- (Optional) Player 5
- (Optional) Player 6

Each row will have a radio button (to select the first dealer), a textbox for name, and a textbox for initials (1 character minimum, 3 characters maximum). A minimum of 3 rows must be filled out (name and initials) before the user is allowed to continue. One of the filled out rows must be selected as first dealer.

Show a “Cancel” button which returns to the Home Screen.

Show a “Start Game” button that navigates to the “game in progress screen” when the player information is filled out correctly.

The first time a user comes to this screen, all information is blank. Each successive time the user navigates to “the new game screen”, the information is filled out with the details from their previous game, with the exception that the first dealer radio button has advanced to the next player automatically. For example, if there are only 3 player names filled out, and the previous game Player 3 was the first dealer, then Player 1 will be selected as first dealer. If there are 4 player names filled out, and the previous game Player 3 was the first dealer, then Player 4 will be selected as first dealer.

**Player Order:**

The players are entered in turn order or “from right to left”. Player 2 is “to the left” of Player 1. Player 3 is “to the left” of Player 2. Player 1 is "to the left” of the last player entered.

In each round of a game, the dealer advances from the selected “first dealer” for round one, to the player “on their left” for round two, then continues to each player in succession.

In each round of a game, the first player is always the player “on the left” of the dealer.

If a game is resumed after an interruption, the system will ensure that the correct round number, dealer and first player are assigned.

**3\. game in progress screen:**

This screen is the management and scoring of the current round of the game.

This screen will include the following elements:

Current game round number, the current dealer name, the current first player name, one “bid card” for each player, a “next round” button, an “undo” button, a “Home” button, “game over” button which is hidden, the scoresheet view button.

Each elements should be as big as possible on the screen to allow all players to see it from a distance without any scrolling. Please refer to the section above “Player Order” for more information on who should be displayed as the Dealer and the first player depending on round number.

Current game round number:

This will start at 1 for a new game and automatically advance by 1 each time the user clicks the “new round” button. The maximum value depends on the number of players:

- 3 Players: 20
- 4 Players: 15
- 5 Players: 12
- 6 Players: 10

After the maximum value of round number is obtained, the “next round” button is hidden and the “game over” button is shown in it’s place.

Bid Card:

Bid cards are only shown for the players will their names filled out.

The bid card shows the player’s initials, a textbox to enter their bid, and their current score, a button “success button” which is an icon of a happy face, a “fail” button that shows a sad face. The bid will be validated to be a number between zero and the current round number and will use the phone’s number keypad to enter it. The bid field will turn red if a user enters an invalid bid (outside the allowed range). Users can delete the contents of a bid field and change them to a different valid value until the “success” or “fail” buttons are clicked.

Current score for each player is 0 for Round 1.

If the “success” button is clicked, it will toggle as highlighted. The user will be counted as a “success” when the “next round” or “game over” buttons are clicked.

If the “fail” button is clicked, it will toggle as highlighted. A popup prompt will as “how many points do their loose”. Those loss points will be recorded when the “next round” or “game over” buttons are clicked. There is no default value of the lost points.

For each bid card, only one of the “fail” or “success” buttons can be clicked at a time. If the user makes a mistake and accidentally clicks the “success” they can correct this mistake by clicking the “fail” button, which will return the “success" button to an un-highlighted state. Similarly, if the user makes a mistake and accidentally clicks the “fail” they can correct this mistake by clicking the “success” button, which will return the “fail" button to an un-highlighted state.

“next round” button:

This button can only be clicked when “success” or “fail” for each bid card has been selected. The button is hidden as soon as the round number is advanced to the last round.

For each “fail”, the player’s “points do the loose” for the round is subtracted from their current score. For each success, the player’s bid plus two is added to their score.

After the scores are updated, advance the round number, update to the next dealer, update to the next first player, rest all bids to blank, reset the state of all “success” and “fail” to unselected.

Both negative current scores and tied scores are both valid.

“undo” button:

reset the state of all “success” and “fail” to unselected.

“Home” button:

Save the state of the game, if necessary, and return to the home screen. The game should be able to be resumed at any time in the future.

“game over” button:

This button is only visible on the last round of the game. It has the same validation rules and actions as the “next round” button and should share code whenever possible. The only difference is that instead of resetting the game in progress screen, after scores are updated it moves to the “game over screen”

“scoresheet view button”:

Navigates to the “scoresheet view” of the current game

**4\. scoresheet view**

This screen can be used for both in progress games and completed games. If it’s an in progress game, also shows a “continue” button which navigates to the “game in progress screen” for the current round. It also shows a home button to go back to the home screen.

This is a grid with the number of columns is the number of players plus one. There is a header row and then a number or rows equal to the number of rounds as determined by the number of players. In the first column is the round number (one per row, starting at 1 at the top and ending with the maximum round number at the bottom). For each row/column which represents a player in each round, show 3 numbers: their bid, their score for that round (either negative how many points they lost or their bid plus two), and their current score after that round was over. Any rounds which are not yet complete will be blank.

**5\. game over screen**

Both negative current scores and tied scores are both valid.

This will be a colorful animated celebration screen showing the name of the winner. (Or multiple winners if there is a tie) and showing the final score of each player. Show a distinct animation per winner. When it is displayed the game is considered completed and there is a button on the screen which allows the user to return to the home page.

Clarifications

\- older games should be deleted automatically only when storage limits are reached

\- If a player enters an invalid bid the bid box remain red until corrected. No animation or tooltip or pop-up is needed.

\- completed rounds do not need to be visually distinct from incomplete rounds because the cells of the rows will be empty -- Animations for the Game Over Screen do not need to be interactive. Animation can be as simple as a confetti bursts.