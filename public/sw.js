self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'United Trade';
    const options = {
        body: data.body || '',
        icon: '/icon.png',
        data: { url: data.url || '/dashboard' },
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/dashboard';
    event.waitUntil(clients.openWindow(url));
});