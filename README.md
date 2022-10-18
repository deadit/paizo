# Ergohack V Submission: Paizo

παίζω | Simplified transliteration: paizo | Definition: to play in the manner of children

Goal: Create a playground for miners and users to learn and understand miner governance on Ergo.

**Team members**

**Noah (@NoahErgo)**: Project idea, visual mockups, execution feedback 
**Dmitry Usov (@deadit)**: Development, idea streamlining, implementation

___ 

## Background

For Ergohack V, Dmitry and Noah teamed up to execute an idea that Noah had after the mining difficulty adjustment situation last month. Noah saw that many miners did not understand the role of on-chain governance on Ergo. Noah even saw some miner influencers ask where the discord vote was, so they could vote on the hard fork.

It was clear that we as a community need something to better educate miners about governance parameters so they can be more informed about their role as stewards of the blockchain.

So for Ergohack we have put together a governance simulator inspired by the [SigmaUSD Playground by ABChris](https://sigusd.abchris.xyz/) (creator of [ergo.watch](https://ergo.watch/)).

Noah is not a developer so Noah created mockups and descriptions of the ideas Noah had based on the [governance documentation](https://docs.ergoplatform.com/mining/governance/) which we have also included in our project demo. Dmitry took my ideas and mockups and created the demo with iterative feedback.

## Initial mockup

<img width="609" alt="image" src="https://user-images.githubusercontent.com/26635501/196411057-653ea2ad-f9b0-4e9d-8e20-6b9d9b567234.png">
First mockup Noah created in figma and presented to Dmitry to present my idea

Basic idea was to have a table with all of the parameters that gets info from the current network state and will show updated information as the epoch simulation is run.

There are several pools that the user can select which parameters they want to propose a change and vote for.

As you can see, the basic structure of the mockup has been achieved in the working app. Dmitry vastly improved the network parameter table that Noah initially presented. Dmitry has also added a section to try to better explain the governance process.

There are still some features that are missing from the mockup that did not make it into our MVP such as variable hashrate (choosing from H/s, MH/s, TH/s, etc.), floating tooltips on parameter IDs to communicate more information, and percentages to show which pools voted for which parameters.
