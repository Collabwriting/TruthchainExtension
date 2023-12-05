<script>
// @ts-nocheck

    import { Consts } from "$lib/utils/Consts";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    export let snippet = {};

    onMount(async () => {
        try {
            let response = await fetch(`${Consts.API_URL}/snippets/${snippet.id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            snippet = await response.json();
        } catch (e) {
            console.error(e);
        }
    });

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
        <a class="snippet__button snippet__button--dkg"
            href={`https://dkg-testnet.origintrail.io/explore?ual=${snippet.ual}`}
            target="_blank"
            >
            DKG
        </a>
        <a class="snippet__button snippet__button--tc"
            href={`${Consts.VIEW_URL}/${snippet.id}`}
            target="_blank"
            >
            TC
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
        background-color: #00ffce;
    }

    .snippet__button--dkg:hover {
        background-color: #dc95ff;
    }

    .snippet__button--web:hover {
        background-color: #fff42d;
    }
</style>