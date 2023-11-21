// @ts-nocheck
import { writable } from "svelte/store";
import { browser } from '$app/environment';

export const SnippetStore = writable([]);

if(browser) {

    console.log("browser", browser);

    // load snippets from LOCAL storage
    const snippets = localStorage.getItem("snippets");
    if(snippets) {
        SnippetStore.set(JSON.parse(snippets));
    }

    // subscribe to changes and store them in LOCAL storage
    SnippetStore.subscribe((items) => {
        localStorage.setItem("snippets", JSON.stringify(items));
    });

    // const snippets = chrome?.storage?.sync.get("snippets", (data) => {
    //     if(!data.snippets) {
    //         SnippetStore.set(data.snippets);
    //     }
    // });

    // subscribe to changes and store them in chrome.storage.sync
    // SnippetStore.subscribe((items) => {
    //     chrome?.storage?.sync.set({ snippets: items });
    // });

}