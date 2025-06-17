import { Link, useRouteError } from 'react-router-dom';
import '../styles/ErrorPage.css';

export function ErrorPage() {
    const error = useRouteError();
    console.error(error); 

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
                <i className="error-details">{errorMessage}</i>

                <Link to="/" className="error-home-button">
                    Voltar para a Base
                </Link>
            </div>
        </div>
    );
}