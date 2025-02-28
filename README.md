# Dopewars Browser Game

A browser-based implementation of the classic Dopewars game, where players buy and sell drugs across different locations to make a profit while avoiding the cops.

## About the Game

Dopewars is a turn-based strategy game where you play as a drug dealer trying to make as much money as possible within a limited number of days. The game simulates a simplified drug market with fluctuating prices across different locations.

### Game Mechanics

- **Buy Low, Sell High**: The core gameplay revolves around buying drugs at low prices and selling them at higher prices in different locations.
- **Limited Time**: You have 30 days to make as much money as possible.
- **Debt Management**: You start with debt that accrues interest each day, so paying it off is important.
- **Random Events**: Police encounters and other random events can affect your inventory and cash.
- **Location Travel**: Moving between locations changes the market prices, creating opportunities for profit.

## How to Play

1. **Setup**: Open `index.html` in a web browser to start the game.
2. **Buying Drugs**: Click the "Buy" button, select a drug, adjust the quantity, and confirm.
3. **Selling Drugs**: Click the "Sell" button, select a drug from your inventory, adjust the quantity, and confirm.
4. **Moving**: Click the "Move" button to travel to a new random location with different prices.
5. **Paying Debt**: Click the "Pay Debt" button to reduce your debt and avoid excessive interest.
6. **Game End**: After 30 days, the game ends and your final net worth (cash minus debt) is displayed.

## Game Tips

- Pay attention to price spikes (very high prices) and drops (very low prices) for maximum profit.
- Balance paying off debt with having cash available for purchases.
- Moving to a new location costs a day but can lead to better prices.
- Watch out for police encounters which can cost you money or drugs.
- Try to pay off your debt early to minimize interest payments.

## Technical Details

The game is built using:
- HTML5
- CSS3
- Vanilla JavaScript (no frameworks)

## Local Development

To run the game locally:

1. Clone this repository
2. Open `index.html` in your browser
3. No build steps or server required!

## Future Enhancements

Potential future improvements:
- More locations with unique characteristics
- Additional random events
- Inventory capacity limits
- Police heat level that increases with larger transactions
- Ability to take out additional loans
- Saving game progress

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

This game is inspired by the original Dopewars game created by Ben Webb, which itself was based on the classic game "Drug Wars" by John E. Dell.
