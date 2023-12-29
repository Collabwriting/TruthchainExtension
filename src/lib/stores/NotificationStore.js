// @ts-nocheck
import { writable } from "svelte/store";

const createNotificationStore = () => {

    const { subscribe, set, update } = writable([]);
    
    return {
        subscribe,
        set,
        update,
        add: (message) => {

            let notification = {
                id: Math.random().toString(36).substr(2, 9),
                type: "error",
                message: message
            };
            
            update((notifications) => {
                return [...notifications, notification];
            });

            setTimeout(() => {
                update((notifications) => {
                    return notifications.filter((n) => n.id !== notification.id);
                });
            }, 5000);
        },
        remove: (id) => {
            update((notifications) => {
                return notifications.filter((n) => n.id !== id);
            });
        }
    };
};

export const NotificationStore = createNotificationStore();