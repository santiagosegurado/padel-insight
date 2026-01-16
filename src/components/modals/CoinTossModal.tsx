import { useState } from 'react';

interface CoinTossModalProps {
    show: boolean;
    onClose: () => void;
    teamNames: { us: string; them: string };
    setServingTeam: (team: 'us' | 'them') => void;
}

export const CoinTossModal = ({ show, onClose, teamNames, setServingTeam }: CoinTossModalProps) => {
    const [coinSpinning, setCoinSpinning] = useState(false);

    if (!show) return null;

    const handleToss = () => {
        setCoinSpinning(true);
        setTimeout(() => {
            setCoinSpinning(false);
            const winner = Math.random() > 0.5 ? 'us' : 'them';
            setServingTeam(winner);
            onClose();
            alert(`¡Empiezan ${winner === 'us' ? teamNames.us : teamNames.them}!`);
        }, 2000);
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-neutral-800 w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 text-center">
                <h3 className="text-white font-bold text-xl mb-6">Sorteo de Saque</h3>

                <div className="flex justify-center mb-8 relative h-24">
                    <div className={`w-24 h-24 rounded-full border-4 border-yellow-400 flex items-center justify-center text-4xl bg-yellow-400/20 text-yellow-400 transition-all duration-[3000ms] ${coinSpinning ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}>
                        {coinSpinning ? '🪙' : '⚖️'}
                    </div>
                </div>

                {!coinSpinning ? (
                    <button
                        onClick={handleToss}
                        className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition text-lg"
                    >
                        Lanzar Moneda
                    </button>
                ) : (
                    <p className="text-yellow-400 font-mono animate-pulse">Lanzando...</p>
                )}

                {!coinSpinning && (
                    <button onClick={onClose} className="mt-4 text-white/50 text-sm hover:text-white">Cancelar</button>
                )}
            </div>
        </div>
    );
};
