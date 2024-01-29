import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

const TEST_COMMAND = {
  name: 'test',
  description: 'For Testing Purposes Only',
  type: 1  
}

// Start a random list
const GAME_COMMAND = {
  name: 'game',
  description: 'Create a new random team game',
  type: 1,
  options: [
    {
      type: 3,
      name: 'players',
      description: 'Who is playing?',
      required: true,
    },
    {
      type: 4,
      name: 'teams',
      description: 'number of teams',
      default: 2
    },
  ],
};

const ALL_COMMANDS = [GAME_COMMAND, TEST_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);