<script>
    // @ts-nocheck
    import { fly } from "svelte/transition";

    export let snippet = {};
</script>

<div class="snippet" transition:fly>
    <div class="snippet__title">{snippet.title}</div>
    <div class="snippet__content">{snippet.content}</div>
    <div class="snippet__meta">{snippet.url}</div>
    <div class="snippet__meta">{snippet.account}</div>
    <div class="snippet__meta">{snippet.signature}</div>
    <div class="snippet__meta">{snippet.ual}</div>
</div>

<style>
    .snippet {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        margin: 0.5rem;
        font-size: 0.5rem;
        width: -webkit-fill-available;
    }

    .snippet__title {
        font-size: 0.8rem;
        font-weight: bold;
        padding: 1rem 1rem 0.2rem 1rem;
    }

    .snippet__content {
        font-size: 0.8rem;
        padding: 0.2rem 1rem;
    }
    
    .snippet__meta {
        font-size: .5rem;
        padding: 0.2rem 1rem;
        border-bottom: 1px solid #ccc;
        word-wrap: break-word;
        width: -webkit-fill-available;
    }

    .snippet__meta:last-child {
        border-bottom: none;
    }

    .snippet__meta:first-child {
        border-top: 1px solid #ccc;
    }

    .snippet__actions {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: 0.5rem;
        padding: 0.5rem 0.5rem;
    }

    .snippet__button {
        font-size: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        border: 1px solid #ccc;
        background-color: #fff;
        cursor: pointer;
    }
</style>