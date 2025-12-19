import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    INodeListSearchResult,
    ILoadOptionsFunctions,
} from 'n8n-workflow';

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
        filteredModels = models.filter((model: OpenAIModel) =>
            model.id.toLowerCase().includes(filterLower),
        );
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

    filteredModels.sort((a: OpenAIModel, b: OpenAIModel) => {
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
        results: filteredModels.map((model: OpenAIModel) => ({
            name: model.id,
            value: model.id,
        })),
    };
}

export class ZeaburAiHub implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Zeabur AI Hub',
        name: 'zeaburAiHub',
        icon: { light: 'file:zeabur.svg', dark: 'file:zeabur.dark.svg' },
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Zeabur AI Hub API',
        defaults: {
            name: 'Zeabur AI Hub',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'zeaburAIHubApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Chat',
                        value: 'chat',
                    },
                ],
                default: 'chat',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['chat'],
                    },
                },
                options: [
                    {
                        name: 'Message a Model',
                        value: 'message',
                        action: 'Message a model',
                        description: 'Chat with a model',
                    },
                ],
                default: 'message',
            },
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
                displayName: 'Message',
                name: 'content',
                type: 'string',
                required: true,
                default: '',
                displayOptions: {
                    show: {
                        resource: ['chat'],
                        operation: ['message'],
                    },
                },
                // Using typeOptions rows to make it a text area
                typeOptions: {
                    rows: 4,
                },
                description: 'The message to send to the model',
            },
            {
                displayName: 'Options',
                name: 'options',
                placeholder: 'Add Option',
                description: 'Additional options to configure the model',
                type: 'collection',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['chat'],
                        operation: ['message'],
                    },
                },
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
                ],
            },
        ],
    };

    methods = {
        listSearch: {
            searchModels,
        },
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        if (resource === 'chat' && operation === 'message') {
            for (let i = 0; i < items.length; i++) {
                try {
                    const credentials = await this.getCredentials('zeaburAIHubApi');
                    const modelParameter = this.getNodeParameter('model', i) as { value: string };
                    const model = modelParameter.value || 'gpt-4o-mini';
                    const content = this.getNodeParameter('content', i) as string;
                    const options = this.getNodeParameter('options', i, {}) as {
                        temperature?: number;
                        maxTokens?: number;
                        topP?: number;
                        frequencyPenalty?: number;
                        presencePenalty?: number;
                    };

                    const baseUrl =
                        credentials.region === 'sfo1'
                            ? 'https://sfo1.aihub.zeabur.ai/v1'
                            : 'https://hnd1.aihub.zeabur.ai/v1';

                    const body: any = {
                        model,
                        messages: [
                            {
                                role: 'user',
                                content,
                            },
                        ],
                        temperature: options.temperature ?? 0.7,
                        top_p: options.topP ?? 1,
                        frequency_penalty: options.frequencyPenalty ?? 0,
                        presence_penalty: options.presencePenalty ?? 0,
                    };

                    if (options.maxTokens && options.maxTokens !== -1) {
                        body.max_tokens = options.maxTokens;
                    }

                    const response = await this.helpers.httpRequest({
                        method: 'POST',
                        url: `${baseUrl}/chat/completions`,
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body,
                        json: true,
                    });

                    // Return the simplified content as 'message' and full raw response
                    const choice = response.choices && response.choices[0];
                    const message = choice?.message?.content || '';

                    returnData.push({
                        json: {
                            message,
                            ...response,
                        },
                        pairedItem: {
                            item: i,
                        },
                    });
                } catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({
                            json: {
                                error: (error as Error).message,
                            },
                            pairedItem: {
                                item: i,
                            },
                        });
                    } else {
                        throw error;
                    }
                }
            }
        }

        return [returnData];
    }
}
