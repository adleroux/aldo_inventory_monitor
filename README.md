# Shoe Store

## Synopsis

Aldo Shoes is having a huge flash sale online. You provide support to the inventory department. They want to react real-time to various inventory problems as they arise.

You adjust the inventory whenever a new sale is completed. The return value includes the store, the shoe model and the inventory left for that shoe model in the store.

```
{
  'store' => 'ALDO Ste-Catherine',
  'model' => 'ADERI',
  'inventory' => 10,
}
```

`ALDO Ste-Catherine` store sold a pair of `ADERI` shoes. `ALDO Ste-Catherine` now has 10 pairs of `ADERI` left.

## Solution

### Overview

The solution consists of a **real-time web interface** built with **Ruby on Rails** that monitors Aldo's stores and their shoe inventory. This interface provides live updates, alerts for inventory levels, and transfer suggestions between stores.

### Features

1. **Real-time Inventory Monitoring:**
   - Displays the latest inventory updates in a table format, with each store represented as a column and each shoe model represented as a row.

2. **Alerting System:**
   - Alerts the user when the inventory of a shoe model in a store goes too low (below 10) or too high (above or equal to 90). The alerts remain visible until the inventory is updated.

3. **Transfer Suggestions:**
   - Automatically suggests shoe transfers between stores when one store has low stock and another has high stock. The suggestions are displayed at the top of the interface.

4. **Real-time Updates Using WebSockets:**
   - Utilizes WebSockets for real-time communication. The system listens to incoming inventory updates and updates the interface accordingly.

5. **Interactive Interface:**
   - The web page dynamically updates in real-time with changes to the inventory, using JavaScript to handle incoming messages and modify the DOM.

### Files and Directories

- `app/javascript/channels/inventory_channel.js`: Handles WebSocket connections and updates the inventory data on the page in real time.
- `app/views/inventory/index.html.erb`: Main HTML page for the inventory interface.
- `inventory.rb`: Ruby WebSocket server script to simulate the inventory data stream.
- `bin/websocketd`: WebSocket daemon to manage real-time communication.

## Goal

**Design an interface that would allow the inventory department to monitor Aldo's stores and shoes inventory.**

Hope you’ll have fun with this little test. I know I had designing it.
Go wild. It can be anything you want. I’ve seen results printed to console, displayed on a webpage, and even someone who did periodical database dumps.

Here are a few ideas if you need an extra challenge:

- Add some sort of alerting system, e.g. When a shoe model at a store goes too low, or too high.
- Add a REST JSON API, or GraphQL
- Suggest shoe transfers from one store to another according to inventory
- Your own crazy idea!

Share your repository with us when you’re done.

Happy Hacking :)

## Installation

This projects uses the popular library `websocketd` to send messages.

If you're on a Mac, you can install `websocketd` using [Homebrew](http://brew.sh/). Just run `brew install websocketd`. For other operating systems, or if you don't want to use Homebrew, check out the link below.

**[Download for Linux, OS X and Windows](https://github.com/joewalnes/websocketd/wiki/Download-and-install)**

Note that a Ubuntu 64-bit version is already bundled here `bin/websocketd` for convenience.

## Getting Started

### Inventory Server

Your WebSocket Server is the tap that aggregates inventories from all stores.

You can run it directly from your own machine.

Run the following to start tapping into the inventory events.

```
(bin/)websocketd --port=8080 ruby inventory.rb
```

You now have an active connection to their stores opened on port 8080.

### Start listening on each event

Listen and react on each event using a WebSocket client.

Various implementations are at your disposal. Whatever floats your boat.

They all work the same way. Provide a method or a block to be executed whenever a new event occurs.

Here are two examples for our favorite languages:

#### Javascript

Open a console on a non-secured page:

```
var ws = new WebSocket('ws://localhost:8080/');

ws.onmessage = function(event) {
  console.log(event.data);
};
```

#### Ruby

##### Installation

```
gem install faye-websocket
gem install eventmachine
```

##### Example

```
require 'faye/websocket'
require 'eventmachine'
require 'json'

EM.run {
  ws = Faye::WebSocket::Client.new('ws://localhost:8080/')

  ws.on :message do |event|
    p JSON.parse(event.data)
  end
}
```
