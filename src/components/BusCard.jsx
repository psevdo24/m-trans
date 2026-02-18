import React from 'react';
import { Users } from 'lucide-react';

const BusCard = ({ bus, onClick }) => {
    return (
        <div
            className="group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 animate-fadeIn border border-gray-100"
            onClick={() => onClick(bus)}
        >
            <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                {bus.photo ? (
                    <img
                        src={bus.photo}
                        alt={`${bus.make_model} - ${bus.plate_number}`}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                        <Users size={48} className="text-gray-300" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-white font-medium px-4 py-1 border border-white/30 rounded-full backdrop-blur-sm">Детальніше</span>
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{bus.plate_number}</h3>
                <p className="text-gray-600 font-medium mb-3">{bus.make_model}</p>
                <div className="flex items-center text-gray-500 text-sm bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                    <Users size={16} className="mr-2 text-blue-500" />
                    <span>Місць: <span className="font-semibold text-gray-700">{bus.seats || 'N/A'}</span></span>
                </div>
            </div>
        </div>
    );
};

export default BusCard;
