import axios from "axios";
import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "../../components/custom/message";
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { useState } from "react";
import { message } from "../../interfaces/interfaces"
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import { v4 as uuidv4 } from 'uuid';

export function Chat() {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(text?: string) {
    if (isLoading) return;

    const userPrompt = text || question;
    if (!userPrompt) return; // Don't send an empty message

    setIsLoading(true);
    const traceId = uuidv4();
    
    // Add user message to the chat
    setMessages(prev => [...prev, { content: userPrompt, role: "user", id: traceId }]);
    setQuestion("");

    try {
      // Call the backend API to get teacher data
      const response = await axios.get(`http://localhost:8000/${encodeURIComponent(userPrompt)}`);
      
      if (response?.status === 200 && response.data.length > 0) {
        // Map over the API response and create a message object for each tutor
        const tutorMessages = response.data.map((item: any) => ({
          id: uuidv4(),
          role: "assistant",
          content: {
            name: item.name,
            age: item.age,
            gender: item.gender,
            profession_area: item.profession_area,
            hourly_price: item.hourly_price,
            rating: item.rating,
            experience_level: item.experience_level,
            location: item.location,
            photo_url: item['photo-url'],
            available_online: item.available_online,
            languages: item.languages,
            other_details: item.other_details
          }
        }));

        setMessages(prev => [...prev, ...tutorMessages]); // Spread all tutor messages
      } else {
        setMessages(prev => [...prev, { content: "No results found.", role: "assistant", id: uuidv4() }]);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages(prev => [...prev, { content: "An error occurred while fetching data.", role: "assistant", id: uuidv4() }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Header />
      <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4" ref={messagesContainerRef}>
        {messages.length === 0 && <Overview />}
        {messages.map((message, index) => (
          <PreviewMessage key={message.id} message={message} />
        ))}
        {isLoading && <ThinkingMessage />}
        <div className="shrink-0 min-w-[24px] min-h-[24px]" />
      </div>
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <ChatInput
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
