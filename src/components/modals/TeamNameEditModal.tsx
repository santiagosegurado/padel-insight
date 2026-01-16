interface TeamNameEditModalProps {
    show: boolean;
    onClose: () => void;
    teamNames: { us: string; them: string };
    setTeamNames: (names: { us: string; them: string }) => void;
}

export const TeamNameEditModal = ({ show, onClose, teamNames, setTeamNames }: TeamNameEditModalProps) => {
    if (!show) return null;

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-neutral-800 w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 text-center">Editar Nombres de Equipo</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-blue-400 text-xs font-bold uppercase block mb-1">Tu Pareja (Nosotros)</label>
                        <input
                            type="text"
                            value={teamNames.us}
                            onChange={(e) => setTeamNames({ ...teamNames, us: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-red-400 text-xs font-bold uppercase block mb-1">Rivales (Ellos)</label>
                        <input
                            type="text"
                            value={teamNames.them}
                            onChange={(e) => setTeamNames({ ...teamNames, them: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        />
                    </div>
                    <button onClick={onClose} className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition">Guardar</button>
                </div>
            </div>
        </div>
    );
};
