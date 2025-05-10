import { useCallback, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import '@radix-ui/themes/styles.css';
import {
  Avatar,
  Box,
  Code,
  Dialog,
  Heading,
  IconButton,
  RadioGroup,
  Table,
  Theme,
} from '@radix-ui/themes';
import { v4 as uuidv4 } from 'uuid';
import Editor, { loader } from '@monaco-editor/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
  addEdge,
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
  Pencil1Icon,
  FileIcon,
} from '@radix-ui/react-icons';
import '@xyflow/react/dist/style.css';

loader.config({
  paths: {
    vs: '/monaco-editor/min/vs',
  },
});

const NODE_EDITOR = 'node-editor';
const ENV_EDITOR = 'env-editor';

const CustomHandle = (props) => (
  <Handle
    {...props}
    style={{ width: 1, height: 1, backgroundColor: 'lightgray' }}
  />
);

const edge_points = [
  {
    type: 'source',
    id: 's-b',
    position: Position.Bottom,
  },
  {
    type: 'target',
    id: 't-b',
    position: Position.Bottom,
  },
  {
    type: 'source',
    id: 's-t',
    position: Position.Top,
  },
  {
    type: 'target',
    id: 't-t',
    position: Position.Top,
  },
  {
    type: 'source',
    id: 's-r',
    position: Position.Right,
  },
  {
    type: 'target',
    id: 't-r',
    position: Position.Right,
  },
  {
    type: 'source',
    id: 's-l',
    position: Position.Left,
  },
  {
    type: 'target',
    id: 't-l',
    position: Position.Left,
  },
];

const initialNodes = [];
const initialEdges = [];

const addNodesDropDownData = [
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
  {
    icon: '🤖',
    label: 'Chatbot',
    value: 'chatbot',
  },
  {
    icon: '🟢',
    label: 'Start Node',
    value: 'start',
  },
  {
    icon: '🔴',
    label: 'End Node',
    value: 'end',
  },
];

function HelloApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogBoxType, setDialogBoxType] = useState('');
  const [dialogBoxData, setDialogBoxData] = useState({});

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

  const handleAddEdgePoint = (nodeId, pointType) => {};

  const onConnect = useCallback((params) => {
    setEdges((eds) => {
      const tempParams = {
        source: params.target,
        target: params.source,
        sourceHandle: `s-${params.targetHandle.split('-')[1]}`,
        targetHandle: `t-${params.sourceHandle.split('-')[1]}`,
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      return addEdge(tempParams, eds || []);
    });
  }, []);

  const DialogBox = ({ type, data }) => {
    switch (type) {
      case ENV_EDITOR:
        return (
          <Flex direction="column" gap="3">
            <Text size="3" weight="bold">
              Environment Variables
            </Text>

            <Editor
              height="400px"
              defaultLanguage="python"
              defaultValue="# KEY=VALUE"
              theme="light"
            />
          </Flex>
        );

      case NODE_EDITOR:
        return (
          <Flex direction="column" gap="3">
            <Text size="3" weight="bold">
              {`Edit ${data?.nodeName}`}
            </Text>

            {console.log(data)}
            {data?.component || <data.component />}
          </Flex>
        );

      default:
        return <>?</>;
    }
  };

  const NodeFooter = ({ id, dialogData }) => {
    return (
      <Flex direction="column" gap="3">
        <Flex gap="3">
          <Dialog.Trigger>
            <Button
              variant="soft"
              size="1"
              onClick={() => {
                setDialogBoxType(NODE_EDITOR);
                setDialogBoxData(dialogData);
              }}
            >
              <Pencil1Icon /> Edit
            </Button>
          </Dialog.Trigger>

          <Button
            variant="soft"
            color="crimson"
            onClick={() => handleDeleteNode(id)}
            size="1"
          >
            <TrashIcon /> Delete
          </Button>
        </Flex>
      </Flex>
    );
  };

  const StartNode = ({ id, data }) => {
    return (
      <>
        <Card>
          <Flex gap="3" align="center">
            <Avatar size="3" radius="full" fallback="🟢" />
            <Text size="3" weight="bold">
              START
            </Text>
          </Flex>
        </Card>

        {edge_points?.map((ep, i) => (
          <CustomHandle type={ep?.type} id={ep.id} position={ep?.position} />
        ))}
      </>
    );
  };

  const EndNode = ({ id, data }) => {
    return (
      <>
        <Card>
          <Flex gap="3" align="center">
            <Avatar size="3" radius="full" fallback="🔴" />
            <Text size="3" weight="bold">
              END
            </Text>
          </Flex>
        </Card>

        {edge_points?.map((ep, i) => (
          <CustomHandle type={ep?.type} id={ep.id} position={ep?.position} />
        ))}
      </>
    );
  };

  const IONodeEditor = ({ id }) => {
    return (
      <Formik
        initialValues={{
          ioType: 'input',
          dataType: 'string',
        }}
        onSubmit={() => {
          setDialogOpen(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">
                  IO Type
                </Text>

                <RadioGroup.Root
                  defaultValue="input"
                  type="ioType"
                  name="ioType"
                >
                  <Flex gap="3">
                    <RadioGroup.Item value="input">Input</RadioGroup.Item>
                    <RadioGroup.Item value="output">Output</RadioGroup.Item>
                  </Flex>
                </RadioGroup.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">
                  Data Type
                </Text>

                <RadioGroup.Root
                  defaultValue="string"
                  type="dataType"
                  name="dataType"
                >
                  <Flex gap="3">
                    <RadioGroup.Item value="string">
                      String Text
                    </RadioGroup.Item>
                  </Flex>
                </RadioGroup.Root>
              </Flex>

              <Flex gap="3">
                <Button>Save</Button>
              </Flex>
            </Flex>
          </Form>
        )}
      </Formik>
    );
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

              <NodeFooter
                id={id}
                dialogData={{
                  nodeName: 'IO Node',
                  component: IONodeEditor({ id }),
                }}
              />
            </Flex>
          </HoverCard.Content>
        </Card>

        {edge_points?.map((ep, i) => (
          <CustomHandle type={ep?.type} id={ep.id} position={ep?.position} />
        ))}
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

          {NodeFooter({ id })}
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

          {NodeFooter({ id })}
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

        {edge_points?.map((ep, i) => (
          <CustomHandle type={ep?.type} id={ep.id} position={ep?.position} />
        ))}
      </HoverCard.Root>
    );
  };

  const ChatBotNode = ({ id, data }) => {
    return (
      <HoverCard.Root>
        <Card>
          <Flex gap="3" align="center">
            <Avatar size="3" radius="full" fallback="🤖" />
            <Flex direction="column">
              <Flex gap="2" align="center">
                <Text size="3" weight="bold">
                  Chatbot
                </Text>
                <HoverCard.Trigger>
                  <InfoCircledIcon />
                </HoverCard.Trigger>
              </Flex>
              <Text size="1">OpenAI gpt-4o</Text>
            </Flex>
          </Flex>

          <HoverCard.Content maxWidth="300px">
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="0">
                <Text size="2" as="div" weight="bold">
                  State
                </Text>
                <Text size="1" as="div">
                  {data?.state || 'messages'}
                </Text>
              </Flex>

              <Flex direction="column" gap="0">
                <Text size="2" as="div" weight="bold">
                  LLM Provider
                </Text>
                <Text size="1" as="div">
                  {data?.provider || 'openai'}
                </Text>
              </Flex>

              <Flex direction="column" gap="0">
                <Text size="2" as="div" weight="bold">
                  Model
                </Text>
                <Text size="1" as="div">
                  {data?.provider || 'gpt-4o'}
                </Text>
              </Flex>

              {NodeFooter({ id })}
            </Flex>
          </HoverCard.Content>
        </Card>

        {edge_points?.map((ep, i) => (
          <CustomHandle type={ep?.type} id={ep.id} position={ep?.position} />
        ))}
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

              {NodeFooter({ id })}
            </Flex>
          </HoverCard.Content>
        </Card>

        {edge_points?.map((ep, i) => (
          <CustomHandle type={ep?.type} id={ep.id} position={ep?.position} />
        ))}
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

              {NodeFooter({ id })}
            </Flex>
          </HoverCard.Content>
        </Card>

        {edge_points?.map((ep, i) => (
          <CustomHandle type={ep?.type} id={ep.id} position={ep?.position} />
        ))}
      </HoverCard.Root>
    );
  };

  const nodeTypes = {
    io: IONode,
    ai: AINode,
    tool: ToolNode,
    logic: LogicNode,
    chatbot: ChatBotNode,
    start: StartNode,
    end: EndNode,
  };

  return (
    <Theme>
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
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
              onConnect={onConnect}
            >
              <Background gap={24} variant="dots" size={1} />

              <Controls />
            </ReactFlow>
          </Box>

          <Box p="2">
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="2">
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
                    {addNodesDropDownData.map((dt, i) => (
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

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold" as="div">
                  Configuration
                </Text>

                <Tooltip content="Environment variables">
                  <Dialog.Trigger>
                    <Button
                      size="1"
                      variant="soft"
                      onClick={() => {
                        setDialogBoxType(ENV_EDITOR);
                        setDialogBoxData({});
                      }}
                    >
                      <FileIcon /> .env
                    </Button>
                  </Dialog.Trigger>
                </Tooltip>
              </Flex>
            </Flex>
          </Box>
        </Flex>

        <Dialog.Content>
          <Dialog.Title></Dialog.Title>
          <DialogBox type={dialogBoxType} data={dialogBoxData} />
        </Dialog.Content>
      </Dialog.Root>
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
