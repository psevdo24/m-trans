import React, { useMemo } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, PenTool } from 'lucide-react';

const ExpiryMonitor = ({ buses, onEditBus, searchTerm }) => {
    const processedData = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const critical = [];
        const warning = [];
        const good = [];

        const documents = [
            { key: 'vehicle_insurance_expiry', label: 'Страхування авто' },
            { key: 'passenger_insurance_expiry', label: 'Страхування пасажирів' },
            { key: 'maintenance_expiry', label: 'Технічний огляд (ТО)' },
            { key: 'tachograph_expiry', label: 'Тахограф' },
            { key: 'fire_extinguisher_expiry', label: 'Вогнегасник' },
            { key: 'first_aid_expiry', label: 'Аптечка' },
        ];

        buses.forEach(bus => {
            documents.forEach(doc => {
                const expiryDateStr = bus[doc.key];

                // Skip if null (especially for tachograph)
                if (!expiryDateStr) return;

                const expiryDate = new Date(expiryDateStr);
                // Normalize time to midnight for accurate day calculation
                expiryDate.setHours(0, 0, 0, 0);

                const diffTime = expiryDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                const item = {
                    busId: bus.id,
                    plate: bus.plate_number,
                    model: bus.make_model,
                    docName: doc.label,
                    expiryDate: expiryDateStr,
                    days: diffDays,
                    bus: bus // full bus object for editing
                };

                if (diffDays < 0) {
                    critical.push(item);
                } else if (diffDays <= 7) {
                    warning.push(item);
                } else {
                    good.push(item);
                }
            });
        });

        // Sort by most urgent (lowest days first)
        critical.sort((a, b) => a.days - b.days);
        warning.sort((a, b) => a.days - b.days);

        return { critical, warning, good };
    }, [buses]);

    const filteredData = useMemo(() => {
        if (!searchTerm) return processedData;
        const lowerTerm = searchTerm.toLowerCase();

        const filterFn = (item) =>
            item.plate.toLowerCase().includes(lowerTerm) ||
            item.model.toLowerCase().includes(lowerTerm);

        return {
            critical: processedData.critical.filter(filterFn),
            warning: processedData.warning.filter(filterFn),
            good: processedData.good.filter(filterFn)
        };
    }, [processedData, searchTerm]);

    return (
        <div className="space-y-8">

            {/* Critical Section */}
            <section className="bg-red-50 rounded-lg border border-red-200 overflow-hidden animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="p-4 bg-red-100 border-b border-red-200 flex items-center gap-2">
                    <AlertCircle className="text-red-600" size={24} />
                    <h2 className="text-lg font-bold text-red-800">Критично (Прострочено)</h2>
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">{filteredData.critical.length}</span>
                </div>

                {filteredData.critical.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Немає прострочених документів. Чудова робота!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-red-200">
                            <thead className="bg-red-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Автобус</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Документ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Дата закінчення</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Статус</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase tracking-wider">Дія</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-red-100">
                                {filteredData.critical.map((item, idx) => (
                                    <tr key={`${item.busId}-${item.docName}-${idx}`} className="hover:bg-red-50 transition-colors transform hover:scale-[1.01] transition-all duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900 font-mono">{item.plate}</div>
                                            <div className="text-sm text-gray-500">{item.model}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.docName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">{item.expiryDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-red-600 font-bold">
                                            Прострочено на {Math.abs(item.days)} дн.
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => onEditBus(item.bus)}
                                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                                            >
                                                Виправити
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Warning Section */}
            <section className="bg-yellow-50 rounded-lg border border-yellow-200 overflow-hidden animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div className="p-4 bg-yellow-100 border-b border-yellow-200 flex items-center gap-2">
                    <AlertTriangle className="text-yellow-700" size={24} />
                    <h2 className="text-lg font-bold text-yellow-800">Увага (Закінчуються скоро)</h2>
                    <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">{filteredData.warning.length}</span>
                </div>

                {filteredData.warning.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Немає документів, що закінчуються найближчим часом.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-yellow-200">
                            <thead className="bg-yellow-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Автобус</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Документ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Дата закінчення</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Статус</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-yellow-800 uppercase tracking-wider">Дія</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-yellow-100">
                                {filteredData.warning.map((item, idx) => (
                                    <tr key={`${item.busId}-${item.docName}-${idx}`} className="hover:bg-yellow-50 transition-colors transform hover:scale-[1.01] transition-all duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900 font-mono">{item.plate}</div>
                                            <div className="text-sm text-gray-500">{item.model}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.docName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-yellow-700 font-medium">{item.expiryDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-yellow-700 font-bold">
                                            Залишилось {item.days} дн.
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => onEditBus(item.bus)}
                                                className="text-yellow-700 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-md transition-colors"
                                            >
                                                Оновити
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Good Section */}
            <section className="bg-green-50 rounded-lg border border-green-200 overflow-hidden animate-slideUp" style={{ animationDelay: '0.3s' }}>
                <div className="p-4 bg-green-100 border-b border-green-200 flex items-center gap-2">
                    <CheckCircle className="text-green-700" size={24} />
                    <h2 className="text-lg font-bold text-green-800">Дійсні документи</h2>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">{filteredData.good.length}</span>
                </div>

                {filteredData.good.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Немає дійсних документів.</div>
                ) : (
                    <div className="overflow-x-auto max-h-96">
                        <table className="min-w-full divide-y divide-green-200">
                            <thead className="bg-green-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Автобус</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Документ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Дата закінчення</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Статус</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-green-800 uppercase tracking-wider">Дія</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-green-100">
                                {filteredData.good.map((item, idx) => (
                                    <tr key={`${item.busId}-${item.docName}-${idx}`} className="hover:bg-green-50 transition-colors transform hover:scale-[1.01] transition-all duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900 font-mono">{item.plate}</div>
                                            <div className="text-sm text-gray-500">{item.model}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.docName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-green-700 font-medium">{item.expiryDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-green-700 font-bold">
                                            Дійсний ще {item.days} дн.
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => onEditBus(item.bus)}
                                                className="text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors"
                                            >
                                                Оновити
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ExpiryMonitor;
