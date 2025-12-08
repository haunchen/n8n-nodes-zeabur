import {
    NodeConnectionTypes,
    type INodeType,
    type INodeTypeDescription,
    type ISupplyDataFunctions,
    type SupplyData,
    type ILoadOptionsFunctions,
    type INodeListSearchResult,
} from 'n8n-workflow';
import { getConnectionHintNoticeField } from './utils';

// N8nLlmTracingCallback - Required for execution animation in n8n UI
// This callback reports LLM execution status to n8n frontend
class N8nLlmTracingCallback {
    name = 'N8nLlmTracingCallback';
    awaitHandlers = true;

    private executionFunctions: ISupplyDataFunctions;
    private connectionType = NodeConnectionTypes.AiLanguageModel;
    private runIndex = 0;

    constructor(executionFunctions: ISupplyDataFunctions) {
        this.executionFunctions = executionFunctions;
    }

    async handleLLMStart(
        _llm: Record<string, unknown>,
        prompts: string[],
        _runId: string,
    ): Promise<void> {
        void _runId;
        const { index } = this.executionFunctions.addInputData(this.connectionType, [
            [{ json: { messages: prompts } }],
        ]);
        this.runIndex = index;
    }

    async handleLLMEnd(output: Record<string, unknown>, _runId: string): Promise<void> {
        void _runId;
        this.executionFunctions.addOutputData(this.connectionType, this.runIndex, [
            [{ json: { response: output } }],
        ]);
    }

    async handleLLMError(error: Error, _runId: string): Promise<void> {
        void _runId;
        this.executionFunctions.addOutputData(this.connectionType, this.runIndex, [
            [{ json: { error: error.message } }],
        ]);
    }
}

interface OpenAIModel {
    id: string;
    object: string;
    created: number;
    owned_by: string;
}

interface OpenAIModelsResponse {
    object: string;
    data: OpenAIModel[];
}

async function searchModels(
    this: ILoadOptionsFunctions,
    filter?: string,
): Promise<INodeListSearchResult> {
    const credentials = await this.getCredentials('zeaburAIHubApi');

    const baseUrl =
        credentials.region === 'sfo1'
            ? 'https://sfo1.aihub.zeabur.ai/v1'
            : 'https://hnd1.aihub.zeabur.ai/v1';

    const response = await this.helpers.httpRequest({
        method: 'GET',
        url: `${baseUrl}/models`,
        headers: {
            Authorization: `Bearer ${credentials.apiKey}`,
            Accept: 'application/json',
        },
        json: true,
    });

    const modelsResponse = response as OpenAIModelsResponse;
    const models = modelsResponse.data || [];

    // Filter models
    let filteredModels = models;
    if (filter) {
        const filterLower = filter.toLowerCase();
        filteredModels = models.filter((model) => model.id.toLowerCase().includes(filterLower));
    }

    // Sort models: prioritize popular models
    const priorityModels = [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo',
        'gpt-4',
        'gpt-3.5-turbo',
        'claude-3-5-sonnet',
        'claude-3-opus',
        'claude-3-haiku',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
    ];

    filteredModels.sort((a, b) => {
        const aPriority = priorityModels.findIndex((m) => a.id.includes(m));
        const bPriority = priorityModels.findIndex((m) => b.id.includes(m));

        if (aPriority !== -1 && bPriority !== -1) {
            return aPriority - bPriority;
        }
        if (aPriority !== -1) return -1;
        if (bPriority !== -1) return 1;

        return a.id.localeCompare(b.id);
    });

    return {
        results: filteredModels.map((model) => ({
            name: model.id,
            value: model.id,
        })),
    };
}

