import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import '@radix-ui/themes/styles.css';
import { Avatar, Box, Code, IconButton, Table, Theme } from '@radix-ui/themes';
import { v4 as uuidv4 } from 'uuid';

import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import {
  Card,
  DropdownMenu,
  Slider,
  Select,
  TextField,
  Flex,
  Button,
  Text,
  Tooltip,
  HoverCard,
} from '@radix-ui/themes';
import {
  MixerHorizontalIcon,
  DotsHorizontalIcon,
  PaperPlaneIcon,
  TrashIcon,
  PlusIcon,
  LightningBoltIcon,
  GearIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';

import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'io',
    position: { x: -50, y: 100 },
    data: {
      io_type: 'Input',
      data_type: 'Voice',
      source_position: Position.Bottom,
      target_position: Position.Top,
    },
  },
  {
    id: '2a',
    type: 'ai',
    position: { x: -50, y: 250 },
    data: {
      model: 'TTS',
      source_position: Position.Right,
      target_position: Position.Top,
    },
  },
  {
    id: '2b',
    type: 'ai',
    position: { x: 250, y: 250 },
    data: {
      model: 'LLM',
      source_position: Position.Bottom,
      target_position: Position.Left,
    },
  },
  {
    id: '3',
    type: 'tool',
    position: { x: 250, y: 400 },
    data: {
      label: 'API Call 1',
      source_position: Position.Left,
      target_position: Position.Top,
    },
  },
  {
    id: '4',
    type: 'logic',
    position: { x: -50, y: 400 },
    data: {
      label: 'Condition 1',
      source_position: Position.Bottom,
      target_position: Position.Right,
      conditions: [
        { source: 'API Response', operator: 'contains', value: 'success' },
      ],
      addCondition: () => {},
      removeCondition: () => {},
    },
  },
  {
    id: '5a',
    type: 'ai',
    position: { x: -50, y: 550 },
    data: {
      model: 'STT',
      source_position: Position.Right,
      target_position: Position.Top,
    },
  },
  {
    id: '5b',
    type: 'ai',
    position: { x: 250, y: 550 },
    data: {
      model: 'LLM',
      source_position: Position.Bottom,
      target_position: Position.Left,
    },
  },
  {
    id: '6',
    type: 'io',
    position: { x: 250, y: 700 },
    data: {
      io_type: 'Output',
      data_type: 'Voice',
      source_position: Position.Bottom,
      target_position: Position.Top,
    },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2a',
    label: 'Process Data',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e2-3',
    source: '2a',
    target: '2b',
    label: '',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e3-4',
    source: '2b',
    target: '3',
    label: '',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e5-6',
    source: '3',
    target: '4',
    label: '',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e6-7',
    source: '4',
    target: '5a',
    label: '',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e7-8',
    source: '5a',
    target: '5b',
    label: '',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e8-9',
    source: '5b',
    target: '6',
    label: '',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

function HelloApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleAddNode = (nodeType) => {
    const newNode = {
      id: uuidv4(),
      type: nodeType,
      position: { x: 100, y: 100 },
      data: {},
    };

    setNodes([...nodes, newNode]);
  };

  const handleDeleteNode = (nodeId) => {
    setNodes([...nodes.filter((n) => n.id !== nodeId)]);
  };

  const IONode = ({ id, data }) => {
    return (
      <HoverCard.Root>
        <Card>
          <Flex gap="3" align="center">
            <Avatar size="3" radius="full" fallback="🖥️" />
            <Flex direction="column">
              <Flex gap="2" align="center">
                <Text size="3" weight="bold">
                  I/O Node
                </Text>
                <HoverCard.Trigger>
                  <InfoCircledIcon />
                </HoverCard.Trigger>
              </Flex>
              <Text size="1">{data?.io_type || 'Output'}</Text>
            </Flex>
          </Flex>

          <HoverCard.Content maxWidth="300px">
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="0">
                <Text size="2" as="div" weight="bold">
                  I/O Type
                </Text>
                <Text size="1" as="div">
                  {data?.io_type || 'Output'}
                </Text>
              </Flex>

              <Flex direction="column" gap="0">
                <Text size="2" as="div" weight="bold">
                  Data Type
                </Text>
                <Text size="1" as="div">
                  {data?.data_type || 'text'}
                </Text>
              </Flex>

              <Button
                variant="soft"
                color="crimson"
                onClick={() => handleDeleteNode(id)}
              >
                <TrashIcon /> Delete Node
              </Button>
            </Flex>
          </HoverCard.Content>
        </Card>

        <Handle
          type="source"
          position={data?.source_position || Position.Bottom}
        />
        <Handle
          type="target"
          position={data?.target_position || Position.Top}
        />
      </HoverCard.Root>
    );
  };

  const AINodeHoverDetails = ({ id, data }) => {
    const LLM_Details = (
      <HoverCard.Content maxWidth="300px">
        <Flex direction="column" gap="3">
          <Flex direction="column" gap="0">
            <Text size="2" as="div" weight="bold">
              Provider
            </Text>
            <Text size="1" as="div">
              {data?.llm?.provider || 'OpenAI'}
            </Text>
          </Flex>

          <Flex direction="column" gap="0">
            <Text size="2" as="div" weight="bold">
              Model
            </Text>
            <Text size="1" as="div">
              {data?.llm?.model || 'gpt-4o'}
            </Text>
          </Flex>

          <Flex direction="column" gap="0">
            <Text size="2" as="div" weight="bold">
              System Prompt
            </Text>
            <Text size="1" as="div">
              {data?.llm?.prompt || 'No prompt configured'}
            </Text>
          </Flex>

          <Button
            variant="soft"
            color="crimson"
            onClick={() => handleDeleteNode(id)}
          >
            <TrashIcon /> Delete Node
          </Button>
        </Flex>
      </HoverCard.Content>
    );

    const TTS_Details = (
      <HoverCard.Content maxWidth="300px">
        <Flex direction="column" gap="3">
          <Flex direction="column" gap="0">
            <Text size="2" as="div" weight="bold">
              Model
            </Text>
            <Text size="1" as="div">
              {data?.llm?.model || 'deepgram'}
            </Text>
          </Flex>

          <Flex direction="column" gap="0">
            <Text size="2" as="div" weight="bold">
              Voice
            </Text>
            <Text size="1" as="div">
              {data?.llm?.voice || 'Indian'}
            </Text>
          </Flex>

          <Button
            variant="soft"
            color="crimson"
            onClick={() => handleDeleteNode(id)}
          >
            <TrashIcon /> Delete Node
          </Button>
        </Flex>
      </HoverCard.Content>
    );

    switch (data?.model) {
      case 'LLM':
        return LLM_Details;

      case 'TTS':
      case 'STT':
        return TTS_Details;

      default:
        return LLM_Details;
    }
  };

  const AINode = ({ id, data }) => {
    return (
      <HoverCard.Root>
        <Card>
          <Flex gap="3" align="center">
            <Avatar size="3" radius="full" fallback="🧠" />
            <Flex direction="column">
              <Flex gap="2" align="center">
                <Text size="3" weight="bold">
                  AI Node
                </Text>
                <HoverCard.Trigger>
                  <InfoCircledIcon />
                </HoverCard.Trigger>
              </Flex>
              <Text size="1">{data?.model || 'LLM'}</Text>
            </Flex>
          </Flex>

          {AINodeHoverDetails({ id, data })}
        </Card>

        <Handle
          type="source"
          position={data?.source_position || Position.Bottom}
        />
        <Handle
          type="target"
          position={data?.target_position || Position.Top}
        />
      </HoverCard.Root>
    );
  };

  const ToolNode = ({ id, data }) => {
    return (
      <HoverCard.Root>
        <Card>
          <Flex gap="3" align="center">
            <Avatar size="3" radius="full" fallback="🔧" />
            <Flex direction="column">
              <Flex gap="2" align="center">
                <Text size="3" weight="bold">
                  Tool Node
                </Text>
                <HoverCard.Trigger>
                  <InfoCircledIcon />
                </HoverCard.Trigger>
              </Flex>
              <Text size="1">REST API</Text>
            </Flex>
          </Flex>

          <HoverCard.Content maxWidth="300px">
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="0">
                <Text size="2" as="div" weight="bold">
                  Integration Type
                </Text>
                <Text size="1" as="div">
                  {data?.type || 'API Connection'}
                </Text>
              </Flex>

              <Flex direction="column" gap="0">
                <Text size="2" as="div" weight="bold">
                  Protocol
                </Text>
                <Text size="1" as="div">
                  {data?.protocol || 'REST'}
                </Text>
              </Flex>

              <Flex direction="column" gap="0">
                <Text size="2" as="div" weight="bold">
                  Method
                </Text>
                <Text size="1" as="div">
                  {data?.method || 'GET'}
                </Text>
              </Flex>

              <Flex direction="column" gap="0">
                <Text size="2" as="div" weight="bold">
                  Endpoint
                </Text>
                <Text size="1" as="div">
                  {data?.endpoint ||
                    'https://cawerwsd.apigateway.aws.com/api/v1'}
                </Text>
              </Flex>

              <Button
                variant="soft"
                color="crimson"
                onClick={() => handleDeleteNode(id)}
              >
                <TrashIcon /> Delete Node
              </Button>
            </Flex>
          </HoverCard.Content>
        </Card>

        <Handle
          type="source"
          position={data?.source_position || Position.Bottom}
        />
        <Handle
          type="target"
          position={data?.target_position || Position.Top}
        />
      </HoverCard.Root>
    );
  };

  const LogicNode = ({ id, data }) => {
    return (
      <HoverCard.Root>
        <Card>
          <Flex gap="3" align="center">
            <Avatar size="3" radius="full" fallback="💡" />
            <Flex direction="column">
              <Flex gap="2" align="center">
                <Text size="3" weight="bold">
                  Logic Node
                </Text>
                <HoverCard.Trigger>
                  <InfoCircledIcon />
                </HoverCard.Trigger>
              </Flex>
              <Text size="1">Validation</Text>
            </Flex>
          </Flex>

          <HoverCard.Content maxWidth="400px">
            <Flex direction="column" gap="3">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell width="250px">
                      Condition
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width="150px">
                      Action
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.RowHeaderCell>
                      <Code>{data?.condition || 'response.status == 200'}</Code>
                    </Table.RowHeaderCell>
                    <Table.Cell>
                      <Code variant="solid">
                        {data?.action || 'output-node-1'}
                      </Code>
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.RowHeaderCell>
                      <Code>{data?.condition || 'response.status == 404'}</Code>
                    </Table.RowHeaderCell>
                    <Table.Cell>
                      <Code variant="solid" color="crimson">
                        {data?.action || 'output-node-2'}
                      </Code>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>

              <Button
                variant="soft"
                color="crimson"
                onClick={() => handleDeleteNode(id)}
              >
                <TrashIcon /> Delete Node
              </Button>
            </Flex>
          </HoverCard.Content>
        </Card>

        <Handle
          type="source"
          position={data?.source_position || Position.Bottom}
        />
        <Handle
          type="target"
          position={data?.target_position || Position.Top}
        />
      </HoverCard.Root>
    );
  };

  const nodeTypes = {
    io: IONode,
    ai: AINode,
    tool: ToolNode,
    logic: LogicNode,
  };

  return (
    <Theme>
      <Flex>
        <Box width="80vw" height="100vh">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            minZoom={0.25}
            maxZoom={2}
          >
            <Background gap={24} variant="dots" size={1} />

            <Controls />
          </ReactFlow>
        </Box>

        <Box p="2">
          <Flex direction="column" gap="3">
            <Text size="2" weight="bold" as="div">
              Controls
            </Text>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft">
                  Add Node
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content>
                {[
                  {
                    icon: '🖥️',
                    label: 'I/O Node',
                    value: 'io',
                  },
                  {
                    icon: '🧠',
                    label: 'AI Node',
                    value: 'ai',
                  },
                  {
                    icon: '🔧',
                    label: 'Tool Node',
                    value: 'tool',
                  },
                  {
                    icon: '💡',
                    label: 'Logic Node',
                    value: 'logic',
                  },
                ].map((dt, i) => (
                  <DropdownMenu.Item
                    key={i}
                    onSelect={() => handleAddNode(dt.value)}
                  >
                    <Flex align="center" gap="3">
                      <Box>{dt.icon}</Box>
                      {dt.label}
                    </Flex>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Box>
      </Flex>
    </Theme>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HelloApp />} />
      </Routes>
    </Router>
  );
}
