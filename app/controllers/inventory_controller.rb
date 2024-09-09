require "faye/websocket"
require "eventmachine"
require "json"

class InventoryController < ApplicationController
  def index
    @inventory_data = []

    EM.run do
      ws = Faye::WebSocket::Client.new("ws://localhost:8080/")

      ws.on :message do |event|
        inventory_event = JSON.parse(event.data)
        @inventory_data << inventory_event

        # Use ActionCable or similar to broadcast the data to the client-side in real-time
        ActionCable.server.broadcast("inventory_channel", inventory_event)
      end
    end
  end
end
