import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Separator,
  Spinner,
  Text,
  TextField,
  Theme,
} from '@radix-ui/themes';
import { ArrowUpIcon } from '@radix-ui/react-icons';
import { v4 as uuidv4 } from 'uuid';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockConversation = [
  {
    id: 1,
    role: 'user',
    message: 'Hi, I need help with my account.',
    timestamp: '2025-05-16T10:00:00Z',
  },
  {
    id: 2,
    role: 'agent',
    message: 'Sure! Can you please provide more details about the issue?',
    timestamp: '2025-05-16T10:01:00Z',
  },
  {
    id: 3,
    role: 'user',
    message: "I forgot my password and can't log in.",
    timestamp: '2025-05-16T10:02:00Z',
  },
  {
    id: 4,
    role: 'agent',
    message:
      "No problem! You can reset your password using the 'Forgot Password' link on the login page.",
    timestamp: '2025-05-16T10:03:00Z',
  },
  {
    id: 5,
    role: 'user',
    message: "Thanks! I'll try that.",
    timestamp: '2025-05-16T10:04:00Z',
  },
  {
    id: 6,
    role: 'agent',
    message: "You're welcome! Let me know if you need further assistance.",
    timestamp: '2025-05-16T10:05:00Z',
  },
];

const mockSuggestions = [
  'What does my policy cover?',
  'How do I add a dependent to my insurance plan?',
  'What is the premium amount for my plan?',
];

const BotUI = () => {
  const [conversation, setConversation] = useState(mockConversation);
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behaviour: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (suggestion) => {
    if (suggestion || inputValue.trim()) {
      if (suggestion) setSuggestions([]);
      setInputValue('');

      const newMessage = {
        id: uuidv4(),
        role: 'user',
        message: suggestion || inputValue,
        timestamp: new Date().toISOString(),
      };

      const loader = {
        id: uuidv4(),
        role: 'loader',
        message: '',
        timestamp: new Date().toISOString(),
      };

      const tempConversation = [...conversation];
      tempConversation.push(newMessage);
      tempConversation.push(loader);

      setConversation(tempConversation);

      await sleep(1000);

      tempConversation.splice(tempConversation.length - 1, 1);

      const mockAgentResponse = {
        id: uuidv4(),
        role: 'agent',
        message:
          'I am brainless for now, soon i will be able to answer your questions, thanks!',
        timestamp: new Date().toISOString(),
      };

      tempConversation.push(mockAgentResponse);
      setConversation(tempConversation);
      setSuggestions(mockSuggestions);
    }
  };

  return (
    <Theme>
      <Box>
        <Flex direction="column" gap="3" height="100vh" p="4">
          <Flex gap="3" align="center" justify="between" px="8">
            <Flex width="25vw" align="center">
              <img
                src="/images/cigna-logo.png"
                alt="logo"
                width="120px"
                height="70px"
                style={{ objectFit: 'cover' }}
              />
            </Flex>
            <Flex width="35vw" align="center" justify="center">
              <Text size="4" weight="medium">
                Mavins
              </Text>
            </Flex>
            <Flex width="25vw" align="center" justify="end">
              <Button
                size="2"
                variant="outline"
                onClick={() => setConversation(mockConversation)}
              >
                New Chat
              </Button>
            </Flex>
          </Flex>
          <Separator my="2" size="4" />

          <Flex flexGrow="1" direction="column" justify="end">
            <Flex
              direction="column"
              width="50vw"
              maxHeight="75vh"
              mx="auto"
              overflow="scroll"
            >
              {conversation.map((c) => {
                if (c.role === 'loader')
                  return (
                    <Flex align="center" my="2">
                      <Spinner size="3" />
                    </Flex>
                  );

                return (
                  <Flex
                    key={c.id}
                    align="center"
                    justify={c.role === 'user' ? 'end' : 'start'}
                    my="2"
                  >
                    <Text
                      style={{
                        color: c.role === 'user' ? 'white' : 'var(--gray-12)',
                        backgroundColor:
                          c.role === 'user'
                            ? 'var(--indigo-9)'
                            : 'var(--gray-3)',
                        padding: 10,
                        borderRadius: 10,
                        maxWidth: '80%',
                      }}
                    >
                      {c.message}
                    </Text>
                  </Flex>
                );
              })}

              <Box overflowX="scroll" mt="2">
                <Flex align="center" gap="3" width="1000px">
                  {suggestions.map((ms, i) => (
                    <Text
                      key={i}
                      style={{
                        color: 'var(--gray-10)',
                        backgroundColor: 'var(--gray-1)',
                        padding: 10,
                        borderRadius: 10,
                        borderColor: 'var(--gray-10)',
                        borderWidth: 1,
                      }}
                      onClick={() => handleSubmit(ms)}
                    >
                      {ms}
                    </Text>
                  ))}
                </Flex>
              </Box>

              <div ref={chatEndRef}></div>
            </Flex>
          </Flex>
          <Separator my="2" size="4" />

          <Flex gap="3" align="center" justify="center">
            <Box width="50vw">
              <TextField.Root
                placeholder="Ask mavin ..."
                size="3"
                radius="full"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
              >
                <TextField.Slot></TextField.Slot>
                <TextField.Slot>
                  <IconButton size="3" variant="ghost">
                    <ArrowUpIcon height="20" width="20" />
                  </IconButton>
                </TextField.Slot>
              </TextField.Root>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Theme>
  );
};

export default BotUI;
