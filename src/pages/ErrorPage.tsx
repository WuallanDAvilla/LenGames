// src/pages/ErrorPage.tsx

import { Link, useRouteError } from 'react-router-dom';
import '../styles/ErrorPage.css';

export function ErrorPage() {
    // O hook useRouteError pega o objeto de erro fornecido pelo React Router
    const error = useRouteError();
    console.error(error); // Bom para depuração no console do desenvolvedor

    // Tenta extrair uma mensagem de status ou texto do erro
    let errorMessage = "Ocorreu um erro inesperado.";
    if (typeof error === 'object' && error !== null) {
        if ('statusText' in error && typeof error.statusText === 'string') {
            errorMessage = error.statusText;
        } else if ('message' in error && typeof error.message === 'string') {
            errorMessage = error.message;
        }
    }

    return (
        <div className="error-page-container">
            <div className="error-content">
                <h1 className="error-title">Oops!</h1>
                <p className="error-subtitle">Página não encontrada.</p>
                <p className="error-description">
                    Parece que você pegou um atalho para uma dimensão desconhecida.
                </p>
                {/* Mostra a mensagem de erro específica para ajudar na depuração */}
                <i className="error-details">{errorMessage}</i>

                <Link to="/" className="error-home-button">
                    Voltar para a Base
                </Link>
            </div>
        </div>
    );
}