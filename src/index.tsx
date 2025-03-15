import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './css/index.css';
import '@aws-amplify/ui-react/styles.css';
import {ThemeProvider} from '@aws-amplify/ui-react';

const theme = {
    name: 'custom-theme',
    tokens: {
        components: {
            
        },
    },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
);
