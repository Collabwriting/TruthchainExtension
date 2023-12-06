<script>
    // @ts-nocheck
    import { SnippetStore } from "$lib/stores/SnippetStore";

    import { Consts } from "$lib/utils/Consts";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    export let snippet = {};

    onMount(async () => {

    });

    let syncingInterval;

    $: {
        // UAL is not present and snippet was created in the last 2 hours pool snippet every 5 seconds
        if (snippet.ual === null && (new Date().getTime() - new Date(snippet.createdAt).getTime()) < 7200000 && !syncingInterval) {

            console.log("syncing");

            syncingInterval = setInterval(async () => {

                console.log("syncing interval triggered");

                await pullSnippet();

                if (snippet.ual !== null) {

                    console.log("ual found, clearing interval");
                    clearInterval(syncingInterval);
                }
            }, 5000);
        }
    }

    async function pullSnippet() {
        try {

            // get snippet from api
            let response = await fetch(`${Consts.API_URL}/snippets/${snippet.id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            snippet = await response.json();

            // update snippet in store
            $SnippetStore = $SnippetStore.map((s) => {
                if (s.id === snippet.id) {
                    return snippet;
                }
                return s;
            });

        } catch (e) {
            console.error(e);
        }
    }

    function generateLocatableUrl(snippet) {

        let url = snippet.url;

        // if chrome text fragment is present, return the url
        if (url.includes("#:~:text") && url.split("#:~:text=")[1]) {
            return url;
        }

        // remove html
        let cleanContent = snippet.content?.replace(/<\/?[^>]+(>|$)/gi, "");

        // remove ... from the end if it exists (copilot sometimes adds ... to the end of the content)
        if (cleanContent.endsWith("...")) {
            cleanContent = cleanContent.substring(0, cleanContent.length - 3);
        }

        const getFragment = (sentence) => {

            let words = sentence.trim().split(" ");

            let textFragment = encodeURIComponent(words.join(" "));

            // manually encode dashes
            textFragment = textFragment.replaceAll("-", "%2D");

            return textFragment;
        }

        let textFragments = "";

        let sentences = cleanContent.split(". ");
        for (let i = 0; i < sentences.length; i++) {
            textFragments += i === 0 ? getFragment(sentences[i]) : "&text=" + getFragment(sentences[i]);
        }

        return url + "#:~:text=" + textFragments;
    }
</script>

<div class="snippet" transition:fly>
    <div class="snippet__title">{snippet.title}</div>
    <div class="snippet__status">{snippet.status}</div>
    <div class="snippet__content">{snippet.content}</div>
    <div class="snippet__buttons">
        <a class="snippet__button snippet__button--web"
            href={generateLocatableUrl(snippet)}
            target="_blank"
            >
            WEB
        </a>
        <a class="snippet__button snippet__button--tc"
            href={`${Consts.VIEW_URL}/${snippet.id}`}
            target="_blank"
            >
            TC
        </a>
        <a class="snippet__button snippet__button--dkg"
            class:snippet__button--disabled={snippet.ual === null}
            title={snippet.ual === null ? "Minting NFT" : ""}
            href={`https://dkg-testnet.origintrail.io/explore?ual=${snippet.ual}`}
            target="_blank"
            >
            DKG
        </a>
    </div>
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
        padding: 0.5rem 1rem;
    }
    
    .snippet__status {
        font-size: .5rem;
        padding: 0.2rem 0.5rem;
        margin: 0.2rem auto 0.2rem 1rem;
        color: #fff;
        background: black;
        border-radius: 2px;
    }


    .snippet__buttons {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: 0.5rem;
        padding: 0.5rem 0.5rem;
        font-size: 0.8rem;
    }

    .snippet__button {
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        padding: 0.25rem 1rem;
        background-color: #fff;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        color: #000;
        text-decoration: none;
    }

    .snippet__button:hover {
        border-color: black;
        box-shadow: 0.25rem 0.25rem black;
        margin: -0.25rem 0.25rem 0.25rem -0.25rem;
    }

    .snippet__button--tc:hover {
        background-color: #62eeff;
    }

    .snippet__button--dkg:hover {
        background-color: #e4adff;
    }

    .snippet__button--web:hover {
        background-color: #00ffce;
    }

    .snippet__button--disabled {
        cursor: default;
        background: #eee;
        color: #999;
    }
    .snippet__button--disabled:hover {
        border-color: #ccc;
        background-color: #eee;
        box-shadow: none;
        margin: 0;
    }
</style>