import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import '@radix-ui/themes/styles.css';
import { Avatar, Code, IconButton, Table, Theme } from '@radix-ui/themes';

import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Handle,
  Position,
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
      source_position: Position.Top,
      target_position: Position.Bottom,
    },
  },
  {
    id: '2a',
    type: 'ai',
    position: { x: -50, y: 250 },
    data: {
      model: 'TTS',
      source_position: Position.Top,
      target_position: Position.Right,
    },
  },
  {
    id: '2b',
    type: 'ai',
    position: { x: 250, y: 250 },
    data: {
      model: 'LLM',
      source_position: Position.Left,
      target_position: Position.Bottom,
    },
  },
  {
    id: '3',
    type: 'tool',
    position: { x: 250, y: 400 },
    data: {
      label: 'API Call 1',
      source_position: Position.Top,
      target_position: Position.Left,
    },
  },
  {
    id: '4',
    type: 'logic',
    position: { x: -50, y: 400 },
    data: {
      label: 'Condition 1',
      source_position: Position.Right,
      target_position: Position.Bottom,
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
      source_position: Position.Top,
      target_position: Position.Right,
    },
  },
  {
    id: '5b',
    type: 'ai',
    position: { x: 250, y: 550 },
    data: {
      model: 'LLM',
      source_position: Position.Left,
      target_position: Position.Bottom,
    },
  },
  {
    id: '6',
    type: 'io',
    position: { x: 250, y: 700 },
    data: {
      io_type: 'Output',
      data_type: 'Voice',
      source_position: Position.Top,
      target_position: Position.Bottom,
    },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '2a', target: '1', label: 'Process Data' },
  { id: 'e2-3', source: '2b', target: '2a', label: '' },
  { id: 'e3-4', source: '3', target: '2b', label: '' },
  { id: 'e5-6', source: '4', target: '3', label: '' },
  { id: 'e6-7', source: '5a', target: '4', label: '' },
  { id: 'e7-8', source: '5b', target: '5a', label: '' },
  { id: 'e8-9', source: '6', target: '5b', label: '' },
];

const IONode = ({ data }) => {
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
          </Flex>
        </HoverCard.Content>
      </Card>

      <Handle
        type="source"
        position={data?.source_position || Position.Bottom}
      />
      <Handle type="target" position={data?.target_position || Position.Top} />
    </HoverCard.Root>
  );
};

const AINodeHoverDetails = ({ data }) => {
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

const AINode = ({ data }) => {
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

        {AINodeHoverDetails({ data })}
      </Card>

      <Handle
        type="source"
        position={data?.source_position || Position.Bottom}
      />
      <Handle type="target" position={data?.target_position || Position.Top} />
    </HoverCard.Root>
  );
};

const ToolNode = ({ data }) => {
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
                {data?.endpoint || 'https://cawerwsd.apigateway.aws.com/api/v1'}
              </Text>
            </Flex>
          </Flex>
        </HoverCard.Content>
      </Card>

      <Handle
        type="source"
        position={data?.source_position || Position.Bottom}
      />
      <Handle type="target" position={data?.target_position || Position.Top} />
    </HoverCard.Root>
  );
};

const LogicNode = ({ data }) => {
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
                  <Code variant="solid">{data?.action || 'output-node-1'}</Code>
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
        </HoverCard.Content>
      </Card>

      <Handle
        type="source"
        position={data?.source_position || Position.Bottom}
      />
      <Handle type="target" position={data?.target_position || Position.Top} />
    </HoverCard.Root>
  );
};

const nodeTypes = {
  io: IONode,
  ai: AINode,
  tool: ToolNode,
  logic: LogicNode,
};

function HelloApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Theme>
      <div style={{ width: '90vw', height: '90vh' }}>
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
      </div>
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
