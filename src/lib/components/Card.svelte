<script>
// @ts-nocheck

    import { MetaMaskSDK } from '@metamask/sdk';
    import { onMount } from 'svelte';

    export let content = "";
    export let title = "";
    export let url = "";
    
    export let cancel = () => {};

    let ethereum;
    let accountIsConnected = false;

    onMount(async () => {
        const MMSDK = new MetaMaskSDK();

        await MMSDK.init();

        ethereum = MMSDK.getProvider();

        accountIsConnected = await ethereum.isConnected();

        ethereum.on('chainChanged', (chainId) => {
            console.log('chainChanged', chainId);
        });
        ethereum.on('accountsChanged', (accounts) => {
            console.log('accountsChanged', accounts);
        });
        ethereum.on('connect', (info) => {
            console.log('connect', info);
        });
        ethereum.on('disconnect', (error) => {
            console.log('disconnect', error);
        });
    });

    const publish = async () => {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        const signature = await ethereum.request({
            method: 'personal_sign',
            params: [content, account],
        });

        const snippet = {
            title,
            content,
            url,
            account,
            signature,
        };

        const response = await fetch('https://api.truthchain.dev/v1/snippets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(snippet),
        });

        const data = await response.json();

        console.log(data);

        cancel();
    };
</script>

<div class="card">
    <div class="card-url">{url}</div>
    <div class="card-title">{title}</div>
    <div class="card-content">{content}</div>

    <div class="card-actions">
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
        box-shadow: 0.25rem 0.25rem black;
        margin: -0.25rem 0.25rem 0.25rem -0.25rem;
    }

    .card-button--publish:hover {
        background-color: #00ffce;
        border-color: black;
    }
</style>