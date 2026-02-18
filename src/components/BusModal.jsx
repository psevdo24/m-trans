import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Map, Folder, Pencil, Trash2 } from 'lucide-react';

const BusModal = ({ bus, onClose, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        photo: '',
        plate_number: '',
        make_model: '',
        seats: '',
        seat_scheme_url: '',
        vin: '',
        docs_url: '',
        vehicle_insurance_expiry: '',
        passenger_insurance_expiry: '',
        maintenance_expiry: '',
        tachograph_expiry: '',
        fire_extinguisher_expiry: '',
        first_aid_expiry: '',
    });

    useEffect(() => {
        if (bus) {
            setFormData({
                photo: bus.photo || '',
                plate_number: bus.plate_number || '',
                make_model: bus.make_model || '',
                seats: bus.seats || '',
                seat_scheme_url: bus.seat_scheme_url || '',
                vin: bus.vin || '',
                docs_url: bus.docs_url || '',
                vehicle_insurance_expiry: bus.vehicle_insurance_expiry || '',
                passenger_insurance_expiry: bus.passenger_insurance_expiry || '',
                maintenance_expiry: bus.maintenance_expiry || '',
                tachograph_expiry: bus.tachograph_expiry || '',
                fire_extinguisher_expiry: bus.fire_extinguisher_expiry || '',
                first_aid_expiry: bus.first_aid_expiry || '',
            });
            setIsEditing(false); // Reset to view mode when opening a new bus
        }
    }, [bus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...bus, ...formData });
        setIsEditing(false);
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Reset form data if cancelling edit
            if (bus) {
                setFormData({
                    photo: bus.photo || '',
                    plate_number: bus.plate_number || '',
                    make_model: bus.make_model || '',
                    seats: bus.seats || '',
                    seat_scheme_url: bus.seat_scheme_url || '',
                    vin: bus.vin || '',
                    docs_url: bus.docs_url || '',
                    vehicle_insurance_expiry: bus.vehicle_insurance_expiry || '',
                    passenger_insurance_expiry: bus.passenger_insurance_expiry || '',
                    maintenance_expiry: bus.maintenance_expiry || '',
                    tachograph_expiry: bus.tachograph_expiry || '',
                    fire_extinguisher_expiry: bus.fire_extinguisher_expiry || '',
                    first_aid_expiry: bus.first_aid_expiry || '',
                });
            }
        }
        setIsEditing(!isEditing);
    };

    if (!bus) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scaleIn transform transition-all duration-300">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10 rounded-t-2xl">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight font-mono">
                            {isEditing ? 'Редагування автобуса' : bus.plate_number}
                        </h2>
                        {!isEditing && (
                            <button
                                onClick={toggleEdit}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                                title="Редагувати"
                            >
                                <Pencil size={20} />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:rotate-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Section A: General Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                Загальна інформація
                            </h3>

                            <div className="space-y-5">
                                {isEditing ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">URL фото</label>
                                            <input
                                                type="text"
                                                name="photo"
                                                value={formData.photo}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 p-2.5 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Номерний знак</label>
                                            <input
                                                type="text"
                                                name="plate_number"
                                                value={formData.plate_number}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 p-2.5 text-sm font-semibold font-mono"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Марка та Модель</label>
                                            <input
                                                type="text"
                                                name="make_model"
                                                value={formData.make_model}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 p-2.5 text-sm"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Кількість місць</label>
                                                <input
                                                    type="number"
                                                    name="seats"
                                                    value={formData.seats}
                                                    onChange={handleChange}
                                                    className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 p-2.5 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">VIN код</label>
                                                <input
                                                    type="text"
                                                    name="vin"
                                                    value={formData.vin}
                                                    onChange={handleChange}
                                                    className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 p-2.5 text-sm font-mono"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Схема місць (URL)</label>
                                            <input
                                                type="text"
                                                name="seat_scheme_url"
                                                value={formData.seat_scheme_url}
                                                onChange={handleChange}
                                                placeholder="Посилання на Google Doc"
                                                className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 p-2.5 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Папка з документами (URL)</label>
                                            <input
                                                type="text"
                                                name="docs_url"
                                                value={formData.docs_url}
                                                onChange={handleChange}
                                                placeholder="Посилання на Google Drive"
                                                className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 p-2.5 text-sm"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="animate-fadeIn">
                                        {formData.photo && (
                                            <div className="mb-6 relative group overflow-hidden rounded-xl shadow-md">
                                                <img
                                                    src={formData.photo}
                                                    alt="Bus"
                                                    className="w-full h-56 object-cover transform transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        )}
                                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100 shadow-sm">
                                            <InfoRow label="Марка та Модель" value={formData.make_model} />
                                            <InfoRow label="Кількість місць" value={formData.seats} />
                                            <InfoRow label="VIN код" value={formData.vin} isMono />
                                        </div>

                                        <div className="flex flex-col gap-3 mt-4">
                                            {formData.seat_scheme_url && (
                                                <a
                                                    href={formData.seat_scheme_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium group"
                                                >
                                                    <Map size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                                                    Переглянути схему місць
                                                </a>
                                            )}
                                            {formData.docs_url && (
                                                <a
                                                    href={formData.docs_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors duration-200 font-medium group"
                                                >
                                                    <Folder size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                                                    Відкрити папку з документами
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section B: Expiry Dates */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                                Терміни дії документів
                            </h3>

                            <div className="space-y-4">
                                {isEditing ? (
                                    <div className="bg-gray-50/50 rounded-xl p-4 space-y-4 border border-gray-100">
                                        <DateInput
                                            label="Страхування авто"
                                            name="vehicle_insurance_expiry"
                                            value={formData.vehicle_insurance_expiry}
                                            onChange={handleChange}
                                        />

                                        <DateInput
                                            label="Страхування пасажирів"
                                            name="passenger_insurance_expiry"
                                            value={formData.passenger_insurance_expiry}
                                            onChange={handleChange}
                                        />

                                        <DateInput
                                            label="Технічний огляд (ТО)"
                                            name="maintenance_expiry"
                                            value={formData.maintenance_expiry}
                                            onChange={handleChange}
                                        />

                                        <DateInput
                                            label="Тахограф"
                                            name="tachograph_expiry"
                                            value={formData.tachograph_expiry}
                                            onChange={handleChange}
                                        />

                                        <DateInput
                                            label="Вогнегасник"
                                            name="fire_extinguisher_expiry"
                                            value={formData.fire_extinguisher_expiry}
                                            onChange={handleChange}
                                        />

                                        <DateInput
                                            label="Аптечка"
                                            name="first_aid_expiry"
                                            value={formData.first_aid_expiry}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100 shadow-sm animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                                        <DateDisplay label="Страхування авто" date={formData.vehicle_insurance_expiry} />
                                        <DateDisplay label="Страхування пасажирів" date={formData.passenger_insurance_expiry} />
                                        <DateDisplay label="Технічний огляд (ТО)" date={formData.maintenance_expiry} />
                                        <DateDisplay label="Тахограф" date={formData.tachograph_expiry} />
                                        <DateDisplay label="Вогнегасник" date={formData.fire_extinguisher_expiry} />
                                        <DateDisplay label="Аптечка" date={formData.first_aid_expiry} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6 animate-slideUp">
                            <button
                                type="button"
                                onClick={toggleEdit}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 font-medium transition-all duration-200 active:scale-95 shadow-sm"
                            >
                                Скасувати
                            </button>
                            <button
                                type="submit"
                                className="flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 font-medium transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-95 transform"
                            >
                                <Save size={18} className="mr-2" />
                                Зберегти зміни
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, isMono }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className={`text-gray-900 font-bold ${isMono ? 'font-mono tracking-wide' : ''}`}>{value || '—'}</span>
    </div>
);

const DateDisplay = ({ label, date }) => {
    if (!date) return null;

    const dateObj = new Date(date);
    const today = new Date();
    const isExpired = dateObj < today;
    const isWarning = dateObj < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    let badgeClass = "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
    if (isExpired) badgeClass = "bg-red-50 text-red-700 ring-1 ring-red-600/20";
    else if (isWarning) badgeClass = "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";

    return (
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 group">
            <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">{label}</span>
            <span className={`px-3 py-1 rounded-md text-sm font-mono font-bold shadow-sm ${badgeClass}`}>
                {date}
            </span>
        </div>
    );
};

const DateInput = ({ label, name, value, onChange, bgClass = "" }) => (
    <div className={bgClass}>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type="date"
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
        />
    </div>
);

export default BusModal;
