# CoinBubble-PragmaCairoHackathon
An elimination game

## Project Description 

Coin Bubble is a tile-matching game, where players have to find and remove tiles that are the same.

In each season, there are 160 levels in total that user can play, each of which contains 5 rounds of games. Within one season, later levels are more difficult than those earlier ones. Within each level, later rounds are also more difficult than earlier ones.

After players finish one level, they will get points. The amount of points they get in this level depends on their game strategy. For example, removing 3 tiles at a time earns you more points than removing only 2. Usually later levels will give players more points as the number of tiles increases. Our leaderboard will show players with the highest points earned in ANY level.

Players will have to pay an entrance fee in order to participate in a season. At the end of the season, those players on our leaderboard will be rewarded using the entrance fee we collected.

## How it's Made
Here is an overview of our technology stack and how we combine them together.

### Smart Contracts
We use the Cairo 1.0 programming language. Cairo is a high-level language with strong code readability and ease of understanding. Many features of Cairo are inspired by Rust, giving it excellent security and performance in contract development. 

Additionally, we use the ProtoStar framework for contract testing and deployment during the development process, allowing us to focus on the contract implementation itself without worrying about the learning curve or additional errors that may arise from testing in JavaScript/TypeScript/Python, etc.

### Front-end
 We utilize LayaAir3 as our front-end display rendering engine. Combined with the convenient API provided by the Starknet.js framework, we can build fast, responsive, modular, and visually appealing interfaces. This engine runs on the Node.js runtime environment and seamlessly interacts with smart contracts and back-end services, perfectly adapting to the web3 development environment.

### Back-end
We employ third-party libraries such as the DOJO framework to construct the server framework, enabling us to rapidly develop game content. This allows us to focus more on the creation and ideation of the core game content.

### ChatGPT-4 
To expedite our development process, we occasionally consult OpenAI's advanced language model for suggestions. Through interactions with OpenAI, we gain inspiration and improve our product.

### Midjourney
Our team doesn't include graphic designers, so we utilize Midjourney's intelligent AI to generate the artistic materials required for the game's front-end. As you can see, its performance is exceptional.

## Sponsor technology
### Herodotus
We have utilized the cross-chain query service provided by Herodotus, which gives us a significant advantage in implementing user migration or score integration statistics - efficient and convenient. It greatly simplifies our workflow, enabling us to complete complex tasks in a short time, an advantage we cannot find elsewhere. PS: Thanks to @beeinger for the patient answers, we have learned a lot from them. (https://github.com/liushuheng163/CoinBubble-PragmaCairoHackathon/tree/main/pacakages/herodotus)

### Checkpoint
We use the checkpoint to index starknet data to help us quickly and easily view user score records and total score distribution. This aids us in adjusting the game difficulty and incentive rewards in the later stages. (https://github.com/liushuheng163/checkpoint-coin-bubble)

### DOJO
Dojo uses ECS (Entity Component System) as an architectural pattern to effectively manage and organize the state and behavior of Autonomous Worlds (AW). In this pattern, computations are defined as a list of systems running on a set of entities, each entity consisting of a dynamic set of pure data components. Systems select entities to process through persistent, efficient queries of entity components.

This framework is not only powerful but also flexible. It greatly simplifies our development process, allowing us to focus more on game design and innovation. The advantages of this framework lie not only in its efficiency and ease of use, but more importantly, it gives us unparalleled creative freedom. We can easily implement various complex game mechanics through it, creating a rich and diverse game world. Its strong expressiveness makes our game more attractive and engaging.

### ArgentX
We use ArgentX's account wallet for game contract testing.




### Project package structure

```shell
└── pacakages
    ├── client                            --- game client
    │   ├── assets                        --- game assets
    │   │ 
    │   │
    │   └── src                           --- game logic
    │       ├── common
    │       ├── game
    │       └── scene
    ├── game                              --- game contract part
    │   ├── contracts                     --- game contract
    │   │  
    │   └── deploy                        --- contract deploy
    │
    └── herodotus                         --- herodotus
```

## QuickStart

## 1.build game client

```shell
pnpm install 
```

## 2.build dojo

Refer to the sub -document configuration of the local environment, the Cairo environment, and the dojo development component
[build dojo](https://github.com/liushuheng163/CoinBubble-PragmaCairoHackathon/tree/main/pacakages/game/contracts)



## 3.build deploy
Refer to this document for the convenience of constructing contracts and deployment contracts to Starknet
[build deploy](https://github.com/liushuheng163/CoinBubble-PragmaCairoHackathon/blob/main/pacakages/game/deploy/README.md)


## 4.download laya ide



## 5.import project
Just import the client package

## 6.have fun！
