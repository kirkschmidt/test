import "dotenv/config";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import {
  VerifyDiscordRequest,
  getRandomEmoji,
  DiscordRequest,
} from "./utils.js";
import { getShuffledOptions, getResult } from "./game.js";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT ?? 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === "test") {
      console.log("test")
      console.log(req);
      
       return res.send({
         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
         data: {
          content: `Testing...`,
          },
       }); 
    }
    
    // "randomize"
    if (name === "game") {
      let numTeams = 2;
      let teams = new Array();
      
      for(let i = 0; i < req.body.data.options.length;i++)       {
                
        // Get list of players
        if(req.body.data.options[i]['name'] == "players") {
          var playerArray = req.body.data.options[i]['value'].split(" ")
          playerArray.sort(() => Math.random() - 0.5);
        }
        
        if(req.body.data.options[i]['name'] == "teams") {
          numTeams = req.body.data.options[i]['value'];
        }
       
      }
      
      // Create the teams 
      for(let i = 0; i < numTeams; i++) {
        teams[i] = new Array();
      } 
      
      var j = 0;
      var curPlayer;
      do {
        if(j > (numTeams - 1)) { j = 0; }
        curPlayer = playerArray.shift();
        teams[j].push(curPlayer);   
        j++;
      } while (playerArray.length > 0)
      
      var outputString = "";
      for(let j =0; j < numTeams; j++) {
        outputString = outputString + "Team " + (j+1) + ": " + teams[j].join(" ") + "\n"
      }
             
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `${outputString}`,
        },
      });
    }

  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
