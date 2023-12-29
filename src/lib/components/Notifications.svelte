<script>
    import { NotificationStore } from "$lib/stores/NotificationStore";
    import { fly, slide } from "svelte/transition";
</script>

<div class="notifications">
    {#each $NotificationStore as notification}
        <div class="notification" transition:slide>
            <div class="notification__message">
                {notification.message}
            </div>
            <span class="notification__close" on:click={() => NotificationStore.remove(notification.id)}>
                &times;
            </span>
        </div>
    {/each}
</div>

<style>
    .notifications {
        position: fixed;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        z-index: 1000;
        width: 100%;
    }

    .notification {
        background-color: #ff5656;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        border-bottom: 1px solid #ef4c4c;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .notification__message {
        color: #fff;
        padding: 1rem;
    }

    .notification__close {
        cursor: pointer;
        color: #fff;
        font-size: 1rem;
        margin-left: auto;
        align-self: baseline;
        padding: 1rem;
    }
</style>