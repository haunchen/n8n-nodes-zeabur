import type {
    IAuthenticateGeneric,
    Icon,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class ZeaburAIHubApi implements ICredentialType {
    name = 'zeaburAIHubApi';

    displayName = 'Zeabur AI Hub API';

    icon: Icon = { light: 'file:../icons/zeabur.svg', dark: 'file:../icons/zeabur.dark.svg' };

    documentationUrl = 'https://zeabur.com/docs/ai-hub';

    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            required: true,
            default: '',
            description: 'The API Key generated in Zeabur AI Hub',
        },
        {
            displayName: 'Region',
            name: 'region',
            type: 'options',
            options: [
                {
                    name: 'HND1 - Tokyo, Japan',
                    value: 'hnd1',
                },
                {
                    name: 'SFO1 - San Francisco, USA',
                    value: 'sfo1',
                },
            ],
            default: 'hnd1',
            description: 'The region endpoint for Zeabur AI Hub',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials?.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL:
                '={{ $credentials.region === "sfo1" ? "https://sfo1.aihub.zeabur.ai/v1" : "https://hnd1.aihub.zeabur.ai/v1" }}',
            url: '/models',
            method: 'GET',
        },
    };
}
