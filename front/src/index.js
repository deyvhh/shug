import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider theme={{ colorScheme: 'dark' }}>
        <NotificationsProvider>
            <App />
        </NotificationsProvider>
    </MantineProvider>
);

