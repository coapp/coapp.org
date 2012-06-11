using System;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using Microsoft.WindowsAzure;
using CoApp.Toolkit.Extensions;

/// <summary>
/// Summary description for Bus
/// </summary>
public class Bus {
    public static string topicName = "regenerateWebSite";
    private string connectionString;
    private NamespaceManager namespaceManager;
    private MessagingFactory factory;
    private MessageSender sender;
    private MessageReceiver allMessages;
    private static Bus instance = new Bus();

    public Bus() {
        connectionString = CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");
        namespaceManager = NamespaceManager.CreateFromConnectionString(connectionString);
        
        // Configure Topic Settings
        var td = new TopicDescription(topicName);
        td.MaxSizeInMegabytes = 5120;
        td.DefaultMessageTimeToLive = new TimeSpan(0, 1, 0);
        
        if (!namespaceManager.TopicExists(topicName)) {
            namespaceManager.CreateTopic(topicName);
        }

        factory = MessagingFactory.CreateFromConnectionString(connectionString);
        sender = factory.CreateMessageSender(topicName);

    }

    public static void SendRegenerateSiteMessage() {
        BrokeredMessage message = new BrokeredMessage("Regenerate site" );
        message.Properties["MessageNumber"] = DateTime.Now.Ticks;
        instance.sender.Send(message);
    }

    public string ReadMessage() {
        var n = 0;
        var result = "";
        allMessages = factory.CreateMessageReceiver("regenerateWebSite/subscriptions/AllMessages");
        while (n < 4) {
            BrokeredMessage message = allMessages.Receive();

            if (message != null) {
                try {
                    result += ("\r\nBody: " + message.GetBody<string>());
                    result += ("\r\nMessageID: " + message.MessageId);
                    result += ("\r\nMessageNumber: " + message.Properties["MessageNumber"]);
                    n = message.Properties["MessageNumber"].ToString().ToInt32();

                    // Remove message from subscription
                    message.Complete();
                }
                catch (Exception) {
                    // Indicate a problem, unlock message in subscription
                    message.Abandon();
                }
            }
        }
        return result;
    }
}