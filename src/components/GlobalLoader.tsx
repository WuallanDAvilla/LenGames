// src/components/GlobalLoader.tsx

import './GlobalLoader.css'; // Importando o CSS que fará a mágica

export function GlobalLoader() {
    return (
        <div className="loader-container">
            <div className="loader-spinner"></div>
        </div>
    );
}