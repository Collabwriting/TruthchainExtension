<script>
    import { NotificationStore } from '$lib/stores/NotificationStore';
    import { SnippetStore } from '$lib/stores/SnippetStore';
    import { Consts } from '$lib/utils/Consts';

    import { MetaMaskSDK } from '@metamask/sdk';

    import DKG from 'dkg.js';

    import { onMount } from 'svelte';

    export let content = "";
    export let title = "";
    export let url = "";
    
    export let cancel = () => {};

    /**
     * @type {import("@metamask/sdk").SDKProvider}
     */
    let ethereum;

    let isPublishing = false;

    /**
     * @type {DKG}
     */
    let dkg;

    onMount(async () => {
        await initMetamask();
        await initDKG();
    });

    const publish = async () => {

        console.log("Publishing");

        const snippet = {
            title,
            content,
            url,
        };

        try {
            
            // DKG.js uses deprecated method for enabling metamask which produces bug
            // this ensures the metamask is enabled and user can sign the transaction
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

        } catch (e) {
            console.error(e);

            // @ts-ignore
            NotificationStore.add("MetaMask Error: " + e.message);

            isPublishing = false;
            return;
        }

        isPublishing = true;
        let createdSnippet;

        try {
            const response = await fetch(`${Consts.API_URL}/snippets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(snippet),
            });
            createdSnippet = await response.json();

        } catch (e) {
            console.error(e);

            // @ts-ignore
            NotificationStore.add("Truthchain Error: " + e.message);

            isPublishing = false;
            return;
        }

        // update snippet store with new truthchain snippet
        $SnippetStore = [createdSnippet, ...$SnippetStore];

        // defer publishing to DKG to avoid blocking UI
        deferePublishToDKG(createdSnippet);

        cancel();

        isPublishing = false;
    };

    /**
     * Publishes snippet to DKG and updates snippet's UAL on server & store
     * 
     * @param {{ id: any; title: any; url: any; createdAt: any; content: any; }} data
     */
    async function deferePublishToDKG(data) {

        console.log("Publishing to DKG");

        try {
            // create knowledge asset
            const asset = {
                '@context': 'https://schema.org/',
                '@type': 'TruthchainSnippet',
                '@id': `https://api.truthchain.dev/snippets/${data.id}`,
                'title': data.title,
                'url': data.url,
                'createdAt': data.createdAt,
                'content': data.content
            };

            // publish asset to DKG
            const result = await dkg.asset.create({
                    public: asset,
                },
                { epochsNum: 2 }
            );

            console.log("DKG Result", result);

            const snippetUpdate = {
                id: data.id,
                ual: result.UAL,
            };

            const response = await fetch(`${Consts.API_URL}/snippets/${data.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(snippetUpdate),
            });

            const updatedSnippet = await response.json();
            console.log("Updated Snippet", updatedSnippet);

            // find snippet by id
            let snippet = $SnippetStore.find(s => s.id === data.id);

            // update snippet
            snippet.ual = updatedSnippet.ual;
            snippet.status = updatedSnippet.status;
            snippet.error = updatedSnippet.error;

            // update snippet
            $SnippetStore = [snippet, ...$SnippetStore.filter(s => s.id !== data.id)];

        } catch (e) {
            console.error("DKG Error", e);

            // @ts-ignore
            NotificationStore.add("DKG Error: " + e.message);
        }

    }

    async function initMetamask() {

        console.log("Initializing Metamask");

        const MMSDK = new MetaMaskSDK();

        await MMSDK.init();

        ethereum = MMSDK.getProvider();
    }

    async function initDKG() {

        console.log("Initializing DKG");

        dkg = new DKG({
            environment: "testnet",
            endpoint: "http://172.171.246.143",
            port: 80,
            blockchain: {
                name: "otp:20430"
            },
        });

        const nodeInfo = await dkg.node.info();

        console.log("DKG Info", nodeInfo);
    }
</script>

<div class="card">
    <div class="card-url">{url}</div>
    <div class="card-title">{title}</div>
    <div class="card-content">{content}</div>

    <div class="card-actions">

        {#if isPublishing}
            <div class="card-button card-button--loading">
                Publishing...
            </div>
        {:else}
            <button
                class="card-button"
                on:click={cancel}
                >
                Cancel
            </button>
            <button
                class="card-button card-button--publish"
                on:click={publish}
                >Publish & Verify
            </button>
        {/if}
    </div>
</div>

<style>
    .card {
        border: 1px solid #ccc;
        border-radius: 1rem;
        margin: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .card-url {
        font-size: 0.8rem;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid #ccc;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .card-title {
        font-size: 1.2rem;
        font-weight: bold;
        padding: 0rem 1rem;
    }

    .card-content {
        font-size: 1rem;
        padding: 0rem 1rem;
    }

    .card-actions {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: 0.5rem;
        padding: 0.5rem 0.5rem;
    }

    .card-button {
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        padding: 0.25rem 1rem;
        background-color: #fff;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }

    .card-button:hover {
        border-color: black;
        box-shadow: 0.25rem 0.25rem black;
        margin: -0.25rem 0.25rem 0.25rem -0.25rem;
    }

    .card-button--publish:hover {
        background-color: #00ffce;
    }

    .card-button--loading {
        cursor: default;
        background: #eee;
        color: #999;
    }

    .card-button--loading:hover {
        border-color: #ccc;
        box-shadow: none;
        margin: 0;
    }
</style>