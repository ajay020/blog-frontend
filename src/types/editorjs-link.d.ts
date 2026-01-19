declare module '@editorjs/link' {
    export interface LinkToolConfig {
        endpoint?: string;
    }

    export interface LinkData {
        link: string;
        meta?: {
            title?: string;
            description?: string;
            image?: {
                url: string;
            };
        };
    }

    export default class LinkTool {
        constructor(config?: LinkToolConfig);
        render(): Promise<HTMLElement>;
        save(): Promise<LinkData>;
        validate(savedData: any): boolean;
        static get isReadOnlySupported(): boolean;
        static get toolbox(): { title: string; icon: string };
    }
}