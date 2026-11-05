import consumer from "channels/consumer"

// Being subscribed is what marks the user as online; the server handles heartbeats and last seen
consumer.subscriptions.create("PresenceChannel", {})
