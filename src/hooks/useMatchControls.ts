import { useMatchStore } from '../store/matchStore';

export const useMatchControls = () => {
    const { finishMatch, resetMatch } = useMatchStore();

    const handleFinishMatch = () => {
        if (confirm("¿Terminar partido y guardar estadísticas?")) {
            finishMatch();
            alert("Partido guardado y nueva partida comenzada.");
            return true;
        }
        return false;
    };

    const handleResetMatch = () => {
        if (confirm("¿Estás seguro de reiniciar el partido actual? Se perderán los datos no guardados.")) {
            resetMatch();
            return true;
        }
        return false;
    };

    return { handleFinishMatch, handleResetMatch };
};
