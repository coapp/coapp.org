//-----------------------------------------------------------------------
// <copyright company="CoApp Project">
//     Copyright (c) 2010-2012 Garrett Serack and CoApp Contributors. 
//     Contributors can be discovered using the 'git log' command.
//     All rights reserved.
// </copyright>
// <license>
//     The software is licensed under the Apache 2.0 License (the "License")
//     You may not use the software except in compliance with the License. 
// </license>
//-----------------------------------------------------------------------

namespace CoApp.Daemon {
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.ServiceBus;
    using Microsoft.ServiceBus.Messaging;
    using Microsoft.WindowsAzure;
    using CoApp.Toolkit.Extensions;
    using Toolkit.Utility;

    class CoAppRepositoryDaemonMain {
        public static string regenSiteTopic = "regenerateWebSite";

        private string connectionString;
        private NamespaceManager namespaceManager;
        private MessagingFactory factory;
        private MessageSender sender;
        private MessageReceiver allMessages;
        private bool _running;
        private long maxMessage = 0;
        private ProcessUtility _cmdexe = new ProcessUtility("cmd.exe");

        static void Main(string[] args) {
            new CoAppRepositoryDaemonMain().Go();
        }

        public CoAppRepositoryDaemonMain() {
            connectionString = CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");
            namespaceManager = NamespaceManager.CreateFromConnectionString(connectionString);

            // Configure Topic Settings
            var td1 = new TopicDescription(regenSiteTopic) {
                MaxSizeInMegabytes = 5120,
                DefaultMessageTimeToLive = new TimeSpan(0, 1, 0)
            };

            if (!namespaceManager.TopicExists(regenSiteTopic)) {
                namespaceManager.CreateTopic(regenSiteTopic);
            }

            factory = MessagingFactory.CreateFromConnectionString(connectionString);
            _running = true;
        }


        public void Go() {
            // 1. 'regenerate-site' message (for calling our local script to regenerate our site)
            Task.Factory.StartNew(HandleRegenerateSite);
            
            while( _running ) {
                Thread.Sleep(5000);
                Console.Write(".");
            }
        }

        public void HandleRegenerateSite() {
            long n = 0;

            allMessages = factory.CreateMessageReceiver(regenSiteTopic + "/subscriptions/AllMessages", ReceiveMode.PeekLock);
            while (_running) {
                BrokeredMessage message = allMessages.Receive();

                if (message != null) {
                    // let the message go back to the pool
                    Int64.TryParse(message.Properties["MessageNumber"].ToString(), out n);
                    message.Abandon();

                    try {
                        
                        if( n > maxMessage ) {
                            maxMessage = n;
                            Console.WriteLine("\r\nAccepted message to regenerate site: {0} ",n);
                            RebuildWebsite();
                        }
                        else {
                            // Console.WriteLine("\r\nSkipping: {0} ",n);
                        }
                    }
                    catch (Exception) {
                    }
                    Thread.Sleep(8000); // wait 5 seconds to give other consumers a chance on this message.
                }
            }
        }

        private void RebuildWebsite() {
            Task.Factory.StartNew(() => {
                try {
                    Console.WriteLine("Rebuilding website.");
                    Environment.CurrentDirectory = Environment.GetEnvironmentVariable("STORAGE");
                    if (_cmdexe.Exec(@"/c rebuild_site.cmd") != 0) {
                        Console.WriteLine("Site rebuild result:\r\n{0}", _cmdexe.StandardOut);
                        return;
                    }
                    Console.WriteLine("Rebuilt Website.");
                }
                catch (Exception e) {
                }
            });
        }
    }
}
