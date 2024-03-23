<script>
    import Card from '$lib/components/Card.svelte';
    import Snippet from '$lib/components/Snippet.svelte';
    import { SnippetStore } from '$lib/stores/SnippetStore';
    import { onMount } from 'svelte';

    export let selectedContent = '';
    export let selectedTitle = '';
    export let selectedUrl = '';
</script>

{#if selectedContent}
    <Card
        content={selectedContent}
        title={selectedTitle}
        url={selectedUrl}
        cancel={() => {
            selectedContent = '';
            selectedTitle = '';
            selectedUrl = '';
        }}
        />
{:else}
    <p class="empty-text-message">
        Select text on the page to create a snippet
    </p>
{/if}

{#if $SnippetStore && $SnippetStore.length}

    <h1 class="sinppets-heading">
        Collected Snippets
    </h1>

    <div class="snippets">
        {#each $SnippetStore as snippet}
            <Snippet snippet={snippet}/>
        {/each}
    </div>
{/if}

<style>
    .empty-text-message {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: 1.2rem;
        border: 1px dashed black;
        padding: 1rem;
        text-align: center;
        min-height: 4rem;
        border-radius: 1rem;
        margin: 0.5rem;
    }

    .sinppets-heading {
        text-align: center;
        margin-top: 2rem;
        margin-bottom: 0.5rem;
    }

    .snippets {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5;
    }
</style>