export class LmChatZeaburAiHub implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Zeabur AI Hub Chat Model',
        name: 'lmChatZeaburAiHub',
        icon: { light: 'file:zeabur.svg', dark: 'file:zeabur.dark.svg' },
        group: ['transform'],
        version: 1,
        description: 'Chat with AI models via Zeabur AI Hub',
        defaults: {
            name: 'Zeabur AI Hub Chat Model',
        },
        usableAsTool: true,
        codex: {
            categories: ['AI'],
            subcategories: {
                AI: ['Language Models', 'Root Nodes'],
                'Language Models': ['Chat Models (Recommended)'],
            },
            resources: {
                primaryDocumentation: [
                    {
                        url: 'https://zeabur.com/docs/ai-hub/n8n-integration',
                    },
                ],
            },
        },
        inputs: [],
        outputs: [NodeConnectionTypes.AiLanguageModel],
        outputNames: ['Model'],
        credentials: [
            {
                name: 'zeaburAIHubApi',
                required: true,
            },
        ],
        properties: [
            getConnectionHintNoticeField([NodeConnectionTypes.AiChain, NodeConnectionTypes.AiAgent]),
            {
                displayName: 'Model',
                name: 'model',
                type: 'resourceLocator',
                default: { mode: 'list', value: '' },
                required: true,
                description: 'The model to use for generating completions',
                modes: [
                    {
                        displayName: 'From List',
                        name: 'list',
                        type: 'list',
                        placeholder: 'Select a model...',
                        typeOptions: {
                            searchListMethod: 'searchModels',
                            searchable: true,
                        },
                    },
                    {
                        displayName: 'ID',
                        name: 'id',
                        type: 'string',
                        placeholder: 'e.g. gpt-4o-mini',
                    },
                ],
            },
            {
                displayName: 'Options',
                name: 'options',
                placeholder: 'Add Option',
                description: 'Additional options to configure the model',
                type: 'collection',
                default: {},
                // eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
                options: [
                    {
                        displayName: 'Sampling Temperature',
                        name: 'temperature',
                        default: 0.7,
                        typeOptions: { maxValue: 2, minValue: 0, numberPrecision: 1 },
                        description:
                            'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
                        type: 'number',
                    },
                    {
                        displayName: 'Maximum Number of Tokens',
                        name: 'maxTokens',
                        default: -1,
                        description:
                            'The maximum number of tokens to generate in the completion. -1 means no limit.',
                        type: 'number',
                        typeOptions: {
                            maxValue: 128000,
                        },
                    },
                    {
                        displayName: 'Top P',
                        name: 'topP',
                        default: 1,
                        typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
                        description:
                            'Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered',
                        type: 'number',
                    },
                    {
                        displayName: 'Frequency Penalty',
                        name: 'frequencyPenalty',
                        default: 0,
                        typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
                        description:
                            "Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim",
                        type: 'number',
                    },
                    {
                        displayName: 'Presence Penalty',
                        name: 'presencePenalty',
                        default: 0,
                        typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
                        description:
                            "Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics",
                        type: 'number',
                    },
                    {
                        displayName: 'Timeout',
                        name: 'timeout',
                        default: 60000,
                        description: 'Maximum amount of time a request is allowed to take in milliseconds',
                        type: 'number',
                    },
                    {
                        displayName: 'Max Retries',
                        name: 'maxRetries',
                        default: 2,
                        description: 'Maximum number of retries to attempt',
                        type: 'number',
                    },
                ],
            },
        ],
    };

    methods = {
        listSearch: {
            searchModels,
        },
    };

    async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
        // Dynamically load @langchain/openai (already included in n8n environment)
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @n8n/community-nodes/no-restricted-imports
        const { ChatOpenAI } = require('@langchain/openai');

        const credentials = await this.getCredentials('zeaburAIHubApi');

        // Get model name (resourceLocator format)
        const modelParameter = this.getNodeParameter('model', itemIndex) as { value: string };
        const modelName = modelParameter.value || 'gpt-4o-mini';

        const options = this.getNodeParameter('options', itemIndex, {}) as {
            frequencyPenalty?: number;
            maxTokens?: number;
            presencePenalty?: number;
            temperature?: number;
            timeout?: number;
            maxRetries?: number;
            topP?: number;
        };

        // Set baseURL based on region
        const baseURL =
            credentials.region === 'sfo1'
                ? 'https://sfo1.aihub.zeabur.ai/v1'
                : 'https://hnd1.aihub.zeabur.ai/v1';

        const model = new ChatOpenAI({
            apiKey: credentials.apiKey as string,
            model: modelName,
            temperature: options.temperature ?? 0.7,
            maxTokens: options.maxTokens !== -1 ? options.maxTokens : undefined,
            topP: options.topP,
            frequencyPenalty: options.frequencyPenalty,
            presencePenalty: options.presencePenalty,
            timeout: options.timeout ?? 60000,
            maxRetries: options.maxRetries ?? 2,
            configuration: {
                baseURL,
            },
            // Important: Zeabur AI Hub does not support Responses API, must disable it
            useResponsesApi: false,
            // Enable execution animation in n8n UI
            callbacks: [new N8nLlmTracingCallback(this)],
        });

        return {
            response: model,
        };
    }
}
