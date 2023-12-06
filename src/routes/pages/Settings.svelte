<div class="settings">
    <a class="item"
        href="https://collabmining.com"
        target="_blank">
        About Collabmining
    </a>
    <a class="item"
        href="https://truthchain.dev"
        target="_blank">
        About Truthchain
    </a>
    <a class="item"
        href="https://origintrail.io"
        target="_blank">
        About OriginTrail
    </a>
    <a class="item"
        href="https://chromewebstore.google.com/detail/collabmining/mcpdnnnloahkpfllgbgmnclbhjfbddfi"
        target="_blank">

        <span>
            Support us with a <b>5-star review</b>
        </span>

        <svg class="item__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>          
    </a>

    <footer>
        <span>Made with ❤️ by <a href="https://collabmining.com" target="_blank">Collabmining Team</a></span>
        <span>Powered by <a href="https://origintrail.io" target="_blank">OriginTrail</a></span>
    </footer>
</div>

<style>

    .settings {
        display: flex;
        flex-direction: column;
        padding-top: 1rem;
        height: calc(100vh - 5rem);
    }

    .item {
        padding: 0.5rem;
        border-bottom: 1px solid;
        color: #000;
        text-decoration: none;
        display: flex;
        transition: all 0.2s ease-in-out;
    }

    .item:hover {
        padding-left: 1rem;
    }

    .item:hover .item__icon {
        transform: rotate(30deg) scale(1.3);
    }

    .item__icon {
        width: 1rem;
        height: 1rem;
        margin-left: auto;
        transition: all 0.2s ease-in-out;
    }

    footer {
        margin-top: auto;
        padding: 1rem;
        text-align: center;
        font-size: 0.8rem;
        display: flex;
        flex-direction: column;
    }

    footer a {
        color: #000;
        text-decoration: none;
    }
    footer a:hover {
        text-decoration: underline;
    }
</style>