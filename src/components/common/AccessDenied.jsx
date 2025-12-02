import { BrickWallShield } from "lucide-react";

const AccessDenied = ({ mensaje = "No tienes permisos para acceder a esta sección." }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-slate-600">
      <BrickWallShield className="h-16 w-16 text-gray-700 mb-4" />
      <p className="text-lg font-semibold">{mensaje}</p>
    </div>
  );
};

export default AccessDenied;